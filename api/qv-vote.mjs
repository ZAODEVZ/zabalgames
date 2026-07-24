// ZABAL Gamez - quadratic vote for "who is best" (GET/POST /api/qv-vote).
//
// Model (see docs + the deep-research synthesis): each voter gets a fixed budget of
// voice credits per track; giving a candidate N votes costs N^2 credits, so with a
// 100-credit budget the most any single account can pour into one candidate is 10 votes
// (10^2 = 100). A candidate's score is the SUM of votes (the square root of credits),
// which is what stops a whale from buying the win. This is the canonical Weyl/Lalley
// quadratic-voting rule.
//
// Anti-gaming (practical, no MACI): quadratic cost defeats whales; sybil resistance is a
// SEPARATE layer - one ballot per Farcaster FID (Quick Auth), optionally gated by the
// Neynar user-quality score when NEYNAR_API_KEY is set (graceful FID-only fallback). One
// off vote per track, no reusable delegates. Individual ballots are never exposed; only
// aggregate per-candidate vote totals are read back.
//
//   POST { track, allocations: { <handle>: <votes 0..10>, ... } }  Authorization: Bearer <quick-auth-jwt>
//        -> { ok, counted, track, creditsUsed, yourVotes }   (re-voting overwrites your ballot)
//   GET  ?track=builder&results   -> { ok, configured, status, track, voters, results:[{handle, votes}] }
//   GET  ?status                  -> { ok, configured, status, tracks:{artist,builder,creator}:count }
//
// Storage (Upstash Redis over REST):
//   qv:ballots:<track>  HASH  <fid> -> JSON allocations   (private, never returned)
//   qv:tally:<track>    ZSET  handle -> total votes        (aggregate, public)
// No-ops to { configured:false } when KV is absent. Voting only accepts POSTs while the
// curated slate (data/vote-candidates.json) has status:"open".

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const NEYNAR = process.env.NEYNAR_API_KEY;
const SCORE_MIN = Number(process.env.QV_SCORE_MIN || '0.55');

const TRACKS = ['artist', 'builder', 'creator'];
const BUDGET = 100;      // voice credits per voter per track
const MAX_VOTES = 10;    // 10^2 = 100 = the whole budget on one candidate
const SLATE_URL = 'https://zabalgamez.com/data/vote-candidates.json';

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function json(body, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin || 'https://zabalgamez.com',
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

// Fetch the curated slate (status + valid handles per track). Cached at the edge briefly.
async function getSlate() {
  try {
    const r = await fetch(SLATE_URL, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return null;
    return await r.json();
  } catch { return null; }
}

function slateHandles(slate, track) {
  const list = (slate && slate.tracks && slate.tracks[track]) || [];
  const set = new Set();
  list.forEach((c) => { if (c && c.handle) set.add(String(c.handle).replace(/^@+/, '').toLowerCase()); });
  return set;
}

// Neynar user-quality score for a FID (0..1). Returns null when not configured / on error.
async function neynarScore(fid) {
  if (!NEYNAR) return null;
  try {
    const r = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${encodeURIComponent(fid)}`, {
      headers: { 'x-api-key': NEYNAR, 'accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    const j = await r.json();
    const u = j && j.users && j.users[0];
    if (!u) return null;
    const s = (u.score != null) ? u.score
      : (u.neynar_user_score != null) ? u.neynar_user_score
      : (u.experimental && u.experimental.neynar_user_score);
    return (typeof s === 'number') ? s : null;
  } catch { return null; }
}

export default async function handler(req) {
  const origin = req.headers.get('origin');
  const cors = ALLOWED_ORIGINS.has(origin) ? origin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': cors, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' } });

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false, status: 'unconfigured' }, cors);

  const url = new URL(req.url);

  // ---- GET: results / status (aggregate only) ----
  if (req.method === 'GET') {
    const slate = await getSlate();
    const status = (slate && slate.status) || 'preview';
    if (url.searchParams.has('results')) {
      const track = String(url.searchParams.get('track') || '');
      if (TRACKS.indexOf(track) < 0) return json({ ok: false, error: 'bad track' }, cors);
      try {
        const r = await kvPipeline([
          ['ZRANGE', `qv:tally:${track}`, '0', '-1', 'REV', 'WITHSCORES'],
          ['HLEN', `qv:ballots:${track}`],
        ]);
        const flat = (r[0] && r[0].result) || [];
        const results = [];
        for (let i = 0; i < flat.length; i += 2) results.push({ handle: flat[i], votes: Number(flat[i + 1]) });
        const voters = (r[1] && r[1].result) || 0;
        return json({ ok: true, configured: true, status, track, voters, results }, cors);
      } catch { return json({ ok: false, error: 'read failed' }, cors); }
    }
    // status summary
    try {
      const r = await kvPipeline(TRACKS.map((t) => ['HLEN', `qv:ballots:${t}`]));
      const tracks = {};
      TRACKS.forEach((t, i) => { tracks[t] = (r[i] && r[i].result) || 0; });
      return json({ ok: true, configured: true, status, tracks }, cors);
    } catch { return json({ ok: false, error: 'read failed' }, cors); }
  }

  // ---- POST: cast / change a ballot ----
  if (req.method === 'POST') {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ ok: false, error: 'sign in with Farcaster to vote' }, cors);
    let fid;
    try { fid = await verifyQuickAuth(token, DOMAIN); }
    catch { return json({ ok: false, error: 'invalid token' }, cors); }

    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: 'bad body' }, cors); }
    const track = String(body.track || '');
    if (TRACKS.indexOf(track) < 0) return json({ ok: false, error: 'bad track' }, cors);

    const slate = await getSlate();
    if (!slate) return json({ ok: false, error: 'candidate list unavailable' }, cors);
    if (slate.status !== 'open') return json({ ok: false, error: 'voting is not open yet' }, cors);
    const valid = slateHandles(slate, track);

    // Sybil gate: Neynar user-quality score, only when configured.
    const score = await neynarScore(fid);
    if (score != null && score < SCORE_MIN) return json({ ok: false, error: 'account does not meet the quality threshold to vote' }, cors);

    // Validate + normalize allocations: integer 0..MAX_VOTES per candidate, sum(votes^2) <= BUDGET.
    const alloc = body.allocations && typeof body.allocations === 'object' ? body.allocations : {};
    const next = {};
    let credits = 0;
    for (const k in alloc) {
      const h = String(k).replace(/^@+/, '').toLowerCase();
      if (!valid.has(h)) return json({ ok: false, error: 'unknown candidate: ' + h }, cors);
      const v = Math.floor(Number(alloc[k]));
      if (!Number.isFinite(v) || v < 0 || v > MAX_VOTES) return json({ ok: false, error: 'votes must be 0 to ' + MAX_VOTES }, cors);
      if (v > 0) { next[h] = v; credits += v * v; }
    }
    if (credits > BUDGET) return json({ ok: false, error: 'over budget: ' + credits + ' of ' + BUDGET + ' credits' }, cors);

    // Read the voter's previous ballot (private) and apply the per-candidate delta to the tally.
    try {
      const prevRes = await kvPipeline([['HGET', `qv:ballots:${track}`, String(fid)]]);
      let prev = {};
      const raw = prevRes[0] && prevRes[0].result;
      if (raw) { try { prev = JSON.parse(raw); } catch { prev = {}; } }

      const handles = new Set(Object.keys(prev).concat(Object.keys(next)));
      const cmds = [];
      handles.forEach((h) => {
        const delta = (next[h] || 0) - (prev[h] || 0);
        if (delta !== 0) cmds.push(['ZINCRBY', `qv:tally:${track}`, String(delta), h]);
      });
      cmds.push(['HSET', `qv:ballots:${track}`, String(fid), JSON.stringify(next)]);
      await kvPipeline(cmds);
      return json({ ok: true, counted: true, track, creditsUsed: credits, yourVotes: next }, cors);
    } catch { return json({ ok: false, error: 'write failed' }, cors); }
  }

  return json({ ok: false, error: 'method not allowed' }, cors);
}

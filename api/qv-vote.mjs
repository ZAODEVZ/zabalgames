// ZABAL Gamez - quadratic vote for "who is best" (GET/POST /api/qv-vote).
//
// Candidates are the LIVE submissions on the board (auto-accepted projects), grouped by
// track and keyed by submission id. There is no curated slate - everyone who submits is
// votable, and low-quality entries simply get no votes.
//
// Model: each voter gets a fixed budget of voice credits per track; giving a candidate N
// votes costs N^2 credits, so with a 100-credit budget the most any single account can
// pour into one candidate is 10 votes (10^2 = 100). A candidate's score is the SUM of
// votes (the square root of credits), which stops a whale from buying the win. Canonical
// Weyl/Lalley quadratic voting.
//
// Anti-gaming (no MACI): quadratic cost defeats whales; sybil resistance is a SEPARATE
// layer - one ballot per Farcaster FID (Quick Auth), optionally gated by the Neynar
// user-quality score when NEYNAR_API_KEY is set. Ballots are never exposed to other
// voters; only aggregate per-candidate totals are public, and a voter can read back
// their own ballot (below) so the client can restore it after a reload.
//
//   GET  ?candidates              -> { ok, configured, status, tracks:{artist,builder,creator}:[{id,name,handle,url}] }
//   GET  ?results&track=builder   -> { ok, configured, status, track, voters, results:[{id,name,handle,votes}] }
//   GET  ?status                  -> { ok, configured, status, tracks:{...}:voterCount }
//   GET  ?mine&track=builder      Authorization: Bearer <quick-auth-jwt>
//        -> { ok, track, allocations:{ <submissionId>: <votes> } }  (the caller's own ballot, {} if none yet)
//   POST { track, allocations:{ <submissionId>: <votes 0..10> } }  Authorization: Bearer <quick-auth-jwt>
//        -> { ok, counted, track, creditsUsed, yourVotes }         (re-voting overwrites your ballot)
//
// Storage (Upstash Redis over REST):
//   qv:ballots:<track>  HASH  <fid> -> JSON allocations   (private, never returned)
//   qv:tally:<track>    ZSET  <submissionId> -> total votes (aggregate, public)
// Candidates come from zabal:subs:approved (the board). Status (preview|open|closed) is
// the launch control in data/vote-candidates.json. No-ops to { configured:false } without KV.

import { verifyQuickAuth, verifyAdmin, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const NEYNAR = process.env.NEYNAR_API_KEY;
const SCORE_MIN = Number(process.env.QV_SCORE_MIN || '0.55');

const TRACKS = ['artist', 'builder', 'creator'];
const BUDGET = 100;      // voice credits per voter per track
const MAX_VOTES = 10;    // 10^2 = 100 = the whole budget on one candidate
const STATUS_URL = 'https://zabalgamez.com/data/vote-candidates.json'; // holds { status } only now
const MAX_CANDIDATES = 300;

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

// Voting status (preview|open|closed) lives in data/vote-candidates.json. Kept as the
// single launch control - flip it in a PR to open or close voting.
async function getStatus() {
  try {
    const r = await fetch(STATUS_URL, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return 'preview';
    const d = await r.json();
    return (d && d.status) || 'preview';
  } catch { return 'preview'; }
}

// QA fixtures seeded while the ballot itself was being tested. They are real rows on the
// board, so every consumer would otherwise show them - one was ranked #2 on the public
// artist standings. Filtered at the single source rather than in each page. The durable
// fix is deleting the rows from the board; until then this keeps them off every surface.
const EXCLUDED = new Set(['artist:5', 'creator:6']);

// Load the votable candidates - everything on the board, grouped by track. Two sources,
// merged and deduped: the curated/seed builders in data/builder-submissions.json (id
// "b:<handle>") and the live approved project submissions in KV (id = submission id).
// Returns { tracks, validByTrack }.
async function loadCandidates() {
  const tracks = { artist: [], builder: [], creator: [] };
  const validByTrack = { artist: new Set(), builder: new Set(), creator: new Set() };
  const clean = (s, n) => String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n || 100);
  function add(track, cand) {
    if (TRACKS.indexOf(track) < 0 || !cand.id) return;
    if (EXCLUDED.has(track + ':' + cand.id)) return;
    if (validByTrack[track].has(cand.id)) return;
    validByTrack[track].add(cand.id);
    tracks[track].push(cand);
  }

  // 1) Seed/curated builders from the repo - real candidates available immediately.
  try {
    const r = await fetch('https://zabalgamez.com/data/builder-submissions.json', { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      const doc = await r.json();
      (doc && doc.submissions || []).forEach((b) => {
        const track = String(b.track || '').toLowerCase().trim();
        const handle = String(b.builder || '').replace(/^@+/, '');
        if (!handle) return;
        const url = (b.farcaster && /^https?:\/\//i.test(b.farcaster)) ? b.farcaster : `https://farcaster.xyz/${handle}`;
        add(track, { id: 'b:' + handle.toLowerCase(), name: clean(b.name || handle), handle, url, builder: handle });
      });
    }
  } catch { /* seed unavailable - continue with KV submissions only */ }

  // 2) Live project submissions from the board. Read the full recent index (not just
  // the approved ZSET) and treat approved AND pending as votable: under auto-accept
  // everything is live, and submissions made BEFORE the auto-accept cutover are still
  // 'pending' with no approval step - they must show too. Moderation is delete-after.
  let ids = [];
  try {
    const r = await kvPipeline([['ZRANGE', 'zabal:subs:recent', '0', String(MAX_CANDIDATES - 1), 'REV']]);
    ids = (r[0] && r[0].result) || [];
  } catch { return { tracks, validByTrack }; }
  if (ids.length) {
    let rows = [];
    try {
      const r = await kvPipeline(ids.map((id) => ['GET', `zabal:sub:v1:${id}`]));
      rows = r.map((x) => x && x.result).filter(Boolean);
    } catch { return { tracks, validByTrack }; }
    for (const raw of rows) {
      let s;
      try { s = JSON.parse(raw); } catch { continue; }
      if (!s || (s.status !== 'approved' && s.status !== 'pending')) continue; // drafts/rejected are not votable
      const f = s.fields || {};
      const track = String(f.track || '').toLowerCase().trim();
      if (TRACKS.indexOf(track) < 0) continue; // only submissions with a real track are votable
      const id = String(s.id);
      const handle = s.handle ? String(s.handle).replace(/^@+/, '') : '';
      const url = (f.demoUrl && /^https?:\/\//i.test(f.demoUrl))
        ? f.demoUrl
        : `https://zabalgamez.com/submissions?id=${encodeURIComponent(id)}`;
      // builderName is the only person-identifier most submissions carry - a lot of them
      // have no Farcaster handle at all, so without this the standings list a project with
      // nobody attached to it.
      let builder = clean(f.builderName || (s.builder && s.builder.name) || '', 60);
      // Some entrants typed a profile URL into the name box. Show the handle, not the URL -
      // "https://x.com/Gesd01" is not a name anyone recognises on a standings row.
      const asUrl = builder.match(/^https?:\/\/[^\s]+?\/@?([A-Za-z0-9._-]+)\/?$/);
      if (asUrl) builder = asUrl[1];
      add(track, { id, name: clean(f.project || s.project || ('Project ' + id)), handle, url, builder });
    }
  }
  return { tracks, validByTrack };
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

  // ---- GET: candidates / results / status ----
  if (req.method === 'GET') {
    const status = await getStatus();

    if (url.searchParams.has('candidates')) {
      const { tracks } = await loadCandidates();
      return json({ ok: true, configured: true, status, tracks }, cors);
    }

    // The voter's own ballot for a track (private - requires their Quick Auth JWT).
    // Lets the client restore an already-cast ballot on reload instead of showing an
    // empty allocator, which otherwise looks like the vote was lost.
    if (url.searchParams.has('mine')) {
      const track = String(url.searchParams.get('track') || '');
      if (TRACKS.indexOf(track) < 0) return json({ ok: false, error: 'bad track' }, cors);
      const auth = req.headers.get('authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!token) return json({ ok: false, error: 'sign in with Farcaster' }, cors);
      let fid;
      try { fid = await verifyQuickAuth(token, DOMAIN); }
      catch { return json({ ok: false, error: 'invalid token' }, cors); }
      try {
        const r = await kvPipeline([['HGET', `qv:ballots:${track}`, String(fid)]]);
        const raw = r[0] && r[0].result;
        let allocations = {};
        if (raw) { try { allocations = JSON.parse(raw); } catch { allocations = {}; } }
        return json({ ok: true, track, allocations }, cors);
      } catch { return json({ ok: false, error: 'read failed' }, cors); }
    }

    if (url.searchParams.has('results')) {
      const track = String(url.searchParams.get('track') || '');
      if (TRACKS.indexOf(track) < 0) return json({ ok: false, error: 'bad track' }, cors);
      try {
        const { tracks } = await loadCandidates();
        const byId = {};
        (tracks[track] || []).forEach((c) => { byId[c.id] = c; });
        const r = await kvPipeline([
          ['ZRANGE', `qv:tally:${track}`, '0', '-1', 'REV', 'WITHSCORES'],
          ['HLEN', `qv:ballots:${track}`],
        ]);
        const flat = (r[0] && r[0].result) || [];
        const results = [];
        const tallied = new Set();
        for (let i = 0; i < flat.length; i += 2) {
          const id = flat[i];
          if (EXCLUDED.has(track + ':' + id)) continue; // tally rows outlive the candidate
          const c = byId[id] || {};
          tallied.add(id);
          results.push({ id, name: c.name || ('Project ' + id), handle: c.handle || '', builder: c.builder || '', url: c.url || '', votes: Number(flat[i + 1]) });
        }
        // The tally only holds entries that have received a vote, so a candidate on nobody's
        // ballot was dropping off the standings completely - they read as "not entered"
        // rather than "entered, no votes yet". Everyone who is votable is listed.
        (tracks[track] || []).forEach((c) => {
          if (tallied.has(c.id)) return;
          results.push({ id: c.id, name: c.name || ('Project ' + c.id), handle: c.handle || '', builder: c.builder || '', url: c.url || '', votes: 0 });
        });
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

    // Admin: wipe all ballots + tallies (clean slate for go-live or a new round).
    if (body.action === 'reset') {
      if (!(await verifyAdmin(req, DOMAIN)).ok) return json({ ok: false, error: 'forbidden' }, cors);
      try {
        await kvPipeline(TRACKS.flatMap((t) => [['DEL', `qv:ballots:${t}`], ['DEL', `qv:tally:${t}`]]));
      } catch { return json({ ok: false, error: 'reset failed' }, cors); }
      return json({ ok: true, reset: true }, cors);
    }

    const track = String(body.track || '');
    if (TRACKS.indexOf(track) < 0) return json({ ok: false, error: 'bad track' }, cors);

    const status = await getStatus();
    if (status !== 'open') return json({ ok: false, error: 'voting is not open yet' }, cors);

    const { validByTrack } = await loadCandidates();
    const valid = validByTrack[track];

    // Sybil gate: Neynar user-quality score, only when configured.
    const score = await neynarScore(fid);
    if (score != null && score < SCORE_MIN) return json({ ok: false, error: 'account does not meet the quality threshold to vote' }, cors);

    // Validate + normalize allocations: integer 0..MAX_VOTES per candidate id, sum(votes^2) <= BUDGET.
    const alloc = body.allocations && typeof body.allocations === 'object' ? body.allocations : {};
    const next = {};
    let credits = 0;
    for (const k in alloc) {
      const id = String(k).trim();
      if (!valid.has(id)) return json({ ok: false, error: 'unknown candidate: ' + id }, cors);
      const v = Math.floor(Number(alloc[k]));
      if (!Number.isFinite(v) || v < 0 || v > MAX_VOTES) return json({ ok: false, error: 'votes must be 0 to ' + MAX_VOTES }, cors);
      if (v > 0) { next[id] = v; credits += v * v; }
    }
    if (credits > BUDGET) return json({ ok: false, error: 'over budget: ' + credits + ' of ' + BUDGET + ' credits' }, cors);

    // Read the voter's previous ballot (private) and apply the per-candidate delta to the tally.
    try {
      const prevRes = await kvPipeline([['HGET', `qv:ballots:${track}`, String(fid)]]);
      let prev = {};
      const raw = prevRes[0] && prevRes[0].result;
      if (raw) { try { prev = JSON.parse(raw); } catch { prev = {}; } }

      const keys = new Set(Object.keys(prev).concat(Object.keys(next)));
      const cmds = [];
      keys.forEach((id) => {
        const delta = (next[id] || 0) - (prev[id] || 0);
        if (delta !== 0) cmds.push(['ZINCRBY', `qv:tally:${track}`, String(delta), id]);
      });
      cmds.push(['HSET', `qv:ballots:${track}`, String(fid), JSON.stringify(next)]);
      await kvPipeline(cmds);
      return json({ ok: true, counted: true, track, creditsUsed: credits, yourVotes: next }, cors);
    } catch { return json({ ok: false, error: 'write failed' }, cors); }
  }

  return json({ ok: false, error: 'method not allowed' }, cors);
}

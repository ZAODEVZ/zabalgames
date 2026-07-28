// ZABAL Gamez - August Finals qualifying standings (GET /api/standings).
//
// The weeks 1-2 qualifier surface. Everyone who submitted is ranked per track by a
// transparent two-part score, both parts shown so the ranking is auditable:
//   - daily-update points: one point per project per UTC day the builder posts a
//     progress update (recorded by the submissions `update` action; the SET dedupes to
//     one per day, which is the anti-farm lever).
//   - votes: the community quadratic ballot tally (qv:tally:<track>). One ballot per
//     Farcaster FID, N votes cost N^2 - the quadratic + one-per-FID model IS the sybil
//     guard, so there is no separate anti-gaming layer here.
// Each component is normalized to 0..100 within its own track, then combined by a config
// weight (default 50/50, env-tunable mid-season). The top N per track are marked as
// advancing to the battle weeks, capped to one finalist slot per builder so the two
// battlers in a track are two different people, not one builder's two projects.
//
//   GET /api/standings                 -> { ok, configured, phase, window, weights, finalistsPerTrack, tracks:{...} }
//   GET /api/standings?track=builder   -> the same shape, single track
//   GET /api/standings?format=empire   -> [{ address, score }] for an Empire Builder apiLeaderboard
//                                          (candidates with a wallet only; deduped by address, max score)
//
// Dates and weights are CONFIG, never hardcoded: data/season.json (the `finals` block),
// with FINALS_WEIGHT_UPDATES / FINALS_WEIGHT_VOTES env overrides for a no-deploy retune.
// Graceful no-op { configured:false } without KV.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

const TRACKS = ['artist', 'builder', 'creator'];
const MAX_CANDIDATES = 300;
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, origin, maxAge) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
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

function clean(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n || 120); }
function safeUrl(s) { try { const u = new URL(String(s || '')); return /^https?:$/.test(u.protocol) ? u.toString().slice(0, 500) : null; } catch { return null; } }

// Finals config from data/season.json, with env overrides for the weights so they can be
// retuned mid-season without a redeploy. Weights are normalized to sum to 1.
async function loadConfig(req) {
  let finals = {};
  try {
    const r = await fetch(new URL('/data/season.json', req.url), { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (r.ok) finals = (await r.json()).finals || {};
  } catch { /* fall back to defaults below */ }
  const sw = finals.scoreWeights || {};
  let wu = Number(process.env.FINALS_WEIGHT_UPDATES);
  let wv = Number(process.env.FINALS_WEIGHT_VOTES);
  if (!Number.isFinite(wu)) wu = Number(sw.updates);
  if (!Number.isFinite(wv)) wv = Number(sw.votes);
  if (!Number.isFinite(wu)) wu = 0.5;
  if (!Number.isFinite(wv)) wv = 0.5;
  const sum = wu + wv;
  const weights = sum > 0 ? { updates: wu / sum, votes: wv / sum } : { updates: 0.5, votes: 0.5 };
  return {
    window: {
      qualifyingStartDate: finals.qualifyingStartDate || null,
      qualifyingEndDate: finals.qualifyingEndDate || null,
      battleStartDate: finals.battleStartDate || null,
      battleEndDate: finals.battleEndDate || null,
    },
    weights,
    finalistsPerTrack: Math.max(1, Number(finals.finalistsPerTrack) || 2),
    oneSlotPerBuilder: finals.oneFinalistSlotPerBuilder !== false,
  };
}

// Derive the current phase label from the config dates and today (UTC). String compare is
// safe on YYYY-MM-DD. Phase is a label only - standings compute regardless of phase.
function phaseFor(win) {
  const today = new Date().toISOString().slice(0, 10);
  const { qualifyingStartDate: qs, qualifyingEndDate: qe, battleStartDate: bs, battleEndDate: be } = win;
  if (qs && today < qs) return 'pre';
  if (qs && qe && today >= qs && today <= qe) return 'qualifying';
  if (bs && be && today >= bs && today <= be) return 'battle';
  if (be && today > be) return 'post';
  return 'finals';
}

// Load candidates per track. Two sources, deduped by id, matching the qv-vote model so
// vote tallies (keyed by the same id) line up: seed builders from the repo (id b:<handle>)
// and live approved/pending project submissions from KV (id = submission id, with wallet).
async function loadCandidates(req) {
  const byTrack = { artist: [], builder: [], creator: [] };
  const seen = { artist: new Set(), builder: new Set(), creator: new Set() };
  function add(track, c) {
    if (TRACKS.indexOf(track) < 0 || !c.id || seen[track].has(c.id)) return;
    seen[track].add(c.id);
    byTrack[track].push(c);
  }

  // 1) Seed/curated builders (no wallet, no editable project - votes only).
  try {
    const r = await fetch(new URL('/data/builder-submissions.json', req.url), { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      const doc = await r.json();
      (doc.submissions || []).forEach((b) => {
        const handle = String(b.builder || '').replace(/^@+/, '').toLowerCase();
        const track = String(b.track || '').toLowerCase().trim();
        if (!handle || TRACKS.indexOf(track) < 0) return;
        const url = (b.farcaster && /^https?:\/\//i.test(b.farcaster)) ? b.farcaster : `https://farcaster.xyz/${handle}`;
        add(track, { id: 'b:' + handle, project: clean(b.name || handle, 160), handle, builderKey: 'h:' + handle, url: safeUrl(url), wallet: null, live: false, updatedTs: null });
      });
    }
  } catch { /* seed unavailable - continue with KV */ }

  // 2) Live project submissions from the board (approved + pending under auto-accept).
  let ids = [];
  try { const r = await kvPipeline([['ZRANGE', 'zabal:subs:recent', '0', String(MAX_CANDIDATES - 1), 'REV']]); ids = (r[0] && r[0].result) || []; }
  catch { return byTrack; }
  if (ids.length) {
    let rows = [];
    try { const r = await kvPipeline(ids.map((id) => ['GET', `zabal:sub:v1:${id}`])); rows = r.map((x) => x && x.result).filter(Boolean); }
    catch { return byTrack; }
    for (const raw of rows) {
      let s; try { s = JSON.parse(raw); } catch { continue; }
      if (!s || (s.status !== 'approved' && s.status !== 'pending')) continue;
      const f = s.fields || {};
      const track = String(f.track || '').toLowerCase().trim();
      if (TRACKS.indexOf(track) < 0) continue;
      const id = String(s.id);
      const handle = s.handle ? String(s.handle).replace(/^@+/, '').toLowerCase() : '';
      const builderKey = handle ? 'h:' + handle : (s.fid ? 'f:' + s.fid : 'p:' + id);
      const url = safeUrl(f.demoUrl) || `https://zabalgamez.com/submissions?id=${encodeURIComponent(id)}`;
      add(track, { id, project: clean(f.project || s.project || ('Project ' + id), 160), handle, builderKey, url, wallet: (s.wallet || null), live: true, updatedTs: s.updatedTs || s.ts || null });
    }
  }
  return byTrack;
}

// Count the update-days per live candidate that fall inside the qualifying window. Seed
// builders have no update-days key, so they score 0 on the updates component.
async function loadUpdateDays(liveIds, win) {
  const counts = {};
  liveIds.forEach((id) => { counts[id] = 0; });
  if (!liveIds.length) return counts;
  let res;
  try { res = await kvPipeline(liveIds.map((id) => ['SMEMBERS', `zabal:finals:updays:${id}`])); }
  catch { return counts; }
  const qs = win.qualifyingStartDate, qe = win.qualifyingEndDate;
  liveIds.forEach((id, i) => {
    const days = (res[i] && res[i].result) || [];
    counts[id] = days.filter((d) => (!qs || d >= qs) && (!qe || d <= qe)).length;
  });
  return counts;
}

// Read the aggregate quadratic vote tally + voter count per track.
async function loadVotes() {
  const votes = { artist: {}, builder: {}, creator: {} };
  const voters = { artist: 0, builder: 0, creator: 0 };
  let res;
  try { res = await kvPipeline(TRACKS.flatMap((t) => [['ZRANGE', `qv:tally:${t}`, '0', '-1', 'REV', 'WITHSCORES'], ['HLEN', `qv:ballots:${t}`]])); }
  catch { return { votes, voters }; }
  TRACKS.forEach((t, i) => {
    const flat = (res[i * 2] && res[i * 2].result) || [];
    for (let j = 0; j < flat.length; j += 2) votes[t][flat[j]] = Number(flat[j + 1]) || 0;
    voters[t] = (res[i * 2 + 1] && res[i * 2 + 1].result) || 0;
  });
  return { votes, voters };
}

// Rank one track: normalize each component to 0..100 within the track, combine by weight,
// sort, then mark finalists (top N, one slot per builder when configured).
function rankTrack(cands, votesById, updatesById, weights, finalistsPerTrack, oneSlotPerBuilder) {
  const rows = cands.map((c) => ({
    id: c.id, project: c.project, handle: c.handle, builderKey: c.builderKey, url: c.url,
    wallet: c.wallet, live: c.live, updatedTs: c.updatedTs,
    votes: Number(votesById[c.id] || 0), updateDays: Number(updatesById[c.id] || 0),
  }));
  const maxVotes = rows.reduce((m, r) => Math.max(m, r.votes), 0);
  const maxUpdates = rows.reduce((m, r) => Math.max(m, r.updateDays), 0);
  const round1 = (n) => Math.round(n * 10) / 10;
  rows.forEach((r) => {
    r.normVotes = maxVotes > 0 ? round1((r.votes / maxVotes) * 100) : 0;
    r.normUpdates = maxUpdates > 0 ? round1((r.updateDays / maxUpdates) * 100) : 0;
    r.score = round1(weights.updates * r.normUpdates + weights.votes * r.normVotes);
  });
  rows.sort((a, b) => b.score - a.score || b.votes - a.votes || b.updateDays - a.updateDays || (b.updatedTs || 0) - (a.updatedTs || 0));
  const finalists = new Set();
  const usedBuilders = new Set();
  for (const r of rows) {
    if (finalists.size >= finalistsPerTrack) break;
    if (oneSlotPerBuilder && usedBuilders.has(r.builderKey)) continue;
    finalists.add(r.id);
    usedBuilders.add(r.builderKey);
  }
  rows.forEach((r, i) => { r.rank = i + 1; r.finalist = finalists.has(r.id); });
  return rows;
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b, maxAge) => mkJson(b, origin, maxAge);

  if (req.method === 'OPTIONS') return json({ ok: true });
  if (req.method !== 'GET') return json({ ok: false, error: 'method' });

  const url = new URL(req.url);
  const cfg = await loadConfig(req);
  const phase = phaseFor(cfg.window);

  if (!KV_URL || !KV_TOKEN) {
    return json({ ok: true, configured: false, phase, window: cfg.window, weights: cfg.weights, finalistsPerTrack: cfg.finalistsPerTrack, tracks: {} });
  }

  let byTrack, votesData;
  try {
    byTrack = await loadCandidates(req);
    votesData = await loadVotes();
  } catch { return json({ ok: false, configured: true, error: 'read failed' }); }

  const liveIds = [];
  TRACKS.forEach((t) => byTrack[t].forEach((c) => { if (c.live) liveIds.push(c.id); }));
  const updatesById = await loadUpdateDays(liveIds, cfg.window);

  const onlyTrack = String(url.searchParams.get('track') || '').toLowerCase();
  const tracksToBuild = TRACKS.indexOf(onlyTrack) >= 0 ? [onlyTrack] : TRACKS;

  const out = {};
  tracksToBuild.forEach((t) => {
    const ranked = rankTrack(byTrack[t], votesData.votes[t], updatesById, cfg.weights, cfg.finalistsPerTrack, cfg.oneSlotPerBuilder);
    out[t] = {
      voters: votesData.voters[t] || 0,
      candidateCount: ranked.length,
      finalists: ranked.filter((r) => r.finalist).map((r) => r.id),
      candidates: ranked.map((r) => ({
        id: r.id, rank: r.rank, project: r.project, handle: r.handle || null, url: r.url,
        votes: r.votes, updateDays: r.updateDays,
        components: { votes: r.normVotes, updates: r.normUpdates },
        score: r.score, finalist: r.finalist, live: r.live,
      })),
    };
  });

  // Empire Builder apiLeaderboard shape: one row per wallet-bearing candidate, deduped by
  // address keeping the higher score. Address-less candidates are simply not in this feed.
  if (url.searchParams.get('format') === 'empire') {
    const byAddr = {};
    tracksToBuild.forEach((t) => {
      out[t].candidates.forEach((c) => {
        const cand = byTrack[t].find((x) => x.id === c.id);
        const addr = cand && cand.wallet ? String(cand.wallet).toLowerCase() : null;
        if (!addr) return;
        const s = Math.round(c.score);
        if (!(addr in byAddr) || s > byAddr[addr]) byAddr[addr] = s;
      });
    });
    return json(Object.keys(byAddr).map((address) => ({ address, score: byAddr[address] })), 60);
  }

  return json({ ok: true, configured: true, phase, window: cfg.window, weights: cfg.weights, finalistsPerTrack: cfg.finalistsPerTrack, tracks: out }, 20);
}

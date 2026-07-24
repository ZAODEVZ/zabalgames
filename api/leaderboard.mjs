// ZABAL Gamez leaderboard gateway (GET /api/leaderboard).
//
// The default response remains the registered ZAO 2048 apiLeaderboard contract. The
// public season page and /live use ?format=standings, which selects only real scoring:
// builder QV results when votes exist, otherwise the live Empire Builder /zabal board.
//
//   GET /api/leaderboard               -> Empire Builder apiLeaderboard: [{ address, score }]
//   GET /api/leaderboard?format=full   -> ZAO 2048 rows for arcade clients
//   GET /api/leaderboard?format=standings&limit=50
//        -> { ok, source, sourceLabel, scoreLabel, entries, qv }
//
// Source: zabal:game:all:zao2048 (written by api/game.mjs), addresses from zabal:game:addr.
// Empty array when KV is not configured.

import qvHandler from './qv-vote.mjs';
import empireHandler from './empire-leaderboard.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const GAME = 'zao2048';
const ALL_KEY = `zabal:game:all:${GAME}`;
const ADDR_KEY = 'zabal:game:addr';
const TOP_N = 200;

function json(body, maxAge = 15) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
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

function clamp(v, lo, hi, fallback) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
}

async function readJson(response) {
  try { return await response.json(); } catch { return null; }
}

async function readQv(req) {
  try {
    const url = new URL(req.url);
    url.pathname = '/api/qv-vote';
    url.search = '?track=builder&results=1';
    const response = await qvHandler(new Request(url, { method: 'GET', headers: req.headers }));
    return await readJson(response);
  } catch { return null; }
}

async function candidateMap(req) {
  try {
    const url = new URL('/data/vote-candidates.json', req.url);
    const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (!response.ok) return {};
    const doc = await response.json();
    const out = {};
    (((doc || {}).tracks || {}).builder || []).forEach((candidate) => {
      if (!candidate || !candidate.handle) return;
      out[String(candidate.handle).replace(/^@+/, '').toLowerCase()] = candidate;
    });
    return out;
  } catch { return {}; }
}

async function readEmpire(req, limit) {
  try {
    const url = new URL(req.url);
    url.pathname = '/api/empire-leaderboard';
    url.search = '?board=' + encodeURIComponent('/zabal') + '&limit=' + limit;
    const response = await empireHandler(new Request(url, { method: 'GET', headers: req.headers }));
    return await readJson(response);
  } catch { return null; }
}

async function seasonStandings(req, limit) {
  const qv = await readQv(req);
  const qvRows = qv && Array.isArray(qv.results) ? qv.results : [];

  // QV is the builder-specific result once real ballots exist. Candidate metadata only
  // adds audited names/profile links; rank and score always come from the live tally.
  if (qv && qv.ok && qv.configured && qvRows.length) {
    const candidates = await candidateMap(req);
    const entries = qvRows.slice(0, limit).map((row, index) => {
      const handle = String(row.handle || '').replace(/^@+/, '').toLowerCase();
      const candidate = candidates[handle] || {};
      return {
        rank: index + 1,
        username: handle,
        displayName: candidate.name || handle,
        score: Number(row.votes),
        profileUrl: candidate.url || (handle ? 'https://farcaster.xyz/' + handle : null),
        fid: null,
        pfpUrl: null,
      };
    });
    return {
      ok: true, configured: true, source: 'qv', sourceLabel: 'Builder QV ballot',
      scoreLabel: 'votes', status: qv.status || null, count: entries.length,
      entries, qv: { status: qv.status || null, voters: Number(qv.voters) || 0, results: qvRows.length },
    };
  }

  // Before the builder ballot has results, the real-time Empire board is the only
  // scored season source. Keep the QV status in the response so the UI can explain
  // why it is showing Empire points and switch automatically once ballots land.
  const empire = await readEmpire(req, limit);
  if (empire && empire.ok && empire.configured) {
    const entries = Array.isArray(empire.entries) ? empire.entries.slice(0, limit) : [];
    return {
      ok: true, configured: true, source: 'empire', sourceLabel: 'Empire Builder /zabal',
      scoreLabel: 'points', status: 'live', count: entries.length, entries,
      board: empire.board || null,
      qv: qv ? { status: qv.status || null, voters: Number(qv.voters) || 0, results: qvRows.length } : null,
    };
  }

  return {
    ok: true, configured: !!(qv && qv.configured), source: 'pending',
    sourceLabel: 'Builder standings', scoreLabel: 'points', status: (qv && qv.status) || 'pending',
    count: 0, entries: [],
    qv: qv ? { status: qv.status || null, voters: Number(qv.voters) || 0, results: qvRows.length } : null,
  };
}

export default async function handler(req) {
  const url = new URL(req.url);
  const format = url.searchParams.get('format') || '';
  if (format === 'standings') {
    return json(await seasonStandings(req, clamp(url.searchParams.get('limit'), 1, 100, 50)), 30);
  }
  const full = format === 'full';
  if (!KV_URL || !KV_TOKEN) return json([]);

  let flat = [];
  try {
    const res = await kvPipeline([['ZREVRANGE', ALL_KEY, '0', String(TOP_N - 1), 'WITHSCORES']]);
    flat = (res[0] && res[0].result) || [];
  } catch {
    return json([]);
  }
  // Until the all-time board fills (or if it is empty), fall back to this month's board.
  if (!flat.length) {
    try {
      const month = new Date().toISOString().slice(0, 7);
      const r2 = await kvPipeline([['ZREVRANGE', `zabal:game:${GAME}:${month}`, '0', String(TOP_N - 1), 'WITHSCORES']]);
      flat = (r2[0] && r2[0].result) || [];
    } catch { /* best effort */ }
  }
  const rows = [];
  for (let i = 0; i < flat.length; i += 2) rows.push({ handle: flat[i], score: Number(flat[i + 1]) });
  if (!rows.length) return json([]);

  // Resolve addresses for players who submitted one (so Empire can pay a wallet).
  let addrs = {};
  try {
    const ar = await kvPipeline([['HMGET', ADDR_KEY, ...rows.map((r) => r.handle)]]);
    const vals = (ar[0] && ar[0].result) || [];
    rows.forEach((r, i) => { if (vals[i]) addrs[r.handle] = vals[i]; });
  } catch { /* best effort */ }

  if (full) {
    return json(rows.map((r, i) => ({
      rank: i + 1,
      handle: r.handle,
      username: r.handle,
      score: r.score,
      address: addrs[r.handle] || null,
    })));
  }

  // Empire Builder apiLeaderboard: address + score only.
  return json(rows.filter((r) => addrs[r.handle]).map((r) => ({ address: addrs[r.handle], score: r.score })));
}

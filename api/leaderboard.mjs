// ZABAL Gamez - the ZAO 2048 leaderboard (GET /api/leaderboard).
//
// This is now the canonical ZAO 2048 leaderboard. It serves the cumulative ALL-TIME
// high scores (best-per-player) from the game, so a single URL can be registered in
// Empire Builder to reward the top players, and the same data drives the /leaderboard page.
//
//   GET /api/leaderboard               -> Empire Builder apiLeaderboard: [{ address, score }]
//                                         (players with a verified Base address only)
//   GET /api/leaderboard?format=full   -> [{ rank, handle, username, score, address }] for the page
//
// Source: zabal:game:all:zao2048 (written by api/game.mjs), addresses from zabal:game:addr.
// Empty array when KV is not configured.

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

export default async function handler(req) {
  const url = new URL(req.url);
  const full = url.searchParams.get('format') === 'full';
  if (!KV_URL || !KV_TOKEN) return json([]);

  let flat = [];
  try {
    const res = await kvPipeline([['ZREVRANGE', ALL_KEY, '0', String(TOP_N - 1), 'WITHSCORES']]);
    flat = (res[0] && res[0].result) || [];
  } catch {
    return json([]);
  }
  // Until the all-time board fills (or if it is empty), fall back to today's daily board.
  if (!flat.length) {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const r2 = await kvPipeline([['ZREVRANGE', `zabal:game:${GAME}:${today}`, '0', String(TOP_N - 1), 'WITHSCORES']]);
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

// ZABAL Gamez - mini-game leaderboards (GET/POST /api/game).
//
// Powers /play. Each game keeps a DAILY high-score board in a KV sorted set, so "top 10
// today win $ZABAL" is a clean, self-resetting competition. Best-score-per-player (ZADD GT).
//
//   POST /api/game   { game, handle, score, address? }  -> { ok, rank, best }
//   GET  /api/game?game=zao2048                          -> { ok, configured, game, date,
//                                                             entries:[{rank,handle,score,address}] }
//   GET  /api/game?game=zao2048&format=apiLeaderboard    -> [{ address, score }]   (Empire Builder)
//
// Empire Builder integration: register the apiLeaderboard URL above as a CUSTOM leaderboard
// in Empire Builder (one per game) and it will poll this endpoint to award empire points -
// the same pattern api/leaderboard.mjs already uses for social actions. Only players who
// submitted a wallet address appear in the apiLeaderboard format.
//
// Graceful no-op (configured:false / empty) when KV env is absent.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

// Allowlisted games (key -> max plausible score, to reject garbage submissions).
const GAMES = { zao2048: 1000000 };
const TOP_N = 50;
const DAY_TTL = 172800; // boards self-clean after 2 days

function json(body, maxAge = 0) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}, s-maxage=${maxAge}` : 'no-store',
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

function utcDate() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
}

function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}

function cleanAddress(a) {
  const s = String(a || '').trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });

  const url = new URL(req.url);
  const game = String(url.searchParams.get('game') || 'zao2048');
  if (!(game in GAMES)) return json({ ok: false, error: 'unknown game' });

  if (!KV_URL || !KV_TOKEN) {
    return req.method === 'POST'
      ? json({ ok: false, configured: false })
      : (url.searchParams.get('format') === 'apiLeaderboard' ? json([]) : json({ ok: true, configured: false, game, entries: [] }));
  }

  const date = utcDate();
  const key = `zabal:game:${game}:${date}`;
  const addrKey = `zabal:game:addr`;

  // ---- POST: submit a score ----
  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const handle = cleanHandle(body.handle);
    const address = cleanAddress(body.address);
    let score = Math.floor(Number(body.score));
    if (!handle) return json({ ok: false, error: 'handle required' });
    if (!Number.isFinite(score) || score < 0 || score > GAMES[game]) return json({ ok: false, error: 'bad score' });

    const cmds = [
      ['ZADD', key, 'GT', 'CH', String(score), handle],
      ['EXPIRE', key, String(DAY_TTL)],
      ['ZSCORE', key, handle],
      ['ZREVRANK', key, handle],
    ];
    if (address) cmds.push(['HSET', addrKey, handle, address]);
    let res;
    try { res = await kvPipeline(cmds); } catch { return json({ ok: false, error: 'kv' }); }
    const best = Number(res[2] && res[2].result) || score;
    const rank0 = res[3] && res[3].result;
    const rank = rank0 === null || rank0 === undefined ? null : Number(rank0) + 1;
    return json({ ok: true, best, rank });
  }

  // ---- GET: read the board ----
  let res;
  try {
    res = await kvPipeline([['ZREVRANGE', key, '0', String(TOP_N - 1), 'WITHSCORES']]);
  } catch {
    return json({ ok: true, configured: true, game, date, entries: [] });
  }
  const flat = (res[0] && res[0].result) || [];
  const rows = [];
  for (let i = 0; i < flat.length; i += 2) rows.push({ handle: flat[i], score: Number(flat[i + 1]) });

  const apiFormat = url.searchParams.get('format') === 'apiLeaderboard';
  if (apiFormat) {
    // Resolve addresses for the players who submitted one.
    let addrs = {};
    try {
      const hk = rows.map((r) => r.handle);
      if (hk.length) {
        const ar = await kvPipeline([['HMGET', addrKey, ...hk]]);
        const vals = (ar[0] && ar[0].result) || [];
        rows.forEach((r, i) => { if (vals[i]) addrs[r.handle] = vals[i]; });
      }
    } catch { /* best effort */ }
    return json(rows.filter((r) => addrs[r.handle]).map((r) => ({ address: addrs[r.handle], score: r.score })), 20);
  }

  return json({
    ok: true,
    configured: true,
    game,
    date,
    entries: rows.map((r, i) => ({ rank: i + 1, handle: r.handle, score: r.score })),
  }, 5);
}

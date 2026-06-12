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

import { verifyQuickAuth } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const DOMAIN = 'zabalgamez.com';

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
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
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

// Resolve a verified Farcaster profile (username + first verified eth address) for the
// apiLeaderboard format, so Empire Builder can award points to a real wallet.
async function resolveProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return {};
    const u = ((await r.json()).users || [])[0] || {};
    const eth = (u.verified_addresses && (u.verified_addresses.eth_addresses || u.verified_addresses.ethAddresses)) || [];
    return { username: u.username || null, address: cleanAddress(eth[0]) };
  } catch {
    return {};
  }
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
  const allKey = `zabal:game:all:${game}`;
  const addrKey = `zabal:game:addr`;

  // ---- POST: submit a score ----
  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    // Mini App path: a Quick Auth JWT identifies the player; we trust the FID and
    // resolve their handle + verified address. Web path: fall back to a typed handle.
    let handle, address = null, verified = false;
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token) {
      let fid;
      try { fid = await verifyQuickAuth(token, DOMAIN); }
      catch { return json({ ok: false, error: 'invalid token' }); }
      const profile = await resolveProfile(fid);
      handle = cleanHandle(profile.username) || ('fid' + fid);
      address = profile.address || null;
      verified = true;
    } else {
      handle = cleanHandle(body.handle);
      address = cleanAddress(body.address);
    }

    let score = Math.floor(Number(body.score));
    if (!handle) return json({ ok: false, error: 'handle required' });
    if (!Number.isFinite(score) || score < 0 || score > GAMES[game]) return json({ ok: false, error: 'bad score' });

    // Read the player's current best on BOTH the daily board and the cumulative all-time
    // board, then write a plain ZADD only where this score wins. We do NOT use ZADD GT
    // (some KV REST setups reject the flag and silently drop the write inside a 200).
    let curDaily = null, curAll = null;
    try {
      const pre = await kvPipeline([['ZSCORE', key, handle], ['ZSCORE', allKey, handle]]);
      if (pre[0] && pre[0].error) throw new Error(pre[0].error);
      if (pre[1] && pre[1].error) throw new Error(pre[1].error);
      curDaily = (pre[0] && pre[0].result != null) ? Number(pre[0].result) : null;
      curAll = (pre[1] && pre[1].result != null) ? Number(pre[1].result) : null;
    } catch { return json({ ok: false, error: 'kv' }); }

    const best = (curDaily == null) ? score : Math.max(curDaily, score);
    const cmds = [];
    if (curDaily == null || score > curDaily) { cmds.push(['ZADD', key, String(score), handle], ['EXPIRE', key, String(DAY_TTL)]); }
    if (curAll == null || score > curAll) { cmds.push(['ZADD', allKey, String(score), handle]); }
    if (address) cmds.push(['HSET', addrKey, handle, address]);
    if (cmds.length) {
      try {
        const w = await kvPipeline(cmds);
        for (const c of w) { if (c && c.error) throw new Error(c.error); }
      } catch { return json({ ok: false, error: 'kv-write' }); }
    }

    let rank = null;
    try {
      const rk = await kvPipeline([['ZREVRANK', key, handle]]);
      const r0 = rk[0] && rk[0].result;
      rank = (r0 == null) ? null : Number(r0) + 1;
    } catch { /* rank is best-effort */ }
    return json({ ok: true, best, rank, handle, verified });
  }

  // ---- GET: read the board ----
  // The page shows the DAILY board; Empire's apiLeaderboard polls the cumulative ALL-TIME
  // board so empire points do not reset every UTC day. Override with ?period=daily|alltime.
  const apiFormat = url.searchParams.get('format') === 'apiLeaderboard';
  const periodParam = url.searchParams.get('period');
  const period = periodParam === 'alltime' ? 'alltime' : periodParam === 'daily' ? 'daily' : (apiFormat ? 'alltime' : 'daily');
  const readKey = period === 'alltime' ? allKey : key;
  let res;
  try {
    res = await kvPipeline([['ZREVRANGE', readKey, '0', String(TOP_N - 1), 'WITHSCORES']]);
  } catch {
    return json({ ok: true, configured: true, game, date, period, entries: [] });
  }
  const flat = (res[0] && res[0].result) || [];
  const rows = [];
  for (let i = 0; i < flat.length; i += 2) rows.push({ handle: flat[i], score: Number(flat[i + 1]) });

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
    period,
    entries: rows.map((r, i) => ({ rank: i + 1, handle: r.handle, score: r.score })),
  });
}

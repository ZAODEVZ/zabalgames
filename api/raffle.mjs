// ZABAL Gamez - live raffle (GET/POST /api/raffle).
//
// A simple "collect to enter, then draw a winner" raffle for live events. Entries are a
// KV SET of handles (distinct), so re-entering is idempotent. Inside a Mini App the entry
// is verified (Quick Auth -> FID -> handle); on the web a typed handle is accepted.
//
//   POST /api/raffle { event?, handle? }                 -> { ok, count, entered:true }
//   POST /api/raffle { event?, action:'draw' }           -> { ok, winner, count }
//   GET  /api/raffle?event=wip-2026-06-11                 -> { ok, configured, event, count, entries[] }
//
// Draw is intended for the host. If ADMIN_KEY is set in env, draw requires ?key=...; if it
// is not set, draw is open (fine for a single live event). Graceful no-op without KV.

import { verifyQuickAuth } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const DOMAIN = 'zabalgamez.com';
const DEFAULT_EVENT = 'wip-2026-06-11';
const ENTRY_TTL = 259200; // 3 days

function json(body) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
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

function cleanEvent(e) {
  return String(e || DEFAULT_EVENT).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || DEFAULT_EVENT;
}
function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}
async function handleFromToken(token) {
  const fid = await verifyQuickAuth(token, DOMAIN);
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) {
      const u = ((await r.json()).users || [])[0] || {};
      if (u.username) return cleanHandle(u.username);
    }
  } catch { /* fall through */ }
  return 'fid' + fid;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);
  const event = cleanEvent(url.searchParams.get('event'));
  const key = `zabal:raffle:${event}`;

  if (!KV_URL || !KV_TOKEN) {
    return req.method === 'POST' ? json({ ok: false, configured: false }) : json({ ok: true, configured: false, event, count: 0, entries: [] });
  }

  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const ev = cleanEvent(body.event || event);
    const k = `zabal:raffle:${ev}`;
    const action = String(body.action || 'enter');

    // ---- draw a winner ----
    if (action === 'draw') {
      const adminKey = process.env.ADMIN_KEY;
      if (adminKey && url.searchParams.get('key') !== adminKey) return json({ ok: false, error: 'forbidden' });
      let res;
      try { res = await kvPipeline([['SRANDMEMBER', k], ['SCARD', k]]); } catch { return json({ ok: false, error: 'kv' }); }
      const winner = res[0] && res[0].result;
      const count = Number(res[1] && res[1].result) || 0;
      return json({ ok: true, winner: winner || null, count });
    }

    // ---- enter ----
    let handle;
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token) {
      try { handle = await handleFromToken(token); }
      catch { return json({ ok: false, error: 'invalid token' }); }
    } else {
      handle = cleanHandle(body.handle);
    }
    if (!handle) return json({ ok: false, error: 'handle required' });

    let res;
    try { res = await kvPipeline([['SADD', k, handle], ['EXPIRE', k, String(ENTRY_TTL)], ['SCARD', k]]); }
    catch { return json({ ok: false, error: 'kv' }); }
    return json({ ok: true, entered: true, handle, count: Number(res[2] && res[2].result) || 0 });
  }

  // ---- GET: list entries ----
  let res;
  try { res = await kvPipeline([['SCARD', key], ['SMEMBERS', key]]); }
  catch { return json({ ok: true, configured: true, event, count: 0, entries: [] }); }
  const count = Number(res[0] && res[0].result) || 0;
  const entries = ((res[1] && res[1].result) || []).slice(0, 200);
  return json({ ok: true, configured: true, event, count, entries });
}

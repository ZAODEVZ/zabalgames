// ZABAL Gamez - "pops" collectible + UGC capture (GET/POST /api/pops).
//
// A POAP-like, Web2, data-focused claim: who interacted with what, plus an optional UGC
// submission (a video link + their Farcaster handle) so we can see who engaged. Tagged by
// event so a single endpoint serves the season pop and event-specific ones (e.g. the WIP).
//
//   POST /api/pops { event?, videoUrl?, note?, handle? }  -> { ok, count, claimed:true }
//   GET  /api/pops?event=wip-2026-06-11                    -> { ok, configured, event, count, items[] }
//
// Inside a Mini App the claim is verified (Quick Auth -> FID -> handle); on the web a typed
// handle is accepted. Distinct claimers counted in a SET; submissions kept in a capped list.
// Graceful no-op without KV.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const DEFAULT_EVENT = 'wip-2026-06-11';
const FEED_MAX = 500;

// CORS: reflect a known ZABAL origin, never a blanket wildcard. Same-origin app calls are
// unaffected; this stops arbitrary third-party sites reading or inflating pops.
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
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

function cleanEvent(e) {
  return String(e || DEFAULT_EVENT).toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40) || DEFAULT_EVENT;
}
function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}
function cleanUrl(u) {
  const s = String(u || '').trim().slice(0, 400);
  return /^https?:\/\/[^\s]+$/i.test(s) ? s : null;
}
async function handleFromToken(token) {
  const fid = await verifyQuickAuth(token, DOMAIN);
  let username = null;
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) { const u = ((await r.json()).users || [])[0] || {}; username = u.username || null; }
  } catch { /* fall through */ }
  return { fid, handle: cleanHandle(username) || ('fid' + fid) };
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (body) => mkJson(body, origin);

  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);
  const event = cleanEvent(url.searchParams.get('event'));
  const claimersKey = `zabal:pops:${event}:claimers`;
  const feedKey = `zabal:pops:${event}:feed`;

  if (!KV_URL || !KV_TOKEN) {
    return req.method === 'POST' ? json({ ok: false, configured: false }) : json({ ok: true, configured: false, event, count: 0, items: [] });
  }

  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const ev = cleanEvent(body.event || event);
    const ck = `zabal:pops:${ev}:claimers`;
    const fk = `zabal:pops:${ev}:feed`;

    let handle, fid = null, verified = false;
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token) {
      try { const r = await handleFromToken(token); handle = r.handle; fid = r.fid; verified = true; }
      catch { return json({ ok: false, error: 'invalid token' }); }
    } else {
      handle = cleanHandle(body.handle);
    }
    if (!handle) return json({ ok: false, error: 'handle required' });

    const videoUrl = cleanUrl(body.videoUrl);
    // Strip control characters before storing - this is served back to other clients.
    const note = String(body.note || '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, 280);
    // Tag the record so callers can distinguish verified (Mini App) from web claims.
    const record = JSON.stringify({ handle, fid, verified, videoUrl, note, ts: Date.now() });

    let res;
    try {
      res = await kvPipeline([
        ['SADD', ck, handle],
        ['LPUSH', fk, record],
        ['LTRIM', fk, '0', String(FEED_MAX - 1)],
        ['SCARD', ck],
      ]);
    } catch { return json({ ok: false, error: 'kv' }); }
    return json({ ok: true, claimed: true, handle, verified, hasUgc: !!(videoUrl || note), count: Number(res[3] && res[3].result) || 0 });
  }

  // ---- GET: count + recent submissions ----
  let res;
  try { res = await kvPipeline([['SCARD', claimersKey], ['LRANGE', feedKey, '0', '49']]); }
  catch { return json({ ok: true, configured: true, event, count: 0, items: [] }); }
  const count = Number(res[0] && res[0].result) || 0;
  const items = ((res[1] && res[1].result) || []).map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
  return json({ ok: true, configured: true, event, count, items });
}

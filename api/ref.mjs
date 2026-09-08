// ZABAL Gamez - referral attribution (GET/POST /api/ref).
//
// Powers the share-to-grow loop. Share links carry ?ref=<handle>; when a referred player
// authenticates in the Mini App we credit the referrer once (idempotent, no self-referral).
//
//   POST /api/ref  { ref }   Authorization: Bearer <quick-auth-jwt>  -> { ok, credited }
//   GET  /api/ref?ref=zaal                                           -> { ok, ref, count }
//   GET  /api/ref?board=top&limit=50                                 -> { ok, entries:[{rank,handle,count}] }
//
// Storage: HSETNX ref:by <viewerFid> <ref> records who referred each player (first wins);
// SADD ref:made:<ref> <viewerFid> is the referrer's distinct credited set; ZINCRBY
// ref:board 1 <ref> keeps the top-referrers leaderboard (counts forward from first deploy).
// Graceful no-op without KV.

import { verifyQuickAuth, verifyAdmin, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';

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

function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}

async function usernameForFid(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) { const u = ((await r.json()).users || [])[0] || {}; return cleanHandle(u.username); }
  } catch { /* ignore */ }
  return '';
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);

  if (!KV_URL || !KV_TOKEN) {
    return req.method === 'POST' ? json({ ok: false, configured: false }) : json({ ok: true, configured: false, count: 0 });
  }

  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const ref = cleanHandle(body.ref);
    if (!ref) return json({ ok: false, error: 'no ref' });

    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ ok: false, error: 'no token' });
    let fid;
    try { fid = await verifyQuickAuth(token, DOMAIN); }
    catch { return json({ ok: false, error: 'invalid token' }); }

    // No self-referral.
    const me = await usernameForFid(fid);
    if (me && me === ref) return json({ ok: true, credited: false, reason: 'self' });

    let res;
    try {
      res = await kvPipeline([['HSETNX', 'zabal:ref:by', String(fid), ref]]);
    } catch { return json({ ok: false, error: 'kv' }); }
    const isNew = Number(res[0] && res[0].result) === 1;
    if (isNew) {
      // distinct credited set + the top-referrers board (both best-effort)
      try { await kvPipeline([['SADD', `zabal:ref:made:${ref}`, String(fid)], ['ZINCRBY', 'zabal:ref:board', '1', ref]]); } catch { /* best effort */ }
    }
    return json({ ok: true, credited: isNew });
  }

  // GET ?board=top: ADMIN ONLY as of 2026-09-08, and it reports SUBMITTERS alongside connects.
  // The recorded decision for Season 2 is an invisible referral - baked into normal sharing,
  // with no public leaderboard and no code to enter, because a public ref board breeds bots and
  // the number worth having is who actually submitted, not who connected.
  // Kept rather than deleted so Zaal can still read it; closed so nobody can farm against it.
  // Nothing rendered this board - grepped every html/js first, zero consumers.
  if (url.searchParams.get('board') === 'top') {
    const gate = await verifyAdmin(req, DOMAIN);
    if (!gate.ok) return json({ ok: false, error: 'unauthorized' });
    const limit = Math.min(200, Math.max(1, Number(url.searchParams.get('limit')) || 50));
    let rows = [];
    try {
      const r = await kvPipeline([['ZREVRANGE', 'zabal:ref:board', '0', String(limit - 1), 'WITHSCORES']]);
      const flat = (r[0] && r[0].result) || [];
      for (let i = 0; i < flat.length; i += 2) rows.push({ rank: rows.length + 1, handle: flat[i], connects: Number(flat[i + 1]) });
      // The metric that matters: distinct submissions attributed to each referrer.
      if (rows.length) {
        const counts = await kvPipeline(rows.map((r) => ['SCARD', `zabal:ref:submitters:${r.handle}`]));
        rows.forEach((r, i2) => { r.submitters = Number((counts[i2] && counts[i2].result) || 0); });
        rows.sort((a, b) => b.submitters - a.submitters || b.connects - a.connects);
        rows.forEach((r, i2) => { r.rank = i2 + 1; });
      }
    } catch { /* empty board */ }
    return json({ ok: true, configured: true, entries: rows, note: 'submitters is the real metric; connects is retained for comparison' });
  }

  // GET: how many a referrer has brought
  const ref = cleanHandle(url.searchParams.get('ref'));
  if (!ref) return json({ ok: true, count: 0 });
  let res;
  try { res = await kvPipeline([['SCARD', `zabal:ref:made:${ref}`]]); }
  catch { return json({ ok: true, ref, count: 0 }); }
  return json({ ok: true, ref, count: Number(res[0] && res[0].result) || 0 });
}

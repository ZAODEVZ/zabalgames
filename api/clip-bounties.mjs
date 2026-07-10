// ZABAL Gamez - per-recording clip-bounty registry (GET/POST /api/clip-bounties).
//
// assets/clip-bounty.js creates a real on-chain POIDH open bounty for a recording, but
// until now nothing remembered WHICH bounty belongs to WHICH recording - a viewer had to
// paste the poidh.xyz link/id by hand into assets/clip-claim.js (documented there as a
// v1 gap: "Auto-listing open bounties per recording is a follow-up"). This is that
// follow-up: a small KV-backed registry so the bounty a recording already has can be
// looked up instead of copy-pasted.
//
//   POST /api/clip-bounties { recId, bountyId, amountEth, txHash, from } + Quick Auth
//        -> { ok, bounty }
//   GET  /api/clip-bounties?rec=<recId>
//        -> { ok, configured, recId, bounties:[{bountyId, amountEth, txHash, from, handle, ts}] }
//
// Same shape + conventions as api/clips.mjs (Upstash Redis over /pipeline, Quick Auth on
// writes, public reads, CORS locked to the zabalgamez origins, no-op cleanly without KV
// env). Reads are the front door for assets/clip-claim.js and assets/clip-gallery.js to
// auto-detect a recording's bounty instead of requiring a manual paste.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

const B_PREFIX = 'zabal:clipbounties:v1:'; // + recId -> HASH bountyId -> bounty JSON

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, maxAge, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
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

// Same slug convention as api/clips.mjs / assets/clip-claim.js / assets/clip-gallery.js -
// the recording's path, slashes kept (e.g. "16", "fireside/1", "zao/1").
function cleanRecId(s) {
  return String(s || '').trim().replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9/_-]/g, '').slice(0, 64);
}
function cleanBountyId(b) {
  const s = String(b == null ? '' : b).trim();
  return /^\d{1,12}$/.test(s) ? s : null;
}
function cleanTx(t) {
  const s = String(t || '').trim().toLowerCase();
  return /^0x[0-9a-f]{64}$/.test(s) ? s : null;
}
function cleanAddress(a) {
  const s = String(a || '').trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}
function cleanAmount(a) {
  const n = Number(a);
  return isFinite(n) && n > 0 ? n : null;
}

async function readBounties(recId) {
  try {
    const r = await kvPipeline([['HGETALL', B_PREFIX + recId]]);
    const flat = (r[0] && r[0].result) || [];
    const out = [];
    for (let i = 0; i < flat.length; i += 2) {
      let b;
      try { b = JSON.parse(flat[i + 1]); } catch { continue; }
      if (!b || typeof b !== 'object') continue;
      out.push(b);
    }
    out.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    return out;
  } catch {
    return [];
  }
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (body, maxAge = 0) => mkJson(body, maxAge, origin);

  if (req.method === 'OPTIONS') return json({ ok: true });

  const url = new URL(req.url);

  // ---- GET reads (public) ----
  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false, bounties: [] });

    const recId = cleanRecId(url.searchParams.get('rec'));
    if (!recId) return json({ ok: false, error: 'rec required' });

    const bounties = await readBounties(recId);
    return json({ ok: true, configured: true, recId, bounties }, 15);
  }

  // ---- POST writes (Quick Auth required) ----
  if (req.method === 'POST') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, configured: false });
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ ok: false, reason: 'unverified' });
    let fid;
    try { fid = await verifyQuickAuth(token, DOMAIN); }
    catch { return json({ ok: false, error: 'invalid token' }); }

    const recId = cleanRecId(body.recId);
    if (!recId) return json({ ok: false, error: 'recId required' });
    const bountyId = cleanBountyId(body.bountyId);
    if (!bountyId) return json({ ok: false, error: 'bountyId required' });

    const bounty = {
      recId,
      bountyId,
      amountEth: cleanAmount(body.amountEth),
      txHash: cleanTx(body.txHash),
      from: cleanAddress(body.from),
      fid,
      ts: Date.now(),
    };

    try {
      const w = await kvPipeline([['HSET', B_PREFIX + recId, bountyId, JSON.stringify(bounty)]]);
      if (w[0] && w[0].error) throw new Error(w[0].error);
    } catch {
      return json({ ok: false, error: 'kv-write' });
    }

    return json({ ok: true, bounty });
  }

  return json({ ok: false, error: 'method' });
}

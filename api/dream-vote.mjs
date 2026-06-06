// ZABAL Gamez - dream-leads upvotes (GET counts, POST +1).
//
// Powers the "+1, I want them" demand signal on the /dream-leads board. The board
// itself is curated in data/dream-leads.json; this endpoint only holds the vote
// counts. A vote is one +1 per verified Farcaster FID per lead (Quick Auth JWT,
// same model as /api/join), so the demand signal cannot be spoofed or spammed.
//
// GET  /api/dream-vote            -> { configured, counts: { <id>: n } }   (open read)
// POST /api/dream-vote { id }     Authorization: Bearer <quick-auth-jwt>
//                                 -> { ok, id, count, firstVote }
//
// No-ops gracefully (configured:false / unconfigured) when KV env vars are absent.

export const config = { runtime: 'edge' };

import { verifyQuickAuth } from '../lib/auth.mjs';

const DOMAIN = 'zabalgamez.com';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const COUNTS_KEY = 'zabal:dreamvotes:v1';
const VOTERS_PREFIX = 'zabal:dreamvote:voters:v1:';

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
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

// Upstash HGETALL over REST returns a flat [field, value, field, value, ...] array.
function foldHash(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < arr.length - 1; i += 2) out[arr[i]] = Number(arr[i + 1]) || 0;
  return out;
}

const cleanId = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 48);

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);

  // Public read: the board's vote counts.
  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ configured: false, counts: {} }, 200, origin);
    try {
      const res = await kvPipeline([['HGETALL', COUNTS_KEY]]);
      return json({ configured: true, counts: foldHash(res?.[0]?.result) }, 200, origin);
    } catch (e) {
      return json({ configured: true, counts: {}, detail: e.message }, 502, origin);
    }
  }

  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, origin);

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'no token' }, 401, origin);

  let fid;
  try { fid = await verifyQuickAuth(token, DOMAIN); }
  catch (e) { return json({ error: 'invalid token', detail: e.message }, 401, origin); }

  let body = {};
  try { body = await req.json(); } catch {}
  const id = cleanId(body.id);
  if (!id) return json({ error: 'no id' }, 400, origin);

  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  // One +1 per FID per lead: SADD returns 1 only the first time this FID votes for
  // this id, and we increment the count only then (read-then-write, like /api/join).
  let firstVote = true;
  try {
    const pre = await kvPipeline([['SADD', VOTERS_PREFIX + id, String(fid)]]);
    firstVote = Number(pre?.[0]?.result || 0) === 1;
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502, origin);
  }

  let count;
  try {
    const res = await kvPipeline([firstVote ? ['HINCRBY', COUNTS_KEY, id, '1'] : ['HGET', COUNTS_KEY, id]]);
    count = Number(res?.[0]?.result || 0);
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502, origin);
  }

  return json({ ok: true, id, count, firstVote }, 200, origin);
}

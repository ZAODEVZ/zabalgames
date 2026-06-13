// ZABAL Gamez - per-recording comments + likes (Farcaster-verified).
//
// Lets Farcaster users (in the Mini App) leave a thought under any recording and
// like others' thoughts. Reading is public; writing requires a Quick Auth JWT, so a
// comment is always tied to a verified FID and a like is one per FID per comment
// (same trust model as /api/join and the vote endpoints).
//
// GET  /api/comments?id=<recId>          -> { configured, count, comments: [...] }  (open read)
// POST /api/comments  Authorization: Bearer <quick-auth-jwt>
//   { action: 'comment', id, text, username?, pfp? }  -> { ok, comment }
//   { action: 'like',    id, cid }                     -> { ok, likes, firstLike }
//
// recId is the recording's path (e.g. "recordings/1", "recordings/fireside/1").
// username/pfp are display-only and come from the caller's own authenticated Mini App
// profile; the FID (verified) is the identity anchor and the profile link uses it.
//
// No-ops gracefully (configured:false / unconfigured) when KV env vars are absent.

export const config = { runtime: 'edge' };

import { verifyQuickAuth } from '../lib/auth.mjs';

const DOMAIN = 'zabalgamez.com';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

const C_PREFIX = 'zabal:comments:v1:';            // + recId  -> HASH cid -> comment JSON
const LC_PREFIX = 'zabal:commentlikes:v1:';       // + recId  -> HASH cid -> like count
const LV_PREFIX = 'zabal:commentlike:voters:v1:'; // + cid    -> SET of fids

const MAX_TEXT = 500;
const MAX_COMMENTS = 2000; // per-recording abuse guard

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
function foldRaw(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < arr.length - 1; i += 2) out[arr[i]] = arr[i + 1];
  return out;
}

const cleanId = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9/_-]/g, '').replace(/^\/+|\/+$/g, '').slice(0, 64);
const cleanCid = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
const cleanHandle = (s) => String(s || '').replace(/^@+/, '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 32);
const cleanPfp = (u) => (/^https:\/\/[^\s"'<>]+$/i.test(String(u || '')) ? String(u).slice(0, 400) : '');
// Strip control characters (keep normal text, newlines, tabs), trim, cap length.
const cleanText = (t) => String(t == null ? '' : t).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, MAX_TEXT);

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);

  // Public read: a recording's comments + like counts.
  if (req.method === 'GET') {
    const id = cleanId(new URL(req.url).searchParams.get('id'));
    if (!KV_URL || !KV_TOKEN) return json({ configured: false, count: 0, comments: [] }, 200, origin);
    if (!id) return json({ error: 'no id' }, 400, origin);
    try {
      const res = await kvPipeline([['HGETALL', C_PREFIX + id], ['HGETALL', LC_PREFIX + id]]);
      const cmap = foldRaw(res?.[0]?.result);
      const lmap = foldRaw(res?.[1]?.result);
      const comments = [];
      Object.keys(cmap).forEach((cid) => {
        let c; try { c = JSON.parse(cmap[cid]); } catch (e) { return; }
        comments.push({ cid, fid: c.fid, username: c.username || '', pfp: c.pfp || '', text: c.text || '', ts: c.ts || 0, likes: Number(lmap[cid] || 0) });
      });
      comments.sort((a, b) => b.ts - a.ts);
      return json({ configured: true, count: comments.length, comments }, 200, origin);
    } catch (e) {
      return json({ configured: true, count: 0, comments: [], detail: e.message }, 502, origin);
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

  // Like: one +1 per FID per comment (SADD gates the increment, like /api/dream-vote).
  if (body.action === 'like') {
    const cid = cleanCid(body.cid);
    if (!cid) return json({ error: 'no cid' }, 400, origin);
    let firstLike = true;
    try {
      const pre = await kvPipeline([['SADD', LV_PREFIX + cid, String(fid)]]);
      firstLike = Number(pre?.[0]?.result || 0) === 1;
    } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
    let likes;
    try {
      const res = await kvPipeline([firstLike ? ['HINCRBY', LC_PREFIX + id, cid, '1'] : ['HGET', LC_PREFIX + id, cid]]);
      likes = Number(res?.[0]?.result || 0);
    } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
    return json({ ok: true, likes, firstLike }, 200, origin);
  }

  // Comment.
  const text = cleanText(body.text);
  if (!text) return json({ error: 'empty' }, 400, origin);
  try {
    const cap = await kvPipeline([['HLEN', C_PREFIX + id]]);
    if (Number(cap?.[0]?.result || 0) >= MAX_COMMENTS) return json({ ok: false, reason: 'full' }, 200, origin);
  } catch (e) { /* non-fatal - proceed */ }

  const ts = Date.now();
  const cid = ts.toString(36) + '-' + Number(fid).toString(36);
  const username = cleanHandle(body.username);
  const pfp = cleanPfp(body.pfp);
  const comment = { fid, username, pfp, text, ts };
  try {
    await kvPipeline([['HSET', C_PREFIX + id, cid, JSON.stringify(comment)]]);
  } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
  return json({ ok: true, comment: { cid, fid, username, pfp, text, ts, likes: 0 } }, 200, origin);
}

// ZABAL Gamez - community "what should get built" board (Farcaster-verified).
//
// The demand signal for July: anyone in the Mini App posts an idea for something the
// ZAO should build, and the community upvotes the ones they want to see. Reading is
// public; posting an idea and voting both require a Quick Auth JWT, so every idea is
// tied to a verified FID and a vote is one +1 per FID per idea (same trust model as
// /api/comments and /api/dream-vote). The author's own +1 is seeded on submit, so an
// idea starts at one vote and the author cannot double-vote it.
//
// GET  /api/build-ideas                    -> { configured, count, ideas: [...] }   (open read)
// POST /api/build-ideas  Authorization: Bearer <quick-auth-jwt>
//   { action: 'idea', title, text, track?, username?, pfp? } -> { ok, idea }
//   { action: 'vote', id }                                   -> { ok, id, count, firstVote }
//
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

const IDEAS_KEY = 'zabal:buildideas:v1';          // HASH iid -> idea JSON
const VOTES_KEY = 'zabal:buildideavotes:v1';      // HASH iid -> vote count
const VOTERS_PREFIX = 'zabal:buildideavote:voters:v1:'; // + iid -> SET of fids
const BYFID_KEY = 'zabal:buildideas:byfid:v1';    // HASH fid -> ideas posted (cap guard)

const TRACKS = new Set(['artist', 'builder', 'creator']);
const MAX_TITLE = 80;
const MAX_TEXT = 500;
const MAX_IDEAS = 1000;   // global abuse guard
const MAX_PER_FID = 8;    // one person cannot flood the board

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
function foldNum(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < arr.length - 1; i += 2) out[arr[i]] = Number(arr[i + 1]) || 0;
  return out;
}

const cleanId = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40);
const cleanHandle = (s) => String(s || '').replace(/^@+/, '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 32);
const cleanPfp = (u) => (/^https:\/\/[^\s"'<>]+$/i.test(String(u || '')) ? String(u).slice(0, 400) : '');
// Strip control characters (keep normal text, newlines, tabs), trim, cap length.
const cleanStr = (t, max) => String(t == null ? '' : t).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '').trim().slice(0, max);

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);

  // Public read: the board, ranked by votes.
  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ configured: false, count: 0, ideas: [] }, 200, origin);
    try {
      const res = await kvPipeline([['HGETALL', IDEAS_KEY], ['HGETALL', VOTES_KEY]]);
      const imap = foldRaw(res?.[0]?.result);
      const vmap = foldNum(res?.[1]?.result);
      const ideas = [];
      Object.keys(imap).forEach((iid) => {
        let i; try { i = JSON.parse(imap[iid]); } catch (e) { return; }
        ideas.push({
          id: iid, fid: i.fid, username: i.username || '', pfp: i.pfp || '',
          title: i.title || '', text: i.text || '', track: i.track || '',
          ts: i.ts || 0, votes: Number(vmap[iid] || 0),
        });
      });
      // Rank by votes; newest first as a stable tiebreak.
      ideas.sort((a, b) => b.votes - a.votes || b.ts - a.ts);
      return json({ configured: true, count: ideas.length, ideas }, 200, origin);
    } catch (e) {
      return json({ configured: true, count: 0, ideas: [], detail: e.message }, 502, origin);
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

  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  // Vote: one +1 per FID per idea (SADD gates the increment, like /api/dream-vote).
  if (body.action === 'vote') {
    const id = cleanId(body.id);
    if (!id) return json({ error: 'no id' }, 400, origin);
    let firstVote = true;
    try {
      const pre = await kvPipeline([['SADD', VOTERS_PREFIX + id, String(fid)]]);
      firstVote = Number(pre?.[0]?.result || 0) === 1;
    } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
    let count;
    try {
      const res = await kvPipeline([firstVote ? ['HINCRBY', VOTES_KEY, id, '1'] : ['HGET', VOTES_KEY, id]]);
      count = Number(res?.[0]?.result || 0);
    } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
    return json({ ok: true, id, count, firstVote }, 200, origin);
  }

  // Submit an idea.
  const title = cleanStr(body.title, MAX_TITLE);
  const text = cleanStr(body.text, MAX_TEXT);
  if (!title) return json({ error: 'empty' }, 400, origin);
  const track = TRACKS.has(body.track) ? body.track : '';

  // Per-FID flood guard + global cap (both non-fatal reads - proceed if they error).
  try {
    const guard = await kvPipeline([['HGET', BYFID_KEY, String(fid)], ['HLEN', IDEAS_KEY]]);
    if (Number(guard?.[0]?.result || 0) >= MAX_PER_FID) return json({ ok: false, reason: 'limit' }, 200, origin);
    if (Number(guard?.[1]?.result || 0) >= MAX_IDEAS) return json({ ok: false, reason: 'full' }, 200, origin);
  } catch (e) { /* non-fatal */ }

  const ts = Date.now();
  const iid = ts.toString(36) + '-' + Number(fid).toString(36);
  const username = cleanHandle(body.username);
  const pfp = cleanPfp(body.pfp);
  const idea = { fid, username, pfp, title, text, track, ts };
  try {
    // Store the idea, count it against this FID, and seed the author's own +1 so the
    // idea starts at one vote and the author is already in the voters set.
    await kvPipeline([
      ['HSET', IDEAS_KEY, iid, JSON.stringify(idea)],
      ['HINCRBY', BYFID_KEY, String(fid), '1'],
      ['SADD', VOTERS_PREFIX + iid, String(fid)],
      ['HSET', VOTES_KEY, iid, '1'],
    ]);
  } catch (e) { return json({ ok: false, detail: e.message }, 502, origin); }
  return json({ ok: true, idea: { id: iid, fid, username, pfp, title, text, track, ts, votes: 1 } }, 200, origin);
}

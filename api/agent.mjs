// ZABAL Gamez - agent gateway (token-authed programmatic access for builders).
//
// The GATE: a builder unlocks this only after a human approves their FIRST
// submission (api/submissions.mjs mints a per-builder token on approval). That
// manual first approval is the anti-bot wall - a connect that never ships a real,
// approved thing never gets a token, so the gateway can't be farmed. After that,
// the builder's own agent / MCP can pull their status and push new submissions.
//
//   GET  /api/agent                              Authorization: Bearer zg_...
//        -> { ok, builder:{handle}, submissions:[...], counts }            (PULL)
//   POST /api/agent { action:'submit', promptId, answer, fields?, url? }   (PUSH)
//        Authorization: Bearer zg_...
//        -> { ok, id, status:'pending' }   (attributed to the token's builder)
//   POST /api/agent { action:'claim' }           Authorization: Bearer <quick-auth-jwt>
//        -> { ok, token }   (a verified builder retrieves their own token in the Mini App)
//
// A token ONLY ever grants: read the holder's own submissions, create submissions
// attributed to the holder. Never admin, never another builder's data. Graceful
// no-op without KV.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const NOTIFY_URL = process.env.SUBMIT_NOTIFY_URL || '';
const MAX_AGENT_PER_HANDLE = 60; // generous cap; the token holder is already a proven builder

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function kv(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

const cleanSlug = (s, n) => String(s || '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, n || 40);
const cleanText = (s, n) => String(s == null ? '' : s).replace(/[<>]/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim().slice(0, n || 2000);
function cleanFields(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {}; let n = 0;
  for (const k of Object.keys(o)) { if (n++ >= 20) break; out[cleanSlug(k, 32)] = cleanText(o[k], 500); }
  return out;
}

// Resolve a Bearer agent token to its builder handle. The token is 128-bit
// random, so a direct key lookup is not enumerable; a missing key = no access.
async function builderForToken(req) {
  const auth = req.headers.get('authorization') || '';
  const tok = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';
  if (!tok || !/^zg_[0-9a-f]{32}$/.test(tok)) return null;
  try {
    const r = await kv([['GET', `zabal:agent:tok:${tok}`]]);
    const handle = r[0] && r[0].result;
    return handle ? { handle, token: tok } : null;
  } catch { return null; }
}

async function resolveProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return {};
    const u = ((await r.json()).users || [])[0] || {};
    return { username: u.username || null };
  } catch { return {}; }
}

async function notify(text) {
  if (!NOTIFY_URL) return;
  try { await fetch(NOTIFY_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }), signal: AbortSignal.timeout(2500) }); }
  catch { /* best effort */ }
}

// A builder's own view of one of their submissions (they may see their own pending/draft).
function ownView(s) {
  if (!s) return null;
  return { id: s.id, promptId: s.promptId, status: s.status, ts: s.ts, answer: s.answer || '', fields: s.fields || {} };
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false });

  // ---- claim: a verified builder retrieves their own token (Mini App / Quick Auth) ----
  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    if (body.action === 'claim') {
      const auth = req.headers.get('authorization') || '';
      const jwt = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      let fid = null;
      try { fid = await verifyQuickAuth(jwt, DOMAIN); } catch { return json({ ok: false, error: 'quick auth required' }, 401); }
      if (!fid) return json({ ok: false, error: 'quick auth required' }, 401);
      try {
        const byfid = await kv([['GET', `zabal:agent:byfid:${fid}`]]);
        let token = byfid[0] && byfid[0].result;
        if (!token) {
          // fall back to handle mapping if the approval had no fid on the submission
          const p = await resolveProfile(fid);
          const h = cleanSlug(p.username, 32);
          if (h) { const byh = await kv([['GET', `zabal:agent:by:${h}`]]); token = byh[0] && byh[0].result; }
        }
        if (!token) return json({ ok: false, error: 'no token yet - you unlock the agent gateway when your first submission is approved' }, 403);
        return json({ ok: true, token });
      } catch { return json({ ok: false, error: 'kv' }); }
    }

    // ---- push: create a submission attributed to the token's builder ----
    const b = await builderForToken(req);
    if (!b) return json({ ok: false, error: 'invalid or missing agent token' }, 401);

    if (body.action === 'submit') {
      const promptId = cleanSlug(body.promptId, 40) || 'build';
      const answer = cleanText(body.answer, 2000);
      const fields = cleanFields(body.fields);
      if (body.url) fields.url = cleanText(body.url, 500);
      if (!answer && !Object.keys(fields).length) return json({ ok: false, error: 'answer or fields required' });

      try {
        const cnt = await kv([['SCARD', `zabal:subs:byhandle:${b.handle}`]]);
        if (Number((cnt[0] && cnt[0].result) || 0) >= MAX_AGENT_PER_HANDLE) return json({ ok: false, reason: 'limit' });
      } catch { /* ignore */ }

      let id;
      try { const r = await kv([['INCR', 'zabal:subs:counter']]); id = String((r[0] && r[0].result) || Date.now()); }
      catch { return json({ ok: false, error: 'kv' }); }

      const sub = { id, promptId, answer, fields, handle: b.handle, fid: null, pfp: null, status: 'pending', source: 'agent', ts: Date.now() };
      try {
        await kv([
          ['SET', `zabal:sub:v1:${id}`, JSON.stringify(sub)],
          ['ZADD', 'zabal:subs:recent', String(sub.ts), id],
          ['SADD', 'zabal:subs:bystatus:pending', id],
          ['SADD', `zabal:subs:byhandle:${b.handle}`, id],
        ]);
      } catch { return json({ ok: false, error: 'kv-write' }); }
      await notify(`Agent submission #${id} on "${promptId}" from @${b.handle} - review it.`);
      return json({ ok: true, id, status: 'pending' });
    }

    return json({ ok: false, error: 'unknown action' });
  }

  // ---- pull: the builder's own status + submissions ----
  if (req.method === 'GET') {
    const b = await builderForToken(req);
    if (!b) return json({ ok: false, error: 'invalid or missing agent token' }, 401);
    let ids = [];
    try { const r = await kv([['SMEMBERS', `zabal:subs:byhandle:${b.handle}`]]); ids = (r[0] && r[0].result) || []; }
    catch { return json({ ok: true, builder: { handle: b.handle }, submissions: [] }); }
    ids = ids.slice(0, 100);
    const subs = [];
    if (ids.length) {
      try {
        const r = await kv(ids.map((i) => ['GET', `zabal:sub:v1:${i}`]));
        r.forEach((row) => { if (row && row.result) { try { subs.push(ownView(JSON.parse(row.result))); } catch { /* skip */ } } });
      } catch { /* partial */ }
    }
    subs.sort((a, x) => (x.ts || 0) - (a.ts || 0));
    const counts = subs.reduce((m, s) => { m[s.status] = (m[s.status] || 0) + 1; return m; }, {});
    return json({ ok: true, builder: { handle: b.handle }, submissions: subs, counts });
  }

  return json({ ok: false, error: 'method' });
}

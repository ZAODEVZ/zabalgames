// ZABAL Gamez - on-site submissions (GET/POST /api/submissions).
//
// The site is the source of truth for UGC + builder submissions (see
// docs/submission-system-spec.md). A submission is stored pending; a notify hook fires so
// ZOE/Zaal can triage; an admin approves; approval is what unlocks the Unlock collectible
// airdrop. Permalinks render approved submissions at /submissions/<id>.
//
//   POST /api/submissions { promptId, answer, fields?, handle?, email?, wallet?, draft? }  (+ optional Quick Auth)
//        -> { ok, id, status, editToken? }     (pending, or a public WIP draft; notify hook fired)
//   GET  /api/submissions?id=<id>              -> { ok, submission }  (approved/draft = public; pending = minimal)
//   GET  /api/submissions?feed=recent&limit=30 -> { ok, submissions:[...] }  (approved only, public)
//   GET  /api/submissions?feed=drafts&limit=30 -> { ok, submissions:[...] }  (public WIP drafts)
//   POST /api/submissions { action:'publish', id, editToken? }  (+ Quick Auth) -> { ok, id, status }
//        (draft -> pending; owner only: verified FID match or the editToken returned at creation)
//   GET  /api/submissions?status=pending       + admin -> { ok, queue:[...] }  (review queue)
//   POST /api/submissions { action:'approve'|'reject', id }  + admin -> { ok, id, status }
//
// Admin = Authorization: Bearer <ADMIN_KEY> (constant-time, fail closed - same as raffle/daily-cast).
// Quick Auth on submit is optional; when present it binds the submission to a verified FID/handle
// (needed later for the one-per-identity collectible gate). Graceful no-op without KV.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';
import { RateLimiter } from '../lib/rate-limit.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const NOTIFY_URL = process.env.SUBMIT_NOTIFY_URL || ''; // optional Telegram/webhook for new-submission alerts
const HAATZ = 'https://haatz.quilibrium.com';

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const MAX_PER_FID = 30; // soft anti-spam cap on submissions per verified person
const limiter = new RateLimiter(KV_URL, KV_TOKEN);

function mkJson(body, origin, maxAge) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
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

// Constant-time admin check (XOR-accumulate, never short-circuit; fail closed without the key).
function adminOk(req) {
  if (!ADMIN_KEY) return false;
  const auth = req.headers.get('authorization') || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  let diff = provided.length ^ ADMIN_KEY.length;
  for (let i = 0; i < Math.max(provided.length, ADMIN_KEY.length); i++) {
    diff |= (provided.charCodeAt(i) || 0) ^ (ADMIN_KEY.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function cleanSlug(s, n) { return String(s || '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, n || 40); }
function cleanText(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim().slice(0, n || 2000); }
function cleanEmail(s) { const v = String(s || '').trim(); return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(v) ? v.slice(0, 320) : null; }
function cleanWallet(s) { const v = String(s || '').trim().toLowerCase(); return /^0x[0-9a-f]{40}$/.test(v) ? v : null; }
function cleanFields(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {}; let n = 0;
  for (const k of Object.keys(o)) {
    if (n++ >= 20) break;
    out[cleanSlug(k, 32)] = cleanText(o[k], 500);
  }
  return out;
}

async function resolveProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return {};
    const u = ((await r.json()).users || [])[0] || {};
    return { username: u.username || null, pfp: u.pfp_url || null };
  } catch { return {}; }
}

async function notify(text) {
  if (!NOTIFY_URL) return;
  try {
    await fetch(NOTIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(2500),
    });
  } catch { /* best-effort alert, never blocks the submission */ }
}

// Public-safe view of a submission (no raw email/wallet/editToken; pending shows minimal).
// Drafts are PUBLIC by design - a WIP others can read and comment on before it is finished.
function publicView(s) {
  if (!s) return null;
  const base = { id: s.id, promptId: s.promptId, handle: s.handle || null, status: s.status, ts: s.ts };
  if (s.status !== 'approved' && s.status !== 'draft') return base;
  return { ...base, answer: s.answer || '', fields: s.fields || {}, profile: s.profile || null };
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b, maxAge) => mkJson(b, origin, maxAge);

  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);

  // ---------- GET reads ----------
  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false, submissions: [] });

    // admin review queue
    if (url.searchParams.get('status') === 'pending') {
      if (!adminOk(req)) return json({ ok: false, error: 'forbidden' });
      let ids = [];
      try { const r = await kvPipeline([['SMEMBERS', 'zabal:subs:bystatus:pending']]); ids = (r[0] && r[0].result) || []; }
      catch { return json({ ok: true, queue: [] }); }
      ids = ids.slice(0, 200);
      const queue = [];
      if (ids.length) {
        try {
          const r = await kvPipeline(ids.map((id) => ['GET', `zabal:sub:v1:${id}`]));
          r.forEach((row) => { if (row && row.result) { try { queue.push(JSON.parse(row.result)); } catch { /* skip */ } } });
        } catch { /* partial */ }
      }
      queue.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      return json({ ok: true, configured: true, queue });
    }

    // single submission permalink
    const id = cleanSlug(url.searchParams.get('id'), 24);
    if (id) {
      let s = null;
      try { const r = await kvPipeline([['GET', `zabal:sub:v1:${id}`]]); if (r[0] && r[0].result) s = JSON.parse(r[0].result); }
      catch { /* none */ }
      if (!s) return json({ ok: false, error: 'not found' });
      return json({ ok: true, submission: publicView(s) }, s.status === 'approved' ? 30 : 0);
    }

    // public WIP drafts feed - open builds people can comment on while in progress
    if (url.searchParams.get('feed') === 'drafts') {
      const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit')) || 30));
      let ids = [];
      try { const r = await kvPipeline([['ZREVRANGE', 'zabal:subs:drafts', '0', String(limit - 1)]]); ids = (r[0] && r[0].result) || []; }
      catch { return json({ ok: true, configured: true, submissions: [] }); }
      const out = [];
      if (ids.length) {
        try {
          const r = await kvPipeline(ids.map((id2) => ['GET', `zabal:sub:v1:${id2}`]));
          r.forEach((row) => { if (row && row.result) { try { const d = JSON.parse(row.result); if (d.status === 'draft') out.push(publicView(d)); } catch { /* skip */ } } });
        } catch { /* partial */ }
      }
      return json({ ok: true, configured: true, submissions: out.filter(Boolean) }, 10);
    }

    // public recent feed (approved only)
    if (url.searchParams.get('feed') === 'recent') {
      const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit')) || 30));
      let ids = [];
      try { const r = await kvPipeline([['ZREVRANGE', 'zabal:subs:approved', '0', String(limit - 1)]]); ids = (r[0] && r[0].result) || []; }
      catch { return json({ ok: true, configured: true, submissions: [] }); }
      const out = [];
      if (ids.length) {
        try {
          const r = await kvPipeline(ids.map((id2) => ['GET', `zabal:sub:v1:${id2}`]));
          r.forEach((row) => { if (row && row.result) { try { out.push(publicView(JSON.parse(row.result))); } catch { /* skip */ } } });
        } catch { /* partial */ }
      }
      return json({ ok: true, configured: true, submissions: out.filter(Boolean) }, 20);
    }

    return json({ ok: false, error: 'bad request' });
  }

  // ---------- POST writes ----------
  if (req.method === 'POST') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, configured: false });
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    // admin moderation
    if (body.action === 'approve' || body.action === 'reject') {
      if (!adminOk(req)) return json({ ok: false, error: 'forbidden' });
      const id = cleanSlug(body.id, 24);
      if (!id) return json({ ok: false, error: 'id required' });
      let s = null;
      try { const r = await kvPipeline([['GET', `zabal:sub:v1:${id}`]]); if (r[0] && r[0].result) s = JSON.parse(r[0].result); }
      catch { return json({ ok: false, error: 'kv' }); }
      if (!s) return json({ ok: false, error: 'not found' });
      const prev = s.status;
      s.status = body.action === 'approve' ? 'approved' : 'rejected';
      s.reviewedTs = Date.now();
      const cmds = [
        ['SET', `zabal:sub:v1:${id}`, JSON.stringify(s)],
        ['SREM', `zabal:subs:bystatus:${prev}`, id],
        ['SADD', `zabal:subs:bystatus:${s.status}`, id],
      ];
      if (s.status === 'approved') cmds.push(['ZADD', 'zabal:subs:approved', String(s.ts || Date.now()), id]);
      else cmds.push(['ZREM', 'zabal:subs:approved', id]);
      try { await kvPipeline(cmds); } catch { return json({ ok: false, error: 'kv-write' }); }
      // First approval unlocks the agent gateway: mint a per-builder token (idempotent)
      // so their agent/MCP can pull + push once a human has cleared their first real
      // submission. The human approval IS the anti-bot gate. Token = 128-bit random.
      let agentToken = null;
      if (s.status === 'approved' && s.handle) {
        try {
          const bk = `zabal:agent:by:${s.handle}`;
          const got = await kvPipeline([['GET', bk]]);
          agentToken = (got[0] && got[0].result) || null;
          if (!agentToken) {
            agentToken = 'zg_' + Array.from(crypto.getRandomValues(new Uint8Array(16))).map((b) => b.toString(16).padStart(2, '0')).join('');
            const mint = [
              ['SET', `zabal:agent:tok:${agentToken}`, s.handle],
              ['SET', bk, agentToken],
            ];
            if (s.fid) mint.push(['SET', `zabal:agent:byfid:${s.fid}`, agentToken]);
            await kvPipeline(mint);
          }
        } catch { /* token mint is best-effort; approval still succeeds */ }
      }
      // approval is the trigger for the Unlock airdrop - flag it for the airdrop runbook/automation
      if (s.status === 'approved') await notify(`APPROVED submission #${id} (${s.promptId}) - airdrop the collectible to ${s.wallet || s.email || s.handle || 'them'}.${agentToken ? ' Agent token for @' + s.handle + ': ' + agentToken : ''}`);
      return json({ ok: true, id, status: s.status, agentToken });
    }

    // owner promotes a WIP draft into the review queue
    if (body.action === 'publish') {
      const id = cleanSlug(body.id, 24);
      if (!id) return json({ ok: false, error: 'id required' });
      let s = null;
      try { const r = await kvPipeline([['GET', `zabal:sub:v1:${id}`]]); if (r[0] && r[0].result) s = JSON.parse(r[0].result); }
      catch { return json({ ok: false, error: 'kv' }); }
      if (!s) return json({ ok: false, error: 'not found' });
      if (s.status !== 'draft') return json({ ok: false, error: 'not a draft' });
      // Ownership: verified FID match, or the editToken handed back at creation.
      let owner = false;
      const auth2 = req.headers.get('authorization') || '';
      const token2 = auth2.startsWith('Bearer ') ? auth2.slice(7) : '';
      if (token2) {
        try { const fid2 = await verifyQuickAuth(token2, DOMAIN); if (s.fid && fid2 === s.fid) owner = true; } catch { /* not owner */ }
      }
      if (!owner && s.editToken && body.editToken && String(body.editToken) === s.editToken) owner = true;
      if (!owner) return json({ ok: false, error: 'forbidden' });
      s.status = 'pending';
      s.publishedTs = Date.now();
      try {
        await kvPipeline([
          ['SET', `zabal:sub:v1:${id}`, JSON.stringify(s)],
          ['SREM', 'zabal:subs:bystatus:draft', id],
          ['SADD', 'zabal:subs:bystatus:pending', id],
          ['ZREM', 'zabal:subs:drafts', id],
        ]);
      } catch { return json({ ok: false, error: 'kv-write' }); }
      await notify(`Draft #${id} (${s.promptId}) published for review${s.handle ? ' by @' + s.handle : ''}.`);
      return json({ ok: true, id, status: 'pending' });
    }

    // ---- create a submission ----
    // Rate-limit anonymous submissions: 5 per minute, 30 per hour.
    const ip = RateLimiter.getClientIp(req);
    const allowed = await limiter.checkLimit(ip, 'submit', { perMinute: 5, perHour: 30 });
    if (!allowed) return json({ ok: false, reason: 'limit' });

    const promptId = cleanSlug(body.promptId, 40);
    const answer = cleanText(body.answer, 2000);
    if (!promptId) return json({ ok: false, error: 'promptId required' });
    if (!answer && !body.fields) return json({ ok: false, error: 'answer required' });

    // optional Quick Auth binds a verified FID/handle (for the one-per-identity gate later)
    let fid = null, handle = cleanSlug(body.handle, 32) || null, pfp = null;
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token) {
      try {
        fid = await verifyQuickAuth(token, DOMAIN);
        const p = await resolveProfile(fid);
        handle = cleanSlug(p.username, 32) || handle || ('fid' + fid);
        pfp = p.pfp || null;
      } catch { /* unverified - treat as anonymous submission */ }
    }

    // soft per-person cap
    if (fid) {
      try {
        const c = await kvPipeline([['GET', `zabal:subs:byfid:${fid}`]]);
        if (Number((c[0] && c[0].result) || 0) >= MAX_PER_FID) return json({ ok: false, reason: 'limit' });
      } catch { /* ignore */ }
    }

    let id;
    try { const r = await kvPipeline([['INCR', 'zabal:subs:counter']]); id = String((r[0] && r[0].result) || Date.now()); }
    catch { return json({ ok: false, error: 'kv' }); }

    // draft:true stores a public WIP others can read + comment on; the creator gets an
    // editToken back so they can publish it into review later (verified FID also works).
    const isDraft = body.draft === true;
    const editToken = isDraft ? crypto.randomUUID() : null;
    const sub = {
      id, promptId, answer,
      fields: cleanFields(body.fields),
      handle, fid, pfp,
      email: cleanEmail(body.email),
      wallet: cleanWallet(body.wallet),
      status: isDraft ? 'draft' : 'pending',
      ts: Date.now(),
    };
    if (editToken) sub.editToken = editToken;
    const cmds = [
      ['SET', `zabal:sub:v1:${id}`, JSON.stringify(sub)],
      ['ZADD', 'zabal:subs:recent', String(sub.ts), id],
      ['SADD', `zabal:subs:bystatus:${sub.status}`, id],
    ];
    if (isDraft) cmds.push(['ZADD', 'zabal:subs:drafts', String(sub.ts), id]);
    if (fid) cmds.push(['INCR', `zabal:subs:byfid:${fid}`]);
    if (handle) cmds.push(['SADD', `zabal:subs:byhandle:${handle}`, id]); // lets the agent gateway list a builder's own submissions
    try { await kvPipeline(cmds); } catch { return json({ ok: false, error: 'kv-write' }); }

    await notify(isDraft
      ? `New WIP draft #${id} on "${promptId}"${handle ? ' from @' + handle : ''} - public at /submissions?id=${id}.`
      : `New ZABAL Gamez submission #${id} on "${promptId}"${handle ? ' from @' + handle : ''} - review it.`);
    const resp = { ok: true, id, status: sub.status };
    if (editToken) resp.editToken = editToken;
    return json(resp);
  }

  return json({ ok: false, error: 'method' });
}

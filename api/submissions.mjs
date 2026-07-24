// ZABAL Gamez - on-site submissions (GET/POST /api/submissions).
//
// The site is the source of truth for UGC + builder submissions (see
// docs/submission-system-spec.md). A submission is stored pending; a notify hook fires so
// ZOE/Zaal can triage; an admin approves; approval is what unlocks the Unlock collectible
// airdrop. Permalinks render approved submissions at /submissions/<id>.
//
//   POST /api/submissions { kind:'project', project, answer, fields?, handle?, email?, draft? }
//        or the legacy prompt-answer payload. Quick Auth is always optional.
//        -> { ok, id, status, editToken? }     (pending, or a public WIP draft; notify hook fired)
//   GET  /api/submissions?id=<id>              -> { ok, submission }  (approved/draft = public; pending = minimal)
//   GET  /api/submissions?feed=recent&limit=30 -> { ok, submissions:[...] }  (approved only, public)
//   GET  /api/submissions?feed=drafts&limit=30 -> { ok, submissions:[...] }  (public WIP drafts)
//   GET  /api/submissions?feed=projects        -> audited roster + approved projects + WIPs
//   POST /api/submissions { action:'publish', id, editToken? }  (+ Quick Auth) -> { ok, id, status }
//        (draft -> pending; owner only: verified FID match or the editToken returned at creation)
//   GET  /api/submissions?status=pending       + admin -> { ok, queue:[...] }  (review queue)
//   POST /api/submissions { action:'approve'|'reject'|'request_changes', id } + admin
//   POST /api/submissions { action:'update', id, editToken, fields... } -> owner update
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
const INGEST_KEY = process.env.SUBMISSION_INGEST_SECRET || '';
const NOTIFY_URL = process.env.SUBMIT_NOTIFY_URL || ''; // optional Telegram/webhook for new-submission alerts
const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SUBMISSION_FROM_EMAIL = process.env.SUBMISSION_FROM_EMAIL || 'The ZAO <info@thezao.com>';
const CONTACT_EMAIL = 'info@thezao.com';
const SITE_URL = process.env.PUBLIC_SITE_URL || 'https://zabalgamez.com';
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

function timingEq(provided, expected) {
  if (!expected) return false;
  provided = String(provided || '');
  expected = String(expected || '');
  let diff = provided.length ^ expected.length;
  for (let i = 0; i < Math.max(provided.length, expected.length); i++) {
    diff |= (provided.charCodeAt(i) || 0) ^ (expected.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function bearer(req) {
  const auth = req.headers.get('authorization') || '';
  return auth.startsWith('Bearer ') ? auth.slice(7) : '';
}
function adminOk(req) { return !!ADMIN_KEY && timingEq(bearer(req), ADMIN_KEY); }
function ingestOk(req) { return !!INGEST_KEY && timingEq(bearer(req), INGEST_KEY); }

function cleanSlug(s, n) { return String(s || '').trim().toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, n || 40); }
function cleanText(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim().slice(0, n || 2000); }
function cleanEmail(s) { const v = String(s || '').trim(); return /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(v) ? v.slice(0, 320) : null; }
function cleanWallet(s) { const v = String(s || '').trim().toLowerCase(); return /^0x[0-9a-f]{40}$/.test(v) ? v : null; }
function cleanUrl(s) { try { const u = new URL(String(s || '').trim()); return /^https?:$/.test(u.protocol) ? u.toString().slice(0, 500) : null; } catch { return null; } }
function projectStage(status) { return status === 'approved' ? 'published' : status === 'draft' ? 'building' : status === 'changes_requested' ? 'changes-requested' : status === 'pending' ? 'in-review' : status; }
function cleanFields(o) {
  if (!o || typeof o !== 'object') return {};
  const out = {}; let n = 0;
  const aliases = {
    demourl: 'demoUrl', repourl: 'repoUrl', mediaurl: 'mediaUrl', thumbnailurl: 'thumbnailUrl',
    buildername: 'builderName', helpwanted: 'helpWanted', progressupdate: 'progressUpdate',
  };
  for (const k of Object.keys(o)) {
    if (n++ >= 20) break;
    const key = cleanSlug(k, 32);
    if (key) out[aliases[key] || key] = cleanText(o[k], key === 'description' ? 2000 : 500);
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

async function sendEmail({ to, subject, text, idempotencyKey }) {
  if (!RESEND_API_KEY || !cleanEmail(to)) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'zabalgamez-submissions/1.0',
        ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey.slice(0, 250) } : {}),
      },
      body: JSON.stringify({ from: SUBMISSION_FROM_EMAIL, to: [to], reply_to: CONTACT_EMAIL, subject, text }),
      signal: AbortSignal.timeout(5000),
    });
    return r.ok;
  } catch { return false; }
}

async function stableHash(value) {
  const bytes = new TextEncoder().encode(String(value || ''));
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Public-safe view of a submission (no raw email/wallet/editToken; pending shows minimal).
// Drafts are PUBLIC by design - a WIP others can read and comment on before it is finished.
function publicView(s) {
  if (!s) return null;
  const isPublic = s.status === 'approved' || s.status === 'draft';
  const base = { id: s.id, kind: s.kind || 'prompt', promptId: s.promptId, handle: isPublic ? (s.handle || null) : null, status: s.status, publicStatus: projectStage(s.status), ts: s.ts, updatedTs: s.updatedTs || s.ts };
  if (s.status !== 'approved' && s.status !== 'draft') return base;
  if (s.kind === 'project') {
    const f = s.fields || {};
    const safeFields = {
      project: f.project || s.project || '', description: f.description || s.answer || '',
      builderName: f.builderName || '', track: f.track || '', stage: f.stage || '',
      demoUrl: cleanUrl(f.demoUrl), repoUrl: cleanUrl(f.repoUrl), mediaUrl: cleanUrl(f.mediaUrl),
      thumbnailUrl: cleanUrl(f.thumbnailUrl), helpWanted: f.helpWanted || '', progressUpdate: f.progressUpdate || '',
    };
    return {
      ...base,
      project: safeFields.project || 'Untitled project',
      description: safeFields.description,
      track: safeFields.track || null,
      demoUrl: safeFields.demoUrl,
      repoUrl: safeFields.repoUrl,
      mediaUrl: safeFields.mediaUrl,
      thumbnailUrl: safeFields.thumbnailUrl,
      source: s.source || 'web',
      builder: { handle: s.handle || null, name: safeFields.builderName || s.handle || null },
      helpWanted: safeFields.helpWanted || null,
      progressUpdate: safeFields.progressUpdate || null,
      answer: s.answer || '', fields: safeFields, profile: s.profile || null,
    };
  }
  return { ...base, answer: s.answer || '', fields: s.fields || {}, profile: s.profile || null };
}

function ownerView(s) {
  if (!s) return null;
  const out = { ...s };
  delete out.editToken;
  delete out.sourceMessageId;
  delete out.sourceEventId;
  return out;
}

async function readStoredFeed(index, limit, status) {
  let ids = [];
  try { const r = await kvPipeline([['ZREVRANGE', index, '0', String(limit - 1)]]); ids = (r[0] && r[0].result) || []; }
  catch { return []; }
  if (!ids.length) return [];
  try {
    const r = await kvPipeline(ids.map((id) => ['GET', `zabal:sub:v1:${id}`]));
    return r.map((row) => { try { return row && row.result ? JSON.parse(row.result) : null; } catch { return null; } })
      .filter((s) => s && (!status || s.status === status)).map(publicView).filter(Boolean);
  } catch { return []; }
}

// Flatten the audited, repository-backed builder records into the same public API
// surface as live submissions. No scores or missing fields are inferred here: a
// project without a demo or thumbnail keeps those values null for an honest UI state.
async function readBuilderFeed(req) {
  const sourceUrl = new URL('/data/builder-submissions.json', req.url);
  const r = await fetch(sourceUrl, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(4000) });
  if (!r.ok) throw new Error('builder data ' + r.status);
  const doc = await r.json();
  const rows = [];
  const builders = Array.isArray(doc.submissions) ? doc.submissions : [];

  builders.forEach((builder) => {
    const handle = cleanSlug(builder.builder, 40) || null;
    const projects = Array.isArray(builder.projects) ? builder.projects : [];
    projects.forEach((project, index) => {
      rows.push({
        id: ['builder', handle || 'unknown', index + 1].join(':'),
        kind: 'project',
        project: cleanText(project.name, 160) || null,
        description: cleanText(project.desc, 1000) || '',
        status: cleanSlug(project.status || builder.status, 24) || null,
        publicStatus: (project.status || builder.status) === 'complete'
          ? 'published'
          : (project.status || builder.status) === 'planned' ? 'planned' : 'building',
        track: cleanSlug(project.track || builder.track, 24) || null,
        url: cleanText(project.live || project.repo, 500) || null,
        demoUrl: cleanText(project.live, 500) || null,
        repoUrl: cleanText(project.repo, 500) || null,
        thumbnailUrl: cleanText(project.thumbnail_url, 500) || null,
        capturedDate: cleanText(builder.captured_date, 16) || null,
        updatedTs: builder.captured_date ? Date.parse(builder.captured_date + 'T00:00:00Z') : null,
        source: 'audited-roster',
        builder: {
          handle,
          name: cleanText(builder.name, 120) || handle,
          farcasterUrl: cleanText(builder.farcaster, 500) || null,
          githubUrl: cleanText(builder.github, 500) || null,
          xUrl: cleanText(builder.x, 500) || null,
          siteUrl: cleanText(builder.site, 500) || null,
        },
      });
    });
  });

  const tracks = {};
  rows.forEach((row) => { if (row.track) tracks[row.track] = (tracks[row.track] || 0) + 1; });
  return {
    ok: true,
    configured: true,
    source: '/data/builder-submissions.json',
    version: doc.version || null,
    builders: builders.length,
    count: rows.length,
    tracks,
    submissions: rows,
  };
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b, maxAge) => mkJson(b, origin, maxAge);

  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);

  // ---------- GET reads ----------
  if (req.method === 'GET') {
    // Audited builder/project gallery. This stays available even when KV is not
    // configured because the durable source is the versioned repository data file.
    if (url.searchParams.get('feed') === 'builders') {
      try { return json(await readBuilderFeed(req), 60); }
      catch (e) { return json({ ok: false, configured: false, source: '/data/builder-submissions.json', error: e.message, submissions: [] }); }
    }

    // One public project feed for the gallery and every downstream surface.
    if (url.searchParams.get('feed') === 'projects') {
      let audited;
      try { audited = await readBuilderFeed(req); }
      catch (e) { audited = { ok: false, builders: 0, submissions: [], error: e.message }; }
      const dynamic = (KV_URL && KV_TOKEN)
        ? (await Promise.all([
            readStoredFeed('zabal:subs:approved', 100, 'approved'),
            readStoredFeed('zabal:subs:drafts', 100, 'draft'),
          ])).flat().filter((s) => s.kind === 'project')
        : [];
      const seen = new Set();
      const rows = [];
      [...dynamic, ...(audited.submissions || [])].forEach((row) => {
        const builderKey = row.builder && (row.builder.handle || row.builder.name);
        const key = String(row.demoUrl || row.repoUrl || row.mediaUrl || `${builderKey || ''}:${row.project || ''}`).toLowerCase().replace(/\/$/, '');
        if (key && seen.has(key)) return;
        if (key) seen.add(key);
        rows.push(row);
      });
      const tracks = {}, statuses = {};
      rows.forEach((row) => {
        if (row.track) tracks[row.track] = (tracks[row.track] || 0) + 1;
        const st = row.publicStatus || 'pending'; statuses[st] = (statuses[st] || 0) + 1;
      });
      return json({ ok: true, configured: !!(KV_URL && KV_TOKEN), source: 'canonical-project-feed', count: rows.length, builders: audited.builders || 0, tracks, statuses, submissions: rows }, 20);
    }

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
      const editToken = url.searchParams.get('editToken') || url.searchParams.get('token') || '';
      if (s.editToken && timingEq(editToken, s.editToken)) return json({ ok: true, owner: true, submission: ownerView(s) });
      return json({ ok: true, submission: publicView(s) }, s.status === 'approved' ? 30 : 0);
    }

    // public WIP drafts feed - open builds people can comment on while in progress
    if (url.searchParams.get('feed') === 'drafts') {
      const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit')) || 30));
      return json({ ok: true, configured: true, submissions: await readStoredFeed('zabal:subs:drafts', limit, 'draft') }, 10);
    }

    // public recent feed (approved only)
    if (url.searchParams.get('feed') === 'recent') {
      const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit')) || 30));
      return json({ ok: true, configured: true, submissions: await readStoredFeed('zabal:subs:approved', limit, 'approved') }, 20);
    }

    return json({ ok: false, error: 'bad request' });
  }

  // ---------- POST writes ----------
  if (req.method === 'POST') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, configured: false });
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    // Admin moderation. Requesting changes keeps the private owner link active and
    // emails the submitter when an address is available.
    if (body.action === 'approve' || body.action === 'reject' || body.action === 'request_changes') {
      if (!adminOk(req)) return json({ ok: false, error: 'forbidden' });
      const id = cleanSlug(body.id, 24);
      if (!id) return json({ ok: false, error: 'id required' });
      let s = null;
      try { const r = await kvPipeline([['GET', `zabal:sub:v1:${id}`]]); if (r[0] && r[0].result) s = JSON.parse(r[0].result); }
      catch { return json({ ok: false, error: 'kv' }); }
      if (!s) return json({ ok: false, error: 'not found' });
      const prev = s.status;
      s.status = body.action === 'approve' ? 'approved' : body.action === 'request_changes' ? 'changes_requested' : 'rejected';
      s.reviewNote = cleanText(body.reviewNote, 1000) || null;
      s.reviewedTs = Date.now();
      s.updatedTs = s.reviewedTs;
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
      if (s.status === 'approved' && s.handle && s.fid) {
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
      if (s.email && s.kind === 'project') {
        const statusLink = `${SITE_URL}/submission-status?id=${encodeURIComponent(id)}${s.editToken ? `&token=${encodeURIComponent(s.editToken)}` : ''}`;
        const projectName = (s.fields && s.fields.project) || s.project || `Project ${id}`;
        const statusText = s.status === 'approved'
          ? `Your project "${projectName}" has been approved and can now appear publicly on ZABAL Gamez.`
          : s.status === 'changes_requested'
            ? `The ZAO needs a little more information about "${projectName}".${s.reviewNote ? `\n\nReview note: ${s.reviewNote}` : ''}`
            : `Your project "${projectName}" was not published.${s.reviewNote ? `\n\nReview note: ${s.reviewNote}` : ''}`;
        await sendEmail({ to: s.email, subject: `ZABAL Gamez project #${id}: ${projectStage(s.status)}`, text: `${statusText}\n\nOpen the private status page:\n${statusLink}\n\nQuestions? Reply to this message or email ${CONTACT_EMAIL}.`, idempotencyKey: `submission-${id}-${s.status}` });
      }
      return json({ ok: true, id, status: s.status, agentToken });
    }

    // The creator can update a project through the private token returned at intake.
    if (body.action === 'update') {
      const id = cleanSlug(body.id, 24);
      if (!id) return json({ ok: false, error: 'id required' });
      let s = null;
      try { const r = await kvPipeline([['GET', `zabal:sub:v1:${id}`]]); if (r[0] && r[0].result) s = JSON.parse(r[0].result); }
      catch { return json({ ok: false, error: 'kv' }); }
      if (!s || s.kind !== 'project') return json({ ok: false, error: 'not found' });
      const isAdmin = adminOk(req);
      const owner = isAdmin || (s.editToken && timingEq(body.editToken, s.editToken));
      if (!owner) return json({ ok: false, error: 'forbidden' });
      const prev = s.status;
      const next = cleanFields(body.fields);
      s.fields = { ...(s.fields || {}), ...next };
      if (body.answer != null) s.answer = cleanText(body.answer, 2000);
      if (body.handle != null) s.handle = cleanSlug(body.handle, 40) || null;
      if (body.email != null) s.email = cleanEmail(body.email);
      s.updatedTs = Date.now();
      const shouldReview = (!isAdmin && prev === 'approved') || (body.ready === true && (prev === 'draft' || prev === 'changes_requested' || prev === 'rejected'));
      if (shouldReview) {
        s.status = 'pending';
        s.reviewNote = null;
        try {
          await kvPipeline([
            ['SET', `zabal:sub:v1:${id}`, JSON.stringify(s)],
            ['SREM', `zabal:subs:bystatus:${prev}`, id],
            ['SADD', 'zabal:subs:bystatus:pending', id],
            ['ZREM', 'zabal:subs:drafts', id],
            ['ZREM', 'zabal:subs:approved', id],
          ]);
        } catch { return json({ ok: false, error: 'kv-write' }); }
        await notify(`Project #${id} updated and sent for review.`);
        if (s.email) {
          const statusLink = `${SITE_URL}/submission-status?id=${encodeURIComponent(id)}&token=${encodeURIComponent(s.editToken || '')}`;
          await sendEmail({
            to: s.email,
            subject: `ZABAL Gamez project #${id} updated`,
            text: `Your updated project is back in review.\n\nOpen the private status page:\n${statusLink}\n\nQuestions? Reply to this message or email ${CONTACT_EMAIL}.`,
            idempotencyKey: `submission-${id}-review-${s.updatedTs}`,
          });
        }
      } else {
        try { await kvPipeline([['SET', `zabal:sub:v1:${id}`, JSON.stringify(s)]]); }
        catch { return json({ ok: false, error: 'kv-write' }); }
      }
      return json({ ok: true, id, status: s.status, submission: ownerView(s) });
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
    // Trusted email/import adapters use a separate ingest secret. Everyone else is
    // accepted anonymously behind the existing soft rate limit.
    const trustedIngest = ingestOk(req);
    if (!trustedIngest) {
      const ip = RateLimiter.getClientIp(req);
      const allowed = await limiter.checkLimit(ip, 'submit', { perMinute: 5, perHour: 30 });
      if (!allowed) return json({ ok: false, reason: 'limit' });
    }

    const kind = body.kind === 'project' ? 'project' : 'prompt';
    const promptId = cleanSlug(body.promptId || (kind === 'project' ? 'project' : ''), 40);
    const answer = cleanText(body.answer, 2000);
    if (!promptId) return json({ ok: false, error: 'promptId required' });
    if (!answer && !body.fields) return json({ ok: false, error: 'answer required' });
    const fields = cleanFields(body.fields);
    const project = cleanText(body.project || fields.project, 160);
    if (kind === 'project' && !project) return json({ ok: false, error: 'project required' });
    if (kind === 'project' && body.consent !== true && !trustedIngest) return json({ ok: false, error: 'consent required' });
    if (kind === 'project' && !answer && !cleanUrl(fields.demoUrl) && !cleanUrl(fields.repoUrl) && !cleanUrl(fields.mediaUrl)) {
      return json({ ok: false, error: 'description or project link required' });
    }

    // Email/webhook retries are at-least-once. Source identifiers keep them from
    // creating duplicate projects before the main counter is incremented.
    const sourceMessageId = trustedIngest ? cleanText(body.sourceMessageId, 500) : '';
    const sourceEventId = trustedIngest ? cleanText(body.sourceEventId, 200) : '';
    const sourceHash = sourceMessageId || sourceEventId ? await stableHash(`${sourceMessageId}|${sourceEventId}`) : '';
    if (sourceHash) {
      try {
        const existing = await kvPipeline([['GET', `zabal:subs:source:${sourceHash}`]]);
        const existingId = existing[0] && existing[0].result;
        if (existingId) return json({ ok: true, duplicate: true, id: String(existingId), status: 'pending' });
      } catch { /* continue; storage write below remains authoritative */ }
    }

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
    const editToken = (isDraft || kind === 'project') ? crypto.randomUUID() : null;
    const sub = {
      id, kind, promptId, project: project || null, answer,
      fields,
      handle, fid, pfp,
      email: cleanEmail(body.email),
      wallet: cleanWallet(body.wallet),
      consent: body.consent === true || trustedIngest,
      source: trustedIngest ? (cleanSlug(body.source, 32) || 'ingest') : 'web',
      sourceMessageId: sourceMessageId || null,
      sourceEventId: sourceEventId || null,
      attachments: trustedIngest && Array.isArray(body.attachments) ? body.attachments.slice(0, 12).map((a) => ({
        id: cleanText(a && a.id, 120) || null,
        filename: cleanText(a && a.filename, 180) || 'attachment',
        contentType: cleanText(a && (a.contentType || a.content_type), 120) || 'application/octet-stream',
        size: Math.max(0, Math.min(25 * 1024 * 1024, Number(a && a.size) || 0)),
      })) : [],
      status: isDraft ? 'draft' : 'pending',
      ts: Date.now(),
      updatedTs: Date.now(),
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
    if (sourceHash) cmds.push(['SET', `zabal:subs:source:${sourceHash}`, id]);
    try { await kvPipeline(cmds); } catch { return json({ ok: false, error: 'kv-write' }); }

    await notify(isDraft
      ? `New WIP draft #${id} on "${promptId}"${handle ? ' from @' + handle : ''} - public at /submissions?id=${id}.`
      : `New ZABAL Gamez submission #${id} on "${promptId}"${handle ? ' from @' + handle : ''} - review it.`);
    if (sub.email && kind === 'project') {
      const statusLink = `${SITE_URL}/submission-status?id=${encodeURIComponent(id)}${editToken ? `&token=${encodeURIComponent(editToken)}` : ''}`;
      await sendEmail({
        to: sub.email,
        subject: `ZABAL Gamez project received: ${project}`,
        text: `We received "${project}" as project #${id}.\n\nStatus: ${projectStage(sub.status)}\nOpen and update the private record:\n${statusLink}\n\nThe project is reviewed before it becomes public. Questions? Reply to this message or email ${CONTACT_EMAIL}.`,
        idempotencyKey: `submission-${id}-received`,
      });
    }
    const resp = { ok: true, id, status: sub.status };
    if (editToken) resp.editToken = editToken;
    return json(resp);
  }

  return json({ ok: false, error: 'method' });
}

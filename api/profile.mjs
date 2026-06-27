// ZABAL Gamez - builder profiles (GET/POST /api/profile).
//
// Open profiles for anyone (docs/submission-system-spec.md). The anchor is the handle;
// Farcaster (Quick Auth), GitHub (nonce proof), and a wallet ATTACH as optional proofs.
// A profile lives at /profiles/<handle> and is the identity a submission hangs off.
//
//   GET  /api/profile?handle=<h>                                    -> { ok, profile }  (public)
//   POST { action:'upsert', handle, displayName?, bio?, links?, github?, editToken? }
//        (+ optional Quick Auth)                                    -> { ok, profile, editToken? }
//   POST { action:'github-challenge', handle, editToken? }          -> { ok, nonce, where }
//   POST { action:'github-verify',    handle, editToken? }          -> { ok, github_verified }
//   POST { action:'wallet', handle, wallet, editToken? }            -> { ok, wallet }
//
// Ownership: a profile is editable by its bound Farcaster FID (Quick Auth) OR by the
// edit token returned once at creation (for no-Farcaster creators - "profile for anyone").
// GitHub proof: we issue a random nonce; the user puts it in their GitHub profile bio; we
// read it back via the GitHub API (GITHUB_TOKEN, same key as commit-watcher). Graceful
// no-op without KV.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const HAATZ = 'https://haatz.quilibrium.com';

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const NONCE_TTL = 3600;
const RESERVED = new Set(['api', 'assets', 'data', 'recordings', 'game', 'profiles', 'submissions', 'admin', 'new', 'edit', 'me']);

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

function cleanHandle(s) { return String(s || '').trim().toLowerCase().replace(/^@/, '').replace(/[^a-z0-9_-]/g, '').slice(0, 32); }
function cleanText(s, n) { return String(s == null ? '' : s).replace(/[<>]/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim().slice(0, n || 280); }
function cleanGithub(s) { return String(s || '').trim().replace(/^@/, '').replace(/^https?:\/\/github\.com\//i, '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 39); }
function cleanWallet(s) { const v = String(s || '').trim().toLowerCase(); return /^0x[0-9a-f]{40}$/.test(v) ? v : null; }
function cleanLinks(a) {
  if (!Array.isArray(a)) return [];
  const out = [];
  for (const item of a.slice(0, 8)) {
    const url = String((item && item.url) || item || '').trim();
    if (/^https?:\/\/[^\s]{4,300}$/i.test(url)) out.push({ label: cleanText((item && item.label) || '', 40), url: url.slice(0, 300) });
  }
  return out;
}

async function sha256hex(s) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function fidFromAuth(req) {
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return null;
  try { return await verifyQuickAuth(token, DOMAIN); } catch { return null; }
}

async function usernameForFid(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) { const u = ((await r.json()).users || [])[0] || {}; return cleanHandle(u.username); }
  } catch { /* ignore */ }
  return '';
}

async function getProfile(handle) {
  try { const r = await kvPipeline([['GET', `zabal:profile:v1:${handle}`]]); if (r[0] && r[0].result) return JSON.parse(r[0].result); }
  catch { /* none */ }
  return null;
}

// Public view strips the edit-token hash.
function publicView(p) {
  if (!p) return null;
  const { tokenHash, ...rest } = p;
  return rest;
}

// Can this request edit this profile? (bound FID via Quick Auth, or the edit token)
async function canEdit(profile, fid, editToken) {
  if (!profile) return true; // creating
  if (fid && profile.fid && Number(profile.fid) === Number(fid)) return true;
  if (editToken && profile.tokenHash && (await sha256hex(editToken)) === profile.tokenHash) return true;
  return false;
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b, maxAge) => mkJson(b, origin, maxAge);

  if (req.method === 'OPTIONS') return json({ ok: true });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false, profile: null });
    const handle = cleanHandle(url.searchParams.get('handle'));
    if (!handle) return json({ ok: false, error: 'handle required' });
    const p = await getProfile(handle);
    if (!p) return json({ ok: true, configured: true, profile: null });
    return json({ ok: true, configured: true, profile: publicView(p) }, 15);
  }

  if (req.method === 'POST') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, configured: false });
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }
    const action = String(body.action || 'upsert');
    const fid = await fidFromAuth(req);
    let handle = cleanHandle(body.handle) || (fid ? await usernameForFid(fid) : '');
    if (!handle) return json({ ok: false, error: 'handle required' });
    if (RESERVED.has(handle)) return json({ ok: false, error: 'reserved handle' });

    const existing = await getProfile(handle);
    if (!(await canEdit(existing, fid, body.editToken))) return json({ ok: false, error: 'not your profile' });

    // ---- create / update ----
    if (action === 'upsert') {
      const now = Date.now();
      const p = existing || { handle, created: now, github_verified: false, wallet_verified: false };
      if (typeof body.displayName === 'string') p.displayName = cleanText(body.displayName, 60);
      if (typeof body.bio === 'string') p.bio = cleanText(body.bio, 280);
      if (Array.isArray(body.links)) p.links = cleanLinks(body.links);
      if (typeof body.github === 'string') { const g = cleanGithub(body.github); if (g !== (p.github || '')) { p.github = g; p.github_verified = false; } }
      if (fid && !p.fid) p.fid = fid;
      p.updated = now;

      // issue an edit token for anonymous (no-FID) creators on first create
      let editToken = null;
      if (!existing && !fid) { editToken = crypto.randomUUID(); p.tokenHash = await sha256hex(editToken); }

      const cmds = [['SET', `zabal:profile:v1:${handle}`, JSON.stringify(p)]];
      if (fid) cmds.push(['SET', `zabal:profile:byfid:${fid}`, handle]);
      try { await kvPipeline(cmds); } catch { return json({ ok: false, error: 'kv-write' }); }
      return json({ ok: true, profile: publicView(p), editToken });
    }

    if (!existing) return json({ ok: false, error: 'profile not found' });

    // ---- GitHub challenge ----
    if (action === 'github-challenge') {
      if (!existing.github) return json({ ok: false, error: 'set your github username first (upsert with github)' });
      const nonce = 'zabal-verify-' + (await sha256hex(handle + ':' + crypto.randomUUID())).slice(0, 16);
      try { await kvPipeline([['SET', `zabal:profile:nonce:${handle}`, nonce, 'EX', String(NONCE_TTL)]]); }
      catch { return json({ ok: false, error: 'kv' }); }
      return json({ ok: true, nonce, where: 'Add this string anywhere in your GitHub profile bio (github.com/' + existing.github + ' -> Edit profile -> Bio), then come back and verify. You can remove it after.' });
    }

    // ---- GitHub verify ----
    if (action === 'github-verify') {
      let nonce;
      try { const r = await kvPipeline([['GET', `zabal:profile:nonce:${handle}`]]); nonce = r[0] && r[0].result; }
      catch { return json({ ok: false, error: 'kv' }); }
      if (!nonce) return json({ ok: false, error: 'no active challenge - request one first' });
      if (!existing.github) return json({ ok: false, error: 'no github username on profile' });
      let bio = '';
      try {
        const gh = await fetch(`https://api.github.com/users/${existing.github}`, {
          headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'zabalgamez' } : { 'User-Agent': 'zabalgamez' },
          signal: AbortSignal.timeout(4000),
        });
        if (gh.ok) bio = String((await gh.json()).bio || '');
        else if (gh.status === 404) return json({ ok: false, error: 'github user not found' });
      } catch { return json({ ok: false, error: 'github fetch failed' }); }
      if (!bio.includes(nonce)) return json({ ok: false, verified: false, reason: 'nonce not found in your GitHub bio yet' });
      existing.github_verified = true;
      existing.updated = Date.now();
      try {
        await kvPipeline([
          ['SET', `zabal:profile:v1:${handle}`, JSON.stringify(existing)],
          ['SET', `zabal:profile:bygithub:${existing.github.toLowerCase()}`, handle],
          ['DEL', `zabal:profile:nonce:${handle}`],
        ]);
      } catch { return json({ ok: false, error: 'kv-write' }); }
      return json({ ok: true, github_verified: true });
    }

    // ---- wallet attach ----
    if (action === 'wallet') {
      const w = cleanWallet(body.wallet);
      if (!w) return json({ ok: false, error: 'valid 0x wallet required' });
      existing.wallet = w;
      // signature verification (true ownership) is a follow-up; stored as claimed for now
      existing.wallet_verified = false;
      existing.updated = Date.now();
      try { await kvPipeline([['SET', `zabal:profile:v1:${handle}`, JSON.stringify(existing)]]); }
      catch { return json({ ok: false, error: 'kv-write' }); }
      return json({ ok: true, wallet: w });
    }

    return json({ ok: false, error: 'unknown action' });
  }

  return json({ ok: false, error: 'method' });
}

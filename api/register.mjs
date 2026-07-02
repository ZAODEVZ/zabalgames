// ZABAL Gamez - builder registration (POST /api/register).
//
// The thin registration layer from the GitHub-as-submission / Bonfire-as-backend
// architecture (research doc 784). A builder's own harness makes ONE call here
// after pushing their work to GitHub with their wallet in an MD file. A separate
// server-side cron (api/commit-watcher.mjs) is the only thing that reads this
// list and talks to Bonfire. This endpoint never touches Bonfire.
//
// Hybrid identity (audit 2026-06-04): wallet stays the auth-free baseline so ANY
// harness can submit with one POST (the load-bearing doc-784 principle). When the
// caller also sends a Quick Auth Bearer token we verify it and link the wallet to
// the Farcaster FID - the FID is the anchor when present, the wallet otherwise. An
// invalid/absent token never blocks: the link is optional, the wallet path always
// works.
//
// Many repos per builder: `zabal:builds` maps { wallet -> JSON array of repos }, so
// a builder can register more than one project (de-duped). A separate
// `zabal:builds:fid` maps { wallet -> fid } for the optional identity link. Older
// single-string values are read back transparently.
//
// Ownership proof lives at the cron boundary (api/commit-watcher.mjs): before a
// repo's commits are pushed, the watcher verifies the repo actually contains the
// registrant's wallet in a known file. This endpoint stays a thin, cheap claim.
//
// Request:  POST { wallet: "0x...", github_repo: "owner/repo" | "https://github.com/owner/repo" }
//           Authorization: Bearer <quick-auth-jwt>  (OPTIONAL - links wallet to FID)
// Response: { ok: true, wallet, github_repo, repos, fid, count }  (count = distinct builders)
//           { ok: false, reason } on bad input or when storage is absent.
//
// Mirrors the KV/no-op-graceful pattern of api/join.mjs. Inputs are shape-validated
// and length-capped; the cron only ever reads public GitHub, so a malformed or junk
// entry costs nothing downstream.

export const config = { runtime: 'edge' };

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';
import { RateLimiter } from '../lib/rate-limit.mjs';

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const BUILDS_KEY = 'zabal:builds';
const FIDS_KEY = 'zabal:builds:fid';
const TRACK_KEY = 'zabal:builds:track'; // repo -> 'artist'|'builder'|'creator', for per-track judging
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const TRACKS = new Set(['artist', 'builder', 'creator']);
const limiter = new RateLimiter(KV_URL, KV_TOKEN);

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
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

// Accept "0x" + 40 hex. Normalize to lowercase so the same wallet is one key.
function normalizeWallet(raw) {
  const w = String(raw || '').trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(w) ? w : null;
}

// Accept a full URL or "owner/repo". Normalize to "owner/repo" (strip host,
// protocol, trailing .git, leading/trailing slashes). Reject anything that is
// not two clean path segments of GitHub-legal characters.
function normalizeRepo(raw) {
  let s = String(raw || '').trim();
  if (!s) return null;
  s = s.replace(/^https?:\/\//i, '').replace(/^github\.com\//i, '');
  s = s.replace(/\.git$/i, '').replace(/^\/+|\/+$/g, '');
  const m = s.match(/^([A-Za-z0-9._-]{1,39})\/([A-Za-z0-9._-]{1,100})$/);
  return m ? `${m[1]}/${m[2]}` : null;
}

// Read a wallet's stored repos back as an array. Transparently upgrades the old
// single-string value ("owner/repo") to the array shape.
function parseRepos(raw) {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
    if (typeof p === 'string' && p) return [p];
  } catch {
    if (typeof raw === 'string' && raw) return [raw]; // legacy bare "owner/repo"
  }
  return [];
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ ok: false, reason: 'method not allowed' }, 405, origin);

  let body = {};
  try { body = await req.json(); } catch {}

  // Rate-limit builder registrations: 8 per minute, 40 per hour.
  const ip = RateLimiter.getClientIp(req);
  const allowed = await limiter.checkLimit(ip, 'register', { perMinute: 8, perHour: 40 });
  if (!allowed) return json({ ok: false, reason: 'rate limited' }, 429, origin);

  const wallet = normalizeWallet(body.wallet);
  if (!wallet) return json({ ok: false, reason: 'invalid wallet (expected 0x + 40 hex)' }, 400, origin);

  const github_repo = normalizeRepo(body.github_repo);
  if (!github_repo) return json({ ok: false, reason: 'invalid github_repo (expected owner/repo or a github.com URL)' }, 400, origin);

  // Optional FID link: if a Quick Auth token rides along and verifies, anchor the
  // wallet to its FID. An absent or invalid token is not an error - the wallet
  // path always works, keeping submission harness-agnostic.
  let fid = null;
  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (token) {
    try { fid = await verifyQuickAuth(token, DOMAIN); } catch { fid = null; }
  }

  // No KV in this deployment: report not-stored rather than claim success.
  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  // Append this repo to the wallet's list (de-duped, many repos per builder).
  let repos;
  try {
    const prev = await kvPipeline([['HGET', BUILDS_KEY, wallet]]);
    const existing = parseRepos(prev?.[0]?.result);
    repos = existing.includes(github_repo) ? existing : [...existing, github_repo];
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502, origin);
  }

  // Optional track for per-track judging. Keyed by repo (not wallet) so each build
  // carries its own lane. Ignored unless it is one of the three real tracks.
  const track = TRACKS.has(String(body.track || '').toLowerCase()) ? String(body.track).toLowerCase() : '';

  const cmds = [['HSET', BUILDS_KEY, wallet, JSON.stringify(repos)]];
  if (fid) cmds.push(['HSET', FIDS_KEY, wallet, String(fid)]);
  if (track) cmds.push(['HSET', TRACK_KEY, github_repo, track]);
  cmds.push(['HLEN', BUILDS_KEY]);

  let res;
  try {
    res = await kvPipeline(cmds);
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502, origin);
  }

  const count = Number(res?.[res.length - 1]?.result || 0);
  return json({ ok: true, wallet, github_repo, repos, fid, count }, 200, origin);
}

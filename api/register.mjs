// ZABAL Gamez - builder registration (POST /api/register).
//
// The thin registration layer from the GitHub-as-submission / Bonfire-as-backend
// architecture (research doc 784). A builder's own harness makes ONE call here
// after pushing their work to GitHub with their wallet in an MD file. We keep a
// single Redis hash `zabal:builds` mapping { wallet -> github_repo }. A separate
// server-side cron (api/commit-watcher.mjs) is the only thing that reads this
// list and talks to Bonfire. This endpoint never touches Bonfire.
//
// Idempotent by construction: HSET on the same wallet overwrites its repo, so a
// builder can re-register (e.g. after moving repos) with no duplicates.
//
// Request:  POST { wallet: "0x...", github_repo: "owner/repo" | "https://github.com/owner/repo" }
// Response: { ok: true, wallet, github_repo, count }  (count = distinct builders)
//           { ok: false, reason } on bad input or when storage is absent.
//
// Mirrors the KV/no-op-graceful pattern of api/join.mjs. No Quick Auth here: the
// builder identifies by wallet, not a Farcaster JWT. Inputs are shape-validated
// and length-capped; the cron only ever reads public GitHub, so a malformed or
// junk entry costs nothing downstream.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const BUILDS_KEY = 'zabal:builds';

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
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

export default async function handler(req) {
  const origin = req.headers.get('origin') || '*';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ ok: false, reason: 'method not allowed' }, 405, origin);

  let body = {};
  try { body = await req.json(); } catch {}

  const wallet = normalizeWallet(body.wallet);
  if (!wallet) return json({ ok: false, reason: 'invalid wallet (expected 0x + 40 hex)' }, 400, origin);

  const github_repo = normalizeRepo(body.github_repo);
  if (!github_repo) return json({ ok: false, reason: 'invalid github_repo (expected owner/repo or a github.com URL)' }, 400, origin);

  // No KV in this deployment: report not-stored rather than claim success.
  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  let res;
  try {
    res = await kvPipeline([
      ['HSET', BUILDS_KEY, wallet, github_repo],
      ['HLEN', BUILDS_KEY],
    ]);
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502, origin);
  }

  const count = Number(res?.[1]?.result || 0);
  return json({ ok: true, wallet, github_repo, count }, 200, origin);
}

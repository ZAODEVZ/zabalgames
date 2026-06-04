// ZABAL Gamez - activity tracking endpoint (POST /api/track).
//
// Records a deliberate social action (cast / share / signup) attributed to a
// REAL Farcaster FID, verified server-side from a Quick Auth JWT. Nothing is
// stored unless the token verifies, so activity cannot be spoofed.
//
// Storage: Vercel KV (Upstash Redis) over the REST API - no npm dependency, so
// this stays a zero-build edge function like api/snap/signup.mjs. If the KV env
// vars are not set the endpoint verifies + returns ok without storing.
//
// Env:
//   KV_REST_API_URL     Vercel KV / Upstash REST base URL
//   KV_REST_API_TOKEN   Vercel KV / Upstash REST token
//
// Request:  POST { action: 'cast'|'share'|'signup', target?: string, castHash?: string }
//           castHash is the real cast hash from composeCast - stored for attribution.
//           Authorization: Bearer <quick-auth-jwt>   (added by sdk.quickAuth.fetch)
// Response: { ok: true, stored: boolean }

export const config = { runtime: 'edge' };

import { verifyQuickAuth } from '../lib/auth.mjs';

const DOMAIN = 'zabalgamez.com';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const ALLOWED = new Set(['cast', 'share', 'signup']);
const POINTS = { cast: 3, share: 2, signup: 5 };
const RECENT_KEY = 'zabal:activity:v1';
const SCORES_KEY = 'zabal:scores:v1';
const RECENT_MAX = 50;
const PRESENT_TTL = 172800; // 2 days

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

// Best-effort profile enrichment so the feed can show @username + pfp.
async function resolveProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) return {};
    const u = (await r.json()).users?.[0] || {};
    return { username: u.username || null, pfpUrl: u.pfp_url || null };
  } catch {
    return {};
  }
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, origin);

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'no token' }, 401, origin);

  let fid;
  try {
    fid = await verifyQuickAuth(token, DOMAIN);
  } catch (e) {
    return json({ error: 'invalid token', detail: e.message }, 401, origin);
  }

  let body = {};
  try { body = await req.json(); } catch {}
  const action = String(body.action || '');
  const target = String(body.target || '').slice(0, 40);
  const castHash = String(body.castHash || '').slice(0, 80);
  if (!ALLOWED.has(action)) return json({ error: 'bad action' }, 400, origin);

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, stored: false, note: 'KV not configured' }, 200, origin);

  const profile = await resolveProfile(fid);
  const entry = JSON.stringify({
    fid, username: profile.username, pfpUrl: profile.pfpUrl, action, target,
    castHash: castHash || null, ts: Date.now(),
  });
  const presentKey = `zabal:present:${new Date().toISOString().slice(0, 10)}`;
  try {
    await kvPipeline([
      ['LPUSH', RECENT_KEY, entry],
      ['LTRIM', RECENT_KEY, '0', String(RECENT_MAX - 1)],
      ['SADD', presentKey, String(fid)],
      ['EXPIRE', presentKey, String(PRESENT_TTL)],
      ['ZINCRBY', SCORES_KEY, String(POINTS[action] || 1), String(fid)],
    ]);
  } catch (e) {
    return json({ ok: false, stored: false, detail: e.message }, 502, origin);
  }
  return json({ ok: true, stored: true }, 200, origin);
}

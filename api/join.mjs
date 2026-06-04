// ZABAL Gamez - one-tap join (POST /api/join).
//
// Records a workshop join against a verified Farcaster FID (Quick Auth JWT,
// verified server-side - same model as api/track.mjs). Dedupes per FID via a KV
// hash, so the count is distinct builders. Also drops a 'signup' into the
// activity feed + score so the presence widget and leaderboard reflect it.
//
// Request:  POST { door?: string, note?: string, track?: 'artist'|'builder'|'creator', source?: string }
//           Authorization: Bearer <quick-auth-jwt>  (sdk.quickAuth.fetch)
// Response: { ok: true, count: number }

export const config = { runtime: 'edge' };

import { verifyQuickAuth } from '../lib/auth.mjs';

const DOMAIN = 'zabalgamez.com';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';
const JOINS_KEY = 'zabal:joins';
const RECENT_KEY = 'zabal:activity:v1';
const SCORES_KEY = 'zabal:scores:v1';
const RECENT_MAX = 50;
const SIGNUP_POINTS = 5;

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
  try { fid = await verifyQuickAuth(token, DOMAIN); }
  catch (e) { return json({ error: 'invalid token', detail: e.message }, 401, origin); }

  let body = {};
  try { body = await req.json(); } catch {}
  const door = String(body.door || 'workshops').slice(0, 24);
  const note = String(body.note || '').slice(0, 280);
  const rawTrack = String(body.track || '').toLowerCase();
  const track = ['artist', 'builder', 'creator'].includes(rawTrack) ? rawTrack : null;
  // Outreach attribution (e.g. 'cold-dm') so experiment signups separate from warm.
  const source = String(body.source || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 24) || null;

  // No KV in this deployment: report not-stored so the client falls through to
  // the full sign-up form. Never claim success when nothing was captured.
  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  const profile = await resolveProfile(fid);
  const joinRecord = JSON.stringify({ door, note, track, source, username: profile.username, ts: Date.now() });
  const activity = JSON.stringify({
    fid, username: profile.username, pfpUrl: profile.pfpUrl, action: 'signup', target: door, ts: Date.now(),
  });
  const presentKey = `zabal:present:${new Date().toISOString().slice(0, 10)}`;

  let res;
  try {
    res = await kvPipeline([
      ['HSET', JOINS_KEY, String(fid), joinRecord],
      ['LPUSH', RECENT_KEY, activity],
      ['LTRIM', RECENT_KEY, '0', String(RECENT_MAX - 1)],
      ['SADD', presentKey, String(fid)],
      ['EXPIRE', presentKey, '172800'],
      ['ZINCRBY', SCORES_KEY, String(SIGNUP_POINTS), String(fid)],
      ['HLEN', JOINS_KEY],
    ]);
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502, origin);
  }

  const count = Number(res?.[6]?.result || 0);
  return json({ ok: true, count }, 200, origin);
}

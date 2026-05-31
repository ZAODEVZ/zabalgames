// ZABAL Gamez - activity tracking endpoint (POST /api/track).
//
// Records a deliberate social action (cast / share / signup) attributed to a
// REAL Farcaster FID, verified server-side from a Quick Auth JWT. Nothing is
// stored unless the token verifies, so activity cannot be spoofed.
//
// Storage: Supabase Postgres over the PostgREST API - no npm dependency, so
// this stays a zero-build edge function. The atomic feed-append + score-bump is
// done in the public.zg_track RPC (see db/supabase-activity.sql). If the
// Supabase env vars are not set the endpoint verifies + returns ok without
// storing.
//
// Env:
//   SUPABASE_URL                Supabase project URL (https://xxxx.supabase.co)
//   SUPABASE_SERVICE_ROLE_KEY   service-role key (server-only; bypasses RLS)
//
// Request:  POST { action: 'cast'|'share'|'signup', target?: string }
//           Authorization: Bearer <quick-auth-jwt>   (added by sdk.quickAuth.fetch)
// Response: { ok: true, stored: boolean }

export const config = { runtime: 'edge' };

const DOMAIN = 'zabalgamez.com';
const JWKS_URL = 'https://auth.farcaster.xyz/.well-known/jwks.json';
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HAATZ = 'https://haatz.quilibrium.com';
const ALLOWED = new Set(['cast', 'share', 'signup']);
const POINTS = { cast: 3, share: 2, signup: 5 };

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

// --- base64url helpers ---
function b64urlToBytes(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlToJson(b64url) {
  return JSON.parse(new TextDecoder().decode(b64urlToBytes(b64url)));
}

// --- JWKS (cached in the isolate for an hour) ---
let jwksCache = { keys: null, ts: 0 };
async function getJwks() {
  if (jwksCache.keys && Date.now() - jwksCache.ts < 3600000) return jwksCache.keys;
  const r = await fetch(JWKS_URL, { signal: AbortSignal.timeout(4000) });
  const j = await r.json();
  jwksCache = { keys: j.keys || [], ts: Date.now() };
  return jwksCache.keys;
}

// Map JWT alg -> Web Crypto import + verify params. Supports the algorithms a
// hosted JWKS issuer might use (RSA, P-256, Ed25519).
function algParams(alg) {
  if (alg === 'RS256') return { imp: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, vrf: { name: 'RSASSA-PKCS1-v1_5' } };
  if (alg === 'ES256') return { imp: { name: 'ECDSA', namedCurve: 'P-256' }, vrf: { name: 'ECDSA', hash: 'SHA-256' } };
  if (alg === 'EdDSA') return { imp: { name: 'Ed25519' }, vrf: { name: 'Ed25519' } };
  return null;
}

// Verify a Quick Auth JWT and return the FID (payload.sub). Throws on any failure.
async function verifyQuickAuth(token, domain) {
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) throw new Error('malformed');
  const header = b64urlToJson(h);
  const payload = b64urlToJson(p);
  const params = algParams(header.alg);
  if (!params) throw new Error('unsupported alg ' + header.alg);

  const keys = await getJwks();
  const jwk = keys.find(k => k.kid === header.kid) || keys[0];
  if (!jwk) throw new Error('no jwk');

  const key = await crypto.subtle.importKey('jwk', jwk, params.imp, false, ['verify']);
  const data = new TextEncoder().encode(`${h}.${p}`);
  const ok = await crypto.subtle.verify(params.vrf, key, b64urlToBytes(s), data);
  if (!ok) throw new Error('bad signature');

  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) throw new Error('expired');
  if (payload.aud && payload.aud !== domain) throw new Error('aud mismatch');
  if (payload.iss && !String(payload.iss).includes('auth.farcaster.xyz')) throw new Error('iss mismatch');
  const fid = Number(payload.sub);
  if (!fid) throw new Error('no sub');
  return fid;
}

// Call a Supabase RPC over PostgREST with the service-role key.
async function sbRpc(fn, args) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('sb ' + r.status + ' ' + (await r.text()).slice(0, 120));
  const t = await r.text();
  return t ? JSON.parse(t) : null;
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
  const origin = req.headers.get('origin') || '*';
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
  if (!ALLOWED.has(action)) return json({ error: 'bad action' }, 400, origin);

  if (!SB_URL || !SB_KEY) return json({ ok: true, stored: false, note: 'storage not configured' }, 200, origin);

  const profile = await resolveProfile(fid);
  try {
    await sbRpc('zg_track', {
      p_fid: fid,
      p_username: profile.username || null,
      p_pfp: profile.pfpUrl || null,
      p_action: action,
      p_target: target || null,
      p_points: POINTS[action] || 1,
    });
  } catch (e) {
    return json({ ok: false, stored: false, detail: e.message }, 502, origin);
  }
  return json({ ok: true, stored: true }, 200, origin);
}

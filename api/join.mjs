// ZABAL Gamez - one-tap join (POST /api/join).
//
// Records a workshop join against a verified Farcaster FID (Quick Auth JWT,
// verified server-side - same model as api/track.mjs). Dedupes per FID via the
// zg_joins primary key, so the count is distinct builders. Also drops a
// 'signup' into the activity feed + score so the presence widget and
// leaderboard reflect it. All done atomically in the public.zg_join RPC.
//
// Request:  POST { door?: string, note?: string, track?: 'artist'|'builder'|'creator' }
//           Authorization: Bearer <quick-auth-jwt>  (sdk.quickAuth.fetch)
// Response: { ok: true, count: number }

export const config = { runtime: 'edge' };

const DOMAIN = 'zabalgamez.com';
const JWKS_URL = 'https://auth.farcaster.xyz/.well-known/jwks.json';
const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const HAATZ = 'https://haatz.quilibrium.com';
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

let jwksCache = { keys: null, ts: 0 };
async function getJwks() {
  if (jwksCache.keys && Date.now() - jwksCache.ts < 3600000) return jwksCache.keys;
  const r = await fetch(JWKS_URL, { signal: AbortSignal.timeout(4000) });
  const j = await r.json();
  jwksCache = { keys: j.keys || [], ts: Date.now() };
  return jwksCache.keys;
}
function algParams(alg) {
  if (alg === 'RS256') return { imp: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, vrf: { name: 'RSASSA-PKCS1-v1_5' } };
  if (alg === 'ES256') return { imp: { name: 'ECDSA', namedCurve: 'P-256' }, vrf: { name: 'ECDSA', hash: 'SHA-256' } };
  if (alg === 'EdDSA') return { imp: { name: 'Ed25519' }, vrf: { name: 'Ed25519' } };
  return null;
}
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
  if (!r.ok) {
    console.error('zg_join sb error', r.status, (await r.text()).slice(0, 200));
    throw new Error('storage error ' + r.status);
  }
  const t = await r.text();
  return t ? JSON.parse(t) : null;
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
  const origin = req.headers.get('origin') || '*';
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

  // No storage in this deployment: report not-stored so the client falls
  // through to the full sign-up form. Never claim success when nothing was kept.
  if (!SB_URL || !SB_KEY) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  const profile = await resolveProfile(fid);

  let count;
  try {
    count = await sbRpc('zg_join', {
      p_fid: fid,
      p_door: door,
      p_note: note || null,
      p_username: profile.username || null,
      p_pfp: profile.pfpUrl || null,
      p_points: SIGNUP_POINTS,
      p_track: track,
    });
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502, origin);
  }

  return json({ ok: true, count: Number(count || 0) }, 200, origin);
}

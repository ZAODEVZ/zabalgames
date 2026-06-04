// ZABAL Gamez - Bonfire read spot endpoint (POST /api/bonfire-ask).
//
// Two actions:
//   action:'query'  (default, anonymous) - logs what people ask the read spot
//     (graph.html) to Upstash zg:bonfire:queries:v1, so we can see what the
//     community searches for. No auth - searching is open.
//   action:'submit' (authenticated) - the contribution intake. Pushes an
//     author-tagged item to the pending queue zg:bonfire:pending with the FID
//     VERIFIED server-side from a Quick Auth JWT (never a client-sent FID). ZOE
//     drains that queue and promotes approved items into the canonical Bonfire
//     graph (Option A in docs/research/771; the ZOE-side contract).
//
// Storage: Upstash Redis over REST - zero-build edge fn like api/track.mjs.
//   - Query log uses the site KV (KV_REST_API_URL/TOKEN).
//   - The pending queue can live in a DEDICATED Upstash DB so the token handed to
//     ZOE cannot touch the query logs: set BONFIRE_QUEUE_KV_REST_API_URL/TOKEN.
//     Falls back to the site KV if those are unset (shared DB is fine for v1).
// No-ops gracefully (verifies + returns ok) if the relevant KV env is absent.
//
// Request (query):  POST { q: string }
// Request (submit): POST { action:'submit', type, title?, body, url? }
//                   Authorization: Bearer <quick-auth-jwt>
// Response: { ok: true, stored: boolean, id?: string }

export const config = { runtime: 'edge' };

const DOMAIN = 'zabalgamez.com';
const JWKS_URL = 'https://auth.farcaster.xyz/.well-known/jwks.json';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const HAATZ = 'https://haatz.quilibrium.com';

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
// Dedicated queue DB if configured, else the site KV.
const QUEUE_URL = (process.env.BONFIRE_QUEUE_KV_REST_API_URL || KV_URL);
const QUEUE_TOKEN = (process.env.BONFIRE_QUEUE_KV_REST_API_TOKEN || KV_TOKEN);

const QUERIES_KEY = 'zg:bonfire:queries:v1';
const QUERIES_MAX = 500;
const PENDING_KEY = 'zg:bonfire:pending';
const PENDING_MAX = 1000;
const TYPES = new Set(['fact', 'project', 'doc']);

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

async function kvPipeline(url, token, cmds) {
  const r = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

// --- Quick Auth verification (same approach as api/track.mjs) ---
function b64urlToBytes(b64url) {
  const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64urlToJson(b64url) { return JSON.parse(new TextDecoder().decode(b64urlToBytes(b64url))); }

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
  const jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) throw new Error('unknown kid');
  if (jwk.alg && jwk.alg !== header.alg) throw new Error('alg mismatch');
  const key = await crypto.subtle.importKey('jwk', jwk, params.imp, false, ['verify']);
  const data = new TextEncoder().encode(`${h}.${p}`);
  const ok = await crypto.subtle.verify(params.vrf, key, b64urlToBytes(s), data);
  if (!ok) throw new Error('bad signature');
  // Claims are REQUIRED, not optional: a token that omits exp/aud/iss must be
  // rejected, never silently accepted (60s skew allowance on exp).
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now - 60) throw new Error('expired');
  if (payload.aud !== domain) throw new Error('aud mismatch');
  if (!payload.iss || !String(payload.iss).includes('auth.farcaster.xyz')) throw new Error('iss mismatch');
  const fid = Number(payload.sub);
  if (!fid) throw new Error('no sub');
  return fid;
}

async function resolveUsername(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2000) });
    if (!r.ok) return null;
    return (await r.json()).users?.[0]?.username || null;
  } catch { return null; }
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, origin);

  let body = {};
  try { body = await req.json(); } catch {}
  const action = String(body.action || 'query');

  // --- submit: authenticated contribution into the pending queue ---
  if (action === 'submit') {
    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ error: 'no token' }, 401, origin);
    let fid;
    try { fid = await verifyQuickAuth(token, DOMAIN); }
    catch (e) { return json({ error: 'invalid token', detail: e.message }, 401, origin); }

    const type = String(body.type || '').toLowerCase();
    if (!TYPES.has(type)) return json({ error: 'bad type' }, 400, origin);
    const text = String(body.body || '').trim().slice(0, 2000);
    if (!text) return json({ error: 'empty body' }, 400, origin);
    const title = String(body.title || '').trim().slice(0, 120);
    let url = String(body.url || '').trim().slice(0, 300);
    if (url && !/^https?:\/\//i.test(url)) url = '';

    if (!QUEUE_URL || !QUEUE_TOKEN) return json({ ok: true, stored: false, note: 'queue not configured' }, 200, origin);

    const username = await resolveUsername(fid);
    const id = 'zg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
    const item = JSON.stringify({
      id, fid, username, type, title: title || null, body: text,
      url: url || null, source: 'zabalgames-web', status: 'pending', ts: Date.now(),
    });
    try {
      await kvPipeline(QUEUE_URL, QUEUE_TOKEN, [
        ['LPUSH', PENDING_KEY, item],
        ['LTRIM', PENDING_KEY, '0', String(PENDING_MAX - 1)],
      ]);
    } catch (e) {
      return json({ ok: false, stored: false, detail: e.message }, 502, origin);
    }
    return json({ ok: true, stored: true, id }, 200, origin);
  }

  // --- query: anonymous search logging ---
  const q = String(body.q || '').trim().slice(0, 120);
  if (!q) return json({ error: 'empty query' }, 400, origin);
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, stored: false, note: 'KV not configured' }, 200, origin);
  try {
    await kvPipeline(KV_URL, KV_TOKEN, [
      ['LPUSH', QUERIES_KEY, JSON.stringify({ q, ts: Date.now() })],
      ['LTRIM', QUERIES_KEY, '0', String(QUERIES_MAX - 1)],
    ]);
  } catch (e) {
    return json({ ok: false, stored: false, detail: e.message }, 502, origin);
  }
  return json({ ok: true, stored: true }, 200, origin);
}

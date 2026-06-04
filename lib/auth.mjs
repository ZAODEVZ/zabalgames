// ZABAL Gamez - shared Farcaster Quick Auth verification for the edge functions.
//
// Single source of truth for the JWKS-backed Quick Auth JWT check, imported by
// api/track.mjs, api/join.mjs, and api/bonfire-ask.mjs (previously copy-pasted
// in all three). Zero-dependency, edge-safe Web Crypto - no npm, no build step,
// same model as the rest of api/. A verification change is now made once here.

const JWKS_URL = 'https://auth.farcaster.xyz/.well-known/jwks.json';

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

// JWKS cached in the isolate for an hour.
let jwksCache = { keys: null, ts: 0 };
async function getJwks() {
  if (jwksCache.keys && Date.now() - jwksCache.ts < 3600000) return jwksCache.keys;
  const r = await fetch(JWKS_URL, { signal: AbortSignal.timeout(4000) });
  const j = await r.json();
  jwksCache = { keys: j.keys || [], ts: Date.now() };
  return jwksCache.keys;
}

// Map JWT alg -> Web Crypto import + verify params (RSA, P-256, Ed25519).
function algParams(alg) {
  if (alg === 'RS256') return { imp: { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, vrf: { name: 'RSASSA-PKCS1-v1_5' } };
  if (alg === 'ES256') return { imp: { name: 'ECDSA', namedCurve: 'P-256' }, vrf: { name: 'ECDSA', hash: 'SHA-256' } };
  if (alg === 'EdDSA') return { imp: { name: 'Ed25519' }, vrf: { name: 'Ed25519' } };
  return null;
}

// Verify a Quick Auth JWT against the Farcaster JWKS and return the FID
// (payload.sub). Throws on any failure. Claims are REQUIRED, not optional: a
// token that omits exp/aud/iss is rejected, never silently accepted.
export async function verifyQuickAuth(token, domain) {
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
  // 60s skew allowance on exp.
  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now - 60) throw new Error('expired');
  if (payload.aud !== domain) throw new Error('aud mismatch');
  if (!payload.iss || !String(payload.iss).includes('auth.farcaster.xyz')) throw new Error('iss mismatch');
  const fid = Number(payload.sub);
  if (!fid) throw new Error('no sub');
  return fid;
}

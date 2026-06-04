// ZABAL Gamez - Farcaster Mini App webhook (POST /api/webhook).
//
// Farcaster POSTs a JSON Farcaster Signature envelope here when a user adds the
// app or toggles notifications (referenced by `webhookUrl` in the manifest).
// We store the notification token + url per FID so api/notify.mjs can reach them.
//
// The JSON Farcaster Signature (JFS) envelope is verified before anything is
// stored: the Ed25519 signature must check out against the app key carried in the
// header (type 'app_key') over the compact `${header}.${payload}` message, and -
// when FARCASTER_HUB_URL is set - that app key must be an active on-chain signer
// for the claimed FID (Key Registry, read via the hub's onChainSignersByFid).
// A bad/missing signature is ALWAYS rejected. The FID binding fails OPEN on hub
// errors or an unparseable response, so a hub outage never blocks a legitimate
// registration; without FARCASTER_HUB_URL it is skipped (signature-only, no
// extra network call). Point FARCASTER_HUB_URL at a hub exposing /v1/* and
// verify on a Preview before relying on it.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const TOKENS_KEY = 'zabal:notif:tokens';
// Optional Farcaster hub base URL exposing /v1/onChainSignersByFid. When set,
// the webhook binds the signing app key to the claimed FID; when unset, the
// binding step is skipped entirely (no network call).
const HUB_URL = (process.env.FARCASTER_HUB_URL || '').replace(/\/$/, '');

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function b64urlToJson(b64url) {
  const b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  let s = '';
  for (let i = 0; i < bin.length; i++) s += String.fromCharCode(bin.charCodeAt(i));
  return JSON.parse(decodeURIComponent(escape(s)));
}

function b64urlToBytes(b64url) {
  const b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex) {
  const h = String(hex).replace(/^0x/, '');
  if (h.length % 2 !== 0 || /[^0-9a-fA-F]/.test(h)) throw new Error('bad hex key');
  const out = new Uint8Array(h.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(h.substr(i * 2, 2), 16);
  return out;
}

// Verify the JFS envelope: Ed25519 signature over `${header}.${payload}` (the
// raw base64url strings) by the app key in the header. Throws on any failure.
async function verifyJfs(envelope) {
  const header = b64urlToJson(envelope.header);
  if (header.type !== 'app_key') throw new Error('unexpected header type');
  const keyBytes = hexToBytes(header.key);
  if (keyBytes.length !== 32) throw new Error('bad key length');
  if (!envelope.signature) throw new Error('missing signature');
  const sig = b64urlToBytes(envelope.signature);
  const msg = new TextEncoder().encode(`${envelope.header}.${envelope.payload}`);
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'Ed25519' }, false, ['verify']);
  const ok = await crypto.subtle.verify({ name: 'Ed25519' }, key, sig, msg);
  if (!ok) throw new Error('bad signature');
}

// Normalize a key from any reasonable hub serialization (0x-hex, bare hex, or
// base64/base64url bytes) to lowercase 0x-hex for comparison. Returns null if
// the value is not a recognizable key.
function normalizeKey(v) {
  if (typeof v !== 'string' || !v) return null;
  if (/^0x[0-9a-fA-F]+$/.test(v)) return v.toLowerCase();
  if (/^[0-9a-fA-F]+$/.test(v) && v.length % 2 === 0) return '0x' + v.toLowerCase();
  try {
    let hex = '';
    for (const b of b64urlToBytes(v)) hex += b.toString(16).padStart(2, '0');
    return hex ? '0x' + hex : null;
  } catch { return null; }
}

// Is `keyHex` an ACTIVE on-chain signer for `fid`? Returns true / false /
// null (indeterminate). Callers MUST fail open on null. Folds the signer event
// log (ADD then REMOVE) into the live set; if we parse zero keys we assume our
// parser does not match this hub's shape and return null rather than reject.
async function keyBoundToFid(fid, keyHex) {
  if (!HUB_URL) return null;
  let j;
  try {
    const r = await fetch(`${HUB_URL}/v1/onChainSignersByFid?fid=${encodeURIComponent(fid)}`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!r.ok) return null;
    j = await r.json();
  } catch { return null; }
  const events = Array.isArray(j && j.events) ? j.events : null;
  const want = normalizeKey(keyHex);
  if (!events || !want) return null;
  const active = new Set();
  for (const ev of events) {
    const body = ev && ev.signerEventBody;
    const k = body && normalizeKey(body.key);
    if (!k) continue;
    const t = body.eventType;
    if (t === 'SIGNER_EVENT_TYPE_ADD' || t === 1) active.add(k);
    else if (t === 'SIGNER_EVENT_TYPE_REMOVE' || t === 2) active.delete(k);
  }
  if (active.size === 0) return null;
  return active.has(want);
}

async function kv(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let envelope;
  try { envelope = await req.json(); } catch { return json({ error: 'bad json' }, 400); }

  let header, payload;
  try {
    header = b64urlToJson(envelope.header);
    payload = b64urlToJson(envelope.payload);
  } catch {
    return json({ error: 'bad envelope' }, 400);
  }

  try {
    await verifyJfs(envelope);
  } catch (e) {
    return json({ error: 'bad signature', detail: e.message }, 401);
  }

  const fid = header && header.fid;
  const event = payload && payload.event;
  if (!fid || !event) return json({ error: 'missing fid/event' }, 400);
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, stored: false });

  // Bind the signing app key to the claimed FID (only when a hub is configured;
  // null = indeterminate, so we proceed on the verified signature alone).
  if ((await keyBoundToFid(fid, header.key)) === false) {
    return json({ error: 'key not registered to fid' }, 401);
  }

  try {
    if (event === 'frame_added' || event === 'notifications_enabled') {
      const nd = payload.notificationDetails;
      if (nd && nd.token && nd.url) {
        await kv([['HSET', TOKENS_KEY, String(fid), JSON.stringify({ url: nd.url, token: nd.token })]]);
      }
    } else if (event === 'frame_removed' || event === 'notifications_disabled') {
      await kv([['HDEL', TOKENS_KEY, String(fid)]]);
    }
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502);
  }

  return json({ ok: true });
}

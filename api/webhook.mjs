// ZABAL Gamez - Farcaster Mini App webhook (POST /api/webhook).
//
// Farcaster POSTs a JSON Farcaster Signature envelope here when a user adds the
// app or toggles notifications (referenced by `webhookUrl` in the manifest).
// We store the notification token + url per FID so api/notify.mjs can reach them.
//
// The JSON Farcaster Signature (JFS) envelope is verified before anything is
// stored: the Ed25519 signature must check out against the app key carried in the
// header (type 'app_key') over the compact `${header}.${payload}` message. A bad
// or missing signature is rejected. Residual hardening: bind that app key to the
// claimed FID via an on-chain Key Registry / hub lookup - left out here because
// this edge runtime has no allowlisted hub endpoint to query.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const TOKENS_KEY = 'zabal:notif:tokens';

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

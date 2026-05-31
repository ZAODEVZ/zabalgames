// ZABAL Gamez - Farcaster Mini App webhook (POST /api/webhook).
//
// Farcaster POSTs a JSON Farcaster Signature envelope here when a user adds the
// app or toggles notifications (referenced by `webhookUrl` in the manifest).
// We store the notification token + url per FID so api/notify.mjs can reach them.
//
// v1 stores tokens without verifying the JFS signature (low abuse surface - the
// worst case is a junk token that simply fails on send). Signature verification
// is a clear next step; see api/README.md.

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

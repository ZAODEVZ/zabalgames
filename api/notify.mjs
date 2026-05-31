// ZABAL Gamez - send a notification to everyone who added the app (POST /api/notify).
//
// Admin-only: requires Authorization: Bearer <NOTIFY_SECRET>. Reads the stored
// per-FID notification tokens (zg_notif_tokens, written by api/webhook.mjs),
// groups them by their Farcaster notification server URL, and POSTs the
// notification in batches.
//
// Body: { "title": string (<=32), "body": string (<=128), "targetUrl"?: string }
//   targetUrl defaults to https://zabalgamez.com and must be within the domain.
//
// Env: NOTIFY_SECRET (required), SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.

export const config = { runtime: 'edge' };

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOTIFY_SECRET = process.env.NOTIFY_SECRET;
const SITE = 'https://zabalgamez.com';
const BATCH = 100;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function sbSelect(path) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('sb ' + r.status);
  return r.json();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const auth = req.headers.get('authorization') || '';
  if (!NOTIFY_SECRET || auth !== `Bearer ${NOTIFY_SECRET}`) return json({ error: 'unauthorized' }, 401);
  if (!SB_URL || !SB_KEY) return json({ error: 'storage not configured' }, 503);

  let body = {};
  try { body = await req.json(); } catch {}
  const title = String(body.title || '').slice(0, 32);
  const text = String(body.body || '').slice(0, 128);
  const targetUrl = String(body.targetUrl || SITE);
  if (!title || !text) return json({ error: 'title and body required' }, 400);
  if (!targetUrl.startsWith(SITE)) return json({ error: 'targetUrl must be within ' + SITE }, 400);

  let rows;
  try { rows = await sbSelect('zg_notif_tokens?select=url,token'); } catch (e) { return json({ error: e.message }, 502); }

  const byUrl = {};
  for (const row of (Array.isArray(rows) ? rows : [])) {
    if (row && row.url && row.token) (byUrl[row.url] = byUrl[row.url] || []).push(row.token);
  }

  const notificationId = `zabal-${Date.now()}`;
  let sent = 0, calls = 0;
  for (const url of Object.keys(byUrl)) {
    for (const tokens of chunk(byUrl[url], BATCH)) {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId, title, body: text, targetUrl, tokens }),
          signal: AbortSignal.timeout(5000),
        });
        sent += tokens.length;
        calls++;
      } catch { /* continue other batches */ }
    }
  }

  return json({ ok: true, recipients: sent, calls });
}

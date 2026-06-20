// ZABAL Gamez - "we are live" push (POST /api/live-notify).
//
// Sends a Farcaster notification to everyone who added the app the moment a stream goes
// live, so opted-in people get pulled to /live. No cron and no plan limits: any /live
// visitor pings this on load and the server decides whether to actually send.
//
// Safe by construction:
//   - SERVER verifies the stream is really live (decapi.me, keyless) before sending, so a
//     client cannot trigger a false alert.
//   - A 60s poll lock means we hit decapi at most once a minute no matter how many visitors
//     ping us.
//   - A per-stream sentinel means the push fires ONCE per live session (re-armed when the
//     stream goes offline).
//
//   POST /api/live-notify  ->  { ok, live, sent?, recipients?, skipped? }
//
// Graceful no-op (200) when KV env is absent. Reuses the token store api/webhook.mjs fills
// (zabal:notif:tokens) - the same one api/workshop-reminders.mjs and api/notify.mjs send to.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const TOKENS_KEY = 'zabal:notif:tokens';
const POLL_LOCK = 'zabal:live:poll-lock';     // throttles the decapi check to once / 60s
const NOTIFIED = 'zabal:live:notified';        // per-session sentinel - send once per stream
const SEQ = 'zabal:live:notif-seq';            // unique notificationId per send
const DECAPI = 'https://decapi.me/twitch';
const CHANNEL = 'bettercallzaal';
const SITE = 'https://zabalgamez.com';
const BATCH = 100;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}

async function kv(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function decapi(path) {
  try {
    const r = await fetch(`${DECAPI}${path}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return '';
    return (await r.text()).trim();
  } catch { return ''; }
}
function offlineish(s) {
  if (!s) return true;
  return /offline|is not (live|streaming)|no (stream|user)|error|unable/i.test(s);
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true });
  if (req.method !== 'POST') return json({ ok: false, error: 'POST only' }, 405);
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, skipped: 'kv-unconfigured' });

  // Throttle: only the first caller in any 60s window does the real check; everyone else
  // returns immediately. Keeps decapi + this function cheap no matter the traffic.
  try {
    const lock = await kv([['SET', POLL_LOCK, '1', 'NX', 'EX', '60']]);
    if (lock?.[0]?.result !== 'OK') return json({ ok: true, skipped: 'throttled' });
  } catch (e) {
    return json({ ok: false, reason: 'storage', detail: e.message }, 502);
  }

  // Verify live state server-side.
  const uptime = await decapi(`/uptime/${CHANNEL}`);
  const live = !offlineish(uptime);

  if (!live) {
    // Re-arm so the next stream notifies again.
    try { await kv([['DEL', NOTIFIED]]); } catch { /* best effort */ }
    return json({ ok: true, live: false });
  }

  // Live: claim the per-session sentinel. If we don't get it, we already notified this stream.
  try {
    const claim = await kv([['SET', NOTIFIED, '1', 'NX', 'EX', '43200']]); // 12h safety
    if (claim?.[0]?.result !== 'OK') return json({ ok: true, live: true, skipped: 'already-notified' });
  } catch (e) {
    return json({ ok: false, reason: 'storage', detail: e.message }, 502);
  }

  // Load tokens (written by api/webhook.mjs), grouped by notification server URL.
  let flat = [], seq = 0;
  try {
    const res = await kv([['HGETALL', TOKENS_KEY], ['INCR', SEQ]]);
    flat = res?.[0]?.result || [];
    seq = Number(res?.[1]?.result || Date.now());
  } catch (e) {
    try { await kv([['DEL', NOTIFIED]]); } catch { /* release so a retry can send */ }
    return json({ ok: false, reason: 'tokens', detail: e.message }, 502);
  }
  const byUrl = {};
  for (let i = 0; i < flat.length; i += 2) {
    try {
      const { url, token } = JSON.parse(flat[i + 1]);
      if (url && token) (byUrl[url] = byUrl[url] || []).push(token);
    } catch { /* skip malformed */ }
  }

  const title = 'Live now'.slice(0, 32);
  const rawTitle = await decapi(`/status/${CHANNEL}`);
  const streamTitle = offlineish(rawTitle) ? '' : rawTitle;
  const body = (streamTitle
    ? `${streamTitle} - streaming now. Tap to watch.`
    : 'A ZABAL Gamez session is streaming now. Tap to watch.').slice(0, 128);
  const targetUrl = `${SITE}/live`;
  const notificationId = `zabal-live-${seq}`;

  let sent = 0, calls = 0;
  for (const url of Object.keys(byUrl)) {
    for (const tokens of chunk(byUrl[url], BATCH)) {
      try {
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId, title, body, targetUrl, tokens }),
          signal: AbortSignal.timeout(5000),
        });
        sent += tokens.length;
        calls++;
      } catch { /* continue other batches */ }
    }
  }

  return json({ ok: true, live: true, sent: true, recipients: sent, calls });
}

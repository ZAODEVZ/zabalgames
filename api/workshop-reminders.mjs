// ZABAL Gamez - workshop reminder notifications (GET/POST /api/workshop-reminders).
//
// A Vercel cron (see vercel.json) that, on a day with a scheduled workshop, pushes a
// Farcaster notification to everyone who added the app, so people who opted in get a
// heads-up to tune in. The public-channel version of this is api/daily-cast.mjs (a
// cast into /zabal); this is the private push to added-app users - the documented #1
// retention lever, reusing the token store api/webhook.mjs fills.
//
// Day-of by design: workshop-leads.json carries a date (YYYY-MM-DD) and a free-text
// `when` ("Mon Jun 1 2026, 6-7am EST"), not a machine start time, so we send a morning
// reminder on the session day rather than a precise "starts in 1 hour". To upgrade to
// hour-precision later, add a `start_utc` ISO field to dated leads and an hourly cron.
//
// Graceful no-op contract (never hard-fail):
//   - Redis env absent     -> 200 { skipped: 'kv-unconfigured' }
//   - no lead dated today   -> 200 { skipped: 'no-session-today' }   (no sentinel claimed)
//   - already sent today    -> 200 { skipped: 'already-sent' }
//   - no added-app tokens   -> 200 { ok: true, recipients: 0 }
//
// Env: KV_REST_API_URL/TOKEN. No NOTIFY_SECRET needed - this is server-side cron, not
// the admin sender (api/notify.mjs).

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const TOKENS_KEY = 'zabal:notif:tokens';
const SITE = 'https://zabalgamez.com';
const BATCH = 100;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
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

// Build a <=32 char title and a <=128 char body from today's lead(s).
function buildNotification(leads) {
  if (leads.length === 1) {
    const l = leads[0];
    const org = l.org ? ` (${l.org})` : '';
    const topic = String(l.topic || '').trim().replace(/\.$/, '');
    const when = l.when || l.date || '';
    return {
      title: 'Workshop today'.slice(0, 32),
      body: `${l.name}${org} on ${topic}. ${when}`.slice(0, 128),
    };
  }
  const names = leads.map((l) => l.name).filter(Boolean);
  const lead = names.length > 2 ? `${names[0]}, ${names[1]} and more` : names.join(' and ');
  return {
    title: `${leads.length} workshops today`.slice(0, 32),
    body: `${lead}. Tap to watch live.`.slice(0, 128),
  };
}

export default async function handler() {
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, skipped: 'kv-unconfigured' });

  const today = new Date().toISOString().slice(0, 10);

  // Find every lead dated today.
  let leads;
  try {
    const r = await fetch(`${SITE}/data/workshop-leads.json`, { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error('leads ' + r.status);
    const d = await r.json();
    leads = (d.leads || []).filter((l) => l.date === today);
  } catch (e) {
    return json({ ok: false, reason: 'leads fetch failed', detail: e.message }, 502);
  }
  if (!leads.length) return json({ ok: true, skipped: 'no-session-today' });

  // Idempotency: claim the day before sending. NX returns null if already claimed.
  const sentinel = `zabal:cron:workshop-reminder:${today}`;
  try {
    const res = await kv([['SET', sentinel, '1', 'NX', 'EX', '172800']]);
    if (res?.[0]?.result !== 'OK') return json({ ok: true, skipped: 'already-sent' });
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502);
  }

  // Load the notification tokens (written by api/webhook.mjs) and group by server URL.
  let flat = [];
  try {
    const res = await kv([['HGETALL', TOKENS_KEY]]);
    flat = res?.[0]?.result || [];
  } catch (e) {
    try { await kv([['DEL', sentinel]]); } catch { /* best-effort */ } // release so a retry can send
    return json({ ok: false, reason: 'tokens fetch failed', detail: e.message }, 502);
  }
  const byUrl = {};
  for (let i = 0; i < flat.length; i += 2) {
    try {
      const { url, token } = JSON.parse(flat[i + 1]);
      if (url && token) (byUrl[url] = byUrl[url] || []).push(token);
    } catch { /* skip malformed */ }
  }

  const { title, body } = buildNotification(leads);
  const targetUrl = `${SITE}/live`;
  const notificationId = `zabal-reminder-${today}`; // stable per day -> hosts dedupe

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

  return json({ ok: true, sent: true, recipients: sent, calls, sessions: leads.length });
}

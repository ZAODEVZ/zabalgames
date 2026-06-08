// ZABAL Gamez - daily session cast (GET/POST /api/daily-cast).
//
// A Vercel cron (see vercel.json) that, on a day with a scheduled workshop, casts
// "what's on today" into the /zabal channel. Reads data/workshop-leads.json for a
// lead dated today and posts via Neynar. KV-sentinel idempotency means a cold-start
// retry or a double-fire never double-posts.
//
// Graceful no-op contract (never hard-fail, never block):
//   - Redis env absent      -> 200 { skipped: 'kv-unconfigured' }
//   - Neynar env absent     -> 200 { skipped: 'neynar-unconfigured' }   (no sentinel claimed)
//   - no lead dated today   -> 200 { skipped: 'no-session-today' }      (no sentinel claimed)
//   - already cast today    -> 200 { skipped: 'already-cast' }
//   - the cast POST fails   -> releases the sentinel so the next run retries
//
// Env: KV_REST_API_URL/TOKEN, NEYNAR_API_KEY, NEYNAR_SIGNER_UUID, optional CRON_SECRET.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const NEYNAR_SIGNER_UUID = process.env.NEYNAR_SIGNER_UUID || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

const SITE = 'https://zabalgamez.com';
const CHANNEL_ID = 'zabal';
const SEASON_START = Date.parse('2026-06-01T00:00:00Z'); // Day 1

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

function buildText(leads, day) {
  // One session: the full single-line pitch with an RSVP link.
  if (leads.length === 1) {
    const lead = leads[0];
    const org = lead.org ? ` (${lead.org})` : '';
    const topic = String(lead.topic || '').trim().replace(/\.$/, '');
    const when = lead.when || lead.date;
    const rsvp = lead.luma_url ? `\nRSVP: ${lead.luma_url}` : '';
    return `Day ${day} - ${lead.name}${org} on ${topic}. ${when}. Live and recorded.\n\nWatch: ${SITE}/live${rsvp}`;
  }
  // Two or more the same day: list them all so none is dropped from the channel.
  const lines = leads.map((l) => {
    const org = l.org ? ` (${l.org})` : '';
    const topic = String(l.topic || '').trim().replace(/\.$/, '');
    const when = l.when || l.date || '';
    return `- ${l.name}${org}: ${topic}${when ? ` (${when})` : ''}`;
  });
  return `Day ${day} - ${leads.length} ZABAL Gamez sessions today:\n${lines.join('\n')}\n\nWatch: ${SITE}/live`;
}

async function publishCast(text) {
  const r = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: { 'x-api-key': NEYNAR_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signer_uuid: NEYNAR_SIGNER_UUID,
      text,
      channel_id: CHANNEL_ID,
      embeds: [{ url: `${SITE}/live` }],
    }),
    signal: AbortSignal.timeout(10000),
  });
  return r.ok;
}

export default async function handler(req) {
  if (req.method !== 'GET' && req.method !== 'POST') return json({ ok: false, reason: 'method not allowed' }, 405);

  // Cron auth: enforced only if CRON_SECRET is configured.
  if (CRON_SECRET) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${CRON_SECRET}`) return json({ ok: false, reason: 'unauthorized' }, 401);
  }

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, skipped: 'kv-unconfigured' });
  if (!NEYNAR_API_KEY || !NEYNAR_SIGNER_UUID) return json({ ok: true, skipped: 'neynar-unconfigured' });

  const today = new Date().toISOString().slice(0, 10);

  // Find every lead dated today (a day can have more than one session).
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

  // Idempotency: claim the day before posting. NX returns null if already claimed.
  const sentinel = `zabal:cron:daily-cast:${today}`;
  try {
    const res = await kvPipeline([['SET', sentinel, '1', 'NX', 'EX', '172800']]);
    const claimed = res?.[0]?.result === 'OK';
    if (!claimed) return json({ ok: true, skipped: 'already-cast' });
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502);
  }

  const day = Math.floor((Date.parse(today + 'T00:00:00Z') - SEASON_START) / 86400000) + 1;
  const text = buildText(leads, day);
  const presenters = leads.map((l) => l.name);

  let posted = false;
  try { posted = await publishCast(text); } catch { posted = false; }

  if (!posted) {
    // Release the claim so the next run retries rather than silently dropping the day.
    try { await kvPipeline([['DEL', sentinel]]); } catch { /* best-effort */ }
    return json({ ok: false, reason: 'cast failed', presenters }, 502);
  }

  return json({ ok: true, cast: true, day, sessions: leads.length, presenters });
}

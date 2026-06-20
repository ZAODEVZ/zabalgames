// ZABAL Gamez - monthly ZAO 2048 winner cast (GET/POST /api/monthly-winner).
//
// A Vercel cron (see vercel.json) that runs on the 1st of each month, reads LAST month's
// ZAO 2048 board, and casts the champion (and runners-up) into the /zabal channel - then the
// board is fresh for the new month. Recurring reason to come back and reclaim the crown.
//
// Reads the same monthly board api/game.mjs writes: zabal:game:zao2048:<YYYY-MM>.
//
// Graceful no-op contract (never hard-fail):
//   - Redis env absent      -> 200 { skipped: 'kv-unconfigured' }
//   - Neynar env absent     -> 200 { skipped: 'neynar-unconfigured' }   (no sentinel claimed)
//   - no scores last month  -> 200 { skipped: 'no-scores' }             (no sentinel claimed)
//   - already cast          -> 200 { skipped: 'already-cast' }
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
const GAME = 'zao2048';

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

// YYYY-MM of the month before `now`, plus a human label ("May 2026"), in UTC.
function lastMonth(now = new Date()) {
  const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
  const key = d.toISOString().slice(0, 7);
  const label = d.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return { key, label };
}

function buildText(rows, label) {
  const champ = rows[0];
  const lines = rows.slice(0, 3).map((r, i) => `${i + 1}. @${r.handle} - ${r.score}`);
  const runnerUp = rows.length > 1 ? `\n${lines.join('\n')}` : '';
  return `ZAO 2048 - ${label} champion: @${champ.handle} with ${champ.score}.` +
    runnerUp +
    `\n\nNew month, fresh board. Merge the ZAO ecosystem up to THE ZAO and take the crown: ${SITE}/play`;
}

async function publishCast(text) {
  const r = await fetch('https://api.neynar.com/v2/farcaster/cast', {
    method: 'POST',
    headers: { 'x-api-key': NEYNAR_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      signer_uuid: NEYNAR_SIGNER_UUID,
      text,
      channel_id: CHANNEL_ID,
      embeds: [{ url: `${SITE}/play` }],
    }),
    signal: AbortSignal.timeout(10000),
  });
  return r.ok;
}

export default async function handler(req) {
  if (req.method !== 'GET' && req.method !== 'POST') return json({ ok: false, reason: 'method not allowed' }, 405);

  if (CRON_SECRET) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${CRON_SECRET}`) return json({ ok: false, reason: 'unauthorized' }, 401);
  }

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, skipped: 'kv-unconfigured' });
  if (!NEYNAR_API_KEY || !NEYNAR_SIGNER_UUID) return json({ ok: true, skipped: 'neynar-unconfigured' });

  const { key: monthKey, label } = lastMonth();

  // Read last month's top 3.
  let rows = [];
  try {
    const res = await kvPipeline([['ZREVRANGE', `zabal:game:${GAME}:${monthKey}`, '0', '2', 'WITHSCORES']]);
    const flat = (res?.[0]?.result) || [];
    for (let i = 0; i < flat.length; i += 2) rows.push({ handle: flat[i], score: Number(flat[i + 1]) });
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502);
  }
  if (!rows.length) return json({ ok: true, skipped: 'no-scores', month: monthKey });

  // Idempotency: claim the month before posting.
  const sentinel = `zabal:cron:monthly-winner:${monthKey}`;
  try {
    const res = await kvPipeline([['SET', sentinel, '1', 'NX', 'EX', '5184000']]); // 60d
    if (res?.[0]?.result !== 'OK') return json({ ok: true, skipped: 'already-cast', month: monthKey });
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502);
  }

  const text = buildText(rows, label);

  let posted = false;
  try { posted = await publishCast(text); } catch { posted = false; }

  if (!posted) {
    try { await kvPipeline([['DEL', sentinel]]); } catch { /* best-effort */ }
    return json({ ok: false, reason: 'cast failed', month: monthKey, winner: rows[0].handle }, 502);
  }

  return json({ ok: true, cast: true, month: monthKey, winner: rows[0].handle, top: rows });
}

// ZABAL Gamez - live presence heartbeat (POST/GET /api/present).
//
// Powers the "here now" counter on /live. Each open tab sends a heartbeat with a
// short-lived anonymous id; we keep a ZSET scored by timestamp and count the ids
// seen within a rolling window. No identity, no attribution - just a live count.
// No-ops (configured:false) when KV is absent, so the widget hides itself.
//
// Response: { configured: boolean, count: number }

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const KEY = 'zabal:live:present';
const WINDOW_MS = 75000;   // counted as present if seen within the last 75s
const KEY_TTL = 600;       // self-clean the whole set after 10 min of no traffic

function json(body) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
}

async function kvPipeline(cmds) {
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
  if (!KV_URL || !KV_TOKEN) return json({ configured: false, count: 0 });

  const now = Date.now();
  const floor = now - WINDOW_MS;

  // A POST with an id registers presence; a GET (or POST without id) just reads.
  let id = '';
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      id = String((body && body.id) || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
    } catch { /* no/invalid body - treat as a read */ }
  }

  // Prune stale entries first, register self (if any), then count what is left in window.
  const cmds = [['ZREMRANGEBYSCORE', KEY, '0', String(floor)]];
  if (id) {
    cmds.push(['ZADD', KEY, String(now), id]);
    cmds.push(['EXPIRE', KEY, String(KEY_TTL)]);
  }
  cmds.push(['ZCARD', KEY]);

  let res;
  try { res = await kvPipeline(cmds); }
  catch { return json({ configured: true, count: 0 }); }

  const count = Number(res?.[res.length - 1]?.result || 0);
  return json({ configured: true, count });
}

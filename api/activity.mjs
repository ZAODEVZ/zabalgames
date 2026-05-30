// ZABAL Gamez - activity feed endpoint (GET /api/activity).
//
// Public read for the presence widget. Returns the recent social actions and a
// count of distinct builders active today. Reads Vercel KV (Upstash) over REST.
// If KV is not configured it returns an empty, unconfigured payload so the
// widget can hide itself.
//
// Response: { configured: boolean, count: number, recent: Array<{
//   fid, username, pfpUrl, action, target, ts }> }

export const config = { runtime: 'edge' };

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const RECENT_KEY = 'zabal:activity:v1';

function json(body, maxAge = 10) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
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

export default async function handler() {
  if (!KV_URL || !KV_TOKEN) return json({ configured: false, count: 0, recent: [] });

  const today = new Date().toISOString().slice(0, 10);
  let res;
  try {
    res = await kvPipeline([
      ['LRANGE', RECENT_KEY, '0', '49'],
      ['SCARD', `zabal:present:${today}`],
      ['HLEN', 'zabal:joins'],
    ]);
  } catch {
    return json({ configured: true, count: 0, recent: [], joinsTotal: 0 });
  }

  const list = res?.[0]?.result || [];
  const count = Number(res?.[1]?.result || 0);
  const joinsTotal = Number(res?.[2]?.result || 0);
  const recent = list
    .map(s => { try { return JSON.parse(s); } catch { return null; } })
    .filter(Boolean);
  return json({ configured: true, count, recent, joinsTotal });
}

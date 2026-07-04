// ZABAL Gamez - win queue drain (GET /api/win-drain?token=<WIN_HOOK_SECRET>).
// ZOL (Pi) calls this on a cron to pop queued community-wins oldest-first and
// cast them. Requires WIN_HOOK_SECRET (fails closed if unset). Pops at most
// `n` items (default 1, to honor the 1-cast-per-10-min rate limit ZOL side).
export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const SECRET = process.env.WIN_HOOK_SECRET || '';
const QKEY = 'zabal:winqueue';

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
async function kv(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds), signal: AbortSignal.timeout(4000) });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

export default async function handler(req) {
  const url = new URL(req.url);
  if (!SECRET) return json({ error: 'WIN_HOOK_SECRET not set' }, 503);
  const t = url.searchParams.get('token') || (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  if (t !== SECRET) return json({ error: 'unauthorized' }, 401);
  if (!KV_URL || !KV_TOKEN) return json({ items: [], configured: false });
  const n = Math.min(parseInt(url.searchParams.get('n') || '1', 10) || 1, 10);
  const cmds = Array.from({ length: n }, () => ['LPOP', QKEY]);
  let res;
  try { res = await kv(cmds); } catch (e) { return json({ items: [], error: 'kv' }, 502); }
  const items = res.map((r) => r && r.result).filter(Boolean).map((s) => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
  return json({ items });
}

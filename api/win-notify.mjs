// ZABAL Gamez - win webhook receiver (POST /api/win-notify).
// Zaal sets this URL as SUBMIT_NOTIFY_URL on the zabalgamez Vercel project.
// Body: { "text": string }. If the text contains "community-win", the item is
// queued (Redis list zabal:winqueue) for ZOL to cast to the /zabal channel.
// Anything else is a review ping -> logged as a no-op, not queued.
// Optional auth: if WIN_HOOK_SECRET is set, require ?token=<secret> or
// Authorization: Bearer <secret>. If unset, accepts unauthenticated so it
// works the moment the URL is wired (harden later by setting the secret).
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
function authed(req, url) {
  if (!SECRET) return true;
  const t = url.searchParams.get('token') || (req.headers.get('authorization') || '').replace(/^Bearer /, '');
  return t === SECRET;
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);
  const url = new URL(req.url);
  if (!authed(req, url)) return json({ error: 'unauthorized' }, 401);
  let text = '';
  try { text = String((await req.json()).text || ''); } catch (e) { return json({ error: 'bad json' }, 400); }
  if (!text) return json({ error: 'missing text' }, 400);
  if (!text.includes('community-win')) return json({ ok: true, queued: false, reason: 'not a community-win' });
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, queued: false, configured: false });
  try { await kv([['RPUSH', QKEY, JSON.stringify({ text, ts: Date.now() })]]); }
  catch (e) { return json({ ok: false, error: 'queue failed' }, 502); }
  return json({ ok: true, queued: true });
}

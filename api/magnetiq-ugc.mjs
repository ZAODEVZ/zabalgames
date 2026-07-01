export const config = { runtime: 'edge' };

// ZABAL Gamez - Magnetiq UGC receiver (POST /api/magnetiq-ugc).
//
// Magnetiq collects UGC for the ZABAL magnet (video, image, art, links). This endpoint receives a
// Magnetiq submission and writes it into the unified store (api/submission-intake keys) as
// source:'magnetiq', so magnet UGC shows up on the site alongside every other submission - no
// builder registration. Owner wires Magnetiq (webhook / Zapier / a Gmail-forward of the notification
// email) to POST here once; that config is the only owner-blocked piece.
//
// AUTH: Bearer <MAGNETIQ_SECRET or ADMIN_KEY>  (or ?key=)
// PAYLOAD (flexible - maps common field names; send whatever Magnetiq provides):
//   { handle?|farcaster?|username?, wallet?|address?, email?|submittedBy?,
//     url?|mediaUrl?|media?|content?|link?|image?|video?|file?,
//     title?|project?|campaign?|name?, track?('artist'|'builder'|'creator'),
//     type?, description?|note?|answer? }
// A builder key is required: handle, wallet, or email (Magnetiq usually has at least the email).

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const SECRET = process.env.MAGNETIQ_SECRET || process.env.ADMIN_KEY || '';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' };
function json(obj, status = 200) { return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } }); }
async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, { method: 'POST', headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
const cleanHandle = (s) => (String(s || '').toLowerCase().replace(/^@/, '').replace(/[^a-z0-9._-]/g, '').slice(0, 40) || null);
const cleanWallet = (s) => { const v = String(s || '').trim().toLowerCase(); return /^0x[0-9a-f]{40}$/.test(v) ? v : null; };
const cleanUrl = (s) => { try { const u = new URL(String(s)); return (u.protocol === 'https:' || u.protocol === 'http:') ? u.toString() : null; } catch { return null; } };
const TRACKS = ['artist', 'builder', 'creator'];
const cleanTrack = (s) => (TRACKS.includes(slug(s)) ? slug(s) : null);
const TYPES = ['video', 'image', 'app', 'repo', 'music', 'audio', 'link', 'other'];
const cleanType = (s) => (TYPES.includes(slug(s)) ? slug(s) : null);
function inferType(url) {
  const u = String(url || '').toLowerCase();
  if (!u) return 'image'; // Magnetiq UGC is usually visual
  if (/github\.com/.test(u)) return 'repo';
  if (/youtube\.com|youtu\.be|vimeo\.com|\.mp4(\?|$)|\.mov(\?|$)/.test(u)) return 'video';
  if (/\.png(\?|$)|\.jpe?g(\?|$)|\.gif(\?|$)|\.webp(\?|$)|imagedelivery|seadn|pinata|ipfs/.test(u)) return 'image';
  if (/soundcloud|spotify|\.mp3(\?|$)|\.wav(\?|$)|audius|sound\.xyz/.test(u)) return 'music';
  if (/\.pages\.dev|\.vercel\.app|\.netlify|\.app(\/|$)/.test(u)) return 'app';
  return 'link';
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ ok: false, error: 'method not allowed' }, 405);
  const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const key = new URL(req.url).searchParams.get('key') || auth;
  if (!SECRET || key !== SECRET) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false });

  let b; try { b = await req.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
  const handle = cleanHandle(b.handle || b.farcaster || b.username);
  const wallet = cleanWallet(b.wallet || b.address);
  const email = (String(b.email || b.submittedBy || '').toLowerCase().trim().slice(0, 120) || null);
  const builderKey = handle || wallet || (email ? 'email-' + slug(email) : null);
  if (!builderKey) return json({ ok: false, error: 'need a handle, wallet, or email' }, 400);

  const url_ = cleanUrl(b.url || b.mediaUrl || b.media || b.content || b.link || b.image || b.video || b.file);
  const title = String(b.title || b.project || b.campaign || b.name || 'Magnetiq submission').slice(0, 80);
  const project = slug(title) || (url_ ? slug(url_) : '') || 'magnetiq';
  const id = builderKey + ':' + project;
  const rec = {
    id, source: 'magnetiq',
    builder: { handle, fid: null, wallet }, email,
    track: cleanTrack(b.track),
    type: cleanType(b.type) || inferType(url_),
    forBrand: 'zabal',
    project: title, url: url_, repo: null,
    note: (String(b.description || b.note || b.answer || '').slice(0, 500) || null),
    ts: Date.now(),
  };
  try {
    await kvPipeline([
      ['HSET', 'zabal:intake:items', id, JSON.stringify(rec)],
      ['ZADD', 'zabal:intake:feed', String(rec.ts), id],
      ['SADD', 'zabal:intake:builder:' + builderKey, id],
    ]);
    return json({ ok: true, id });
  } catch { return json({ ok: false, error: 'write failed' }, 502); }
}

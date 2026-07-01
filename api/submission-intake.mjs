export const config = { runtime: 'edge' };

// ZABAL Gamez - unified July submission store (GET/POST /api/submission-intake).
//
// The one place every July submission lands, no matter where it came from - the POIDH-claim
// watcher, the Magnetiq UGC receiver, a Farcaster tag capture, or Zaal adding one by hand.
// Builders never register here; the sources feed it.
//
//   POST (auth: Bearer ADMIN_KEY) { source, builder:{fid?,wallet?,handle?}, project, url, repo?, note?,
//                                    track?('artist'|'builder'|'creator'), type?, forBrand?('zabalgamez'|'zabal'|'zao') }
//     A submission is ANY piece of IP for ZABAL Gamez / ZABAL / The ZAO - video, image, app, music,
//     art, repo, or a link - sorted into one of the three tracks (artist/builder/creator). type is
//     inferred from the url when not given.
//     -> upserts by builder+project (stable id), so re-sending the same project UPDATES it, no dupes.
//   GET ?builder=<handle>            -> that builder's projects (for the profile page).
//   GET ?feed=recent&limit=50        -> recent submissions across all builders (default).
//
// Storage (Upstash Redis over REST, same pattern as the rest of api/):
//   zabal:intake:items          HASH  id -> JSON record
//   zabal:intake:feed           ZSET  ts -> id (recency)
//   zabal:intake:builder:<key>  SET   ids for one builder (key = handle | fid<n> | wallet)
// No-ops to { configured:false, items:[] } when KV is absent.

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const INTAKE_KEY = process.env.INTAKE_KEY || process.env.ADMIN_KEY || '';

// Locked to the canonical origin (was '*'). The site reads this same-origin (ACAO is not
// consulted for same-origin), so this only blocks cross-origin browser callers; the POST is
// also Bearer-auth'd (timingEq below) as defense-in-depth.
const CORS = {
  'Access-Control-Allow-Origin': 'https://zabalgamez.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
};
function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', ...CORS } });
}

async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

const slug = (s) => String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);

// A submission is ANY piece of IP made for ZABAL Gamez / ZABAL / The ZAO, sorted into one of the
// three tracks. Not just repos - video, image, app, music, art, or a link all count.
const TRACKS = ['artist', 'builder', 'creator'];
const cleanTrack = (s) => (TRACKS.includes(slug(s)) ? slug(s) : null);
function inferType(url, repo) {
  if (repo) return 'repo';
  const u = String(url || '').toLowerCase();
  if (!u) return 'other';
  if (/github\.com/.test(u)) return 'repo';
  if (/youtube\.com|youtu\.be|vimeo\.com|\.mp4(\?|$)|\.mov(\?|$)/.test(u)) return 'video';
  if (/\.png(\?|$)|\.jpe?g(\?|$)|\.gif(\?|$)|\.webp(\?|$)|imagedelivery|seadn|pinata|ipfs/.test(u)) return 'image';
  if (/soundcloud|spotify|\.mp3(\?|$)|\.wav(\?|$)|audius|sound\.xyz/.test(u)) return 'music';
  if (/\.pages\.dev|\.vercel\.app|\.netlify|\.app(\/|$)|localhost/.test(u)) return 'app';
  return 'link';
}
const TYPES = ['video', 'image', 'app', 'repo', 'music', 'audio', 'link', 'other'];
const cleanType = (s) => (TYPES.includes(slug(s)) ? slug(s) : null);
const cleanHandle = (s) => (String(s || '').toLowerCase().replace(/^@/, '').replace(/[^a-z0-9._-]/g, '').slice(0, 40) || null);
const cleanWallet = (s) => { const v = String(s || '').trim().toLowerCase(); return /^0x[0-9a-f]{40}$/.test(v) ? v : null; };
const cleanUrl = (s) => { try { const u = new URL(String(s)); return (u.protocol === 'https:' || u.protocol === 'http:') ? u.toString() : null; } catch { return null; } };

function timingEq(a, b) { if (!a || !b) return false; let d = a.length ^ b.length; for (let i = 0; i < a.length && i < b.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; }
function authed(req) { if (!INTAKE_KEY) return false; const h = req.headers.get('authorization') || ''; const t = h.startsWith('Bearer ') ? h.slice(7) : ''; return timingEq(t, INTAKE_KEY); }

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (!KV_URL || !KV_TOKEN) return json({ ok: true, configured: false, items: [] });
  const url = new URL(req.url);

  if (req.method === 'GET') {
    const builder = cleanHandle(url.searchParams.get('builder'));
    const limit = Math.min(100, parseInt(url.searchParams.get('limit') || '50', 10) || 50);
    try {
      let ids;
      if (builder) {
        const r = await kvPipeline([['SMEMBERS', 'zabal:intake:builder:' + builder]]);
        ids = (r[0] && r[0].result) || [];
      } else {
        const r = await kvPipeline([['ZRANGE', 'zabal:intake:feed', '0', String(limit - 1), 'REV']]);
        ids = (r[0] && r[0].result) || [];
      }
      if (!ids.length) return json({ ok: true, configured: true, count: 0, items: [] });
      const h = await kvPipeline([['HMGET', 'zabal:intake:items', ...ids]]);
      const items = ((h[0] && h[0].result) || []).map((s) => { try { return JSON.parse(s); } catch { return null; } }).filter(Boolean);
      return json({ ok: true, configured: true, count: items.length, items });
    } catch { return json({ ok: false, error: 'read failed' }, 502); }
  }

  if (req.method === 'POST') {
    if (!authed(req)) return json({ ok: false, error: 'unauthorized' }, 401);
    let body; try { body = await req.json(); } catch { return json({ ok: false, error: 'bad json' }, 400); }
    const source = slug(body.source) || 'manual';
    const b = body.builder || {};
    const handle = cleanHandle(b.handle);
    const wallet = cleanWallet(b.wallet);
    const fid = Number.isInteger(b.fid) ? b.fid : (parseInt(b.fid, 10) || null);
    const builderKey = handle || (fid ? 'fid' + fid : null) || wallet;
    if (!builderKey) return json({ ok: false, error: 'need a builder handle, fid, or wallet' }, 400);
    const project = slug(body.project) || slug(body.url) || 'project';
    const id = builderKey + ':' + project; // stable id -> upsert (updatable, no dupes)
    const url_ = cleanUrl(body.url);
    const repo_ = (String(body.repo || '').replace(/[^a-zA-Z0-9._/:-]/g, '').slice(0, 140) || null);
    const rec = {
      id, source,
      builder: { handle, fid, wallet },
      track: cleanTrack(body.track),                    // artist | builder | creator | null
      type: cleanType(body.type) || inferType(url_, repo_), // video | image | app | repo | music | link | other
      forBrand: (['zabalgamez', 'zabal', 'zao'].includes(slug(body.forBrand)) ? slug(body.forBrand) : 'zabalgamez'),
      project: String(body.project || project).slice(0, 80),
      url: url_,
      repo: repo_,
      note: (String(body.note || '').slice(0, 500) || null),
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

  return json({ ok: false, error: 'method not allowed' }, 405);
}

// ZABAL Gamez - clip registry + engagement (GET/POST /api/clips).
//
// The clip flywheel's memory. When a viewer submits a 45-60s clip as a POIDH bounty
// claim (assets/clip-claim.js), we ALSO record it here so the clip is discoverable on
// the site: a per-recording gallery, a recent-clips feed on /clips, likes (one per FID),
// and a "top clippers" leaderboard that Empire Builder can pay out from.
//
//   POST /api/clips { action:'submit', recId, clipUrl, title, bountyId?, txHash?, address? }
//        + Quick Auth                                  -> { ok, clip }
//   POST /api/clips { action:'like', recId, cid } + Quick Auth -> { ok, likes, firstLike }
//   GET  /api/clips?rec=<recId>                        -> { ok, configured, clips:[...] }
//   GET  /api/clips?feed=recent&limit=30               -> { ok, configured, clips:[...] }
//   GET  /api/clips?board=clippers                     -> { ok, entries:[{rank,handle,clips,address?}] }
//   GET  /api/clips?format=apiLeaderboard              -> [{ address, score }]   (Empire Builder)
//
// ANTI-CHEAT: writing (submit + like) requires a Quick Auth JWT, so every clip is tied to
// a verified FID and a like is one per FID per clip. Reading is public. Empire's
// apiLeaderboard only lists clippers who submitted a wallet address. Same conventions as
// api/game.mjs (board) and api/comments.mjs (like-once). No-op cleanly without KV env.

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const HAATZ = 'https://haatz.quilibrium.com';

const C_PREFIX = 'zabal:clips:v1:';        // + recId -> HASH cid -> clip JSON
const RECENT_KEY = 'zabal:clips:recent';   // ZSET member "recId:cid" score ts (global feed)
const LIKES_PREFIX = 'zabal:cliplikes:v1:'; // + recId -> HASH cid -> like count
const VOTERS_PREFIX = 'zabal:cliplike:voters:v1:'; // + cid -> SET of fids
const CLIPPERS_KEY = 'zabal:clips:clippers'; // ZSET handle -> clip count (leaderboard)
const ADDR_KEY = 'zabal:clips:addr';        // HASH handle -> address (Empire payout)

const TOP_N = 200;

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, maxAge, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}, s-maxage=${maxAge}` : 'no-store',
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

// Recording ids are slugs like "16", "fireside/1", "zao/1" - the same path the
// comment widget keys on. Keep slashes, drop anything weird.
function cleanRecId(s) {
  return String(s || '').trim().replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9/_-]/g, '').slice(0, 64);
}
function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}
function cleanAddress(a) {
  const s = String(a || '').trim().toLowerCase();
  return /^0x[0-9a-f]{40}$/.test(s) ? s : null;
}
function cleanUrl(u) {
  const s = String(u || '').trim();
  if (!/^https?:\/\/[^\s]{4,400}$/i.test(s)) return null;
  return s.slice(0, 400);
}
function cleanBountyId(b) {
  const s = String(b == null ? '' : b).trim();
  return /^\d{1,12}$/.test(s) ? s : null;
}
function cleanTx(t) {
  const s = String(t || '').trim().toLowerCase();
  return /^0x[0-9a-f]{64}$/.test(s) ? s : null;
}

async function resolveProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return {};
    const u = ((await r.json()).users || [])[0] || {};
    const eth = (u.verified_addresses && (u.verified_addresses.eth_addresses || u.verified_addresses.ethAddresses)) || [];
    return { username: u.username || null, pfp: u.pfp_url || u.pfpUrl || null, address: cleanAddress(eth[0]) };
  } catch {
    return {};
  }
}

// Read a set of clips (cid -> JSON) for a recording, attach live like counts, newest first.
async function readClips(recId, limit) {
  const ckey = C_PREFIX + recId;
  const lkey = LIKES_PREFIX + recId;
  let res;
  try {
    res = await kvPipeline([['HGETALL', ckey], ['HGETALL', lkey]]);
  } catch {
    return [];
  }
  const cflat = (res[0] && res[0].result) || [];
  const lflat = (res[1] && res[1].result) || [];
  const likes = {};
  for (let i = 0; i < lflat.length; i += 2) likes[lflat[i]] = Number(lflat[i + 1]) || 0;
  const out = [];
  for (let i = 0; i < cflat.length; i += 2) {
    let c;
    try { c = JSON.parse(cflat[i + 1]); } catch { continue; }
    if (!c || typeof c !== 'object') continue;
    c.cid = cflat[i];
    c.likes = likes[cflat[i]] || 0;
    out.push(c);
  }
  out.sort((a, b) => (b.ts || 0) - (a.ts || 0));
  return typeof limit === 'number' ? out.slice(0, limit) : out;
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (body, maxAge = 0) => mkJson(body, maxAge, origin);

  if (req.method === 'OPTIONS') return json({ ok: true });

  const url = new URL(req.url);

  // ---- GET reads (public) ----
  if (req.method === 'GET') {
    const apiFormat = url.searchParams.get('format') === 'apiLeaderboard';
    if (!KV_URL || !KV_TOKEN) {
      if (apiFormat) return json([]);
      if (url.searchParams.get('board') === 'clippers') return json({ ok: true, configured: false, entries: [] });
      return json({ ok: true, configured: false, clips: [] });
    }

    // Top-clippers leaderboard (readable) or Empire apiLeaderboard.
    if (apiFormat || url.searchParams.get('board') === 'clippers') {
      let rows = [];
      try {
        const r = await kvPipeline([['ZREVRANGE', CLIPPERS_KEY, '0', String(TOP_N - 1), 'WITHSCORES']]);
        const flat = (r[0] && r[0].result) || [];
        for (let i = 0; i < flat.length; i += 2) rows.push({ handle: flat[i], clips: Number(flat[i + 1]) });
      } catch { /* empty */ }
      // attach addresses
      let addrs = {};
      if (rows.length) {
        try {
          const ar = await kvPipeline([['HMGET', ADDR_KEY, ...rows.map((r) => r.handle)]]);
          const vals = (ar[0] && ar[0].result) || [];
          rows.forEach((r, i) => { if (vals[i]) addrs[r.handle] = vals[i]; });
        } catch { /* best effort */ }
      }
      if (apiFormat) {
        return json(rows.filter((r) => addrs[r.handle]).map((r) => ({ address: addrs[r.handle], score: r.clips })), 30);
      }
      return json({ ok: true, configured: true, entries: rows.map((r, i) => ({ rank: i + 1, handle: r.handle, clips: r.clips, address: addrs[r.handle] || null })) }, 20);
    }

    // Recent-clips feed across all recordings.
    if (url.searchParams.get('feed') === 'recent') {
      const limit = Math.min(60, Math.max(1, Number(url.searchParams.get('limit')) || 30));
      let members = [];
      try {
        const r = await kvPipeline([['ZREVRANGE', RECENT_KEY, '0', String(limit - 1)]]);
        members = (r[0] && r[0].result) || [];
      } catch { return json({ ok: true, configured: true, clips: [] }); }
      // members are "recId:cid"; group by recId, fetch JSON
      const byRec = {};
      members.forEach((m) => {
        const i = m.lastIndexOf(':');
        if (i < 0) return;
        const rec = m.slice(0, i), cid = m.slice(i + 1);
        (byRec[rec] = byRec[rec] || []).push(cid);
      });
      const cmds = [];
      const order = [];
      Object.keys(byRec).forEach((rec) => {
        byRec[rec].forEach((cid) => { cmds.push(['HGET', C_PREFIX + rec, cid]); order.push({ rec, cid }); });
      });
      const clips = [];
      if (cmds.length) {
        try {
          const r = await kvPipeline(cmds);
          r.forEach((row, i) => {
            if (!row || !row.result) return;
            let c; try { c = JSON.parse(row.result); } catch { return; }
            if (!c) return;
            c.cid = order[i].cid; c.recId = c.recId || order[i].rec;
            clips.push(c);
          });
        } catch { /* partial */ }
      }
      clips.sort((a, b) => (b.ts || 0) - (a.ts || 0));
      return json({ ok: true, configured: true, clips: clips.slice(0, limit) }, 20);
    }

    // Per-recording gallery.
    const recId = cleanRecId(url.searchParams.get('rec'));
    if (!recId) return json({ ok: false, error: 'rec required' });
    const clips = await readClips(recId, 200);
    return json({ ok: true, configured: true, recId, clips }, 15);
  }

  // ---- POST writes (Quick Auth required) ----
  if (req.method === 'POST') {
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, configured: false });
    let body = {};
    try { body = await req.json(); } catch { /* ignore */ }

    const auth = req.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (!token) return json({ ok: false, reason: 'unverified' });
    let fid;
    try { fid = await verifyQuickAuth(token, DOMAIN); }
    catch { return json({ ok: false, error: 'invalid token' }); }

    const recId = cleanRecId(body.recId);
    if (!recId) return json({ ok: false, error: 'recId required' });

    // ---- like: one +1 per FID per clip (SADD gates the increment) ----
    if (body.action === 'like') {
      const cid = String(body.cid || '').replace(/[^a-z0-9_-]/gi, '').slice(0, 40);
      if (!cid) return json({ ok: false, error: 'cid required' });
      let firstLike = false, likes = 0;
      try {
        const add = await kvPipeline([['SADD', VOTERS_PREFIX + cid, String(fid)]]);
        firstLike = !!(add[0] && Number(add[0].result) === 1);
        if (firstLike) {
          const inc = await kvPipeline([['HINCRBY', LIKES_PREFIX + recId, cid, '1']]);
          likes = Number((inc[0] && inc[0].result) || 0);
        } else {
          const cur = await kvPipeline([['HGET', LIKES_PREFIX + recId, cid]]);
          likes = Number((cur[0] && cur[0].result) || 0);
        }
      } catch { return json({ ok: false, error: 'kv' }); }
      return json({ ok: true, likes, firstLike });
    }

    // ---- submit: record a clip ----
    const clipUrl = cleanUrl(body.clipUrl);
    if (!clipUrl) return json({ ok: false, error: 'clipUrl required' });
    const profile = await resolveProfile(fid);
    const handle = cleanHandle(profile.username) || ('fid' + fid);
    const address = cleanAddress(body.address) || profile.address || null;
    const clip = {
      recId,
      clipUrl,
      title: String(body.title || '').replace(/[<>]/g, '').trim().slice(0, 140) || 'Clip',
      bountyId: cleanBountyId(body.bountyId),
      txHash: cleanTx(body.txHash),
      handle,
      fid,
      pfp: profile.pfp || null,
      ts: Date.now(),
    };
    // dedupe: same clipUrl by same fid on this recording is a no-op update
    const cid = (String(fid) + '-' + clipUrl).replace(/[^a-z0-9]/gi, '').slice(-32) || ('c' + fid + Date.now());
    const member = recId + ':' + cid;
    const cmds = [
      ['HSET', C_PREFIX + recId, cid, JSON.stringify(clip)],
      ['ZADD', RECENT_KEY, String(clip.ts), member],
    ];
    if (address) cmds.push(['HSET', ADDR_KEY, handle, address]);
    // count toward the clipper leaderboard only the first time this cid is seen
    let isNew = false;
    try {
      const exists = await kvPipeline([['HEXISTS', C_PREFIX + recId, cid]]);
      isNew = !(exists[0] && Number(exists[0].result) === 1);
    } catch { /* treat as new */ isNew = true; }
    try {
      const w = await kvPipeline(cmds);
      for (const c of w) { if (c && c.error) throw new Error(c.error); }
      if (isNew) await kvPipeline([['ZINCRBY', CLIPPERS_KEY, '1', handle], ['ZREMRANGEBYRANK', RECENT_KEY, '0', String(-1 - 2000)]]);
    } catch { return json({ ok: false, error: 'kv-write' }); }

    clip.cid = cid; clip.likes = 0;
    return json({ ok: true, clip });
  }

  return json({ ok: false, error: 'method' });
}

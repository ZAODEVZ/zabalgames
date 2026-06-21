// ZABAL Gamez - recent casts from the /zabal channel (read-only).
//
// Feeds the "From /zabal" pulse on /live: the latest casts in the channel, so the live hub
// shows real community chatter, not just standings. Public, no login, no spam infra.
//
// GET /api/channel-feed?channel=zabal&limit=8
//   -> { configured, count, channel, casts: [{ hash, fid, username, pfp, display, text, ts, likes, recasts, replies, url }] }
//
// Needs NEYNAR_API_KEY (read-only). No-ops gracefully (configured:false) when absent.

export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const NEYNAR_KEY = process.env.NEYNAR_API_KEY;
const DEFAULT_CHANNEL = 'zabal';

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 's-maxage=60, stale-while-revalidate=180',
    },
  });
}

function cleanChannel(c) {
  return String(c || '').trim().replace(/^\//, '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 40);
}

function castUrl(author, hash) {
  var u = author && author.username;
  return u ? 'https://farcaster.xyz/' + u + '/' + String(hash).slice(0, 10) : 'https://farcaster.xyz/~/conversations/' + hash;
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405, origin);

  const url = new URL(req.url);
  const channel = cleanChannel(url.searchParams.get('channel')) || DEFAULT_CHANNEL;
  let limit = parseInt(url.searchParams.get('limit') || '8', 10);
  if (!Number.isFinite(limit) || limit < 1) limit = 8;
  if (limit > 25) limit = 25;

  if (!NEYNAR_KEY) return json({ configured: false, count: 0, channel, casts: [] }, 200, origin);

  const api = 'https://api.neynar.com/v2/farcaster/feed/channels?channel_ids=' + encodeURIComponent(channel) +
    '&with_recasts=false&limit=' + limit;

  try {
    const r = await fetch(api, {
      headers: { 'x-api-key': NEYNAR_KEY, accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return json({ configured: true, count: 0, channel, casts: [], detail: 'neynar ' + r.status }, 502, origin);
    const data = await r.json();
    const casts = ((data && data.casts) || []).map(function (c) {
      const a = c.author || {};
      return {
        hash: c.hash,
        fid: a.fid,
        username: a.username || '',
        pfp: a.pfp_url || '',
        display: a.display_name || '',
        text: c.text || '',
        ts: c.timestamp ? Date.parse(c.timestamp) : 0,
        likes: (c.reactions && c.reactions.likes_count) || 0,
        recasts: (c.reactions && c.reactions.recasts_count) || 0,
        replies: (c.replies && c.replies.count) || 0,
        url: castUrl(a, c.hash),
      };
    });
    return json({ configured: true, count: casts.length, channel, casts }, 200, origin);
  } catch (e) {
    return json({ configured: true, count: 0, channel, casts: [], detail: e.message }, 502, origin);
  }
}

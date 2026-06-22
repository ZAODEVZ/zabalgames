// ZABAL Gamez - Farcaster conversation for a recording (read-only).
//
// Turns a recording's "Thoughts" into the real Farcaster conversation: given the root
// cast for a recording (the announce cast), this returns its replies via Neynar, so the
// page shows native casts - public, no login, no spam infra - and people reply in-app.
//
// GET /api/cast-comments?hash=<castHashOrWarpcastUrl>
//   -> { configured, count, root: { hash, url }, comments: [{ hash, fid, username, pfp, display, text, ts, likes, recasts, url }] }
//
// Needs NEYNAR_API_KEY (read-only). No-ops gracefully (configured:false) when absent.

export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const NEYNAR_KEY = process.env.NEYNAR_API_KEY;

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      // Short edge cache - the conversation is public and changes slowly.
      'Cache-Control': 's-maxage=30, stale-while-revalidate=120',
    },
  });
}

function castUrl(author, hash) {
  var u = author && author.username;
  return u ? 'https://farcaster.xyz/' + u + '/' + String(hash).slice(0, 10) : 'https://farcaster.xyz/~/conversations/' + hash;
}

// Flatten Neynar direct_replies (nested) into a flat, oldest-first list.
function flatten(replies, out) {
  if (!Array.isArray(replies)) return out;
  for (const r of replies) {
    const a = r.author || {};
    out.push({
      hash: r.hash,
      fid: a.fid,
      username: a.username || '',
      pfp: a.pfp_url || '',
      display: a.display_name || '',
      text: r.text || '',
      ts: r.timestamp ? Date.parse(r.timestamp) : 0,
      likes: (r.reactions && r.reactions.likes_count) || 0,
      recasts: (r.reactions && r.reactions.recasts_count) || 0,
      url: castUrl(a, r.hash),
    });
    if (r.direct_replies && r.direct_replies.length) flatten(r.direct_replies, out);
  }
  return out;
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405, origin);

  const raw = (new URL(req.url).searchParams.get('hash') || '').trim();
  if (!raw) return json({ error: 'no hash' }, 400, origin);
  if (!NEYNAR_KEY) return json({ configured: false, count: 0, comments: [] }, 200, origin);

  // A URL identifier is only honored for Farcaster hosts - otherwise we would let any caller
  // make Neynar fetch an arbitrary URL with our quota (SSRF-by-proxy). Non-Farcaster URLs
  // fall back to bare-hash handling (which sanitizes to hex), so junk simply returns empty.
  let isUrl = /^https?:\/\//i.test(raw);
  if (isUrl) {
    let host = '';
    try { host = new URL(raw).hostname.toLowerCase(); } catch { host = ''; }
    var farcasterHost = host === 'farcaster.xyz' || host === 'warpcast.com' ||
      host.endsWith('.farcaster.xyz') || host.endsWith('.warpcast.com');
    if (!farcasterHost) isUrl = false;
  }
  const id = isUrl ? raw : (raw.replace(/[^a-zA-Z0-9x]/g, '').slice(0, 80));
  const api = 'https://api.neynar.com/v2/farcaster/cast/conversation?type=' + (isUrl ? 'url' : 'hash') +
    '&identifier=' + encodeURIComponent(id) + '&reply_depth=2&limit=50&include_chronological_parent_casts=false';

  try {
    const r = await fetch(api, {
      headers: { 'x-api-key': NEYNAR_KEY, accept: 'application/json' },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return json({ configured: true, count: 0, comments: [], detail: 'neynar ' + r.status }, 502, origin);
    const data = await r.json();
    const root = data && data.conversation && data.conversation.cast;
    const comments = flatten(root && root.direct_replies, []).sort((a, b) => b.ts - a.ts);
    return json({
      configured: true,
      count: comments.length,
      root: root ? { hash: root.hash, url: castUrl(root.author, root.hash) } : null,
      comments,
    }, 200, origin);
  } catch (e) {
    return json({ configured: true, count: 0, comments: [], detail: e.message }, 502, origin);
  }
}

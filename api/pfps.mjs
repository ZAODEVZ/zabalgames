// ZABAL Gamez - Farcaster PFP resolver (GET /api/pfps?handles=a,b,c).
//
// Resolves Farcaster usernames to their profile picture URLs for the arcade tiles (and any
// page that wants ZAO friends' faces). Reads from the public Hypersnap node (Haatz) - no
// key, open reads. Best-effort and graceful: a handle that does not resolve is simply
// omitted, so the caller falls back to a text label.
//
//   GET /api/pfps?handles=yerbearserker,plat0x  ->  { ok, users: { handle: { pfpUrl, fid, displayName } } }

export const config = { runtime: 'edge' };

const HAATZ = 'https://haatz.quilibrium.com';

function json(body, maxAge = 600) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

function clean(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}

async function resolveOne(handle) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return null;
    const d = await r.json();
    const u = d.user || (d.users && d.users[0]) || null;
    if (!u) return null;
    const pfpUrl = u.pfp_url || u.pfpUrl || (u.pfp && u.pfp.url) || null;
    if (!pfpUrl) return null;
    return { pfpUrl, fid: u.fid || null, displayName: u.display_name || u.displayName || null };
  } catch {
    return null;
  }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const handles = (url.searchParams.get('handles') || '')
    .split(',').map(clean).filter(Boolean).slice(0, 20);
  if (!handles.length) return json({ ok: true, users: {} });

  const users = {};
  await Promise.all(handles.map(async (h) => {
    const got = await resolveOne(h);
    if (got) users[h] = got;
  }));
  return json({ ok: true, users });
}

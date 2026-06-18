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

function pickUser(u) {
  if (!u) return null;
  const pfpUrl = u.pfp_url || u.pfpUrl || (u.pfp && u.pfp.url) || null;
  if (!pfpUrl) return null;
  return { pfpUrl, fid: u.fid || null, displayName: u.display_name || u.displayName || null };
}

async function resolveOne(handle) {
  // 1. direct username lookup
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) {
      const d = await r.json();
      const got = pickUser(d.user || (d.result && d.result.user) || (d.users && d.users[0]));
      if (got) return got;
    }
  } catch { /* try the next strategy */ }
  // 2. search fallback (some Hypersnap nodes expose search but not by_username)
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/search?q=${encodeURIComponent(handle)}&limit=1`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) {
      const d = await r.json();
      const u = (d.result && d.result.users && d.result.users[0]) || (d.users && d.users[0]) || null;
      const got = pickUser(u);
      if (got && (!u.username || String(u.username).toLowerCase() === handle)) return got;
      if (got) return got;
    }
  } catch { /* fall through */ }
  return null;
}

// Reliable path: resolve many FIDs at once via the bulk endpoint (the one we know works).
async function resolveFids(fids) {
  const out = {};
  if (!fids.length) return out;
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fids.join(',')}`, { signal: AbortSignal.timeout(3000) });
    if (r.ok) {
      const arr = (await r.json()).users || [];
      for (const u of arr) { const got = pickUser(u); if (got && u.fid) out[u.fid] = got; }
    }
  } catch { /* best effort */ }
  return out;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const handles = (url.searchParams.get('handles') || '')
    .split(',').map(clean).filter(Boolean).slice(0, 30);
  const fids = (url.searchParams.get('fids') || '')
    .split(',').map((s) => s.trim()).filter((s) => /^\d+$/.test(s)).slice(0, 50);
  if (!handles.length && !fids.length) return json({ ok: true, users: {}, byFid: {} });

  const users = {};
  await Promise.all(handles.map(async (h) => {
    const got = await resolveOne(h);
    if (got) users[h] = got;
  }));
  const byFid = await resolveFids(fids);
  return json({ ok: true, users, byFid });
}

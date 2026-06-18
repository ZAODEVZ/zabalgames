// ZABAL Gamez - Farcaster PFP resolver (GET /api/pfps?handles=a,b,c).
//
// Resolves Farcaster usernames to their profile picture URLs for the arcade tiles (and any
// page that wants ZAO friends' faces). 100% free, no key: the official fname registry maps
// a username -> FID, then the public Hypersnap node (Haatz) bulk endpoint - the one proven
// in production - returns the profile. Best-effort and graceful: a handle that does not
// resolve is simply omitted, so the caller falls back to a text label.
//
//   GET /api/pfps?handles=yerbearserker,plat0x  ->  { ok, users: { handle: { pfpUrl, fid, displayName } } }

export const config = { runtime: 'edge' };

const HAATZ = 'https://haatz.quilibrium.com';
// Official Farcaster fname registry - free, no key. Maps a username -> its current FID.
const FNAMES = 'https://fnames.farcaster.xyz';
// Optional: only used as a last resort if it happens to be configured. Not required.
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';

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

// Reliable path: resolve many FIDs at once via the Haatz bulk endpoint (the one we know works
// in production - join/track/pops/raffle/game all use it). Free, no key.
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

// Free username -> FID via the official fname registry. The current owner is the `to` of the
// most recent transfer for that name. ENS-based handles (.eth) are not in the registry.
async function fnameToFid(handle) {
  try {
    const r = await fetch(`${FNAMES}/transfers?name=${encodeURIComponent(handle)}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return null;
    const arr = (await r.json()).transfers || [];
    if (!arr.length) return null;
    const latest = arr.reduce((a, b) => ((b.timestamp || 0) >= (a.timestamp || 0) ? b : a));
    return latest && latest.to ? Number(latest.to) : null;
  } catch { return null; }
}

async function resolveOne(handle) {
  // 1. FREE + reliable: fname registry -> FID -> Haatz bulk (the proven endpoint).
  const fid = await fnameToFid(handle);
  if (fid) {
    const byFid = await resolveFids([fid]);
    if (byFid[fid]) return byFid[fid];
  }
  // 2. Haatz direct username lookup (works on some nodes, not all).
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`, { signal: AbortSignal.timeout(2500) });
    if (r.ok) {
      const d = await r.json();
      const got = pickUser(d.user || (d.result && d.result.user) || (d.users && d.users[0]));
      if (got) return got;
    }
  } catch { /* try the next strategy */ }
  // 3. Haatz search (some Hypersnap nodes expose search but not by_username).
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
  // 4. Optional last resort: real Neynar by_username, only if a key happens to be set.
  if (NEYNAR_API_KEY) {
    try {
      const r = await fetch(`https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`,
        { headers: { 'x-api-key': NEYNAR_API_KEY, Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
      if (r.ok) {
        const d = await r.json();
        const got = pickUser(d.user || (d.result && d.result.user) || (d.users && d.users[0]));
        if (got) return got;
      }
    } catch { /* give up */ }
  }
  return null;
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

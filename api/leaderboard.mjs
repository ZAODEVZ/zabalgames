// ZABAL Gamez - activity leaderboard (GET /api/leaderboard).
//
// Ranks builders by the social-action points they earn (cast / share / signup),
// stored in a KV sorted set by api/track.mjs. Two output shapes:
//
//   GET /api/leaderboard              -> Empire Builder apiLeaderboard format:
//                                        [{ "address": "0x..", "score": N }, ...]
//                                        (FIDs resolved to Base verified addresses)
//   GET /api/leaderboard?format=full  -> human format for the /leaderboard page:
//                                        [{ fid, username, pfpUrl, score, address }]
//
// Register the default URL once in Empire Builder so casts/ships earn empire
// points - composing this app's activity into the $ZABAL leaderboard.
//
// Empty array when KV is not configured.

export const config = { runtime: 'edge' };

const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const HAATZ = 'https://haatz.quilibrium.com';
const SCORES_KEY = 'zabal:scores:v1';
const TOP_N = 50;

function json(body, maxAge = 30) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
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

// One HAATZ bulk call resolves many FIDs to username/pfp/verified address.
async function resolveProfiles(fids) {
  const map = {};
  if (!fids.length) return map;
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fids.join(',')}`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return map;
    const users = (await r.json()).users || [];
    for (const u of users) {
      const eth = (u.verified_addresses && (u.verified_addresses.eth_addresses || u.verified_addresses.ethAddresses)) || [];
      map[u.fid] = { username: u.username || null, pfpUrl: u.pfp_url || null, address: eth[0] || null };
    }
  } catch {
    // best-effort
  }
  return map;
}

export default async function handler(req) {
  const url = new URL(req.url);
  const full = url.searchParams.get('format') === 'full';
  if (!KV_URL || !KV_TOKEN) return json([]);

  let res;
  try {
    res = await kvPipeline([['ZRANGE', SCORES_KEY, '0', String(TOP_N - 1), 'REV', 'WITHSCORES']]);
  } catch {
    return json([]);
  }

  // Flat [member, score, member, score, ...] -> [{ fid, score }]
  const flat = res?.[0]?.result || [];
  const rows = [];
  for (let i = 0; i < flat.length; i += 2) rows.push({ fid: Number(flat[i]), score: Number(flat[i + 1]) });
  if (!rows.length) return json([]);

  const profiles = await resolveProfiles(rows.map(r => r.fid));

  if (full) {
    return json(rows.map(r => ({
      fid: r.fid,
      username: profiles[r.fid]?.username || null,
      pfpUrl: profiles[r.fid]?.pfpUrl || null,
      address: profiles[r.fid]?.address || null,
      score: r.score,
    })));
  }

  // Empire Builder apiLeaderboard: address + score only, drop FIDs without a verified address.
  return json(rows
    .map(r => ({ address: profiles[r.fid]?.address, score: r.score }))
    .filter(r => r.address));
}

// ZABAL Gamez - public "July builds" board (GET /api/builds).
//
// The read side of the builder registry. api/register.mjs writes wallet -> repos to
// `zabal:builds` (and the optional wallet -> fid link to `zabal:builds:fid`); this
// endpoint reads them back so the site can show what is being built in public. It
// never writes and never touches Bonfire. Public, unauthenticated read - the repos
// are public GitHub anyway (building in the open is the point).
//
// Response: { configured, builders, count, builds: [{ repo, owner, wallet, fid }] }
//   builders = distinct wallets, count = total registered repos. wallet is shortened
//   (0x1234...abcd). No-ops to { configured:false, builds:[] } when KV is absent.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const BUILDS_KEY = 'zabal:builds';
const FIDS_KEY = 'zabal:builds:fid';
const TRACK_KEY = 'zabal:builds:track';   // repo -> track (written by register.mjs)
const VOTES_KEY = 'zabal:buildvotes:v1';  // repo -> community vote count (written by build-vote.mjs)
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
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

// Upstash HGETALL over REST returns a flat [field, value, field, value, ...] array.
function foldHash(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < arr.length - 1; i += 2) out[arr[i]] = arr[i + 1];
  return out;
}

// Mirror register.mjs: a wallet's repos are a JSON array, with a legacy bare-string fallback.
function parseRepos(raw) {
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    if (Array.isArray(p)) return p.filter((x) => typeof x === 'string');
    if (typeof p === 'string' && p) return [p];
  } catch {
    if (typeof raw === 'string' && raw) return [raw];
  }
  return [];
}

const shortWallet = (w) => (/^0x[0-9a-f]{40}$/i.test(w) ? w.slice(0, 6) + '...' + w.slice(-4) : w);

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'GET') return json({ error: 'method not allowed' }, 405, origin);

  if (!KV_URL || !KV_TOKEN) return json({ configured: false, builders: 0, count: 0, builds: [] }, 200, origin);

  let buildsHash, fidsHash, trackHash, votesHash;
  try {
    const res = await kvPipeline([
      ['HGETALL', BUILDS_KEY], ['HGETALL', FIDS_KEY],
      ['HGETALL', TRACK_KEY], ['HGETALL', VOTES_KEY],
    ]);
    buildsHash = foldHash(res?.[0]?.result);
    fidsHash = foldHash(res?.[1]?.result);
    trackHash = foldHash(res?.[2]?.result);
    votesHash = foldHash(res?.[3]?.result);
  } catch (e) {
    return json({ configured: true, builders: 0, count: 0, builds: [], detail: e.message }, 502, origin);
  }

  const builds = [];
  for (const wallet of Object.keys(buildsHash)) {
    const fid = fidsHash[wallet] ? Number(fidsHash[wallet]) : null;
    for (const repo of parseRepos(buildsHash[wallet])) {
      builds.push({
        repo, owner: repo.split('/')[0], wallet: shortWallet(wallet), fid,
        track: trackHash[repo] || '', votes: Number(votesHash[repo]) || 0,
      });
    }
  }
  // Rank by community votes so the board reads as a shortlist; repo as a stable tiebreak.
  builds.sort((a, b) => b.votes - a.votes || a.repo.localeCompare(b.repo));

  return json({ configured: true, builders: Object.keys(buildsHash).length, count: builds.length, builds }, 200, origin);
}

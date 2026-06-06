// ZABAL Gamez - Empire Builder leaderboard proxy (GET /api/empire-leaderboard).
//
// Pulls the live leaderboard for our tokenless empire from the Empire Builder API
// and normalizes it to ONE stable contract the frontend renders against, regardless
// of upstream's raw shape:
//
//   { ok, configured, source, empireId, board: { id, name, type }|null,
//     count, entries: [{ rank, address, fid, username, displayName, pfpUrl, score }] }
//
// Why a server proxy (not a client fetch): runs on Vercel's edge (which can reach
// empirebuilder.world in production - this dev sandbox can't), sidesteps any CORS,
// lets us attach x-api-key if a read route is partner-gated, and lets us cache.
//
// Empire Builder reads are open GETs (no key needed), so this works key-less; if
// EMPIRE_API_KEY is set we send it as x-api-key anyway (harmless, future-proof).
//
// Query params (all optional):
//   tokenAddress  - Empire ID override (defaults to EMPIRE_ID env). fid<digits>,
//                   a custom slug, or an 0x base token - see the skill's Empire ID table.
//   id            - fetch one specific leaderboard by its id instead of consolidated
//   limit         - cap entries (1..250, default 50)
//   debug=1       - include the raw upstream payload so we can confirm field shapes
//
// Graceful no-op: no empire id configured -> 200 { ok:true, configured:false }.
// Env: EMPIRE_ID (the tokenless empire's id), EMPIRE_API_KEY (optional).

export const config = { runtime: 'edge' };

const BASE = 'https://empirebuilder.world';
const EMPIRE_ID = process.env.EMPIRE_ID || '';
const EMPIRE_API_KEY = process.env.EMPIRE_API_KEY || '';

function json(body, status = 200, cache = 'no-store') {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': cache },
  });
}

function clampInt(v, lo, hi, dflt) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return dflt;
  return Math.min(hi, Math.max(lo, n));
}

async function get(url) {
  const headers = { Accept: 'application/json' };
  if (EMPIRE_API_KEY) headers['x-api-key'] = EMPIRE_API_KEY;
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(`${url.replace(BASE, '')} -> ${r.status}`);
  return r.json();
}

// Heuristically locate the row array inside an unknown payload. Upstream may return
// the array at the top level, or nested under entries/holders/rows/data/results, or
// inside a single leaderboard object. We pick the first array whose items look like
// leaderboard rows (carry an address-ish or score-ish field).
const ROW_KEYS = ['entries', 'holders', 'rows', 'data', 'results', 'leaderboard', 'items', 'rankings'];
function looksLikeRows(arr) {
  return Array.isArray(arr) && arr.length > 0 && arr.some((x) =>
    x && typeof x === 'object' &&
    (x.address || x.wallet || x.walletAddress || x.holder || x.fid ||
     x.score != null || x.points != null || x.balance != null || x.amount != null));
}
function findRows(obj, depth = 0) {
  if (looksLikeRows(obj)) return obj;
  if (!obj || typeof obj !== 'object' || depth > 4) return null;
  for (const k of ROW_KEYS) {
    if (k in obj) {
      const hit = findRows(obj[k], depth + 1);
      if (hit) return hit;
    }
  }
  for (const v of Object.values(obj)) {
    if (v && typeof v === 'object') {
      const hit = findRows(v, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

const pick = (o, keys) => { for (const k of keys) if (o[k] != null && o[k] !== '') return o[k]; return null; };

function normalizeRow(r, i) {
  const score = pick(r, ['score', 'points', 'value', 'amount', 'balance', 'weight']);
  return {
    rank: pick(r, ['rank', 'position']) || i + 1,
    address: pick(r, ['address', 'wallet', 'walletAddress', 'holder', 'holderAddress']),
    fid: pick(r, ['fid', 'farcasterId', 'farcaster_fid']),
    username: pick(r, ['username', 'handle', 'fname', 'farcasterUsername']),
    displayName: pick(r, ['displayName', 'display_name', 'name', 'profileName']),
    pfpUrl: pick(r, ['pfpUrl', 'pfp_url', 'pfp', 'avatar', 'avatarUrl', 'imageUrl', 'image']),
    score: typeof score === 'string' && score.trim() !== '' && !isNaN(score) ? Number(score) : score,
  };
}

// Pull a board's {id,name,type} descriptor if upstream included it alongside rows.
function findBoard(obj) {
  if (!obj || typeof obj !== 'object') return null;
  const id = pick(obj, ['id', 'leaderboardId', 'leaderboard_id']);
  const name = pick(obj, ['name', 'title', 'leaderboardName']);
  const type = pick(obj, ['type', 'leaderboardType', 'leaderboard_type']);
  if (id || name || type) return { id, name, type };
  return null;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const tokenAddress = (searchParams.get('tokenAddress') || EMPIRE_ID).trim();
  const id = (searchParams.get('id') || '').trim();
  const limit = clampInt(searchParams.get('limit'), 1, 250, 50);
  const debug = searchParams.get('debug') === '1';

  if (!tokenAddress && !id) return json({ ok: true, configured: false });

  // One specific board by id, else the consolidated (merged) board for the empire.
  const source = id
    ? `/api/leaderboards/${encodeURIComponent(id)}`
    : `/api/leaderboards/consolidated?tokenAddress=${encodeURIComponent(tokenAddress)}`;

  let raw;
  try {
    raw = await get(`${BASE}${source}`);
  } catch (e) {
    // Fall back to listing the empire's boards and taking the first one with rows.
    if (!id) {
      try {
        const list = await get(`${BASE}/api/leaderboards?tokenAddress=${encodeURIComponent(tokenAddress)}`);
        raw = list;
      } catch (e2) {
        return json({ ok: false, configured: true, error: e.message }, 502);
      }
    } else {
      return json({ ok: false, configured: true, error: e.message }, 502);
    }
  }

  const rows = findRows(raw) || [];
  const entries = rows.map(normalizeRow).slice(0, limit);
  const out = {
    ok: true,
    configured: true,
    source,
    empireId: tokenAddress || null,
    board: findBoard(raw),
    count: entries.length,
    entries,
  };
  if (debug) out.raw = raw; // inspect real upstream shape once deployed, then refine
  // Read-only and slow-moving; cache at the edge but keep it fresh enough to feel live.
  return json(out, 200, debug ? 'no-store' : 's-maxage=120, stale-while-revalidate=600');
}

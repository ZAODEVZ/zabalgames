// ZABAL Gamez - Empire Builder leaderboard proxy (GET /api/empire-leaderboard).
//
// Pulls the live leaderboard(s) for our tokenless empire from the Empire Builder API
// and normalizes them to ONE stable contract the frontend renders against:
//
//   { ok, configured, source, empireId,
//     board:  { key, name, main } | null,        // the selected board
//     boards: [{ key, name, main, count }],      // all boards (for a switcher)
//     count, entries: [{ rank, username, displayName, score, address, fid, pfpUrl }],
//     raw? }                                      // raw only with ?debug=1
//
// Upstream shape (from /api/leaderboards/consolidated): an object with keys
// `leaderboard1` (the "main" board) through `leaderboard20` (custom boards). Each is
// either null or a flat map: { name: "<board name>", "<username>": "<score>", ... }.
// e.g. leaderboard2 = { name: "/zabal", zaal: "821.7", hunainashiekh: "64", ... }.
//
// Why a server proxy: runs on Vercel's edge (which can reach empirebuilder.world in
// production - this dev sandbox can't), sidesteps CORS, can attach x-api-key, caches.
// Reads are open GETs (no key needed); EMPIRE_API_KEY is sent as x-api-key if set.
//
// Query params (all optional):
//   tokenAddress  - Empire ID override (defaults to EMPIRE_ID env / our empire)
//   board         - select a board by key (leaderboard2) or name (/zabal or "main").
//                   Default: main if it has entries, else the first non-empty board.
//   limit         - cap entries (1..250, default 50)
//   debug=1       - include the raw upstream payload
//
// Graceful no-op: no empire id configured -> 200 { ok:true, configured:false }.
// Env: EMPIRE_ID (defaults to our empire), EMPIRE_API_KEY (optional).

export const config = { runtime: 'edge' };

const BASE = 'https://empirebuilder.world';
// Our ZABAL Gamez tokenless empire's Empire ID (a custom slug, public - it is on our
// live pages, e.g. empirebuilder.world/empire/zabalgamez01e9af). Env can override it.
// NOT the $ZABAL TOKEN empire (0xbB48...0b07), which is ERC-20 based.
const EMPIRE_ID = process.env.EMPIRE_ID || 'zabalgamez01e9af';
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

const toNum = (v) =>
  typeof v === 'number' ? v
  : (typeof v === 'string' && v.trim() !== '' && !isNaN(v) ? Number(v) : null);

// Board-object meta keys that are NOT leaderboard entries.
const META_KEYS = new Set([
  'name', 'id', 'type', 'leaderboardtype', 'description', 'icon', 'image', 'imageurl',
  'createdat', 'updatedat', 'chainid', 'applyboosters', 'erc20address', 'erc20symbol',
]);

// A board object -> ranked entries. Entries are the username->score pairs; everything
// else (name, etc.) is metadata, filtered out by reserved key OR non-numeric value.
function boardEntries(board) {
  const rows = [];
  for (const [k, v] of Object.entries(board)) {
    if (META_KEYS.has(k.toLowerCase())) continue;
    const score = toNum(v);
    if (score === null) continue;
    rows.push({ username: k, score });
  }
  rows.sort((a, b) => b.score - a.score);
  return rows.map((e, i) => ({
    rank: i + 1,
    username: e.username,
    displayName: e.username,
    score: e.score,
    address: null,
    fid: null,
    pfpUrl: null,
  }));
}

// Parse the consolidated payload's leaderboard1..leaderboard20 keys into boards.
function parseConsolidated(raw) {
  const boards = [];
  for (const [k, v] of Object.entries(raw || {})) {
    if (!/^leaderboard\d+$/i.test(k)) continue;
    if (!v || typeof v !== 'object') continue;
    const main = k.toLowerCase() === 'leaderboard1';
    const entries = boardEntries(v);
    boards.push({ key: k, name: v.name || (main ? 'main' : k), main, count: entries.length, entries });
  }
  return boards;
}

// Pick the board to feature: explicit selector, else main-with-entries, else the
// first non-empty board, else the first board.
function selectBoard(boards, sel) {
  if (sel) {
    const s = sel.trim().toLowerCase();
    return boards.find((b) => b.key.toLowerCase() === s || (b.name || '').toLowerCase() === s) || null;
  }
  return boards.find((b) => b.main && b.count) || boards.find((b) => b.count) || boards[0] || null;
}

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const tokenAddress = (searchParams.get('tokenAddress') || EMPIRE_ID).trim();
  const sel = searchParams.get('board') || '';
  const limit = clampInt(searchParams.get('limit'), 1, 250, 50);
  const debug = searchParams.get('debug') === '1';

  if (!tokenAddress) return json({ ok: true, configured: false });

  const source = `/api/leaderboards/consolidated?tokenAddress=${encodeURIComponent(tokenAddress)}`;
  let raw;
  try {
    raw = await get(`${BASE}${source}`);
  } catch (e) {
    return json({ ok: false, configured: true, error: e.message }, 502);
  }

  const boards = parseConsolidated(raw);
  const chosen = selectBoard(boards, sel);
  const out = {
    ok: true,
    configured: true,
    source,
    empireId: tokenAddress,
    board: chosen ? { key: chosen.key, name: chosen.name, main: chosen.main } : null,
    boards: boards.map((b) => ({ key: b.key, name: b.name, main: b.main, count: b.count })),
    count: chosen ? Math.min(chosen.count, limit) : 0,
    entries: chosen ? chosen.entries.slice(0, limit) : [],
  };
  if (debug) out.raw = raw;
  return json(out, 200, debug ? 'no-store' : 's-maxage=120, stale-while-revalidate=600');
}

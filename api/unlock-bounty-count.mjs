// ZABAL Gamez - Unlock Protocol clipping bounty version counter (GET /api/unlock-bounty-count).
//
// assets/unlock-bounty.js needs to know how many times "Unlock Protocol Clipping Bounty"
// has already been cast on POIDH, so it can auto-fill the next one as v1/v2/v3/... with
// zero manual bookkeeping. The obvious approach - have the browser call POIDH's tRPC API
// directly - doesn't work: poidh.xyz's bounties.fetchAll sends no
// Access-Control-Allow-Origin header (verified directly against the live API), so a
// browser blocks reading the response from any other origin. This endpoint does the
// same lookup server-side (no CORS to worry about server-to-server) and returns a small
// same-origin JSON response the browser can actually read.
//
// Public, read-only, no auth - this only counts a public on-chain bounty title, nothing
// sensitive.
//
//   GET /api/unlock-bounty-count -> { ok, count }

export const config = { runtime: 'edge' };

const POIDH_BASE = 'https://poidh.xyz/api/trpc';
const BASE_TITLE = 'Unlock Protocol Clipping Bounty';
const CHAIN_ID = 8453;
const STATUSES = ['open', 'progress', 'past'];
const MAX_PAGES_PER_STATUS = 5;

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=30, s-maxage=30',
    },
  });
}

async function trpc(proc, payload) {
  const input = encodeURIComponent(JSON.stringify({ 0: { json: payload } }));
  const r = await fetch(`${POIDH_BASE}/${proc}?batch=1&input=${input}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (zabalgamez-unlock-bounty-count)' },
    signal: AbortSignal.timeout(8000),
  });
  const d = await r.json();
  return d[0].result.data.json;
}

// Matches the exact base title, or the base title plus a " vN" suffix - same rule
// used by zpoidh's docs/create-bounty.html.
function titleMatches(title) {
  const re = new RegExp('^' + BASE_TITLE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(\\s+v\\d+)?$', 'i');
  return re.test((title || '').trim());
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';

  if (req.method === 'OPTIONS') return mkJson({ ok: true }, origin);
  if (req.method !== 'GET') return mkJson({ ok: false, error: 'method' }, origin);

  let count = 0;
  try {
    for (const status of STATUSES) {
      let cursor = null;
      for (let page = 0; page < MAX_PAGES_PER_STATUS; page++) {
        const payload = { chainId: CHAIN_ID, status, limit: 50 };
        if (cursor) payload.cursor = cursor;
        const d = await trpc('bounties.fetchAll', payload);
        const items = d.items || [];
        if (!items.length) break;
        for (const b of items) if (titleMatches(b.title)) count++;
        cursor = d.nextCursor;
        if (!cursor) break;
      }
    }
  } catch (e) {
    return mkJson({ ok: false, error: 'poidh_fetch_failed', count: 0 }, origin);
  }

  return mkJson({ ok: true, count }, origin);
}

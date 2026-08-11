// ZABAL Gamez Season 1 points (GET /api/points, POST /api/points).
//
// Season 1 has no vote. Points are awarded BY ZAAL for showing up and doing the things
// that matter that week - joining the 11:30am EST ZAOstock Space, the 5pm EST zm stream,
// posting to the bonus brief, shipping an update. They are public: everyone sees every
// score, which is the whole point of a board people want to climb.
//
//   GET  /api/points        -> { ok, configured, entries:[{rank,handle,name,project,points}], log }
//   POST /api/points        Authorization: Bearer <quick-auth-jwt|ADMIN_KEY>
//        { handle, delta, reason }  -> { ok, handle, points }
//
// Roster comes from data/points-roster.json - the 15 who entered. Someone not on the
// roster cannot be awarded, so a typo creates a phantom entry rather than silently
// scoring the wrong person.
//
// KV:
//   zabal:points:tally  ZSET  <handle> -> total points (public)
//   zabal:points:log    LIST  newest-first JSON {handle,delta,reason,ts} (public, capped)

import { verifyAdmin, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const TALLY = 'zabal:points:tally';
const LOG = 'zabal:points:log';
const LOG_CAP = 100;
const TRACKS = ['artist', 'builder', 'creator'];
const ROSTER_URL = 'https://zabalgamez.com/data/points-roster.json';

// A single award is bounded so a fat-fingered zero cannot hand someone 500 points.
const MAX_DELTA = 50;

function json(body, status = 200, maxAge = 15) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Cache-Control': status === 200 && maxAge ? `public, max-age=${maxAge}, s-maxage=${maxAge}` : 'no-store',
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

async function loadRoster() {
  try {
    const r = await fetch(ROSTER_URL, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(3000) });
    if (!r.ok) return [];
    const doc = await r.json();
    return Array.isArray(doc && doc.people) ? doc.people : [];
  } catch { return []; }
}

const norm = (s) => String(s == null ? '' : s).replace(/^@+/, '').trim().toLowerCase();

// Entering the season is itself worth a point, so nobody sits on a bare zero. Awards stack
// on top of it. This is a floor in code rather than 15 seeded awards, so it cannot drift and
// it does not clutter the award log.
const ENTRY_POINT = 1;

// Everyone on the roster appears. A person with no awards yet has not "not entered" - they
// are entered and have not scored, and the board must say so.
async function board() {
  const people = await loadRoster();
  if (!people.length) return { ok: true, configured: false, entries: [], log: [] };
  if (!KV_URL || !KV_TOKEN) {
    return {
      ok: true,
      configured: false,
      entries: people.map((p, i) => ({
        rank: i + 1, handle: norm(p.handle), name: p.name || p.handle,
        project: p.project || '', tracks: p.tracks || [], points: ENTRY_POINT,
      })),
      log: [],
    };
  }

  let scores = {};
  let log = [];
  try {
    const r = await kvPipeline([
      ['ZRANGE', TALLY, '0', '-1', 'REV', 'WITHSCORES'],
      ['LRANGE', LOG, '0', '19'],
    ]);
    const flat = (r[0] && r[0].result) || [];
    for (let i = 0; i < flat.length; i += 2) scores[norm(flat[i])] = Number(flat[i + 1]) || 0;
    log = ((r[1] && r[1].result) || []).map((raw) => { try { return JSON.parse(raw); } catch { return null; } }).filter(Boolean);
  } catch { /* board still renders at zero rather than erroring out */ }

  const rows = people
    .map((p) => ({
      handle: norm(p.handle),
      name: p.name || p.handle,
      project: p.project || '',
      tracks: Array.isArray(p.tracks) ? p.tracks : [],
      points: ENTRY_POINT + (scores[norm(p.handle)] || 0),
    }))
    .sort((a, b) => (b.points - a.points) || a.name.localeCompare(b.name));

  // Equal scores share a rank. Everyone starts level, so sequential numbering would invent
  // a running order before a single point has been awarded.
  function ranked(list) {
    let lastPoints = null;
    let lastRank = 0;
    return list.map((row, index) => {
      const rank = (row.points === lastPoints) ? lastRank : index + 1;
      lastPoints = row.points;
      lastRank = rank;
      return { rank, ...row };
    });
  }

  // One board per track. Several people entered more than one track, so they appear on more
  // than one board - and each board ranks independently, because a builder's position should
  // not move because an artist scored.
  const boards = TRACKS.map((track) => ({
    track,
    label: track.charAt(0).toUpperCase() + track.slice(1),
    entries: ranked(rows.filter((r) => (r.tracks || []).indexOf(track) >= 0)),
  }));

  // Anyone whose track is not confirmed is surfaced rather than guessed onto a board.
  const unassigned = ranked(rows.filter((r) => !(r.tracks || []).length));

  return { ok: true, configured: true, count: rows.length, boards, unassigned, entries: ranked(rows), log };
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return json({ ok: true }, 200, 0);

  if (req.method === 'GET') return json(await board());

  if (req.method === 'POST') {
    // Awarding points is Zaal's alone. Fails closed: no token, bad token, or a non-admin
    // FID all get 401 before anything is read or written.
    const admin = await verifyAdmin(req, DOMAIN);
    if (!admin.ok) return json({ ok: false, error: 'not authorised' }, 401, 0);
    if (!KV_URL || !KV_TOKEN) return json({ ok: false, error: 'points storage is not configured' }, 503, 0);

    let body;
    try { body = await req.json(); } catch { return json({ ok: false, error: 'bad json' }, 400, 0); }

    const handle = norm(body && body.handle);
    const delta = Math.round(Number(body && body.delta));
    const reason = String((body && body.reason) || '').replace(/[<>]/g, '').trim().slice(0, 120);

    if (!handle) return json({ ok: false, error: 'handle required' }, 400, 0);
    if (!Number.isFinite(delta) || delta === 0) return json({ ok: false, error: 'delta must be a non-zero number' }, 400, 0);
    if (Math.abs(delta) > MAX_DELTA) return json({ ok: false, error: `delta must be between -${MAX_DELTA} and ${MAX_DELTA}` }, 400, 0);
    if (!reason) return json({ ok: false, error: 'reason required' }, 400, 0);

    // Roster check: awarding a handle that does not exist would create a phantom row that
    // never renders (the board is built from the roster), so the write would look like it
    // worked and do nothing visible.
    const people = await loadRoster();
    const known = people.some((p) => norm(p.handle) === handle);
    if (!known) return json({ ok: false, error: 'not on the Season 1 roster: ' + handle }, 400, 0);

    try {
      const r = await kvPipeline([
        ['ZINCRBY', TALLY, String(delta), handle],
        ['LPUSH', LOG, JSON.stringify({ handle, delta, reason, ts: Date.now() })],
        ['LTRIM', LOG, '0', String(LOG_CAP - 1)],
      ]);
      const points = Number((r[0] && r[0].result) || 0);
      return json({ ok: true, handle, delta, points }, 200, 0);
    } catch {
      return json({ ok: false, error: 'write failed' }, 502, 0);
    }
  }

  return json({ ok: false, error: 'method not allowed' }, 405, 0);
}

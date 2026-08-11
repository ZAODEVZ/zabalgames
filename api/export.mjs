// Full KV export (GET /api/export). Admin only.
//
// WHY THIS EXISTS. Every trace of ZABAL Gamez Season 1 lives only in Upstash KV -
// the 15 entrants, the 30 projects, the ballot history, and the points board:
// zabal:subs:*, qv:tally:*, zabal:points:*. There was no export, no backup and no
// local copy, so if that account lapsed the season was simply gone and not
// reconstructable. This turns the worst lock-in we have into an inconvenience.
//
// It SCANs the whole keyspace rather than enumerating the 75 key prefixes found in
// the code, because a prefix list goes stale the moment someone adds a feature and
// the failure mode is a silently incomplete backup - the worst kind.
//
//   GET /api/export            Authorization: Bearer <quick-auth-jwt|ADMIN_KEY>
//     -> { ok, generated, count, types:{...}, data:{ <key>: <value> } }
//   GET /api/export?prefix=zabal:subs   -> only keys under that prefix
//
// The companion is .github/workflows/kv-backup.yml, which calls this nightly and
// commits the result, so the repo always holds a restorable copy.
//
// PRIVACY: qv:ballots:* holds per-voter ballots, which are private by design and
// public nowhere else. They are included here because this is an admin-only backup
// and a backup that omits data is not a backup - but anything derived from this
// export must not republish them.

import { verifyAdmin, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);

// Upstash SCAN pages; 1000 per page keeps each pipeline well inside the edge timeout.
const SCAN_COUNT = 1000;
const MAX_KEYS = 20000;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function kv(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(10000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

// Walk the whole keyspace with SCAN. Cursor '0' both starts and ends the walk, so the
// loop has to run at least once before it can stop.
async function allKeys(prefix) {
  const match = prefix ? `${prefix}*` : '*';
  const keys = [];
  let cursor = '0';
  do {
    const r = await kv([['SCAN', cursor, 'MATCH', match, 'COUNT', String(SCAN_COUNT)]]);
    const page = (r[0] && r[0].result) || [];
    cursor = String(page[0] ?? '0');
    for (const k of (page[1] || [])) keys.push(k);
    if (keys.length >= MAX_KEYS) break;
  } while (cursor !== '0');
  return keys;
}

// Read each key by its actual type. Reading a ZSET with GET returns nothing useful and
// would produce a backup that looks complete and restores empty.
async function readTyped(keys) {
  const types = await kv(keys.map((k) => ['TYPE', k]));
  const cmds = keys.map((k, i) => {
    const t = (types[i] && types[i].result) || 'string';
    if (t === 'zset') return ['ZRANGE', k, '0', '-1', 'WITHSCORES'];
    if (t === 'hash') return ['HGETALL', k];
    if (t === 'list') return ['LRANGE', k, '0', '-1'];
    if (t === 'set') return ['SMEMBERS', k];
    return ['GET', k];
  });
  const vals = await kv(cmds);
  const data = {};
  const typeCount = {};
  keys.forEach((k, i) => {
    const t = (types[i] && types[i].result) || 'string';
    typeCount[t] = (typeCount[t] || 0) + 1;
    let v = vals[i] && vals[i].result;
    // Strings are usually JSON documents; store them parsed so the backup is readable
    // and diffable rather than a wall of escaped strings.
    if (t === 'string' && typeof v === 'string') {
      try { v = JSON.parse(v); } catch { /* keep the raw string */ }
    }
    data[k] = v ?? null;
  });
  return { data, typeCount };
}

export default async function handler(req) {
  if (req.method !== 'GET') return json({ ok: false, error: 'method not allowed' }, 405);

  const admin = await verifyAdmin(req, DOMAIN);
  if (!admin.ok) return json({ ok: false, error: 'not authorised' }, 401);
  if (!KV_URL || !KV_TOKEN) return json({ ok: false, error: 'kv not configured' }, 503);

  const prefix = new URL(req.url).searchParams.get('prefix') || '';
  try {
    const keys = await allKeys(prefix);
    if (!keys.length) return json({ ok: true, generated: new Date().toISOString(), count: 0, types: {}, data: {} });
    const { data, typeCount } = await readTyped(keys);
    return json({
      ok: true,
      generated: new Date().toISOString(),
      prefix: prefix || null,
      count: keys.length,
      truncated: keys.length >= MAX_KEYS,
      types: typeCount,
      data,
    });
  } catch (e) {
    // Fail loudly. A backup route that returns 200 with partial data is worse than one
    // that errors, because nobody checks a green backup.
    return json({ ok: false, error: 'export failed: ' + String(e.message || e) }, 502);
  }
}

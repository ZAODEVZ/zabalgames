// ZABAL Gamez - mentor Finals picks (GET picks, POST pick/unpick).
//
// The mentor half of the hybrid July judging (audit 2026-06-04): community votes
// shortlist (api/build-vote), mentors pick the final winners per track. This endpoint
// holds the mentors' picks. It is the bridge from the live July builds board to the
// August Finals: /finals reads these picks to show the shortlist as it forms, before
// the set is locked into data/finals.json.
//
// Why KV and not data/finals.json: an edge function cannot write a file in the repo.
// Picks live in KV; data/finals.json stays the locked, settled source of truth that a
// human commits once the Finals are final. /finals progressively shows KV picks while
// status is pending.
//
// Authorization: POST is gated to mentor/judge FIDs, set via the ZABAL_JUDGE_FIDS env
// var (comma-separated FIDs). If it is unset, POST is closed (no-one can write) - safe
// by default. GET is always an open read.
//
// GET  /api/finals-picks                         -> { configured, picks: [{ repo, track, by }] }
// POST /api/finals-picks { repo, track, action } Authorization: Bearer <quick-auth-jwt>
//        action: 'pick' (default) | 'unpick'     -> { ok, repo, picks }
//
// No-ops gracefully (configured:false) when KV env vars are absent.

export const config = { runtime: 'edge' };

import { verifyQuickAuth } from '../lib/auth.mjs';

const DOMAIN = 'zabalgamez.com';
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);
const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const PICKS_KEY = 'zabal:finals:picks'; // repo -> JSON { track, by, ts }
const TRACKS = new Set(['artist', 'builder', 'creator']);

const judgeFids = new Set(
  String(process.env.ZABAL_JUDGE_FIDS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
);

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
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

function foldHash(arr) {
  const out = {};
  if (!Array.isArray(arr)) return out;
  for (let i = 0; i < arr.length - 1; i += 2) out[arr[i]] = arr[i + 1];
  return out;
}

function readPicks(hash) {
  const picks = [];
  for (const repo of Object.keys(hash)) {
    let v = {};
    try { v = JSON.parse(hash[repo]) || {}; } catch {}
    picks.push({ repo, track: v.track || '', by: v.by || null });
  }
  return picks.sort((a, b) => (a.track || '').localeCompare(b.track || '') || a.repo.localeCompare(b.repo));
}

function cleanRepo(s) {
  let v = String(s || '').trim();
  const m = v.match(/github\.com\/([^/]+\/[^/?#]+)/i);
  if (m) v = m[1];
  v = v.replace(/\.git$/i, '').toLowerCase().replace(/[^a-z0-9._/-]/g, '');
  const parts = v.split('/').filter(Boolean);
  return parts.length >= 2 ? `${parts[0]}/${parts[1]}`.slice(0, 100) : '';
}

async function currentPicks() {
  const res = await kvPipeline([['HGETALL', PICKS_KEY]]);
  return readPicks(foldHash(res?.[0]?.result));
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  if (req.method === 'OPTIONS') return json({}, 204, origin);

  // Public read: the picks as they form.
  if (req.method === 'GET') {
    if (!KV_URL || !KV_TOKEN) return json({ configured: false, picks: [] }, 200, origin);
    try {
      return json({ configured: true, picks: await currentPicks() }, 200, origin);
    } catch (e) {
      return json({ configured: true, picks: [], detail: e.message }, 502, origin);
    }
  }

  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, origin);

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ error: 'no token' }, 401, origin);

  let fid;
  try { fid = await verifyQuickAuth(token, DOMAIN); }
  catch (e) { return json({ error: 'invalid token', detail: e.message }, 401, origin); }

  // Judge gate: closed unless ZABAL_JUDGE_FIDS lists this FID.
  if (!judgeFids.size) return json({ ok: false, reason: 'no-judges-configured' }, 403, origin);
  if (!judgeFids.has(String(fid))) return json({ ok: false, reason: 'not-a-judge' }, 403, origin);

  let body = {};
  try { body = await req.json(); } catch {}
  const repo = cleanRepo(body.repo);
  if (!repo) return json({ error: 'no repo' }, 400, origin);
  const action = body.action === 'unpick' ? 'unpick' : 'pick';
  const track = TRACKS.has(String(body.track || '').toLowerCase()) ? String(body.track).toLowerCase() : '';

  if (!KV_URL || !KV_TOKEN) return json({ ok: false, reason: 'unconfigured' }, 200, origin);

  try {
    if (action === 'unpick') {
      await kvPipeline([['HDEL', PICKS_KEY, repo]]);
    } else {
      await kvPipeline([['HSET', PICKS_KEY, repo, JSON.stringify({ track, by: fid, ts: Date.now() })]]);
    }
    return json({ ok: true, repo, action, picks: await currentPicks() }, 200, origin);
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502, origin);
  }
}

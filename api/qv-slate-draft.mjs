// ZABAL Gamez - draft vote-slate generator from live builder submissions (GET /api/qv-slate-draft).
//
// Admin-gated, read-only. Reads data/builder-submissions.json - the durable source of
// truth for builder submissions (the same file /api/submissions promotes to the public
// board) - keeps the builders explicitly flagged qv_ballot:true (the human curation gate),
// groups them by their track, and returns a DRAFT slate.
//
// This bridges submissions -> vote candidates but does NOT auto-publish and NEVER opens
// voting. An admin reviews the draft in /slate-admin.html and commits vote-candidates.json
// via a PR. No Supabase, no service-role key, no PII: builder-submissions.json is a public
// curated file, so tracks are read straight off the record (no creator_type mapping).
//
//   GET /api/qv-slate-draft
//        Authorization: Bearer <ADMIN_KEY>
//        -> { ok, configured, status:'draft', submission_count, candidate_count,
//             tracks: { artist:[], builder:[], creator:[], _needs_track:[] } }
//
// Each candidate: { handle, name, url, note, track, submission_status, project_count }
//
// Admin auth: constant-time check of Authorization: Bearer <ADMIN_KEY> header.
// Falls back to { configured: false } if the source file cannot be read.

import { DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const TRACKS = ['artist', 'builder', 'creator'];

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function json(body, origin, maxAge) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': maxAge ? `public, max-age=${maxAge}` : 'no-store',
    },
  });
}

// Constant-time admin check (XOR-accumulate, never short-circuit; fail closed without the key).
function adminOk(req) {
  if (!ADMIN_KEY) return false;
  const auth = req.headers.get('authorization') || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  let diff = provided.length ^ ADMIN_KEY.length;
  for (let i = 0; i < Math.max(provided.length, ADMIN_KEY.length); i++) {
    diff |= (provided.charCodeAt(i) || 0) ^ (ADMIN_KEY.charCodeAt(i) || 0);
  }
  return diff === 0;
}

function cleanHandle(h) {
  return String(h || '').trim().toLowerCase().replace(/^@+/, '');
}

function cleanText(s, n) {
  return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, n || 500);
}

// Validate a builder-submissions.json track. Returns the track or null (ambiguous ->
// _needs_track, admin must assign). builder-submissions.json already uses the exact
// vote-track vocabulary, so this is a whitelist check, not a mapping.
function normTrack(t) {
  const v = String(t || '').toLowerCase().trim();
  return TRACKS.indexOf(v) >= 0 ? v : null;
}

// Short note from the builder record: project count + sparkz potential.
function buildNote(rec) {
  const parts = [];
  const n = Array.isArray(rec.projects) ? rec.projects.length : 0;
  if (n) parts.push(`${n} project${n === 1 ? '' : 's'}`);
  if (rec.sparkz_potential) parts.push(`${cleanText(rec.sparkz_potential, 20)} potential`);
  return parts.join(' - ');
}

// Transform a builder-submissions.json record into a vote candidate draft.
// record.builder = Farcaster handle, record.farcaster = profile url.
function recordToCandidate(rec) {
  const handle = cleanHandle(rec.builder);
  if (!handle) return null;
  const track = normTrack(rec.track);
  let url = cleanText(rec.farcaster, 500);
  if (!/^https?:\/\//i.test(url)) url = `https://farcaster.xyz/${handle}`;
  return {
    handle,
    name: cleanText(rec.name, 80) || handle,
    url,
    note: buildNote(rec),
    track: track || undefined, // undefined = goes to _needs_track
    creator_type: cleanText(rec.track, 30), // raw track string, for the admin _needs_track display
    submission_status: cleanText(rec.status, 20),
    project_count: Array.isArray(rec.projects) ? rec.projects.length : 0,
  };
}

// Read the durable builder submissions file. Same source as /api/submissions' board feed.
async function fetchBuilders(req) {
  try {
    const src = new URL('/data/builder-submissions.json', req.url);
    const r = await fetch(src.toString(), { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(5000) });
    if (!r.ok) return null;
    const doc = await r.json();
    return Array.isArray(doc && doc.submissions) ? doc.submissions : [];
  } catch {
    return null;
  }
}

export default async function handler(req) {
  const origin = ALLOWED_ORIGINS.has(req.headers.get('origin')) ? req.headers.get('origin') : 'https://zabalgamez.com';
  const cors = (o) => json(o, origin, 0);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' } });

  if (req.method !== 'GET') return cors({ ok: false, error: 'method not allowed' });

  // Admin gate.
  if (!adminOk(req)) return cors({ ok: false, error: 'forbidden' });

  const subs = await fetchBuilders(req);
  if (subs === null) {
    return cors({ ok: false, configured: false, error: 'builder-submissions.json unavailable' });
  }

  // Keep only builders explicitly flagged for the ballot, dedupe by handle, group by track.
  const tracks = { artist: [], builder: [], creator: [], _needs_track: [] };
  const seenHandles = new Set();

  for (const rec of subs) {
    if (!rec || rec.qv_ballot !== true) continue; // human curation gate
    const candidate = recordToCandidate(rec);
    if (!candidate) continue;
    if (seenHandles.has(candidate.handle)) continue;
    seenHandles.add(candidate.handle);
    if (candidate.track) {
      tracks[candidate.track].push(candidate);
    } else {
      tracks._needs_track.push(candidate);
    }
  }

  return cors({
    ok: true,
    version: 2,
    configured: true,
    status: 'draft',
    note: 'Read-only draft from builder-submissions.json (qv_ballot:true). Approve and commit data/vote-candidates.json via a PR.',
    submission_count: subs.length,
    candidate_count: seenHandles.size,
    tracks,
  });
}

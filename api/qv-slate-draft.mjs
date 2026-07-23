// ZABAL Gamez - draft vote-slate generator from submissions (GET /api/qv-slate-draft).
//
// Admin-gated endpoint that reads zabalgames_submissions from Supabase, maps them to
// candidate shape, groups by track (derived from creator_type), and returns a DRAFT
// slate. The draft is read-only; an admin manually approves and commits the JSON.
//
// This bridges submissions -> vote candidates, but does NOT auto-publish.
// The admin uses the result to update data/vote-candidates.json explicitly.
//
//   GET /api/qv-slate-draft
//        Authorization: Bearer <ADMIN_KEY>
//        -> { ok, version, status: 'draft', tracks: { artist:[], builder:[], creator:[], _needs_track:[] } }
//
// Each candidate: { handle, name, url, note, submission_status, submission_id, creator_type }
//
// Admin auth: constant-time check of Authorization: Bearer <ADMIN_KEY> header.
// Supabase access: via REST API (SUPABASE_URL + service-role key). Falls back to
// { configured: false } if Supabase is not available.

import { DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const ADMIN_KEY = process.env.ADMIN_KEY || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

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

// Map creator_type to vote track. Returns null if ambiguous (goes to _needs_track).
function mapTrack(creatorType) {
  const t = String(creatorType || '').toLowerCase().trim();
  if (t === 'artist' || t === 'musician') return 'artist';
  if (t === 'builder' || t === 'developer') return 'builder';
  if (t === 'creator' || t === 'media') return 'creator';
  return null; // ambiguous; admin must assign
}

// Build a short note from the submission metadata.
function buildNote(sub) {
  const parts = [];
  if (sub.creator_type) parts.push(cleanText(sub.creator_type, 30));
  const urls = [];
  if (sub.phase1_url) urls.push('demo');
  if (sub.phase1_repo) urls.push('repo');
  if (sub.phase1_cast) urls.push('cast');
  if (urls.length) parts.push(`${urls.join('/')}`);
  return parts.join(' - ');
}

// Fetch submissions from Supabase (status != 'rejected', no wallet/email PII).
async function fetchSubmissions() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return null;
  try {
    const url = new URL('/rest/v1/zabalgames_submissions', SUPABASE_URL);
    url.searchParams.set('select', 'id,name,farcaster,github,phase1_url,phase1_repo,phase1_demo,phase1_cast,creator_type,status');
    url.searchParams.set('order', 'created_at.desc');
    const r = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

// Transform a submission into a vote candidate draft.
function submissionToCandidate(sub) {
  const handle = cleanHandle(sub.farcaster);
  if (!handle) return null;
  const track = mapTrack(sub.creator_type);
  const url = cleanText(sub.phase1_url, 500) || `https://farcaster.xyz/${handle}`;
  const note = buildNote(sub);
  return {
    handle,
    name: cleanText(sub.name, 80) || handle,
    url,
    note,
    submission_status: sub.status,
    submission_id: sub.id,
    creator_type: cleanText(sub.creator_type, 30),
    track: track || undefined, // undefined = goes to _needs_track
  };
}

export default async function handler(req) {
  const origin = ALLOWED_ORIGINS.has(req.headers.get('origin')) ? req.headers.get('origin') : 'https://zabalgamez.com';
  const cors = (o) => json(o, origin, 0);

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Authorization, Content-Type' } });

  if (req.method !== 'GET') return cors({ ok: false, error: 'method not allowed' });

  // Check admin auth.
  if (!adminOk(req)) return cors({ ok: false, error: 'forbidden' });

  // Check Supabase config.
  const subs = await fetchSubmissions();
  if (subs === null) {
    return cors({ ok: false, configured: false, error: 'Supabase not configured' });
  }

  // Transform submissions to candidates and group by track.
  const tracks = { artist: [], builder: [], creator: [], _needs_track: [] };
  const seenHandles = new Set();

  for (const sub of subs) {
    const candidate = submissionToCandidate(sub);
    if (!candidate) continue;

    // Dedupe by handle (newest first, so first occurrence is kept).
    if (seenHandles.has(candidate.handle)) continue;
    seenHandles.add(candidate.handle);

    // Group by track.
    if (candidate.track) {
      tracks[candidate.track].push(candidate);
    } else {
      tracks._needs_track.push(candidate);
    }
  }

  return cors({
    ok: true,
    version: 1,
    configured: true,
    status: 'draft',
    note: 'This is a read-only draft. An admin manually approves and commits to data/vote-candidates.json.',
    submission_count: subs.length,
    candidate_count: seenHandles.size,
    tracks,
  });
}

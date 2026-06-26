// ZABAL Gamez - profile -> track (POST /api/profile-track).
//
// The "skip the questions" path on /game/build-quiz. Instead of answering the 3-question
// quiz, a signed-in player can have their Farcaster profile analyzed: we read their bio +
// display name (server-side, by verified FID) and keyword-score the three lanes - artist,
// builder, creator - returning the best fit plus a short why and the words that matched.
//
//   POST /api/profile-track  + Quick Auth  -> { ok, track, why, matched:[...], confident, handle }
//
// Quick Auth required, so the analysis is always of the caller's own verified profile -
// no arbitrary-FID lookups. Falls back to a gentle default when the bio gives no signal.
// No KV needed; pure read of the Farcaster profile. No-op-safe (returns ok:false reasons).

import { verifyQuickAuth, DOMAIN } from '../lib/auth.mjs';

export const config = { runtime: 'edge' };

const HAATZ = 'https://haatz.quilibrium.com';

const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

// Keyword maps - words people put in their Farcaster bio that signal a lane.
const KW = {
  artist: ['artist', 'music', 'musician', 'song', 'sound', 'audio', 'producer', 'dj', 'beat', 'rapper', 'singer', 'visual', 'art', 'design', 'designer', 'creative', 'paint', 'illustrat', 'animat', 'pixel', 'photograph', 'nft art', 'culture'],
  builder: ['build', 'builder', 'dev', 'developer', 'engineer', 'engineering', 'code', 'coder', 'coding', 'software', 'founder', 'cofounder', 'hacker', 'tech', 'solidity', 'smart contract', 'protocol', 'onchain', 'web3 dev', 'ship', 'product', 'app', 'sdk', 'data', 'ai'],
  creator: ['creator', 'content', 'video', 'stream', 'streamer', 'writer', 'write', 'media', 'podcast', 'host', 'community', 'marketing', 'social', 'storyteller', 'film', 'editor', 'newsletter', 'curator', 'host', 'comms', 'growth'],
};

const TRACK_LABEL = { artist: 'Artist', builder: 'Builder', creator: 'Creator' };

function mkJson(body, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function fetchProfile(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, { signal: AbortSignal.timeout(3000) });
    if (!r.ok) return {};
    const u = ((await r.json()).users || [])[0] || {};
    const bio = (u.profile && u.profile.bio && (u.profile.bio.text || u.profile.bio)) || u.bio || '';
    return { username: u.username || null, display: u.display_name || u.displayName || '', bio: String(bio || '') };
  } catch {
    return {};
  }
}

// Score the three lanes against the bio + display name; return ranked tracks + matches.
function scoreTracks(text) {
  const hay = String(text || '').toLowerCase();
  const out = {};
  const matched = {};
  for (const t of Object.keys(KW)) {
    let s = 0; const hits = [];
    for (const w of KW[t]) {
      if (hay.indexOf(w) >= 0) { s++; hits.push(w); }
    }
    out[t] = s; matched[t] = hits;
  }
  return { out, matched };
}

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b) => mkJson(b, origin);

  if (req.method === 'OPTIONS') return json({ ok: true });
  if (req.method !== 'POST') return json({ ok: false, error: 'method' });

  const auth = req.headers.get('authorization') || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return json({ ok: false, reason: 'unverified' });
  let fid;
  try { fid = await verifyQuickAuth(token, DOMAIN); }
  catch { return json({ ok: false, error: 'invalid token' }); }

  const p = await fetchProfile(fid);
  const text = [p.display, p.bio].filter(Boolean).join(' ');
  const { out, matched } = scoreTracks(text);

  const order = ['artist', 'builder', 'creator'];
  let best = order[0], top = -1;
  order.forEach((t) => { if (out[t] > top) { top = out[t]; best = t; } });
  const confident = top > 0;
  // No signal in the bio -> a friendly default lane, flagged so the UI can soften it.
  if (!confident) best = 'creator';

  const hits = matched[best] || [];
  const label = TRACK_LABEL[best];
  let why;
  if (confident) {
    const words = hits.slice(0, 3).join(', ');
    why = `Your Farcaster profile reads ${label.toLowerCase()} to us` + (words ? ` - you talk about ${words}` : '') +
      `. Here is where to start, with real ZAO projects in this lane below.`;
  } else {
    why = `Your bio did not point hard at one lane, so we put you in the ${label.toLowerCase()} lane to start - it is the easiest on-ramp. Retake the 3 questions any time for a sharper match.`;
  }

  return json({ ok: true, track: best, label, why, matched: hits, confident, handle: p.username || ('fid' + fid) });
}

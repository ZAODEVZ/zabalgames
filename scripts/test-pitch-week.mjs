#!/usr/bin/env node
// test-pitch-week.mjs - the two pitch-week properties that a later change could silently reverse.
//
// WHY THIS EXISTS. The format is settled (Zaal 2026-09-08: everyone pitches, recorded, three
// minutes, judges give notes, notes public, non-scoring - docs/season-2-pitch-week.md). Two parts
// of it are the kind that erode without anyone deciding to erode them:
//
//   1. NON-SCORING. Notes are feedback. The drift is somebody counting them - comment counts,
//      a "most-noted pitch", an average. Season 1 already had a signals block per battle, so
//      adding one to a pitch would look like consistency rather than a reversal.
//   2. INFORMED CONSENT. Notes are public and written before the cut, so an entrant reads the
//      panel's view of their own work in public. Zaal chose that; the obligation it creates is
//      telling people BEFORE they record. That obligation lives in one sentence of page copy,
//      which is exactly the kind of thing a rewrite drops.
//
//   node scripts/test-pitch-week.mjs

import { readFileSync } from 'node:fs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (c, m) => (c ? ok(m) : fail(m));

const hub = readFileSync('recordings.html', 'utf8');
const spec = readFileSync('docs/season-2-pitch-week.md', 'utf8');
const finals = JSON.parse(readFileSync('data/finals.json', 'utf8'));
const recaps = JSON.parse(readFileSync('data/recaps.json', 'utf8'));

// --- 1. non-scoring, structurally ---
const pitchRecaps = (recaps.recaps || []).filter((r) => r.type === 'pitch');
const scored = pitchRecaps.filter((r) => r.signals || r.score != null || r.rank != null || r.votes != null);
check(scored.length === 0,
  `no pitch recap carries a score, rank, votes or signals block (${pitchRecaps.length} pitch recap(s) checked)`);
const battleTracks = (finals.battles || []).map((b) => b.track);
check(!battleTracks.includes('pitch'),
  'data/finals.json has no "pitch" battle - pitch week must not appear as a scored signal track');

// --- 2. the informed-consent sentence must survive a copy rewrite ---
const pitchCard = hub.slice(hub.indexOf('id="pitch-recordings"') - 1800, hub.indexOf('id="pitch-recordings"') + 200);
check(/three-minute|three minute/i.test(pitchCard), 'the pitch card states the three-minute length');
check(/notes.{0,40}public|public.{0,40}notes/i.test(pitchCard), 'the pitch card says the notes are public');
check(/before the cut/i.test(pitchCard),
  'the pitch card says the notes are written BEFORE the cut - if this is gone, consent is no longer informed');
check(/not.{0,20}scored|Nothing here is scored/i.test(pitchCard), 'the pitch card says nothing is scored');

// --- 3. the spec still records WHY, not just what ---
check(/must not be counted, ranked, averaged or aggregated/i.test(spec),
  'the spec forbids aggregating notes into anything score-like');
check(/before the pitch/i.test(spec),
  'the spec records that consent to public feedback must come before the pitch');
check(/chosen deliberately|decided deliberately/i.test(spec),
  'the spec records that judges-seeing-the-work-first was a deliberate choice, not an oversight');

console.log('');
if (failures) { console.error(`test-pitch-week: ${failures} failure(s).`); process.exit(1); }
console.log('test-pitch-week: non-scoring holds, and the up-front disclosure is intact.');

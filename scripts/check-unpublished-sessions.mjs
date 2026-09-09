#!/usr/bin/env node
// check-unpublished-sessions.mjs - a workshop we recorded and transcribed must not stay invisible.
//
// WHY THIS EXISTS. Found 2026-09-09 by comparing transcripts on disk against data/recaps.json:
//
//   2026-06-22-nemesis-creator-journey.md      2,922 words, titled "ZABAL GAMEZ Workshop
//                                              w/Nemesis", creator track - and NO recap entry,
//                                              no recording page, zero mentions on the live
//                                              /speakers and /recordings pages.
//   2026-06-20-dan-singjoy-eden-fractal-pt1.md 2,413 words. /recordings/16 links the sibling
//                                              file; part 1 is linked from nowhere.
//
// Someone showed up, presented, and was recorded. The transcript was made and committed. Then
// the session was never published, and nothing anywhere said so - it is only visible by
// diffing two directories nobody diffs. That is a worse failure than a stale number, because
// the cost lands on a contributor rather than on us.
//
// SCOPE: `zabal-games-workshops` only. The other stream directories are deliberately exempt and
// each exemption has a reason, because "skip this directory" is how a real gap later hides:
//   bcz-yapz            a different show (BetterCallZaal's), not ZABAL Gamez sessions
//   farcaster-batches   GM Farcaster's week; rendered on /farcaster-batches + /streams, and
//                       those episodes are not ours to publish as recordings
//
// This does NOT fail the build. Publishing a session is a decision about a named person's
// recording - whether it airs, and when - and that is Zaal's call, not a build gate. It reports,
// loudly, with the word count, so the thing that gets lost is visible instead of silent.
//
//   node scripts/check-unpublished-sessions.mjs

import { readFileSync, readdirSync, existsSync } from 'node:fs';

const DIR = 'data/streams/zabal-games-workshops/raw/transcripts';
const RECAPS = 'data/recaps.json';

if (!existsSync(DIR)) { console.log('  ok   no workshop transcript directory'); process.exit(0); }

let recaps;
try {
  const raw = JSON.parse(readFileSync(RECAPS, 'utf8'));
  recaps = Array.isArray(raw) ? raw : (raw.recaps || raw.items || []);
} catch (e) {
  console.error(`check-unpublished-sessions: cannot read ${RECAPS} (${e.message})`);
  process.exit(1);
}

// Which transcript files are claimed by a recap. The link is a full GitHub URL, so match on the
// basename rather than the whole string - the host and branch are not the fact being checked.
const linked = new Set();
for (const r of recaps) {
  const m = /raw\/transcripts\/([^/?#]+\.md)/.exec(r.transcript || '');
  if (m) linked.add(m[1]);
}

const files = readdirSync(DIR).filter((f) => f.endsWith('.md'));
const orphans = files.filter((f) => !linked.has(f));

if (orphans.length === 0) {
  console.log(`  ok   all ${files.length} workshop transcript(s) are published on a recording page`);
  process.exit(0);
}

console.log(`  NOTE ${orphans.length} recorded workshop(s) transcribed but not published:`);
for (const f of orphans) {
  let words = 0, title = '';
  try {
    const t = readFileSync(`${DIR}/${f}`, 'utf8');
    words = t.split(/\s+/).filter(Boolean).length;
    title = (/^title:\s*"?([^"\n]+)"?/m.exec(t) || [, ''])[1].trim();
  } catch { /* report it anyway - an unreadable transcript is still an unpublished session */ }
  console.log(`       ${f}  ${words ? words + ' words' : '(unreadable)'}${title ? `  "${title}"` : ''}`);
}
console.log(`       Someone presented and was recorded. Publishing is a decision about a named
       person's session, so this reports rather than fails. To publish one, add a
       data/recaps.json entry and generate the page with scripts/ingest-recording.mjs -
       BACKFILL the manifest from any existing recap first, or the generator will
       overwrite a live page with a placeholder (it did, on /recordings/27).`);
process.exit(0);

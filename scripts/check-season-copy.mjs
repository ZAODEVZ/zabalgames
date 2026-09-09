#!/usr/bin/env node
// check-season-copy.mjs - superseded season copy must not come back.
//
// WHY THIS EXISTS. PRs #660 and #664 closed the season in the site's copy: "June workshops,
// July open build, August Finals" became "Season 1 ran June to August 2026 and is complete".
// That correction reached exactly TWO files - index.html and press.html, the front door and
// the press kit - and stopped. Measured 2026-09-09: **80 other tracked pages still carried the
// superseded line**, including every recording page and the arcade.
//
// It was not sloppiness. #660's own title is "reconcile the FRONT DOOR", so the scope was
// deliberate and the rest was simply never done. The failure is that nothing recorded the
// difference between "deliberately scoped" and "finished", so for six days the site said two
// different things about whether its season was over, and the majority said the wrong one.
//
// AND IT WOULD HAVE COME BACK ON ITS OWN. scripts/ingest-recording.mjs carried the superseded
// line in its page template, so every recording generated from then on would have reintroduced
// it - a fix that loses ground each time the site grows. Fixing the artifacts without the
// generator is how a correction quietly reverts.
//
// So this is a denylist of copy that is KNOWN WRONG, not a style checker. Each entry names what
// replaced it, because a guard that says "do not write this" without saying what to write
// instead gets satisfied by deleting the sentence.
//
//   node scripts/check-season-copy.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Each: the dead string, why it is dead, and what to write instead.
const SUPERSEDED = [
  {
    // Match the SCHEDULE PHRASE ITSELF, not one sentence that contains it. The first version of
    // this guard anchored on "3-month Build-A-Thon. June workshops..." and therefore missed
    // assets/zg-profile.js, which said "three-month build event. June workshops, July open build,
    // August Finals." - the same dead claim, in outbound cast copy, one wording away. A denylist
    // keyed on a whole sentence only catches the copy you already found.
    dead: 'June workshops, July open build, August Finals',
    why: 'describes a finished season as an upcoming schedule',
    instead: 'Season 1 ran June to August 2026 and is complete',
  },
];

// Files a reader or a generator can produce. The generator is included on purpose: it is the
// only one of these whose content becomes 35 more files.
let files = [];
try {
  // *.js as well as *.html. The first version scanned only pages and the generator, and missed
  // assets/zg-profile.js - a SHARED helper whose stale line was the text a person actually POSTS.
  // Outbound copy is the highest-stakes surface here and it does not live in a page.
  files = execSync('git ls-files "*.html" "assets/*.js" "scripts/ingest-recording.mjs"', { encoding: 'utf8' })
    .split('\n').filter(Boolean);
} catch {
  console.error('check-season-copy: could not list tracked files (not a git repo?)');
  process.exit(1);
}

const hits = [];
for (const f of files) {
  let t;
  try { t = readFileSync(f, 'utf8'); } catch { continue; }
  for (const s of SUPERSEDED) {
    let i = t.indexOf(s.dead);
    while (i !== -1) {
      // press.html states the schedule and then says it closed IN THE SAME SENTENCE, which is
      // correct and must not be flagged. The exemption is therefore scoped to the rest of THAT
      // LINE, not to a character window.
      //
      // It was a 160-character window first, and a deliberately broken test caught why that is
      // wrong: injecting the dead phrase into a comment directly above a corrected line was
      // FORGIVEN, because the corrected line sat inside the window. An exemption that reaches
      // across lines lets any nearby correct sentence vouch for a stale one - including a
      // comment explaining the very fix, which is the likeliest thing to be next to it.
      const lineEnd = t.indexOf('\n', i);
      const restOfLine = t.slice(i, lineEnd === -1 ? t.length : lineEnd);
      if (!/closed on|and is complete|ran in 2026|is complete\b/.test(restOfLine)) {
        hits.push({ file: f, line: t.slice(0, i).split('\n').length, ...s });
        break;
      }
      i = t.indexOf(s.dead, i + 1);
    }
  }
}

if (hits.length === 0) {
  console.log(`  ok   no superseded season copy in ${files.length} tracked file(s)`);
  process.exit(0);
}

console.error(`\ncheck-season-copy: ${hits.length} file(s) carry superseded season copy.\n`);
for (const h of hits) {
  console.error(`  ${h.file}:${h.line}`);
  console.error(`      has:     "${h.dead}"`);
  console.error(`      why:     ${h.why}`);
  console.error(`      instead: "${h.instead}"`);
}
console.error(`
Fix the GENERATOR as well as the pages if scripts/ingest-recording.mjs is listed - otherwise
every recording made afterwards puts the line back, and the correction loses ground as the
site grows. That is exactly how this drifted to 80 files the first time.
`);
process.exit(1);

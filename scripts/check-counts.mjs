#!/usr/bin/env node
// check-counts.mjs - the countable claims in CLAUDE.md must match the repo.
//
// WHY THIS EXISTS. CLAUDE.md is the file every session reads FIRST, so a wrong number in it
// propagates into whatever that session writes next. Measured 2026-09-09, it was wrong twice
// and one of those was a self-contradiction:
//
//   "68 top-level pages"   line 48   - actual 66, and line 507 of the SAME FILE said 66
//   "45 edge endpoints"    line 49   - actual 46
//
// Neither was ever a decision. Both are counts of files, and they went stale the moment someone
// added a page or an endpoint, which is exactly the kind of claim a human will never re-count
// and a machine can re-count for free.
//
// These numbers are structural, not editorial: they change whenever `git ls-files` changes, so
// they are the cheapest possible thing to enforce and the most pointless thing to maintain by
// hand. Every OTHER number in CLAUDE.md - 31 projects, 100+ members, 500 USDC - is a decision or
// a measurement of the world and is deliberately NOT checked here. This guard owns file counts
// only, and should stay that way; a checker that starts adjudicating season figures would fire
// on things only Zaal can settle.
//
// A claim is matched WHEREVER it appears, not on a fixed line, so a second copy of the same fact
// elsewhere in the file is checked too - which is what would have caught the 66/68 split.
//
//   node scripts/check-counts.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const ls = (pattern) => execSync(`git ls-files ${pattern}`, { encoding: 'utf8' }).split('\n').filter(Boolean);

// Each: how the claim is phrased, what it should be, and how that truth is derived.
export function actuals() {
  return [
    {
      label: 'top-level pages',
      re: /(\d+)\s+top-level pages/g,
      actual: ls('"*.html"').filter((f) => !f.includes('/')).length,
      how: 'git ls-files "*.html" with no directory component',
    },
    {
      label: 'recording pages',
      re: /(\d+)\s+recording pages/g,
      actual: ls('"recordings/*.html"').length,
      how: 'git ls-files "recordings/*.html"',
    },
    {
      label: 'edge endpoints',
      re: /(\d+)\s+edge endpoints/g,
      actual: ls('"api/*.mjs" "api/*/*.mjs"').length,
      how: 'git ls-files "api/*.mjs" "api/*/*.mjs" (nested ones like snap/signup count)',
    },
  ];
}

const doc = readFileSync('CLAUDE.md', 'utf8');
const lineOf = (i) => doc.slice(0, i).split('\n').length;

const bad = [];
let claims = 0;
for (const spec of actuals()) {
  let m;
  while ((m = spec.re.exec(doc)) !== null) {
    claims++;
    const claimed = Number(m[1]);
    if (claimed !== spec.actual) {
      bad.push({ ...spec, claimed, line: lineOf(m.index) });
    }
  }
}

if (bad.length === 0) {
  console.log(`  ok   ${claims} countable claim(s) in CLAUDE.md match the repo`);
  process.exit(0);
}

console.error(`\ncheck-counts: ${bad.length} of ${claims} countable claim(s) in CLAUDE.md are wrong.\n`);
for (const b of bad) {
  console.error(`  CLAUDE.md:${b.line}  says ${b.claimed} ${b.label}, actual is ${b.actual}`);
  console.error(`      counted by: ${b.how}`);
}
console.error(`
Fix the NUMBER, not the check - these are counts of files, so the repo is right by definition.
If you just added or deleted a page or an endpoint, this is the reminder to update the sentence
that describes the site, in the file every session reads first.
`);
process.exit(1);

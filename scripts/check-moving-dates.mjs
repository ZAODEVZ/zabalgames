#!/usr/bin/env node
// check-moving-dates.mjs - a fact that MOVES must not be published as a fixed date.
//
// WHY THIS EXISTS. The kv-backup workflow disables itself 60 days after the last HUMAN commit,
// so its deadline moves 60 days out every time anyone commits. On 2026-09-09 four records
// published it as a fixed date and gave FOUR different answers, every one of them correct when
// written:
//
//   CLAUDE.md                       2026-11-06
//   handoffs/status (vault)         2026-11-07
//   TODO.md  (PUBLIC at /todo)      2026-11-07
//   README.md                       2026-11-06
//   GET /api/backup-health          2026-11-08   <- the only one that is true right now
//
// A reader comparing any two of them reasonably concludes something broke. And the harm is not
// hypothetical: the RECHECK instruction attached to the old date asserted the canary "should
// already be failing" by 2026-10-24, which stopped being true the moment ordinary commits moved
// the deadline to 11-08 - so it would have told the next reader the DETECTOR was broken when
// nothing was wrong.
//
// A re-check date cannot fix this, which is why this is a separate check from check-recheck.mjs.
// A marker says "come back and look"; the problem here is the SHAPE of the claim. The honest
// form is to name the live source, so the guard bans the literal and points at the endpoint.
//
// NARROW ON PURPOSE. It knows about one moving fact. Season figures, prize pools and the season
// dates are settled history and must NOT be added here - they are supposed to be written down.
//
//   node scripts/check-moving-dates.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// A date that would be a plausible kv-backup deadline: 60 days out from any recent human commit.
// Bounded to the window where publishing one is the mistake this exists to stop.
const DEADLINE_RE = /\b2026-1[012]-\d{2}\b/g;
const CONTEXT = /backup|kv-backup|switches itself off|disable|workflow/i;

const files = execSync('git ls-files "*.md" "*.txt" "*.html"', { encoding: 'utf8' })
  .split('\n').filter(Boolean).filter((f) => !f.startsWith('docs/') && !f.startsWith('data/'));

const hits = [];
for (const f of files) {
  let t;
  try { t = readFileSync(f, 'utf8'); } catch { continue; }
  const lines = t.split('\n');
  lines.forEach((line, i) => {
    // Only a date sitting in backup context, and only when the line ASSERTS it rather than
    // pointing at the endpoint or marking itself as a re-check.
    if (!CONTEXT.test(line)) return;
    if (/RECHECK|backup-health|disablesAt|daysLeft|MOVES|moves/i.test(line)) return;
    const m = line.match(DEADLINE_RE);
    if (m) hits.push({ f, line: i + 1, dates: m.join(', '), text: line.trim().slice(0, 110) });
  });
}

if (hits.length === 0) {
  console.log(`  ok   the backup deadline is not published as a fixed date anywhere`);
  process.exit(0);
}

console.error(`\ncheck-moving-dates: ${hits.length} place(s) publish the backup deadline as a fixed date.\n`);
for (const h of hits) {
  console.error(`  ${h.f}:${h.line}  ${h.dates}`);
  console.error(`      ${h.text}`);
}
console.error(`
That date moves 60 days out on every human commit, so any literal goes stale the next time
someone commits - and four records already disagreed by three days while all being "correct
when written".

Do NOT fix this with a re-check date. A marker says "come back and look"; the problem is the
SHAPE of the claim. Name the live source instead:

    curl -s https://zabalgamez.com/api/backup-health   ->  .inactivity.disablesAt, .daysLeft
`);
process.exit(1);

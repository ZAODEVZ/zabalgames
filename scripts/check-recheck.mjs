#!/usr/bin/env node
// check-recheck.mjs - fail when a time-bound claim in the docs is past its re-verify date.
//
// WHY THIS EXISTS. The most expensive recurring failure in this repo is not a bug, it is a
// claim that stays true-looking after it stops being true. PRs #669 and #670 existed
// entirely to clear six such claims out of README/CLAUDE.md - the docs were telling every
// session the season was still running, that /info held a gallery it did not hold, and that
// two deleted crons were live. On 2026-09-08 the estate recorded six more instances in a
// single day, including a "VPS down" line that was still opening files 16 days after the
// box came back, and which had lanes avoiding a working machine.
//
// The measured lesson behind the design: rules enforced by structure run at about 100%,
// rules enforced by good intentions run at 3-40%. So a re-check date that only sits in a
// table is a rule nobody keeps. This makes the repo refuse to look healthy while a dated
// claim is unverified.
//
// It matters most for THIS repo specifically, because Season 1 is closed and the repo is
// expected to sit untouched until Season 2 prep in late November - eleven weeks during
// which every freshly-measured fact in CLAUDE.md quietly ages. The first person back would
// otherwise act on all of it as if it were still measured.
//
//   node scripts/check-recheck.mjs           # report; exit 1 if anything is overdue
//   node scripts/check-recheck.mjs --quiet   # failures + due-soon only
//   node scripts/check-recheck.mjs --list    # every marker with its status, no failing
//
// THE MARKER. Put this on or next to any claim about a deadline, an external service, a
// program or a cycle:
//
//   <!-- RECHECK 2026-10-24: the kv-backup canary should be red by now; silence means the
//        detector broke, not that the deadline moved -->
//
// The date is when the claim must be re-verified, and the text says what to actually check.
// Both are required: a bare date tells the next person nothing about what to look at.
//
// WHEN IT FAILS, THE FIX IS NOT TO BUMP THE DATE. Re-verify the claim, correct it if it
// changed, and then set the next date. Bumping a date on an unverified claim reproduces
// precisely the failure this guards against.

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';

const QUIET = process.argv.includes('--quiet');
const LIST = process.argv.includes('--list');

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const warn = (m) => { if (!QUIET || LIST) console.log('  DUE SOON ' + m); };
const ok = (m) => { if (!QUIET && !failures) console.log('  ok   ' + m); };

const WARN_WITHIN_DAYS = 14;
const DAY = 86400000;

// Only tracked text files - a marker in an untracked scratch file is not a claim anyone reads.
let files = [];
try {
  files = execSync('git ls-files "*.md" "*.html" "*.txt" "*.json" "*.mjs" "*.yml"', { encoding: 'utf8' })
    .split('\n').filter(Boolean);
} catch { console.error('  FAIL not a git repo, or git unavailable'); process.exit(1); }

// RECHECK <date>[: <what to verify>]. Tolerant of comment syntax around it.
//
// The "what" group is OPTIONAL ON PURPOSE, even though it is required to pass. If the regex
// demanded it, a marker written as a bare date would match nothing and be silently skipped -
// a malformed marker would read as no marker at all, which is the exact failure mode this
// whole script exists to attack. Better to match it and fail it loudly.
const RE = /RECHECK\s+(\d{4}-\d{2}-\d{2})\s*[:\-]?\s*([^\n\r>*|]*)/g;

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

const found = [];
for (const f of files) {
  if (f === 'scripts/check-recheck.mjs') continue; // this file documents the format
  let text;
  try { text = readFileSync(f, 'utf8'); } catch { continue; }
  if (!text.includes('RECHECK')) continue;
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    RE.lastIndex = 0;
    let m;
    while ((m = RE.exec(line))) {
      found.push({ file: f, line: i + 1, date: m[1], what: (m[2] || '').trim().replace(/\s*-+>?\s*$/, '').trim() });
    }
  });
}

if (!found.length) {
  // Not a pass. A repo full of dated claims and zero markers means nobody is marking them,
  // which is the state this check exists to end - say so rather than printing a green tick.
  console.log('  note: no RECHECK markers found. If this repo states anything time-bound -');
  console.log('        a deadline, an external service, a program, a cycle - it needs one.');
  console.log('        Format: <!-- RECHECK YYYY-MM-DD: what to re-verify -->');
  process.exit(0);
}

for (const r of found) {
  const when = new Date(r.date + 'T00:00:00Z');
  if (Number.isNaN(when.getTime())) { fail(`${r.file}:${r.line} - "${r.date}" is not a real date`); continue; }
  if (!r.what) { fail(`${r.file}:${r.line} - RECHECK ${r.date} has no "what to verify" text. A bare date tells the next person nothing.`); continue; }

  const days = Math.round((when - today) / DAY);
  const where = `${r.file}:${r.line}`;
  if (LIST) { console.log(`  ${r.date}  ${days >= 0 ? '+' + days + 'd' : days + 'd'}  ${where} - ${r.what}`); continue; }

  if (days < 0) {
    fail(`${where} - OVERDUE by ${-days} day(s) (due ${r.date}): ${r.what}\n` +
         '         Re-verify the claim and correct it if it changed, THEN set the next date. ' +
         'Bumping the date on an unverified claim is the failure this check exists to stop.');
  } else if (days <= WARN_WITHIN_DAYS) {
    warn(`${where} - due in ${days} day(s) (${r.date}): ${r.what}`);
  } else {
    ok(`${where} - ${r.date} (${days}d)`);
  }
}

if (LIST) process.exit(0);
if (failures) {
  console.error(`check-recheck: ${failures} claim(s) past their re-verify date.`);
  process.exit(1);
}
if (!QUIET) console.log(`check-recheck: ${found.length} dated claim(s), none overdue.`);

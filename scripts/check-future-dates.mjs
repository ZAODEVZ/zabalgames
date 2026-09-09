#!/usr/bin/env node
// check-future-dates.mjs - a date in the FUTURE on a public page is a claim that expires.
//
// WHY THIS EXISTS, and why it is not the same check as check-recheck.mjs.
//
// `check-recheck.mjs` validates markers that already exist: it fails when a RECHECK date has
// passed, warns when one is close, and rejects a malformed one. What it cannot do is NOTICE a
// time-bound claim that never got a marker - it has nothing to look at. So the enforced rule
// "anything time-bound carries a re-check date" was enforced only for claims someone had
// already remembered to mark, which is the honour system wearing a guard's clothes.
//
// This closes that half. A date in the future, in prose, on a page the public can load, is a
// promise with an expiry: on 2026-10-04 "October 3, 2026" silently becomes a page advertising
// a past event as upcoming. Nobody re-reads a page that nothing links to - and the one real
// hit when this was written, /zao-festivals, is exactly such an orphan.
//
// MEASURED BEFORE BUILDING, because a checker that fires on mostly-harmless rows gets switched
// off. Across every tracked *.html on 2026-09-09: two matches, both the same claim on one page,
// and ZERO future ISO dates. A noise floor of one real thing is what makes this worth running.
//
// It is being added NOW, while Season 2 has no dates, deliberately. The moment Season 2 dates
// land they are all future-dated claims, and this is the difference between each of them
// carrying an expiry and each of them going stale in public the way Season 1's did.
//
// PAST dates are NOT flagged. "June 4, 2026" in a recap is a record of something that happened
// and it stays true forever. Only the future expires.
//
// THE FIX IS NEVER TO DELETE THE DATE. Add a marker next to the claim saying what to verify:
//     <!-- RECHECK 2026-10-04: ZAOstock was October 3. Did it happen, move, or get cancelled?
//          If it is past, this page must stop describing it as upcoming. -->
// check-recheck.mjs then owns it from there, and will fail the build once that date passes.
//
//   node scripts/check-future-dates.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june',
  'july', 'august', 'september', 'october', 'november', 'december'];

// Today at UTC midnight, so a run at 23:59 and one at 00:01 agree.
const now = new Date();
const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

let files = [];
try {
  files = execSync('git ls-files "*.html"', { encoding: 'utf8' }).split('\n').filter(Boolean);
} catch {
  console.error('check-future-dates: could not list tracked files (not a git repo?)');
  process.exit(1);
}

// Strip <script> and <style> so a hardcoded date inside JS logic is not read as page copy,
// then strip tags so an ISO date inside an attribute (datetime=, content=) is not a claim
// the reader ever sees. This check is about what a HUMAN reads on the page.
function visibleText(html) {
  return html
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')          // comments include the RECHECK markers themselves
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

const monthRe = new RegExp(`\\b(${MONTHS.join('|')})\\s+(\\d{1,2}),?\\s+(20\\d\\d)\\b`, 'gi');
const isoRe = /\b(20\d\d)-(\d{2})-(\d{2})\b/g;

const findings = [];
for (const f of files) {
  let html;
  try { html = readFileSync(f, 'utf8'); } catch { continue; }
  const hasMarker = /RECHECK\s+\d{4}-\d{2}-\d{2}/.test(html);
  const text = visibleText(html);

  const seen = new Set();
  const add = (utc, raw) => {
    if (utc <= today) return;                      // the past does not expire
    const key = `${f}|${raw}`;
    if (seen.has(key)) return;                     // one row per distinct claim per file
    seen.add(key);
    if (hasMarker) return;                         // the page already owns its expiry
    findings.push({ file: f, raw, on: new Date(utc).toISOString().slice(0, 10) });
  };

  let m;
  while ((m = monthRe.exec(text)) !== null) {
    const mi = MONTHS.indexOf(m[1].toLowerCase());
    const d = Number(m[2]);
    if (d < 1 || d > 31) continue;
    add(Date.UTC(Number(m[3]), mi, d), m[0]);
  }
  while ((m = isoRe.exec(text)) !== null) {
    const [, y, mo, d] = m;
    const mi = Number(mo) - 1, dd = Number(d);
    if (mi < 0 || mi > 11 || dd < 1 || dd > 31) continue;
    add(Date.UTC(Number(y), mi, dd), m[0]);
  }
}

if (findings.length === 0) {
  console.log('  ok   no unmarked future-dated claim on any public page');
  process.exit(0);
}

console.error(`\ncheck-future-dates: ${findings.length} future-dated claim(s) with no RECHECK marker.\n`);
for (const f of findings) {
  console.error(`  ${f.file}  "${f.raw}"  (expires ${f.on})`);
}
console.error(`
A date in the future is a claim that expires. On the day after, this page tells the public
that a past event is upcoming, and nobody re-reads a page that nothing links to.

DO NOT fix this by deleting the date. Add a marker next to the claim saying what to verify:

    <!-- RECHECK ${new Date(today + 86400000).toISOString().slice(0, 10)}: <what to re-verify, and how> -->

check-recheck.mjs owns it from there and will fail the build once that date passes.
`);
process.exit(1);

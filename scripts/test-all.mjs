#!/usr/bin/env node
// test-all.mjs - run every scripts/test-*.mjs, report each, and never let one hide another.
//
// WHY THIS EXISTS. The SessionStart hook chained tests with `&&`:
//
//   validate.mjs --quiet && test-crm.mjs && test-judging.mjs && test-crons.mjs && ...
//
// Two failures came out of that shape, and they compounded.
//
// 1. `test-crons.mjs` existed only to test `api/daily-cast.mjs`, which PR #574 DELETED. So it
//    crashed on import with ERR_MODULE_NOT_FOUND on every run - and because `&&` short-circuits,
//    EVERY TEST AFTER IT NEVER RAN. The hook looked configured, listed seven tests, and
//    executed three.
// 2. `test-submission-pipeline.mjs` and `test-submission-email.mjs` were never in the chain at
//    all. The pipeline one had been failing since the switch to auto-accept, so instead of
//    being updated it was quietly left out - leaving the submission pipeline unguarded while a
//    test file sat in the repo implying otherwise.
//
// Both are the same root cause: the list of tests was hand-maintained, and a broken or
// forgotten entry failed silently. So:
//
//   * TESTS ARE DISCOVERED, not listed. Adding scripts/test-foo.mjs runs it. There is no
//     wiring step to forget, which is what made the two orphans possible.
//   * NO SHORT-CIRCUIT. Every test runs even if an earlier one fails, and the summary names
//     every failure. One broken test can no longer mask the rest.
//   * A CRASH IS A FAILURE, not a skip. A test that cannot even import is the loudest kind of
//     broken, and it is exactly what went unnoticed for months here.
//
//   node scripts/test-all.mjs          # run everything, report, exit 1 if any failed
//   node scripts/test-all.mjs --quiet  # only failures and the summary
//
// Exits 1 if any test fails. Deliberately does NOT run validate.mjs - that is a separate
// concern with its own checks, and the hook runs it first.

import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const QUIET = process.argv.includes('--quiet');
const SELF = 'test-all.mjs';

const tests = readdirSync('scripts')
  .filter((f) => /^test-.*\.mjs$/.test(f) && f !== SELF)
  .sort();

if (!tests.length) {
  // Not a pass. A repo with no tests is a finding, not a clean run.
  console.error('  FAIL no scripts/test-*.mjs found at all - that is not a green run.');
  process.exit(1);
}

const failed = [];
for (const t of tests) {
  const r = spawnSync('node', [`scripts/${t}`], { encoding: 'utf8' });
  const code = r.status;
  if (code === 0) {
    if (!QUIET) console.log(`  ok   ${t}`);
    continue;
  }
  failed.push(t);
  const out = ((r.stdout || '') + (r.stderr || '')).trim().split('\n');
  // A module-resolution crash is the case that hid here for months - name it explicitly so
  // nobody reads it as "the test is a bit flaky".
  const crashed = out.some((l) => /ERR_MODULE_NOT_FOUND|Cannot find module|SyntaxError/.test(l));
  console.error(`  FAIL ${t}${crashed ? ' - CRASHED before running (cannot import). This is a broken test, not a failing assertion.' : ''}`);
  for (const line of out.filter(Boolean).slice(-6)) console.error(`         ${line}`);
}

if (!QUIET) console.log('');
if (failed.length) {
  console.error(`test-all: ${failed.length} of ${tests.length} test file(s) failed: ${failed.join(', ')}`);
  process.exit(1);
}
console.log(`test-all: ${tests.length} test file(s), all passing.`);

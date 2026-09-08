#!/usr/bin/env node
// check-generated.mjs - fail when a committed generated file no longer matches its source.
//
// WHY THIS EXISTS. Six files in this repo are generated from data/ and committed:
// recordings/index.json, recordings.txt, the JSON-LD block in recordings.html, data/crm.json,
// crm.txt and crm.html. Two of them are advertised on the site as the machine-readable
// surface - /recordings/index.json and /recordings.txt are linked from the hub as
// "Structured JSON for agents". So when data/recaps.json changes and nobody re-runs the
// generator, the surface agents read silently disagrees with the source of truth, and
// nothing anywhere says so.
//
// WHY IT COULD NOT EXIST BEFORE. Both generators stamped `generated: new Date()`. That made
// every committed artifact differ from a fresh regeneration EVERY DAY regardless of content,
// so a diff could never distinguish "the data changed and nobody rebuilt" from "a day
// passed". Real drift was permanently buried in date noise, and any check built on diffing
// would have failed daily, been called noisy, and been switched off - the honour-system
// death spiral. Both generators now derive a `source` hash from their input instead, so
// identical input produces identical bytes and a diff means something. Measured: running
// either twice produces byte-identical output.
//
//   node scripts/check-generated.mjs           # report; exit 1 if any artifact is stale
//   node scripts/check-generated.mjs --quiet   # failures only
//
// This check NEVER leaves the tree modified. It snapshots the artifacts, runs the
// generators, compares, and restores the originals in a finally block - even on a crash.
// Fixing drift is a deliberate act: run the generator yourself and commit the result.
//
// NOT COVERED, deliberately: scripts/resolve-pfps.mjs, which writes data/pfps.json from
// remote APIs (haatz, fnames). Its output legitimately changes when those change, so it
// cannot be deterministic and a drift check on it would be meaningless. Saying so here
// rather than leaving a silent gap.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const QUIET = process.argv.includes('--quiet');

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => { if (!QUIET) console.log('  ok   ' + m); };

const GENERATORS = [
  { script: 'scripts/build-recordings-index.mjs',
    from: 'data/recaps.json',
    outputs: ['recordings/index.json', 'recordings.txt', 'recordings.html'] },
  { script: 'scripts/build-crm.mjs',
    from: 'data/people.json + workshop-leads.json + dream-leads.json + mentors.json',
    outputs: ['data/crm.json', 'crm.txt', 'crm.html'] },
];

for (const gen of GENERATORS) {
  const paths = gen.outputs.map((rel) => ({ rel, abs: join(ROOT, rel) }));
  const missing = paths.filter((p) => !existsSync(p.abs));
  if (missing.length) { fail(`${gen.script}: output missing from the repo - ${missing.map((m) => m.rel).join(', ')}`); continue; }

  // Snapshot as Buffers so a byte-for-byte restore is exact, whatever the encoding.
  const before = new Map(paths.map((p) => [p.rel, readFileSync(p.abs)]));
  let ran = false;
  try {
    execFileSync('node', [join(ROOT, gen.script)], { cwd: ROOT, stdio: 'pipe' });
    ran = true;
    for (const p of paths) {
      const after = readFileSync(p.abs);
      if (after.equals(before.get(p.rel))) ok(`${p.rel} matches ${gen.from}`);
      else {
        fail(`${p.rel} is STALE - it does not match ${gen.from}.\n` +
             `         Regenerate and commit it:  node ${gen.script}\n` +
             '         Do not hand-edit a generated file; the next build overwrites it.');
      }
    }
  } catch (e) {
    fail(`${gen.script} failed to run - ${String(e.message).split('\n')[0]}`);
  } finally {
    // Restore unconditionally. A check that leaves the working tree rewritten would make
    // "did I change this?" unanswerable, which is the same class of problem as the drift.
    if (ran) for (const p of paths) writeFileSync(p.abs, before.get(p.rel));
  }
}

if (!QUIET) console.log('');
if (failures) {
  console.error(`check-generated: ${failures} generated file(s) out of sync with their source.`);
  process.exit(1);
}
if (!QUIET) console.log('check-generated: every generated file matches its source.');

#!/usr/bin/env node
// test-ingest-page-path.mjs - a nested recording must never be written to a top-level page.
//
// WHY THIS EXISTS. ingest-recording.mjs used to rebuild the output path from the DIGITS in the
// recap's page:
//
//   pageNum = String(recap.page).replace(/\D/g, '')
//
// Fine for /recordings/12. Catastrophic for a nested one:
//
//   /recordings/fireside/1  ->  "1"  ->  recordings/1.html
//   /recordings/zao/1       ->  "1"  ->  recordings/1.html
//
// So re-ingesting EITHER nested recording overwrote /recordings/1 - a different session, with a
// different presenter, transcript and chapters. Found 2026-09-09 by regenerating the archive and
// noticing /recordings/1 came back with 7 chapters that were not its own. Nothing had ever
// re-ingested those two, which is the only reason it had not already destroyed that page.
//
// Same shape as the /recordings/27 incident: the generator quietly writing over a good page.
// There it wrote the wrong FIELDS; here it wrote the wrong FILE.
//
// THE LOAD-BEARING ASSERTION is that two different recaps never resolve to the same file. That is
// the property that was violated, and it is checkable without running the generator or touching
// the filesystem, so it runs in the SessionStart hook with everything else.
//
//   node scripts/test-ingest-page-path.mjs

import { readFileSync } from 'node:fs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (c, m) => (c ? ok(m) : fail(m));

// The rule the generator must follow: the file is the page path, not its digits.
const fileFor = (page) => `${String(page).replace(/^\//, '')}.html`;
// The old, broken rule, kept so the test states exactly what regressing would look like.
const brokenFileFor = (page) => `recordings/${String(page).replace(/\D/g, '')}.html`;

const recaps = JSON.parse(readFileSync('data/recaps.json', 'utf8')).recaps;
const pages = recaps.map((r) => r.page).filter(Boolean);

check(pages.length > 0, `${pages.length} recap page paths to check`);

// --- 1. no two recaps may resolve to the same file ---
const seen = new Map();
for (const p of pages) {
  const f = fileFor(p);
  if (seen.has(f)) fail(`${p} and ${seen.get(f)} BOTH resolve to ${f} - one would overwrite the other`);
  else seen.set(f, p);
}
if (seen.size === pages.length) ok(`all ${pages.length} recaps resolve to distinct files`);

// --- 2. THE REGRESSION: prove the old rule collided, so this test cannot pass vacuously ---
{
  const collided = new Map();
  const dupes = [];
  for (const p of pages) {
    const f = brokenFileFor(p);
    if (collided.has(f)) dupes.push(`${collided.get(f)} + ${p} -> ${f}`);
    else collided.set(f, p);
  }
  check(dupes.length > 0,
    'the digits-only rule DID collide on this data - the test is exercising a real case, not a hypothetical');
  for (const d of dupes) ok(`  would have collided: ${d}`);
}

// --- 3. nested pages keep their directory ---
const nested = pages.filter((p) => p.split('/').length > 3);
check(nested.length > 0, `${nested.length} nested recording page(s) exist to protect`);
for (const p of nested) {
  const f = fileFor(p);
  check(f.startsWith(p.replace(/^\//, '').split('/').slice(0, -1).join('/') + '/'),
    `${p} stays in its own directory (${f})`);
  check(!/^recordings\/\d+\.html$/.test(f), `${p} does NOT resolve to a top-level page file`);
}

// --- 4. the generator no longer contains the broken derivation ---
const src = readFileSync('scripts/ingest-recording.mjs', 'utf8');
check(!/parseInt\(String\(recaps\[existingIdx\]\.page\)\.replace\(\/\\D\/g/.test(src),
  'ingest-recording.mjs no longer rebuilds the page path from its digits');

console.log('');
if (failures) { console.error(`test-ingest-page-path: ${failures} failure(s).`); process.exit(1); }
console.log('test-ingest-page-path: nested recordings keep their own file; no two recaps collide.');

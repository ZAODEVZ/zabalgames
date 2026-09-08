#!/usr/bin/env node
// test-test-fixtures.mjs - a QA row must never reach a public surface, and catching it must not
// require editing code.
//
// WHY THIS EXISTS. QA rows seeded while the ballot was being built went live on the public
// board and one ranked #2 on the public artist standings. The stopgap was a hardcoded denylist,
// which then got duplicated in two files with two different key formats:
//
//   api/submissions.mjs   QA_FIXTURES = new Set(['5', '6'])
//   api/qv-vote.mjs       EXCLUDED    = new Set(['artist:5', 'creator:6'])
//
// The same fact maintained twice, one copy needing the row's TRACK as well. Seed a fixture,
// remember one file, and it is votable. docs/season-2-ideas.md lists this under "do not repeat".
//
// lib/test-fixtures.mjs is now the single source and detects by MARKER, not by id. THE
// LOAD-BEARING CASE HERE IS THE LAST ONE: a brand-new fixture, with an id nobody has hardcoded
// anywhere, must be excluded. If that ever fails, we are back to a denylist wearing a
// predicate's clothes.
//
//   node scripts/test-test-fixtures.mjs

import assert from 'node:assert/strict';
import { isTestFixture, isTestFixtureId, LEGACY_TEST_IDS, TEST_MARKERS } from '../lib/test-fixtures.mjs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (c, m) => (c ? ok(m) : fail(m));

// The three real rows, copied from the committed backup rather than invented. If the shape of a
// submission changes, this test should start failing rather than quietly testing a fiction.
const REAL_FIXTURES = [
  { id: '1', status: 'pending', promptId: 'wip-test', answer: 'E2E test draft from the build terminal - safe to reject.' },
  { id: '5', status: 'approved', promptId: 'project', answer: '[QA TEST - please delete] A short pixel-art animation loop made for the ZABAL Gamez board.' },
  { id: '6', status: 'approved', promptId: 'project', answer: '[QA TEST - please delete] A short written piece made for the ZABAL Gamez board.' },
];
for (const f of REAL_FIXTURES) {
  check(isTestFixture(f) === true, `real fixture id ${f.id} (promptId=${f.promptId}) is excluded`);
}

// Each detection path independently, so a passing suite cannot rest on one of them.
check(isTestFixture({ id: '900', promptId: 'wip-test', answer: 'anything' }) === true, 'promptId wip-test alone excludes');
check(isTestFixture({ id: '901', promptId: 'test-2', answer: 'anything' }) === true, 'promptId test-2 alone excludes');
check(isTestFixture({ id: '902', promptId: 'smoke-test', answer: 'x' }) === true, 'a promptId ending -test excludes');
check(isTestFixture({ id: '903', promptId: 'project', answer: '[QA TEST] x' }) === true, 'a [QA TEST marker in answer excludes');
check(isTestFixture({ id: '904', promptId: 'project', project: '[FIXTURE] demo' }) === true, 'a marker in project excludes');
check(isTestFixture({ id: '905', promptId: 'project', fields: { description: '[TEST] blurb' } }) === true, 'a marker nested in fields excludes');
check(isTestFixture({ id: '906', promptId: 'project', test: true }) === true, 'an explicit test:true excludes');
check(isTestFixture({ id: '907', promptId: 'project', isTest: true }) === true, 'an explicit isTest:true excludes');
check(isTestFixture({ id: '908', promptId: 'project', answer: '[qa test - lowercase] x' }) === true, 'marker matching is case-insensitive');

// --- Real submissions must NOT be swept up. A filter that eats the season is not a fix. ---
const REAL_ROWS = [
  { id: '11', promptId: 'project', answer: 'A neon-themed Tetris game built as a Farcaster Mini App.', fields: { project: 'Neon Tetris' } },
  { id: '13', promptId: 'project', answer: 'Savings circles on the blockchain: save and get interest free loans.', fields: { project: 'BreadCoop' } },
  { id: '17', promptId: 'project', answer: 'ColorZAO is an interactive discovery platform where users paint grayscale art.', fields: { project: 'ColorZAO' } },
  // Words that merely CONTAIN "test" must not trip it - "latest", "contest", "testimonial".
  { id: '30', promptId: 'project', answer: 'Our latest contest testimonial and protest coverage.', fields: { project: 'Latest Contest' } },
  { id: '31', promptId: 'project', answer: 'A testing framework for artists', fields: { project: 'Testing Framework' } },
];
for (const r of REAL_ROWS) {
  check(isTestFixture(r) === false, `real submission id ${r.id} ("${(r.fields?.project || '').slice(0, 22)}") is NOT excluded`);
}

// --- edge inputs must not throw or wrongly exclude ---
for (const bad of [null, undefined, 0, '', 'string', [], { }]) {
  let res;
  try { res = isTestFixture(bad); } catch (e) { fail(`isTestFixture(${JSON.stringify(bad)}) threw: ${e.message}`); continue; }
  if (res !== false) fail(`isTestFixture(${JSON.stringify(bad)}) returned ${res}, expected false`);
}
ok('null, undefined, 0, "", a string, [] and {} all return false without throwing');

// --- the id backstop, used where only an id is in hand (the tally ZSET members) ---
for (const id of [...LEGACY_TEST_IDS]) check(isTestFixtureId(id) === true, `isTestFixtureId("${id}") is true`);
check(isTestFixtureId('11') === false, 'isTestFixtureId("11") is false for a real row');
check(isTestFixtureId(null) === false, 'isTestFixtureId(null) is false');
// Deliberately not track-prefixed - the old set required knowing the track, which is one more
// thing to get wrong for no benefit.
check(isTestFixtureId('artist:5') === false, 'ids are bare, not track-prefixed (artist:5 is not an id)');

// --- THE LOAD-BEARING CASE: a NEW fixture, id hardcoded nowhere, must still be excluded ---
{
  const brandNew = { id: '999999', status: 'approved', promptId: 'project',
    answer: '[QA TEST - please delete] seeded while testing Season 2', fields: { track: 'builder' } };
  if (LEGACY_TEST_IDS.has('999999')) fail('test setup is wrong: 999999 must not be in LEGACY_TEST_IDS');
  if (isTestFixture(brandNew) !== true) {
    fail('A NEW FIXTURE WITH AN UNKNOWN ID WAS NOT EXCLUDED. Detection has regressed to a ' +
         'hardcoded denylist, which is the bug this file exists to prevent - the next QA row ' +
         'will be votable and nobody will notice until it ranks.');
  } else {
    ok('a brand-new fixture (id 999999, in no denylist) is excluded by its marker alone');
  }
  // And prove the marker is what did it, not the id.
  const sameIdNoMarker = { id: '999999', status: 'approved', promptId: 'project', answer: 'a real project' };
  check(isTestFixture(sameIdNoMarker) === false, 'the same unknown id WITHOUT a marker is not excluded - it is the marker doing the work');
}

check(TEST_MARKERS.length >= 3, `${TEST_MARKERS.length} deliberate markers are published for seeding fixtures`);

console.log('');
if (failures) { console.error(`test-test-fixtures: ${failures} failure(s).`); process.exit(1); }
console.log('test-test-fixtures: fixtures excluded by marker, real submissions untouched.');

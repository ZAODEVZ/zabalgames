#!/usr/bin/env node
// test-check-deployed.mjs - a page that could not be read must never report as fine.
//
// WHY THIS EXISTS. check-deployed.mjs answers "is production serving what main says", and the
// one way it could do real damage is by answering "yes" when it actually failed to look. That
// is this repo's most expensive recurring shape: a blind sensor reads as calm. It cost hours on
// zao-tick reporting "0 changes" while every probe was 401ing, and it is why
// /api/backup-health returns measured:false + healthy:null rather than a comforting green.
//
// So THE LOAD-BEARING ASSERTIONS are the UNREACHABLE ones. If those ever pass as ok:true, the
// check has become a thing that reassures people about a site it never contacted.
//
// No network here, deliberately. The verdict logic is pure and imported, so this runs in the
// SessionStart hook with the rest of test-all and cannot fail because the wifi dropped.
//
//   node scripts/test-check-deployed.mjs

import { verdict, urlFor, sha256, CRITICAL, SITE } from './check-deployed.mjs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (c, m) => (c ? ok(m) : fail(m));

const A = sha256('<html>a</html>');
const B = sha256('<html>b</html>');

// --- the happy path ---
check(verdict({ localHash: A, liveHash: A }).state === 'IN SYNC', 'identical bytes are IN SYNC');
check(verdict({ localHash: A, liveHash: A }).ok === true, 'IN SYNC is ok');

// --- real drift ---
{
  const v = verdict({ localHash: A, liveHash: B });
  check(v.state === 'DRIFTED', 'different bytes are DRIFTED');
  check(v.ok === false, 'DRIFTED is not ok');
  check(v.detail.includes(A.slice(0, 12)) && v.detail.includes(B.slice(0, 12)),
    'DRIFTED names both hashes so the reader can tell which side moved');
}

// --- THE LOAD-BEARING CASES: blind must never read as fine ---
for (const [label, input] of [
  ['a fetch error', { localHash: A, error: 'ECONNREFUSED' }],
  ['an HTTP failure', { localHash: A, error: 'HTTP 503' }],
  ['a missing local file', { error: 'no local ghost.html' }],
  ['a null body', { localHash: A, liveHash: null }],
  ['undefined everything', {}],
]) {
  const v = verdict(input);
  if (v.state !== 'UNREACHABLE' || v.ok !== false) {
    fail(`${label} produced ${v.state}/ok=${v.ok}. A PAGE THAT COULD NOT BE READ MUST NOT ` +
         'REPORT AS FINE - this is the blind-sensor failure the whole file exists to prevent.');
  } else ok(`${label} is UNREACHABLE and not ok`);
}

// A hash that merely LOOKS absent must not be mistaken for a match.
check(verdict({ localHash: undefined, liveHash: undefined }).ok === false,
  'two undefined hashes are not "equal" - absence is not agreement');

// --- url mapping, since a wrong URL would compare the wrong page and call it drift ---
check(urlFor('index') === `${SITE}/`, 'index maps to the site root, not /index');
check(urlFor('results') === `${SITE}/results`, 'a slug maps to the clean URL');
check(!urlFor('results').endsWith('.html'), 'no .html suffix - vercel.json sets cleanUrls');

// --- the default set is short enough to actually get run, and covers the canonical pages ---
check(CRITICAL.length <= 8, `the default set is ${CRITICAL.length} pages - short enough to be run`);
for (const must of ['index', 'results', 'august']) {
  check(CRITICAL.includes(must), `the default set covers /${must}`);
}

console.log('');
if (failures) { console.error(`test-check-deployed: ${failures} failure(s).`); process.exit(1); }
console.log('test-check-deployed: blind never reads as fine; drift names both sides.');

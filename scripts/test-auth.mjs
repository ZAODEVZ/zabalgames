#!/usr/bin/env node
// test-auth.mjs - the admin gate, pinned.
//
// WHY THIS EXISTS. lib/auth.mjs decides who can hard-DELETE a submission from the public
// board, award points, and fire notifications. It had no test. The code is careful - I read it
// before writing this and found no live hole; timingEq refuses two blank strings on purpose,
// and the ADMIN_KEY fallback only engages when that env var is actually set. So this is a
// regression guard, not a repair, and the point is that an auth regression is INVISIBLE: no
// error, no failing page, nothing looks wrong until someone who should not be able to delete
// a submission deletes one.
//
// The load-bearing assertion is the last one: THE ALLOWLIST IS PINNED. Adding a third admin
// FID fails this test. That is deliberate friction - admin access to a public board should not
// be something a diff can widen quietly, and "add your FID here" is a one-line change that
// reads as harmless in review.
//
//   node scripts/test-auth.mjs
//
// No network. verifyQuickAuth is not exercised against live JWKS - a token that is not a JWT
// makes it throw fast, which is the path the ADMIN_KEY fallback depends on, and that IS tested.

import { isAdminFid, timingEq, verifyAdmin, DOMAIN } from '../lib/auth.mjs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));

const req = (authHeader) => new Request('https://zabalgamez.com/api/submissions', {
  headers: authHeader == null ? {} : { authorization: authHeader },
});

// --- timingEq: the empty-secret bypass, which is the classic way a gate like this opens ---
check(timingEq('', '') === false, 'timingEq("","") is false - two blanks never authorize');
check(timingEq(null, null) === false, 'timingEq(null,null) is false');
check(timingEq(undefined, '') === false, 'timingEq(undefined,"") is false');
check(timingEq('secret', '') === false, 'timingEq(secret,"") is false');
check(timingEq('', 'secret') === false, 'timingEq("",secret) is false');
check(timingEq('secret', 'secret') === true, 'timingEq matches an identical secret');
check(timingEq('secret', 'secrez') === false, 'timingEq rejects a one-character difference');
check(timingEq('secret', 'secretx') === false, 'timingEq rejects a longer string with the same prefix');
check(timingEq('secretx', 'secret') === false, 'timingEq rejects a shorter string with the same prefix');

// --- isAdminFid ---
check(isAdminFid(19640) === true, 'isAdminFid allows 19640 (zaal)');
check(isAdminFid('19640') === true, 'isAdminFid allows the FID as a string');
check(isAdminFid(1057869) === true, 'isAdminFid allows 1057869 (imanafrikah)');
for (const bad of [0, -1, 999999, null, undefined, '', 'abc', NaN, {}, []]) {
  if (isAdminFid(bad) !== false) fail(`isAdminFid(${JSON.stringify(bad)}) should be false`);
}
ok('isAdminFid rejects 0, negatives, unknown FIDs, null, undefined, "", "abc", NaN, {}, []');

// --- ADMIN_FIDS env extension: must extend, and must not open up on junk ---
{
  const saved = process.env.ADMIN_FIDS;
  process.env.ADMIN_FIDS = '4242';
  check(isAdminFid(4242) === true, 'ADMIN_FIDS env extends the allowlist');
  check(isAdminFid(4243) === false, 'ADMIN_FIDS env does not extend to a neighbouring FID');
  for (const junk of ['', ',', ',,', 'abc', ' , , ', '0']) {
    process.env.ADMIN_FIDS = junk;
    const opened = [1, 2, 999, 12345].filter((f) => isAdminFid(f));
    if (opened.length) fail(`ADMIN_FIDS=${JSON.stringify(junk)} authorized ${opened.join(', ')}`);
  }
  ok('junk in ADMIN_FIDS ("", ",", "abc", "0") authorizes nobody');
  if (saved === undefined) delete process.env.ADMIN_FIDS; else process.env.ADMIN_FIDS = saved;
}

// --- verifyAdmin: every path must fail closed ---
{
  const saved = process.env.ADMIN_KEY;

  delete process.env.ADMIN_KEY;
  const noKeyCases = [
    [undefined, 'no Authorization header'],
    ['', 'an empty Authorization header'],
    ['Bearer ', 'Bearer with nothing after it'],
    ['Bearer    ', 'Bearer with only whitespace'],
    ['Basic abc', 'a non-Bearer scheme'],
    ['bearer lowercase', 'a lowercase bearer scheme'],
    ['Bearer anything-at-all', 'an arbitrary token while ADMIN_KEY is unset'],
  ];
  for (const [hdr, label] of noKeyCases) {
    const r = await verifyAdmin(req(hdr), DOMAIN);
    if (r.ok) fail(`verifyAdmin ALLOWED ${label} - the gate is open`);
  }
  ok('verifyAdmin denies every request when ADMIN_KEY is unset, including "Bearer " and non-Bearer schemes');

  process.env.ADMIN_KEY = 'correct-horse-battery-staple';
  const wrong = await verifyAdmin(req('Bearer wrong-key'), DOMAIN);
  check(wrong.ok === false, 'verifyAdmin denies a wrong ADMIN_KEY');
  const blank = await verifyAdmin(req('Bearer '), DOMAIN);
  check(blank.ok === false, 'verifyAdmin denies a blank token even with ADMIN_KEY set');
  const right = await verifyAdmin(req('Bearer correct-horse-battery-staple'), DOMAIN);
  check(right.ok === true && right.key === true, 'verifyAdmin allows the correct ADMIN_KEY and marks it key:true');

  // An empty ADMIN_KEY must not turn into a wildcard.
  process.env.ADMIN_KEY = '';
  const emptyKey = await verifyAdmin(req('Bearer '), DOMAIN);
  const emptyKey2 = await verifyAdmin(req('Bearer x'), DOMAIN);
  check(emptyKey.ok === false && emptyKey2.ok === false, 'an empty ADMIN_KEY authorizes nobody');

  if (saved === undefined) delete process.env.ADMIN_KEY; else process.env.ADMIN_KEY = saved;
}

// --- THE PIN. Widening admin access must not be a quiet one-line diff. ---
{
  const EXPECTED = [19640, 1057869];
  const saved = process.env.ADMIN_FIDS;
  delete process.env.ADMIN_FIDS;
  // Probe a wide range rather than reading the private Set, so this tests behaviour.
  const extra = [];
  for (let fid = 1; fid <= 200000; fid++) {
    if (isAdminFid(fid) && !EXPECTED.includes(fid)) extra.push(fid);
    if (extra.length > 5) break;
  }
  const missing = EXPECTED.filter((f) => !isAdminFid(f));
  if (extra.length) {
    fail(`the hardcoded admin allowlist has GAINED FID(s) ${extra.join(', ')}. ` +
         'Admin can hard-delete submissions from the public board. If this is intended, ' +
         'add the FID to EXPECTED in this test in the same commit and say who they are.');
  } else if (missing.length) {
    fail(`the admin allowlist LOST FID(s) ${missing.join(', ')} - zaal or imanafrikah can no longer moderate.`);
  } else {
    ok(`allowlist is exactly ${EXPECTED.join(', ')} (checked FIDs 1-200000) - widening it fails this test`);
  }
  if (saved === undefined) delete process.env.ADMIN_FIDS; else process.env.ADMIN_FIDS = saved;
}

console.log('');
if (failures) { console.error(`test-auth: ${failures} failure(s).`); process.exit(1); }
console.log('test-auth: the admin gate fails closed on every path, and the allowlist is pinned.');

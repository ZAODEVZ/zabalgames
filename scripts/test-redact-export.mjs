#!/usr/bin/env node
// test-redact-export.mjs - prove the redactor actually redacts, before it is trusted again.
//
// WHY THIS EXISTS. scripts/redact-export.py is the single control standing between this
// PUBLIC repo and the private half of the KV store: per-voter ballots, auth tokens, notif
// tokens, and entrant email addresses. It is not a hypothetical risk. The first two backup
// runs, 2026-08-12 01:07:57Z and 01:11:30Z, committed 11 entrants' personal email addresses
// and 50 per-voter ballots into a public repository, before this step existed.
//
// The redactor has carried its own internal self-check ever since. What it did NOT have,
// until now, was a test - so nothing verified the self-check itself works, and nothing would
// notice a redactor that had been gutted, refactored wrong, or had a prefix quietly dropped
// from its list. Five other scripts/test-*.mjs exist; this control, the highest-stakes one in
// the repo, had none.
//
// The load-bearing property here is the LAST case: a neutered redactor must FAIL this test.
// A test that passes against a redactor which does nothing is worse than no test, because it
// converts an unguarded leak into a guarded-looking one.
//
//   node scripts/test-redact-export.mjs
//
// Exits non-zero on any failure. Writes only into a temp dir it removes afterwards.

import { mkdtempSync, writeFileSync, readFileSync, rmSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REDACTOR = 'scripts/redact-export.py';
let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);

const tmp = mkdtempSync(join(tmpdir(), 'redact-test-'));
const cleanup = () => { try { rmSync(tmp, { recursive: true, force: true }); } catch {} };

// An export containing every shape that must not reach a public repo, plus things that must
// survive - a redactor that drops everything is as broken as one that drops nothing.
const EXPORT = {
  ok: true,
  count: 9,
  data: {
    'qv:ballots:19640': [{ track: 'artist', votes: 4 }],          // private per-voter ballot
    'qv:ballots:1057869': [{ track: 'builder', votes: 9 }],
    'zabal:agent:tok:abc': 'secret-agent-token',                   // auth token
    'zabal:profile:nonce:xyz': 'one-time-nonce',                   // auth nonce
    'zabal:notif:tokens': ['notif-token-1', 'notif-token-2'],      // exact-match drop
    'zabal:sub:v1:99': { handle: 'someone', email: 'entrant@gmail.com', project: 'A thing' },
    'zabal:sub:v1:98': { handle: 'nested', fields: { contact: 'deep.person@yahoo.co.uk' } },
    'zabal:subs:recent': ['99', '1', '98', '2'],                   // must survive intact
    'zabal:points:tally': { someone: 12 },                         // must survive intact
    'zabal:contact:role': 'reach us at info@thezao.com',            // allowlisted, must survive
  },
};

function run(redactorPath, exportDoc) {
  const inp = join(tmp, 'in.json');
  const outp = join(tmp, 'out.json');
  writeFileSync(inp, JSON.stringify(exportDoc));
  try {
    const stdout = execFileSync('python3', [redactorPath, inp, outp], { encoding: 'utf8' });
    return { exit: 0, stdout, out: JSON.parse(readFileSync(outp, 'utf8')) };
  } catch (e) {
    return { exit: e.status ?? 1, stdout: (e.stdout || '') + (e.stderr || ''), out: null };
  }
}

try {
  // --- 1. the real redactor, on a realistic export ---
  const r = run(REDACTOR, EXPORT);
  if (r.exit !== 0) { fail(`the real redactor exited ${r.exit} on a valid export: ${r.stdout.trim()}`); }
  else {
    const blob = JSON.stringify(r.out.data);

    // Private keys must be GONE, not emptied.
    const mustBeGone = ['qv:ballots:19640', 'qv:ballots:1057869', 'zabal:agent:tok:abc',
      'zabal:profile:nonce:xyz', 'zabal:notif:tokens'];
    const survived = mustBeGone.filter((k) => k in r.out.data);
    if (survived.length) fail(`private key(s) survived redaction: ${survived.join(', ')}`);
    else ok('every ballot, token and nonce key dropped');

    // And their VALUES must not appear anywhere, even detached from their key.
    const secrets = ['secret-agent-token', 'one-time-nonce', 'notif-token-1'];
    const leakedVals = secrets.filter((s) => blob.includes(s));
    if (leakedVals.length) fail(`secret value(s) still present in the output: ${leakedVals.join(', ')}`);
    else ok('no dropped key\'s value survives anywhere in the blob');

    // Emails: non-allowlisted scrubbed, including one nested two levels deep.
    for (const addr of ['entrant@gmail.com', 'deep.person@yahoo.co.uk']) {
      if (blob.includes(addr)) fail(`entrant email survived: ${addr}`);
    }
    if (!blob.includes('entrant@gmail.com') && !blob.includes('deep.person@yahoo.co.uk')) {
      ok('entrant emails scrubbed, including one nested inside fields{}');
    }
    if (blob.includes('info@thezao.com')) ok('allowlisted role address preserved');
    else fail('allowlisted info@thezao.com was scrubbed - the allowlist is not working');

    // Non-private data must be untouched: a redactor that eats the season is not a fix.
    if (JSON.stringify(r.out.data['zabal:subs:recent']) === JSON.stringify(['99', '1', '98', '2'])) ok('submission index passed through unchanged');
    else fail('zabal:subs:recent was altered - redaction must not damage the record');
    if (r.out.data['zabal:sub:v1:99']?.project === 'A thing') ok('submission content preserved apart from the email');
    else fail('submission content was damaged');

    if (r.out.redacted?.emails_redacted === 2) ok('reports 2 emails redacted, matching what was planted');
    else fail(`emails_redacted = ${r.out.redacted?.emails_redacted}, expected 2`);
  }

  // --- 2. a missing data object must refuse, not write an empty backup ---
  const noData = run(REDACTOR, { ok: true });
  if (noData.exit !== 0) ok('refuses an export with no data object');
  else fail('accepted an export with no data object - that writes an empty backup that looks fine');

  // --- 3. THE LOAD-BEARING CASE: a gutted redactor must fail this test ---
  // If this passes, every check above is theatre.
  const gutted = join(tmp, 'gutted.py');
  copyFileSync(REDACTOR, gutted);
  let src = readFileSync(gutted, 'utf8');
  src = src.replace(/^DROP_PREFIXES = \([\s\S]*?\)$/m, 'DROP_PREFIXES = ()')
           .replace(/^DROP_EXACT = .*$/m, 'DROP_EXACT = ()')
           .replace(/^EMAIL_PLACEHOLDER = .*$/m, 'EMAIL_PLACEHOLDER = "[redacted-email]"\nALLOWED_EMAILS_OVERRIDE = None');
  // Neuter the scrubber itself, so it returns values untouched.
  src = src.replace(/def scrub_emails\(value, counter\):\n    """[^"]*"""/,
    'def scrub_emails(value, counter):\n    """gutted for the test"""\n    return value');
  writeFileSync(gutted, src);
  const g = run(gutted, EXPORT);
  if (g.exit !== 0) ok('a gutted redactor is caught - it exits non-zero instead of leaking');
  else if (g.out && (('qv:ballots:19640' in g.out.data) || JSON.stringify(g.out.data).includes('entrant@gmail.com'))) {
    fail('A GUTTED REDACTOR PRODUCED OUTPUT AND THIS TEST DID NOT NOTICE. ' +
         'Every assertion above is meaningless until this case fails.');
  } else ok('a gutted redactor produced no leaking output');
  // --- 4. removing ONE prefix must not defeat the verifier ---
  // This is the case that found a real leak. Before 2026-09-08 the verifier checked the
  // output against the same DROP_PREFIXES it was verifying, so deleting the single line
  // "qv:ballots:" made the script publish every per-voter ballot into this public repo,
  // exit 0, and print "nothing dropped". The verifier has an independent list now, and this
  // test exists so that never silently comes back.
  const narrowed = join(tmp, 'narrowed.py');
  copyFileSync(REDACTOR, narrowed);
  const nsrc = readFileSync(narrowed, 'utf8');
  const dpStart = nsrc.indexOf('DROP_PREFIXES = (');
  const dpEnd = nsrc.indexOf(')', dpStart);
  writeFileSync(narrowed,
    nsrc.slice(0, dpStart) + nsrc.slice(dpStart, dpEnd).replace('    "qv:ballots:",\n', '') + nsrc.slice(dpEnd));
  const n = run(narrowed, EXPORT);
  if (n.exit !== 0) ok('removing one drop-prefix is caught by the independent verifier');
  else fail('REMOVING "qv:ballots:" FROM DROP_PREFIXES LEAKED BALLOTS AND EXITED 0. ' +
            'The verifier is sharing a list with the thing it verifies again - see FORBIDDEN_IN_OUTPUT.');
} finally {
  cleanup();
}

console.log('');
if (failures) { console.error(`test-redact-export: ${failures} failure(s).`); process.exit(1); }
console.log('test-redact-export: the redactor drops what it must and keeps what it must.');

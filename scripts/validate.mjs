#!/usr/bin/env node
// validate.mjs - one command for the CLAUDE.md "validate before pushing" checklist.
// Zero-dependency. Exits non-zero if anything fails, so it works in a hook or CI.
//
//   node scripts/validate.mjs
//
// Checks: every tracked .json parses; every api/*.mjs passes node --check; every
// classic inline <script> in *.html compiles; the Mini App manifest payload
// decodes to {"domain":"zabalgamez.com"}.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const DOMAIN = 'zabalgamez.com';
const QUIET = process.argv.includes('--quiet'); // only print failures + summary
let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => { if (!QUIET) console.log('  ok   ' + m); };
const head = (m) => { if (!QUIET) console.log(m); };

function tracked(glob) {
  return execSync(`git ls-files ${glob}`, { encoding: 'utf8' })
    .split('\n').map((s) => s.trim()).filter(Boolean);
}

// 1. JSON parses
head('JSON:');
for (const f of tracked("'*.json'")) {
  try { JSON.parse(readFileSync(f, 'utf8')); ok(f); }
  catch (e) { fail(`${f} - ${e.message}`); }
}

// 2. Edge functions syntax-check as ES modules
head('Edge functions (api/*.mjs):');
for (const f of tracked("'api/*.mjs'")) {
  try { execSync(`node --check "${f}"`, { stdio: 'pipe' }); ok(f); }
  catch (e) { fail(`${f} - ${(e.stderr || e.message).toString().split('\n')[0]}`); }
}

// 3. Classic inline <script> blocks compile (skip src=, module, and json blocks)
head('Inline HTML scripts:');
const scriptRe = /<script([^>]*)>([\s\S]*?)<\/script>/gi;
for (const f of tracked("'*.html'")) {
  const html = readFileSync(f, 'utf8');
  let m, n = 0, bad = 0;
  while ((m = scriptRe.exec(html))) {
    const attrs = m[1] || '';
    if (/\bsrc=/.test(attrs)) continue;
    if (/type\s*=\s*["'][^"']*(json|module)/i.test(attrs)) continue;
    n++;
    try { new vm.Script(m[2]); }
    catch (e) { bad++; fail(`${f} block #${n} - ${e.message}`); }
  }
  if (n && !bad) ok(`${f} (${n} block${n > 1 ? 's' : ''})`);
}

// 4. Mini App manifest payload decodes to the right domain
head('Mini App manifest:');
try {
  const mani = JSON.parse(readFileSync('.well-known/farcaster.json', 'utf8'));
  const payload = mani?.accountAssociation?.payload;
  if (!payload) throw new Error('no accountAssociation.payload');
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  if (decoded.domain === DOMAIN) ok(`payload domain = ${decoded.domain}`);
  else fail(`payload domain = ${decoded.domain} (expected ${DOMAIN})`);
} catch (e) { fail('manifest - ' + e.message); }

// 5. Per-signal capture - a battle must not settle with its numbers missing.
// Delegated to scripts/check-signals.mjs so it can also be run on its own from the room.
// This is here rather than standalone because Season 1's signals were lost by nobody
// running anything; a check you have to remember is a check that does not exist.
head('Per-signal capture:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-signals.mjs')}${QUIET ? ' --quiet' : ''}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('signals captured or explicitly exempted');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/FAIL|failure/.test(line)) fail(line.replace(/^\s*FAIL\s*/, ''));
  if (!/FAIL|failure/.test(text)) fail('check-signals.mjs - ' + e.message);
}

// 6. Time-bound claims - refuse to look healthy while a dated claim is unverified.
// Here rather than standalone for the same reason as check-signals: a check you have to
// remember to run is a check that does not exist, and this repo is expected to sit
// untouched until late November while every measured fact in CLAUDE.md ages.
head('Time-bound claims:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-recheck.mjs')}${QUIET ? ' --quiet' : ''}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else { const due = outp.split('\n').filter((l) => l.includes('DUE SOON')); for (const d of due) console.log(d); ok('no dated claim overdue'); }
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/FAIL|past their/.test(line)) fail(line.replace(/^\s*FAIL\s*/, ''));
  if (!/FAIL|past their/.test(text)) fail('check-recheck.mjs - ' + e.message);
}

// 7. Generated files must match their source. /recordings/index.json and /recordings.txt are
// the surface agents are told to read, so a stale one is a wrong answer served confidently.
head('Generated files:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-generated.mjs')}${QUIET ? ' --quiet' : ''}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('every generated file matches its source');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/FAIL|out of sync/.test(line)) fail(line.replace(/^\s*FAIL\s*/, ''));
  if (!/FAIL|out of sync/.test(text)) fail('check-generated.mjs - ' + e.message);
}

head('');
if (failures) { console.error(`validate: ${failures} failure(s).`); process.exit(1); }
console.log('validate: all checks passed.');

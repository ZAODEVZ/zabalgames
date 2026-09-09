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
import { createHash } from 'node:crypto';

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

// 4. Mini App manifest - the signed block must be intact, not merely well-formed.
//
// This used to check only that `payload` decoded to the right domain, which meant a hand-edit
// of `header` or `signature` passed silently. That is the worst possible failure to leave
// undetected: the manifest still parses, the site still deploys, and the Mini App simply
// stops opening in Farcaster with nothing anywhere reporting it. CLAUDE.md has said "do NOT
// hand-edit the accountAssociation block" since it was signed - a prose rule with nothing
// enforcing it. Now the whole block is pinned by hash.
//
// IF THIS FAILS AFTER A DELIBERATE RE-SIGN, that is correct and expected: re-sign via the
// Farcaster dev tools, then update MANIFEST_AA_SHA256 below to the new hash in the SAME
// commit, so the pin always describes a block someone actually signed.
const MANIFEST_AA_SHA256 = 'ecda13386e69da2f5298d0b62cf0df1ceda748bce5b897615b0510d97bc97faf';
const MANIFEST_FID = 19640;
head('Mini App manifest:');
try {
  const mani = JSON.parse(readFileSync('.well-known/farcaster.json', 'utf8'));
  const aa = mani?.accountAssociation;
  if (!aa) throw new Error('no accountAssociation block');

  for (const k of ['header', 'payload', 'signature']) {
    if (!aa[k] || typeof aa[k] !== 'string' || !aa[k].trim()) fail(`accountAssociation.${k} is missing or empty`);
  }

  const dec = (v) => JSON.parse(Buffer.from(v, 'base64url').toString('utf8'));

  const payload = dec(aa.payload);
  if (payload.domain === DOMAIN) ok(`payload domain = ${payload.domain}`);
  else fail(`payload domain = ${payload.domain} (expected ${DOMAIN})`);

  const header = dec(aa.header);
  if (header.fid === MANIFEST_FID) ok(`header fid = ${header.fid}`);
  else fail(`header fid = ${header.fid} (expected ${MANIFEST_FID}) - this manifest is signed by a different account`);
  if (header.type === 'auth') ok('header type = auth');
  else fail(`header type = ${header.type} (expected auth)`);

  // The pin. Any byte changed anywhere in the signed block trips this, including a change
  // that leaves every individual field above still looking plausible.
  const canon = JSON.stringify(aa, Object.keys(aa).sort());
  const got = createHash('sha256').update(canon).digest('hex');
  if (got === MANIFEST_AA_SHA256) ok('signed block matches the pinned hash');
  else fail(`the signed accountAssociation block CHANGED (sha256 ${got.slice(0, 16)}..., pinned ${MANIFEST_AA_SHA256.slice(0, 16)}...).\n` +
            '         A hand-edit here does not break the build or the deploy - it breaks the Mini App\n' +
            '         silently, in Farcaster, with nothing reporting it. If you re-signed on purpose,\n' +
            '         update MANIFEST_AA_SHA256 in scripts/validate.mjs in the same commit.');

  // Nothing may shadow the manifest route. CLAUDE.md states this; enforce it.
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const wellKnown = '/.well-known/farcaster.json';
  // Vercel `source` allows both :param tokens AND raw regex groups like /(.*), so the pattern
  // must be built by converting only the :param forms and leaving the rest intact. An earlier
  // version escaped the regex metacharacters too, which made "/(.*)" - the catch-all that is
  // the whole reason this guard exists - fail to match and pass silently. Caught by testing it.
  const matchesWellKnown = (src) => {
    const raw = String(src || '');
    const pattern = '^' + raw.replace(/:[A-Za-z_]+\*/g, '.*').replace(/:[A-Za-z_]+/g, '[^/]+') + '$';
    try { if (new RegExp(pattern).test(wellKnown)) return true; } catch { /* not a regex; fall through */ }
    // Belt and braces: a literal prefix match catches a plain "/.well-known" style source that
    // is not a regex at all.
    return wellKnown === raw || wellKnown.startsWith(raw.replace(/\/+$/, '') + '/');
  };
  const shadows = [...(vercel.rewrites || []), ...(vercel.redirects || [])].filter((r) => matchesWellKnown(r.source));
  if (!shadows.length) ok('no rewrite or redirect shadows /.well-known/farcaster.json');
  else for (const sh of shadows) fail(`vercel.json "${sh.source}" -> "${sh.destination}" would shadow ${wellKnown}, which silently unregisters the Mini App`);
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

// 6b. Future-dated claims on public pages must carry a marker. check-recheck.mjs validates
// markers that EXIST; it has nothing to look at when a dated claim never got one, so the
// enforced rule covered only claims someone already remembered to mark. This finds them.
// Measured before adding: exactly one unmarked future date across every tracked *.html, so
// the noise floor is one real thing. Added while Season 2 has no dates on purpose - every
// date it eventually publishes is a claim that expires.
head('Future-dated claims:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-future-dates.mjs')}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('no unmarked future-dated claim');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/expires \d{4}-/.test(line)) fail(line.trim());
  if (!/expires \d{4}-/.test(text)) fail('check-future-dates.mjs - ' + e.message);
}

// 6c. Superseded season copy must not come back. #660/#664 closed the season in the copy and
// reached 2 files; 80 others still carried the old line six days later, and the recording
// GENERATOR carried it too - so every new recording page would have reintroduced it. A fix that
// loses ground as the site grows needs a guard, not a follow-up task.
head('Season copy:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-season-copy.mjs')}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('no superseded season copy');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/carry superseded|^\s+\S+:\d+$/.test(line)) fail(line.trim());
  if (!/carry superseded/.test(text)) fail('check-season-copy.mjs - ' + e.message);
}

// 6d. CLAUDE.md's countable claims must match the repo. It is the file every session reads
// first, so a wrong number there propagates into whatever that session writes next - and it was
// wrong twice on 2026-09-09, once contradicting ITSELF (68 top-level pages on line 48, 66 on
// line 507; actual 66). These are counts of files, so they are free to verify and pointless to
// maintain by hand. Season figures and decisions are deliberately NOT checked here.
head('CLAUDE.md counts:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-counts.mjs')}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('CLAUDE.md counts match the repo');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/CLAUDE\.md:\d+\s+says/.test(line)) fail(line.trim());
  if (!/CLAUDE\.md:\d+\s+says/.test(text)) fail('check-counts.mjs - ' + e.message);
}

// 6e. In-feed embeds must survive an HTML parser. daily.html shipped
// content='{..."title":"Today's quests"...}' - the apostrophe closes the single-quoted
// attribute, so a browser read the JSON as truncated at "Today and sharing /daily produced a
// broken card. Verified in a real browser against production before this was written. The JSON
// was valid; it never reached a JSON parser intact, which is why compiling scripts and pinning
// the manifest could not see it.
head('In-feed embeds:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-embeds.mjs')}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('every in-feed embed parses');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/\.html:\d+\s+fc:/.test(line)) fail(line.trim());
  if (!/do not survive HTML parsing/.test(text)) fail('check-embeds.mjs - ' + e.message);
}

// 6f. A moving fact must not be published as a fixed date. The kv-backup deadline moves 60 days
// out on every human commit; four records published it and gave three different answers, each
// correct when written. A RECHECK marker cannot fix that - a marker says "come back and look",
// and the problem is the SHAPE of the claim - so this is separate from check-recheck.mjs.
head('Moving dates:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-moving-dates.mjs')}`, { encoding: 'utf8' });
  if (!QUIET) process.stdout.write(outp.split('\n').filter(Boolean).map((l) => '  ' + l.replace(/^ {2}/, '')).join('\n') + '\n');
  else ok('no moving fact published as a fixed date');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/^\s+\S+:\d+\s+2026-/.test(line)) fail(line.trim());
  if (!/publish the backup deadline/.test(text)) fail('check-moving-dates.mjs - ' + e.message);
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

// 8. api/README.md calls itself "the authoritative per-endpoint contracts (kept current)".
// Enforce the claim: no endpoint ships undocumented, no deleted one keeps its contract.
head('API contracts:');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-api-docs.mjs')} --quiet`, { encoding: 'utf8' });
  void outp;
  ok('every endpoint documented; no ghost contracts');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/FAIL|drift\(s\)/.test(line)) fail(line.replace(/^\s*FAIL\s*/, ''));
  if (!/FAIL|drift/.test(text)) fail('check-api-docs.mjs - ' + e.message);
}

// 9. THIS REPO IS PUBLIC. No credential may reach it. The estate standard (research doc 1124,
// and doc 2143 recording ZAOOS's active pre-commit guard) says secret-scan before every commit;
// this repo had no such guard at all until 2026-09-08.
head('Secret scan (public repo):');
try {
  const outp = execSync(`node ${JSON.stringify('scripts/check-secrets.mjs')} --quiet`, { encoding: 'utf8' });
  void outp;
  ok('no credential-shaped strings outside the reasoned allowlist');
} catch (e) {
  const text = (e.stdout || '') + (e.stderr || '');
  for (const line of text.split('\n')) if (/looks like a|possible credential/.test(line)) fail(line.trim());
  if (!/looks like a|possible credential/.test(text)) fail('check-secrets.mjs - ' + e.message);
}

// 10. Every vercel.json redirect/rewrite destination must resolve to something that exists.
// Found the hard way on 2026-09-08: the arcade cull deleted /game/build-quiz while a `/quiz`
// redirect still pointed at it, which would have served a 404 from a URL that looked supported.
// A redirect is a promise about a URL; deleting a page is exactly when it gets broken, and
// nothing was checking it.
head('Redirect targets:');
try {
  const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const rules = [...(vercel.redirects || []), ...(vercel.rewrites || [])];
  let broken = 0;
  for (const r of rules) {
    const dest = String(r.destination || '');
    if (!dest.startsWith('/') || dest.startsWith('//')) continue; // external or absolute URL
    const clean = dest.split('#')[0].split('?')[0].replace(/\/$/, '');
    if (!clean || clean === '/') continue;
    const rel = clean.slice(1);
    const exists = ['', '.html', '/index.html'].some((suf) => { try { readFileSync(rel + suf); return true; } catch { return false; } });
    if (!exists) { fail(`vercel.json "${r.source}" -> "${dest}" does not resolve to any file`); broken++; }
  }
  if (!broken) ok(`${rules.length} redirect/rewrite destination(s) all resolve`);
} catch (e) { fail('redirect targets - ' + e.message); }

head('');
if (failures) { console.error(`validate: ${failures} failure(s).`); process.exit(1); }
console.log('validate: all checks passed.');

#!/usr/bin/env node
// test-referral.mjs - the referral counts real submitters, stays invisible, and never leaks.
//
// WHY THIS EXISTS. The recorded design (docs/season-2-ideas.md item 6, and a standing decision)
// is: bake the referral into normal sharing, never a public leaderboard or a code to enter
// because those breed bots, and count who actually SUBMITTED rather than who connected.
//
// The code did neither of the last two. Measured 2026-09-08 before changing anything:
//
//   * a referral was credited on AUTHENTICATION (POST /api/ref with a Quick Auth JWT), which is
//     a connect - exactly the metric that was ruled out
//   * GET /api/ref?board=top served a public top-referrers leaderboard, unauthenticated
//   * submit.html never read ?ref= and api/submissions.mjs never accepted one, so a submission
//     carried no attribution at all
//
// And the measurement that decided the design: 0 of 21 Season 1 submissions carry a fid. So
// attribution that depends on the submitter having authenticated would have credited nobody.
// The ref has to travel with the submission itself, which is what submit.html now does.
//
// THE LOAD-BEARING ASSERTIONS here are the two that protect people rather than data: a
// self-referral must not count, and the stored ref must never reach a client. The first is the
// whole anti-farming property; the second is why storing attribution on a public-board row is
// safe at all.
//
//   node scripts/test-referral.mjs

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (c, m) => (c ? ok(m) : fail(m));

const submissions = readFileSync('api/submissions.mjs', 'utf8');
const ref = readFileSync('api/ref.mjs', 'utf8');
const submitPage = readFileSync('submit.html', 'utf8');

// --- 1. the ref travels with the submission ---
check(/const refHandle = cleanSlug\(String\(body\.ref \|\| ''\)/.test(submissions),
  'api/submissions.mjs accepts a ref on the submit body');
check(/ref: refHandle,/.test(submissions),
  'the ref is stored on the submission row');
check(/zabal:ref:submitters:\$\{refHandle\}/.test(submissions),
  'a successful submit SADDs the submission id to the referrer\'s submitters set');

// --- 2. THE ANTI-FARMING PROPERTY: no self-referral ---
check(/refHandle && refHandle !== handle/.test(submissions),
  'a self-referral is rejected - refHandle must differ from the submitter handle');

// --- 3. THE PRIVACY PROPERTY: the ref must never reach a client ---
// publicView is an allowlist; it must not spread the raw row, or `ref` would leak with it.
// Scope to publicView EXACTLY - a wider window overran into ownerView and reported a
// false positive on the first run. That false positive was still useful: it sent me to read
// ownerView, which DOES `{ ...s }` and only deleted three fields, so `ref` was genuinely
// being returned to the submitter. Both the assertion and the code needed fixing.
const pvStart = submissions.indexOf('function publicView');
const pv = submissions.slice(pvStart, submissions.indexOf('\nfunction ', pvStart + 10));
check(!/\.\.\.s\b/.test(pv), 'publicView never spreads the raw submission (so `ref` cannot leak through it)');
check(!/\bref\b\s*:/.test(pv.replace(/promptId|refHandle/g, '')), 'publicView does not name a ref field');

// ownerView DOES spread the raw row, so it must delete ref explicitly.
const ovStart = submissions.indexOf('function ownerView');
const ov = submissions.slice(ovStart, submissions.indexOf('\n}', ovStart));
check(/\{ \.\.\.s \}/.test(ov), 'ownerView spreads the raw row (so every internal field must be deleted by name)');
check(/delete out\.ref;/.test(ov), 'ownerView deletes ref - attribution is not returned to the submitter');

// --- 4. the leaderboard is closed ---
check(/verifyAdmin\(req, DOMAIN\)/.test(ref), 'the ?board=top branch calls verifyAdmin');
const gateIdx = ref.indexOf('verifyAdmin(req, DOMAIN)');
const branchIdx = ref.indexOf("if (url.searchParams.get('board') === 'top') {");
check(gateIdx > branchIdx && gateIdx - branchIdx < 200,
  'the admin gate is the first thing inside the board branch, not after the read');
check(ref.includes("SCARD', `zabal:ref:submitters:${r.handle}`"),
  'the board reports submitters, not only connects');
check(/rows\.sort\(\(a, b\) => b\.submitters - a\.submitters/.test(ref),
  'the board ranks by submitters - the real metric leads');

// --- 5. invisible: no code to enter, ref read from the URL and remembered for the session ---
check(/function refFromShareLink\(\)/.test(submitPage), 'submit.html reads the ref itself');
check(/new URLSearchParams\(location\.search\)\.get\('ref'\)/.test(submitPage),
  'the ref comes from the share link, not from a field the user fills in');
check(/sessionStorage/.test(submitPage) && !/localStorage\.setItem\('zg:ref'/.test(submitPage),
  'the ref is held in sessionStorage, so a stale ref cannot attach weeks later from another visit');
check(!/name=["']ref["']/.test(submitPage) && !/enter your referral/i.test(submitPage),
  'there is no referral code input on the page - the whole point is that it is invisible');
check(/ref: refFromShareLink\(\)/.test(submitPage), 'the submit payload carries the ref');

// --- 6. the handle cleaner must not admit anything shaped like an injection or a key ---
// cleanSlug is what guards this; check the call is wrapped in it and strips a leading @.
check(/replace\(\/\^@\+\/, ''\)/.test(submissions), 'a leading @ is stripped from the ref');
check(/cleanSlug\(String\(body\.ref[\s\S]{0,40}32\)/.test(submissions), 'the ref is length-capped at 32 via cleanSlug');

// --- 7. and the client-side cleaner matches, so a hostile ?ref= cannot reach the body raw ---
check(/replace\(\/\[\^A-Za-z0-9_\.\-\]\/g, ''\)/.test(submitPage),
  'submit.html strips anything outside [A-Za-z0-9_.-] from the ref before sending it');

console.log('');
if (failures) { console.error(`test-referral: ${failures} failure(s).`); process.exit(1); }
console.log('test-referral: counts submitters, refuses self-referral, keeps the ref private, board closed.');

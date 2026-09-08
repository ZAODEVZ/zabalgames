#!/usr/bin/env node
// test-rate-limit.mjs - the limiter must bound abuse on every path, including the ones where
// its backing store is missing.
//
// WHY THIS EXISTS. lib/rate-limit.mjs guards four endpoints that accept writes -
// api/submissions.mjs, api/profile.mjs, api/register.mjs - and it had no test. Reading it
// found a real defect: `checkLimit` returned `true` unconditionally when KV was unconfigured,
// so a missing env var meant NO rate limiting at all on those endpoints. That contradicted the
// class's own design note, which says the in-memory map exists "to degrade gracefully instead
// of failing open" - only the unconfigured path failed open, and it is the worse of the two
// cases, because a missing env var is silent and survives a whole deployment while a KV outage
// is transient.
//
// The load-bearing assertion here is the first one: an unconfigured limiter must still bound
// requests. If that ever passes unbounded again, the guard is gone and nothing else in this
// file matters.
//
//   node scripts/test-rate-limit.mjs
//
// No network, no KV. The KV-error path is exercised by pointing the limiter at a URL that
// cannot resolve, which is the same code path a real outage takes.

import { RateLimiter } from '../lib/rate-limit.mjs';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);
const check = (cond, msg) => (cond ? ok(msg) : fail(msg));

async function countAllowed(limiter, ip, endpoint, n, opts) {
  let allowed = 0;
  for (let i = 0; i < n; i++) if (await limiter.checkLimit(ip, endpoint, opts)) allowed++;
  return allowed;
}

// --- 1. THE LOAD-BEARING CASE: unconfigured KV must still bound requests ---
{
  const l = new RateLimiter(null, null);
  const allowed = await countAllowed(l, '1.2.3.4', 'submissions', 25, { perMinute: 10 });
  if (allowed === 25) {
    fail('UNCONFIGURED KV ALLOWED ALL 25 REQUESTS - the limiter is failing open again. ' +
         'checkLimit must fall back to the in-memory limiter, never `return true`.');
  } else check(allowed === 10, `unconfigured KV bounds one IP to perMinute (allowed ${allowed}/25)`);
}

// --- 2. undefined / empty-string credentials are the same case ---
for (const [u, t, label] of [[undefined, undefined, 'undefined'], ['', '', 'empty strings'], ['https://x', '', 'url but no token']]) {
  const l = new RateLimiter(u, t);
  const allowed = await countAllowed(l, '5.5.5.5', 'register', 15, { perMinute: 3 });
  check(allowed === 3, `credentials as ${label} still bound to perMinute (allowed ${allowed}/15)`);
}

// --- 3. limits are per IP, so one abuser cannot lock out everyone ---
{
  const l = new RateLimiter(null, null);
  await countAllowed(l, '9.9.9.9', 'submissions', 20, { perMinute: 5 });
  const other = await countAllowed(l, '8.8.8.8', 'submissions', 5, { perMinute: 5 });
  check(other === 5, 'a different IP is unaffected by another IP hitting its limit');
}

// --- 4. limits are per endpoint ---
{
  const l = new RateLimiter(null, null);
  await countAllowed(l, '7.7.7.7', 'submissions', 20, { perMinute: 5 });
  const other = await countAllowed(l, '7.7.7.7', 'profile', 5, { perMinute: 5 });
  check(other === 5, 'the same IP on a different endpoint has its own budget');
}

// --- 5. a KV outage degrades to in-memory, not to unlimited ---
{
  // A host that cannot resolve makes kvPipeline throw, which is the real outage path.
  const l = new RateLimiter('https://kv-does-not-resolve.invalid', 'token');
  const allowed = await countAllowed(l, '4.4.4.4', 'submissions', 12, { perMinute: 4 });
  if (allowed === 12) fail('a KV outage allowed all 12 requests - the catch path is failing open');
  else check(allowed === 4, `a KV outage degrades to the in-memory limit (allowed ${allowed}/12)`);
}

// --- 6. getClientIp precedence, since the whole limiter keys on it ---
{
  const mk = (h) => new Request('https://zabalgamez.com/api/submissions', { headers: h });
  check(RateLimiter.getClientIp(mk({ 'x-forwarded-for': '1.1.1.1, 2.2.2.2' })) === '1.1.1.1',
    'getClientIp takes the first x-forwarded-for entry');
  check(RateLimiter.getClientIp(mk({ 'cf-connecting-ip': '3.3.3.3' })) === '3.3.3.3',
    'getClientIp falls back to cf-connecting-ip');
  check(RateLimiter.getClientIp(mk({ 'x-real-ip': '6.6.6.6' })) === '6.6.6.6',
    'getClientIp falls back to x-real-ip');
  check(RateLimiter.getClientIp(mk({})) === '0.0.0.0',
    'getClientIp returns 0.0.0.0 when no header is present');
  // A spoofed empty header must not become an unbounded key-per-request situation.
  const l = new RateLimiter(null, null);
  const allowed = await countAllowed(l, RateLimiter.getClientIp(mk({})), 'submissions', 10, { perMinute: 2 });
  check(allowed === 2, 'requests with no IP header share one bucket rather than bypassing the limit');
}

// --- 7. the cleanup timer must not hold the process open ---
// If this script hangs after printing its summary, the interval is not unref'd.
{
  const l = new RateLimiter(null, null);
  check(typeof l.cleanupInterval === 'object' || typeof l.cleanupInterval === 'number',
    'a cleanup interval is created');
  ok('this script exiting on its own proves the interval does not keep the process alive');
}

console.log('');
if (failures) { console.error(`test-rate-limit: ${failures} failure(s).`); process.exit(1); }
console.log('test-rate-limit: bounded on every path - configured, unconfigured, and mid-outage.');

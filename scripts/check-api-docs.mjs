#!/usr/bin/env node
// check-api-docs.mjs - every edge function has a documented contract, and every documented
// contract has an edge function.
//
// WHY THIS EXISTS. `api/README.md` opens by calling itself "the authoritative per-endpoint
// contracts (kept current)", and CLAUDE.md points every session at it with those words. It
// was not current. Measured 2026-09-08, it had drifted in both directions at once:
//
//   * `api/points.mjs` shipped 2026-08-19 - a live GET/POST endpoint with an admin-gated
//     write path - and was never documented at all.
//   * `### GET /api/daily-cast (cron)` was still documented as live, with its idempotency
//     design and "Runs daily via vercel.json crons", months after PR #574 (94934f4) DELETED
//     the file and after every Vercel cron was retired.
//
// The second one is the more dangerous shape, and it survived a targeted cleanup: PRs #669
// and #670 existed specifically to remove stale daily-cast claims and fixed CLAUDE.md while
// missing this file. A doc that asserts its own currency is exactly the doc nobody re-checks.
//
// So the currency claim is now enforced rather than asserted. A new endpoint cannot ship
// undocumented, and a deleted one cannot keep its contract.
//
//   node scripts/check-api-docs.mjs           # report; exit 1 on drift
//   node scripts/check-api-docs.mjs --quiet   # failures only
//
// THE CONTRACT FORMAT is a markdown heading naming the route, which is what the file already
// uses 46 times:  ### `GET /api/foo`   ### `GET/POST /api/foo`   ### `POST /api/foo/bar`
//
// A deliberately removed endpoint keeps a heading marked REMOVED - that is treated as
// documented-and-absent on purpose, so the reader learns it is gone instead of wondering.
// Anything else absent is drift.

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const QUIET = process.argv.includes('--quiet');
const README = 'api/README.md';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => { if (!QUIET) console.log('  ok   ' + m); };

if (!existsSync(README)) { console.error(`  FAIL ${README} is missing`); process.exit(1); }
const readme = readFileSync(README, 'utf8');

// Endpoint files, as routes: api/foo.mjs -> foo, api/snap/signup.mjs -> snap/signup.
//
// Read from DISK, not from `git ls-files`. The first version used the index, and all three of
// its own tests silently passed when they should have failed: a new endpoint that is not
// staged yet is absent from the index, and an endpoint deleted from disk is still IN the index
// until the removal is staged. So the check reported "all documented" for exactly the two
// moments when drift is introduced. The disk is the surface that tells the truth about what
// exists right now, which is also when the drift is cheapest to fix.
function walk(dir, prefix = '') {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    if (e.isDirectory()) out.push(...walk(join(dir, e.name), prefix + e.name + '/'));
    else if (e.name.endsWith('.mjs')) out.push(prefix + e.name.replace(/\.mjs$/, ''));
  }
  return out;
}
const routes = [...new Set(walk('api'))].filter((r) => r !== 'README').sort();

// Contract headings. Captures the route and whether the heading marks it removed.
const headings = [];
for (const line of readme.split('\n')) {
  const m = line.match(/^#{2,4}\s+.*?\/api\/([A-Za-z0-9/_-]+)/);
  if (m) headings.push({ route: m[1].replace(/\/+$/, ''), removed: /REMOVED|RETIRED|DELETED/i.test(line) });
}
const documented = new Map();
for (const h of headings) {
  // If a route somehow has two headings, a live one wins over a REMOVED one.
  const prev = documented.get(h.route);
  documented.set(h.route, prev ? { removed: prev.removed && h.removed } : h);
}

if (!routes.length) { fail('found no api/*.mjs files - is this the right repo?'); }

// 1. Every endpoint file needs a contract.
for (const r of routes) {
  const d = documented.get(r);
  if (!d) {
    fail(`api/${r}.mjs has NO contract in ${README}, which calls itself "kept current".\n` +
         `         Add a heading:  ### \`GET /api/${r}\`  (or GET/POST, POST - whatever it serves)`);
  } else if (d.removed) {
    fail(`api/${r}.mjs EXISTS but its ${README} heading says REMOVED. One of the two is wrong.`);
  } else {
    ok(`api/${r}.mjs documented`);
  }
}

// 2. Every contract needs an endpoint file - unless it is explicitly marked removed.
for (const [route, d] of [...documented].sort()) {
  if (routes.includes(route)) continue;
  if (d.removed) { ok(`/api/${route} documented as REMOVED, and the file is indeed gone`); continue; }
  fail(`${README} documents \`/api/${route}\` but api/${route}.mjs does not exist.\n` +
       '         Either the endpoint was deleted - mark the heading REMOVED and say when and why -\n' +
       '         or the contract is for something that was never built.');
}

if (!QUIET) console.log('');
if (failures) {
  console.error(`check-api-docs: ${failures} drift(s) between api/ and ${README}.`);
  process.exit(1);
}
if (!QUIET) console.log(`check-api-docs: ${routes.length} endpoints, all documented; no ghost contracts.`);

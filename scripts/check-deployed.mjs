#!/usr/bin/env node
// check-deployed.mjs - is production serving what `main` says?
//
// WHY THIS EXISTS. "Merged is not deployed, and deployed is not running" is the standing bound
// in CLAUDE.md, and it was written because #672-#675 all measured mergedAt:null while their
// content was absent from main, so /results published a wrong claim about a named person for a
// day and a half. Every check in this repo answers a question about the REPO. None of them
// answers the question that bound is about: what is the public actually being served right now.
//
// It is cheap to answer, because Vercel serves these files byte-for-byte. Measured 2026-09-09:
// sha256 of the local about.html, links.html, fips.html and build-days.html each matched the
// deployed response exactly, and `diff` of /about against about.html was empty. So a hash
// comparison is a real answer, not an approximation.
//
// NOT IN validate.mjs, deliberately. validate runs at every session start and must work with no
// network; a check that fails when the wifi drops trains people to ignore a red run, and a guard
// that gets ignored is worse than no guard (docs/: "guards need a path back to green"). This is
// run on demand, and after a merge.
//
// A BLIND RUN IS NEVER GREEN. If a fetch fails, the verdict is UNREACHABLE and the exit code is
// non-zero - it never reports "in sync" for a page it could not read. That rule is this repo's
// most expensive lesson: a blind sensor reads as calm, and /api/backup-health was built the same
// way for the same reason (measured:false, healthy:null, never healthy:true).
//
//   node scripts/check-deployed.mjs           the pages that must not break
//   node scripts/check-deployed.mjs --all     every tracked page
//   node scripts/check-deployed.mjs results august
//
// Exit 0 only when every page checked is IN SYNC.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

export const SITE = 'https://zabalgamez.com';

// CLAUDE.md's "Live links (do not break)", plus the front door and the two live write surfaces.
// Deliberately short: a default that takes a minute gets run, a default that takes ten does not.
export const CRITICAL = ['index', 'results', 'august', 'recordings', 'submit', 'play'];

export const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// The verdict, kept pure so scripts/test-check-deployed.mjs can exercise every branch without a
// network. The branch that matters is the last one: no body means UNREACHABLE, never IN SYNC.
export function verdict({ localHash, liveHash, error }) {
  if (error) return { state: 'UNREACHABLE', ok: false, detail: error };
  if (liveHash == null) return { state: 'UNREACHABLE', ok: false, detail: 'no response body' };
  if (localHash === liveHash) return { state: 'IN SYNC', ok: true, detail: '' };
  return { state: 'DRIFTED', ok: false, detail: `local ${localHash.slice(0, 12)} vs live ${liveHash.slice(0, 12)}` };
}

// `about.html` is served at /about (vercel.json cleanUrls); index.html at /.
export function urlFor(slug) {
  return slug === 'index' ? `${SITE}/` : `${SITE}/${slug}`;
}

async function fetchBody(url) {
  try {
    const r = await fetch(url, { redirect: 'follow', headers: { 'Cache-Control': 'no-cache' } });
    if (!r.ok) return { error: `HTTP ${r.status}` };
    return { body: await r.text() };
  } catch (e) {
    return { error: e.message || String(e) };
  }
}

async function main() {
  const args = process.argv.slice(2);
  const all = args.includes('--all');
  const named = args.filter((a) => !a.startsWith('--'));

  let slugs;
  if (named.length) slugs = named;
  else if (all) {
    slugs = execSync('git ls-files "*.html"', { encoding: 'utf8' })
      .split('\n').filter(Boolean).map((f) => f.replace(/\.html$/, ''));
  } else slugs = CRITICAL;

  const rows = [];
  for (const slug of slugs) {
    let local;
    try { local = readFileSync(`${slug}.html`, 'utf8'); }
    catch { rows.push({ slug, ...verdict({ error: `no local ${slug}.html` }) }); continue; }
    const { body, error } = await fetchBody(urlFor(slug));
    rows.push({ slug, ...verdict({ localHash: sha256(local), liveHash: body == null ? null : sha256(body), error }) });
  }

  const bad = rows.filter((r) => !r.ok);
  for (const r of rows) {
    const line = `  ${r.state.padEnd(11)} /${r.slug}${r.detail ? '  ' + r.detail : ''}`;
    (r.ok ? console.log : console.error)(line);
  }

  if (bad.length === 0) {
    console.log(`\ncheck-deployed: ${rows.length} page(s) IN SYNC with main.`);
    process.exit(0);
  }

  const unreachable = bad.filter((r) => r.state === 'UNREACHABLE').length;
  console.error(`\ncheck-deployed: ${bad.length} of ${rows.length} page(s) not confirmed in sync.`);
  if (unreachable) {
    console.error(`${unreachable} UNREACHABLE - that is NOT a pass. A page this could not read is
unknown, not fine. Check the network before concluding anything about the deploy.`);
  }
  if (bad.some((r) => r.state === 'DRIFTED')) {
    console.error(`DRIFTED means production is serving different bytes than main. Usually the
deploy has not finished yet - wait and re-run. If it persists, the merge did not deploy, which
is the exact gap between "merged" and "shipped" that this check exists to close.`);
  }
  process.exit(1);
}

// Only run when invoked directly, so the test can import the pure parts.
if (import.meta.url === `file://${process.argv[1]}`) await main();

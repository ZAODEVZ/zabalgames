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

// Non-HTML files that are load-bearing and were NOT covered when this only walked *.html.
// Each carries the reason it is here, because an asset list with no reasons grows until it is
// the whole site and then gets skipped.
export const ASSETS = [
  { path: '.well-known/farcaster.json',
    why: 'the Mini App registration. If it breaks the app stops opening in Farcaster and NOTHING reports it - validate pins the signed block locally, but nothing checked that production serves the same bytes.' },
  { path: 'recordings/index.json',
    why: 'advertised on the site as the machine surface for agents, so a stale one is a wrong answer served confidently' },
  { path: 'recordings.txt',
    why: 'the other agent-facing surface, same reason' },
  { path: 'llms.txt',
    why: 'what an AI harness reads first about this project' },
  { path: 'assets/miniapp.js',
    why: 'every page loads it; if the deployed copy drifts, every Mini App helper drifts with it' },
];

export const sha256 = (s) => createHash('sha256').update(s).digest('hex');

// The verdict, kept pure so scripts/test-check-deployed.mjs can exercise every branch without a
// network. The branch that matters is the last one: no body means UNREACHABLE, never IN SYNC.
export function verdict({ localHash, liveHash, error, redirectTo, expectedRedirect }) {
  if (error) return { state: 'UNREACHABLE', ok: false, detail: error };
  // A redirect stub is never served, so comparing its bytes is meaningless. Found by running
  // --all: /enter, /vote and /winners reported DRIFTED because the fetch followed the redirect
  // and hashed /leaderboard and /results against a stub file. Three permanent false reds is
  // precisely how a guard teaches people to ignore it.
  //
  // So a redirect is CHECKED, not skipped: its destination must match what vercel.json
  // configures. A stub that silently stopped redirecting, or started pointing somewhere else,
  // is a real failure and this still catches it.
  if (redirectTo != null) {
    if (!expectedRedirect) return { state: 'REDIRECT?', ok: false, detail: `redirects to ${redirectTo}, but vercel.json configures no redirect for it` };
    if (redirectTo !== expectedRedirect) return { state: 'MISROUTED', ok: false, detail: `redirects to ${redirectTo}, vercel.json says ${expectedRedirect}` };
    return { state: 'REDIRECT', ok: true, detail: `-> ${redirectTo} (as configured)` };
  }
  if (liveHash == null) return { state: 'UNREACHABLE', ok: false, detail: 'no response body' };
  if (localHash === liveHash) return { state: 'IN SYNC', ok: true, detail: '' };
  return { state: 'DRIFTED', ok: false, detail: `local ${localHash.slice(0, 12)} vs live ${liveHash.slice(0, 12)}` };
}

// `about.html` is served at /about (vercel.json cleanUrls); index.html at /.
export function urlFor(slug) {
  return slug === 'index' ? `${SITE}/` : `${SITE}/${slug}`;
}

// vercel.json's configured redirects, as slug -> destination.
export function configuredRedirects(json) {
  const map = new Map();
  for (const r of (json.redirects || [])) {
    if (typeof r.source === 'string' && typeof r.destination === 'string') {
      map.set(r.source.replace(/^\//, ''), r.destination);
    }
  }
  return map;
}

async function fetchBody(url) {
  try {
    // manual, so a redirect is observed rather than followed into another page's bytes.
    const r = await fetch(url, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' } });
    if (r.status >= 300 && r.status < 400) return { redirectTo: r.headers.get('location') };
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

  const assetsOnly = args.includes('--assets');
  let slugs;
  if (assetsOnly) slugs = [];
  else if (named.length) slugs = named;
  else if (all) {
    slugs = execSync('git ls-files "*.html"', { encoding: 'utf8' })
      .split('\n').filter(Boolean).map((f) => f.replace(/\.html$/, ''));
  } else slugs = CRITICAL;

  let redirects = new Map();
  try { redirects = configuredRedirects(JSON.parse(readFileSync('vercel.json', 'utf8'))); }
  catch (e) { console.error(`  WARNING: could not read vercel.json (${e.message}) - redirects cannot be verified.`); }

  const rows = [];
  for (const slug of slugs) {
    let local;
    try { local = readFileSync(`${slug}.html`, 'utf8'); }
    catch { rows.push({ slug, ...verdict({ error: `no local ${slug}.html` }) }); continue; }
    const { body, error, redirectTo } = await fetchBody(urlFor(slug));
    rows.push({ slug, ...verdict({
      localHash: sha256(local),
      liveHash: body == null ? null : sha256(body),
      error, redirectTo, expectedRedirect: redirects.get(slug),
    }) });
  }

  // Assets are checked whenever a named page list was not given - the default run and --all
  // both want them, because the manifest breaking is worse than any single page drifting.
  if (!named.length) {
    for (const a of ASSETS) {
      let local;
      try { local = readFileSync(a.path, 'utf8'); }
      catch { rows.push({ slug: a.path, ...verdict({ error: `no local ${a.path}` }) }); continue; }
      const { body, error, redirectTo } = await fetchBody(`${SITE}/${a.path}`);
      const v = verdict({ localHash: sha256(local), liveHash: body == null ? null : sha256(body), error, redirectTo, expectedRedirect: redirects.get(a.path) });
      rows.push({ slug: a.path, ...v, why: v.ok ? '' : a.why });
    }
  }

  const bad = rows.filter((r) => !r.ok);
  for (const r of rows) {
    const line = `  ${r.state.padEnd(11)} /${r.slug}${r.detail ? '  ' + r.detail : ''}`;
    (r.ok ? console.log : console.error)(line);
    if (!r.ok && r.why) console.error(`              why it matters: ${r.why}`);
  }

  if (bad.length === 0) {
    const red = rows.filter((r) => r.state === 'REDIRECT').length;
    console.log(`\ncheck-deployed: ${rows.length} page(s) confirmed${red ? ` (${red} redirect${red > 1 ? 's' : ''} matching vercel.json)` : ''}.`);
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

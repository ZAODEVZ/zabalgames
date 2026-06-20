#!/usr/bin/env node
// Resolve every recording presenter's Farcaster handle -> profile picture, and write a
// committed cache at data/pfps.json. The arcade (/play) reads that cache first, so faces
// show even when a live lookup is down or rate-limited - no runtime dependency.
//
// Run it from a machine (or cron) WITH outbound network - no key required:
//   node scripts/resolve-pfps.mjs
//   NEYNAR_API_KEY=xxxx node scripts/resolve-pfps.mjs   (optional last-resort only)
//
// Strategy per handle (all free): fname registry username -> FID, then Haatz bulk-by-FID
// (the proven endpoint) -> Haatz by_username -> Haatz search -> Neynar (only if a key is
// set). A handle that resolves nowhere is left out, so the tile falls back to text.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const HAATZ = process.env.HAATZ_BASE || 'https://haatz.quilibrium.com';
const FNAMES = process.env.FNAMES_BASE || 'https://fnames.farcaster.xyz';
const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY || '';
const OUT = join(ROOT, 'data', 'pfps.json');

function clean(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 32);
}
function pickUser(u) {
  if (!u) return null;
  const pfpUrl = u.pfp_url || u.pfpUrl || (u.pfp && u.pfp.url) || null;
  if (!pfpUrl) return null;
  return { pfpUrl, fid: u.fid || null, displayName: u.display_name || u.displayName || null };
}

async function bulkOne(fid) {
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`);
    if (r.ok) { const arr = (await r.json()).users || []; return pickUser(arr[0]); }
  } catch { /* next */ }
  return null;
}
async function fnameToFid(handle) {
  try {
    const r = await fetch(`${FNAMES}/transfers?name=${encodeURIComponent(handle)}`);
    if (!r.ok) return null;
    const arr = (await r.json()).transfers || [];
    if (!arr.length) return null;
    const latest = arr.reduce((a, b) => ((b.timestamp || 0) >= (a.timestamp || 0) ? b : a));
    return latest && latest.to ? Number(latest.to) : null;
  } catch { return null; }
}

async function resolveOne(handle) {
  const fid = await fnameToFid(handle);
  if (fid) { const g = await bulkOne(fid); if (g) return g; }
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`);
    if (r.ok) { const d = await r.json(); const g = pickUser(d.user || (d.result && d.result.user) || (d.users && d.users[0])); if (g) return g; }
  } catch { /* next */ }
  try {
    const r = await fetch(`${HAATZ}/v2/farcaster/user/search?q=${encodeURIComponent(handle)}&limit=1`);
    if (r.ok) { const d = await r.json(); const u = (d.result && d.result.users && d.result.users[0]) || (d.users && d.users[0]) || null; const g = pickUser(u); if (g) return g; }
  } catch { /* next */ }
  if (NEYNAR_API_KEY) {
    try {
      const r = await fetch(`https://api.neynar.com/v2/farcaster/user/by_username?username=${encodeURIComponent(handle)}`,
        { headers: { 'x-api-key': NEYNAR_API_KEY, Accept: 'application/json' } });
      if (r.ok) { const d = await r.json(); const g = pickUser(d.user || (d.result && d.result.user) || (d.users && d.users[0])); if (g) return g; }
    } catch { /* give up */ }
  }
  return null;
}

async function main() {
  const idx = JSON.parse(readFileSync(join(ROOT, 'recordings', 'index.json'), 'utf8'));
  const handles = [...new Set((idx.recordings || []).map((r) => clean(r.handle)).filter(Boolean))];
  console.log(`Resolving ${handles.length} handle(s)...`);

  let existing = {};
  try { const j = JSON.parse(readFileSync(OUT, 'utf8')); existing = j.users || j || {}; } catch { /* fresh */ }

  const users = { ...existing };
  let resolved = 0, missing = [];
  for (const h of handles) {
    const got = await resolveOne(h);
    if (got) { users[h] = got; resolved++; console.log(`  ok   ${h}`); }
    else { missing.push(h); console.log(`  miss ${h}`); }
  }

  const out = { generated: new Date().toISOString().slice(0, 10), count: Object.keys(users).length, users };
  writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(`\nWrote ${OUT}: ${resolved} resolved this run, ${Object.keys(users).length} total cached.`);
  if (missing.length) console.log(`Unresolved (left to live lookup / text): ${missing.join(', ')}`);
}

main().catch((e) => { console.error(e); process.exit(1); });

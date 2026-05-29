#!/usr/bin/env node

/**
 * pull-data-streams.mjs
 *
 * The ingest layer for Zabal Data Streams.
 *
 * Reads data/data-streams.json (the stream registry). For each stream with a
 * live `pull` config it fetches the source, writes raw captures under the
 * stream's raw_dir, and appends normalized entries to data/streams/timeline.json
 * (the merged chronological feed). It then emits a dispatch markdown at
 * /tmp/zabal-dispatch-streams-<date>.md containing BONFIRE_ENTITIES +
 * BONFIRE_EDGES so the existing pipeline carries it the rest of the way:
 *
 *   pull-data-streams.mjs  ->  /tmp/zabal-dispatch-streams-*.md
 *   aggregate-dispatches.mjs  ->  data/bonfire-graph.json
 *   push-to-bonfire.mjs  ->  ZABAL Bonfire
 *
 * Usage:
 *   node scripts/pull-data-streams.mjs
 *   node scripts/pull-data-streams.mjs --dry          # no writes
 *   node scripts/pull-data-streams.mjs --no-bonfire   # skip the dispatch emit
 *
 * Env:
 *   GITHUB_TOKEN   optional - raises the GitHub content API rate limit
 *   HAATZ_BASE     optional - Farcaster read base (default https://haatz.quilibrium.com)
 *
 * Pull types (in data-streams.json `pull.type`):
 *   github-content   list + download files under pull.paths from pull.repo@pull.ref
 *   haatz            fetch recent casts for pull.fid (and/or pull.channel)
 *   static           nothing to fetch; timeline entries are curated by hand
 *
 * Network: github-content + haatz need outbound access. In a sandbox where those
 * hosts are blocked the fetch fails, the miss is logged, and the run continues -
 * still emitting the registry-derived Bonfire entities so the graph stays current.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(REPO_ROOT, 'data', 'data-streams.json');
const TIMELINE_PATH = path.join(REPO_ROOT, 'data', 'streams', 'timeline.json');
const HAATZ_BASE = process.env.HAATZ_BASE || 'https://haatz.quilibrium.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const DRY = process.argv.includes('--dry');
const NO_BONFIRE = process.argv.includes('--no-bonfire');
const PFX = '[streams]';
const FETCH_TIMEOUT_MS = 8000;

function log(msg) { console.log(`${PFX} ${msg}`); }
function err(msg) { console.error(`${PFX} ERROR: ${msg}`); }

function readJson(p, fallback) {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { log(`could not read ${path.basename(p)} (${e.message})`); return fallback; }
}

function slug(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

// Normalize a timestamp for sorting: pad YYYY-MM to mid-month so it sorts sanely.
function sortKey(ts) {
  if (/^\d{4}-\d{2}$/.test(ts)) return `${ts}-15`;
  return ts;
}

async function fetchWithTimeout(url, opts = {}) {
  const res = await fetch(url, { ...opts, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  return res;
}

// --- frontmatter (no dependency; handles simple key: value YAML) ---
function parseFrontmatter(md) {
  const m = md.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const out = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim().replace(/^["']|["']$/g, '');
    out[kv[1]] = v;
  }
  return out;
}

// --- pull: github-content ---------------------------------------------------
async function pullGithubContent(stream) {
  const { repo, ref = 'main', paths = [] } = stream.pull;
  const entries = [];
  const rawDir = path.join(REPO_ROOT, stream.raw_dir);
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'zabal-streams' };
  if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;

  for (const p of paths) {
    const listUrl = `https://api.github.com/repos/${repo}/contents/${p}?ref=${ref}`;
    let listing;
    try {
      const res = await fetchWithTimeout(listUrl, { headers });
      if (!res.ok) { log(`github ${repo}/${p}: HTTP ${res.status} - skipping`); continue; }
      listing = await res.json();
    } catch (e) {
      log(`github ${repo}/${p}: ${e.message} - skipping (host may be blocked)`);
      continue;
    }
    if (!Array.isArray(listing)) continue;
    const files = listing.filter(f => f.type === 'file' && f.name.endsWith('.md'));
    log(`github ${repo}/${p}: ${files.length} markdown file(s)`);

    for (const f of files) {
      if (!f.download_url) continue;
      let body;
      try {
        const r = await fetchWithTimeout(f.download_url);
        if (!r.ok) continue;
        body = await r.text();
      } catch { continue; }

      if (!DRY) {
        const dest = path.join(rawDir, p.split('/').pop(), f.name);
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, body, 'utf8');
      }

      // Transcripts carry frontmatter we can turn into a timeline entry.
      const fm = parseFrontmatter(body);
      const dateMatch = f.name.match(/(\d{4}-\d{2}-\d{2})/);
      const ts = fm.date || (dateMatch ? dateMatch[1] : null);
      if (ts && p.includes('transcript')) {
        entries.push({
          stream: stream.id,
          timestamp: ts,
          kind: 'episode',
          title: fm.title || fm.guest || f.name.replace(/\.md$/, ''),
          summary: fm.summary || fm.description || `Episode transcript: ${f.name}`,
          link: fm.youtube_url || stream.links?.[0]?.url || '',
          raw_ref: `${stream.raw_dir}/${p.split('/').pop()}/${f.name}`,
        });
      }
    }
  }
  return entries;
}

// --- pull: haatz (Farcaster reads) ------------------------------------------
async function pullHaatz(stream) {
  const { fid } = stream.pull;
  const entries = [];
  if (!fid) { log(`haatz ${stream.id}: no fid in pull config - skipping`); return entries; }
  const url = `${HAATZ_BASE}/v2/farcaster/feed/user/casts?fid=${fid}&limit=10`;
  let data;
  try {
    const res = await fetchWithTimeout(url);
    if (!res.ok) { log(`haatz ${stream.id}: HTTP ${res.status} - skipping`); return entries; }
    data = await res.json();
  } catch (e) {
    log(`haatz ${stream.id}: ${e.message} - skipping (host may be blocked)`);
    return entries;
  }
  const casts = data.casts || data.result?.casts || [];
  if (!DRY && casts.length) {
    const dest = path.join(REPO_ROOT, stream.raw_dir, `casts-${new Date().toISOString().slice(0, 10)}.json`);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, JSON.stringify(casts, null, 2), 'utf8');
  }
  for (const c of casts) {
    entries.push({
      stream: stream.id,
      timestamp: (c.timestamp || '').slice(0, 10) || new Date().toISOString().slice(0, 10),
      kind: 'cast',
      title: (c.text || '').slice(0, 80) || 'cast',
      summary: (c.text || '').slice(0, 200),
      link: c.hash ? `https://farcaster.xyz/~/conversations/${c.hash}` : '',
    });
  }
  log(`haatz ${stream.id}: ${entries.length} cast(s)`);
  return entries;
}

// --- bonfire dispatch emit --------------------------------------------------
function emitDispatch(streams) {
  const entities = streams.map(s => ({
    name: s.name,
    labels: ['DataStream', s.kind],
    attributes: {
      stream_id: s.id,
      status: s.status,
      summary: s.summary,
      ties_to_zabal: s.ties_to_zabal,
      url: s.links?.[0]?.url || '',
      _source: 'data-streams-registry',
    },
  }));
  // Every stream feeds ZABAL Games.
  const edges = streams.map(s => ({
    from: s.name,
    to: 'ZABAL Games',
    type: 'FEEDS',
    relationship: s.ties_to_zabal,
  }));

  const md = [
    `# Zabal Data Streams dispatch ${new Date().toISOString()}`,
    '',
    'Generated by scripts/pull-data-streams.mjs from data/data-streams.json.',
    '',
    '## BONFIRE_ENTITIES',
    '',
    '```json',
    JSON.stringify(entities, null, 2),
    '```',
    '',
    '## BONFIRE_EDGES',
    '',
    '```json',
    JSON.stringify(edges, null, 2),
    '```',
    '',
  ].join('\n');

  const out = `/tmp/zabal-dispatch-streams-${new Date().toISOString().slice(0, 10)}.md`;
  if (DRY) { log(`[dry] would write dispatch -> ${out}`); return; }
  fs.writeFileSync(out, md, 'utf8');
  log(`wrote dispatch -> ${out} (${entities.length} entities, ${edges.length} edges)`);
  log('next: node scripts/aggregate-dispatches.mjs && node scripts/push-to-bonfire.mjs');
}

// --- timeline merge ---------------------------------------------------------
function mergeTimeline(newEntries) {
  const tl = readJson(TIMELINE_PATH, { version: 1, entries: [] });
  const seen = new Set(tl.entries.map(e => `${e.stream}|${e.timestamp}|${e.title}`));
  let added = 0;
  for (const e of newEntries) {
    const key = `${e.stream}|${e.timestamp}|${e.title}`;
    if (seen.has(key)) continue;
    tl.entries.push(e);
    seen.add(key);
    added++;
  }
  tl.entries.sort((a, b) => sortKey(b.timestamp).localeCompare(sortKey(a.timestamp)));
  if (DRY) { log(`[dry] would add ${added} timeline entr(ies)`); return added; }
  if (added > 0) {
    fs.writeFileSync(TIMELINE_PATH, JSON.stringify(tl, null, 2) + '\n', 'utf8');
    log(`timeline: +${added} entr(ies), ${tl.entries.length} total`);
  } else {
    log('timeline: no new entries');
  }
  return added;
}

async function main() {
  const registry = readJson(REGISTRY_PATH, null);
  if (!registry || !Array.isArray(registry.streams)) {
    err(`no streams in ${REGISTRY_PATH}`);
    process.exit(1);
  }
  log(`${registry.streams.length} stream(s) in registry${DRY ? ' (dry run)' : ''}`);

  const pulled = [];
  for (const stream of registry.streams) {
    const type = stream.pull?.type || 'static';
    if (type === 'github-content') pulled.push(...await pullGithubContent(stream));
    else if (type === 'haatz') pulled.push(...await pullHaatz(stream));
    else log(`${stream.id}: static - no live pull`);
  }

  log(`pulled ${pulled.length} entr(ies) across live streams`);
  mergeTimeline(pulled);

  if (!NO_BONFIRE) emitDispatch(registry.streams);
  else log('--no-bonfire: skipping dispatch emit');

  log('done');
}

main().catch(e => { err(e.stack || e.message); process.exit(1); });

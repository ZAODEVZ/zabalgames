#!/usr/bin/env node
// build-sitemap.mjs - generate sitemap.xml from the actual pages on disk + the
// recordings in data/recaps.json, so it never drifts as pages/recordings are added.
//
//   node scripts/build-sitemap.mjs            # dry run: report what would change
//   node scripts/build-sitemap.mjs --write    # write sitemap.xml
//
// URLs are emitted as CLEAN routes (no .html), matching the site's canonical tags
// (cleanUrls:true in vercel.json). changefreq/priority are preserved from the current
// sitemap.xml where a route already exists, so hand-tuned values are not lost; new
// routes get a sensible default (or an explicit override below). Recording pages are
// pulled straight from recaps.json. Zero dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const ORIGIN = 'https://zabalgamez.com';
const write = process.argv.includes('--write');

// Internal / non-indexable pages to leave OUT of the sitemap.
const EXCLUDE = new Set(['status', 'review']); // internal ops dashboard, not public content

// Non-HTML routes worth keeping in the sitemap (e.g. the AI context file).
const EXTRA = ['/llms.txt'];

// Defaults for routes not already in the existing sitemap.
const OVERRIDE = {
  '/media': { changefreq: 'weekly', priority: '0.8' },
  '/speakers': { changefreq: 'weekly', priority: '0.7' },
  '/build-ideas': { changefreq: 'weekly', priority: '0.7' },
  '/game': { changefreq: 'monthly', priority: '0.6' },
  '/press': { changefreq: 'monthly', priority: '0.6' },
};
const DEFAULT = { changefreq: 'weekly', priority: '0.6' };
const RECORDING = { changefreq: 'monthly', priority: '0.7' };

function cleanRoute(rel) {
  // file path relative to ROOT -> clean route. index.html -> "/", foo.html -> "/foo",
  // a/b.html -> "/a/b".
  let r = '/' + rel.replace(/\\/g, '/').replace(/\.html$/, '');
  r = r.replace(/\/index$/, '/');
  return r === '' ? '/' : r;
}

// 1. Parse the existing sitemap to preserve changefreq/priority by route.
const prev = {};
const existing = fs.existsSync(path.join(ROOT, 'sitemap.xml'))
  ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
for (const m of existing.matchAll(/<loc>([^<]+)<\/loc>[^]*?(?:<changefreq>([^<]+)<\/changefreq>)?[^]*?(?:<priority>([^<]+)<\/priority>)?[^]*?<\/url>/g)) {
  const route = m[1].replace(ORIGIN, '').replace(/\.html$/, '').replace(/^$/, '/');
  prev[route === '' ? '/' : route] = { changefreq: m[2] || DEFAULT.changefreq, priority: m[3] || DEFAULT.priority };
}

// 2. Static HTML pages (top-level + finals/*), excluding internal + dynamic templates.
const htmlFiles = [];
for (const f of fs.readdirSync(ROOT)) if (f.endsWith('.html')) htmlFiles.push(f);
if (fs.existsSync(path.join(ROOT, 'finals')))
  for (const f of fs.readdirSync(path.join(ROOT, 'finals'))) if (f.endsWith('.html')) htmlFiles.push('finals/' + f);

const staticRoutes = htmlFiles
  .map((f) => cleanRoute(f))
  .filter((r) => !EXCLUDE.has(r.replace(/^\//, '')));

// 3. Recording pages from recaps.json.
const recaps = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/recaps.json'), 'utf8')).recaps;
const recRoutes = recaps.filter((r) => r.page).map((r) => r.page);

// 4. Assemble: home first, then static (alpha), then recordings hub + recording pages.
const seen = new Set();
const entries = [];
function add(route, meta) {
  if (seen.has(route)) return;
  seen.add(route);
  entries.push({ route, ...(prev[route] || meta) });
}
add('/', prev['/'] || { changefreq: 'weekly', priority: '1.0' });
staticRoutes.filter((r) => r !== '/').sort().forEach((r) => add(r, OVERRIDE[r] || DEFAULT));
EXTRA.forEach((r) => add(r, prev[r] || DEFAULT));
recRoutes.sort().forEach((r) => add(r, RECORDING));

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  entries.map((e) =>
    `  <url><loc>${ORIGIN}${e.route}</loc><changefreq>${e.changefreq}</changefreq><priority>${e.priority}</priority></url>`
  ).join('\n') +
  '\n</urlset>\n';

const prevCount = (existing.match(/<loc>/g) || []).length;
console.log(`sitemap: ${entries.length} urls (was ${prevCount}) - ${staticRoutes.length} pages + ${recRoutes.length} recordings`);
const added = entries.map((e) => e.route).filter((r) => !prev[r]);
if (added.length) console.log('added:', added.join(', '));

if (write) {
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  console.log('wrote sitemap.xml');
} else {
  console.log('(dry run - pass --write to apply)');
}

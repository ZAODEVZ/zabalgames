#!/usr/bin/env node
// add-transcript-reader.mjs - idempotent backfill that wires the on-site
// transcript reader (assets/transcript.js) into every existing recording page
// that has a transcript. New pages get it from the ingest-recording.mjs template,
// so this is only for the hand-built / pre-existing pages. Safe to re-run.
//
//   node scripts/add-transcript-reader.mjs           # report
//   node scripts/add-transcript-reader.mjs --write   # apply

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const write = process.argv.includes('--write');
const BLOB = 'https://github.com/ZAODEVZ/zabalgames/blob/main';

function ytId(url) {
  if (!url) return '';
  const m = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/))([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : '';
}

const recaps = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/recaps.json'), 'utf8')).recaps || [];
let changed = 0, skipped = 0;

for (const r of recaps) {
  if (!r.transcript || !r.page) continue;
  const rel = r.page.replace(/^\/recordings\//, '');           // "11", "zao/1", "fireside/1"
  const file = path.join(ROOT, 'recordings', `${rel}.html`);
  if (!fs.existsSync(file)) { console.log(`  skip (no file)   ${r.page}`); continue; }

  let html = fs.readFileSync(file, 'utf8');
  if (html.includes('id="rec-transcript"')) { skipped++; continue; }

  const src = r.transcript.startsWith(BLOB) ? r.transcript.slice(BLOB.length) : r.transcript;
  const yt = ytId(r.youtube);

  const section =
`  <section class="section rec-transcript-section">
    <div class="rec-label">Transcript</div>
    <p style="color:var(--text-dim);font-size:0.82rem;margin:0 0 0.5rem;">Hover any line and click # to copy a link straight to it.</p>
    <div id="rec-transcript" data-src="${src}" data-yt="${yt}"></div>
  </section>

`;
  const marker = '  <section id="zg-comments">';
  if (!html.includes(marker)) { console.log(`  skip (no marker) ${r.page}`); continue; }
  html = html.replace(marker, section + marker);

  if (!html.includes('/assets/transcript.js')) {
    html = html.replace(
      '<script defer src="/assets/recording-comments.js"></script>',
      '<script defer src="/assets/recording-comments.js"></script>\n<script defer src="/assets/transcript.js"></script>');
  }

  if (write) fs.writeFileSync(file, html);
  console.log(`  ${write ? 'wired' : 'would wire'}  ${r.page}  (src=${src}${yt ? `, yt=${yt}` : ''})`);
  changed++;
}

console.log(`\n${write ? 'Wired' : 'Would wire'} ${changed} page(s); ${skipped} already had the reader.`);
if (!write) console.log('Re-run with --write to apply.');

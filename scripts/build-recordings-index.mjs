// Build the machine-readable recordings index + the hub's schema.org JSON-LD.
//
// Source of truth: data/recaps.json. This script derives three artifacts so agents and
// crawlers can read the whole ZABAL Gamez recording library:
//   1. recordings/index.json - a flat, machine-readable list of every recording with
//      full metadata (type, title, presenter, track, summary, topics, takeaways,
//      transcript, media, url).
//   2. recordings.txt - a plain-text version of the same library (no markup), the
//      easiest single file for an LLM/agent to fetch and read.
//   3. The <script type="application/ld+json"> block in recordings.html (an
//      schema.org ItemList of VideoObject/CreativeWork), injected between the
//      <!-- JSONLD:START --> / <!-- JSONLD:END --> markers.
//
// Run after editing data/recaps.json:  node scripts/build-recordings-index.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = 'https://zabalgamez.com';

// A GitHub blob URL for a transcript that lives in THIS repo can also be served
// same-origin as raw text (better for agents: no GitHub chrome, same domain). Convert
// https://github.com/ZAODEVZ/zabalgames/blob/<ref>/<path> -> https://zabalgamez.com/<path>
function rawTranscript(url) {
  if (!url) return null;
  const m = url.match(/github\.com\/ZAODEVZ\/zabalgames\/blob\/[^/]+\/(.+)$/i);
  return m ? BASE + '/' + m[1] : url;
}

const recaps = JSON.parse(readFileSync(join(ROOT, 'data/recaps.json'), 'utf8'));
const items = (recaps.recaps || []).map((r) => {
  const type = r.type || 'workshop';
  const url = r.page ? BASE + r.page : (r.youtube || r.recording || BASE + '/recaps');
  return {
    type,
    title: r.title,
    presenter: r.presenter || null,
    handle: r.handle || null,
    org: r.org || null,
    track: r.track || null,
    format: r.format || null,
    date: r.date || null,
    url,
    page: r.page ? BASE + r.page : null,
    youtube: r.youtube || null,
    recording: r.recording || null,
    transcript: r.transcript || null,
    transcript_raw: rawTranscript(r.transcript),
    link: r.link || null,
    summary: r.summary || null,
    topics: r.topics || [],
    takeaways: r.takeaways || [],
  };
});

// 1. The flat index.
const index = {
  _note: 'Machine-readable index of every ZABAL Gamez recording. Generated from data/recaps.json by scripts/build-recordings-index.mjs - do not edit by hand. Newest first.',
  generated: new Date().toISOString().slice(0, 10),
  season: recaps.season || 1,
  count: items.length,
  recordings: items,
};
writeFileSync(join(ROOT, 'recordings/index.json'), JSON.stringify(index, null, 2) + '\n');

// 2. The plain-text library (recordings.txt) - one file an agent can fetch and read.
const txtLines = [];
txtLines.push('ZABAL GAMEZ - RECORDINGS (plain text for agents)');
txtLines.push('');
txtLines.push(`Generated ${index.generated} from data/recaps.json by scripts/build-recordings-index.mjs - do not edit by hand. Season ${index.season}. ${items.length} recordings, newest first.`);
txtLines.push('Structured JSON:  https://zabalgamez.com/recordings/index.json');
txtLines.push('Full ZAO dump:    https://zabalgamez.com/llms.txt');
txtLines.push('Human page:       https://zabalgamez.com/recordings');
txtLines.push('Chronological feed of every recording: https://zabalgamez.com/streams');
txtLines.push('');
items.forEach((it, i) => {
  txtLines.push('='.repeat(70));
  txtLines.push(`[${i + 1}] ${it.title}`);
  const meta = [it.type, it.track && `track: ${it.track}`, it.date].filter(Boolean).join('  |  ');
  if (meta) txtLines.push(meta);
  if (it.presenter) txtLines.push(`Presenter: ${it.presenter}${it.handle ? ` (${it.handle})` : ''}${it.org ? `, ${it.org}` : ''}`);
  if (it.url) txtLines.push(`Watch: ${it.url}`);
  if (it.youtube) txtLines.push(`Video: ${it.youtube}`);
  if (it.recording && it.recording !== it.url) txtLines.push(`Recording: ${it.recording}`);
  if (it.transcript_raw) txtLines.push(`Transcript: ${it.transcript_raw}`);
  if (it.summary) txtLines.push(`Summary: ${it.summary}`);
  if (it.takeaways && it.takeaways.length) {
    txtLines.push('Takeaways:');
    it.takeaways.forEach((t) => txtLines.push(`  - ${t}`));
  }
  if (it.topics && it.topics.length) txtLines.push(`Topics: ${it.topics.join(', ')}`);
  txtLines.push('');
});
writeFileSync(join(ROOT, 'recordings.txt'), txtLines.join('\n'));

// 3. The schema.org JSON-LD ItemList for the hub.
const elements = items.map((it, i) => {
  const hasVideo = it.youtube || it.recording;
  const node = {
    '@type': hasVideo ? 'VideoObject' : 'CreativeWork',
    name: it.title,
    url: it.url,
    ...(it.summary ? { description: it.summary } : {}),
    ...(it.date ? { uploadDate: it.date } : {}),
    ...(it.presenter ? { author: { '@type': 'Person', name: it.presenter } } : {}),
    ...(it.transcript ? { transcript: it.transcript } : {}),
    thumbnailUrl: BASE + '/assets/embed-card-gamez.png',
  };
  if (hasVideo) node.embedUrl = it.youtube || it.recording;
  return { '@type': 'ListItem', position: i + 1, item: node };
});
const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'ZABAL Gamez recordings',
  description: 'Every ZABAL Gamez workshop, fireside, and BCZ workshop - recorded, transcribed, and kept.',
  numberOfItems: items.length,
  itemListElement: elements,
};

const block =
  '<!-- JSONLD:START - generated by scripts/build-recordings-index.mjs from data/recaps.json; do not edit by hand -->\n' +
  '  <script type="application/ld+json">\n' +
  JSON.stringify(jsonld, null, 2) +
  '\n  </script>\n  <!-- JSONLD:END -->';

const hubPath = join(ROOT, 'recordings.html');
let hub = readFileSync(hubPath, 'utf8');
hub = hub.replace(/<!-- JSONLD:START[\s\S]*?<!-- JSONLD:END -->/, block);
writeFileSync(hubPath, hub);

console.log(`recordings index: ${items.length} recordings -> recordings/index.json + recordings.txt + recordings.html JSON-LD`);

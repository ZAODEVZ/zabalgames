#!/usr/bin/env node
// ingest-recording.mjs - consume a ZAOVideoEditor publish manifest and turn a finished
// workshop into a live page on the site, with NO hand-built HTML and no re-typed brand
// fixes. This is the consume side of the contract in docs/zaovideoeditor-integration.md.
//
//   node scripts/ingest-recording.mjs <manifest.json>           # dry run: report only
//   node scripts/ingest-recording.mjs <manifest.json> --write   # apply
//
// What --write does, from one manifest:
//   1. Writes the cleaned transcript to
//      data/streams/zabal-games-workshops/raw/transcripts/<date>-<slug>.md
//      (generates the frontmatter from the manifest if the body lacks it), applying the
//      'safe' brand-term fixes from data/transcript-corrections.json + em-dash -> hyphen.
//   2. Generates recordings/<N>.html from the canonical template (full video page when a
//      youtube link is present, placeholder page when it is not) - retiring the hand-built
//      /recordings/N.html step. <N> = the recap's existing page number on update, else the
//      next free integer.
//   3. Upserts the recap into data/recaps.json (newest first, carrying `chapters`).
//   4. Rebuilds the index (recordings/index.json, recordings.txt, hub JSON-LD).
//
// Re-run on the same slug to UPDATE in place (e.g. video lands after a transcript-only
// first pass) - it reuses the page number and replaces the existing recap + HTML.
// Always run `node scripts/validate.mjs` before pushing. Zero dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..');
const REPO_BLOB = 'https://github.com/ZAODEVZ/zabalgames/blob/main';
const TRANSCRIPT_DIR = 'data/streams/zabal-games-workshops/raw/transcripts';

const args = process.argv.slice(2);
const write = args.includes('--write');
const manifestPath = args.find((a) => !a.startsWith('--'));

function die(msg) { console.error(msg); process.exit(2); }

if (!manifestPath) die('usage: node scripts/ingest-recording.mjs <manifest.json> [--write]');
if (!fs.existsSync(manifestPath)) die(`manifest not found: ${manifestPath}`);

let m;
try { m = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); }
catch (e) { die(`manifest is not valid JSON: ${e.message}`); }

// --- validate required fields ---
const required = ['slug', 'date', 'title'];
const missing = required.filter((k) => !m[k] || !String(m[k]).trim());
if (missing.length) die(`manifest missing required field(s): ${missing.join(', ')}`);
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(m.slug)) die(`slug must be lowercase-hyphenated: "${m.slug}"`);
if (!/^\d{4}-\d{2}-\d{2}$/.test(m.date)) die(`date must be YYYY-MM-DD: "${m.date}"`);
if (m.chapters && (!Array.isArray(m.chapters) || (m.chapters.length && (m.chapters[0].t ?? 0) !== 0)))
  die('chapters must be an array whose first entry has t:0 (seconds)');

const type = m.type || 'workshop';
const track = m.track || null;

// --- brand-clean helpers (mirror scripts/fix-transcript.mjs 'safe' rules) ---
const glossary = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/transcript-corrections.json'), 'utf8'));
function safeMatcher(from) {
  const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`\\b${esc}\\b`, 'gi');
}
function brandClean(text) {
  if (!text) return text;
  let out = text;
  for (const rule of glossary.safe || []) out = out.replace(safeMatcher(rule.from), rule.to);
  // em dash / en dash -> hyphen with surrounding spaces (brand rule: hyphens only).
  out = out.replace(/\s*[—–]\s*/g, ' - ');
  return out;
}

// --- escapers ---
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const attr = (s) => esc(s).replace(/"/g, '&quot;');
const jstr = (s) => JSON.stringify(String(s == null ? '' : s)); // safe JS string literal

function fmtTime(sec) {
  sec = Math.max(0, Math.floor(Number(sec) || 0));
  const h = Math.floor(sec / 3600), mm = Math.floor((sec % 3600) / 60), ss = sec % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${p(mm)}:${p(ss)}` : `${mm}:${p(ss)}`;
}
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

function ytId(url) {
  if (!url) return null;
  const m1 = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/))([A-Za-z0-9_-]{6,})/);
  return m1 ? m1[1] : null;
}

// --- resolve the recording number N ---
const recapsFile = path.join(ROOT, 'data/recaps.json');
const recapsDoc = JSON.parse(fs.readFileSync(recapsFile, 'utf8'));
const recaps = recapsDoc.recaps || [];
const transcriptPath = `${TRANSCRIPT_DIR}/${m.date}-${m.slug}.md`;
const transcriptUrl = `${REPO_BLOB}/${transcriptPath}`;

// Match an existing recap by transcript filename (date+slug) or by an explicit page.
const slugTail = `${m.date}-${m.slug}.md`;
const existingIdx = recaps.findIndex((r) =>
  (r.transcript && r.transcript.endsWith(slugTail)) ||
  (m.page && r.page === m.page));

let pageNum;
if (existingIdx >= 0 && recaps[existingIdx].page) {
  pageNum = parseInt(String(recaps[existingIdx].page).replace(/\D/g, ''), 10);
} else {
  const nums = fs.readdirSync(path.join(ROOT, 'recordings'))
    .map((f) => f.match(/^(\d+)\.html$/)).filter(Boolean).map((mm) => parseInt(mm[1], 10));
  pageNum = (nums.length ? Math.max(...nums) : 0) + 1;
}
const page = `/recordings/${pageNum}`;
const pageUrl = `https://zabalgamez.com${page}`;
const pageFile = path.join(ROOT, `recordings/${pageNum}.html`);
const yt = ytId(m.youtube);

// --- build the transcript file content ---
function buildTranscript() {
  let body = brandClean(m.transcript_markdown || '');
  const hasFrontmatter = /^\s*---\r?\n/.test(body);
  if (hasFrontmatter || !body.trim()) return body;
  const fm = [
    '---',
    `title: ${m.title}`,
    'show: ZABAL Gamez Workshops',
    `presenter: ${[m.presenter, m.handle].filter(Boolean).join(' ')}`.replace(/\s+$/, ''),
    ...(m.org ? [`org: ${m.org}`] : []),
    `date: ${m.date}T00:00:00.000Z`,
    `format: ${m.format || 'Recorded workshop'}`,
    'language: en',
    ...(track ? [`track: ${track}`] : []),
    ...(m.youtube ? [`youtube: ${m.youtube}`] : []),
    ...(m.topics && m.topics.length ? [`topics: [${m.topics.join(', ')}]`] : []),
    '---',
    '',
    '',
  ].join('\n');
  return fm + body;
}

// --- build the recap object (field order per data/recaps.json _note) ---
function buildRecap() {
  const summary = brandClean(m.summary || '');
  const takeaways = (m.takeaways || []).map(brandClean);
  const r = { date: m.date, type, title: m.title };
  if (m.presenter) r.presenter = m.presenter;
  if (m.handle) r.handle = m.handle;
  if (m.org) r.org = m.org;
  if (track) r.track = track;
  if (m.format) r.format = m.format;
  if (m.thumbnail) r.thumbnail = m.thumbnail;
  if (summary) r.summary = summary;
  if (m.topics && m.topics.length) r.topics = m.topics;
  if (m.youtube) r.youtube = m.youtube;
  r.page = page;
  if (m.transcript_markdown) r.transcript = transcriptUrl;
  if (m.link) r.link = m.link;
  if (m.link_label) r.link_label = m.link_label;
  if (takeaways.length) r.takeaways = takeaways;
  if (m.share_topics && m.share_topics.length) r.share_topics = m.share_topics;
  if (m.chapters && m.chapters.length) r.chapters = m.chapters.map((c) => ({ t: c.t, label: c.label }));
  if (m.okd) r.okd = m.okd;
  if (m.cast_hash) r.cast_hash = m.cast_hash;
  return r;
}

// --- build the recording HTML page ---
function buildPage() {
  const summary = brandClean(m.summary || '');
  const takeaways = (m.takeaways || []).map(brandClean);
  const eyebrow = m.eyebrow || m.org || m.presenter || 'Recording';
  const headline = m.headline || m.title;
  const accent = m.accent || '';
  const h1 = (accent && headline.includes(accent))
    ? esc(headline.slice(0, headline.indexOf(accent))) + `<span class="accent">${esc(accent)}</span>` + esc(headline.slice(headline.indexOf(accent) + accent.length))
    : esc(headline);
  const formatLabel = [track && `${cap(track)} track`, m.format].filter(Boolean).join(' - ');
  const byParts = [esc(m.presenter), esc(m.handle), esc(m.org)].filter(Boolean)
    .join(' <span class="dot">&middot;</span> ');
  const buttonTitle = m.button_title || `Watch: ${m.org || m.presenter || m.title}`;
  const metaDesc = m.description || (summary ? summary.slice(0, 200) : m.title);
  const ogDesc = m.og_description || metaDesc;
  const shareTopics = (m.share_topics && m.share_topics.length) ? m.share_topics
    : (m.topics && m.topics.length ? m.topics : [m.title]);
  const ogType = yt ? 'video.other' : 'article';

  // media block: video embed OR a "processing" note
  const media = yt
    ? `  <div class="rec-embed">
    <iframe id="rec-player"
      src="https://www.youtube.com/embed/${esc(yt)}?rel=0"
      title="ZABAL Gamez Workshop: ${attr(m.title)}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen></iframe>
  </div>`
    : `  <div class="rec-note">
    Recorded live on ${esc(m.date)}. The replay and the word-for-word transcript will be added here -
    the summary and topics are below, with the full recap to follow once the recording is processed.
  </div>`;

  // links row
  const links = [];
  if (yt) links.push(`    <a class="rec-link primary" href="${attr(m.youtube)}" target="_blank" rel="noopener">Watch on YouTube</a>`);
  else if (m.link) links.push(`    <a class="rec-link primary" href="${attr(m.link)}" target="_blank" rel="noopener">${esc(m.link_label || 'Event link')}</a>`);
  if (m.transcript_markdown) links.push(`    <a class="rec-link" href="#rec-transcript">Read the transcript</a>`);
  if (m.link && yt) links.push(`    <a class="rec-link" href="${attr(m.link)}" target="_blank" rel="noopener">${esc(m.link_label || 'Learn more')}</a>`);
  links.push(`    <button class="rec-link rec-watch-share" type="button" data-platform="farcaster">Share on Farcaster</button>`);
  links.push(`    <button class="rec-link rec-watch-share" type="button" data-platform="x">Share on X</button>`);

  // chapters
  let chaptersBlock = '';
  if (yt && m.chapters && m.chapters.length) {
    const items = m.chapters.map((c) =>
      `      <li><button class="rec-chapter" data-start="${esc(c.t)}"><span class="t">${esc(fmtTime(c.t))}</span><span>${esc(c.label)}</span></button></li>`
    ).join('\n');
    chaptersBlock = `\n    <div class="rec-label">Best moments</div>\n    <ul class="rec-chapters" id="rec-chapters">\n${items}\n    </ul>\n`;
  }

  // topics
  let topicsBlock = '';
  if (m.topics && m.topics.length) {
    const t = m.topics.map((x) => `      <span class="rec-topic">${esc(x)}</span>`).join('\n');
    topicsBlock = `\n    <div class="rec-label">Topics</div>\n    <div class="rec-topics">\n${t}\n    </div>\n`;
  }

  // takeaways
  let takeawaysBlock = '';
  if (takeaways.length) {
    const t = takeaways.map((x) => `      <li>${esc(x)}</li>`).join('\n');
    takeawaysBlock = `\n    <div class="rec-label">Key takeaways</div>\n    <ul class="rec-takeaways">\n${t}\n    </ul>\n`;
  }

  // on-site transcript reader (assets/transcript.js renders /data/.../x.md with deep-linkable lines)
  const transcriptBlock = m.transcript_markdown
    ? `  <section class="section rec-transcript-section">
    <div class="rec-label">Transcript</div>
    <p style="color:var(--text-dim);font-size:0.82rem;margin:0 0 0.5rem;">Hover any line and click # to copy a link straight to it.</p>
    <div id="rec-transcript" data-src="/${transcriptPath}" data-yt="${esc(yt || '')}"></div>
  </section>

`
    : '';

  // styles: full page needs chapter styles; both share the rest. include all (harmless).
  const styles = `    .rec-embed { position: relative; width: 100%; aspect-ratio: 16 / 9; border-radius: 12px; overflow: hidden; background: #000; border: 1px solid var(--border); margin-top: 1rem; }
    .rec-embed iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
    .rec-by { color: var(--text-muted); font-size: 0.9rem; margin: 0.3rem 0 0.2rem; }
    .rec-by .dot { color: var(--text-dim); padding: 0 0.3rem; }
    .rec-format { font-family: 'JetBrains Mono', monospace; font-size: 0.74rem; color: var(--text-dim); }
    .rec-note { border: 1px solid var(--border); border-left: 3px solid var(--gold); border-radius: 10px; background: var(--surface-2); padding: 0.85rem 1rem; color: var(--text-muted); font-size: 0.9rem; line-height: 1.55; }
    .rec-links { display: flex; flex-wrap: wrap; gap: 8px; margin: 0.9rem 0 0.2rem; }
    .rec-link { font-size: 0.82rem; padding: 0.34rem 0.75rem; border-radius: 6px; text-decoration: none; border: 1px solid var(--border); background: var(--surface-2); color: var(--cyan); font-family: inherit; cursor: pointer; }
    .rec-link.primary { background: var(--zabal); color: #fff; border-color: var(--zabal); }
    .rec-link:hover { filter: brightness(1.12); }
    .rec-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.09em; color: var(--text-dim); margin: 1.3rem 0 0.4rem; }
    .rec-chapters { list-style: none; margin: 0; padding: 0; display: grid; gap: 2px; }
    .rec-chapters li { margin: 0; }
    .rec-chapter { display: flex; gap: 0.7rem; align-items: baseline; width: 100%; text-align: left; background: none; border: 0; border-radius: 6px; padding: 0.34rem 0.5rem; color: var(--text); font: inherit; font-size: 0.9rem; cursor: pointer; }
    .rec-chapter:hover { background: var(--surface-2); }
    .rec-chapter .t { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: var(--cyan); min-width: 3.2rem; }
    .rec-topics { display: flex; flex-wrap: wrap; gap: 6px; margin: 0.3rem 0 0; }
    .rec-topic { font-size: 0.7rem; letter-spacing: 0.02em; padding: 0.14rem 0.6rem; border-radius: 999px; border: 1px solid var(--border); color: var(--text-muted); background: var(--surface-2); }
    .rec-takeaways { margin: 0.3rem 0 0; padding-left: 1.1rem; }
    .rec-takeaways li { color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.3rem; line-height: 1.5; }`;

  const miniapp = JSON.stringify({
    version: '1',
    imageUrl: 'https://zabalgamez.com/assets/embed-card-gamez.png',
    button: { title: buttonTitle, action: { type: 'launch_miniapp', name: 'ZABAL Gamez', url: pageUrl, splashImageUrl: 'https://zabalgamez.com/assets/logo-gamez.png', splashBackgroundColor: '#070709' } },
  }).replace(/'/g, '&#39;');

  // share script
  const shareScript = `<script>
(function () {
${yt ? `  var YT_ID = ${jstr(yt)};\n` : ''}  var PAGE_URL = ${jstr(pageUrl)};
  var TOPICS = ${JSON.stringify(shareTopics, null, 2).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')};
${yt ? `
  var player = document.getElementById('rec-player');
  var chapters = document.getElementById('rec-chapters');
  if (player && chapters) {
    chapters.addEventListener('click', function (ev) {
      var b = ev.target.closest('.rec-chapter');
      if (!b) return;
      var start = parseInt(b.getAttribute('data-start') || '0', 10) || 0;
      player.src = 'https://www.youtube.com/embed/' + YT_ID + '?rel=0&autoplay=1&start=' + start;
      player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
` : ''}
  document.querySelectorAll('.rec-watch-share').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!(window.ZABAL && window.ZABAL.share)) return;
      var platform = b.getAttribute('data-platform') === 'x' ? 'x' : 'farcaster';
      var topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
      var text = "I'm watching ZABAL Gamez with ${esc(m.presenter || 'The ZAO')} - " + topic;
      window.ZABAL.share({ platform: platform, text: text, url: PAGE_URL, target: 'recording-${pageNum}-' + platform });
    });
  });
})();
</script>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(m.title)} - ${esc(m.presenter || 'ZABAL Gamez')} - ZABAL Gamez Season 1</title>
  <meta name="description" content="${attr(metaDesc)}">
  <link rel="canonical" href="${attr(pageUrl)}">
  <meta property="og:title" content="${attr(m.title)} - ${attr(m.presenter || 'ZABAL Gamez')} - ZABAL Gamez">
  <meta property="og:description" content="${attr(ogDesc)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${attr(pageUrl)}">
  <meta property="og:image" content="https://zabalgamez.com/assets/embed-card-gamez.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${attr(m.title)} - ${attr(m.presenter || 'ZABAL Gamez')}">
  <meta name="twitter:description" content="${attr(ogDesc)}">
  <meta name="twitter:image" content="https://zabalgamez.com/assets/embed-card-gamez.png">
  <meta name="fc:miniapp" content='${miniapp}'>
  <link rel="icon" type="image/png" href="/assets/icon.png">
  <meta name="theme-color" content="#070709">
  <link rel="apple-touch-icon" href="/assets/icon.png">
  <meta name="fc:disable-native-gestures" content="1">
  <link rel="preconnect" href="https://esm.sh">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Press+Start+2P&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/assets/style.css">
  <script type="module" src="/assets/miniapp.js"></script>
  <style>
${styles}
  </style>
</head>
<body>

<a class="arcade-skip" href="#main">Skip to content</a>
<nav class="arcade-nav" aria-label="Primary">
  <div class="arcade-nav-inner">
    <a href="/" class="arcade-brand" aria-label="ZABAL Gamez home">ZABAL <span class="accent">GAMEZ</span></a>
    <div class="arcade-nav-menu">
      <a href="/speakers">Speakers</a>
      <a href="/#schedule">Schedule</a>
      <a href="/recordings">Recordings</a>
      <a href="https://collect.zabalgamez.com" class="arcade-coin" target="_blank" rel="noopener">Insert Coin</a>
    </div>
  </div>
</nav>

<main id="main">
<div class="container">

  <nav id="rec-nav" class="rec-nav" aria-label="Recording navigation"></nav>

  <header class="hero" style="padding-bottom: 0.6rem;">
    <div class="hero-eyebrow"><a href="/recordings" style="color: inherit;">The recordings</a> / ${esc(eyebrow)}</div>
    <h1>${h1}</h1>
    <p class="rec-by">
      ${byParts}${formatLabel ? `\n      <span class="dot">&middot;</span> <span class="rec-format">${esc(formatLabel)}</span>` : ''}
    </p>
  </header>

${media}

  <div class="rec-links">
${links.join('\n')}
  </div>

  <section class="section" style="margin-top: 1.4rem;">
${summary ? `    <p class="recap-summary" style="font-size: 0.95rem; line-height: 1.6;">\n      ${esc(summary)}\n    </p>\n` : ''}${chaptersBlock}${topicsBlock}${takeawaysBlock}  </section>

  <p style="margin-top: 1.4rem; font-size: 0.85rem;"><a href="/recordings">All recordings</a> &nbsp;-&nbsp; <a href="/recaps">Session recaps</a> &nbsp;-&nbsp; <a href="/#schedule">Upcoming schedule</a></p>

${transcriptBlock}  <section id="zg-clip-bounty"></section>

  <section id="zg-clip-claim"></section>

  <section id="zg-comments"></section>

</div>
</main>

<footer class="arcade-foot" aria-label="Site directory">
  <div class="arcade-foot-inner">
    <div class="arcade-foot-brand">
      <span class="arcade-foot-logo pixel">ZABAL GAMEZ</span>
      <p class="arcade-foot-tag">The ZAO's 3-month Build-A-Thon. June workshops, July open build, August Finals. Free, open to anyone.</p>
      <a href="https://collect.zabalgamez.com" class="arcade-coin" target="_blank" rel="noopener">Insert Coin</a>
    </div>
    <nav class="arcade-foot-col" aria-label="Data">
      <h4>Data</h4>
      <a href="/speakers.html">Speakers</a>
      <a href="/recordings.html">Recordings</a>
      <a href="/recaps">Session Recaps</a>
      <a href="/streams.html">Streams</a>
      <a href="/#schedule">Schedule</a>
    </nav>
    <nav class="arcade-foot-col" aria-label="Connect">
      <h4>Connect</h4>
      <a href="https://farcaster.xyz/~/channel/zabal" target="_blank" rel="noopener">/zabal channel</a>
      <a href="https://paragraph.com/@thezao" target="_blank" rel="noopener">Newsletter</a>
      <a href="/links.html">All Links</a>
      <a href="/share.html">Share</a>
    </nav>
  </div>
  <div class="arcade-foot-bottom">
    <span class="pixel">INSERT COIN</span>
    <span>zabalgamez.com - built with The ZAO</span>
  </div>
</footer>

${shareScript}

<script defer src="/assets/rec-nav.js"></script>
<script defer src="/assets/site-nav.js"></script>
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/assets/clip-bounty.js"></script>
<script defer src="/assets/clip-claim.js"></script>
<script defer src="/assets/recording-comments.js"></script>
<script defer src="/assets/transcript.js"></script>
</body>
</html>
`;
}

// --- assemble + report ---
const transcriptContent = buildTranscript();
const recap = buildRecap();
const pageHtml = buildPage();
const action = existingIdx >= 0 ? 'UPDATE' : 'CREATE';

console.log(`\ningest-recording: ${path.basename(manifestPath)}\n`);
console.log(`  ${action}  ${m.title}`);
console.log(`  page        ${page}  (recordings/${pageNum}.html)  [${yt ? 'video' : 'placeholder'}]`);
if (m.transcript_markdown) console.log(`  transcript  ${transcriptPath}`);
console.log(`  recap       data/recaps.json  (${existingIdx >= 0 ? 'replace in place' : 'prepend, newest first'})`);
if (m.chapters && m.chapters.length) console.log(`  chapters    ${m.chapters.length}`);

if (!write) {
  console.log('\nDry run - nothing written. Re-run with --write to apply, then run node scripts/validate.mjs.');
  process.exit(0);
}

// --- write ---
if (m.transcript_markdown) {
  fs.mkdirSync(path.join(ROOT, TRANSCRIPT_DIR), { recursive: true });
  fs.writeFileSync(path.join(ROOT, transcriptPath), transcriptContent);
}
fs.writeFileSync(pageFile, pageHtml);

if (existingIdx >= 0) recaps[existingIdx] = recap;
else recaps.unshift(recap);
recapsDoc.recaps = recaps;
fs.writeFileSync(recapsFile, JSON.stringify(recapsDoc, null, 2) + '\n');

// rebuild the index
execFileSync('node', [path.join(ROOT, 'scripts/build-recordings-index.mjs')], { stdio: 'inherit' });

console.log(`\nDone. Wrote ${action === 'CREATE' ? 'new' : 'updated'} recording ${page}.`);
console.log('Next: node scripts/validate.mjs, then commit + open a PR.');

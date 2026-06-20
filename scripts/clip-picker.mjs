#!/usr/bin/env node
// clip-picker.mjs - scan a timestamped transcript and surface candidate "best moments" to cut
// into Shorts. Heuristic only: it ranks self-contained, punchy lines (numbers, strong openers,
// quotable phrasing) so cutting clips is a 10-minute job, not a rewatch. You make the final call.
//
// Zero deps, read-only. Usage:
//   node scripts/clip-picker.mjs 9                         # by recording number (reads recaps)
//   node scripts/clip-picker.mjs path/to/transcript.md     # by file
//   node scripts/clip-picker.mjs 9 --top 12                # how many to surface (default 10)
//
// Output per pick: start timestamp, a suggested ~45s window, the line, and why it scored.

import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('..', import.meta.url);
const args = process.argv.slice(2);
const topN = (() => { const i = args.indexOf('--top'); return i >= 0 ? parseInt(args[i + 1], 10) || 10 : 10; })();
const target = args.find((a) => !a.startsWith('--'));
if (!target) { console.error('usage: node scripts/clip-picker.mjs <recording-number | transcript.md> [--top N]'); process.exit(2); }

// resolve a transcript file
let file = target;
if (/^\d+$/.test(target)) {
  const recaps = JSON.parse(fs.readFileSync(new URL('data/recaps.json', ROOT))).recaps || [];
  const r = recaps.find((x) => x.page === `/recordings/${target}`);
  if (!r || !r.transcript) { console.error(`no transcript on file for /recordings/${target}`); process.exit(2); }
  file = r.transcript.replace(/^https?:\/\/[^/]+\/(?:.*?\/blob\/main\/)?/, '');
}
const abs = path.isAbsolute(file) ? file : path.join(ROOT.pathname, file);
if (!fs.existsSync(abs)) { console.error(`transcript not found: ${file}`); process.exit(2); }

const TS = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/;
function secs(m) { return m[3] === undefined ? (+m[1]) * 60 + (+m[2]) : (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]); }
function fmt(s) { const h = (s / 3600) | 0, m = ((s % 3600) / 60) | 0, ss = s % 60, p = (n) => n < 10 ? '0' + n : '' + n; return h ? `${h}:${p(m)}:${p(ss)}` : `${m}:${p(ss)}`; }

// strong, quotable signals (lowercase). hits => more clip-worthy.
const PHRASES = ['the point', 'the key', 'the secret', 'the trick', 'what matters', "you don't need",
  "here's", 'the truth', 'the goal', 'the thing is', 'the only', 'first ever', 'the best', 'the whole',
  'the reason', 'the difference', 'the real', 'never', 'always', 'the biggest', 'the hardest', 'the magic'];

const raw = fs.readFileSync(abs, 'utf8').replace(/^---[\s\S]*?\n---\n/, '');
const blocks = raw.split(/\n\s*\n+/).map((b) => b.trim()).filter(Boolean);

const items = [];
for (const b of blocks) {
  const m = b.match(TS);
  if (!m) continue;
  const start = secs(m);
  const text = b.replace(/\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g, '').replace(/\s+/g, ' ').trim();
  if (!text || /^[A-Za-z ]+:$/.test(text)) continue;
  const low = text.toLowerCase();
  let score = 0; const why = [];
  if (/\b\d+(?:[.,]\d+)?\s*(?:%|percent|sol|eth|x|k|million|dollars?)\b/i.test(text) || /\$\d/.test(text)) { score += 3; why.push('number'); }
  const ph = PHRASES.filter((p) => low.includes(p));
  if (ph.length) { score += 2; why.push('hook:' + ph[0]); }
  if (/\?\s*$/.test(text)) { score += 1; why.push('question'); }
  const len = text.length;
  if (len >= 60 && len <= 240) { score += 2; why.push('punchy'); }
  else if (len > 360) { score -= 1; }
  if (/^(so|and|but|um|uh|yeah|okay|right)\b/i.test(text)) score -= 1; // weak openers
  items.push({ start, text, score, why });
}

const picks = items.filter((x) => x.score > 0).sort((a, b) => b.score - a.score || a.start - b.start).slice(0, topN)
  .sort((a, b) => a.start - b.start);

console.log(`Clip candidates for ${file} (${picks.length} of ${items.length} timed lines)`);
console.log('Cut these in Descript: lead with the payoff, one point per clip, burned-in captions.\n');
if (!picks.length) { console.log('No timestamped lines found - this transcript may have no timestamps yet.'); process.exit(0); }
for (const p of picks) {
  console.log(`[${fmt(p.start)} -> ${fmt(p.start + 45)}]  (score ${p.score}: ${p.why.join(', ')})`);
  console.log('  ' + (p.text.length > 180 ? p.text.slice(0, 177) + '...' : p.text) + '\n');
}

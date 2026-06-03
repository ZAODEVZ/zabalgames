#!/usr/bin/env node
// add-daily.mjs - append a daily update or a session recap to the JSON the
// /today and /recaps pages read. Zero-dependency, matches the repo's
// node-only, zero-build convention.
//
// Usage:
//   node scripts/add-daily.mjs daily --day 4 --date 2026-06-04 \
//        --title "Topic" --body "What happened." \
//        [--mindful "Card line."] [--link "Label|/url" --link "RSVP|https://..."]
//
//   node scripts/add-daily.mjs recap --date 2026-06-03 --title "Topic" \
//        --presenter "Name" --track builder \
//        [--recording https://luma.com/x] [--transcript https://github.com/...] \
//        [--thumb /assets/workshops/x.png] [--link "Label|https://..."] \
//        [--take "Takeaway one." --take "Takeaway two."]
//
// Entries are inserted newest-first. The target file is created with the right
// shape if it does not exist yet. DATA_DIR overrides the data directory (used
// by the test fixture).

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || 'data';

function parseArgs(argv) {
  const out = { _: [], link: [], take: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = (argv[i + 1] && !argv[i + 1].startsWith('--')) ? argv[++i] : 'true';
      if (key === 'link') out.link.push(val);
      else if (key === 'take') out.take.push(val);
      else out[key] = val;
    } else {
      out._.push(a);
    }
  }
  return out;
}

function loadOrInit(file, shape) {
  if (existsSync(file)) return JSON.parse(readFileSync(file, 'utf8'));
  return shape;
}

function save(file, obj) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(file, JSON.stringify(obj, null, 2) + '\n');
  // Re-parse to guarantee we wrote valid JSON.
  JSON.parse(readFileSync(file, 'utf8'));
}

function toLinks(pairs) {
  return pairs.map((p) => {
    const i = p.indexOf('|');
    if (i < 0) throw new Error(`--link must be "Label|url", got: ${p}`);
    return { label: p.slice(0, i), url: p.slice(i + 1) };
  });
}

function need(args, keys) {
  const missing = keys.filter((k) => !args[k]);
  if (missing.length) {
    console.error(`Missing required: ${missing.map((m) => '--' + m).join(', ')}`);
    process.exit(1);
  }
}

function addDaily(args) {
  need(args, ['day', 'date', 'title', 'body']);
  const file = join(DATA_DIR, 'daily-updates.json');
  const data = loadOrInit(file, {
    season: 1,
    newsletter_url: 'https://paragraph.com/@thezao',
    updates: [],
  });
  if (data.updates.some((u) => String(u.day) === String(args.day))) {
    console.error(`Day ${args.day} already exists in ${file}. Edit it by hand or pick a new day.`);
    process.exit(1);
  }
  const entry = { day: Number(args.day), date: args.date, title: args.title, body: args.body };
  if (args.mindful) entry.mindful = args.mindful;
  if (args.link.length) entry.links = toLinks(args.link);
  data.updates.unshift(entry);
  data.updates.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  save(file, data);
  console.log(`Added Day ${entry.day} (${entry.date}) to ${file}. Total: ${data.updates.length}.`);
}

function addRecap(args) {
  need(args, ['date', 'title', 'presenter']);
  const file = join(DATA_DIR, 'recaps.json');
  const data = loadOrInit(file, { season: 1, recaps: [] });
  const entry = { date: args.date, title: args.title, presenter: args.presenter };
  if (args.track) entry.track = args.track;
  if (args.thumb) entry.thumbnail = args.thumb;
  if (args.recording) entry.recording = args.recording;
  if (args.transcript) entry.transcript = args.transcript;
  if (args.link.length) {
    const l = toLinks(args.link)[0];
    entry.link = l.url;
    entry.link_label = l.label;
  }
  if (args.take.length) entry.takeaways = args.take;
  data.recaps.unshift(entry);
  data.recaps.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  save(file, data);
  console.log(`Added recap "${entry.title}" (${entry.date}) to ${file}. Total: ${data.recaps.length}.`);
}

const args = parseArgs(process.argv.slice(2));
const cmd = args._[0];
if (cmd === 'daily') addDaily(args);
else if (cmd === 'recap') addRecap(args);
else {
  console.error('Usage: node scripts/add-daily.mjs <daily|recap> [flags]  (see file header)');
  process.exit(1);
}

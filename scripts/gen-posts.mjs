#!/usr/bin/env node
// gen-posts.mjs - generate promo + live-now posts for upcoming sessions straight from
// data/workshop-leads.json (the source of truth), in the canonical media-playbook formats.
// The posts can no longer drift from the data, because they ARE the data.
//
// Zero dependencies, read-only. Usage:
//   node scripts/gen-posts.mjs              # every upcoming session (date >= today)
//   node scripts/gen-posts.mjs 2026-06-25   # just that date
//   node scripts/gen-posts.mjs --all        # every dated session, past included
//
// Brand: no emojis, no em dashes (hyphens only). Each post is checked against the 280-char
// cross-post limit (X / Farcaster / Lens / Bluesky).

import fs from 'node:fs';

const ROOT = new URL('..', import.meta.url);
const leads = JSON.parse(fs.readFileSync(new URL('data/workshop-leads.json', ROOT))).leads || [];

const DAY = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday', Fri: 'Friday', Sat: 'Saturday' };
const args = process.argv.slice(2);
const all = args.includes('--all');
const onDate = args.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a));
const today = new Date().toISOString().slice(0, 10);

// "Sat Jun 20 2026, 8am EST" -> "Saturday 8am EST"
function whenLabel(when) {
  const m = (when || '').match(/^(\w{3})\b.*?,\s*(\d{1,2}(?::\d{2})?\s*(?:am|pm))\s*EST/i);
  if (!m) return '';
  return [DAY[m[1]] || m[1], m[2].replace(/\s+/g, ''), 'EST'].join(' ');
}
// headline part of the topic (before the first " - ")
function shortTopic(t) { return (t || '').split(' - ')[0].trim().replace(/[.\s]+$/, ''); }
// prefer the @handle (tags on Farcaster + X); fall back to the name
function who(r) { return (r.handle && r.handle.trim()) ? r.handle.trim() : r.name; }
function tag(n) { return n + (n > 280 ? '  <-- OVER 280' : ''); }

const rows = leads
  .filter((r) => r.date && r.luma_url && (onDate ? r.date === onDate : (all || r.date >= today)))
  .sort((a, b) => (a.date + (a.when || '')).localeCompare(b.date + (b.when || '')));

if (!rows.length) { console.log('No matching sessions.'); process.exit(0); }

for (const r of rows) {
  const when = whenLabel(r.when);
  const topic = shortTopic(r.topic);
  const ama = /\bAMA\b/i.test(r.topic || '') || /\bAMA\b/i.test(r.name || '');

  const promo = `${when} for a ZABAL Gamez Workshop: ${who(r)} on ${topic}.\n\nFree, live, recorded. RSVP: ${r.luma_url}`;
  const live = `We're live now in ZABAL Gamez: ${who(r)} on ${topic}.\n\nHop in: ${r.luma_url}`;

  console.log('================ ' + r.date + ' | ' + r.name + ' (' + (r.track || '?') + ') ================');
  if (ama) console.log('NOTE: this looks like an AMA/special - use bespoke copy from its luma doc, not the workshop promo below.');
  console.log('\n--- PROMO [' + tag(promo.length) + '] ---\n' + promo);
  console.log('\n--- LIVE-NOW [' + tag(live.length) + '] ---\n' + live);
  console.log('');
}

// Build the public people directory (data/crm.json) for /crm.
//
// Aggregates everyone in the ZABAL Gamez orbit from the structured sources and records what
// each person was "in for": workshop leads, dream-lead nominees, mentors, the Farcaster
// Batches builders, and the rich profiles in people.json. Deduped by normalized name; roles +
// involvement + handles merged. People with a people.json entry link to their /p profile.
//
//   node scripts/build-crm.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));

const norm = (n) => String(n || '')
  .toLowerCase()
  .replace(/\(.*?\)/g, ' ')        // drop "(Project)"
  .replace(/\.eth\b/g, ' ')
  .replace(/[^a-z0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();
const cleanHandle = (h) => String(h || '').replace(/^@+/, '').trim();

const map = new Map(); // normName -> record
function upsert(name, { farcaster, x, github, track, role, involvement, color, profile_url } = {}) {
  const key = norm(name);
  if (!key) return;
  let r = map.get(key);
  if (!r) {
    r = { name, farcaster: '', x: '', github: '', track: '', color: '', roles: [], involvement: [], profile_url: null };
    map.set(key, r);
  }
  // prefer a longer/cleaner display name (e.g., people.json full name)
  if (name && name.length > r.name.length && !/\(/.test(name)) r.name = name;
  if (farcaster && !r.farcaster) r.farcaster = cleanHandle(farcaster);
  if (x && !r.x) r.x = cleanHandle(x);
  if (github && !r.github) r.github = cleanHandle(github);
  if (track && !r.track) r.track = track;
  if (color && !r.color) r.color = color;
  if (profile_url && !r.profile_url) r.profile_url = profile_url;
  if (role && !r.roles.includes(role)) r.roles.push(role);
  if (involvement && !r.involvement.includes(involvement)) r.involvement.push(involvement);
}

const ROLE_LABEL = { organizer: 'Organizer', workshop_lead: 'Workshop lead', partner: 'Partner', core_builder: 'Core builder', mentor: 'Mentor' };

// 1. people.json - the rich base profiles (these get a /p link)
for (const p of (read('data/people.json').people || [])) {
  const h = cleanHandle(p.handle);
  upsert(p.name, {
    farcaster: p.farcaster_url ? '' : '', x: '', color: p.color,
    profile_url: h ? `/p?handle=${encodeURIComponent(h)}` : null,
  });
  // handle is the canonical Farcaster handle in people.json
  const r = map.get(norm(p.name));
  if (r && h && !r.farcaster) r.farcaster = h;
  for (const role of (p.roles || [])) upsert(p.name, { role: ROLE_LABEL[role] || role });
  if (p.headline) upsert(p.name, { involvement: p.headline });
}

// 2. workshop-leads.json
for (const l of (read('data/workshop-leads.json').leads || [])) {
  const when = (l.when || '').split(',')[0];
  const topic = (l.topic && l.topic !== 'To be announced' && l.topic !== 'Topic to be announced')
    ? l.topic.split(' - ')[0] : '';
  upsert(l.name, {
    farcaster: cleanHandle(l.handle), track: l.track, color: l.color, role: 'Workshop lead',
    involvement: 'Workshop' + (topic ? `: ${topic}` : '') + (when ? ` (${when})` : ''),
  });
}

// 3. dream-leads.json
for (const l of (read('data/dream-leads.json').leads || [])) {
  upsert(l.name, {
    farcaster: l.farcaster, x: l.x, github: l.github, track: l.track,
    role: 'Dream lead', involvement: 'On the Dream Leads board',
  });
}

// 4. mentors.json
for (const m of (read('data/mentors.json').mentors || (Array.isArray(read('data/mentors.json')) ? read('data/mentors.json') : []))) {
  upsert(m.name, { farcaster: cleanHandle(m.handle), color: m.color, role: 'Mentor', involvement: m.headline || 'ZABAL Gamez mentor' });
}

// 5. Farcaster Batches Week 1 builders (curated from the transcripts)
const batches = [
  ['Chris Dolinsky', 'Vini App', 1, 'builder', '', ''],
  ['Kenny', 'POIDH', 1, 'builder', '', ''],
  ['Nikki Sapp', 'Juke', 1, 'builder', '', 'nicky_sap'],
  ['Jonathan Colton', 'Founder Check / Fotocaster', 1, 'creator', 'jonathancolton', ''],
  ['Dr. Deeks', 'email remittance pro, Crafters, Ghostwriter', 1, 'builder', '', ''],
  ['AZ Flynn', 'Defense of the Agents', 3, 'builder', '', ''],
  ['Cashless Man', 'Booster', 3, 'builder', '', ''],
  ['Duckfax', 'Celebration Hub', 3, 'creator', '', ''],
  ['Node', 'DEKEY', 5, 'builder', 'noad', ''],
  ['Max (baseddesigner.eth)', 'POWER', 5, 'creator', 'baseddesigner.eth', ''],
  ['Toady Hawk', 'betrmint', 5, 'creator', 'betrmint', 'toady_hawk'],
  ['Darko', 'Runner', 5, 'creator', '', ''],
  ['JubJub', 'organized Farcaster Batches', 0, '', '', ''],
];
for (const [name, project, day, track, fc, x] of batches) {
  upsert(name, {
    farcaster: fc, x, track,
    role: day === 0 ? 'Organizer' : 'Batches builder',
    involvement: day === 0 ? 'Organized Farcaster Batches' : `Farcaster Batches: ${project} (Day ${day})`,
  });
}

// --- emit ---
const people = [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
const out = {
  _note: 'Public ZABAL Gamez people directory rendered at /crm. Generated from data/people.json, workshop-leads.json, dream-leads.json, mentors.json, and the Farcaster Batches builders by scripts/build-crm.mjs - do not edit by hand.',
  generated: new Date().toISOString().slice(0, 10),
  count: people.length,
  people,
};
writeFileSync(join(ROOT, 'data/crm.json'), JSON.stringify(out, null, 2) + '\n');
console.log(`[crm] ${people.length} people -> data/crm.json`);

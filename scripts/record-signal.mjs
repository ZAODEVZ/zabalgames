#!/usr/bin/env node
// record-signal.mjs - write one battle signal into data/finals.json, from the room, in one line.
//
// WHY THIS EXISTS. Season 1's poll counts and trading figures were never written down. Not
// because anyone decided against it - because at the moment they existed, someone was
// hosting a live Space, and hand-editing a 200-line JSON file is not a thing you do with an
// audience listening. The numbers were on screen for a minute and then gone forever.
//
// So the capture path has to cost seconds. This does:
//
//   node scripts/record-signal.mjs builder poll --winner @ghostmintops \
//     --counts '@ghostmintops=41,@jdwalka=17' --source 'X poll screenshot'
//
//   node scripts/record-signal.mjs artist charts --winner @n3m \
//     --figures '@n3m=2.41,@dee-13=1.08' --unit SOL --source 'read on air 01:02:11'
//
//   node scripts/record-signal.mjs creator judges --winner @uniquebeing404 \
//     --votes '@uniquebeing404=2,@presdency=1' --source 'Space recording 01:05:40'
//
//   node scripts/record-signal.mjs artist judges --did-not-run 'no panel for this battle'
//
// capturedAt is stamped automatically - the whole point is that it records WHEN, and a
// timestamp you have to type is a timestamp you get wrong. --source is REQUIRED for a real
// capture: a number with no provenance cannot be checked later, and check-signals.mjs
// rejects it anyway, so it is better to be stopped here than at push time.
//
// Writes nothing on error. Run `node scripts/check-signals.mjs` after; validate.mjs does too.

import { readFileSync, writeFileSync } from 'node:fs';

const FILE = 'data/finals.json';
const SIGNALS = ['poll', 'charts', 'judges'];
const NUMBER_FLAG = { poll: 'counts', charts: 'figures', judges: 'votes' };

const die = (m) => { console.error('record-signal: ' + m); process.exit(2); };

const argv = process.argv.slice(2);
const [track, signal] = argv;
if (!track || !signal) die('usage: record-signal.mjs <track> <poll|charts|judges> [--winner X --counts "a=1,b=2" --source "..."] | --did-not-run "reason"');
if (!SIGNALS.includes(signal)) die(`signal must be one of ${SIGNALS.join(', ')} - got "${signal}"`);

function flag(name) {
  const i = argv.indexOf('--' + name);
  return i === -1 ? undefined : argv[i + 1];
}

// "a=1,b=2" -> { a: 1, b: 2 }. Values stay numeric so they can be summed or compared later;
// a non-numeric value is an error rather than a silently stringified surprise.
function parsePairs(raw, what) {
  const outObj = {};
  for (const part of String(raw).split(',')) {
    const p = part.trim();
    if (!p) continue;
    const eq = p.lastIndexOf('=');
    if (eq === -1) die(`--${what} entry "${p}" is not name=number`);
    const k = p.slice(0, eq).trim();
    const v = Number(p.slice(eq + 1).trim());
    if (!k) die(`--${what} entry "${p}" has an empty name`);
    if (!Number.isFinite(v)) die(`--${what} value for "${k}" is not a number`);
    outObj[k] = v;
  }
  if (!Object.keys(outObj).length) die(`--${what} parsed to nothing`);
  return outObj;
}

let doc;
try { doc = JSON.parse(readFileSync(FILE, 'utf8')); } catch (e) { die(`${FILE} - ${e.message}`); }

const battle = (doc.battles || []).find((b) => b.track === track);
if (!battle) die(`no battle with track "${track}". Have: ${(doc.battles || []).map((b) => b.track).join(', ')}`);
if (!battle.signals) battle.signals = {};

const didNotRun = flag('did-not-run');
const capturedAt = new Date().toISOString();

if (didNotRun !== undefined) {
  if (!String(didNotRun).trim()) die('--did-not-run needs a reason. "It did not run" without a why is the gap again.');
  battle.signals[signal] = { ran: false, reason: String(didNotRun), winner: null, capturedAt, source: null };
  if (signal === 'judges') battle.signals[signal].panel = [];
} else {
  const winner = flag('winner');
  const source = flag('source');
  const numbersRaw = flag(NUMBER_FLAG[signal]);

  if (!winner) die('--winner is required (or use --did-not-run "reason")');
  if (!source || !String(source).trim()) die('--source is required - where the number was read from. A number with no provenance cannot be checked later.');
  if (!numbersRaw) die(`--${NUMBER_FLAG[signal]} is required, as "name=number,name=number"`);

  const numbers = parsePairs(numbersRaw, NUMBER_FLAG[signal]);
  if (!(winner in numbers)) {
    console.error(`record-signal: WARNING - winner "${winner}" is not among the ${NUMBER_FLAG[signal]} keys (${Object.keys(numbers).join(', ')}). Writing anyway; check the handles match.`);
  }

  const prev = battle.signals[signal] || {};
  const entry = { ran: true, winner, [NUMBER_FLAG[signal]]: numbers, capturedAt, source: String(source) };
  if (signal === 'poll') { entry.total = Object.values(numbers).reduce((a, b) => a + b, 0); entry.url = flag('url') ?? prev.url ?? null; }
  if (signal === 'charts') entry.unit = flag('unit') ?? prev.unit ?? null;
  if (signal === 'judges') entry.panel = prev.panel ?? battle.judges ?? [];
  battle.signals[signal] = entry;
}

// Capturing a real number is the moment the battle stops being unrecoverable, so drop the
// Season 1 exemption if it was ever set on this battle - otherwise the check would keep
// excusing a battle that now has its data.
if (battle.signalsUnrecoverable && didNotRun === undefined) {
  delete battle.signalsUnrecoverable;
  delete battle.signalsUnrecoverableReason;
  console.log('record-signal: cleared signalsUnrecoverable on this battle - it has real data now.');
}

writeFileSync(FILE, JSON.stringify(doc, null, 2) + '\n');
console.log(`record-signal: ${track}/${signal} written at ${capturedAt}`);
console.log('  next: node scripts/check-signals.mjs');

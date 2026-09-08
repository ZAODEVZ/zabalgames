#!/usr/bin/env node
// check-signals.mjs - refuse to let a battle settle with its deciding signals uncaptured.
//
// WHY THIS EXISTS. Season 1 was decided on three signals - an open poll on X, the charts
// from live trading, and a judges panel - and the NUMBERS behind all three were never
// written down while the battles ran. They are not private and not disputed; they are gone.
// Nothing complained at the time, because nothing was watching, so three battles closed and
// the loss was only noticed weeks later during the season close-out.
//
// This is the thing that complains. It runs inside `node scripts/validate.mjs`, so it fires
// on every push without anyone remembering it exists.
//
// It is deliberately NOT a retroactive fixer. Season 1's battles carry
// `signalsUnrecoverable: true` with a reason and are exempted BY NAME and OUT LOUD - the
// point is that the exemption is visible every run, not that the gap goes quiet.
//
//   node scripts/check-signals.mjs            # report + exit non-zero on a real gap
//   node scripts/check-signals.mjs --quiet    # failures only
//
// Exit 0 = every settled battle either has its signals or is an explicit, reasoned exemption.

import { readFileSync } from 'node:fs';

const QUIET = process.argv.includes('--quiet');
const out = (m) => { if (!QUIET) console.log(m); };

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const warn = (m) => { if (!QUIET) console.log('  WARN ' + m); };
const ok = (m) => { if (!QUIET) console.log('  ok   ' + m); };

// A battle is "settled" once it is complete - that is the moment its numbers stop being
// recoverable, so that is the moment they must already exist.
const SETTLED = new Set(['complete', 'done', 'settled']);
const SIGNALS = ['poll', 'charts', 'judges'];

let finals;
try {
  finals = JSON.parse(readFileSync('data/finals.json', 'utf8'));
} catch (e) {
  console.error('  FAIL data/finals.json - ' + e.message);
  process.exit(1);
}

out('Per-signal capture (data/finals.json):');

const battles = finals.battles || [];
if (!battles.length) { ok('no battles yet - nothing to capture'); process.exit(0); }

for (const b of battles) {
  const label = b.track || '(untracked battle)';
  const settled = SETTLED.has(String(b.status || '').toLowerCase());

  if (!b.signals) {
    // An unsettled battle with no scaffold is fine; a settled one is the Season 1 failure.
    if (settled) fail(`${label}: settled with NO signals block at all. Add one before it closes.`);
    else warn(`${label}: no signals block yet - add one before the battle runs, not after.`);
    continue;
  }

  // The explicit, reasoned exemption. Loud on purpose: it prints every single run so the
  // hole in the record stays visible instead of decaying into "the check passes".
  if (b.signalsUnrecoverable) {
    if (!b.signalsUnrecoverableReason) {
      fail(`${label}: signalsUnrecoverable is set with no reason. An exemption without a reason is just a silence.`);
    } else {
      warn(`${label}: signals UNRECOVERABLE, exempted - ${b.signalsUnrecoverableReason}`);
    }
    continue;
  }

  if (!settled) { ok(`${label}: not settled yet, capture still open`); continue; }

  // Settled and not exempt: every signal must be either captured or explicitly not-run.
  for (const name of SIGNALS) {
    const s = b.signals[name];
    if (!s) { fail(`${label}/${name}: missing from the signals block`); continue; }

    if (s.ran === false) {
      if (!s.reason) fail(`${label}/${name}: ran:false with no reason. Say WHY it did not run.`);
      else ok(`${label}/${name}: did not run - ${s.reason}`);
      continue;
    }

    // `null` means NOT CAPTURED. It never means zero. That distinction is the whole point:
    // reporting an absent measurement as a value is how a gap turns into a false number.
    const missing = [];
    if (s.winner == null) missing.push('winner');
    if (s.capturedAt == null) missing.push('capturedAt');
    if (s.source == null) missing.push('source');

    const numbers = name === 'poll' ? s.counts : name === 'charts' ? s.figures : s.votes;
    if (numbers == null) missing.push(name === 'poll' ? 'counts' : name === 'charts' ? 'figures' : 'votes');

    if (missing.length) {
      fail(`${label}/${name}: settled but UNCAPTURED - missing ${missing.join(', ')}. ` +
           'These stop being recoverable the moment the room closes.');
    } else if (!String(s.source).trim()) {
      fail(`${label}/${name}: source is blank. A number with no provenance cannot be checked later.`);
    } else {
      ok(`${label}/${name}: captured (${s.winner}) - ${s.source}`);
    }
  }
}

if (!QUIET) console.log('');
if (failures) {
  console.error(`check-signals: ${failures} failure(s). A battle must not settle with its numbers missing.`);
  process.exit(1);
}
if (!QUIET) console.log('check-signals: every settled battle is captured or explicitly exempted.');

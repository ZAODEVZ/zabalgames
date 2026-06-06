#!/usr/bin/env node
// fix-transcript.mjs - apply the canonical ZABAL Gamez brand-term corrections to a
// caption/transcript file (.srt / .vtt / .txt / .md - it is plain-text find/replace,
// format-agnostic). Part of the recordings workflow (docs/recordings-workflow.md).
//
//   node scripts/fix-transcript.mjs <file>            # dry run: report only
//   node scripts/fix-transcript.mjs <file> --write    # apply 'safe' fixes in place
//
// 'safe' rules (data/transcript-corrections.json) are auto-applied: whole-word,
// case-insensitive, the longer correct spellings left intact by word boundaries.
// 'review' rules are NEVER auto-applied - they are context-dependent (e.g. Zaal the
// person vs ZAO the org), so the script only FLAGS them with line numbers for a human.
// Zero dependencies.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const GLOSSARY = path.join(HERE, '..', 'data', 'transcript-corrections.json');

const args = process.argv.slice(2);
const write = args.includes('--write');
const file = args.find((a) => !a.startsWith('--'));

if (!file) {
  console.error('usage: node scripts/fix-transcript.mjs <file> [--write]');
  process.exit(2);
}
if (!fs.existsSync(file)) {
  console.error(`file not found: ${file}`);
  process.exit(2);
}

const { safe = [], review = [] } = JSON.parse(fs.readFileSync(GLOSSARY, 'utf8'));

// Build a whole-word, case-insensitive matcher. Internal spaces match any run of
// whitespace so multi-word phrases survive line wraps. Special chars are escaped.
function matcher(from) {
  const esc = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`\\b${esc}\\b`, 'gi');
}

let text = fs.readFileSync(file, 'utf8');

// --- safe: auto-apply, count per rule ---
const applied = [];
for (const rule of safe) {
  const re = matcher(rule.from);
  let n = 0;
  text = text.replace(re, () => { n += 1; return rule.to; });
  if (n) applied.push({ ...rule, n });
}

// --- review: flag only, with line context ---
const lines = text.split('\n');
const flags = [];
for (const rule of review) {
  const test = new RegExp(matcher(rule.from).source, 'i'); // non-global: safe for .test in a loop
  lines.forEach((ln, i) => {
    if (test.test(ln)) flags.push({ rule, line: i + 1, text: ln.trim() });
  });
}

// --- report ---
console.log(`\nfix-transcript: ${file}\n`);
if (applied.length) {
  console.log('Auto-applied (safe):');
  for (const a of applied) console.log(`  ${String(a.n).padStart(3)}x  ${a.from} -> ${a.to}`);
} else {
  console.log('Auto-applied (safe): none matched.');
}

if (flags.length) {
  console.log('\nNeeds review (context-dependent - NOT changed):');
  for (const f of flags) {
    console.log(`  L${f.line}  "${f.rule.from}" -> ${f.rule.to}  (${f.rule.note})`);
    console.log(`        ${f.text}`);
  }
} else {
  console.log('\nNeeds review: none found.');
}

const total = applied.reduce((s, a) => s + a.n, 0);
if (write) {
  if (total) {
    fs.writeFileSync(file, text);
    console.log(`\nWrote ${total} safe fixes to ${file}. Now resolve the review flags above by hand.`);
  } else {
    console.log('\nNothing to write (no safe matches).');
  }
} else {
  console.log(`\nDry run - ${total} safe fixes would be applied. Re-run with --write to apply.`);
}

#!/usr/bin/env node
// Render check for the battle rows on /august, without a browser.
//
// Extracts august.html's own renderBattles (plus esc + fmtDate) from the inline
// script and runs it against data/finals.json under a stub document, then
// against four fixed cases: two Space URLs, one, none, and a quote-injection
// attempt in a URL. Exit non-zero on any failed expectation. Use this when the
// headless browser is unavailable rather than reading the code by eye.
//
//   node scripts/check-finals-render.mjs
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(join(root, 'august.html'), 'utf8');
const finals = JSON.parse(readFileSync(join(root, 'data', 'finals.json'), 'utf8'));

const start = html.indexOf('function esc(');
const end = html.indexOf("fetch('/api/submissions");
if (start < 0 || end < 0) { console.error('check-finals-render: could not locate the inline script span in august.html'); process.exit(2); }
const src = html.slice(start, end);

let el;
const document = { getElementById: () => el, querySelector: () => null };
const renderBattles = new Function('document', src + '\nreturn renderBattles;')(document);
function render(battles) { el = { innerHTML: '', setAttribute() {} }; renderBattles(battles); return el.innerHTML; }
const count = (s, needle) => s.split(needle).length - 1;

let failed = 0;
function expect(label, ok, detail) {
  console.log((ok ? '  ok   ' : '  FAIL ') + label + (ok || !detail ? '' : '\n         ' + detail));
  if (!ok) failed++;
}

// 1. The real file.
const builder = finals.battles.find(b => b.track === 'builder');
const real = render(finals.battles);
const bslots = (builder.spaces || []).length;
const burls = (builder.spaces || []).filter(s => s.url).length;
const allSlots = finals.battles.flatMap(b => b.spaces || []).length;
console.log('data/finals.json builder row:');
expect(`${bslots} Space slots render`, count(real, 'class="slot') === allSlots && bslots === allSlots);
expect(`${burls} "Set a reminder" links for the builder slots`, count(real, ' - Set a reminder -&gt;') === burls);
expect(`${bslots - burls} slots read "link when it is created"`, count(real, 'link when it is created') === bslots - burls);
expect(builder.poll ? 'Vote button renders' : 'no Vote button while poll is null', count(real, 'Vote in the poll') === finals.battles.filter(b => b.poll).length);
const judgeLines = finals.battles.filter(b => b.judges && b.judges.length).length;
expect(`${judgeLines} judges line(s) site-wide (builder judges ${builder.judges === null ? 'null -> no line' : 'set'})`, count(real, 'class="bt-judges"') === judgeLines);
const tba = finals.battles.flatMap(b => b.judges || []).filter(j => j === null).length;
expect(`${tba} TBA seat(s)`, count(real, '>TBA<') === tba);
expect('no empty href', !/href=""/.test(real));

// 2. Fixed cases on a copy of the builder row.
const base = JSON.parse(JSON.stringify(builder));
function withUrls(a, b) { const r = JSON.parse(JSON.stringify(base)); r.spaces[0].url = a; r.spaces[1].url = b; return r; }
console.log('fixed cases:');
let out = render([withUrls('https://x.com/i/spaces/AAA', 'https://x.com/i/spaces/BBB')]);
expect('two URLs -> two reminder links, zero pending', count(out, 'Set a reminder') === 2 && count(out, 'link when it is created') === 0);
out = render([withUrls('https://x.com/i/spaces/AAA', null)]);
expect('one URL -> one reminder link, one pending slot with its time', count(out, 'Set a reminder') === 1 && count(out, 'link when it is created') === 1 && out.includes('11:00 AM EDT to 12:00 PM EDT'));
out = render([withUrls(null, null)]);
expect('both null -> zero links, both times shown', count(out, 'Set a reminder') === 0 && count(out, 'link when it is created') === 2 && out.includes('12:00 PM EDT to 1:00 PM EDT'));
out = render([withUrls('https://x.com/i/spaces/AAA" onmouseover="alert(1)', null)]);
expect('quote in a URL comes back escaped', out.includes('&quot; onmouseover=&quot;alert(1)') && !out.includes('" onmouseover="'));
const withPoll = JSON.parse(JSON.stringify(base)); withPoll.poll = 'https://x.com/wavewarz/status/123';
out = render([withPoll]);
expect('poll URL -> one Vote button', count(out, 'Vote in the poll') === 1 && out.includes('href="https://x.com/wavewarz/status/123"'));
const withJudges = JSON.parse(JSON.stringify(base)); withJudges.judges = ['A Judge', null, null];
out = render([withJudges]);
expect('judges [name, null, null] -> "Judges: A Judge, TBA, TBA"', out.includes('Judges: A Judge, <span class="tba">TBA</span>, <span class="tba">TBA</span>'));

console.log(failed ? `\ncheck-finals-render: ${failed} FAILED` : '\ncheck-finals-render: all checks passed.');
process.exit(failed ? 1 : 0);

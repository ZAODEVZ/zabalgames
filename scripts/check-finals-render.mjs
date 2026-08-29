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
expect('both null -> zero links, both times shown', count(out, 'Set a reminder') === 0 && count(out, 'link when it is created') === 2 && out.includes("11:00 AM EDT to 12:00 PM EDT"));
out = render([withUrls('https://x.com/i/spaces/AAA" onmouseover="alert(1)', null)]);
expect('quote in a URL comes back escaped', out.includes('&quot; onmouseover=&quot;alert(1)') && !out.includes('" onmouseover="'));
const withPoll = JSON.parse(JSON.stringify(base)); withPoll.poll = 'https://x.com/wavewarz/status/123';
out = render([withPoll]);
expect('poll URL -> one Vote button', count(out, 'Vote in the poll') === 1 && out.includes('href="https://x.com/wavewarz/status/123"'));
const withJudges = JSON.parse(JSON.stringify(base)); withJudges.judges = ['A Judge', null, null];
out = render([withJudges]);
expect('judges [name, null, null] -> "Judges: A Judge, TBA, TBA"', out.includes('Judges: A Judge, <span class="tba">TBA</span>, <span class="tba">TBA</span>'));

// 3. /live - the battle card. Same extraction trick on live.html: its battleHtml,
//    with the page's own helpers, under a stub location.
const live = readFileSync(join(root, 'live.html'), 'utf8');
const lstart = live.indexOf('  var NEXT_BATTLE = null;');
const lend = live.indexOf('  function renderEmpty() {');
// live.html's esc is multi-line, so a byte-identical copy is used rather than a sliced one.
const lesc = "function esc(s) { return String(s == null ? '' : s).replace(/[&<>\"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;' }[c]; }); }\n";
if (lstart < 0 || lend < 0) { console.error('check-finals-render: could not locate the battle card span in live.html'); process.exit(2); }
const lsrc = lesc + live.slice(lstart, lend);
const liveEnv = new Function('document', 'location', 'setPill', 'bindShare', 'startCountdown', 'fetch', 'window',
  'var scheduleState = "empty", NEXT_LEAD_TS = null;\n' + lsrc + '\nreturn { battleHtml: battleHtml, battleRunning: battleRunning };')(
  { getElementById: () => null, querySelector: () => null }, { href: 'https://zabalgamez.com/live', pathname: '/live' },
  () => {}, () => {}, () => {}, () => Promise.reject(new Error('no network in the checker')), {});
const HOUR = 3600000;
function row(overrides) {
  const r = JSON.parse(JSON.stringify(builder));
  r._ts = Date.now() + 2 * HOUR; r._endTs = r._ts + 24 * HOUR;
  return Object.assign(r, overrides || {});
}
console.log('/live battle card:');
let l = liveEnv.battleHtml(row());
expect('before the clock: "Next up", countdown to the start', l.includes('>Next up<') && l.includes('Clock starts in'));
expect(`both Space slots on the card, ${burls} linked`, count(l, 'class="slot') === bslots && count(l, 'Set a reminder -&gt;') === burls);
expect('judges line with TBA seats', count(l, '>TBA<') === (builder.judges || []).filter(j => j === null).length);
expect('poll null -> no poll card, no Vote button', !l.includes('battle-poll') && !l.includes('Vote in the poll'));
expect('watch points off-page (this IS /live) -> Twitch button', l.includes('Watch on Twitch') && !l.includes('>Watch here<'));
expect('Trade the battle link', l.includes('Trade the battle'));
l = liveEnv.battleHtml(row({ _ts: Date.now() - HOUR, _endTs: Date.now() + 23 * HOUR }));
expect('during the clock: "Battle on", countdown to the end', l.includes('>Battle on<') && l.includes('Clock runs out in') && l.includes('stage-card battle'));
l = liveEnv.battleHtml(row({ poll: 'https://x.com/wavewarz/status/123' }));
expect('poll URL -> poll card with the X link and a Vote button', count(l, 'href="https://x.com/wavewarz/status/123"') === 1 && l.includes('href="#battle-poll"'));
l = liveEnv.battleHtml(row({ poll: 'https://x.com/wavewarz/status/1" onmouseover="alert(1)' }));
expect('quote in the poll URL comes back escaped', !l.includes('" onmouseover="'));

console.log(failed ? `\ncheck-finals-render: ${failed} FAILED` : '\ncheck-finals-render: all checks passed.');
process.exit(failed ? 1 : 0);

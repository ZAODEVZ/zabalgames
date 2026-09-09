#!/usr/bin/env node
// check-embeds.mjs - the in-feed embed must survive an HTML parser, not just look right.
//
// WHY THIS EXISTS. `daily.html` carried this, and it was live:
//
//   <meta name="fc:miniapp" content='{..."button":{"title":"Today's quests",...}}'>
//
// The apostrophe in "Today's" CLOSES the single-quoted attribute. A browser reads the content as
//
//   {"version":"1","imageUrl":"...","button":{"title":"Today
//
// and everything after it becomes stray attributes. Verified in a real browser against
// production: `JSON.parse` of that meta threw "Unterminated string in JSON at position 103",
// while /play parsed fine. So sharing /daily into a Farcaster feed produced a broken embed -
// silently, because nothing on the page looks wrong and the file reads perfectly in an editor.
//
// This is its own failure class and none of the existing checks could see it. validate.mjs
// compiles inline <script> blocks and pins the Mini App manifest; neither one asks whether an
// ATTRIBUTE survives being parsed as HTML. The JSON here is valid JSON - it just never reaches
// a JSON parser intact.
//
// So the check deliberately EMULATES THE PARSER rather than reading the file's intent: it takes
// the attribute's characters up to the first raw closing quote, exactly as a browser does, then
// unescapes entities and parses. A checker that read the author's intention would have passed
// this file, which is the entire point.
//
// The fix is always an entity, never deleting the apostrophe: &#39; inside a single-quoted
// attribute keeps the copy the writer wanted.
//
//   node scripts/check-embeds.mjs

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = execSync('git ls-files "*.html"', { encoding: 'utf8' }).split('\n').filter(Boolean);

// Minimal entity unescape - these are the ones that legitimately appear in this repo's embeds.
const unescape = (s) => s
  .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&quot;/g, '"')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

const findings = [];
let checked = 0;

for (const f of files) {
  const t = readFileSync(f, 'utf8');
  // Match the meta tag the way a parser would: name first, then the quoted attribute, stopping
  // at the first matching quote character. Both quote styles, because either can be broken by
  // the wrong apostrophe or double-quote inside it.
  const re = /<meta\s+name=["'](fc:miniapp|fc:frame)["']\s+content=(['"])([\s\S]*?)\2/g;
  let m;
  while ((m = re.exec(t)) !== null) {
    checked++;
    const [, name, , raw] = m;
    const line = t.slice(0, m.index).split('\n').length;
    let parsed;
    try {
      parsed = JSON.parse(unescape(raw));
    } catch (e) {
      findings.push({ f, line, name, why: e.message.slice(0, 70), tail: raw.slice(-46) });
      continue;
    }
    for (const k of ['version', 'imageUrl', 'button']) {
      if (!(k in parsed)) findings.push({ f, line, name, why: `missing "${k}"`, tail: '' });
    }
    const url = parsed.button?.action?.url;
    if (!url) findings.push({ f, line, name, why: 'button.action.url is missing', tail: '' });
  }
}

if (findings.length === 0) {
  console.log(`  ok   ${checked} in-feed embed(s) parse as a browser would read them`);
  process.exit(0);
}

console.error(`\ncheck-embeds: ${findings.length} of ${checked} embed(s) do not survive HTML parsing.\n`);
for (const x of findings) {
  console.error(`  ${x.f}:${x.line}  ${x.name}  ${x.why}`);
  if (x.tail) console.error(`      the attribute ends at: ...${x.tail}`);
}
console.error(`
An embed that does not parse produces a BROKEN CARD when the page is shared into a feed, and
nothing on the page looks wrong - this is only visible to a parser.

Usual cause: an apostrophe inside a single-quoted content='...' attribute, which closes it
early. Fix it with the entity, never by deleting the apostrophe: "Today&#39;s quests" keeps the
copy and parses.
`);
process.exit(1);

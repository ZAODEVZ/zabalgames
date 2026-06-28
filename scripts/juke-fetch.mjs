// juke-fetch.mjs - download a Juke recording's source OGG by its share URL.
//
// Juke (juke.audio) is where our Farcaster Spaces get captured. Each recording page exposes
// a short-lived (~15 min) signed link to the native OGG. This pulls that link out of the page
// and downloads the audio, so the rest of the recap pipeline (juke-space-recap -> recap video,
// or a transcript pass) has a local source file. See docs/space-recap-workflow.md.
//
//   node scripts/juke-fetch.mjs <juke-url-or-id> [outfile]
//
//   <juke-url-or-id>  https://juke.audio/r/<uuid>  or just the <uuid>
//   [outfile]         where to write the .ogg (default: ./juke-<id>.ogg)
//
// No deps; Node 18+ (global fetch). The signed URL expires fast - run this right before use.

import fs from 'node:fs';

const arg = process.argv[2];
const outArg = process.argv[3];
if (!arg) {
  console.error('usage: node scripts/juke-fetch.mjs <juke-url-or-id> [outfile]');
  process.exit(2);
}

const id = arg.includes('juke.audio') ? (arg.match(/\/r\/([a-f0-9-]{8,})/i) || [])[1] : arg.trim();
if (!id) { console.error(`could not parse a Juke recording id from: ${arg}`); process.exit(2); }
const pageUrl = `https://juke.audio/r/${id}`;
const outFile = outArg || `juke-${id}.ogg`;

const main = async () => {
  process.stdout.write(`fetching ${pageUrl} ...\n`);
  const page = await fetch(pageUrl, { headers: { 'user-agent': 'zabalgamez-juke-fetch' } });
  if (!page.ok) { console.error(`Juke page returned ${page.status}`); process.exit(1); }
  const html = await page.text();

  // The signed native-audio URL is embedded in the page markup, HTML-escaped.
  const match = html.match(/https?:\/\/[^"'\\]+\.ogg[^"'\\]*/i);
  if (!match) { console.error('no .ogg link found in the Juke page (layout may have changed)'); process.exit(1); }
  const audioUrl = match[0].replace(/&amp;/g, '&');

  // Surface the title if present, just for the operator.
  const title = (html.match(/<title>([^<]+)<\/title>/i) || [])[1];
  if (title) process.stdout.write(`title: ${title.trim()}\n`);
  process.stdout.write('downloading audio (signed link, expires ~15 min) ...\n');

  const audio = await fetch(audioUrl);
  if (!audio.ok) { console.error(`audio download returned ${audio.status} (link may have expired - re-run)`); process.exit(1); }
  const buf = Buffer.from(await audio.arrayBuffer());
  fs.writeFileSync(outFile, buf);
  process.stdout.write(`wrote ${outFile} (${(buf.length / 1048576).toFixed(1)} MB)\n`);
  process.stdout.write('\nnext: drop it into the recap tool and run the pipeline -\n');
  process.stdout.write(`  cp ${outFile} <juke-space-recap>/public/audio.ogg\n`);
  process.stdout.write('  cd <juke-space-recap> && npm run transcribe && npm run intros\n');
  process.stdout.write('see docs/space-recap-workflow.md for the full flow.\n');
};

main().catch((e) => { console.error(e.message || e); process.exit(1); });

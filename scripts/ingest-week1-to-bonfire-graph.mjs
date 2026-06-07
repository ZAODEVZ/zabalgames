// Ingest the verified ZABAL Gamez Week 1 (Jun 1-7, 2026) record into the Bonfire graph.
//
// Why: the live ZABAL Bonfire was missing Week 1 and confabulated a recap (invented people
// and projects, misattributed sessions). Our data/bonfire-graph.json was itself missing the
// Carlos fireside, the Farcaster Batches builders (DEKEY, Founder Check, betrmint, etc.), and
// the session nodes. This script adds the ground-truth nodes + edges so a push reflects what
// actually happened, sourced from data/recaps.json and the Farcaster Batches transcripts.
//
// Idempotent: entities upsert by id (existing ids are left untouched), edges dedupe by
// from+to+type. Re-run safely.
//
//   node scripts/ingest-week1-to-bonfire-graph.mjs
// then push:
//   BONFIRE_API_KEY=... node scripts/push-to-bonfire.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = join(ROOT, 'data/bonfire-graph.json');
const graph = JSON.parse(readFileSync(P, 'utf8'));

const E = (id, name, labels, attributes = {}) => ({ id, name, labels, attributes });
const R = (from, to, type, fact) => ({ from, to, type, properties: { fact } });

// --- Verified Week 1 entities (people, orgs, projects, sessions) ---
const entities = [
  // Orgs
  E('gm-farcaster', 'GM Farcaster', ['Organization', 'Show'], { description: "Farcaster's longest-running news show; ran and publicly hosts Farcaster Batches.", url: 'https://www.gmfarcaster.com' }),
  // People - ZABAL Gamez Day 1 + fireside
  E('yerbearserker', 'yerbearserker (Jordan Oram)', ['Person', 'Builder'], { farcaster_handle: '@yerbearserker', role: 'co-founder, Empire Builder', description: 'Led Empire Builder V3 + the live tokenless Empire build on Day 1.' }),
  E('plat0x', 'Carlos (Plat0x)', ['Person', 'Builder'], { x_handle: '@at0x_eth', role: 'developer, Bonfires', description: 'Co-led the Bonfire workshop and the Day 6 vibe-coding fireside.' }),
  E('joshua-eth', 'Joshua.eth', ['Person', 'Builder'], { farcaster_handle: '@joshua.eth', role: 'Bonfire', description: 'Co-led the Bonfire + ZABAL Bonfire bot workshop on Day 1.' }),
  E('diviflyy', 'Adrian (diviflyy)', ['Person', 'Builder'], { farcaster_handle: '@diviflyy', role: 'co-founder, Empire Builder', description: 'Empire Builder co-founder; co-hosted Farcaster Batches.' }),
  // People - Farcaster Batches builders
  E('chris-dolinsky', 'Chris Dolinsky', ['Person', 'Builder'], { project: 'Vinny App', description: 'Presented Vinny App on Batches Day 1.' }),
  E('kenny', 'Kenny', ['Person', 'Builder'], { project: 'POIDH', description: 'Presented POIDH on Batches Day 1; subject of the Day 2 Founder Check workshop.' }),
  E('nikki-sapp', 'Nikki Sapp', ['Person', 'Builder'], { x_handle: '@nicky_sap', project: 'Juke', description: 'Presented Juke on Batches Day 1.' }),
  E('jonathan-colton', 'Jonathan Colton', ['Person', 'Builder'], { farcaster_handle: '@jonathancolton', project: 'Founder Check / Fotocaster', description: 'Presented Founder Check + Fotocaster (Day 1); ran the Day 2 workshop.' }),
  E('dr-deeks', 'Dr. Deeks', ['Person', 'Builder'], { description: 'Presented a slate of mini apps on Batches Day 1 (email remittance pro, Crafters, Ghostwriter).' }),
  E('az-flynn', 'AZ Flynn', ['Person', 'Builder'], { farcaster_handle: '@AzFlin', project: 'Defense of the Agents', description: 'Presented Defense of the Agents on Batches Day 3.' }),
  E('cashless-man', 'Cashless Man', ['Person', 'Builder'], { project: 'Booster', description: 'Presented Booster on Batches Day 3; ran a Day 4 self-hosting workshop.' }),
  E('duckfax', 'Duckfax', ['Person', 'Builder'], { project: 'Celebration Hub', description: 'Presented Celebration Hub on Batches Day 3.' }),
  E('node-builder', 'Node', ['Person', 'Builder'], { farcaster_handle: '@noad', project: 'DEKEY', description: 'Presented DEKEY on Batches Day 5.' }),
  E('max-power', 'Max (baseddesigner.eth)', ['Person', 'Builder'], { farcaster_handle: '@baseddesigner.eth', project: 'POWER', description: 'Presented POWER on Batches Day 5.' }),
  E('toady-hawk', 'Toady Hawk', ['Person', 'Builder'], { x_handle: '@toady_hawk', project: 'betrmint', description: 'Presented betrmint on Batches Day 5.' }),
  E('darko', 'Darko', ['Person', 'Builder'], { project: 'Runner', description: 'Presented Runner on Batches Day 5.' }),
  E('jubjub', 'JubJub', ['Person', 'Organizer'], { description: 'Organized GM Farcaster Farcaster Batches.' }),
  E('adriene-gmf', 'Adriene', ['Person', 'Host'], { role: 'GM Farcaster', description: 'Co-hosted Farcaster Batches.' }),
  E('nounish-prof', 'Nounish Prof', ['Person', 'Host'], { role: 'GM Farcaster', description: 'Co-hosted Farcaster Batches.' }),
  // Projects (the ones not already in the graph)
  E('vinny-app', 'Vinny App', ['Project'], { description: 'Natural-language app builder; prompt a working app into existence in minutes. Ran the Vinny-a-thon.' }),
  E('founder-check', 'Founder Check', ['Project'], { description: 'Agent-driven go-to-market validation mini app. Four pillars: who, what, reach, ease of sale.' }),
  E('fotocaster', 'Fotocaster', ['Project'], { description: 'Photo mint built for maximum artist sovereignty - artists keep ~100% of proceeds.' }),
  E('defense-of-the-agents', 'Defense of the Agents', ['Project'], { url: 'https://defenseoftheagents.com', description: 'A casual idle MOBA Farcaster mini app by AZ Flynn.' }),
  E('booster', 'Booster', ['Project'], { description: 'Permissionless marketplace to boost a cast or earn by boosting others.' }),
  E('celebration-hub', 'Celebration Hub', ['Project'], { description: 'A social app for events, gifts, and celebrations, with the Joysender agent.' }),
  E('dekey', 'DEKEY', ['Project'], { description: 'Peer-to-peer encrypted file marketplace with zero-knowledge key proofs and enforced royalties.' }),
  E('power', 'POWER', ['Project'], { url: 'https://powerpawr.link', description: 'Link-in-bio page builder with embeddable widgets and a referral program.' }),
  E('betrmint', 'betrmint', ['Project'], { url: 'https://betrmint.fun', description: 'A rewards-and-distribution app for creators (token BTR). NOT "Betterment" - that is an unrelated finance company.' }),
  E('runner', 'Runner', ['Project'], { description: 'A meme (first Clanker) becoming a Strava-connected running app.' }),
  // Sessions / events
  E('s-empire-v3', 'Empire Builder V3 (workshop)', ['Event', 'Session'], { date: '2026-06-01', track: 'builder', url: 'https://zabalgamez.com/recordings/1', description: 'yerbearserker on Empire Builder V3; do not launch a token until ready; the Triple-A framework.' }),
  E('s-empire-part2', 'Empire Builder Part 2 - tokenless Empire live', ['Event', 'Session'], { date: '2026-06-01', track: 'builder', url: 'https://zabalgamez.com/recordings/2', description: 'yerbearserker stands up a tokenless ZABAL Gamez Empire live; leaderboard math, a live raffle, a $Zabal booster.' }),
  E('s-bonfire', 'Bonfire and the ZABAL Bonfire bot (workshop)', ['Event', 'Session'], { date: '2026-06-01', track: 'builder', url: 'https://zabalgamez.com/recordings/3', description: 'Joshua.eth + Plat0x on Bonfire as the ecosystem shared memory; curation as the scarce asset.' }),
  E('s-fireside-carlos', 'Fireside: Bonfires + a vibe-coding masterclass', ['Event', 'Session'], { date: '2026-06-06', track: 'builder', url: 'https://zabalgamez.com/recordings/fireside/1', description: 'Zaal + Carlos (Plat0x): plan-then-goal, diagram Bob and Alice, types-first, documentation-as-code.' }),
  E('batches-day1', 'Farcaster Batches Day 1 (Jun 1)', ['Event', 'Session'], { date: '2026-06-01', url: 'https://www.gmfarcaster.com/episodes/Batches1', description: 'Builder showcase: Vinny App, POIDH, Juke, Founder Check, Fotocaster, Dr. Deeks.' }),
  E('batches-day2', 'Farcaster Batches Day 2 - Founder Check workshop (Jun 2)', ['Event', 'Session'], { date: '2026-06-02', url: 'https://www.gmfarcaster.com/episodes/Batches2', description: 'Live Founder Check workshop: Jonathan Colton walks Kenny through it.' }),
  E('batches-day3', 'Farcaster Batches Day 3 (Jun 3)', ['Event', 'Session'], { date: '2026-06-03', url: 'https://www.gmfarcaster.com/episodes/Batches3', description: 'Builder showcase: ZABAL Gamez, Empire Builder, Defense of the Agents, Booster, Celebration Hub.' }),
  E('batches-day5', 'Farcaster Batches Day 5 (Jun 5)', ['Event', 'Session'], { date: '2026-06-05', url: 'https://www.gmfarcaster.com/episodes/Batches5', description: 'Builder showcase: DEKEY, POWER, betrmint, Runner.' }),
];

// --- Verified edges ---
const edges = [
  // Day 1 ZABAL sessions
  R('yerbearserker', 's-empire-v3', 'led', 'yerbearserker led Empire Builder V3'),
  R('yerbearserker', 's-empire-part2', 'led', 'yerbearserker led the live tokenless Empire build'),
  R('joshua-eth', 's-bonfire', 'led', 'Joshua.eth co-led the Bonfire workshop'),
  R('plat0x', 's-bonfire', 'led', 'Plat0x co-led the Bonfire workshop'),
  R('plat0x', 's-fireside-carlos', 'led', 'Carlos (Plat0x) led the vibe-coding fireside'),
  R('s-empire-v3', 'zabal-gamez', 'part_of', 'Empire Builder V3 was a ZABAL Gamez workshop'),
  R('s-empire-part2', 'zabal-gamez', 'part_of', 'Part 2 was a ZABAL Gamez workshop'),
  R('s-bonfire', 'zabal-gamez', 'part_of', 'The Bonfire workshop was a ZABAL Gamez session'),
  R('s-fireside-carlos', 'zabal-gamez', 'part_of', 'The fireside was a ZABAL Gamez session'),
  R('yerbearserker', 'empire-builder', 'co_founded', 'yerbearserker co-founded Empire Builder'),
  R('diviflyy', 'empire-builder', 'co_founded', 'Adrian (diviflyy) co-founded Empire Builder'),
  R('joshua-eth', 'bonfire', 'builds', 'Joshua.eth builds Bonfire'),
  R('plat0x', 'bonfire', 'builds', 'Carlos (Plat0x) develops Bonfires'),
  // Farcaster Batches structure
  R('jubjub', 'farcaster-batches', 'organized', 'JubJub organized Farcaster Batches'),
  R('gm-farcaster', 'farcaster-batches', 'hosts', 'GM Farcaster ran and hosts Farcaster Batches'),
  R('adriene-gmf', 'farcaster-batches', 'hosted', 'Adriene co-hosted Farcaster Batches'),
  R('nounish-prof', 'farcaster-batches', 'hosted', 'Nounish Prof co-hosted Farcaster Batches'),
  R('diviflyy', 'farcaster-batches', 'co_hosted', 'Adrian (diviflyy) co-hosted Farcaster Batches'),
  R('batches-day1', 'farcaster-batches', 'part_of', 'Day 1 is part of Farcaster Batches'),
  R('batches-day2', 'farcaster-batches', 'part_of', 'Day 2 is part of Farcaster Batches'),
  R('batches-day3', 'farcaster-batches', 'part_of', 'Day 3 is part of Farcaster Batches'),
  R('batches-day5', 'farcaster-batches', 'part_of', 'Day 5 is part of Farcaster Batches'),
  // Day 1 builders
  R('chris-dolinsky', 'batches-day1', 'presented_at', 'Chris Dolinsky presented Vinny App'),
  R('kenny', 'batches-day1', 'presented_at', 'Kenny presented POIDH'),
  R('nikki-sapp', 'batches-day1', 'presented_at', 'Nikki Sapp presented Juke'),
  R('jonathan-colton', 'batches-day1', 'presented_at', 'Jonathan Colton presented Founder Check + Fotocaster'),
  R('dr-deeks', 'batches-day1', 'presented_at', 'Dr. Deeks presented a slate of mini apps'),
  R('chris-dolinsky', 'vinny-app', 'builds', 'Chris Dolinsky builds Vinny App'),
  R('kenny', 'poidh', 'builds', 'Kenny builds POIDH'),
  R('nikki-sapp', 'juke', 'builds', 'Nikki Sapp builds Juke'),
  R('jonathan-colton', 'founder-check', 'builds', 'Jonathan Colton builds Founder Check'),
  R('jonathan-colton', 'fotocaster', 'builds', 'Jonathan Colton co-built Fotocaster'),
  // Day 2
  R('jonathan-colton', 'batches-day2', 'led', 'Jonathan Colton ran the Founder Check workshop'),
  R('kenny', 'batches-day2', 'presented_at', 'Kenny was the live subject of the workshop'),
  // Day 3
  R('zaal', 'batches-day3', 'presented_at', 'Zaal presented ZABAL Gamez'),
  R('yerbearserker', 'batches-day3', 'presented_at', 'yerbearserker presented Empire Builder'),
  R('az-flynn', 'batches-day3', 'presented_at', 'AZ Flynn presented Defense of the Agents'),
  R('cashless-man', 'batches-day3', 'presented_at', 'Cashless Man presented Booster'),
  R('duckfax', 'batches-day3', 'presented_at', 'Duckfax presented Celebration Hub'),
  R('az-flynn', 'defense-of-the-agents', 'builds', 'AZ Flynn builds Defense of the Agents'),
  R('cashless-man', 'booster', 'builds', 'Cashless Man builds Booster'),
  R('duckfax', 'celebration-hub', 'builds', 'Duckfax builds Celebration Hub'),
  // Day 5
  R('node-builder', 'batches-day5', 'presented_at', 'Node presented DEKEY'),
  R('max-power', 'batches-day5', 'presented_at', 'Max presented POWER'),
  R('toady-hawk', 'batches-day5', 'presented_at', 'Toady Hawk presented betrmint'),
  R('darko', 'batches-day5', 'presented_at', 'Darko presented Runner'),
  R('node-builder', 'dekey', 'builds', 'Node builds DEKEY'),
  R('max-power', 'power', 'builds', 'Max builds POWER'),
  R('toady-hawk', 'betrmint', 'builds', 'Toady Hawk builds betrmint'),
  R('darko', 'runner', 'builds', 'Darko builds Runner'),
];

// --- Merge (idempotent) ---
const ids = new Set(graph.entities.map((e) => e.id));
let addedE = 0;
for (const e of entities) {
  if (!ids.has(e.id)) { graph.entities.push(e); ids.add(e.id); addedE++; }
}
const edgeKey = (x) => `${x.from}|${x.to}|${x.type}`;
const have = new Set(graph.edges.map(edgeKey));
let addedR = 0;
for (const r of edges) {
  if (!have.has(edgeKey(r))) { graph.edges.push(r); have.add(edgeKey(r)); addedR++; }
}

writeFileSync(P, JSON.stringify(graph, null, 2) + '\n');
console.log(`[week1-ingest] +${addedE} entities, +${addedR} edges -> ${graph.entities.length} entities, ${graph.edges.length} edges`);

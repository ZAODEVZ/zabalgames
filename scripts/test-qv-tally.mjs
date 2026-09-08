#!/usr/bin/env node
// test-qv-tally.mjs - the published standings must be right even when the vote path races.
//
// WHY THIS EXISTS. docs/season-2-ideas.md item 2: "Fix the vote race condition - the
// read-modify-write in api/qv-vote.mjs (HGET then ZINCRBY, non-atomic) can over-count
// concurrent ballots. Do this before any high-stakes vote." Verified against the code before
// changing anything: the POST path does HGET the voter's previous ballot, computes deltas in
// JS, then ZINCRBY in a SEPARATE pipeline. Two concurrent requests from the SAME fid both read
// the same `prev`, both apply the same delta, and the qv:tally ZSET over-counts.
//
// The severity is not just "a wrong number". qv:ballots still shows ONE legitimate ballot, so
// the inflated tally is invisible in the audit trail - a voter could inflate their own
// contribution by double-submitting and nothing in the record would show it.
//
// The fix reads the standings from qv:ballots (authoritative; HSET on a hash field is atomic)
// instead of from the ZSET. This test proves BOTH halves:
//
//   1. the race is real - the ZSET genuinely over-counts under concurrent same-fid writes
//   2. the derived read is correct anyway
//
// Test 1 matters as much as test 2. Without it, test 2 could pass against a fix for a bug that
// never existed, and nobody would know.
//
//   node scripts/test-qv-tally.mjs
//
// Zero dependencies, no network: a tiny in-memory Upstash REST stand-in, same pattern as
// scripts/test-submission-pipeline.mjs.

import assert from 'node:assert/strict';
import http from 'node:http';

let failures = 0;
const fail = (m) => { console.error('  FAIL ' + m); failures++; };
const ok = (m) => console.log('  ok   ' + m);

// --- in-memory Upstash: only the commands qv-vote uses ---
const hashes = new Map();   // key -> Map(field -> string)
const zsets = new Map();    // key -> Map(member -> number)
const strings = new Map();

const hashFor = (k) => { if (!hashes.has(k)) hashes.set(k, new Map()); return hashes.get(k); };
const zsetFor = (k) => { if (!zsets.has(k)) zsets.set(k, new Map()); return zsets.get(k); };

function command(parts) {
  const [raw, key, ...args] = parts;
  const op = String(raw || '').toUpperCase();
  if (op === 'GET') return strings.get(key) ?? null;
  if (op === 'SET') { strings.set(key, String(args[0])); return 'OK'; }
  if (op === 'HGET') return hashFor(key).get(String(args[0])) ?? null;
  if (op === 'HSET') { hashFor(key).set(String(args[0]), String(args[1])); return 1; }
  if (op === 'HLEN') return hashFor(key).size;
  if (op === 'HGETALL') { const out = []; for (const [f, v] of hashFor(key)) out.push(f, v); return out; }
  if (op === 'ZINCRBY') { const z = zsetFor(key); const m = String(args[1]); z.set(m, (z.get(m) || 0) + Number(args[0])); return String(z.get(m)); }
  if (op === 'ZRANGE') {
    const z = [...zsetFor(key).entries()].sort((a, b) => b[1] - a[1]);
    const out = []; z.forEach(([m, sc]) => out.push(m, String(sc))); return out;
  }
  if (op === 'DEL') { hashes.delete(key); zsets.delete(key); strings.delete(key); return 1; }
  return null;
}

const server = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    let cmds = [];
    try { cmds = JSON.parse(body || '[]'); } catch { cmds = []; }
    const out = cmds.map((c) => ({ result: command(c) }));
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(JSON.stringify(out));
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const KV = `http://127.0.0.1:${port}`;

async function kv(cmds) {
  const r = await fetch(`${KV}/pipeline`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(cmds),
  });
  return r.json();
}

// --- reproduce the POST path's read-modify-write exactly as api/qv-vote.mjs does it ---
async function castVoteTheOldWay(track, fid, next) {
  const prevRes = await kv([['HGET', `qv:ballots:${track}`, String(fid)]]);
  let prev = {};
  const raw = prevRes[0] && prevRes[0].result;
  if (raw) { try { prev = JSON.parse(raw); } catch { prev = {}; } }
  // A real concurrent request interleaves HERE, between the read and the write.
  await new Promise((r) => setTimeout(r, 5));
  const keys = new Set(Object.keys(prev).concat(Object.keys(next)));
  const cmds = [];
  keys.forEach((id) => {
    const delta = (next[id] || 0) - (prev[id] || 0);
    if (delta !== 0) cmds.push(['ZINCRBY', `qv:tally:${track}`, String(delta), id]);
  });
  cmds.push(['HSET', `qv:ballots:${track}`, String(fid), JSON.stringify(next)]);
  await kv(cmds);
}

// The derived read, mirroring what api/qv-vote.mjs now does for ?results.
async function derivedStandings(track) {
  const r = await kv([['HGETALL', `qv:ballots:${track}`]]);
  const hash = (r[0] && r[0].result) || [];
  const totals = new Map();
  let voters = 0;
  for (let i = 0; i + 1 < hash.length; i += 2) {
    voters += 1;
    let ballot;
    try { ballot = JSON.parse(hash[i + 1]); } catch { continue; }
    if (!ballot || typeof ballot !== 'object') continue;
    for (const [id, v] of Object.entries(ballot)) {
      const n = Number(v);
      if (Number.isFinite(n) && n > 0) totals.set(id, (totals.get(id) || 0) + n);
    }
  }
  return { totals, voters };
}

async function zsetStandings(track) {
  const r = await kv([['ZRANGE', `qv:tally:${track}`, '0', '-1', 'REV', 'WITHSCORES']]);
  const flat = (r[0] && r[0].result) || [];
  const m = new Map();
  for (let i = 0; i + 1 < flat.length; i += 2) m.set(flat[i], Number(flat[i + 1]));
  return m;
}

try {
  // --- 1. THE RACE IS REAL. Same fid, three concurrent identical ballots. ---
  // If this does NOT over-count, the bug does not exist and test 2 below proves nothing.
  await Promise.all([
    castVoteTheOldWay('builder', 19640, { 'p1': 3 }),
    castVoteTheOldWay('builder', 19640, { 'p1': 3 }),
    castVoteTheOldWay('builder', 19640, { 'p1': 3 }),
  ]);
  const zs = await zsetStandings('builder');
  if (zs.get('p1') === 3) {
    fail('the ZSET did NOT over-count, so the race this test exists for did not reproduce. ' +
         'Either the stand-in is serialising the writes or the bug is gone - find out which ' +
         'before trusting the next assertion.');
  } else {
    ok(`the race reproduces: one voter, one ballot of 3, ZSET reads ${zs.get('p1')} (inflated)`);
  }

  // --- 2. THE DERIVED READ IS CORRECT ANYWAY. This is the actual fix. ---
  const { totals, voters } = await derivedStandings('builder');
  assert.equal(totals.get('p1'), 3);
  assert.equal(voters, 1);
  ok('derived from qv:ballots: p1 = 3, voters = 1 - correct despite the raced ZSET');

  // --- 3. multiple real voters still sum correctly ---
  await castVoteTheOldWay('artist', 111, { a: 2, b: 1 });
  await castVoteTheOldWay('artist', 222, { a: 3 });
  await castVoteTheOldWay('artist', 333, { b: 4 });
  const art = await derivedStandings('artist');
  assert.equal(art.totals.get('a'), 5);
  assert.equal(art.totals.get('b'), 5);
  assert.equal(art.voters, 3);
  ok('three voters across two candidates sum correctly (a=5, b=5, voters=3)');

  // --- 4. a voter CHANGING their ballot replaces, never accumulates ---
  await castVoteTheOldWay('artist', 111, { a: 1 });      // was {a:2,b:1}
  const art2 = await derivedStandings('artist');
  assert.equal(art2.totals.get('a'), 4, 'a should be 1+3');
  assert.equal(art2.totals.get('b') ?? 0, 4, 'b should be 4 - 111 withdrew their b vote');
  assert.equal(art2.voters, 3);
  ok('re-voting replaces a ballot rather than adding to it (a=4, b=4, voters still 3)');

  // --- 5. a corrupt ballot must not take the whole tally down ---
  await kv([['HSET', 'qv:ballots:creator', '999', 'not-json']]);
  await castVoteTheOldWay('creator', 888, { c: 2 });
  const cre = await derivedStandings('creator');
  assert.equal(cre.totals.get('c'), 2);
  ok('an unparseable ballot is skipped, the rest still tally (c=2)');

  // --- 6. zero and negative values are not counted ---
  await kv([['HSET', 'qv:ballots:creator', '777', JSON.stringify({ c: 0, d: -5 })]]);
  const cre2 = await derivedStandings('creator');
  assert.equal(cre2.totals.get('c'), 2, 'a 0 vote adds nothing');
  assert.equal(cre2.totals.has('d'), false, 'a negative vote is ignored, not subtracted');
  ok('zero and negative allocations are ignored rather than trusted');
} catch (e) {
  fail(e.message);
} finally {
  await new Promise((r) => server.close(r));
}

console.log('');
if (failures) { console.error(`test-qv-tally: ${failures} failure(s).`); process.exit(1); }
console.log('test-qv-tally: standings are correct under a raced vote path.');

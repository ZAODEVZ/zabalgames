// Integration test for the July judging rail. Runs the real edge handlers
// (api/register, api/builds, api/build-vote, api/finals-picks) against an in-memory
// Upstash KV mock wired through global fetch. Authed-POST happy paths need a live
// Quick Auth token (JWKS-backed), so those are covered as the unauthenticated-reject
// branch here, plus a direct KV-contract test of the one-vote-per-FID idempotency.

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };

// --- in-memory KV that speaks the Upstash /pipeline command subset we use ---
const hashes = new Map(); // name -> Map(field -> string)
const sets = new Map();   // name -> Set(member)
const H = (k) => hashes.get(k) || (hashes.set(k, new Map()), hashes.get(k));
const S = (k) => sets.get(k) || (sets.set(k, new Set()), sets.get(k));
function runCmd(cmd) {
  const [op, key, a, b] = cmd;
  switch (op) {
    case 'HSET': { const h = H(key); const isNew = !h.has(a); h.set(a, String(b)); return isNew ? 1 : 0; }
    case 'HGET': { const h = H(key); return h.has(a) ? h.get(a) : null; }
    case 'HGETALL': { const out = []; for (const [f, v] of H(key)) out.push(f, v); return out; }
    case 'HINCRBY': { const h = H(key); const n = (Number(h.get(a)) || 0) + Number(b); h.set(a, String(n)); return n; }
    case 'HDEL': { const h = H(key); const had = h.delete(a); return had ? 1 : 0; }
    case 'HLEN': return H(key).size;
    case 'SADD': { const s = S(key); const had = s.has(a); s.add(a); return had ? 0 : 1; }
    default: throw new Error('unhandled KV op ' + op);
  }
}
globalThis.fetch = async (url, opts) => {
  if (String(url).endsWith('/pipeline')) {
    const cmds = JSON.parse(opts.body);
    return { ok: true, json: async () => cmds.map((c) => ({ result: runCmd(c) })) };
  }
  throw new Error('unexpected fetch ' + url);
};

process.env.KV_REST_API_URL = 'http://kv.test';
process.env.KV_REST_API_TOKEN = 'test-token';

const HEADERS = { origin: 'https://zabalgamez.com', 'content-type': 'application/json' };
const req = (path, method = 'GET', body) =>
  new Request('https://zabalgamez.com' + path, {
    method, headers: HEADERS, body: body ? JSON.stringify(body) : undefined,
  });

const { default: register } = await import('../api/register.mjs');
const { default: builds } = await import('../api/builds.mjs');
const { default: buildVote } = await import('../api/build-vote.mjs');
const { default: finalsPicks } = await import('../api/finals-picks.mjs');
const jres = async (r) => r.json();

// --- 0. empty board reads clean before anything is registered ---
let d = await jres(await builds(req('/api/builds')));
ok(d.configured === true && d.count === 0 && d.builds.length === 0, 'builds board is empty (count 0) before any register');

// --- 1. register stores a repo + track (wallet path, no token) ---
let r = await register(req('/api/register', 'POST', { wallet: '0x' + 'a'.repeat(40), github_repo: 'octo/widget', track: 'builder' }));
d = await jres(r);
ok(d.ok === true, 'register accepts a valid wallet + repo');
ok(H('zabal:builds:track').get('octo/widget') === 'builder', 'register stored the track for the repo');

// a second builder, no track
await register(req('/api/register', 'POST', { wallet: '0x' + 'b'.repeat(40), github_repo: 'acme/tool' }));
// reject bad wallet
ok((await jres(await register(req('/api/register', 'POST', { wallet: 'nope', github_repo: 'a/b' })))).ok === false, 'register rejects a bad wallet');

// register edge cases: same repo de-dupes, an invalid track is ignored, a full URL normalizes
d = await jres(await register(req('/api/register', 'POST', { wallet: '0x' + 'a'.repeat(40), github_repo: 'octo/widget' })));
ok(d.ok === true && d.repos.length === 1, 'register de-dupes the same repo for a wallet (still 1 repo)');
await register(req('/api/register', 'POST', { wallet: '0x' + 'c'.repeat(40), github_repo: 'https://github.com/zed/app.git', track: 'bogus' }));
ok(H('zabal:builds').has('0x' + 'c'.repeat(40)) && JSON.parse(H('zabal:builds').get('0x' + 'c'.repeat(40)))[0] === 'zed/app', 'register normalizes a full github URL (+.git) to owner/repo');
ok(!H('zabal:builds:track').has('zed/app'), 'register ignores an invalid track (not stored)');

// --- 2. builds board returns track + votes and is vote-sorted ---
H('zabal:buildvotes:v1').set('acme/tool', '5');   // seed votes (as build-vote would)
H('zabal:buildvotes:v1').set('octo/widget', '2');
H('zabal:buildvotes:v1').set('zed/app', '2');     // equal to octo/widget -> name tiebreak
d = await jres(await builds(req('/api/builds')));
ok(d.configured && d.count === 3, 'builds board lists all three repos');
ok(d.builds[0].repo === 'acme/tool' && d.builds[0].votes === 5, 'builds sorted by votes desc (acme/tool first)');
ok(d.builds.find((b) => b.repo === 'octo/widget').track === 'builder', 'a build carries its track');
ok(d.builds[1].repo === 'octo/widget' && d.builds[2].repo === 'zed/app', 'equal votes break ties by repo name (octo before zed)');

// --- 3. build-vote GET returns counts ---
d = await jres(await buildVote(req('/api/build-vote')));
ok(d.configured && d.counts['acme/tool'] === 5, 'build-vote GET returns the counts');
// POST without a token is rejected
ok((await buildVote(req('/api/build-vote', 'POST', { repo: 'acme/tool' }))).status === 401, 'build-vote POST without token -> 401');

// --- 4. vote idempotency at the KV contract level (one +1 per FID per repo) ---
sets.clear();
const voteOnce = (fid, repo) => {
  const first = runCmd(['SADD', 'zabal:buildvote:voters:v1:' + repo, String(fid)]) === 1;
  return runCmd([first ? 'HINCRBY' : 'HGET', 'zabal:buildvotes:v2', repo, first ? '1' : undefined]);
};
voteOnce(1, 'x/y'); voteOnce(1, 'x/y'); voteOnce(2, 'x/y'); // fid 1 twice, fid 2 once
ok(Number(H('zabal:buildvotes:v2').get('x/y')) === 2, 'one +1 per FID per repo (2 distinct voters -> 2)');

// --- 5. finals-picks: open read, judge gate closed by default ---
d = await jres(await finalsPicks(req('/api/finals-picks')));
ok(d.configured && Array.isArray(d.picks) && d.picks.length === 0, 'finals-picks GET returns empty picks');
ok((await finalsPicks(req('/api/finals-picks', 'POST', { repo: 'a/b' }))).status === 401, 'finals-picks POST without token -> 401');
// seed a pick (as an authorized mentor would) and confirm GET reflects it
H('zabal:finals:picks').set('acme/tool', JSON.stringify({ track: 'builder', by: 99, ts: 1 }));
d = await jres(await finalsPicks(req('/api/finals-picks')));
ok(d.picks.length === 1 && d.picks[0].repo === 'acme/tool' && d.picks[0].track === 'builder', 'finals-picks GET reflects a seeded pick');
// a malformed stored value must not break the read - it degrades to an empty-track pick
H('zabal:finals:picks').set('busted/repo', '{not json');
d = await jres(await finalsPicks(req('/api/finals-picks')));
ok(d.picks.length === 2 && (d.picks.find((p) => p.repo === 'busted/repo') || {}).track === '', 'finals-picks tolerates a malformed stored value');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

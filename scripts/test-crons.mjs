// Integration test for the day-of crons, focused on the multi-session fix in
// api/daily-cast.mjs (a day with two workshops must cast about both, not just the
// first). Runs the real handler against mocked fetch: the leads JSON, the Upstash KV
// /pipeline (SET NX sentinel), and the Neynar cast endpoint (captured, not sent).

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('  FAIL:', m); } };

const TODAY = new Date().toISOString().slice(0, 10); // handler computes today the same way

// Mutable test fixtures the fetch mock reads.
let LEADS = [];
let kv = new Map();        // sentinel store for SET NX
let lastCast = null;       // captured Neynar cast body

globalThis.fetch = async (url, opts) => {
  url = String(url);
  if (url.endsWith('/data/workshop-leads.json')) {
    return { ok: true, json: async () => ({ leads: LEADS }) };
  }
  if (url.endsWith('/pipeline')) {
    const cmds = JSON.parse(opts.body);
    const out = cmds.map((c) => {
      const [op, key, , flag] = c;
      if (op === 'SET') { // SET key val NX EX ttl
        if (flag === 'NX' && kv.has(key)) return { result: null };
        kv.set(key, '1'); return { result: 'OK' };
      }
      if (op === 'DEL') { kv.delete(key); return { result: 1 }; }
      return { result: null };
    });
    return { ok: true, json: async () => out };
  }
  if (url.includes('api.neynar.com')) {
    lastCast = JSON.parse(opts.body);
    return { ok: true, json: async () => ({ success: true }) };
  }
  throw new Error('unexpected fetch ' + url);
};

process.env.KV_REST_API_URL = 'http://kv.test';
process.env.KV_REST_API_TOKEN = 'test';
process.env.NEYNAR_API_KEY = 'test';
process.env.NEYNAR_SIGNER_UUID = 'test';
delete process.env.CRON_SECRET;

const { default: dailyCast } = await import('../api/daily-cast.mjs');
const run = async () => dailyCast(new Request('https://zabalgamez.com/api/daily-cast', { method: 'GET' }));
const reset = () => { kv = new Map(); lastCast = null; };

// --- 1. single session: full pitch with RSVP, casts about the one presenter ---
reset();
LEADS = [{ name: 'Cassie', org: 'Quilibrium', topic: 'The Farcaster protocol.', when: 'Wed 4pm EST', date: TODAY, luma_url: 'https://luma.com/x' }];
let d = await (await run()).json();
ok(d.ok && d.cast === true && d.sessions === 1, 'single session casts (sessions:1)');
ok(/Cassie/.test(lastCast.text) && /RSVP: https:\/\/luma\.com\/x/.test(lastCast.text), 'single-session cast has the presenter + RSVP link');
ok(lastCast.channel_id && Array.isArray(lastCast.embeds), 'cast targets a channel with an embed');

// --- 2. two sessions same day: BOTH presenters appear (the bug fix) ---
reset();
LEADS = [
  { name: 'yerbearserker', org: 'Empire Builder', topic: 'Empire Builder V3.', when: 'Mon 6am EST', date: TODAY },
  { name: 'Joshua.eth', org: 'Bonfire', topic: 'Bonfire and the ZABAL bot.', when: 'Mon 5pm EST', date: TODAY },
];
d = await (await run()).json();
ok(d.ok && d.cast === true && d.sessions === 2, 'two-session day reports sessions:2');
ok(/yerbearserker/.test(lastCast.text) && /Joshua\.eth/.test(lastCast.text), 'BOTH presenters appear in the cast (no session dropped)');
ok(/2 ZABAL Gamez sessions today/.test(lastCast.text), 'two-session cast uses the multi-session header');

// --- 3. idempotency: a second run the same day does not double-post ---
reset();
LEADS = [{ name: 'Solo', topic: 'A talk.', date: TODAY }];
await run();
const first = lastCast; lastCast = null;
d = await (await run()).json();
ok(first && d.skipped === 'already-cast' && lastCast === null, 'second run the same day is skipped (no double cast)');

// --- 4. no session dated today: clean skip, nothing posted ---
reset();
LEADS = [{ name: 'Later', topic: 'x', date: '2099-01-01' }];
d = await (await run()).json();
ok(d.skipped === 'no-session-today' && lastCast === null, 'no session today -> skip, no cast');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

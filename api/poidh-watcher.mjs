export const config = { runtime: 'edge' };

// ZABAL Gamez - POIDH claim watcher (cron + on-demand GET /api/poidh-watcher).
//
// POIDH has no API, but claims are announced as Farcaster casts (a builder casts "I claimed the
// ZABAL Gamez Open Pot" mentioning @zaal + the bounty). This polls Neynar for those casts and
// auto-adds each into the unified store (api/submission-intake keys), so a builder's poidh claim
// shows up on the site with zero action from them and zero owner config. Deduped on cast hash.
//
// Runs on the vercel.json cron; also callable on-demand with ?key=<INTAKE_KEY> for an instant sync.

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const NEYNAR = process.env.NEYNAR_API_KEY || '';
const INTAKE_KEY = process.env.INTAKE_KEY || process.env.ADMIN_KEY || '';
const CRON_SECRET = process.env.CRON_SECRET || '';

const BOUNTY = '1249';
const QUERIES = ['ZABAL Gamez Open Pot', 'poidh.xyz/base/bounty/1249'];

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

// Classify a cast that references the ZABAL Gamez Open Pot:
//   'claim'   - the author is submitting a build to the bounty (claim language or a poidh claim URL)
//   'mention' - about the pot but NOT a claim (owner announce, funding "added ETH", promo "tap in")
//   null      - not about this pot at all
// Only 'claim' casts get ingested; this is what stops promo/funding chatter from looking like builds.
function claimKind(c) {
  const text = (c.text || '').toLowerCase();
  const embeds = (c.embeds || []).map((e) => String(e.url || '')).join(' ').toLowerCase();
  const hay = text + ' ' + embeds;
  const refsPot = hay.includes('poidh') && (hay.includes('1249') || hay.includes('zabal gamez open pot') || hay.includes('/bounty/1249'));
  if (!refsPot) return null;
  // A real poidh claim links to a /claim/ path, or the cast says it is a claim/submission.
  const claimUrl = /poidh\.xyz\/[^\s]*\/claims?\//i.test(embeds) || /\/claims?\/\d/i.test(embeds);
  const claimText = /\b(submitt?(ed|ing)?\s+(a\s+)?claim|made\s+a\s+claim|a\s+claim\s+on|my\s+claim|i\s+claim(ed)?|claiming|just\s+claimed)\b/i.test(text);
  if (claimUrl || claimText) return 'claim';
  return 'mention';
}
function buildUrl(c) {
  const embeds = (c.embeds || []).map((e) => String(e.url || '')).filter(Boolean);
  const bad = /poidh\.xyz|farcaster\.xyz|warpcast|pinata|ipfs|imagedelivery|seadn|imgur|\.(png|jpe?g|gif|webp|mp4)(\?|$)/i;
  return embeds.find((u) => !bad.test(u)) || ('https://poidh.xyz/base/bounty/' + BOUNTY);
}

export default async function handler(req) {
  const auth = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const key = new URL(req.url).searchParams.get('key') || auth;
  const authorized = (CRON_SECRET && auth === CRON_SECRET) || (INTAKE_KEY && key === INTAKE_KEY) || (!CRON_SECRET && !INTAKE_KEY);
  if (!authorized) return json({ ok: false, error: 'unauthorized' }, 401);
  if (!KV_URL || !KV_TOKEN || !NEYNAR) return json({ ok: true, configured: false, added: 0, has: { kv: !!(KV_URL && KV_TOKEN), neynar: !!NEYNAR } });

  const casts = [];
  for (const q of QUERIES) {
    try {
      const r = await fetch('https://api.neynar.com/v2/farcaster/cast/search?q=' + encodeURIComponent(q) + '&limit=25',
        { headers: { 'x-api-key': NEYNAR, accept: 'application/json' } });
      const d = await r.json();
      casts.push(...(((d.result && d.result.casts) || d.casts) || []));
    } catch { /* keep going */ }
  }

  // Classify pot-referencing casts; only genuine claims are ingested. Mentions are counted for
  // visibility but NOT written to the feed and NOT marked seen (so a later real claim still lands).
  const localSeen = new Set();
  let mentions = 0;
  const claims = casts.filter((c) => {
    if (!c || !c.hash || localSeen.has(c.hash)) return false;
    localSeen.add(c.hash);
    const kind = claimKind(c);
    if (kind === 'mention') mentions++;
    return kind === 'claim';
  });

  let added = 0;
  for (const c of claims) {
    try {
      const dd = await kvPipeline([['SISMEMBER', 'zabal:intake:poidh:seen', c.hash]]);
      if (dd[0] && dd[0].result === 1) continue;
      const handle = ((c.author && c.author.username) || '').toLowerCase().replace(/[^a-z0-9._-]/g, '') || null;
      const fid = (c.author && c.author.fid) || null;
      if (!handle && !fid) continue;
      const builderKey = handle || ('fid' + fid);
      const bu = buildUrl(c);
      let host = 'project'; try { host = new URL(bu).host.replace(/^www\./, ''); } catch { /* default */ }
      const project = (host.split('.')[0] || 'project').replace(/[^a-z0-9-]/gi, '').slice(0, 48) || 'project';
      const id = builderKey + ':' + project;
      const rec = { id, source: 'poidh', kind: 'claim', builder: { handle, fid, wallet: null }, project, url: bu, repo: null, note: (c.text || '').slice(0, 300) || null, castHash: c.hash, ts: Date.now() };
      await kvPipeline([
        ['HSET', 'zabal:intake:items', id, JSON.stringify(rec)],
        ['ZADD', 'zabal:intake:feed', String(rec.ts), id],
        ['SADD', 'zabal:intake:builder:' + builderKey, id],
        ['SADD', 'zabal:intake:poidh:seen', c.hash],
      ]);
      added++;
    } catch { /* skip this one */ }
  }
  return json({ ok: true, configured: true, claims: claims.length, mentions, skippedChatter: mentions, added });
}

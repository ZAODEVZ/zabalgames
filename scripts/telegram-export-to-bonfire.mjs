#!/usr/bin/env node
// telegram-export-to-bonfire.mjs
//
// Turn a Telegram Desktop JSON export into ZABAL Bonfire episodes.
//
// Telegram Desktop writes `result.json`. Two shapes exist and both are handled:
//   single chat export -> the chat object is the root
//   multi chat export  -> { chats: { list: [ chat, ... ] } }
//
// Messages are grouped into conversation segments (a new segment starts after a
// quiet gap) and each segment becomes ONE episode, because the Bonfire skill's
// rule is one idea per episode and a single chat line is rarely an idea.
//
// DRY RUN IS THE DEFAULT. Nothing is posted unless you pass --post.
//
// Usage:
//   node scripts/telegram-export-to-bonfire.mjs <export-dir> [options]
//
// Options:
//   --post                actually POST to Bonfire (default: dry run only)
//   --chat <id>           only this chat id (repeatable)
//   --gap-minutes <n>     quiet gap that starts a new segment (default 45)
//   --min-chars <n>       drop segments with less than n chars of text (default 180)
//   --max-chars <n>       truncate an episode body at n chars (default 6000)
//   --limit <n>           process at most n segments per chat
//   --since <YYYY-MM-DD>  only messages on or after this date
//   --out <file>          write the episodes JSON here (default: print summary only)
//   --verbose             print full episode bodies in the dry run
//
// Env (read from ~/.zao/zao.env if not already set):
//   BONFIRE_API_KEY, BONFIRE_ID (falls back to ZABAL_BONFIRE_AGENT_ID),
//   BONFIRE_API_URL (default https://tnt-v2.api.bonfires.ai)

import { readFileSync, readdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { homedir } from 'node:os';

const API_DEFAULT = 'https://tnt-v2.api.bonfires.ai';

// ---------------------------------------------------------------- args

function parseArgs(argv) {
  const o = {
    dir: null, post: false, chats: [], gapMinutes: 45, minChars: 180,
    maxChars: 6000, limit: 0, since: null, out: null, verbose: false,
  };
  const rest = argv.slice(2);
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    const next = () => rest[++i];
    if (a === '--post') o.post = true;
    else if (a === '--verbose') o.verbose = true;
    else if (a === '--chat') o.chats.push(String(next()));
    else if (a === '--gap-minutes') o.gapMinutes = Number(next());
    else if (a === '--min-chars') o.minChars = Number(next());
    else if (a === '--max-chars') o.maxChars = Number(next());
    else if (a === '--limit') o.limit = Number(next());
    else if (a === '--since') o.since = String(next());
    else if (a === '--out') o.out = String(next());
    else if (a === '--help' || a === '-h') { usage(); process.exit(0); }
    else if (a.startsWith('-')) fail(`unknown option: ${a}`);
    else if (!o.dir) o.dir = a;
    else fail(`unexpected argument: ${a}`);
  }
  if (!o.dir) { usage(); process.exit(2); }
  for (const [k, v] of [['gap-minutes', o.gapMinutes], ['min-chars', o.minChars], ['max-chars', o.maxChars], ['limit', o.limit]]) {
    if (!Number.isFinite(v) || v < 0) fail(`--${k} must be a non-negative number`);
  }
  if (o.since && !/^\d{4}-\d{2}-\d{2}$/.test(o.since)) fail('--since must be YYYY-MM-DD');
  return o;
}

function usage() {
  console.log(readFileSync(new URL(import.meta.url), 'utf8')
    .split('\n').filter(l => l.startsWith('//')).slice(1)
    .map(l => l.replace(/^\/\/ ?/, '')).join('\n'));
}

function fail(msg) { console.error(`ERROR: ${msg}`); process.exit(2); }

// ---------------------------------------------------------------- export discovery

function findResultFiles(dir) {
  const root = resolve(dir);
  if (!existsSync(root)) fail(`export dir not found: ${root}`);
  const found = [];
  const walk = (d, depth) => {
    if (depth > 3) return;
    let entries;
    try { entries = readdirSync(d, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(d, e.name);
      if (e.isDirectory()) walk(p, depth + 1);
      else if (e.isFile() && /^result.*\.json$/i.test(e.name)) found.push(p);
    }
  };
  if (statSync(root).isFile()) found.push(root); else walk(root, 0);
  if (!found.length) fail(`no result*.json under ${root} - is this a Telegram Desktop JSON export?`);
  return found.sort();
}

function loadChats(file) {
  let data;
  try { data = JSON.parse(readFileSync(file, 'utf8')); }
  catch (e) { fail(`${file} is not valid JSON: ${e.message}`); }
  // multi-chat export
  if (data && data.chats && Array.isArray(data.chats.list)) return data.chats.list;
  // single-chat export
  if (data && Array.isArray(data.messages)) return [data];
  fail(`${file} has neither .messages nor .chats.list - unexpected export shape`);
}

// ---------------------------------------------------------------- message text

// Telegram writes `text` as a string, or an array mixing strings and
// {type, text} entity objects. text_entities is the richer mirror when present.
function messageText(m) {
  const fromEntities = Array.isArray(m.text_entities)
    ? m.text_entities.map(e => (e && typeof e.text === 'string' ? e.text : '')).join('')
    : '';
  if (fromEntities.trim()) return fromEntities;
  const t = m.text;
  if (typeof t === 'string') return t;
  if (Array.isArray(t)) {
    return t.map(p => (typeof p === 'string' ? p : (p && typeof p.text === 'string' ? p.text : ''))).join('');
  }
  return '';
}

function mediaNote(m) {
  if (m.photo) return '[photo]';
  if (m.media_type === 'sticker') return `[sticker ${m.sticker_emoji || ''}`.trim() + ']';
  if (m.media_type === 'voice_message') return '[voice message]';
  if (m.media_type === 'video_message') return '[video message]';
  if (m.media_type) return `[${m.media_type}${m.file_name ? ` ${m.file_name}` : ''}]`;
  if (m.file) return `[file${m.file_name ? ` ${m.file_name}` : ''}]`;
  if (m.poll) return `[poll: ${m.poll?.question || ''}]`;
  return '';
}

function senderOf(m) {
  return m.from || m.actor || (m.from_id ? String(m.from_id) : 'unknown');
}

// ---------------------------------------------------------------- segmentation

function segmentMessages(messages, opts) {
  const usable = [];
  for (const m of messages) {
    if (!m || m.type === 'service') continue;
    const date = m.date_unixtime ? new Date(Number(m.date_unixtime) * 1000)
      : (m.date ? new Date(m.date) : null);
    if (!date || Number.isNaN(date.getTime())) continue;
    // `date` is Telegram's LOCAL wall-clock string; date_unixtime is true epoch.
    // Order and gap-measure on the epoch, but display the local string, so the
    // transcript reads with the same clock Zaal saw in his client.
    const raw = typeof m.date === 'string' ? m.date : null;
    const day = raw ? raw.slice(0, 10) : date.toISOString().slice(0, 10);
    const hhmm = raw && raw.length >= 16 ? raw.slice(11, 16) : date.toISOString().slice(11, 16);
    if (opts.since && day < opts.since) continue;
    const text = messageText(m).trim();
    const media = mediaNote(m);
    if (!text && !media) continue;
    usable.push({ id: m.id, date, day, hhmm, from: senderOf(m), text, media, replyTo: m.reply_to_message_id || null });
  }
  usable.sort((a, b) => a.date - b.date);

  const gapMs = opts.gapMinutes * 60 * 1000;
  const segments = [];
  let cur = null;
  for (const msg of usable) {
    if (!cur || msg.date - cur[cur.length - 1].date > gapMs) { cur = []; segments.push(cur); }
    cur.push(msg);
  }
  return segments;
}

// ---------------------------------------------------------------- episode rendering

function renderEpisode(chat, seg, opts) {
  const first = seg[0], last = seg[seg.length - 1];
  const chatId = String(chat.id ?? 'unknown');
  const chatName = chat.name || chat.title || `chat ${chatId}`;
  const kind = (chat.type || '').includes('supergroup') || (chat.type || '').includes('group')
    ? 'Telegram group' : 'Telegram direct message chat';

  const people = [...new Set(seg.map(m => m.from))];
  const dateLine = first.day === last.day
    ? `on ${first.day}`
    : `between ${first.day} and ${last.day}`;

  const header =
    `${kind} "${chatName}" (Telegram id ${chatId}), ${dateLine}. ` +
    `Participants: ${people.join(', ')}. ` +
    `This is a verbatim transcript segment of ${seg.length} message${seg.length === 1 ? '' : 's'} ` +
    `captured from a Telegram Desktop export and ingested into the ZABAL Bonfire knowledge graph.`;

  const byId = new Map(seg.map(m => [m.id, m]));
  const lines = seg.map(m => {
    let prefix = `[${m.hhmm}] ${m.from}`;
    if (m.replyTo && byId.has(m.replyTo)) prefix += ` (replying to ${byId.get(m.replyTo).from})`;
    const body = [m.media, m.text].filter(Boolean).join(' ').trim();
    return `${prefix}: ${body}`;
  });

  let body = `${header}\n\n${lines.join('\n')}`;
  let truncated = false;
  if (body.length > opts.maxChars) { body = body.slice(0, opts.maxChars) + '\n[transcript truncated]'; truncated = true; }

  return {
    name: `tg:${chatId}:${first.day}:${first.id}`,
    body,
    source_tag: `telegram-export:${chatId}`,
    _meta: {
      chatId, chatName, messages: seg.length, people,
      from: `${first.day} ${first.hhmm}`, to: `${last.day} ${last.hhmm}`,
      chars: body.length, truncated,
      textChars: seg.reduce((n, m) => n + m.text.length, 0),
    },
  };
}

// ---------------------------------------------------------------- safety

// Mirrors the /bonfire skill guardrail: nothing leaves the machine if a body
// looks like it carries a credential.
const SECRET_PATTERNS = [
  /\bsk-[A-Za-z0-9]{16,}/,
  /\bghp_[A-Za-z0-9]{20,}/,
  /\bxox[baprs]-[A-Za-z0-9-]{10,}/,
  /\bey[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\b(?:api[_-]?key|secret|token|password|passwd)\s*[:=]\s*["']?[A-Za-z0-9_\-]{20,}/i,
  /\b[0-9]{6,10}:AA[A-Za-z0-9_-]{30,}/, // telegram bot token
];

function secretScan(episodes) {
  const hits = [];
  for (const e of episodes) {
    for (const re of SECRET_PATTERNS) {
      if (re.test(e.body)) { hits.push({ name: e.name, pattern: String(re) }); break; }
    }
  }
  return hits;
}

// ---------------------------------------------------------------- env + post

function loadEnv() {
  const envFile = process.env.BONFIRE_ENV || join(homedir(), '.zao', 'zao.env');
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, 'utf8').split('\n')) {
      const m = line.match(/^\s*(?:export\s+)?([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (!m) continue;
      const k = m[1];
      let v = m[2].trim().replace(/^["']|["']$/g, '');
      if (process.env[k] === undefined) process.env[k] = v;
    }
  }
  return {
    apiUrl: process.env.BONFIRE_API_URL || API_DEFAULT,
    apiKey: process.env.BONFIRE_API_KEY || '',
    bonfireId: process.env.BONFIRE_ID || process.env.ZABAL_BONFIRE_AGENT_ID || '',
  };
}

async function postEpisode(env, ep) {
  const res = await fetch(`${env.apiUrl}/knowledge_graph/episode/create`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bonfire_id: env.bonfireId,
      name: ep.name,
      body: ep.body,
      source_tag: ep.source_tag,
    }),
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, body: text.slice(0, 300) };
}

// ---------------------------------------------------------------- main

async function main() {
  const opts = parseArgs(process.argv);
  const files = findResultFiles(opts.dir);

  const episodes = [];
  const perChat = [];
  for (const file of files) {
    for (const chat of loadChats(file)) {
      const chatId = String(chat.id ?? 'unknown');
      if (opts.chats.length && !opts.chats.some(c => c.replace(/^-100/, '') === chatId.replace(/^-100/, '') || c === chatId)) continue;
      let segs = segmentMessages(chat.messages || [], opts);
      const before = segs.length;
      segs = segs.filter(s => s.reduce((n, m) => n + m.text.length, 0) >= opts.minChars);
      const dropped = before - segs.length;
      if (opts.limit) segs = segs.slice(0, opts.limit);
      const eps = segs.map(s => renderEpisode(chat, s, opts));
      episodes.push(...eps);
      perChat.push({
        file, chatId, name: chat.name || chat.title || '(unnamed)', type: chat.type || '?',
        messages: (chat.messages || []).length, segments: before, dropped, episodes: eps.length,
      });
    }
  }

  console.log('Telegram Desktop export -> Bonfire episodes');
  console.log(`export dir : ${resolve(opts.dir)}`);
  console.log(`files      : ${files.length}`);
  console.log(`settings   : gap=${opts.gapMinutes}m min-chars=${opts.minChars} max-chars=${opts.maxChars}` +
    `${opts.since ? ` since=${opts.since}` : ''}${opts.limit ? ` limit=${opts.limit}` : ''}`);
  console.log('');
  for (const c of perChat) {
    console.log(`  chat ${c.chatId}  ${c.name}  [${c.type}]`);
    console.log(`    messages ${c.messages} -> segments ${c.segments} -> episodes ${c.episodes} (dropped ${c.dropped} below min-chars)`);
  }
  if (!perChat.length) console.log('  (no chats matched)');
  console.log('');

  const hits = secretScan(episodes);
  if (hits.length) {
    console.error(`ABORT: ${hits.length} episode(s) look like they contain a credential. Nothing was posted.`);
    for (const h of hits.slice(0, 10)) console.error(`  ${h.name}  matched ${h.pattern}`);
    process.exit(1);
  }
  console.log(`secret scan: clean (${episodes.length} episodes)`);

  if (opts.out) {
    writeFileSync(opts.out, JSON.stringify({ episodes: episodes.map(({ _meta, ...e }) => e) }, null, 2));
    console.log(`wrote      : ${opts.out}`);
  }

  if (!opts.post) {
    console.log('');
    console.log('DRY RUN - nothing posted. These are the episodes that would be created:');
    console.log('');
    for (const e of episodes) {
      const m = e._meta;
      console.log(`- ${e.name}`);
      console.log(`    source_tag ${e.source_tag} | ${m.messages} msgs | ${m.people.join(', ')} | ${m.chars} chars${m.truncated ? ' (truncated)' : ''}`);
      const preview = opts.verbose ? e.body : e.body.split('\n').slice(0, 3).join('\n');
      console.log(preview.split('\n').map(l => `    ${l}`).join('\n'));
      console.log('');
    }
    console.log(`DRY RUN total: ${episodes.length} episode(s). Re-run with --post to write them to Bonfire.`);
    return;
  }

  const env = loadEnv();
  if (!env.apiKey || !env.bonfireId) {
    fail('BONFIRE_API_KEY / BONFIRE_ID not set (looked in $BONFIRE_ENV or ~/.zao/zao.env)');
  }
  console.log(`posting to ${env.apiUrl}/knowledge_graph/episode/create`);
  let ok = 0, bad = 0;
  for (const ep of episodes) {
    try {
      const r = await postEpisode(env, ep);
      if (r.ok) { ok++; console.log(`  OK   ${ep.name}`); }
      else { bad++; console.log(`  FAIL ${ep.name}  HTTP ${r.status} ${r.body}`); }
    } catch (e) {
      bad++; console.log(`  FAIL ${ep.name}  ${e.message}`);
    }
  }
  console.log(`Bonfire: ${ok} posted, ${bad} failed (of ${episodes.length})`);
  if (bad) process.exit(1);
}

main().catch(e => { console.error(`ERROR: ${e.stack || e.message}`); process.exit(1); });

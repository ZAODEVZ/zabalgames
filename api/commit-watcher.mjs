// ZABAL Gamez - commit watcher cron (GET /api/commit-watcher).
//
// The scheduled push from the GitHub-as-submission / Bonfire-as-backend
// architecture (research doc 784). Runs on a Vercel cron (see vercel.json).
// Reads the `zabal:builds` { wallet -> [repos] } hash that api/register.mjs fills
// (legacy single-string values still read), checks each public repo for new
// commits, and pushes them to the Bonfire knowledge graph as episodes.
//
// Ownership proof (audit 2026-06-04): this cron is the trust boundary. register is
// a thin, auth-free claim, so before pushing a repo's commits we verify the repo
// actually contains the registrant's wallet in a known file (ZABAL.md, then the
// README). Only the repo's owner can put their wallet there, so this is what stops
// someone registering a public repo they do not control. Unverified repos are
// skipped, never pushed.
//
// This is the ONLY component that talks to Bonfire, and it does so server-side.
// The builder skill never calls Bonfire; that separation is intentional and load-
// bearing. Bonfire is the replaceable graph/judging layer behind this boundary:
// the only Bonfire-specific things here are the env vars + the episode POST shape,
// reused verbatim from ~/.claude/skills/meeting/scripts/bonfire-episode.sh. No
// partnership terms, no specific Bonfires principal, are baked in. GitHub stays
// the source of truth for builder work.
//
// Graceful no-op contract (never hard-fail, never block):
//   - Redis env absent     -> skip, 200 { skipped: 'kv-unconfigured' }
//   - Bonfire env absent    -> skip, 200 { skipped: 'bonfire-unconfigured' }
//   - a single repo errors  -> logged in the summary, the rest still run
//   - it does NOT do any judging or ranking - that is Bonfire's existing
//     rubric-agnostic pipeline, intentionally not reimplemented here.

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const BUILDS_KEY = 'zabal:builds';
const LASTSEEN_KEY = 'zabal:builds:lastseen';

// Bonfire env + endpoint - mirrors bonfire-episode.sh exactly. Vendor-neutral:
// swap the URL/key and the boundary is unchanged.
const BONFIRE_API_KEY = process.env.BONFIRE_API_KEY || '';
const BONFIRE_ID = process.env.BONFIRE_ID || '';
const BONFIRE_API_URL = process.env.BONFIRE_API_URL || 'https://tnt-v2.api.bonfires.ai';

// Optional: Vercel injects `Authorization: Bearer ${CRON_SECRET}` when CRON_SECRET
// is configured. If set, we require it; if unset, we run (so it works unconfigured).
const CRON_SECRET = process.env.CRON_SECRET || '';
// Optional: raises the GitHub rate limit from 60/hr to 5000/hr when present.
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

const MAX_REPOS = 200;            // bound runtime
const FIRST_RUN_COMMITS = 10;     // seed depth when a repo has no lastseen yet
const COMMIT_PAGE = 30;

// Secret guard - mirrors bonfire-episode.sh containsSecret(): never push a body
// that looks like it carries a credential.
const SECRET_RE = /sk-ant-[A-Za-z0-9_-]{20,}|sk-(proj-|cp-)?[A-Za-z0-9_-]{30,}|ghp_[A-Za-z0-9]{36}|github_pat_[A-Za-z0-9_]{60,}|-----BEGIN ([A-Z]+ )?PRIVATE KEY-----|0x[0-9a-fA-F]{64}|[0-9]{9,12}:[A-Za-z0-9_-]{30,}|xox[bpaors]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(5000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

// Upstash HGETALL returns a flat [f, v, f, v, ...] array; fold to an object.
function flatToObj(arr) {
  const o = {};
  if (!Array.isArray(arr)) return o;
  for (let i = 0; i < arr.length - 1; i += 2) o[arr[i]] = arr[i + 1];
  return o;
}

async function fetchCommits(owner, repo) {
  const headers = { 'Accept': 'application/vnd.github+json', 'User-Agent': 'zabal-gamez-commit-watcher' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${COMMIT_PAGE}`;
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error('github ' + r.status);
  const list = await r.json();
  if (!Array.isArray(list)) throw new Error('github bad payload');
  return list;
}

// Fetch a single file's raw text via the GitHub contents API (null on any miss).
async function fetchRepoFile(owner, repo, path) {
  const headers = { 'Accept': 'application/vnd.github.raw', 'User-Agent': 'zabal-gamez-commit-watcher' };
  if (GITHUB_TOKEN) headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  const url = `https://api.github.com/repos/${owner}/${repo}/${path}`;
  const r = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
  if (!r.ok) return null;
  return r.text();
}

// Ownership proof: the repo must contain the registrant's wallet in a known claim
// file. Checks ZABAL.md first (the convention), then falls back to the README.
// Case-insensitive. Only the repo owner can commit their wallet into the repo, so
// a match proves control - this is the gate that defeats repo-spoofing.
async function verifyOwnership(owner, repo, wallet) {
  const needle = String(wallet || '').toLowerCase();
  if (!needle) return false;
  const sources = [
    () => fetchRepoFile(owner, repo, 'contents/ZABAL.md'),
    () => fetchRepoFile(owner, repo, 'readme'),
  ];
  for (const get of sources) {
    try {
      const txt = await get();
      if (txt && txt.toLowerCase().includes(needle)) return true;
    } catch { /* try next source */ }
  }
  return false;
}

function buildEpisodeBody(wallet, owner, repo, fresh) {
  const lines = fresh.map((c) => {
    const sha = String(c.sha || '').slice(0, 7);
    const msg = String(c.commit?.message || '').split('\n')[0].slice(0, 200);
    const who = c.commit?.author?.name || c.author?.login || 'unknown';
    const when = c.commit?.author?.date || '';
    return `- ${sha} ${msg} (${who}${when ? ', ' + when : ''})`;
  });
  return [
    'ZABAL Gamez build update.',
    `Builder wallet: ${wallet}`,
    `Repo: github.com/${owner}/${repo}`,
    `New commits (${fresh.length}):`,
    ...lines,
  ].join('\n');
}

async function pushEpisode(name, body) {
  const payload = {
    bonfire_id: BONFIRE_ID,
    name,
    episode_body: body,
    source: 'text',
    source_description: 'zabal-games-commit',
    reference_time: new Date().toISOString(),
  };
  const r = await fetch(`${BONFIRE_API_URL}/knowledge_graph/episode/create`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${BONFIRE_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000),
  });
  return r.ok;
}

export default async function handler(req) {
  if (req.method !== 'GET' && req.method !== 'POST') return json({ ok: false, reason: 'method not allowed' }, 405);

  // Cron auth: enforced only if CRON_SECRET is configured.
  if (CRON_SECRET) {
    const auth = req.headers.get('authorization') || '';
    if (auth !== `Bearer ${CRON_SECRET}`) return json({ ok: false, reason: 'unauthorized' }, 401);
  }

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, skipped: 'kv-unconfigured' });
  // Bonfire is the only sink. With no Bonfire env there is nothing to push to, so
  // no-op cleanly and leave lastseen untouched - it catches up once Bonfire is wired.
  if (!BONFIRE_API_KEY || !BONFIRE_ID) return json({ ok: true, skipped: 'bonfire-unconfigured' });

  let builds, lastseen;
  try {
    const res = await kvPipeline([['HGETALL', BUILDS_KEY], ['HGETALL', LASTSEEN_KEY]]);
    builds = flatToObj(res?.[0]?.result);
    lastseen = flatToObj(res?.[1]?.result);
  } catch (e) {
    return json({ ok: false, reason: 'storage error', detail: e.message }, 502);
  }

  // Flatten { wallet -> [repos] } into (wallet, repo) pairs, bounded. Back-compat:
  // a legacy bare-string value counts as a single repo.
  const pairs = [];
  for (const wallet of Object.keys(builds)) {
    let repos;
    try {
      const p = JSON.parse(builds[wallet]);
      repos = Array.isArray(p) ? p : (typeof p === 'string' ? [p] : []);
    } catch {
      repos = builds[wallet] ? [builds[wallet]] : [];
    }
    for (const rp of repos) pairs.push([wallet, rp]);
  }
  const bounded = pairs.slice(0, MAX_REPOS);

  const summary = { ok: true, checked: 0, pushed: 0, skipped: 0, failed: 0, details: [] };
  const seenUpdates = [];

  for (const [wallet, repoPath] of bounded) {
    const [owner, repo] = String(repoPath || '').split('/');
    if (!owner || !repo) { summary.skipped++; continue; }
    summary.checked++;

    try {
      // Trust boundary: never push a repo the registrant cannot prove they own.
      const owns = await verifyOwnership(owner, repo, wallet);
      if (!owns) {
        summary.skipped++;
        summary.details.push(`${owner}/${repo}: unverified (wallet not in ZABAL.md/README)`);
        continue;
      }

      const commits = await fetchCommits(owner, repo);
      if (commits.length === 0) { summary.skipped++; continue; }

      const newestSha = commits[0].sha;
      const prev = lastseen[repoPath];
      if (prev && prev === newestSha) { summary.skipped++; continue; }

      let fresh;
      if (prev) {
        const idx = commits.findIndex((c) => c.sha === prev);
        fresh = idx >= 0 ? commits.slice(0, idx) : commits; // not on page -> take the page
      } else {
        fresh = commits.slice(0, FIRST_RUN_COMMITS); // first sight -> seed, do not dump history
      }
      if (fresh.length === 0) { summary.skipped++; continue; }

      const body = buildEpisodeBody(wallet, owner, repo, fresh);
      if (SECRET_RE.test(body)) {
        summary.skipped++;
        summary.details.push(`${owner}/${repo}: skipped (secret pattern)`);
        continue;
      }

      const ok = await pushEpisode(`ZABAL Gamez build: ${owner}/${repo}`, body);
      if (ok) {
        summary.pushed++;
        seenUpdates.push([repoPath, newestSha]);
        summary.details.push(`${owner}/${repo}: pushed ${fresh.length}`);
      } else {
        summary.failed++;
        summary.details.push(`${owner}/${repo}: bonfire push failed`);
      }
    } catch (e) {
      summary.failed++;
      summary.details.push(`${owner}/${repo}: ${e.message}`);
    }
  }

  // Advance lastseen only for repos we successfully pushed, so a failed push is
  // retried next run rather than silently dropped.
  if (seenUpdates.length) {
    try {
      const cmds = seenUpdates.map(([repoPath, sha]) => ['HSET', LASTSEEN_KEY, repoPath, sha]);
      await kvPipeline(cmds);
    } catch (e) {
      summary.details.push(`lastseen update failed: ${e.message}`);
    }
  }

  return json(summary);
}

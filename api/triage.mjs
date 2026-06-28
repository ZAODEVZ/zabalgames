// ZABAL Gamez - submission triage, tier 1 (GET /api/triage).
//
// The automated pre-screen from the July playbook (Move 4: three-tier verification). Tier 1
// is deterministic and cheap - it runs before any human in /review and before the LLM jury
// (tier 2) or human review (tier 3). It answers: is this a real, reachable repo, on a valid
// track, with a plausible ownership hint? Cuts the obvious spam so the human queue stays clean.
//
//   GET /api/triage?repo=<github url or owner/repo>&track=<artist|builder|creator>
//     -> { ok, repo, tier1: { repoValid, reachable, public, meta, trackValid, ownershipHint },
//          recommendation: 'pass'|'review'|'reject', reasons:[...] }
//
// Stateless, no KV. Uses GITHUB_TOKEN (same key as commit-watcher) for a higher rate limit.
// The scoring rubric for tiers 2-3 lives in data/triage-rubric.md.

export const config = { runtime: 'edge' };

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const TRACKS = new Set(['artist', 'builder', 'creator']);
const ALLOWED_ORIGINS = new Set(['https://zabalgamez.com', 'https://www.zabalgamez.com', 'https://zabalgames.com', 'https://www.zabalgames.com']);

function mkJson(body, origin) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Vary': 'Origin',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

// Parse "owner/repo" out of a github URL or a bare "owner/repo" string.
function parseRepo(s) {
  s = String(s || '').trim();
  let m = s.match(/github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?(?:[/#?].*)?$/i);
  if (m) return { owner: m[1], repo: m[2] };
  m = s.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
  if (m) return { owner: m[1], repo: m[2] };
  return null;
}

const GH_HEADERS = GITHUB_TOKEN
  ? { Authorization: `Bearer ${GITHUB_TOKEN}`, 'User-Agent': 'zabalgamez', Accept: 'application/vnd.github+json' }
  : { 'User-Agent': 'zabalgamez', Accept: 'application/vnd.github+json' };

export default async function handler(req) {
  const reqOrigin = req.headers.get('origin') || '';
  const origin = ALLOWED_ORIGINS.has(reqOrigin) ? reqOrigin : 'https://zabalgamez.com';
  const json = (b) => mkJson(b, origin);

  if (req.method === 'OPTIONS') return json({ ok: true });
  if (req.method !== 'GET') return json({ ok: false, error: 'method' });

  const url = new URL(req.url);
  const rawRepo = url.searchParams.get('repo') || '';
  const track = String(url.searchParams.get('track') || '').toLowerCase().trim();

  const reasons = [];
  const tier1 = { repoValid: false, reachable: false, public: false, meta: null, trackValid: false, ownershipHint: false };

  // track check
  tier1.trackValid = TRACKS.has(track);
  if (!tier1.trackValid) reasons.push(track ? `track "${track}" is not artist/builder/creator` : 'no track given');

  // repo parse
  const parsed = parseRepo(rawRepo);
  if (!parsed) {
    reasons.push('repo is not a valid GitHub URL or owner/repo');
    return json({ ok: true, repo: rawRepo, tier1, recommendation: 'reject', reasons });
  }
  tier1.repoValid = true;
  const slug = `${parsed.owner}/${parsed.repo}`;

  // repo reachability + meta
  try {
    const r = await fetch(`https://api.github.com/repos/${slug}`, { headers: GH_HEADERS, signal: AbortSignal.timeout(5000) });
    if (r.status === 404) {
      reasons.push('repo not found or private');
    } else if (r.ok) {
      const d = await r.json();
      tier1.reachable = true;
      tier1.public = !d.private;
      tier1.meta = {
        full_name: d.full_name,
        pushed_at: d.pushed_at,
        language: d.language || null,
        stars: d.stargazers_count || 0,
        forks: d.forks_count || 0,
        open_issues: d.open_issues_count || 0,
        archived: !!d.archived,
        created_at: d.created_at,
      };
      if (d.private) reasons.push('repo is private (judges cannot see it)');
      if (d.archived) reasons.push('repo is archived');
      // freshness: pushed within the last ~45 days reads as active build work
      const pushedDaysAgo = d.pushed_at ? Math.floor((Date.now() - Date.parse(d.pushed_at)) / 86400000) : 9999;
      if (pushedDaysAgo > 45) reasons.push(`last push ${pushedDaysAgo} days ago (stale)`);
    } else {
      reasons.push(`github responded ${r.status}`);
    }
  } catch {
    reasons.push('github fetch failed (could not verify reachability)');
  }

  // ownership hint: a ZABAL.md or a wallet/handle in the README suggests a real claim
  if (tier1.reachable && tier1.public) {
    try {
      const readme = await fetch(`https://api.github.com/repos/${slug}/readme`, { headers: GH_HEADERS, signal: AbortSignal.timeout(4000) });
      if (readme.ok) {
        const rd = await readme.json();
        const text = rd && rd.content ? atob(String(rd.content).replace(/\n/g, '')) : '';
        if (/0x[0-9a-fA-F]{40}/.test(text) || /@[a-z0-9_.-]{2,}/i.test(text) || /zabal/i.test(text)) tier1.ownershipHint = true;
      }
      // a ZABAL.md file is the strongest ownership signal
      const zabalmd = await fetch(`https://api.github.com/repos/${slug}/contents/ZABAL.md`, { headers: GH_HEADERS, signal: AbortSignal.timeout(4000) });
      if (zabalmd.ok) tier1.ownershipHint = true;
    } catch { /* best-effort */ }
    if (!tier1.ownershipHint) reasons.push('no ownership hint (wallet/handle/ZABAL.md) found in the repo');
  }

  // recommendation
  let recommendation;
  if (!tier1.repoValid || !tier1.trackValid || (tier1.reachable && !tier1.public)) recommendation = 'reject';
  else if (tier1.reachable && tier1.public && tier1.meta && !tier1.meta.archived && tier1.ownershipHint) recommendation = 'pass';
  else recommendation = 'review';

  return json({ ok: true, repo: slug, tier1, recommendation, reasons });
}

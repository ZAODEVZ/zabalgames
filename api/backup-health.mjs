// ZABAL Gamez - is the nightly KV backup still running? (GET /api/backup-health)
//
// THE PROBLEM THIS EXISTS FOR. `.github/workflows/kv-backup.yml` is the only scheduled job
// in the repo, and GitHub disables scheduled workflows after 60 days of repository
// inactivity - silently, with no failing run and no error anywhere. When it stops, the
// nightly backup stops AND so does the daily authenticated /api/export call that keeps the
// Upstash free tier warm. Measured 2026-09-07: the disable date is about 2026-11-06, and
// Season 2 prep is targeted at late November. So on the current plan it dies roughly three
// weeks before anyone opens the repo again, and nothing anywhere would say so.
//
// WHY THIS LIVES HERE AND NOT IN THE WORKFLOW. A check inside kv-backup.yml dies with
// kv-backup.yml. The workflow has its own canary job (it fails on purpose as the disable
// date approaches, so GitHub emails about the failed run), but that only works while the
// workflow still runs. This endpoint is the leg that keeps reporting AFTER it is switched
// off, because it measures from outside: it asks GitHub when backups/kv-latest.json was
// last committed and whether the workflow is still enabled.
//
//   GET /api/backup-health  ->  { ok, measured, healthy, backup:{...}, workflow:{...},
//                                 inactivity:{...}, problems:[...] }
//
// ABSENCE IS NOT A VALUE. If GitHub cannot be reached or rate-limits us, this returns
// measured:false and healthy:null - never healthy:true. A detector that reports "fine"
// when it is actually blind is worse than no detector, because it converts an outage into
// a reassurance. Every consumer must render measured:false as UNMEASURED, not as green.

export const config = { runtime: 'edge' };

const OWNER = 'ZAODEVZ';
const REPO = 'zabalgames';
const BACKUP_PATH = 'backups/kv-latest.json';
const WORKFLOW_FILE = 'kv-backup.yml';

// The workflow commits as this author. Its commits are what we must NOT count as repository
// activity: they are pushed with the default GITHUB_TOKEN, and GITHUB_TOKEN activity is
// widely reported not to reset GitHub's 60-day inactivity clock. We cannot verify that from
// outside, so we assume the pessimistic reading - see `assumption` in the response.
const BOT_AUTHORS = ['zao-backup'];

const INACTIVITY_LIMIT_DAYS = 60; // GitHub's documented threshold
const WARN_WITHIN_DAYS = 14;      // shout this far ahead of the disable date
const BACKUP_STALE_HOURS = 48;    // it runs daily, so 48h means it missed one

const DAY = 86400000;

function json(body, status = 200, maxAge = 900) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // Cached hard on purpose: unauthenticated GitHub allows 60 requests/hour per IP and
      // edge functions share IPs, so an uncached endpoint would rate-limit itself blind.
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

async function gh(path) {
  const r = await fetch(`https://api.github.com${path}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'zabalgamez-backup-health',
    },
  });
  if (!r.ok) {
    const remaining = r.headers.get('x-ratelimit-remaining');
    throw new Error(
      r.status === 403 && remaining === '0'
        ? 'github rate-limited this IP (unauthenticated limit is 60/hour)'
        : `github returned ${r.status} for ${path}`
    );
  }
  return r.json();
}

function daysBetween(a, b) {
  return Math.floor((b - a) / DAY);
}

export default async function handler() {
  const now = Date.now();

  let backupCommits, recentCommits, workflow;
  try {
    [backupCommits, recentCommits, workflow] = await Promise.all([
      gh(`/repos/${OWNER}/${REPO}/commits?path=${encodeURIComponent(BACKUP_PATH)}&per_page=1`),
      gh(`/repos/${OWNER}/${REPO}/commits?per_page=100`),
      gh(`/repos/${OWNER}/${REPO}/actions/workflows/${WORKFLOW_FILE}`),
    ]);
  } catch (e) {
    // Blind, and saying so. healthy stays null so no caller can read this as "fine".
    return json({
      ok: true,
      measured: false,
      healthy: null,
      reason: String(e.message || e),
      note: 'Could not measure. Render this as UNMEASURED - never as healthy.',
    }, 200, 120);
  }

  // --- when was the last backup actually committed? ---
  const lastBackup = backupCommits[0]?.commit?.committer?.date || null;
  const lastBackupMs = lastBackup ? Date.parse(lastBackup) : null;
  const backupAgeHours = lastBackupMs ? Math.floor((now - lastBackupMs) / 3600000) : null;
  const backupStale = backupAgeHours == null ? null : backupAgeHours > BACKUP_STALE_HOURS;

  // --- when did a PERSON last touch the repo? that is what the 60-day clock watches ---
  const human = recentCommits.find((c) => {
    const name = c.commit?.author?.name || '';
    const login = c.author?.login || '';
    return !BOT_AUTHORS.includes(name) && !BOT_AUTHORS.includes(login);
  });
  const lastHuman = human?.commit?.author?.date || null;
  const lastHumanMs = lastHuman ? Date.parse(lastHuman) : null;
  const idleDays = lastHumanMs == null ? null : daysBetween(lastHumanMs, now);
  const disablesAtMs = lastHumanMs == null ? null : lastHumanMs + INACTIVITY_LIMIT_DAYS * DAY;
  const daysLeft = disablesAtMs == null ? null : daysBetween(now, disablesAtMs);

  const enabled = workflow?.state === 'active';

  // --- what is actually wrong, in plain sentences ---
  const problems = [];
  if (!enabled) {
    problems.push(
      `The backup workflow is "${workflow?.state}", not active. GitHub has switched it off. ` +
      'Re-enable it in the Actions tab, then run it once with "Run workflow".'
    );
  }
  if (backupStale) {
    problems.push(
      `The last backup commit is ${backupAgeHours}h old. It runs daily, so anything over ` +
      `${BACKUP_STALE_HOURS}h means at least one night was missed.`
    );
  }
  if (daysLeft != null && daysLeft <= WARN_WITHIN_DAYS && enabled) {
    problems.push(
      `GitHub will disable this workflow in ${daysLeft} day(s) unless a person commits. ` +
      'Push anything, or hit "Run workflow" on kv-backup.yml.'
    );
  }

  return json({
    ok: true,
    measured: true,
    healthy: problems.length === 0,
    checkedAt: new Date(now).toISOString(),
    problems,
    backup: {
      path: BACKUP_PATH,
      lastCommit: lastBackup,
      ageHours: backupAgeHours,
      stale: backupStale,
      staleAfterHours: BACKUP_STALE_HOURS,
    },
    workflow: {
      file: WORKFLOW_FILE,
      state: workflow?.state || null,
      enabled,
    },
    inactivity: {
      lastHumanCommit: lastHuman,
      idleDays,
      limitDays: INACTIVITY_LIMIT_DAYS,
      disablesAt: disablesAtMs ? new Date(disablesAtMs).toISOString().slice(0, 10) : null,
      daysLeft,
      warnWithinDays: WARN_WITHIN_DAYS,
      assumption:
        'Commits authored by ' + BOT_AUTHORS.join('/') + ' are EXCLUDED, because the workflow ' +
        'pushes them with the default GITHUB_TOKEN and GITHUB_TOKEN activity is widely ' +
        'reported not to reset the clock. That cannot be verified from outside GitHub, so ' +
        'this is the pessimistic reading on purpose: if bot commits do count, the real ' +
        'deadline is later than the one reported here, never earlier.',
    },
  });
}

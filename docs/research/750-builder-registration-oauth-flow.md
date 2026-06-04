# 750 - Builder Registration via Farcaster + GitHub OAuth (Mid-June Build)

> **SUPERSEDED by doc 784 / `api/register.mjs`.** The registration that shipped
> uses a wallet-keyed Redis hash `zabal:builds` (builder's harness calls
> `POST /api/register` after pushing to GitHub; `api/commit-watcher.mjs` pushes
> commits to Bonfire). It does NOT use the GitHub-OAuth + Supabase flow specified
> here. Read this only as the earlier exploration; trust doc 784 + `api/README.md`
> for what is live.
>
> **Status:** Spec locked 2026-05-26. Build target: mid-June 2026 (during workshops month, ready for July).
> **Origin:** Zaal call - frictionless connect flow to replace the current form-based submission bar with auto-detected GitHub activity.
> **Replaces:** the current `index.html #apply` Formspree form for builders. Workshop leads + mentor signups stay on the current form path.

## The shift

**Before:** builders submit a form at T+48h with `live URL + repo + 60s demo + cast`. Manual. One-shot. Easy to miss.

**After:** builders register once at zabalgamez.com. Connect Farcaster (auto via Mini App SDK) + GitHub (one OAuth tap). Then build all month. Agents read public GitHub activity in July + extract the submission bar from the repo README. Zero deadline pressure.

## Grill answers locked

| Fork | Decision |
|---|---|
| 1 - Build path | **1B** - launch May 31 with current Formspree, build OAuth flow mid-June so it's live before July 1 |
| 2 - What counts | **2A + 2D** - any public commit in July counts. Repos with `zabalgamez.com/projects` URL in README get featured-badge. |
| 3 - Submission bar | **3A** - GitHub history IS the submission. README must include: live URL + 60s demo link + cast link. Agents auto-extract. |
| 4 - Non-GitHub fallback | **4B** - keep current form for builders who don't use GitHub (Replit-only, Lovable, etc). Two paths supported. |
| 5 - OAuth scope | **5A** - `read:user` only. Public profile + we query public events via API. |
| 6 - Storage | **6A** - Supabase (forces W5 to ship - overdue anyway). |

## Architecture

```
Builder visits zabalgamez.com (browser OR inside Warpcast Mini App)
            |
            v
  +----------------------------------------+
  |  Mini App SDK auto-reads:              |
  |  - FID                                 |
  |  - Farcaster username                  |
  |  - Verified wallets                    |
  +----------------------------------------+
            |
            v  (browser fallback: SIWF popup if not in Mini App)
            |
  +----------------------------------------+
  |  Page renders: "Hi @<handle>!          |
  |   Connect GitHub to register"          |
  |                                        |
  |   [Connect GitHub] button              |
  +----------------------------------------+
            |
            v
  +----------------------------------------+
  |  OAuth flow:                           |
  |  GET /api/auth/github/start            |
  |   -> redirect to github.com/oauth      |
  |   -> user approves (scope: read:user)  |
  |   -> github redirects back             |
  |  GET /api/auth/github/callback         |
  |   -> exchange code for token           |
  |   -> read user profile                 |
  |   -> upsert into builders table        |
  |       (fid, github_username,           |
  |        farcaster_username,             |
  |        registered_at)                  |
  |   -> redirect to /builder/[fid]        |
  +----------------------------------------+
            |
            v
  +----------------------------------------+
  |  /builder/[fid] dashboard              |
  |  - Confirmed registration              |
  |  - Live July activity feed (when July) |
  |  - Their featured-badge repos          |
  |  - Edit-cast link / re-OAuth           |
  +----------------------------------------+
            |
            v  (July 1 - July 31)
  +----------------------------------------+
  |  Agent cron job (every 6h):            |
  |  - For each registered builder:        |
  |    - Fetch GET /users/<gh>/events      |
  |        ?per_page=100                   |
  |    - Filter to July 2026 commits + PRs |
  |    - Score by rubric (see below)       |
  |    - Detect "featured" repos with      |
  |        zabalgamez.com URL in README    |
  |    - Persist scores to builders.score  |
  +----------------------------------------+
            |
            v  (end of July)
  +----------------------------------------+
  |  Agent picks top N for August Finals   |
  |  Mentors review + claim champions      |
  +----------------------------------------+
```

## API endpoints

| Path | Method | Purpose |
|---|---|---|
| `/api/auth/github/start` | GET | Initiate OAuth - reads FID from query/cookie, redirects to GitHub authorize URL with state= |
| `/api/auth/github/callback` | GET | OAuth callback - exchanges code for token, reads `/user`, upserts `builders`, redirects to `/builder/[fid]` |
| `/api/builders/[fid]` | GET | Public read - returns builder profile + scores (no PII) |
| `/api/builders/me` | GET | Authenticated read - current session's builder profile (full) |
| `/api/builders/refresh` | POST | Force-rescan their GitHub activity (rate-limited 1/hr) |
| `/api/agents/score-all` | POST | Cron-triggered (Vercel cron) - re-scores all registered builders. Requires `CRON_SECRET` header. |

## Supabase schema additions

Append to existing `db/schema.sql`:

```sql
-- Builders registered for ZABAL Gamez Season 1 (Phase 1 submission pool)
CREATE TABLE IF NOT EXISTS builders (
  id BIGSERIAL PRIMARY KEY,
  fid INTEGER NOT NULL UNIQUE,
  farcaster_username TEXT NOT NULL,
  github_username TEXT NOT NULL UNIQUE,
  verified_wallets JSONB DEFAULT '[]'::jsonb,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_scored_at TIMESTAMPTZ,
  july_commit_count INTEGER DEFAULT 0,
  july_repo_count INTEGER DEFAULT 0,
  july_pr_count INTEGER DEFAULT 0,
  featured_repos JSONB DEFAULT '[]'::jsonb,
  current_score NUMERIC(10, 2) DEFAULT 0,
  finalist_status TEXT CHECK (finalist_status IN ('candidate', 'selected', 'declined', NULL)),
  notes TEXT
);

CREATE INDEX IF NOT EXISTS builders_score_idx ON builders (current_score DESC);
CREATE INDEX IF NOT EXISTS builders_fid_idx ON builders (fid);

-- RLS: public can SELECT non-PII columns, only service role can UPSERT
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read public builder fields" ON builders
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can write" ON builders
  FOR ALL
  USING (auth.role() = 'service_role');

-- Agent score history for trend graphs
CREATE TABLE IF NOT EXISTS builder_scores (
  id BIGSERIAL PRIMARY KEY,
  fid INTEGER NOT NULL REFERENCES builders(fid),
  scored_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  score NUMERIC(10, 2) NOT NULL,
  commit_count INTEGER,
  repo_count INTEGER,
  pr_count INTEGER,
  featured_repos JSONB,
  agent_notes TEXT
);

CREATE INDEX IF NOT EXISTS builder_scores_fid_time_idx
  ON builder_scores (fid, scored_at DESC);
```

## Agent scoring rubric

Each registered builder gets a score from agent-evaluated public GitHub activity in July 2026. Score is normalized 0-1000 to align with the Respect threshold.

**Inputs from `/users/<username>/events` (filtered to July 2026):**

| Signal | Weight | Notes |
|---|---|---|
| PushEvent commit count | 0.1 per commit, max 200 | Real work, not just `git init` |
| Public repos created | 5 per repo, max 50 | Encourages building OPEN |
| PullRequestEvent (opened) | 3 per PR, max 60 | Engages with other projects |
| WatchEvent stars given | 0.2 per star, max 10 | Community signal |
| Repos with zabalgamez.com in README | 50 per repo (featured-badge bonus) | Self-flagged ZABAL Gamez builds |
| Repo with live URL + demo + cast in README | 100 per repo (submission-bar complete) | Auto-detects the 4-bar submission |

Cap: 1000 points (aligns with Respect 1000-threshold).

**Rubric is in-repo so agents + humans can audit.** Lives at `agents/scoring-rubric.md` (TBD when built).

## OAuth setup (one-time, Zaal does)

1. Go to https://github.com/settings/developers
2. New OAuth App:
   - Application name: `ZABAL Gamez`
   - Homepage URL: `https://zabalgamez.com`
   - Authorization callback URL: `https://zabalgamez.com/api/auth/github/callback`
3. Click Register
4. Copy Client ID + generate Client Secret
5. Set Vercel env vars:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `OAUTH_STATE_SECRET` (32+ hex bytes via `openssl rand -hex 32`)

## What does NOT change in May 31 launch

- Current Formspree form at `index.html #apply` stays as fallback (Fork 4 = 4B).
- Workshop leads + mentor signups stay on existing Formspree flow (mjgajyqe).
- The bar copy on the site still mentions "live URL + repo + 60s demo + cast" - those are now the README-fields agents auto-extract, but the bar narrative is unchanged.

## Build sequence (June)

| Week | Build |
|---|---|
| Week of Jun 1 | Supabase schema + RLS + service-role key wired |
| Week of Jun 8 | OAuth endpoints + builders.json upsert + /builder/[fid] dashboard |
| Week of Jun 15 | Agent scoring cron + rubric implementation + score history table |
| Week of Jun 22 | Featured-badge auto-detection + leaderboard rendering |
| Week of Jun 29 | End-to-end test + soft-launch to Tyler + Thy Rev for dogfood |
| July 1 | Live. Builders register all month. |

## Adjacent doc references

- Doc 730 - Africa CDN routing fix (Cloudflare migration deferred post-launch, relevant if dashboard latency matters)
- Doc 654 - Empire Builder V3 (apiLeaderboards may consume builders.json as a feed source)
- llms.txt - the registration flow gets a new kEngram pointer once shipped

## Open decisions for build phase

| Decision | Defer to |
|---|---|
| Cron interval (every 6h? every 24h?) | Build phase, test 6h first |
| Score normalization (0-1000 hard cap or stretched?) | Test on Tyler + Thy Rev real history |
| Featured-badge re-scan frequency | Same as cron |
| Privacy: opt-in to verified-wallet display on /builder/[fid]? | Build phase - default OFF |

## Risk register

| Risk | Mitigation |
|---|---|
| GitHub API rate limit (5000/hr authenticated) | Cache events 6h; only re-scan flagged builders on demand |
| Builders without GitHub | Fork 4B - Formspree fallback stays available |
| OAuth state token replay | OAUTH_STATE_SECRET signs the state + 15-min expiry |
| Builder unregisters / wants out | `/api/builders/me` exposes DELETE endpoint, clean removal |
| Some builders use multiple GitHub accounts | Force-link primary; FID can have only one mapping (UNIQUE constraint) |

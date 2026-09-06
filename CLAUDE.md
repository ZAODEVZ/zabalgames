# CLAUDE.md - ZABAL Gamez

Canonical state + working conventions for this repo. Read this first. (Dated files
under `docs/` and `docs/research/` are point-in-time records, not current state -
trust this file over them where they disagree.)

## What this is
ZABAL Gamez = The ZAO's 3-month Build-A-Thon. A build event for the Farcaster/ZAO
ecosystem - NOT a video-game contest. June workshops, July open build, August Finals.
Free, open to anyone, any harness. Three tracks: **artist** (musical/visual),
**builder** (developer/aspiring), **creator** (media/distribution).

- **Repo:** zaodevz/zabalgames - static site + Vercel edge functions, also a Farcaster Mini App.
- **Production domain:** `zabalgamez.com` (with a Z). Old `zabalgames.com` 307-redirects to it.
- **Brand mark:** the arcade "ZABAL GAMEZ / INSERT COIN" pixel logo (`assets/logo-gamez.png`).

## Brand rules (hard)
No emojis. No em dashes (hyphens only). No crypto/web3/onchain jargon in public copy
("digital creators" / "builders" instead). "100+" for ZAO member count, never a
specific number. Tight, factual, warm.

## Current status - SEASON 1 IS COMPLETE (settled 2026-08-30)

**Champions, one per track: n3m (artist), ghostmintops (builder), uniquebeing404
(creator).** 31 recorded workshops, 31 projects from 15 people, six finalists across three
battles, every finalist paid from a 500 USDC pool. `data/season-1-results.json` is the
frozen record and `/results` renders it - treat that file as the source of truth for any
season figure, and if a number is wrong fix it there rather than on a page.

Each battle was decided on three signals: an open poll run on X from the WaveWarZ account,
the charts from live trading on WaveWarZ, and a judges panel. All three champions took all
three. The per-signal NUMBERS were never captured, so no margins are published anywhere -
do not invent them.

**Season 2 is named and has no dates, format or theme. Do not add any until Zaal sets
them.** The repo is written so it can sit untouched until then.

The site is a multi-surface Mini App - 68 top-level pages + 35 recording pages + the game
pages, 45 edge endpoints. Snapshot:
- Rebrand to ZABAL Gamez + zabalgamez.com is complete and deployed.
- Mini App manifest (`.well-known/farcaster.json`) is **self-hosted and signed** for
  zabalgamez.com (accountAssociation type:auth, FID 19640). Do NOT hand-edit the
  accountAssociation block - re-sign via Farcaster dev tools if the domain ever changes.
- Homepage: validated positioning, "What you walk away with", FAQ, 3-tracks block,
  the three champions, the season in numbers, the workshop library (reads
  `data/workshop-leads.json`) with per-track filter, and a phase-aware clock that returns
  "Season 1 complete" past the season end. The recruitment funnel (how-it-works, why-join,
  track picker, join buttons) was removed 2026-09-04 - the front door shows the result now.
- In-feed share/embed image is the arcade card `assets/embed-card-gamez.png` (3:2).
- Activity backend is LIVE (`/api/activity` returns `configured:true`).
- **Recordings/content system is live:** `/recordings` archive, `/recaps`, `/speakers`,
  `/spaces`, `/farcaster-batches`, plus per-recording Farcaster-verified comment threads
  (`assets/recording-comments.js` + `/api/comments`, `/api/cast-comments`) and transcripts.
- **Submit stays open, the vote is RETIRED.** `/vote` and `/enter` both redirect to
  `/leaderboard`; `/winners` redirects to `/results`. `/submit` still accepts projects and
  says plainly that a submission does not enter Season 1. The pipeline as built: `/submit` -> AUTO-ACCEPTS a
  project onto the `/submissions` board immediately (no approval queue; moderation is
  delete-after via `/review`), then the community casts a quadratic vote at `/vote` on ALL
  live submissions (candidates = the board + the seed builders in `data/builder-submissions.json`,
  NOT a curated slate). One ballot per Farcaster FID, 100 credits/track, N votes cost N^2.
  Admin = Farcaster FID allowlist in `lib/auth.mjs` (19640 zaal, 1057869 imanafrikah) +
  optional `ADMIN_KEY` fallback. The old curated slate (`slate-admin`, `qv-slate-draft`) is
  retired. `data/vote-candidates.json` is now just the on/off `status` switch.
- **The Finals RAN and are settled.** Two people per track (finalists are people, not
  projects), six finalists, three head-to-head battles on WaveWarZ: artist 24 Aug, creator
  27 Aug, builder over 24 hours from noon 29 Aug. `/august` is the canonical Finals page and
  `/results` is the canonical result. Judges: Thy Revolution, Iman Afrikah and paperhandpapi
  on builder; Thy Revolution and N3M on creator with a third seat never recorded; no panel
  recorded for artist.
  **A much older design is still described in `docs/` and must not be treated as real** - a
  WaveWarZ-Base prediction market, a 72h trade window, Respect-weighted settlement voting,
  and a mentor embedded as a teammate for a 24h build + promote cycle. It was superseded and
  never ran. `/finals` and `/finals/live` are kept as the design record and both carry
  SUPERSEDED notices.
- **Engagement/games layer:** `/play` + `/game` (ZAO 2048, monthly $Zabal prize via
  `/api/game` + `monthly-winner`), `/pops` collectibles, live `raffle`, `/dream-leads`
  demand board, `/mindful`, `/graph` (Bonfire/ecosystem knowledge graph), `ref` referrals,
  `pfps` resolver. `/live` + `/today` are the "what's on now" surfaces (`live-status`,
  `present` heartbeat, `live-notify`).
- **Internal/ops pages:** `/status` (production board), `/crm` (roster), `/context` +
  `/install` (AI-harness context loaders), `/playbook`, `/research`, `/changelog`.

## Storage (IMPORTANT - read before any backend work)
The activity backend runs on **Upstash Redis** over the REST API (`/pipeline`,
Redis commands - no npm, zero-build edge functions). Env vars: `KV_REST_API_URL` +
`KV_REST_API_TOKEN` (Upstash Vercel integration injects these; code also accepts
`UPSTASH_REDIS_REST_*`). It is connected and live.

- We are NOT on Supabase for the activity backend. `db/supabase-activity.sql` was a
  short-lived migration that got reverted - it has been deleted. Do not reintroduce it.
- `db/schema.sql` is a SEPARATE, unwired Postgres schema originally drafted for a
  client-side Supabase submission gallery in `info.html`. That gallery (+ its Supabase
  CDN script and placeholder keys) has been REMOVED - the live submission system is
  `/submit` -> `/api/submissions` (Upstash Redis + `data/builder-submissions.json`) with
  the public board at `/submissions` (PR #559). `db/schema.sql` now has no consumer; treat
  it as dead unless a future Postgres-backed feature revives it.

## Architecture / key files
Static HTML + inline `<style>`/scripts per page, shared helpers in `assets/*.js`, edge
functions in `api/`. 60+ pages; not all listed here - this is the load-bearing set.

**Core public pages**
- `index.html` - homepage (join button + track chips, join counter, workshop schedule
  render + filter, top-CTA cast, phase-aware countdown).
- `lead.html` - workshop-lead page: Cal.com embed (`CAL_LINK` var) + Formspree fallback.
- `info.html` - all-the-details; mentor Formspree form; Cal iframe. Points to the live
  submission system (`/submit`, `/submissions`); the old client-side Supabase form +
  gallery were removed (no external CDN, no placeholder keys).
- `enter.html` - July build entry: register a wallet + GitHub repo, building-in-public board.
- `play.html` / `game.html` - ZAO 2048 + arcade hub (monthly $Zabal top-10). The arcade
  also holds `game/build-quiz.html` (what-should-you-build) + `game/zao-trivia.html`
  (weekly pot), and `clips.html` - the clip-to-earn flywheel (gallery + clipper board).
- `finals.html` / `winners.html` / `leaderboard.html` / `projects.html` - Finals stack.
- `bounties.html` (claimable bounty board) / `grants.html` (verified funding programs) /
  `build-days.html` (July daily-build series) / `build-ideas.html` (community build board) /
  `media.html` - the build-funnel + content surfaces.
- `recordings.html` / `recaps.html` / `speakers.html` / `spaces.html` /
  `farcaster-batches.html` - the content/recordings system.
- `streams.html` - data streams + chronological timeline; per-entry Cast buttons.
- `live.html` / `today.html` - "what's on now" surfaces. `dream-leads.html`, `pops.html`,
  `mindful.html`, `graph.html`, `about.html`, `links.html`, `share.html`, `install.html`,
  `playbook.html`, `research.html`, `press.html` round out the public set. `mentor.html` +
  `p.html` are data-driven profile templates (load by handle).
- Internal/ops: `status.html` (production board), `crm.html` (roster), `context.html`
  (AI-harness context), `changelog.html`.

**Shared assets**
- `assets/miniapp.js` - Mini App SDK bootstrap + `window.ZABAL` helpers (composeCast,
  share, track, join, getUser, addApp, viewProfile, dreamVote, buildVote, likeComment,
  etc.). ES module from esm.sh.
- `assets/recording-comments.js` - drop-in Farcaster-verified comment thread (mount
  `#zg-comments`, self-configures from the URL path). `presence.js`, `share.js`,
  `site-nav.js`, `rec-nav.js`, `transcript.js` - the rest of the shared client helpers.

**Edge functions** (`api/*.mjs`, Vercel EDGE, Upstash Redis over REST; Quick Auth JWT
verified server-side, `DOMAIN = 'zabalgamez.com'`, JWKS from auth.farcaster.xyz; all
no-op gracefully without Redis env vars). **All Vercel crons are retired** (posting is
ZOE/ZOL's job now; `daily-cast.mjs` deleted; `workshop-reminders`/`monthly-winner`/
`commit-watcher`/`poidh-watcher` schedules removed - the endpoint files stay for possible
later re-scheduling). Endpoints across:
- *Activity/identity:* `track`, `activity`, `join`, `leaderboard`, `empire-leaderboard`
  (inverse - reads our tokenless empire FROM Empire Builder), `present`, `pfps`, `ref`.
- *Notifications:* `webhook`, `notify` (admin), `live-notify`, `live-status`.
- *Builds/Finals:* `register` + `commit-watcher` (retired cron), `builds`, `build-vote`,
  `finals-picks`, `monthly-winner` (retired cron).
- *Engagement:* `game`, `pops`, `raffle`, `dream-vote`, `comments`, `cast-comments`,
  `bonfire-ask`, `snap/signup`.

  **See `api/README.md` for the authoritative per-endpoint contracts** (kept current).

**Data + config**
- `data/workshop-leads.json` - schedule source of truth (curated file, not a DB).
- `data/` also holds content/registry JSON: `data-streams.json`, `streams/timeline.json`,
  `changelog.json`, `recaps.json`, `people.json`, `mentors.json`, `crm.json`,
  `dream-leads.json`, `finals.json`, `adoptable-projects.json`, `bonfire-graph.json`,
  `pfps.json`, `mindful.json`, `daily-updates.json`, `transcript-corrections.json`.
- `.well-known/farcaster.json` - Mini App manifest (signed).
- `vercel.json` - redirects + headers (cleanUrls; no rewrite touches `/.well-known/`).

## Integrations
- **Signups:** Formspree team form `https://formspree.io/f/mlgvvoyd` (lead, mentor,
  snap), each tagged by `form_source`.
- **Scheduling:** Cal.com `cal.com/zabal-gamez/workshop-session`, embedded on /lead + /info.
- **Collectible: REMOVED 2026-09-04.** Every "Insert Coin" link to
  `collect.zabalgamez.com` (the shortlink forwarding to the retired Magnetiq magnet) was
  deleted from the site on Zaal's call - 125 anchors across 85 files, plus the entry in
  the `site-nav.js` directory panel and the two in `scripts/ingest-recording.mjs` that
  would have re-added it to every future recording page. **Do not reintroduce it.** The
  `INSERT COIN` wordmark in the footer and in `assets/logo-gamez.png` is brand, not a
  link, and stays.
- **Press:** `press.html` (`/press`) is the media kit; linked from every page footer.

## Git / PR conventions
- Work happens from web AND terminal sessions. ALWAYS `git fetch origin --prune` +
  `git pull --ff-only origin main` at the start of a session - commits have been
  stranded and storage decisions have diverged when this was skipped.
- Branch as `ws/<short-name>` off main. One PR = one finished unit of work.
- BEFORE EVERY commit or push, confirm the current branch's PR is still OPEN. Run
  `gh pr view <branch> --json state,number`. If it returns MERGED or CLOSED - or you
  are on `main` - STOP and branch fresh off updated main. Pushing onto an
  already-merged branch silently strands the commits: they build as Vercel Previews
  and look shipped, but never reach production. This is the single most common way
  work gets lost in this repo (happened on PR #54: the PR merged ~2 min after it was
  opened, and the next two commits pushed to the dead branch never made it to main).
- Do NOT open the PR until ALL commits for the unit are pushed. Once a PR is open,
  do NOT keep pushing new work to that branch - the user can merge at any moment. A
  follow-up request after a PR exists is a NEW branch off fresh main, not more commits
  on the old one.
- Push ALL commits, THEN open the PR, and confirm the branch is even with what you
  intend to merge. The user merges PRs via GitHub.
- After a merge, re-sync main before new work. Never reuse a merged branch.

## Validate before pushing (no test suite)
- **One command: `node scripts/validate.mjs`** - runs all four checks below and exits
  non-zero on any failure. A SessionStart hook (`.claude/settings.json`) runs it
  with `--quiet` at the start of every session, so a broken repo state shows up
  immediately. Run it by hand before every push too.
- It covers: every tracked `*.json` parses; every `api/*.mjs` passes `node --check`;
  every classic inline `<script>` in `*.html` compiles; the manifest payload decodes
  to `{"domain":"zabalgamez.com"}`.

## 3-month roadmap
The full June -> July -> August prep plan lives in `docs/season-1-roadmap-3month.md` -
every phase task split into `[OWNER]` (DMs, dates, assets) vs `[BUILD]` (repo work), with a
"what ready means" bar per phase. Read it for the arc; the list below is the near-term
owner-action subset.

## What's left (owner actions) - reviewed 2026-09-04

Season 1 close-out is done. Everything below is optional or waiting on Zaal.

1. **The season figures do not reconcile, and nobody has decided which is right.**
   `data/season-1-results.json` publishes 31 projects from 15 people. The KV store holds
   **21** submission documents (`zabal:sub:v1:*`, counter 21, index consistent) across **6**
   distinct builder handles, and the backup is NOT the reason - `scripts/redact-export.py`
   drops only ballots, tokens and emails, never submissions, and the export reports
   `truncated: false`. The published figures were tallied by hand and probably include POIDH
   claims, tag captures and manual adds that were never written back to a store. The site is
   internally consistent at 31 now, so nothing is visibly broken. If the real number is
   known, change it in `season-1-results.json` alone and every surface follows.
2. **The creator battle's third judge is a literal `null`** in `data/finals.json`, beside
   Thy Revolution and N3M. `/august` says so plainly rather than hiding it. A name closes it.
   The artist battle has no panel recorded at all.
3. **Per-signal numbers were never captured.** Vote counts and trading figures for the three
   battles are not in the repo. Every surface names who took each signal and publishes no
   margins. If the figures exist in the WaveWarZ or X history and you want them recorded, they
   go in `season-1-results.json`.
4. **Vercel Web Analytics** - the `/_vercel/insights/script.js` tag is on every page; enable
   Web Analytics in the Vercel dashboard to start collecting. (Dashboard state cannot be
   checked from the repo, so this may already be done.)
5. **Cal.com booking questions** - add handle/topic/format/notes to the event so bookings
   arrive with context.
6. **15 unmerged remote branches** hold work that exists nowhere on main: the Telegram-to-
   Bonfire ingest script (`ws/bonfire-lane`), the lane audit, `ws/sopha-fireside` (a complete
   recording page and transcript), `recordings/26.html`
   (`rescue/orphan-8668183-azkal-flowstage`), SIWE wallet login from closed PR #584, a
   season-2-readiness doc, and three June newsletter drafts. Salvage or delete.
7. **Season 2 prep** - target late November. Ideas and Zaal's pitch-week suggestion are in
   `docs/season-2-ideas.md`. Set nothing public until dates and format exist.

### One scheduled job to keep alive
`.github/workflows/kv-backup.yml` is the only scheduled job in the repo. **GitHub disables
scheduled workflows after 60 days of repository inactivity.** Whether the bot's own nightly
commits reset that clock is ambiguous. If the repo genuinely goes quiet until November, hit
"Run workflow" on it once (it has `workflow_dispatch`) or watch for GitHub's warning email -
otherwise the backups AND the daily `/api/export` call that keeps Upstash warm both stop.

## Live links (do not break)
- Season 1 results (canonical): https://zabalgamez.com/results
- The Finals record: https://zabalgamez.com/august
- Luma calendar: https://luma.com/zao
- /zabal channel + group chat: farcaster.xyz/~/group/TTUJf88kRNt2s7Yb-KL0xQ

## Decision history
The "why" behind the format lives in `docs/research/701-canonical-state.md` (canonical
decisions) and the numbered research docs. The reframe to the current positioning is in
`docs/positioning-2026-05-29.md` + `docs/foundercheck-reframe-2026-05-29.md`.
Backend/policy resolutions from the 2026-06-04 activity-backend audit (join idempotency,
register hybrid identity + ownership proof, July judging, public-count) are in
`docs/audit-decisions-2026-06-04.md`. Workshop 1 recap: `docs/workshop-1-empire-builder-recap-2026-06-04.md`.

## ICM Context Boxes (AI-readable ZAO context)

Fetch a box to load grounded context on any ZAO project or person:
- `curl -s https://useicm.com/api/objects/<id>/llm.txt` ; directory https://thezao.xyz/list
- Start box: **zao-assistant** `icm_-hsPHePpqX01RovoB_SEqA` (links to thezao, bettercallzaal, zabalgamez, wavewarz, farcaster, fractal, poidh, zuke, zao-festivals, coc-concertz, zao-newsletter, loop-engineering, milk-road).
- Source of truth: `research/identity/icm-boxes/` in ZAOOS.

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

## Current status (live)
Mid-season (June workshops running, July open build + August Finals ahead). The site
has grown well past the homepage into a multi-surface Mini App - 60+ pages (41 top-level
+ 23 recording pages + the game pages), 45 edge endpoints. Snapshot:
- Rebrand to ZABAL Gamez + zabalgamez.com is complete and deployed.
- Mini App manifest (`.well-known/farcaster.json`) is **self-hosted and signed** for
  zabalgamez.com (accountAssociation type:auth, FID 19640). Do NOT hand-edit the
  accountAssociation block - re-sign via Farcaster dev tools if the domain ever changes.
- Homepage: validated positioning, "What you walk away with", FAQ, 3-tracks block,
  June workshop schedule (reads `data/workshop-leads.json`) with per-track filter,
  one-tap join (track-aware), top "tell Farcaster" share CTA, phase-aware season clock
  (counts to July build, then Aug Finals - no hardcoded date).
- In-feed share/embed image is the arcade card `assets/embed-card-gamez.png` (3:2).
- Activity backend is LIVE (`/api/activity` returns `configured:true`).
- **Recordings/content system is live:** `/recordings` archive, `/recaps`, `/speakers`,
  `/spaces`, `/farcaster-batches`, plus per-recording Farcaster-verified comment threads
  (`assets/recording-comments.js` + `/api/comments`, `/api/cast-comments`) and transcripts.
- **Finals stack is built (settles in Aug):** `/enter` (register + building-in-public
  board), `/projects` (adoptable projects), `/finals` (WaveWarZ prediction-market spec),
  `/leaderboard`, `/winners`; backed by `register`, `builds`, `build-vote`, `finals-picks`,
  `monthly-winner`.
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
no-op gracefully without Redis env vars). 45 endpoints across:
- *Activity/identity:* `track`, `activity`, `join`, `leaderboard`, `empire-leaderboard`
  (inverse - reads our tokenless empire FROM Empire Builder), `present`, `pfps`, `ref`.
- *Notifications:* `webhook`, `notify` (admin), `daily-cast` (cron, public), workshop-
  `reminders` (cron, private push), `live-notify`, `live-status`.
- *Builds/Finals:* `register` + `commit-watcher` (cron, the doc-784 GitHub-as-submission /
  Bonfire-as-backend pair), `builds`, `build-vote`, `finals-picks`, `monthly-winner`.
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
- **Magnetiq:** the ZABAL Gamez collectible/magnet is the season registration +
  brand-mementos + UGC-upload surface, at `app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`.
  The site-wide "Insert Coin" nav button points to `collect.zabalgamez.com` - a branded
  shortlink (DNS-level, not in `vercel.json`) to that magnet. Keep the two in sync.
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

## What's left (not code-blocked - owner actions)
1. Magnetiq magnet - upload the 8 ZAO brand mementos + the collectible video (paste-ready
   copy in `docs/magnetiq-zabal-gamez-collectible-page.md` + `docs/magnetiq-mementos-zao-brands-2026-05-28.md`).
2. Cal.com booking questions - add handle/topic/format/notes to the event so bookings
   arrive with context.
3. Announcements (yerbearserker first-workshop post + Day 0) - ON HOLD per the owner.
   Reference asset: BCZ YapZ Episode 7 features yerbearserker / Empire Builder.
4. Workshop roster - DONE for June: 8 delivered + 9 scheduled (all dated, all with a Luma),
   well past the ~8 target. Funnel is `docs/workshop-roster.md`; live production status is
   `docs/workshop-media-tracker.md` + the internal `/status` page. Remaining near-term work is
   production (transcripts/thumbnails/YouTube/guest-OK'd), not recruiting. Six confirmed leads
   still need a date (Tyler, Thy Revolution, Duo Do, Jonathan Colton, kmac.eth, Plat0x).
5. Vercel Web Analytics - the `/_vercel/insights/script.js` tag is on every page; enable
   Web Analytics in the Vercel dashboard (Analytics tab) to start collecting.
6. POIDH bounty - "Best ad for ZABAL Gamez", $25, ends Jun 14. Being wrapped + a new
   two-week bounty launched live in Kenny's POIDH session (Mon Jun 15, 4pm EST). Paste-ready
   copy + promo cast in `docs/poidh-bounty-best-ad.md`.

## Live links (do not break)
- Luma calendar: https://luma.com/zao | yerbearserker Jun 1 RSVP: https://luma.com/7nfside5
- Magnetiq magnet (register + collectibles): https://app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez
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

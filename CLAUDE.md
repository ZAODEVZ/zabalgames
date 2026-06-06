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
- Rebrand to ZABAL Gamez + zabalgamez.com is complete and deployed.
- Mini App manifest (`.well-known/farcaster.json`) is **self-hosted and signed** for
  zabalgamez.com (accountAssociation type:auth, FID 19640). Do NOT hand-edit the
  accountAssociation block - re-sign via Farcaster dev tools if the domain ever changes.
- Homepage: validated positioning, "What you walk away with", FAQ, 3-tracks block,
  live June workshop schedule (reads `data/workshop-leads.json`) with per-track filter,
  one-tap join (track-aware), top "tell Farcaster" share CTA.
- In-feed share/embed image is the arcade card `assets/embed-card-gamez.png` (3:2).
- Activity backend is LIVE (`/api/activity` returns `configured:true`).

## Storage (IMPORTANT - read before any backend work)
The activity backend runs on **Upstash Redis** over the REST API (`/pipeline`,
Redis commands - no npm, zero-build edge functions). Env vars: `KV_REST_API_URL` +
`KV_REST_API_TOKEN` (Upstash Vercel integration injects these; code also accepts
`UPSTASH_REDIS_REST_*`). It is connected and live.

- We are NOT on Supabase for the activity backend. `db/supabase-activity.sql` was a
  short-lived migration that got reverted - it has been deleted. Do not reintroduce it.
- `db/schema.sql` is a SEPARATE, still-unwired Postgres schema for the **July project
  submission gallery** (`info.html`, client-side). That's a July decision and the team
  is currently out of free Supabase project slots - revisit then.

## Architecture / key files
- `index.html` - homepage (inline `<style>` + inline scripts: join button + track
  chips, join counter, workshop schedule render + filter, top-CTA cast).
- `lead.html` - workshop-lead page: Cal.com embed (`CAL_LINK` var) + Formspree form
  fallback (with a track select).
- `info.html` - all-the-details; mentor Formspree form; Cal iframe; the July submission
  gallery (client-side Supabase, placeholder keys, NOT live).
- `streams.html` - data streams + chronological timeline; per-entry Cast buttons.
- `assets/miniapp.js` - Mini App SDK bootstrap + `window.ZABAL` helpers (composeCast,
  share, track, join, getUser, addApp, viewProfile). ES module from esm.sh.
- `api/*.mjs` - Vercel EDGE functions: track, activity, join, leaderboard, notify,
  webhook, present, daily-cast (cron), register + commit-watcher (cron, the doc-784
  GitHub-as-submission / Bonfire-as-backend pair), bonfire-ask, snap/signup. Upstash
  Redis over REST. Quick Auth JWT verified server-side (`DOMAIN = 'zabalgamez.com'`,
  JWKS from auth.farcaster.xyz). All no-op gracefully if Redis env vars are absent.
  See `api/README.md` for the per-endpoint contracts.
- `data/workshop-leads.json` - schedule source of truth (curated file, not a DB).
- `data/data-streams.json`, `data/streams/timeline.json`, `data/changelog.json` - content.
- `.well-known/farcaster.json` - Mini App manifest (signed).
- `vercel.json` - redirects + headers (cleanUrls; no rewrite touches `/.well-known/`).

## Integrations
- **Signups:** Formspree team form `https://formspree.io/f/mlgvvoyd` (lead, mentor,
  snap), each tagged by `form_source`.
- **Scheduling:** Cal.com `cal.com/zabal-gamez/workshop-session`, embedded on /lead + /info.
- **Magnetiq:** the ZABAL Gamez collectible/magnet is the season registration +
  brand-mementos + UGC-upload surface, at `app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`.

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
4. Workshop roster - fill `docs/workshop-roster.md` and lock ~4-5 more June sessions
   (target ~8). Topic ideas per track in `docs/workshop-topics-by-track.md`. Confirmed +
   scheduled leads get mirrored into `data/workshop-leads.json` (drives the schedule).
5. Vercel Web Analytics - the `/_vercel/insights/script.js` tag is on every page; enable
   Web Analytics in the Vercel dashboard (Analytics tab) to start collecting.
6. POIDH bounty - "Best ad for ZABAL Gamez", $25, ends Jun 14. Paste-ready copy +
   promo cast in `docs/poidh-bounty-best-ad.md`. Post on POIDH; optionally add a homepage
   callout once the bounty link exists.

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

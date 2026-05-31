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
  webhook, snap/signup. Upstash Redis over REST. Quick Auth JWT verified server-side
  (`DOMAIN = 'zabalgamez.com'`, JWKS from auth.farcaster.xyz). All no-op gracefully
  if Redis env vars are absent. See `api/README.md`.
- `data/workshop-leads.json` - schedule source of truth (curated file, not a DB).
- `data/data-streams.json`, `data/streams/timeline.json`, `data/changelog.json` - content.
- `.well-known/farcaster.json` - Mini App manifest (signed).
- `vercel.json` - redirects + headers (cleanUrls; no rewrite touches `/.well-known/`).

## Integrations
- **Signups:** Formspree team form `https://formspree.io/f/mlgvvoyd` (lead, mentor,
  snap), each tagged by `form_source`.
- **Scheduling:** Cal.com `cal.com/zabal-games/workshop-session`, embedded on /lead + /info.
- **Magnetiq:** the ZABAL Gamez collectible/magnet is the season registration +
  brand-mementos + UGC-upload surface, at `app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`.

## Git / PR conventions
- Work happens from web AND terminal sessions. ALWAYS `git fetch origin --prune` +
  `git pull --ff-only origin main` at the start of a session - commits have been
  stranded and storage decisions have diverged when this was skipped.
- Branch as `ws/<short-name>` off main. Push ALL commits, THEN open the PR, and confirm
  the branch is even with what you intend to merge. The user merges PRs via GitHub.
- After a merge, re-sync main before new work.

## Validate before pushing (no test suite)
- JSON: `for f in $(git ls-files '*.json'); do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" || echo BAD $f; done`
- Edge fns: `for f in $(git ls-files 'api/*.mjs'); do node --check --input-type=module < "$f" || echo BAD $f; done`
- Inline HTML JS: extract `<script>...</script>` blocks and `new Function(body)` each.
- Manifest payload must decode to `{"domain":"zabalgamez.com"}`.

## What's left (not code-blocked - owner actions)
1. Magnetiq magnet - upload the 8 ZAO brand mementos + the collectible video (paste-ready
   copy in `docs/magnetiq-zabal-gamez-collectible-page.md` + `docs/magnetiq-mementos-zao-brands-2026-05-28.md`).
2. Cal.com booking questions - add handle/topic/format/notes to the event so bookings
   arrive with context.
3. Announcements (yerbearzerker first-workshop post + Day 0) - ON HOLD per the owner.
   Reference asset: BCZ YapZ Episode 7 features yerbearzerker / Empire Builder.
4. Workshop roster - fill `docs/workshop-roster.md` and lock ~4-5 more June sessions
   (target ~8). Topic ideas per track in `docs/workshop-topics-by-track.md`. Confirmed +
   scheduled leads get mirrored into `data/workshop-leads.json` (drives the schedule).
5. Vercel Web Analytics - the `/_vercel/insights/script.js` tag is on every page; enable
   Web Analytics in the Vercel dashboard (Analytics tab) to start collecting.

## Decision history
The "why" behind the format lives in `docs/research/701-canonical-state.md` (canonical
decisions) and the numbered research docs. The reframe to the current positioning is in
`docs/positioning-2026-05-29.md` + `docs/foundercheck-reframe-2026-05-29.md`.

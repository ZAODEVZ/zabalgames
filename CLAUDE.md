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

<!-- RECHECK 2026-11-01: Season 2 was targeted at "late November". If dates, format or theme still do not exist by now, the late-November target is itself the stale claim - say so rather than repeating it. -->
**Season 2 is named and has no dates, format or theme. Do not add any until Zaal sets
them.** The repo is written so it can sit untouched until then.

The site is a multi-surface Mini App - 68 top-level pages + 35 recording pages + the game
pages, 45 edge endpoints. Snapshot:
- Rebrand to ZABAL Gamez + zabalgamez.com is complete and deployed.
- Mini App manifest (`.well-known/farcaster.json`) is **self-hosted and signed** for
  zabalgamez.com (accountAssociation type:auth, FID 19640). Do NOT hand-edit the
  accountAssociation block - re-sign via Farcaster dev tools if the domain ever changes.
  **This is now enforced, not advisory** (2026-09-08): `validate.mjs` pins the signed block by
  sha256 and checks `header.fid`, `header.type` and the payload domain, because a hand-edit of
  `header` or `signature` used to pass - the manifest still parsed, the site still deployed,
  and the Mini App just stopped opening in Farcaster with nothing reporting it. If you re-sign
  deliberately, update `MANIFEST_AA_SHA256` in `scripts/validate.mjs` in the SAME commit so the
  pin always describes a block someone actually signed. `validate.mjs` also fails any
  `vercel.json` rewrite or redirect whose source would shadow `/.well-known/farcaster.json` -
  a catch-all like `/(.*)` or `/:path*` silently unregisters the Mini App.
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
  on builder; Thy Revolution, N3M and **Candy Toybox** (`@CandyToyBoxYT1`) on creator; no
  panel recorded for artist. The creator third seat sat as a literal `null` until Zaal named
  her on 2026-09-07 - it came from him, not from any document, so nothing on disk can confirm
  it and nothing should be "corrected" against a file later. **Not the same person as the
  Candy (Samantha) in the `candy` skill, who owns wavewarz.info** - do not merge the two.
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
- `lead.html` - workshop-lead page: Formspree form. It has **no** Cal.com embed and no
  `CAL_LINK` variable (measured 2026-09-07); the only Cal embed on the site is in
  `info.html`. `CAL_LINK` survives only in `docs/archive/cal-luma-workflow.md`.
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

  **See `api/README.md` for the authoritative per-endpoint contracts.** That currency claim is
  now ENFORCED, not asserted: `scripts/check-api-docs.mjs` (inside `validate.mjs`) fails the
  build if an `api/*.mjs` has no contract heading, or if a documented route has no file unless
  its heading is marked REMOVED. It had drifted both ways - `api/points.mjs` and
  `api/export.mjs` were undocumented, and `daily-cast` kept a live contract for months after
  PR #574 deleted it, surviving the #669/#670 cleanup that existed to remove exactly that claim.

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
- **Scheduling: CLOSED 2026-09-08.** The Cal.com embed and its direct link were removed
  from `/info`; the site now has **no** booking surface, and `/info` points at email or the
  /zabal group for Season 2 instead. Season 1 ended 2026-08-31 and the embed was still
  taking real bookings for workshops nobody would run.
  <!-- RECHECK 2026-10-01: are both event types still bookable? curl -o /dev/null -w %{http_code} -L each URL below. If Zaal has hidden or deleted them this whole paragraph is stale and should say so. -->
  **Two Cal.com event types are still live and still bookable by direct link** -
  `cal.com/zabal-gamez/workshop-session` and `cal.com/bettercallzaal/zabal-games-workshop-slot`
  (both HTTP 200 on 2026-09-08). Turning those off is a **Cal.com dashboard action only Zaal
  can do** - there is no Cal.com API key on the mac, so no session can do it for him. Until
  he does, a direct link still books. Do NOT re-embed either one; when Season 2 has dates,
  make a NEW event type, because these carry Season 1 availability.
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
  intend to merge.
- **You merge your own PRs. Set by Zaal 2026-09-08, in his words: "yes merging was right,
  keep doing it."** This REPLACES the old "the user merges PRs via GitHub" rule, which was
  written when he was doing it. What changed his mind: he said "merged" three times across
  2026-09-07/08 while #672-#675 all measured OPEN with `mergedAt:null` and none of the
  content on `main`, so the site kept publishing a wrong claim about a named person and the
  backup detector stayed unbuilt. The convention was costing more than it protected.
  Bounds, which did NOT change:
  - **Merged is not deployed, and deployed is not running.** Always verify by outcome after
    merging - content actually on `main`, then the live surface, then the thing itself. That
    discipline is what caught the un-merged PRs; it matters more now, not less.
  - Still one PR per finished unit; still never push new work onto a branch whose PR is
    already open (open a fresh branch off updated main instead).
  - Anything genuinely irreversible or outward-facing beyond a normal merge still gets
    confirmed first.
- After a merge, re-sync main before new work. Never reuse a merged branch.

## Validate before pushing (no test suite)
- **One command: `node scripts/validate.mjs`** - runs all four checks below and exits
  non-zero on any failure. A SessionStart hook (`.claude/settings.json`) runs it
  with `--quiet` at the start of every session, so a broken repo state shows up
  immediately. Run it by hand before every push too.
- It covers: every tracked `*.json` parses; every `api/*.mjs` passes `node --check`;
  every classic inline `<script>` in `*.html` compiles; the manifest payload decodes
  to `{"domain":"zabalgamez.com"}` **and its signed block matches a pinned hash**; **per-signal capture**; **re-check dates**; and
  **generated-file drift** (all three below).

## Generated files must match their source - enforced
Six committed files are generated: `recordings/index.json`, `recordings.txt`, the JSON-LD in
`recordings.html`, `data/crm.json`, `crm.txt`, `crm.html`. Two are advertised on the site as
the machine surface (`/recordings/index.json`, `/recordings.txt` - "Structured JSON for
agents"), so a stale one is a wrong answer served confidently to anything that reads them.

`scripts/check-generated.mjs` regenerates, compares, **restores the originals in a `finally`
so the tree is never left modified**, and fails the build on a mismatch. Fix by running the
generator yourself and committing - never hand-edit a generated file.

This could not exist before 2026-09-08, because both generators stamped
`generated: new Date()`. That made every artifact differ from a fresh build **every day
regardless of content**, so a diff could not tell "the data changed and nobody rebuilt" from
"a day passed" - real drift was buried in date noise, and a check on it would have failed
daily and been switched off. Both now derive a `source` hash from their input instead, so
identical input gives identical bytes. Nothing consumed `generated` (checked before removing
it). **Do not reintroduce a build timestamp into a generated file.**

Not covered, deliberately: `scripts/resolve-pfps.mjs` writes `data/pfps.json` from remote
APIs, so its output legitimately changes when those do and cannot be deterministic.

## Time-bound claims must carry a re-check date - enforced
This repo's most expensive recurring failure is not a bug, it is **a claim that stays
true-looking after it stops being true.** PRs #669 and #670 existed entirely to clear six of
them out of these files, and the estate logged six more in a single day on 2026-09-08 -
including a "VPS down" line that had lanes avoiding a working machine for 16 days.

Structure beats intention: enforced rules run near 100%, honour-system rules 3-40%. So this
is enforced. **Any claim about a deadline, an external service, a program or a cycle carries:**

```
<!-- RECHECK YYYY-MM-DD: what to re-verify, and how -->
```

`scripts/check-recheck.mjs` runs inside `validate.mjs`, so it fires on every push and at
every session start. **It fails the build when a date has passed**, warns within 14 days, and
also fails a bare date with no "what to verify" text or an impossible date - a malformed
marker must not read as no marker.

**When it fails, the fix is NOT to bump the date.** Re-verify the claim, correct it if it
changed - at the top, where it is read - and then set the next date. Bumping a date on an
unverified claim reproduces exactly the failure this guards against.

Pick the date for when the claim would actually matter, not a round number. The backup one is
2026-10-24 because the canary should already be shouting by then; silence at that point means
the detector broke, not that the deadline moved.

## Per-signal capture - built 2026-09-08, for Season 2
Season 1 was decided on three signals (open poll on X, charts from live trading, judges
panel) and **the numbers behind all three were never written down while the battles ran.**
They are not private and not disputed - they are gone. Nothing complained at the time,
because nothing was watching.

`scripts/check-signals.mjs` is what complains now, and it runs inside `validate.mjs`, so it
fires on every push without anyone remembering it exists. **A battle whose `status` is
complete/done/settled must have every signal either captured or explicitly marked
`ran:false` with a reason - otherwise validate exits non-zero and the push is blocked.**

- Capture from the room in one line, do not hand-edit the JSON:
  `node scripts/record-signal.mjs builder poll --winner @handle --counts '@a=41,@b=17' --source 'X poll, called on air 01:02:11'`
  `capturedAt` is stamped automatically and `--source` is REQUIRED - a number with no
  provenance cannot be checked later. Nothing is written if any argument is bad.
- A signal that genuinely did not happen: `--did-not-run 'no panel for this battle'`.
  That is a different statement from an empty measurement, and the check treats it as one.
- **`null` means NOT CAPTURED. It never means zero.**
- Season 1's three battles carry `signalsUnrecoverable:true` with a reason and are exempted
  **by name and out loud** - the WARN lines print on every run on purpose, so the hole in
  the record stays visible instead of decaying into "the check passes". Recording a real
  number on a battle clears its exemption automatically.

## 3-month roadmap
The full June -> July -> August prep plan lives in `docs/season-1-roadmap-3month.md` -
every phase task split into `[OWNER]` (DMs, dates, assets) vs `[BUILD]` (repo work), with a
"what ready means" bar per phase. Read it for the arc; the list below is the near-term
owner-action subset.

## What's left (owner actions) - measured 2026-09-07

Season 1 close-out is done. Four of the seven items below were open only because
nobody had measured them; they are now answered. Three need a decision from Zaal.
**Every figure here was measured on 2026-09-07 - the working is in
`docs/season-1-closeout-audit-2026-09-07.md`. Read that before changing a season number.**

1. **CLOSED - the season figures DO reconcile. 31 is correct; do not change it.**
   The old entry here compared 31 projects against 21 KV documents and called it a
   mismatch. That used the wrong store. `GET /api/submissions?feed=projects` returns
   `count: 31` live - 16 rows from the KV board plus 15 seeded builder rows from
   `data/builder-submissions.json` (ghostmintops 7, branth 5, jdwalka 3). The 21
   `zabal:sub:v1:*` documents are prompt answers, not projects: 15 approved / 3 pending
   / 3 draft, of which one is `promptId: wip-test` and two are labelled
   `[QA TEST - please delete]`; none of the three reach the public feed. **15 people**
   is the one soft figure: the feed yields 17 distinct identities, two of which carry no
   usable identity (id 20 has a null builder, id 19's name is a bare URL). 17 minus those
   two is 15. Defensible, but a judgment call, not an extraction.
2. **HALF CLOSED 2026-09-07 - the creator third judge was Candy Toybox** (`@CandyToyBoxYT1`),
   named by Zaal. The `null` in `data/finals.json` was a gap, not a correct empty; it is
   filled, and `/august` names all three. Verified while filling it that **nothing computes
   over the judges array** - both renderers (`august.html`, `live.html`) map it and show a
   null as TBA, and `scripts/check-finals-render.mjs` counts battles-with-a-panel, not
   judges - so no count, average or table was ever computed over two. **Still open: the
   artist battle has no panel recorded at all.** Either one existed and was never written
   down, or it ran on poll and charts alone. Only Zaal closes that; do not guess.
3. **NEEDS ZAAL - per-signal numbers are unrecoverable.** Poll counts and trading figures
   for the three battles are in no store, no data file and no backup. They were never
   captured and cannot be reconstructed. Every surface names who took each signal and
   publishes no margin, which is correct. The live question is only whether Season 2
   instruments them at the time.
4. **CLOSED - Vercel Web Analytics is ON and collecting.** Measured from outside:
   `/_vercel/insights/script.js` returns 200 with 3106 bytes of real runtime, and a POST
   to `/_vercel/insights/view` returns 200. A project with Analytics disabled does
   neither. Six public pages were carrying no tag at all (`august.html` - the canonical
   Finals page - plus `guest`, `links`, `media`, `status`, `wins`); all six were tagged
   on 2026-09-07. Coverage is 65/66 top-level pages; `referrers.html` is a redirect stub
   and correctly has none.
5. **NEEDS ZAAL (dashboard) - Cal.com.** Two booking pages are live and both still accept
   bookings for a finished season: `cal.com/zabal-gamez/workshop-session` (the one the
   site links, from `info.html`) and `cal.com/bettercallzaal/zabal-games-workshop-slot`
   (not linked anywhere). Decide whether to close them or leave them open for Season 2,
   and add handle/topic/format/notes questions to whichever survives. Repo-side there is
   nothing to do.
6. **CLOSED as a triage; the decisions are one tap each.** `git branch -r --no-merged`
   lists 25, which overcounts - a squash merge changes the patch id and the branch keeps
   looking unmerged. Measured: **10 are dead** (fully landed; `ws/home-season1-showcase`
   and `ws/retire-magnetiq-endpoint` were verified by content, not by patch id, and
   nothing is stranded on either), **3 are superseded**
   (`ws/retire-loops-magnetiq-2026-08-27`, `ws/adoptable-seeking-maintainer`, and
   `claude/submissions-org-finals-post-n05sij`, whose 9 commits all move the season to
   the retired loops.house), **4 are byte-identical copies of one thing** - closed PR #584
   SIWE wallet login, at tip `19708ef` - and **6 hold genuinely unlanded work**. The full
   table is in the audit doc.
   **Two branches were deleted 2026-09-07 on Zaal's call** - `ws/sopha-fireside`
   (`c59cf45`) and `rescue/orphan-8668183-azkal-flowstage` (`8668183`), both duplicates.
   Their SHAs are recorded in the audit doc; restore with
   `git push origin <sha>:refs/heads/<name>`. Everything else is untouched.
   **CORRECTED 2026-09-07:** an earlier version of this list said `ws/sopha-fireside` and
   `rescue/orphan-8668183-azkal-flowstage` were the only copy of two recordings. **They
   are not - both sessions are already on `main` and main's copy is strictly better.**
   Sopha is `/recordings/5` (2,762 timestamped words vs the branch's 1,864); AZKAL is
   `/recordings/27` (5,258 words *and* `youtu.be/U_Eubs-2_Yo`, vs the branch's 5,192 with
   no video). Both branches are earlier drafts, and re-landing either is a regression.
   The branch diffs looked like new files only because the slugs differ - **check by
   session (date + presenter) against `data/recaps.json`, never by transcript filename.**
   The gaps at `recordings/21` and `recordings/26` are unallocated numbers, unrelated.
7. **Season 2 prep** - target late November. Ideas and Zaal's pitch-week suggestion are in
   `docs/season-2-ideas.md`. Set nothing public until dates and format exist. Note the
   hard dependency in the next section: late-November prep starts *after* the backup
   switches itself off.

### The one scheduled job, and the date it dies: 2026-11-06

`.github/workflows/kv-backup.yml` is the repo's only scheduled workflow. GitHub disables
scheduled workflows after 60 days of repository inactivity - silently, with no failing run
and no error anywhere.

Measured 2026-09-07: workflow state `active`, last five scheduled runs all `success`. The
last commit by a person on `main` is `9866ae6` (2026-09-06, PR #669); the last commit of
any kind is the workflow's own nightly push, authored `zao-backup` via the default
`GITHUB_TOKEN`. **Counting 60 days from the last human commit gives 2026-11-05, which
today's commit moves to 2026-11-06.** Season 2 prep is targeted at late November, so on
the current plan the backup stops about three weeks before anyone opens this repo again.

Genuinely UNMEASURED: whether the workflow's own bot commits reset that clock. They are
pushed with `GITHUB_TOKEN`, which is widely reported not to count, but the repo cannot
measure that from the inside - so assume they do not and treat 2026-11-06 as real.

When it stops, two things stop: the nightly backup, and the daily authenticated
`/api/export` call that is also what keeps the Upstash free tier warm. Manual saves: hit
"Run workflow" (it has `workflow_dispatch`), or push any commit.

<!-- RECHECK 2026-10-24: the keepalive-canary goes red at 14 days left, so by now it should already be failing runs and emailing. If it is silent, the DETECTOR broke - do not assume the deadline moved. Verify with: gh run list --workflow=kv-backup.yml, and curl https://zabalgamez.com/api/backup-health -->
**There is a detector now, built 2026-09-07, on two legs with different failure modes:**

1. **`keepalive-canary`**, a second job in `kv-backup.yml`. It runs alongside the backup
   (never after it, so a warning cannot mask or block a good backup) and **fails on purpose**
   once the deadline is within 14 days. A failed run is something GitHub emails about, so it
   reaches someone without their remembering to look. This leg only works while the workflow
   still runs - which is exactly the window before it dies.
2. **`GET /api/backup-health`**, an edge endpoint that measures from OUTSIDE the repo, so it
   keeps reporting after the workflow is switched off. Keyless, via the public GitHub API:
   last commit to `backups/kv-latest.json`, last commit by a person, and whether the workflow
   is still `active`. `/status` renders it above the recordings pipeline.

**`measured:false` means blind, and `healthy` is then `null`, never `true`.** `/status` shows
that as UNMEASURED with a dashed border. A check that reports "fine" while it cannot see turns
an outage into a reassurance, which is worse than no check.

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

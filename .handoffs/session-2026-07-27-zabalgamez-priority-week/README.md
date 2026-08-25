# Session handoff - 2026-07-27 06:25
> from mac / zabalgamez main -> to ZOE (cockpit inbox + Bonfire)
> doc: .handoffs/session-2026-07-27-zabalgamez-priority-week/README.md
> chain: sibling:.handoffs/session-2026-07-24-zabal-gamez-vote-live/README.md

ZABAL Gamez is HIGHEST PRIORITY this week. This bundle is the full task list + context. Own it until it works for us to build on.

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below (A through E) before responding.
2. No diff in section C - repo is clean on main. Nothing to apply.
3. Create TaskList entries from section A. These are the "to do" items, grouped by who unblocks them.
4. Use section B as your "why" - do NOT re-litigate decisions captured there (especially: the old-Finals endpoints are LIVE, not dead).
5. Section D = what's in-flight (nothing running).
6. Section E = cold-start map for files, storage, conventions.
7. Once integrated, message back: "Ingested handoff zabalgamez-priority-week. N tasks queued. Ready."

## A. Tasks to absorb (the full ZABAL Gamez board - HIGHEST PRIORITY this week)

### A1. Blocked on an unblock (chase the unblock, then the work is ready)
- [ ] **RK confirms the loops.house Finals page + dates** - THE key unblock. Unblocks the `/finals` rewrite (currently still describes the retired prediction-market model). That one PR also carries the `monthly-winner.mjs` delete + the gaps-doc correction (batched to save a build). Chase RK.
- [ ] **Zaal points at the 3 fireside recordings** - Tyler Stambaugh (Magnetiq), Jonathan Colton (FounderCheck), Pauline & Tako (Los Fomos). Unblocks writing those 3 recaps + finishing `docs/season-1-participants.md`. Ask Zaal for the recording sources.

### A2. Gated - only Zaal can fire (surface + remind, do not attempt)
- [ ] **Clean the live vote (GO-LIVE BLOCKER)** - `/review` -> delete the 3 QA test entries ("QA Test Project - Artist Track", "QA Test Project - Creator Track", "Project 2") -> tap "Reset all votes". Until this is done the vote still has test data in it. Top priority before any real voting push.
- [ ] **Publish the Magnetiq "Social Share" memento** + upload the 8 ZAO brand mementos + the collectible video. Paste-ready copy: `docs/magnetiq-zabal-gamez-collectible-page.md` + `docs/magnetiq-mementos-zao-brands-2026-05-28.md`.
- [ ] **Send the 9 lead DMs** - thank-you + "need help submitting?" Drafts in `~/.zao/clipboard` (slug zabal-lead-outreach).
- [ ] **Export the submitter -> handle list** from KV (for the Aug 31 Unlock drop / participant list).
- [ ] **Decide the per-track winners** (artist / builder / creator) after the finale - feeds `/winners` + `data/season-1-results.json`.

### A3. Owner actions (Zaal, near-term - from CLAUDE.md "What's left")
- [ ] **Cal.com booking questions** - add handle/topic/format/notes to the event so bookings arrive with context.
- [ ] **Six confirmed leads still need a date** - Tyler, Thy Revolution, Duo Do, Jonathan Colton, kmac.eth, Plat0x.
- [ ] **Enable Vercel Web Analytics** in the dashboard (the `/_vercel/insights/script.js` tag is already on every page).
- [ ] **POIDH bounty** - wrap "Best ad for ZABAL Gamez" + launch the new two-week bounty. Copy: `docs/poidh-bounty-best-ad.md`.
- [ ] **Announcements (yerbearserker first-workshop + Day 0)** - ON HOLD per Zaal. Leave until he lifts it.

### A4. Site/code (mostly blocked or batched - do NOT open standalone PRs)
- [ ] **`/finals` full rewrite** to the loops.house model + wire the real loops link + lock August dates in `docs/august-finals-loops-format.md`. BLOCKED on RK (A1).
- [ ] **Qualification signal** - "July submitters auto-qualify" is not shown anywhere. Add a badge on `/submissions` or a "who qualified" list on `/finals`, derived from the July board.
- [ ] **`/winners` per-track structure + frozen Season 1 results** - scaffold already exists (`results.html` + `data/season-1-results.json`, empty state). Populate after Aug 31.
- [ ] **Delete `monthly-winner.mjs`** (orphaned cron, 0 consumers, Zaal said remove) - HELD, batch into the finals-rewrite PR. Do not build for one file alone.

### A5. ZOE's standing lane
- [ ] **ZOL posts ZABAL Gamez 3x/day** + the daily "what's on" cast, as @zolbot (draft-first). Posting is 100% ZOE/ZOL's - never add posting to the site.
- [ ] **Cost mode** - the ZAODEVZ Vercel account is OVER its free tier. Batch work into FEWER, larger PRs. No per-tiny-change PRs, no self-referential/doc-churn PRs. PR to main only, never push direct.

## B. Why - decisions + pivots + ruled-out paths (do not re-litigate)

- **Old-Finals endpoints are LIVE, not dead.** Verified this session: `/api/builds` (enter.html, board.html, quest.html), `/api/register` (enter.html + miniapp.js), `/api/build-vote` (miniapp.js), `/api/finals-picks` (finals.html) all have live consumers. `/enter` + `/board` run the July building-in-public board on them RIGHT NOW (we are in the July open-build phase). The gaps doc guessed "likely dead" - that guess was WRONG. Do NOT retire them; retiring breaks 4 live pages. This is the single most important thing to not re-discover.
- **Only `monthly-winner.mjs` is a clean orphan** (cron retired, 0 consumers). `commit-watcher.mjs` is orphaned-cron but load-bearing (it's `register`'s ownership-proof / Bonfire push) - keep it. `workshop-reminders.mjs` is a harmless manual push tool - keep it.
- **Held the `monthly-winner` delete instead of PR-ing it now** because the Vercel account is over budget and a single-file delete is not worth a dedicated build. Batching it into the finals-rewrite PR so one build carries multiple units.
- **Curated slate is retired** - the vote runs quadratic on ALL submissions (board + seed builders in `data/builder-submissions.json`), not a curated slate. One ballot per Farcaster FID, 100 credits/track, N votes cost N^2.
- **Auto-accept (post-moderation) model** - `/submit` auto-accepts onto `/submissions` immediately; moderation is delete-after via `/review`. No approval queue. Low-quality entries just get no votes.
- **Admin = Farcaster FID allowlist** (`lib/auth.mjs`: 19640 zaal, 1057869 imanafrikah) + optional `ADMIN_KEY` fallback. Chosen over a shared password because the repo is public.
- **Posting is fully ZOE/ZOL's** - Zaal confirmed: do NOT build posting on the site, do NOT set a signer, delete any posting/cast code. `daily-cast.mjs` deleted, all 5 Vercel crons retired.
- **Finals moved to loops.house + WaveWarZ** (spec: `docs/august-finals-loops-format.md`). July submitters auto-qualify -> 2 weeks of weekly per-track tasks -> top 2 per track -> 3-5 WaveWarZ battles -> one winner per track. The old on-site Finals stack predates this.
- **Storage = Upstash Redis over REST** (not Supabase). Env: `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Not available locally (Vercel-only), so vote/KV writes can only be done from the deployed site or by Zaal - a friction source: the test-data reset had to become a `/review` button because it cannot be run from a mac.
- **Known unfixed bug (flagged, not fixed):** `qv-vote` vote tally is non-atomic (HGET then ZINCRBY) - concurrent ballots can over-count. Fix is atomic Lua; not "easy", left for a real PR.

## C. Git state
- Branch: `main` (clean, even with origin)
- HEAD: `a380007 docs: overnight brand audit report + one copy fix (#581)`
- Uncommitted diff: none
- Untracked: `.handoffs/` folders (this bundle + the 2026-07-24 sibling) - draft artifacts, not committed
- 0 open PRs. All overnight work merged.

## D. In-flight
- Background bash jobs: none
- Subagents pending: none
- Scheduled wakeups: none
- Open AskUserQuestion: none

## E. Cold-start map (read if you are confused)

- **What this is:** ZABAL Gamez = The ZAO's 3-month Build-A-Thon (June workshops / July open build / August Finals). Static HTML + inline scripts + Vercel edge functions, no npm/build. Also a Farcaster Mini App. Domain `zabalgamez.com`. Repo `zaodevz/zabalgames`.
- **The core loop (LIVE + correct):** `/submit` -> auto-accept -> `/submissions` board -> `/vote` (quadratic on all) -> share. Admin moderation + vote reset on `/review`.
- **Load-bearing files:** `api/qv-vote.mjs` (vote), `api/submissions.mjs` (board), `lib/auth.mjs` (admin FID allowlist), `vote.html` / `submit.html` / `submissions` / `review.html`, `assets/miniapp.js` (Mini App SDK + window.ZABAL helpers), `data/builder-submissions.json` (seed candidates), `data/vote-candidates.json` (on/off switch).
- **July-build stack (LIVE - do not touch):** `/enter` + `/board` + `/quest` on `api/builds` + `api/register` + `api/build-vote`; `/finals` on `api/finals-picks`.
- **Validate before any push:** `node scripts/validate.mjs` (JSON parses, api/*.mjs `node --check`, inline scripts compile, manifest decodes). A SessionStart hook runs it `--quiet`.
- **Git conventions:** always `git fetch origin --prune` + `git pull --ff-only origin main` at session start. Branch `ws/<name>` off main. Confirm the branch's PR is OPEN before every commit (`gh pr view <branch> --json state,number`). Push ALL commits THEN open the PR. Never reuse a merged branch. PR via `gh api -X POST repos/zaoDEVZ/zabalgames/pulls --input <json>` (REST, more reliable than gh pr create).
- **Cost constraint (new this week):** ZAODEVZ Vercel over free tier. Every push = a build. Batch into fewer, larger PRs.
- **Docs to read for depth:** `CLAUDE.md` (canonical state), `docs/august-finals-loops-format.md` (Finals plan), `docs/august-readiness-gaps.md` (gaps - note its "likely-dead endpoints" section is now CORRECTED by section B above), `docs/brand-audit.md` (brand verdict: excellent), `docs/season-1-participants.md`, `api/README.md` (endpoint contracts).
- **Skills invoked this session:** `clipboard` x3 (ZOE recaps), `handoff` x1 (this bundle).
- **Memory writes:** none this session.
- **Last-known mental model:** The core submit->vote loop is live and clean; brand + config are healthy; 0 open PRs. Everything remaining is either blocked on RK (loops page), gated on Zaal (vote cleanup, DMs, Magnetiq, winners), or batched (monthly-winner delete rides the finals rewrite). The one landmine: do not act on the "retire old-Finals endpoints" hypothesis - they're live.
- **Open questions for the receiver:** (1) Has RK sent the loops.house page yet? (2) Which fireside recordings can Zaal share first? (3) Has Zaal run the `/review` vote cleanup?

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at /Users/zaalpanthaki/Documents/zabalgamez/.handoffs/session-2026-07-27-zabalgamez-priority-week/README.md and follow receiver instructions at the top. ZABAL Gamez is highest priority this week - ~18 tasks to absorb.
```

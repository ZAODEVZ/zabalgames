# ZABAL Gamez - Season 2 ideas (from the overnight audit)

Ideas only, grounded in the S1 codebase. Not a build list - a menu for after Aug 31.

**Season 2 prep opened 2026-09-08.** Items are being worked in one order only: **anything that
needs no decision from Zaal, first.** Season 2 still has no dates, format or theme and none may
be set here. Item 2 is done because it was a correctness bug in the voting path, not a design
choice - see below.

## What worked in Season 1
- **The core loop is simple and correct.** `/submit` -> auto-accept (`api/submissions.mjs`)
  -> `/submissions` board -> quadratic `/vote` (`api/qv-vote.mjs`) -> share modal. Post-moderation
  (delete-after via `/review`) removed the approval bottleneck.
- **Farcaster-native identity.** Quick Auth (`lib/auth.mjs`), one-ballot-per-FID, FID admin
  allowlist - no separate accounts, no passwords.
- **The content system.** `/recordings` + `/recaps` + `/speakers` + transcripts captured 31 of
  34 workshops (see `docs/fireside-recap-gap.md`).
- **Magnetiq collectible** pulled 66 holders (`docs/778-magnetiq-flow-capabilities.md`).

## What to change in Season 2
- **Distribution was the bottleneck, not features.** The vote went live with ~0 real voters
  because the posting/DMs/memento were drafted but not fired. S2: distribution-first, and
  posting owned by ZOL from day one (already the model now).
- **Too many surfaces.** S1 grew to 60 pages; the nav had to be trimmed (`assets/site-nav.js`).
  S2: fewer pages, each deeper. Kill or consolidate the game experiments.
- **The Finals format churned** (prediction market -> mentor 24h -> loops.house). Lock the
  Finals format before the season opens (`docs/august-finals-loops-format.md` is the current one).
- ~~**Test data polluted the live vote.**~~ **DONE 2026-09-08.** `lib/test-fixtures.mjs` is now
  the single source and detects fixtures by **MARKER, not by id** - a `[QA TEST` / `[TEST]` /
  `[FIXTURE` prefix anywhere in the text, a `wip-test`/`*-test` promptId, or an explicit
  `test: true`. So a newly-seeded QA row is excluded the moment it exists, with no code change.
  It replaced two hand-maintained denylists of the same fact in **two different key formats** -
  `new Set(['5','6'])` in `api/submissions.mjs` and `new Set(['artist:5','creator:6'])` in
  `api/qv-vote.mjs`, the second also requiring you to know the row's track. Seed a fixture,
  remember one file, and it was votable; one had already reached **#2 on the public artist
  standings**. `scripts/test-test-fixtures.mjs` covers 27 cases, including the load-bearing one
  (a brand-new id in no denylist is still excluded) and the negative control (the same id
  *without* a marker is not) plus words that merely contain "test" - latest, contest,
  testimonial, "Testing Framework" - which must not be swept up.
  **The durable fix is still deleting the three rows at `/review`.**

## Pitch week - Zaal's own note, 2026-09-04

> "One big suggestion was adding a full pitch week where the people get an
> opportunity to practise pitching their projects so they aren't doing it for the
> first time during the Finalz."

**The problem it solves.** In Season 1 the Finals were the first time most
finalists had presented their work out loud. The artist and creator battles ran
inside a one-hour Space and the builder battle closed with one, so a finalist got
a single unrehearsed shot in front of the judges and the poll.

**Shape.** A pitch week sits between the board closing and the Finals - Season 1's
gap was 2026-08-16 to 2026-08-24, so the slot already exists in the calendar and
nothing has to move to make room.

**SETTLED 2026-09-08 by Zaal: everyone pitches, recorded, judges give notes, non-scoring.**
The full format, what each answer costs, and how it is built out of the existing recordings and
comment systems is in [`season-2-pitch-week.md`](season-2-pitch-week.md). The four points below
are kept as the record of what was open, not as live questions.

Points that were open before it was built:
- **Who pitches.** Everyone on the board, or only the finalists once the cut is
  made? Opening it to everyone makes the cut better informed; limiting it to the
  six makes it rehearsal rather than competition.
- **Live or recorded.** A Space is closest to the real thing, which is the point.
  A recorded upload scales better across timezones - Season 1 spanned EDT, BST,
  CEST, CAT, WAT and IST.
- **Feedback, and from whom.** Judges giving notes in pitch week means they have
  seen the work before they score it. That may be the feature or the flaw; decide
  deliberately, because it changes what the Finals measure.
- **Does it count.** Keep it explicitly non-scoring unless the format says
  otherwise, so nobody is penalised for treating a rehearsal as a rehearsal.

**Cheapest version.** One Space in the gap week, open mic, three minutes each, no
scoring, recorded and dropped into `/recordings` like any other session. That
reuses the whole existing recording pipeline and needs no new page or endpoint.

## Concrete ideas (grounded, cited)
1. **Public activity feed** - voter + project + shares in one live tab (Zaal asked for this).
   Build on `api/activity.mjs`; requires flipping ballots public. Social proof is the missing
   engagement layer.
2. ~~**Fix the vote race condition**~~ **DONE 2026-09-08.** The read-modify-write is still
   there, but the published standings no longer read the ZSET it maintains - `?results` now
   derives totals from `qv:ballots:<track>`, which is authoritative and whose per-field HSET is
   atomic. Chose that over Redis Lua because it needs no new mechanism, is testable without an
   Upstash instance, and self-heals any tally already corrupted.
   **The ZINCRBY writes were deliberately left in place**: the nightly backup's completeness
   check requires `qv:tally:*` keys to exist, so deleting them would have failed the backup -
   a coupling worth knowing before anyone "finishes the job" by removing the ZSET.
   Severity was worse than over-counting: `qv:ballots` still showed one legitimate ballot, so an
   inflated tally was invisible in the audit trail. `scripts/test-qv-tally.mjs` reproduces the
   race (three concurrent identical ballots of 3 -> ZSET reads **9**) and proves the derived read
   returns 3 anyway.
3. **Submitter identity on the board** - the public `/submissions` feed hides handles
   (`publicView` in `api/submissions.mjs`), so the board and the Unlock-drop compile can't see
   who built what. S2: show an opted-in handle per project.
4. **Track balance** - artist/creator vote tracks sat empty until real submissions came in
   (`api/qv-vote.mjs` `loadCandidates`). S2: recruit per-track, or seed each track.
5. **"Your season" page** - per-handle view of your submissions + votes + collectible, off
   `profile.html` / `p.html`. Gives each builder a shareable identity artifact.
6. ~~**Invisible referral that counts real submitters**~~ **DONE 2026-09-08.** The plumbing
   existed (`withRef` already appends `?ref=` to shared links) but the two things that define the
   design did not: it credited on **authentication** - a connect, the metric explicitly ruled out -
   and it served a **public, unauthenticated** top-referrers board at `?board=top`, which is the
   farm bait the decision exists to avoid. Neither `submit.html` nor `api/submissions.mjs` touched
   a ref at all, so no submission carried attribution.
   The measurement that decided the shape: **0 of 21 Season 1 submissions carry a fid**, so
   fid-based attribution would have credited nobody. The ref now travels *with the submission* -
   `submit.html` reads `?ref=` and holds it in `sessionStorage` (not `localStorage`, so a stale ref
   cannot attach weeks later from an unrelated visit), and a successful submit does
   `SADD zabal:ref:submitters:<ref> <id>`. Self-referral is refused. `?board=top` is admin-gated
   now and ranks by **submitters**, keeping connects only for comparison - kept rather than deleted
   so Zaal can still read it, closed so nobody can farm it. Nothing rendered it (grepped first).
   Two consequences found by checking rather than assuming, both fixed: `ownerView` spreads the raw
   row and only deleted three fields, so the ref was being returned to the submitter; and the
   nightly backup commits submission rows **whole** into this public repo, so `redact-export.py`
   now drops `zabal:ref:*` keys **and** strips the inline `ref` field at any depth - a referral is
   a social-graph edge neither party published. `scripts/test-referral.mjs` (20 assertions) and
   three new cases in `test-redact-export.mjs` pin all of it.
7. **loops.house-native weekly-task engine** - if loops does not host the weekly tasks, the
   site needs a task surface + per-track weekly submissions. Decide with RK before building.
8. ~~**Consolidate the arcade**~~ **DONE 2026-09-08 - retired, not folded.** Zaal: "kill the
   arcade experiments, keep 2048". There were **18** game pages, not the three this item listed -
   bee, dash, echo, groups, letterbox, memory, mini, pips, snake, stack, strands, sudoku, tiles,
   vertex, word, zao-trivia and build-quiz alongside 2048. Measured before deleting: **all 17 had
   zero stored scores**; `zabal:game:all:zao2048` was the only board with players (2). So this was
   retiring dead surface, not choosing between live ones.
   `GAMES` in `api/game.mjs` is trimmed to `zao2048`. Dead links removed from the homepage,
   `/daily`, `/play`, `/game` and 2048's own chips, and the `/quiz` redirect went with its target.
   **Scoped to `game/*` deliberately** - `/pops` and `/quest` are named features in their own
   right, not arcade experiments, so they were left alone. Reverse that reading if it was wrong.
   `data/zao-trivia.json` is kept but marked orphaned: a curated question bank is worth more than
   the space it takes.
   One thing this surfaced: nothing checked that a redirect's destination exists, so `/quiz`
   pointed at a page I had just deleted. `validate.mjs` now fails on any unresolvable
   redirect/rewrite destination - a redirect is a promise about a URL, and deleting a page is
   exactly when it gets broken.
9. **Season-over-season standings** - reuse `api/empire-leaderboard.mjs` (Empire Builder) so a
   builder's S1 + S2 record accrues, not resets.
10. **Sponsor tiers** - the $500 pool is one sponsor (ZAO festivals). A sponsor tier on the
    loops page + `/press` kit could grow the v1 pool (open invite already in `llms.txt`).

## Do not repeat
- Building surfaces before distribution exists.
- Mixing test data into live state.
- Leaving two competing models live at once (the on-site Finals stack vs loops.house right now).

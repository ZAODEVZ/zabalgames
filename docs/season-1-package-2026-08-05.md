# ZABAL Gamez - Season 1 package (close-out record)

Date: 2026-08-05. Owner: Zaal. This is the bow-tie on Season 1: the July open build is
closed and the whole site is reconciled to one coherent state - **June workshops done ->
July build closed -> August Finals underway** (curated build month on loops.house +
WaveWarZ, canonical spec at `/content` and `docs/august-finals-loops-format.md`).

## Phase truth (as of Aug 2026)
The Finals are LIVE now, so Season 1 is not "over" - it is in its culminating phase.
Everything funnels to the Finals. Winners/results stay pending until the WaveWarZ battles
settle.

## What was closed
- **`/submit`** - closed state; `api/submissions.mjs` refuses new public creates
  (`SUBMISSIONS_OPEN` flag, default closed). Edits/publish/moderation + trusted operator
  ingest still work, so Finals Week 1 final touches are unaffected. Reopen: env
  `SUBMISSIONS_OPEN=true`.
- **`/enter`** - July wallet/repo registration + building-in-public vote board removed;
  replaced with a closed state routing to the Finals, the board, and voting. The stale
  "mentors pick" + prediction-market copy went with it.

## What was reconciled (Finals phase, no old prediction-market format)
- **`index.html`** - hero eyebrow "August Finals underway"; primary CTA -> `/content`;
  join button -> "See the Finals"; proof badge "August Finals underway"; goal strip and
  meta descriptions updated; path cards drop "Top 8/Top 16" + "trade on Base" for the
  $500 tiered pool + WaveWarZ battles; countdown default shows "Finals / this month" (JS
  already resolves this in August).
- **`finals.html`** - hero rewritten to the loops.house + WaveWarZ format; banner now
  points to `/content` as canonical. (Old prediction-market write-up kept below as
  reference, clearly marked.)
- **`finals/live.html`** - hero + status banner reframed as the WaveWarZ battle finale,
  awaiting finalists; points to `/content`. (Trade-view scaffold left in place, marked as
  not how Season 1 settles.)
- **`winners.html`** - hero + finisher copy rewritten: one winner per track, $500 tiered
  pool, weekly tasks -> WaveWarZ battles. "Awaiting Finals" placeholders are correct (no
  winners yet).
- **`about.html`** - WaveWarZ card now "powers the battle finale"; open-invitations list
  drops "Trade on the Finals battles" for "Watch the WaveWarZ Finals battles".
- **`data/daily-updates.json`** - new newest entry (2026-08-01) marks the July close +
  Finals kickoff, replacing "Put yours in / Submit your build" as the latest word.
- **`CLAUDE.md`** - Current status rewritten to the packaged Season 1 state.

## Status flags (intentional, left as-is)
- `data/finals.json` `status:pending`, `settled:false` - correct; finalists/winners lock
  after the two weeks + WaveWarZ battles.
- `data/season-1-results.json` `status:pending` - correct; winners TBD.
- `data/season.json` - accurate structured data (submissionDeadline 2026-07-31, Finals
  2026-08-01..31). No change.

## Owner decision still open
- **`data/vote-candidates.json` `status:"open"`** - the quadratic vote at `/vote` is the
  active Finals-Week-1 feedback/vote mechanic, so it was LEFT OPEN. Flip to `"closed"` in a
  one-line PR when voting should end. This is the one live switch that is a judgment call,
  not a cleanup.

## Remaining long tail (not blocking; cosmetic or deep-copy)
These land on already-closed/coherent pages, so nothing is broken - but for a spotless
finish:
1. **`info.html`** ("All the Details") still carries extensive old-format passages -
   "24h build / promote / vote", "Top 8 USDC / Top 16 $ZABAL", "prediction market",
   sealed-prompt timeline, "Sign up" Formspree mentor form, Cal.com embed. This is the
   single biggest remaining rewrite; worth a dedicated pass to match `/content`.
2. **Site-wide footer nav** - `Enter the Build` -> `/enter` and `Finals Live` ->
   `/finals/live` appear on ~40 pages. Both destinations are now reconciled closed/Finals
   states, so the links are coherent; relabeling to "Finals" is polish, not a fix.
3. **Scattered body CTAs** - "register a build" / "Submit a project" / "Join the build" on
   many secondary pages (`bounties`, `build-days`, `live`, the `game/*` footers, etc.)
   point to the now-closed `/submit` or `/enter`, which explain themselves. Relabel to
   "See the Finals" as a follow-up sweep.
4. **Ongoing-cadence engagement** - `/play` + `game/*` monthly leaderboards, `game/zao-trivia`
   weekly pot, `/pops`, `/dream-leads`, `/bounties` (July deadline). These are evergreen
   engagement, not Season-1 entry loops; leave running unless you want them frozen for the
   season.

## Companion doc
`docs/finals-week1-submitter-spotlights-2026-08-05.md` - the July submitter roster per
track, one Firefly spotlight post per submitter (tagged), and the loops.house Week 1
"final touches" announcement.

# ZABAL Gamez - Season 2 ideas (from the overnight audit)

Ideas only, grounded in the S1 codebase. Not a build list - a menu for after Aug 31.

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
- **Test data polluted the live vote.** S2: a staging/test mode or a test-tag that the feeds
  and `qv-vote` exclude, so QA never mixes with real candidates.

## Concrete ideas (grounded, cited)
1. **Public activity feed** - voter + project + shares in one live tab (Zaal asked for this).
   Build on `api/activity.mjs`; requires flipping ballots public. Social proof is the missing
   engagement layer.
2. **Fix the vote race condition** - the read-modify-write in `api/qv-vote.mjs` (HGET then
   ZINCRBY, non-atomic) can over-count concurrent ballots. Make it atomic (Redis Lua). Do this
   before any high-stakes vote.
3. **Submitter identity on the board** - the public `/submissions` feed hides handles
   (`publicView` in `api/submissions.mjs`), so the board and the Unlock-drop compile can't see
   who built what. S2: show an opted-in handle per project.
4. **Track balance** - artist/creator vote tracks sat empty until real submissions came in
   (`api/qv-vote.mjs` `loadCandidates`). S2: recruit per-track, or seed each track.
5. **"Your season" page** - per-handle view of your submissions + votes + collectible, off
   `profile.html` / `p.html`. Gives each builder a shareable identity artifact.
6. **Invisible referral that counts real submitters** - bake a ref into the share flow
   (`assets/miniapp.js` withRef already does the plumbing); count who actually submitted, no
   public leaderboard (avoids farm bait).
7. **loops.house-native weekly-task engine** - if loops does not host the weekly tasks, the
   site needs a task surface + per-track weekly submissions. Decide with RK before building.
8. **Consolidate the arcade** - `game/2048`, `game/build-quiz`, `game/zao-trivia`, `/pops`,
   `/quest` are separate experiments. Fold into one arcade hub, or retire the unused ones.
9. **Season-over-season standings** - reuse `api/empire-leaderboard.mjs` (Empire Builder) so a
   builder's S1 + S2 record accrues, not resets.
10. **Sponsor tiers** - the $500 pool is one sponsor (ZAO festivals). A sponsor tier on the
    loops page + `/press` kit could grow the v1 pool (open invite already in `llms.txt`).

## Do not repeat
- Building surfaces before distribution exists.
- Mixing test data into live state.
- Leaving two competing models live at once (the on-site Finals stack vs loops.house right now).

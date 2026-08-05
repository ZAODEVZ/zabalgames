# ZABAL Gamez - Season 2 readiness + brand organization

Date: 2026-08-05. Owner: Zaal. This is the S1 -> S2 handoff: what closed, what carries,
what resets, and the canonical brand/site map so Season 2 starts clean. The idea menu is
`docs/season-2-ideas.md`; this is the plan on top of it.

## Where Season 1 landed
- June workshops delivered + archived. July open build ran and CLOSED. August Finals are
  running out on **loops.house** (loops.house is the host + leaderboard; WaveWarZ battles
  are the finale). One winner per track, $500 tiered pool.
- On-site competition loops are CLOSED: `/submit`, `/enter`, and the `/vote` quadratic vote
  (`data/vote-candidates.json` = `closed`). The site is now the **brand home + Season 1
  record + funnel to loops.house**, not the live competition venue.

## The season now lives on loops.house
Participation, leaderboard, and the Finals run on loops.house. The site's job is:
1. Tell the story + the format (`/content` is canonical, `/` leads there).
2. Hold the Season 1 record (`/submissions`, `/recordings`, `/recaps`, `/vote` final
   results, `/winners` once settled).
3. Funnel newcomers to loops.house + the `/zabal` channel.

## Carries into Season 2 (reuse, do not rebuild)
- **Core loop code:** `api/submissions.mjs` (auto-accept), `/submissions` board,
  `api/qv-vote.mjs` (quadratic vote), the share modal. All gated by simple flags
  (`SUBMISSIONS_OPEN`, `vote-candidates.json` status) - flip to reopen for S2.
- **Farcaster-native identity:** Quick Auth (`lib/auth.mjs`), one-ballot-per-FID, FID admin
  allowlist.
- **Content system:** `/recordings` + `/recaps` + `/speakers` + transcripts + comments.
- **Data-driven surfaces:** `data/season.json`, `data/workshop-leads.json`,
  `data/finals.json`, `data/season-1-results.json` - reusable shells for a new season.
- **Magnetiq collectible** + the `/zabal` channel + newsletter distribution.

## Resets for Season 2 (owner + build)
- **Lock the Finals format before opening** - S1 churned (prediction market -> mentor 24h
  -> loops.house). `docs/august-finals-loops-format.md` is the locked one; start S2 there.
- **Distribution-first** - the S1 vote opened with ~0 real voters because posting/DMs were
  drafted but not fired. S2: posting owned by ZOL from day one.
- **Fewer, deeper surfaces** - S1 grew to 60+ pages. Consolidate or retire the game
  experiments and the retired Finals stack (`/finals`, `/finals/live`, `/leaderboard`,
  `/projects` prediction-market lineage) before S2.
- **Test-data isolation** - a staging/test tag the feeds + `qv-vote` exclude, so QA never
  pollutes the live board (it did in S1).
- **New-season data:** clone `data/season.json` to Season 2 dates; reset `finals.json` +
  `season-1-results.json` shells to a `season-2-*` set; keep S1 files as the record.

## Brand organization - canonical map (post-cleanup)
Keep the naming tight (no "WaveWarZ-Base"; it is **WaveWarZ**). Canonical surfaces:
- **Home:** `/` (index) - leads with the current phase + funnels to `/content` + loops.house.
- **The season:** `/content` (canonical Finals/"This Month"), `/submissions` (the builds),
  `/vote` (final S1 results), `/winners` (once settled).
- **Details:** `/info` (all the details), `/playbook`, `/about`.
- **Content:** `/recordings`, `/recaps`, `/speakers`, `/spaces`, `/farcaster-batches`.
- **Record/ops:** `/status`, `/crm`, `/changelog`, `/context`, `/install`, `/press`.
- **Reference-only (retired mechanic, kept behind current heroes):** `/finals`,
  `/finals/live` now describe the WaveWarZ battle finale and point to `/content`.
- **Closed loops:** `/submit`, `/enter` (closed states -> Finals).

## Remaining brand smoothing (follow-ups)
- **`data/bonfire-graph.json`** still carries the retired "WaveWarZ-Base settlement" nodes -
  regenerate from the ZAOOS research source (node IDs are load-bearing edge keys).
- **Nav/footer trim** - consolidate the ~60-page surface down for S2; the footer "Season"
  column still lists the retired Finals stack.
- **Games layer** - `/play` + `game/*` monthly boards, trivia weekly pot: decide keep-as-
  evergreen-arcade vs freeze for the off-season (left running for now).

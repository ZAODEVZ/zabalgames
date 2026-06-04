# Audit decisions - 2026-06-04

Resolutions to the backend/policy gaps raised in the activity-backend audit, plus
the YouTube-post decisions for Workshop 1. Point-in-time record; where these change
current behavior, CLAUDE.md and `api/README.md` are the live source of truth.

## YouTube post - Workshop 1 (Empire Builder)
1. **Title:** "Don't Launch a Token Yet - From Dream to Empire".
2. **SEO:** crypto/web3/onchain jargon allowed in the tags + description for search
   (YouTube is a search engine); brand copy everywhere else stays clean per the
   no-jargon rule.
3. **Visibility:** Unlisted - share with yerbearserker first, flip to public later.
4. **Thumbnail:** owner-supplied.
5. **$ZABAL empire link:** owner to paste the empirebuilder.world link into the
   description.

## Backend / policy
1. **Leaderboard gaming:** leave open for now. Nothing of value rides on rank;
   revisit only if abused. No code change.
2. **Join re-fire:** make the side-effects idempotent. The join COUNT was always
   idempotent (per-FID hash, counted with HLEN); the +5 score and the `signup`
   activity entry now fire only on a FID's first join. Daily presence still
   re-asserts every tap. (`api/join.mjs`, response gains `firstJoin`.)
3. **July judging:** hybrid - community vote (Farcaster / app leaderboard)
   shortlists, mentors pick final winners per track. July build; ties into the
   workshop idea of pulling the app leaderboard into Empire.
4. **Register spoofing:** require ownership proof. Enforced at the
   `api/commit-watcher.mjs` trust boundary: before pushing a repo's commits, the
   repo must contain the registrant's wallet in a known file (`ZABAL.md`, then the
   README). Unverified repos are skipped, never pushed.
5. **Repos per builder:** allow many, tracked per identity. `zabal:builds` is now
   { wallet -> JSON array of repos } (de-duped; legacy single-string still read).
6. **Identity anchor:** FID is the anchor when present. Reconciled with the
   "any harness" rule via a hybrid: `api/register.mjs` stays wallet-keyed and
   auth-free, but an OPTIONAL Quick Auth token links the wallet to a verified FID
   (`zabal:builds:fid`). An absent/invalid token never blocks submission.
7. **Public count:** keep "100+" static per the brand rule. The honest unique-join
   set lives server-side; the public surface shows the floor copy, not a number.

## Builder convention (from #4)
Builders prove repo ownership by committing their wallet address into the repo - in
`ZABAL.md` at the repo root (preferred) or the README. The commit-watcher checks
this before trusting a registration. The external builder skill should write that
file as part of the register step.

## Follow-ups not built here
- July submission gallery + the hybrid judging mechanism (July decision; team is
  out of free Supabase project slots - revisit then).
- Exposing the app leaderboard as an API endpoint to feed an Empire leaderboard +
  boosters; optional weekly NFT drops to the top of the leaderboard.

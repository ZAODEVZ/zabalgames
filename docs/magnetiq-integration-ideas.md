# Magnetiq - more ways to weave it into ZABAL Gamez

Magnetiq is a no-code platform for "Magnets" - digital memberships (on-chain NFTs) that add
utility on top of collectibles, plus UGC prompts, claim codes, and incentives. So the ZABAL
Gamez magnet (collect.zabalgamez.com) should be more than a signup - it's the **membership +
collectible spine** that ties together everything on the site (recordings, speakers, builds,
mentoring, the players board).

## The big idea: the magnet is the season passport
Register once, then **collect a memento for each milestone** and complete the set. This turns
a one-time signup into the engagement loop that pulls people back all season and feeds the
players board.

Milestone mementos:
- Registered (you're in the Gamez)
- Watched a workshop / attended live
- Left a thought or asked a question on a recording
- Entered a July build
- Mentored a builder
- Finished (the commemorative finisher collectible, already promised)

## Concrete integrations (prioritized)

### Now - cheap, high-leverage
1. **"Collect this session" on every recording.** Each workshop = a claimable memento; put
   the CTA on `/recordings/N` and `/speakers`. Completing all = a season badge. On-brand with
   the arcade "Insert Coin" framing, and it rewards watching.
2. **Add the targeted UGC prompts** (the data questions in `magnetiq-next-2026-06-14.md`) so
   the magnet is the structured-data funnel (track, handles, what they'll build, favorite session).
3. **Say it's on-chain.** People did not know the collectibles are on-chain - add that to the
   collect CTA and the magnet copy (confirm the chain - Flow per Magnetiq's docs, Base was
   mentioned in the Tyler call).

### This month
4. **Claim codes tied to on-site actions.** Reward a code/collectible for: topping the 2048
   leaderboard, sharing, attending live, or getting a UGC approved (Tyler's approval-trigger
   flow). Wire to the existing activity backend / players board.
5. **Speaker collectibles.** Each speaker gets a commemorative memento; "claim your speaker
   collectible" + show it on their `/p` profile. Thank-you + flex that pulls them to share.
6. **A `/collect` surface (or homepage strip).** Show the season's mementos + claim CTAs in
   one place, with the on-chain note. Makes the collectible set visible and completable.

### July / August
7. **Finisher collectibles** wired to `/enter` and `/finals` - everyone who ships claims one,
   paired with the $500 pool. The collectible becomes proof-of-finish.
8. **Magnet as the membership gate.** Magnets are memberships - use holding the ZABAL Gamez
   magnet to gate perks: the private channel, early Luma access, mentor matching.

## Why this is the right move
- It uses what Magnetiq is *for* (memberships + utility + collectibles), not just its form.
- It dogfoods a ZAO product on the season's flagship project (the stated goal).
- Every collectible is a share surface and a reason to return - it compounds the content.
- It connects the pieces already built (recordings, speakers, players board, the game) into
  one loop instead of separate pages.

## To confirm before building
- Which chain the ZABAL Gamez magnet collectibles are on (Flow vs Base).
- Whether Magnetiq exposes a claim/membership-check API we can read server-side (to gate
  perks or award the players board), or whether it stays claim-code + UGC based for now.

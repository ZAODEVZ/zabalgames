# diviflyy session prep - Empire Builder V3, the technical convo

**When:** Tue Jun 16 2026, 12pm EST. Livestreamed and recorded. RSVP: https://luma.com/kaz6hnm4
**Guest:** Adrian, a.k.a. diviflyy (@diviflyy, fid 369863). Builder track.
**Format:** Conversation, livestreamed and recorded.
**Ask:** Empire Builder V3 - a working conversation on the V3 endpoints for an existing empire
plus the leaderboard, and optionally deploying a new empire.

This is the **technical** companion to yerbearserker's Day 1 sessions. Where Jordan
(@yerbearserker) gave the thesis and the live build (`/recordings/1`, `/recordings/2`), Adrian is
Empire Builder's co-founder and chief technology architect - so this convo can go deep on the
endpoints and the leaderboard, and ZABAL Gamez already runs a live Empire integration he can speak
to and extend. Facts sourced below; flag anything Adrian wants to correct on the call.

> Who he is: Adrian is named in `docs/workshop-1-empire-builder-recap-2026-06-04.md` as
> "Adrian (Diviflyy), co-founder and chief technology architect" of Empire Builder. Farcaster
> handle @diviflyy is verified (fid 369863, display "DiviFlyy", also building /glanker). His own
> bio does not say "Empire Builder," so confirm the exact title he wants on air.

---

## The frame: Jordan gave the why, Adrian gives the how

- yerbearserker (Day 1): the thesis - "the token is the amplifier, not the foundation," the
  Triple-A path (Assemble, Affirm, Ascend), and a tokenless empire stood up live.
- diviflyy (this session): the technical layer - the V3 endpoints, how the leaderboard actually
  works, and deploying/operating an empire. Best run as a working conversation, not a slide talk.

## Empire Builder V3, in one block (context for the room)

From the Workshop 1 recap, so the convo can skip the basics:
- V3 tool stack: treasury (0xSplits audited contracts), multi-chain (Base, Arbitrum),
  leaderboards, boosters (NFT holdings / token thresholds / staking), distribution (airdrops,
  USDC, NFTs, raffles), staking that boosts leaderboard standing rather than paying yield, and
  bring-your-own-model AI skills.
- Three tiers: Assembled (tokenless, full stack), Awakened, Ascended (~40 boosters, launch a token
  through Empire).
- Leaderboards score a base component multiplied by boosters; distribution can target specific real
  holders (a raffle airdrop to top NFT holders, a $ZABAL booster, etc.).
- Credibility: 5,761+ empires created at the time of Workshop 1, two part-time founders, zero
  external funding, V3 launched at FARCON Rome, partnered with Clanker.

## The ZABAL Gamez tie-in (the live integration to demo)

This is what makes Adrian's session concrete rather than abstract: ZABAL Gamez already has a live
Empire and a live read integration in this repo.
- **The live empire:** `empirebuilder.world/empire/zabalgamez01e9af` (the tokenless ZABAL Gamez
  empire stood up during Workshop 1).
- **The repo integration:** `api/empire-leaderboard.mjs` reads that empire's board (consolidated
  board-map normalizer, Neynar username -> avatar/fid enrichment) and the live `/zabal` board is
  the headline on `/leaderboard`, with a top-5 preview on the homepage.
- **The open follow-up (audit decision):** expose the app's own internal leaderboard as an API
  endpoint and pull it into an Empire leaderboard plus boosters; optional weekly NFT drops to the
  top of the leaderboard (`docs/audit-decisions-2026-06-04.md` follow-ups). Adrian is exactly the
  person to design that endpoint contract live.

## Suggested running order (conversation, ~45-60 min)

1. **Who Adrian is + how Empire Builder is built** (~6 min) - the CTO view, what V3 is under the hood.
2. **The V3 endpoints for an existing empire** (~12 min) - reading/operating an empire via the API:
   leaderboard, boosters, distribution. Use the live ZABAL empire as the example.
3. **The leaderboard, up close** (~10 min) - base component x boosters, how staking/holdings feed
   it, how `api/empire-leaderboard.mjs` consumes it today.
4. **Deploy a new empire (optional, live)** (~10 min) - if there is appetite, stand one up on the
   call the way Workshop 1 did.
5. **Design the open follow-up live** (~8 min) - exposing the ZABAL app leaderboard as an API to
   feed an Empire leaderboard + boosters; weekly NFT drops to the top. A real, useful artifact.
6. **Q and A** (~10 min+) - builders ask how to wire Empire into their July builds.

## Open items / to confirm with Adrian

- Confirm the title he wants on air (co-founder / CTO / chief technology architect).
- Whether he wants to deploy a new empire live or keep it to the existing ZABAL empire.
- Whether the app-leaderboard-to-Empire endpoint is in scope to spec on the call.
- Current empire count + any V3 changes since FARCON Rome, so the numbers are current.
- His other project /glanker - a fine tangent if it comes up, but the booked topic is Empire V3.

---

## Sources

- `data/workshop-leads.json` (id 006 - topic, date Jun 16, luma kaz6hnm4) + `data/people.json` (@diviflyy) - [FULL]
- `docs/workshop-1-empire-builder-recap-2026-06-04.md` - Adrian = Diviflyy = Empire Builder co-founder/CTO; the V3 stack, tiers, credibility - [FULL]
- `CLAUDE.md` + `api/empire-leaderboard.mjs` + `docs/audit-decisions-2026-06-04.md` - the live ZABAL empire integration + the open API-endpoint follow-up - [FULL]
- Farcaster fnames + hub: @diviflyy = fid 369863, display "DiviFlyy", building /glanker - [FULL, handle verified; Empire Builder title to confirm with him]

---
topic: events
type: guide
status: draft
last-validated: 2026-05-14
related-docs: 701, 654, 646, 629, 628, 627, 626, 584, 361, 324, 322, 311
tier: STANDARD
---

# 630 - ZABAL Games Season 1: Farcaster Vibe-Coding Challenge

> **Goal:** Define ZABAL Games Season 1 - a Farcaster-creator onboarding event for the ZAO ecosystem. Two phases: an open build-a-thon (anyone applies by shipping), then a Finals (8 builders curated by 8 ZAO mentors, each mentor embedded as a teammate). The competition is in getting selected; the Finals are a collaboration. All 8 Finalists win.

> **Status:** DRAFT - working spec, designed in the open. Heavily iterated 2026-05-08 through 2026-05-14. The shareable public summary lives at `bettercallzaal.com/zabalgames.html` (with live Supabase-backed submission tech). This doc is the source-of-truth working spec + decision log.

> **Naming note:** Earlier drafts called this "v0" and "Claude Code Hackathon." Current framing: "Season 1" + "Farcaster Vibe-Coding Challenge" (tool-agnostic).

> **State note (2026-05-21):** Doc 701 is now canonical for FORMAT, CALENDAR, MENTOR MODEL, and INFRA STATE. Changes since this doc: the named 8-mentor roster is removed (mentors openly recruited, finalist count decided after July), the calendar is June prep / July build / August Finals (Doc 654), and the build prompt drops fixed Option A-E tracks for an adopt-a-started-project-or-build-from-scratch model. This doc stays the long-form spec + decision log; where it conflicts with Doc 701, Doc 701 wins.

---

## Part 0 - TL;DR

**What:** A Farcaster-creator onboarding event for the ZAO. Bring hungry, Farcaster-active vibe-coders into ZAO by having them build something real, in public, with a ZAO mentor in their corner.

**Two phases:**
- **Phase 1 - Open Build-a-Thon:** Anyone applies by building something with the ZAO context prompt + shipping it publicly (live URL + open-source repo + 60s demo + /zabal cast). Use any vibe-coding harness.
- **Phase 2 - The Finals:** 8 builders curated from Phase 1, each paired with a ZAO mentor as embedded teammate. 24h build + 24h promote + 24h ZAO governance vote + reveal stream.

**Who decides:** Mentors pick their champions from Phase 1 (first-come-first-served, rolling). Then the ZAO DAO (Respect-earning members, 1-person-1-vote) votes on Finals builds.

**Prize:** $500 USDC pool, tiered. But all 8 Finalists win - tiering is recognition, not placement. Every Finalist gets paid + a participation collectible + Respect earned during the event.

**Cost to ZAO:** ~$525 (USDC pool + minor gas). Tooling subsidy dropped. Submission tech is free (Supabase).

**Date:** TBD - locks once the cohort + mentor availability are known.

---

## Part 1 - The Thesis

ZABAL Games is **not a generic hackathon**. It is a Farcaster-creator onboarding event.

The thesis: bring talented Farcaster builders together, give them deep context on everything the ZAO is building, let them create something that helps the community with a ZAO mentor as embedded teammate, and have them earn governance in the community during the event itself. If they keep building with ZAO after - great. If not, they still walked away with a real artifact, a real relationship, and a real onchain credential.

**Focused on the creator, not the thing they create.** The builds matter, but the people matter more. This is about who you are as a builder, how you work in public, how you collaborate with a mentor. That is why the application is itself a build (Phase 1) - we want to see how you actually ship.

**What success looks like:** 8 new builders who understand ZAO from the inside. 8+ real artifacts shipped for the ecosystem. A recurring format (this is Season 1) that compounds the builder network + body of work each Season.

---

## Part 2 - Format

### Two-Phase Model

| Phase | What |
|-------|------|
| **Phase 1 - Open Build-a-Thon** | Anyone can apply by building. Vibe-code something with the ZAO context prompt, ship it publicly. The build IS the application. Open to everyone with the chops to ship. |
| **Curation Window** | As Phase 1 builds ship, the 8 ZAO mentors watch rolling. Each mentor claims one champion - first-come-first-served per mentor. 8 mentor-player pairs lock the Finals roster. |
| **Phase 2 - The Finals** | Same Finals prompt for all 8. 24h build with your mentor embedded as teammate. 24h promote. ZAO governance vote (24h). Reveal stream. |

### Phase 2 Finals Timeline (relative - absolute dates TBD)

```
T-3 days   Onboarding call (90 min): rules, infra, wallet linkage,
           visibility-mode lock-in, voting-mechanism walkthrough
T+0        Prompt drops to all 8 simultaneously. Build window opens.
           Voter eligibility snapshotted now.
T+0->T+24h BUILD WINDOW. Mentor embedded as teammate (Discord/Meet,
           live with the player). Build in public via declared
           visibility mode. Open repos.
T+24h      Ship deadline: live URL + open-source repo + 60s demo +
           ship cast on /zabal
T+24h->48h PROMOTE WINDOW. Cast it, demo it. ZAO accounts amplify all 8.
T+48h->72h ZAO GOVERNANCE VOTING WINDOW. Respect-earning members cast
           1-person-1-vote ballots onchain. Live tally.
T+72h      Live results-reveal stream. Recognition order announced.
           USDC + collectibles distributed onchain live.
```

### Why Two Phases (not single-stage application)

- "Apply with a paragraph + a vibe" sets a low bar that filters for confidence, not capability
- "Apply by building" sets a high bar that filters for real shipping ability + makes the application itself valuable
- Phase 1 is genuinely open - anyone can enter. Curation happens on demonstrated work, not bios.
- Resolves the low-bar-to-apply / high-bar-to-accept tension: ship a thing to apply.

### Why "All 8 Win"

The competition is in Phase 1 (getting selected). Once you are a Finalist, the Finals are a collaboration among the 8 - not a competition between them. All 8 get paid + collectible + Respect. The DAO vote orders recognition; it does not pick winners-vs-losers.

---

## Part 3 - The Mentors

8 ZAO mentors, curated by Zaal from the ZAO inner circle. Each mentor:
- Defines their own search style (the kind of builder they want) before applications open
- Reviews Phase 1 builds rolling, claims one champion (first-come-first-served)
- Is embedded as that player's teammate during the Finals - live in Discord/Meet, in DMs, on-call. Can share screen if the player is hardware-limited. Helps with project management, ZAO connections, distribution while the player codes.
- The mentor is as important as the player. They are the connection point that lets the player stay locked in.

### Roster (locked 2026-05-13)

1. ohnahji
2. candytoybox
3. eduard - confirmed
4. freezetheverse - likely streamer-focused category
5. Iman - ZAO Music team
6. Thy Revolution
7. Tom Fellenz - ZAO Music DBA, likely smart-contract / hard-coder category
8. Adam SongJam - SongJam founder, ZABAL co-creator

### Mentor Incentive - "On the Team"

Mentors get: a Hats Protocol "ZAO Mentor S1" NFT (permanent onchain role), a private mentor channel, public cast credit on launch + reveal, ongoing ZAO ops-conversation involvement, auto-eligibility for future Seasons. No cash - this is team membership + status + recognition. Being a ZAO Mentor is a real, persistent org role.

### Per-Mentor Categories (TBD - each mentor drafts their own)

Each mentor defines a search style so applicants can self-select. Examples discussed: a streamer-mentor looking for "a streamer with little vibe-coding experience"; a builder-mentor looking for "a smart-contract / hard-coder developer." Surfaces builder archetype diversity in the cohort. Each mentor's 1-liner is collected before the open call.

---

## Part 4 - Tooling + Visibility

### Tool-Agnostic

Players use whatever vibe-coding harness fits them - Claude Code, Cursor, Windsurf, Aider, Cline, Bolt, v0, Lovable, or a hand-rolled pipeline. The constraint is not the tool, it is **show your work in public**.

### 4 Visibility Modes

Each player picks at least one primary mode + supplements with ongoing /zabal casts:

1. **Live Twitch stream** - the default. ZAO restreams all 8 to one hub.
2. **Recorded screen sessions** - upload to YouTube/Loom within 1h of each session.
3. **Public AI prompt logs** - share conversation/composer history every 1-2h.
4. **Frequent build casts** - screenshots + prompts every 1-2h on Farcaster.

Anti-cheat: empty starter repo at T+0 (verified empty git log) + the visibility mode timestamps cross-checked against git commit times.

---

## Part 5 - Prize Structure

$500 USDC pool, tiered with floor. **Every Finalist who ships gets paid** - tiering is recognition of standout work, not win/lose.

| Place | USDC |
|-------|------|
| 1st | $150 |
| 2nd | $100 |
| 3rd | $75 |
| 4th-8th | $35 each (5 x $35 = $175) |
| **Total** | **$500** |

Plus every Finalist gets:
- A participation collectible (likely a Hats Protocol role NFT - spec TBD)
- Respect earned in ZAO governance during the event itself
- Distribution boost from ZAO accounts during the promote window
- An open-source GitHub repo as a portfolio piece
- Their vibe-coding session footage as a content asset

### Tooling Subsidy - DROPPED

Earlier drafts offered up to $20/mo for the player's vibe-coding tool. Dropped 2026-05-11 - simplifies the offer, cohort self-selects for people who can already afford their tool.

### Total ZAO Cost

| Component | Cost |
|-----------|------|
| USDC pool | $500 |
| Participation collectible mints (Hats, on Base) | ~$10 |
| Submission tech (Supabase free tier) | $0 |
| Voting infra (Snapshot or onchain) | $0 |
| **Total** | **~$510-525** |

---

## Part 6 - Judging: ZAO Governance Vote

**No human judge panel. Not open token-holder voting either.** The judging body is ZAO members who have earned Respect.

Respect is ZAO's soulbound, peer-validated reputation - earned in weekly fractal sessions over time. The eligible voter set is members with Respect above a threshold N (N TBD - set against the actual Respect distribution). Respect is inherently tenure-correlated, so this naturally skews toward long-tenure contributors without a separate tenure rule.

- **Mechanism:** 1-person-1-vote. NOT token-weighted. A whale holding lots of ZABAL has no extra power - this is governance by earned contribution.
- **Eligibility snapshot:** taken at T+0 so the voter set is locked before the Finals begin.
- **What they vote on:** which Finals build best serves the ecosystem. Vote-for-1.
- **Output:** orders the recognition tiers. Does not pick winners-vs-losers - all 8 already won by being Finalists.

---

## Part 7 - The Prompt

### Sealed Until T+0

The exact prompt - including any build options or starter framing - stays sealed until it drops to all players simultaneously at T+0. Keeps every player on equal context footing.

### What the Prompt Bundle Contains

- **Brand context guide** - the full identity + build surface of every ZAO brand (ZAO OS, $ZABAL + Empire Builder, WaveWarZ, ZAO Festivals, ZAO Music, COC Concertz, Respect + Fractals). Lives at `BetterCallZaal/zabalgames-brand-context.md`, feeds the bundle.
- **Open-ended build directive** - "build anything that helps the ZAO community with this context" + non-binding suggestion sparks for builders who want starting points
- **Tech stack baseline** - Next.js, Supabase, Base, Farcaster mini apps, the SDKs + APIs
- **Brand guidelines** - naming glossary, no emojis / no em dashes, color palette, fonts, tone
- **Rules + submission bar + visibility-mode requirements**

Phase 1 builders get a lighter version (umbrella context + build surfaces). Finalists get the full bundle.

### Starter Projects

Zaal seeds forkable GitHub starting-point repos. Building on a starter is as valid as building from scratch. Lowers the Phase 1 barrier. Surfaced on the website's Starter Projects board.

---

## Part 8 - The Submission Tech (Built)

The website (`bettercallzaal.com/zabalgames.html`) has real submission infrastructure:

- **Supabase-backed submission form** - posts Phase 1 builds to a `zabalgames_submissions` table
- **Public submissions board** - renders every submission as cards (build/repo/demo/cast links + status badges). Applications are public by default.
- **Starter Projects board** - Zaal-seeded forkable starting points
- **Schema** - `BetterCallZaal/zabalgames-schema.sql` - table + RLS (anon insert, anon read, no anon update)
- **Mentor claims** - v0 approach: mentor DMs Zaal, Zaal updates `status` + `claimed_by` in the Supabase dashboard. No claim UI for Season 1.

Blocking step: Zaal creates the Supabase project, runs the schema, pastes the URL + anon key into the config block. Then the form writes + board reads, fully live.

---

## Part 9 - Risks + Mitigations

| Risk | Mitigation |
|------|------------|
| Too few Phase 1 submissions | Open call promoted across Farcaster early; starter projects lower the barrier; mentor categories give people a clear lane |
| Pick conflicts (2+ mentors want same builder) | First-come-first-served per mentor, rolling. Build early gets you seen earlier |
| First-come rewards hot-takes over thoughtful picks | Acceptable for Season 1; revisit if it produces bad pairings |
| Cheating (pre-built code) | Empty starter repo at T+0 + verified empty git log + visibility-mode timestamp cross-check |
| Player builds something off-brand / unethical | Code of conduct in onboarding; right to disqualify pre-vote |
| ZAO treasury USDC liquidity | Secure $500 USDC in a dedicated wallet ahead of the Finals |
| Low voter turnout | Reveal stream as the payoff; promote the voting window; consider a voter collectible |
| Whale tries to sway the vote | Mechanism is 1-person-1-vote NOT token-weighted - holdings give no power |
| Mentor flakes mid-Finals | Mentor pool curated + confirmed ahead; backup mentor on standby |
| Date drift | Date locks once cohort + mentor availability known - the forcing function is mentor confirmations + open call |

---

## Part 10 - The Bigger Picture

- **Season framing:** This is Season 1. Format repeats. Mentors carry across Seasons. Alumni become eligible to mentor or compete again. Each Season compounds the builder network + body of shipped work.
- **Tokenization (future layer):** A player who wants it can launch a Clanker token tied to their build + stream. Viewers back builds financially, trade volume = parallel signal next to the DAO vote. Optional, player-driven, NOT a Season 1 requirement - design space documented in Doc 646.
- **The team:** Being a ZAO Mentor is a real, persistent role. The Games are how ZAO grows its core builder + mentor tier over time.
- **Sub-brand Games (v2+):** COC Concertz Games, WaveWarZ Games, ZAOstock Games - the template rides under the ZAO umbrella.

---

## Part 11 - Locked vs TBD

### Locked

- Two-phase model (open build-a-thon -> 8-Finalist event)
- 8 ZAO mentors, each picks one champion, embedded as teammate
- Mentor picks: first-come-first-served, rolling
- Tool-agnostic; 4 visibility modes, pick at least one
- $500 USDC tiered pool; all 8 Finalists get paid + collectible
- ZAO governance vote: Respect-earning members, 1-person-1-vote, not token-weighted
- Applications public by default
- Submission bar: live URL + open-source repo + 60s demo + /zabal cast
- Season 1 framing - recurring format
- Tooling subsidy dropped
- Submission tech built (Supabase form + public board + starter projects)
- "All 8 win" - competition is in selection, Finals are collaboration

### TBD

- Dates - lock once cohort + mentor availability known
- Phase 1 prompt content - Zaal writing the full ZAO context bundle
- Phase 1 duration - how long the open build-a-thon window runs
- Per-mentor categories - each mentor's 1-liner search style
- Mentor confirmations - Eduard confirmed, 7 others in progress
- Participation collectible spec - likely a Hats Protocol role NFT
- Governance earned during event - exact Respect amount + when
- Start time - balancing US-centric with global participation
- Respect threshold N for voter eligibility
- Tokenization layer - opt-in Clanker tokens, design space open (Doc 646)
- Telegram group + brand-context [TBD-Zaal] voice/visual fields

---

## Also See

- [Doc 646 - Clanker + Empire Builder for ZABAL Games promote window](../../business/646-clanker-empire-builder-zabal-games-promote/) - the optional tokenization layer
- [Doc 629 - Streaming as main media source](../../infrastructure/629-streaming-as-main-media-source-flywheel/) - the content flywheel that processes Games streams
- [Doc 628 - Web3 streaming + ZABAL Empire bridge](../../business/628-web3-streaming-zabal-empire-bridge/)
- [Doc 627 - Twitch + StreamElements](../../cross-platform/627-twitch-streaming-streamelements-integration/) - streaming infra
- [Doc 626 - Empire Builder + ZABAL POIDH airdrop](../../business/626-empire-builder-zabal-poidh-airdrop/) - apiLeaderboards pattern
- [Doc 584 - Empire Builder Farcaster Creator Playbooks](../../business/584-empire-builder-farcaster-creator-playbooks/)
- `BetterCallZaal/zabalgames.html` - the public shareable summary + live submission tech
- `BetterCallZaal/zabalgames-brand-context.md` - the brand identity guide for the prompt bundle
- `BetterCallZaal/zabalgames-schema.sql` - Supabase schema for the submission tech
- PROMPT_CONTEXT.md (this folder) - the player context bundle

---

## Next Actions

| Action | Owner | By When |
|--------|-------|---------|
| Create Supabase project + run schema + paste config into zabalgames.html | @Zaal | ASAP - blocks live submissions |
| Draft per-mentor category 1-liners | @Zaal | Before open call |
| DM remaining 7 mentors with updated pitch + category ask | @Zaal | Before open call |
| Fill brand-context.md [TBD-Zaal] voice + visual fields | @Zaal | Before prompt bundle finalizes |
| Write the Phase 1 + Phase 2 prompt content | @Zaal | Before open call |
| Set up Telegram group (Zaal + Eduard + Iman, then Freeze + ohnahji) | @Zaal | This week |
| Seed starter-project repos on the board | @Zaal | After Supabase live |
| Lock Phase 1 duration + open-call date | @Zaal | After mentors confirmed |

---

## Sources

- Internal: this folder's PROMPT_CONTEXT.md, the BCZ zabalgames.html + brand-context.md + schema.sql, ZAO research docs cross-linked above
- Decision log: iterated in conversation 2026-05-08 through 2026-05-14, plus the 2026-05-13 recorded call (Zaal + Eduard + Iman) that introduced the two-phase model + mentor-pick mechanism

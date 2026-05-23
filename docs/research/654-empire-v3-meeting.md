---
topic: events
type: guide
status: research-complete
last-validated: 2026-05-16
related-docs: 701, 630, 646, 631, 584, 599, 498, 505, 527, 322, 324
tier: STANDARD
---

# 654 - ZABAL Games + Empire Builder V3: Meeting with yerbearzerker (Jordan)

> **Goal:** Capture decisions + new direction from the 2026-05-16 working session with Jordan (Empire Builder) + Iman + Zaal. Two big shifts: (1) ZABAL Games timeline moves to June prep / July submissions / August finals, (2) every Phase 2 finalist creates a tokenless Empire as their pre-launch home, then optionally Ascends with a token + Clanker airdrop using their own leaderboard as the airdrop list.

> **Status:** research-complete. Supersedes the "all-in-June" framing from Doc 630. Doc 630 spec stays canonical for format; this doc updates the calendar + adds the Empire V3 mechanic.

> **State note (2026-05-21):** Doc 701 is the current canonical state - it carries this doc's calendar pivot forward plus the mentor-roster-open decision. Where this doc conflicts with Doc 701, Doc 701 wins.

---

## Key Decisions

| # | Decision | Pick |
|---|---|---|
| 1 | **Calendar** | **June = prep month** (ZAO teachers + Vibe Coding instructors run Far-Hack-style recorded sessions). **July = submissions month 1** (open build-a-thon, anyone ships). **August = final 8 selection + winner reveal.** Replaces the all-June compression from Doc 630. |
| 2 | **Empire-as-onboarding** | Every Phase 2 participant **creates a tokenless Empire** as their build home. Token is OPTIONAL and comes later. |
| 3 | **Token-launch flow** | Participants who want to launch: build leaderboard during the Games → export CSV → upload to Clanker airdrop with vesting → token launches into Ascended Empire automatically. |
| 4 | **Songjam leaderboard migration** | Adam (Songjam) deprecating Twitter scraper for cost reasons. **MIGRATE** the Songjam leaderboard from X scraper to an Empire Builder API leaderboard. Lives inside Empire Builder alongside other ZABAL leaderboards. |
| 5 | **POIDH leaderboard** | Build an Empire Builder leaderboard pulling on-chain POIDH bounty submissions. Counts unique submitters across all ZABAL bounties (5 submits on one bounty = 1, but bounty-1 + bounty-2 submitters both count). Replaces manual $1-ZABAL-per-submitter outreach. |
| 6 | **kmac.eth template collab** | zlank.online "use template" mechanic - Empire Builder daily stats template (one-click cast for "today's Empire Builder update"). Footy app is the reference template. |
| 7 | **Empire Builder API access** | Jordan to provide API key + access so ZABAL Games interface can let participants deploy Empires directly from the submission flow. |
| 8 | **Master prompt deliverable** | Zaal commits to shipping a "ZABAL/ZAO/WaveWarZ context skill" (drop into any vibe-coding agent) by end of May, before June bootcamp opens. |
| 9 | **Bootcamp format** | Borrow Far-Hack model - recorded specialist sessions ("here's Empire, here's how to use it, here's why"). Watchable live or after. Jordan signs up to record an Empire Builder session. |
| 10 | **Pre-launch discipline** | Jordan's advice locked in: 2-week pre-launch marketing cadence on anything that ships. June bootcamp doubles as the pre-launch window for July. |

---

## Part 1 - The Calendar Pivot (June / July / August)

The prior framing in Doc 630 had Phase 1 building + Phase 2 Finals compressed into a tight window with date "TBD." Jordan's input + Zaal's reflection produced a cleaner three-month split:

### June - Prep Month

- **Purpose:** Teach + warm up the cohort. No competition yet.
- **What runs:**
  - Recorded sessions from ZAO teachers (governance, Respect, ZOLs, fractals)
  - Recorded sessions from Vibe Coding instructors (Claude Code, Cursor, agent harnesses, MCP)
  - Tool walkthroughs: Empire Builder V3 (Jordan), zlank.online (Zaal + kmac), POIDH bounties, Juke, Songjam
  - The ZABAL/ZAO/WaveWarZ context skill goes live early June for anyone to drop into their agent
- **Output:** Cohort of warmed-up builders, all aware of tools, all with context skill loaded. ZAO mentor pool primed.

### July - Submissions Month 1 (Open Build-a-Thon)

- **Purpose:** Anyone with the chops to ship can submit a build aligned with ZABAL, ZAO, or WaveWarZ.
- **Format:** Same as Doc 630 Phase 1 - the build IS the application. Live URL + open-source repo + 60s demo + /zabal cast.
- **Empire requirement:** Every submission creates a **tokenless Empire** as its public home. This gives them a leaderboard + treasury surface from day 1.
- **Mentors watching:** 8 ZAO mentors monitor submissions rolling. Already-known champions can be picked early; surprise breakouts get picked late. First-come-first-served per mentor.

### August - Final 8 + Winner

- **Purpose:** Phase 2 Finals - 8 builders, 8 mentors, the actual ZABAL Games.
- **Format:** Same as Doc 630 Phase 2 - 24h build with mentor embedded + 24h promote + 24h DAO vote + reveal stream. Compressed to a single week inside August (week TBD).
- **Token decision:** Each finalist decides during August whether to Ascend their Empire with a Clanker token launch. Those who do get auto-airdrop to their leaderboard with a vesting schedule. Those who don't keep running the tokenless Empire indefinitely.

**Why this pivot works:** Original Doc 630 compressed teach + build + judge into ~30 days. Spreads thin. June-prep solves the "people show up cold" problem. July as an open month lets builds breathe + lets mentors evaluate ~30 submissions instead of 8. August Finals get the focused energy they deserve.

---

## Part 2 - Empire Builder V3 Mechanic Stack

Jordan walked through the V3 tier delta. This locks the participant flow:

### Basic Empire (free, tokenless)

| Slot | Count |
|------|-------|
| Leaderboards | 2 |
| Boosters | 10 |
| Ranked spots per leaderboard | 250 |
| Cost | Free |

Used by every ZABAL Games participant from day 1 of July. Captures who's contributing to their build, who's amplifying their casts, on-chain interactions, anything you can stick on a leaderboard.

### Ascended Empire (token launch unlocks)

| Slot | Count |
|------|-------|
| Leaderboards | 10 |
| Boosters | 40 |
| Ranked spots per leaderboard | 500 |
| Cost | Token launch through Empire Builder UI |

Triggered when a participant launches their token via Empire Builder's Clanker integration. ZABAL itself is an Ascended Empire (launched via Clanker 2026-01-01 per Doc 646).

### The Build-then-Airdrop Pattern (Jordan's Pitch)

This is the unlock the meeting locked in:

```
Step 1  Create tokenless Empire in July as ZABAL Games submission home
Step 2  Build the project. Build leaderboards. Identify who's actually contributing value.
Step 3  When ready, take leaderboard → export CSV → that IS your airdrop list
Step 4  Launch token through Empire Builder UI → instantly Ascended Empire
Step 5  Airdrop with vesting schedule to the CSV
Step 6  Speculators speculate after launch; you already paid contributors first
```

**The framing Jordan locked:** "Token is an assist. It serves a role in the ecosystem. We're not optimizing for speculators - if they make money, groovy, but the focus is the project, community, mission. Token comes in support of that." This is the anti-pattern to "launch token first, figure out project later" which Jordan called out as predation bait.

---

## Part 3 - Side Decisions + Action Items From the Meeting

### Songjam Leaderboard

Adam Songjam confirmed deprecating the Twitter scraper (cost). Migration path:
- Build Empire Builder API leaderboard
- Source data via Songjam's existing music engagement API (not X scrape)
- Lives alongside other ZABAL leaderboards in the same Empire surface
- Frees Adam from scraper maintenance, gives ZABAL Farcaster-native data

### POIDH Bounty Leaderboard

POIDH puts all bounty submissions on-chain. Empire Builder leaderboard pulls from the bounty contract directly:
- Count = unique bounty IDs a wallet has submitted to (5 submissions on bounty A = 1 count)
- Each new ZABAL bounty (clipping, content, builds) adds a row to count against
- Replaces Zaal's manual "go through each, send $1 ZABAL" outreach
- Already a working leaderboard (one contract added morning of 2026-05-16, second pending)

### kmac.eth + zlank.online Templates

The Snap protocol's high auth gate (JFS) only matters inside Farcaster clients. zlank's web route soft-fails so anonymous web users can interact. Empire Builder integration:
- Template: "Today's Empire Builder Stats" daily snap
- One-click cast - the first post of Zaal's day becomes a Snap + cast
- Footy app is the reference for the template mechanic
- See Doc 505 for the zlank builder spec, Doc 527 for the snap roadmap

### In-Rememberium

Jordan dropped a Clanker token called In-Rememberium for Dish (who left Clanker). Not a memorial - "he didn't die, he just stopped working there." Worth a follow when Jordan + Dish reconnect, since Dish was a GameStop-era onboarding peer.

### Jubjub (Australian Farcaster Batches)

- Jubjub runs Farcaster builder batches out of Melbourne
- Adrian (Empire Builder co) is his neighbor - they met up for a beer
- Zaal DM'd Jubjub + pinged on the timeline - no response yet
- Worth re-pinging once ZABAL Games calendar is public. Jubjub's batch model is what June-prep is borrowing from in spirit.

### Estuary Frame

Jordan's framing for Farcaster's role in the ecosystem - "Farcaster is the estuary where baby projects grow big and strong before going into the ocean. Saltwater + freshwater. You incubate here, then go out into the greater world." Useful for any ZABAL Games marketing copy.

---

## Part 4 - Codebase + Site Touch Points

| File | What needs updating |
|------|---------------------|
| `/Users/zaalpanthaki/Documents/BetterCallZaal/zabalgames.html` | Replace any all-June timeline with June prep / July submissions / August finals 3-column structure. Add Empire Builder tokenless-then-Ascend mechanic to the "How it works" section. |
| `/Users/zaalpanthaki/Documents/BetterCallZaal/zabalgames-brand-context.md` | Add the master context prompt section + Empire-as-build-home requirement. |
| `/Users/zaalpanthaki/Documents/BetterCallZaal/zabalgames-schema.sql` | Add `empire_url` field to submissions table (optional in July, required for Phase 2 finalists). |
| `research/events/630-zabal-games-claude-code-hackathon-v0/README.md` | Add front-matter note: "Calendar updated by Doc 654 - June prep / July build / August finals." |

---

## Also See

- [Doc 630](../630-zabal-games-claude-code-hackathon-v0/) - Canonical ZABAL Games Season 1 spec (format + mentor model)
- [Doc 646](../../business/646-clanker-empire-builder-zabal-games-promote/) - Clanker + Empire Builder promotion mechanic (token-launch optionality)
- [Doc 584](../../business/584-empire-builder-farcaster-creator-playbooks/) - Empire Builder creator playbooks + booster stacks
- [Doc 631](../../business/631-poidh-zabal-sentinel-convergence/) - POIDH + ZABAL convergence (on-chain bounty submission data)
- [Doc 599](../../business/599-adam-meeting-may2026-commercial-leaderboard/) - Adam (Songjam) meeting on commercial leaderboard direction
- [Doc 505](../../farcaster/505-zlank-online-builder-spec/) - zlank.online builder spec (the templates collab surface)
- [Doc 527](../../farcaster/527-zlank-next-3-builds/) - zlank next-3 builds (where Empire daily-stats template fits)
- [Doc 498](../../business/498-zlank-unified-sdk-concept/) - Unified SDK concept covering snap embed in external surfaces

---

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Update `bettercallzaal.com/zabalgames.html` to June/July/August timeline | @Zaal | Edit | This session |
| Update Doc 630 with calendar-superseded note pointing to Doc 654 | @Zaal | PR | This week |
| Ship "ZABAL/ZAO/WaveWarZ context skill" v0 for vibe-coding agents | @Zaal | Build | End of May 2026 |
| Get Empire Builder API key from Jordan | @Zaal | DM | Next 7 days |
| Build Empire Builder API leaderboard for Songjam migration | @Adam + @Zaal | Build | Before June 1 |
| Add second POIDH bounty contract to existing leaderboard | @Zaal | Config | Next 3 days |
| Record kmac.eth + Zaal session on zlank templates for June bootcamp | @Zaal + @kmac | Record | Late May 2026 |
| Re-ping Jubjub once June calendar is public | @Zaal | DM | June 1 |
| Schedule Empire Builder bootcamp session with Jordan + Iman | @Zaal | Calendar | Before June 7 |
| Draft 2-week pre-launch marketing cadence for July submissions | @Zaal | Doc | Mid-June |

---

## Sources

- Meeting recording 2026-05-16 (Zaal + Jordan/yerbearzerker + Iman)
- [Doc 630 ZABAL Games Season 1 spec](../630-zabal-games-claude-code-hackathon-v0/)
- [Doc 646 Clanker + Empire Builder for ZABAL Games](../../business/646-clanker-empire-builder-zabal-games-promote/)
- [Doc 584 Empire Builder creator playbooks](../../business/584-empire-builder-farcaster-creator-playbooks/)
- [Empire Builder V3 (mentioned in meeting; verify tier specs against live UI at empire builder dashboard)](https://www.empirebuilder.world)
- [POIDH bounty platform](https://poidh.xyz)
- [Songjam](https://www.songjam.space)

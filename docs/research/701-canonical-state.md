---
topic: events
type: guide
status: research-complete
last-validated: 2026-05-22
related-docs: 630, 654, 646, 626, 584, 631, 666, 714, 473
original-query: "zabal games in its interity and then grill me on anything thats not defined yet"
tier: STANDARD
---

# 701 - ZABAL Games: Canonical State (post mentor-open pivot)

> **Goal:** One consolidated source of truth for ZABAL Games as of 2026-05-21. Folds Doc 630 (Season 1 spec), Doc 654 (Empire V3 / June-July-August calendar pivot), and Doc 646 (Clanker token mechanic) into a single state-of-the-event, then records 24 decisions taken in a structured decision interview with Zaal on 2026-05-21.

> **Status:** research-complete. This doc is canonical for FORMAT, CALENDAR, MENTOR MODEL, and INFRA STATE. Where it conflicts with Doc 630 or Doc 654, this doc wins (it is later and reflects live decisions). Doc 630 stays the long-form spec and decision log; Doc 654 stays the meeting record. Both get a superseded-for-state note pointing here.

> **Method note:** This is an internal consolidation, not a web-research doc. "Research" here = full read of the four canonical internal docs + the live `zabalgames.html` + filesystem verification of skill/infra claims, followed by a 6-round / 24-question decision interview with Zaal. No external web sources - the event is internal to the ZAO ecosystem. Sources are marked FULL/internal accordingly.

---

## Key Decisions (2026-05-21 interview)

Recommendations and locked calls first.

| # | Area | Decision |
|---|------|----------|
| 1 | **Mentor roster** | REMOVE the named 8-mentor roster from Doc 630 (ohnahji, candytoybox, eduard, freezetheverse, Iman, Thy Revolution, Tom Fellenz, Adam SongJam). Mentors are now **openly recruited** via the public form. The embedded-teammate mechanic STAYS - a mentor still embeds as a builder's teammate during the August Finals. |
| 2 | **Finals size** | OPEN. Doc 630 hard-tied 8 finalists to 8 mentors. With the roster open, the August Finals size is decided AFTER July, once submission volume and mentor signups are both known. |
| 3 | **Calendar** | June prep / July build / August Finals stays as three loose MONTHS. Exact dates (bootcamp open, July window, August Finals week, T+0) stay OPEN - they lock once cohort + mentor availability are known. |
| 4 | **July non-finalist reward** | Every July submission that hits the bar **earns Respect** in ZAO governance. Not just finalists. This pulls non-selected builders into the community regardless of Finals outcome. |
| 5 | **Build prompt** | No fixed Option A-E tracks (the never-written `OPTIONS.md` is dropped). Builders get TWO paths: (a) **adopt a started/in-progress ZAO project** from a curated list and run with it, or (b) **build from scratch** with just the platform context. |
| 6 | **Tokenless Empire** | OPTIONAL mention, NOT a gate. A July build without an Empire still counts if it has live URL + repo + demo + cast. Empire Builder is presented as an available tool, not a requirement. |
| 7 | **Prize pool** | UNCHANGED. $500 USDC, tiered 1st $150 / 2nd $100 / 3rd $75 / 4th-8th $35 each, all finalists paid. NOTE: tier table assumes 8 finalists - if Finals size lands below 8 (Decision #2), the 4th-8th band needs re-cutting. |
| 8 | **Voting** | OPEN. Locked: Respect-earning members, 1-person-1-vote, NOT token-weighted. Still undecided: mechanism (Snapshot vs onchain) and the Respect threshold N for voter eligibility. |
| 9 | **Participation collectible** | LOCKED (2026-05-22). A Hats Protocol role NFT on Base. Every finisher gets one - every July build that hits the bar, plus every August finalist. |
| 10 | **Context skill** | Does NOT exist (filesystem-verified). Status was unknown to Zaal; now confirmed. Doc 654's "ship by end of May" deadline has zero skill behind it as of 2026-05-21. |
| 11 | **PROMPT_CONTEXT.md** | REWRITE to the June/July/August open-roster model now. The current file is stale (v0 naming, T+0 2026-06-27, dropped $20/mo subsidy, all-in-June framing). |
| 12 | **Infra** | The `/zabal` Farcaster channel is live (created 2026-05-22). Everything else is still ahead: no Supabase backend, no `$500 USDC` secured, no `zabalgames.dev` domain. |
| 13 | **Brand context** | The 7 `[TBD-Zaal]` voice/visual gaps in `zabalgames-brand-context.md` resolved in interview - see Part 7. |
| 14 | **This session scope** | Full sweep: this doc + fix `zabalgames.html` mentor copy + rewrite `PROMPT_CONTEXT.md` + draft a public recruitment post. |

---

## Part 1 - What ZABAL Games Is

ZABAL Games is **not a generic hackathon**. It is a **Farcaster-creator onboarding event for the ZAO ecosystem** - a structured way to bring hungry, Farcaster-active vibe-coders into ZAO by having them build something real, in public, with a ZAO mentor in their corner.

- **Host:** Zaal / BetterCallZaal (FID 19640).
- **Framing:** "Season 1" - a recurring format. Earlier drafts called it "v0" / "Claude Code Hackathon"; current framing is Season 1 + "Farcaster Vibe-Coding Challenge" (tool-agnostic).
- **Thesis:** The builds matter, but the people matter more. Bring talented builders in, give them deep ZAO context, let them ship something useful for the community with a ZAO mentor as embedded teammate, and have them earn governance during the event itself. Stay after - great. Leave - they still walk away with a real artifact, a real relationship, and a real onchain credential.
- **What success looks like:** A cohort of new builders who understand ZAO from the inside, a stack of real artifacts shipped for the ecosystem, and a repeatable format that compounds the builder network each Season.

Public landing page: `bettercallzaal.com/zabalgames.html`.

---

## Part 2 - The Calendar (June / July / August)

Three months. Pivoted from the original all-June compression in the 2026-05-16 meeting with Jordan/yerbearzerker (Doc 654). Dates stay at month granularity - exact dates lock once cohort + mentor availability are known (Decision #3).

| Month | Phase | What runs |
|-------|-------|-----------|
| **June** | Prep | Recorded Far-Hack-style sessions. ZAO teachers cover governance, Respect, ZOLs, fractals. Vibe-coding instructors cover Claude Code, Cursor, MCP, agent harnesses. Tool walkthroughs: Empire Builder V3, zlank.online, POIDH bounties, Juke, Songjam. Watchable live or after. The ZAO context skill is meant to go live here for any agent to load. |
| **July** | Open build-a-thon | Anyone with the chops ships a build aligned to ZABAL / ZAO / WaveWarZ. The build IS the application. Bar: live URL + open-source repo + 60s demo + `/zabal` cast. Mentors watch rolling and claim champions. Every July ship earns Respect (Decision #4). |
| **August** | The Finals | Mentor-champion pairs lock. Same Finals prompt for all. 24h build (mentor embedded as teammate) + 24h promote + 24h ZAO governance vote + live reveal stream. Finalists who want a token Ascend their Empire via Clanker with an airdrop. |

**Why three months:** the original ~30-day all-June plan compressed teach + build + judge too tightly. June-prep solves "people show up cold." July-as-open-month lets builds breathe and lets mentors evaluate a real submission pool. August gets the Finals' focused energy.

### August Finals 72-hour timeline (relative; absolute T+0 open)

```
T-3 days   Onboarding call: rules, infra, wallet linkage, visibility-mode
           lock-in, voting walkthrough
T+0        Prompt drops to all finalists simultaneously. Voter snapshot taken.
T+0..24h   BUILD WINDOW. Mentor embedded as teammate. Build in public.
T+24h      Ship deadline: live URL + open-source repo + 60s demo + ship cast
T+24..48h  PROMOTE WINDOW. ZAO accounts amplify all builds.
T+48..72h  ZAO GOVERNANCE VOTE. Respect-earning members, 1-person-1-vote.
T+72h      Live results-reveal stream. Recognition order announced.
           USDC + collectibles distributed.
```

---

## Part 3 - Format

### Two-phase model

| Phase | What |
|-------|------|
| **Phase 1 - July open build-a-thon** | Anyone can enter by building. Vibe-code something with the ZAO context, ship it publicly. The build is the application. Genuinely open - curation happens on demonstrated work, not bios. |
| **Curation window** | As July builds ship, ZAO mentors watch rolling. Each mentor claims one champion - first-come-first-served per mentor. Mentor-champion pairs lock the August Finals roster. |
| **Phase 2 - August Finals** | Same Finals prompt for all finalists. 24h build with mentor embedded + 24h promote + 24h governance vote + reveal stream. |

### Mentors - open roster (CHANGED 2026-05-21)

The named 8-mentor roster from Doc 630 is **removed** (Decision #1). Mentors are now openly recruited through the public form on `zabalgames.html`. What stays:

- The **embedded-teammate mechanic**: a mentor pairs with a champion and is live with them through the August Finals (Discord/Meet, DMs, on-call) - handling project management, ZAO connections, and distribution while the player codes.
- The mentor is as important as the player - the connection point that keeps the player locked in.
- **Mentor incentive ("on the team"):** a Hats Protocol "ZAO Mentor S1" role NFT (permanent onchain role), a private mentor channel, public cast credit, ongoing ZAO ops involvement, auto-eligibility for future Seasons. No cash - team membership + status.
- **Per-mentor categories:** each mentor still defines their own search style (the builder archetype they want) before the open call. Collected as the roster fills.

### Finalist count - open

Doc 630 fixed 8 finalists because there were 8 mentors. With the roster open, **the Finals size is decided after July** (Decision #2), keyed off submission volume and how many mentors sign up. The "all finalists win" principle holds regardless of count: the competition is in Phase 1 selection; the Finals are a collaboration.

### Tooling + visibility

- **Tool-agnostic.** Claude Code, Cursor, Windsurf, Aider, Cline, Bolt, v0, Lovable, or a hand-rolled pipeline. The constraint is not the tool - it is **show your work in public**.
- **4 visibility modes**, pick at least one primary: (1) live Twitch stream, (2) recorded screen sessions uploaded within 1h, (3) public AI prompt logs every 1-2h, (4) frequent build casts every 1-2h.
- **Anti-cheat:** empty starter repo at T+0 (verified empty git log) + visibility-mode timestamps cross-checked against git commit times.

---

## Part 4 - The Build Prompt

No fixed Option A-E tracks. The `OPTIONS.md` referenced by `PROMPT_CONTEXT.md` was never written and is now dropped (Decision #5). Builders get two paths:

1. **Adopt a started ZAO project.** A curated list of started / in-progress ZAO projects is given to builders as ideas they can pick up and run with.
2. **Build from scratch.** Build anything that helps the ZAO ecosystem, using only the platform context.

### Candidate adoptable-project list (NEEDS ZAAL CONFIRMATION)

Pulled from Doc 654 action items + Doc 630 PROMPT_CONTEXT Part 7. Zaal to confirm which are real, adoptable, and unclaimed, and add what is missing:

- Songjam leaderboard migration - move the leaderboard off the deprecated X scraper onto an Empire Builder API leaderboard.
- POIDH bounty leaderboard on Empire Builder - counts unique on-chain bounty submitters.
- zlank.online "Today's Empire Builder Stats" daily Snap template (kmac.eth template collab).
- Twitch -> Empire Builder stream score feed.
- New ZOE skill(s).
- The `/zabal` Farcaster mini app itself (submission board, starter board).
- COC Concertz content-pipeline automation (record -> Descript -> newsletter -> cross-post).
- Streaming auto-clip flywheel (30+ hours of Games stream -> 150+ short clips).

**This list is a Next Action - it is NOT yet confirmed.**

---

## Part 5 - Prize, Collectible, Respect

### Prize pool - unchanged ($500 USDC)

| Place | USDC |
|-------|------|
| 1st | $150 |
| 2nd | $100 |
| 3rd | $75 |
| 4th-8th | $35 each |
| **Total** | **$500** |

Every finalist who ships gets paid - tiering is recognition of standout work, not win/lose. **Open risk:** the table assumes 8 finalists. If Finals size lands below 8 (Decision #2), the 4th-8th band must be re-cut before the Finals.

### Participation collectible - locked

A Hats Protocol role NFT on Base (Decision #9, locked 2026-05-22). Every finisher gets one: every July build that hits the submission bar, plus every August finalist. It is the universal "I shipped at ZABAL Games S1" credential, sitting alongside the Respect every July ship earns.

### Respect

- Every July submission that hits the bar earns Respect (Decision #4).
- Finalists earn additional Respect during the August Finals.
- Respect is ZAO's soulbound, peer-validated, Fibonacci-ranked reputation - earned in weekly fractal sessions. It is also what defines the ZABAL Games voter set.

### Total ZAO cost

~$510-525: $500 USDC pool + ~$10 Hats mints on Base. Submission tech (Supabase free tier) and voting infra are $0. Tooling subsidy was dropped 2026-05-11.

---

## Part 6 - Empire Builder + Token Mechanic

### Empire V3 tier stack (Doc 654)

| | Basic Empire (free, tokenless) | Ascended Empire (token launch) |
|--|------|------|
| Leaderboards | 2 | 10 |
| Boosters | 10 | 40 |
| Ranked spots/leaderboard | 250 | 500 |
| Cost | Free | Token launch via Empire Builder UI |

### Build-then-airdrop pattern

Optional, finalist-driven. A builder can: build a contribution leaderboard during the Games -> export the CSV -> that IS the airdrop list -> launch a token through Empire Builder's Clanker integration -> Empire instantly Ascends -> airdrop with a vesting schedule to the CSV. Contributors get paid before speculators arrive.

Jordan's framing: "Token is an assist. It serves a role in the ecosystem. We're not optimizing for speculators." The anti-pattern is "launch token first, figure out project later."

### Token mechanic (Doc 646)

Fully opt-in. Default = no token. A finalist who wants "stream tied to a token" mints via Clanker (Farcaster cast, effectively zero cost, LP auto-paired with WETH, 100% creator fees to player wallet). Token volume is a parallel viewer signal displayed alongside the DAO vote - it does NOT influence placement. Recommended surfacing for v0: mention in onboarding only, keep the public page clean.

ZABAL itself is an Ascended Empire, launched via Clanker 2026-01-01. Token contract `0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07` on Base. Empire address `0xe0faa499d6711870211505bd9ae2105206af1462`.

---

## Part 7 - Brand Context Resolution

`zabalgames-brand-context.md` had 7 `[TBD-Zaal]` voice/visual gaps. Resolved in interview (Decision #13):

| Brand | Voice | Visual |
|-------|-------|--------|
| **ZAO OS** | 1:1 with the ZAO umbrella - no distinct tone. | 1:1 with the umbrella - no distinct treatment. |
| **$ZABAL + Empire Builder** | Mechanism-forward, token-economy-native, transparent, not hype-y (draft confirmed). | **Has its own wordmark/logo and a distinct zabal.art creative-hub aesthetic.** Exact palette + wordmark spec must be pulled from `zabal.art` - flagged as a Next Action, not invented here. |
| **WaveWarZ** | **Yes - the loud arena brand.** Competitive, sports-energy, stats-forward (W/L records, SOL volume). Deliberately the opposite of the warm ZAO-umbrella tone. | Partner-built (Ikechi). Pull from `wavewarz-intelligence.vercel.app` - Next Action. |
| **ZAO Festivals / ZAOstock** | Confirmed: "Partiful warmth + Luma competence," first-person, community-rooted. | **Carries a Maine/local visual influence** - Ellsworth, Art of Ellsworth, Northeast indie. |
| **ZAO Music** | The **artist-collective** voice - members making music together (not a label voice). | Rides the ZAO umbrella visual - no separate identity. |
| **COC Concertz** | Warm, communal, builder-energy - same family as the ZAO umbrella (confirmed 2026-05-22). | Its own distinct brand - colors, logo, vibe separate from the umbrella. Spec pending - Zaal to describe. |
| **Respect + Fractals** | Confirmed: ritual, earned, communal - reputation-with-weight, not gamified-points. | **Has a visual motif** tied to the Fibonacci ranking / fractal sessions. |

**COC Concertz mission line** (was blank): **"Give virtual concerts a real home"** - a real home for virtual + metaverse concerts and the promoters who run them (Decision #13).

Still open: COC Concertz visual spec (Zaal to describe - it is its own distinct brand); the concrete ZABAL wordmark/zabal.art palette spec; the WaveWarZ palette spec.

---

## Part 8 - Infrastructure Status

The `/zabal` channel exists; everything else is still ahead.

| Item | Status | Notes |
|------|--------|-------|
| Supabase submission backend | NOT LIVE | `zabalgames-schema.sql` exists (5.2 KB). Project not created, schema not run, no URL/anon key in `zabalgames.html`. The form + board are non-functional. |
| `/zabal` Farcaster channel | LIVE | The cast destination - farcaster.xyz/~/channel/zabal. Created 2026-05-22. All copy uses `/zabal` (the page stays `zabalgames.html`). |
| `$500 USDC` prize wallet | NOT SECURED | No dedicated wallet funded. |
| `zabalgames.dev` domain | NOT REGISTERED | `PROMPT_CONTEXT.md` promises `<player>.zabalgames.dev` subdomains. |
| ZAO context skill | DOES NOT EXIST | Filesystem-verified - no skill folder in `~/.claude/skills`, `.agents/skills`, or ZAO OS. Raw material only: `zabalgames-brand-context.md` (7 gaps) + `PROMPT_CONTEXT.md` (stale). |
| `zabalgames.html` page | LIVE | Calendar already updated to June/July/August. Mentor copy still says "8 ZAO mentors" in ~15 places - needs the open-roster rewrite. |
| `OPTIONS.md` | NEVER WRITTEN | Dropped (Decision #5). |

---

## Part 9 - Open Gaps

### Deliberately open (decided to leave open)

- Exact dates for all three windows + August Finals T+0.
- August Finals size / finalist count.
- Voting mechanism (Snapshot vs onchain) + Respect threshold N for voter eligibility.

### Still needs Zaal input

- The confirmed adoptable-project list for the build prompt (Part 4).
- COC Concertz visual identity (voice locked 2026-05-22 - warm + communal).
- The concrete ZABAL wordmark + zabal.art palette spec.
- The WaveWarZ palette spec (extract from the live UI).
- Per-mentor category 1-liners (collected as the open roster fills).
- The August Finals prompt content (sealed-until-T+0, still to be written).

### Doc hygiene

- Doc 654's folder is `654-...` but its body twice cites itself as "Doc 653." Cosmetic - fix on next touch.

---

## Part 10 - File + Doc Touch Points

| File / Doc | Action |
|------------|--------|
| `BetterCallZaal/zabalgames.html` | Rewrite all "8 ZAO mentors" copy to the open-roster model. Confirm calendar copy. (This session.) |
| `BetterCallZaal/zabalgames-brand-context.md` | Fill the 7 voice/visual fields with Part 7 resolutions; leave COC + concrete palettes flagged. (This session.) |
| `ZAO OS V1/research/events/630-.../PROMPT_CONTEXT.md` | Full rewrite to June/July/August open-roster model. (This session.) |
| `ZAO OS V1/research/events/630-.../README.md` | Add a superseded-for-state note pointing to Doc 701. |
| `ZAO OS V1/research/events/654-.../README.md` | Add a superseded-for-state note pointing to Doc 701; fix the "Doc 653" self-reference. |
| `BetterCallZaal/zabalgames-schema.sql` | No change - holds until Supabase project is created. |
| Recruitment post | Draft a public post to open mentor + builder recruitment. (This session.) |

---

## Part 11 - Build + Hosting Decisions (Tyler call, 2026-05-22)

Two layers landed after the original 2026-05-21 interview: a mini app grilling, then the 2026-05-22 Tyler Stambaugh call ([Doc 714](../714-tyler-zabal-zaostock-may22/)). Tyler is the Magnetic founder and a confirmed ZABAL Games collaborator.

### Hosting - two surfaces

ZABAL Games runs on TWO surfaces, split by job:

| Surface | Repo / platform | Job |
|---------|-----------------|-----|
| **Magnetic portal** | Magnetic (Tyler's platform) | The connection point - the full workshop video library in one place, entry/onboarding, polls, and the UGC field for submissions + suggestions. Magnetic gives native video hosting, NFT-gated magnets, opt-in email capture, and per-vendor watch analytics out of the box. |
| **Farcaster mini app** | new standalone repo `bettercallzaal/zabalgames`, deployed on a `zabal.art` subdomain | The explainer + front door only. Explains ZABAL Games and links out to the important things (Magnetic portal, the page, `/zabal`). Light - NOT the full event hub the earlier grill scoped. |

The `zabalgames.html` page stays the public marketing page. The mini app + page share no heavy backend; Magnetic is the system of record for entry + submissions.

### Entry - the Zabal connector NFT

Entry / RSVP to ZABAL Games is collecting the **Zabal connector** - the anchor magnet. It behaves like a Discord "general" channel; other magnets are side channels. Low-friction: opting into road-to-ZAOstock auto-drops the connector. Mechanic is decided; it needs art only - generate the image and send to Tyler for the Magnetic magnet.

### The July build prompt - llms.txt + Claude skill

The July submission prompt is built in BOTH formats from one source: a machine-readable **llms.txt / context file on the website** (Tyler's framing - any AI harness points at it) AND the packaged **Claude skill**. Describes every ZAO project and its current state. This is the same artifact tracked as "the context skill" in Part 9.

### Workshop month - Tyler confirmed

June = workshop month: builders across the ecosystem record one ~30-min session positioning their tool for the hackathon. Tyler is the **first confirmed workshop lead** - a 30-min Magnetic pitch, any day in June, livestreamed then clipped.

### Launch sequence

- **~2026-05-24 (this weekend):** public announcement. ZABAL Games and ZAOstock go out as SEPARATE posts (not combined). Plus Zaal live on Farcaster spaces, DJing old ZAO music for lore.
- **~2026-05-30 (soft launch):** minimum viable surface live - a UGC submission field, a volunteer/interest poll, and Zaal's intro video. Not everything, just a place to land.

### Still undecided (Tyler layer)

- Whether participants get the paid Claude Code community tier (via WAP) free for 3-4 months - Zaal floated it, explicitly "not worried about that yet."
- Magnetic's SNAPS retention framework (Status, Novelty, Access, Power, Stuff) - relevant to how ZABAL Games retains participants; not yet designed in.

---

## Also See

- [Doc 714](../714-tyler-zabal-zaostock-may22/) - Tyler x Zaal call - the Magnetic hosting + connector + announcement decisions in Part 11
- [Doc 630](../630-zabal-games-claude-code-hackathon-v0/) - ZABAL Games Season 1 long-form spec + decision log + `PROMPT_CONTEXT.md`
- [Doc 654](../654-zabal-games-empire-v3-yerbearzerker-meeting/) - Empire V3 + June/July/August calendar pivot meeting
- [Doc 646](../../business/646-clanker-empire-builder-zabal-games-promote/) - Clanker + Empire Builder optional token mechanic
- [Doc 626](../../business/626-empire-builder-zabal-poidh-airdrop/) - Empire Builder apiLeaderboards + POIDH airdrop pattern
- [Doc 584](../../business/584-empire-builder-farcaster-creator-playbooks/) - Empire Builder creator playbooks + booster stacks
- [Doc 631](../../business/631-poidh-zabal-sentinel-convergence/) - POIDH x ZABAL on-chain bounty data
- [Doc 666](../../business/666-zabal-brand-kit-page/) - ZABAL brand kit page

---

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Rewrite `zabalgames.html` mentor copy to open-roster model | @Zaal | Edit | This session |
| Fill `zabalgames-brand-context.md` voice/visual fields | @Zaal | Edit | This session |
| Rewrite `PROMPT_CONTEXT.md` to June/July/August open-roster | @Zaal | Edit | This session |
| Draft + publish public mentor/builder recruitment post | @Zaal | Cast | This session draft; publish when ready |
| Confirm the adoptable-project list (Part 4) | @Zaal | Decision | Before June bootcamp |
| Define COC Concertz voice + visual | @Zaal | Decision | Before context skill ships |
| Pull ZABAL wordmark + zabal.art palette into brand-context | @Zaal | Research | Before context skill ships |
| Build the ZAO context skill (does not exist) | @Zaal | Build | Re-baseline the end-of-May deadline |
| Create Supabase project + run schema + wire `zabalgames.html` | @Zaal | Build | Before July open call |
| Secure $500 USDC in a dedicated wallet | @Zaal | Treasury | Before August Finals |
| Decide: Finals size, voting mechanism, Respect threshold, collectible spec | @Zaal | Decision | After July submissions land |
| Lock exact dates once cohort + mentor availability known | @Zaal | Decision | When open call closes |

---

## Sources

- [FULL] `ZAO OS V1/research/events/630-zabal-games-claude-code-hackathon-v0/README.md` - Season 1 spec, read in full.
- [FULL] `ZAO OS V1/research/events/630-zabal-games-claude-code-hackathon-v0/PROMPT_CONTEXT.md` - player bundle, read in full; confirmed stale.
- [FULL] `ZAO OS V1/research/events/654-zabal-games-empire-v3-yerbearzerker-meeting/README.md` - Empire V3 meeting, read in full.
- [FULL] `ZAO OS V1/research/business/646-clanker-empire-builder-zabal-games-promote/README.md` - token mechanic, read in full.
- [FULL] `BetterCallZaal/zabalgames-brand-context.md` - brand identity guide, read in full.
- [FULL] `BetterCallZaal/zabalgames.html` - live landing page, scanned for calendar + mentor copy.
- [FULL] Filesystem verification 2026-05-21 - context skill absent; `OPTIONS.md` absent; `zabalgames-schema.sql` present.
- [FULL] Decision interview with Zaal, 2026-05-21 - 6 rounds, 24 questions, recorded as Key Decisions above.

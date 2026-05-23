---
topic: events
type: meeting-recap
status: research-complete
last-validated: 2026-05-22
related-docs: "701, 654, 505, 583"
tier: STANDARD
---

# 719 - Jordan Oram x Zaal: ZABAL Games + Empire Builder v3 integration

> **Goal:** Lock in the 2026-05-15 Zoom call between Zaal and Jordan Oram (founder of Empire Builder) on integrating Empire Builder v3 + Zlank into ZABAL Games, the tokenless-empires pattern, and the build-a-thon's 3-month shape.

Filename was generic ("zm - 2026_05_15..."); Zaal initially thought it was a Fellenz call. Frames confirmed the on-screen name tag was Jordan Oram.

## Key Decisions

| # | Decision | Owner | Status |
|---|----------|-------|--------|
| 1 | **ZABAL Games format is 3 months** - June phase-1 open build (workshops + collab), July-August phase-2 with 8 mentors + 8 finalists, live-streamed | Zaal | TODO |
| 2 | **Create a context / prompt doc** that any builder (or AI harness) can read to onboard onto every ZAO project, with starter ideas + unfinished builds | Zaal | TODO |
| 3 | **Run a FarHack-style recorded tutorial series** - Jordan + team teach Empire v3 tools to builders, public so anyone can follow along | Both | TODO |
| 4 | **ZABAL Games runs on zlank.online templated builds + Empire Builder snap deployment** - tokenless empires in phase 1, token launch in phase 2 | Both | TODO |
| 5 | **Token mechanics: tokenless first, optional clanker / pump.fun launch later** - per-builder or one collective ZABAL Games token, decision deferred | Both | TBD |

## Thread 1 - Tokenless empires is the anti-pattern fix

### The Idea

Jordan's frame: the dominant crypto launch flow is "token first, project later" - it inverts everything. Empire Builder v3 supports tokenless empires - create the empire, build the treasury, run custom leaderboards, validate the community, and only then launch the token (and airdrop to the people the leaderboards already identified). The token becomes an "assist" in the ecosystem rather than the main event.

### Why It Matters

ZABAL Games can run cleanly inside this model. Phase 1 = tokenless empires per builder, leaderboards capture who actually shows up. Phase 2 = decide whether to launch a builder-specific token (clanker) or a collective ZABAL Games token, airdropped from the leaderboard data.

### Next Step

Zaal drafts the ZABAL Games context prompt for June. Jordan readies the zlank.online + Empire Builder skin for builders to spin up tokenless empires inside the games portal.

## Thread 2 - The 3-month games shape

### The Idea

Month 1 (June): open phase. Workshops, demos, presentations. Zaal invites anyone in the ZAO network to give a ~30-min workshop pitching their tool as usable for the hackathon. Tom Fellenz mentioned as a known mentor. Month 2-3 (July-August): finalist phase. 8 mentors paired with 8 finalists, public stream. The output is one content library all in one place that any AI harness can be pointed at.

### Decisions Pending

Mentor roster + recruitment style (named list vs open call). And whether participants get the paid Claude Code / WAP tier free for 3-4 months as a perk - Zaal floated it, "not worried about that yet."

### Next Step

Mentor list curation alongside the context-prompt build.

## Thread 3 - Snaps as the ad / engagement primitive

### The Idea

Jordan's API calls produce both a website and a snap from the same definition - so a builder does not need a high-FID full-auth account to interact with low-risk snap actions like clicking a poll. This dovetails with kmac.eth's JFS-relaxation pitch from doc 718. The snap-as-ad pattern - drop a snap on any site, it works as an interactive widget without forcing Farcaster signup at the click level.

## Action Items

| # | Action | Owner | Category | Due |
|---|--------|-------|----------|-----|
| 1 | Draft the ZABAL Games June 2026 context prompt - starter ideas, brand guidelines for ZABAL / Zaur / WaveWarZ, beginner-friendly skill + build references | Zaal | ZABAL Games | 2026-05-31 |
| 2 | Coordinate the FarHack-style tutorial series (Empire v3 skills, leaderboards, snap-as-ad templates) with Jordan for public recording | Both | ZABAL Games | TBD |
| 3 | Build the zlank.online + Empire Builder interface for ZABAL Games phase 1 - tokenless empire spin-up flow | Jordan | Site / Tech | TBD |
| 4 | Finalise the mentor roster (8 mentors + 8 finalists) - open recruitment vs named list | Zaal | ZABAL Games | TBD |
| 5 | Explore token airdrop mechanics (clanker API + CSV from leaderboard) for phase-2 launch | Both | Site / Tech | TBD |

## Verify / Low-confidence

- **Token mechanics** (decision 5, action 5) - Jordan and Zaal aligned on "tokenless first, token later", but the *specific* launch path (per-builder clanker vs collective token) was explicitly deferred. Logged confidence low.
- **The "8 mentors + 8 finalists" number** - stated as the working plan, not confirmed against any external list. Mentor roster open.

## Key Quotes

> "The anti-pattern is launch token first, figure out the project later. Instead: build project, build community, build leaderboards identifying who is showing up, then when you launch a token you airdrop to those people." - Jordan

> "With tokenless empires you can create an empire, build your treasury, build your leaderboards, do custom leaderboards, get all that ready before you launch the token." - Jordan

> "I want to leverage tokens in some way shape or form - clanker or pump.fun would be cool. The idea is the token serves a role in the ecosystem; it is an assist, not the main event." - Jordan

> "I like this - it is kind of like Farcaster is the estuary where baby fish grow big and strong before they go out into the ocean." - Zaal

> "One of the challenges a lot of people have with snaps is the authentication layer - you need a very high FID to interact. My API calls just create a website that also works as a snap - you do not need full authentication to click a poll." - Jordan

## Research Seeds

- Tokenless empires + leaderboard-as-airdrop-list as the canonical Empire Builder v3 pattern.
- ZABAL Games 3-month shape: workshop month -> open build -> finalist phase.
- FarHack-style tutorial series as a reusable on-ramp for any builder-tool ecosystem.
- Snap-as-ad pattern (cross-references doc 718's kmac.eth FIP).
- Token-as-ecosystem-utility vs speculative-launch framing.

## Memory Updates

Files written to `~/.claude/projects/.../memory/`:

- `project_jordan_oram.md` - new. Jordan Oram: founder of Empire Builder, key ZABAL Games collaborator. Empire v3 tokenless empires, snap templates, API integrations. Doc 719.

Existing memory updated:

- `project_zabal_games.md` - confirm 3-month shape (June workshops, July-Aug finalists), Empire Builder + zlank.online as the build substrate.

## Also See

- [Doc 701 - ZABAL Games canonical state](../701-zabal-games-canonical-state/) - the source of truth this call advances
- [Doc 654 - ZABAL Games + Empire V3 - yerbearzerker](../654-zabal-games-empire-v3-yerbearzerker-meeting/) - prior ZABAL Games + Empire V3 thread
- [Doc 583 - Empire Builder ZAO OS ideas](../../dev-workflows/583-empire-builder-zao-os-ideas/) - integration ideas
- [Doc 505 - Zlank no-code snap builder](../../dev-workflows/505-trae-ai-solo-evaluation/) - the snap-build substrate
- [Doc 718 - kmac.eth Farcaster snaps](../718-kmac-farcaster-snaps-ad-networks-may13/) - the snap-as-ad pattern that pairs with this
- [[project_jordan_oram]] - new memory
- [[project_zabal_games]]
- [[project_empire_builder_zabal_integration]]

## Distribution Log

- Action tracker: HELD - waiting on brand-label schema (doc 717)
- Bonfire episodes: posted via /bonfire (1 summary + 5 decisions + 5 actions)
- Telegram: not requested
- Memory writes: 1 new (`project_jordan_oram`), 1 update (`project_zabal_games`)
- Calendar: skipped

## Transcript

Full transcript: [transcript.md](transcript.md)

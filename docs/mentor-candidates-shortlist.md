# Mentor candidate shortlist - August Finals

> A researched, prioritized list of who to recruit as ZABAL Gamez mentors, with the track fit and
> the angle for each. Companion to `docs/mentor-outreach-2026-05-24.md` (that doc is the ask + the
> outreach copy; this doc is the who). The goal is to turn the open "lock the mentor roster"
> owner-action into an actionable list. Drawn from verified people in `data/people.json` +
> `data/workshop-leads.json`. Brand: no emojis, no em dashes.

## The pool insight: workshop leads are the best mentors

A mentor commits to claim one builder and run a ~24h embedded build window in the August Finals
(full ask in `docs/mentor-outreach-2026-05-24.md`). The single best signal that someone will do
that well is that they **already showed up and taught a ZABAL Gamez session**. The delivered +
scheduled workshop leads are a proven, warm pool - start there before going cold. `data/mentors.json`
currently has one entry (Zaal), so this is the recruiting list to work down.

## Shortlist by track (warm - all are confirmed ZABAL Gamez leads)

### Builder track
| Candidate | Handle | Why a fit |
|---|---|---|
| yerbearserker (Jordan) | @yerbearserker | Empire Builder co-founder; taught Day 1; mentors token-mechanics / ecosystem builds. |
| Adrian / diviflyy | @diviflyy | Empire Builder co-founder + lead engineer; the technical mentor for leaderboard/booster builds. |
| Joshua.eth | @joshuaeth | Bonfire founder; mentors graph/agent-memory builds. |
| Plat0x | @plat0x | Bonfire technical architect + vibe-coding teacher; strong hands-on mentor. |
| kmac.eth | @kmaceth (confirm: leads list @kmac.eth) | Farcaster Snaps builder; mentors mini-app/Snap builds. |
| Cassie | @cassie | Quilibrium / Farcaster protocol depth; mentor for protocol-level builds. |
| Adam Miller | @thethriller | MIDAO + Beta Briefing; legal-structure + agentic mentor. |
| Ali Tiknazoglu | @alitiknazoglu | Vibecoding / Inflynce; the right mentor for beginner builders. |
| Adrienne | @adrienne | GM Farcaster engineer, built Warpee.eth; mentor for AI-agent builds. |
| kmac / Snaps, Dan Singjoy | @dansingjoy | Fractals/governance; mentor for Respect/ORDAO-adjacent builds. |

### Artist track
| Candidate | Handle | Why a fit |
|---|---|---|
| Hurric4n3Ike | @hurric4n3ike | WaveWarz founder + season partner; mentors music-market / artist-economics builds. |
| Joseph Goats | @josephgoats | Independent musician (Digital Street Music); mentors artist-ownership builds. |
| Chris (Sopha) | @chriscocreated | Sopha founder; mentors curation / client builds for artists. |
| Duo Do | @duodomusica | Musician duo on Farcaster; mentors artist-distribution builds. |

### Creator track
| Candidate | Handle | Why a fit |
|---|---|---|
| Will T of Web3 | @willtofweb3 | KFMEDIA; mentors media-company / education builds. |
| Jonathan Colton | @jonathancolton | FounderCheck + Fotocaster; mentors validation + distribution. |
| Ohnahji | @ohnahji | Livestream community founder; mentors audience-growth builds. |
| Kenny | @kenny | POIDH; mentors bounty / incentive-mechanic builds. |
| Jub Jub | @jubjub | Farcaster Batches organizer; mentors builder-community + shipping discipline. |

(Handles above are from `data/people.json`; the two flagged below are placeholders, do not use them
in outreach until confirmed: **@aziz-motomoto** (Aziz / BAD DAO) and **@chrisdolinsky** (Chris
Dolinsky / Vini App) are not verified Farcaster handles. Both are strong builder-track mentor
candidates once their real handles are confirmed.)

## Cold prospects to research (not yet ZABAL Gamez leads)

From the recruiting signals in `docs/workshop-media-tracker.md` (section D) - confirm a handle
before any outreach, none fabricated here:
- Arthur (Neynar) - Base/EVM infra mentor.
- Sam (WaveWarz-Base) - agentic music-infra mentor (already a core builder, @sam-wwbase pending full handle).
- DCoopOfficial (Coop Records) - music/label mentor.
- Riley Beans - prospect.

## Prioritization (who to ask first)

1. **The partners + co-founders** already closest to the season: yerbearserker, diviflyy,
   Hurric4n3Ike, Tyler Stambaugh, Plat0x - lowest-friction yeses, deepest rails.
2. **Delivered leads with a clear track fit:** Joshua.eth, Cassie, Will T, Jonathan Colton,
   Chris (Sopha), Ohnahji, Kenny.
3. **Scheduled leads, after their session runs** (warmest right after they teach): Adrienne,
   Ali, Dan Singjoy, Jub Jub, Dr. Jake, kmac.eth.
4. **Cold prospects** last, once a handle is confirmed.

Aim for the 5-8 roster the outreach doc targets, spread across all three tracks.

## Next actions

| Action | Owner | Type |
|--------|-------|------|
| Send the mentor ask (template in mentor-outreach doc) to the tier-1 candidates | Zaal | Outreach |
| As each confirms, add them to `data/mentors.json` + run `node scripts/build-crm.mjs` | Zaal/Claude | Data |
| Confirm @aziz-motomoto and @chrisdolinsky real handles before adding them | Zaal | Confirm |
| Confirm a handle for each cold prospect before outreach | Zaal | Research |

## Sources

- `data/people.json` (roles + expertise + handles) and `data/workshop-leads.json` (the confirmed lead slate) - [FULL]
- `docs/mentor-outreach-2026-05-24.md` (the ask + outreach templates) - [FULL]
- `docs/workshop-media-tracker.md` section D (cold prospects: Arthur, Sam, DCoopOfficial, Riley Beans) - [FULL]
- Handle caveats: @aziz-motomoto and @chrisdolinsky are unverified placeholders (see `docs/a11y-audit-2026-06-14.md` PR note + the CRM verification PR) - [FULL, flagged]

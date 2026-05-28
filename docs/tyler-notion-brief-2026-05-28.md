# Tyler Brief - ZABAL Games Notion Workspace Organization

> Brief for Tyler Stambaugh (Magnetiq, workshop lead #001) - collaborator on the Notion command center for ZABAL Games. Tyler owns the workspace, the content is shared. Zaal proposes a structure + seed data; Tyler refines based on his portal + retention expertise.

## Telegram DM (Zaal sends this)

```
Tyler -

For ZABAL Games Notion - put together a brief with proposed structure
+ all our content seeded so you can copy it in + shape from there.

Key thing: site auto-pulls from your Notion. Whatever you organize as
the source of truth, zabalgames.com renders. So you have full say on
schema + we just propose what fits the site rendering.

Brief + seed data here:
github.com/ZAODEVZ/zabalgames/blob/main/docs/tyler-notion-brief-2026-05-28.md

Few specific Qs for your retention/portal expertise inside. Reply
whenever - no rush before Jun 1 launch.

Z
```

(Adjust salutation + closing to match how you + Tyler actually talk on Telegram.)

---

## THE BRIEF (Tyler reads this after clicking the link)

## Why this exists

Standing up Notion as the CMS for **zabalgames.com**. Workshops, people, announcements, FAQ - all live in Notion as databases. When you (Tyler) update Notion, a webhook fires Vercel, the static site rebuilds with the new data, and it's live in ~5 min.

You own the workspace + the schema. We propose what fits the site rendering today, but it's yours to shape - your Magnetiq retention + portal experience matters more here than ours.

## What's already locked

These don't change without ecosystem-wide discussion. Treat as input constraints:

- **3 phases:** June workshops, July open build, August Finals
- **Prize pool v0:** $500 USDC sponsored by ZAO Festivals team (Top 8 share USDC, Top 16 get $ZABAL)
- **Respect threshold:** 1000+ to vote (soulbound, peer-validated, earned in fractal sessions)
- **Workshop #001:** you (Tyler / Magnetiq pitch) - any weekday in June
- **Workshop #002:** Thy Revolution (2 sessions, topics TBD)
- **Mentor roster:** open + recruiting (no specific list public yet)
- **Brand glossary** at `docs/brand-kit-2026-05-28.md`
- **Voice rules:** no emojis, no em-dashes, "digital creators" framing (not "crypto"), "100+" for ZAO size

## Proposed 4-database structure

Each becomes a Notion DB. The site reads them in this order of priority.

### 1. Workshop Sessions (highest priority)

What you update most. Drives the calendar on / and /info, the roster cross-references, the Magnetiq library handoff.

**Proposed properties:**

| Property | Type | Why |
|---|---|---|
| `Name` (Title) | Title | "Magnetiq - The Workshop Library Behind ZABAL Games" |
| `Lead` (Relation -> People) | Relation | -> Tyler Stambaugh |
| `Status` | Select: confirmed / tentative / open / past | Site shows different colors per status |
| `Date` | Date | empty if TBD |
| `Time` | Text | "8pm EST" |
| `Format` | Select: 30-min talk / 45-min talk + Q&A / 60-min hands-on / 90-min deep-dive | For session card layout |
| `Topic` | Text | session description |
| `Lu.ma URL` | URL | RSVP link |
| `Restream URL` | URL | for the studio (live + recorded) |
| `Magnetiq URL` | URL | where the recording lives after the session |
| `Order` | Number | sort order on display |

**Suggestions from us (you decide):**

- Status select might want a 5th value: `published-to-magnetiq` once the recording lives on your portal
- `Magnetiq URL` field lets the site auto-link "watch recording" once you've published
- Adding a `Cover image` (Files) lets the site render a thumbnail per session

**Question for you:** does this match how Magnetiq portal currently tracks workshop content? If you already use a Magnetiq-internal schema, name fields the same so the eventual handoff (when you import workshop recordings to Magnetiq) doesn't require field-mapping.

### 2. People (mentors, workshop leads, organizers, builders)

The roster that renders on /p and individual /p?handle=X profile pages.

**Proposed properties:**

| Property | Type | Why |
|---|---|---|
| `Handle` (Title) | Title | "bettercallzaal" - lowercase, Farcaster handle preferred |
| `Name` | Text | "Zaal Panthaki" |
| `Roles` | Multi-select: organizer / mentor / workshop_lead / core_builder / sponsor / partner / builder | Drives role pills + filter |
| `Headline` | Text | 1-line credential |
| `Bio` | Rich text | 1-3 paragraph background |
| `Expertise Label` | Select: ECOSYSTEM / MUSIC TECH / CONTRACTS / RETENTION / PREDICTION MARKETS / etc | Card label |
| `Color` | Select: orange / cyan / gold / pink / zabal | Card accent |
| `Avatar URL` | URL | Falls back to /assets/icon.png if empty |
| `Farcaster URL` | URL | Profile link |
| `X URL` | URL | Optional |
| `Site URL` | URL | Optional |
| `What They Offer` | Rich text | Mentors only |
| `Best Fit For` | Rich text | Mentors only |
| `Audited Date` | Date | When facts last verified |

**Suggestions from us:**

- For RETENTION-relevant data (your area of expertise), consider adding `SNAPS Signal Strength` (Number 0-5) so we can sort the roster by which folks bring the most ecosystem pull
- A `Last Activity` rollup from the Announcements DB could surface "who has been active lately"

### 3. Announcements / Changelog

What renders on /changelog. Public log of what shipped + when.

**Proposed properties:**

| Property | Type | Why |
|---|---|---|
| `Title` (Title) | Title | "Workshop #002 Thy Revolution confirmed" |
| `Date` | Date | when it shipped |
| `Type` | Select: decision / feat / content / infra / fix | Color-coded badge |
| `Description` | Rich text | 1-3 sentence what + why |
| `Commit` | Text | optional SHA |
| `Links` | Rich text | markdown links syntax |

This one is straightforward. Lowest customization risk.

### 4. FAQ

What renders on a new /faq page (Phase 2 build).

**Proposed properties:**

| Property | Type | Why |
|---|---|---|
| `Question` (Title) | Title | "Why ZABAL?" |
| `Answer` | Rich text | "$ZABAL is the ecosystem token..." |
| `Category` | Select: general / prizes / format / build / watch / sponsor | For filtering |
| `Order` | Number | sort within category |

## Seed content to paste into the workspace

Below: every confirmed person + session + announcement we currently have on the site. Copy these into the Notion DBs once they're set up.

### People (seed 6)

```
Handle: bettercallzaal
Name: Zaal Panthaki
Roles: organizer, mentor
Headline: Organizer + BetterCallZaal + The ZAO operations
Bio: Engineer, builder, and connector in the web3/Farcaster/music ecosystem. Runs BetterCallZaal Strategies LLC, hosts COC Concertz, organizes ZABAL Games. BS Electrical Engineering, RIT 2022. Maine-based.
Expertise Label: ECOSYSTEM
Color: orange
Farcaster URL: https://farcaster.xyz/bettercallzaal
X URL: https://x.com/bettercallzaal
Site URL: https://bettercallzaal.com
What They Offer: Direct line into the ZAO ecosystem - intros, context, pattern matching against past builds, infra access.
Best Fit For: Builds that touch multiple ZAO surfaces (music + governance + agents + Farcaster). Generalists who need cross-domain connective tissue.
Audited Date: 2026-05-27
```

```
Handle: tylerstambaugh
Name: Tyler Stambaugh
Roles: workshop_lead, partner
Headline: Founder, Magnetiq - workshop library platform
Bio: Founder of Magnetiq, the workshop library + entry/onboarding platform hosting every ZABAL Games Season 1 session. Magnetiq is the host platform for the workshop month - native video, opt-in email capture, per-vendor watch analytics.
Expertise Label: RETENTION + PORTAL
Color: zabal
Site URL: https://getmagnetic.com
Audited Date: 2026-05-22
```

```
Handle: thyrevolution
Name: Thy Revolution
Roles: workshop_lead
Headline: Indie music + creator-tools workshop lead
Bio: Workshop lead #002 - confirmed 2 sessions for June 2026 (topics TBD). Also known as Mickey or Rev (three names, same person). Years building independently outside the major-label system.
Expertise Label: INDIE MUSIC
Color: orange
Audited Date: 2026-05-26
```

```
Handle: arthur-neynar
Name: Arthur
Roles: core_builder, workshop_lead
Headline: Neynar - WaveWarZ-Base contract review + June workshop
Bio: Joined the WaveWarZ-Base team via the 2026-05-19 intro call. Reviewing smart contracts + providing agent-security references. Recording a June workshop session on the contracts. EVM-native, better with Base than Solana.
Expertise Label: SMART CONTRACTS
Color: gold
Site URL: https://neynar.com
Audited Date: 2026-05-19
```

```
Handle: hurric4n3ike
Name: Hurric4n3Ike
Roles: core_builder, partner
Headline: WaveWarZ founder - Solana music battle markets
Bio: Built WaveWarZ on Solana - the artist prediction-market platform. Growing battle history + cumulative SOL volume (live numbers at wavewarz-intelligence.vercel.app). WaveWarZ is the underlying tech the August Finals will run on.
Expertise Label: PREDICTION MARKETS
Color: pink
X URL: https://x.com/hurric4n3ike
Site URL: https://wavewarz-intelligence.vercel.app
Audited Date: 2026-05-27
```

```
Handle: sam-wwbase
Name: Sam
Roles: core_builder
Headline: WaveWarZ-Base co-builder
Bio: Shipping the Base agentic version of WaveWarZ alongside Hurric4n3Ike + Arthur. Two smart contracts on testnet, mainnet-bound for July. Full handle + surname pending confirmation.
Expertise Label: WAVEWARZ-BASE
Color: cyan
Audited Date: 2026-05-27
```

### Workshop Sessions (seed 3)

```
Name: Magnetiq - The Workshop Library Behind ZABAL Games
Lead: tylerstambaugh
Status: confirmed
Date: TBD (any weekday in June)
Time: TBD (default 8pm EST per ZAO Fractal cadence)
Format: 45-min talk + Q&A
Topic: Tyler Stambaugh, founder of Magnetiq, presents the workshop library platform that hosts every recorded session of ZABAL Games Season 1. SNAPS retention methodology, Zabal connector NFT, why owned audiences beat rented platforms.
Lu.ma URL: TBD
Restream URL: TBD
Magnetiq URL: TBD (set after recording lands)
Order: 1
```

```
Name: Thy Revolution Workshop Session 1
Lead: thyrevolution
Status: confirmed
Date: TBD
Time: TBD
Format: 45-min talk + Q&A
Topic: First of two workshop sessions from Thy Revolution. Topic TBD - 4 starter suggestions in docs/luma-events-templates-2026-05-26.md
Order: 2
```

```
Name: Thy Revolution Workshop Session 2
Lead: thyrevolution
Status: confirmed
Date: TBD
Time: TBD
Format: 45-min talk + Q&A
Topic: Second of two workshop sessions from Thy Revolution. Topic TBD.
Order: 3
```

### Announcements (seed 6 recent)

```
Title: Tier 2 + Tier 3 fabrication audit complete
Date: 2026-05-26
Type: decision
Description: Stripped time-bound WaveWarZ stats (now snapshot-flagged + linked to live numbers). Fixed Adrian handle (~divifly -> diviflyy). Sam team attribution (removed candytoybox conflation, added Arthur on WaveWarZ-Base contracts). Mentor roster framed as open/recruiting per Q2b. 188-member ZAO count replaced with 100+ everywhere. Announce-day kit + Lu.ma templates + Doc 750 OAuth spec shipped.
Commit: c1f3f8d
Links: [Announce kit](/docs/announce-day-kit-2026-05-27.md), [Doc 750](/docs/research/750-builder-registration-oauth-flow.md)
```

```
Title: Workshop lead #002 confirmed - Thy Revolution
Date: 2026-05-26
Type: content
Description: Thy Revolution (Mickey / Rev) confirmed 2 workshop sessions for June. Topics TBD - 4 starter suggestions in the Lu.ma templates doc. Workshop slate now 3 confirmed sessions. 5 of 8 workshop slots still open.
```

```
Title: Prize pool locked + sponsor attribution
Date: 2026-05-26
Type: decision
Description: $500 USDC v0 prize pool funded by The ZAO Festivals team. Top 8 share USDC, Top 16 get $ZABAL tokens. Sponsor inquiries: info@thezao.com. Respect voter threshold locked at 1000+. 66% supermajority needed to change governance system.
```

```
Title: Farcaster Mini App SDK ready() fix - splash now dismisses
Date: 2026-05-26
Type: fix
Description: Created assets/miniapp.js bootstrap module calling sdk.actions.ready() to dismiss the splash in Warpcast. Injected module script tag into all 12 HTML pages. Pre-fix: splash hung indefinitely.
```

```
Title: Zlank signup Snap live + wired into hero
Date: 2026-05-26
Type: feat
Description: ZABAL Games signup Snap published at https://zlank.online/s/OAmekQ. Returns valid Snap v2.0 JSON + 4-option poll + confetti. Added Sign Up Snap button to hero CTA.
```

```
Title: Farcaster manifest signed for zabalgames.com
Date: 2026-05-25
Type: infra
Description: Signed with FID 19640 custody key. accountAssociation header decodes correctly. Mini App now registers in Warpcast. Validator passed after subtitle/description char-limit fixes.
```

### FAQ (seed 6 questions)

```
Q: Why ZABAL?
A: $ZABAL is the ecosystem token. Top 16 Finalists get $ZABAL allocations on top of any USDC reward. ZABAL Games is the event named after the token. Token launched 2026-01-01 via Clanker on Base.
Category: general
Order: 1
```

```
Q: Why 3 months?
A: Different phases serve different audiences. June workshops educate + invite anyone in. July open build month lets anyone ship for the ecosystem - low gate, high signal. August Finals is the curated cohort - 8 builders paired with mentors, 5 days of focused work + a livestream reveal.
Category: format
Order: 1
```

```
Q: How are Finalists picked?
A: ZAO mentors claim their champion from the July submissions. First-come-first-served by mentor. Each mentor picks one builder. 8 mentors + 8 Finalists. Mentors and builders co-build the August Finals.
Category: format
Order: 2
```

```
Q: What if I'm not in The ZAO?
A: You can still participate in June workshops + July build month. Only the August Finals vote requires Respect (>=1000 points, earned via fractal sessions in The ZAO).
Category: general
Order: 2
```

```
Q: What harness do I have to use?
A: Whatever you want - Claude Code, Cursor, Windsurf, Aider, Bolt, v0, Lovable, anything. The Games is harness-agnostic.
Category: build
Order: 1
```

```
Q: How do I follow along?
A: Site at zabalgames.com. Farcaster /zabal channel. Public changelog at zabalgames.com/changelog. AI-readable context at zabalgames.com/llms.txt.
Category: watch
Order: 1
```

## Questions for you (where your retention/portal expertise helps most)

These are where we want Magnetiq lessons applied. None are blockers.

1. **SNAPS framework per session.** Should Workshop Sessions DB have explicit columns for Status / Novelty / Access / Power / Stuff that you track in Magnetiq? Or does that data live in your portal and we just link out?

2. **Connector NFT handoff.** When the Zabal connector NFT mint flow ships with Workshop #001, what fields does Magnetiq need from our Notion → site pipeline? Should the People DB have a `Connector Holder` boolean once that exists? Should sessions track who minted vs who just RSVP'd?

3. **Retention surface inside ZABAL Games.** Beyond the workshop month, what would you want to surface on zabalgames.com from a retention POV? E.g., "8 people who attended 3+ workshops are on the path-to-mentor track" - is that the kind of derived signal we should bake into the data model?

4. **Magnetiq library publish state.** Should each Workshop Sessions row have a `Magnetiq URL` field that's empty until the recording lands? Or do you prefer Magnetiq URLs live in a separate "Library" DB that mirrors but doesn't block?

5. **Workspace organization.** Within the Notion workspace, do you want all 4 DBs in one root page (simple) or grouped (e.g., "Public" page with the 4 DBs + a "Private" page for stuff we don't sync to the site)?

## Phase-by-phase rollout

We don't need everything in Notion before launch (Jun 1). Suggested phasing:

- **Phase 1 (this week post-launch):** Workshop Sessions DB + People DB only. Site auto-pulls these.
- **Phase 2 (~2 weeks after):** Announcements + FAQ DBs.
- **Phase 3 (post-July):** Builder profiles auto-populate when GitHub OAuth ships (per Doc 750).

## Setup (when you're ready)

Once you've shaped the workspace:

1. You: Create a Notion Internal Integration named "zabalgames-sync." Capabilities: Read content.
2. You: Connect the 4 DBs to that integration.
3. You: Send Zaal the integration token + 4 DB IDs.
4. Zaal: drops them in Vercel env vars + ships the sync script.
5. Zaal: wires a Notion automation to fire the Vercel deploy hook on any DB change.

You retain full ownership of the workspace + can revoke the integration any time. Site falls back to last-good JSON in /data if Notion is unreachable.

## Reference docs

- Full Notion CMS spec: `docs/research/760-notion-cms-integration.md`
- ZAO OS Notion + Claude research: `ZAO OS V1/research/dev-workflows/2027-notion-claude-best-practices/`
- Brand kit + voice rules: `docs/brand-kit-2026-05-28.md`
- Site repo: `github.com/ZAODEVZ/zabalgames`
- Live preview: `https://zabalgames.com`

## How we'll handle disagreement

If your model conflicts with the proposed schema:

- **Easy:** rename properties or change Select options. Site sync just updates the mapper. Zero blockers.
- **Medium:** restructure DBs (e.g., split Workshop Sessions into Sessions + Recordings). Notify Zaal, update Doc 760, update the sync mapper. ~1 day rework.
- **Hard:** change the data model entirely (e.g., DBs become pages + child blocks). We discuss before either side codes anything.

Bottom line: your workspace, your call. We propose, you decide, we adapt.

Reply async or grab 15 min - whatever works.

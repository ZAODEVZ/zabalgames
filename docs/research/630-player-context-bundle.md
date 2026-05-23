# ZABAL Games Season 1 - Player Context Bundle

> **This is the comprehensive context primer for the ZAO ecosystem.** July builders get a lighter cut; August Finalists get the full bundle as their sealed prompt. Read it once cover to cover, then load it into your AI coding tool's context (Claude Code uses `CLAUDE.md`, Cursor uses `.cursorrules`, Windsurf uses `.windsurfrules`, Aider supports conventions files, etc.).

> **Status:** Updated 2026-05-21 to the June/July/August Season 1 model (see ZAO research Doc 701). Calendar runs June prep / July open build-a-thon / August Finals - exact dates lock once cohort + mentors are known. The August Finals bundle is sealed at T+0 so all finalists start on equal footing.

> **Tool-agnostic:** This Game is harness-agnostic. Use Claude Code, Cursor, Windsurf, Aider, Cline, Bolt, v0, Lovable, or hand-roll your own pipeline - whatever fits your style. The constraint isn't the tool, it's **show your work in public** via at least one primary visibility mode (live Twitch / recorded screen sessions / public AI prompt logs / frequent build casts).

---

## How to Use This File With Your Vibe-Coding Harness

1. Clone the starter kit ZAO provides at T+0
2. Load THIS file into your AI tool's context. Naming convention by tool:
   - **Claude Code:** save as `CLAUDE.md` at repo root
   - **Cursor:** save as `.cursorrules` at repo root, OR as `CLAUDE.md` plus reference in `.cursor/rules/` directory
   - **Windsurf:** save as `.windsurfrules` at repo root
   - **Aider:** save as `CONVENTIONS.md` and pass with `--read CONVENTIONS.md` flag
   - **Cline / Continue:** add to `.cline/instructions/` or via continue.dev config
   - **Other harnesses:** check your tool's docs for project-level context file
3. Reference it actively - if your tool autoloads project context, great. If not, paste relevant sections when prompting
4. Treat sections as menu items - if you are building an Empire Builder tool, your agent needs the Empire Builder section more than the WaveWarZ section. Tell it what you're building so it focuses

**The single most important thing:** whether you adopt a started ZAO project or build from scratch, tie it to existing ZAO rails. Use the SDKs, APIs, and patterns documented here. Don't reinvent. Composability is the point.

**Two build paths.** You can adopt a started / in-progress ZAO project from the curated list ZAO provides and run with it, or build something new from scratch with just this ecosystem context. Both are equally valid. There are no fixed Option A-E tracks.

---

## Part 1 - The ZAO Big Picture

**ZAO** (always written "The ZAO" when standalone) is a Farcaster-native music and creator community founded around the principle that artists should own their distribution, audience, and economy. It started as a gated 188-member music community and has grown into an umbrella for ~7-8 sub-brands that each serve a different best-fit customer.

Think of ZAO as Spotify, Coachella, Patreon, and Distrokid - except:
- The community owns the rails (token + onchain governance + Farcaster channels)
- The distribution is creator-controlled (no algorithm gatekeeper)
- Every brand under the umbrella reinforces the others (festivals -> music releases -> streaming events -> token economy)

ZAO is built on Farcaster + Base + Next.js. ZAO members get verified addresses, hold ZABAL (the ecosystem token), accumulate Respect (a contribution score), and participate via Mini Apps inside Farcaster.

### The umbrella, at a glance

| Brand | One-liner | Status (2026-05) |
|-------|-----------|------------------|
| **ZAO OS** | The platform - 188 members, Farcaster-native music community + governance + dashboard | Live, Next.js 16 + Supabase + Neynar |
| **ZAO Music (DBA)** | The label - releases tracks via DistroKid + 0xSplits + BMI without the major-label tax. Cipher = #1 release in progress | Live, DCoop/GodCloud/Iman team |
| **ZAO Festivals** | Umbrella for ZAO's IRL festival operations | Active (ZAOstock 2026 is the first) |
| **ZAOstock** | Inaugural festival - October 3, 2026, Franklin Street Parklet, Ellsworth Maine. 10 artists, full day, livestream, after-party | 4 teams, 14 people, 172-day build |
| **WaveWarZ** | Solana-based artist prediction markets - 43 artists with W/L records and battle history | Partner, not built by ZAO |
| **COC Concertz** | Virtual concert community - 13+ promoters running streamed shows | Live, Next.js 16 + Firebase + Cloudinary |
| **FISHBOWLZ** | Audio rooms for music communities | Paused 2026-04-16 (Juke partnership) |
| **BetterCallZaal (BCZ)** | Zaal's personal brand + Maine local SMB consulting | Live, static HTML + Farcaster Mini App |
| **ZAO DEVZ** | Build-in-public dev culture + Hermes (Coder/Critic bot stack) | Hermes live, "ZAO DEVZ" used as cultural label for builders shipping for ZAO |

---

## Part 2 - The ZAO Token Economy ($ZABAL)

### $ZABAL Empire on Empire Builder

ZABAL is the ecosystem token. It lives on Base (ERC-20) and is wrapped in an "Empire" on the Empire Builder platform - a permissionless token-community infrastructure.

| Surface | URL |
|---------|-----|
| Canonical leaderboard | https://songjam.space/zabal |
| Creative hub | https://zabal.art/ |
| Empire Builder | https://empirebuilder.world |
| Token contract (Base) | `0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07` |

**Co-creators:** yerbearserker (Jordan Oram, Empire Builder co-founder) + Adrian (Farcaster handle ~divifly, Empire Builder lead engineer).

### The multiplier stack

ZABAL holdings + activity feed into a multiplier system that compounds points:

```
totalPoints = pointsWithoutMultiplier * stakingMultiplier * empireMultiplier
```

- `stakingMultiplier`: 2.1x-3.0x via `1 + sqrt(stakeAmount / 250000 SANG min)`
- `empireMultiplier`: 4.0x-8.6x via Empire Builder Booster system

A wallet with $10 ZABAL + active Empire participation can hit ~25x effective scoring vs a wallet with zero. Aligns incentives: hold + engage = earn more.

### Related tokens

- **$SANG** - SongJam's token. ZABAL holders often hold SANG. Staking SANG drives stakingMultiplier.
- **Respect** - ZAO's contribution score (not a token, more like reputation). Tracked in `src/components/respect/`.
- **ZOLs** - ZAO contribution credits, also non-tradeable.

### Empire Builder API surface (you'll likely use this)

- `POST /api/leaderboards/apiLeaderboards` - configure a leaderboard that pulls JSON from your URL `[{address, score}]`
- `POST /api/personal-stats/<empire-token-address>` - get rank, balance, boost, activeBoosterIds for one address
- `GET /api/leaderboard/<empire-token-address>` - full leaderboard
- `GET /api/empires` - paginated empire list
- `POST /api/distribute/<empire-token-address>` - bulk send tokens (write, auth-gated)

Docs: https://empire-builder.gitbook.io/empire-builder-docs

Contract reads are FREE via any Base RPC - skip API keys for read paths if all you need is the leaderboard.

---

## Part 3 - The Brands In Depth

### ZAO OS

**What it is:** The main platform. 188 members, gated Farcaster music community. Members include musicians, music industry pros, web3 builders, and music fans.

**Tech stack:** Next.js 16 + Tailwind v4 + Supabase (Postgres + Auth + Storage) + Neynar (Farcaster identity) + RainbowKit + viem + Base.

**Key surfaces:**
- `/feed` - Farcaster cast feed scoped to ZAO members
- `/spaces` - audio + video streaming rooms
- `/respect` - contribution leaderboard
- `/ecosystem` - Empire Builder iframe embed showing $ZABAL leaderboard
- `/governance` - ORDAO-based governance (Hats Protocol roles)
- `/settings` - account + platform connections (Twitch, YouTube, Bluesky, Lens, etc.)

**Identity model:** Every ZAO member has a Farcaster verified address. ZAO uses Neynar for cast feed + identity. Member roles tracked in Hats Protocol on Base.

**Distribution job (per Doc 526):** "Independent musician, 100-10k monthly listeners, no label, releasing monthly, crypto-curious not native, owns/controls masters." Channels they whisper in: Bandcamp comment threads, Spotify-for-Artists subreddits, /music + /rcrdshp + /spinamp on Farcaster.

### ZAO Music (DBA)

**What it is:** The label arm. A Doing Business As entity that releases tracks via DistroKid + 0xSplits + BMI, splitting royalties onchain without the major-label tax.

**First release:** Cipher = #1 - a multi-artist collaborative cypher track. Team includes DCoop, GodCloud, Iman.

**Distribution flow:**
- Track recorded by ZAO members
- Released to DSPs via DistroKid
- Royalties split via 0xSplits contract on Base
- BMI handles performance rights
- Cross-posted to /music + /rcrdshp on Farcaster

**Job to be done:** "Actually release a track that gets distributed via DistroKid + 0xSplits + BMI without the major-label tax. Prove the label-less model works."

### ZAO Festivals

**What it is:** Umbrella brand for ZAO's IRL festival operations. The first festival is ZAOstock 2026.

**Vision:** Make ZAO Festivals the production layer for indie artist festivals worldwide. Curated, paid, no pay-to-play. Local venue partnerships. ZAO-aligned brand experience.

### ZAOstock (the inaugural festival)

| Detail | Value |
|--------|-------|
| Date | October 3, 2026 |
| Location | Franklin Street Parklet, Ellsworth, Maine |
| Artists | 10 (target) |
| Format | Full day + livestream + after-party |
| Budget | $5K-$25K range |
| Teams | 4 (Operations, Finance, Design, Music) |
| Team size | 14 people |
| Anchor partners | Steve Peer rolodex, Roddy Parklet circle, local Ellsworth venues, Art of Ellsworth, Maine indie press |

**Distribution job (per Doc 526):** "Independent Maine + Northeast US artist with a real live set, frustrated by pay-to-play festival circuits + Spotify economics. Wants a booked, paid stage at a curated festival on Oct 3 with venue infra handled."

**Internal tooling:** `/stock/team` dashboard for kanban, weekly DMAIC retros, `@ZAOstockTeamBot` on Telegram.

### WaveWarZ

**What it is:** A Solana-based artist prediction market platform. Artists battle head-to-head. Wallets bet on outcomes. Volume + win rate are tracked per artist.

**Status:** Built by Ikechi Nwachukwu (Hurric4n3Ike). External - WaveWarZ is a partner of ZAO, not a ZAO-built product.

**Data:**
- 43 artists fully documented with wallets, W/L records, volumes
- Live UI at https://wavewarz-intelligence.vercel.app
- Solana wallet addresses for each artist
- Multi-wallet handling needed (Hurric4n3Ike has 3 wallets, Rome has 2)
- Self-battles excluded from feed highlights

**Top WaveWarZ artists:**
- LUI - 49 wins, 29.59 SOL volume
- APORKALYPSE - 73% win rate
- PROF!T - 71% win rate, 13.86 SOL
- Kata7yst - most active this week (as of doc 101)

**Integration patterns (from Doc 101):**
- Sync battle results into `wavewarz_artists` Supabase table
- Surface in ZAO feed
- One-to-many wallet-to-artist mapping
- Helius free tier (1M credits/mo, 10 RPS) for Solana RPC reads

**Cross-chain consideration:** ZAO is Base-native, WaveWarZ is Solana-native. Bridging or dual-chain UX is a recurring theme.

**Contact:** Reach via X @WaveWarZ - no Farcaster presence, no Discord/Telegram.

### COC Concertz

**What it is:** Virtual concert community. 13+ promoters running streamed shows.

**Tech stack:** Next.js 16 + Firebase + Cloudinary.

**Existing content pipeline (per Doc 353):** Record show -> Edit in Descript -> Export segments -> Newsletter builder generates YouTube descriptions (MiniMax AI) -> Manual copy-paste to YouTube + social.

**Surfaces:**
- `/portal/newsletter` - newsletter builder
- `/stage` - concert stream interface
- `/team` - promoter dashboard

**Cross-references:**
- Doc 351 - YouTube SEO concert transcripts
- Doc 353 - YouTube content pipeline automation
- Doc 354 - Cross-posting infra audit (10 platform modules)

### FISHBOWLZ (Paused 2026-04-16)

**What it was:** Audio rooms for music communities. Privy + Supabase stack.

**Status:** Paused. Per Doc 601 / Doc 526, the audio-room job is now Juke's. FISHBOWLZ failed at the job layer not the tech layer.

**Why this matters for ZABAL Games:** Don't build something that competes with Juke. If you want to build audio infra, find a different job-to-be-done than "audio rooms for music."

### BetterCallZaal (BCZ)

**What it is:** Two things:
1. Zaal's personal brand (the host of ZABAL Games) - portfolio + Farcaster Mini App at https://bettercallzaal.com
2. BCZ Strategies (LLC) - Maine local SMB consulting agency

**Personal-brand stack:** Pure static HTML, no build step. Direct edit + git push to main = deploy.

**Existing static pages:**
- `index.html` - main BCZ site
- `poidh.html` - POIDH submitter leaderboard
- `nexus.html` - ZABAL Nexus integration
- `zabalgames.html` - THIS event's landing page (https://bettercallzaal.com/zabalgames.html)

**Farcaster Mini App:** BCZ ships as a Farcaster mini app, signed for Zaal's FID 19640. SDK loaded via CDN.

**BCZ Strategies job (per Doc 526):** "Maine local business with low Google rank, knows they need digital marketing but has been burned by an agency before, owner-operator with under 10 employees." Channels: local Ellsworth/Bar Harbor walk-ins + cold pitch, Maine small-biz Slack/FB groups - NOT Farcaster.

### ZAO DEVZ + Hermes

**What it is:** A cultural label for builders shipping for the ZAO ecosystem. NOT a discrete product. Pairs with **Hermes** - the surviving Coder/Critic dual-bot stack from earlier ZAO Devz experiments.

**Hermes:** Runs Claude Code CLI as a subprocess (Max plan auth, no API billing). Triggered by `/SHIP FIX` or PR webhook. Dual-bot loop: Coder writes the fix, Critic scores it (target: > 80/100 before merge). Lives in `bot/src/hermes/` on the VPS.

**ZOE:** The concierge AI (Telegram `@zaoclaw_bot`). After Doc 601 decision: ZOE backend is being rewritten to mirror Hermes's runtime pattern. Same Claude Code CLI brain, different system prompt for concierge personality. Connects to Bonfire (the memory graph) via DM relay.

**Where YOU might plug in:**
- New ZOE skill
- Extension to Hermes (e.g. integrate it with a different code-host)
- Build-in-public infra (e.g. a builder dashboard for `/zao-devz` Farcaster channel)

---

## Part 4 - Tech Stack Baseline

### Default starter stack (provided in your STARTER_KIT)

```
Frontend:
  Next.js 16 (App Router, Turbopack)
  Tailwind v4
  Farcaster mini-app SDK (@farcaster/miniapp-sdk via esm.sh CDN)
  wagmi + viem (EVM client)
  Coinbase Smart Wallet (default connector)

Backend:
  Next.js API routes (serverless on Vercel)
  Supabase (sandbox project provided, namespaced per player)
  Neynar (Farcaster reads + signer if needed)

Onchain:
  Base (chainId 8453) - primary ZAO chain
  Solana - only for WaveWarZ reads (Helius free tier)
  Privy (agent wallets, pre-funded by ZAO with $5 ETH each)

Streaming / Live:
  Twitch (you bring your account; we onboard you)
  StreamElements (free, browser-based overlays)
  Cloudflare Workers free tier (if you need a backend service)

Distribution:
  Existing `src/lib/publish/` modules in ZAO OS for cross-posting
  Coinflow merchant link (provided per player, for tip-during-build)
```

### Key APIs + SDKs

| Service | What for | Auth | Cost |
|---------|----------|------|------|
| Empire Builder | Token leaderboards, booster mechanics | X-API-Key (provided for reads) | Free reads |
| Neynar | Farcaster reads, signers, search | API key (provided) | Free dev tier |
| Hats Protocol | Onchain roles + tree on Base | Hats SDK | Gas only (~$5 setup) |
| Bonfire | Reputation graph, social signals | SDK / DM relay | Free |
| EAS | Onchain attestations on Base | EAS SDK | Free offchain, gas for onchain |
| Hypersub (Fabric STP) | Subscription NFTs | Hypersub UI / contracts | ~5% protocol fee |
| 0xSplits | Onchain revenue splits | Splits SDK | Gas only |
| Coinflow | Fiat to USDC checkout | Merchant key | Coinflow rev share |
| Zora | Content coins / creator coins | Zora SDK | 50% trade + LP fee to creator |
| 0x Swap API v2 | DEX aggregator | API key | Free 100K calls/mo |
| Privy | Embedded + agent wallets | App ID + secret | Free 0-499 MAU |

### Already-built modules you can reuse (in ZAO OS repo)

Path: `src/lib/publish/` - 10 platform-specific publishers (Farcaster, X, Bluesky, Threads, Telegram, Discord, etc.)

Path: `src/lib/music/` - audio player + library management

Path: `src/components/respect/` - leaderboard UI patterns

Path: `src/components/spaces/` - streaming room UI

Path: `src/app/api/auth/twitch/` - Twitch OAuth flow

Path: `src/app/api/platforms/` - per-platform connection management

You don't have direct write access to ZAO OS - but you can READ the patterns and replicate the SDKs in your own repo.

---

## Part 5 - Identity + Reputation Rails

This is the system every ZAO surface uses for "who is this person and what are they allowed to do."

### Farcaster verified address (the primary identity)

Every ZAO member has a Farcaster account with at least one verified Ethereum address (Base preferred). Verification requires:
- Linked X, phone number, or GitHub
- $25 in wallet
- Signed verification proof

This is sybil-resistant by virtue of cost + linkage. Use it as the default "who" identifier in any build.

**SDK pattern:**
```ts
import { NeynarAPIClient } from '@neynar/nodejs-sdk';
const client = new NeynarAPIClient(process.env.NEYNAR_API_KEY);
const user = await client.lookupUserByVerifiedAddress({ address });
```

### Hats Protocol (roles)

Hats are ERC-1155 role NFTs on Base. ZAO uses Hats for:
- ZAO member role
- ZAO Music label member
- COC Concertz promoter
- ZAOstock team member (4 team-specific roles)
- ZABAL Games S1 Champion (1st place - if collectible spec lands on Hats)
- ZABAL Games S1 Finisher (every finisher)

**Hats contract on Base:** `0x3bc1A0Ad72417f2d411118085256fC53CBdDd137`

Tree creation = ~$5 gas + 10 minutes. Each role mint = 1 tx per address.

### Bonfire (reputation graph)

Bonfire is a social reputation graph that ingests cross-platform signals (Farcaster activity, GitHub contributions, ZAO Respect, Twitch streams, etc.) and produces a per-address score.

ZAO uses Bonfire for:
- Member tier signals
- Co-sign attestations
- Auto-role assignment (e.g., Hat NFT minted when Bonfire signal hits threshold)

**Integration:** Bonfire SDK or DM relay (per Doc 544).

### EAS (Ethereum Attestation Service)

Onchain attestations on Base. ZAO uses EAS for:
- Stream attendance (per Doc 628)
- Co-sign attestations
- Event participation proofs (e.g., this Games)

**Offchain attestations are FREE** - just a signature. Onchain attestations cost gas but support batch via Merkle roots (cheap).

### Hypersub (recurring memberships)

Hypersub by Fabric is a Subscription Token Protocol on Base. ERC-721 NFTs representing time-bound access (1mo, 3mo, 1yr).

ZAO uses Hypersub for:
- Creator-supporter tiers (planned for BCZ + COC per Doc 628)
- Recurring fan support replacement for Twitch native subs

---

## Part 6 - Brand Guidelines (Critical - Follow These)

### Naming glossary - ALWAYS use these exact spellings

| Correct | Wrong | Notes |
|---------|-------|-------|
| WaveWarZ | Wave Wars, Wavewarz, WaveWars | Always WaveWarZ |
| COC Concertz | COC Concerts, CocConcertz | Space + z not s |
| The ZAO | the Zao, ZAO, Zao | "The ZAO" when standalone |
| BetterCallZaal | Bettercallzaal, Better Call Zaal | One word, camelCase |
| Joseph Goats | Jose Goats, Jose | Rebranded from Jose |
| Huottoja | Waha | Community's own spelling |
| SongJam | Songjam, Song Jam | CamelCase |
| ZABAL | Zabal, zabal | All caps |
| SANG | Sang, sang | All caps - SongJam's token |
| ZOE | Zoe, zoe | All caps - ZAO ecosystem |
| ZOLs | Zols, ZOL | ZAO contribution credits |
| FISHBOWLZ | Fishbowlz, FishBowlz | All caps |
| Stilo World | StiloWorld, stilo world | Two words, capitalized |
| Tom Fellenz | Fellenz | Full name or just Fellenz |
| Thy Revolution | The Revolution, Th Revolution | "Thy" not "The" |
| ArDrive | Ardrive, ar drive | CamelCase |
| ZAOstock | Zaostock, ZAO Stock | One word, lowercase "stock" |
| ZAO Music | ZAO music, ZaoMusic | "ZAO Music" with space |
| ZAO Festivals | ZAO festivals, ZAOfestivals | "ZAO Festivals" with space |
| ZAO DEVZ | ZAO Devs, ZAOdevz | All caps DEVZ |

### Writing rules

- **NEVER use emojis** anywhere - not in code, not in commits, not in casts, not in UI copy
- **NEVER use em dashes** - use hyphens instead
- **NEVER use decorative Unicode** - no checkmarks, warning triangles, play buttons as text symbols. Use plain text labels like `[MUSIC]`, `OVERDUE`, `DONE`, `IN PROGRESS`
- Plain hyphens or numbered lists for bullets
- This applies across every project and every session

### Brand colors (ZAO + BCZ default palette)

```css
:root {
  --bg: #070709;          /* deep almost-black */
  --surface: #111115;     /* card bg */
  --surface-2: #16161c;   /* alt card bg */
  --orange: #ff6b35;      /* primary accent */
  --cyan: #00e5ff;        /* secondary accent */
  --gold: #f5c842;        /* highlight */
  --pink: #ff3d6e;        /* alt highlight */
  --zabal: #a78bfa;       /* ZABAL purple */
  --poidh-blue: #2a81d5;  /* POIDH brand color */
  --text: #e4e2dd;
  --text-muted: #8a8895;
  --text-dim: #4e4c57;
  --border: #1f1e26;
  --gradient-main: linear-gradient(135deg, #ff6b35, #ff3d6e, #00e5ff);
  --gradient-zabal: linear-gradient(135deg, #a78bfa, #00e5ff);
}
```

Use these. Don't invent new colors. Builds that look like they fit in the ZAO universe score higher on "ZAO-native" with voters.

### Fonts

- **Headings:** Syne (700-800)
- **Body:** Outfit (300-600)
- **Monospace / numbers:** JetBrains Mono (400-500)

Google Fonts CDN:
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

### Layout + UX rules

- **Mobile-first** - test at 424px wide (Farcaster mini app viewport)
- Dark background by default
- Sections use `.fade-in` class for scroll-triggered IntersectionObserver animation
- Section transitions: subtle gradient backgrounds, not hard borders
- All buttons rounded `8px` radius
- Subtle noise texture on body via SVG fractal noise filter (see BCZ existing pages)
- No popups, no aggressive modals, no autoplay

### Tone of voice

- Direct, not corporate
- Confident but humble
- Technical when needed, plain when possible
- No marketing fluff ("revolutionary", "game-changing", "transform your X" - avoid)
- Write like Zaal would - if you're stuck on tone, read the BCZ index.html homepage or his recent Farcaster casts

---

## Part 7 - Useful Research Docs (Curated)

You have read-only access to the full ZAO research library (~700 docs as of 2026-05-21). Don't try to read all of them - here's the curated subset relevant to ZABAL Games builds.

### Foundation reading (read first)

| Doc | Topic | Why |
|-----|-------|-----|
| 630 (this folder) | ZABAL Games Season 1 spec | The event rules itself |
| 627 | Twitch + StreamElements integration | Your streaming infra |
| 628 | Web3 streaming + ZABAL Empire bridge | Score feeds, tip flow, Hypersub, EAS |
| 629 | Streaming as main media source | The auto-clip flywheel |
| 626 | Empire Builder + ZABAL POIDH airdrop | apiLeaderboards pattern (any leaderboard build uses this) |
| 361 | Empire Builder v3 deep dive | Multiplier mechanics, distribute API |

### If you're building Empire Builder / token tooling

| Doc | Topic |
|-----|-------|
| 626 | apiLeaderboards pattern |
| 324 | ZABAL/SANG wallet agent tokenomics |
| 361 | Empire Builder v3 features |
| 258 | ZABAL/SANG buyback |
| 573 | ZABAL AVAX surfaces - Arena Music |

### If you're building streaming / live tooling

| Doc | Topic |
|-----|-------|
| 627 | StreamElements WebSocket events |
| 628 | Full pipeline (Part 1 has the diagram you'll implement) |
| 626 | apiLeaderboards JSON contract |

### If you're building a Farcaster mini app

| Doc | Topic |
|-----|-------|
| 468 | ZAO Farcaster Hub - POIDH + Hypersub bot + dual-hub |
| 627 | Streaming surface (for stream-tracker variant) |
| 545 | ZABAL knowledge graph ontology |

### If you're building agent / ZOE tooling

| Doc | Topic |
|-----|-------|
| 601 | Agent stack cleanup decision - Hermes-as-ZOE-brain |
| 600 | Agentic stack coordination v1 |
| 524 | ZAO agentic everything - live/archived/started/planned |
| 322 | Paragraph publish.new newsletter agent commerce |

### If you're building identity / reputation tooling

| Doc | Topic |
|-----|-------|
| 544 | Bonfires SDK ZAO wiring |
| 542 | Bonfires AI knowledge graph BCZ strategies |
| 546 | Bonfires real-world deployments |
| 569 | YapZ Bonfire ingestion strategy |
| 525 | Guild.xyz vs other token-gating platforms |

### Distribution + content pipeline

| Doc | Topic |
|-----|-------|
| 354 | Cross-posting infrastructure audit (10 platform modules) |
| 355 | Autonomous social distribution 2026 |
| 351 | YouTube SEO concert transcripts |
| 353 | YouTube content pipeline automation |
| 311 | Vibe-coded apps marketing playbook |
| 526 | Distribution V3 per-entity playbooks (read for ZAO ICP framing) |

### Identity + economy

| Doc | Topic |
|-----|-------|
| 474 | FounderCheck BLOCK ICP resolution |
| 485 | Distribution V3 principles (jlcolton extraction) |
| 470 | Distribution audit |
| 283 | Privy embedded wallets FISHBOWLZ tokenomics |
| 125 | Coinflow fiat checkout |
| 222 | Payment infrastructure Stripe Coinbase |

### Research doc paths

All docs live at `/Users/zaalpanthaki/Documents/ZAO OS V1/research/`. Folders:

```
agents/         - AI agents, OpenClaw, ZOE, frameworks
business/       - Revenue, payments, strategy, marketplace
community/      - ZAO guide, onboarding, members
cross-platform/ - Bluesky, Lens, X, Twitch, YouTube
dev-workflows/  - Skills, Claude Code, testing, MCP
events/         - Bootcamp notes, ship logs, retros
farcaster/      - Protocol, Mini Apps, XMTP
governance/     - Respect, ORDAO, Hats
identity/       - ZIDs, ENS, reputation, knowledge graph
infrastructure/ - Next.js, Supabase, streaming, mobile
music/          - Player, NFTs, distribution
security/       - Audits, testing
wavewarz/       - Prediction markets, artist pipeline
```

You won't have direct filesystem access to these during the Games (the repo is private). What you WILL have is:
- This CONTEXT.md (full)
- The starter kit with relevant code patterns inline
- A read-only API endpoint that lets you query the research lib by keyword (provided in INFRA.md)

---

## Part 8 - What "Good" Looks Like (Voting Rubric Reminder)

ZAO DAO members who have earned their vote over the past 3 years vote at T+48h through T+72h on a single question: **"Which build is the best?"** This is a curated voter set (roughly 30-80 long-tenure DAO members), NOT open ZABAL holder voting. 1-person-1-vote, vote-for-1 mechanism.

Voters will see, per submission:
- Live deployed URL
- GitHub repo (open source, MIT)
- 60-second demo video
- Auto-generated summary card (project name, prompt option chosen, ZAO rails used)
- Optional engagement metrics (stream viewers, tip volume, GitHub stars)

Implicit criteria voters bring (based on community sentiment):

1. **Does it work?** Deployed, demoable, no crashes. Voters will click your link before voting.
2. **Is it ZAO-native?** Does it actually plug into ecosystem rails (ZABAL, Empire, Farcaster, Hats, Bonfire, EAS, Coinflow, Hypersub)? More rails wired = more votes. Surface-level "we used the brand" doesn't count.
3. **Would I use this?** ZABAL holders are users. They vote for things they would actually open again next week.
4. **Did you ship something thoughtful in 24 hours?** Voters respect velocity. Polish matters but is secondary to "I built this in a day and it works."

Voters will NOT see (and don't care about):
- How elegant your code is
- How well you used Claude Code (Anthropic isn't judging)
- How many features you crammed in
- How much you streamed (other than spot-checks for anti-cheat)

---

## Part 9 - The Submission Bar (Hit ALL Four)

By the T+24h ship deadline, you must have all four:

1. **Live deployed URL** (working, not 404). Vercel free tier is fine.
2. **Public GitHub repo link** (MIT or similar permissive license). Verifiable empty git log at T+0 (no pre-built code).
3. **60-second demo video link** (Loom, YouTube, or self-hosted). Show the thing working.
4. **Tweet/cast on /zabal channel** announcing your ship. Tag `@bettercallzaal` so we see it.

PLUS during the 24h build, your declared **show-your-work visibility mode** must be active:
- Mode 1 (Live Twitch stream): stream archive available afterward
- Mode 2 (Recorded screen sessions): YouTube/Loom uploads landed within 1h of each session ending
- Mode 3 (Public AI prompt logs): logs published every 1-2 hours throughout build
- Mode 4 (Frequent build casts): casts every 1-2 hours throughout build

Miss the submission bar OR fail the visibility mode = no submission = no USDC, no collectible, no Hall of Fame.

---

## Part 10 - Code of Conduct (Agreed at Application)

- No pre-built code. Empty git log at T+0 verified by spot-check.
- Open source mandatory (MIT or similar permissive).
- **Maintain your declared visibility mode throughout the build** (live stream archive OR session uploads within 1h OR prompt logs every 1-2h OR build casts every 1-2h). Spot-checks compare visibility timestamps vs git commit times.
- **Use vibe-coding tools.** This is an AI-assisted build challenge. Pure manual coding is fine but you should be using AI tools as your primary leverage - that's the point.
- Respect fellow players. No sabotage, no harassment.
- Accept the ZABAL holder vote as final. No appeals.
- Hate content, harassment, plagiarism = disqualification.
- You own your code. ZAO doesn't claim IP.
- Don't impersonate or copy another player's UX too closely. Be original.

---

## Part 11 - Suggested Build Sequence for Your 24 Hours

This is a recommended pacing, not a requirement. Adjust to your style.

```
Hour 0-1 (12:00-13:00 PT)
  Read this CONTEXT.md (you should have done this already)
  Pick your build path - adopt a ZAO project or build from scratch
  Start your Twitch stream
  Read JUDGING.md (voting mechanism)
  Cast on /zabal "I'm in - building [option] - watch at twitch.tv/[me]"

Hour 1-2 (13:00-14:00 PT)
  Sketch what you're building - just a single doc/whiteboard
  Tell Claude Code what you're building and reference this CONTEXT.md
  Identify which ZAO rails you're using (be specific)
  Bootstrap from STARTER_KIT

Hour 2-12 (14:00-00:00 PT - 10 hours)
  Build the core. Get it working end-to-end before adding polish.
  Aim for "minimum lovable product" by hour 12

Hour 12-16 (00:00-04:00 PT - rest)
  Sleep at least 4 hours. Trust me. Diminishing returns past hour 16.

Hour 16-22 (04:00-10:00 PT - 6 hours)
  Polish + edge cases + bug fixes
  Branding: apply ZAO colors + Syne/Outfit fonts
  Wire onchain rails (Empire Builder, Hats, EAS - whatever your option needs)
  Test on mobile (424px Farcaster viewport)

Hour 22-23 (10:00-11:00 PT)
  Record 60-second demo video
  Deploy to Vercel
  Write README with screenshot + tagline

Hour 23-24 (11:00-12:00 PT)
  Cast/tweet your ship
  Push final commit
  CELEBRATE - you shipped
```

---

## Part 12 - Common Pitfalls to Avoid

| Pitfall | Why it kills you |
|---------|-----------------|
| Trying to build "the whole thing" | 24h is short. Ship one feature deep, not five features shallow |
| Skipping the brand palette | "ZAO-native" voters can spot a generic-looking build instantly. Use the colors + fonts |
| Ignoring mobile | Most voters will check your build on phone. 424px viewport = test at minimum |
| Coding without AI assistance | Defeats the point. This is a vibe-coding challenge. Use your tool actively, narrate to your audience what you're prompting |
| Skipping your declared visibility mode | If you said "live stream" and you go dark for 12h, your visibility mode fails and submission gets rejected |
| Pre-built code (even tiny bits) | Empty git log at T+0 is verified. Don't risk DQ |
| Building something Solana-only | ZAO is Base-native. Solana is fine for WaveWarZ reads but core should be Base or Farcaster |
| Reinventing identity | Use Farcaster verified address. Don't roll your own auth |
| Not casting your ship | If voters don't see it, they don't vote for it. Cast loudly |
| Sleeping zero hours | Builds get worse after hour 16. Sleep 4-6, code better afterwards |
| Forgetting open-source license | MIT in your repo or risk DQ |
| Mismatched tool + visibility mode | If you picked Cursor + "public prompt logs" but Cursor's composer history isn't easily exportable for you, switch modes early - don't get caught at T+48h without verifiable visibility |

---

## Part 13 - Where to Get Help During the Games

| Need | Where |
|------|-------|
| Stuck on Claude Code | Stream chat (your viewers may know) + Anthropic docs |
| ZAO infra question | /zabal Farcaster channel - tag @bettercallzaal |
| Stream tech issue | StreamElements support docs + /zabal channel |
| Wallet / gas / Empire Builder issue | DM @bettercallzaal directly |
| Real emergency (laptop dies, internet dies) | Text Zaal at the number in your onboarding email |

---

## Part 14 - Final Thoughts

This is Season 1. The Games will get better with each iteration. Your role in Season 1 is to ship something real, get distribution from ZAO accounts, build your audience, and become part of the founding cohort.

Whatever you build belongs to you. ZAO doesn't take IP. If it succeeds, you own that success. If it dies, you keep the learning, the footage, the audience, the collectible.

Win-win-win means: even if you place last, you walk away with:
- Permanent onchain proof you shipped at the inaugural Games
- 24h of Claude Code live-coding footage as a content asset
- ~20 short-form clips of your build auto-generated by the ZAO streaming flywheel
- New audience from cross-stream pollination + ZAO amplification
- An open-source GitHub repo as a portfolio piece
- A new relationship with the ZAO ecosystem (alumnus status)

Now go build something the community would actually use.

---

## Appendix A - Quick Reference Card

```
CALENDAR (exact dates lock once cohort + mentors are known)
  June     -  Prep month. Recorded sessions, tool walkthroughs, context.
  July     -  Open build-a-thon. Ship a build = your application.
  August   -  The Finals. 72-hour main event for the curated cohort.

AUGUST FINALS - 72-HOUR TIMELINE (relative to T+0)
  T+0    -  Prompt drops + voter snapshot
  T+24h  -  Ship deadline
  T+48h  -  Voting opens
  T+72h  -  Reveal stream + USDC + collectibles

Prize pool:  $500 USDC tiered with floor - every finalist who ships gets paid
            1st $150 / 2nd $100 / 3rd $75 / 4th-8th $35 each
            + Participation collectible (every finisher)
            (No tooling subsidy - bring your own vibe-coding tool.)

Voting:      ZAO members who have earned Respect through fractals
            1-person-1-vote, NOT token-weighted
            Curated voter set, snapshot at T+0

Stream:      Twitch primary, ZAO restreams every finalist to /zabal

Submit by the T+24h ship deadline:
  1. Live deployed URL
  2. Public GitHub repo (MIT)
  3. 60-second demo video
  4. Cast announcing ship on /zabal
```

---

## Appendix B - Key Links

- ZABAL Games landing page: https://bettercallzaal.com/zabalgames.html
- /zabal Farcaster channel: https://farcaster.xyz/~/channel/zabal
- $ZABAL Empire leaderboard: https://songjam.space/zabal
- $ZABAL creative hub: https://zabal.art/
- Empire Builder: https://empirebuilder.world
- Empire Builder docs: https://empire-builder.gitbook.io/empire-builder-docs
- WaveWarZ Intelligence: https://wavewarz-intelligence.vercel.app
- BetterCallZaal: https://bettercallzaal.com
- POIDH leaderboard reference (BCZ): https://bettercallzaal.com/poidh.html

External rails:
- Farcaster: https://farcaster.xyz
- Farcaster Mini Apps docs: https://miniapps.farcaster.xyz
- Hats Protocol: https://hatsprotocol.xyz
- Bonfire: (SDK provided in INFRA.md)
- EAS Base: https://base.easscan.org
- Hypersub: https://hypersub.xyz
- Coinflow: https://coinflow.cash
- 0xSplits: https://0xsplits.mirror.xyz
- Zora: https://zora.co
- Snapshot.org: https://snapshot.org

Tech docs:
- Next.js 16: https://nextjs.org/docs
- Tailwind v4: https://tailwindcss.com/docs
- viem: https://viem.sh
- wagmi: https://wagmi.sh
- Neynar: https://docs.neynar.com
- Empire Builder API: https://empire-builder.gitbook.io/empire-builder-docs
- StreamElements docs: https://docs.streamelements.com
- Claude Code: https://docs.claude.com/claude-code

---

*This CONTEXT.md is the Season 1 player primer for ZABAL Games. If you see something missing or wrong, flag it in /zabal channel before T+0 and we'll fix it. After T+0, this version is sealed for the duration of the August Finals to keep all finalists on equal context footing.*

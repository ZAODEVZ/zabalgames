# ZABAL Games - Brand Context Guide

> The brand identity spine for every ZAO ecosystem brand. This feeds the ZABAL Games prompt bundle - players read this to understand what they're building for. Updated 2026-05-21 - most voice/visual gaps resolved (see ZAO research Doc 701 Part 7). Remaining **[TBD - Zaal]** markers still need input.

Framework per brand: One-liner / Mission / Audience / Voice / Visual / Build surface / Status.

---

## 0. The ZAO (umbrella)

- **One-liner:** Music infrastructure for independent artists using decentralized tools.
- **Mission:** Bring the profit margin, the data, and the IP rights back to independent artists.
- **Audience:** Independent musician - 100-10k monthly listeners, no label, releasing monthly, crypto-curious not crypto-native, owns their masters.
- **Voice:** Direct, warm, builder-energy. "We learn it together" not "trust us." Magic words: Respect, Fractal, owns-their-audience, learn-by-shipping, picks-and-shovels, getting-the-right-ears.
- **Visual:** Dark bg `#070709`. Orange `#ff6b35` + cyan `#00e5ff` + gold `#f5c842` accents, ZABAL purple `#a78bfa`. Syne (headings 700-800) + Outfit (body 300-600) + JetBrains Mono (numbers). Subtle SVG noise texture.
- **Build surface:** Anything that helps indie artists own distribution, audience, or economy. Farcaster-native, Base-native.
- **Status:** Live - 100+ member gated community. Shipped ZAO OS, launched ZABAL, Crypto Magazine feature, all in Q1 2026.

---

## 1. ZAO OS

- **One-liner:** The gated Farcaster client - the platform layer of the ZAO.
- **Mission:** Give ZAO members a music-community home they own and control - feed, spaces, governance - instead of renting it from a mainstream platform.
- **Audience:** The 100+ ZAO members - musicians, music-industry pros, web3 builders, music fans. Gated, not public.
- **Voice:** 1:1 with the ZAO umbrella - builder-energy, transparent, ship-in-public, operationally precise. No distinct ZAO OS tone.
- **Visual:** 1:1 with the ZAO umbrella. Dark, orange/cyan/gold. No distinct ZAO OS treatment.
- **Build surface:** Next.js 16 + Tailwind v4 + Supabase + Neynar + RainbowKit + viem on Base. Surfaces: `/feed` (Farcaster cast feed), `/spaces` (audio + video streaming), `/respect` (contribution leaderboard), `/ecosystem` (Empire Builder embed), `/governance` (ORDAO + Hats), `/settings` (platform connections). Existing reusable modules: `src/lib/publish/` (10 cross-post platforms), `src/lib/music/`, `src/components/respect/`, `src/components/spaces/`. Players can read patterns, replicate SDKs.
- **Status:** Live - shipped March 2026. 88 research docs, encrypted DMs, music players.

---

## 2. $ZABAL + Empire Builder

- **One-liner:** The ecosystem token plus the leaderboard + booster infrastructure wrapped around it.
- **Mission:** Give the ZAO a token economy that rewards contribution and holding, with composable cross-empire network effects - not a speculative coin, a participation rail.
- **Audience:** ZAO members + ZABAL holders + the broader Empire Builder ecosystem of token communities.
- **Voice:** Token-economy native, Farcaster-native, transparent about mechanics. Not hype-y - mechanism-forward. (Confirmed 2026-05-21.)
- **Visual:** ZABAL purple `#a78bfa`, the zabal gradient (`#a78bfa` to `#00e5ff`). ZABAL has its own wordmark/logo and a distinct zabal.art creative-hub aesthetic. **[TBD - Zaal: pull the exact wordmark + zabal.art palette spec.]**
- **Build surface:** Token contract `0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07` on Base. ZABAL Empire address `0xe0faa499d6711870211505bd9ae2105206af1462`. Empire Builder v3 public read API (leaderboards, boosters, personal-stats - no auth). `apiLeaderboards` pattern - publish a JSON feed, Empire Builder pulls + distributes. Launched via Clanker. 7 active leaderboard slots. Multiplier stack: staking 2.1-3.0x, empire 4.0-8.6x.
- **Status:** Live - token launched 2026-01-01 via Clanker. Empire on Empire Builder v3 (live 2026-05-01). Co-creators: yerbearserker (Jordan Oram) + Adrian.

---

## 3. WaveWarZ

- **One-liner:** Solana-based artist prediction markets - artists battle head-to-head, wallets bet on outcomes.
- **Mission:** Treat independent artists like sports teams - turn music discovery into a market with real skin in the game.
- **Audience:** Music fans who want stake in artist discovery + the 40+ battling artists themselves.
- **Voice:** Competitive, sports-energy, hype. Stats-forward (W/L records, volume). The opposite of the warm ZAO-umbrella tone - this brand is the arena, deliberately the loudest brand in the ecosystem. (Confirmed 2026-05-21.)
- **Visual:** Partner-built (Ikechi), Solana-native. **[TBD - Zaal: pull palette/vibe from the live UI at wavewarz-intelligence.vercel.app.]**
- **Build surface:** 43 artists fully documented with wallets, W/L records, SOL volume. Live UI at `wavewarz-intelligence.vercel.app`. Helius free tier for Solana RPC reads. `wavewarz_artists` Supabase table pattern (one-to-many wallet-to-artist). Cross-chain consideration: ZAO is Base-native, WaveWarZ is Solana-native - bridging UX is a recurring theme. Builders can ship: AI betting advisors, signal aggregators, fan-sentiment scrapers, meta-leaderboards.
- **Status:** Live - PARTNER, not ZAO-built. Built by Ikechi Nwachukwu (Hurric4n3Ike). Snapshot ~2026-05-23: hundreds of battles + 400+ SOL traded + several SOL paid to artists - current numbers at wavewarz-intelligence.vercel.app. Contact via X @WaveWarZ.

---

## 4. ZAO Festivals + ZAOstock

- **One-liner:** The ZAO's IRL festival arm - curated, paid, no pay-to-play.
- **Mission:** Be the production layer for independent artist festivals - respect artists as artists, not content units. ZAOstock is the first.
- **Audience:** Independent Maine + Northeast US artists with a real live set, frustrated by pay-to-play festival circuits and Spotify economics. Wants a booked, paid stage with venue infra handled.
- **Voice:** Warm, local, operationally competent. "Partiful warmth + Luma competence." First-person, community-rooted. (Confirmed 2026-05-21.)
- **Visual:** Carries a Maine/local visual influence - Ellsworth, Art of Ellsworth, Northeast indie. Not a separate full brand: the ZAO palette with a local-place layer.
- **Build surface:** ZAOstock 2026 - October 3, Franklin Street Parklet, Ellsworth Maine. 10 artists, full day + livestream + after-party. `/stock/team` dashboard for kanban. Lean Six Sigma DMAIC weekly cycles. 14-person team across 4 teams (Ops, Finance, Design, Music). `@ZAOstockTeamBot` on Telegram. Builders can ship: festival ops tools, the `/lean` skill, artist booking pipelines, livestream infra.
- **Status:** ZAOstock active - 172-day build to Oct 3 2026. ZAO Festivals is the umbrella for future festivals.

---

## 5. ZAO Music

- **One-liner:** The ZAO's label arm - releases tracks onchain without the major-label tax.
- **Mission:** Prove the label-less model works - distribute via DistroKid, split royalties onchain via 0xSplits, handle performance rights via BMI, keep the margin with the artists.
- **Audience:** ZAO members who have shipped music before and are ready to release - will collaborate with the ZAO Music team.
- **Voice:** The artist-collective voice - members making music together. Not a label voice.
- **Visual:** Rides the ZAO umbrella visual. No separate identity.
- **Build surface:** First release: Cipher = #1 (multi-artist collaborative cypher). Team: DCoop, GodCloud, Iman. Flow: recorded by members -> DistroKid to DSPs -> 0xSplits royalty contract on Base -> BMI performance rights -> cross-post to /music + /rcrdshp on Farcaster. Builders can ship: release pipelines, royalty-split dashboards, distribution trackers, the cypher coordination tooling.
- **Status:** Live - first release (Cipher = #1) in progress. DBA entity.

---

## 6. COC Concertz

- **One-liner:** Virtual concert community - promoters running streamed shows.
- **Mission:** Give virtual concerts a real home - for the metaverse + streamed shows and the promoters who run them.
- **Audience:** 13+ concert promoters + the audiences who attend virtual + metaverse concerts.
- **Voice:** Warm, communal, builder-energy - the same family as the ZAO umbrella. COC reads as part of the ecosystem, not a separate vibe. (Confirmed 2026-05-22.)
- **Visual:** Its own distinct brand - colors, logo, vibe separate from the ZAO umbrella. **[TBD - Zaal describing the spec.]**
- **Build surface:** Next.js 16 + Firebase + Cloudinary. Surfaces: `/portal/newsletter` (newsletter builder), `/stage` (concert stream interface), `/team` (promoter dashboard). Existing content pipeline: record show -> Descript edit -> newsletter builder generates YouTube descriptions (MiniMax AI) -> manual cross-post. 5 COC Concertz shows produced (going on #6 Sat Jun 13 at Stilo World Spatial). Builders can ship: concert streaming tools, the content pipeline automation, promoter dashboards, ticketing/RSVP, metaverse concert UX.
- **Status:** Live - COC Concertz #3 ran March 2026 (metaverse concert with DUO DO, JOSEPH GOATS, STILO WORLD).

---

## 7. Respect + Fractals

- **One-liner:** The ZAO's soulbound, peer-validated reputation - and the weekly ritual that earns it.
- **Mission:** Governance as practice, not theory. Reputation you earn by showing up and contributing, not by buying tokens. The thing that gives you a real voice in the ZAO.
- **Audience:** All ZAO members. Earning Respect is how you go from member to governance participant.
- **Voice:** Ritual, earned, communal. "Fractal governance as practice." Not gamified-points-energy - reputation-with-weight energy. (Confirmed 2026-05-21.)
- **Visual:** Has a visual motif tied to the Fibonacci ranking + the weekly fractal sessions. Worth carrying into any Respect or leaderboard UI.
- **Build surface:** Respect = soulbound, non-transferable, Fibonacci-ranked peer reputation. Fractal = weekly 4-6 person group ranking ritual. `src/components/respect/` in ZAO OS. Respect is what defines the ZABAL Games voter set (Respect-above-threshold = eligible to vote). Builders can ship: fractal tooling, Respect visualizations, contribution trackers, the voter-eligibility surface for the Games itself.
- **Status:** Live - core governance mechanic. Drove the Q1 cascade (fractal bot -> ZAO OS shipped).

---

## How This Feeds the Games

The Phase 2 prompt bundle includes this whole guide - Finalists read it to understand what they're building for and which brand their build serves. The Phase 1 build-a-thon gets a lighter version (umbrella + the one-liners + build surfaces). Each mentor's category can map to a brand or cross-brand surface.

## Open Gaps for Zaal

Resolved 2026-05-21 (see ZAO research Doc 701 Part 7): ZAO OS (1:1 with umbrella), ZABAL voice, WaveWarZ voice (loud arena brand confirmed), ZAO Festivals (Maine-local visual), ZAO Music (artist-collective voice, umbrella visual), Respect (Fibonacci motif), COC Concertz mission line.

Still open:
- COC Concertz visual spec (voice locked 2026-05-22 - warm + communal; visual is its own distinct brand, Zaal to describe)
- ZABAL - the concrete wordmark + zabal.art palette spec
- WaveWarZ - palette/vibe spec (extract from wavewarz-intelligence.vercel.app)

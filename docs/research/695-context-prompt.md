---
topic: events
type: guide
status: research-complete
last-validated: 2026-05-20
related-docs: 432, 609, 630, 649, 681, 682, 684
tier: DEEP
---

# 695 - ZABAL Games: Ecosystem Context Prompt

> **Goal:** The full paste-ready context prompt for ZABAL Games builders and the AI coding agents they build with. Built from a 15-agent audit (two waves) of Zaal Panthaki, The ZAO, WaveWarZ, ZAO Festivals, the people, governance, agent stack, music, tech, economy, partnerships, and web properties. Everything below the line is the prompt - hand it to a builder as their orientation brief, or paste it whole into their coding agent as context.

---

## THE PROMPT

You are building during ZABAL Games, a 3-month build-a-thon run by The ZAO. This document is your context. Read all of it before you write anything. It tells you who you are building for, what the ecosystem is, who is in it, how it governs itself, and how to talk about it correctly.

### 1. What ZABAL Games is

ZABAL Games is a 3-month builder event that brings new builders into the ZAO ecosystem by having them ship real things alongside ZAO members as embedded teammates. The canonical name is **ZABAL Games**, always written exactly that way. (Zaal calls it "Z of All Games" out loud as a pun - never write that down.)

The three months:

- **June - Workshops.** Roughly 30-minute sessions led by ZAO members and volunteers. Free, no prerequisites, recorded so they work async.
- **July - Open Build Month.** Open to anyone, worldwide. There is no application form. The build IS the application: you ship something real (a live URL, an open-source repo, a short demo cast to `/zabalgames` on Farcaster) using any vibe-coding tool you like (Claude Code, Cursor, Bolt, v0, and so on).
- **August - Finals.** 8 ZAO mentors each claim one builder from the July pool. Each mentor embeds with their builder as a teammate for a roughly 24-hour synchronized build window, followed by a promote window. Results are voted on through ZAO governance - Respect-earning members, one person one vote, not token-weighted. The reveal is streamed.

All 8 finalists win. The real competition is getting selected in July; the Finals are collaboration, not a playoff. Every finalist is paid (a tiered pool of about $500 USDC - roughly $150 / $100 / $75 / $35 x5), gets a participation NFT, earns Respect during the event, keeps a GitHub portfolio piece, and gets their streamed session footage.

The 8 locked mentors: ohnahji, candytoybox, eduard, freezetheverse, Iman, Thy Revolution, Tom Fellenz, Adam SongJam. Each mentor holds a Hats Protocol "ZAO Mentor S1" onchain role.

You build in the open. Visibility is the anti-cheat and the point: live stream, or recorded screen uploads, or public AI prompt logs, or frequent build casts. You pick a **build track** by brand - ZAOstock, ZABAL, WaveWarZ, or The ZAO. The rest of this prompt is the shared context underneath all four tracks.

### 2. Who Zaal is

ZABAL Games is run by **Zaal Panthaki**, who builds publicly as **BetterCallZaal**. Handles: `@zaal` on Farcaster, `@bettercallzaal` on X and YouTube, plus Twitch livestreams of his build sessions. He founded The ZAO.

The origin story explains every decision downstream. In college (2018-19) Zaal was close to an independent musician known as JANGOUU FOREVER. Watching how hard it was for a genuinely talented independent artist to capture the value of their own work set Zaal on building systems that return the profit margin, the data, and the IP rights to creators. The ZAO is the through-line of that idea.

How Zaal works, so you can match the cadence:

- **Velocity plus ruthless abandonment.** He ships constantly and kills projects fast when they stop earning their keep. A dead project is finished R&D, not a failure.
- **Build for hand-off, not for control.** Every repo is shaped so a teammate can own it. The goal is an organization that runs without him in every loop.
- **Monorepo as lab.** New things prototype inside one big repo (ZAOOS), then graduate to their own repo and domain when they are ready for real users.
- **Funnel-first.** Every surface is wired for audience capture and distribution, not just for looking good.
- **Build in public.** He runs a daily newsletter ("Year of the ZABAL", on Paragraph) and a podcast (BCZ YapZ) and livestreams his work. The work is the content.

Build the way he builds: a small thing that ships and works beats a big thing that is only described.

### 3. What The ZAO is

The ZAO is **a decentralized impact network focused on bringing the profit margin, data, and IP rights back to artists, using emerging technology like blockchain and AI.** Use that framing. Do not call it a "music community" - it is broader, and the technology is the means, not the headline. Internally the priority order is **music first, community second, technology third.** Web3 is invisible infrastructure, never the pitch.

The ZAO has roughly 188 members on the Base chain (as of May 2026), most of them crypto-native Farcaster users.

**The ZAO is an incubator.** This is the core model: a community member pitches or builds something, The ZAO incubates it, and Zaal plus a community cofounder back it with shared infrastructure (the agent stack, the token, the community, distribution). WaveWarZ was the first project incubated this way and is the proof the model works. ZABAL Games is itself an on-ramp into this model - a strong build can become an incubated project.

The ZAO's product is organized as **four pillars**:
1. **Artist Org** - the social and music layer: chat, the music player, the social graph, contribution circles.
2. **Autonomous Org** - governance and agents: the Respect leaderboard, voting, treasury, the AI bots.
3. **Operating System** - the tools: identity, cross-platform publishing, taste graphs.
4. **Open Source** - research, smart contracts, and a forkable template so any community can run their own.

The 12-month vision: ecosystem primitives built so that **any digital creator** can bring their brand and scale it - not musicians only.

### 4. How The ZAO governs itself

The ZAO runs on **fractal governance** - a weekly peer-evaluation process, going 90-plus weeks, every Monday at 6pm EST in Discord. This is also how ZABAL Games Finals are judged, so understand it.

How a session works: members are split into small breakout groups (3-6 people). Each person gets a few minutes to share what they contributed that week - code, music, events, onboarding, anything. The group ranks the contributions together. Higher ranks earn more **Respect**, a non-transferable reputation token, on a Fibonacci curve (the top contributor in a group of six earns 13, the next 8, then 5, 3, 2, 1). Respect is earned, never bought. Respect is how voting weight and standing work across The ZAO.

The system traces to the "fractal" lineage (Optimism Fractal, Eden Fractal) and runs on the ORDAO contract set. Two facilitators, Dan and Tadas, run the weekly sessions. You do not need the contract details - you need to know that in The ZAO, **contribution is measured by peers, in public, every week**, and that is what earns standing.

### 5. The people you are building with

You are not building for a faceless org. Key people:

- **Zaal** - founder, runs ZABAL Games.
- **candytoybox** (Samantha, she/her) - ZAO cofounder and WaveWarZ cofounder. ZABAL Games mentor.
- **AttaBotty** - ZAO cofounder, 20-plus years in music production, leads ZAOstock production.
- **Hurric4n3ike** (that exact spelling, digits 4 and 3) - founder and lead developer of WaveWarZ, based in Houston.
- **Iman** - leads ZAO Devz, owns the songchaindao GitHub org, built the team coworking tracker, runs a bot VPS. ZABAL Games mentor.
- **Thy Revolution** - cofounder and community lead of COC Concertz. ZABAL Games mentor.
- **Ohnahji** - the education pillar, runs an onchain education effort. ZABAL Games mentor.
- **Tom Fellenz** - composer and guitarist, metaverse music builder. ZABAL Games mentor.
- **DCoop** - hip-hop artist, leads music operations and a satellite festival.
- **Steve Peer** - a 37-year Ellsworth, Maine music fixture, co-curates ZAOstock and anchors it locally.

The remaining ZABAL Games mentors are **eduard**, **freezetheverse**, and **Adam SongJam**.

### 6. The brands and your four build tracks

**WaveWarZ** - the first project The ZAO incubated, and the living proof of the incubator model. A music-battle platform where artists compete head to head and the community participates around the outcomes. Founded and led by Hurric4n3ike; Zaal and Samantha (candytoybox) are cofounders through the incubator. It has run hundreds of battles and a live IRL battle at a ZAO event.

**ZAO Festivals** - the events umbrella, framed as "ZAO Festivals presents [event]." Past events include ZAO-PALOOZA (NYC, 2024), ZAOCHELLA (Miami, 2024, an Art Basel activation), and ZAO-PROS (a conference activation). The flagship is **ZAOstock 2026** - October 3, 2026, in Ellsworth, Maine, at the Franklin Street Parklet, run as an official part of the local Art of Ellsworth weekend. It is the first ZAO IRL festival under the org's full ownership, produced by a six-circle team (finance, host, livestream, marketing, music, ops). **COC Concertz** runs metaverse concerts that ramp toward the IRL events.

**ZABAL** - Zaal's personal umbrella brand and the `$ZABAL` token on Base. ZABAL is the layer above The ZAO. A "ZABAL project" is something Zaal builds solo before it is proposed to The ZAO; a "ZAO project" is something incubated with community cofounders. Things move from ZABAL to ZAO when they are ready.

**The ZAO** - the platform itself: the app, the agents, the governance, the open-source template.

Pick the track whose creator problem you most want to solve. Each track has its own deeper brief; this prompt is the shared base under all four.

### 7. The tech you are building near

**ZAOOS** is the main product and lab repo. Stack: Next.js 16, React 19, Supabase (with row-level security), Neynar (Farcaster), XMTP (encrypted messaging), Wagmi/Viem (wallets), Tailwind CSS v4. It started as a gated Farcaster social client for The ZAO and grew into a monorepo lab. Dark theme, navy and gold, mobile-first.

**The agent stack** - The ZAO runs a small fleet of AI agents on one shared pattern called Hermes:
- **ZOE** - the concierge bot, Zaal's daily assistant.
- **Hermes** - the locked automation framework; turns fixes into pull requests.
- **ZAOcoworkingBot** - the team's task tracker.
- **Bonfire** - a knowledge graph that stores what the ecosystem knows; the bots read and write it.

If you build automation or an agent, fit the Hermes pattern: one shared core, specialized bots, handoff through shared state.

### 8. The economy, briefly

You do not need to build tokenomics, but know the pieces:
- **$ZABAL** - the ecosystem token, ERC-20 on Base, launched January 2026. The liquid incentive layer.
- **Respect** - earned, non-transferable reputation from the weekly fractals. Governance weight.
- **ZOLs** - internal contribution credits, roughly one per volunteer hour at ZAO events. Not money, recognition.
- **Empire Builder** and **POIDH** - distribution and bounty rails that reward contribution and content.

The pattern: reputation and contribution are tracked separately from money. Build things that reward creators for real contribution, not for speculation.

### 9. The web map

If you need to point at something live: `zaoos.com` (the app), `zaostock.com` (the festival), `thezao.com` (the community site), `zaofestivals.com` (the events umbrella), `wavewarz.com`, `cocconcertz.com`, `bczyapz.com` (the podcast), `zlank.online` (a no-code Farcaster mini-app builder), and `bettercallzaal.com` with its sub-pages `/nexus` (the full ecosystem directory), `/kit` (the brand kit), and `/zabalgames`.

### 10. The rules for everything you write and build

- **Brand spellings are exact. Never autocorrect them.** WaveWarZ. COC Concertz. The ZAO. BetterCallZaal. ZABAL. ZABAL Games. ZAOstock. ZAOCHELLA. ZAO Festivals. SongJam. ZOE. FISHBOWLZ. Thy Revolution. Tom Fellenz. Hurric4n3ike. candytoybox.
- **No emojis. No em dashes.** Use plain hyphens and text labels, not decorative symbols.
- **Mobile-first.** Most of the audience is on a phone. Design for the phone; treat desktop as the enhancement.
- **Music first, community second, technology third.** Lead with the artist outcome, not the blockchain.
- **Do not invent.** No fake partnerships, numbers, dates, or rewards. If you do not know it, leave it out.

### 11. What a winning ZABAL Games build looks like

- **It ships and it works.** A small live thing beats a big described thing.
- **It serves an independent creator** - it gives an artist more reach, more ownership, or more income.
- **It fits one track** and you can say in one sentence which creator problem it solves.
- **It is built to hand off** - readable and documented enough that a ZAO member could pick it up.
- **It is built in public** - streamed, logged, or cast as you go. That is the ZAO default and the event's anti-cheat.

That is the context. Now go build something a creator would actually use.

---

## Notes for the maintainer (not part of the prompt)

- This is the shared, all-tracks context prompt. The four per-brand deep-dive prompts (ZAOstock, ZABAL, WaveWarZ, The ZAO) should extend this base with track-specific repos, APIs, and example builds.
- Numbers kept deliberately soft where the two audit waves disagreed - WaveWarZ battle counts and SOL volume, follower counts, exact Respect-contract details. Verify against live sources before any of those go on a public page.
- Verify the mentor roster, the prize tiers, and the August Finals mechanics against the live ZABAL Games spec (doc 630 / doc 681) before publishing - they were correct as of 2026-05-20 but the program is young.
- The optional Clanker per-build token mechanic (doc 646) is intentionally left out of this prompt - that decision was still pending Zaal's sign-off.
- Source: a 15-agent audit on 2026-05-20 across Zaal, The ZAO, WaveWarZ, ZAO Festivals, the community, governance, the agent stack, music, the tech stack, the economy, partnerships, and web properties.

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Review the prompt for voice + accuracy; correct any ZABAL Games mechanics that moved | @Zaal | Review | Before June workshops |
| Write the 4 per-brand deep-dive prompts that extend this shared base | next session | Docs | Before July open build |
| Verify the soft numbers (WaveWarZ stats, mentor roster, prize tiers) against live sources | @Zaal | Decision | Before publishing |

## Sources

- 15-agent research audit, 2026-05-20 (two waves): Zaal profile + public footprint, The ZAO, WaveWarZ, ZAO Festivals + ZABAL Games, portfolio + brand architecture, community + people, governance + fractals, the agent stack, music, the ZAOOS tech architecture, token + economy, partnerships, live web properties
- Doc 432 (ZAO master context), Doc 609 (six circles), Doc 630 (ZABAL Games spec), Doc 649 (84-repo builder survey), Doc 681/682 (ZAOstock 5/19 standup)
- ZAO OS V1 memory: user_zaal*, project_zao_*, project_zabal_games, project_candytoybox_samantha, project_hurric4n3ike, project_jangouu_forever, project_fractal_process, and the project memory cluster

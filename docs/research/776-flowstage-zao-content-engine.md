---
topic: builds
type: build-brief
status: ready-to-build
last-validated: 2026-06-16
related-docs: 701, 770, 760
original-query: "build a claude code repo with / about flowstage for the zao and the zabal"
tier: STANDARD
---

# 776 - FlowStage x ZAO content engine (ZAO OS build brief)

> **Goal:** A ready-to-build brief for the ZAO OS / build bot. Build a FlowStage-powered
> short-form content engine for ZABAL Gamez and the ZAO: turn the workshop recording
> library and ZAO artists' music into on-brand short-form videos and slideshows via the
> FlowStage API, for distribution to /zabal and socials.

> **Status:** ready-to-build. The one open dependency is FlowStage API access + auth
> (see Open questions). Everything else is specified. AZKAL (FlowStage founder) presents
> on Thu Jun 18, 8pm EST - grab the API details then if not before.

## Why this

ZABAL Gamez is generating a steady library of recorded workshops (see
zabalgamez.com/recordings). The bottleneck is not content, it is distribution: turning
each session into short-form promo that reaches the artist, builder, and creator
audiences. FlowStage exists to do exactly this for artists - it scales your own taste
into many on-brand short-form videos and slideshows, with no generative AI, using only
media you have approved into an "aesthetic." Pointing it at ZABAL Gamez source material
gives the event a content flywheel and showcases FlowStage's API (the build angle AZKAL
is demoing). This is the "streaming auto-clip flywheel" / "content pipeline" adopt-path
from /llms.txt, made concrete.

## What FlowStage is (accurate, from the docs)

- Helps artists and editors SCALE THEIR OWN TASTE - it does not AI-generate visuals or
  pull in unapproved media. Everything in an edit comes from the aesthetic you built.
- You build "aesthetics" (curated sets of your own footage, photos, and audio), then
  FlowStage produces short-form videos (standard, flipbook, synced) and slideshows at
  scale, and helps schedule and post them (e.g. to TikTok).
- Review-before-post is core to its philosophy.
- Exposes an API you can build a content engine on top of (cf. the flowstage-zero repo).
- Docs: https://app.theflowstage.com/docs . App: https://app.theflowstage.com .

## Mission (for the build agent)

Build a content engine that takes ZABAL Gamez source material - workshop recordings,
clips, transcripts/chapters, ZAO artists' music, and the ZAO/ZABAL brand kit - and uses
the FlowStage API to generate on-brand short-form videos and slideshows, with a human
review surface before posting to /zabal and socials.

### MVP (ship first)
1. Define a ZABAL Gamez "aesthetic" in FlowStage: brand kit (arcade logo, ZAO palette,
   Syne/Outfit/JetBrains Mono), approved B-roll, official promo audio.
2. Pull a source item (a workshop recording + transcript/chapters from
   /recordings/index.json) and generate 3-5 short clips/slideshows via the FlowStage API,
   mapped to the three tracks (artist, builder, creator).
3. A small review surface (Next.js) that lists generated drafts for human approval before
   posting - matches FlowStage's review-before-post philosophy.
4. One-click export / handoff to post on /zabal (Farcaster) and socials.

### Stretch
- Auto-ingest new recordings as they land and queue draft content.
- Per-artist aesthetics for ZAO musicians (WaveWarZ, ZAO Music) from their own media.
- Tie distribution engagement back to Empire Builder so creators earn for it.

## Tech stack (defaults)

- Frontend: Next.js 16 (App Router, Turbopack) + Tailwind v4 + Farcaster mini-app SDK
- Identity: Neynar (Farcaster verified addresses + signers). Do NOT roll your own auth.
- Backend: Supabase (Postgres + Storage) + Next.js API routes
- Onchain (only if doing the Empire Builder tie-in): Base (8453), viem + wagmi
- Integration: FlowStage API for all generation. Never generative-AI visuals; only media
  approved into an aesthetic.

## Brand rules (hard)

- No emojis, no em dashes (hyphens only), no decorative Unicode. Use labels: [MUSIC],
  DONE, IN PROGRESS.
- No crypto/web3/onchain jargon in user-facing copy. "builders" / "digital creators".
- Exact ZAO naming (WaveWarZ, COC Concertz, ZABAL, $ZABAL). "100+" for member count.
- ZAO palette + Syne/Outfit/JetBrains Mono fonts.

## Deliverables (ZABAL Gamez submission bar, by T+24h)

1. Live deployed URL (Vercel free tier)
2. Public GitHub repo, MIT license, README (setup, .env.example, FlowStage API key flow,
   how to define an aesthetic, how to generate + review)
3. 60-second demo video
4. Ship cast on /zabal tagging @bettercallzaal
Keep a show-your-work mode running (build casts every 1-2h or a recorded screen session).

## Open questions (resolve before building past the scaffold)

1. FlowStage API auth + access - how does the API authenticate, and how do we get a key?
   The public docs cover the app workflow, not the API. Ask AZKAL.
2. Which recording to start the end-to-end path with (suggest the newest with a video).
3. Posting: auto-post vs. export-and-post by hand (FlowStage warns auto-posting raises
   shadowban risk and breaks TikTok audio association - default to export + review).

## Ready-to-run kickoff prompt

Paste this into a fresh Claude Code session (or hand to the ZAO OS build bot):

```
You are building a new repo for the ZAO ecosystem: a FlowStage-powered short-form
content engine for ZABAL Gamez and the ZAO.

FIRST, load context before writing anything:
- Read https://zabalgamez.com/llms.txt (canonical ZAO/ZABAL ecosystem context).
- Read the FlowStage docs at https://app.theflowstage.com/docs and the app at
  https://app.theflowstage.com . FlowStage scales an artist's OWN taste (not generative
  AI): build "aesthetics" from your own footage/audio, then it produces short-form videos
  and slideshows at scale and helps schedule/post them. It exposes an API to build a
  content engine on top of (see the flowstage-zero repo).

MISSION
Take ZABAL Gamez source material - workshop recordings, clips, transcripts/chapters from
zabalgamez.com/recordings/index.json, ZAO artists' music, and the ZAO/ZABAL brand kit -
and use the FlowStage API to generate on-brand short-form videos and slideshows for
distribution to the /zabal Farcaster channel and socials, with human review before posting.

MVP
1. Define a ZABAL Gamez aesthetic in FlowStage from the brand kit + approved B-roll +
   the official promo audio.
2. Pull a recording + its transcript/chapters and generate 3-5 short clips/slideshows via
   the FlowStage API, mapped to the artist, builder, and creator tracks.
3. A Next.js review surface listing generated drafts for human approval before posting.
4. One-click export / handoff to post on /zabal and socials.

STRETCH: auto-ingest new recordings; per-artist aesthetics for ZAO musicians; tie
engagement back to Empire Builder.

TECH: Next.js 16 (App Router, Turbopack) + Tailwind v4 + Farcaster mini-app SDK; Neynar
for identity (no custom auth); Supabase (Postgres + Storage) + API routes; Base (8453) +
viem/wagmi only if doing the Empire Builder tie-in; FlowStage API for all generation,
never generative-AI visuals.

BRAND (hard): no emojis, no em dashes (hyphens), no decorative Unicode (use labels like
[MUSIC], DONE). No crypto/web3 jargon in user-facing copy. Exact ZAO naming. ZAO palette
+ Syne/Outfit/JetBrains Mono.

DELIVERABLES by T+24h: live Vercel URL; public MIT GitHub repo with README + .env.example;
60-second demo video; ship cast on /zabal tagging @bettercallzaal. Keep a show-your-work
mode running.

FIRST STEPS
1. Confirm FlowStage API access + auth (ask the user / AZKAL; check the docs).
2. Scaffold Next.js + Supabase schema (sources, aesthetics, generated_drafts, posts).
3. Wire ONE end-to-end path - one recording in, a few approved drafts out - before breadth.
Ask any blocking questions (FlowStage API auth, which recording to start with) before
building past the scaffold.
```

---
name: zabal-games
description: ZAO ecosystem + ZABAL Games context. Use when building a project for ZABAL Games, the ZAO community, or any ZAO ecosystem brand (ZAO OS, $ZABAL, WaveWarZ, COC Concertz, ZAO Festivals, ZAO Music, BetterCallZaal). Loads brand guidelines (no emojis, no em dashes, naming glossary), tech stack (Next.js 16, Farcaster mini apps, Base, Supabase, Empire Builder, Hats, Bonfire, EAS), the two build paths (adopt a started project or build from scratch), and the ZABAL Games submission bar.
---

# ZABAL Games / ZAO ecosystem context

Use this skill any time you write code, copy, or content for:

- A ZABAL Games submission (June workshop, July build, August Finals).
- A project for any ZAO ecosystem brand.
- Anything that uses the ZAO Farcaster channel `/zabal`, ZAO OS, $ZABAL, WaveWarZ, COC Concertz, ZAO Festivals, ZAO Music, or related rails (Empire Builder, Hats Protocol, Bonfire, EAS, Hypersub, Coinflow, 0xSplits, Clanker).

The full context lives at **https://zabalgames.com/llms.txt** (mirrored in this repo at `/llms.txt`). That is the canonical, machine-readable, harness-agnostic version. This skill is the Claude Code-packaged variant of the same source, with load-once-and-respect instructions for an agent.

---

## Always do

1. **Read `/llms.txt` (or the URL above) at the start of any ZABAL Games / ZAO task.** It carries the full ecosystem context, tech stack defaults, build paths, and brand guidelines. Treat its sections as menu items - if you are building Empire Builder tooling, focus on that section.
2. **Apply the brand guidelines without exception:**
   - **No emojis** anywhere - not in code, commits, casts, UI copy.
   - **No em dashes** - use hyphens.
   - **No decorative Unicode** (checkmarks, warnings, play buttons). Use labels: `[MUSIC]`, `OVERDUE`, `DONE`, `IN PROGRESS`.
   - Use the **naming glossary exactly** (WaveWarZ not Wave Wars, ZABAL not Zabal, COC Concertz with the `z`, etc).
   - Use the **ZAO color palette + Syne/Outfit/JetBrains Mono fonts**.
3. **Identify which ZAO brand you are building for** and pull only the relevant sections from `/llms.txt`. Less context = better focus.
4. **Tie your build to existing ZAO rails** rather than reinventing identity, leaderboards, or attestations. Composability is the point.
5. **Quote the brand naming exactly** when writing user-facing copy, commits, PR descriptions, or casts.

## Never do

- Add emojis, em dashes, or decorative Unicode.
- Misspell or auto-correct ZAO brand names.
- Build something that competes with a paused brand (e.g. do NOT build "audio rooms for music" - that was FISHBOWLZ's job, now Juke's).
- Use marketing fluff ("revolutionary", "game-changing", "transform your X").
- Roll your own identity layer - use Farcaster verified addresses + Neynar.

## When the task is a ZABAL Games submission

Hit ALL four by T+24h:

1. **Live deployed URL** (Vercel free tier works)
2. **Public GitHub repo** (MIT license)
3. **60-second demo video** (Loom, YouTube, or self-hosted)
4. **Cast on `/zabal`** announcing your ship, tag `@bettercallzaal`

Plus maintain at least one **show-your-work visibility mode** during the build (live Twitch stream / recorded screen sessions uploaded within 1h / public AI prompt logs every 1-2h / frequent build casts every 1-2h).

## Picking your build path

ZABAL Games gives two paths:

- **Adopt a started ZAO project** from the curated list in `/llms.txt` (Songjam migration, POIDH leaderboard, zlank Snap template, Twitch -> Empire feed, new ZOE skills, this `/zabal` mini app, COC content pipeline, streaming auto-clip flywheel). Pick one, ship it forward.
- **Build from scratch** with the ecosystem context. Tie it to real ZAO rails.

If you are unsure, start by listing the rails the user already has + the highest-leverage gap in the ecosystem. The full brand-by-brand status is in `/llms.txt`.

## Tech stack defaults

When generating boilerplate, default to:

```
Frontend: Next.js 16 (App Router, Turbopack) + Tailwind v4 + Farcaster mini-app SDK
Onchain:  Base (chainId 8453), viem + wagmi, Coinbase Smart Wallet
Identity: Neynar for Farcaster reads + signers
Backend:  Supabase (Postgres + Auth + Storage), Next.js API routes
```

Solana is only used for WaveWarZ reads (Helius free tier).

## Where to look for deeper context

When `/llms.txt` is not enough:

- [Full player context bundle](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/630-player-context-bundle.md) - 700+ lines, every detail
- [Canonical state](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/701-canonical-state.md) - what is locked, what is open
- [Brand identity guide](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/brand-context.md) - voice + visual per brand
- [Research library](https://github.com/ZAODEVZ/zabalgames/tree/main/docs/research) - the full decision log

## How to install this skill

Drop this file into your Claude Code skills directory:

```bash
# user-level (available across all your projects)
mkdir -p ~/.claude/skills/zabal-games
curl -o ~/.claude/skills/zabal-games/SKILL.md https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/.claude/skills/zabal-games/SKILL.md

# OR project-level (available in one project only)
mkdir -p .claude/skills/zabal-games
curl -o .claude/skills/zabal-games/SKILL.md https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/.claude/skills/zabal-games/SKILL.md
```

Then either start a new Claude Code session in that project, or `/skill list` to confirm it loaded.

For Cursor / Windsurf / Aider / Cline equivalents, just point them at `https://zabalgames.com/llms.txt` directly (see the file's "How to use this file with your harness" section).

---

*This skill is mirrored at https://github.com/ZAODEVZ/zabalgames/blob/main/.claude/skills/zabal-games/SKILL.md. Source of truth for the content is `/llms.txt` in the same repo.*

# 770 - ElizaOS $ZABAL Build-Suggestion Bot

> **Status:** Spec drafted 2026-05-28. Implementation: post-launch sprint (mid-June).
> **Origin:** Zaal call 2026-05-28 - 'this might be a great opportunity to create an elizaOS bot for this it accepts \$zabal and gives you suggestions on your build.'
> **Lives at:** TBD - probably `/zabal` Farcaster channel as a tag-mentionable bot, plus a Mini App pop-in on zabalgames.com.

## The shift

**Before:** builders join /zabal channel, ask questions, hope someone knowledgeable replies. Async friction. New builders bounce.

**After:** builders mention the bot, it reads their repo (auto-detected from their Farcaster connected GitHub via Doc 750 OAuth) + their question, returns concrete suggestions tuned to the ZABAL Games context (ecosystem rails, brand glossary, submission bar, mentor-claim rubric). Free baseline. \$ZABAL micropayment unlocks deeper review.

## Who this is for

| User | Use case |
|---|---|
| First-time builder browsing /zabal | "What should I build for ZABAL Games?" - bot gives 3 project suggestions tuned to their stated interest |
| Mid-build builder | "How does Empire Builder integration work for my build?" - bot points at the right rail + a code snippet from llms.txt |
| Mentor-curious lurker | "Which builders need a contracts mentor?" - bot reads builders.json + people.json + suggests pairings |
| Pre-Finals finalist | "Review my submission bar for Finals readiness" - bot scores their README + URL + demo against the rubric |

## Architecture

```
Builder casts: @zabalbot what should i build for the games?
            |
            v
  +------------------------------------------+
  |  ElizaOS agent listening on Farcaster    |
  |  via @elizaos/farcaster-plugin           |
  +------------------------------------------+
            |
            v
  +------------------------------------------+
  |  Agent context loaded:                   |
  |  - llms.txt (ecosystem context)          |
  |  - data/people.json (roster + mentors)   |
  |  - data/adoptable-projects.json (16 idea)|
  |  - data/workshop-leads.json (sessions)   |
  |  - docs/brand-kit + brand-context.md     |
  |  - docs/research/720-finals-mechanic.md  |
  |  - builder's GitHub history (if Doc 750  |
  |    OAuth done, else null)                |
  +------------------------------------------+
            |
            v
  +------------------------------------------+
  |  Tier 1 (free):                          |
  |  - 1-paragraph suggestion                |
  |  - 1 link to the right rail / doc        |
  |  - "Tip 1 ZABAL for deeper review" CTA   |
  +------------------------------------------+
            |
            v  (optional)
  +------------------------------------------+
  |  Tier 2 (paid via $ZABAL micropayment):  |
  |  - Full README review against rubric     |
  |  - 3 specific code-level suggestions     |
  |  - Mentor-fit pairing recommendation     |
  |  - Cast attribution + Bonfire kEngram    |
  +------------------------------------------+
            |
            v
  +------------------------------------------+
  |  Reply cast in same thread + DM if Tier2 |
  +------------------------------------------+
```

## ElizaOS overview

- Open-source agent framework, originally Eliza, rebranded ElizaOS
- GitHub: https://github.com/elizaOS/eliza
- Character-based personas with plugin system
- Supports: Farcaster, Discord, X, Telegram, web UI
- Memory backends: PostgreSQL, SQLite, vector DBs
- TypeScript, Node 23+

Fits our use case because:
- Plugin model lets us drop in Farcaster + GitHub + x402 payments cleanly
- Character system maps to "ZABAL bot persona" (warm builder voice, no emojis)
- Open-source = no vendor lock-in, host wherever
- Active community + regular releases

## Payment mechanism

Two paths, pick or both:

### Path A: x402 HTTP 402 micropayment

- Coinbase's x402 protocol: HTTP request returns 402 Payment Required, builder's wallet pays USDC, request retries with payment proof
- Existing $ZABAL holder doesn't need new flow - x402 on Base settles in 2-5 sec
- Bot endpoint: `POST /api/bot/deep-review` returns 402 with `{"asset": "USDC", "amount": "0.50"}` -> client pays -> retries
- Pro: standardized, fits agent-to-agent payment patterns
- Con: requires x402-aware wallet UX; many Farcaster wallets not there yet

### Path B: $ZABAL direct tip

- Builder tips bot's Base address X $ZABAL via existing Empire Builder boost or direct transfer
- Bot watches its address; tx with memo "deep-review @builder" triggers Tier 2
- Pro: works with any Base wallet today
- Con: less elegant, requires manual memo

**Recommendation:** start with Path B (works now), add Path A in v2 when x402 is more widely supported.

## Bot character / persona

Character file at `bot/zabal-bot.character.json`:

```json
{
  "name": "ZABAL Bot",
  "username": "zabalbot",
  "plugins": [
    "@elizaos/farcaster-plugin",
    "@elizaos/github-plugin",
    "@elizaos/x402-plugin",
    "@zabal/bot-rubric-plugin"
  ],
  "modelProvider": "anthropic",
  "settings": {
    "model": "claude-sonnet-4-6",
    "secrets": {
      "FARCASTER_FID": "TBD",
      "FARCASTER_NEYNAR_SIGNER_UUID": "TBD",
      "GITHUB_TOKEN": "(read-only, no PII)",
      "BOT_ETH_PRIVATE_KEY": "(Base wallet for tip detection)"
    }
  },
  "system": "You are the ZABAL Bot - a guide for builders in The ZAO ecosystem. Voice: warm, builder-energy, drop articles when terse helps, no emojis, no em-dashes, no specific holder counts (use '100+'). You know the ecosystem deeply (you have llms.txt, brand-kit, research docs, roster). Tier 1 answers are 1 paragraph + 1 link. Tier 2 (paid) answers are full reviews with concrete suggestions.",
  "bio": [
    "ZABAL Bot is the in-channel guide for ZABAL Games builders.",
    "Free Tier: 1 suggestion + 1 link in reply cast.",
    "Tip ZABAL for deep review."
  ],
  "lore": [
    "Lives in /zabal channel + zabalgames.com",
    "Built on ElizaOS",
    "Knows the ecosystem: ZAO, $ZABAL, Empire Builder, WaveWarZ, Hats, Bonfire, EAS, Magnetiq",
    "Refers to humans by Farcaster handle"
  ],
  "knowledge": [
    "(loaded from llms.txt + people.json + research docs at startup)"
  ],
  "topics": [
    "ZABAL Games",
    "ZAO ecosystem",
    "Farcaster building",
    "Empire Builder integration",
    "Hats Protocol",
    "vibe-coding harness selection"
  ],
  "style": {
    "all": [
      "Direct, builder-energy",
      "Drop articles when terse helps",
      "Voice matches Zaal's caveman + warm tone",
      "No emojis. No em-dashes (use hyphens).",
      "Reply in the thread, DM only if Tier 2"
    ],
    "chat": [
      "Open with the answer, not 'great question!'",
      "Always end with 1 link OR 1 next action"
    ]
  }
}
```

## Knowledge base loading

At startup, bot reads:

| Source | What it gets |
|---|---|
| `zabalgames.com/llms.txt` | Full ecosystem context (~30KB) |
| `data/people.json` | Confirmed roster + mentor offers + best-fits |
| `data/adoptable-projects.json` | 16 starter projects with rails + difficulty |
| `data/workshop-leads.json` | Session schedule + topics |
| `data/changelog.json` | Recent updates + decisions |
| `docs/brand-kit-2026-05-28.md` | Voice + glossary + banned phrases |
| `docs/research/720-wavewarz-finals-mechanic.md` | Finals settlement detail |
| `docs/research/750-builder-registration-oauth-flow.md` | Builder OAuth spec for self-reference |

Refreshed on each Vercel deploy of zabalgames.com via webhook (same pattern as Doc 760 Notion CMS).

## Tier 1 example interaction

**Builder casts:** "@zabalbot I want to build something for ZABAL Games but no idea what. I'm a TypeScript dev, never used Farcaster"

**Bot replies:**

```
Pick an adoptable project - lowest gate to start. The 16 list at
zabalgames.com/projects has 9 stack-feature projects (small, plug-in
to an existing rail) + 7 starter-repo projects (full repos to fork +
ship). For a TypeScript dev new to Farcaster, try the SongJam leader-
board migration (project #1) - small Empire Builder API integration,
done in a weekend, zero Farcaster-specific surface.

zabalgames.com/projects.html

Tip 1 ZABAL for the full pairing breakdown.
```

## Tier 2 example interaction (after $ZABAL tip)

**Bot replies in same thread (or DM):**

```
Full review for @yourhandle:

Project pick: SongJam leaderboard migration (id #1, adoptable-projects.json)
Why: matches TS strength, single rail (Empire Builder API), no Farcaster
  identity layer needed for v1, ships in <40 hours, can be expanded to
  use Quotient if you want a stretch goal.

3 concrete suggestions:
1. Use the Empire Builder v3 public read API at
   empire-builder.gitbook.io/empire-builder-docs - apiLeaderboards
   pattern, no auth, 7-day cache. Build the migrator as a webhook that
   polls SongJam's old X scraper output + posts to Empire Builder.
2. Submission bar checklist for July: live URL on Vercel, repo
   public on github.com/yourhandle, 60-sec demo recorded with Riverside
   or QuickTime, cast on /zabal with #zabalgames tag. Include
   zabalgames.com/projects URL in your README for the featured-badge.
3. Mentor pairing: @bettercallzaal is best-fit for cross-rail builds
   (your ID is generalist). Reach via DM on Farcaster.

Audit kEngram pushed to Bonfire: zabal-build-001-yourhandle.
```

## Implementation steps

| Step | Owner | Effort |
|---|---|---|
| 1. Stand up ElizaOS agent locally with character file | dev | 4 hours |
| 2. Wire @elizaos/farcaster-plugin with bot FID + signer UUID | dev | 2 hours |
| 3. Build @zabal/bot-rubric-plugin (loads knowledge base + scoring) | dev | 1 day |
| 4. Wire \$ZABAL tip detection via Base RPC | dev | 4 hours |
| 5. Deploy to VPS (existing or new Hetzner box) | dev | 2 hours |
| 6. Update DNS: bot.zabalgames.com -> VPS | dev | 30 min |
| 7. Add bot to /zabal channel + announce | dev + Zaal | 1 hour |
| 8. Iterate based on first 10 interactions | dev + community | 1 week |

Total: ~3-4 days dev + 1 week iteration.

## Cost model

| Item | Cost |
|---|---|
| ElizaOS framework | Free, open-source |
| Anthropic API (Claude Sonnet, ~30K tokens per Tier 2 review) | ~\$0.05 per Tier 2 review |
| VPS hosting | \$5-15/mo (Hetzner / DigitalOcean) |
| Farcaster signer UUID | Free (need a bot account) |
| Base RPC reads | Free (Alchemy 30M CUs/mo) |

Tier 1 baseline cost per response: ~\$0.005 (small context, single paragraph). At 100 Tier 1 interactions/day = \$0.50/day. Fine.

Tier 2 revenue: 1 \$ZABAL = $X (varies). At 10 Tier 2 reviews/day at 1 ZABAL each = revenue covers Anthropic API cost.

Net: bot pays for itself after ~50 Tier 2 reviews/month.

## Risk register

| Risk | Mitigation |
|---|---|
| Spam / abuse of free tier | Rate limit per FID (5 Tier 1 per day) |
| Tip detection lag (Base block confirmation) | Acknowledge tip immediately, deliver Tier 2 in 5-30 min |
| Bot hallucination on ecosystem facts | Knowledge base loaded with `/llms.txt` as ground truth; system prompt enforces 'no fabrication' |
| Cassie / Hypersnap fork breaks Farcaster plugin compatibility | Pin plugin version + plan migration when fork lands |
| Cost overrun on Anthropic API | Daily budget cap; if hit, Tier 1 + Tier 2 both pause until reset |
| Wallet drain attack on bot tip address | Bot wallet only holds tip earnings; sweep to treasury hourly via Privy key quorum (per Doc 343 pattern) |

## Adjacent docs

- ZABAL Games Doc 750 - Builder OAuth (enables bot to read builder's GitHub history once Phase 1 of that ships)
- ZABAL Games Doc 760 - Notion CMS (the knowledge base may eventually live in Notion + sync to bot at deploy)
- ZAO OS Doc 343 - Agent wallet security (Privy key quorum for bot tip address)
- ZAO OS Doc 489 - Hypersnap fork (monitor for Farcaster plugin compat)

## Phase plan

**Phase 1 (post-launch, mid-June):**
- Tier 1 only (free 1-paragraph replies)
- Hosted on existing VPS
- 50 interactions/day cap

**Phase 2 (July):**
- Tier 2 with $ZABAL tip detection
- Bonfire kEngram push per Tier 2 review
- Mentor-fit pairing recommendations

**Phase 3 (August Finals):**
- Submission-bar scorer integrated with Finals settlement
- Auto-readiness check before T-48h deadline
- Live event coverage casts (top trending builds, market movers)

**Phase 4 (Season 2):**
- $ZABAL governance integration (bot reads HAATZ vote state)
- Voice mode for Spaces participation
- Multi-language responses

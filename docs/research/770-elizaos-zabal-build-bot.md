# 770 - ElizaOS $ZABAL Build-Suggestion Bot

> **Status:** Spec drafted 2026-05-28. Implementation: post-launch sprint (mid-June).
> **Origin:** Zaal call 2026-05-28 - 'this might be a great opportunity to create an elizaOS bot for this it accepts \$zabal and gives you suggestions on your build.'
> **Lives at:** TBD - probably `/zabal` Farcaster channel as a tag-mentionable bot, plus a Mini App pop-in on zabalgamez.com.

## The shift

**Before:** builders join /zabal channel, ask questions, hope someone knowledgeable replies. Async friction. New builders bounce.

**After:** builders mention the bot, it reads their repo (auto-detected from their Farcaster connected GitHub via Doc 750 OAuth) + their question, returns concrete suggestions tuned to the ZABAL Gamez context (ecosystem rails, brand glossary, submission bar, mentor-claim rubric). Free baseline. \$ZABAL micropayment unlocks deeper review.

## Who this is for

| User | Use case |
|---|---|
| First-time builder browsing /zabal | "What should I build for ZABAL Gamez?" - bot gives 3 project suggestions tuned to their stated interest |
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
    "ZABAL Bot is the in-channel guide for ZABAL Gamez builders.",
    "Free Tier: 1 suggestion + 1 link in reply cast.",
    "Tip ZABAL for deep review."
  ],
  "lore": [
    "Lives in /zabal channel + zabalgamez.com",
    "Built on ElizaOS",
    "Knows the ecosystem: ZAO, $ZABAL, Empire Builder, WaveWarZ, Hats, Bonfire, EAS, Magnetiq",
    "Refers to humans by Farcaster handle"
  ],
  "knowledge": [
    "(loaded from llms.txt + people.json + research docs at startup)"
  ],
  "topics": [
    "ZABAL Gamez",
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
| `zabalgamez.com/llms.txt` | Full ecosystem context (~30KB) |
| `data/people.json` | Confirmed roster + mentor offers + best-fits |
| `data/adoptable-projects.json` | 16 starter projects with rails + difficulty |
| `data/workshop-leads.json` | Session schedule + topics |
| `data/changelog.json` | Recent updates + decisions |
| `docs/brand-kit-2026-05-28.md` | Voice + glossary + banned phrases |
| `docs/research/720-wavewarz-finals-mechanic.md` | Finals settlement detail |
| `docs/research/750-builder-registration-oauth-flow.md` | Builder OAuth spec for self-reference |

Refreshed on each Vercel deploy of zabalgamez.com via webhook (same pattern as Doc 760 Notion CMS).

## Tier 1 example interaction

**Builder casts:** "@zabalbot I want to build something for ZABAL Gamez but no idea what. I'm a TypeScript dev, never used Farcaster"

**Bot replies:**

```
Pick an adoptable project - lowest gate to start. The 16 list at
zabalgamez.com/projects has 9 stack-feature projects (small, plug-in
to an existing rail) + 7 starter-repo projects (full repos to fork +
ship). For a TypeScript dev new to Farcaster, try the SongJam leader-
board migration (project #1) - small Empire Builder API integration,
done in a weekend, zero Farcaster-specific surface.

zabalgamez.com/projects.html

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
   zabalgamez.com/projects URL in your README for the featured-badge.
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
| 6. Update DNS: bot.zabalgamez.com -> VPS | dev | 30 min |
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

- ZABAL Gamez Doc 750 - Builder OAuth (enables bot to read builder's GitHub history once Phase 1 of that ships)
- ZABAL Gamez Doc 760 - Notion CMS (the knowledge base may eventually live in Notion + sync to bot at deploy)
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

---

# APPENDIX A - Phase 1 Implementation Guide (2026-05-28)

> Per Zaal 2026-05-28: 'lets do all that for 3 and then tell me what other issues may arise.' Expanding the spec into actionable Phase 1 setup. Build target: mid-June so the bot is in /zabal before July open-build month.

## Phase 1 scope (what ships)

Free Tier 1 only. No payment plumbing yet. The goal of Phase 1 is to validate the **content + voice** of bot replies before adding the economic layer.

- Bot listens on /zabal channel + responds to @-mentions
- Replies in-thread with 1 paragraph + 1 link
- Reads our context: llms.txt + people.json + adoptable-projects.json + workshop-leads.json
- HAATZ for any Farcaster reads (user lookup, channel posts)
- Anthropic API (Claude Sonnet) for the reasoning
- Rate limited per FID (5 Tier 1 / day) to prevent abuse
- One VPS (Hetzner CX22 or similar) running ElizaOS

## Phase 1 timeline (target)

| Day | Owner | Task |
|---|---|---|
| Jun 1-3 | Zaal | Create bot Farcaster account + signer UUID (steps below) |
| Jun 4-5 | dev | Stand up ElizaOS locally, wire HAATZ + Anthropic |
| Jun 6-8 | dev | Knowledge base loader + character file |
| Jun 9 | dev | Deploy to VPS, smoke test with personal account |
| Jun 10 | Zaal + dev | First 10 manual @-mention tests in /zabal |
| Jun 11 | Zaal | Cast announcement of bot in /zabal |
| Jun 12-15 | both | Iterate from first 50 real interactions |

## Bot Farcaster account setup (Zaal does)

The bot needs its own Farcaster identity. Recommended handle: `zabalbot`.

Two paths:

### Path A: Cassie's Hypersnap signup (recommended - free, no Neynar)

1. Open `https://hypersnap.farcaster.xyz` (or equivalent Hypersnap-aware Farcaster client - confirm URL with Cassie)
2. Create new account: `@zabalbot`
3. Verify with a Base ETH address you control (use a fresh wallet for the bot)
4. The signup process gives you:
   - **FID** (the bot's stable identity)
   - **Custody mnemonic** (KEEP SAFE - this controls the FID)
   - **Signer keypair** for the bot's casts (used by ElizaOS)
5. Save FID + signer pubkey to `BOT_FARCASTER_FID` + `BOT_FARCASTER_SIGNER_PRIVATE_KEY` env vars

### Path B: Neynar signer flow (faster but paid)

If Path A is blocked by Hypersnap availability:

1. Go to `https://dev.neynar.com` and create an app
2. Use Sign-In With Farcaster (SIWF) to create the bot's FID
3. Generate a signer via the Neynar dashboard - cost $5-10 for the FID registration
4. Use `BOT_FARCASTER_SIGNER_UUID` + `NEYNAR_API_KEY` env vars
5. Note: this binds the bot's signer to Neynar's signer service. Path A is more sovereign.

## VPS choice

Three options, recommend Hetzner for cost + sovereignty:

| Provider | Tier | Cost | Notes |
|---|---|---|---|
| **Hetzner CX22** | 2 vCPU / 4 GB / 40 GB SSD | **5.50 EUR / month** | Recommended. Datacenter in Falkenstein or Helsinki. Up in <5 min. Bring-your-own SSH key. |
| DigitalOcean Basic | 1 vCPU / 2 GB / 50 GB | $12 / month | Simpler interface, $200 free credit if new. More expensive over time. |
| Railway | Pay per usage | ~$5-10 / month for this load | Easiest deploy (git push -> live). Black box for resource limits though. |

For Phase 1, Hetzner CX22 has plenty of headroom (we're running 1 ElizaOS process + occasionally hitting Anthropic API). Move up only if memory pressure shows in monitoring.

### Hetzner setup (Zaal does)

```bash
# After provisioning, SSH in:
ssh root@<hetzner-ip>

# Install Node 20+ + git + caddy (for HTTPS)
apt update && apt install -y curl git caddy
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # should be v20+

# Create bot user (don't run as root)
adduser zabalbot --disabled-password --gecos ""
su - zabalbot

# Clone ElizaOS
git clone https://github.com/elizaOS/eliza.git
cd eliza
git checkout v2.0.0   # or latest tagged release
npm install

# Set env vars (will use these in next section)
cp .env.example .env
nano .env  # add the env vars below
```

## Environment variables (production)

```
# Anthropic - reasoning
ANTHROPIC_API_KEY=<from console.anthropic.com>
ANTHROPIC_MODEL=claude-sonnet-4-6

# Bot Farcaster identity (from Hypersnap or Neynar signup)
BOT_FARCASTER_FID=<numeric>
BOT_FARCASTER_SIGNER_PRIVATE_KEY=<hex - Path A>
# OR for Path B:
# BOT_FARCASTER_SIGNER_UUID=<uuid>
# NEYNAR_API_KEY=<for write operations only>

# HAATZ (free, no key)
HAATZ_BASE_URL=https://haatz.quilibrium.com

# Neynar (writes only, optional Phase 1)
NEYNAR_API_KEY=<from dev.neynar.com>

# Knowledge base refresh
ZABAL_LLMS_URL=https://zabalgamez.com/llms.txt
ZABAL_PEOPLE_URL=https://zabalgamez.com/data/people.json
ZABAL_PROJECTS_URL=https://zabalgamez.com/data/adoptable-projects.json
ZABAL_WORKSHOPS_URL=https://zabalgamez.com/data/workshop-leads.json
ZABAL_CHANGELOG_URL=https://zabalgamez.com/data/changelog.json

# Budget controls
DAILY_ANTHROPIC_BUDGET_USD=10.00       # auto-pause if exceeded
PER_FID_DAILY_LIMIT=5                  # Tier 1 replies per FID per day
GLOBAL_RATE_LIMIT_PER_HOUR=120

# Operational
LOG_LEVEL=info
SENTRY_DSN=<optional, for error tracking>
```

## Anthropic API budget setup

Cost model (Phase 1):

| Item | Cost per interaction | At 50 interactions/day | Monthly |
|---|---|---|---|
| Input: ~6000 tokens (llms.txt excerpt + DB context + question) | $0.018 (Claude Sonnet 4.6 input) | $0.90 | $27 |
| Output: ~300 tokens (1-paragraph reply) | $0.0045 (Sonnet output) | $0.225 | $6.75 |
| **Total** | $0.023 | $1.13 | **~$34** |

Budget alerts (set in Anthropic Console):
1. Soft alert at $20/month - email to Zaal
2. Hard cap at $50/month - bot pauses Tier 1 replies, posts "back online in <X hours> - sorry about that" cast

Daily safety:
- `DAILY_ANTHROPIC_BUDGET_USD=10` in env (script tracks running total in Postgres)
- If exceeded, bot stops replying + writes a single status cast: "Bot is paused for the day - daily budget hit. Resumes tomorrow."

## Knowledge base loader

ElizaOS character config loads knowledge from these URLs at startup AND refreshes every 4 hours:

```typescript
// bot/lib/knowledge-loader.ts
const SOURCES = {
  llms: process.env.ZABAL_LLMS_URL,
  people: process.env.ZABAL_PEOPLE_URL,
  projects: process.env.ZABAL_PROJECTS_URL,
  workshops: process.env.ZABAL_WORKSHOPS_URL,
  changelog: process.env.ZABAL_CHANGELOG_URL,
};

export async function loadKnowledge() {
  const entries = await Promise.all(
    Object.entries(SOURCES).map(async ([key, url]) => {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
        const text = await res.text();
        return { key, content: text, fetched_at: new Date().toISOString() };
      } catch (e) {
        console.error(`[knowledge] failed to load ${key}:`, e);
        return null;
      }
    })
  );
  return entries.filter(Boolean);
}

// Refresh every 4 hours
setInterval(async () => {
  const fresh = await loadKnowledge();
  cachedKnowledge = fresh;
  console.log('[knowledge] refreshed at', new Date().toISOString());
}, 4 * 60 * 60 * 1000);
```

## HAATZ integration code samples

The bot uses HAATZ for any Farcaster reads (lookups, channel feeds).

```typescript
// bot/lib/haatz.ts
const HAATZ = process.env.HAATZ_BASE_URL || 'https://haatz.quilibrium.com';

export async function lookupUser(fid: number) {
  const res = await fetch(`${HAATZ}/v2/farcaster/user/bulk?fids=${fid}`, {
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`haatz lookup failed ${res.status}`);
  const data = await res.json();
  return data.users[0]; // { fid, username, display_name, pfp_url, verifications, ... }
}

export async function getChannelCasts(channelId: string, limit = 10) {
  const res = await fetch(
    `${HAATZ}/v2/farcaster/feed/channel?channel_id=${channelId}&limit=${limit}`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error(`haatz channel feed failed ${res.status}`);
  return (await res.json()).casts;
}

// Failover wrapper - try HAATZ, fall back to Neynar
export async function lookupUserResilient(fid: number) {
  try {
    return await lookupUser(fid);
  } catch (e) {
    console.warn('[haatz] miss, falling back to Neynar', e);
    const { NeynarAPIClient } = await import('@neynar/nodejs-sdk');
    const neynar = new NeynarAPIClient(process.env.NEYNAR_API_KEY!);
    return await neynar.lookupUserByFid({ fid });
  }
}
```

## Webhook architecture

Bot subscribes to @-mentions of @zabalbot in /zabal channel. ElizaOS Farcaster plugin handles this.

For Phase 1 (simple polling): bot polls HAATZ every 60 seconds for new mentions:

```typescript
// bot/lib/mention-watcher.ts
async function pollMentions() {
  const lastSeenAt = await getLastSeenTimestamp(); // from Postgres
  const casts = await getChannelCasts('zabal', 50);
  const newMentions = casts.filter(c =>
    c.timestamp > lastSeenAt &&
    c.text?.toLowerCase().includes('@zabalbot')
  );

  for (const mention of newMentions) {
    await handleMention(mention);
  }
  await setLastSeenTimestamp(Date.now());
}

setInterval(pollMentions, 60 * 1000);
```

Phase 2 will move to event-driven (Neynar webhooks or Farcaster Hub subscription) but polling is fine for 50 interactions/day.

## $ZABAL tip wallet (Phase 2 - skip for Phase 1)

When Tier 2 ships (Phase 2 - July), bot needs a wallet to receive $ZABAL tips.

Pattern per ZAO OS Doc 343 (Agent Wallet Security):
- Use Privy agentic wallet with key quorum 2-of-3
- Bot signs tip-claim transactions
- Zaal co-signs treasury sweeps (hourly cron from tip wallet to treasury)
- TEE-backed, never exposes private key

Phase 1 skips this entirely - no money flow yet.

## Monitoring + alerting

| Signal | Threshold | Action |
|---|---|---|
| Daily Anthropic spend > $10 | Auto-pause bot, post status cast | Email Zaal |
| Per-FID rate limit hit | Silent (don't reply) | Log only |
| HAATZ failure rate > 10% over 1h | Fallback to Neynar more aggressively | Slack alert |
| Bot down for >5 min | Auto-restart via systemd | PagerDuty / Slack |
| Knowledge base fetch fails 3x in a row | Use last cached version | Slack alert |
| Memory > 80% | Restart process | Email |

Use Sentry (free tier) for error tracking + a simple uptime check (Better Uptime or self-hosted Cron) for liveness.

## Character file - production version

```jsonc
// bot/zabal-bot.character.json
{
  "name": "ZABAL Bot",
  "username": "zabalbot",
  "modelProvider": "anthropic",
  "settings": {
    "model": "claude-sonnet-4-6",
    "maxOutputTokens": 400,
    "temperature": 0.7
  },
  "plugins": [
    "@elizaos/plugin-farcaster",     // listens + replies
    "@elizaos/plugin-anthropic"      // reasoning
  ],
  "system": "You are the ZABAL Bot - a guide for builders in The ZAO ecosystem. Voice: warm, builder-energy, drop articles when terse helps. RULES: (1) NO emojis. (2) NO em-dashes - use hyphens. (3) NO crypto/web3/onchain language in public copy - use 'digital creators.' (4) Use '100+' for ZAO size, never specific. (5) Brand spellings exact: ZABAL Gamez, The ZAO, WaveWarZ, COC Concertz, BetterCallZaal, Magnetiq, $ZABAL. (6) Tier 1 reply format: 1 paragraph + 1 link. Always end with a link or next action. (7) If you don't know something, say 'I don't have that locked - dm @bettercallzaal for the canonical answer.' Do not fabricate dates, numbers, names, or sponsor amounts. (8) Knowledge base loaded as system context below.",
  "bio": [
    "ZABAL Bot is the in-channel guide for ZABAL Gamez builders.",
    "Free Tier 1: 1 paragraph + 1 link per reply.",
    "Built on ElizaOS. Operated by The ZAO."
  ],
  "lore": [
    "Lives in /zabal channel + zabalgamez.com",
    "Built on ElizaOS using Claude Sonnet",
    "Knows the ecosystem: ZAO, $ZABAL, Empire Builder, WaveWarZ, Hats, Bonfire, EAS, Magnetiq",
    "Refers to humans by Farcaster handle",
    "Reads HAATZ for Farcaster context, never claims it's Neynar"
  ],
  "topics": [
    "ZABAL Gamez", "ZAO ecosystem", "Farcaster building",
    "Empire Builder integration", "Hats Protocol", "vibe-coding harness selection",
    "Magnetiq portal", "WaveWarZ Finals mechanic", "Bonfire knowledge graph"
  ],
  "style": {
    "all": [
      "Direct, builder-energy",
      "Drop articles when terse helps",
      "No emojis. No em-dashes (use hyphens)",
      "Reply in the thread, never DM unless Tier 2"
    ],
    "chat": [
      "Open with the answer, not 'great question!'",
      "Always end with 1 link OR 1 next action",
      "If recommending a profile, link to /p?handle=X on zabalgamez.com",
      "If recommending a project, link to zabalgamez.com/projects",
      "If recommending a workshop, link to zabalgamez.com/info#workshops"
    ]
  }
}
```

## First-week iteration plan (post-deploy)

| Day post-launch | What we measure | Action |
|---|---|---|
| 1 | First 10 mentions: how many got useful replies? | Tune system prompt for any fabrication or off-tone |
| 2-3 | Time-to-reply: <60s p95? | If polling too slow, drop interval to 30s |
| 4-5 | Anthropic spend pacing - are we under budget? | If over, tighten max tokens or sampling |
| 6 | First "I want to tip" requests (Phase 2 demand) | Note FIDs - validate $ZABAL tip demand exists |
| 7 | Public reply quality review | Pick 3 best + 3 worst replies, refine character file |

## Decisions still open (need Zaal input before Phase 1 codes)

1. **Bot Farcaster handle.** `@zabalbot` is my default but I'd rather you pick. Other options: `@zg-bot`, `@gameschan`, `@zabal-helper`.

2. **VPS choice.** Hetzner CX22 (Falkenstein DC) is my recommendation. OK with Hetzner or prefer DigitalOcean / Railway?

3. **Path A vs Path B for bot signup.** Path A (Hypersnap, free, sovereign) needs Cassie's signup flow confirmed. Path B (Neynar) costs $5-10 + binds to Neynar's signer service. Which?

4. **Anthropic API key ownership.** Use your existing Anthropic Console (zaalp99@gmail.com)? Or create a separate `bot@thezao.com` account so spend is isolated?

5. **Bot announcement cast.** When the bot is ready, who casts the announcement - you or the bot's own first cast? My vote: you cast it ("hey /zabal - meet @zabalbot, your in-channel guide. Tag it for help on builds + ecosystem context. Free Tier 1, paid Tier 2 coming in July.") and the bot replies to your cast with its character introduction.

## Reference docs

- Doc 770 (this doc) - the spec
- Doc 2027 (farcaster) - HAATZ integration patterns
- Doc 343 (security) - agent wallet via Privy key quorum (Phase 2)
- Doc 750 - Builder OAuth flow (bot reads builder GitHub once Phase 2 of Doc 750 ships)
- ElizaOS docs - https://elizaos.ai
- HAATZ live: https://haatz.quilibrium.com/v2/farcaster/user/bulk?fids=19640

## What I need from Zaal to start Phase 1

Minimal list:

1. Decision on the 5 open items above
2. Anthropic API key (or new account creation)
3. SSH key to add to the Hetzner VPS once provisioned
4. The bot's Farcaster signup completed (Path A or B chosen)
5. Confirmation that the announce cast goes out from your handle

Once those 5 land, dev work starts. ~5-7 days to mid-June Tier 1 live.

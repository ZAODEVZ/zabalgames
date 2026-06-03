# Farcaster + Mini App ideas backlog

Captured 2026-06-03 from a deep audit of the ZAO OS research library
(`github.com/bettercallzaal/ZAOOS`, the big monorepo) + the official Farcaster Mini
App docs + ATown/Emerge's "Going Viral" bootcamp session. ZABAL Gamez can't normally
reach that repo, so the useful bits are distilled here.

**Filters applied:** zero-build (no npm, edge functions only), brand rules (no crypto
jargon in public copy, no emojis/em dashes), and "fits a 3-month build-a-thon" (not the
zabal.art voting hub, which several source ideas were really about).

Effort tags: **[S]** small / pure zero-build - **[M]** edge function + Upstash KV -
**[L]** needs a build step, npm, or bigger lift. **[brand?]** = watch the no-crypto-jargon rule.

## Already shipped / in-flight (baseline)
- `@zaal` on every cast, X handle (`@bettercallzaal`), verified cast tracking (cancel != count), cleaner cast copy - PR #98.
- Per-page/dynamic share images - deferred, tracked in `docs/social-share-images.md`.
- Channel decision: share-casts stay in **/zabal** (our channel), not /zao.

---

## A. Mini App technical correctness & hardening
| Idea | Apply to ZABAL Gamez | Effort | Source (ZAO OS) |
|------|----------------------|--------|--------|
| Timeout-guard `sdk.context` / `ready()` (`Promise.race(…, 2s)`) | We have 0 guards; a slow client can hang the splash | S | research/farcaster/591a-sdk-auth-flows |
| `sdk.back.enableWebNavigation()` on init | Mobile hardware back-button traps users in nested pages | S | research/farcaster/250-…-llms-txt-2026 |
| `sdk.haptics.impactOccurred()` on Join/share/leaderboard | Tactile feedback lifts mobile engagement | S | research/farcaster/250 |
| Sign-verify webhook events (`verifyAppKeyWithNeynar` / JFS sig) | `/api/webhook` is unsigned - notification tokens are spoofable | M | research/farcaster/591d-production-pitfalls |
| Per-route `fc:miniapp` embed for every shareable URL | Deep-link a shared `/recaps` or `/live` straight into that view | S | research/farcaster/710-…-deeplinking |
| Manifest health-check (icon 1024px, sig valid, `ready()` <2.5s, no X-Frame-Options) | A `/api/health` or CI smoke test catches the silent "app hidden in client" traps | M | research/farcaster/591c, 575-splash-best-practices |
| Capability detection before calling new SDK actions | Our SDK pin is `0.1.x`; guard back/haptics so they no-op on old clients | S | research/farcaster/250 |

## B. Sharing / virality / growth
| Idea | Apply | Effort | Source |
|------|-------|--------|--------|
| Question-framed cast variant (replies score 10x vs recasts 3x) | Add a "what would you build…?" variant to the top-CTA rotation | S | research/farcaster/733, community/577 |
| Share-count toast after a cast | "Shared into /zabal" feedback loop lifts repeat sharing | S | research/farcaster/733 |
| Cast as a reply to a pinned /zabal cast | Reply chains stay on screen + replies weight 10x | M | research/farcaster/081-social-graph-sharing |
| "Share your takeaways" prefilled cast at workshop end | Turns attendees into promoters by default; pairs with /recaps | S | research/inspiration/2026-04-02.md |
| Mention-friends interpolation (Neynar best-friends) | `@friend1 @friend2` in share text - personalized, higher reply rate | L | research/farcaster/081, 733 |
| First-30-min velocity: post launches at a fixed peak hour + seed reactions | Fire the Cassie/newsletter cast at peak + nudge the group chat | S (process) | research/farcaster/733 |
| Open-loop "gratitude-first" thread format | For launch/recap threads - momentum hook, not a transactional ask | S (copy) | research/community/577 |

## C. Retention / gamification / leaderboard
| Idea | Apply | Effort | Source |
|------|-------|--------|--------|
| `addApp()` prompt right after a one-tap Join | Currently only on 2 buttons; post-join is the documented +add moment | S | research/farcaster/733, 250 |
| Streak badge (`[Nw streak]`) + "at risk" state | #1 documented retention lever; flame UI on leaderboard rows | M | src/components/streaks/StreakBadge.tsx |
| Role/tier leaderboard (Emerging / Established / Featured) | Newcomers see a realistic path, not one intimidating list | M | research/inspiration/cross-pollinations/2026-04-03.md |
| Rank-delta arrows (up/down vs last week) | Urgency to come back | M | research/farcaster/733 |
| Stat cards (total builders / top / sessions) | Summary boxes up top of leaderboard | S | src/components/respect/StatsBar.tsx |
| Workshop countdown + "remind me" notification | 3wk/1wk/1d countdown reusing our notify + addApp plumbing | M | research/inspiration/2026-04-06.md |
| Milestone badges (1/5/10 sessions or casts) | Visible progression; reveal-on-earn for surprise | M | research/farcaster/733 |
| Live presence/"here now" counter on /live | Upstash counter ("47 tuned in") next to share - social proof, no payments | M | api/activity.mjs + src/app/live |
| Builder presence decay (active/idle/offline) | Extend /api/activity with TTL-based status | M | bot/src/zoe/agents/decay.ts |

## D. Lightweight automation / agents (zero-build edge)
| Idea | Apply | Effort | Source |
|------|-------|--------|--------|
| Daily cron-cast of "what's on today" into /zabal | One Vercel cron + one publish call | M | research/farcaster/733 + scripts/first-cast.ts |
| KV-sentinel idempotency (`SET key 1 EX 86400 NX`) | Prevents double-fire on cold-start cron retries | S | bot/src/zoe/scheduler.ts |
| Neynar webhook -> auto-reply to @zabal mentions | Agent-in-timeline replies with the day's session + link (one FID) | M | research/agents/673-zoe-bonfires-dialog |
| Leaderboard snapshot + social-draft generator | Hourly diff -> Claude drafts "X now leads" for review | M | api/leaderboard.mjs + research/agents/602 |
| Leaderboard anomaly flag (spike detection) | Diff KV snapshots, log suspicious jumps for admin review | M | research/agents/599-…-leaderboard |
| Stale-builder re-engagement nudge | Decayed users get a gentle mindful/cast nudge | M | bot/src/zoe/agents/decay.ts |

## E. Content / newsletter / recap / workshop format
| Idea | Apply | Effort | Source |
|------|-------|--------|--------|
| Recap-drafting skill/MCP over Bonfire | "What was said about X workshop?" -> draft recap md for add-daily.mjs | M | mcp/hindsight-mcp-server, bot/src/zoe/agents/newsletter.ts |
| Weekly newsletter auto-draft from daily-updates.json | Sunday cron drafts 4-6 bullets for review (we publish on Paragraph) | M | bot/src/zoe/agents/newsletter.ts |
| Daily mindful-card curator from Bonfire moments | Mine a standout moment -> one <=120-char card for /today | M | bot/src/zoe/agents/newsletter.ts |
| Workshop recap as a Snap (speaker + replay button) | Discoverable preview that funnels to the mini app; ties to kmac's Snaps workshop | L | research/farcaster/295-farcaster-snaps |
| Cross-platform recap clips (Shorts/TikTok) | Extend reach off-Farcaster with #ZABAL | L | research/inspiration/2026-04-02.md |
| Workshop transcript ingest -> Bonfire (entities/topics) | After a recording drops, auto-tag + post for the graph | M | scripts/bonfire-ingest/ |

## F. Reusable components/patterns to port from ZAO OS code
All vanilla-portable (the source is React/TS; copy the logic, not the deps):
- **timeAgo / formatTimeRemaining** util - `src/lib/format/timeAgo.ts` - for schedule + /live countdowns. [S]
- **Share modal** (Warpcast compose deeplinks + optional QR) - `src/components/shared/ShareModal.tsx`. [S]
- **Bottom sheet / modal** (drag-to-close) - `src/components/ui/BottomSheet.tsx`. [S]
- **community.config single source of truth** - `community.config.ts` -> a `/data/config.json` for titles/colors/admin FIDs/endpoints. [S]
- **Poll-or-SSE live updates** for leaderboard/live (EventSource or 5-10s fetch). [M]

## G. Ecosystem integrations (keep light - we already feature some)
Empire Builder (yerbearserker), Magnetiq (collectible + Proof-of-Meet attendance badges),
Bonfire (live activity), SongJam ($ZABAL leaderboard), Hats (roles). Add only as small
cards/widgets if/when they earn their place - avoid turning the focused site into a portal.

## Parked (interesting but break zero-build or fight the brand)
On-chain sample/asset marketplace (USDC), Respect-staking / prediction markets, artist
tokenization, EAS proof-of-build mint, Snapshot "community choice" vote, viem multicall
leaderboards, XMTP cohort channels, x402 pay-per-call. Revisit only with a clear reason -
most need npm/a build and lean into crypto mechanics the public copy avoids.

---

## Do-next picks (highest leverage / lowest effort)
1. **Tech hardening** - `sdk.back`, `sdk.context` timeout, `sdk.haptics` (this branch).
2. **`addApp()` after Join** + **question-cast variant** - cheap retention + reach.
3. **"Share your takeaways" card** on /recaps - turns the recap flow into distribution.
4. **Live presence counter** on /live - social proof, reuses /api/activity.
5. **Daily cron-cast** of today's session into /zabal (with KV-sentinel idempotency).

> Re-clone for full context: `git clone --depth 1 https://github.com/bettercallzaal/ZAOOS`
> then read the source paths above (numbers are stable folder prefixes under `research/`).

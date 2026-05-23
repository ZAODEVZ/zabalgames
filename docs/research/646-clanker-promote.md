---
topic: business
type: guide
status: research-complete
last-validated: 2026-05-21
original-query: "How can ZABAL Games v0 integrate Clanker tokens and Empire Builder for player tokens and viewer signals? (reconstructed)"
related-docs: 630, 628, 626, 584, 583, 582, 361, 324, 258, 631
tier: STANDARD
---

# 646 - Clanker + Empire Builder for ZABAL Games Promote Window

> **Goal:** Design the optional "stream tied to a token" mechanic for ZABAL Games v0. Players who opt in can launch a Clanker token during their build, viewers trade it during the promote window, the token becomes a parallel viewer-signal next to the DAO 1-person-1-vote that decides actual placements. Token survives the Games as ongoing identity/revenue for the player. Empire Builder is the wrapping layer that turns a player's Clanker token into an empire with leaderboards + boosters tied to ZABAL.

> **Status:** Spec proposal for v0 optional mechanic. NOT yet locked - this doc surfaces how it COULD work to inform the user-decision on whether to include it in v0 or defer to v1.

---

## Key Decisions / Recommendations

| Decision | Recommendation |
|----------|----------------|
| **Inclusion in v0** | INCLUDE as fully opt-in mechanic. Default behaviour = no token. Players who want "stream tied to token" can mint via Clanker during their build window. ZABAL Games doesn't subsidize, doesn't mandate, doesn't gate placements on it. |
| **Launch vehicle** | USE Clanker (not Zora). Per existing Empire Builder docs (Doc 584), top empires (glonkybot rank 9.34) already deploy via Clanker. ZABAL itself launched via Clanker 2026-01-01. Native Farcaster fit. v4 charges 0.2% fee in WETH (vs Zora's 50% trade + 50% LP heavy model). |
| **Empire Builder wrap** | OPTIONAL. A player's Clanker token can be wrapped as a mini-empire via Empire Builder if they want booster mechanics + leaderboards. Player decides post-Games whether to commit. For v0, ZAO doesn't need to wrap every player token. |
| **Fee flow to player** | 100% creator-collected fees from Clanker LP go to the player wallet (Farcaster v4 update transferred control back). Player can claim or burn at their discretion. This is ongoing trade-fee dividend forever. |
| **Vote relationship** | NONE. Per Doc 630 lock: DAO 1-person-1-vote decides winners. Token volume is parallel signal only, displayed alongside builds for narrative/discovery but does not influence placement. |
| **ZAO promote phase boost** | If a player launches a token, ZAO accounts (BCZ, /zao channel, COC Concertz) amplify it during the promote window same as any other build artifact. No extra promotion budget. |
| **Anti-whale-buy protection** | Since token volume doesn't influence placement, whale-buy is just free liquidity for player. No protective mechanism needed. |
| **Token decay post-Games** | Player choice. Clanker LP is locked until 2100 (90 years), so the token persists. If player abandons it, it dies naturally. If player keeps marketing it, ongoing trade-fee dividend continues. |
| **ZABAL Empire booster slot** | RECOMMENDED post-v0 ask: Adrian adds player Clanker tokens as 2-3x boosters in the ZABAL empire. Players' tokens benefit from the network effect Doc 584 documents (glonkybot's 17-ERC20-booster stack). Decided AFTER v0 cohort ships, not committed upfront. |
| **Cohort coin alternative** | SKIP for v0. A single "ZABAL Games v0 Cohort" Clanker token (where 8 players share creator-of-record) sounds elegant but complicates fee splits + identity. Each player launches their own (if at all) is cleaner. |

---

## Part 1 - The Stack: Clanker + Empire Builder

### Clanker (the launcher)

Clanker is an AI-agent token launcher native to Farcaster. As of 2026 Q1:
- Acquired by Farcaster (announced 2025 Q4)
- v4 model: 0.2% trading fee paid in WETH
- 100% of creator-collected pool fees claimable by token creator
- LP locked on Uniswap V3 until year 2100
- Token launched by tagging `@clanker` in a Farcaster cast with name + ticker (image optional)
- Created ~13,000 tokens/day during peak
- Weekly protocol fees hit $8M in February 2026
- Daily trading volume occasionally above $300M
- ZABAL itself was launched via Clanker (2026-01-01)

Key implication for players: launching costs effectively zero from the player side. The mint happens via Farcaster cast, the LP is auto-paired with WETH, fees flow to player wallet forever.

### Empire Builder (the wrapper)

Empire Builder turns ANY Clanker-launched (or any ERC-20) token into an "empire" with:
- 7+ leaderboards per token (holders, Farcaster-only holders, custom slots)
- Booster system (5x-26x multipliers based on holding other empire tokens, NFTs, Quotient reputation scores)
- Distribute API for bulk rewards to top holders
- Burn API for supply reduction
- Public read API (no auth) for displaying empire state in any app

Per Doc 584 (live 2026-05-01):
- Top 20 empires sorted by total_distributed: ArtBaby ($10,797), Socialized Creators Union ($5,349), Keep Pushing ($4,066), **glonkybot ($4,061, rank 9.34 - highest computed rank)**, BizarreBeasts ($3,854), etc.
- ZABAL is NOT in top 20 - ~$320 lifetime distributed
- glonkybot's pattern: 17 ERC20 boosters at 5x for CLANKER, ARTBABY, PUSH, BB, MTDV, hmbt, GMYerb - network-effect stacking
- ZABAL currently has 4 ERC20 boosters (LOANZ, zaal, SANG, ZAAL) + 1 QUOTIENT

Doc 584 specifically recommended adding CLANKER, $GLANKER, ARTBABY, BB as 3-5x boosters to ZABAL to ride the network effect. ZABAL Games player tokens would be a natural extension of that pattern.

### How they fit together for ZABAL Games

```
[Player decides to launch a token during build window]
            |
            v
[Tags @clanker in /zabalgames or own Farcaster channel]
            |
            v
[Clanker auto-mints ERC-20 on Base, pairs WETH, locks LP]
            |
            v
[Token exists. Tradeable on Uniswap V3 immediately.]
            |
            +------> [Optional: Empire Builder wrap]
            |              |
            |              v
            |       [Creates empire entry, adds to leaderboards]
            |              |
            |              v
            |       [ZABAL holders can stake the player token for booster]
            |       [Cross-empire dynamics emerge]
            |
            +------> [Viewers trade during promote window]
                           |
                           v
                    [Volume = parallel signal next to DAO vote]
                           |
                           v
                    [Player earns ongoing trade-fee dividend forever]
```

Token launch cost to player: zero (just a cast). Token launch cost to ZAO: zero (no subsidy needed). Empire Builder wrap: free + permissionless if player wants it.

---

## Part 2 - The ZABAL Games Promote-Window Use Case

### What the player does (if opted in)

| When | Action |
|------|--------|
| Onboarding call (T-3 days) | Player decides yes/no on token mechanic. Both are valid. |
| Build window (T+0 to T+24h) | Build the project. Token doesn't exist yet. |
| Ship moment (~T+24h) | Player casts `@clanker launch [Name] $[TICKER] - my ZABAL Games v0 build` in /zabalgames. Clanker mints. Token live on Uniswap V3. |
| Promote window (T+24h to T+48h) | Player casts about their build, includes token contract address. Viewers can buy/sell. |
| Voting window (T+48h to T+72h) | Token keeps trading. Volume displayed on /zabalgames hub alongside DAO vote tally. Volume is NOT vote. |
| Reveal stream (T+72h) | Top 3 by DAO vote announced (decides prize). "Most loved by the market" rankings shown as side narrative. |
| After Games (forever) | Player owns the token + LP fee stream. Token's life is now player's responsibility. |

### What the viewer does

| When | Action |
|------|--------|
| Discover during build window | Watch streams + read casts. Tokens not yet launched. |
| Ship-moment | See `@clanker launch...` casts fire in /zabalgames. Each player who chose to launch has their cast. |
| Buy in during promote window | Click contract address -> open Uniswap-via-Farcaster-wallet -> buy a few $$ worth. The economic act IS the vote-with-money. |
| Display | /zabalgames hub shows running volume per build. "Build #3 has $480 of viewer money in it. Build #7 has $12. Tells you something." |
| DAO members see this when voting | Decision still 1-person-1-vote but they have extra signal: did viewers actually back this with money? |

### What ZAO does

| When | Action |
|------|--------|
| Pre-event | Make sure /zabalgames channel exists. That's it. |
| During Games | Cross-cast each player's launch cast from ZAO accounts (same amplification we already promised in win-win-win section). |
| After | Encourage Adrian to add top-performing player tokens as ZABAL Empire boosters at 2-3x. This is Doc 584's strategy already - just adds new tokens to the existing booster stack. |

---

## Part 3 - The "Stream Tied to Token" Pattern (User's Specific Interest)

Player streams their build live on Twitch (per locked visibility Mode 1). At ship-moment they mint a token. The stream and the token are now linked - the token IS the tokenized provenance of what got built on that stream.

### Why this is novel

Existing creator-coin patterns (Zora content coins, Friend.tech) tokenize a person or a post. The ZABAL Games pattern tokenizes a **build sprint** - a defined 24h creative window with a specific output.

This is closer to ETHDenver hackathon ribbons or buildspace cohort NFTs, but with tradeable liquidity and ongoing fee dividends.

### Properties

| Property | Detail |
|----------|--------|
| Provenance | Token name + cast cite the build URL + GitHub repo. Anyone can verify the link |
| Liquidity | Uniswap V3 pair, locked LP until 2100 - tradeable forever |
| Creator stake | 100% of LP fees flow to player wallet permanently |
| Identity | Permanent Farcaster-cast record of "I shipped at ZABAL Games v0" |
| Composability | Empire Builder wrap optional - can become a mini-empire |
| Stream-to-token link | Stream archive + token launch cast share a timestamp window - on-chain proof of when the build happened |

### Risks specific to this pattern

| Risk | Mitigation |
|------|------------|
| Player launches token but build never finished | Submission bar (live URL + repo + demo + ship cast) is independent of token. No token = no problem. Token without working build = social punishment via DAO vote going low |
| Token used as wash-trading vehicle to fake "interest" | Doesn't affect placement (signal only), so motive is weak |
| Player abandons token, holders get rugged feel | Player owns LP claims, can choose to burn fees instead. Norm to establish: "post-Games tokens are commemorative, not investment products" |
| Player who can't afford gas to deploy | Clanker via Farcaster cast costs effectively zero. ZAO doesn't need to subsidize anything |
| Player who doesn't WANT a permanent token | Default = no token. Opt-in only |
| Regulatory concern (US securities-like behavior) | ZAO doesn't promote tokens as investments. Player launches their own. ZAO just amplifies existing Farcaster casts. Standard creator-coin posture |

---

## Part 4 - Should Each Player Mint? (Format Question)

User's lock from earlier today: "lets keep it as an idea for now. but lets have it in some way where someone could stream tied to that token."

Reading that as: NOT required, NOT default-on, but the OPTION exists. Three sub-options for how the option surfaces in the spec:

| Sub-option | Visibility | Pros | Cons |
|------------|-----------|------|------|
| **Mentioned in onboarding only** | Private to cohort | No public pressure. Players who care opt in via the call. Quiet | Less external narrative. Viewers don't know to expect tokens |
| **Mentioned on public page as optional** | Public | Sets expectation. Some applicants self-select FOR the token mechanic | Adds complexity to public-facing copy. Some applicants opt out because of it |
| **Hidden until ship moment** | Surprise | Cleanest narrative. Players who launch tokens become the "spicy variant" of the cohort organically | Players who'd want this mechanic don't know it's possible until too late to plan |

Recommend: **mentioned in onboarding only** for v0. Public page stays clean. Players hear about the optional token-launch path during the T-3 onboarding call. Those who want it have 3 days to plan. Those who don't lose nothing.

---

## Part 5 - The Cohort-Coin Alternative (Why Skip)

We could have ONE token: "ZABAL Games v0" - shared across all 8 finishers. Pros:
- Single narrative ("the cohort coin")
- Combined liquidity = better trading
- All players benefit from any single player's marketing

Cons (why skip):
- Creator-of-record ambiguity: who owns the Clanker token? ZAO multisig? Zaal? One player as steward?
- Fee split complexity: 8 wallets sharing LP fees forever requires a splitter contract
- Token identity baggage: if any one player does something embarrassing, the whole cohort-coin's reputation gets hit
- Doesn't satisfy "stream tied to token" - it ties to the cohort, not to individual streams

If players want a shared coin, they can do it organically after v0. Multiple v0 alumni could spin up a "ZABAL Games v0 Alumni" Clanker token themselves and share LP. ZAO doesn't need to mediate.

---

## Part 6 - Post-Games Token Lifecycle

Empire Builder side per Doc 584:
- glonkybot is rank 9.34 (highest) by holding + cross-boosting 17 ERC20 tokens from other empires
- ZABAL needs more cross-empire booster relationships to climb
- Player Clanker tokens from ZABAL Games are natural additions to ZABAL's booster stack

**Proposed post-Games flow:**

1. T+72h: reveal stream concludes, USDC + collectibles distributed
2. T+72h to T+10 days: top-trading-volume player tokens identified
3. ~T+10 days: Zaal DMs Adrian: "add player_token_X, player_token_Y as 2-3x boosters in ZABAL Empire"
4. Adrian configures (~30 min work on his side)
5. ZABAL holders + player_token_X holders now stake-cross-reward each other
6. This compounds ZABAL's network effect per Doc 584 strategy

**Outcome:** Players who launched tokens become ongoing economic participants in ZABAL Empire long after Games end. v1 Games invitees can study v0 player tokens as case studies.

This is downstream of v0 - not a v0 commitment. But surfaced here as the natural compound.

---

## Part 7 - Implementation Costs

| Component | Cost to ZAO | Cost to Player |
|-----------|------------|----------------|
| Clanker token launch | $0 | $0 (just a cast) |
| LP seed | $0 | $0 (Clanker pairs WETH automatically from buyer's first purchase) |
| Empire Builder wrap | $0 | $0 (permissionless, can do via clanker.world or empirebuilder.world UI) |
| Display volume on /zabalgames hub | Small dev time (1-2 hours - Empire Builder API or Uniswap subgraph query) | $0 |
| Booster addition to ZABAL post-Games | $0 (Adrian config) | $0 |
| **TOTAL incremental cost for token mechanic** | **~2 hours dev time + 1 DM to Adrian** | **$0** |

No new line item in ZAO budget. The mechanic adds 2 hours of dev work + an existing-relationship favor ask post-Games. Negligible compared to the optionality it creates.

---

## Part 8 - Risks + Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Zero players opt in | Medium | Low (signal mechanic disappears, everything else still works) | Acceptable - it's optional, v1 can sweeten the offer |
| All 8 opt in, then 1 player's token rugs | Low | Medium (reputational ding on the cohort) | Make clear in onboarding: each player owns their token independently; cohort is not collectively responsible |
| Whale buys one player's token to manufacture "market signal" | Medium | Low (signal isn't placement) | Display absolute volume + buyer count separately - 1 whale buy vs 100 small buyers is visible |
| Player launches but build is a meme/joke | Medium | Low | DAO voters can downvote. Token still tradeable but vote determines placement |
| Player can't claim LP fees because wallet got compromised | Very low | Low (their personal problem) | Standard wallet hygiene, not ZAO's responsibility |
| Coordinated cohort-pump for fun | Medium | Negligible (it's optional flavor, not a placement vector) | Display the data, let viewers form their own conclusions |
| US regulatory grey zone | Low-medium | Medium (already exists for ZABAL itself) | ZAO doesn't promote tokens as investments. Players launch their own. Existing posture applies |
| Player tokens become dead memcoins post-Games | High | Low (they're commemorative anyway) | Frame as "permanent commemorative trade-fee artifact" not "investment vehicle" |

---

## Part 9 - Open Questions for Future Iteration

| Question | Where it gets answered |
|----------|----------------------|
| Does any v0 player actually opt in? | After v0 ships - empirical |
| Do player tokens drive viewer participation up or distract? | Post-v0 retrospective |
| Should v1 default-on the mechanic? | Decided at v0 retro based on v0 opt-in rate |
| Should ZAO launch a meta-token (ZABAL Games as an empire of empires)? | v1+ design discussion |
| Should top-3 placement come with auto-add to ZABAL booster slots? | Adrian's call - post-v0 |
| Can players coordinate a Hypersub subscription tied to their token holders? | v1+ - composability play |

---

## Also See

- [Doc 630 - ZABAL Games v0 spec](../../events/630-zabal-games-claude-code-hackathon-v0/) - The Games this mechanic plugs into
- [Doc 628 - Web3 Streaming + ZABAL Empire Bridge](../628-web3-streaming-zabal-empire-bridge/) - Where creator coins first surfaced
- [Doc 626 - Empire Builder + ZABAL POIDH airdrop](../626-empire-builder-zabal-poidh-airdrop/) - apiLeaderboards pattern + $ZABAL Empire mechanics
- [Doc 584 - Empire Builder Farcaster Creator Playbooks](../584-empire-builder-farcaster-creator-playbooks/) - Network-effect booster stacking strategy
- [Doc 583 - Empire Builder ZAO OS Integration Ideas](../583-empire-builder-zao-os-integration-ideas/) - 15 integration ideas surface
- [Doc 582 - Empire Builder V3 Live Launch](../582-empire-builder-v3-live-launch/) - API surface + ZABAL state
- [Doc 361 - Empire Builder v3 Deep Dive](../361-empire-builder-deep-dive-v3-integration/) - Multiplier mechanics
- [Doc 324 - ZABAL/SANG Wallet Agent Tokenomics](../324-zabal-sang-wallet-agent-tokenomics/) - Token + agent layer
- [Doc 258 - ZABAL/SANG Buyback](../258-zabal-sang-buyback/) - Treasury patterns
- [Doc 631 - POIDH x ZABAL x Sentinel convergence](../631-poidh-zabal-sentinel-convergence/) - Adjacent attribution play

---

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Decision: include opt-in token mechanic in v0 onboarding? | @Zaal | Decision | 2026-05-13 |
| If yes: update Doc 630 onboarding agenda Part 4 with token-mechanic explainer slot (~10 min) | @Zaal | Doc edit | 2026-05-14 |
| If yes: update PROMPT_CONTEXT.md with Clanker + Empire Builder section so player Claude Code sessions know the mechanic exists | @Zaal | Doc edit | 2026-05-14 |
| Spike: /zabalgames hub displays per-build volume via Empire Builder API or Uniswap subgraph | @Zaal | PR | When mini-app builds |
| Post-v0: identify top-trading player tokens, DM Adrian to add as ZABAL booster slots | @Zaal | DM | T+10 days after v0 |
| Pressure-test: would you DM 1-2 Farcaster vibe-coders + ask if "I can launch a token tied to my build during this" makes them MORE or LESS likely to apply? | @Zaal | Outreach | This week |
| Consider: is there a v1 evolution where ZABAL Games launches its OWN Clanker token + opens trading to the audience BEFORE the cohort is announced? | @Zaal | Brainstorm | v1 planning |

---

## Sources

### Existing ZAO research lib

- Doc 584 (cross-linked above) - Empire Builder Farcaster Creator Playbooks - the network-effect booster strategy + live top-20 data
- Doc 582 - Empire Builder V3 live launch - API surface + ZABAL state
- Doc 583 - Empire Builder ZAO OS integration ideas - 15 concepts
- Doc 361, 324, 258 - earlier Empire Builder + ZABAL tokenomics docs
- Doc 630 - ZABAL Games v0 spec (this mechanic plugs into Part 6 Prize Structure + Part 5 Visibility Modes)

### External - Clanker

- [Clanker Documentation - Creator Rewards & Fees](https://clanker.gitbook.io/clanker-documentation/general/creator-rewards-and-fees) - Official creator fee docs. Verified 2026-05-12
- [Clanker World homepage](https://www.clanker.world/) - Live launcher. Verified 2026-05-12
- [Clanker v4: A New Customization Suite for Token Creators - Bankless](https://www.bankless.com/read/clanker-v4-token-creator) - v4 mechanics + customization. Verified 2026-05-12
- [QuickNode Builder Guide - Clanker World by Farcaster](https://www.quicknode.com/builders-guide/tools/clanker-world-by-farcaster) - Developer reference. Verified 2026-05-12

### External - Acquisition + 2026 state

- [The Defiant - CLANKER Jumps 350% After Farcaster Acquires](https://thedefiant.io/news/nfts-and-web3/farcaster-acquires-clanker-tokenbot) - Acquisition announcement. Verified 2026-05-12
- [Phemex News - Clanker Joins Farcaster, Redirects Fees](https://phemex.com/news/article/clanker-integrates-with-farcaster-redirects-fees-to-clanker-token-purchases-29437) - Fee redirection + buyback mechanic. Verified 2026-05-12
- [KuCoin - CLANKER Weekly Protocol Fees Hit $8M](https://www.kucoin.com/news/articles/clanker-surging-activity-in-base-ecosystem-drives-weekly-protocol-fees-to-record-8m-high) - Volume + fee data. Verified 2026-05-12
- [MEXC News - Clanker launches ecosystem fund](https://www.mexc.com/news/1003198) - Ecosystem fee-recycling. Verified 2026-05-12
- [Crypto.news - Clanker ecosystem fund](https://crypto.news/clanker-launches-ecosystem-fund-to-recycle-fees-into-creators-and-community/) - Fund mechanics. Verified 2026-05-12
- [Messari - Tokenbot Clanker Price Research](https://messari.io/project/tokenbot-clanker) - Token metrics. Verified 2026-05-12
- [Bitget News - Clanker joins Farcaster ecosystem](https://www.bitget.com/news/detail/12560605028209) - Fee buyback strategy. Verified 2026-05-12
- [Gate Wiki - What is Clanker](https://www.gate.com/crypto-wiki/article/what-is-clanker-and-how-does-it-revolutionize-token-creation-on-base) - Reference primer. Verified 2026-05-12

### Community sentiment

- [BlockEden - Farcaster in 2025: The Protocol Paradox](https://blockeden.xyz/blog/2025/10/28/farcaster-in-2025-the-protocol-paradox/) - State of Farcaster + Clanker integration. Verified 2026-05-12
- [CCN - CLANKER Price Explodes 90%](https://www.ccn.com/analysis/crypto/ai-agent-tokenbot-clanker-price-rockets-analysis/) - Market sentiment. Verified 2026-05-12
- [Bankless - Making Memecoins in Seconds with AI on Farcaster](https://www.bankless.com/making-farcaster-memecoins-clanker) - Practical creator perspective. Verified 2026-05-12

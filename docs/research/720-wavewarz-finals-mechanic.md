---
topic: events
type: decision
status: research-complete
last-validated: 2026-05-23
related-docs: "701, 711, 723, 180, 646, 654"
original-query: "use wavewarz tech to decide the ZABAL Gamez Finals winner - build the integration into ZABAL Gamez over the next few months"
tier: STANDARD
---

# 720 - WaveWarZ as the ZABAL Gamez Finals Voting Mechanism

> **Goal:** Lock in the design for using WaveWarZ's prediction-market protocol to decide ZABAL Gamez Season 1 Finals winners. Replaces (or layers on top of) the original Respect 1-person-1-vote framing. Targets the Base-native agentic build of WaveWarZ that Sam is shipping and Arthur is reviewing - the same tech becomes the Finals judging surface AND a real-world stress test for WaveWarZ Base.

> **Note:** This is the canonical voting decision for the August Finals. Doc 701 Part 12 captures the high-level state; this doc holds the protocol design + integration sketch.

---

## Key Decisions

| # | Decision | Why |
|---|----------|-----|
| 1 | **WaveWarZ-Base settles the Finals placement** | Replaces (or sits above) the abstract Respect 1p1v vote with a real on-chain market signal. The protocol already exists, the smart contract already prices the outcome, the prize distribution is built-in. |
| 2 | **Each finalist build is a "battle entry"** | One battle per Finals round. The 24h vote window in Doc 701 becomes the WaveWarZ trade window. Build URL + 60s demo + repo are the "track" the market trades on. |
| 3 | **Respect-earning members get a baseline allocation** | Each eligible Respect-holder gets a small pre-funded position (e.g. equivalent of $1-2) so the community vote still has weight inside the market, not just outside-money speculators. |
| 4 | **1% artist cut goes to the builder** | Per WaveWarZ economics - 1% of trade volume to the artist. In the Finals, this is the builder. Provides real revenue beyond the $500 USDC pool. |
| 5 | **The losing-side pool partly feeds the winning-side pool** | Per WaveWarZ protocol. Means the prize-as-USDC structure can be augmented (or replaced) by the market settlement. |
| 6 | **Base, not Solana** | The agentic WaveWarZ-Base build (Sam + Arthur, Doc 711) is the surface. Base matches ZABAL Gamez' rails (Empire Builder, Hats, Bonfire, EAS, Coinflow all on Base). |
| 7 | **Autonomous judge agents (x402 paid) score build quality** | Per Doc 723d agentic patterns - judge agents read the deployed URL + the repo + the demo video, score against the rubric (does it work / is it ZAO-native / would I use this / shipped in 24h), get paid in x402 micropayments. Their scores become a "fundamental" the market trades on. |
| 8 | **Build the integration over June-July, dogfood on Finals in August** | Sam + Arthur ship the agentic Base contracts. The ZABAL Gamez team plugs them in as the Finals voting surface. The Finals BECOMES the V1 launch event for WaveWarZ-Base. |

---

## Why WaveWarZ tech for the Finals

**The original Doc 701 voting model:** "Respect-earning members vote 1-person-1-vote. NOT token-weighted. Mechanism: Snapshot or onchain, threshold N TBD." Clean but abstract. Real but lukewarm signal.

**The WaveWarZ model:** Open market. Wallets trade real money on which build wins. Volume + win rate = the placement. Smart contract settles atomically.

The shift gives you:
- **Real economic signal.** A wallet putting money on a build is a different commitment than a click. The market price aggregates more information than a poll.
- **Mass participation.** Anyone with a wallet can trade. Not just Respect-holders. Wider funnel = more eyes on the cohort.
- **Built-in revenue for builders.** 1% trade cut to the builder = ongoing income post-Finals, not just the $500 USDC.
- **A real stress test for WaveWarZ-Base.** The Finals are the perfect first event - controlled cohort, real participants, real incentives. Sam + Arthur ship and ZABAL Gamez is their first deployment.
- **Composability with ZAO rails.** Base-native + Empire Builder + Hats + EAS all stack cleanly.

The tradeoff: **token-weighted by definition.** A whale buying a position skews more than a small holder. The Respect baseline allocation (Decision #3) is the mitigation - every Respect-holder starts with a position, so the community has real (not just rhetorical) weight in the market.

---

## Three design options (and the pick)

### Option A - Pure market (highest WaveWarZ alignment)

WaveWarZ-Base alone decides. No Respect layer. Anyone with a Base wallet can trade on any finalist. Volume + win rate at T+72h = the placement. Smart contract distributes prize via settlement.

**Pros:** simplest. Most native to WaveWarZ. Fastest to ship.
**Cons:** "All 8 finalists win" framing erodes. Whale capture risk. Respect-holders feel sidelined - the soul of the ZAO governance gets bypassed.

### Option B - Hybrid (RECOMMENDED)

WaveWarZ-Base runs the market. Respect-holders get pre-funded positions (e.g. each gets the equivalent of $1-2 USDC of "shares" automatically dropped at T+0). They can buy more, sell, or hold. The market price at T+72h decides placement. Smart contract settles.

**Pros:** keeps WaveWarZ tech as the placement mechanism. Keeps Respect as the qualifier. Community has real market weight without being the only signal. Fits "build something the community would use" rubric naturally (Respect-holders are the community).
**Cons:** more contract work - need a "drop position to N addresses" call at T+0. Tooling for Respect-holder eligibility snapshot.

### Option C - Parallel signal (closest to Doc 701 + Doc 646)

WaveWarZ runs as a parallel viewer-signal during the promote window (just like the Clanker token mechanic in Doc 646). The DAO 1-person-1-vote still officially decides placement. WaveWarZ volume = optional flavor.

**Pros:** zero risk to the original placement mechanic. WaveWarZ-Base gets a real first-event without owning the decision.
**Cons:** doesn't satisfy the user's brief ("use the protocol to decide the winner"). Reduces WaveWarZ to a sidecar.

### Pick: **Option B**

Matches the user's brief (protocol decides), preserves Respect's role (qualifier + baseline), gives the market real signal, gives Respect real weight, gives WaveWarZ-Base a real launch.

---

## Integration sketch

### Pre-Finals (T-7 days)

1. **Snapshot Respect-eligible voter set.** Pull from ZAO Respect contract or Hats Protocol. Output: `address[]` of N voters (the curated set of ~30-80 long-tenure DAO members per Doc 701 Part 6).
2. **Mint finalist entries on WaveWarZ-Base.** Each of N finalists = one battle entry. Entry metadata: build URL, repo URL, demo video, 60s pitch, builder Farcaster handle + Base address.
3. **Pre-fund Respect-holder positions.** On the WaveWarZ-Base settlement contract, call `airdropPositions(voters[], $2 USDC per voter, split across N finalists)`. Each Respect-holder wakes up at T+0 with an equal $2 / N stake in each finalist (their "starter ballot"), free to redeploy.

### Finals window (T+0 to T+72h)

```
T+0    -  Finalist battles open on WaveWarZ-Base.
          Each finalist now has a tradable position pair (WIN / LOSS) per the
          WaveWarZ protocol. Respect-holders start with $2 each per finalist.
          Anyone else can buy in.

T+0..24h  BUILD WINDOW. Mentor embedded, finalists building. Market trades
          on the build *signal so far* (early demos, public commits, stream
          quality).

T+24h     SHIP DEADLINE. Live URL + repo + 60s demo + cast on /zabal.
          Judge agents (Decision #7) start running - they read each
          finalist's artifacts and emit scores via x402 micropayments to
          a public scores feed. Market trades on the scores + the builds.

T+24..48h  PROMOTE WINDOW. ZAO accounts amplify each finalist. Trading
          continues. Volume + position prices reflect both the market
          sentiment and the judge-agent scores.

T+48..72h  CONVICTION WINDOW. No new builds, just trading. Final 24h is
          where the market settles. Spreads tighten.

T+72h     SETTLEMENT. WaveWarZ-Base smart contract reads final volume +
          win rates per finalist. Distributes prize pool per protocol
          economics:
            - 1% of total volume -> each builder (artist cut)
            - Losing-pool partial split -> winning-pool
            - The $500 USDC pool maps to the prize-tier table (Doc 701
              Part 5) with positions resolved on-chain
            - Magnetiq commemorative collectible (Finisher) for every finalist
            - Magnetiq commemorative collectible (Champion) for top-3
          All on-chain in one settlement transaction.
```

### Post-Finals

- Each finalist keeps their WaveWarZ entry alive as a permanent battle. Trading continues, 1% cut keeps flowing to the builder.
- Judge-agent scores + market data become public training data for future judge agents.
- The whole flow becomes a documented WaveWarZ-Base case study.

---

## Tech delivery plan (June -> August, ~3 months)

### June (workshop month)
- Sam + Arthur lock the WaveWarZ-Base smart contracts (per Doc 711 action items). Sam already has 2 contracts on testnet; Arthur reviews security + suggests references.
- **Workshop:** Arthur or Sam records a session "WaveWarZ-Base smart contracts" for the June workshop library. Doubles as the spec walkthrough for ZABAL Gamez builders.
- **Decision sub-doc:** Spec the `airdropPositions(voters[], amount, finalists[])` call + the Respect-holder snapshot mechanism. Either reuses the Respect contract directly or a Hats Protocol role check.

### July (open build-a-thon)
- WaveWarZ-Base goes to Base mainnet (post-audit).
- A test "battle" runs - one of the 8 adoptable projects becomes a fake finalist. Smoke-test the full flow with Respect-holder pre-funding + market trading + settlement.
- **Adoptable project #09 (added):** "Wire WaveWarZ-Base into the ZABAL Gamez Finals surface" - lives in `ZAODEVZ/zabalgames` repo as the Finals settlement page. Builder: ideally a July builder takes it as their submission.

### August (the Finals)
- Real Finals run on WaveWarZ-Base. ~5-8 finalists, 30-80 Respect-holder pre-funded voters, market open for 72h, settlement on-chain at T+72h.
- Live reveal stream announces placements via the smart contract output (not a manual call).

---

## Open questions

| Question | Where to resolve |
|----------|-----------------|
| What is the Respect-holder snapshot mechanism? Hats Protocol role check, or direct Respect contract read? | Decide with Iman + the ORDAO team before July |
| What is the pre-funded position size? $2 / voter is a placeholder. Could be $5, $10, or zero-funded (just allocate shares). | Spec sub-doc, depends on prize-pool funding |
| Do judge agents run autonomously (x402 paid) or are they triggered by the Finals contract? | Sam + Arthur on the contract side |
| What happens if WaveWarZ-Base isn't mainnet-ready by August? | Fallback: run Option C (parallel signal) with Respect 1p1v deciding. Plan published in Doc 701 update. |
| Whale capture - cap per-wallet position? | Default: no cap (matches WaveWarZ's existing economics). Could add a soft cap (e.g. max $100 per address per finalist) as a v2. |
| Does the 1% artist cut apply post-Finals trading too? | Per WaveWarZ protocol, yes - trades on the finalist's entry keep flowing 1% forever. Pure upside for the builder. |
| Sybil / fake address attacks on the Respect pre-fund | Snapshot is at T+0; Respect is soulbound; attacker can't manufacture eligibility. Solved by the existing Respect mechanism. |

---

## Cross-references

- [Doc 711](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/711-arthur-wavewarz-base-call-may19.md) - Arthur intro call. Locks Arthur on the WaveWarZ-Base smart contracts + as ZABAL Gamez mentor.
- [Doc 723](https://github.com/bettercallzaal/ZAOOS/tree/main/research/business/723-zabal-avax-x402-wavewarz-agentic) - Agentic WaveWarZ + x402 research. Confirms WaveWarZ is Solana for v1; Base for the agentic build; the judge-agent pattern + autonomous trader pattern.
- [Doc 180](https://github.com/bettercallzaal/ZAOOS/tree/main/research/wavewarz/180-wavewarz-integration-blueprints) - WaveWarZ Artist Discovery Pipeline. The technical integration patterns for reading battle data + program ID + Helius RPC.
- [Doc 101](https://github.com/bettercallzaal/ZAOOS/tree/main/research/wavewarz) - WaveWarZ ZAO whitepaper. The economic model + protocol mechanics.
- [Doc 646](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/646-clanker-promote.md) - Clanker + Empire Builder promote-window. The pattern this supersedes (Clanker was the "parallel signal"; WaveWarZ becomes the "actual decision").
- [Doc 701](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/701-canonical-state.md) - ZABAL Gamez canonical state. Part 12 (next update) folds in this WaveWarZ Finals mechanism.
- [Doc 654](https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/654-empire-v3-meeting.md) - Empire Builder V3 + the calendar pivot. Empire stays the leaderboard layer; WaveWarZ is the settlement layer.

---

## Next Actions

| Action | Owner | Due |
|--------|-------|-----|
| Sam: ship the 2 testnet contracts to a security-reviewed state | Sam + Arthur | Before June bootcamp opens |
| Arthur: record a June workshop session "WaveWarZ-Base smart contracts" | Arthur | June |
| Spec sub-doc: `airdropPositions` call + Respect-holder snapshot mechanism | Zaal + Iman | Before July open call |
| Add adoptable project #09: "Wire WaveWarZ-Base into the Finals surface" | Zaal | This week (add to /projects + JSON) |
| Update Doc 701 with Part 12 (WaveWarZ Finals) | Zaal | This session |
| Update llms.txt with the WaveWarZ Finals mechanic | Zaal | This session |
| Build /finals page on zabalgamez.com with the WaveWarZ framing | Zaal | This session |
| Mainnet deploy WaveWarZ-Base + run smoke-test battle | Sam + Arthur | July |
| Define the prize-pool / market-settlement mapping (how $500 USDC + protocol settlement coexist) | Zaal + Sam + Arthur | July |
| Run the real Finals on WaveWarZ-Base | Whole team | August |

---

*This is the architectural decision doc. Updated 2026-05-23. Source: 2026-05-19 Arthur call (Doc 711) + Doc 723 agentic-WaveWarZ findings + user direction 2026-05-23 ("use the protocol to decide the winner").*

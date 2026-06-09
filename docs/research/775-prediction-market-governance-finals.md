# 775 - Prediction-market governance for the Finals (futarchy + WaveWarZ)

Status: research (2026-06-09). Part of the DAO case-study set (772 concept, 773 AI-fractal
scoring, 774 DAO pros). Focus: what futarchy and prediction-market governance teach us about
the **August Finals**, which already settle placement on the WaveWarZ-Base market (doc 701
Part 12: a contract settles finalist placement on volume + win rate over the 72h window,
Respect-holders get a pre-funded baseline position, anyone with a Base wallet can trade). So
ZABAL Gamez is **already a live futarchy** - this doc is about hardening it. Nothing built.

## The frame: vote on values, bet on beliefs (Hanson)

Robin Hanson's futarchy splits governance: democracy decides *what we want* (a measurable
value), markets decide *how to get there*. We already have both halves - **Respect**
(soulbound, peer-earned, can't be bought) and **WaveWarZ** (capital, self-correcting). The
strongest, most defensible public framing of the Finals is therefore: **Respect-holders set
the values and prize tiers up front; the market only prices placement within those values.**
That is also the cleanest answer to "won't whales just buy the win" - money is walled off
from the *goal* and only prices the *forecast*. ([Hanson, Vote on Values / Bet on Beliefs](https://mason.gmu.edu/~rhanson/futarchy.pdf),
[Futarchy overview](https://en.wikipedia.org/wiki/Futarchy))

## Case studies

- **MetaDAO** (the only mainnet futarchy with a track record; 21+ proposals on Solana).
  Settlement uses a **TWAP, not the spot/closing price**, explicitly because "someone could
  pump the price right before finalization," plus a **max-change-per-update cap**, and a
  **threshold gap** (pass only if pass-TWAP is x% above fail-TWAP). Self-healing claim: market
  manipulation creates a profit opportunity for others to trade against. *Downside:* TWAP is
  harder, not impossible, to game; doesn't fit small decisions. ([MetaDAO price oracle](https://docs.metadao.fi/implementation/price-oracle),
  [Helius: futarchy on Solana](https://www.helius.dev/blog/futarchy-and-governance-prediction-markets-meet-daos-on-solana))
- **Optimism futarchy v1** (Mar 2025, ~500k OP, the richest failure catalogue). Markets bet on
  which grantees would gain TVL, run head-to-head against a Grants Council. *Lessons:*
  **metric-gaming** (TVL tracked market volatility, not project quality - "measures the
  weather, not the work"); **self-fulfilling prophecy** (the bet causes the funding causes the
  outcome); **incentive conflict** (vote-with-the-crowd vs bet-the-contrarian pull apart). The
  one genuinely useful output was the **A/B bake-off** itself. ([Futarchy v1 findings](https://gov.optimism.io/t/futarchy-v1-preliminary-findings/10062),
  [PANews critique](https://www.panewslab.com/en/articles/ws5i1bxj))
- **GnosisDAO / Augur / Polymarket** (the market + resolution plumbing). Gnosis launched as
  **"soft futarchy first"** - markets advise, humans keep the final call, harden over time.
  Polymarket uses **optimistic resolution with a dispute bond** (an outcome stands unless
  someone bonds a challenge, escalating to a token vote). *Downside:* resolution is the
  perennial weak point, and onchain markets chronically struggle with thin liquidity.
  ([GnosisDAO bets on futarchy](https://www.coindesk.com/tech/2020/11/23/new-gnosisdao-bets-on-futarchy-a-prediction-market-governance-model),
  [how Augur/Polymarket resolve](https://dataconomy.com/2026/05/08/how-augur-polymarket-and-manifold-approach-smart-contract-resolution-differently/))

## Failure modes -> mitigations (checklist for the WaveWarZ Finals)

| Failure mode | At the Finals | Mitigation to adopt |
|---|---|---|
| Thin / low liquidity | 8 finalist markets, few traders, prices wander | Pre-fund Respect baseline positions (planned); finalists seed minimum liquidity; concentrate trading in the 72h window; an AI build-bot (doc 770) as market-maker |
| Manipulation (self-buy at close) | A team pumps its own shares at the buzzer | **TWAP settlement, not spot** + max-change-per-update cap |
| Sybil / whale dominance | One whale prices the board | Wall values off from money: Respect (soulbound) sets values; cap per-wallet baseline |
| Metric-gaming / Goodhart | "Volume" wash-traded, "win rate" farmed | Composite, pre-registered, sealed metric published before T+0 |
| Oracle / resolution dispute | Disagreement on the readout | Bonded dispute window, Respect-weighted backstop |
| Self-fulfilling prophecy | Early favorite wins because favored | Keep the "did it ship to the bar" judgment partly in the Respect layer; market prices placement, not whether work shipped |

## Recommendations for the Finals

1. **Settle on a TWAP over the full 72h window, not the closing price** (+ a max-change-per-
   update cap). Highest-leverage, lowest-effort hardening - it is the exact mistake MetaDAO
   calls out, and it directly stops a finalist buying placement at the buzzer.
2. **Make Hanson's split the public story:** values voted by Respect, placement bet on
   WaveWarZ. Most rigorous framing and the best answer to the whale critique.
3. **Run it as an explicit A/B against a Respect 1p1v shadow vote, and publish both.** Optimism's
   most useful output was the comparison; doc 720's fallback (Respect 1p1v if WaveWarZ-Base is
   not mainnet-ready) is the same instrument - always run it. Agreement validates the market
   story; divergence is a real ZAO research result.
4. **Pre-register and seal the settlement metric before T+0; never a single market-correlated
   KPI.** Use a composite (volume + win rate + a Respect-attested "did it ship to the bar"
   gate), matching the existing sealed-prompt discipline.
5. **Add a bonded dispute window after settlement, resolved by Respect weight** (Polymarket
   pattern) - turns resolution, every market system's weak point, into a credibility feature.
6. **Use cheap July "will-it-ship?" markets to seed the Finals shortlist and price contribution.**
   Before the Finals, run lightweight conditional markets ("Will build X hit the July bar:
   live URL + repo + demo + /zabal cast?"). This is the **impact-market** bridge to the AI
   fractal (772/773): the market *forecasts* which contributions will land, Respect is awarded
   *after the fact* to what shipped, and the ZABAL build-bot (doc 770) can market-make and
   assist the ship-bar oracle - attacking thin liquidity while generating the data that ranks
   fractal contribution. ([Toward Impact Markets](https://forum.effectivealtruism.org/posts/7kqL4G5badqjskYQs/toward-impact-markets-1))

## Bottom line

The Finals are futarchy whether or not we call them that, so adopt the hard-won hardening:
**TWAP (not spot) settlement, a sealed composite metric, a Respect 1p1v shadow vote run in
parallel, and a bonded Respect-backed dispute window** - all framed as Hanson's "vote on
values, bet on beliefs," which our Respect + WaveWarZ stack already embodies. The July
"will-it-ship?" markets are the natural bridge between this market layer and the AI-fractal
contribution index in 772/773.

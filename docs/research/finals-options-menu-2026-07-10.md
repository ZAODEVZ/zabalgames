# ZABAL Gamez August Finals - Options Menu (research synthesis)

> Date: 2026-07-10. Status: research, nothing decided. Purpose: the owner is
> reconsidering the WaveWarZ-only prediction-market Finals (docs 720 + 775) and wants a
> WIDE menu of options, including artist / creator / builder challenges. This doc is a
> menu to react to, not a recommendation to adopt. Compiled from five parallel research
> passes (overall structures, artist track, creator track, builder track, judging + prize
> mechanisms). Sources inline.

## The one structural insight (read this first)

Every thread landed on the same two-part answer:

1. **Fairness is solved at the POOL level, not the mechanism level.** A song, an app, and a
   video cannot be ranked head-to-head fairly. Split the ~$500 into **per-track pools**
   (e.g. $150 x 3 + a small $50 cross-track "Best of ZABAL") and judge each track only
   against itself, with a track-native rubric. Set a minimum-entries bar per track so a
   thin track does not "win" cheaply.

2. **Judge with a 3-stage HYBRID, not one mechanism.** Community/AI screen narrows each
   track to a shortlist -> an expert or Respect-weighted jury picks the winner from the
   shortlist -> a small "People's Choice" bonus goes to the top community vote-getter
   regardless of the jury. This limits every single mechanism's weakness: the crowd can't
   be gamed into the *money* (the jury gates it), and the jury can't be accused of ignoring
   the crowd (the shortlist + bonus).

Everything below is a building block that snaps into that frame. The current WaveWarZ
plan is not thrown out - it becomes an **engagement side-game** on top, which de-risks it
(no longer blocked on contracts, no longer taxes artists/creators with a trading UI).

---

## A. Overall Finals structures (pick the backbone)

| Model | 3-track fit | Effort | Contract-blocked | Signature strength |
|---|---|---|---|---|
| 1. Live demo day + expert panel | High | Low-Med | No | Prestige + content |
| 2. Per-track parallel finals | Highest | Med | No | Fairness by design |
| 3. Sybil-resistant community / quadratic vote | Med-High | Med-High | No | Participation |
| 4. Prediction market / futarchy (current plan) | Low-Med | High | **Yes** | Novelty, ZAO-native |
| 5. RetroPGF impact funding | Med-High | Med | No | Rewards results |
| 6. Bracket / tournament | Med (great artist) | Med-High | No | Drama + clips |
| 7. Peer-judged ranking (game-jam) | Med | Low-Med | No | Scales, no judges |
| 8. Hybrid shortlist -> final | High | Med | No | Balanced, defensible |
| 9. People's-choice + jury split | High | Med | No | Both/and, 2x coverage |
| 10. POIDH bounty backbone | Med-High | Low | No | Objective, already live |

**Lowest regret:** Model 8 (hybrid) run per-track (Model 2), with a Model 9 people's-choice
layer, POIDH (Model 10) running underneath as the objective build-funnel, and WaveWarZ
(Model 4) as an optional builder-track spice. Sources: [ETHGlobal judging](https://ethglobal.com/events/ethonline2025/prizes),
[Base Onchain Summer Buildathon](https://blog.base.org/announcing-the-onchain-summer-buildathon-winners),
[Gitcoin RetroPGF](https://gitcoin.co/blog/wtf-is-retro-funding),
[ISC two-tier judging](https://www.songwritingcompetition.com/rules),
[TIFF People's Choice](https://en.wikipedia.org/wiki/Toronto_International_Film_Festival_People's_Choice_Award).

---

## B. Per-track challenge formats

### Artist (music + visual)
The music-native, on-brand spine is a **WaveWarZ battle bracket**: artists submit a song,
fans "back their favorite" (super votes), and the artist earns a cut - it already exists in
the stack, so no format invention. Wrap it in a single-elimination bracket for drama; use
**blind voting** (hear the track, not the name) for fairness.

Strong alternatives, by fit:
- **Remix / sample-flip on a shared stem** - everyone works the same source, so entries are
  directly comparable; juried or hybrid. ([SKIO](https://skiomusic.com/faq/remix-contests/), [Splice](https://splice.com/blog/underbelly-bitbird-remix-contest/))
- **Listening-party + collect/tip** - most-collected wins; puts real revenue in artists'
  pockets, hard to fake (each vote costs money); rails already live via Tortoise/Sound/Base
  and the Magnetiq collect surface. ([Sound Season One](https://sound.mirror.xyz/WG9dOUMpICI3hkdeXakuZ9G-W_MhHcFkIMLIygQ4cao), [Tortoise](https://hello.tortoise.studio/))
- **EP / portfolio in a month (finish-to-win)** - matches the build-a-thon "ship it" ethos;
  completion earns an Unlock finisher cert; add a showcase to crown a winner. ([RPM Challenge](https://en.wikipedia.org/wiki/RPM_Challenge), [FAWM](https://en.wikipedia.org/wiki/February_Album_Writing_Month))
- **Theme-prompt / sample-flip (music + visual under one prompt)** - one constraint serves
  both sub-tracks; comparable + inclusive. ([Splice x Chromeo](https://stefanbohacek.com/project/splice-x-chromeo-beat-battle/))
- **Score-to-picture** - a visual artist supplies a silent clip, musicians score it; uniquely
  makes the two halves collaborate. ([Berlin Film Scoring](https://www.bifsc.org/))
- **Visual: juried showcase** or **generative/AI-prompt gallery** with community + jury. ([Light Space & Time](https://lightspacetime.art/judging-criteria-for-our-art-competitions/), [NightCafe](https://creator.nightcafe.studio/challenges))

Music-native blocks: WaveWarZ, collect/tip, POIDH, Respect. Framing rule: describe WaveWarZ
as "fans back their favorite," never "trade/market."

### Creator (media / video / clips / writing)
Lowest-friction and proven here is a **POIDH "best ad / explainer" bounty** (one already ran
for ZABAL Gamez): funder escrows USDC, creators submit, funder picks - no reach metric to
game. ([poidh](https://poidh-app.vercel.app/))

Best asset-reuse pairs with it:
- **Season clip contest** - cut the best clips from existing recordings; feeds the clip-to-earn
  flywheel already on-site. Run it **judged**, not views-based, to kill botting. ([Eklipse](https://blog.eklipse.gg/eklipse-news-and-guide/introducing-the-eklipse-creator-rewards-program.html))
- **Mini-doc of a build (2-5 min)** - highest prestige + evergreen asset; naturally delivers
  the mentor-pairing prize by pairing a creator with a build team. ([Big Sky Mini-Doc](https://www.bigskyfilmfest.org/festival/competition/))
- **Remix-the-recordings** (duet/stitch), **short-video prompt**, **thread/newsletter writing**,
  **meme contest**, **podcast/Space episode** - all juried, all low-bot. ([X $1M articles](https://www.kucoin.com/news/flash/x-launches-1m-article-contest-to-revive-long-form-content))
- **Distribution/reach competition** - only run Farcaster-native (FID-verified recasts/replies),
  weighted by reputation, with audit-and-strip rights, or demote reach to a *bonus*. This is
  the one format where gaming is the central risk. ([Bountycaster reputation](https://www.bountycaster.xyz/faq), [BotBasher](https://blog.humanode.io/sybil-resistant-quests-on-zealy-with-botbasher/))

Strong combined creator design: **POIDH best-ad (headline) + season clip contest (flywheel)
+ mini-doc (prestige)** - three sub-types, one pool, minimal new build.

### Builder (apps / tools / onchain)
The pattern the best examples converge on: a **judge-agent screens every submission**
(objective floor: does it work, is it ZAO-native, shipped fast - verified against the real
repo via the existing commit-watcher), then **humans / Respect-holders pick the winner from
the shortlist**, with WaveWarZ as an optional prediction overlay for the crowd. ([Devfolio AI judge](https://devfolio.co/blog/the-discerning-machine/), [a42z-Judge](https://github.com/HS1CMU/a42z-Judge))

Menu:
- **Demo day + judges** (default) or the tighter **live-app 4-question rubric** (works / ZAO-native
  / would I use it / shipped fast). ([ETHGlobal](https://ethglobal.com/events/ethonline2025/info/start))
- **Adopt-and-ship a started project** - solves the blank page; commit-watcher measures the
  shipped delta objectively; great fit for the existing adoptable-projects data. ([Base Batches Showcase](https://blog.base.org/join-the-onchain-summer-buildathon))
- **User-traction / onchain-metric** competitions - powerful but the **most sybil-gameable**;
  only fair behind a Farcaster/Respect identity gate. ([sybil attacks distort metrics](https://formo.so/blog/what-are-sybil-attacks-in-crypto-and-how-to-prevent-them))
- **Peer review (quadratic)** among builders - Respect is a near-perfect fit; watch collusion. ([QV as judging](https://medium.com/codeless-conduct/reflections-on-quadratic-voting-as-a-hackathon-judging-mechanism-b5ed299fe56))

Best builder blocks: commit-watcher (objective "what shipped, when"), judge agents (x402),
Respect, Empire Builder, adoptable-projects.

---

## C. Judging mechanisms (how to score *inside* a track)

- **Expert jury + rubric** - predictable, sybil-immune; seat track-native judges; normalize
  per-judge scores; publish rubric + judges in advance. ([Devpost](https://help.devpost.com/hc/en-us/articles/360024869792-Judging-public-voting))
- **Sybil-resistant community vote** - legitimacy + reach; gate by Neynar quality score +
  Respect/attendance; cap its weight to a bonus. ([Neynar guardrails](https://blog.newton.xyz/newton-protocol-integrates-neynar-data-to-power-onchain-farcaster-identity-guardrails/))
- **Quadratic voting/funding** - rewards breadth over whales, but **sybil is the Achilles
  heel** (many fakes beat one honest whale); mandatory identity gate. ([Gitcoin QV sybil case](https://www.chainscorelabs.com/en/blog/dao-governance-lessons-from-the-frontlines/governance-post-mortems/the-hidden-cost-of-quadratic-voting-sybil-attacks-and-the-gitcoin-case))
- **Prediction market / futarchy** - Respect sets values, market prices placement; use a
  multi-day TWAP + liquidity subsidy; **make it a side-game, not the prize** to kill the
  gambling optics and the "whales buy the win" attack. ([Hanson](https://mason.gmu.edu/~rhanson/futarchy.html), [Helius/Meta-DAO TWAP](https://www.helius.dev/blog/futarchy-and-governance-prediction-markets-meet-daos-on-solana))
- **Respect-weighted vote** - your strongest anti-whale answer: Respect is soulbound,
  peer-earned, **cannot be bought**. Cap with a sqrt to blunt incumbents. ([Optimystics Respect](https://optimystics.io/respect))
- **RetroPGF impact** - reward demonstrated outcomes; publish per-track impact metrics before
  the window; blend objective metrics + expert discretion. ([Optimism lessons](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239))
- **Autonomous AI-judge** - scales + gives everyone written feedback, but **shortlist only,
  never sole decider**; ensemble 3+ models, swap positions, sanitize against prompt-injection. ([Galileo LLM-as-judge](https://galileo.ai/blog/llm-as-a-judge-vs-human-evaluation))
- **Hybrid (recommended)** - shortlist -> jury -> people's-choice bonus, per track.

---

## D. Prize / incentive structures + sybil toolkit

- **Per-track pools** (the fairness lever, section top). ([Devpost prize structures](https://help.devpost.com/article/74-developing-prize-structures))
- **Participation / finisher rewards + streaks** - guaranteed collectible / raffle ticket /
  $Zabal drop for any real submission; rewards completion (fair across tracks); keep USDC for
  placement. Uses existing raffle / pops / game / present. 
- **Soulbound finalist/winner credential** (Unlock or EAS) - durable proof; doubles as the
  Season-2 invite and a future vote/access gate; attach real utility or it's ignored. ([Unlock soulbound](https://unlock-protocol.com/guides/soulbound-token/), [EAS](https://docs.attest.org/))
- **POIDH-escrow payout** - the $500 sits in a public Base escrow before Finals open (visibly
  committed), organizer-resolved release on the jury result. ([poidh escrow](https://words.poidh.xyz/poidh-beginner-guide))

**Sybil resistance toolkit** (for any vote): Farcaster + Neynar quality score (cheapest,
native) -> Respect-token gate (unbuyable, strongest) -> Human/Gitcoin Passport stamps
(~90% sybil reduction) -> Unlock attendance credential -> EAS attestations for auditability.
Failure modes -> fixes: whale capture -> Respect/sqrt caps + jury gates the money; sybil
farms -> identity stack + cluster detection; collusion -> jury-gated shortlist + hidden
tallies; low turnout -> jury still works; TWAP gaming -> multi-day window + side-game only.

---

## E. A low-regret shape (one option, clearly labeled)

Per-track pools + 3-stage hybrid, using blocks that already have plumbing:

1. **Screen** each track to a shortlist - AI judge-agent (builder) / sybil-gated community
   vote (creator, artist) / blind vote (artist music).
2. **Decide** the winner from the shortlist - Respect-weighted or track-expert jury, own
   rubric per track.
3. **Bonus** - a small People's Choice from the top community vote.
4. **Everyone who ships** gets a soulbound finisher credential + collectible.
5. **Pay** winners via public POIDH escrow.
6. **WaveWarZ rides on top** as a prediction side-game with its own reward for correct
   predictors - not the thing that decides the prize (removes the contract dependency and the
   trading-UI tax on artists/creators).

This is legible to non-crypto artists, maximally defensible, and spends effort where the
plumbing exists (commit-watcher, judge agents, Respect, Farcaster, POIDH, Unlock).

## F. Public framing ("won't whales just buy the win?")

> "Placement is decided by peer-earned standing and a track-expert panel, not by who spends
> the most. The standing that carries weight here is earned by contributing to the community
> over time - it cannot be bought, sold, or transferred. Anyone can vote for a People's
> Choice favorite, but that only awards a small bonus; the main prizes are judged on the work
> itself, by people who know the craft. The prize money is held in a public escrow before
> Finals open, so everyone can see it is real and see exactly where it goes."

Rests on three defensible facts: Respect is soulbound and unbuyable; the community vote is
capped to a bonus; the escrow is public. No emojis, em dashes, or web3 jargon.

## Open questions for the owner

1. **Backbone:** hybrid-per-track (recommended) vs keep the full WaveWarZ market as the decider?
2. **WaveWarZ role:** engagement side-game (de-risked) vs the prize-deciding mechanism (blocked on contracts)?
3. **Pool split:** per-track pools + small cross-track "Best of ZABAL"? Amounts?
4. **Artist format:** WaveWarZ battle bracket, remix/sample-flip, listening-party collect, or a theme prompt spanning music + visual?
5. **Creator format:** POIDH best-ad + clip contest + mini-doc (the combined design)?
6. **Builder format:** judge-agent shortlist -> jury, and do we run the adopt-and-ship challenge on the existing adoptable-projects?
7. **A live capstone event** (demo day / listening party / bracket final) for the August moment, or asynchronous?
8. **Finalist count** and prize tiers (this replaces the earlier "8 vs 16" question - it falls out of whichever structure you pick).

# 774 - DAO case studies: pros to bring into ZABAL Gamez / ZAO

Status: research (2026-06-09). Goal: study other DAOs, pull out the single best mechanism
each built, and map it to a concrete move on ZABAL Gamez's / the ZAO's existing rails
(Empire Builder + the tokenless $ZABAL empire, the Bonfire graph, Respect fractals, Hats
roles, the GitHub build registry, Magnetiq, the WaveWarZ Finals). Nothing built.

## Framing (read first)

The ZAO already runs **soulbound, illiquid, peer-earned Respect via weekly fractals**. That
is structurally *stronger* than the mechanisms that failed elsewhere: it can't be bought
(unlike FWB/Bankless token gates) or farmed/sold (unlike Coordinape peer-comp). So the
high-leverage borrows are not "add governance" - they are the things our rails don't cover:

- **Retention past August** (most hackathon communities evaporate after the event).
- **Rewarding proven impact over demo-day theater.**
- **A cohort/residency format that reliably produces finished work** (esp. artist/creator).

Two failure modes to avoid, seen repeatedly: **governance/guild sprawl** (BanklessDAO,
Maker Endgame) and **gates that are really price gates** (FWB, Audius, Sound).

## A. General DAOs

- **Nouns** - daily CC0 auction funds a treasury; a fork lets dissenters exit with a
  treasury share. *Pro:* **CC0 proliferation** as a growth engine. *Downside:* treasury
  raiding, vanity props. *Bring in:* make the arcade logo + season assets explicitly CC0 and
  run a small **derivative micro-grant / bounty round** (ads, remixes, fan games) judged by
  community build-votes, via Magnetiq UGC + the queued POIDH bounty.
  ([nouns.wtf](https://nouns.wtf/), [Nouns fork](https://decrypt.co/197400/nouns-fork-disgruntled-nft-holders-exit-27-million-from-treasury))
- **MolochDAO / DAOhaus** - ~200-line grants DAO whose feature is **ragequit** (exit before
  a vote executes). *Pro:* **minimal governance + guaranteed exit.** *Bring in:* keep ZABAL
  governance thin (one propose/vote/decide loop for prizes); the soulbound analog of exit is
  a **no-penalty submission opt-out** before Finals that never costs earned Respect/Hats.
  ([MolochDAO](https://gitcoin.co/mechanisms/molochdao))
- **Optimism Collective** - bicameral Token House + Citizens' House running **RetroPGF**
  (pay for proven impact, after the fact). *Pro:* **retroactive funding + a reputation house
  separate from capital.** *Downside:* "visibility outweighs measurable impact," rounds felt
  unpredictable. *Bring in:* Respect fractals already are your Citizens' House - add a
  **retroactive Respect/prize bonus at Finals for demonstrated summer traction** (commits via
  commit-watcher, build-votes, demand), not just demo polish; WaveWarZ surfaces the impact
  signal. ([How Retro Funding works](https://community.optimism.io/citizens-house/how-retro-funding-works),
  [lessons learned](https://gov.optimism.io/t/lessons-learned-from-two-years-of-retroactive-public-goods-funding/9239))
- **Friends With Benefits** - token-gated club, tiered access, IRL city chapters. *Pro:*
  **tiers + local chapters.** *Downside:* token-price collapse gutted the gate. *Bring in:*
  you already gate by Hats/Respect, not a tradeable token - borrow the **tier ladder**
  (attendee -> builder -> mentor -> steward as Hats) and run the **three tracks as
  semi-autonomous chapters** off the /zabal group chat. ([FWB Season Four](https://fwb.mirror.xyz/DXauHLSikMA_lttUkH1tsxiIt8PFwv6gC8oXB5qgA0o))
- **BanklessDAO** - seasons, guilds, bounty board (later declined/rebranded). *Pro:*
  **seasons as a coordination heartbeat.** *Downside:* guild sprawl, free-riding. *Bring in:*
  ZABAL is already a season - **formally close Season 1 at Finals and scope Season 2** so
  momentum doesn't dissipate; a light **bounty board** on the register/commit-watcher rails;
  cap "guilds" at the three tracks. ([Bankless seasons](https://banklessdao.mirror.xyz/6i468DL59XhCAyfPoY3UA3h2uEDkkqWeiryuKkXOmBI))
- **Cabin** - network city of residencies + a neighborhood accelerator. *Pro:*
  **time-boxed residencies + helping people start their own node.** *Bring in:* frame the
  **July open build as a residency** (check-ins, demo days, accountability); later an
  **accelerator track** that helps standout builders spin up their own tokenless empires.
  ([Cabin network city](https://creators.mirror.xyz/zHox-AfvHbX0Q2JxAbcfwiAmOXRy7BzYafhZNlvHnmM))
- **ENS DAO** - working groups with **term-limited elected stewards** + an endowment.
  *Pro:* **rotating stewards prevent capture/burnout.** *Bring in:* **one elected, rotating
  steward per track per season** as a Hats role. ([ENS stewards](https://docs.ens.domains/dao/stewards/))
- **Gitcoin** - **quadratic funding** (breadth of backers beats whales) + layered sybil
  resistance. *Downside:* QF is a sybil magnet. *Bring in:* run a **quadratic, Respect/
  identity-gated community vote for part of the prize pool** - 40 genuine fans beat 3
  superfans, and Respect + Quick-Auth identity is your built-in anti-sybil layer.
  ([Quadratic Funding](https://gitcoin.co/mechanisms/quadratic-funding))
- **Protocol Guild** - ~190 core contributors paid via **time-weighted vesting**. *Pro:*
  **rewards sustained contribution, not one-time output** - the direct antidote to "ship and
  ghost." *Bring in:* a **"ZABAL Guild"** where sustained builders (weekly Respect +
  commit-watcher) accrue vesting standing/Hats across all three months. ([Protocol Guild](https://protocol-guild.readthedocs.io/))
- **MakerDAO / Sky** - Endgame split into **SubDAOs**. *Pro:* **modular spin-outs.**
  *Downside:* over-engineered, confusing. *Bring in:* treat each track (and $ZABAL) as a
  lightweight SubDAO via Empire Builder - **sparingly** (Maker's lesson). ([Endgame](https://endgame.makerdao.com/endgame/overview))
- **Coordinape** - peer "gift circles." *Pro:* **peer recognition replaces a comp
  committee.** *Downside:* collusion/popularity, company wound down 2025. *Bring in:* mostly
  validates Respect fractals (the soulbound, un-farmable version); borrow a per-workshop
  **"who helped you most" shout-out** feeding a small Respect allocation. ([Coordinape GIVE](https://docs.coordinape.com/get-started/give))

## B. Music + creator DAOs (most relevant to the artist/creator tracks)

The closest demonstrably-working model to ZABAL Gamez is **Songcamp's time-boxed cohort
"camps."** Almost every music DAO that faded tried to be a *standing institution* with a
*speculative token*; the best work came from *finite seasons with contribution credit*.

- **Songcamp (CHAOS/Elektra)** - cohort "camps": tiny bands, one constraint ("make a song
  in 2 weeks"), a mid-point demo review; CHAOS hit Billboard's music-NFT chart. Peer rewards
  via Coordinape; revenue via liquid 0xSplits; "exit to community" token drop. *Pro:* **the
  camp format itself reliably produces finished work.** *Bring in:* run a **Songcamp-style
  July camp for the artist track** - curated cohort, randomized 2-3 person *cross-track*
  bands (artist + builder + creator), one constraint ("ship a collaborative drop in 2 weeks"),
  public mid-point demo review; settle with a Split; peer-gift into Respect.
  ([Water & Music on Songcamp](https://www.waterandmusic.com/chains-and-rails-how-songcamp-builds-community-first-music-infrastructure/),
  [Songcamp x 0xSplits](https://0xsplits.mirror.xyz/oCk2-ghNioaN-l8zlNpoYYqXgjzRkC7J4vk-ONhZqoI))
- **Water & Music** - research DAO, **seasons + a $STREAM *credit* token (no financial
  value, pure contribution record)**. *Pro:* seasons + contribution-credit (maps 1:1 to
  Respect). *Faded:* contribution discovery was "pure chaos"; paid-DAO model wound down.
  *Bring in:* keep a single **always-current "ways to contribute this week" board** (like
  `workshop-leads.json`) so creator-track people always see open slots - the discovery
  problem W&M never solved. ([Introducing $STREAM](https://www.waterandmusic.com/introducing-stream-a-new-tokenized-research-framework-for-the-music-industry/))
- **Catalog** - 1/1 music NFTs, **zero platform commission, artist-set royalties, resale
  revenue-share to holders**. *Faded:* 1/1-only = low volume, no community loop. *Bring in:*
  mint artist-track **finalist** outputs as scarce 1/1 (or tiny-edition) collectibles with
  creator splits, on the Magnetiq surface, so the artifact marks the milestone.
  ([onchain music 101](https://splits.org/blog/onchain-music-101/))
- **Sound.xyz** - **comment-on-the-song as an ownership perk** (social identity on-record).
  *Faded:* sat on a fragile speculative primitive. *Bring in:* a **comment/endorsement-on-
  project primitive** powered by Farcaster identity (not a token sale) on project pages -
  "show your support on-record." ([Sound.xyz](https://nftplazas.com/sound-xyz-music-nft-marketplace/))
- **Audius** - decentralized streaming; **direct fan tips (100% to artist)**. *Faded:*
  governance whale-concentration + low turnout, token tied to market. *Bring in:* a
  one-tap **Farcaster-native fan-tip / fan-fund button** on artist/creator pages (you have
  `/api/join` + Cast plumbing); keep governance to the small, active Respect fractals.
  ([Audius](https://www.coinbase.com/learn/crypto-basics/how-is-audius-decentralizing-the-music-industry))
- **Coop Records / Daniel Allan** - **project-scoped fan crowdfunding** (Allan auctioned 50%
  of an album's masters for ~$140k from 87 backers in a day). *Pro:* fund a *specific*
  project against *its* revenue, not "buy a token and hope." *Bring in:* a **project-scoped
  fan-funding option for finalists** (memento + optional Split stake) - the friendly,
  on-record cousin of WaveWarZ's "bet on it." ([Overstimulated crowdfund](https://danielallan.mirror.xyz/crowdfunds/0x18f623e397EF28F1A5a094840f7F6f5587828b94))

Reusable primitives: **0xSplits** for collaborative-drop revenue; **credit tokens over
speculation tokens** ($STREAM, Respect); peer-gifting feeding Respect.

## Prioritized adoption shortlist

Ranked by leverage-to-effort, each mapped to an existing rail.

| # | Mechanism (source) | Rail | Concrete move | Effort |
|---|---|---|---|---|
| 1 | Retroactive impact bonus (Optimism) | Respect + commit-watcher + WaveWarZ | At Finals, reward demonstrated summer traction, not just demo polish | Low-Med |
| 2 | Time-weighted "keep shipping" rewards (Protocol Guild) | weekly Respect + commit-watcher + Hats | A "ZABAL Guild": sustained builders accrue vesting standing - fixes post-August drop-off | Med |
| 3 | Season cadence + explicit Season 2 (Bankless) | the June/July/Aug arc + roadmap | Formally close S1 at Finals, scope S2 | Low |
| 4 | Songcamp-style July camp (Songcamp) | open-build month + group chat | Curated cohort, cross-track bands, 2-week drop, mid-point review | Low-Med |
| 5 | Quadratic, identity-gated community vote (Gitcoin) | build-votes + Respect/Quick-Auth | Allocate part of the pool by QF; Respect is the anti-sybil layer | Med |
| 6 | Term-limited track stewards (ENS) | Hats | One rotating steward per track per season | Low |
| 7 | CC0 assets + derivative micro-grants (Nouns) | $ZABAL + Magnetiq + POIDH | CC0 the assets; bounties for ads/remixes/fan-builds | Low-Med |
| 8 | July as a residency (Cabin) | open-build month | Check-ins, demo days, accountability - convert signups into shippers | Low |
| 9 | Collaborative-drop Splits + project-scoped fan funding (Songcamp/Coop) | Magnetiq + WaveWarZ | Splits for collabs; fans back a specific finalist project | Med |
| 10 | Comment/endorsement + fan-tip primitive (Sound/Audius) | project pages + `/api/join` + Cast | On-record support and one-tap tips, Farcaster-native | Med |

## Bottom line

ZAO's earned-not-bought Respect is the moat; don't dilute it with a price gate or governance
sprawl. The two clearest wins are **(1) reward proven impact at the Finals (RetroPGF)** and
**(2) reward sustained shipping across the season (Protocol Guild), with an explicit Season 2
(Bankless)** - together they fix the retention gap every hackathon community hits. For the
artist/creator tracks, the **Songcamp camp** is the highest-conviction borrow, settled with
**Splits** and discovered through an always-current contributions board (the Water & Music
lesson). Prediction-market governance for the Finals (futarchy / WaveWarZ) is covered
separately in doc 775.

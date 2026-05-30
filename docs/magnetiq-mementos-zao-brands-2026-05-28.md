# Magnetiq Mementos - ZAO Brand Bundle for ZABAL Gamez

> Per Zaal 2026-05-28: 'give tyler all the info to create mementos under the magnet for the ZABAL games for all the ZAO brands and give me a script for each one of the projects as a video.'

This doc has two halves:
- **For Tyler:** everything to build a Magnetiq memento per ZAO brand. Drop into the portal's content system however fits Magnetiq's UX.
- **For Zaal:** a video script per brand, ~60-90 sec spoken. Record + post to Magnetiq alongside each memento.

Each memento is a Magnetiq-hosted page that connector-holders can visit to learn one ZAO brand deeply. The mementos are also the post-ZABAL-Games retention surface - someone who built or watched can go deeper on whichever brand grabbed them.

Architecture recap: zabalgamez.com is the games operational center. Magnetiq holds these brand mementos + the connector NFT + workshop recordings. Notion (Tyler-managed) syncs to zabalgamez.com only.

## Brand index

| # | Brand | Status | Audience pull | Video length |
|---|---|---|---|---|
| 1 | The ZAO (umbrella) | Live | All ZAO members | 75s |
| 2 | ZAO OS | Live (March 2026) | Builders + members | 65s |
| 3 | $ZABAL + Empire Builder | Live (token Jan 2026) | Token holders + Empire community | 80s |
| 4 | WaveWarZ | Live v1 Solana, v2 Base in build | Music fans + traders + artists | 90s |
| 5 | ZAO Festivals + ZAOstock | ZAOstock active (Oct 3 2026) | Indie artists + Maine community | 85s |
| 6 | ZAO Music | First release in progress | Members ready to release | 70s |
| 7 | COC Concertz | 5 concerts done, #6 going live Sat Jun 13 | Virtual concert promoters + audiences | 70s |
| 8 | Respect + Fractals | Live (core governance) | All ZAO members earning Respect | 80s |

---

## Tyler memento spec - the structure each brand page uses

Each Magnetiq memento page should hit these beats (use this as a template):

1. **Logo / visual mark** (Magnetiq pulls from brand asset library)
2. **One-liner** (the title beat - 8 words max)
3. **Tagline** (the "why care" - 12 words max)
4. **Mission** (1 paragraph, ~40 words)
5. **Who it serves** (audience description)
6. **What's live now** (status proof - shipped products, member counts, real artifacts)
7. **How it fits ZABAL Gamez** (the bridge - why this brand matters for builders / watchers in the games)
8. **Watch the deep-dive video** (Zaal's recorded video script - 60-90 sec)
9. **Learn more / participate** (links to live surfaces + signup)
10. **Earned: brand badge** (the connector-holder gets a brand-specific signal on their profile when they finish the memento)

---

# 1. The ZAO (umbrella)

## Tyler memento copy

**Logo:** ZAO mark (orange + cyan gradient on dark navy)

**One-liner:** Music infrastructure for independent artists.

**Tagline:** Bring the profit margin, the data, and the IP rights back to indie musicians.

**Mission:** The ZAO builds picks-and-shovels for independent musicians using decentralized tools. Mission: bring the profit margin, the data, and the IP rights back to artists who own their masters. Community-first, technology-second.

**Who it serves:** Independent musicians (100-10k monthly listeners), crypto-curious not crypto-native, releasing monthly, no label, own their distribution. Plus the music-industry pros, web3 builders, and fans who join to support the work.

**What's live now:** 100+ member gated Farcaster music community. Shipped ZAO OS, launched $ZABAL token, Crypto Magazine feature - all in Q1 2026. Active fractal governance every week. 7+ sub-brands across the ecosystem (ZAO OS, $ZABAL + Empire Builder, WaveWarZ, ZAO Festivals, ZAO Music, COC Concertz, Respect + Fractals - plus smaller initiatives evolving in parallel).

**How it fits ZABAL Gamez:** The ZAO is the parent. ZABAL Gamez is one of its three-month seasonal initiatives. Every Finalist in August gets paired with a ZAO mentor. The voter set for the Finals is Respect-holders inside The ZAO.

**Watch the deep-dive video:** [Zaal's video - 75s]

**Learn more / participate:**
- thezao.com (about)
- zaoos.com (the app)
- /zabal Farcaster channel
- ZABAL Gamez Season 1: zabalgamez.com

**Earned badge:** "ZAO Umbrella Initiate"

## Zaal video script (75 sec)

```
The ZAO is music infrastructure for independent artists.

Three Latin words got me here. Re-zao - to rise up. We built this for
artists who are tired of renting their audience from algorithms they
do not control. Who want their masters back. Who want a community
that learns + ships together instead of waiting for a label to maybe
notice them.

We started gated on Farcaster. 100+ members. Mostly indie musicians
with 100 to 10,000 monthly listeners. Some web3 builders. Some
music industry folks. People who hold what we call Respect - earned
by showing up to weekly fractal sessions, contributing to the
ecosystem, building tools the rest of us use.

What's live: ZAO OS is the platform. $ZABAL is the token. WaveWarZ is
the artist prediction market. ZAOstock is the festival. ZAO Music
is the label. COC Concertz is the virtual show network. Respect is
the governance. Plus smaller initiatives running in parallel - 7+
brands total under the ZAO umbrella.

ZABAL Gamez is one of our seasonal initiatives. Three months. Open
to anyone. The ZAO is what they are joining.

Bring the profit margin, the data, and the IP rights back to the
artists. That is the work. The rest is plumbing.
```

---

# 2. ZAO OS

## Tyler memento copy

**Logo:** ZAO OS mark (matches umbrella)

**One-liner:** The gated Farcaster client.

**Tagline:** A music-community home that members own + control.

**Mission:** ZAO OS is the platform layer of The ZAO. A Farcaster-native client that gives members a feed, audio + video spaces, a Respect leaderboard, governance flows, and ecosystem integrations - instead of renting these from a mainstream platform.

**Who it serves:** The 100+ ZAO members. Gated, not public. Built for music makers, music-industry pros, and music fans who want first-class music tooling baked into their daily Farcaster experience.

**What's live now:** Shipped March 2026. Next.js + Tailwind + Supabase + Farcaster Hubs + RainbowKit + viem on Base. Surfaces: `/feed`, `/spaces`, `/respect`, `/ecosystem`, `/governance`, `/settings`. 88 internal research docs. Encrypted DMs. Music players inline.

**How it fits ZABAL Gamez:** Builders can study ZAO OS for patterns - cross-post modules, music player components, governance integration, Respect leaderboard. The codebase shows what real ZAO rails look like composed cleanly. Builders adopting ZAO OS components for July submissions get faster onboarding from mentors.

**Watch the deep-dive video:** [Zaal's video - 65s]

**Learn more / participate:**
- zaoos.com (the live app, gated)
- Apply for ZAO membership via the join flow
- Code patterns: github.com/bettercallzaal/ZAOOS (the working tree)

**Earned badge:** "ZAO OS Pattern-Reader"

## Zaal video script (65 sec)

```
ZAO OS is the gated Farcaster client.

What I mean: most platforms own you. The feed is theirs. The
algorithm is theirs. Your audience disappears when they pivot. We
flipped that. ZAO OS is a Farcaster client we run for ourselves -
gated to ZAO members. Feed is ours. Spaces are ours. Governance
votes happen here. Music plays inline in cast threads.

Stack: Next.js 16. Tailwind v4. Supabase for the relational layer.
Farcaster Hubs for protocol reads. Base for onchain. We shipped
this in March. About 100+ members use it daily.

Why it matters for builders: every component we built is a pattern
you can re-use. Cross-posting to 10 platforms - we have a module
for it. Music player with queue + reactions - working code. Respect
leaderboard - drop-in. If you ship for ZABAL Gamez this July, the
ZAO OS repo is your shortest path to a real-feeling Farcaster app.

Look at it like a kit. Take what helps, leave the rest.
```

---

# 3. $ZABAL + Empire Builder

## Tyler memento copy

**Logo:** ZABAL purple wordmark (zabal.art aesthetic)

**One-liner:** Token economy that rewards contribution, not speculation.

**Tagline:** The ecosystem rail $ZABAL Gamez runs on. Composable, transparent, mechanism-forward.

**Mission:** $ZABAL is the umbrella token across Zaal-led ZAO brands. Wrapped in an Empire on Empire Builder - the leaderboard + booster + treasury substrate for token communities. Mission: a participation rail, not a speculative coin. Hold to vote. Stake to multiply. Contribute to earn.

**Who it serves:** ZAO members holding $ZABAL. The wider Empire Builder ecosystem of token communities. Builders who want a token-economy rail without launching their own coin from scratch.

**What's live now:** Token launched 2026-01-01 via Clanker. Contract `0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07` on Base. Empire address `0xe0faa499d6711870211505bd9ae2105206af1462`. Empire Builder V3 live since 2026-05-01. 7 active leaderboard slots. Multiplier stack: staking 2.1-3.0x, empire 4.0-8.6x. Co-creators: Jordan Oram (yerbearzerker) + Adrian (diviflyy).

**How it fits ZABAL Gamez:** Top 16 Finalists earn $ZABAL rewards on top of the USDC pool. Builders can open a free tokenless Empire as a public build home (leaderboard + treasury). Finalists who want to launch a token Ascend their Empire via Clanker. The token IS the games' name + its base economy.

**Watch the deep-dive video:** [Zaal's video - 80s]

**Learn more / participate:**
- Empire Builder: empirebuilder.world
- Clanker: clanker.world (how $ZABAL launched)
- Trade $ZABAL on Base: contract address above
- Vote in haatz (governance): thezao.com/zabal

**Earned badge:** "Empire Citizen"

## Zaal video script (80 sec)

```
$ZABAL is the umbrella token across what I build. Wrapped on Empire
Builder. Launched January 2026 through Clanker.

Three things matter about $ZABAL. One - it is not a speculation coin.
It is a participation rail. Hold it, you vote. Stake it, your
contribution gets multiplied. Build for the ecosystem, you earn it.

Two - it lives on Empire Builder V3. Created with Jordan Oram and
Adrian. Free Basic Empire if you want to ship without a token at
all. Ascended Empire if you launch one and unlock the full
leaderboard plus booster stack. Multiplier ranges - staking 2.1 to
3.0x, empire 4.0 to 8.6x. Real network effect math.

Three - ZABAL Gamez top 16 builders get $ZABAL rewards on top of
whatever USDC the top 8 share. Finalists who want to launch their
own token can Ascend their Empire via Clanker. The token IS the
games' name + its economy.

Contract is on Base at 0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07.
Empire address is 0xe0faa499d6711870211505bd9ae2105206af1462.
Liquid since day one.

Mechanism-forward. Not hype. The math + the contract are the pitch.
```

---

# 4. WaveWarZ

## Tyler memento copy

**Logo:** WaveWarZ arcade mark (loud, sports-energy)

**One-liner:** Music battle prediction markets.

**Tagline:** Artists battle head-to-head. Wallets trade on outcomes. Settled on-chain.

**Mission:** WaveWarZ treats independent artists like sports teams - turns music discovery into a market with real skin in the game. Artists earn from engagement, not from streams. 1% of every trade flows to the artist forever via smart contract, no custody.

**Who it serves:** Music fans who want stake in artist discovery. The 40+ battling artists themselves. Traders looking for a real-signal market on cultural taste. Builders pitching for ZABAL Gamez who want to compose with the protocol.

**What's live now:** v1 LIVE on Solana - real-time numbers at wavewarz-intelligence.vercel.app. Snapshot from 2026-05-23: 400+ SOL cumulative volume, hundreds of battles, 40+ artists registered (current count + volume always at wavewarz-intelligence.vercel.app). ~11 X Spaces per week (5 morning + 5 night Mon-Fri + Sunday-night). v2 IN BUILD on Base - agentic version by Sam, smart contracts reviewed by Arthur (Neynar). Mainnet target July 2026. Founder: Hurric4n3Ike.

**How it fits ZABAL Gamez:** WaveWarZ-Base is the August Finals settlement protocol. Each Finalist becomes a tradable battle entry. Market trades for 72 hours - early demos, repos, casts, judge-agent scores all feed the signal. Smart contract settles placements at T+72h. Respect-holders get a voice in the settlement formula. Doc 720 has the full mechanic.

**Watch the deep-dive video:** [Zaal's video - 90s]

**Learn more / participate:**
- v1 live: wavewarz-intelligence.vercel.app
- v2 codebase: github.com/CandyToyBox/wavewarz-base
- Founder: @hurric4n3ike on X
- Finals mechanic spec: zabalgamez.com/finals + Doc 720

**Earned badge:** "WaveWarZ Trader"

## Zaal video script (90 sec)

```
WaveWarZ is music-battle prediction markets.

Indie musicians have one of the worst engagement-to-revenue ratios
in any industry. Spotify pays fractions of a cent per stream.
TikTok pays attention but not money. WaveWarZ flips it.

Artists battle head-to-head. Wallets trade on the outcomes. 1% of
every trade flows to the artist forever via smart contract. No
custody. The artist is the asset, the listener is the trader, the
market is the discovery engine.

v1 has been live on Solana for over a year. Built by Hurric4n3Ike.
Snapshot from late May 2026: 400+ SOL cumulative volume, hundreds
of battles, 40+ artists registered. Current live numbers always at
wavewarz-intelligence.vercel.app. About 11 X Spaces per week as the
live arena.

v2 is being built on Base right now. Agentic version. Sam is
shipping the contracts. Arthur from Neynar is reviewing security
patterns. Mainnet target July 2026.

Here is why this matters for ZABAL Gamez: WaveWarZ-Base is the
settlement protocol for the August Finals. Each Finalist becomes a
tradable battle entry. The market trades for 72 hours - on early
demos, on repo activity, on cast quality, on judge-agent scores.
Smart contract settles placements at T+72h. Respect-holders have
weight in the settlement formula. Real economic signal decides
who wins, not just a vote.

Music as market. Building as market. Same protocol. The arena is
the deliverable.
```

---

# 5. ZAO Festivals + ZAOstock

## Tyler memento copy

**Logo:** ZAO Festivals umbrella + ZAOstock chapter mark (Maine-local visual layer)

**One-liner:** Curated, paid, no pay-to-play indie festivals.

**Tagline:** Respect artists as artists, not content units. ZAOstock is the first.

**Mission:** ZAO Festivals is the IRL arm - the production layer for independent artist festivals. ZAOstock is the inaugural festival. Mission: respect artists as artists, not content units. Booked stage. Real pay. Venue infra handled. Built around indie Maine + Northeast artists frustrated by pay-to-play circuits + Spotify economics.

**Who it serves:** Independent Maine + Northeast US artists with a real live set, who want a booked stage with venue infra handled. Community that values warm operational competence over hype.

**What's live now:** ZAOstock 2026 active - **October 3, Franklin Street Parklet, Ellsworth Maine**. 5+ artists confirmed across different genres (final lineup still locking in). Full day + livestream + after-party. `/stock/team` dashboard for kanban-based ops. Lean Six Sigma DMAIC weekly cycles. 20+ people across 6+ different teams. Confirmed sponsors: Wallace Events (tents/AV), Limone. ZAO Festivals umbrella holds ZAO-PALOOZA (NYC 2024) + ZAO-CHELLA (Miami 2024) as prior chapters. NextZAOville planned DMV July 2026.

**How it fits ZABAL Gamez:** The $500 v0 prize pool for ZABAL Gamez is sponsored by The ZAO Festivals team. They funded the pool because they want indie artists in the games + the games' winners flowing into next year's festival lineup. Builders who ship festival-ops tools, lineup management, livestream infra, or artist-booking pipelines have a built-in customer in ZAOstock.

**Watch the deep-dive video:** [Zaal's video - 85s]

**Learn more / participate:**
- Festival overview: thezao.com/festivals
- ZAOstock 2026: 172-day build, Oct 3 in Ellsworth Maine
- Sponsor inquiries: info@thezao.com
- Telegram operations: @ZAOstockTeamBot

**Earned badge:** "ZAOstock Patron"

## Zaal video script (85 sec)

```
ZAO Festivals is the IRL arm. ZAOstock is the inaugural festival.

The premise. Music festivals have a pay-to-play problem. Most
festivals make indie artists pay to perform - or charge fees that
mean playing is net negative. We were not okay with that. So we
built our own production layer for festivals where artists get a
booked stage, real pay, venue infrastructure handled. Respect
artists as artists, not as content units. That is the line.

ZAOstock 2026 is Friday October 3 at Franklin Street Parklet in
Ellsworth Maine. 5+ artists confirmed across different genres, full
lineup still locking in. Full day plus livestream plus after-party.
We run the build with Lean Six Sigma DMAIC weekly cycles because
indie festival ops without a system collapses fast. 20+ people
across 6+ teams - Ops, Finance, Design, Music, and others.
Wallace Events on tents and AV. Limone supporting.

ZAO Festivals also holds the umbrella for chapters that already
happened. ZAO-PALOOZA at NFT NYC 2024. ZAO-CHELLA at Miami Art
Week 2024. NextZAOville in the DMV in July 2026.

Here is the ZABAL Gamez connection. The $500 USDC v0 prize pool
for the games is sponsored by the ZAO Festivals team. They funded
the pool because they want indie artists building tools for next
year's festival operations. If you ship something for ZAO Festivals
in July - lineup pipelines, livestream infra, ops tooling - your
build has a real customer waiting.

We are bringing the festival economy back to the artists. One
parklet at a time.
```

---

# 6. ZAO Music

## Tyler memento copy

**Logo:** ZAO Music wordmark (ZAO umbrella visual)

**One-liner:** A label that doesn't take the label tax.

**Tagline:** Distribute via DistroKid. Split royalties on-chain. Keep the margin with artists.

**Mission:** ZAO Music proves the label-less model. Members release together. Distribution via DistroKid to all DSPs. Royalty splits onchain via 0xSplits on Base. Performance rights via BMI. The margin stays with the artists. No A&R skim. No 80/20.

**Who it serves:** ZAO members who have shipped music before + are ready to release. Members collaborating on cyphers + collaborative tracks. Anyone who has rejected the major-label deal model.

**What's live now:** First release in progress - Cipher = #1 (multi-artist collaborative cypher). Team: DCoop, GodCloud, Iman. DBA entity. Flow: members record -> DistroKid to DSPs -> 0xSplits royalty contract on Base -> BMI performance rights -> cross-post to /music + /rcrdshp on Farcaster.

**How it fits ZABAL Gamez:** Builders shipping release pipelines, royalty-split dashboards, distribution trackers, or cypher coordination tooling have ZAO Music as their first customer. Mentors include label-experienced ZAO members who can pair on music infra builds.

**Watch the deep-dive video:** [Zaal's video - 70s]

**Learn more / participate:**
- ZAO Music team: DCoop, GodCloud, Iman
- 0xSplits on Base: how royalty splits actually settle
- First release: Cipher = #1 (in production)

**Earned badge:** "ZAO Music Curator"

## Zaal video script (70 sec)

```
ZAO Music is the label that doesn't take the label tax.

The whole thing started because - what does a label actually do for
an indie artist in 2026? Distribution? DistroKid does that for $44.99
a year. Performance rights? BMI registers you for $250 once. Royalty
splits? 0xSplits on Base settles automatically, costs gas, takes no
fee. The whole label stack costs less than your monthly DSP payout.

So ZAO Music is the artist collective version. Members record
together. Distribution flows DistroKid to every DSP. Royalty
contracts get deployed on Base via 0xSplits. BMI registers
performance rights. The margin stays with the artists.

First release is Cipher = #1 - a multi-artist collaborative cypher.
Team running it is DCoop, GodCloud, and Iman.

For ZABAL Gamez builders: if you ship release pipelines, royalty
dashboards, distribution trackers, or cypher coordination tools,
ZAO Music is your first customer. Music infra mentors in our
mentor pool. Real product, real artists, real revenue split.

Proving the label-less model. That is the whole point.
```

---

# 7. COC Concertz

## Tyler memento copy

**Logo:** COC Concertz brand mark (distinct from ZAO umbrella - own colors / vibe)

**One-liner:** Virtual concerts, run by promoters who care.

**Tagline:** A real home for streamed + metaverse shows.

**Mission:** COC Concertz gives virtual concerts a real home. For the streamed + metaverse shows + the promoters who run them. Promoter-first. Audience-first. Newsletter-first content pipeline.

**Who it serves:** 13+ active concert promoters + the audiences who attend virtual + metaverse concerts.

**What's live now:** 5 COC Concertz shows produced to date. COC Concertz #6 going live Saturday June 13 at 4pm EST at Stilo World Spatial - the 6th show. Next.js 16 + Firebase + Cloudinary stack. Surfaces: `/portal/newsletter` (newsletter builder), `/stage` (concert stream interface), `/team` (promoter dashboard). Content pipeline: record show -> Descript edit -> newsletter generator (MiniMax AI) -> cross-post. COC Concertz #3 ran March 2026 - metaverse concert with DUO DO, JOSEPH GOATS, STILO WORLD.

**How it fits ZABAL Gamez:** Builders shipping concert streaming tools, content-pipeline automation, promoter dashboards, ticketing / RSVP flows, or metaverse concert UX have COC Concertz as their built-in test customer. Also - one of the August Finals reveal events could be a COC concert format. Promoter mentors in our mentor pool.

**Watch the deep-dive video:** [Zaal's video - 70s]

**Learn more / participate:**
- COC Concertz #6 Lu.ma: luma.com/njzxpsgn (June 13 at Stilo World Spatial)
- Newsletter builder: /portal/newsletter
- Promoter contact: through the COC Concertz team

**Earned badge:** "COC Concert Goer"

## Zaal video script (70 sec)

```
COC Concertz gives virtual concerts a real home.

Most virtual concerts feel like an afterthought. Streamed to a
random YouTube channel. Linked from a discord. Forgotten next day.
COC Concertz is the opposite - a real promoter network with 13+
active organizers running streamed + metaverse shows + a content
pipeline that turns each one into a permanent newsletter, clips,
and audience-building artifact.

5 shows produced to date. Number 6 going live Saturday June 13 at Stilo World Spatial. Stack is Next.js 16, Firebase, Cloudinary.
Promoter dashboard at /portal. Stream interface at /stage.
Newsletter builder generates YouTube descriptions using MiniMax AI
- one of the cleaner uses of AI in music ops I have seen.

COC Concertz number 3 ran in March 2026 - a metaverse concert with
DUO DO, JOSEPH GOATS, and STILO WORLD. Number 6 is Saturday June 13
at 4pm Eastern at Stilo World Spatial. luma.com slash njzxpsgn for
RSVP.

For ZABAL Gamez builders: if you ship concert streaming tools,
ticketing flows, promoter dashboards, or metaverse concert UX -
COC has 13 promoters who would adopt your build week one. Real
audience, real shows.

Virtual concerts deserve a real home. We are building it.
```

---

# 8. Respect + Fractals

## Tyler memento copy

**Logo:** Respect mark (Fibonacci motif)

**One-liner:** Soulbound reputation earned, not bought.

**Tagline:** Governance as practice, not theory. Reputation with real weight.

**Mission:** Respect is The ZAO's soulbound, peer-validated reputation. Fractals are the weekly group ritual where members rank contributions and earn it. Mission: governance as practice - reputation you earn by showing up + contributing, not by buying tokens. The thing that gives you a real voice in The ZAO.

**Who it serves:** All ZAO members. Earning Respect is how you go from member to governance participant. Earning enough Respect is how you become eligible to vote in ZABAL Gamez Finals settlement.

**What's live now:** Live as core governance mechanic. Soulbound (non-transferable). Fibonacci-ranked. Weekly 4-6 person fractal sessions where members rank each other's contributions for the week. `src/components/respect/` in ZAO OS. Respect-above-threshold = eligible to vote on Finals. Threshold: 1000+ points (set May 2026, may shift). 66% supermajority required to change the governance system itself.

**How it fits ZABAL Gamez:** Respect-holders are the voter set for the August Finals. Each Finalist's settlement has Respect-holder governance weight feeding into the WaveWarZ-Base market formula. Up to 1000 Respect points are earnable per active participant during the Games - workshop attendance, July submissions, August Finals participation. Current ZAO holders determine activity scoring. Respect is illiquid - cannot sell. Pure governance signal.

**Watch the deep-dive video:** [Zaal's video - 80s]

**Learn more / participate:**
- ZAO OS Respect leaderboard: live in the app
- Weekly fractal sessions: 4-6 person groups, Sunday evenings
- Voter threshold for ZABAL Gamez: 1000+ points

**Earned badge:** "Fractal Participant"

## Zaal video script (80 sec)

```
Respect is The ZAO's soulbound, peer-validated reputation. Fractals
are how you earn it.

Most onchain reputation is buyable. We thought that was the wrong
shape. Respect is soulbound - non-transferable, illiquid. You cannot
sell it. You cannot trade it. You earn it by showing up to weekly
fractal sessions where 4 to 6 ZAO members sit together and rank each
other's contributions for the week. Fibonacci-ranked, so the rare
top contributions count more than the routine ones.

That is what we mean by governance as practice. It is not a Discord
poll. It is not a token vote. It is humans ranking humans in real
time on actual work.

Threshold for voting in ZABAL Gamez Finals - 1000 Respect points.
Set in May 2026, may shift as the event unfolds. If you have 1000
plus, you also have a vote on changing the governance system itself
- 66% supermajority needed.

For ZABAL Gamez specifically. Up to 1000 Respect is earnable per
active participant during the Games. Workshop attendance, July
submissions, August Finals - all count. Current ZAO Respect-holders
determine who counts as active. That is by design - active members
decide who else is active.

You earn governance. You do not buy it. That is the line.
```

---

## Production checklist for Zaal (recording the videos)

8 videos at 60-90 seconds each = ~10 minutes total recording time. Spread across 2-3 sittings to keep voice fresh.

| Item | Status |
|---|---|
| Read each script once silently to internalize | TBD |
| Record in Riverside or QuickTime, mic at desk | TBD |
| One take per brand, no edits unless cut required | TBD |
| Light edit in Descript: remove uh / um / repeats | TBD |
| Upload to Magnetiq as media file per memento | TBD |
| Send Tyler the 8 video files + the URLs once live | TBD |

## Production checklist for Tyler (Magnetiq mementos)

8 mementos, one per brand. Each gets:

| Item | Source |
|---|---|
| Logo / visual mark | Magnetiq brand asset library + ZAO docs/brand-context.md |
| One-liner, tagline, mission, audience, status | This doc (sections above) |
| ZABAL Gamez bridge copy | This doc |
| Video file | Zaal sends after recording |
| Earned badge | Magnetiq's badging system - badge name suggested above |
| Links to live surfaces | This doc |

## Distribution plan

- Mementos live on Magnetiq under a ZABAL Gamez season landing page
- Each memento accessible via Zabal connector NFT (after mint)
- Connector-holders complete a memento (watch + read) -> earn brand badge
- Site links from `/info` ecosystem grid -> direct deep-link to each brand memento on Magnetiq
- August Finals reveal stream features clips from each video as bumpers

## Voice rules (every brand video)

- No emojis (spoken or written)
- No em-dashes (use hyphens, you naturally use them)
- "Digital creators" framing, not "web3 native" or "crypto only"
- "100+" for ZAO size, never a specific number unless verified
- Brand spellings exact: WaveWarZ (capital Z), COC Concertz (z not s), Magnetiq (q not c), BetterCallZaal (camelCase), Thy Revolution, Joseph Goats
- Builder-energy + warmth. Drop articles when terse helps. End with the line that matters.
- Each script ends on a single takeaway sentence in your voice.

## Reference docs

- `docs/brand-context.md` - the full brand spine for each ZAO brand
- `docs/brand-kit-2026-05-28.md` - voice + glossary + asset inventory
- `llms.txt` - the AI-readable context bundle (for fact verification)
- `docs/risk-register-2026-05-28.md` - what could go wrong with this stack

## When this lands

- Zaal records all 8 videos this week
- Tyler builds all 8 mementos in Magnetiq this week (or however his cadence works)
- Site links to Magnetiq mementos go live alongside Workshop #001
- Connector NFT mint flow goes live with Workshop #001 too
- ZABAL Gamez announce post on /zabal references the mementos as the "go deeper" surface for curious watchers

---
topic: events
type: research
status: research-complete
last-validated: 2026-06-14
related-docs: newsletter-week1-2026-06-08-FINAL.md, newsletter-week2-2026-06-15.md, workshop-media-tracker.md, workshop-1-empire-builder-recap-2026-06-04.md
original-query: "everything ZABAL Gamez Week 1 and Week 2 - all session details, recaps, guests, takeaways, media status. Goal: prep the newsletter. Start with the Week 1 recap already in this repo, then gather all details we can get for both weeks."
tier: STANDARD
---

# Newsletter prep - ZABAL Gamez Weeks 1 and 2 (every session, every detail)

> Goal: one place that holds every Week 1 and Week 2 session with the guest, handle, org,
> date, track, topic, takeaways, links, and media status - so both weekly newsletters can
> be finalized without re-digging. Source of truth = `data/recaps.json`, `data/workshop-leads.json`,
> `docs/workshop-media-tracker.md`, and the live `/recordings/N` pages. Guest/org enrichment
> below the session tables is web-researched (Sources at the end). Brand: no emojis, no em dashes.

## Key facts up top

| What | Detail |
|---|---|
| Event | ZABAL Gamez - The ZAO's 3-month Build-A-Thon. June workshops, July open build, August Finals. |
| Tracks | artist (musical/visual), builder (developer/aspiring), creator (media/distribution). |
| Week 1 | Jun 1-7. 5 ZABAL Gamez sessions recorded + the full Farcaster Batches week (GM Farcaster) captured. |
| Week 2 | Jun 8-13. 6 sessions (Sopha, Joseph Goats, Will T, Cassie, Adam Miller, WaveWarz) + 2 new site features (/speakers, comments+likes). |
| Newsletters | Week 1 drafted + FINAL (`newsletter-week1-2026-06-08-FINAL.md`). Week 2 drafted (`newsletter-week2-2026-06-15.md`, send Mon Jun 15). |
| The gaps | Joseph Goats (/6) + Will T (/7) transcripts unprocessed; Adam Miller page not built; Cassie video in parts; several guest OK'd sign-offs unlogged. |

---

## WEEK 1 (Jun 1-7) - "we hit Start"

Every Week 1 ZABAL Gamez session is delivered with a page + transcript; the first three also
have YouTube cuts.

| # | Page | Session | Guest | Handle | Org | Date | Track | Video |
|---|---|---|---|---|---|---|---|---|
| 01 | /recordings/1 | Empire Builder V3 (Pt 1) - Don't launch a token yet | yerbearserker (Jordan) | @yerbearserker | Empire Builder | Jun 1 | builder | youtu.be/Ej7Wm-v6WXo |
| 02 | /recordings/2 | Empire Builder Part 2 - live build | yerbearserker (Jordan) | @yerbearserker | Empire Builder | Jun 1 | builder | youtu.be/RXYTCHRh_rY |
| 03 | /recordings/3 | Bonfire + the ZABAL Bonfire bot | Joshua.eth + Plat0x | @joshuaeth / @plat0x | Bonfire | Jun 1 | builder | youtu.be/3jKfYdOYxSw |
| 04 | /recordings/4 | Starting and growing your livestream | Ohnahji | @ohnahji | - | Jun 2 | creator | youtu.be/VsSLEF8O9yI |
| F1 | /recordings/fireside/1 | Bonfire fireside + vibe-coding masterclass | Carlos (Plat0x) | @plat0x | Bonfire | Jun 6 | builder | transcript only |
| Z1 | /recordings/zao/1 | ZAO Fractal weekly intro | Zaal | @bettercallzaal | The ZAO | Jun 1 | builder | transcript only |

### Week 1 session takeaways

**01/02 Empire Builder V3 - yerbearserker (Jordan)** (full recap: `workshop-1-empire-builder-recap-2026-06-04.md`)
- The thesis: "The token is not the foundation, it's the amplifier." Do not launch a token until the ecosystem can carry it. Token-first launches spike, get extracted, collapse.
- Triple-A framework: Assemble (build the harness, no token) - Affirm (tactical generosity: reward your real, active people, including via Farcaster social-graph leaderboards) - Ascend (launch the token as an event, later).
- Empire V3 stack: treasury (0xSplits audited contracts), multi-chain (Base, Arbitrum), leaderboards, boosters (NFT holdings / token thresholds / staking), distribution (airdrops, USDC, NFTs, raffles), staking that boosts leaderboard standing (not passive yield, to avoid looking like a security), and bring-your-own-model AI skills.
- Three tiers: Assembled (tokenless, full stack), Awakened, Ascended (~40 boosters, launch token through Empire).
- Proof live on the call: stood up a tokenless ZABAL Gamez empire (`empirebuilder.world/empire/zabalgamez01e9af`), ran a live raffle airdrop to top DotA NFT holders, added a $ZABAL booster on the spot (10M min, 3x), funded from treasury.
- Credibility: 5,761+ empires created, two part-time founders, zero external funding, V3 launched at FARCON Rome, partnered with Clanker. Values: "Symbiotic not parasitic. Generative not extractive."
- Also present: Adrian / Diviflyy (co-founder, CTO).

**03 Bonfire + the ZABAL Bonfire bot - Joshua.eth + Plat0x**
- Bonfire is the ecosystem's shared memory - the layer bots and builds sit on top of. A group grows a knowledge graph just by using its agents, and the curators own it.
- "Curation is the last scarce asset" - structured taste and knowledge stay unique and yours.
- The ZABAL Bonfire bot is live and queryable, so anyone joining mid-season can catch up in minutes.

**04 Starting and growing your livestream - Ohnahji**
- Opened the creator track. How he found his people and built an audience while building everything else.
- Lesson: consistency beats production value - you grow by showing up.

**F1 Bonfire fireside / vibe-coding masterclass - Carlos (Plat0x)**, the dev behind Bonfires. Builder-track lessons:
- Plan, then goal: give your agent a plan plus one goal with a measurable threshold (e.g. under 5s query latency) so it works until it hits the number.
- Diagram Bob and Alice before writing code - define the exchange and sequence first, language last.
- Prompt types first; use a protocol/adapter contract so you can swap the database later without a rewrite.
- Documentation as code: strip the code and the docs alone should rebuild it 1:1.

**Z1 ZAO Fractal weekly intro - Zaal** - internal ZAO intro, transcript + page live, no Luma.

### Week 1 - Farcaster Batches (GM Farcaster), all week

A week-long builder showcase organized by Jub Jub, hosted by GM Farcaster (Adrienne / Adriene + Nounish Prof). ZABAL Gamez added a summary + full transcript per day. GM Farcaster owns the videos. Throughline: "build the thing you want to see in the world."
- Day 1 (Jun 1): Chris Dolinsky (Vini App), Kenny (POIDH - the $30,000 kickflip world record), Nikki Sapp (Juke), Jonathan Colton (Founder Check + Fotocaster), Dr. Deeks (mini apps). gmfarcaster.com/episodes/Batches1
- Day 2 (Jun 2): live Founder Check workshop - Jonathan walked Kenny through the four pillars (who you build for, the problem, reach, ease of sale); "everything is downstream of who." Batches2
- Day 3 (Jun 3): Zaal brought ZABAL Gamez, alongside Empire Builder, AZ Flynn (Defense of the Agents), Cashless Man (Booster), Duckfax (Celebration Hub). Batches3
- Day 5 (Jun 5): Node (DEKEY), Max (POWER), Toady Hawk (betrmint), Darko (Runner). Batches5

### Week 1 media status (from `workshop-media-tracker.md`)
- 01/02/03 - fully shipped (thumbnail, transcript, page, YouTube). Gap: log the guest OK'd sign-off.
- 04 Ohnahji - YouTube + transcript live; no Canva thumbnail (uses default).
- F1 Carlos fireside - transcript + page live; no Luma, no thumbnail, no YouTube cut (X Space recording).
- Z1 Zaal Fractal - transcript + page live; thumbnail + YouTube optional.

---

## WEEK 2 (Jun 8-13) - "the run"

| # | Page | Session | Guest | Handle | Org | Date | Track | Status |
|---|---|---|---|---|---|---|---|---|
| 05 | /recordings/5 | Building Sopha, and why curation is needed | Chris | @chriscocreated | Sopha | Jun 8 | artist | transcript + page live; no YouTube cut yet |
| 06 | /recordings/6 | Owning your music as an independent artist | Joseph Goats | @josephgoats | - | Jun 9 | artist | PLACEHOLDER - transcript + video unprocessed |
| 07 | /recordings/7 | Building KFMEDIA | Will T of Web3 | @willtofweb3 | Kingfishers Media | Jun 10 | creator | PLACEHOLDER - transcript + video unprocessed |
| - | (WIP Meetup) | ZABAL Gamez + ecosystem tour (ZAO Fractals) | Zaal | @bettercallzaal | WIP Meetup | Jun 11 | builder | external meetup; recording capture |
| 09 | /recordings/9 | The Farcaster protocol, ins and outs | Cassie | @cassie | Quilibrium | Jun 12 | builder | full transcript live; video in 4 parts pending |
| - | (page pending) | Talking miDAO + Beta Briefing | Adam Miller | @adammiller | MiDAO | Jun 12 (5:45pm) | builder | transcript cleaned; page builds once video link lands |
| 08 | /recordings/8 | Earn from music battles, not streams: WaveWarz | Hurricane Ike | @hurric4n3ike | WaveWarz | Jun 13 | artist | video + transcript + chapters LIVE (youtu.be/2GLRrILYoo4) |

### Week 2 session takeaways

**05 Building Sopha - Chris (@chriscocreated, sopha.social)**
- Sopha is a Farcaster client built for depth and high signal - an intentional "third place" for the writing and art that scrolls past the main feed.
- The case: curation is the point. (Artist track; transcript + recap live, video cut still owed.)

**06 Owning your music as an independent artist - Joseph Goats (@josephgoats)** - PLACEHOLDER
- Topic per the lead: releasing your work, owning your masters and your audience, turning listeners into a community that pays you directly, all on Farcaster.
- Joseph Goats is a Farcaster-native independent musician (rebranded from "Jose"; brand spelling is Joseph Goats). No external web index found - his presence is on Farcaster. The real recap needs the transcript processed.

**07 Building KFMEDIA - Will T of Web3 (@willtofweb3)** - PLACEHOLDER
- KFMEDIA = Kingfishers Media (kingfishersmedia.io), an education-focused web3 org: "inspire, excite, educate, motivate people to support the regeneration of knowledge."
- Programs: social-audio broadcasts/AMAs, live education + AI tutoring, "Learn for Impact" (impact tokens to learners), "Pathways for LATAM" (grassroots tech education), Education Passport mentorship, NFT collectibles. Distributes across Farcaster, Base App, X; partners with Gitcoin Grants + Giveth. GitHub org `KingfishersMediaLLC` (LearntoEarn + a DLMS learning-management studio).
- Session angle: building a media company in public - what he is building, how, and the lessons so far. Real recap needs the transcript.

**09 The Farcaster protocol, ins and outs - Cassie / Cassandra Heart (@cassie, Quilibrium)** (full recap already in `recaps.json`)
- The deepest technical talk of the season so far. Snapchain (Farcaster's shard-based BFT data layer) and its two centralization problems: the validator set is mostly Neynar today, and you can't build a real client straight off Snapchain.
- Hypersnap = her additive side chain: threshold ECDSA via MPC, the Snap token, gasless bridging to any EVM chain, without breaking Snapchain. Consensus: Malachite/Tendermint, 1-second blocks.
- External anchors: OP Mainnet ID/storage/key/FNAME registries; new gasless signers (born from a real signer-compromise incident).
- Five North Stars to a million daily actives: a real query layer (done), a template+SDK for clients, channels/curation as first-class, protocol-level mini app discovery, native monetization. Chief goal: make a Farcaster client buildable in a weekend.

**Adam Miller - Talking miDAO + Beta Briefing (@adammiller, midao.org)** - page pending
- Two worlds: MIDAO (the Marshall Islands legal framework that lets a DAO - or now a decentralized AI agent - become a real legal entity) + Beta Briefing (his agentic daily-news tool). Legal structure meets agentic engineering.
- MIDAO facts (web): official partner of the Republic of the Marshall Islands; forms DAO LLCs (for-profit + non-profit), Series DAO LLCs, and AI-agent legal entities ("future-proof legal wrapper for AI-driven organizations and autonomous systems"). Standard incorporation ~$9,500, annual ~$2,000-5,000. Adam Miller is founder/CEO, "serial entrepreneur, DAO legal pioneer," host of the JustDAOit! podcast. Beta Briefing is Farcaster-native (no web index found - detail from the session).

**08 Earn from music battles, not streams: WaveWarz - Hurricane Ike (@hurric4n3ike)** (full recap in `recaps.json`, page LIVE)
- Head-to-head music battles where people buy and sell on the competing tracks like stocks; the artist earns 1% of every trade on their side. Engagement, not streams. One artist earned ~0.5 SOL in minutes of a single battle.
- Live chart scoring makes a battle a game; nightly 8:30pm EST quick-battle queue (0.05 SOL to queue); community battles in any format (music, roast, cooking) with automated split payouts. Artists keep masters, IP, audience. 500+ SOL volume, 40+ artists, built on Solana.

### Week 2 - two new site features (newsletter beats)
- /speakers - the public directory: every speaker and exactly what they delivered (recording, transcript, video), names link to profiles.
- Comments + likes on every recording - Farcaster-verified; drop a thought or ask a question under any recording and the speaker can answer. (Casts-as-comments path is built; goes fully live when the Neynar key + a cast_hash are set.)

### Week 2 media status
- 05 Sopha - transcript + page live; no YouTube cut, no thumbnail.
- 06 Joseph Goats / 07 Will T - placeholder pages; process recording -> transcript -> thumbnail -> YouTube. The new `scripts/ingest-recording.mjs` (PR #224) publishes both in one command once transcripts land.
- 08 WaveWarz - fully live (video + transcript + chapters).
- 09 Cassie - transcript live; 4-part video cut in progress (players drop onto /recordings/9 as they go up).
- Adam Miller - transcript cleaned; page builds once the video link arrives.

---

## What is pending before each newsletter is "done"

Week 1 (`newsletter-week1-2026-06-08-FINAL.md`) - already FINAL and structurally complete. One brand fix to verify before/if re-sending: it references "Jose Cabrera opens the artist track" in the Next Week block - per the glossary this guest is now **Joseph Goats** (rebranded from Jose). Update if the doc is reused.

Week 2 (`newsletter-week2-2026-06-15.md`, send Mon Jun 15) - body is paste-ready. Open items:
1. Joseph Goats (/6) + Will T (/7) - transcripts + video still to process; newsletter currently links the placeholder pages (acceptable) or hold their lines until processed.
2. Adam Miller page - lands once the video link is sent; newsletter says "page lands this week."
3. Cassie video - parts drop onto /recordings/9 as cut.
4. Subject line - pick one and publish to paragraph.com/@thezao.

Cross-cutting (from `workshop-media-tracker.md`):
- Stage 4 "OK'd" guest sign-offs are unlogged across the board - log dates as they come.
- Thumbnails missing: Ohnahji (04), Sopha (05), fireside (F1), ZAO Fractal (Z1) - 04 + 05 first.
- YouTube cuts owed: Sopha (05); decide on fireside (F1) + ZAO Fractal (Z1).

---

## Week 3 - what is coming (for the Week 2 "tap in live" block)

From `workshop-leads.json` + `workshop-media-tracker.md` (all have live Luma events):
- Kenny (POIDH) - POIDH + finalize the Best ZABAL Gamez Ad bounty, launch the next - Mon Jun 15, 4pm EST - luma.com/9ylnwvyx
- Chris Dolinsky (Vini App) - Mon Jun 15, 4:45pm EST - luma.com/tip89eq3
- diviflyy (Empire Builder V3 convo) - Tue Jun 16, 12pm EST - luma.com/kaz6hnm4
- Dr. Jake (Growth through foundations) - Tue Jun 23, 6pm EST - luma.com/6svi31dy
- Jub Jub (Farcaster Batches fireside) - Sat Jun 20, 8am EST - luma.com/c621slze
- Ali Tiknazoglu (Previbecoding) - Sat Jun 20, 11am EST - luma.com/nlgib8tl
- Dan Singjoy (Eden Fractal + fractal ecosystem) - Sat Jun 20, 12pm EST - luma.com/tmcmw3o9
- Adrienne (GM Farcaster - building Warpee.eth) - Tue Jun 30, 11:30am EST - luma.com/jlv50mcu
- Aziz / MotoMoto (BAD DAO) - Non-Dev to Shipped (Baraza Protocol) - confirmed Jun 14
- Whole calendar: luma.com/zao

Confirmed-but-undated (lock a date to schedule): Tyler Stambaugh (Magnetiq), Thy Revolution (2 sessions), Duo Do, Jonathan Colton (2 talks), kmac.eth, Plat0x (own builder session).

---

## Next Actions

| Action | Owner | Type | By when |
|--------|-------|------|---------|
| Process Joseph Goats (/6) + Will T (/7): run `scripts/ingest-recording.mjs` once transcripts are in hand | Zaal -> Claude | Build | When transcripts land |
| Build Adam Miller page when the video link arrives | Zaal -> Claude | Build | This week |
| Pick the Week 2 subject line + publish to paragraph.com/@thezao | Zaal | Publish | Mon Jun 15 |
| Fix "Jose Cabrera" -> "Joseph Goats" if Week 1 newsletter is reused | Zaal | Edit | If reused |
| Log guest OK'd sign-offs as they come in (`okd` in recaps.json + media tracker) | Zaal | Tracking | Ongoing |
| Make Canva thumbnails for Ohnahji (04) + Sopha (05) first | Zaal | Design | This week |

## Sources

- `data/recaps.json`, `data/workshop-leads.json`, `data/people.json` (this repo) - [FULL]
- `docs/workshop-media-tracker.md`, `docs/workshop-1-empire-builder-recap-2026-06-04.md`, `docs/newsletter-week1-2026-06-08-FINAL.md`, `docs/newsletter-week2-2026-06-15.md` - [FULL]
- [midao.org](https://midao.org) - MIDAO / Adam Miller, DAO + AI-agent legal entities, pricing - [FULL]
- [kingfishersmedia.io](https://www.kingfishersmedia.io) - KFMEDIA programs + mission - [FULL]
- [github.com/KingfishersMediaLLC](https://github.com/KingfishersMediaLLC) - KFMEDIA repos (LearntoEarn, DLMS) - [PARTIAL - org page only, repos not deep-read]
- Joseph Goats (@josephgoats) - Farcaster-native artist; no external web index, [farcaster.xyz/josephgoats](https://farcaster.xyz/josephgoats) returns a JS shell to WebFetch - [FAILED - escalate via the Farcaster app / Neynar for bio; session transcript is the real source]
- Adam Miller "Beta Briefing" - no web index found; Farcaster-native tool, detail from the session - [FAILED - tried WebSearch; use the session transcript]

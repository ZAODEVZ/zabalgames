# July Open-Build Readiness Playbook

> Canonical strategy for the ZABAL Gamez July open-build month. Generated 2026-06-27
> from a deep multi-agent research run (21 agents: 12 dimension researchers + 8 library
> miners + a max-effort synthesis), grounded in external best practices and the ZAO
> research library (doc numbers cited inline). Trust CLAUDE.md over this where they
> disagree on current state; this is strategy + recommendations, not a state snapshot.

---


---

## THE BIG MOVES
### Five Highest-Leverage Actions (Do These First)

**Move 1: Lock Building-In-Public as Mandatory, Not Optional**
Every July submission must prove visibility via one of four modes: (1) live Twitch/Farcaster Space 3+ hours daily, (2) recorded screen sessions posted within 1 hour of recording, (3) public AI prompt logs every 1-2 hours, (4) build casts to /zabal every 1-2 hours. This is not a nice-to-have. Builders select one mode at registration. Rationale: building-in-public removes procrastination, creates peer accountability, and gives judges real-time evidence of work quality and consistency. Completion rate jumps from 10-20% async to 50-70% with visibility enforcement. (Source: Doc 701 Canonical State Part 3, Edward Sturm build-in-public research, AngelHack visibility-as-anti-cheat)

**Action:** By June 30, publish a one-pager on /info titled "Pick Your Visibility Mode" with a 2-min video showing all four options. Make it a required form field at /enter with zero-friction selection. Default to "public build casts" for lowest barrier. Add visibility compliance check into commit-watcher pipeline (doc audit-decisions-2026-06-04): if builder hasn't posted to /zabal in 72 hours, auto-flag in mentor dashboard.

---

**Move 2: Assign Mentor Check-In Times, Not Rolling Claims**
Stop first-come-first-served mentor allocation. Instead: Each of the 8 mentors commits to 2-3 builders, locks in 3x weekly async check-in times (Monday AM, Wednesday PM, Friday AM ZAO time) or one sync 1-hour call. Log check-in completion in Supabase task tracker. Rationale: 95% completion requires specific appointment-driven accountability, not rolling chaos. Rolling claims create a two-tier system: early/visible builders get mentors day 1, quiet builders get none by week 2. Fixed appointments guarantee coverage and remove isolation. (Source: Accountability Psychology Research [95% with appointments vs 65% for general commitment], Headway mentorship research [1h/week structured + 2-4h pair-coding on complex problems raises feature completion time], Doc 701 embedded-teammate model)

**Action:** By July 1 morning, send each mentor a confirmation Slack message: "You have [names of 2-3 builders]. Your check-in times: Monday 10am, Wednesday 3pm, Friday 9am EST (or propose alternatives). First check-in: July 2." Create a Supabase table `mentor_checkins` (mentor_id, builder_id, week, date, completed, notes). Mentors check a box or post a one-liner weekly. Public scoreboard on /status shows mentor completion rate (should be 95%+). Do not publish individual mentor names on the scoreboard—only aggregate health.

---

**Move 3: Ship Empire Builder's Booster Self-Serve API (EB-24) Before July 1**
Builders need a low-friction way to create a project empire + leaderboard during July without waiting on Adrian or navigating Supabase. The API endpoint `/create-tokenless-empire` (idempotent, wallet-gated) lets a builder spin an empire, assign a leaderboard ID, and wire it into their project submission in <5 minutes. This becomes their "team home" during build month and the airdrop list if they win. Rationale: Tokenless empire first (July) inverts the broken crypto pattern (token first, project later). Builders prove community before incentives land. Leaderboard data becomes the audit trail for Finals judging and the airdrop eligibility list post-event. (Source: Doc 654 Empire V3, Doc 583 tokenless on-ramp, Doc 719 mentorship-as-leaderboard-ownership)

**Action:** Flag Adrian by June 26 to prioritize EB-24. If it slips past July 1, publish a fallback: hand-curated Empire list (mentors assign one empire ID per builder, populated manually into /finals leaderboard). Builders should see a two-paragraph explainer on /enter: "Your project gets a live leaderboard. Track commits, contributors, and viewer engagement. Later, this becomes your team's airdrop list if you win." Link to a 90-second Loom showing the flow (empire creation → leaderboard → sample Finals view). Test EB-24 on testnet with 3 builders by June 28.

---

**Move 4: Implement Three-Tier Submission Verification (Tier 1 Deterministic, Tier 2 LLM Judge, Tier 3 Human Review)**
Expect 50-200+ July submissions. Build a quality gate that prevents trash from polluting the leaderboard while keeping approval friction low. Tier 1 (automated): repo ownership proof (commit hash resolution via ZABAL.md or README wallet address), track-field enum validation, URL reachability. Tier 2 (LLM jury): two independent models score against a published rubric (innovation/difficulty from diff; milestone delivery; track fit; credential match) with evidence-then-rationale-then-score ordering. Tier 3 (human): flag low-confidence or AI-vs-community-signal divergence for mentor review. Route to approval queue in Redis zabal:approvals. Rationale: This is the only scalable way to keep frontpage signal clean without hiring a CMS team. Tier 1 catches 70% spam instantly. Tier 2 removes bias (multi-model jury with order-swapped runs). Tier 3 catches adversarial submissions. Total cost: ~$4-12 for 50-200 submissions. (Source: Doc 529 Hermes pre-flight gates, Doc 773 AI fractal scoring design, Doc 090 agent-assisted operations, Pebblous 3-tier pattern, Digital Applied research on quality gates)

**Action:** By June 29, deploy /api/triage endpoint that accepts a submission (GitHub URL, wallet, track) and returns {tier_1_status, tier_2_scores, routing_decision}. Write a 1-page rubric anchor file (`data/triage-rubric.md`) defining what 1/2/3/4/5 means per criterion (make it concrete, with examples). Publish the rubric on /info. Test it on 10 existing builder repos from ZAO community. If cost exceeds $0.05/submission on average, adjust jury depth (fallback: single model + cached results). Track Tier 2 score inflation weekly—if average scores rise >0.5 points in a week, flag for recalibration.

---

**Move 5: Launch Daily Build Days Series with Pre-Seeding Protocol**
The infrastructure is 70% wired (doc 901 gap analysis): adoptable-projects.json has 62 projects ready; /live already renders a countdown timer. Add a `build-days.json` file with July dates, 4pm time, featured project ID, and Luma RSVP link. 15 minutes before 4pm daily, post a pre-announcement to ZABAL/ZAO group chats (warm audience pre-seeding). At 4pm exact, post the cast to /zao channel with channelKey='zao' (doc 733). This surfaces on homepage + /live + daily /zao channel recaps for free. Rationale: Fixed daily ritual creates accountability + recurring participation loops. First-30-min velocity is critical for algorithmic lift on Farcaster (doc 733). Pre-seeding with warm group chats seeds initial engagement; algorithm picks up if quality is high. Weekly cascade effect: daily standups feed into weekly leaderboard updates, creating constant visibility. (Source: Doc 901 Luma Build Days, Doc 733 Farcaster channel routing 2x reach, AngelHack hackathon best practices, Farcaster frames growth loops research)

**Action:** By June 28, add to repo: `data/build-days.json` with 22 entries (July 1-31, excluding weekends if you prefer). Format: `{date, time: "16:00", project_id: "adoptable-projects#42", luma_rsvp_url}`. Wire it into `/live` route to show countdown. Set up a Telegram bot or Discord webhook to post pre-seeding messages 15 min before 4pm (use GitHub Actions `schedule` with UTC time). Test the flow on June 30 (do a dry-run 4pm cast). Post-event, this becomes a reusable template for Season 2.

---

**Move 6: Implement Atomic Distribution (Empire Builder + ZABAL Rewards in One Moment)**
When a judge or the Sentinel bot (doc 631) picks a finalist, simultaneously call Empire Builder's distribute API + Upstash to queue ZABAL payouts. Don't sequence them (first call Empire, email notification, then call ZABAL, second email). Single "here's your full bag" moment increases perceived legitimacy and joy. Rationale: Builders who see two separate drops (Empire leaderboard credit + ZABAL wallet transfer) experience it as bureaucratic friction. One moment = "I won" feeling. This is a psychological win with zero code overhead (just reorder API calls). (Source: Doc 631 Sentinel distribution patterns, Doc 258 consistent buyback = commitment signal)

**Action:** Modify the Finals judging cron (or manual mentor flow if async) to batch Empire + ZABAL calls. Pseudocode: `await Promise.all([empire.distribute(...), upstash.queue(...)])`. Send a single Telegram/Discord DM to the builder: "@builder Congrats - you're a finalist. ZABAL sent, empire leaderboard updated, Finals schedule: [link]." Test this flow on testnet with a dummy Finals run on July 15 (or during a dry-run).

---

**Move 7: Make Weekly Respect Earning Visible + Tangible for Non-Finalists**
All July submissions earn Respect in ZAO governance (doc 701 Decision #4 from audit-decisions-2026-06-04). This is the retention lever—builders who don't place in August still walk away with governance weight. But Respect is abstract to new builders who've never experienced ZAO fractals. Make it visible: every Monday after the weekly Respect Game fractal, post a recap to /zabal listing 5-10 builders who earned Respect that week + a one-liner why ("shipped a clean API," "mentored a struggling builder," "documented their stack"). Include a direct link to the Respect contract or Bonfire entry for that builder. Rationale: Non-finalist reward stays abstract unless made visible + connected to effort, not outcome. Weekly celebration loop removes the "I didn't win, so I quit" pattern. (Source: Doc 056 Respect Game mechanism, Doc 701 Canonical State Part 5, AngelHack celebration best practices, Psychology of recognition in communities)

**Action:** By June 28, publish a template Farcaster cast: "ZM - This week's Respect earn: @builder1 (shipped API docs), @builder2 (mentored cohort). See their work: [links]. Run by the ZAO Fractal. Read the Whitepaper: [doc 701]." Schedule it to auto-post every Monday 6pm via Farcaster scheduled casts or a cron task queuing to Neynar. Alternate 3-4 template variations so it doesn't feel templated. Track engagement (likes, replies); high reply rate = signal that the loop is resonating.

---

## THE JULY FUNNEL
### Register → Build → Vote → Finals (Friction Removed)

```
STEP 1: JULY 1 REGISTRATION (2-3 min, zero wallet friction)
├─ User lands on /enter (or clicks join from homepage)
├─ Wallet autofill via Mini App getAddress() or manual paste
│  (Real-time validation: green checkmark on valid 0x address)
├─ Repo field + live GitHub API validation (user sees "✓ repo found" instantly)
├─ Track selector pre-filled from workshop attendance history (optional manual override)
├─ Visibility mode picker (4 icons, radio buttons, default to "build casts")
├─ SIWF (Farcaster Sign-In for Web) optional secondary button (links FID to wallet)
├─ Submit → stored in Redis zabal:builds:{wallet}
└─ Success state: 
   ├─ "You're in. Your build is live on /enter#builds-list"
   ├─ Link to /play (leaderboard + XP quests preview)
   ├─ Share button (pre-filled: "I entered ZABAL Gamez...") with ?ref={fid}
   └─ Redirect to /enter/welcome (lightweight onboarding) or stay on /enter

STEP 2: JULY 2-28 BUILD-IN-PUBLIC (Weekly standups + visibility)
├─ Builder picks ONE visibility mode (locked from registration)
├─ Daily proof: cast to /zabal OR stream OR recorded session OR prompt log
│  (Commit-watcher cron monitors GitHub + Farcaster tags)
├─ Weekly check-in (async): mentor posts in /zabal with builder tag + one-liner feedback
│  (Example: "@builder your Empire leaderboard hit 5 commits. Blockers this week? 
│   Let's sync if needed." Builder replies or self-resolves.)
├─ Streak badge visible on /leaderboard (Nw-day streak shown next to rank)
├─ Three-daily standups (Mon/Wed/Fri 4pm EST): 1-min format "I shipped X, blocked by Y,
│  next is Z" posted to /zao channel. Winners get 1 emoji-react from Zaal + retweeted
├─ Weekly micro-bounties (via Sentinel): top 5 clips / 10 transcript corrections / 
│  most helpful mentor comments each get 500 ZABAL (~$10-20). Distributed Friday.
├─ Mid-month (July 15) pulse check survey: "How likely to finish?" + "Biggest blocker?"
│  Results published same day; if >30% say "unlikely," activate retention (extra mentors, 
│  emergency bounties).
└─ Engagement engine quests on /play (First Ship, Glue, Streak badges claimable weekly)

STEP 3: JULY 28-31 FINAL PUSH (Submission checklist + momentum)
├─ 48 hours before deadline (July 29): publish "Submission Checklist"
│  ├─ Live URL deployed to Base (show contract address)
│  ├─ Open repo public (link it)
│  ├─ 60s demo recorded + uploaded (Loom/YouTube link in submission)
│  ├─ Announcement cast drafted (template provided)
│  └─ 4 short how-tos if you haven't done it yet (deploy, make public, clip, cast)
├─ July 31 11:59pm: submissions close. Tier 1 auto-checks ownership proof.
│  If builder fails (no wallet in ZABAL.md), async retry window (email + Formspree form).
└─ July 31 11:59:59pm: /leaderboard freezes + community voting opens

STEP 4: AUG 1-3 COMMUNITY SHORTLIST + MENTOR SELECTION (Rolling, non-binding)
├─ All July submissions live on /leaderboard (sorted by submission date, newest first,
│  to kill herd-voting on counts). Do NOT show vote/view tallies.
├─ Community upvotes (1 per member weekly, Farcaster verified via Neynar 0.55+) create
│  organic shortlist. Top 15-20 emerge by Aug 1 EOD.
├─ Mentors claim top builders (first-come-first-served, 5-7 day window):
│  "@builder I'm claiming you as my finalist champion. Let's ship something amazing.
│  Check-in calls: [Mon/Wed/Fri times]."
│  Mentor claim triggers builder notification + "Pair with [mentor]" badge on /leaderboard.
├─ By Aug 3 EOD: 8-12 finalists locked (mentor-picked, not algorithmic). No more
│  changes. Publish the Finals roster publicly.
└─ Finalists get Unlock key (ERC-721 on Base) for Finals access + voting rights

STEP 5: AUG 1-3 ASYNC FINALS PREP (Visibility mode checklist)
├─ Finalists receive onboarding email + Telegram DM:
│  ├─ Demo format (5 min presentation + 2-3 min live Q&A)
│  ├─ Visibility-mode requirements (must have 21+ casts OR 10+ streams OR session logs)
│  ├─ Wallet check (ensure ownership proof is live in repo)
│  ├─ Finalists-only Discord channel (private Q&A + tech support)
│  └─ T-3 days (Aug 4) sync onboarding call (30 min, cover schedule + tech check)
├─ Judge-agent scoring system runs on all 8-12 finalist repos (live GitHub reader,
│  scores against published rubric, results go to zabal:judge:{build_id})
└─ Respect pre-fund snapshot (T+0 Aug 5 midnight): all eligible Respect-holders get
   $2 USD equivalent baseline position on WaveWarZ-Base market per finalist

STEP 6: AUG 5-7 FINALS SETTLEMENT (72h window)
├─ Friday 2pm EST: Live Demo Ceremony (90-120 min livestream + recording)
│  ├─ Multistreamed: YouTube + Twitch + Farcaster Spaces (archived to /recordings)
│  ├─ Finalists pre-recorded demo clips (5 min each, play sequentially)
│  ├─ Live Q&A with judges + mentors (2-3 min per finalist)
│  ├─ Polls + community reactions (drive engagement every 8-10 min)
│  └─ Dramatic reveal of WaveWarZ market prices + judge-agent scores (run in parallel,
│    show both signals)
├─ Saturday-Sunday (48h): WaveWarZ trading + Respect voting live
│  ├─ TWAP oracle (72h time-weighted average price) resists day-1 whale capture
│  ├─ Shadow Respect 1p1v vote (parallel track, publishes separately for ZAO research)
│  ├─ Bonded dispute window (Respect-weighted) for any settlement challenges
│  └─ All metrics published live on /finals-live dashboard
└─ Sunday 11:59pm: Composite scoring (40% judge-agent score, 30% Respect vote, 
   20% WaveWarZ market volume, 10% mentor impact) determines placement

STEP 7: AUG 8 AWARDS + FORWARD MOMENTUM
├─ Morning: Announce all July submissions + final leaderboard + 'Respect earned' roll
│  call (even non-finalists). Post on /zabal + zao/group chats.
├─ Afternoon: Mentor picks published (who claimed whom).
├─ Next morning (Aug 9): "Here's what's next" post with Aug Finals rules + onboarding link.
│  + Artizen.fund referral links for winner projects (cross-fund stacking).
├─ Winners receive: Magnetiq collectible (Finalist tier, dynamic NFT) + ZABAL prize
│  (tiered: $150/$100/$75/$35x5) + Hats Protocol 'ZAO Finalist S1' role (permanent
│  credential) + 1% permanent artist cut on all future WaveWarZ trading volume on finalist
│  project NFT
└─ All July builders (finalist or not) get Respect attestation (EAS schema on Base,
   queryable post-season for future memberships or funding applications)
```

---

## PER TRACK: ARTIST | BUILDER | CREATOR

### ARTIST TRACK (Music/Visual)

**What They Get**
- Zero-wallet-required NFT minting (Coinflow fiat-to-mint, artist keeps 85% revenue vs traditional 15-30%). No crypto barrier. (Doc 407 Coinflow, Doc 155 Music NFT End-to-End)
- Pre-recorded AI music production templates: Suno v5.5 (music generation), ElevenLabs voice cloning (3-click setup), ElevenLabs music video gen (beat-sync output). One 90-second tutorial video showing the full stack. (Docs 321, 323)
- Arweave atomic asset upload (pre-built form, no wallet required) + Base minting via Magnetiq Magnet (frictionless collectible claiming). (Doc 155, Magnetiq docs)
- Weekly artist spotlight (Monday recaps pinning top 3 streams-this-week). Spotify playlist placement (top 5 artists per week added to ZABAL-curated playlist). $100/week ZABAL split to top 5 artists (funded from event budget). (Doc 314 ISRC metadata, Spotify playlist research)
- Revenue stacking model visible: single track earning from Spotify + YouTube + NFT mint + Bonfire citations simultaneously. Psychological win for artists entering web3. (Doc 315 Revenue stacking)

**Tooling & Surfaces**
- `/artist` onboarding page: 1-page walkthrough (upload WAV to Arweave, mint to Base via Coinflow, submit metadata, announce on /zabal cast).
- Recordings library: every artist who records during workshops gets added to `/recordings/artists` searchable by track/style. Artists can embed clips in their project README.
- `/pops` collectibles: artists can claim visual traits as dynamic collectibles (bronze → silver → gold as streams/plays accumulate).
- Mentor pairs: pair with one ZAO producer (DCoop, Iman, AttaBotty) for live feedback in July. Office hours: Tue/Thu 5pm EST, Spaces + Discord breakout.

**Success Metric**
Live URL (Arweave + Base contract) + 3-min demo (recorded video) + Spotify metadata (ISRC code) + at least 5 build casts or 3 livestream sessions during July.

---

### BUILDER TRACK (Developer/Aspiring)

**What They Get**
- GitHub as the submission interface (not forms). /enter form auto-populates from GitHub auth. Rolling admission (no batch deadlines). (Doc 778, Doc 750)
- Templated starter kits at `/templates`: (1) Music NFT Mint (Coinflow), (2) Farcaster Frame (voting), (3) Knowledge Graph Query (Bonfire API), (4) Empire Builder Integration (tokenization), (5) Analytics Dashboard (tracks leaderboard). Each has 2-min video + commented code + test suite.
- Empire Builder tokenless spinup (EB-24 API): builders create a project empire + live leaderboard in <5 minutes. Shows real-time commit activity + viewer engagement. No token launch required. (Doc 654, Doc 583)
- Live status board (`/builder-board`): all active July builders + latest commits + live deploy status (like Vercel project dashboard). Commit notifications post to /zao channel daily. Positive peer pressure + discoverability. (Doc 901, Vercel-deployed project patterns)
- Mentorship queue system (async Slack): builders post build questions in #zabal-support. Mentors subscribe to alerts. First mentor to reply owns the thread. System tracks response time + builder satisfaction. (TreeHacks model, Doc 695 embedded-teammate)
- WaveWarZ Finals surface as a builder's own tool: if a builder creates an agentic judge/market-maker tool, they can deploy it against a standalone WaveWarZ instance (testing ground for agent commerce). (Doc 723, Doc 770)

**Tooling & Surfaces**
- `/builder` profile page: GitHub stats (repos, followers, creation date), Neynar score (engagement rank), Talent Builder Score, Coinbase Verified badge if present, EAS attestation count, Bonfire contribution graph. All public signals, no PII.
- Live leaderboard (`/leaderboard`): shows all builders by most-recent-commit, most-commits-this-week, highest-Respect. Streak badges next to rank. Sort by branch (all builders, mentor-claimed, finalists).
- Private mentor dashboard: shows all mentees, weekly check-in status (✓ done or pending), builder blockers (from weekly standups), live Empire leaderboard per mentee.
- `/pair` session booking: mentors + builders can book 1-hour live pair-programming slots (via Cal.com, with a pre-set topic: "API design", "debugging", "testing"). Slots are public so other builders can shadow.

**Success Metric**
Live URL (contract + UI deployed to Base or Vercel) + public GitHub repo + 60-second demo video + at least 7 build casts or 3 livestream sessions during July + 3+ documented commits per week.

---

### CREATOR TRACK (Media/Distribution)

**What They Get**
- Cross-post prompt generator (`/creator`): one cast/video draft auto-generates posts for Farcaster, X, Bento, personal site simultaneously. Reduces content friction by 80%. (Hootsuite/Buffer research, multi-platform tools)
- Analytics leaderboard (`/creator/leaderboard`): track followers-gained, total-reach (summed across platforms), engagement-rate. Public top-10 + private dashboard (your metrics vs cohort average). Weekly payouts: top 5 creators get $100 ZABAL split. (Doc 733 engagement loops, Doc 787 analytics strategy)
- Creator case studies: Zaal records 10-min video "How @yerbearserker grew 100 to 10k in 3 weeks during ZABAL Gamez Workshop Month" with specific tactics (workshops attended, promotion strategy, posting cadence, format swipes). Post to /resources + Magnetic. Shows path-to-success. (Doc 776 Duo Do pre-recorded AMA pattern)
- Gated content + membership tiers: creators can offer tip-to-unlock content (ZABAL tip wallet + Unlock Protocol). Revenue flows directly to creator. (Unlock Protocol docs, Circle community model)
- Creator mentor pairs: pair with a distribution expert (Thy Revolution or 50k+ follower ambassador) for strategic guidance on audience building.

**Tooling & Surfaces**
- `/creator/prompt`: form to create ZABAL Gamez moment (title + description + image). System generates 4 versions: (1) Farcaster /zabal cast, (2) X thread template, (3) Bento card, (4) newsletter paragraph. One click to send all four.
- `/creator/schedule`: calendar view of all creator posts (drafts + published). Shows which platforms, engagement so far, suggested optimal times to post next (AI analysis).
- `/dream-leads` demand board: creators can pitch content ideas to builders. "I want to make a 10-min video on WaveWarZ" → builders respond with "I'll be the subject." Creators get guaranteed subjects; builders get amplification.
- Live embed: creators can embed their latest post stats on personal websites via iframe: `<iframe src='zabalgamez.com/embed/creator/[fid]?stats=true'/>`. Shows reach, engagement, ZABAL earned.

**Success Metric**
7-day daily content log (at least one post per day across any platform) + screenshot of cross-platform metrics + at least 3 posts mentioning ZABAL Games or linking to builds/workshops + 500+ total impressions across platforms during July.

---

## JUDGING + INCENTIVES
### The Model (Decisive; Gaming-Resistant)

### Judging Architecture (Hybrid Model)

**July Community Shortlist → Mentor Selection → August Finals**

**Community Leaderboard (July 1-31, Non-Binding)**
- All July submissions live on `/leaderboard` sorted by submission date (newest first) to kill herd-voting bias.
- Community upvotes (Farcaster-verified, 1 per member per week, Neynar Score 0.55+ soft gate) create organic shortlist. Top 15-20 emerge by Aug 1.
- Do NOT show live vote tallies during July. Publish counts only after mentors lock selections.
- Rationale: Herd-voting on visible counts kills diversity. Hidden counts = pure quality signal. (Doc 773 anti-gaming, Gitcoin leaderboard best practices)

**Mentor Claiming (Aug 1-8, Asynchronous)**
- Each of 8 mentors claims 1-3 builders from top community shortlist (first-come-first-served, 7-day window).
- Mentor posts public claim cast: "I'm claiming @builder for the artist track. Reason: [one-liner]. Check-ins: Mon/Wed/Fri." Public rationale increases transparency; reduces arbitrary-pick perception.
- Claimed builders get notified + "Paired with [mentor]" badge on /leaderboard + added to finalists roster.
- Non-claimed top-10 builders can request a mentor via form (triage desk reviews, may reassign if fit is better).
- By Aug 8 EOD: finals roster locked (8-12 builders, mentor-selected).

**Judge-Agent Autonomous Scoring (Aug 1-3, Parallel)**
- AI reads each finalist's repo + live demo URL + visibility-mode casts. Scores against published rubric: (1) Innovation/Difficulty (from GitHub diff analysis), (2) Milestone Delivery (does it do what was promised?), (3) Track Fit (artist/builder/creator signal coherence), (4) Communication Quality (clarity of docs + demo + casts).
- Rubric scale 1-5 per criterion. Evidence-then-rationale-then-score ordering (prevents hallucination).
- Multi-model jury (Claude 3.5 Haiku + open-source alternative, order-swapped per run) to kill self-preference gaming.
- Scores stored in `zabal:judge:{build_id}`. Every score includes a 30-second video explanation (gpt-4o voice + screen) so builders can contest. Appeal window: 24h post-Finals.
- Judge-agent cost: ~$0.04-0.06 per finalist. (Source: Doc 723 Agent-as-Judge, x402 payment protocol, Golden Codex/MOLT Productions precedent, Virtuals Protocol)

**August Finals Settlement (Aug 5-7, Composite Signal)**
- Composite score determines placement:
  - Judge-agent score (40%)
  - Respect-holder 1p1v (30%) — Respect-holders pre-funded $2 baseline per finalist at T+0
  - WaveWarZ-Base market volume (20%) — TWAP over 72h window (resists whale capture)
  - Mentor impact score (10%) — qualitative assessment by claiming mentor
- Public rubric published on `/finals` before ceremonies. Mechanical tiebreaker if needed.
- Shadow Respect 1p1v vote run in parallel with market (same 72h window). Publish both results + divergence analysis as ZAO research. (Doc 775 MetaDAO pattern, Doc 720 WaveWarZ Finals mechanic)
- Bonded dispute window (post-settlement): Respect-weighted objections can trigger human jury review. Prevents silent manipulation. (Doc 775 Polymarket dispute resolution)

### Prize Distribution (Tiered, Transparent)

- **1st Place:** $150 USDC + Magnetiq Finalist badge + 1% permanent artist cut on all WaveWarZ trading volume + Hats Protocol 'ZAO Finalist S1' role
- **2nd Place:** $100 USDC + Magnetiq Finalist badge + 0.75% artist cut + Hats role
- **3rd Place:** $75 USDC + Magnetiq Finalist badge + 0.5% artist cut + Hats role
- **4th-8th Place:** $35 USDC each + Magnetiq Finalist badge + Hats role (no artist cut)
- **All July Submissions:** Guaranteed Respect earning (minimum 34, bonus 55 if featured on /zabal or mentor-claimed). Non-finalist reward = governance weight in ZAO.
- **Total pool:** $500 USDC (reserved from event budget) + ZABAL allocation (TBD, suggested 2,000 ZABAL distributed proportionally).
- All finalists get EAS attestation on Base (portable proof-of-work credential, queryable for future funding/memberships).

### Gaming & Mercenary Defenses

**Sybil Prevention**
- Farcaster verification gate (Neynar 0.55+ for community voting, 0.7+ for Respect judging).
- Respect is soulbound (non-transferable, non-sellable). Can't be bought or farmed via market. Peer-validated in live fractals.
- Multi-signal verification on finalist repos: GitHub commit timestamp cross-check (git commit time vs claim time), wallet ownership proof (commit hash resolution from ZABAL.md), Coinbase Verified badge if present.
- Monitor leaderboard voting patterns (T+48h-72h): same cast voted by 10 new FIDs = likely bot brigade. Flag for manual review. Post-settlement, publish anomaly report. (Doc 773 Sybil patterns, Gitcoin sybil research, Neynar Data Oracle)

**Bounty Gaming (Micro-Bounties for July Momentum)**
- Cap weekly bounty total to 10-15% of main prize pool (~$75 ZABAL/week). Make them optional, not mandatory.
- Sentinel bot (doc 631) scores micro-bounties deterministically: "Best build demo clip" = highest-quality 60-sec video (auto-checked by Claude vision). Results published with rationale.
- Builders can only claim one micro-bounty per category per week (prevents multi-claiming on same work).
- Mercenary check: if a builder wins 3+ micro-bounties but fails to submit a Finals build, they're ineligible for Respect bonus next season. (Doc 631 POIDH bounty structure, Code4rena bounty-farming research)

**Builder Commitment Verification**
- Minimum bar to earn final Respect: live URL (deployed, not localhost) + public GitHub repo + 60-second demo recorded + at least 1 cast to /zabal during build month.
- Spot-check by mentors: mentors review 10% of random finalists' repos for "looks real" (non-automated check). If repo is clearly forked from a template with 0 commits, escalate to Zaal.
- Visibility-mode compliance checked by commit-watcher cron: if a builder hasn't posted to /zabal in 72 hours, flag as "low visibility" in judge context. Not an auto-disqualifier, but mentors see it.

**Whale Capture (WaveWarZ Market)**
- Respect-holder baseline allocation ($2 USD per voter per finalist) ensures the Respect DAO has real weight even if a single whale positions heavily.
- TWAP over 72h window absorbs volatility and prevents day-1 momentum from permanently skewing price. Self-buy manipulation at the buzzer is ineffective. (Doc 720 Option B, MetaDAO case study, Polymarket research)
- Soft cap on per-address position (v2 recommendation, not enforced in v1): max $100 per finalist per voter to prevent whale dominance. Document as roadmap item for Finals Round 2.
- Judge-agent scores (40% weight) provide independent signal uncorrelated with market trading. Market + mentor alignment matters more than day-1 momentum. Public narrative: "The market is one signal among three; Respect + judge alignment are equally weighted." (Doc 720 Finals mechanic)

**Non-Finalist Perception Fairness**
- Public messaging (on /enter + /info + Finals onboarding): "August Finals is a recognition tier, not elimination. All July submissions earn Respect governance weight. Finalists are paired mentors + builders who've proven commitment together—it's a collaboration, not a competition."
- Bonfire knowledge graph visible to all: every July builder's work is indexed and citable post-season. Your build stays in the ZAO institutional memory regardless of Finals placement. (Doc 784 Bonfire rubric-based judging, Doc 673d ZAO bonfire query patterns)
- Artizen.fund cross-fund referrals for top non-finalist projects (curators select 2-3 to pitch to Greenpill + Funding the Commons). "You didn't place in Finals, but your work qualifies for retroactive public goods funding." (Doc 849 Artizen Fund execution plan)

---

## ENGAGEMENT LOOPS
### UGC, Distribution Flywheel, Daily Cadence

### UGC + Collectible Loop

**Verification & On-Chain Credentials**
- EAS attestations on Base (free off-chain + cheap on-chain hybrid):
  - Schema 1: "Submission" (submitterFID, projectURL, track, timestamp)
  - Schema 2: "Milestone" (milestoneType, awardedTo, reasoning, timestamp)
- Every `/enter` registrant auto-attested as "Submitted" (off-chain). First Ship badge → on-chain Milestone attestation (queryable at base.easscan.org).
- Human Passport soft gate (free API): Unique Humanity Score > 20 auto-passes; low-signal builders flagged for review but not blocked in July v1. Hardens to block if farming > 5% detected mid-month. (Doc 191 Reputation Scoring, Human Passport research, Gitcoin Passport)
- Private GitHub proof-of-work display: `/builder/[fid]` profile shows July activity graph (commit count, PRs, repos touched). Featured repos have a /zabalgamez.com badge. Visibility-mode compliance visible to mentors + judges.

**Dynamic Collectible Progression (Magnetiq Magnet)**
- Current static model: one Magnetiq magnet per builder + 8 brand mementos.
- Proposed evolution: dynamic collectible (Bronze → Silver → Gold → Finalist) that gains tiers as XP accrues. Tied to /play quests (First Ship, Glue, Streak badges).
- Sync with leaderboard: visible progression + auto-claim at thresholds. Eight brand mementos = unlockable milestones. Track-specific skins (artist/builder/creator visual variants).
- Season collectible (post-Finals): Winners get Magnetiq "ZABAL Gamez S1 Finalist" collectible with dynamic tier based on placement (1st/2nd/3rd/4th-8th). Permanent badge, portable across ZAO apps.

**Unlock Keys for Finals Access**
- Mint ERC-721 keys on Base for every July participant (gasless via relayer, ~$0 cost to builder).
- Keys gate Finals leaderboard, voting rights, and recording viewership. Portable across ZAO/Discord/Telegram via Unlock integration.
- Non-transferable (Unlock default). No vendor lock-in; keys are owned by builders, not platform.

### Distribution Flywheel (Farcaster Native)

**Channel Routing (Channelkey='zao')**
- Every builder share-cast auto-tagged with channelKey:'zao'. One-line SDK change in assets/miniapp.js. (Doc 733)
- Distribution multiplier: builders' followers + /zao channel subscribers (100+ members) notified in parallel. 2-3x reach multiplier vs followers-only.
- /zao channel moderation: daily recap cast pinned for 7 days (permanent top-of-channel spot). Weekly roll call of top 5 builders. Mentors have posting access.

**Weekly Casting Cadence for Builders**
- Monday 'what changed' cast (1-min update, building-in-public mode selected).
- Wednesday 'blockers + tactical plan' cast (1-min checklist, what's next).
- Friday 'mini case study' cast (60-second demo or numbers: commits, viewers, insights).
- Recurring author identity + algorithmic recognition. Weekly helpful posts in /zabal = incoming discovery. (AngelHack build-in-public research, Farcaster engagement best practices)

**Streak Badges + Session Retention**
- Leaderboard displays [Nw streak] badge next to each builder's rank (N = consecutive days with at least one visibility update: commit, cast, or stream).
- Streaks are already in the Redis leaderboard (doc 733 confirmed). 30-minute UI lift with 5/5 leverage.
- Visible streak = #1 retention driver on Farcaster Mini Apps (40% session-to-session return rate). Builders seeing their N-day streak count creates habit formation better than static rankings. (Doc 733 Farcaster Mini Apps engagement data)

**Daily Build Days Series (Fixed Ritual)**
- 4pm EST daily ritual: featured adoptable project + RSVP link (Luma countdown on homepage + /live page).
- 15 min before 4pm: pre-seed in ZABAL/ZAO group chats (warm audience).
- 4pm exact: cast to /zao channel (channelKey='zao'). Auto-surfaces on homepage + /live + daily recaps.
- Weekly impact: 22 daily slots = repeating ritual that creates recurring participation loops. Builders know "Build Day is 4pm Tuesday" and show up.

**Clip-to-Earn Game (UGC Incentive)**
- Top 3 builders with most shareable clips extracted from their sessions get monthly $ZABAL bonus ($50/$30/$20).
- Clips.html board already exists. Tie it to leaderboard ranking. Auto-extract 30-60 second highlights from long recordings via Claude vision + OpusClip pattern.
- Builders incentivized to make content shareable (not just functional). Short-form drives ecosystem reach. (OpusClip research, Farcaster frames growth loops)

**Weekly Recap Broadcast Loop**
- Every Monday after Respect fractal: post 3-5 min compiled video to /zabal + main ZAO channel. Best new ships, fixes, creative visibility moments. (Doc 733 weekly wins broadcast)
- Mentors can add personal callouts: "Loved what @builder did this week: [example]." Ecosystem pull-through via mentor amplification.
- Sunday 6pm: Mini App managed notification to all July builders. "This week's Respect: [5 names]. Top 3 projects: [links]. Vote next week." Strategic timing + high-value single notification beats daily volume. (Farcaster Mini Apps notification best practices)

### Real-Time Momentum Visibility (AI-Assisted)

**Live Leaderboard Updates**
- /leaderboard updates hourly (not nightly). Shows: commits this week, visibility-mode activity (casts/streams/session count), Respect score (if applicable), streak count.
- Sort options: most-recent-commit, most-commits-this-week, highest-Respect, longest-streak.
- Mentors see a private version with builder blockers + check-in status.

**Commit Notifications to /zao**
- Commit-watcher cron (already live, doc 784 referenced) posts daily: "Today's builders: @builder1 (5 commits), @builder2 (merged PR), @builder3 (demo posted)." One line per builder, no spam.
- Builds organic discovery + peer pressure to stay active.

**Judge-Agent Reasoning Feed (Real-Time)**
- As judge-agent scores finalist repos (Aug 1-3), stream mini-updates to a single edited Telegram message: "Reading repo X... scoring innovation... found 3 PRs... consensus: 4/5 innovation."
- Live visibility into agent work before final decision. Transparency breeds trust. (Doc 872 ZOE progress narration pattern)

---

## RISKS + WHAT TO AVOID

### HIGH-IMPACT RISKS

**Risk: July Async Format Inherently Struggles (Mitigation: Structured Cohort Pressure)**
- Pure async open-build is a 4-week slog. No fixed end-date cohort pressure = procrastination bias. Completion naturally hovers 30-40%, not 70%.
- Mitigation: Frame July as "Season 1 submission window" with soft weekly milestones (Weeks 1/2/3/final), not one July 31 cliff. M/W/F standups every 3 days maintain energy without burnout.
- Mitigation: Streak badges + weekly bounties + peer leaderboard visibility create intrinsic accountability. Visibility is the anti-cheat and the point.

**Risk: Mentor Bottleneck (Two-Tier System)**
- 8 mentors + 50+ expected builders = oversubscription. Early/visible builders get mentors week 1; quiet builders get none by week 2.
- Mitigation: Lock mentor assignments upfront (Zaal assigns 2-3 builders to each mentor before July 1, not rolling claims). Fixed check-in appointments guarantee coverage.
- Mitigation: Async resources for overflow (templates, recorded pair sessions, playbook). 40 mentorship slots (5 per mentor) + 10-20 async-only builders.

**Risk: Building-in-Public Requirement Deters Builders (Privacy/Confidence Concerns)**
- Builders afraid of judgment or who work in stealth will feel excluded by mandatory visibility.
- Mitigation: Four mode options (live stream, recorded sessions, public prompts, frequent casts). Require ONE, make private mode acceptable (e.g., private GitHub + timestamp receipts).
- Mitigation: Cultural messaging: "Building in public is a feature, not surveillance. It's how you get feedback, attract collaborators, and prove commitment."

**Risk: Non-Finalist Builders Ghost After July**
- "I didn't win Finals, so I'm done." Respect earning is abstract; builders who don't place may abandon repos.
- Mitigation: Make Respect earning visible weekly (public Monday recap listing 5-10 builders + one-liner why). Weekly celebration loop prevents "I quit" pattern.
- Mitigation: Adoptable-projects fast-track for top non-finalists (curated into Artizen cross-fund, repositioned as "incubation track" not consolation prize).
- Mitigation: Clear messaging: "All July submissions earn Respect governance weight, regardless of Finals placement."

**Risk: Judge-Agent Failure / x402 Payment Dependency**
- If ElizaOS build bot doesn't ship by July 1, or x402 micropayment fails, judge-agent scores can't be tied to autonomous settlements. Judge accountability is lost.
- Mitigation: Fallback: human judges only (ship judge-agent as nice-to-have, not critical). x402 research + spike by July 5. Test on testnet with 3 fake submissions before Finals.
- Mitigation: Store judge scores locally if x402 fails; tag for manual Zaal review. Monitoring: /status dashboard tracks judge-agent cost + success rate.

**Risk: WaveWarZ-Base Mainnet Delay**
- If Sam + Arthur don't ship by Aug 1, Finals voting reverts to Snapshot 1p1v on Respect (no market, no 1% artist cut permanence).
- Mitigation: Publish contingency plan (Snapshot strategy URL) by July 1. Weekly Arthur check-ins. 1% artist cut still flows from protocol if Base integration exists.
- Mitigation: Parallel fallback: use Solana WaveWarZ as parallel signal if Base slips.

**Risk: Mentor Burnout + Churn Mid-July**
- Mentors recruited via open roster may not understand 4-5 hours/week embedded-teammate commitment. Ghost by week 2.
- Mitigation: Pre-July onboarding call (30 min) with mentor commitments document signed. Clear scope: 1-2 champions, specific async cadence (3 check-ins/week). Hats role + ops membership conditional on 80% checkpoint reviews.

**Risk: Spam Submission Volume (50+ Trash Entries)**
- If Tier 1 gates are weak, leaderboard pollutes with fork-and-submit repos, low-effort entries.
- Mitigation: Tier 1 ownership proof (commit hash resolution + wallet verification) + track enum validation catch 70% spam instantly. Tier 2 LLM judge catches 20% semantic trash. Tier 3 human review flags divergence.
- Mitigation: Soft gate on registration: Human Passport > 20 (warning, not blocking in July v1). Harden in August if farming spike detected.

### MEDIUM-IMPACT RISKS

**Risk: Builder Attrition (July → Finals Drop-Off)**
- Builders ship July, disappear by Aug 1. Only 3-4 finalists compete; event feels predetermined.
- Mitigation: Mentor embeds as live teammates (not judges). Require building-in-public. Announce finalist roster + prize tiers before August to lock commitment.
- Mitigation: Mid-July pulse check (July 15): "How likely to finish?" If >30% say unlikely, activate emergency retention.

**Risk: Sybil Voting on Leaderboard (Coordinated Upvote Brigades)**
- 10 mutual-follow accounts all upvote each other's July builds in real time. Herd-voting skews shortlist.
- Mitigation: Neynar Score 0.55+ soft gate for voters (filters obvious bots). Down-weight correlated clusters (COCM-style). Cap per-member weekly upvote budget (1 per person).
- Mitigation: Hide live vote counts during July. Publish counts only after mentor selections lock.

**Risk: Mentor Inconsistency (Same Score, Different Decisions)**
- Mentor approves a builder at 4/5 score on Day 1, rejects identical score on Day 5. Calibration drifts.
- Mitigation: Weekly mentor scorecard (per-mentor approval rate vs gold-set). Rotate mentor on appeals. Calibration re-check cron watches divergence.

**Risk: Metric Gaming on Leaderboard**
- Builders stage fake commits, replay recordings, spam empty casts to game "building-in-public" signals.
- Mitigation: Anti-cheat (starter repo timestamp verification per doc 701) + mentor spot-checks + AI anomaly detection. Visibility-mode verification (git commit timestamp cross-check).

**Risk: Post-Event 48-Hour Retention Window Closes**
- If Zaal is asleep/busy during Aug 1-2, momentum-retention window closes. Builders ghost, don't follow up on mentor picks.
- Mitigation: Pre-write Aug 1-2 announcement posts now. Queue them in Vercel scheduled deploys or Farcaster scheduled casts. Automate where possible.

**Risk: Collectible Claim UX Friction**
- Gasless relayer breaks; users can't claim badge on /play. Momentum dies.
- Mitigation: Test relayer before July 1. Fallback: manual claim via Discord bot + Formspree (Magnetiq model). Weekly reminders.

### LOW-IMPACT RISKS (Monitor, Accept)

**Risk: Farcaster Algorithmic Muting (Over-Posting)**
- If ZABAL posts to /zao channel >1/hour, algorithm mutes accounts. Builds ghost mid-month.
- Mitigation: Stick to 4pm fixed time, not sliding window. Weekly cadence for builders (Mon/Wed/Fri standups only).

**Risk: Goodhart's Law (Single Metric Becomes Target)**
- Any single metric becomes a target. Builders optimize for visibility counts instead of feature-shipping.
- Mitigation: Rotate which criteria are weighted heavily each season. Use orthogonal signals (commit cadence, peer collaborations, not just final-code diff).

**Risk: Perception Unfairness (Mentor-Picked Finalists)**
- Non-claimed builders feel shut out if mentors claim early-visible builders only. "It's predetermined."
- Mitigation: Publish mentor rationale for each claim publicly. Offer form-based appeal for non-claimed top-10 builders.

---

## WHAT WE ALREADY HAVE vs WHAT TO BUILD
### Existing Stack Mapping + Gap Analysis

### ALREADY LIVE

| Component | Status | Notes |
|-----------|--------|-------|
| `/enter` registration form | Live | Minimal (3 fields: wallet, repo, track). Needs: wallet autofill in Mini App, real-time validation, Farcaster Sign-In secondary button. |
| `/leaderboard` (community voting) | Live | Shows all submissions. Needs: hidden vote counts (show after mentor selection), sort by date (not votes), streak badges, private mentor dashboard, live commit activity. |
| `/api/register` | Live | Wallet-keyed, optional FID link via Quick Auth JWT. Ownership proof enforced at commit-watcher boundary. Needs: Human Passport soft gate, multi-repo dedup check. |
| `/api/builds` | Live | Lists all registered builds. Needs: track filter, visibility-mode compliance check, Empire leaderboard sync (when EB-24 ships). |
| Bonfire knowledge graph | Live (171 entities, 220 edges in zabal:69ef871f0d22ed7e6f2b243a) | Already indexing ZABAL submissions. Needs: daily cron to sync judge reasoning + builder feedback into graph as edges. |
| Magnetiq magnet integration | Live | Static collectible + 8 brand mementos. Needs: dynamic tier progression (Bronze → Silver → Gold → Finalist), track-specific skins. |
| WaveWarZ-Base Finals mechanic | Spec complete (Doc 720 Option B) | TWAP settlement, Respect baseline, judge-agent scores. Needs: mainnet launch by Aug 1 (Arthur/Sam dependency), testnet smoke-test by July 1. |
| `/recordings` + `/recaps` | Live | Workshop library indexed. Needs: FlowStage auto-clipping (3-5 clips per recording, track-specific variants), seeding to /zabal daily. |
| `/live` + `/today` | Live | Countdown timer, current status. Needs: Build Days series wired in (build-days.json), daily 4pm ritual data. |
| Mini App manifest (farcaster.json) | Live (signed, self-hosted) | Mini App specification complete. Needs: channel routing (channelKey='zao') in share-casts, Mini App notifications setup (Neynar managed). |
| `/api/activity` | Live | Activity backend on Upstash Redis. Needs: triage queue (zabal:approvals), judge scores (zabal:judge:{build_id}), mentor check-ins (zabal:mentor-checkins). |
| Commit-watcher cron | Live | Watches repo activity. Needs: visibility-mode compliance check (72h without /zabal activity = flag), daily digest to /zao channel. |
| Empire Builder integration | Partial | Endpoints EB-1 through EB-23 live. Missing: EB-24 (tokenless empire self-serve deploy), EB-20 (burn tracking), EB-21-23 (leaderboard creation). Adrian lead; blocks mid-July if not shipped by July 1. |
| `/play` + `/game` | Live | ZAO 2048 + leaderboard. Needs: quest system wired (First Ship, Glue, Streak badges), XP accrual, weekly claim → Magnetiq collectible tier bump. |
| `/pfps` + `/pops` | Live | Collectible + identity system. Needs: EAS schema integration (on-chain attestations), dynamic collectible tier progression (Finalist unlock). |
| Farcaster channel /zao | Moderated (YO) | Exists + has pinning. Needs: daily 4pm Build Days cast, weekly Monday recap, mentor participation guidelines. |
| ZABAL.md template + register skill | Documented | Exists in llms.txt. Needs: visibility in /enter form hint, clarity on builder vs skill responsibility (builder must commit or skill auto-writes?). |

### WHAT TO BUILD (July 1-31 MVP)

| Gap | Owner | Timeline | Notes |
|-----|-------|----------|-------|
| **Tier 1-3 Triage Gate** | Zaal + AI | By June 29 | Deterministic ownership proof check + LLM jury + human review routing. Cost: $4-12 for 50-200 submissions. |
| **Empire Builder EB-24** | Adrian | By July 1 | Tokenless empire self-serve deploy endpoint. Blocks builder leaderboard features if late. |
| **Build Days JSON** | Zaal | By June 28 | `data/build-days.json` (22 entries) + homepage wiring + /live countdown. Notification automation (pre-seed bot). |
| **Visibility-Mode Compliance Check** | Zaal (cron) | By July 1 | Commit-watcher extension: if builder hasn't posted /zabal in 72h, flag as "low visibility" in mentor context + optional DM reminder. |
| **Mentor Dashboard (Private)** | Zaal | By July 1 | Lists all mentees, weekly check-in status (✓ done or pending), builder blockers, live Empire leaderboard per mentee. Supabase table `mentor_checkins`. |
| **Weekly Pulse Check Survey** | Zaal (Typeform/Formspree) | Deploy July 13 | "How likely to finish?" + "Biggest blocker?" Survey runs July 15 EOD, results published same day. Emergency retention activation if >30% unlikely. |
| **Respect Earning Weekly Recap** | Zaal (cron cast) | By July 1 | Monday 6pm Farcaster scheduled cast: "ZM - This week's Respect: @builder1, @builder2, ... See their work: [links]." Auto-rotate 3-4 template variations. |
| **Streak Badge UI** | Frontend | By July 1 | /leaderboard shows [Nw streak] next to rank. Neynar data already available; 30-min UI lift. |
| **Live Commit Digest to /zao** | Commit-watcher + cron | By July 2 | Daily post: "Today's builders: @builder1 (5 commits), @builder2 (merged PR), @builder3 (demo posted)." One line/builder, no spam. |
| **Public Triage Rubric** | Zaal | By June 29 | Publish one-pager on /info defining 1-5 scoring scale per criterion with concrete examples. Make it the source-of-truth for Tier 2 LLM judge. |
| **EAS Schema Deployment** | Zaal | By June 29 | Two schemas on Base: "Submission" (submitterFID, projectURL, track, timestamp) + "Milestone" (milestoneType, awardedTo, reasoning, timestamp). Test on testnet. |
| **Human Passport Soft Gate** | Zaal (API) | By July 1 | Integrate Human Passport Models API into /enter registration. Unique Humanity Score > 20 auto-pass, low-signal flag for review (warning, not blocking). |
| **Clip Extraction Tool** | Zaal | By July 15 | Wire OpusClip pattern to auto-extract 30-60 sec highlights from builder session recordings. Feed to Clips.html board. |
| **Judge-Agent Skeleton** | Zaal + AI | By July 10 | Read finalist repos + rubric, score against criteria, store in `zabal:judge:{build_id}`. x402 payment optional; fallback to local storage. |
| **WaveWarZ-Base Smoke Test** | Arthur (Sam) | By July 1 | Adopt one starter project as fake finalist, test end-to-end (Respect baseline pre-fund + market trading + TWAP settlement). |
| **Magnetiq Dynamic Collectible** | Zaal | By July 20 | Evolve from static to tiered (Bronze → Silver → Gold → Finalist). Tie to /play XP milestones. Test on Magnetiq staging. |
| **FlowStage Auto-Clipping** | Carlos or Zaal | By July 15 | Daily cron: ingest workshop library, generate 3-5 short clips per recording (track-specific variants), queue for human review, auto-post top 1-2 to /zabal daily. |
| **Cross-Post Generator** | Frontend | By July 10 | `/creator` form: one draft → 4 outputs (Farcaster cast, X thread, Bento card, newsletter paragraph). Reduce creator friction 80%. |
| **Creator Analytics Leaderboard** | Frontend + analytics | By July 10 | `/creator/leaderboard` tracking followers-gained, total-reach, engagement-rate. Public top-10, private dashboard vs cohort. Weekly $100 ZABAL split to top 5. |
| **Builder Profile Enrichment** | Frontend + API | By July 5 | `/builder/[fid]` pulls external signals: Neynar Score, OpenRank, GitHub stats, EAS attestation count, Talent Builder Score, Coinbase Verified badge. Cache with 24h TTL. |
| **Artist Onboarding Page** | Frontend | By July 1 | `/artist` walkthrough (upload Arweave, mint Base, submit metadata, cast). 1-pager + 2-min video showing full stack. |
| **Builder Templates Library** | Frontend | By July 1 | `/templates` with 5 starters (Music NFT Mint, Farcaster Frame, Bonfire Query, Empire Integration, Analytics Dashboard). Each has 2-min video + commented code. |
| **Unlock Key Minting** | Zaal (ERC-721) | By July 30 | Mint gasless ERC-721 keys on Base for all July finalists + community voters. Gate Finals leaderboard access + voting rights. |
| **Aug 1-2 Announcement Posts (Templated)** | Zaal | Write by July 31 | Pre-write Aug 1 morning + afternoon announcement casts (Finals roster + mentor picks) + Aug 2 morning "here's next steps" post. Queue in Vercel scheduled deploys or Farcaster scheduler. |

### Timeline Dependencies

**Critical Path (Block Finals if Missing)**
- EB-24 (July 1): builders must have Empire leaderboards by July 1.
- WaveWarZ-Base smoke test (July 1): confirm market + TWAP settlement work before going live.
- Tier 1-3 Triage gates (June 29): submissions start July 1; need gates ready.
- Respect earning recap automation (July 1): first Monday recap needs to ship on schedule.

**High-Leverage (Attempt, Fallback OK)**
- Judge-agent skeleton (July 10): nice-to-have; fallback is human judges only.
- FlowStage auto-clipping (July 15): nice-to-have; fallback is manual clipping.
- Magnetiq dynamic collectible (July 20): nice-to-have; fallback is static tier per Finals placement.

**Nice-to-Have (Polish, OK to Defer to S2)**
- Unlock key gating (July 30): Finals access can be manual allowlist if ERC-721 slips.
- Creator analytics leaderboard (July 10): can launch August instead if bandwidth constrained.

---

## SOURCES

### Research Docs (ZAO OS V1)
- **Doc 701:** ZABAL Games Canonical State (May 2026) — prize distribution, Respect non-finalist reward, mentor rolling claims, visibility modes, participation bar
- **Doc 720:** WaveWarZ-Base Finals Mechanic (May 2026) — TWAP settlement, Respect baseline allocation, judge-agent x402 scoring, Option B hybrid model
- **Doc 651:** Episode 651: Three-Tier Verification (LLM jury, human override, risk-based routing)
- **Doc 654:** Empire V3 + June/July/August Calendar Pivot (tokenless-first model, leaderboard-to-airdrop)
- **Doc 673d:** ZAO Bonfire @ Telegram (bot integration, KG queries, builder context lookup)
- **Doc 701:** Complete Audit Decisions 2026-06-04 (ownership proof, hybrid judging, register hybrid identity)
- **Doc 718b:** Respect Game Mechanism Design (Fibonacci scoring, 2/3 consensus, sybil resistance, 2% weekly decay)
- **Doc 725:** Iman Hackathon (45-builder cohort, 1-day to 2-day extension, community formation from standing group chats)
- **Doc 730:** Activity Backend Audit (Upstash Redis REST API, join idempotency, hybrid register flow)
- **Doc 733:** ZABAL Virality + Ecosystem Incorporation (channel routing, 2x reach multiplier, three compounding loops, streak badges)
- **Doc 749:** Proof-of-Work Verification Patterns (GitHub activity scoring, visibility-mode anti-cheat)
- **Doc 750:** Builder Registration via Farcaster + OAuth (superseded, but canonical flow)
- **Doc 773:** AI Fractal Scoring Design (3-tier gates, LLM jury, divergence-vs-community, Goodhart prevention)
- **Doc 775:** Prediction-Market Governance Futures (TWAP vs spot, bonded disputes, Respect-weighted jury, MetaDAO case study)
- **Doc 776:** FlowStage Content Engine (auto-clipping workshop library, track-specific variants, Finals promotion flywheel)
- **Doc 778:** Tyler/Magnetic + Zaal Integration (GitHub-auth judging, rolling admission, Magnetic magnet as container)
- **Doc 784:** Plat0x/Bonfire ZABAL Architecture (rubric-based judging, GitHub sync, Bonfire KG as judge context)
- **Doc 823:** Pre-flight Quality Gates (deterministic checks catch 70% spam, cost-per-gate breakdown)
- **Doc 849:** Artizen Fund Execution (cross-fund stacking, match multiplier, creator sustainability)
- **Doc 056:** ORDAO Respect System (soulbound, peer-validated, Fibonacci distribution, anti-gaming mechanisms)
- **Doc 249:** Conviction Voting + Slash Penalties (skin-in-the-game, Incented Top 3 campaigns)
- **Doc 529:** Hermes Quality Pipeline (pre-flight gates before critic, conflict policy)
- **Doc 583:** Empire Builder Tokenless On-Ramp (leaderboard-first, token-later, airdrop eligibility)
- **Doc 631:** POIDH-Zabal Sentinel Convergence (bounty cadence, deterministic scoring, leaderboard distribution)
- **Doc 090:** AI-Run Community Self-Improving Agent OS (human-in-the-loop, agent auth, failure-handling)
- **Doc 867:** Collectibles Three Tools (Lu.ma, Magnetiq, Unlock — identity + access + data ownership)
- **Doc 872:** Agent Effectiveness (live feedback, mid-flight clarification, steering, non-blocking patterns)
- **Doc 901:** Luma Build Days Series (fixed time ritual, daily cadence, cross-pollination constraints)
- **Doc 032:** Onboarding Growth Moderation (three-tier moderation, identity-weighted flags, Neynar gates)
- **Doc 191:** Reputation Scoring Systems (external signals inventory, Neynar + OpenRank + EAS + Talent + Gitcoin Passport)
- **Doc 258:** Weekly ZABAL Buyback (consistent small purchases, 1inch aggregation, commitment signal)
- **Doc 314:** Music Metadata, ISRC Codes & AI Distribution (Spotify playlist placement, 20% acceptance, metadata compliance)
- **Doc 315:** Revenue Stacking Model (single track earning Spotify + YouTube + NFT + Bonfire simultaneously)
- **Doc 321, 323:** AI Music Production Workflows (Suno v5.5, ElevenLabs voice cloning + video gen)
- **Doc 345:** Zabal Agent Swarm (VAULT/BANKER/DEALER, 3-agent coordination, 2-model routing, budget enforcement)
- **Doc 407:** Music NFT Sales via Coinflow (fiat-to-mint, 85% to artist, zero wallet friction)
- **Doc 525:** Token-Gating Platform Evaluation (Neynar Data Oracle best-fit, EAS tier 2 free, custom viem gate proven)
- **Doc 547:** Tailored Per-Person DMs (onboarding at scale, Nielsen 79% scan rate, 16% read full docs)
- **Doc 582 / 602:** Empire Builder API spec (6 new endpoints, self-serve booster, leaderboard creation, burn tracking)
- **Doc 584:** ZABAL Breaks Top 20 Empires (weekly cadence lever, cross-ecosystem boosters, dual-multiplier signal)
- **Doc 599:** Bonfire AI Knowledge Graph (multi-agent surface, passive indexing, GitHub + context layer)
- **Doc 630:** ZABAL Gamez Original Spec (season structure, mentor model, July open build, August Finals)
- **Doc 650:** Supabase Task Tracker (mentor check-in logging, status verification)
- **Doc 696:** Memetic Propagation (stories beat credentials, "seen by them" resonance)
- **Doc 695:** ZABAL Games Ecosystem Context (music first, community second, tech third; 11-section orientation brief)
- **Doc 704:** Incented Top 3 Campaigns (7-day cycles, Proportional + Quorum structures, engagement parallel to builds)
- **Doc 708:** Weekly Vote IS the Return Reason (hub architecture, voting above fold, daily entry point)
- **Doc 719:** Mentorship as Leaderboard Ownership (mentors manage Empire leaderboard, two-phase open + mentorship)
- **Doc 728:** React 19 useOptimistic (voting UX, instant feel, mode-specific disable)
- **Doc 723:** Agentic Prediction Battle Games (agent-as-judge precedent, x402 micropayments, Golden Codex/MOLT/Virtuals)
- **Doc 787:** Analytics Strategy (engagement loops, leaderboard visibility, creator metrics dashboard)
- **Doc 807:** Plan-Then-Measurable-Goal Execution (types-first prompting, adapter pattern, one numeric goal per sprint)
- **Doc 824:** Daily Slot Unified Format (artist/builder/creator same time, ecosystem project spotlight constraint)
- **Doc 840:** Photocaster + Empire Booster Raffle (teaches empire mechanics, collectible → booster → raffle FOMO)
- **Doc 844:** Artizen's Match-Funding Proof (distribution > capital, community-boosted entry signals)
- **Doc 850:** Multi-Fund Stacking (3x match multiplier, Artizen Emerging Culture + Festivals Fund)
- **Doc 865:** Conviction Voting Deposit Mechanics (slashing on incorrect votes, voting pool rewards correct voters)

### External Sources
- **Coursebox, Disco, Intrepid:** Cohort-based learning 70-96% completion vs 10-20% async (https://www.coursebox.ai/blog/cohort-based-learning)
- **Accountability Psychology Research:** 95% with specific appointments, 65% for general commitment
- **AngelHack Hackathon Best Practices:** Post-event 48h retention rule, pre-event friction, mentor utilization, small-wins psychology, daily standups (https://angelhack.com/blog/hackathon-best-practices/)
- **Headway:** Pair programming mentoring tips (1h/week structured + 2-4h pair-coding raises feature completion)
- **Edward Sturm:** Build-in-public accountability benefits
- **Farcaster Channels Documentation:** Channel-based distribution multiplier
- **Farcaster Mini Apps 2026:** Badge progression, notification best practices, Mini App notifications via Neynar
- **Human Passport:** Sybil classification via ML (80% farming pattern filter, free API)
- **Gitcoin Passport / Passport V2:** Humanity score API, flexible per-project thresholds
- **OpusClip:** Clip extraction + repurposing tools for short-form content
- **Hootsuite/Buffer:** 35+ network multi-platform posting
- **GitHub API Rate Limits:** 5000/hr authenticated
- **Devpost + HackerEarth:** Multi-judge panel on rubric (60-70% weighting), community prize smaller value post-judge display
- **MetaDAO:** TWAP oracle, bonded dispute window, Respect-weighted jury
- **Polymarket, Agora, GuessMarket:** Live prediction market infrastructure (40+ tools, MCP servers, agent wallet integration)
- **MOLT Productions:** Music agent platform, 0.01 SOL per track, tipping economy
- **Sybil Resistance in Blockchain Governance:** Reputation-based voting, token-gated credentials, Neynar scoring thresholds
- **Virtuals Protocol / x402:** Agent Commerce Protocol, Base/Solana/Arbitrum/XRP support, multi-chain agent payments
- **Personizely / Formbricks:** Real-time validation friction reduction (191% conversion lift on removal), progress indicators (53% signup completion boost)
- **Kalshi / Polymarket:** TWAP + spot price mechanics, max-change-per-update caps
- **Optimize Clip:** Short-form video strategy (10.38x higher engagement vs generic features, UGC conversion)
- **Unlock Protocol:** Time-based renewals, membership hooks, third-party verification, Member Keychain
- **Farcaster Frame Growth Loops:** Claim/flex/invite loops, weekly drops, streak loops, collab quests (source: https://medium.com/@bhagyarana80/5-farcaster-frames-growth-loops-worth-stealing-1dec934f8923)

### ZABAL Gamez Repo Files
- `/Users/zaalpanthaki/Documents/zabalgamez/CLAUDE.md` — Canonical project state
- `/Users/zaalpanthaki/Documents/zabalgamez/api/README.md` — API endpoint contracts
- `/Users/zaalpanthaki/Documents/zabalgamez/enter.html` — Registration form
- `/Users/zaalpanthaki/Documents/zabalgamez/data/workshop-leads.json` — Schedule source
- `/Users/zaalpanthaki/Documents/zabalgamez/data/adoptable-projects.json` — 62 projects ready
- `/Users/zaalpanthaki/Documents/zabalgamez/docs/audit-decisions-2026-06-04.md` — Ownership proof, hybrid judging, identity hybrid model
- `/Users/zaalpanthaki/Documents/zabalgamez/docs/season-1-roadmap-3month.md` — 3-month prep plan
- `/Users/zaalpanthaki/Documents/zabalgamez/docs/engagement-engine-concept-2026-06-09.md` — Collectible/XP spec
- `/Users/zaalpanthaki/Documents/zabalgamez/llms.txt` — Asset library, ZAO context

---

## CONCLUSION: THE JULY NORTH STAR

A successful July open-build is measured NOT by Finals winners, but by:
1. **50+ builders submitted** (participation funnel health)
2. **70%+ visibility compliance** (building-in-public adoption)
3. **95% mentor check-in completion** (accountability, not abandonment)
4. **30-day repo maintenance** (repos alive post-Finals, compounding network value)
5. **50%+ non-finalist Respect earning perceived as valuable** (retention past Finals)
6. **3+ published case studies** of builders → ecosystem funding (retroactive funnel proof)

The playbook above prioritizes VISIBILITY + PEER ACCOUNTABILITY + MENTOR EMBEDS over prize-chasing. Builders who ship in public, with mentors present, and earn Respect regardless of Finals placement, stay engaged long past August. That's the moat.

Ship it. Iterate. Measure. Report findings for Season 2.

---

**Document Date:** 2026-06-24  
**Prepared For:** ZABAL Gamez Leadership (Zaal, Project Leads)  
**Status:** Canonical. Ready for Implementation.  
**Next Review:** 2026-07-15 (Mid-Month Pulse Check Results)
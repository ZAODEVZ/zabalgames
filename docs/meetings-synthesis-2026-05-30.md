# ZABAL Gamez - Meeting Synthesis (2026-05-23 to 05-30)

> Date: 2026-05-30. Point-in-time synthesis of meeting docs 776, 778, 780, 782, 783, 784,
> 785, 787, 788. Organized by what to act on, not by meeting. Trust CLAUDE.md over this where
> they disagree. The July mechanism below is a DESIGN captured from calls - not yet built.

---

## 1. The system - 3 rails feeding one mechanism

ZABAL Gamez now has an end-to-end architecture. Three rails feed one judging mechanism.

**Rail A - Magnetiq = identity + front door (BUILT).**
ZABAL Gamez is a single magnet (not per-project) with an intro magnet under it; creating it
mints an NFT contract people join off of. Videos render as cards linking to YouTube. The ZABAL
Connector (QR proof-of-meet badging, ~67 people in) doubles as a warm email/notification list.
Email/Google login, on-chain abstracted, analytics-first. Open want: API/widgets to embed on
Zaal's own site (the "magnetiq bridge"). [778, 783 - Tyler]

**Rail B - Bonfires = knowledge graph + judging + incentive (DESIGNED).**
Builders bring their own harness + keys; a skill file pushes work to GitHub (wallet address in
an MD file) and makes ONE call to a register server that keeps {wallet -> repo}; a cron turns
new commits into Bonfire episodes. Data on GitHub, graph on Bonfires, Zaal maintains only the
list + scheduled push. Judging already exists (rubric-agnostic pipeline). [784 - Plat0x/Carlos]

**Rail C - Empire Builder + builder harnesses = the buildable surface.**
deploy-tokenless-empire is its own keyless endpoint (FID-based or blank); create2 + 0xSplits =
predictable treasury, nothing on-chain until first interaction. Zaal builds a
tokenless-empire-deployer button on his small-games site. [780 - Adrian]

**The mechanism - GitHub-auth judging.**
Signup = wallet/Farcaster + authenticate GitHub (multi-account OK); July commits scored by value
to the ZAO ecosystem; rolling admission; built in public. This is the load-bearing build; doc 784
is how it works under the hood. [778 + 784]

**The big idea - the knowledge game.**
July 1: ship an llms.txt of all ZAO brand info/assets. Knowledge-gathering phase = builders write
REPORTS to GitHub (not code), indexed into the graph; the game = whose reports get cited most in
the agent's daily summaries. Cited "remixes" across contributors. [784]

---

## 2. June presenter lineup (confirmed; mirrored into data/workshop-leads.json)

- **yerbearserker (Jordan Oram)** - Jun 1, 6-7am EST, "why you should have an empire" / Empire
  Builder V3. Front-of-house Empire Builder. [prior + 780]
- **Plat0x (Carlos)** - Jun 1, 5-6pm EST. Bonfire + the ZABAL Bonfire bot. Wants 3+ June sessions
  (workshops first half, panels second). [784]
- **Ohnahji** - Jun 2, 5-6pm EST. His journey in live streaming. [prior]
- **Adrian (@diviflyy)** - recorded Empire Builder API workshop: V3 endpoints for an existing
  empire + leaderboard; optional deploy-a-new-empire. In Poland through June (better TZ for
  second-half panels). [780]
- **Duo Do (Clementine + Santiago)** - first week of June; musician-on-Farcaster + road-to-Farcon.
  Pre-recorded talk + live Q&A. [776]
- **Jonathan Colton / JC (FounderCheck)** - two talks: FounderCheck (founder validation), and
  propagating-your-work-on-Farcaster-as-a-developer. [785]
- **kmac.eth** - June presentations; also recruited Cassie (accepted). Frames it as his "mini
  Trojan horse" to onboard his community to Farcaster. [788]
- **Cassie** - recruited by kmac; topic TBD. Re-engineered spaces for Quorum. [788]
- **Tyler (Magnetiq)** - Jun 1 live Magnetiq demo + AMA (the platform itself). [778]
- **Ven (The Open Machine)** - invited to a June workshop (any topic, <30 min); NOT yet locked. [782]

---

## 3. Timeline + format

Shape: 3 months. June = workshops/learning, low-friction. July = open build / submissions,
curated + GitHub-judged. August = top-curated, streamer-games stream-a-thon for distribution.

June cadence: first half = workshop-style (one-off presentations); second half =
panel/conversation/AMA style. Talks are <30 min, recorded-first (removes live-performance pressure
+ timezone constraints), ZAO team clips into ~15-sec pieces.

Pre-record-then-live-Q&A is the validated default for all presenters - the value is the room's
feedback, not the delivery. [776]

---

## 4. Cross-cutting theses (recurring across calls)

- **Cozy-corner != product-market fit** (JC, kmac, Ven-adjacent). People mistake Farcaster users
  trying their app for PMF; apps get social-driven users, misread it as validation, stall.
  Implication: push builders to test with general-market call-to-actions, not just insiders.
  [785, 788]
- **One-tap social-share-to-feed is the killer onboarding mechanic.** Build it into everything.
  [788]
- **Beta-tester team / vibe-coding agency** (JC, Ven). A team of skilled testers who can vibe-code
  fixes, solving the "new builders have no real test users" gap. Keeps surfacing. [782, 785]
- **Platform lock-in escape.** Both Magnetiq (on-chain, portable data) and Bonfires (push-and-own)
  keep Zaal's data portable. [778, 782, 784]

---

## 5. Owner do-now tasks (consolidated, NOT code in this repo)

- Build the register-server + cron-to-Bonfire push, send to Plat0x [784] (handed off).
- Prep the llms.txt of all ZAO brand info/assets before July 1 [784].
- Build the GitHub-auth judge + intro magnet (~4-day sprint) [778].
- Build the tokenless-empire-deployer button on the small-games site [780].
- Fix the ZABAL Gamez magnet logo (png says "ZABAL" not "ZABAL Gamez"); send Tyler the real logo;
  Samantha makes it on Canva (3 ratios) [783, 778]. (Launch-visible: collect.zabalgamez.com.)
- Make the Fractal proof-of-meets (behind since the 24th) [783].
- Send Duo Do the Rose/Thorn/Bud concept over WhatsApp [776].

---

## 6. Open decisions / things needing Zaal

- **Bonfires founder: RESOLVED.** Josh (Joshua.eth) founded Bonfires; Carlos (Plat0x) is the
  technical architect; Ryan is associated + authors the SDK. Prior docs 648/669/682 that called
  Ryan the founder are superseded. (bonfire-graph.json corrected accordingly.)
- **Bonfires dependency risk.** Judging + graph are Bonfires-owned. Consider a fallback before
  building the whole submission flow on it. [784]
- **JFS-signer ask.** kmac has a line to Neynar devs; thinks they would soften the
  JFS-signer-on-all-snap-actions requirement. If it lands, less friction for every Snap built
  during ZABAL Gamez. Track as a dependency. [788, 718]
- **Magnetiq API/widgets.** On Tyler's roadmap; Zaal to research Flow/EVM for the bridge. Not
  blocking June. [778]

---

## 7. Networking / adjacent (non-ZABAL)

- **Ven / The Open Machine** - cypherpunk/post-AI nonprofit; projects Crop Circle, mindz.fun,
  Gitcoin research-a-thon, Dark Forest space. Lane = discovery+distribution. Invited to ZAOstock
  Oct 3. [782]
- **Telamon Ardavanis / Edge Esmeralda** - June Healdsburg trip on the table, code TELA25; Goa
  late July. [777]
- **Iman** - Discord bot setup taught (dev portal, OAuth, gateway intents); Zaal hosts + tests
  another bot. [787]

---

## 8. Who's who

Tyler Stambaugh - Magnetiq founder (identity/hub rail). | Plat0x = Carlos - Bonfires technical
architect (Josh = founder). | Adrian (@diviflyy) - Empire Builder cofounder, API side (Jordan Oram
= front). | Duo Do = Clementine + Santiago - musician couple, Farcaster. | JC = Jonathan Colton -
FounderCheck builder, ex-strategy consultant. | kmac.eth - Farcaster snap-builder, JFS expertise. |
Ven - PDX DAO friend, The Open Machine. | Cassie - recruited by kmac; re-engineered spaces for
Quorum. | Eric - JC's partner on viral PFP gen.

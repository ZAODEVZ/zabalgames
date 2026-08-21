# Season 1 handoff prompt - 2026-08-17

Everything from the 2026-08-17 working session, compressed into something another
agent can act on cold. The paste block below is self-contained: it assumes the
reader knows nothing about ZABAL Gamez.

Branch with all the work: `claude/zabal-gamez-season-1-finals-cctq96` (7 commits,
pushed, no PR opened). Updated 2026-08-17 after Zaal's decisions came back.

---

## What happened this session, in brief

Three workstreams ran in one pass.

1. **The finalists announce.** Zaal supplied a newsletter, five casts, a
   `finals.json` payload and a dates-ask DM. These were fact-checked against the
   repo, three corrections applied, and organised into paste blocks. Nothing sent.
2. **The security audit.** An external report from Luis Felipe (felirami), Aug 3,
   six findings, plus a reply thread agreeing scope and order. All six fixed, plus
   a seventh gap found in the thread (unpinned MCP dependencies).
3. **The site audit.** The site still read as though entry was open and the vote
   decided the finals. Fixed across 66 files.

Key artifacts now in the repo:
- `docs/finals-six-announce-2026-08-17.md` - the paste blocks, blockers, open decisions
- `docs/season-1-final-two-weeks-audit-2026-08-17.md` - full audit and the ordered
  list of what remains through Aug 31
- `data/finals.json` - the six finalists
- `data/season-1-results.json` - the empty state to populate after Aug 30

---

# PASTE BLOCK - hand this to the agent

```
You are picking up ZABAL Gamez Season 1 with 13 days left. Read this whole brief,
then tell me what you would do next and in what order. Do not start editing until
we agree the plan.

## What ZABAL Gamez is

The ZAO's 3-month build-a-thon. June workshops, July open build, August finals.
Free, any harness, three tracks: artist, builder, creator. Not a video-game
contest. The site is zabalgamez.com - a static site plus Vercel edge functions
that is also a Farcaster Mini App. Repo: zaodevz/zabalgames. Read CLAUDE.md first.

Brand rules are hard: no emojis, no em dashes (hyphens only), no crypto or web3
jargon in public copy, "100+" for ZAO member count.

## Where the season stands

- The board closed Sunday Aug 16. 15 people entered, roughly 30 projects went
  up (exact count still to be confirmed, see blocker 2).
- Six finalists are named, two per track. Zaal picked them. There was no vote -
  a quadratic ballot ran in month two to gauge opinion and was retired Aug 11.
  Nothing on the site displays tallies any more.
  - ARTIST: dee-13 (Ledger) and n3m / LadyrynNemesis (N3M3SIS - THE CALL OUT)
  - BUILDER: jdwalka (JohnDaWalka) and ghostmintops (Brandon)
  - CREATOR: presdency.eth (HOOD) and uniquebeing404 (ColorZAO)
- The eight who entered and did not advance, thanked by name in the announce:
  kayonfire, Pascaline, breadcoop, taydexfun, gesd1, pyrofirezerox, mettodo,
  Branth. A fifteenth entrant, imanafrikah, is roster but not competing.
- Battles run Aug 24 to 30, one head-to-head per track, live on WaveWarZ
  community battles (the live Solana product, NOT WaveWarZ-Base, which was an
  earlier plan that never shipped). The crowd trades the battle onchain. The
  champion comes from a combined score: market result, a judges' panel of the
  three track mentors, and a third factor still being locked.
- Prizes: 500 USDC, tiered. 300 rides on the battles (70 to each track winner, 30
  to each runner-up); 200 follows trade volume across all six, capped at 80 each.
  Ceiling 150, floor 30 plus a volume share, nobody on zero. Plus ZABAL rewards and
  both the Finisher and Champion collectibles. Season ends Aug 31. This tiered
  structure replaced an equal-share promise that had been published; Zaal made that
  call explicitly on Aug 17 and every page was updated.

## What is already done and on branch claude/zabal-gamez-season-1-finals-cctq96

Seven commits, pushed, no PR. Read these two docs before anything else:
- docs/finals-six-announce-2026-08-17.md
- docs/season-1-final-two-weeks-audit-2026-08-17.md

1. The announce kit. Newsletter, five casts, dates-ask DM, verified Farcaster
   handles and FIDs. NOTHING HAS BEEN SENT. Zaal sends all of it.
2. data/finals.json has the six, the window Aug 24 to 30, and a `battles` array
   that drives the schedule on /august. settled:false until results are in.
3. Site reconciled to a closed board: /august, /finals, /finals/live,
   /leaderboard, /submissions, /board, /submit, /results, and the homepage
   season clock, which previously had no phase after Aug 1.
4. 82 links across 66 files that pointed at the retired /enter page were
   retargeted to /leaderboard, /august or /submissions.
5. All six findings from the Aug 3 external security audit are fixed, plus an
   unpinned MCP dependency manifest. poidh-watcher and win-notify now fail
   closed, the Farcaster webhook FID binding no longer fails open on a hub
   outage, timingEq is a single shared export, marked is self-hosted instead of
   loaded from jsdelivr, mcp/package-lock.json exists, and a CSP is staged
   (object-src and base-uri enforced, full policy report-only, frame-ancestors
   deliberately absent so Farcaster clients can still embed the Mini App).

Validate with: node scripts/validate.mjs   (there is no test suite)

## What is blocking the announce

1. HOOD (presdency.eth) and Ledger (dee-13) were still status:"draft" as of
   Aug 10, which makes them invisible on /submissions. The post names both
   people as finalists and links to that board. NOTE: this cannot be done at
   /review - that page exposes only Delete and Hide, and the API's publish action
   accepts only the submitter's own FID or editToken, not admin. The two routes
   that work are written up in docs/finals-six-announce-2026-08-17.md under "The
   publish click-path": ask the two of them (preferred), or use action:'update'
   with ready:true as admin.
2. Settle the project count. The announce says 30 as a placeholder. Aug 10 read
   32 rows including 2 QA-test rows (30 real); Aug 11 published "thirty"; Aug 17
   read 31 rows with the QA state unknown, so the truth is 29, 30 or 31. QA rows
   are identifiable by "QA Test" in the name - the site filters on exactly that
   at august.html:270 - so one command settles it. It is written out in
   docs/finals-six-announce-2026-08-17.md under "The project count". Use the exact
   number, not a "30+" hedge: the board is closed so the count is final, and the
   "100+" convention is for numbers that still move.
3. Zaal's yes on the four redrafted why-lines for jdwalka, ghostmintops,
   presdency and uniquebeing404. They are written and in the paste block; the
   project claims are sourced but the sustained-presence claims are his
   observations to confirm.
4. Lock the third scoring factor, targeted Thursday with the schedule.

## Settled Aug 17, do not reopen

- The prize split is the tiered structure above. Decided against equal shares.
- Mentors are announced UNNAMED as "a judges' panel" until they lock, targeted
  Thursday. Do not put names on /august before then.
- Say NOTHING in the announce about uniquebeing404 moving from the builder board
  to the creator final. The picks-are-mine framing covers it; Zaal answers if asked.

## Known sensitivity

kayonfire topped the builder support board before the vote was retired and is not
a finalist. Defensible, since no tallies are displayed anywhere and the announce
leads with "no vote, the picks are mine", but it is the question you will get, and
kayonfire's DM is the one worth writing by hand.

## Known gaps for the final two weeks

- The battle schedule surface IS built and renders on /august from the `battles`
  array in data/finals.json. Publishing Thursday's dates is a JSON edit: fill
  date, time and watch per battle and flip status to "scheduled". No HTML change.
- /finals/live renders the six but its Trade button is disabled and its copy
  still describes a WaveWarZ-Base scaffold that was never built. Either wire it
  to real WaveWarZ battles or point people at WaveWarZ and stop maintaining it.
- The homepage hero has not been rewritten for battle week. The clock handles the
  phase; the copy does not.
- After Aug 30: populate data/season-1-results.json and flip status to "final";
  set ranks in data/finals.json and settled:true, which is what makes /winners
  render; distribute the USDC and both collectibles.
- Two env vars are unset and matter. FARCASTER_HUB_URL arms the strict webhook
  FID binding. INTAKE_KEY or ADMIN_KEY is now required by poidh-watcher, which
  returns 503 without it.
- No regression tests were added for the security fixes. The repo has no test
  harness and finals week was judged the wrong time to stand one up.

## Your task

Read the two docs named above and the repo state. Then tell me:
1. What you would do first, second and third, with reasoning.
2. Anything in the above you think is wrong, risky, or missing.
3. What you need from Zaal before you can move, separated from what you can do
   without him.

Do not send, post, cast, or publish anything. Do not open a PR. Ask before any
outward-facing action.
```

---

## Notes for whoever pastes this

- If the agent has no repo access, it can still answer from the brief alone, but
  it will not be able to verify anything. Give it the repo if you can.
- The brief deliberately does not name the mentors, because none are confirmed
  publicly. Add them once they are.
- A relayed note arrived this session from the zaoos-infra lane claiming the
  announce draft named the wrong finalists in two tracks. Its own list of the six
  was identical to the draft's. Nothing was changed on the strength of it. If a
  superseded draft is circulating that names kayonfire, Pascaline, taydexfun or
  gesd1 as finalists, kill it at the source - it is not what is on this branch.

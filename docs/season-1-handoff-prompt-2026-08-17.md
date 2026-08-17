# Season 1 handoff prompt - 2026-08-17

Everything from the 2026-08-17 working session, compressed into something another
agent can act on cold. The paste block below is self-contained: it assumes the
reader knows nothing about ZABAL Gamez.

Branch with all the work: `claude/zabal-gamez-season-1-finals-cctq96` (5 commits,
pushed, no PR opened).

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

- The board closed Sunday Aug 16. 15 people entered, 30 projects went up.
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
- Prizes: a share of the 500 USDC pool, ZABAL rewards, and both the Finisher and
  Champion collectibles. Season ends Aug 31.

## What is already done and on branch claude/zabal-gamez-season-1-finals-cctq96

Five commits, pushed, no PR. Read these two docs before anything else:
- docs/finals-six-announce-2026-08-17.md
- docs/season-1-final-two-weeks-audit-2026-08-17.md

1. The announce kit. Newsletter, five casts, dates-ask DM, verified Farcaster
   handles and FIDs. NOTHING HAS BEEN SENT. Zaal sends all of it.
2. data/finals.json has the six, window Aug 24 to 30, settled:false.
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
   people as finalists and links to that board. Publish them at /review first.
2. Re-verify the project count. The announce says 30. The raw feed said 32
   including two QA-test rows, and the thread published Aug 11 said thirty.
   Check: curl -s "https://zabalgamez.com/api/submissions?feed=projects"
3. Confirm and publicly name the three track mentors. They ARE the judges'
   panel and the champion formula depends on them, but /august still shows all
   three slots as "confirming".
4. Lock the third scoring factor.
5. Four why-lines in the announce are still [ZAAL LINE] placeholders, for
   jdwalka, ghostmintops, presdency and uniquebeing404. Grounded fallback drafts
   sit beside them. Zaal has context the picksheet lacks, so these need his words.

## Decisions only Zaal can make

- THE PRIZE SPLIT CONTRADICTS ITSELF. finals.html line 120 is live right now and
  promises "Every finalist receives an equal share of the 500 USDC pool. The same
  for all six, not a slice by rank." docs/finale-standings-2026-08-10.md proposes
  300 USDC head-to-head (70 win / 30 lose) plus 200 USDC volume-weighted capped
  at 80 each. Those cannot both be true and the published one is equal shares.
  The announce copy says "a share of the pool", which is compatible with either,
  so the post can go out before this is settled. Nobody has resolved it.
- Whether to explain uniquebeing404 moving from the builder board to the creator
  final. n3m choosing her track was already public; this move was not.
- kayonfire topped the builder support board before the vote was retired and is
  not a finalist. Defensible, since no tallies are displayed and the announce
  leads with "no vote, the picks are mine", but it is the question you will get.

## Known gaps for the final two weeks

- There is no per-battle schedule surface anywhere. Six finalists and three
  mentors will ask where it is as soon as dates are agreed on Thursday.
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

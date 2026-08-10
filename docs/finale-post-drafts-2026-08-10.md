# Season 1 finale - post drafts

Drafted 2026-08-10. **Both are drafts for Zaal to post. Neither has been sent.**

Grounded in the live API (`/api/submissions?feed=projects` and `/api/qv-vote`),
the repo's own finals and prize copy, doc 2257 (the season retrospective), and
doc 1372 (ZAOstock economics). Every figure traces to one of those.

## Revision history, because the ground moved three times

1. **First draft** was written off `?feed=builders`, which returns only the
   audited roster file - a partial view. It said 15 projects from 3 submitters
   and "no votes". Wrong on all three.
2. **Corrected** to the real field: 30 projects from 15 named builders plus 1
   anonymous submitter, ranked by the open quadratic vote.
3. **Reframed to people** when Zaal settled that finalists are people, not
   projects: two per track, six in total, all six present at the end of the month.
4. **Reframed again to curation**, 2026-08-10: "We aren't doing it based on their
   votes, it's gonna be all decided by Zaal." The leaderboard is now published as
   a support signal and the post says so explicitly.

Draft 2 was never affected by any of this.

Brand rules applied: no emojis, no em dashes, "100+" for the member count. The
no-crypto-jargon rule is relaxed for the challenge post only, per Zaal.

---

## What Draft 1 deliberately does and does not say

**It says the six are curated, before it shows the leaderboard.** This is the
load-bearing decision in the post. Curation is defensible and breaks no promise -
the vote page is headed "Vote for who is best." and has never claimed to select
finalists. But a leaderboard published alongside a finalist announcement reads as
the selector unless you say otherwise first, and being told afterwards is what
would actually burn people. Order matters more than wording here.

**It names no finalists.** Gesd01 versus dee-13 for the artist slots is
unresolved, and LadyrynNemesis has to choose which of her two tracks she competes
in. The post commits only to announcing the six at the end of the week, so none of
that has to be settled to publish today.

**It publishes the prize split, flat, with no conditions.** $300 across three
WaveWarZ community battles, $200 by trade volume capped at $80 each. An earlier
version carried a fallback clause because the repo's finals copy describes an
undeployed WaveWarZ-Base contract. That copy is stale: the finals run on live
WaveWarZ community battles, so the volume metric has a real source and the post
states it without hedging.

**It does not claim everyone is on the ballot.** Three submissions are still
drafts, which makes them invisible on the board as well as the ballot. The post
asks those three to finish this week without naming them.

---

## DRAFT 1 - the announcement (4-cast Farcaster thread)

FINAL, pending the four-row removal and the newsletter going live first.
Nothing has been posted.

**The newsletter is the canonical version and this thread points at it**, per Zaal.
Full detail is in `docs/newsletter-2026-08-10-finals.md`, paste target
paragraph.com/@thezao. The thread carries only what someone needs to act on today.
Cast 4 must have the real newsletter URL pasted in before posting - it reads
`[NEWSLETTER LINK]` so it cannot go out half-filled by accident.

Four casts because the full text is well over the 1024-byte cast limit. Each is
sized below it and stands alone, so a reader who only sees cast 2 still gets an
actionable board.

### Cast 1 of 4 - how it ends, and that the six are curated (556 bytes)

```
zabal gamez season 1 - how it ends

six finalists. two per track. three finals in the last week of august, and the six of you agree the dates between yourselves rather than being handed a slot.

the six are picked, not tallied. i am choosing them at the end of this week.

the vote at zabalgamez.com/vote was built to help me curate the open submissions and that is exactly what it is doing. it is one of the loudest things i am reading. but it is an input, not the decision, and i would rather you hear that from me now than work it out from a list later.
```

### Cast 2 of 4 - the board, and the three still in draft (521 bytes)

```
where the support sits today, with a week still to go:

artist
  ladyrynnemesis 41
  gesd01 5

builder
  kayonfire 37
  uniquebeing404 10
  ghostmintops 5
  jdwalka 4
  branth 4
  pascaline 3
  ladyrynnemesis 3
  breadcoop 3
  mettodo 3

creator
  ladyrynnemesis 9
  iman afrikah 8
  taydexfun 6

two votes separate first from third in creator. closest race on the board.

and if your build still says building, it is invisible - not on the board, not on the ballot, not in front of me. three of you. finish it this week.
```

### Cast 3 of 4 - the bonus brief (564 bytes)

```
new, and it starts now - the bonus. one brief, open to everyone, and answering it moves you up before i pick.

design the next way fans fund an event and share in it. pick a brand: zao festivals, wavewarz, or zabal gamez.

zaostock is oct 3. costs 5-7k, projects 8.7-10.2k back, tickets are 4.7k of it. grants, sponsors, tickets - all one directional. the people who show up own none of what they helped make. fix that.

any format. doc, diagram, contract, demo, video, a track if you can pull it off. thinking over polish.

post it in /zabal or it does not count.
```

### Cast 4 of 4 - the prize, and the link to the newsletter (514 bytes)

```
what the six are playing for. $500 usdc:

$300 - three wavewarz community battles, one per track. win yours, $70. lose it, $30. nobody gets zero.

$200 - split across all six by the trade volume your battle pulls, capped at $80 each.

most anyone walks with is $150.

on top of that, straight from wavewarz: 1% of every trade on your side of the battle, forever. plus both collectibles. the june prize tier stands in full.

full details, the board with every build linked, and how the vote works:
[NEWSLETTER LINK]
```

**Why it is shaped this way.** Cast 1 carries the curation disclosure and it lands
before the numbers on purpose - a leaderboard published next to a finalist
announcement reads as the selector unless you say otherwise first. Zaal's own
framing does the work: the vote was built to help curate the open submissions,
which is warmer and more accurate than calling it a signal.

Cast 3 is the reason to post today rather than at the end of the week. The
tokenization brief is no longer a separate challenge - it is the mechanic for
moving before the pick, answerable in any medium, gated only on being posted in
/zabal.

Cast 4 ends on the link, because the newsletter is where the board is actually
legible: every build named and linked, the vote explained, the arithmetic shown.

**Five things to check before posting.**

1. Run the four-row removal and the tally `ZREM` FIRST. Until then the live /vote
   page shows the QA test at 25 votes in second place on artist while cast 2 shows
   a two-name artist board. The numbers here are correct for a post-removal state.
2. Publish the newsletter BEFORE the thread and paste its URL into cast 4.
3. No finalist is named. But cast 1 commits to naming the six at the end of this
   week, so Gesd01 versus dee-13 and LadyrynNemesis's track choice are due by then.
   Today is Monday 2026-08-10, so that is the 14th to the 16th. Name the exact day
   if you want one - I have not invented one.
4. The collectible line does not name the rail, matching the #588 scrub.
5. "three of you" is dee-13, Presdency.eth and pyrofirezerox - unnamed on purpose.

**One thing that needs your call: what "moves you up" actually means.** You said a
bonus drop upgrades you on the leaderboard. The displayed leaderboard is the vote
tally, and a Farcaster post cannot change vote counts - no bonus-points system
exists. So the copy says a bonus answer moves you up *before I pick*, which is true
under curation and delivers the intent. If you meant it should literally move the
numbers on the board, that is a feature we do not have and I have not built it.

---

## DRAFT 2 - the bonus tokenization challenge (FOLDED IN, do not post separately)

**Superseded 2026-08-10.** Zaal folded this into the finals as THE bonus: answer it
in any medium, post it in /zabal, and it moves you up before the six are picked. It
now lives in cast 3 of the thread and in full in the newsletter's bonus section.

Kept below as the source the compressed versions were cut from. Do not send it as
its own post.

### Original standalone draft

```
bonus challenge - optional, worth real points

design the next tokenization model for crowdfunding events. pick a
brand to build it for: zao festivals, wavewarz, or zabal gamez.

the real problem, with real numbers:

zaostock is oct 3. it costs 5-7k to put on and projects 8.7-10.2k
in revenue. tickets are the biggest single line at 4.7k. right now
it is funded by grants, sponsors and ticket sales - all one
directional. money goes in, the event happens, and the people who
showed up own none of what they helped make.

so: how do fans fund an event and share in it?

three constraints that make this hard, and interesting:

1. the event ends. it is one day. whatever someone holds has to
   still mean something on october 4th.
2. tickets already work. if your model does not wrap or beat the
   thing people already pay for, it is a second ask.
3. it is 6k, not 6m. this has to work at community scale.

what already exists, so you build instead of rebuild:

  sparkz          creator coin launcher, multi-recipient fee
                  splits. shipped and running.
  ticketing       unlock protocol on base plus poap. decided.
  treasuries      juicebox and giveth. evaluated, not adopted.
  f2dc            a group crowdfund coin idea. never scoped.

what does NOT exist, and is where the design space is:

  fan co-ownership. sparkz is creator-first. nothing is
  community-first.
  anything that works across more than one event. one event, one
  token, no continuity.
  rewarding people after an event instead of before it.

read the brands before you design for one:
  zabalgamez.com/zao-festivals
  zabalgamez.com/wavewarz
  zabalgamez.com/zabal-gamez-brand

every number above is on those pages with a source.

no wrong format. a doc, a diagram, a contract, a working demo, a
five minute loom. we care about the thinking, not the polish.

post it as your daily update and tag it bonus.
```

**Why it is shaped this way.** The three constraints are what make it a brief
rather than a prompt, and "the event ends" is the one most crypto crowdfunding
designs quietly dodge. The already-exists list is there so nobody spends a week
rebuilding Sparkz - and it is the part that makes a good answer usable rather than
interesting.

The problem is real and dated: ZAOstock is October 3 and currently unfunded beyond
grants that are themselves blocked. A strong answer here is something you would
actually use in eight weeks.

---

## Sources

- `https://zabalgamez.com/api/submissions?feed=projects` - 32 rows, of which 30
  are real projects and 2 are QA tests queued for deletion. Track split builder
  19 / creator 7 / artist 6. Status split published 23 / building 7 / planned 2.
  15 named builders plus 1 anonymous submitter. Fetched raw with curl, HTTP 200,
  2026-08-10.
- `https://zabalgamez.com/api/qv-vote?results&track=...` and `?candidates` -
  status open, ballots artist 10 / builder 9 / creator 6. Fetched raw with curl,
  HTTP 200, 2026-08-10. Full standings in `docs/finale-standings-2026-08-10.md`.
- Person totals in the post are the per-track sum of each person's rows in that
  tally, with ids 5, 6, 2 and 4 excluded. No person currently holds more than one
  row on a single track, so the summing changes no position today. 13 of the 16
  submitters are on the ballot; the 3 who are not have submissions still in
  `building`.
- SUPERSEDED: `?feed=builders` - 15 submissions from 3 submitters. This is the
  audited roster file only and is a partial view of the field. It is what produced
  the wrong first draft. Do not rank off it.
- Doc 2257 - 32 sessions, 31 distinct presenters, 25 organisations, the July stall.
- Doc 1372 - ZAOstock economics: 5-7k expenses, 8.7-10.2k projected revenue,
  4.7k ticket line.
- June 8 2026 newsletter - the prize tier, quoted rather than paraphrased.

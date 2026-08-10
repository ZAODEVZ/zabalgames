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

**It publishes the prize split, with the fallback in the same breath.** $300 across
three head-to-head battles, $200 by trade volume capped at $80 each. The WaveWarZ
contract is not deployed yet, so the post states what happens if the market is not
live rather than quietly promising a metric that may not exist.

**It does not claim everyone is on the ballot.** Three submissions are still
drafts, which makes them invisible on the board as well as the ballot. The post
asks those three to finish this week without naming them.

---

## DRAFT 1 - the announcement

FINAL, pending the four-row removal (runbook in
`docs/finale-standings-2026-08-10.md`). Nothing has been posted.

```
zabal gamez season 1 - how it ends

two people per track go through. six finalists, all six there at
the end of the month. three finals in the last week of august,
and the finalists pick their own dates inside that week. you are
not handed a slot, you agree one with the people you are
finishing alongside.

the six are picked, not tallied. i am choosing them, at the end
of this week, from everything the season actually produced. the
vote running at zabalgamez.com/vote is what it says on the tin -
who is best - and it is one of the loudest things i am reading,
but it is a signal, not the selector. i would rather say that
plainly now than have you find out from a list.

where the support sits today:

  artist
    ladyrynnemesis          41
    gesd01                   5

  builder
    kayonfire               37
    uniquebeing404          10
    ghostmintops             5
    jdwalka                  4
    branth                   4
    pascaline                3
    ladyrynnemesis           3
    breadcoop                3
    mettodo                  3

  creator
    ladyrynnemesis           9
    iman afrikah             8
    taydexfun                6

submissions are open all week. that is the part that matters. if
your build is still sitting in draft it is invisible - not on the
board, not on the ballot, not in front of me. three of you are in
that spot right now. finish it this week.

what the six are playing for, $500 usdc:

  $300  three head to head battles, one per track. win yours,
        $70. lose it, $30. everybody gets paid.
  $200  split across all six by the trade volume your battle
        pulls, capped at $80 each so one big trade cannot take
        the pool.

most anyone can walk with is $150. if the market is not live in
time, that $200 rolls into the battles instead and the winners
take $110.

on top of that: 1% of all trade volume on your battle entry,
forever, and both the finisher and champion collectibles. the
june prize tier stands in full.

---
the season itself, for anyone who missed it: 32 sessions in june,
31 different people teaching, 25 organisations. july was quiet.
we are not going to pretend otherwise, and the june record stands
on its own.
```

**Why it is shaped this way.** The second paragraph is the one that earns the
post. Curating the six is completely defensible, and the vote page has only ever
said "vote for who is best" - but a leaderboard published in the same breath as a
finalist announcement will be read as the selector unless you say otherwise
first. Saying it in Zaal's own voice, before anyone can discover it, converts the
weakest structural fact in the season into the most trustworthy line in the post.

Publishing the leaderboard anyway is right: it is real support, it is already
public at /vote, and hiding it would look worse than the thing it hides.

The prize block is here rather than held back because it is the strongest
motivator available with a week of submissions left, and the WaveWarZ fallback is
stated in the same breath so it cannot become a broken promise.

**Four things to check before posting.**

1. The four rows must be removed first, or the artist board is wrong on the live
   page: the QA test row sits at 25 votes, second place, until it is cleared. The
   numbers above are already correct for a post-removal state.
2. No finalist is named, deliberately. Gesd01 and dee-13 are unresolved for the
   artist slots, and LadyrynNemesis still has to choose her track. None of that
   needs settling to post this.
3. The collectible line does not name the rail. The rail is unchanged, but the
   partnership retirement means the public copy describes the collectibles and not
   the vendor. `about.html` was scrubbed the same way in #588.
4. "three of you are in that spot" is dee-13, Presdency.eth and pyrofirezerox.
   Unnamed here because under curation the point is to finish, not to be singled
   out. Name them if you would rather - it would probably work.

**One follow-on this creates.** If the six are curated, `/vote` and `/finals`
should say so too, or the site contradicts the post. That is a small copy PR and
I have not written it - say the word.

---

## DRAFT 2 - the bonus tokenization challenge

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

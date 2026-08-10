# Season 1 finale - post drafts

Drafted 2026-08-10. **Both are drafts for Zaal to post. Neither has been sent.**

Grounded in the live API (`/api/submissions?feed=projects` and
`/api/qv-vote`), doc 2257 (the season retrospective), and doc 1372 (ZAOstock
economics). Every figure traces to one of those.

**Corrected 2026-08-10.** The first version of Draft 1 was written off
`?feed=builders`, which returns only the audited roster file - a partial view. It
said 15 projects from 3 submitters and "no votes". The real field is 30 projects
from 15 named builders plus 1 anonymous submitter, and a quadratic vote is open
and is the criterion. Draft 1 below is rewritten. Draft 2 was never affected.

**Updated again 2026-08-10, after Zaal settled the open rule.** Finalists are
**people, not projects**: two people per track, six in total, all six present at
the end of the month. And **submissions stay open this week**, so the leaderboard
publishes as a live snapshot with a week left to climb, not as a cut. Draft 1 now
ranks people and says the week is open.

Brand rules applied: no emojis, no em dashes, "100+" for the member count. The
no-crypto-jargon rule is relaxed for the challenge post only, per Zaal.

---

## What these drafts deliberately do NOT say

**No finalist list.** The leaderboard is live and the week is still open, so
today's order is a snapshot, not a selection. Draft 1 says that in as many words,
which is what makes it safe to post today.

**No ruling on whether one person can hold two slots.** LadyrynNemesis is
currently first in artist and first in creator. Under "six total, all six
present" that has to resolve to one person one slot, and the post is written so
it reads correctly either way - it publishes the per-track order and does not
name six finalists. The standings doc sets out both readings and what each does
to Halit Tayyar, who is in under one and out under the other. Zaal states the
rule before anyone reads the order as a result.

**No claim that everyone is on the ballot.** 13 of the 16 submitters are. The
three who are not have submissions still in `building`, which the week that is
still open is exactly the fix for - and the post asks for it directly.

---

## DRAFT 1 - the announcement

FINAL. Post the removal first (see the runbook in
`docs/finale-standings-2026-08-10.md`), then this.

```
zabal gamez season 1 - how it ends

two people per track go through. six finalists, all six there at
the end of the month. three finals in the last week of august,
and the finalists pick their own dates inside that week. you are
not handed a slot, you agree one with the people you are
finishing alongside.

who goes through is decided by you. the vote is open at
zabalgamez.com/vote. 100 credits per track, and backing someone
costs the square of the votes you put on them, so ten votes on
one person spends everything you have. nobody buys a track.

where it stands today:

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

read that as a snapshot, not a result. submissions are open all
week and the board moves every day. two votes is the whole gap in
creator. if you are outside the top two this morning you have a
week to fix it.

one name is currently top of two tracks. how that resolves gets
said out loud before anything is final, not after.

and if your project still says building, you are not on the
ballot yet. that is three of you. finish the submission this week
and you are on it. dee-13, that turns artist from a two-horse
walkover into an actual race.

every finalist takes the full prize tier promised in june: a
share of the 500 usdc pool, $zabal rewards, and both the finisher
and champion collectibles. that has not changed and will not.

---
the season itself, for anyone who missed it: 32 sessions in june,
31 different people teaching, 25 organisations. july was quiet.
we are not going to pretend otherwise, and the june record stands
on its own.
```

**Why it is shaped this way.** It ranks people because that is what a finalist
now is, and it prints everyone who has a vote rather than the top two, because a
leaderboard people can find their own name on is the thing that makes the last
week worth playing. The one omission is sentra, on zero, which is on the ballot
but has nothing to show yet. The vote paragraph explains quadratic voting in one
sentence without using the term, because the mechanism is the answer to "why
should I trust this" and burying it invites the accusation it prevents.

The two lines doing the real work are the snapshot line and the building line.
The first stops today's order being read as a cut, which is the entire reason
this can go out mid-week. The second converts the only remaining coverage gap
into a call to action: three people are off the ballot because their submission
is unfinished, and the week is open, so the fix is theirs and it is easy. Naming
dee-13 is deliberate - artist is a two-person walkover until someone contests it,
and saying so is more honest than quietly running a two-horse race.

**Four things to check before posting.**

1. The four rows must be removed first, or the artist board is wrong on the live
   page: the QA test row sits at 25 votes, second place, until it is cleared. The
   numbers above are already correct for a post-removal state.
2. LadyrynNemesis appears in artist and in creator. That is real and the post
   shows it rather than hiding it, but the one-person-one-slot rule needs stating
   soon - under it, Halit Tayyar (taydexfun) is in; without it, they are out. See
   the standings doc.
3. The collectible line does not name the rail. The rail is unchanged, but the
   partnership retirement means the public copy describes the collectibles and not
   the vendor. `about.html` was scrubbed the same way in #588.
4. "three of you" is dee-13, Presdency.eth and pyrofirezerox. Only dee-13 is named
   in the copy, because artist is the track their submission would actually
   change. Name all three if you would rather.

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

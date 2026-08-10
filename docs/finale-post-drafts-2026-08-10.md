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

Brand rules applied: no emojis, no em dashes, "100+" for the member count. The
no-crypto-jargon rule is relaxed for the challenge post only, per Zaal.

---

## What these drafts deliberately do NOT say

**No finalist list.** A moving leaderboard is not a finalist selection, so the
standings can drop before the projects-or-people rule is settled. Draft 1 says so
in as many words, which is what makes it safe to post today.

The open decision is still Zaal's: are the six finalists **projects or people**,
and may one person hold more than one slot? The vote currently answers this
inconsistently - its candidate slate mixes project rows with person rows
(`b:ghostmintops`, `b:branth`, `b:jdwalka`), which is a defect, not a policy.
See `docs/finale-standings-2026-08-10.md`.

**No claim that the standings cover the whole field.** They do not. 18 of the 30
real projects cannot be voted for at all, because the vote's candidate slate and
the project feed are built from the roster differently. The standings doc lays
this out and recommends what to do about it.

---

## DRAFT 1 - the announcement

```
zabal gamez season 1 - how it ends

30 projects across three tracks. two per track advance. three
finals, run in the last week of august.

the finalists pick their own dates inside that week. you are not
handed a slot, you agree one with the people you are finishing
alongside.

who advances is decided by you, not by us. the vote is open at
zabalgamez.com/vote. 100 credits per track, and the cost of
backing one project goes up with the square of how hard you back
it, so ten votes on one project spends your whole budget. nobody
buys a track.

standings go up today and move every day until the vote closes. a
leaderboard is not a finalist list. do not read a monday number as
a result.

every finalist takes the full prize tier promised in june: a share
of the 500 usdc pool, $zabal rewards, and both the finisher and
champion collectibles. that has not changed and will not.

---
the season itself, for anyone who missed it: 32 sessions in june,
31 different people teaching, 25 organisations. july was quiet. we
are not going to pretend otherwise, and the june record stands on
its own.
```

**Why it is shaped this way.** The field is 30 projects from 16 submitters, which
is a real number and can lead. The vote paragraph explains quadratic voting in one
sentence without the term, because the mechanism is the answer to "why should I
trust this" and burying it invites the accusation it prevents. The "a leaderboard
is not a finalist list" line is what lets the standings drop today while the
projects-or-people rule is still open.

**Two things to check before posting.**

1. The standings themselves are not in this post, deliberately. Post the copy
   first, put the numbers in a reply or a follow-up, so a correction to one does
   not force a correction to the other.
2. The collectible line does not name the rail. The rail is unchanged, but the
   partnership retirement means the public copy should describe the collectibles
   and not the vendor.

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
- SUPERSEDED: `?feed=builders` - 15 submissions from 3 submitters. This is the
  audited roster file only and is a partial view of the field. It is what produced
  the wrong first draft. Do not rank off it.
- Doc 2257 - 32 sessions, 31 distinct presenters, 25 organisations, the July stall.
- Doc 1372 - ZAOstock economics: 5-7k expenses, 8.7-10.2k projected revenue,
  4.7k ticket line.
- June 8 2026 newsletter - the prize tier, quoted rather than paraphrased.

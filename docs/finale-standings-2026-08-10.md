# Season 1 standings - 2026-08-10

Nothing here has been posted. This is the standings snapshot plus the exact
criterion behind it, for Zaal to approve before anything goes out.

**Finalists are PEOPLE, not projects** (Zaal, 2026-08-10). Two people per track,
six people total, all six present at the end of the month. The tables below rank
people. An earlier version of this doc ranked projects and is superseded.

**Submissions stay open this week.** Today's standings are a moving snapshot and
this week is the last chance to climb, not a cut. That is stated in the post copy.

## The criterion, stated once

**A person's score in a track = the sum of quadratic votes across everything of
theirs on that track's ballot.** Ranked highest first. No other input. No
editorial judgement, no shipped-vs-planned ladder, no organiser tiebreak.

Read from `GET /api/qv-vote?results&track=<track>` on 2026-08-10, status `open`.

How the underlying number is produced, from `api/qv-vote.mjs`:

- Each voter gets 100 voice credits per track.
- Giving one candidate N votes costs N squared credits, so the most any single
  account can put into one candidate is 10 votes (10 squared = 100, the whole
  budget). A whale cannot buy a win.
- A candidate's score is the SUM of votes across all ballots.
- One ballot per Farcaster FID via Quick Auth. Re-voting overwrites, it does not add.
- Ballots are private; only the per-candidate totals are public.

Two adjustments, both stated rather than silent:

1. **The four rows being removed are excluded** - the two QA tests (ids 5, 6) and
   the two rows absent from the canonical feed (ids 2, 4). See the runbook below.
2. **Summing is the only aggregation.** Where a person has more than one entry on
   a track's ballot their votes are added, and the components are shown. Nothing
   else is merged, transferred, or reweighted.

As it happens, no person currently holds more than one row on any single track, so
the sum changes no position. The rule is stated because it will matter as more
submissions land this week.

## The standings - people

### Artist - 10 ballots, 2 people on the ballot

| # | Votes | Person | From |
|---|---|---|---|
| 1 | 41 | LadyrynNemesis | N3M3SIS - THE CALL OUT |
| 2 | 5 | Gesd01 | How Artists can Blend Different Music Genres |

Only two people are on the artist ballot, so as of today both advance unopposed.
dee-13 is the third artist in the field and is one publish away from contesting
it. This is the weakest track in the standings and the most likely to move.

### Builder - 9 ballots, 10 people on the ballot

| # | Votes | Person | From |
|---|---|---|---|
| 1 | 37 | kayonfire | NeonTetris |
| 2 | 10 | uniquebeing404 | ColorZAO |
| 3 | 5 | ghostmintops | roster entry |
| 4 | 4 | jdwalka | roster entry |
| 4 | 4 | branth | roster entry |
| 6 | 3 | Pascaline | ZAO Artist Value Ledger |
| 6 | 3 | LadyrynNemesis | SURFBOARD |
| 6 | 3 | breadcoop | Stacks |
| 6 | 3 | mettodo | El Charro |
| 10 | 0 | anonymous | sentra |

The four-way tie at 3 is real and sits at position 6, well outside the two slots,
so nothing needs to break it today.

### Creator - 6 ballots, 3 people on the ballot

| # | Votes | Person | From |
|---|---|---|---|
| 1 | 9 | LadyrynNemesis | ZABAL GAMEZ SONG & VIDEO |
| 2 | 8 | IMan Afrikah | ZABAL Artwork |
| 3 | 6 | Halit Tayyar / taydexfun | TayDex - Creator-Led Prediction Markets on Base |

Two votes separate first from third. This is the closest track.

## The one thing that needs Zaal's word: LadyrynNemesis holds two tracks

She is first in artist on 41 and first in creator on 9. Six slots, but if she
takes both there are only **five distinct people** at the end of the month, which
contradicts "six total, all six present".

**Read as one person, one slot** - she takes her strongest track, artist, and
creator shifts up:

| Track | Slot 1 | Slot 2 |
|---|---|---|
| Artist | LadyrynNemesis 41 | Gesd01 5 |
| Builder | kayonfire 37 | uniquebeing404 10 |
| Creator | IMan Afrikah 8 | Halit Tayyar 6 |

Six distinct people. This is the reading the post copy assumes, because "six
total, all six present" only works if the six are six humans.

**Read as multi-track allowed**, creator slot 1 stays LadyrynNemesis and Halit
Tayyar drops out, giving five people across six slots.

The difference decides whether Halit Tayyar is in or out, so the rule has to be
stated before the standings are read as a result, not after.

## Coverage: 13 of the 16 submitters are on the ballot

Ranking people rather than projects largely dissolves the coverage problem flagged
in the previous version of this doc, and it is worth being precise about why
rather than quietly dropping it.

That version said 18 of 30 projects were unvotable, and that the roster rows
(`b:ghostmintops`, `b:branth`, `b:jdwalka`) were a defect because the vote read
the roster as one entry per person instead of one per project. **At person
granularity those rows are the correct shape, not a bug.** ghostmintops, branth
and jdwalka each get exactly one row in the track they compete in, which is what
ranking people requires. The 15 projects behind those three rows are represented
by the person, not lost.

What remains is smaller and different in kind. Three of the 16 submitters have no
ballot presence at all:

| Person | Project | Track | Status |
|---|---|---|---|
| dee-13 | Ledger | artist | building |
| Presdency.eth | HOOD | builder | building |
| Joshua Grubbs / pyrofirezerox | GundariuM | builder | building |

**Why, on the evidence:** every numeric submission with `publicStatus: published`
is on the ballot (14 of 14) and every one with `publicStatus: building` is not
(3 of 3). `loadCandidates()` in `api/qv-vote.mjs` line 133 admits only `approved`
and `pending` records and explicitly skips drafts, while the projects feed also
reads `zabal:subs:drafts`. The consistent split says these three submissions are
still drafts rather than finished submissions. I could not read the KV store
directly to confirm the stored status field, so this is inference from a clean
14-of-14 / 3-of-3 correlation, not a direct read.

If that is right it is not a platform bug and needs no code change: **submissions
are open this week, so those three finish their submission and they are on the
ballot.** dee-13 in particular would turn the artist track from a walkover into a
contest. That is the single most useful thing the post can ask for.

**One presentation asymmetry worth knowing, not worth posting.** ghostmintops,
branth and jdwalka are voted for as a person, while everyone else is voted for
through a named project. Same granularity in the ranking, different experience on
the ballot page. Worth aligning when the slate is next touched; it changes no
number today.

## Decision taken 2026-08-10

Zaal chose: remove the QA tests and the two ghost rows first, then publish today's
standings. Finalists are people, two per track, six in total, all six present at
the end of the month. Submissions stay open this week, so the standings publish as
a moving snapshot rather than a cut. Draft 1 in `finale-post-drafts-2026-08-10.md`
is finalised on that basis.

## Removal runbook - Zaal runs this, not the loop

**These rows are not in the repo.** All four have numeric ids, which means they
live only in the live Upstash KV store (`zabal:sub:v1:<id>`), reached through
`api/submissions.mjs`. `data/builder-submissions.json` holds only the three-person
audited roster (ghostmintops, branth, jdwalka) and contains none of them, so there
is no data file to change and no deletion PR to open. Verified by searching that
file for "qa test", "iman", "surfboard by n3m3sis" and "project 2" - all absent.

Nothing below has been run.

### The four rows

| id | Track | Votes | What it is | Action |
|---|---|---|---|---|
| 5 | artist | 25 | QA Test Project - Artist Track | delete |
| 6 | creator | 6 | QA Test Project - Creator Track | delete |
| 2 | builder | 5 | "Project 2", handle bettercallzaal, absent from the canonical feed | delete |
| 4 | builder | 6 | "surfboard by n3m3sis", looks like an earlier version of id 14 SURFBOARD | **hide, not delete** |

Recommend **hide** for id 4 rather than delete. Delete is permanent and id 4
appears to be a real person's earlier submission with 6 real votes behind it.
Hide sets it to rejected, which removes it from the vote slate and the board while
keeping the record, and is reversible by re-approving. Hide and delete both remove
it from the ballot, so the standings outcome is identical either way.

### Step 1 - remove the rows (preferred: the admin UI, no tokens)

1. Open `https://zabalgamez.com/review`
2. Sign in with Farcaster on an admin FID
3. Delete on #5, #6, #2. Hide on #4.

The UI confirms each delete and posts a moderation notification. This is the
sanctioned path in `review.html` and needs no key handling.

### Step 1, alternative - the API with the admin key

```sh
# delete the three
for ID in 5 6 2; do
  curl -sS -X POST https://zabalgamez.com/api/submissions \
    -H "Authorization: Bearer $ADMIN_KEY" \
    -H 'Content-Type: application/json' \
    -d "{\"action\":\"delete\",\"id\":\"$ID\"}"
  echo
done

# hide (not delete) the probable duplicate
curl -sS -X POST https://zabalgamez.com/api/submissions \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"action":"reject","id":"4"}'
```

### Step 2 - the removal does NOT clear the votes, and this is the part that bites

`action:'delete'` in `api/submissions.mjs` lines 435-454 removes the record and
its index entries. It does **not** touch `qv:tally:<track>`. The `?results`
handler in `api/qv-vote.mjs` builds its rows from that tally and only looks up
the display name from the candidate list, so after the deletion the row does not
disappear - it comes back nameless as **"Project 5" with 25 votes**, still ranked
second in artist. Deleting alone makes the standings look worse, not better.

The tally has no API. Removing those rows means raw KV:

```sh
curl -sS -X POST "$KV_REST_API_URL/pipeline" \
  -H "Authorization: Bearer $KV_REST_API_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '[["ZREM","qv:tally:artist","5"],
       ["ZREM","qv:tally:creator","6"],
       ["ZREM","qv:tally:builder","2"],
       ["ZREM","qv:tally:builder","4"]]'
```

**Do not use the `reset` action on `/api/qv-vote`.** It runs `DEL` on
`qv:ballots:*` and `qv:tally:*` for all three tracks and would wipe every real
vote cast so far.

### Step 3 - verify, and know that step 2 is not stable on its own

```sh
for t in artist builder creator; do
  echo "== $t"; curl -s "https://zabalgamez.com/api/qv-vote?results&track=$t"; echo
done
```

Expected after a clean run: artist 2 rows, builder 9 rows, creator 3 rows, and no
row named "Project N".

The instability: the per-voter ballots in `qv:ballots:<track>` still contain
allocations pointing at the removed ids. If one of those voters re-votes, the POST
handler diffs their old ballot against the new one and issues
`ZINCRBY qv:tally:<track> -<old votes> <removed id>`, which **recreates the row at
a negative score**. So a ZREM today can be undone by a voter tomorrow.

### The durable fix, which is a PR and not a command

Filter the results to the current candidate slate - a tally row whose candidate no
longer exists should not be reported. In the `?results` branch of
`api/qv-vote.mjs`, skip any id not present in `byId`. That makes removal
self-healing, survives re-votes, and removes the need for step 2 entirely.

Not written. It changes a live route during an open vote, so it is Zaal's call
whether it goes in before or after the standings post.

## Effect of the removal on the published standings: none

Every removed row is already excluded from the tables above, so no position moves.

Person-ranking makes one of the four worth checking rather than assuming. Row id 4
("surfboard by n3m3sis", 6 votes) belongs to LadyrynNemesis, who also holds id 14
SURFBOARD on 3 votes in the same track. If those 6 votes counted toward her she
would sit on 9 in builder, which is still position 3, still behind
uniquebeing404 on 10 and outside the two slots. So hiding id 4 costs her nothing
that changes an outcome, and counting it would not have changed one either.

What the removal actually buys is that `?results` becomes self-evidently correct
instead of needing a footnote.

## Sources

Every figure above traces to one of these, fetched raw on 2026-08-10.

- `GET https://zabalgamez.com/api/submissions?feed=projects` - HTTP 200, 42380
  bytes. count 32; tracks builder 19 / creator 7 / artist 6; statuses published
  23 / building 7 / planned 2.
- `GET https://zabalgamez.com/api/qv-vote?results&track=artist|builder|creator` -
  HTTP 200. status open; ballots artist 10 / builder 9 / creator 6.
- `GET https://zabalgamez.com/api/qv-vote?candidates` - HTTP 200, 19 votable rows.
- `api/qv-vote.mjs` lines 33-146 - the credit budget, the squared cost, the
  sum-of-votes score, and the two-source candidate loader that causes the gap.
- `api/submissions.mjs` lines 300-320 - the canonical project feed merge.

Method: `curl` for raw JSON in every case, not WebFetch. The counts are read off
the response bodies, not off a summary of them.

# Season 1 standings - 2026-08-10

Nothing here has been posted. This is the standings snapshot plus the exact
criterion behind it, for Zaal to approve before anything goes out.

## The criterion, stated once

**Rank = total quadratic votes per candidate, per track, from the live vote at
zabalgamez.com/vote.** No other input. No editorial judgement, no shipped-vs-planned
ladder, no organiser tiebreak.

Read from `GET /api/qv-vote?results&track=<track>` on 2026-08-10. Status `open`.

How the number is produced, from `api/qv-vote.mjs`:

- Each voter gets 100 voice credits per track.
- Giving one candidate N votes costs N squared credits, so the most any single
  account can put into one candidate is 10 votes (10 squared = 100, the whole
  budget). A whale cannot buy a win.
- A candidate's score is the SUM of votes across all ballots.
- One ballot per Farcaster FID via Quick Auth. Re-voting overwrites, it does not add.
- Ballots are private; only the per-candidate totals are public.

Two adjustments, both stated rather than silent:

1. **The two "[QA TEST - please delete]" entries are excluded.** They are Iman's
   test rows, already queued for deletion (due Aug 11). They are not submissions.
   Their raw totals are shown below anyway so nothing is hidden.
2. **Nothing is merged.** Vote rows that are duplicates or person-level rather
   than project-level are listed and labelled, not folded together. Folding them
   would be inventing a criterion.

## The standings

### Artist - 10 ballots, slate of 3

| # | Votes | Project | Builder |
|---|---|---|---|
| 1 | 41 | N3M3SIS - THE CALL OUT | LadyrynNemesis |
| 2 | 5 | How Artists can Blend Different Music Genres | Gesd01 |
| - | 25 | QA Test Project - Artist Track | EXCLUDED, queued for deletion |

### Builder - 9 ballots, slate of 12

| # | Votes | Project | Builder |
|---|---|---|---|
| 1 | 37 | NeonTetris | kayonfire |
| 2 | 10 | ColorZAO | uniquebeing404 |
| 3 | 3 | ZAO Artist Value Ledger | Pascaline |
| 3 | 3 | SURFBOARD | LadyrynNemesis |
| 3 | 3 | Stacks | breadcoop |
| 3 | 3 | El Charro | mettodo |
| 7 | 0 | sentra | anonymous |
| - | 6 | surfboard by n3m3sis | NOT in the canonical project feed |
| - | 5 | Brandon (ghostmintops) | PERSON row, not a project |
| - | 5 | Project 2 | NOT in the canonical project feed |
| - | 4 | jdwalka (JohnDaWalka) | PERSON row, not a project |
| - | 4 | Branth (KORRO / Korrocorp) | PERSON row, not a project |

Positions 3 through 6 are a genuine four-way tie at 3 votes. The vote does not
break it and neither should anyone else.

### Creator - 6 ballots, slate of 4

| # | Votes | Project | Builder |
|---|---|---|---|
| 1 | 9 | ZABAL GAMEZ SONG & VIDEO | LadyrynNemesis |
| 2 | 8 | ZABAL Artwork | IMan Afrikah |
| 3 | 6 | TayDex - Creator-Led Prediction Markets on Base | Halit Tayyar / taydexfun |
| - | 6 | QA Test Project - Creator Track | EXCLUDED, queued for deletion |

## The blocker: the vote covers 12 of the 30 real projects

This is the same partial-view failure that produced the wrong ranking yesterday,
one layer further down. Yesterday the bad input was `?feed=builders`. Today the
input is the vote itself, and the vote's candidate slate does not match the field.

`GET /api/submissions?feed=projects` returns 32 rows: 30 real projects plus the 2
QA tests, from 15 named builders and 1 anonymous submitter.

`GET /api/qv-vote?candidates` offers 19 votable rows. Only 12 of those map to a
real project in the field. **18 of the 30 real projects cannot be voted for at
all:**

| Track | Votable | Real | Cannot be voted for |
|---|---|---|---|
| Artist | 2 | 5 | Ledger (dee-13), AI music generator (branth), ZAO music (ghostmintops) |
| Builder | 7 | 19 | GundariuM, HOOD, and all 4 remaining branth + 4 remaining ghostmintops + 2 jdwalka projects |
| Creator | 3 | 6 | DreamNet Publishing, IDE tutorial video series, Predictive apps Space |

### Why

`api/submissions.mjs` builds the projects feed by merging the live KV store with
the audited roster in `data/builder-submissions.json`. `api/qv-vote.mjs` builds
the vote slate differently: it takes the live KV store per project, but it takes
the roster as **one person-level candidate per builder** (`b:<handle>`), not as
their individual projects.

The result is that the three most prolific builders - ghostmintops with 7
projects, branth with 5, jdwalka with 3 - have 15 projects between them and not
one of them is individually votable. Each of the three is instead a single row
voting for the person.

This is the duplicate submissions store already on the queue for removal (due
Aug 17), showing up as a live correctness problem rather than a tidiness one.

### Two other slate defects

- `id=4 "surfboard by n3m3sis"` (6 votes) and `id=14 "SURFBOARD"` (3 votes) look
  like the same work by the same person with the vote split across two rows.
  id=4 is votable but absent from the canonical feed.
- `id=2 "Project 2"` by bettercallzaal (5 votes) is votable and absent from the
  canonical feed.

## Decision taken 2026-08-10

Zaal chose: remove the QA tests and the two ghost rows first, then publish today's
standings, then fix the slate. Draft 1 in `finale-post-drafts-2026-08-10.md` is
finalised on that basis and states the coverage gap in the post itself.

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

Every removed row was already excluded or labelled in the tables above, so the
ranking of real projects is unchanged. What changes is that `?results` becomes
self-evidently correct instead of needing a footnote.

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

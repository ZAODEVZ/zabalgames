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

## What this means for publishing

The standings above are accurate as a report of the vote. They are not a
representative ranking of the field, and publishing them without saying so would
repeat yesterday's mistake in a form that is harder to spot.

Three ways forward. This is Zaal's call, not the loop's:

1. **Publish as-is, scoped honestly.** Post the standings labelled as the vote's
   current state, and say plainly that the slate is incomplete and being fixed.
   Cheapest, and consistent with "standings change daily".
2. **Fix the slate first, then publish.** Change `loadCandidates()` in
   `api/qv-vote.mjs` to expand each roster builder into their individual
   projects, retiring the `b:<handle>` rows. This changes an open vote mid-flight
   and orphans the 13 person-level votes already cast, so it needs a decision
   about whether to reset the tally.
3. **Delete the QA tests and the two ghost rows first, publish, fix the slate
   after.** Smallest correct step available today.

Recommended: 3, then 2. It gets a clean number out today without pretending the
coverage problem does not exist.

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

# Season 1 standings - 2026-08-10

Nothing here has been posted. This is the support leaderboard, the selection rule,
and the prize split, for Zaal to approve before anything goes out.

## Selection: Zaal curates the six. The vote is a signal, not the selector.

Zaal, 2026-08-10: "We aren't doing it based on their votes, it's gonna be all
decided by Zaal." Finalists are **people**: two per track, six in total, all six
present at the end of the month. LadyrynNemesis, who leads two tracks, **picks
which track she competes in** rather than being assigned one. dee-13 is in on
Zaal's call - she submitted an artist project and it never reached the ballot.

**This breaks no public promise, which is worth stating because it easily could
have.** The vote page is headed "Vote for who is best." and `api/qv-vote.mjs`
describes itself as a quadratic vote for "who is best". Neither has ever told
anyone the vote selects finalists. The one sentence that would have been false was
"who goes through is decided by you" - that was a line in an earlier draft of the
post here, never published, now removed.

What the vote is, then: a public support signal that Zaal weighs alongside
everything he has seen this season. That is a legitimate and common way to run a
curated final. It just has to be described as what it is.

**Do not let the post imply the leaderboard selects.** Anyone who cast a ballot
believing it decided advancement, then saw a curated six that did not match it,
would be right to feel misled. The post copy handles this in one line.

## The support leaderboard - people

Sum of each person's quadratic votes on that track's ballot, with the four removed
rows excluded (ids 5, 6, 2, 4 - see the runbook). Read from
`GET /api/qv-vote?results&track=<track>` on 2026-08-10, status `open`.

How the underlying number works, from `api/qv-vote.mjs`: 100 voice credits per
voter per track; N votes on one candidate costs N squared credits, so 10 votes is
the whole budget and the hard cap; score is the sum of votes; one ballot per
Farcaster FID; re-voting overwrites.

### Artist - 10 ballots

| # | Votes | Person |
|---|---|---|
| 1 | 41 | LadyrynNemesis |
| 2 | 5 | Gesd01 |

### Builder - 9 ballots

| # | Votes | Person |
|---|---|---|
| 1 | 37 | kayonfire |
| 2 | 10 | uniquebeing404 |
| 3 | 5 | ghostmintops |
| 4 | 4 | jdwalka |
| 4 | 4 | branth |
| 6 | 3 | Pascaline |
| 6 | 3 | LadyrynNemesis |
| 6 | 3 | breadcoop |
| 6 | 3 | mettodo |
| 10 | 0 | anonymous (sentra) |

### Creator - 6 ballots

| # | Votes | Person |
|---|---|---|
| 1 | 9 | LadyrynNemesis |
| 2 | 8 | IMan Afrikah |
| 3 | 6 | Halit Tayyar / taydexfun |

All 14 numbers were re-derived from the fetched JSON and diffed against the post
copy before commit.

## Still open, and they are Zaal's

1. **The six names.** Curation means the list is Zaal's to write. Today's post
   publishes the leaderboard and says the six are announced at the end of the week,
   so no name has to be committed today.
2. **Gesd01.** Currently second in artist on 5 votes. With dee-13 seated and two
   slots per track, either Gesd01 or dee-13 is the artist runner-up, or artist runs
   three. Unresolved - and it does not need resolving to post today.
3. **LadyrynNemesis's track.** She picks. Someone has to actually ask her this
   week. This is a real conversation, not a data lookup.
4. **Three submissions are still drafts** - dee-13's Ledger, Presdency.eth's HOOD,
   pyrofirezerox's GundariuM. Confirmed by a direct read: each carries
   `status: "draft"` in the feed, and `loadCandidates()` (`api/qv-vote.mjs:133`)
   admits only approved and pending. Under curation this matters less for
   selection, but a draft is invisible on the public board, so they should still
   finish this week.

## The prize: $500 USDC across the six

Confirmed by Zaal 2026-08-10. Replaces the internal 8-way tier
(`1st $150 / 2nd $100 / 3rd $75 / 4th-8th $35`) which came from a 2026-05-23
dispatch and was never published - the 2026-05-26 changelog decision says
explicitly "no specific per-finalist amounts published". Public pages commit only
to a "$500 USDC pool, tiered so every finalist who ships gets paid, plus a
commemorative collectible for every finisher" (`content.html:128`). All three
commitments are honored below.

### Head-to-head - $300

Three battles, one per track, top two in a track facing each other. This is the
format already documented in `AUGUST-LANE-BRIEF.md:33`: "top 2 per track go into
3-5 WaveWarZ battles, one winner per track. Decided by the market, not a panel."

| Result | Per person | Count | Total |
|---|---|---|---|
| Wins their battle | $70 | 3 | $210 |
| Loses their battle | $30 | 3 | $90 |

Everyone is paid, and winning your track pays more than double losing it.

### Volume - $200

Split pro-rata across all six by the trade volume their battle entry attracts.
`finals/live.html:127` already commits to "volume + win rate at T+72h decides
placement", so volume is not a new criterion, it is the published one.

**Capped at $80 per person** so a single whale trade cannot take the pool; any
excess above the cap redistributes pro-rata among the rest.

Ceiling is $70 + $80 = **$150**, which lands exactly on the original first-place
figure from the May dispatch. Floor is $30 plus a volume share.

### The instrument: live WaveWarZ community battles. No fallback needed.

Zaal, 2026-08-10: "it's not wavewarz base... it's just wavewarz, which is live and
ready under community battles."

**An earlier version of this doc built a fallback around WaveWarZ-Base not being
mainnet-ready. That was wrong, and the source of the error is worth recording so
nobody repeats it from the same files.** `finals/live.html:187` carries
`0xTODO_WAVEWARZ_BASE` and `finals.html` describes the finals settling on a
WaveWarZ-Base contract. That copy is stale. The finals run on WaveWarZ proper -
the live Solana product - using its community battles feature.

What community battles actually are, from Hurricane Ike's own session
(`recordings/8.html`, indexed in `recaps.json`): head-to-head battles in any format
with automated split payouts straight to artist wallets, live chart scoring, and
the artist earning 1% of every trade on their side. 500+ SOL in volume, 40+
artists, built on Solana. Built by Ikechi Nwachukwu (Hurric4n3Ike) - WaveWarZ is a
partner product, not ZAO-built, and the credit belongs to them.

So the volume metric has a live source, the $200 half needs no condition, and the
post states it flat. **There is no fallback clause and the post should not carry
one.**

### Follow-on: the site contradicts this

`finals.html` and `finals/live.html` still describe WaveWarZ-Base settlement and
an undeployed contract address. That copy should be corrected to live WaveWarZ
community battles, or the site argues with the post. Not written - flagged.

### One thing to choose knowingly: volume pays twice

`finals.html:147` already promises every finalist "1% of all trade volume on your
battle entry, forever". Making 40% of the $500 also volume-weighted means volume
is rewarded through two rails at once. That is a reasonable choice if the goal is
to push finalists hard on promotion - but it is a choice, not an accident, and
whoever promotes hardest gains twice from it.

### Open format question

`AUGUST-LANE-BRIEF.md` says "3-5 battles" while two-per-track across three tracks
is exactly 3. If there are more than 3 - cross-track exhibition battles, or a
second round - the $300 head-to-head half needs a rule for them. Worth settling
before the finals week.

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

## Sources

Every figure above traces to one of these, fetched raw on 2026-08-10.

- `GET https://zabalgamez.com/api/submissions?feed=projects` - HTTP 200, 42380
  bytes. count 32; tracks builder 19 / creator 7 / artist 6; statuses published
  23 / building 7 / planned 2.
- `GET https://zabalgamez.com/api/qv-vote?results&track=artist|builder|creator` -
  HTTP 200. status open; ballots artist 10 / builder 9 / creator 6.
- `GET https://zabalgamez.com/api/qv-vote?candidates` - HTTP 200, 19 votable rows.
- `api/qv-vote.mjs` lines 33-146 - the credit budget, the squared cost, the
  sum-of-votes score, and the two-source candidate loader.
- `api/submissions.mjs` lines 300-320 - the canonical project feed merge; line 435
  onward - the delete handler that does not touch the tally.
- `vote.html` - headline "Vote for who is best.", and `api/qv-vote.mjs` line 1,
  a quadratic vote for "who is best". Neither claims the vote selects finalists,
  which is why curation breaks no public promise.
- `content.html:128` - the only public statement of the prize: "$500 USDC pool,
  tiered so every finalist who ships gets paid, plus a commemorative collectible
  for every finisher".
- `data/changelog.json` 2026-05-26 - "no specific per-finalist amounts published",
  which is what leaves the six-way split free to design.
- `data/bonfire-graph.json:1736` - the internal 8-way tier, `_source`
  `zabal-dispatch-zabal-empire-20260523`. Never published. Superseded.
- `AUGUST-LANE-BRIEF.md:33` - top 2 per track into 3-5 WaveWarZ battles, one
  winner per track. `finals/live.html:127` - "volume + win rate at T+72h decides
  placement". `finals.html:147` - the 1% of trade volume, forever.
- `finals/live.html:187` (`0xTODO_WAVEWARZ_BASE`) and `finals.html:59` - STALE
  copy describing a WaveWarZ-Base settlement that is not the plan. Reading these
  as current is what produced the wrong fallback in an earlier version of this
  doc. Corrected per Zaal: the finals run on live WaveWarZ community battles.
- `recordings/8.html` - Hurricane Ike's session on WaveWarZ: community battles in
  any format, automated split payouts to artist wallets, 1% of every trade on your
  side, live chart scoring, 500+ SOL volume, 40+ artists, Solana. WaveWarZ is
  built by Ikechi Nwachukwu (Hurric4n3Ike) and is a partner product, not ZAO-built.
- Direct read, not inference: ids 3, 16 and 18 each carry `status: "draft"` in the
  projects feed. An earlier version of this doc inferred that from a 14-of-14 /
  3-of-3 correlation; the field is in the response, so it is now confirmed.

Method: `curl` for raw JSON in every case, not WebFetch. The counts are read off
the response bodies, not off a summary of them.

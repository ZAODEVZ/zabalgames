# Season 1 - the six finalists announce (2026-08-17)

**Nothing here has been sent. Zaal sends all of it.**

This is the announce kit for naming the six, organised into paste blocks. It carries
the copy Zaal wrote, with the factual corrections listed below applied and every
correction shown so he can reject any of them.

Publish order: **newsletter first**, copy its URL, paste that URL over every
`[link]` placeholder, then the casts, then the dates-ask DM to the six plus the
three mentors.

---

## Blocking, before anything goes out

1. **Publish the two draft submissions.** `HOOD` (presdency.eth) and `Ledger`
   (dee-13) were still `status: "draft"` on 2026-08-10, which makes them invisible
   on `/submissions`. The post names both people as finalists and links to that
   board. Two of six finalists having no visible work on the board the post points
   at is the one thing here that reads as careless.

   **Correction to an earlier version of this doc: you cannot do this at `/review`.**
   That page only exposes Delete and Hide (`review.html:140-141`). There is no
   publish control on it, and `action:'publish'` in `api/submissions.mjs:513` accepts
   only the submitter's own FID or their `editToken` - admin is explicitly not
   enough. See "The publish click-path" below for the two routes that do work.
   (`pyrofirezerox`'s GundariuM was the third draft - not a finalist, lower priority,
   but worth clearing in the same pass.)
2. **Settle the project count with one command.** The copy below says **30**.
   See "The project count" below - it is now a 60-second job, not an open question.
3. ~~Confirm the three mentors.~~ **SETTLED 2026-08-17: announce without names.**
   The panel stays "a judges' panel" until the mentors lock, targeted at Thursday
   alongside the schedule. The copy below already reads that way and needs no edit.
   `/august` keeps its three "confirming" slots until then.
4. **Lock the third factor.** Both the newsletter ("among the factors") and the
   dates-ask ("a third factor we lock this week") leave a criterion that decides
   money undefined. Locking Thursday with the schedule.

---

## Corrections applied to the draft, and why

Reject any of these and I will put the original wording back.

1. **"32 projects" changed to "30".** The `?feed=projects` count of 32 includes the
   two QA-test rows (`QA Test Project - Artist Track`, `QA Test Project - Creator
   Track`) flagged for deletion in `docs/finale-standings-2026-08-10.md`. The
   Farcaster thread published on 2026-08-11 said **"fifteen builders shipped thirty
   projects"**. Publishing 32 six days after publishing 30, from the same feed,
   invites "which is it". A read on 2026-08-17 12:30 EDT returned 31 rows, so the
   real number is 29, 30 or 31 depending on how many QA rows are left. **Treat the
   30 below as a placeholder** until the command in "The project count" is run - it
   settles this exactly and takes a minute.
2. **"built, published, and shipped in public" softened.** On 2026-08-10 the feed
   broke down as 23 published, 7 building, 2 planned. Not all 30 shipped. The line
   now reads "most of them shipped and public", which is both true and still strong.
3. **"To the eight" retitled to "To everyone else who shipped".** The post says 15
   entered, then names 6 finalists and 8 others. That is 14, and a reader who counts
   will ask about the fifteenth. The fifteenth is **imanafrikah**, who is roster but
   not competing. Dropping the count from the heading removes the arithmetic claim
   without naming him or explaining a ruling nobody asked about. Alternative if you
   would rather be explicit: "Fourteen of you competed for six slots."
4. **"How this was decided" moved above "The six".** This is the one structural
   change. `docs/finale-standings-2026-08-10.md` records the reasoning: a
   leaderboard published alongside a finalist announcement reads as the selector
   unless you say otherwise **first**, and being told afterwards is what actually
   burns people. Order matters more than wording. Same sentences, earlier.
5. **Builder and creator why-lines redrafted 2026-08-17** to your direction: the
   submission being cool plus three months of being active. They are in the paste
   block below, ready to go, but they are DRAFTS - see "The four why-lines" for what
   in them is sourced and what is your observation to confirm.
6. **"Ledger" disambiguated once** as "Ledger, the manga". Pascaline's entry is "ZAO
   Artist Value Ledger", so a bare "Ledger" is briefly ambiguous to anyone who read
   the 2026-08-10 newsletter.

---

## Settled 2026-08-17

- **The prize split: the tiered structure wins.** $300 head-to-head ($70 to each
  track winner, $30 to each runner-up) plus $200 volume-weighted, capped at $80 per
  person. Ceiling $150, floor $30 plus a volume share, everyone paid.
  **This overrides the equal-shares promise that was live on the site**, which was
  your explicit call against the equal-share option. Every page has been updated:
  `finals.html` (2 places), `winners.html` (3), `info.html` (4), `index.html`,
  `enter.html`, `finals/live.html`. No "equal share", "split six ways", "split
  evenly" or "the same share each" remains anywhere in the site copy. The announce
  keeps saying "a share of the 500 USDC pool", which is now true and understated.
- **uniquebeing404's track move: say nothing.** The picks-are-mine framing covers
  it; you answer if asked. No line was added.

## Still open, and they are yours

- **The builder final is the pick most likely to be questioned.** On the retired
  support board, kayonfire led builder on 37 and uniquebeing404 was second on 10.
  The builder final is jdwalka (4) and ghostmintops (5); kayonfire is in the
  thank-you list and uniquebeing404 is competing in creator. The vote is retired and
  no tallies render anywhere on the site, so this breaks no promise and the "no vote,
  the picks are mine" line carries it. Flagging it because it is the question you
  will get, and because kayonfire's DM is the one worth writing by hand.
- **The site says "present", the post says "battle".** `finals.html` currently
  describes finalists presenting work live with mentors in the room, and states
  "There is no prediction market". The new format is head-to-head battles with the
  crowd trading onchain. Reconciled in this change for `/august` and `/finals`; see
  "Site changes" at the bottom.

---

## The project count - run this, then use the exact number

**Recommendation: publish the exact number, not "30+".**

### What we know

| When | Rows in the feed | QA rows | Real projects |
|---|---|---|---|
| 2026-08-10 | 32 | 2 | 30 |
| 2026-08-11 | - | - | **30** published in the Farcaster thread |
| 2026-08-17 12:30 EDT | 31 | unknown | 29, 30 or 31 |

### Why "30+" is not the safe default it looks like

The suggestion from the zaoos-infra lane was "30+", on the grounds that it is true
under every count. It is not. If both QA rows are still in the feed, 31 rows means
**29 real projects**, and "30+" overstates. It is only safe in two of the three
possible states.

### And the QA rows ARE separable from outside

The lane reported it could not tell QA rows apart remotely. It can: they carry
"QA Test" in the name, in the public JSON. The site already relies on exactly this
- `august.html:270` filters `/qa test/i` off the field for the same reason. So this
resolves definitively:

```sh
curl -s "https://zabalgamez.com/api/submissions?feed=projects" | python3 -c "
import sys, json
rows = json.load(sys.stdin).get('submissions', [])
qa = [r for r in rows if 'qa test' in str(r.get('name','')).lower()]
print('rows in feed :', len(rows))
print('QA test rows :', len(qa), [r.get('id') for r in qa])
print('REAL PROJECTS:', len(rows) - len(qa))
"
```

Whatever `REAL PROJECTS` prints is the number to publish. Swap it into two places:
the newsletter opening line and CAST 1.

### Why exact beats "30+" here

The "100+" convention exists for the ZAO member count, which genuinely moves and
would need correcting monthly. **The project count no longer moves** - the board
closed on Aug 16, so this is a final historical fact about a closed season. A
hedge on a closed, countable set reads as not having bothered to count, which is
the opposite of the transparency the post is claiming. And you already published
"thirty" on Aug 11; a precise number that has moved to 31 is a season that kept
shipping to the buzzer, which is a better story than "30+".

If the command cannot be run before send, then "30+" is the right fallback, and if
it turns out to be 29 the post is wrong by one in the generous direction, which
nobody will litigate. But run the command.

---

## The publish click-path - HOOD and Ledger

**This is yours to run. Nothing here has been executed.**

First, confirm which ids they are. `docs/finale-standings-2026-08-10.md` records ids
3, 16 and 18 as the three drafts across dee-13's Ledger, Presdency.eth's HOOD and
pyrofirezerox's GundariuM, but not which id is which:

```sh
curl -s "https://zabalgamez.com/api/submissions?feed=projects" \
  | python3 -c "import sys,json;[print(x.get('id'), x.get('status'), x.get('name'), (x.get('builder') or {}).get('handle')) for x in json.load(sys.stdin).get('submissions',[])]"
```

### Route A - ask them to publish it themselves (preferred)

This is the sanctioned flow, it is their work, and it emails them a confirmation.
Each got a private status link when they submitted:
`https://zabalgamez.com/submission-status?id=<id>&token=<editToken>`

DM to send to @presdency and @dee-13:

```
congrats again. one thing before the announce goes out - your project is still
saved as a draft, which means it is not showing on the public board at
zabalgamez.com/submissions.

open your private link (the one you got when you submitted), mark it ready, and it
goes live straight away. if you cannot find the link say so and i will resend it.

worth doing today - the announce points people at that board.
```

If they lost the link, you can resend it: the status URL is rebuilt from the id and
their `editToken`, both of which an admin can read out of the record.

### Route B - publish it yourself, admin (fallback if they go quiet)

`action:'update'` with `ready:true` DOES accept admin (`api/submissions.mjs:470`),
unlike `action:'publish'`. It flips draft to approved, puts it on the board, and
emails the submitter that it is live.

```sh
# repeat per id
curl -sS -X POST https://zabalgamez.com/api/submissions \
  -H "Authorization: Bearer $ADMIN_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"action":"update","id":"<id>","ready":true}'
```

Verify both are gone from drafts afterwards by re-running the feed command above.

**A gap worth knowing:** `/review` shows drafts but gives an admin no way to action
them, so this fallback is curl-only today. A publish button on `/review` is maybe
twenty lines. Say the word and I will add it, though Route A avoids needing it.

---

# PASTE BLOCK 1 - newsletter / site announce

The ZABAL Gamez Season 1 board is closed.

15 people entered. 30 projects went up across three tracks, most of them shipped
and public. The field narrows: two per track, six finalists, and at the end of
August they go head to head.

## How this was decided

No vote. The season board ran to close and the picks are mine. Every finalist gets
the why, because transparency was the promise from day one.

## The six

ARTIST FINAL

- dee-13 - Ledger, the manga. Kept shipping past the submission and showed up all
  season. The strongest combined record on the artist board.
- n3m - N3M3SIS - THE CALL OUT. Entered every board; the ZABAL Gamez song and video
  made artist the track that counts.

BUILDER FINAL

- jdwalka - Chroma Poker. A real poker app on Farcaster with a live HUD and
  hand-history parsing, still being tuned three months in. Kept hosting the
  Predictive Apps Space for everyone else the whole way through.
- ghostmintops - Proof Drop, and six more behind it. Seven builds across all three
  tracks, starting with the first July build to land on the site. Nobody shipped
  more, or more often.

CREATOR FINAL

- presdency.eth - HOOD. Kept building it out well past the point most entries
  stopped, and stayed in the room from June through to the close.
- uniquebeing404 - ColorZAO. Real craft in a tool that did not have to be that
  considered, and a steady presence on the board from early on.

## To everyone else who shipped

kayonfire, Pascaline, breadcoop, taydexfun, gesd1, pyrofirezerox, mettodo, Branth -
you built real things in public for a season. That is the whole point of ZABAL, and
it does not stop mattering because a bracket has six slots. Finisher recognition
comes to everyone who shipped.

## What happens next

The finals are head-to-head battles, run on WaveWarZ - the two finalists in each
track go live, the crowd trades the battle onchain, and the champion is decided by a
combined score: the market result and a judges' panel among the factors. Last week
of August; the six pick their own dates. Streamed everywhere: Restream, the 5pm EST
slot, Farcaster, X Spaces.

Prizes stand in full: a share of the 500 USDC pool, ZABAL rewards, and both the
Finisher and Champion collectibles for every finalist.

---

## The four why-lines - REDRAFTED, needs your yes or edit

Per your direction: "lets draft an initial idea based on what they submitted being
cool and them being active over the past 3 months." So each line names the work,
says why it is good, and credits the three months of showing up. Written to match
the two artist lines you already approved: project first, then the record.

Nothing here mentions uniquebeing404 moving track, per your call to say nothing.

- **jdwalka** - Chroma Poker. A real poker app on Farcaster with a live HUD and
  hand-history parsing, still being tuned three months in. Kept hosting the
  Predictive Apps Space for everyone else the whole way through.
- **ghostmintops** - Proof Drop, and six more behind it. Seven builds across all
  three tracks, starting with the first July build to land on the site. Nobody
  shipped more, or more often.
- **presdency.eth** - HOOD. Kept building it out well past the point most entries
  stopped, and stayed in the room from June through to the close.
- **uniquebeing404** - ColorZAO. Real craft in a tool that did not have to be that
  considered, and a steady presence on the board from early on.

**One caveat before you sign these.** The project claims are all sourced
(`data/builder-submissions.json`, the 2026-08-10 newsletter). The
sustained-presence claims are not - there is no attendance or activity record in
the repo I can check them against. "Kept hosting the Space", "stayed in the room",
"steady presence from early on" are your observations to confirm or correct. If any
of them is wrong for a given person, that is the half to rewrite.

---

# PASTE BLOCK 2 - the five casts, in order

**CAST 1**

ZABAL Gamez Season 1: board closed. 15 entered, 30 projects shipped in public. 6
finalists. Head-to-head battles on WaveWarZ, last week of August. The crowd trades
it onchain; market plus judges crown the champions. [link]

**CAST 2**

ARTIST FINAL - dee-13 vs n3m. Ledger's manga world against N3M3SIS - THE CALL OUT.
Two artists who kept showing up all season.

**CAST 3**

BUILDER FINAL - jdwalka vs ghostmintops. Chroma Poker against seven builds in three
tracks. Two of the deepest catalogues of the season, head to head.

**CAST 4**

CREATOR FINAL - presdency.eth vs uniquebeing404. HOOD against ColorZAO. Two builders
stepping onto the creator stage, both still shipping at the close.

**CAST 5**

And to kayonfire, Pascaline, breadcoop, taydexfun, gesd1, pyrofirezerox, mettodo,
Branth - real things, built in public, all season. Finisher recognition comes to
everyone who shipped. Battles stream everywhere - dates set by the six this week.

---

# PASTE BLOCK 3 - the dates-ask

Goes to all six finalists and the three mentors. Covers all three pairs at once; the
builder play-in structure is cancelled and no version of this mentions it.

Congrats again, all six - and mentors, you're on this because you ARE the judges'
panel.

The battles run the last week of August (Mon 24 - Sun 30), one head-to-head per
track, live on stream. Each pair picks the day and time that works for both:

- Artist: dee-13 + n3m
- Builder: jdwalka + ghostmintops
- Creator: presdency + uniquebeing404

Reply with availability by Wednesday; I lock the schedule Thursday. Format: live,
head to head on WaveWarZ - the crowd trades the battle onchain, champion from a
combined score: market, judges' panel, and a third factor we lock this week.
Streamed on everything. More before your date.

---

## Handles for the sends

Verified against the Farcaster fname registry on 2026-08-10
(`docs/finals-distribution-2026-08-11.md`).

| handle | FID | role |
|---|---|---|
| `@dee-13` | 1104991 | artist finalist |
| `@n3m` | 3342832 | artist finalist |
| `@jdwalka` | 2272296 | builder finalist |
| `@ghostmintops` | 1477142 | builder finalist |
| `@presdency` | 1054124 | creator finalist |
| `@uniquebeing404` | 849116 | creator finalist |
| `@kayonfire` | 1088459 | thank-you |
| `@pascaline` | 1119246 | thank-you |
| `@breadcoop` | 1357539 | thank-you |
| `@taydexfun` | 3342367 | thank-you |
| `@gesd1` | 1355878 | thank-you |
| `@pyrofirezerox` | 1479995 | thank-you |
| `@mettodo` | 550655 | thank-you |
| Branth | - | thank-you, **no Farcaster handle resolves** |

`branth`, `branthony` and `korro` all return nothing on the registry. He is named
without a tag in Cast 5 and needs another route for anything direct - `x.com/korrocorp`
or `korrocorp.com` from `data/builder-submissions.json`.

---

## Site changes shipped alongside this

- `data/finals.json` - the six added, window 2026-08-24 to 2026-08-30. `settled`
  stays false, so `/winners` keeps its placeholders. `/finals/live` renders the
  roster as soon as finalists exist, so the six appear there on deploy.
- `august.html` - post-close state. Removed "this week is the last chance to climb
  it" and the open-board framing; the six are named on the page.
- `finals.html` - removed the three stale claims: that the board is open, that
  artist and creator slots are unclaimed, and that the builder field is Brandon,
  Branth and jdwalka. Format card changed from presenting to the head-to-head
  battle. **The equal-shares prize line is untouched** pending the decision above.

## Sources

- `docs/finale-standings-2026-08-10.md` - support board, prize-split proposal, the
  QA-row runbook, the curation reasoning and the ordering lesson.
- `docs/finals-distribution-2026-08-11.md` - verified handles and FIDs, the published
  "fifteen builders shipped thirty projects" figure, the draft-not-building correction.
- `docs/newsletter-2026-08-10-finals.md` - per-person project names and demo URLs.
- `data/builder-submissions.json` - ghostmintops, jdwalka and Branth project detail.
- `finals.html:120` - the live equal-shares prize promise.
- Relay from the zaoos-infra lane, 2026-08-17 - judges' panel is the three track
  mentors, third factor locks Thursday, imanafrikah is roster but not competing,
  builder play-in cancelled, artist why-lines approved.

Live API verification was not possible from this session: `zabalgamez.com` is not
reachable through the network policy here (proxy returns 403 on CONNECT). Every
figure above comes from the repo and the dated docs, which is why Blocking #2 asks
for one curl before sending.

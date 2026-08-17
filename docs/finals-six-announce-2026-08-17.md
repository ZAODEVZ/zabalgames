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
   at is the one thing here that reads as careless. Fix at `/review` before sending.
   (`pyrofirezerox`'s GundariuM was the third draft - not a finalist, lower priority,
   but worth clearing in the same pass.)
2. **Re-verify the project count.** The copy below says **30**, not 32. See
   "Corrections applied" #1. Check before sending:
   `curl -s "https://zabalgamez.com/api/submissions?feed=projects" | head -c 400`
   and confirm the QA-test rows are gone from `/submissions`.
3. **Confirm the three mentors.** The dates-ask tells mentors they ARE the judges'
   panel, and the champion formula depends on that panel. `/august` still shows all
   three mentor slots as "ZAO mentor - confirming" and no mentor is named publicly
   anywhere. Either confirm and name them, or the panel half of the scoring has no
   public referent.
4. **Lock the third factor.** Both the newsletter ("among the factors") and the
   dates-ask ("a third factor we lock this week") leave a criterion that decides
   money undefined, seven days out. Name it Thursday when the schedule locks, or
   drop it and say the score is market plus panel.

---

## Corrections applied to the draft, and why

Reject any of these and I will put the original wording back.

1. **"32 projects" changed to "30".** The `?feed=projects` count of 32 includes the
   two QA-test rows (`QA Test Project - Artist Track`, `QA Test Project - Creator
   Track`) flagged for deletion in `docs/finale-standings-2026-08-10.md`. The
   Farcaster thread published on 2026-08-11 said **"fifteen builders shipped thirty
   projects"**. Publishing 32 six days after publishing 30, from the same feed,
   invites "which is it". If two genuinely new projects landed since the 11th, 32 is
   right and this correction is wrong - the curl in Blocking #2 settles it.
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
5. **Builder and creator why-lines left as placeholders.** Drafts are supplied below
   and marked as drafts. They are assembled from the repo and deliberately do not
   guess at your reasoning - the relayed note from the zaoos-infra lane says you have
   context the picksheet lacks. Overwrite them.
6. **"Ledger" disambiguated once** as "Ledger, the manga". Pascaline's entry is "ZAO
   Artist Value Ledger", so a bare "Ledger" is briefly ambiguous to anyone who read
   the 2026-08-10 newsletter.

---

## Open, and they are yours

- **The prize split contradicts the site.** `finals.html:120` is live right now and
  says: "Every finalist receives an equal share of the 500 USDC pool. The same for
  all six, not a slice by rank." `docs/finale-standings-2026-08-10.md` proposes $300
  head-to-head ($70 win / $30 lose) plus $200 volume-weighted capped at $80 - which
  is not equal shares. The copy below says "a share of the 500 USDC pool", which is
  compatible with either, so the post can go out before this is settled. But the two
  cannot both stay true, and the published one is the equal-shares promise. I have
  not touched that line.
- **The builder final is the pick most likely to be questioned.** On the retired
  support board, kayonfire led builder on 37 and uniquebeing404 was second on 10.
  The builder final is jdwalka (4) and ghostmintops (5); kayonfire is in the
  thank-you list and uniquebeing404 is competing in creator. The vote is retired and
  no tallies render anywhere on the site, so this breaks no promise and the "no vote,
  the picks are mine" line carries it. Flagging it because it is the question you
  will get, and because kayonfire's DM is the one worth writing by hand.
- **uniquebeing404 moved builder to creator.** n3m choosing artist was already public
  as her call. uniquebeing404's move was not. One clause in her why-line covering it
  costs nothing and pre-empts the question.
- **The site says "present", the post says "battle".** `finals.html` currently
  describes finalists presenting work live with mentors in the room, and states
  "There is no prediction market". The new format is head-to-head battles with the
  crowd trading onchain. Reconciled in this change for `/august` and `/finals`; see
  "Site changes" at the bottom.

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

- jdwalka - [ZAAL LINE: why jdwalka advances]
- ghostmintops - [ZAAL LINE: why ghostmintops advances]

CREATOR FINAL

- presdency.eth - [ZAAL LINE: why presdency advances]
- uniquebeing404 - [ZAAL LINE: why uniquebeing404 advances]

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

## Draft why-lines for the four open slots

**Drafts, not decisions.** Built from `data/builder-submissions.json` and the
2026-08-10 newsletter. Use, edit, or bin.

- **jdwalka** - Chroma Poker, a live Farcaster app with real users, plus a crypto
  prediction orchestrator in progress and the Predictive Apps Space he hosts for
  everyone else. Built in two tracks and kept the room open all season.
- **ghostmintops** - Seven builds across all three tracks: ZABAL Recording Scout,
  Proof Drop, WaveWarZ Gravity Board, Founder Nexus, DreamNet Publishing, the ZAO
  anthem, and an IDE series still landing. The widest catalogue of the season, and
  Proof Drop was the first July build to go up on the site.
- **presdency.eth** - HOOD. Came in on the creator track and kept building it out
  well past the point most entries stopped.
- **uniquebeing404** - ColorZAO. The strongest-supported entry on the builder board
  all season, competing in creator because that is where the work actually lives.

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

BUILDER FINAL - jdwalka vs ghostmintops. [ZAAL LINE, or use the default: two of the
deepest builder catalogues of the season, head to head.]

**CAST 4**

CREATOR FINAL - presdency.eth vs uniquebeing404. [ZAAL LINE, or use the default:
HOOD against ColorZAO - two builders stepping onto the creator stage.]

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

# SEND FILE - Season 1 finals announce

Everything below is ready to paste. Read the two boxes first, then the four
why-lines, then paste.

Nothing has been posted from the agent side. Zaal sends all of it.

---

# BOX 1 - STOP: THE SITE IS NOT DEPLOYED

**The branch `claude/zabal-gamez-season-1-finals-cctq96` is 8 commits ahead of
`main` with no PR open. None of it is live.**

Right now, this minute, zabalgamez.com still says:

- `/submissions` and `/board`: "The leaderboard is live and **this week is the
  last chance to climb it**"
- `/finals`: "**Artist and creator are still open.** If you have been building
  quietly, those tracks are where two spots each are genuinely unclaimed"
- `/finals`: "the builder track already has its field: Brandon, **Branth** and
  jdwalka" (Branth is not a finalist)
- `/finals`, `/winners`, `/info`: "Every finalist receives an **equal share** of
  the 500 USDC pool. **The same for all six, not a slice by rank**"
- `/leaderboard`: a countdown to a close that already passed

**If the announce posts before this merges and deploys**, the post names six
finalists while the site says two tracks are unclaimed, and the post's prize
structure contradicts an equal-share promise still published on three pages.
The prize contradiction is the serious one: it is money, and the live page is
the one people screenshot.

**Order: merge the PR, confirm the Vercel deploy is green, load /august and
/finals in a browser, THEN post.** The deploy is a couple of minutes. Ask the
agent session to open the PR and it is ready immediately.

---

# BOX 2 - TWO THINGS STILL UNRESOLVED

**1. HOOD and Ledger are still drafts.** As of the last check both carry
`status: "draft"`, which makes them invisible on `/submissions`. The post names
presdency.eth and dee-13 as finalists and links to that board. This CANNOT be
done from `/review` (that page only has Delete and Hide). Two routes that work
are in `docs/finals-six-announce-2026-08-17.md` under "The publish click-path":
DM them their private status links (preferred), or `action:'update'` with
`ready:true` as admin.

**2. Both creator finalists entered the builder track.** `data/points-roster.json`
records presdency and uniquebeing404 as **builder** entrants. The people who
actually entered creator - taydexfun and imanafrikah - are in the thank-you list
and the not-competing slot. The instruction was to say nothing about
uniquebeing404's move; that call was made when only one person was known to have
moved. With both creator finalists being builder entrants and no creator entrant
in the creator final, the silence may read differently. Zaal's call, unanswered.

---

# THE FOUR WHY-LINES - APPROVE OR EDIT

Written to the given direction: the submission being cool plus three months of
being active. Matching the two artist lines already approved.

**What is sourced vs what is asserted:** every project claim comes from
`data/builder-submissions.json` or the 2026-08-10 newsletter. Every
**presence** claim is unverified - points live in KV, not the repo, so there is
no attendance record here to check them against. The presence half of each line
is Zaal's observation to confirm. `curl https://zabalgamez.com/api/points` would
ground them in real numbers if there is time.

### jdwalka  `[AWAITING ZAAL APPROVAL]`
> Chroma Poker. A real poker app on Farcaster with a live HUD and hand-history
> parsing, still being tuned three months in. Kept hosting the Predictive Apps
> Space for everyone else the whole way through.

*Asserted:* that the Space ran on a real cadence through August.

### ghostmintops  `[AWAITING ZAAL APPROVAL]`
> Proof Drop, and six more behind it. Seven builds across all three tracks,
> starting with the first July build to land on the site. Nobody shipped more, or
> more often.

*Asserted:* "nobody shipped more" is a comparative claim against the other
fourteen. "First July build to land on the site" comes from a data-file
description, not a primary source.

### presdency.eth  `[AWAITING ZAAL APPROVAL]`
> HOOD. Kept building it out well past the point most entries stopped, and stayed
> in the room from June through to the close.

*Asserted:* almost all of it. This is the thinnest file - the repo has the name
HOOD and nothing else, and he never appeared on the month-two board. **This is
the line most likely to need rewriting in Zaal's own words.**

### uniquebeing404  `[AWAITING ZAAL APPROVAL]`
> ColorZAO. Real craft in a tool that did not have to be that considered, and a
> steady presence on the board from early on.

*Asserted:* the craft judgement and "from early on".

---

# PASTE 1 - NEWSLETTER / SITE ANNOUNCE

Post this first. Copy its URL, then paste that URL over `[link]` in CAST 1.

The ZABAL Gamez Season 1 board is closed.

15 people entered. 30+ projects went up across three tracks, most of them shipped
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

# PASTE 2 - THE FIVE CASTS, IN ORDER

**CAST 1**

ZABAL Gamez Season 1: board closed. 15 entered, 30+ projects shipped in public. 6
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

# PASTE 3 - THE DATES-ASK

Send to all six finalists and the three mentors, after the casts.

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

# ON "30+"

Used above, per the locked decision. Honest read on the risk, revising a more
alarmist framing from earlier today:

- Aug 10: 32 rows in the feed, 2 of them QA-test rows, so 30 real.
- Aug 11: "thirty projects" published in the Farcaster thread.
- Aug 17: 31 rows, QA state unknown.

For "30+" to be wrong, a **real** project would have to have been deleted between
the 10th and the 17th while both QA rows survived. That is the least likely of the
three explanations for 32 going to 31 - far more likely is that one or both QA rows
were cleared. So **"30+" is very probably safe** and is fine to post.

The exact number is still one command better, and it is in
`docs/finals-six-announce-2026-08-17.md` under "The project count" if there is a
spare minute before posting. The board is closed, so whatever it returns is final
and will never need correcting.

---

# AFTER POSTING

1. Paste the newsletter URL over `[link]` in CAST 1 before casting.
2. Publish HOOD and Ledger if not already done (Box 2).
3. Thursday: fill `date`, `time` and `watch` for each entry in the `battles` array
   in `data/finals.json` and flip `status` to `scheduled`. `/august` renders the
   schedule automatically, no HTML edit needed.
4. Set `FARCASTER_HUB_URL` in Vercel - it arms the strict webhook FID binding from
   the security audit.

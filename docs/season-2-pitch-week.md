# Pitch week - the settled format

**Settled by Zaal 2026-09-08.** Four points were open in `docs/season-2-ideas.md`; all four are
answered here, plus the pitch length and whether notes are public. This is the format of record.

> **Everyone pitches, recorded, three minutes, judges give notes, notes are public, non-scoring.**

Locking this now is deliberate. Season 1's own retro names the Finals format churning three times
(prediction market -> mentor 24h -> loops.house) as a thing that cost the season, so the format is
written down before anything is built against it.

**No dates.** Season 2 has no dates, format or theme beyond this, and none may be set here or
anywhere else until Zaal sets them. Pitch week sits in the gap between the board closing and the
Finals - in Season 1 that gap was 2026-08-16 to 2026-08-24, so the slot exists in the shape of the
season without anyone moving anything. That is a shape, not a date.

<!-- RECHECK 2026-11-01: if Season 2 has dates by now, this doc needs the actual pitch-week window
     written in. If it does not, check that nobody has quietly added one. -->

## The four answers, and what each one costs

**1. Who pitches: EVERYONE on the board.** Not only the finalists.

The trade Zaal took: opening it to everyone makes the cut better informed, because the people
making it have seen every entrant present. The cost is volume - Season 1 had 31 projects from 15
people, so "everyone" is tens of pitches, not six. That is the main reason the next answer matters.

**2. Format: RECORDED.** Asynchronous upload, not a live Space.

Season 1's finalists spanned EDT, BST, CEST, CAT, WAT and IST. A live slot excludes somebody, and
with everyone pitching there is no single hour that works. Recorded scales across timezones and
across a field of tens. The cost is that it is less like the real thing than a Space would be -
which was the original argument for live, and is now consciously traded away.

**3. Feedback: JUDGES GIVE NOTES.**

**This changes what the Finals measure, and it was decided deliberately.** The open question in the
ideas doc put it as "that may be the feature or the flaw": judges giving notes in pitch week means
they have seen the work, and formed a view, before they score it. Zaal chose it anyway. So the
Finals are explicitly **not** a blind first impression - they are a second look at work the panel
has already engaged with. Anyone reasoning about what a Finals judging signal means should read it
that way, and nobody should later "fix" this as an oversight.

**4. Scoring: NON-SCORING.** Pitch week does not count toward anything.

So nobody is penalised for treating a rehearsal as a rehearsal - which is the entire point of
having one. Judges' notes are feedback, not a score, and must never be aggregated into one.

## How it is built - reusing two systems, adding neither

The cheapest version in the ideas doc was "recorded and dropped into `/recordings` like any other
session". The four answers make that exactly right, with nothing new to build:

- **A pitch is a recording.** `data/recaps.json` entry with `type: 'pitch'`. The whole existing
  pipeline applies - `scripts/ingest-recording.mjs` generates the page, `/recordings` lists it,
  `recordings/index.json` and `recordings.txt` carry it for agents, transcripts work as they do
  for any session.
- **Judges' notes are the existing comment threads.** `assets/recording-comments.js` +
  `/api/comments` already give every recording page a Farcaster-verified thread. A judge's note is
  a comment from a verified identity on that pitch's page. No new endpoint, no new schema, and the
  notes are attributable, which matters if the panel's view is going to inform a cut.
- **Nothing scores it.** There is no field to add, because `scripts/check-signals.mjs` guards the
  Finals signals only. Pitch week has no signal block and must not get one.

### One gap this surfaced, now fixed

`recordings.html` grouped recaps by type and then rendered only a hardcoded three - `workshop`,
`fireside`, `bczworkshop`. A recap with `type: 'pitch'` was grouped and then **silently dropped**:
present in the machine index that agents read, invisible to every human on the hub. Fixed, and
fixed generally - an unrecognised type now renders rather than vanishing, so the next new type
cannot disappear either.

## 5. Length: THREE MINUTES

Confirmed 2026-09-08. Long enough to say what you built and why it matters, short enough that a
field of tens is watchable end to end - which only works because everyone pitches and it is
recorded. There is nothing to enforce in code: it is a brief given to pitchers, and a recording
that runs over is still a recording.

## 6. Judges' notes are PUBLIC

Confirmed 2026-09-08. They land on the pitch's own page in the existing Farcaster-verified comment
thread, which is public by default - so this is the cheaper path *and* the more useful one, because
every other entrant learns from notes given to somebody else.

**The obligation it creates.** An entrant will read the panel's view of their own work, in public,
before the cut is made. That is a real cost and the answer to it is not to soften the notes - it is
to tell people up front, so nobody is surprised by it after recording. **The pitch-week card on
`/recordings` therefore states plainly that notes are public and unscored before anyone pitches.**
Anyone rewriting that copy should keep that sentence: consent to public feedback has to be
informed, and the only place it can be informed is before the pitch.

Notes remain feedback, never a score. **They must not be counted, ranked, averaged or aggregated** -
not comment counts, not sentiment, not "the panel liked this one". Pitch week has no signal block
in `data/finals.json` and must not gain one; `scripts/check-signals.mjs` guards the Finals signals
only, and that is correct.

## What is still open

One thing, and it does not block anything above:

- **Where a pitch is uploaded and who ingests it.** The pipeline exists
  (`scripts/ingest-recording.mjs` takes a manifest and does the rest), so this is a logistics
  question - a form, a DM, a shared drive - not a build one.

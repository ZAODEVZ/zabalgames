# Season 1 close-out audit - 2026-09-07

Every number here was measured on 2026-09-07 against the live site, the committed
KV backup, or git. Nothing is carried over from an earlier doc. Where a thing
could not be measured it says UNMEASURED and shows what was tried.

This exists so the next session does not re-derive any of it. Read this before
changing a season figure.

---

## The only item with a date: the KV backup switches itself off

`.github/workflows/kv-backup.yml` is the repo's only scheduled workflow. GitHub
disables scheduled workflows after **60 days of repository inactivity**, silently,
with no failing run and no error anywhere.

Measured:

| Thing | Value |
|---|---|
| Last commit by a person on `main` | `9866ae6`, 2026-09-06 (PR #669) |
| Last commit of any kind | `b0458ff`, 2026-09-07 - author `zao-backup`, pushed by the workflow itself |
| Workflow state (GitHub API) | `active` |
| Last 5 scheduled runs | all `success`, through 2026-09-07 |
| Workflows in the repo | 1 |

**The date is 2026-11-05**, counting 60 days from the last human commit. Today's
commit moves it to **2026-11-06**. Season 2 prep is targeted at late November, so
on the current plan the backup stops roughly three weeks BEFORE anyone looks at
this repo again.

One thing is genuinely UNMEASURED: whether the workflow's own nightly commit
resets the 60-day clock. The commits are pushed with the default `GITHUB_TOKEN`,
and it is widely reported that `GITHUB_TOKEN` activity does not count - but that
is not something this repo can measure from the inside. So the safe reading is
the one above: assume bot commits do not count, and treat 2026-11-06 as real.

What stops on that date: the nightly backup, and the daily authenticated call to
`/api/export` that is also what keeps the Upstash free tier from going cold.

Both `workflow_dispatch` and a warning email from GitHub are available as
manual saves. Neither is a detector - see the grill.

---

## 1. The season figures reconcile. The premise that said otherwise was wrong.

`CLAUDE.md` said 31 projects / 15 people "does not reconcile" against 21 KV
documents from 6 handles. **That comparison used the wrong store.** Measured:

`GET https://zabalgamez.com/api/submissions?feed=projects` returns, live:

```
ok: true   configured: true   source: canonical-project-feed
count: 31   builders: 3
tracks:   artist 6, builder 19, creator 6
statuses: published 22, building 7, planned 2
```

31 rows, counted. They come from two places, and the old comparison only ever
looked at the first:

- **16 rows** from the KV board (`zabal:sub:v1:*`)
- **15 rows** from the seeded builders in `data/builder-submissions.json` -
  ghostmintops 7, branth 5, jdwalka 3

Why the 21-document count was misleading: `zabal:sub:v1:*` holds 21 documents,
but they are prompt answers, not projects. By status they are 15 approved, 3
pending, 3 draft. Of those, id 1 is `promptId: wip-test` and reads *"E2E test
draft from the build terminal - safe to reject"*, and ids 5 and 6 are both
labelled `[QA TEST - please delete]`. None of those three reach the public feed.
And the count omits the 15 seeded builder projects entirely.

**Verdict: 31 is correct and reproducible. Do not change it.**

### 15 people

The feed yields **17 distinct identities**. Two of them carry no usable identity:

- id 20 (`sentra`) - handle null, builder name null
- id 19 - builder name is the literal string `https://x.com/Gesd01`

17 minus those two is 15, which is what is published. That is a defensible
reconciliation but it is a judgment call, not an extraction - the figure was
hand-tallied and the tally itself was never written down. Recorded here so the
next person sees the arithmetic instead of re-guessing it.

The full identity list as measured: ghostmintops (7), branth (5), LadyrynNemesis
(3), jdwalka (3), and one each for uniquebeing404, breadcoop, mettodo, kayonfire,
Halit Tayyar / @taydexfun, IMan Afrikah, Presdency.eth, dee-13, Joshua Grubbs /
@pyrofirezerox, Pascaline, เมรี เพ็ชรจันทร์, plus the two unidentified rows.

Two live rows are low-signal but real submissions and were left alone: id 21
(project `เมรี`, description `เล่นเกม`) and id 20 (`sentra`, no builder).

### 31 workshops

`data/season-1-results.json` publishes 31 workshops alongside 31 projects. The
repo holds **35 recording pages**, which is a different thing (some sessions
produced more than one page, some pages are not workshops). The two numbers are
not in conflict and neither was changed.

---

## 2. The judging panels

From `data/finals.json`:

| Battle | Judges |
|---|---|
| artist | none recorded at all - **still open** |
| builder | Thy Revolution, Iman Afrikah, paperhandpapi |
| creator | Thy Revolution, N3M, **Candy Toybox** - filled 2026-09-07 |

### The creator third seat: filled, and where it came from

It sat as a literal `null`. **Zaal named her on 2026-09-07: Candy Toybox,
`@CandyToyBoxYT1`.** That handle was closed by the nyczao lane the same day,
after four earlier attempts to find it failed.

**This was recovered from Zaal, not from a document.** Nothing on disk carried it
- not `finals.json`, not the Space recording notes, not `.handoffs/DONE.md`,
which records only that the third seat was "still being found" and was rendered
as an explicit TBA rather than invented. So there is no file to check it against,
and a future pass must not "correct" it toward the `null` on the grounds that
nothing supports it. The `null` was a gap, not a correct empty.

Not to be confused with the Candy (Samantha) who owns wavewarz.info and appears
in the `candy` skill. Different person.

### Was anything computed over two judges?

Checked, because a null in an array is the kind of thing that quietly skews a
count. **Nothing computes over the judges array anywhere:**

- `august.html` and `live.html` both `.map()` the array and render a null as an
  italic `TBA`. Length is never read for anything but an emptiness check.
- `scripts/check-finals-render.mjs:47` filters `battles` by *having* a judges
  array and counts **battles**, not judges.
- No average, score table or per-judge tally exists in the repo. Per-signal
  numbers were never captured at all (section 3), so there was nothing to divide.

So the `null` was cosmetic in every rendered surface and factual only in the
record. Filling it changes the record and the `/august` prose, nothing computed.

### The artist battle is still open

No panel is recorded for it at all. Either one existed and was never written
down, or the battle ran on the poll and the charts alone. Only Zaal closes that.
Guessing a judge's name onto a public results page would be worse than the gap.

---

## 3. Per-signal numbers

Poll counts and trading figures for the three battles are in no store, no data
file and no backup. They were never captured. Every surface names who took each
signal and publishes no margin, which is correct.

They are not recoverable by any means available here. The only live question is
whether Season 2 instruments them at the time - see the grill.

---

## 4. Vercel Web Analytics is on. Measured, not assumed.

`CLAUDE.md` said this was unresolved because dashboard state cannot be read from
the repo. It can be measured from outside, and was:

```
GET  https://zabalgamez.com/_vercel/insights/script.js   -> 200, 3106 bytes of real runtime
POST https://zabalgamez.com/_vercel/insights/view        -> 200
```

A project with Analytics disabled does not serve the runtime and does not accept
the beacon. **It is collecting.** What still cannot be measured from here is
retention and whether anyone reads it.

One real defect found and fixed in this pass: **6 public pages carried no
analytics tag at all** - `august.html` (the canonical Finals page), `guest.html`,
`links.html`, `media.html`, `status.html`, `wins.html`. All six now have it.
`referrers.html` is a redirect stub and correctly has none. Coverage is now 65 of
66 top-level pages, which is every page that renders.

---

## 5. Cal.com - and a wrong claim in CLAUDE.md

Two booking pages are live right now:

| URL | HTTP |
|---|---|
| `cal.com/zabal-gamez/workshop-session` | 200 - this is the one the site links |
| `cal.com/bettercallzaal/zabal-games-workshop-slot` | 200 - named in the lane brief |
| `cal.com/bettercallzaal/zabal-games-workshop` | 404 - the archive doc's link is dead |

The season is over and both live pages still accept bookings for it.

`CLAUDE.md` described `lead.html` as "workshop-lead page: Cal.com embed
(`CAL_LINK` var) + Formspree fallback". Measured: **`lead.html` contains no
Cal.com link and no `CAL_LINK` variable.** The only Cal embed on the site is in
`info.html`. `CAL_LINK` survives solely in `docs/archive/cal-luma-workflow.md`.
Corrected in `CLAUDE.md` in this pass.

Adding booking questions to the event is a Cal.com dashboard action and cannot be
done from the repo.

---

## 6. Branch triage - 25 branches, 10 dead, 15 real, and 4 of the 15 are one thing

`git branch -r --no-merged origin/main` lists 25. That overcounts, because a
squash merge changes the patch id and the branch keeps looking unmerged. Cross-
checking with `git cherry` and PR state:

### Dead - fully landed on main, safe to delete (10)

`ws/builder-winner-post`, `ws/docs-season1-closeout` (#669),
`ws/remove-collectible-link`, `ws/retire-superseded-finals-stack`,
`ws/season-clock-guards`, `ws/season1-closed-copy`, `ws/season1-llms-press`,
`ws/season1-surface-sweep` - all report zero unmerged patches.

`ws/home-season1-showcase` (PR #667 MERGED) and `ws/retire-magnetiq-endpoint`
(PR #661 MERGED) look unmerged to `git cherry` but were verified by content:
`api/magnetiq-ugc.mjs` is absent from `main`, so #661 landed. Nothing is
stranded on either.

### Superseded - content is on main by another route, or the plan changed (3)

- `ws/retire-loops-magnetiq-2026-08-27` - its whole payload is deleting
  `api/magnetiq-ugc.mjs`, which `main` no longer has. Landed via #661.
- `ws/adoptable-seeking-maintainer` - a strict subset of
  `ws/adoptable-schema-id-note`, which contains the same commit `9a1e0f2`.
- `claude/submissions-org-finals-post-n05sij` - 9 commits, every one of them
  built around moving the season to **loops.house**, which is retired. Also
  closes the community vote in a way the real close-out already superseded.

### One body of work in four copies (4)

`backup/pr-584-2026-08-12`, `claude/zabal-august-finals-obaj97`, `pr-584` and
`pr584` all point at tip `19708ef`, tree `6b58a4f` - **byte-identical**. This is
closed PR #584, "Let builders edit their own projects while signed in with
Farcaster" (SIWE wallet login). One decision covers all four.

### Genuinely unlanded and worth a decision (8)

| Branch | What it holds | Last touched |
|---|---|---|
| `ws/bonfire-lane` | Telegram-to-Bonfire ingest script + `docs/bonfire-lane/` | 2026-08-26 |
| `ws/lane-audit-2026-08-25` | the lane audit doc | 2026-08-26 |
| `ws/sopha-fireside` | a complete recording page + transcript (PR #188, CLOSED) | 2026-06-09 |
| `rescue/orphan-8668183-azkal-flowstage` | `recordings/26` - Azkal FlowStage page + transcript | 2026-06-28 |
| `ws/adoptable-schema-id-note` | `/projects` id contract + "Seeking maintainer" group | 2026-08-25 |
| `ws/newsletter-day2` | June newsletter draft | 2026-06-02 |
| `ws/newsletter-day159` | June newsletter draft | 2026-06-07 |
| `ws/newsletter-2026-06-09` | June newsletter draft + socials | 2026-06-09 |

**CORRECTION, same day.** An earlier version of this document claimed
`ws/sopha-fireside` and `rescue/orphan-8668183-azkal-flowstage` were "content
that exists nowhere else". **That was wrong, and it was wrong in the dangerous
direction** - it invited someone to re-land two stale drafts over the good
copies. Both sessions are already on `main`, under different slugs and numbers:

| Branch | Session | Already on main at | Branch transcript | Main transcript |
|---|---|---|---|---|
| `ws/sopha-fireside` | Sopha - Chris (chriscocreated) x Zaal, 2026-06-08 | **`/recordings/5`**, "Building Sopha, and why curation is needed", transcript `2026-06-08-sopha-chris-building-curation.md` | 1,864 words, untimestamped | **2,762 words, timestamped, deep-links the video** |
| `rescue/orphan-8668183-azkal-flowstage` | AZKAL / FlowStage, 2026-06-28 | **`/recordings/27`**, same transcript filename, `youtube: youtu.be/U_Eubs-2_Yo` | 5,192 words, **no youtube**, empty `[00:00:00]` | **5,258 words, carries the video** |

**Main's copy is strictly better in both cases.** The branch versions are earlier,
thinner drafts of sessions that later landed properly. There is nothing to
salvage: both branches are safe to delete, and re-landing either would be a
regression.

How the wrong claim was reached: the branch diffs showed new files, because the
slug differed (`2026-06-08-sopha-fireside-chris.md` vs
`2026-06-08-sopha-chris-building-curation.md`). Comparing filenames is not
comparing sessions. **The check that settles it is by session - date plus
presenter - against `data/recaps.json`, not by path.**

The gaps at `recordings/21` and `recordings/26` are therefore unrelated to these
two branches. They are simply unallocated numbers, and nothing points at them.

Per the standing rule, **nothing was deleted.** This table is the archive.

### The numbering gap is harmless

`recordings/N.html` runs 1-35 with **21 and 26 missing**, and `/recordings/21` and
`/recordings/26` both return 404 live. Nothing is broken by this - all 35 entries
in `data/recaps.json` point at a page that exists on disk, so there are no
dangling links and the hub renders correctly. They are unallocated numbers and
nothing links to them.

Recording totals cross-checked while here: 35 pages on disk, 35 entries in
`data/recaps.json`, typed 31 `workshop` + 4 `fireside`. That matches the
published "31 recorded workshops" exactly and matches `README.md`'s "31 workshops
and 4 firesides". No change needed.

---

## The salvage attempt, and the bug it found

Acting on the wrong claim above, `scripts/ingest-recording.mjs` was run against
the AZKAL manifest on 2026-09-07. It reported `UPDATE`, matched
`/recordings/27` by transcript filename, and **rebuilt a live video page as a
placeholder, dropping `youtube: youtu.be/U_Eubs-2_Yo` from the recap.** Reverted
immediately; nothing was pushed.

That is a real defect, not operator error, and it is now fixed. `buildRecap()`
built the recap from the manifest alone and `recaps[existingIdx] = recap`
replaced it wholesale, so **every field the manifest was silent about was
deleted** - `youtube`, `chapters`, `technical`, `type`, `pull_quotes`,
`resources`, the lot. The docstring claimed it carried `chapters`; it did not.
This is the exact reverse of the script's own documented flow ("re-run on the
same slug to UPDATE in place, e.g. video lands after a transcript-only first
pass") - that flow could not work, because the transcript-only pass would erase
the video it was meant to complement.

The fix backfills the manifest from the existing recap before anything is
generated, so the page inherits too, and `"replace": true` opts out. Measured
after the fix:

- The manifest that broke page 27 now reports `[video]` and `carried youtube`.
- A bare `{slug, date, title}` manifest over `/recordings/35` carries **18**
  fields it used to drop, and keeps `type: fireside` instead of defaulting the
  recording back to `workshop`.
- A no-op re-ingest of `/recordings/35` now leaves `data/recaps.json` and
  `recordings/35.html` **byte-identical**. Only the generated date stamps in
  `recordings.txt` and `recordings/index.json` move.

The script also warns now when an update would turn a video page into a
placeholder, so the next person sees it in the dry run instead of in production.

## 7. Season 2

Named, with no dates, no format and no theme. `docs/season-2-ideas.md` holds the
ideas and Zaal's pitch-week suggestion. Nothing public was set, which is correct.

The one hard dependency Season 2 has on this document is the backup date above:
late-November prep starts after 2026-11-06.

# DONE - creator battle lane (PARKED 2026-08-27)

Branch: `ws/creator-battle-0827`, 4 commits, **local only, never pushed**. Zaal pushes.
Parked mid-lane on Zaal's direction change to the 99darwin research job.

State: tree clean, `node scripts/validate.mjs` green, branch is 4 ahead of
`origin/main` (`d1a3f51`) and has no PR. Nothing was posted anywhere.

## Commits, oldest first

- `6603f65` - uniquebeing404's `demo` -> `https://colorzao.signalify.xyz`
- `645d4ad` - builder finalists linked: ghostmintops -> Proof Drop live page +
  repo `BrandonDucar/proof-drop-zabal`; jdwalka -> `github.com/Chroma-Poker`
- `bb226df` - seven unposted social drafts in
  `drafts/creator-battle-2026-08-27-socials.md`
- `a98ef63` - headless render verification of all five `finals.json` consumers,
  `docs/finals-render-verification-2026-08-27.md`

## Verified, not assumed

Rendered every page that reads `finals.json` against the real file. With `poll`
null there is no dead Vote control anywhere: the string "Vote in the poll"
appears zero times, there are zero empty-href anchors, and zero JS errors. Same
guard covers `space`. `/live` correctly makes the creator final the NEXT UP card
and steps past the finished artist battle. `/winners` correctly holds its
placeholders because `settled` is still false.

## STILL ZAAL'S - nothing below is code-blocked

- **creator row:** `space` URL, `poll` URL, the three judges, presdency's HOOD link
- **builder row:** `space` URL, `poll` URL, the three judges
- **also:** confirm the artist winner (row still reads `status: scheduled`, all
  ranks null), and decide the `/finals` prize copy

Each of the first two is one data edit on `data/finals.json`. No code.

## OPEN DEFECT - two prize schemes are live at once

`/august` and `finals.json` say 100 champion / 50 runner-up / 50 volume bonus.
`/finals` still says 300 split 70/30 per track plus 200 volume capped at 80.
Both render publicly. **`/august` is the current one** - PR #639 superseded #624
by about ten hours on 2026-08-23 and `finals.html` was never updated. The lane
handoff `~/zao-vault/handoffs/zabalgames.md` is stale the same way, still
recording the older flat 83.33 split.

Left alone deliberately: money-facing public copy, wording is Zaal's call. One
paragraph in `finals.html` plus a correction line in the vault note.

## Note for whoever merges

This file did not exist on this branch before today. It carries creator-battle
content only - the bonfire lane's own `DONE.md` lives on `ws/bonfire-lane` and
was deliberately kept off this branch. This one will ride to main on merge; drop
it in the merge if that is not wanted.

---

# ADOPTION CANDIDATES - 99darwin source read (2026-08-27)

Research doc: `ZAO OS V1/research/dev-workflows/2423-99darwin-code-adoption/`,
committed as `de7c5cfa` on `ws/research-2423-99darwin-code-adoption`, not pushed.

Read `~/zao-vault/notes/adoption-candidates.md` first, as instructed. **Not
re-proposed here:** `99darwin/orchestrator` - that row is already complete in the
vault note with the same three files and the same S effort, and my source read
confirms it rather than changing it. Rows below are the ones that were marked
`(lane reading)`, plus one new repo, plus one nuance on telecast.

| source repo | what | LICENSE from the file | adopt as | target repo | effort |
|---|---|---|---|---|---|
| 99darwin/obsidian-vault-scaffolder | Skill test + benchmark harness: `tests/run_smoke_tests.sh` + fixtures + with-skill-vs-baseline methodology (3 realistic prompts, pass rate / time / tokens). We have ~100 skills and no test harness for any. CAVEAT: published `benchmark.json` is an empty template (`runs: []`, `<model-name>`, deltas 0.00) - adopt the methodology, not the numbers | MIT (file, 21 lines, "Copyright (c) 2026 Nick Saponaro") | pattern + 2 files (`tests/run_smoke_tests.sh`, `benchmarks/README.md`) | skill library | M |
| 99darwin/farcaster-audio | `developer_key_service.py` + `routers/developer.py` (655 lines): application -> approval -> app -> key. Removes the exact blocker docs 695/710/712 all end on - nickysap issuing a `JUKE_API_KEY` by hand. Self-host and ZAO issues its own keys | MIT (file, 21 lines, "Copyright (c) 2026 Nick Saponaro") | fork (backend 24,375 lines Py, real test coverage, alembic, Dockerfile) | Zuke | L |
| 99darwin/nexus | Tiered-model classification ladder for graph ingest: Haiku triage first, heavier models only for survivors. `triage.ts` defaults to `claude-haiku-4-5-20251001`. Neo4j + BullMQ + dedup + anomaly detection | MIT (file, 21 lines, "Copyright (c) 2026 Nexus Contributors") | pattern + files (`packages/agent/src/triage.ts`, `pipeline.ts`, `dedup.ts`) | Bonfire / graphify | M |
| 99darwin/telecast | NUANCE ONLY on the existing row, not a re-proposal. Confirmed no LICENSE file on disk, so all rights reserved stands. BUT `package.json` declares `"license": "ISC"` - the intent is already stated, only the grant file is missing. Ask-Nick becomes "your package.json says ISC, add the LICENSE to match", not "will you license this" | NONE (no file; package.json claims ISC) | pattern only until licensed | ZOE v2 bridge | blocked |

## Why ranks 1-3 in the doc are the write-set / cross-model / worker-report trio

Measured, not asserted: `grep -rn "write-set\|parallel-safe"` across
`.claude/rules/` and `~/zao-vault/handoffs/lanes.md` returns **zero hits**. We
have no write-set rule anywhere, in the week two lanes nearly collided on
`sync-projects.js` and two panes did collide on `ws/2422-lane-weighin` (#3338).

`parallel-safety.md` carries the specific rules that would have caught both:
lockfiles always serialize, migrations serialize, shared config gets one owner,
workers declare ports so two lanes do not both claim 3000, and "when in doubt,
sequence - a stomp costs the rerun plus re-verification."

`worker-prompt.md` carries the enforcement half: "You may write to these files
only... if your task requires writing outside this scope, STOP and report back
instead of expanding scope."

## Path CONFIRMED (Zaal, 2026-08-27)

The numbered conventions live in `~/zao-vault/notes/orca-organization.md` under
"Conventions to adopt" - **not** `.claude/rules/lane-autonomy.md`, which is where
I looked and found nothing.

**Convention 5 = "File ownership when panes overlap"**, and it already cites the
same incident: *"Two panes nearly edited sync-projects.js the same hour. Rule:
the pane whose repo owns the file makes the change; the other reports findings
and stands by."*

How the port should land: convention 5 already resolves an overlap **once it is
noticed**. What `parallel-safety.md` adds is the step that notices it - computing
and comparing write-sets *before* dispatch, instead of discovering the overlap
when two panes are already in the same file. Extend convention 5, do not replace it.

That note already carries a "Candidate conventions from 99darwin/orchestrator"
section naming these same three and deferring source paths to this lane; doc 2423
supplies them. The note is orchestrator-written and this lane did not edit it.

---

# PRIZE SCHEME RECONCILIATION - PREPARED, NOT PUSHED (2026-08-27)

**Zaal decides which scheme is real. This commit is staged to land the moment he
says, and it must not be read as the decision having been made.**

Two contradictory schemes were public at the same time:

- **A ("august"):** 100 to each track champion, 50 to each runner-up, 50 to the
  highest season trading volume. 500 exactly. In `august.html` + `data/finals.json`.
- **B ("finals"):** 300 on the battles split 70/30 per track, plus 200 on trade
  volume capped at 80 each. In `finals.html` + `info.html`.

I rewrote `finals.html` and `info.html` to **scheme A**, as instructed. Arithmetic
checked: 3x100 + 3x50 + 50 = 500. `node scripts/validate.mjs` green.

## This does NOT assume A wins because it is newer

Recording the evidence separately from the decision, because they are different
things:

- A is newer. PR #639 (2026-08-23 20:10) superseded #624 (same day, ~10h earlier).
- #639's own commit message says Zaal set the structure and that the prior scheme
  "is the opposite" of what he wanted.
- B was never updated afterwards - `finals.html` has not been touched since #624.

That is evidence A is the **current written intent**. It is not evidence of what
Zaal wants **now**, which is the money question and is his alone. If he says B,
the prepared commit is wrong in direction but correct in shape.

**To flip to B instead:** revert this one commit and rewrite `august.html:129`,
`august.html:163` and the `prize` field on all six entries in `data/finals.json`.
That is the larger edit of the two - A currently has more surface.

## Every other file carrying the OLD numbers

Not rewritten. All are dated point-in-time records, which per CLAUDE.md are not
current state and should not be retro-edited:

| File | Line | Carries |
|---|---|---|
| `docs/newsletter-2026-08-17-final-six.md` | 40 | "300 USDC on the head-to-head split 70/30, plus 200 USDC volume-weighted... capped at 80" |
| `docs/season-1-handoff-prompt-2026-08-17.md` | 69-70 | "300 rides on the battles (70 to each track winner, 30 to each runner-up); 200 follows trade volume... capped at 80 each" |

If scheme A is confirmed, these stay as-is as historical record. **But the
newsletter numbers went out to readers**, so if A is right, a correction line in
a future edition is a separate call worth making.

Also carrying old numbers, but correctly: `docs/finals-render-verification-2026-08-27.md`
and this file both quote BOTH schemes deliberately, to document the conflict.

## Correction to something I said an hour ago

I reported `data/bonfire-graph.json` as carrying the old prize numbers. **It does
not.** That was a false positive - my grep for "200 USDC" matched
`"liquidity": "~550-1200 USDC"`, which is unrelated. Checked for the actual
scheme text (`70 to`, `capped at 80`, `runner-up`, `track champion`) and the file
has none. The knowledge graph is clean.

---

# TONIGHT'S BATTLE - final state (2026-08-27, re-verified 08:32 EDT)

## THE SIX ZAAL FIELDS - one line each, for the grill

1. **Space URL (creator, tonight 5:00 PM EDT)** - schedule the Space on the WaveWarZ account and paste it into `space` on the creator row of `data/finals.json`; every surface then renders "Set a reminder", and a link pasted at 4:55 has already failed at the only job it had.
2. **Poll URL (creator, tonight)** - post a standalone X poll before 5:00 PM and paste it into `poll` on the creator row, because on 08-24 the poll only opened inside the Space, its field is still null today, and that battle's Vote button therefore never rendered at all.
3. **Three judges (creator, tonight)** - name them; artist ran with Thy Revolution, Jose (Joseph Goats) and AttaBotty, and note there is no judges field in `finals.json` and no page renders judges per battle, so showing them needs a small code change and a decision first.
4. **presdency.eth's HOOD link** - no URL for HOOD exists anywhere in the repo or the vault, so he is the only one of six rendering as plain text while the other five are links.
5. **Artist winner** - confirm it; the artist row still reads `status: scheduled` with every rank null three days on, and the 08-24 transcript closes "Congratulations again, Nemesis... since you're the winner" but that is an unreviewed machine transcript so nothing was written.
6. **Prize ruling** - name which scheme is real; the reconciliation is committed and staged but deliberately not landed, and the reverse edit is larger than the forward one.

Saturday's builder battle needs **the same fields 1, 2 and 3 again** - its `space` and `poll` are null for the same reason and no judges are named. Nothing else on that row is missing.

## Re-verified end to end at 08:32 EDT, after the prize rewrite

Six pages rendered headlessly against the real `finals.json`. Redone rather than
trusted, because `finals.html` and `info.html` both changed since the last pass.

- `Vote in the poll` appears **zero** times across all six pages. Zero empty-href anchors anywhere. No JS errors from our code.
- "Set a reminder" appears **once**, on the artist row, which is the only battle with a Space. Creator and builder correctly show neither button.
- Creator row renders: `@presdency vs @uniquebeing404 | Thursday, August 27 - 5:00 PM EDT | Watch -> | Trade the battle ->`
- Builder row renders with both ends of the 24 hour window and the same two buttons.
- **Judges confirmed harmless:** `grep` for `.judges` across every page returns nothing. No page reads the field, so its absence breaks nothing - it simply cannot be displayed.
- `finals.html` and `info.html` now carry the rewritten prize copy and the old scheme is gone from every `.html`.
- Only console errors on `/finals` and `/info` are 403s and font warnings from the embedded **Cal.com iframe**, plus `/api/*` 404s that do not exist on a static server. Neither is ours.

**What appears the moment Zaal pastes:** the `space` URL renders a "Set a reminder"
link on that battle's row on `/august` and a "Set a reminder" button on `/live`;
the `poll` URL renders "Vote in the poll ->" on `/august` and a "Vote in the poll"
button on `/live` and on the live stage card. Both are pure data - no code, no
deploy beyond the merge.

## Builder row (2026-08-29) - everything fillable IS filled

Filled in commit `645d4ad` earlier today, not left for Saturday: `date`, `time`,
`endDate`, `endTime`, the 24 hour `window` sentence, `watch`, `battleUrl`,
`status: scheduled`, plus both finalists linked - ghostmintops to the Proof Drop
live page and repo `BrandonDucar/proof-drop-zabal`, jdwalka to Chroma Poker.
`poll` and `space` are the only nulls and neither exists anywhere to copy in.

## Socials - clock-checked, still unposted

Seven drafts plus a new LIVE NOW variant in
`drafts/creator-battle-2026-08-27-socials.md`. Re-read against the clock: they
are written for "today, pre-battle", correct until about 4:00 PM EDT, and the
file now carries per-window swap lines because "today" reads wrong at 4:55 and is
false after 5:45. Also flagged: the X GC line "poll goes up in the space" becomes
untrue if Zaal pre-posts a standalone poll, which is what item 2 asks him to do.

## 99darwin research - PARKED for another lane

Doc 2423 is committed and complete enough to hand over:
`ZAO OS V1/research/dev-workflows/2423-99darwin-code-adoption/`, commits
`de7c5cfa` + `0e934b28` on `ws/research-2423-99darwin-code-adoption`, unpushed.
Adoption rows and the unsent telecast draft are landed here. Two GitHub issues
filed: **#3339** (new - doc-number scan reads commit SHAs as doc numbers) and a
third-instance comment on **#3338** (a second pane took HEAD in the shared ZAOOS
checkout while I worked). Open for the next lane: apply the `sed` fix at both
scan sites, and audit the corpus for an already-shipped inflated doc number.

---

# ZABAL - the six, as they land (2026-08-27)

**ZABAL 1/6 - JUDGES: PARTIAL.** Thy Revolution and N3M named by Zaal at 11:58;
third seat still being found and is rendered as an explicit `TBA`, not invented.
Landed in `8076509` - this needed a small code change, not a data edit, because
`finals.json` had no `judges` field and no page rendered judges at all. Creator
row now reads "Judges: Thy Revolution, N3M, TBA"; artist and builder rows are
untouched because they carry no field. Filling seat three is now a data edit.
*Flag for Zaal: N3M is also an artist-track finalist and, on the unconfirmed
transcript, the artist winner. Judging another track is not a conflict on its
face, but all six compete for the same 50 USDC season volume bonus - worth a
conscious yes.*

**ZABAL 2/6 - PRIZE: DONE.** Zaal ruled `/august` is real: 100 to each track
champion, 50 to each runner-up, 50 to the highest season trading volume, 500
exactly. The prepared reconciliation `3b8db2a` was already committed on this
branch, so the ruling confirms its direction rather than requiring new work - the
"direction unconfirmed" caveat on that commit is now resolved to CONFIRMED.
Re-verified after the ruling: `/august`, `/finals` and `/info` all render the
100/50/50 scheme and the old 300/70-30/200-capped-80 scheme is gone from every
`.html`. One scheme site-wide.

**ZABAL 3/6 - SPACE URL: STILL NULL.** Zaal-only. Schedule on the WaveWarZ
account, paste into `space` on the creator row. Renders "Set a reminder" on
`/august` and `/live` the moment it lands.

**ZABAL 4/6 - STANDALONE POLL URL: STILL NULL.** Zaal-only. Post before 5:00 PM
and paste into `poll`. Renders "Vote in the poll" on `/august`, `/live` and the
live stage card. Note this makes the X GC social draft's "poll goes up in the
space" line untrue - swap it, per the drafts file.

**ZABAL 5/6 - HOOD LINK: STILL NULL.** Zaal-only. No URL for presdency.eth's HOOD
exists anywhere in the repo or the vault; he is the only one of six rendering as
plain text.

**ZABAL 6/6 - ARTIST WINNER: STILL UNCONFIRMED.** Zaal-only. Artist row still
reads `status: scheduled` with every rank null. Nothing written on machine-
transcript evidence alone.

**Score: 1 done, 1 partial, 4 open.** Saturday's builder battle needs 3/6 and 4/6
again plus its own panel; everything else on that row is already filled.

Branch: `ws/creator-battle-0827`, unpushed, unrebased. Nothing posted anywhere.

**ZABAL LIVE-URL - SPACE: DONE (3/6), written 17:35 EDT.**
`https://x.com/i/spaces/1dKrPrQkgYVJX` is on the creator row's `space` field,
committed. Verified rendering on both surfaces: `/august` creator row shows
"Set a reminder ->" pointing at the Space, and `/live` shows a "Set a reminder"
button with the same href. Zero empty hrefs, still zero Vote buttons (poll null).

Checked rather than assumed: the new ID `1dKrPrQkgYVJX` shares a `1dKrPr` prefix
with the artist Space `1dKrPrnYaDqJX` and diverges at index 6. They are different
Spaces, not a mis-paste.

Stored without the `?s=20` share-tracking suffix Zaal pasted, matching how the
artist Space is already stored in this file. The parameter carries no routing
meaning; say the word and it goes back in.

## THE THING THAT MATTERS MORE THAN THIS COMMIT

It is **17:35 EDT**. The battle runs **5:15 to 5:45**, so there are roughly ten
minutes left, and `ws/creator-battle-0827` is **unpushed**. Nothing in these 14
commits is on production. **The Space link cannot reach a single viewer tonight
unless Zaal pushes and merges within those ten minutes.** After 5:45 this commit
is a record of the battle, not a promotion of it.

Two cosmetic mismatches that follow from a link landing mid-battle, neither worth
a code change at 17:35 and both listed so nobody is surprised:

- The button reads **"Set a reminder"** for a Space that is live right now. The
  link works and joins the Space; only the label is wrong for the moment.
- `/live` still labels the card **"NEXT UP"** with a dashed-out countdown
  (`-- -- -- --`), because the start time has passed. Correct behaviour - the
  card holds through the battle by design - but it reads as upcoming.

Also now stale: the social announcement drafts. Past 5:00 PM only the LIVE NOW
variant applies, and after 5:45 none of them should go out at all. That is in the
clock table in `drafts/creator-battle-2026-08-27-socials.md`.

---

**ZABAL builder-format - SPECIFIED AND ON THE SITE (Zaal, 21:5x).**

Saturday noon to Sunday noon, 24 hours, with a Space at each end: **opening
Sat 12:00-1:00 PM EDT**, **closing Sun 11:00 AM-12:00 PM EDT**. Between them the
builders work in the open and the battle trades the whole way. **Ad-hoc Spaces:**
when either builder has something to show mid-run they reach Zaal directly and he
opens a Space, so extra Spaces can appear at any hour and nothing promises a fixed
mid-run schedule.

**Zaal's phone number is not written in any file** - not in `data/finals.json`,
not in the drafts, not here. The mechanic is described as "they reach Zaal
directly" and stops there. Grepped all changed files for a phone-shaped string to
confirm: none.

What changed:
- `data/finals.json` builder row - rewritten `window` with both slot times and
  the ad-hoc mechanic; new `spaces` array carrying the two slots; `judges: null`.
- **Schema addition:** the row had one `space` field and this battle has two
  Spaces. Added `spaces[]` of `{ label, date, time, ends, url }`, documented in
  the battles note. `space` singular still works for the one-Space battles, so
  artist and creator are untouched.
- `august.html` renders each slot. **The slot TIME renders while the url is
  null** - "Opening Space - Saturday, August 29 12:00 PM EDT to 1:00 PM EDT -
  link when it is created". People need to know when to show up before the links
  exist, and a blank slot would have hidden that.
- `drafts/builder-battle-2026-08-29-socials.md` - seven platform drafts, unposted,
  with `[OPENING SPACE LINK]` / `[CLOSING SPACE LINK]` placeholders and a clock
  table. Firefly post 212/280 chars, no emojis, em dashes, hashtags or hype words,
  every post opens with ZM.

**Judges for the builder battle: UNSET**, as instructed. `judges: null` renders no
judges line at all, so the row shows nothing rather than a row of TBAs. Verified.

Re-verified render: builder row shows both slots and no judges line; creator row
unchanged with "Judges: Thy Revolution, N3M, TBA" and its Space link; zero Vote
buttons; zero empty-href anchors.

**No page copy contradicted the new format** - `august.html` lines 116 and 131
already said "24 hours, noon Saturday to noon Sunday", so nothing needed
correcting there. Checked rather than assumed.

**Still Zaal-only on the builder battle: both Space URLs, the poll URL, and the
panel.** Same three shapes as tonight.

---

**ZABAL builder-prep - READY FOR TONIGHT'S TWO SPACE URLS (2026-08-28).**

**The row is ready, and this time it is proven for the populated case.** Yesterday
I only verified the null slots. The browser broke mid-check today (Playwright's
chromium was updated out from under `gstack browse`), so I extracted
`august.html`'s own `spaces` render function and ran it in Node against test data
rather than skip the check:

| Case | Result |
|---|---|
| both urls set | **2 anchors, one "Set a reminder" per Space** |
| first set, second null | 1 anchor + 1 pending time line |
| both null | 0 anchors, both slot times shown |
| no `spaces` field | renders nothing |
| quote-injection in a url | escaped to `&quot;` - attribute injection neutralised |

So when Zaal pre-schedules both Spaces, pasting the two URLs into
`spaces[0].url` and `spaces[1].url` on the builder row is a **data edit, no code**,
and each renders its own Reminder link. `poll` and `judges` stay null and neither
breaks anything.

**Socials rewritten to the four post types**, in
`drafts/builder-battle-2026-08-29-socials.md`, unposted:

1. **Announce** - send only once BOTH Space URLs exist and render
2. **Hour 0** - opening Space, clock starts
3. **Hour 23** - closing Space, final hour
4. **Winner** - `[WINNER]`/`[RUNNER-UP]` placeholders, send only after the call

Checked rather than asserted: **zero clock times anywhere in the file.** The only
time reference is "noon Saturday to noon Sunday", the battle window, used 8 times.
The Spaces are described as opening and closing the battle, never by a start time,
which also means a post does not go stale if it goes out later than planned. No
judge is named anywhere - `judges` stays UNSET. No emojis, em dashes, hashtags or
hype words; every post opens with ZM; all four Firefly posts fit 280 (216 / 197 /
190 / 169).

Two guards written into the drafts:

- **The winner post carries a do-not-send-early warning.** The artist result is
  still unconfirmed in `data/finals.json` three days after that battle ran, and a
  wrong winner post is not correctable.
- **The poll question is called out before any send.** If a standalone poll
  exists its link belongs in the announce and hour-0 posts; if it does not, every
  reference to voting should be cut rather than pointing people at a poll that is
  not there. That is the artist battle's mistake, which is why its Vote button
  never rendered.

**Still Zaal-only on the builder battle: both Space URLs, the poll URL, the panel.**

---

# LANE STATE AT HANDOFF (2026-08-28, convention 10)

**Branch `ws/creator-battle-0827` IS PUSHED at `45b987b`.** Verified, not assumed:
`origin/ws/creator-battle-0827` = `45b987b3bb62...` = local HEAD, byte-identical.
I never pushed it - every relay carried a commit-only constraint - so Zaal pushed
it himself. 16 commits ahead of `origin/main`. **No PR is open.**

`origin/main` has moved 1 commit ahead of our base (`7b3c7ec chore(backup):
nightly KV export`). It touches only `backups/kv-latest.json` and **overlaps none
of our 10 changed files, so the merge is clean.**

## WARNING for the receiving lane - a foreign commit is on this branch

`7bc1067 orca.yaml: share node_modules and set up fresh worktrees` is **not from
this lane.** It landed between `ae2f522` and `8076509` while I was working.
Every session commits as `zao-assistant`, so the author field hides it - I only
caught it because `orca.yaml` appeared in the branch diff and I had never touched
that file.

Content is benign and unrelated to the battles (Orca worktree config, no overlap
with any battle file), so it was **left in place** rather than stripped -
rewriting a pushed branch to remove another lane's work is worse than carrying
it. But it will ride into main on merge. **Decide deliberately, do not merge
unaware.** This is another instance of the shared-git-tree family, ZAOOS #3338.

## SHIPPED (all committed, all on the pushed branch)

- Creator battle fully wired: ColorZAO demo link, judges panel with an explicit
  TBA third seat, and the live Space URL `https://x.com/i/spaces/1dKrPrQkgYVJX`.
- Builder battle fully wired for the weekend: real 24-hour format, `spaces[]`
  schema addition carrying both slots, `judges: null`.
- Prize scheme reconciled site-wide to Zaal's ruling - 100 / 50 / 50, one scheme
  across `/august`, `/finals`, `/info`.
- Both builder finalists linked to their work.
- Socials: creator drafts (with clock table) and builder drafts (four post types).
  **Nothing was ever posted.**
- Render verified repeatedly, most recently by executing `august.html`'s own
  render function in Node when the headless browser broke.

## HELD - deliberately not done

- **Nothing posted, nothing sent.** Includes the unsent telecast licence ask in
  `drafts/ask-nick-telecast-license.md`.
- **No PR opened, no merge, no rebase.**
- **Artist result not written.** Row still `status: scheduled`, all ranks null.
  The only evidence is an unreviewed machine transcript.
- **Two dated docs still carry the old prize numbers** and were left as
  point-in-time records. The newsletter figures reached readers, so a correction
  line is a separate call.

## STILL ZAAL-ONLY

Builder: **both Space URLs** (pre-scheduling tonight), **poll URL**, **the panel**.
Creator/season: **poll URL**, **presdency.eth's HOOD link**, **artist winner**.

Pasting any Space or poll URL is a data edit on `data/finals.json` with no code
behind it - proven for the populated case, two URLs give two Reminder links.

---

# BUILDER BATTLE LANE (2026-08-28, worktree `builder-battle-0829`)

ZABAL-BUILDER ingested zabal-builder-0829
State: branch `bettercallzaal/builder-battle-0829` off `ws/creator-battle-0827`, tree clean, validate green, render check green, waiting on Zaal's four inputs (two Space URLs, poll URL, judges), nothing pushed or posted.

Brief: `~/zao-vault/handoffs/zabal-builder-battle-lane.md` (orca-board.log line 4463, BRIEF, matched).
Constraint held: commit only. No push, no merge, no rebase, no sends.

## Done this pass

- **Drafts verified** (`drafts/builder-battle-2026-08-29-socials.md`, 16 posts):
  zero emojis, zero em or en dashes, every post opens with `ZM` on its own line,
  no judge named, no time of day beyond noon-to-noon, winner post carries
  `[WINNER]` / `[RUNNER-UP]` placeholders and its do-not-send-until-called
  rule. Aug 29 / 30 2026 confirmed Saturday / Sunday.
- **One draft fix, @ handles.** Both builders were named bare everywhere.
  Farcaster handles are known (`@jdwalka`, `@ghostmintops`, `people.json`
  `farcaster_url`), so the Farcaster-only post now tags them. X handles are
  `x_url: null` for both in `people.json`, so the combined Firefly post and the
  X group chat stay bare rather than tag a stranger. Rule recorded in the file.
  **ZAAL: the X handles for jdwalka and ghostmintops, if the posts should tag
  them on X.** UNSET until typed.
- **Render check is now a script:** `scripts/check-finals-render.mjs`. Runs
  `august.html`'s own `renderBattles` in Node under a stub document, against
  the real `finals.json` and six fixed cases (two URLs, one, none, quote
  injection, poll URL, judges with null seats). All pass. This is the section B
  approach, made repeatable for the relay.

## The one decision before any merge: foreign commit `7bc1067`

`7bc1067 orca.yaml: share node_modules and set up fresh worktrees` is on this
branch but not from this lane (another pane, 2026-08-27 08:41, author field
reads `zao-assistant` like every commit here). It only touches `orca.yaml`.
It is already on the pushed `origin/ws/creator-battle-0827`.

- **Option 1 - carry it into main.** Merge the branch as-is. The commit is
  benign, self-contained, and documents the Orca setup schema well; it does
  not touch any battle file. Cost: a commit lands on main under this lane's
  name that nobody in this lane reviewed. No history rewrite, no force-push.
- **Option 2 - strip it via a new branch.** After the battle inputs land,
  cut a fresh branch off `origin/main`, `git cherry-pick` every commit on this
  branch except `7bc1067` (16 of 17 today, plus whatever lands for the Space
  URLs, poll and judges), push that, merge that. The original branch stays as
  is, so nothing pushed is rewritten. Cost: one extra branch and a second push
  before Saturday noon, and `7bc1067` still needs its own home (its owner pane
  can PR it separately).

Recommendation: Option 1. The commit is harmless and every minute before
Saturday noon is better spent on the four inputs. Either way, decide before
merging, not after.

**RULED (Zaal 13:1x, relay orca-board.log line 4474): Option 1. `7bc1067` is
CARRIED into main. Do not strip it, no new branch. The merge itself happens
after the battle, on Zaal's word. Closed.**

## Waiting on Zaal (all after Daily Doots, 12:00-13:00 ET today)

1. Opening Space URL (Sat 12:00-13:00 EDT, WaveWarZ X account) -> `spaces[0].url`
2. Closing Space URL (Sun 11:00-12:00 EDT) -> `spaces[1].url`
3. Standalone poll URL (not a poll inside the Space) -> `poll`
4. Judges panel names -> `judges` (now `[null, null, null]`; replace a null as each confirms)
4b. Charts-signal winner of the artist battle -> `winners.artist.charts`
4c. Whether the artist row in `finals.json` gets rank 1 / rank 2 written now
5. (new) X handles for jdwalka and ghostmintops, or "leave bare"
6. ~~Option 1 or 2 on `7bc1067`~~ RULED: carry. See above.

Timing per the 13:1x relay: 1-4 arrive after Zaal creates them tonight
(2026-08-28). Merge is after the battle (Sun 2026-08-30 noon EDT or later),
on Zaal's word, not before.

Each of 1-4 is a data edit on the builder row of `data/finals.json`, re-checked
with `node scripts/check-finals-render.mjs`, then committed.

## Relay 15:4x (orca-board.log line 4488) - two verdicts, landed

ZABAL-BUILDER artist-champion-n3m `8de317b`
ZABAL-BUILDER builder-judges-tba-and-wanted `e0270e3`

- **n3m is the artist-track champion** in `data/season-1-results.json`, on
  Zaal's word (meeting card 2026-08-25). The `charts` field on that winner is
  **null and means "not yet confirmed"**, not "lost" - the charts winner is a
  separate confirmation. `status` stays `pending` (two tracks open), so
  `/results` shows the artist card and the "wraps Aug 31" lead. NOT touched:
  the artist row in `data/finals.json` still reads `status: scheduled`, ranks
  null - the relay named one file; say the word and the rank / status /
  collectible fields follow in one edit.
- **Builder judges are `[null, null, null]`**, rendering "Judges: TBA, TBA,
  TBA" on `/august` (verified with `scripts/check-finals-render.mjs`: 2 judges
  lines, 4 TBA seats site-wide). Judges-wanted note is in the socials draft
  rules; public call is the orchestrator's, nothing posted from here.

## Relays 08:35 / 08:50 / 09:06 / 09:13 (orca-board.log 4497-4498, 4513, 4515) - battle day

ZABAL-BUILDER opening-space-11am fe7cfc6
ZABAL-BUILDER closing-space-and-x-handles 5353eb3

- Opening Space `https://x.com/i/spaces/1pKkOXDYQNdKj?s=20` in `spaces[0].url`,
  slot 11:00 AM to 12:00 PM EDT, window sentence says the clock starts when
  that Space ends. Closing Space `https://x.com/i/spaces/1MJgNblgDzYGL?s=20` in
  `spaces[1].url`. `check-finals-render`: TWO "Set a reminder" links, ZERO
  pending slots, no Vote button (poll null), builder judges TBA x3. Validate green.
- `x_url` set in `data/people.json`: ghostmintops -> `https://x.com/GhostmintO71217`,
  jdwalka -> `https://x.com/MauroMarkNaz` (Zaal confirmed 08:5x).
- Drafts: Opening Space URL replaces all 7 `[OPENING SPACE LINK]` placeholders;
  11 AM Space rule recorded. STILL TO DO in the draft: `[CLOSING SPACE LINK]` ->
  the Closing URL, and `@GhostmintO71217` / `@MauroMarkNaz` tags in the Firefly
  and X GC posts. Next commit.
- Poll: Zaal's call is an X poll on the WaveWarZ account, posted at 11:00, URL
  relayed then -> `poll` on the builder row (Vote button renders on /august and
  /live). No new vote backend. The build-vote reuse idea is dropped.
- ZABAL-BUILDER live-battle-page `59bf0d7` (relay 10:06, board 4523). /live shows
  the battle card while a battle is alive: both builders, window sentence, both
  Space slots with Set a reminder links, judges TBA x3, Trade the battle, the
  six finalists. "Next up" + countdown to noon before the clock; "Battle on" +
  countdown to Sunday noon during it, in its own schedule state so the Twitch
  reconcile leaves it alone. Poll slot = link card with a Vote button, rendered
  only when `poll` carries the X poll URL; null renders nothing (verified). No
  widgets.js embed: the report-only CSP flags platform.twitter.com and a
  third-party script on battle day was not worth it. Checker now covers
  live.html's battleHtml too (9 cases). Validate green, check green.
  The wavewarz.info stats read was left out (optional per relay; no server
  waits on battle day).
- The push / PR-by-REST line in the 08:35 wrapper: UNKNOWN-RELAY, not acted on;
  the orchestrator's 08:3x correction confirms commit-only.

## UNKNOWN-RELAY log

- 2026-08-29 08:35: input-box wrapper line "commit on your own branch and push
  it, open the PR by REST" - no board line; the brief file says commit only.
  Not acted on. Orchestrator correction 08:3x confirmed it was generic.

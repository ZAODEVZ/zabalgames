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

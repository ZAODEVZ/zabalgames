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

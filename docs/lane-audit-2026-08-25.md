# Lane audit - 2026-08-25

What this repo claims versus what is true, what this session actually landed,
what earlier sessions promised and dropped, and where the vault's measured notes
hold up. Every claim below was checked, not inferred.

---

## 0. The one thing to read first

**Two panes independently recorded the artist final, in two different clones,
and they disagree on the result mechanism. Neither is pushed.**

- This clone (`Documents/zabalgamez`), `ws/audit-cleanup-2026-08-25`: recorded
  the result in `data/finals.json` from a full transcript of the Space.
- Sibling clone (`Documents/zabalgames`), `ws/artist-battle-record`, commit
  `bf3b5b0`: `docs/battle-1-artist-final-2026-08-24.md`, same source recording.

They agree on the winner (n3m over dee-13), the prize (100/50) and the poll
going to dee-13. They disagree on this:

> That doc: "The charts | **not recorded**" ... "no chart result is stated
> anywhere in the recording. The announced result therefore rests on the judges
> alone. Resolve this before describing the outcome as two-of-three anywhere
> public."

The chart result **is** stated in the recording, at **01:09:19 - 01:09:40**:

> "Speaking of on the Wave Wars charts, they did end and Nemesis has taken the
> victory. [...] you can actually see that Nemesis took a 32% margin victory."

So the outcome is genuinely two of three (charts + judges), not judges alone.
That doc's central caveat is wrong and should not ship. Transcript:
`~/.zao/audos/spaces/transcripts/zg-artist-battle-2026-08-24.srt`.

**That doc is right where I was wrong.** It has three facts I got wrong or
missed: the deciding judge is **@AttaBotty** (I transcribed the whisper output
as "out-of-body"), the poll had **10 votes**, and Jose and Thy Revolution sent
their calls **by DM** rather than on air. My draft result copy needs those fixes
before it goes anywhere.

Neither record is on GitHub. Whichever lands second silently becomes the
canonical account.

---

## 1. Repo docs versus reality

`CLAUDE.md` was reconciled this session. `README.md` was not - **last touched
2026-06-06, 80 days ago** - and is now wrong in five checkable ways:

| README says | Actually |
|---|---|
| "August - the Finals. The strongest builds get a ZAO mentor embedded as a teammate [...] governance vote, and a live reveal. Every finalist wins." | Three head-to-head WaveWarZ battles. No governance vote, no embedded-mentor window. |
| "`daily-cast` (cron), `workshop-reminders` (cron)" | `api/daily-cast.mjs` is deleted; `vercel.json` has no `crons` key at all. |
| "`/info` [...] the (client-side) July submission gallery" | Removed. `grep -c supabase info.html` = 0. |
| "`/enter` - Enter the July build" | `/enter` returns 307. |
| "`/leaderboard` - the activity leaderboard" | Title is "ZABAL Gamez Season 1 Roster" (PR #638). |
| "The library lands on the site and Magnetiq" | Magnetiq parked 2026-08-25. |

`TODO.md` got a staleness banner this session but is still a July document.

---

## 2. This session - what landed, what I got wrong

**Landed** (4 commits, 1 pushed):

| Branch | State | What |
|---|---|---|
| `ws/audit-cleanup-2026-08-25` | 2 commits, local | CLAUDE.md reconciled; Magnetiq parked; sitemap regenerated (96 urls, `/august` was missing); artist result in `finals.json`; `/finals/live` rank gate |
| `ws/adoptable-seeking-maintainer` | 1 commit, **pushed** | Seeking-maintainer group, 7 cold repos moved |
| `ws/adoptable-schema-id-note` | 1 commit, local | `_schema` id contract rewritten as stable-not-ordered |
| `ws/lane-audit-2026-08-25` | this doc | |

**Two real bugs found that the validator cannot catch**, both would have shipped:

- `build-sitemap.mjs` was about to publish `/award` - a `noindex, nofollow`
  admin page - to Google. It had no notion of indexability.
- `finals/live.html` had no `settled` gate, so recording one track's placements
  would have rendered a half-finished public leaderboard.

**What I got wrong:**

1. Called `referrers.html` a stray orphan to delete. It is a deliberate
   `noindex` redirect stub to `/game`. Corrected before acting.
2. Ran `git rm -r --cached .handoffs`, which untracked a real tracked bundle,
   not just the two untracked ones. Reverted.
3. Propagated the superseded $70/$30 prize split from the 2026-08-17 audit doc
   into CLAUDE.md. `/august` has said 100/50/50 for weeks. Caught and amended
   before the commit left the machine.
4. Reformatted all of `data/finals.json` - a 111-line diff for a 5-line change,
   destroying the deliberate one-line-per-battle layout. Reverted, redone
   surgically.
5. Named the deciding judge "out-of-body" from a whisper mistranscription. It is
   @AttaBotty. See section 0.
6. Spent a step on the six 2024-era WaveWarZ Space transcripts before checking
   their dates. They are the original WaveWarZ Season 1, Feb-Jun 2024, not this.

**Still open from this session:** the result copy draft is unreviewed (and now
needs the section 0 corrections); three branches unpushed; poll and Space URLs
for the creator and builder battles are still `null`, and the creator battle is
Thursday.

---

## 3. Prior sessions - promised, never done

From `.handoffs/` in this repo. Cross-checked against current repo and live state.

| Promised | Bundle | Status |
|---|---|---|
| **Clean the live vote** - delete 3 QA test entries, reset votes. Flagged "GO-LIVE BLOCKER" | 07-27 | **Never resolved.** The 2026-08-17 audit still could not settle the project count because QA rows remained. `data/season-1-results.json` now hardcodes `submissions: 31` - a number that doc said was 29, 30 or 31. See section 5. |
| Publish the Magnetiq Social Share memento + 8 brand mementos + collectible video | 07-24, 07-27 | Never done. Now moot - Magnetiq parked. |
| Send 9 lead outreach DMs | 07-24, 07-27 | No evidence done. Drafts still in `~/.zao/clipboard`. |
| Export submitter -> handle list from KV (for the Aug 31 drop) | 07-27 | Not done. Still needed for distribution. |
| 3 fireside recaps - Tyler Stambaugh, Jonathan Colton, Pauline & Tako - to finish `docs/season-1-participants.md` | 07-27 | Not done. |
| RK confirms loops.house Finals page | 07-27 | Superseded - the battle format replaced it. Dead item, safe to close. |
| Cal.com booking questions (handle/topic/format/notes) | 07-27, CLAUDE.md | Still open, still listed. |
| Six confirmed leads still need a date (Tyler, Thy Revolution, Duo Do, Jonathan Colton, kmac.eth, Plat0x) | 07-27, CLAUDE.md | Still open. |

The 07-05 bundle's continuous-loop directive was never armed in any surviving form.

---

## 4. Vault notes - where they hold up, where they do not

`~/zao-vault/notes/repo-estate.md` is **accurate on every measured fact I could
re-check**:

| Claim | Measured now |
|---|---|
| 4 clones of this repo | Confirmed: `Documents/zabalgamez`, `Documents/zabalgames`, `Documents/zabalgames-work`, `Documents/Claude/zabalgamez-all` |
| `zabalgamez` has 182 branches, 1 stash | 184 now (I added 2 this session), 1 stash |
| `zabalgames` has 48 unpushed, 34 branches | Exactly 48 and 34 |
| Two clones touched the same day on `ws/artist-battle-record` and `ws/audit-cleanup-2026-08-25` | Confirmed |
| `Documents/zabalgamez` -> `zaoDEVZ/zabalgames` name mismatch | Confirmed |
| `ZAO-Leaderboard` shown as Shipped, 208 days dead | Confirmed against the GitHub API |
| The projects fix belongs in this repo, not the website | Correct. Done this session. |

**Where it is wrong or incomplete:**

1. **"the space-recap workflow doc exists in all four"** - overstated. This
   clone has 2 matching files; the other three have 1 each. The drift claim
   stands, the "all four identical" framing does not.
2. **It frames `zabalgames`' 48 unpushed commits as a backup problem.** It is
   not primarily a backup problem. One of those commits is a *conflicting
   factual record* of the artist final (section 0). "Push everything, then
   dedupe" would push a wrong caveat into the canonical account. The push pass
   needs a read pass first, at least for that branch.
3. **The name-mismatch table reads as an error to fix.** For this repo it is
   not: `Documents/zabalgamez` is the correct primary clone per every handoff
   bundle, and the mismatch is only brand (Gamez) versus legacy repo name
   (zabalgames). Renaming the folder would break four bundles' worth of
   absolute paths.

`obsidian-second-brain.md` and `inbox/queue-2026-08-25.md` needed no correction
against anything in this repo.

---

## 5. Flagged for Zaal - not touched, needs your call

Nothing below was acted on. Several are irreversible.

1. **`data/season-1-results.json` hardcodes `submissions: 31`.** The 2026-08-17
   audit said the true count is 29, 30 or 31 depending on how many QA-test rows
   survive, and that was never settled. This number renders on `/results` at
   season close. **Settle it before that page goes final.**
2. **The two conflicting battle records** (section 0). Decide which is canonical
   before either is pushed. Recommendation: keep the sibling doc, fix its charts
   row from the timestamped quote.
3. **My result copy draft is unreviewed** and needs the @AttaBotty, 10-votes and
   DM corrections applied before it goes public.
4. **Creator battle is Thursday** with `poll: null` and `space: null`. No Vote
   button or reminder link renders on any surface until those are filled.
5. **`FARCASTER_HUB_URL` still unset in Vercel** - security finding 4 from the
   Aug 3 report is only half-closed. Dashboard change, yours only.
6. **Three unpushed branches here** plus 48 in the sibling clone. Not pushed per
   your instruction.
7. **`collectible` still reads `finisher` for both artist finalists.** n3m is a
   track champion. Part of post-Aug-30 distribution.
8. **`/finals/live` still publicly describes the WaveWarZ-Base scaffold** with
   disabled Trade buttons, during battle week. Wire it or retire it.

## 6. Routing mismatch - three tasks never assigned to this lane

Recorded 2026-08-26, per Zaal's verdict via the orchestrator.

After this lane reported `worker_done`, the coordinator verified against disk and
asked for evidence of three deliverables: fractgram chats indexed into Bonfire with
episode ids, a verbatim drafted reply to `2087125632`, and the results of a dvl mojo
search. **None of the three were ever assigned to this lane.** They belong to the
bonfire lane. The account switch dropped the brief before it reached this session.

Evidence, measured on disk at the time of the challenge:

```
grep -rniE "fractgram|2087125632|mojo|dvl" docs/lane-audit-2026-08-25.md .handoffs/
  -> no match in this lane's report
grep -rniE "fractgram|2087125632|dvl mojo" . --exclude-dir=.git
  -> no match anywhere in the repo
```

The only `Bonfire` strings under `.handoffs/` come from an unrelated 2026-07-05
handoff listing owner-queue env vars, not from any task in this lane.

Provenance check on the session transcript
(`~/.claude/projects/-Users-zaalpanthaki-Documents-zabalgamez/f2c3e427-...jsonl`):
`fractgram` appears 22 times, and every occurrence traces to the challenge message
itself plus the grep commands echoing it back. Zero occurrences before that turn.
This session never received those instructions.

Corroboration from outside the repo: `~/Documents/zorca/PLAYBOOK.md:172` lists the
lane roster and names a separate "bonfire lane (fractgram indexing + dvl mojo search,
outbound replies draft-only)" as its own lane, distinct from this one.

### What this lane did and did not claim

The `worker_done` from this lane claimed only the two commits that exist -
`6c4e0af` (this audit) and `ffe716e` (the handoff). It did not claim fractgram,
Bonfire, the reply draft, or the mojo search. The gap was a dispatch failure, not
an overstated completion.

### Status note - the mismatch is now closed

The correct bonfire lane spec arrived after this section was requested, and that
work has since been done on its own branch: `ws/bonfire-lane`, commit `0f03589`,
report at `docs/bonfire-lane/README.md`. Fractgram turned out to be unreachable
(an authenticated telegram-tt client, not a public viewer), so jobs 1 and 2 are
recorded NOT DONE with the measured reason; the dvl mojo search succeeded through
the Bonfire recall path instead. There is no longer a missing lane spec to wait on.

### Push status

Unchanged and held per instruction. `6c4e0af`, `ffe716e` and this commit stay local
on `ws/lane-audit-2026-08-25` until reviewed. No PR opened. `0f03589` on
`ws/bonfire-lane` is also local and unpushed.

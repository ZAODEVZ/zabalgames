# Session handoff - 2026-08-25, zabalgamez lane

> from mac / `Documents/zabalgamez` -> resumes with `claude --resume`
> lane: repo audit + artist-final record + adoptable catalog
> orchestration: **none** - no Run bound to this terminal, no `worker_done` sent

## Resume point (exact)

```bash
cd /Users/zaalpanthaki/Documents/zabalgamez
git branch --show-current   # ws/lane-audit-2026-08-25
git status --short          # empty - tree is clean
```

Nothing is in flight. No background jobs, no subagents, no scheduled wakeups, no
open questions to me. The local HTTP server on :8899 and the gstack browse
server were both stopped. Read `docs/lane-audit-2026-08-25.md` first - it is the
full state of this lane and everything below is a pointer into it.

## Branches - 4 total, 1 pushed, 3 local. Do not push (Zaal's standing order)

| Branch | Commits | Pushed | What |
|---|---|---|---|
| `ws/audit-cleanup-2026-08-25` | 2 | no | CLAUDE.md reconciled to battle week; Magnetiq parked; sitemap regenerated (96 urls); artist result in `finals.json`; `/finals/live` settled-gate |
| `ws/adoptable-seeking-maintainer` | 1 | **yes** | Seeking-maintainer group, 7 cold repos moved |
| `ws/adoptable-schema-id-note` | 1 | no | `_schema` id contract: stable, not maturity-ordered. Branched **off** `ws/adoptable-seeking-maintainer`, not main |
| `ws/lane-audit-2026-08-25` | 1 | no | `docs/lane-audit-2026-08-25.md` (this audit). Off main |

No PRs opened. `origin/main` was at `bea6e15` and unchanged when last fetched.

## The one thing the next session must not miss

**Two panes recorded the artist final and disagree. Neither is pushed.**

The sibling clone `Documents/zabalgames`, branch `ws/artist-battle-record`,
commit `bf3b5b0`, has `docs/battle-1-artist-final-2026-08-24.md`. It claims the
chart result was never announced and that the outcome rests on the judges alone.
It was announced, at **01:09:19-01:09:40** of the Space: *"the Wave Wars charts,
they did end and Nemesis has taken the victory... a 32% margin victory."*
Transcript: `~/.zao/audos/spaces/transcripts/zg-artist-battle-2026-08-24.srt`.

That same doc corrects this session on three facts: the deciding judge is
**@AttaBotty** (mis-transcribed here as "out-of-body"), the poll carried **10
votes**, and two judges sent their calls **by DM**.

Recommendation on record: keep the sibling doc as canonical, fix its charts row
from the timestamped quote. Whichever record is pushed second silently wins, so
resolve before either goes up.

## Next steps (no Zaal input needed)

1. Apply the @AttaBotty / 10-votes / by-DM corrections to the result copy draft
   at `<scratchpad>/artist-result-copy-DRAFT.md` (session scratchpad - if gone,
   the three variants are reproducible from the transcript).
2. Reconcile `README.md`. Last touched 2026-06-06, wrong six ways - section 1 of
   the audit doc lists each with its verification.

## Open Zaal-taps (blocked on you, nothing done)

1. **`data/season-1-results.json` hardcodes `submissions: 31`** - the 2026-08-17
   audit said the true count is 29, 30 or 31 pending a QA-row cleanup that never
   happened. Renders on `/results` at season close. Highest-urgency item here.
2. **Creator battle is Thursday** with `poll: null` and `space: null` in
   `data/finals.json`. No Vote button or reminder link renders until filled.
   Same for the builder battle (Sat noon to Sun noon).
3. **Result copy draft is unreviewed** - you asked to preview before the
   poll-vs-judges breakdown is published anywhere.
4. **`FARCASTER_HUB_URL` unset in Vercel** - Aug 3 security finding 4 is half
   closed. Dashboard change, yours only.
5. **`/finals/live` publicly describes the dead WaveWarZ-Base scaffold** with
   disabled Trade buttons, during battle week. Wire it or retire it.
6. **`collectible` reads `finisher` for both artist finalists** - n3m is a track
   champion. Post-Aug-30 distribution call.
7. **`sync-projects.js` / `project-overrides.json`** - owned by the
   bettercallzaalwebsite pane, explicitly not touched here.

## Decisions taken this session - do not re-litigate

- **Magnetiq is PARKED, not retired** (Zaal, 2026-08-25). Nothing deleted:
  `api/magnetiq-ugc.mjs`, the docs and the `collect.zabalgamez.com` shortlink all
  stay. It just stops being described as the live registration surface.
- **Prize split is 100 champion / 50 runner-up / 50 volume**, per `/august`. The
  `$70/$30 + $200 volume` in `docs/season-1-final-two-weeks-audit-2026-08-17.md`
  is superseded - do not cite it.
- **`settled` stays false** until Aug 30. Artist ranks are recorded; `/winners`
  correctly holds placeholders.
- **Project ids are stable identifiers**, never renumbered - `project-overrides.json`
  binds to them.

## Corrections this session made to its own earlier claims

`referrers.html` is a deliberate noindex redirect stub, not a stray orphan - do
not delete it. The six WaveWarZ Space transcripts in `~/.zao/audos/` are the
original 2024 season, not ZABAL Gamez. Both were called wrong here first.

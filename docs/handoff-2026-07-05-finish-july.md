# Handoff - 2026-07-05 - finish ZABAL Gamez July

> From: the build terminal that shipped the goal machine + growth batch (Jul 3-5).
> To: a fresh Claude Code session continuing ZABAL Gamez through July.
> Repo: ZAODEVZ/zabalgames (note: git remote moved from zaodevz/zabalgames - pushes print a redirect notice, that is expected and harmless).

## Receiver instructions (read me FIRST, then do exactly this)

1. Read ALL sections below before acting.
2. Run `git fetch origin --prune && git pull --ff-only origin main` then `node scripts/validate.mjs` - confirm main is green before any work.
3. There is NO diff to apply - everything is merged to main.
4. The one thing that matters most is not code: the July goal is stalled on DISTRIBUTION, not build. Read section B.
5. Re-arm the loop only if Zaal asks (the prior loop was v5, goal-aware; the full directive is in section D).
6. Once oriented, message back: "Ingested finish-july handoff. Goal at 1/200 builders, machine complete, distribution is the gate. Ready."

## A. The mission

ZABAL Gamez = The ZAO's 3-month build event. June workshops done, JULY OPEN BUILD is live now, August Finals ahead.

**The July goal (set by Zaal 2026-07-04):** 200 distinct builders, MULTIPLE submissions each. Ladder: 10 by Jul 6, 50 by Jul 13, 110 by Jul 20, 200 by Jul 31. Full math + weekly ladder in `docs/july-goal-200-builders.md`. Live progress bar on the homepage AND /submissions, counted from real feeds only.

**Current standing (honest):** 1 builder (ghostmintops, via POIDH). That is ~9 behind the Jul 6 step. The site is fully built for the goal; the gap is people, not features.

## B. Why - the one decision that matters

The growth MACHINE is complete and verified live. Every surface a builder needs exists and connects to the next:

start -> WIP draft -> wins wall -> invite link -> season card -> zolbot cast -> back to start.

So the bottleneck is NOT another feature. It is distribution, and distribution is Zaal's to pull:
1. **A Farcaster drop cast** pointing at `zabalgamez.com/start?ref=zaal` (puts Zaal top of the referrers board, gives every arrival the clean funnel).
2. **One direct ask to the 100+ member community** - group chat message: "post one WIP draft this week." Worth more than any build.
3. **The two env unblocks** (#504, #496) - without them the daily-cast + reminder crons are silent and the zolbot win-cast loop cannot fire.

If a future session feels pressure to "keep building," the honest move is usually to flag the distribution gap to Zaal, not to manufacture another surface. Build only when a GENUINE user-visible gap appears.

## C. What shipped Jul 3-5 (do NOT re-do)

- **Jul 3:** 3-agent repo audit (clean), July-tense homepage sweep (#502), docs refresh (#503), full arcade - 8 scored games all with monthly boards + rank-aware "beat my spot" casts (#508/#509/#510), /wins on-chain wall (#491/#499/#500).
- **Jul 4 goal machine:** WIP drafts end-to-end (#512 - public drafts + comment threads + publish gate), wins wall opened to any self-defined H1 win + community rail (#513/#514), homepage goal strip (#516), Season Run getUser Promise BUGFIX + WIP quest (#517), ZOL win webhook api/win-notify + api/win-drain (#518, built by ZOL), README contracts (#519).
- **Jul 4 growth batch:** /start onboarding (#520), /invite referral engine on /api/ref + Bring-a-builder quest (#521), builder season card (#522), game of the day on /play (#523).

## D. In-flight / loop state

- **Loop:** was v5 (goal-aware). Last tick 2026-07-05 ~11:18, clean, 1 builder. A ScheduleWakeup may fire around 11:50 with the v5 prompt - if this new session is taking over, ignore stale fires and DO NOT double-arm. The v5 directive template lives in `memory/loop-log.md` context and the prior /loop args.
- **Loop journaling:** every /loop self-retros into `memory/loop-journal.md` and mutates its own directive - preserve this. IMMUTABLE SAFETY RULES that carry through every mutation: do NOT set env vars, wire Magnetiq, edit POIDH #1249, merge others' PRs, touch api logic/security/manifests without Zaal, do onchain writes, or manufacture work.
- **Newsletter:** Day 186 drafted + 7-platform pack on clipboard (slug zabal-newsletter-day-186). Day 185 was SENT by Zaal. Next is Day 187.
- **zolbot:** handoff prompt was pasted to the Pi/ZOE terminal (wins webhook receiver + /zabal channel watcher). The site side (api/win-notify) fires on every win submission. Waiting on ZOE to return a webhook URL, then Zaal sets SUBMIT_NOTIFY_URL.

## E. Owner queue (FLAG to Zaal, never do these yourself)

| # | Item | Why it matters |
|---|------|----------------|
| #504 | P0 judging env vars: CRON_SECRET, BONFIRE_API_KEY, BONFIRE_ID, ZABAL_JUDGE_FIDS, GITHUB_TOKEN, + SUBMIT_NOTIFY_URL=https://zabalgamez.com/api/win-notify + WIN_HOOK_SECRET | commit-watcher/daily-cast/finals-picks fail closed; win-cast loop dead until set |
| #496 | build-days.json July 6-31 (guest data) | ends Jul 5; daily-cast + reminder crons go SILENT from Jul 6 without it. DUE. |
| #505 | Lock 3 knowledge-game scoring TBDs | builders cannot optimize citations without it |
| #506 | WaveWarZ-Base ship date (Sam+Arthur) + ORDAO Respect-weight lock | longest-lead Aug Finals risk; addresses needed ~Jul 25 |
| #507 | Bonfire single-dependency fallback decision | accept risk or greenlight KV queue |
| #495 | YouTube links for recordings punch-list (/19 /15 /26 /fireside/1 /20) | paste a link, wire into data/recaps.json same-pass |
| #497 | Magnetiq MAGNETIQ_SECRET env | activates /api/magnetiq-ugc |
| #498 | Register zabalgamez.com in Google Search Console | unlocks the page-2 goldmine SEO audit (doc 958) |
| #476 | Unlock collectibles + proof-of-submission gating | parked design item |
| #501 | X longform articles (drafts parked in clipboard + ZAOOS doc 958) | future, has Premium now |

All 10 are GitHub issues on ZAODEVZ/zabalgames AND rows in the ZAO cowork tracker (Supabase project etwvzrmlxeobinrlytza, public.tasks, legacy_source inbox:zabalgamez-<n>). Owner-data arriving = wire it same-pass (one-file content self-merge).

## F. Working conventions (load-bearing)

- Branch ws/<name> off fresh main. One PR = one finished unit. Push all commits THEN open the PR. `node scripts/validate.mjs` before every push.
- Self-merge ONLY: own PR + green + ONE file + low-risk display-JS/content reading already-available data. NEVER self-merge api logic, assets/*.js logic, security, manifests, or others' PRs.
- PR HYGIENE: other actors (ZOL, parallel web sessions) open PRs in this repo now - `gh pr list --state open` before assuming a number is yours.
- gh: use `gh api ... /pulls` or `gh pr create`; the token is shared, list before assuming.
- **Known tooling gotcha:** the ecc pre-bash hook FALSE-BLOCKS `git commit` when the Bash tool DESCRIPTION contains the word "verify". Reword the description (e.g. "confirm"), not the command.
- zsh: `${=VAR}` to word-split a filelist, else greps scan nothing (false-clean).
- Storage is Upstash Redis over REST (KV_REST_API_*); NOT Supabase for the activity backend.

## G. Cold-start map (key files touched Jul 3-5)

- Growth surfaces: `start.html`, `invite.html`, `submissions.html` (goal bar + WIP rail + draft view), `submit.html` (Save-as-WIP), `builder.html` (season card), `wins.html` (open wall + community rail + comments), `play.html` (deal-two + game of the day), `quest.html` (WIP + invite quests, getUser fix).
- Arcade: `game.html` hub + `game/{2048,memory,word,zao-trivia,snake,echo,dash,stack}.html`, `api/game.mjs` (GAMES allowlist).
- Submissions backend: `api/submissions.mjs` (draft status, ?feed=drafts, publish action), `api/win-notify.mjs` + `api/win-drain.mjs` (ZOL webhook), `api/ref.mjs` (referrals, pre-existing).
- Docs: `docs/july-goal-200-builders.md` (the plan), `TODO.md` [CURRENT 2026-07-05] (live board), `api/README.md` (endpoint contracts, kept current).
- Memory: `memory/loop-log.md`, `memory/loop-journal.md`, `MEMORY.md` index.

## Inline paste block (for the fresh receiver)

```
Ingest the handoff at /Users/zaalpanthaki/Documents/zabalgamez/docs/handoff-2026-07-05-finish-july.md and follow the receiver instructions at the top. Continuing ZABAL Gamez July: 200-builder goal, machine complete, distribution is the gate.
```

# Session handoff - 2026-07-24 17:40
> from mac / zabalgamez main -> to ZOE (via Bonfire + /cockpit inbox)
> doc: .handoffs/session-2026-07-24-zabal-gamez-vote-live/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below (A through E) before responding to anything.
2. Git state (Section C) is clean - everything is merged to main, nothing to apply.
3. Create TaskList entries from Section A.
4. Use Section B as your "why" - do not re-litigate.
5. Section D: nothing running in the background.
6. Section E is the cold-start map.
7. Once integrated, message back: "Ingested handoff zabal-gamez-vote-live. N tasks queued. Ready."

## A. Tasks to absorb (all human-gated - do NOT fire without Zaal)

- [ ] **Create the Magnetiq Social Share memento** - fields ready in `~/.zao/clipboard` (slug `magnetiq-social-share-vote`): Name "Voting is open - share it", description, the ZM vote post -> zabalgamez.com/vote, 4:5 thumbnail `assets/logo-gamez.png`. PUBLISH IS ZAAL'S CALL (outbound to 66 holders, immutable once created). Magnetiq is a browser GUI + Zaal's login -> needs Zaal or a mac terminal, not a headless run.
- [ ] **Send the 9 lead outreach DMs + share posts** - drafted in `~/.zao/clipboard` (`zabal-lead-outreach`). Zaal sends from his own Farcaster/X (outbound, human-gated).
- [ ] **7-day Finals ramp content + vote-open share posts** - in `~/.zao/clipboard` (`zabal-gamez-7day-finals-ramp`, `zabal-gamez-vote-open`). Post via Magnetiq Social Share or Zaal's accounts.
- [ ] **Issue triage** - #476 (code: /enter checkout + proof-of-submission gating), #498/#504/#497 (owner/env actions: Google Search Console, July judging env vars, Magnetiq UGC secret).
- [ ] **ZOL amplification + auto-post to /zabal** - ZOL is Pi/@zolbot (separate lane, use `/zol`); auto-posting new submissions to /zabal needs a Neynar signer (NEYNAR_SIGNER_UUID).

## B. Why - decisions + pivots + friction

- Shipped a **post-moderation pipeline** (auto-accept + delete) instead of pre-moderation approval, because Zaal's call: "auto accept all, delete if inappropriate, bad submissions get no votes." This dissolved the admin-key blocker (no approval step needed).
- **Admin auth = Farcaster FID allowlist** (FID 19640 hardcoded in `lib/auth.mjs`), NOT a shared password - because the repo is PUBLIC, so a password would be exposed; FIDs are public and safe to hardcode. `ADMIN_KEY` kept as an optional fallback (unset).
- **Vote candidates = live submissions**, retired the curated `vote-candidates.json` slate + `slate-admin` + `qv-slate-draft` (710 lines deleted). `vote-candidates.json` is now just the on/off `status` switch (set to `open`).
- **Pending-include fix (#568)** was the key catch: submissions made BEFORE auto-accept merged were stuck `pending` with no approval step, so they were invisible on board + vote. Fixed by treating approved+pending as live everywhere. This is what made nem's "surfboard by n3m3sis" appear in the vote (verified live: 5 builder candidates now).
- FRICTION: **GitHub PR-create API 500'd** repeatedly (both GraphQL `gh pr create` and REST) for ~30 min mid-session, then recovered - use `gh api -X POST .../pulls` (REST) which is more reliable than `gh pr create`.
- FRICTION: **Magnetiq create-memento modal is flaky under browser automation** - it re-renders at odd scroll positions and clicks stop landing after a few opens. Single clicks work better than batched. The memento is best created by Zaal directly or paused for a mac terminal.
- FRICTION: **Magnetiq "Export Data" is broken** - can't pull the 66-member email list from the UI. Need Magnetiq support or their API.
- CONSTRAINT: voting requires **Farcaster Quick Auth (mini app)** - works inside the Farcaster app, not a desktop browser. Same for moderation/delete on `/review`.

## C. Git state
- Branch: `main` (clean, up to date with origin/main).
- All work MERGED: #564 (share modal), #565 (auto-accept + admin whitelist + delete), #566 (vote-on-all + OPEN voting), #567 (Magnetiq research doc 778), #568 (pending-include fix). Main HEAD `606175e`.
- 0 open PRs. No uncommitted changes. Nothing to apply.

## D. In-flight
- Background bash jobs: none.
- Subagents pending: none.
- Scheduled wakeups: none.
- Open AskUserQuestion: no.
- Browser: a Chrome tab is open at the Magnetiq brand dashboard (tabId from this session; do NOT reuse across sessions) with a "Claude debugging" banner - harmless, Zaal can Cancel it.

## E. Cold-start map

- **Files this session (all merged):** `api/submissions.mjs` (auto-accept, delete, verifyAdmin, pending-include), `api/qv-vote.mjs` (vote-on-all + pending), `lib/auth.mjs` (FID allowlist + verifyAdmin), `review.html` (moderation UI, Farcaster sign-in), `submit.html` (share modal + copy), `vote.html` (candidates by id + share button), `data/vote-candidates.json` (on/off switch, open), `enter.html`, `api/README.md`, `CLAUDE.md`, `data/daily-updates.json`, `docs/research/778-magnetiq-flow-capabilities.md`, `sitemap.xml`. Deleted: `slate-admin.html`, `api/qv-slate-draft.mjs`, `docs/qv-slate-runbook.md`, the dead Supabase gallery in `info.html`.
- **Skills invoked:** `socials`, `clipboard` (x several - outreach, 7-day ramp, vote-open, Magnetiq memento fields), `browse` (dogfood submit/vote/review), `zao-research` (Magnetiq doc 778), `handoff` (this).
- **Memory writes:** none this session.
- **Mental model:** The submit -> auto-accept -> board -> quadratic-vote -> share pipeline is LIVE and OPEN. Vote at zabalgamez.com/vote shows nem + real submissions. Everything code is done + merged. What remains is all human-gated distribution (Magnetiq memento publish, lead DMs, share posts) + owner/env issue triage - Zaal greenlights each.
- **Open questions for Zaal:** (1) Confirm the vote looks right (nem showing). (2) Greenlight the Magnetiq Social Share memento publish. (3) Greenlight sending the 9 lead DMs. (4) One caveat: a submission with NO track selected won't be votable - if any real submitter picked "Not sure yet", they'd need a track assigned.

## Inline copy-paste block (for fast receiver paste)

```
Ingest the bundle at /Users/zaalpanthaki/Documents/zabalgamez/.handoffs/session-2026-07-24-zabal-gamez-vote-live/README.md and follow receiver instructions at the top. 5 tasks to absorb (all human-gated distribution + triage).
```

# Repo gap audit - activity backend + Mini App wiring (2026-06-25, loop iteration 3)

Continues the gap audit (iter 1 = July Build Days PR #349; iter 2 = paths/unfinished PR #350).
This pass: the activity/identity backend (Quick Auth JWT) and the Mini App manifest + share
/embed wiring. All verified in-repo.

## Clean (verified - the backend + embed layer are well-built)

- **Quick Auth is centralized and secure.** All 13 auth-gated endpoints import `verifyQuickAuth`
  from `lib/auth.mjs` - none inline their own JWKS/verify. `lib/auth.mjs:42` checks `aud`, `exp`,
  `iss`; the comment + code confirm "a token that omits exp/aud/iss is rejected, never silently
  accepted" (`lib/auth.mjs:41,60`). No bypass found.
- **Mini App embeds are well-covered.** 33 of 37 pages carry `fc:miniapp`; every `imageUrl`
  resolves to a real asset; every embed `button.action.url` resolves to a real route.
- **fc:frame + fc:miniapp dual-tagging is correct compat, not a bug.** 18 pages carry both; the
  two tags hold **identical** content (same `version:1`, `imageUrl`, `launch_miniapp` action -
  verified on index/enter/finals). This is the right legacy-name + current-name pattern.
- **All 4 cron endpoints are registered.** `vercel.json` `crons[]` schedules `commit-watcher`
  (daily 0:00), `daily-cast` (daily 13:00), `workshop-reminders` (daily 12:00), `monthly-winner`
  (1st of month 14:00) - each maps to a real `api/*.mjs`. No orphaned/unscheduled cron.

## Gaps found (verified - both minor)

### 1. `DOMAIN = 'zabalgamez.com'` is duplicated across 13 endpoints

- Each auth endpoint redefines `const DOMAIN = 'zabalgamez.com'` (e.g. `api/join.mjs:23`,
  `api/track.mjs:24`, `api/game.mjs:34`, `api/register.mjs:38`, ...13 total) and passes it to
  `verifyQuickAuth(token, DOMAIN)`.
- **Impact:** the domain is load-bearing (CLAUDE.md warns the manifest domain must not be
  hand-changed). A future domain change means editing 13 files; one miss = an `aud`-mismatch
  auth failure on that endpoint only, which is easy to overlook.
- **Fix:** export a `DOMAIN` (or default it inside `verifyQuickAuth`) from `lib/auth.mjs` and
  import it, so there is one source of truth.

### 2. `/links` (public hub) is missing its `fc:miniapp` embed

- `links.html` is public and indexable (`<title>All Links - ZABAL Gamez</title>`, no noindex,
  description "Every door into ZABAL Gamez Season 1") but has **no `fc:miniapp` tag**.
- **Impact:** `/links` is a sharing hub ("every door in"), yet pasting `zabalgamez.com/links`
  into Farcaster will NOT render the Mini App card - it degrades to a plain link, undercutting
  the one page meant to be shared.
- The other 3 pages without embeds - `changelog.html`, `media.html`, `status.html` - are
  ops/internal boards, so leaving them embed-less is fine. `links.html` is the odd one out.
- **Fix:** add the standard `fc:miniapp` meta tag to `links.html` (copy any page's, point
  `button.action.url` to `https://zabalgamez.com/links`).

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Centralize DOMAIN in lib/auth.mjs; drop the 13 per-file consts | @Zaal | PR | Low priority |
| Add fc:miniapp embed to links.html | @Zaal | PR | This week |

## Areas still NOT audited (future iterations)

- Finals stack data wiring (`finals.html`, `finals/live`, `winners.html` vs `data/finals.json`).
- Data-integrity across `data/*.json` (cross-refs: do recaps `handle`/`page` match people.json,
  do workshop-leads luma_urls all resolve, orphaned references).
- The recordings hub generation (`scripts/build-recordings-index.mjs`) edge cases.

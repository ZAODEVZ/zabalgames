# Repo gap audit - paths + unfinished features (2026-06-25, loop iteration 2)

Continues the gap audit (iteration 1 = July Build Days, PR #349). This pass: dead/incorrect
paths across the 28 endpoints + 30 pages, and ideas-shipped-but-not-finished. All verified
in-repo.

## Clean (verified - no action)

- **No dead API calls.** Every `/api/X` referenced in `assets/*.js` + `*.html` has a matching
  `api/X.mjs`. (24 referenced, all resolve; the 5 unreferenced endpoints - `commit-watcher`,
  `daily-cast`, `monthly-winner`, `notify`, `workshop-reminders` - are crons/admin, correctly
  not called from client code.)
- **No broken internal links.** All 27 unique internal `href="/..."` routes resolve to a page
  file or a real route. Linking is healthy.

## Gaps found (verified)

### 1. `/info` July submission gallery is a built-but-dead form

- `info.html:1187-1188` - `<!-- July submission gallery: ... placeholder keys - NOT live yet -->`
  and `<!-- TODO (July): wire Supabase project + keys; team is currently out of free Supabase slots. -->`
- `info.html:1564` - the form's error path hardcodes `"Submissions not live yet. The form is
  built but Supabase config is still placeholder."`
- **Impact:** a visitor who fills the July submission form on `/info` hits a dead end. It is
  documented (CLAUDE.md + roadmap) but unresolved, and July is days away.
- **Fix options:** (a) wire a DB before Jul 1 (Supabase slot, or reuse the existing Upstash
  store that `/api/register` + `/api/builds` already use - no new DB needed), or (b) until
  then, replace the form with a direct CTA to `/enter` (which IS live) so the path is not dead.

### 2. `/spaces` "Past spaces" is a stale empty placeholder

- `spaces.html:139-145` - the "Past spaces" section renders a single dashed card: "No archived
  sessions yet... The first space goes live this weekend." with a `Coming soon` badge.
- `spaces.html` has **no fetch / no data wiring** (verified - no `fetch`, no recaps/recordings
  read). The copy promises "This section fills as sessions happen," but nothing populates it.
- **Impact:** it is 2026-06-25, ~3.5 weeks into the season, with **26 recordings** in
  `data/recaps.json` - yet `/spaces` still tells visitors there are no archived sessions. The
  page actively understates the season.
- **Fix:** wire the "Past spaces" list to `data/recaps.json` (or `recordings/index.json`),
  same as `/recordings`, or fold `/spaces` into `/recordings` and redirect.

### 3. (Intentional, not a bug - noted for completeness)

- `game.html:85-99` - "Insert Coin sprint" + "More games" cards are styled `.soon` "Coming
  soon" placeholders, explicitly "drops during the July open build." These are deliberate
  future slots, not broken - leave as is.

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| `/info` July form: point to `/enter` now, or wire Upstash/Supabase before Jul 1 | @Zaal | PR/decision | Before Jul 1 |
| `/spaces` "Past spaces": wire to recaps.json, or redirect /spaces -> /recordings | @Zaal | PR | This week |

## Method (so the next iteration can extend it)

- API: `grep -rhoE "/api/[a-z0-9-]+" assets/*.js *.html` vs `ls api/*.mjs`.
- Links: `grep -rhoE 'href="/[a-z0-9/_-]*"' *.html assets/*.js`, resolve each first segment.
- Unfinished: `grep -rniE "TODO|FIXME|not live|coming soon|stub|placeholder key"` over shipped code.
- Areas still NOT audited (future iterations): the activity/identity backend internals
  (`api/activity`, `join`, `track`, auth/JWT), the Finals stack data wiring, the Mini App
  manifest + share/embed wiring, and data-integrity across `data/*.json`.

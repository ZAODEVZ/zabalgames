# Repo gap audit - final pass + full summary (2026-06-25, loop iteration 5)

Closes the 5-iteration gap audit. This pass covered the last un-audited surface; it found
nothing new. Below: iteration 5's clean results, then the ranked summary of every gap found
across all five iterations, then the recommendation.

## Iteration 5 - all clean (verified)

- **All referenced assets exist.** Every `/assets/*` (images, fonts, JS) referenced via
  `src=`/`href=` in the HTML resolves to a real file. No broken asset links.
- **Recordings hub is consistent.** `recordings/index.json` has 26 entries = `recaps.json` 26.
  In sync.
- **`vercel.json` is correct.** `cleanUrls:true`, 13 redirects (all internal destinations
  resolve), 0 rewrites, 2 headers. No rewrite touches `/.well-known/` (as CLAUDE.md requires).
  The `zabalgames.com -> zabalgamez.com` 307 is configured at the Vercel domain level (not in
  `vercel.json`), which is expected.
- **No people/mentors drift.** `mentors.json` (1 entry) is fully contained in `people.json`.

## Every gap found, ranked by impact

### HIGH - fix before July (real, user-facing, time-sensitive)

1. **`/info` July submission form is a dead end.** Built UI, but Supabase config is placeholder
   keys -> the form errors "Submissions not live yet" (`info.html:1187-1188,1564`). July is days
   away. **Fix:** repoint to `/enter` (live now), or wire the existing Upstash store that
   `/api/register` + `/api/builds` already use - no new DB needed. *(iter 2, PR #350)*
2. **`/spaces` understates the season.** "Past spaces" is a static placeholder reading "No
   archived sessions yet" while **26 recordings exist**; the section has no data wiring
   (`spaces.html:139-145`). **Fix:** wire to `recaps.json`, or redirect `/spaces -> /recordings`.
   *(iter 2, PR #350)*

### MEDIUM - July programming (new build, high leverage)

3. **No Build Days surface.** The daily build-stream series (ZAOOS doc 901) has no repo home -
   no schedule data mapping July days -> project + time. But the plumbing is ~70% there: `/live`
   already does a next-session countdown from `workshop-leads.json`, and `adoptable-projects.json`
   is a 62-project catalog. **Fix:** add `data/build-days.json` (or extend workshop-leads with
   `kind:"buildday"` + `project`) + a thin `/build-days` page. *(iter 1, PR #349)*

### LOW - cosmetic / maintainability

4. **`/links` missing its `fc:miniapp` embed** - the public "all links" sharing hub won't render
   a Mini App card on Farcaster. One-tag fix. *(iter 3, PR #351)*
5. **`DOMAIN` duplicated across 13 endpoints** - load-bearing constant; centralize in
   `lib/auth.mjs`. *(iter 3, PR #351)*
6. **6 recent presenters (pages 18-24) have no profile page** - `crm.profile_url` null + absent
   from `people.json`. Degrades gracefully (no 404s). Backfill follow-up. *(iter 4, PR #352)*

## Verdict + recommendation

Across auth, routing, crons, embeds, the Finals stack, asset references, redirects, and data
integrity, the codebase is **solid** - the audit surfaced only two genuine user-facing gaps,
both in the content/data layer (not code). 

**Recommendation: pivot the loop from finding to fixing.** The HIGH items are quick:
- `/spaces` -> wire to recaps.json (or 307 to /recordings).
- `/info` -> repoint the July form to `/enter`.
- Then the MEDIUM build: `data/build-days.json` + `/build-days`.

The audit loop is complete; no further audit iteration is scheduled (no un-audited surface
remains). Iterations 1-5: PRs #349, #350, #351, #352, and this summary.

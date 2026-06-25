# July Build Days - repo gap analysis (2026-06-25)

What the daily "Build Days" series (see ZAOOS research doc 901) needs vs what the
zabalgamez repo already has. Verified by reading the surfaces, not assumed.

## TL;DR

The plumbing is ~70% there. The series is a NEW programming format with no repo
representation yet, but most of what it needs already exists and just needs wiring:
`/live` already shows a "next session" countdown off `workshop-leads.json`, and
`data/adoptable-projects.json` is a 62-project catalog that can drive "today's project."
The real work is data + a thin surface, not greenfield.

## What already exists (verified)

| Piece | Where | State |
|---|---|---|
| Next-session countdown + "what's on" | `live.html` (reads `data/workshop-leads.json`, lines ~575/899/915) | LIVE - any dated entry in workshop-leads auto-surfaces on `/live` and the homepage schedule |
| Project catalog | `data/adoptable-projects.json` - **62 projects**, keys: id, name, brand, maturity, adopt_type, description, ship_next, repo, live, spec_url, status | LIVE - a ready source for "today's project" |
| Build-idea voting | `build-ideas.html` + `api/build-ideas.mjs` + `api/build-vote.mjs` | LIVE - global wishlist with upvotes |
| Building-in-public board | `enter.html` + `api/register.mjs` + `api/builds.mjs` | LIVE - reads the register store |
| Live status (Twitch/YouTube) | `api/live-status.mjs`, `live.html`, `today.html` | LIVE - polls decapi/YouTube for on-air state |
| Recording pipeline | `scripts/ingest-recording.mjs` -> `/recordings/N` | LIVE - works for any session |
| Stream surface | `zabalgamez.com/live` | LIVE |

## Verified gaps

1. **No Build Days schedule data.** Nothing maps July days -> a project + time. `workshop-leads.json` is June workshops; `adoptable-projects.json` has no date field. Without dated entries, `/live` and the homepage have nothing to count down to in July. **This is the single highest-leverage gap** - adding dated Build Day entries lights up `/live` + the homepage + the countdown for free.

2. **`build-ideas` is project-agnostic.** It is a global "what should the ZAO build" wishlist - no concept of "today's project" or "build on top of X," and no per-day filter. The Build Days 0-10 min vote ("what do we build on top of today's project") has no home. Needs a per-project/per-day filter or a lightweight per-day idea field.

3. **`/live` + `/today` don't show the day's project.** `live-status` only reports on-air state; `today.html` mirrors the newsletter (`daily-updates.json`). Neither renders "Today's Build Day: building on Empire Builder - 4pm - RSVP/watch." Needs the project tied to the schedule entry.

4. **No `buildday` recording type.** `data/recaps.json` types are `workshop|fireside|bczworkshop`. Build Day recordings would ingest as `workshop` and not group separately in the `/recordings` hub. Minor - add a `buildday` type if separate grouping is wanted.

5. **Project catalog and the build flow are not linked.** `adoptable-projects.json` (the projects) and `/enter`'s building-in-public board (the submissions) have no "this build was made on top of project X on Build Day N" linkage - so cross-pollination is invisible on-site.

6. **Known pre-existing July blocker (not Build-Days-specific):** the `/info` Supabase submission gallery is still client-side with placeholder keys, NOT live (per CLAUDE.md + roadmap). Out of scope for Build Days but worth noting for July readiness.

## Minimal path to run Build Days (recommendation)

1. **Add a `data/build-days.json`** (or extend `workshop-leads.json` with a `kind:"buildday"` + `project` field) holding each July day: date, time, the project (by `adoptable-projects` id), guest, RSVP (lu.ma), watch link. This alone surfaces them on `/live` + homepage.
2. **A thin `/build-days` (or homepage block)** that renders the day-by-day calendar from that data, each linking its project (catalog), its RSVP (Luma), and after the session its recording.
3. **Per-day build ideas:** add a `day`/`project` tag to `api/build-ideas` so the 0-10 vote filters to today's project; reuse the existing voting.
4. **Add `buildday` to the recap type enum** so the daily builds group in `/recordings`.
5. (Optional) On `/enter`, let a build reference the Build Day / project it was built on, to make the cross-pollination visible.

Items 1-2 are the 80/20 - they make the series real and promotable with almost no new backend (workshop-leads + /live already do the heavy lifting).

## Sources (verified in-repo, 2026-06-25)

- `live.html` lines ~575, 899, 915 - reads `data/workshop-leads.json`, computes next session.
- `data/adoptable-projects.json` - object with `projects[]` (62 entries, rich keys).
- `build-ideas.html` + `api/build-ideas.mjs` - global wishlist, no per-project/day.
- `api/live-status.mjs`, `today.html` - on-air state + newsletter mirror, no schedule.
- `data/recaps.json` `_note` - type enum `workshop|fireside|bczworkshop`.
- `docs/season-1-roadmap-3month.md` lines 65-93 - July = async open build, no daily-series line.

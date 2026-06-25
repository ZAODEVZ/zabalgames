# Repo gap audit - Finals stack + data integrity (2026-06-25, loop iteration 4)

Continues the gap audit (iter 1 = PR #349; iter 2 = PR #350; iter 3 = PR #351).
This pass: the Finals stack data wiring and cross-reference integrity across `data/*.json`.
All verified in-repo.

## Clean (verified)

- **Finals stack is correctly placeholder-state, not broken.** `data/finals.json` is
  `status: "pending"` with `finalists: []` - exactly as designed (Finals settle in August per
  CLAUDE.md). `finals.html` / `finals/live` / `winners.html` / `leaderboard.html` render their
  built-in "awaiting Finals" placeholders. No premature/half-wired data. Nothing to fix until
  the finalist set is locked post-July.
- **Recording file integrity is intact.** Every `recaps.json` entry with a `page` has a matching
  `recordings/N.html`; every `transcript` link resolves to a real local file. No dangling pages.
- **All workshop-leads Luma links are well-formed.** 27 entries have `luma_url`, all match
  `https://luma.com/<id>` - 0 malformed.
- **`/speakers` is complete.** It reads `data/crm.json` (+ workshop-leads), and all recent
  presenters (Meta Mu, Minted Merch, topocount, Saltorious, Dylan Yarter, The Farcaster Intern)
  are present in crm.json. The speakers grid is not missing anyone.

## Gap found (verified - minor, data completeness)

### 6 recent presenters have no profile page

The sessions backfilled/upgraded this session have a recording + a crm.json roster entry, but
**no profile page** - their crm `profile_url` is `null` and they are absent from
`data/people.json` (which `/p?handle=` reads):

| Presenter | Page | crm `profile_url` | in people.json |
|---|---|---|---|
| Meta Mu (`@metamu`) | /recordings/18 | null | no |
| Minted Merch (`@mintedmerch`) | /recordings/19 | null | no |
| The Farcaster Intern (`@farcaster`) | /recordings/20 | null | no |
| Saltorious (`@saltorious.eth`) | /recordings/22 | null | no |
| Dylan Yarter (`@bizarrebeast`) | /recordings/23 | null | no |
| topocount (`@topocount.eth`) | /recordings/24 | null | no |

- **Impact: LOW - degrades gracefully, no broken links.** `speakers.html:191` only emits a
  profile link when `profile_url` is set; with `null` it shows the speaker as non-clickable.
  Recording pages do not link to `/p`, and no page references `?handle=metamu` etc. So nothing
  404s - these presenters just have no clickable profile.
- **Cause:** the June backfill + the video-page upgrades created recordings + crm rows but did
  not create the matching `people.json` profile (the two stores are updated by different flows).
- **Fix:** add a `people.json` entry for each (handle, name, org, bio, links) and set the crm
  `profile_url` to `/p?handle=<handle>`. Low priority - cosmetic completeness, not a defect.

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Backfill people.json profiles + crm profile_url for the 6 presenters | @Zaal | PR | Low priority |
| (Finals stack: no action until finalists lock post-July) | - | - | August |

## Areas still NOT audited (future iterations)

- The recordings hub generator (`scripts/build-recordings-index.mjs`) + `recordings/index.json`
  vs recaps consistency.
- `data/people.json` <-> `data/mentors.json` overlap / drift.
- Asset references: do `assets/*` files referenced in HTML/CSS all exist (images, fonts, JS)?
- `vercel.json` redirects/headers correctness + the zabalgames.com -> zabalgamez.com 307.

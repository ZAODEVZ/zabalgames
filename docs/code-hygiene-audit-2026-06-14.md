# Code hygiene audit - 2026-06-14 (non-recording surfaces)

> Scope: broken internal links + missing canonical/OG/Twitter meta tags across the site's
> non-recording HTML pages. Per the active two-session split, recording surfaces were excluded
> (`recordings/*.html`, `recaps.json`, `data/streams/**/transcripts/*`, `recordings/index.json`).
> Method: scripted scan of the 33 top-level `*.html` pages - link targets checked against
> existing files/dirs (accounting for Vercel cleanUrls), meta presence checked per page.
> Brand: no emojis, no em dashes.

## Result: clean. No safe nits to fix.

### Broken internal links
**None.** Every internal `href` across all 33 top-level pages resolves to an existing file or
directory (cleanUrls-aware: `/foo` -> `foo.html`, `/recordings` -> the dir). Asset, `_vercel`,
`.well-known`, and data-file links (`.txt` / `.xml` / `.json`) all resolve.

### Missing canonical / OG / Twitter meta
All public pages carry `rel="canonical"`, `og:title`, `og:image`, and `twitter:card`.

One page reports missing `og:title` / `og:image` / `twitter:card`: **`status.html`** - and this is
**intentional, not a bug**. `status.html` is the internal production board: it is
`<meta name="robots" content="noindex, nofollow">` and titled "Production status - ZABAL Gamez
(internal)". It deliberately keeps only `canonical` + `og:url` because it is not meant to be
indexed or unfurled. No change made - adding share tags to an internal noindex page would be
wrong.

- `og:image` across the public pages points to `assets/embed-card-gamez.png`, which exists.

## What was not in scope (and why)

- **Recording pages** (`recordings/*.html`) and the recording data files were excluded - another
  session owns them this cycle. If a future audit covers them, run the same scan over `recordings/`.
- This pass checked links + share meta only. Not checked here (candidates for a future pass):
  per-page JSON-LD validity, image `alt` coverage, heading order / a11y, and external-link
  liveness.

## Next actions

| Action | Owner | Type |
|--------|-------|------|
| None required for non-recording pages - clean as of 2026-06-14 | - | - |
| Optional future pass: a11y (alt text, heading order) + external-link liveness | Claude | Audit |
| When the recordings session settles, run this same scan over `recordings/*.html` | Claude | Audit |

## Sources

- Scripted scan of the repo's 33 top-level `*.html` pages (this commit) - [FULL]
- `status.html` head (noindex, internal) - confirms the one flagged page is intentional - [FULL]

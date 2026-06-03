# Social share images - deferred work

Status: **TODO** (deferred 2026-06-03). Captured from the social-share audit. The
share *logic* (the @zaal/@bettercallzaal tagging, verified cast tracking, cleaner
copy) shipped in `ws/share-tag-zaal`; the *images* are the remaining piece.

## Why this matters
Per-page / dynamic share images are the single biggest virality lever for a Farcaster
Mini App. The official guidance is blunt: "Sharing in the feed is everything... use a
custom preview image." Right now every page shares the **same** static card:

- 39 `fc:miniapp`/`fc:frame` `imageUrl` tags -> `assets/embed-card-gamez.png`
- 25 `og:image` tags -> the same file

So a recap, `/live`, `/today`, and the homepage all look identical in-feed. A unique
card per context (workshop, recap, day) makes each share its own object.

Embed image spec (from Farcaster docs): **3:2 ratio, PNG** (JPG/GIF/WebP also valid;
SVG is NOT), shown as a card with a button under it.

## Constraints (why it was deferred)
- The web build environment has **no image tooling** (no ImageMagick / rsvg / Inkscape),
  so branded PNG cards can't be authored here.
- **SVG is not a valid embed format**, so a pure-code SVG card won't render in-feed.
- The repo is **zero-build, no-npm** edge functions. The standard dynamic-OG tool
  (`@vercel/og` / satori) wants a build step + dependency, which breaks that convention.

## Phase 1 - static cards (needs art assets)
Produce 3:2 PNG cards (1200x800) and wire the per-page meta (`fc:miniapp` + `fc:frame`
`imageUrl`, `og:image`, `twitter:image`). Highest-value pages first:

| Page | Card idea | Asset path |
|------|-----------|------------|
| `/live` | "What's on now" / live-now state | `assets/share/live.png` |
| `/today` | Day card ("Day N - <topic>") | `assets/share/today.png` |
| `/recaps` | "Session recaps" hub card | `assets/share/recaps.png` |
| `/finals` | August Finals card | `assets/share/finals.png` |

Existing per-workshop thumbnails (`assets/workshops/*.png`) can seed the look.

## Phase 2 - dynamic cards (the real fix)
An endpoint that renders a card per workshop / per day / per recap, e.g.
"Cassie - today 4pm" or a recap's top takeaway, driven by `data/workshop-leads.json`
and `data/recaps.json`. Cache header per docs: `Cache-Control: public, immutable,
no-transform, max-age=300`.

Approach options, given the zero-build convention:
1. **`@vercel/og` ImageResponse** - cleanest output, but adds a dependency + build step.
   Breaks the no-npm rule unless we accept a build for this one function.
2. **satori + resvg-wasm via esm.sh** in an edge function - keeps no-npm but is fragile
   in the edge runtime (WASM init, cold starts).
3. **Pre-generate static PNGs in CI** when `workshop-leads.json` / `recaps.json` change,
   commit them, point per-page meta at them. Keeps the *runtime* zero-build.
   **Recommended** given repo conventions - revisit when we tackle this.

## When picked up
- Decide Phase 2 approach (lean option 3).
- Wire `imageUrl` / `og:image` / `twitter:image` per page or per deep-link.
- The cast embed already uses the page URL, so a per-page card instantly upgrades
  every share with zero copy changes.

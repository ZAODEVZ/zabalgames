# ZABAL Gamez UI/UX Redesign Plan - 2026-05-28

> Per Zaal: '/design the website we need to really amp up the UI / UX.' This doc plans the upgrade in layered tiers so we ship incrementally without breaking the simplicity feedback.

## Design constraint

**The arcade logo is the visual anchor. The rest of the site stays modern + minimal.**

The audience is digital creators + builders. Too much arcade kitsch = lose credibility. Too sterile = lose the personality the logo brings. The pairing - retro hero, modern chrome - is the brand promise.

## Current state (after PR #2 merged)

- Logo + countdown + commit-share buttons above the fold
- Path picker (Learn / Build / Watch) with cast-share + secondary links
- Phase cards (June / July / August)
- Workshop signup + collectible CTA + season signup
- Tight footer
- /info has the long-form pitch

Total page weight: ~503 lines HTML, ~50KB inline. Loads fast.

## Three tiers of polish

### Tier 1: Surface polish (this PR)

Things that lift the feel without changing structure. Risk: low. Effort: 2-4 hours.

| Item | What | Where |
|---|---|---|
| CRT scan-line texture | Subtle horizontal-line overlay on hero only, 4% opacity. Reinforces the arcade aesthetic. | `.hero::after` pseudo-element |
| Pixel font accents | Press Start 2P from Google Fonts. Use for: eyebrow chip text, path-coin labels, countdown digits, "INSERT COIN" footer micro-mark. NEVER for body. | new font load + add `.pixel` utility class |
| Logo hover pulse | On hover (desktop only, no-op on mobile): the logo glows gold for 300ms then settles. | `@keyframes logoPulse` |
| Countdown blinking colon | The `:` characters in the countdown pulse on/off every 0.7s. Classic arcade clock. | CSS animation on a `<span class="blink">:</span>` |
| Button hover glow | Path buttons get a colored shadow on hover (matching path color: gold for Learn, orange for Build, cyan for Watch). | `box-shadow` transition |
| Scroll-fade-in | Each `.section` fades up on scroll into view. IntersectionObserver. Subtle 0.3s. | new JS observer |
| Phase-card border-top color sweep | The 3px top border slides across left-to-right on hover. | `::before` + transform |
| Insert-coin moment | After 30s on page, a "1 CREDIT" indicator appears in the corner that says "PLAYER 1 READY" - one-time, dismissible. Subtle Easter egg, not blocking. | dismissible toast |
| Mobile padding refinement | Hero padding tighter on small screens, more vertical breathing room on phone scroll. | media queries |

**Output:** all Tier 1 changes ship in `index.html` inline styles + one small JS block.

### Tier 2: Interaction depth (next PR)

Things that add motion + sound + state. Risk: medium. Effort: 1-2 days. Reverts cleanly if Zaal doesn't like.

| Item | What |
|---|---|
| Sound toggle | Top-right icon: muted by default. Toggle on -> arcade button clicks (8-bit `boop`) on path-btn presses. Hover sounds for share-btns. Volume slider in localStorage. |
| Logo animation on load | Pixel-paint-in: the logo letters appear left-to-right over 0.8s, with a flicker at the end (CRT power-on feel). One-shot, then static. |
| Path-card flip | Click a path-coin label (e.g. 'P2 - Build') and the card flips 3D to show "instructions" on the back - exact build requirements, current builder count, etc. |
| Cursor trail | Optional - tiny pixel-color trail behind cursor on hero. CSS-only (or canvas). Off by default. |
| Marquee for sponsor + workshop announcements | Single-line horizontal scroll at top of hero like an old game cabinet headline: "WORKSHOP LEADS WANTED * \$500 USDC POOL FUNDED * 100+ ZAO MEMBERS *" |
| Konami-code Easter egg | Up Up Down Down Left Right Left Right B A on the home page -> ZAO-themed surprise (small celebrate animation + cast share to /zabal that says "I found the cheat code") |
| Path-cadence card animation | June/July/August lines slide in stacked when you hover into a card |
| Countdown urgency colors | When countdown hits T-7 days, the countdown chip color shifts cyan -> orange. T-24h shifts to pink + faster blink. |

### Tier 3: Special moments (post-launch)

The Finals page + reveal-stream page get FULL arcade-cabinet treatment.

| Page | Treatment |
|---|---|
| `/finals/live` | Full arcade-cabinet bezel CSS (border ornament). Each finalist's build = a "battle entry" card with score panel. Live ticker top + bottom. Loading states with "INSERTING..." messages. |
| `/winners` | Hall of Fame layout. Each winner gets a "high-score" entry with their handle, score, and a 3-letter arcade-name truncation. Mosaic of pixel-portraits. |
| `/p?handle=X` | Profile card styled as an arcade-cabinet character-select screen. Stats panel (sessions led, mentorship offered, audit date). |

These ship after launch when there's actual content to populate them.

## Page-by-page review

### `/` (main)

Current: lean. Tier 1 lifts the personality.

To add:
- Pixel-font eyebrow ("SEASON 1 - INSERT COIN MON JUN 1") - currently Outfit
- Blinking colon in countdown
- Scan-line texture on hero
- Path-card hover glow
- "PLAYER 1 READY" subtle Easter egg after 30s

### `/info`

Current: dense, scrollable. Don't redesign - it's the dump page on purpose.

Add only: a small "Back to the simple page" sticky bar (already done). Maybe a TOC sidebar on desktop wide screens (>=1024px).

### `/p` (roster + profile)

Current: 6 cards in 2-col grid, individual profile renders below.

Add (Tier 2):
- Each roster tile gets a pixel-portrait placeholder (auto-generated from handle hash if no avatar URL)
- Profile pages get "stats panel" layout (sessions, audit date, role-pill breakdown)
- A "leaderboard" mode that sorts by role count or audit recency

### `/finals`, `/finals/live`, `/winners`

Current: standard layout.

Add (Tier 3 - post-launch): arcade-cabinet treatment described above.

### `/lead`

Current: standard Formspree form.

Add (Tier 1):
- Field labels in pixel font
- "INSERT YOUR DATA" eyebrow above the form
- Submit button with arcade button styling (red push-button look)

### `/projects`

Current: 16 adoptable project tiles.

Add (Tier 2):
- "PICK A GAME" arcade-cabinet header
- Each tile gets a difficulty rating (1-5 stars) + estimated time
- "LATEST UPDATE" badge for recently-touched projects

## Mobile-first considerations

The hero logo at 320px width works on phones. But the path picker stack vertically might feel long. Mitigations:

- Collapse the 3 phase cards (June/July/August) to a horizontal-scroll carousel on phone (snap-scroll)
- Path picker uses 2-step progressive disclosure: tap a tab (Learn / Build / Watch) -> the cadence panel slides into view below
- Sticky bottom bar on phones with the primary CTA ("Insert Coin Mon Jun 1 - Get Notified") so users can act from any scroll position

## Accessibility pass

- Confirm logo has alt text (done)
- Confirm visually-hidden H1 (done)
- Verify all share-btn + path-btn focus states are visible (currently border-color change - might need bigger contrast)
- Color contrast ratio on path-coin labels (gold on #111 = ~9:1, fine)
- Reduced-motion media query support: disable all animations + transitions when `prefers-reduced-motion: reduce`
- Skip-to-content link in nav (add for keyboard nav)

## Performance budget

Current main page: ~50KB inline HTML + CSS + JS + 1.2MB logo.

Targets:
- Below the fold should render in <1s on 3G
- Logo should optimize to <300KB (current 1.2MB is unnecessary at 1024x1024 for a 420px display - resize to 840x840 at 80% quality JPEG or WebP, drops to ~150KB)
- Tier 1 adds ~5KB of CSS + ~3KB of JS - negligible
- Tier 2 sounds (if added) lazy-loaded only when user toggles sound on

## Action item: logo optimization

The logo at 1024x1024 PNG (1.17MB) is overweight for a 420px display target. Generate optimized variants:

- `assets/logo-840.webp` (840x840 at 85% quality, ~120KB) - default for desktop
- `assets/logo-480.webp` (480x480 at 90% quality, ~60KB) - default for mobile
- `assets/logo.png` (current full-quality) stays for OG image where unfurl-clients want PNG specifically

Use `<picture>` element to serve responsive variants:

```html
<picture>
  <source media="(max-width: 600px)" srcset="/assets/logo-480.webp">
  <source media="(min-width: 601px)" srcset="/assets/logo-840.webp">
  <img src="/assets/logo.png" alt="ZABAL Gamez - Insert Coin" class="hero-logo">
</picture>
```

Use `cwebp` (Homebrew: `brew install webp`) or an online tool. Quick path: `cwebp -q 85 assets/logo.png -o assets/logo-840.webp` (after resize via `sips -Z 840 assets/logo.png --out /tmp/logo-840.png`).

## Recommendation - what to ship in PR #3

Pre-launch (this week):
- All of Tier 1 (surface polish)
- Logo optimization (responsive variants)
- Reduced-motion support

Post-launch (after Jun 1):
- Tier 2 interaction depth (start with sound toggle + Konami code as soft Easter eggs)
- Tier 3 special moments as content rolls in

## Next steps

1. Ship Tier 1 polish (single commit, ~200 lines of CSS + ~50 lines of JS added to index.html)
2. Ship logo optimization (3 file generations + `<picture>` element update)
3. Brand-kit doc update to reference the redesigned UI tokens
4. After 48hrs of feedback on Tier 1, queue Tier 2 sprint

# ZABAL Gamez - Running TODO

> The live state of the build. Updated as commits land. See `docs/research/701-canonical-state.md` for the canonical event-level decisions; this file tracks the actual build / launch tasks.

**Last updated:** 2026-06-06 (June workshop month - live list in [CURRENT] below; the pre-launch ship log is preserved beneath it).
**Goal (launch):** Site production-ready by Sun May 31 so June workshops open Mon Jun 1. (Met - doors opened Jun 1.)

---

## [CURRENT - 2026-06-06] - June workshop month

### In progress
- **Farcaster Mini App hardening** - research + first implementation pass done 2026-06-06. Splash fix shipped earlier (PR #127: exact SDK pin `0.1.10` + `esm.sh` preconnect on all 27 pages). Status of the four hardening items:
  - **[P1] Self-host the SDK - loader SHIPPED, vendored file PENDING.** `assets/miniapp.js` now loads self-host-first (`/assets/vendor/miniapp-sdk-0.1.10.js`) with esm.sh as fallback, via a null-safe dynamic-import loop. The vendored binary is NOT in yet - this build env can't reach esm.sh (outbound allowlist), so source 1 404s and it transparently uses esm.sh (no regression). **Action: drop in the bundle via the recipe in `assets/vendor/README.md` (run where esm.sh is reachable), then test in a real client.** That flips the app to same-origin and is the actual cure for the stuck splash.
  - **[P2] Capability detection - SHIPPED.** Added `sdk.getCapabilities()`-backed `window.ZABAL.hasCapability()` (cached; returns true when a host can't enumerate, so older clients still attempt). Gates `composeCast` and `addMiniApp`; try/catch remains the backstop.
  - **[P3] disableNativeGestures - SHIPPED.** `ready()` reads `<meta name="fc:disable-native-gestures" content="1">`; added to `/recordings/1` (video embed + chapters). Per-page opt-in, off by default.
  - **[P4] Manifest review - RESOLVED, no change.** Deliberately keep `requiredChains`/`requiredCapabilities` EMPTY for max host reach (the site degrades to a normal website, so requiring them would only cut reach). `splashImageUrl` left as icon.png (correct square splash; logo-gamez is wide). Optional later: `screenshotUrls` (needs real portrait screenshot assets).
  - Sources: miniapps.farcaster.xyz/docs/guides/loading, /docs/sdk/detecting-capabilities, /docs/sdk/actions/ready, /docs/specification.

### Up next (build)
- **Part 2 (demo) YouTube package** - title / description / chapters / tags. Reuse the Part 1 template once the demo cut exists.
- **Notion Command Center** - content fully drafted (all 9 sections: ZABAL Games, BCZ Drive assets, Sprint Dates, Existing Channels, KPI Tracker, Activation Menu, Onboarding/Activation Calendar, Magnet Grid, Owner Actions). Paste into the Notion page. Confirm 3 open cells: Magnet Grid video-recorded status, Activation Menu "register your build" URL, and renaming the "Untitled" block.

### Owner actions (not code-blocked)
- **Magnetiq** - upload the 8 ZAO brand mementos + the collectible video (paste-ready copy in `docs/magnetiq-mementos-zao-brands-2026-05-28.md` + `docs/magnetiq-zabal-gamez-collectible-page.md`).
- **Cal.com** - add booking questions (handle / topic / format / notes).
- **Workshop roster** - lock ~4-5 more June sessions (target ~8); mirror confirmed leads into `data/workshop-leads.json`.
- **Vercel Web Analytics** - enable in the dashboard (the tag is already on every page).
- **POIDH bounty** - "Best ad for ZABAL Gamez", $25, ends Jun 14. Post + optional homepage callout (`docs/poidh-bounty-best-ad.md`).
- **Announcements** (yerbearserker first-workshop + Day 0) - ON HOLD per owner.

### Shipped this session (2026-06-06)
- July entry discoverability: `enter.html` (the "how to enter July" page, form wired to `/api/register`) was fully built but orphaned - now linked from the homepage Builder card and the Season footer column on all 27 pages.
- Workshop #1 recording page `/recordings/1` (embed + clickable chapters + share buttons), recap YouTube link, recordings-hub link (PR #126).
- Activity-backend audit follow-ups: join first-join idempotency, register hybrid identity + many-repos, commit-watcher ownership proof (PR #126).
- Mini App splash hardening: exact SDK pin + `esm.sh` preconnect (PR #127).
- Mini App hardening pass: self-host-first SDK loader, capability detection, gesture opt-out (PR #128).
- Mini App growth/retention: workshop reminder notifications cron (`api/workshop-reminders.mjs`, daily 12:00 UTC) + "Shared into /zabal" / "Shared to X" toast in `share()`. Note: add-app-after-Join and a question-framed reply-bait CTA variant were already in place.
- Empire Builder leaderboard - DONE end to end: read proxy `api/empire-leaderboard.mjs` (empire `zabalgamez01e9af`, consolidated board-map normalizer, Neynar username->avatar/fid enrichment), the live `/zabal` board as the headline on `/leaderboard`, and a self-revealing top-5 preview on the homepage (PRs #129/#130/#131 + follow-ups).
- Brand polish refreshed onto current main (titles + theme-color/apple-touch-icon on all pages + finals/live og:image), superseding the stale #122.

---

**Status as of 2026-05-26 evening:**
- Formspree lead form: TESTED PASS (Zaal confirmed)
- Site health: 8/8 URL checks return 200 (OG PNG 404 is expected - W11)
- Audit: Tier 1 + Tier 2 + Tier 3 fabrications all stripped (commits 687c0fc + ff239da)
- Announce kit: shipped (commit bcaff76 - `docs/announce-day-kit-2026-05-27.md`)
- Lu.ma templates: ready for Tyler + Thy Rev (commit 99539af - `docs/luma-events-templates-2026-05-26.md`)
- 4 announce posts: drafted + paste-ready
- Doc 750 (Builder OAuth): locked, mid-June build target

---

## [DONE]

### Foundation (early sessions)

- `9fd55d3` - initial repo move: site, brand context, launch kit, db schema, 9 research docs, README, LICENSE, gitignore, farcaster.json stub, icon asset
- `96e5149` - `llms.txt` at root (the July prompt)
- `901996d` - `.claude/skills/zabal-games/SKILL.md` + index.html `#ideas` section reworked to "The Context File"
- `e0fb310` - OG share card SVG, robots.txt, sitemap.xml, Confirmed Workshop Leads section, `#projects` with adoptable projects
- `d3c04eb` - `docs/snap-design.md` (zlank no-code + custom Vercel-function path)
- `c9911dc` - workshop leads moved to `data/workshop-leads.json` + JS render; JSON-LD Event + WebSite schema
- `fd42ea0` - `/lead.html` + `/projects.html` + `assets/style.css` shared
- `3d35f8c` - `vercel.json` cleanUrls + short-URL redirects + `text/markdown` on `/llms.txt`
- `13554b5` - **custom Snap endpoint** at `/api/snap/signup` (Vercel Edge serverless)
- `99ccb35` - Hero stats live (auto from JSON), `/context` page renders llms.txt with copy buttons, `/finals/live` scaffold
- BCZ side (PR #11 merged): zabalgames.html redirect + cross-link

### Knowledge graph + research pipeline (2026-05-23 / 2026-05-24)

- `c4b209d` + `92cc60b` - **Bonfire knowledge graph** seeded across 12 dimensions over 2 rounds. 171 entities + 220 edges in `data/bonfire-graph.json`. Aggregator + push scripts in `scripts/`. llms.txt has the queryable-depth pointer section with 12 kEngrams.
- `d6b27af` - **7 starter-repo adoptable projects** added (id 10-16) from bettercallzaal audit. Total now 16.
- `cba81ae` - **Starter-repo UI badge** distinguishes 01-09 (stack features) from 10-16 (whole-repo adoptions) on `/projects` + `index.html #projects`.
- ZAODEVZ/ZAOcowork `c48a75a` - **research-dispatch pipeline** as sibling of agent/ inside ZAOcowork. Orchestrator + aggregator + push + queue (8 topics, 32 dimensions) + Telegram handler + Sunday cron + one-shot VPS setup script. Lives at github.com/ZAODEVZ/ZAOcowork/tree/main/research-dispatch.
- bettercallzaal/zaocowork (legacy stub created in error this session) - SCHEDULED FOR DELETION via `gh repo delete bettercallzaal/zaocowork --yes` once Zaal refreshes gh CLI scope.

### Ship-week UI + content (2026-05-24)

- `dbbd06d` - Live signal ticker on hero (workshop-leads + claimed/total projects + mentor slots + countdown to June 1); /winners.html placeholder for Season 1 Finals; /mentor.html?handle=X dynamic profile page + data/mentors.json; post-Magnetiq + post-WaveWarZ-Base polish across #format/#judging/#showwork/#bigpicture; canonical-state.md Part 4 updated to confirmed-16 list; expanded Telegram + Twitter OG meta; changelog.json + sitemap.xml updated.

---

## [WAITING] - blocked on Zaal

**SHIP-BLOCKERS for Sun May 31** (in order of leverage):

| # | Blocker | What you do | Time | What I do once unblocked |
|---|---------|-------------|------|--------------------------|
**EASY-FIRST ORDER** (re-ranked 2026-05-24 per Zaal call - do the friction-free ones first):

| # | Blocker | What you do | Time | Friction | What I do once unblocked |
|---|---------|-------------|------|----------|--------------------------|
| W11 | **OG PNG** | Open `assets/og-card.svg` in browser, screenshot at 1200x630, save as `assets/og-card.png`, push. | 5 min | **NONE - only blocker left** | Swap `<meta property="og:image">` to point at PNG. Test unfurl on X / Telegram / Bluesky. (Currently 404 - SVG fallback unfurls in most clients.) |
| ~~W2~~ | ~~Lu.ma calendar URL~~ | **DONE 2026-05-24.** Using shared ZAO calendar at luma.com/zao (cal-jPH4al7AMlXzdNN). Workshops added as individual events alongside the weekly Fractal + other ZAO events. Embed iframe live in `index.html #workshops` left card. | - | - | - |
| ~~W3~~ | ~~Cal.com event-type URL~~ | **DONE 2026-05-24.** Event-type live at cal.com/bettercallzaal/zabal-games-workshop-slot. Embed iframe wired into `index.html #workshops` right card with Restream/Meet flexibility messaging. | - | - | - |
| ~~W4~~ | ~~Farcaster manifest signatures~~ | **DONE 2026-05-25.** Signed with FID 19640 custody key. Dropped into `.well-known/farcaster.json`. zabalgamez.com now registered as Mini App. | - | - | - |
| ~~W10~~ | ~~Zlank Snap published~~ | **DONE 2026-05-26.** Snap live at https://zlank.online/s/OAmekQ. Verified snap+json + HTML both return 200, Snap v2.0 JSON valid, confetti + 4-option poll renders. Wired into docs/launch-kit.md + hero CTA on index.html. | - | - | - |

**Total Zaal time for ship-readiness: ~50 min.**

**Not blockers this week** (can launch without; ship next):

| # | Item | Why deferred |
|---|------|--------------|
| W1 | OpenAI API key (connector NFT art) | Z logo placeholder works for soft launch |
| W5 | Supabase URL + anon key | Formspree handles soft-launch form submissions |
| W7 | Magnetiq portal + Zabal connector live (with Tyler) | "Enter via Connector" CTA placeholder works; swap in when ready |
| W8 | Intro video URL (60-90s) | Text hero section works |
| W12 | **Cloudflare migration on both domains** (Africa CDN fix) | DEFERRED post-launch per Zaal call 2026-05-24. Doc 730 has the full 30-min plan. Free tier. Do it after May 31 launch settles. Lagos/Nairobi/Cape Town traffic suboptimal until done, but VPN-having users still work. |
| BONFIRE | `BONFIRE_API_KEY` for live graph push | Graph file is committed; live push proves the queryable-depth promise but isn't a launch-day need |
| GH-DELETE | `gh auth refresh -h github.com -s delete_repo` then delete `bettercallzaal/zaocowork` | One-time cleanup; non-blocking |
| ZAOOS-PR | Review + merge ZAOOS PR #672 (286 MB cleanup) | Non-destructive; deferrable |
| MENTORS | Lock the 8 mentor roster (names + handles) | Templates ready; populate /data/mentors.json once each confirms. Outreach copy in docs/mentor-outreach-2026-05-24.md |

---

## [NEXT] - after the launch

| # | Build | Why | Est. effort |
|---|-------|-----|-------------|
| N5 | Hero banner using the SVG OG card (visual element above the fold) | Currently text-only hero; adds impact | 15 min |
| N9 | Daily-stats Snap (Doc 654 - "today's Empire Builder stats" one-click cast) | Cross-promo loop with $ZABAL holders. Builds AFTER W10 lands. | 30 min |
| N10 | Live Bonfire push + integration test | Proves the queryable-depth promise. Builds AFTER BONFIRE_API_KEY shared. | 5 min |
| N11 | Update llms.txt with kEngram pointers as round-3+ research lands | Ongoing maintenance | 10 min per round |
| N12 | Per-mentor pages populate as roster locks | Once each mentor confirms, add JSON entry | 5 min per mentor |
| **N13** | **Builder registration via Farcaster + GitHub OAuth (Doc 750)** | Replace one-shot form submission with "register once, build all month, agents read July GitHub activity." Frictionless connect via Mini App SDK + GitHub `read:user` OAuth. Auto-extract submission bar (live URL + demo + cast) from repo README. Featured-badge for repos with zabalgamez.com URL. Fork 1B locked - build mid-June for July go-live. | 3-4 weeks (Week of Jun 1 through Jun 29) |

---

## [BACKLOG] - good ideas, not yet prioritized

- `/dashboard` for confirmed workshop leads to manage their slot (login via Farcaster)
- Auto-clip flywheel for workshop videos (Doc 654 / 629)
- `/podcast` or RSS feed of all workshop recordings
- Multi-language: JA + ZH translations of the announcement copy
- Push-script 409 lookup fix (resolve pre-existing Bonfire entities via `/kg/entities?name=X`)
- /research per-doc HTML wrappers (each docs/research/*.md as its own browser-rendered page)
- Live Empire Builder leaderboard widget on hero (reads ZABAL token holders)
- ZAO OS cleanup PR (paused - the 286 MB dead-weight + .gitignore additions; worktree removed, branch deleted; audit at /tmp/zao-os-audit-20260524.md)
- Round-3+ research dispatches (8 topics queued in zaocowork data/research-queue.json)

---

## Launch timeline (2026-05-24 -> 2026-06-01)

EASY-FIRST schedule (re-ranked per Zaal call 2026-05-24):

| Day | Zaal | Me |
|-----|------|-----|
| Sat May 24 (today, easiest first) | **W11 OG PNG (5 min)** then W2 Lu.ma + W3 Cal.com if time | Drop in PNG meta, embed iframes as URLs arrive |
| Sun May 25 | W4 Farcaster manifest (10 min) + send first mentor DMs (Jordan, Adrian, Tyler - 10 min) | Drop manifest values into farcaster.json, monitor mentor responses |
| Mon May 26 | Merge zlank PR #63 + publish ZABAL Gamez Snap (10 min). Mentor DMs round 2 (Hurric4n3Ike, Sam, Arthur). | Wire Snap URL into launch kit + hero CTA. Add confirmed mentors to data/mentors.json. |
| Tue-Wed May 27-28 | Mentor DMs round 3 (kmac.eth, Joshua.eth + backup list). Test from a friend in Africa (VPN OFF) to gauge how bad the no-CDN issue is. | N5 hero banner SVG, N9 daily-stats Snap (after W10). |
| Thu-Fri May 29-30 | Final QA in Warpcast / Telegram / X / Bluesky. Approve launch cast copy. | Cast copy draft. Pre-launch polish. |
| Sat May 31 | LAUNCH CAST FIRES | Monitor + respond + amplify |
| Mon Jun 1 | Doors open - first workshop | Build whatever comes up |
| Post-launch week (Jun 2+) | **Cloudflare migration W12** (30 min total + 24h TTL pre-wait). Doc 730 has full plan. | Update DNS configs on my side if needed. |

---

## How to use this file

- **You added a new workshop lead?** Edit `data/workshop-leads.json` only. Site re-renders automatically.
- **You finished a Waiting item?** Cross it off here, move it to Done.
- **I shipped a Next item?** I move it to Done with the commit ref.
- **An idea pops?** Drop into Backlog. We prioritize at the next session.

---

*Single source of truth for the build. The site itself is the deliverable; this file tracks the road there.*

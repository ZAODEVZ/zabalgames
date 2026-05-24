# ZABAL Games - Running TODO

> The live state of the build. Updated as commits land. See `docs/research/701-canonical-state.md` for the canonical event-level decisions; this file tracks the actual build / launch tasks.

**Last updated:** 2026-05-23

---

## [DONE]

Repo + content moved over from `bettercallzaal/bettercallzaalwebsite` + `bettercallzaal/ZAOOS` research:

- `9fd55d3` - initial repo move: site, brand context, launch kit, db schema, 9 research docs, README, LICENSE, gitignore, farcaster.json stub, icon asset
- `96e5149` - `llms.txt` at root (the July prompt, 331 lines, any harness)
- `901996d` - `.claude/skills/zabal-games/SKILL.md` + index.html `#ideas` section reworked to "The Context File"
- `e0fb310` - OG share card SVG, robots.txt, sitemap.xml, Confirmed Workshop Leads section (Tyler/Magnetic as 001), `#projects` section with the 8 adoptable projects
- `d3c04eb` - `docs/snap-design.md` (zlank no-code + custom Vercel-function path)
- `c9911dc` - workshop leads moved to `data/workshop-leads.json` + JS render; JSON-LD Event + WebSite schema added to `<head>` for SEO; this TODO file
- `fd42ea0` - `/lead.html` standalone workshop-lead recruitment page (form + Cal.com slot + confirmed-leads grid); `/projects.html` standalone page with all 8 adoptable projects; `assets/style.css` shared stylesheet for the new pages; nav links + sitemap updated
- `55ebc02` - catch remaining `/zabalgames` channel refs that the earlier perl missed when followed by punctuation
- `3d35f8c` - `vercel.json` with cleanUrls (so `/lead` and `/projects` work without `.html`) + short-URL redirects (`/spec`, `/context`, `/todo`, `/snap`, `/kit`, `/brand`) + `text/markdown` content-type on `/llms.txt`; index.html title cleanup (dropped stale ` - BetterCallZaal` suffix)
- `13554b5` - **custom Snap endpoint (Path B) at `/api/snap/signup`** - Vercel Edge serverless function. GET serves Farcaster Frame with 4 role buttons (Builder / Workshop Lead / Audience / Mentor), POST handles tap + forwards to Formspree as stub backend + returns confirmation Frame with full-site + /zabal link buttons. Verified live: GET 200, POST 200. Paste the URL into the launch cast and Farcaster auto-renders the in-cast Snap.

BCZ side (separate repo, BCZ PR #11 merged):
- `zabalgames.html` -> redirect to `zabalgames.com`
- `zabalgames-*.md` deleted (moved here)
- BCZ homepage card links straight to `zabalgames.com`

---

## [WAITING] - blocked on Zaal

Items I can finish in ~5 min each once you hand me the input.

| # | Blocker | What you do | What I do once unblocked |
|---|---------|-------------|--------------------------|
| W1 | **OpenAI API key** | Share in chat (or env var); I use once + you rotate after. | Generate the Zabal connector NFT art (1080x1080) from the `docs/launch-kit.md` section 6 prompt. Push to `assets/connector.png`. Send file path. |
| W2 | **Lu.ma calendar URL** | Create "ZABAL Games Season 1 - June Workshops" calendar on lu.ma. Grab the embed URL. | Swap the placeholder in `index.html #workshops` left card for the real Lu.ma iframe. |
| W3 | **Cal.com event-type URL** | Create "ZABAL Games Workshop Slot" event type, 30-min slots, June availability. Grab the embed URL. | Swap the placeholder in `index.html #workshops` right card for the real Cal.com iframe. |
| W4 | **Farcaster manifest signatures** | Open Farcaster mini-app dev tools, sign accountAssociation for `zabalgames.com` with FID 19640. Send me the three values. | Drop into `.well-known/farcaster.json` so the mini app embeds in Warpcast. |
| W5 | **Supabase project URL + anon key** | Create project, run `db/schema.sql`. Send URL + anon key. | Wire into the form config in `index.html`. Then build the custom Snap (path B). |
| W6 | **Vercel Deployment Protection off + TLS cert** | Vercel -> Settings -> Deployment Protection -> Disabled. Wait for TLS auto-provision. | Visual QA pass on the live site, fix any deploy-only issues. |
| W7 | **Magnetic portal + Zabal connector live** | Together with Tyler - create the portal, set up the connector as the anchor magnet, mint URL. | Add "Enter via the Connector" CTA in hero + workshops section. Link out to Magnetic. |
| W8 | **Intro video URL** | Record 60-90s "what is ZABAL Games", upload to YouTube. Send URL. | Embed in the hero of `index.html`. |
| W9 | **Adopt-list confirmation** | Review the 8 cards in `index.html #projects` (also in `llms.txt`, `docs/research/701-canonical-state.md` Part 4). Tell me what to add or cut. | Update the JSON + the page + the canonical doc in one commit. |
| W10 | **Zlank Snap published** | 10 min in `zlank.online` per `docs/snap-design.md` Path A. Get the `/s/[uuid]` URL. | Add the Snap URL to the launch cast copy in `docs/launch-kit.md` and to `index.html` (above-the-fold CTA). |
| W11 | **OG PNG** | Open `assets/og-card.svg` in browser, screenshot 1200x630, save as `assets/og-card.png`. Tell me. | Swap `<meta property="og:image">` to point at the PNG so X / LinkedIn show a real preview. |

---

## [NEXT] - what I build next without any blockers

Ordered by leverage. I can pick these off in parallel to your unblocking.

| # | Build | Why | Est. effort |
|---|-------|-----|-------------|
| ~~N1~~ | ~~Custom Snap (path B) scaffold~~ | DONE - serving proper in-cast Snap JSON v2.0 + HTML fallback (commits `9526388` + `c2e716e`). Farcaster's caster doesn't probe `/api/snap/signup` with snap+json Accept though - so we ALSO have a zlank-hosted template (next row) which Farcaster auto-recognizes as a Snap URL. | done |
| ZLANK | **Zlank template** - `bettercallzaal/zlank` PR [#63](https://github.com/bettercallzaal/zlank/pull/63) adds a "ZABAL Games signup" partner template (4-option poll + links + share + confetti). Once merged + Zaal publishes via zlank.online, the resulting `/s/[uuid]` URL is what casts on /zabal will properly render as an in-cast Snap. | awaiting merge + publish |
| RESEARCH | `/research.html` - browsable index of the 9 research docs, curated reading order per role. Commit `0ad028b`. | done |
| PROJ-JSON | `data/adoptable-projects.json` - the 8 adoptable projects as data. Schema mirrors workshop-leads.json. Now 9 projects (#09 = WaveWarZ-Base Finals settlement surface). Ready for projects.html / index.html #projects to migrate to dynamic render next pass. | data shipped, render pending |
| WW-FINALS | **WaveWarZ-Base = Finals voting protocol** (replaces Respect 1p1v). Decision locked. Wrote `docs/research/720-wavewarz-finals-mechanic.md` with three design options + integration sketch + 3-month timeline. Added Part 12 to canonical-state Doc 701. Updated llms.txt voting + WaveWarZ sections. Built `/finals.html` page with the 72h timeline + tech delivery plan + fallback. Added project #09 to adoptable list. Tech delivery: Sam + Arthur ship Base contracts June, mainnet July, real Finals August. | architecture locked; tech build queued for Sam + Arthur |
| N2 | **Polish `#format` / `#showwork` / `#bigpicture` sections** - currently carry pre-Magnetic framing. Update to reflect Magnetic + connector + the two surfaces. | The launch cast drives traffic here. Stale framing weakens conversion. | ~1 hour |
| ~~N3~~ | ~~`/lead` standalone page~~ | DONE in commit above. | done |
| ~~N4~~ | ~~`/projects` standalone page~~ | DONE in commit above. | done |
| N5 | **Hero banner using the SVG OG card** - embed `assets/og-card.svg` as a visual element in the hero (currently text-only). | Adds visual impact above the fold. | ~15 min |
| N6 | **`canonical-state.md` Part 4 update** - rewrite the adoptable-projects list to match the version on the site (+ link to it). | The canonical doc and the site shouldn't drift. | ~10 min |
| ~~N7~~ | ~~Vercel deploy config~~ | DONE in `3d35f8c`. Six short URLs live: /spec /context /todo /snap /kit /brand. | done |
| N8 | **Telegram preview link unfurl** - add `<meta name="telegram:channel">` + verify the OG works in Telegram (it usually does with PNG, not SVG). | Most launch DMs will route through Telegram. | ~10 min |

---

## [BACKLOG] - good ideas, not yet prioritized

- `/finals` page - August Finals format explainer + voting walkthrough.
- `/winners` page - empty for Season 1, fills as Finals concludes.
- Daily-stats Snap (the kmac.eth + Empire Builder template from Doc 654) - "today's ZABAL Empire stats" as a one-click cast.
- Live-signup counter on the hero - pulls from Supabase, shows "N builders signed up so far."
- `/dashboard` for confirmed workshop leads to manage their slot (login via Farcaster).
- Per-mentor pages (`/mentor/[handle]`) once the August Finals roster locks.
- Auto-clip flywheel for workshop videos (Doc 654 / 629 - auto-generate shorts from Magnetic-hosted recordings).
- A `/podcast` or RSS feed of all workshop recordings.
- Multi-language: at minimum, JA + ZH translations of the announcement copy.

---

## How to use this file

- **You added a new workshop lead?** Edit `data/workshop-leads.json` only. Site re-renders automatically.
- **You finished a Waiting item?** Cross it off here, move it to Done.
- **I shipped a Next item?** I move it to Done with the commit ref.
- **An idea pops?** Drop into Backlog. We prioritize at the next session.

---

*Single source of truth for the build. The site itself is the deliverable; this file tracks the road there.*

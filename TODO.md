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
- (this commit) - `/lead.html` standalone workshop-lead recruitment page (form + Cal.com slot + confirmed-leads grid); `/projects.html` standalone page with all 8 adoptable projects; `assets/style.css` shared stylesheet for the new pages; nav links + sitemap updated

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
| N1 | **Custom Snap (path B) scaffold** - `api/snap/signup/route.js` Vercel serverless function + `package.json` + `vercel.json`. Backend stub via Formspree until Supabase lands. | Even without Supabase, the Snap can ship - Formspree captures the role-tap as a form submission. When Supabase is up, swap one line. | ~2 hours |
| N2 | **Polish `#format` / `#showwork` / `#bigpicture` sections** - currently carry pre-Magnetic framing. Update to reflect Magnetic + connector + the two surfaces. | The launch cast drives traffic here. Stale framing weakens conversion. | ~1 hour |
| ~~N3~~ | ~~`/lead` standalone page~~ | DONE in commit above. | done |
| ~~N4~~ | ~~`/projects` standalone page~~ | DONE in commit above. | done |
| N5 | **Hero banner using the SVG OG card** - embed `assets/og-card.svg` as a visual element in the hero (currently text-only). | Adds visual impact above the fold. | ~15 min |
| N6 | **`canonical-state.md` Part 4 update** - rewrite the adoptable-projects list to match the version on the site (+ link to it). | The canonical doc and the site shouldn't drift. | ~10 min |
| N7 | **Vercel deploy config** - `vercel.json` with redirects (`/spec` -> `/docs/research/701-canonical-state.md`, etc) for nice shorter URLs. | Shorter URLs are more shareable in DMs. | ~15 min |
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

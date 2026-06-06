# ZABAL Gamez

> The ZAO's 3-month Build-A-Thon - a build event for the Farcaster/ZAO ecosystem, not a video-game contest. Season 1: **June 2026 (workshops) -> July (open build) -> August (Finals)**. Free, open to anyone, any harness.

Live at **zabalgamez.com**. Cast channel: **/zabal** on Farcaster.

This repo is the single source of truth for ZABAL Gamez: the live site, the Vercel edge functions, the Farcaster Mini App, the content data, and the research/brand docs that shaped the format.

> **Working on this repo?** Start with **[CLAUDE.md](./CLAUDE.md)** - canonical current state, storage, conventions, and what's left. Dated files under `docs/` are point-in-time records; trust CLAUDE.md where they disagree.

---

## Quick links

- **Working context (canonical):** [CLAUDE.md](./CLAUDE.md)
- **Site:** [index.html](./index.html) -> deploys to zabalgamez.com
- **API:** [api/README.md](./api/README.md) - the edge functions, per-endpoint contracts
- **Recordings workflow:** [docs/recordings-workflow.md](./docs/recordings-workflow.md) - how a session becomes a `/recordings/N` page
- **Help with recordings:** [docs/recordings/CONTRIBUTING.md](./docs/recordings/CONTRIBUTING.md) - corrections, clips, or a recording (no dev experience needed)
- **Decision log:** [docs/research/701-canonical-state.md](./docs/research/701-canonical-state.md) - what's locked / open
- **Brand identity:** [docs/brand-context.md](./docs/brand-context.md)
- **Docs index:** [docs/README.md](./docs/README.md)

---

## What ZABAL Gamez is

A Farcaster-creator onboarding event for the ZAO ecosystem: bring Farcaster-active builders into ZAO by having them ship something real, in public, with a ZAO mentor in their corner. Three tracks so everyone has a lane - **artist** (musical/visual), **builder** (developer/aspiring), **creator** (media/distribution).

**Three months:**

- **June - workshops.** Builders across the ecosystem each record a ~30-minute session on the tools they have built. The library lands on the site (`/recordings`) and Magnetiq.
- **July - open build month.** Anyone ships a build for ZABAL, ZAO, or WaveWarZ. The build IS the application.
- **August - the Finals.** The strongest builds get a ZAO mentor embedded as a teammate for a build + promote window, governance vote, and a live reveal. Every finalist wins.

**Registration** is the ZABAL Gamez collectible on Magnetiq (`app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`): claim it to follow the season, unlock the ZAO brand mementos, and access the open UGC upload.

---

## Architecture

Static HTML pages + zero-build Vercel **edge functions**, also published as a **Farcaster Mini App**. No framework, no build step - every page is hand-written HTML with inline `<style>` and inline scripts, sharing `assets/style.css` and `assets/miniapp.js`.

```
zabalgames/
├── *.html                          # the pages (see "Pages" below)
├── recordings/1.html, 2.html, 3.html   # per-recording landing pages
├── finals/live.html
├── .well-known/farcaster.json      # Mini App manifest (signed for zabalgamez.com)
├── assets/                         # logo-gamez.png (brand mark), icon.png,
│                                   #   embed-card-gamez.png, miniapp.js, style.css, vendor/
├── api/                            # Vercel edge functions (Upstash Redis) - see api/README.md
├── lib/auth.mjs                    # Quick Auth JWT verification (shared by the endpoints)
├── data/                           # JSON content + config (see "Data" below)
├── scripts/                        # validate.mjs + content tooling (see "Scripts" below)
├── docs/                           # launch kits, brand, positioning, recordings/, research/
├── db/schema.sql                   # Postgres schema for the JULY submission gallery (not yet wired)
├── CLAUDE.md                       # canonical working context - read first
└── vercel.json                     # cleanUrls, redirects, headers
```

## Pages

| Page | What it is |
|---|---|
| `/` (`index.html`) | Home - positioning, tracks, live workshop schedule, one-tap join, top share CTA |
| `/info` | All the details - full FAQ, mentor form, Cal embed, the (client-side) July submission gallery |
| `/about`, `/context` | The pitch and the context file for the season |
| `/playbook` | Builder Playbook - how to ship a July build |
| `/lead` | Lead a Workshop - self-signup (Cal.com + Formspree) |
| `/dream-leads` | Community wishlist of people to invite to teach - nominate, upvote (+1), tag on Farcaster |
| `/mentor` | Mentor signup |
| `/enter`, `/projects` | Enter the July build; adoptable projects to pick up |
| `/recordings` + `/recordings/N` | The recording library (auto-listed from `data/recaps.json`) and per-session pages |
| `/recaps` | Session recaps (one-line takeaways, share buttons) |
| `/streams`, `/today`, `/changelog` | Data streams + timeline, the daily update, and the changelog |
| `/live`, `/spaces` | What's on now; upcoming spaces |
| `/finals`, `/finals/live`, `/winners`, `/leaderboard` | The Finals, the live finals page, winners, and the activity leaderboard |
| `/links`, `/share`, `/install` | All links; the share target; load the season's context into an AI tool |
| `/graph`, `/research`, `/farcaster-batches`, `/mindful`, `/p` | ZAO graph explorer, research library, the builders, mindful moments, player profile |

## Recordings system

Every workshop is recorded, corrected, clipped, and published so missing it live never means missing it.

- **Workflow:** [docs/recordings-workflow.md](./docs/recordings-workflow.md) - the end-to-end pipeline (capture -> caption -> correct -> chapter -> publish).
- **Per-session pages:** `recordings/N.html` - embedded player, clickable chapters, transcript link, share buttons. New ones auto-appear on the `/recordings` hub and `/recaps` once added to `data/recaps.json`.
- **Transcripts:** committed under `data/streams/zabal-games-workshops/raw/transcripts/`.
- **Brand spelling:** `data/transcript-corrections.json` + `scripts/fix-transcript.mjs` fix the recurring ZAO-vocab mishearings. The preemptive version for Descript Underlord is [docs/recordings/recording-vocabulary.md](./docs/recordings/recording-vocabulary.md); the caption look is [docs/recordings/caption-style-prompt.md](./docs/recordings/caption-style-prompt.md).
- **Contribute (no dev experience):** [docs/recordings/CONTRIBUTING.md](./docs/recordings/CONTRIBUTING.md) and the GitHub issue forms in `.github/ISSUE_TEMPLATE/`.

## API (edge functions)

Zero-dependency Vercel edge functions over **Upstash Redis** (REST). Verified writes use a Farcaster Quick Auth JWT checked server-side (`lib/auth.mjs`); everything no-ops gracefully if the KV env vars are absent. Full per-endpoint contracts in **[api/README.md](./api/README.md)**.

- **Presence / activity:** `track`, `present`, `activity`
- **Participation (verified):** `join` (one-tap join + counter), `dream-vote` (the `/dream-leads` +1), `register` + `commit-watcher` (GitHub-as-submission), `bonfire-ask`, `snap/signup`
- **Leaderboards:** `leaderboard` (our data, for Empire Builder), `empire-leaderboard` (reads our tokenless empire's board back from Empire Builder)
- **Notifications + cron:** `webhook` (Mini App add/notify tokens), `notify` (admin sender), `daily-cast` (cron), `workshop-reminders` (cron)

## Data

`data/*.json` is the content + config source of truth (curated files, not a DB):

- `workshop-leads.json` - the live schedule (drives the homepage + `/live`)
- `recaps.json` - the recap library + recording links (drives `/recaps` and the `/recordings` hub)
- `dream-leads.json` - the curated Dream Leads board
- `transcript-corrections.json` - the recordings brand-vocab glossary
- `data-streams.json`, `streams/` - data streams + chronological timeline
- `changelog.json`, `daily-updates.json` - changelog + daily updates
- `people.json`, `mentors.json`, `adoptable-projects.json`, `bonfire-graph.json`, `mindful.json` - directories + content

## Storage

- **Activity backend** runs on **Upstash Redis** over REST. Env: `KV_REST_API_URL` + `KV_REST_API_TOKEN` (the Upstash Vercel integration injects these; code also accepts `UPSTASH_REDIS_REST_*`). Connected and live.
- **July submission gallery** (`info.html`) is a separate, not-yet-wired Postgres store (`db/schema.sql`). Revisit before July.
- **Signups** go to Formspree (`/f/mlgvvoyd`); **scheduling** to Cal.com (`cal.com/zabal-gamez/workshop-session`). Neither needs the DB.

## Scripts

- **`node scripts/validate.mjs`** - the pre-push gate. Checks every tracked `*.json` parses, every `api/*.mjs` passes `node --check`, every classic inline `<script>` compiles, and the manifest decodes to `{"domain":"zabalgamez.com"}`. A SessionStart hook runs it `--quiet` at the start of every session. **Run it before every push.**
- `fix-transcript.mjs` - apply the brand-vocab glossary to a transcript/caption file.
- `add-daily.mjs`, `aggregate-dispatches.mjs`, `pull-data-streams.mjs`, `push-to-bonfire.mjs` - content tooling.

## Develop + deploy

```bash
python3 -m http.server 8000   # local preview at http://localhost:8000
node scripts/validate.mjs     # run before every push
```

Deploys on Vercel zero-config: push to `main`, Vercel builds and deploys to zabalgamez.com. Git conventions (branch per unit of work, confirm the PR is open before pushing, never reuse a merged branch) are in [CLAUDE.md](./CLAUDE.md).

---

## Related

- **/zabal** channel - https://farcaster.xyz/~/channel/zabal
- **The ZAO** - the 100+ member Farcaster community ZABAL Gamez serves
- **Magnetiq** - https://app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez

## License

MIT - see [LICENSE](./LICENSE).
</content>

# ZABAL Gamez

> The ZAO's 3-month Build-A-Thon - a build event for the Farcaster/ZAO ecosystem, not a video-game contest. Season 1 ran **June to August 2026 and is complete**. Free, open to anyone, any harness.

**Season 1 result (settled 2026-08-30):** three champions, one per track - **n3m** (artist), **ghostmintops** (builder), **uniquebeing404** (creator). 31 recorded workshops, 31 projects from 15 people, six finalists across three battles, every finalist paid from a 500 USDC pool. Full record at [`/results`](https://zabalgamez.com/results).

**Season 2** is named and has no dates, format or theme. Do not add any until they are set.

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

- **June - workshops.** Builders across the ecosystem each recorded a ~30-minute session on the tools they had built. 31 sessions, all on the site (`/recordings`).
- **July - open build month.** Anyone shipped a build for ZABAL, ZAO, or WaveWarZ. The build WAS the application. The board closed 2026-08-16.
- **August - the Finals.** Two finalists per track, six people, three head-to-head battles on WaveWarZ in the last week of August. Finalists were people, not projects. Each battle was decided on three signals - an open poll on X from the WaveWarZ account, the charts from live trading, and a judges panel - and all three champions took all three. Every finalist was paid.

> An earlier design (mentor embedded as a teammate, a 24h build + promote window, a governance vote, WaveWarZ-Base market settlement) is described in older docs. **It was superseded and never ran.**

**Registration** for Season 1 ran through the on-site flow (`/submit`, `/submissions`). Season 1 closed on 2026-08-31 and is settled; see `/results`.

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
├── db/schema.sql                   # DEAD - drafted for a Supabase gallery that was removed. No consumer.
├── CLAUDE.md                       # canonical working context - read first
└── vercel.json                     # cleanUrls, redirects, headers
```

## Pages

| Page | What it is |
|---|---|
| `/` (`index.html`) | Home - positioning, tracks, live workshop schedule, one-tap join, top share CTA |
| `/results` | **Season 1 results** - the three champions and the season in numbers. The canonical record. |
| `/august` | The Finals record - the six finalists, the three battles, who judged |
| `/info` | All the details - full FAQ, mentor form, Cal embed |
| `/submit`, `/submissions` | Submit a project (board stays open between seasons); the public project board |
| `/about`, `/context` | The pitch and the context file for the season |
| `/playbook` | Builder Playbook - how to ship a build |
| `/lead` | Lead a Workshop - self-signup (Cal.com + Formspree) |
| `/dream-leads` | Community wishlist of people to invite to teach - nominate, upvote (+1), tag on Farcaster |
| `/mentor` | Mentor signup |
| `/projects`, `/board` | Adoptable projects to pick up; the build board. (`/enter` and `/vote` now redirect to `/leaderboard` - the July entry and the quadratic vote are retired.) |
| `/recordings` (+ `/recordings/N`, `/recordings/fireside/N`, `/recordings/zao/N`) | The recording library, grouped by type and auto-listed from `data/recaps.json`, plus per-session pages and a machine-readable `/recordings/index.json` for agents |
| `/recaps` | Session recaps (one-line takeaways, share buttons) |
| `/streams`, `/today`, `/changelog` | Data streams + timeline, the daily update, and the changelog |
| `/live`, `/spaces` | What's on now (idle between seasons); Spaces |
| `/press` | Media kit - copy-paste boilerplate, the facts, brand assets |
| `/game`, `/play`, `/quest` | The arcade, the quick-pick, and the Season Run |
| `/finals`, `/finals/live`, `/leaderboard` | The Finals spec (carries SUPERSEDED notices), the market scaffold that never launched, and the activity leaderboard. (`/winners` redirects to `/results`.) |
| `/links`, `/share`, `/install` | All links; the share target; load the season's context into an AI tool |
| `/graph`, `/research`, `/farcaster-batches`, `/mindful`, `/p` | ZAO graph explorer, research library, the builders, mindful moments, player profile |

## Recordings system

Every workshop is recorded, corrected, clipped, and published so missing it live never means missing it.

- **Workflow:** [docs/recordings-workflow.md](./docs/recordings-workflow.md) - the end-to-end pipeline (capture -> caption -> correct -> chapter -> publish).
- **Per-session pages:** `recordings/N.html` (workshops), `recordings/fireside/N.html`, `recordings/zao/N.html` - embedded player or transcript, chapters/outline, transcript link, share buttons. Each recap carries a `type` (`workshop` / `fireside`); 31 workshops and 4 firesides are published; the `/recordings` hub groups by type and new ones auto-appear there and on `/recaps` once added to `data/recaps.json`.
- **AI index:** `recordings/index.json` (a machine-readable list of every recording) + schema.org JSON-LD on the hub, both generated by `scripts/build-recordings-index.mjs` from `recaps.json` and pointed to from `/llms.txt`. Rerun the script after editing `recaps.json`.
- **Transcripts:** committed under `data/streams/zabal-games-workshops/raw/transcripts/`.
- **Brand spelling:** `data/transcript-corrections.json` + `scripts/fix-transcript.mjs` fix the recurring ZAO-vocab mishearings. The preemptive version for Descript Underlord is [docs/recordings/recording-vocabulary.md](./docs/recordings/recording-vocabulary.md); the caption look is [docs/recordings/caption-style-prompt.md](./docs/recordings/caption-style-prompt.md).
- **Contribute (no dev experience):** [docs/recordings/CONTRIBUTING.md](./docs/recordings/CONTRIBUTING.md) and the GitHub issue forms in `.github/ISSUE_TEMPLATE/`.

## API (edge functions)

Zero-dependency Vercel edge functions over **Upstash Redis** (REST). Verified writes use a Farcaster Quick Auth JWT checked server-side (`lib/auth.mjs`); everything no-ops gracefully if the KV env vars are absent. Full per-endpoint contracts in **[api/README.md](./api/README.md)**.

- **Presence / activity:** `track`, `present`, `activity`
- **Participation (verified):** `join` (one-tap join + counter), `dream-vote` (the `/dream-leads` +1), `register` + `commit-watcher` (GitHub-as-submission), `bonfire-ask`, `snap/signup`
- **Leaderboards:** `leaderboard` (our data, for Empire Builder), `empire-leaderboard` (reads our tokenless empire's board back from Empire Builder)
- **Notifications:** `webhook` (Mini App add/notify tokens), `notify` (admin sender), `live-notify`, `live-status`

> **All Vercel crons are retired** - `vercel.json` has no `crons` block and `api/daily-cast.mjs` was deleted. `workshop-reminders`, `monthly-winner`, `commit-watcher` and `poidh-watcher` still exist as files and can be hit on demand, but nothing schedules them. The only scheduled job in the repo is the nightly KV backup in `.github/workflows/kv-backup.yml`.

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
- **`db/schema.sql` is dead.** It was drafted for a client-side Supabase submission gallery in `info.html`; that gallery, its CDN script and its placeholder keys were all removed. Nothing reads the schema. Do not reintroduce Supabase for the activity backend.
- **Backups.** `.github/workflows/kv-backup.yml` pulls the whole keyspace nightly through `/api/export`, verifies the export is structurally complete, redacts it (`scripts/redact-export.py` - this repo is public), and commits `backups/kv-latest.json`.
- **Signups** go to Formspree (`/f/mlgvvoyd`); **scheduling** to Cal.com (`cal.com/zabal-gamez/workshop-session`). Neither needs the DB.

## Scripts

- **`node scripts/validate.mjs`** - the pre-push gate. Checks every tracked `*.json` parses, every `api/*.mjs` passes `node --check`, every classic inline `<script>` compiles, and the manifest decodes to `{"domain":"zabalgamez.com"}`. A SessionStart hook runs it `--quiet` at the start of every session. **Run it before every push.**
- `build-recordings-index.mjs` - regenerate `recordings/index.json` + the hub's JSON-LD from `data/recaps.json`. Run after editing recaps.
- `fix-transcript.mjs` - apply the brand-vocab glossary to a transcript/caption file.
- **`node scripts/check-finals-render.mjs`** - 22 cases covering how `data/finals.json` renders on `/august` and `/live`. Run it after touching finals data or those two pages.
- `build-sitemap.mjs` - regenerate `sitemap.xml`.
- `ingest-recording.mjs` - scaffold a new `recordings/N.html` page.
- `redact-export.py` - strips ballots, tokens and email addresses from a KV export before it is committed. The backup workflow calls it; **never commit a raw export.**
- `add-daily.mjs`, `aggregate-dispatches.mjs`, `pull-data-streams.mjs`, `push-to-bonfire.mjs`, `resolve-pfps.mjs`, `build-crm.mjs`, `gen-posts.mjs`, `clip-picker.mjs` - content tooling.

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

## License

MIT - see [LICENSE](./LICENSE).
</content>

# ZABAL Gamez

> The ZAO's 3-month Build-A-Thon - a build event for the Farcaster/ZAO ecosystem, not a video-game contest. Season 1: **June 2026 (workshops) -> July (open build) -> August (Finals)**. Free, open to anyone, any harness.

Live at **zabalgamez.com**. Cast channel: **/zabal** on Farcaster.

This repo is the single source of truth for ZABAL Gamez: the live site, the Vercel edge functions, the Farcaster Mini App, the content data, and the research/brand docs that shaped the format.

> **Working on this repo?** Start with **[CLAUDE.md](./CLAUDE.md)** - current state, storage, conventions, and what's left. Dated files under `docs/` are point-in-time records; trust CLAUDE.md where they disagree.

---

## Quick links

- **Working context (canonical):** [CLAUDE.md](./CLAUDE.md)
- **Site:** [index.html](./index.html) -> deploys to zabalgamez.com
- **API:** [api/README.md](./api/README.md) - the edge functions (presence, join, leaderboard, notifications)
- **Decision log:** [docs/research/701-canonical-state.md](./docs/research/701-canonical-state.md) - what's locked / open
- **Brand identity:** [docs/brand-context.md](./docs/brand-context.md)
- **Docs index:** [docs/README.md](./docs/README.md)

---

## What ZABAL Gamez is

A Farcaster-creator onboarding event for the ZAO ecosystem: bring Farcaster-active builders into ZAO by having them ship something real, in public, with a ZAO mentor in their corner. Three tracks so everyone has a lane - **artist** (musical/visual), **builder** (developer/aspiring), **creator** (media/distribution).

**Three months:**

- **June - workshops.** Builders across the ecosystem each record a ~30-minute session on the tools they have built. The library lands on Magnetiq.
- **July - open build month.** Anyone ships a build for ZABAL, ZAO, or WaveWarZ. The build IS the application.
- **August - the Finals.** The strongest builds get a ZAO mentor embedded as a teammate for a build + promote window, governance vote, and a live reveal. Every finalist wins.

**Registration** is the ZABAL Gamez collectible on Magnetiq (`app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`): claim it to follow the season, unlock the ZAO brand mementos, and access the open UGC upload.

---

## Architecture

Static HTML pages + zero-build Vercel **edge functions**, also published as a **Farcaster Mini App**. No framework, no build step.

```
zabalgames/
├── index.html, lead.html, info.html, streams.html, ...  # the pages
├── .well-known/farcaster.json     # Mini App manifest (signed for zabalgamez.com)
├── assets/                        # logo-gamez.png (brand mark), icon.png, embed-card-gamez.png, miniapp.js, style.css
├── api/                           # edge functions (Upstash Redis) - see api/README.md
│   └── README.md
├── data/                          # workshop-leads.json, data-streams.json, streams/, changelog.json
├── db/schema.sql                  # Postgres schema for the JULY submission gallery (not yet wired)
├── docs/                          # launch kits, brand, positioning + research/ decision log
├── CLAUDE.md                      # canonical working context
└── vercel.json                    # redirects + headers
```

## Storage

- **Activity backend** (presence, one-tap join + counter, leaderboard, notifications) runs on **Upstash Redis** over the REST API. Env: `KV_REST_API_URL` + `KV_REST_API_TOKEN`. Connected and live. The functions no-op gracefully if the vars are absent. Details in [api/README.md](./api/README.md).
- **July submission gallery** (`info.html`) is a separate, not-yet-wired Postgres store (`db/schema.sql`). Revisit before July.
- **Signups** go to Formspree (`/f/mlgvvoyd`); **scheduling** to Cal.com (`cal.com/zabal-gamez/workshop-session`). Neither needs the DB.

## Develop + deploy

```bash
python3 -m http.server 8000   # local preview, then visit http://localhost:8000
```

Deploys on Vercel zero-config: push to `main`, Vercel builds and deploys to zabalgamez.com. See [CLAUDE.md](./CLAUDE.md) for git conventions and the pre-push validation commands.

---

## Related

- **/zabal** channel - https://farcaster.xyz/~/channel/zabal
- **The ZAO** - the 100+ member Farcaster community ZABAL Gamez serves
- **Magnetiq** - https://app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez

## License

MIT - see [LICENSE](./LICENSE).

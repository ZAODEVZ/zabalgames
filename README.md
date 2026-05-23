# ZABAL Games

> A Farcaster vibe-coding challenge for the ZAO ecosystem - streamer games crossed with a hackathon. Season 1 runs **June 2026 (workshops) -> July (open build-a-thon) -> August (Finals)**.

Live at **zabalgames.com**. Cast channel: **/zabal** on Farcaster.

This repo is the single source of truth for ZABAL Games - the live site, the research docs that shaped the format, the brand identity guide, the launch kit, and the DB schema for submissions.

---

## Quick links

- **Site:** [index.html](./index.html) -> deploys to zabalgames.com
- **Brand identity:** [docs/brand-context.md](./docs/brand-context.md) - the voice + visual guide for every ZAO brand the cohort builds for
- **Launch kit:** [docs/launch-kit.md](./docs/launch-kit.md) - paste-ready announcement posts (Farcaster, X, Telegram, newsletter), share-card image prompt, Zabal connector NFT image prompt
- **Canonical state:** [docs/research/701-canonical-state.md](./docs/research/701-canonical-state.md) - what is locked, what is open, what is being built
- **Research library:** [docs/research/](./docs/research/) - the full decision log and meeting recaps
- **Submission schema:** [db/schema.sql](./db/schema.sql) - Supabase table for the submissions board (run when the project is created)

---

## What ZABAL Games is

Not a generic hackathon. A **Farcaster-creator onboarding event for the ZAO ecosystem.** Bring hungry, Farcaster-active vibe-coders into ZAO by having them ship something real, in public, with a ZAO mentor in their corner.

**Three months:**

- **June - workshops.** Builders across the ecosystem record one ~30-minute session each on the tools they have built. The whole library lands in one place.
- **July - open build-a-thon.** Anyone ships a build for ZABAL, ZAO, or WaveWarZ. The build IS the application. Builders point any AI harness at one machine-readable context file describing every ZAO project + state.
- **August - the Finals.** The strongest builds get a ZAO mentor embedded as a teammate for a 24h build + 24h promote window + ZAO governance vote + live reveal stream. Every finalist wins.

Hosted on two surfaces (per the [2026-05-22 Tyler call](./docs/research/714-tyler-call.md)):

- **Magnetic portal** - the workshop video library, entry/onboarding, polls, UGC submissions. Tyler Stambaugh's Magnetic platform.
- **This Farcaster mini app** - the explainer and front door. Light. Links out to Magnetic, the spaces sessions, and the live calendar.

**Entry** is the Zabal connector NFT - the anchor magnet on Magnetic. Collect it, you are in. Auto-drops the road-to-ZAOstock entry alongside.

---

## Repo structure

```
zabalgames/
├── index.html                       # the live site
├── .well-known/
│   └── farcaster.json               # Farcaster mini-app manifest (TODO: sign accountAssociation)
├── assets/
│   └── icon.png                     # the Z icon
├── db/
│   └── schema.sql                   # Supabase submissions schema
├── docs/
│   ├── brand-context.md             # brand identity per ZAO brand
│   ├── launch-kit.md                # paste-ready announcement posts + image prompts
│   └── research/                    # the decision log
│       ├── README.md                # index of the research docs
│       ├── 630-season-1-spec.md     # long-form Season 1 spec
│       ├── 630-player-context-bundle.md  # the player context bundle (sealed at T+0)
│       ├── 646-clanker-promote.md   # Clanker + Empire Builder optional token mechanic
│       ├── 654-empire-v3-meeting.md # the calendar pivot meeting with Jordan/yerbearzerker
│       ├── 695-context-prompt.md    # the July machine-readable context prompt research
│       ├── 701-canonical-state.md   # canonical state - the truth doc
│       ├── 714-tyler-call.md        # Tyler Stambaugh / Magnetic meeting recap
│       ├── 714-tyler-transcript.md  # full transcript
│       └── 719-jordan-meeting.md    # Empire Builder v3 follow-up
├── README.md                        # you are here
├── LICENSE                          # MIT
└── .gitignore
```

---

## Develop + deploy

Pure static HTML - no build step. Edit `index.html`, push to `main`, Vercel deploys.

```bash
# Local preview
open index.html

# Or any static server
python3 -m http.server 8000
# then visit http://localhost:8000
```

### Deploy

Designed for Vercel zero-config static deploy:

1. Connect this repo to Vercel.
2. Point Vercel project at the repo root (no framework, no build command).
3. Add the `zabalgames.com` domain in Vercel project settings.
4. Push to `main` deploys.

### Farcaster mini app

`/.well-known/farcaster.json` is the mini-app manifest. The `accountAssociation` block currently has placeholder values. To activate the mini app on Farcaster:

1. Sign the manifest with Zaal's FID (19640) - either via the Farcaster mini-app dev tools or the manual signing flow.
2. Replace the `TODO_HEADER` / `TODO_PAYLOAD` / `TODO_SIGNATURE` fields.
3. Push.

Until signed, the site is browsable on the web but does not appear as a Farcaster mini app.

---

## What needs to happen before launch

Detailed list in [docs/research/701-canonical-state.md - Part 9](./docs/research/701-canonical-state.md). Short version:

- **Sign the Farcaster manifest** (above).
- **Wire the workshop calendar** - swap the placeholder embeds in `index.html` `#workshops` for the real Lu.ma calendar URL and the Cal.com slot-picker URL.
- **Wire the submissions board** - create the Supabase project, run `db/schema.sql`, paste URL + anon key into `index.html`. Until then the form shows an error fallback.
- **Run the [launch-kit.md](./docs/launch-kit.md) posts** across all four channels this weekend.
- **Generate the share card + Zabal connector NFT art** from the prompts in launch-kit.md.

---

## Related

- **/zabal** Farcaster channel - https://farcaster.xyz/~/channel/zabal
- **BetterCallZaal** - https://bettercallzaal.com - Zaal's site, where ZABAL Games originated
- **The ZAO** - the 188-member gated Farcaster music community ZABAL Games serves
- **Magnetic** - https://getmagnetic.com (or wherever Tyler's portal lives) - the workshop library / entry portal

---

## License

MIT - see [LICENSE](./LICENSE).

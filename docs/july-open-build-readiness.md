# July open-build readiness - the submission bar, hybrid judging, and how to ship a strong build

> One reference for the July phase of ZABAL Gamez: what a valid submission is, how builds are
> judged, and what separates a strong build from a finished one. Pulls the policy from
> `docs/audit-decisions-2026-06-04.md` and the canonical state; the live source of truth for any
> mechanic is `CLAUDE.md` + `api/README.md`. Brand: no emojis, no em dashes.

July is the open build: anyone ships something real for the ZAO ecosystem, in public, and the
build is the application. Three tracks (artist, builder, creator), no waitlist, any harness.

---

## The submission bar (hit all four by T+24h)

A submission is valid when it has all four:

1. **A live deployed URL** - the thing actually runs (Vercel free tier is fine).
2. **A public GitHub repo** - MIT licensed.
3. **A 60-second demo video** - Loom, YouTube, or self-hosted.
4. **A cast on /zabal** announcing the ship, tagging @bettercallzaal.

Plus maintain at least one **show-your-work visibility mode** during the build: a live stream,
recorded screen sessions uploaded within the hour, public AI prompt logs every 1-2 hours, or
frequent build casts every 1-2 hours. Building in public is part of the bar, not a bonus.

## How you register (and prove the repo is yours)

Registration is wallet-keyed and auth-free (any harness), with an optional Farcaster link:

- Register your build at `/enter` (wired to `api/register.mjs`). Many repos per builder are
  allowed, tracked per identity.
- **Prove ownership** by committing your wallet address into the repo - in a `ZABAL.md` file at
  the repo root (preferred) or the README. The commit-watcher checks this at the trust boundary
  (`api/commit-watcher.mjs`) before it trusts or pushes a registration; unverified repos are
  skipped, never pushed. (Source: `docs/audit-decisions-2026-06-04.md` #4.)
- **Identity anchor:** FID when present. `register.mjs` stays wallet-keyed and auth-free, but an
  optional Quick Auth token links the wallet to a verified FID. An absent or invalid token never
  blocks a submission.

## How builds are judged (hybrid)

Per the 2026-06-04 audit decision (#3), July judging is a **two-stage hybrid**:

1. **Community vote shortlists.** The Farcaster / app leaderboard surfaces the builds the
   community rates - this narrows the field.
2. **Mentors pick the final winners, per track.** Human judgment decides the winners within
   each of the three tracks, from the community-shortlisted set.

This ties back to the workshop idea of pulling the app leaderboard into Empire Builder. Note:
the leaderboard is left open to gaming for now because nothing of value rides on raw rank
(it shortlists, it does not award) - revisit only if abused.

## What you walk away with (the payout shape)

The cash is the floor, not the comp:

- The **top 8 finalists** share the **$500 USDC** pool (per-finalist allocation confirmed before
  the Finals).
- The **top 16** get **$ZABAL** token rewards.
- The **top 3** take a **Champion** commemorative collectible.
- **Every finalist who ships** keeps a **Finisher** collectible.
- The strongest builds get curated into the **August Finals**, each paired with a ZAO mentor.

Beyond the prizes: a repo you keep, the credit, ZAO distribution, Respect (soulbound governance
weight), and ongoing on-chain economics where the build plugs into ZAO rails (e.g. the WaveWarz
trade-volume cut that keeps flowing to a builder). Most programs give a one-time prize and
nothing after; here the ongoing economics and ownership are the draw.

## How to ship a strong build (not just a finished one)

Hitting the four-item bar makes a submission valid. These make it win:

1. **Tie into a real ZAO rail, do not reinvent one.** Compose with Empire Builder (leaderboards,
   boosters), Bonfire (the shared knowledge graph), Farcaster identity + Neynar, Hats, EAS,
   WaveWarz, or the /zabal channel. Composability is the point; a rail you plug into is worth
   more than identity/leaderboard plumbing you rebuilt.
2. **Pick the narrowest real wedge.** One clear user, one clear job. A small thing people
   actually use beats a broad thing nobody does. The demo should show a real person getting a
   real outcome, not a feature tour.
3. **Make it run on the free tier and stay up.** A live URL that works when a judge taps it,
   on mobile, beats a richer build that 404s or hangs. Test the cold path.
4. **Show your work the whole way.** The visibility mode is not box-ticking - frequent build
   casts and prompt logs are how the community comes to rate you in stage 1 of judging. Builds
   that were visible all month have a shortlisting advantage.
5. **Make the 60-second demo carry the build.** Lead with the outcome in the first 10 seconds
   (what changed for the user), then how. Most judging attention is the demo + the live URL.
6. **Brand-clean the public surface.** No emojis, no em dashes, no crypto jargon in user-facing
   copy ("digital creators" / "builders"); "100+" for the member count. A clean front door reads
   as a real product, not a hackathon throwaway. (See the FounderCheck lesson: if your materials
   read as the wrong product, a judge concludes the wrong thing.)
7. **Write the ownership file early.** Drop `ZABAL.md` with your wallet in on day one so the
   commit-watcher trusts your repo from the first push - do not leave it to submission night.

## Start-here links

- How to enter + register: https://zabalgamez.com/enter
- The Playbook (the full build-and-ship guide): https://zabalgamez.com/playbook
- Projects to adopt (40+ started repos that just need a builder): https://zabalgamez.com/projects
- The Finals + how the pool settles: https://zabalgamez.com/finals
- The machine-readable context for any harness: https://zabalgamez.com/llms.txt

## Open items (the July build, not yet wired)

From `docs/audit-decisions-2026-06-04.md` follow-ups:
- The July submission gallery + the hybrid judging mechanism are a July build - the team is out
  of free Supabase project slots, so this is revisited then (`db/schema.sql` is the unwired
  Postgres schema for the gallery).
- Exposing the app leaderboard as an API to feed an Empire leaderboard + boosters; optional
  weekly NFT drops to the top of the leaderboard.

---

## Sources

- `docs/audit-decisions-2026-06-04.md` - hybrid judging (#3), ownership proof (#4), repos-per-builder (#5), FID anchor (#6), public-count (#7) - [FULL]
- `.claude/skills/zabal-games/SKILL.md` - the four-item submission bar + visibility modes (canonical) - [FULL]
- `finals.html` + `docs/newsletter-week1-2026-06-08-FINAL.md` - the payout shape (top 8 / 16 / 3, Finisher collectible, mentor pairing) - [FULL]
- `CLAUDE.md` + `api/README.md` - the live source of truth for register / commit-watcher behavior - [FULL]
- `docs/year-of-the-zabal-playbook.md`, `enter.html`, `llms.txt` - the build path + start-here surfaces - [FULL]

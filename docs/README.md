# docs/ - ZABAL Gamez Launch Library

> All non-research docs for ZABAL Gamez Season 1. Research docs (numbered 1xx-7xx) live in `docs/research/` instead.

> **Canonical current state + conventions: [/CLAUDE.md](../CLAUDE.md).** Most files
> below are dated, point-in-time records (kits, briefs, recaps) - useful history, but
> trust CLAUDE.md for what's true now. Newer references: `positioning-2026-05-29.md`,
> `foundercheck-reframe-2026-05-29.md`, `validation-launch-kit-2026-05-29.md`,
> `magnetiq-zabal-gamez-collectible-page.md`, `cal-luma-workflow.md`.

## Launch-day (2026-05-26 ship)

For the announce push:

| File | Use when |
|---|---|
| [announce-day-kit-2026-05-27.md](announce-day-kit-2026-05-27.md) | The single file to open the morning of launch. Pre-flight + cast schedule + DM templates + troubleshooting. |
| [announce-posts-2026-05-26.md](announce-posts-2026-05-26.md) | The 4 platform-specific posts (X / @thezao / @ZAOFestivals / /zabal). Paste-ready. |
| [media-kit-2026-05-26.md](media-kit-2026-05-26.md) | For media + partners. Hard facts table, brand colors, FAQ, brand-glossary corrections, pre-approved quotable phrases. |
| [sponsor-outreach-2026-05-26.md](sponsor-outreach-2026-05-26.md) | Cold-pitch template for v1 prize-pool sponsors. Replies route to info@thezao.com. |
| [luma-events-templates-2026-05-26.md](luma-events-templates-2026-05-26.md) | Lu.ma event creation templates for Tyler + Thy Rev workshops. Date + topic placeholders for Zaal to lock. |
| [logo-brief-2026-05-26.md](logo-brief-2026-05-26.md) | 10 logo direction options for designer. |
| [adrian-call-prep-2026-05-25.md](adrian-call-prep-2026-05-25.md) | Prep for the Adrian (diviflyy / Empire Builder) call about a Jun 2 technical workshop. |

## Ongoing reference

| File | What it is |
|---|---|
| [brand-context.md](brand-context.md) | The brand spine for every ZAO ecosystem brand. Voice + visual + audience + status per brand. |
| [launch-kit.md](launch-kit.md) | Asset + copy bundle: SVG OG card prompt, intro video script outline, Zlank Snap URL, signup CTA copy. |
| [mentor-outreach-2026-05-24.md](mentor-outreach-2026-05-24.md) | DM scripts + target list for mentor recruitment. |
| [workshop-roster.md](workshop-roster.md) | The guest tracker - status funnel + outreach cadence (Asked on / Reply / Next nudge). Single source of truth for who we are talking to. |
| [warm-dm-kit-2026-06-02.md](warm-dm-kit-2026-06-02.md) | Paste-ready warm DMs: date-lock the 8 confirmed leads (assumptive scheduling), confirm the 6 lined up, plus a reusable /zabal attendee cast. |
| [snap-design.md](snap-design.md) | Zlank no-code Snap design + custom Vercel-function path. |
| [zao-video-editor-descript-reference.md](zao-video-editor-descript-reference.md) | What Descript + Underlord can do (prompt-driven editing, captions, vocabulary, visual layers), captured from the recordings work as reference for the ZAO video editor project. |

## Validation / FounderCheck

The validation arc - feeding ZABAL Gamez through Jonathan Colton's FounderCheck and acting on it.

| File | What it is |
|---|---|
| [foundercheck-reframe-2026-05-29.md](foundercheck-reframe-2026-05-29.md) | The first run (3.35 BLOCK) reframed - why it scored the wrong product, and how to re-run it correctly. |
| [foundercheck-context-brief-2026-05-29.md](foundercheck-context-brief-2026-05-29.md) | The evidence brief to paste into FounderCheck so it scores against real traction, not assumptions. |
| [foundercheck-session2-2026-06-02.md](foundercheck-session2-2026-06-02.md) | Session 2 log (7.2 RETHINK) - challenges to the assessment + the sharpened experiment + teaching writeup. |
| [foundercheck-score-raising-2026-06-02.md](foundercheck-score-raising-2026-06-02.md) | What to actually do to move the score now - each lever mapped to a runnable action + the evidence instrument. |
| [cold-dm-experiment-2026-06.md](cold-dm-experiment-2026-06.md) | The 72h cold-outreach scorecard - pre-committed decision matrix + the tracker to fill. |
| [validation-launch-kit-2026-05-29.md](validation-launch-kit-2026-05-29.md) | The DM templates, announce cast, and objection handlers for the experiment. |
| [foundercheck-recap-for-jonathan-2026-06-02.md](foundercheck-recap-for-jonathan-2026-06-02.md) | Recap to send Jonathan: how FounderCheck moved the project, update 1 vs update 2. Doubles as workshop teaching material. |

## Research library

[research/](research/) - numbered research docs:

| Doc | Topic |
|---|---|
| 630 | Player context bundle |
| 646 | Clanker promote optional Finals mechanic |
| 654 | Empire Builder V3 |
| 701 | Canonical state (the canonical event-level decisions) |
| 714 | Tyler Stambaugh call recap (Magnetiq) |
| 720 | WaveWarZ Finals voting mechanic (Hybrid Option B) |
| 730 | Africa CDN routing (Cloudflare migration plan) |
| 750 | Builder registration OAuth flow (SUPERSEDED - see `api/register.mjs` + `api/commit-watcher.mjs` for what shipped) |

(Full list at [research/README.md](research/README.md).)

## Live + audited?

All docs above pass the no-fabrication audit (2026-05-26 commit chain
ff239da -> 99539af -> bcaff76 -> 687c0fc -> c1f3f8d -> 2dcf87c -> f97e833).

If you find a stale fact: open a PR or DM @bettercallzaal.

## How to find what you need

- **About to launch?** -> `announce-day-kit-2026-05-27.md`
- **Need to cast?** -> `announce-posts-2026-05-26.md`
- **Sponsor/press asking?** -> `media-kit-2026-05-26.md` + `sponsor-outreach-2026-05-26.md`
- **Workshop lead just confirmed?** -> `luma-events-templates-2026-05-26.md`
- **Mentor outreach?** -> `mentor-outreach-2026-05-24.md`
- **Designing the OG card / logo?** -> `logo-brief-2026-05-26.md` + `launch-kit.md`
- **Understanding the ecosystem?** -> `brand-context.md`
- **Building for the Games?** -> [/llms.txt](../llms.txt) at the project root + `research/630-player-context-bundle.md`

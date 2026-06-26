# Overnight autonomous run - summary (2026-06-26)

What got built, what's waiting on you, and what's left to pick up. Everything below
was shipped as an OPEN PR for your review - nothing was auto-merged.

## Shipped this run (open PRs - review + merge)

| PR | What | Risk |
|----|------|------|
| #357 | **Build Days** surface (`/build-days` + `data/build-days.json`) - the July daily-build series | low - seeded with example dates, adjust to real calendar |
| #366 | **Bounty board** (`/bounties` + data) - open bounties front door, ties to the clip-bounty system | low |
| #367 | **Weekend schedule entries** (James, Matt Lee, Los Fomos) in `workshop-leads.json` | low - they now show on homepage/speakers/live |
| #368 | **`/grants`** - verified real funding paths (Base Builder Grants, OP Retro Funding, Base Batches...) | low - no invented numbers, all link official pages |
| #369 | **Sitemap refresh** - added 12 missing recording pages (12-24) | low - generator-driven |
| #370 | **Perf** - image dimensions (CLS) + defer presence.js | low - verification caught + skipped a marked.js defer that would have broken context.html |

Plus, outside the repo:
- **Cowork tracker cleaned: 345 -> 161 active todos** (churned 5, archived 164 stale, all reversible - `archived_at`, not deleted).
- **250 merged git branches pruned** (local + remote).
- **10 tasks added** to the tracker (6 risk-mitigation + 4 operational critical-path).

## Research produced (two workflows)

1. **Gap synthesis** (9 dimensions, 38 gaps) - full report at the task output + `scratchpad/synthesis-report.txt`.
2. **Safe-fixes ship queue** (5 dimensions) - concrete static-site fixes.

## Waiting on YOU (owner / decision - not auto-buildable)

These are the highest-impact gaps but need your action or a decision first:

1. **Confirm the Vercel env vars are live** - CRITICAL. `CRON_SECRET`, `BONFIRE_API_KEY`, `BONFIRE_ID`, `ZABAL_JUDGE_FIDS`, `GITHUB_TOKEN` all default to empty in `api/*.mjs`; the July crons + Finals registration + mentor-picks fail-closed without them. $0, dashboard action.
2. **Lock the knowledge-game mechanics** (3 TBDs in `docs/july-knowledge-game-2026-07-01.md`) before it can be built.
3. **Bonfire fallback decision** - July submissions route through Bonfire with no contingency. Accept the risk, or greenlight a fallback queue.
4. **WaveWarZ-Base contract addresses** (Sam + Arthur) - blocks the Finals market/trade view + settlement.
5. **Respect-holder pre-funding + settlement metric** - governance decisions (you + ORDAO) before Finals code.
6. **LLC + trademark** (free common-law TM now; OtoCo LLC ~$99 when revenue lands) - see ZAOOS docs 902/903.
7. **Token ticker:** normalize `$Zabal` (17x) -> `$ZABAL` (30x) for glossary consistency? Your call.

## Safe work left to pick up (greenlight any, I'll build)

From the safe-fixes ship queue - real but I stopped to avoid low-value 5am churn:
- **A11y refinements** - focus-visible on a few interactive widgets, modal `role="dialog"` on the /play game modal, aria-labels on share buttons. (Basics already covered.)
- **Mobile UX** - 44px tap targets on chips/inputs, `env(safe-area-inset)` padding, overflow-x guards.
- **First-visit copy** - late-June arrivals: "workshops wrapping up, July build starts Jul 1," surface /recordings as the catch-up path. (Date-sensitive - verify each string.)
- **og:image dimensions** across pages for cleaner social unfurls.
- **Publish queue** - 4 standard workshops (Ali, Saltorious, Dylan Yarter, topocount) need their transcript + YouTube link from you to become full pages.

## How I worked
Every build: branched off main, validated (`node scripts/validate.mjs`), left as an open PR, brand rules enforced (no emojis/em-dashes/jargon, "100+"). Research findings were verified against the real files before any change - which caught at least one bug (the marked.js defer). Nothing risky, invented, or governance/token-related was auto-built.

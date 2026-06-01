# ZABAL Gamez - July Knowledge Game (scaffold)

> Date: 2026-06-01. SCAFFOLD - owner to confirm the mechanics + fill the [TBD] gaps before
> July 1. Source of brand facts is llms.txt (the brand-by-brand section); this doc does NOT
> re-copy them - it defines the GAME and the report surface that sits on top. Trust CLAUDE.md
> and llms.txt over this where they differ. Grounded in the 05-30 meeting synthesis.

---

## What it is

July is the open build month. Alongside code, builders write REPORTS to GitHub - short,
sourced write-ups about the ZAO ecosystem. Reports are indexed into the Bonfire knowledge
graph. The game: whose reports get cited most in the agent's daily summaries. Citations are
the score. Reports can remix and cite each other across contributors.

This makes the knowledge-gathering phase a first-class, scored activity - not just code.

## Why a report game (the thesis)

- The agent's daily summaries are only as good as the source material in the graph.
- Rewarding citations rewards the reports that turn out to be the most USED, not the loudest.
- It onboards non-coders (artists, creators) into a build event - you can win on research.
- It seeds the graph that the July judge + the agent run on. The game feeds the rail.

## The kickoff asset - July 1

Ship `zabalgamez.com/llms.txt` already exists as the build prompt. For the knowledge game,
the kickoff asset is the same file PLUS a clear "report surface" (below): the open questions
worth answering per brand. [TBD - confirm: is the knowledge-game asset the existing llms.txt,
or a separate brand-assets file? Synthesis doc 784 says "LLMS.txt of all ZAO brand info/assets"
- the existing llms.txt already is that. Recommend: reuse it, add this report surface.]

---

## Mechanics (DRAFT - owner confirm each)

- **Where reports live:** a builder writes a report as a Markdown file to GitHub (their own
  repo, wallet address in an MD file per the register-server flow - project #45).
- **How they enter the graph:** the cron that turns commits into Bonfire episodes (project #45)
  also ingests report MD files as graph nodes. [TBD - confirm the cron handles reports, not
  just code commits.]
- **Scoring = citations:** the agent's daily summary cites the reports it drew from. A report's
  score = how many times it is cited across the daily summaries over July. [TBD - confirm the
  daily-summary agent emits structured citations we can count.]
- **Remix credit:** when report B cites report A, A gets citation credit. [TBD - cross-citation
  weighting: equal to an agent citation, or less?]
- **Anti-gaming:** [TBD - what stops a builder citing their own reports in a loop? e.g. self-cites
  do not score; only agent-summary citations and cross-author citations count.]
- **Reward:** [TBD - does the report game feed Respect, the $500 tiers, the commemorative
  collectible, or its own thing? Synthesis does not lock this.]

---

## The report surface (per-brand open questions)

Starter prompts for valuable reports, per ZAO brand. Source facts live in llms.txt; these are
the GAPS worth a sourced write-up. Builders can add their own. [Owner: prune/expand.]

### The ZAO (umbrella)
- A clear map of how a new independent artist actually onboards today, step by step, with the
  current friction points.
- Where The ZAO's "community first, technology second" promise shows up in the product vs where
  it does not yet.

### $ZABAL + Empire Builder
- A plain-language explainer of the multiplier stack (staking x empire) with worked examples.
- Which Empire Builder V3 read endpoints exist, what each returns, and what a builder can wire
  today without keys. (Confirm against Adrian's recorded API workshop.)

### WaveWarZ
- How the August Finals settlement actually resolves a tie or a no-trade battle.
- The current live numbers vs the dated snapshot - a sourced update from
  wavewarz-intelligence.vercel.app.

### Songjam
- What the X-scraper leaderboard measures today and what an Empire Builder leaderboard would
  measure instead. (Confirm the Empire Builder leaderboard API first.)

### POIDH
- A walkthrough of the live POIDH bounty flow on Base, end to end, from a builder's view.

### COC Concertz
- The manual content pipeline (Descript to cross-post) documented as-is, so the automation
  build (project #07) has a real spec.

### zlank + Snaps
- The current state of the JFS-signer requirement on Snap actions, and exactly what would
  change if Neynar softened it. (See the kmac/Neynar ask in the synthesis.)
- A catalog of what Snap patterns work in 2026 vs what is deprecated.

### ZAO Music
- How the DistroKid + 0xSplits + BMI stack pays out, traced through one real release.

### ZAO Festivals / ZAOstock
- A sourced timeline of the ZAOstock build to Oct 3 and where a builder could plug in.

### Fractals + Respect
- How Respect is earned, ranked, and what it gates - written for someone who has never sat a
  fractal session.

### Bonfires (the rail itself)
- How the knowledge graph ingests and surfaces a report, documented from the outside, so the
  game's own mechanics are legible to players. (Founder: Joshua.eth; architect: Carlos/Plat0x.)

---

## Open decisions (carry from the synthesis)

- **Bonfires dependency.** The graph + judging + this game all run on Bonfires. Consider a
  fallback before the whole flow depends on it. [synthesis section 6]
- **Reward coupling.** Does the report game tie into Respect / the prize tiers, or stand alone?
- **Cron scope.** Does the commit-to-Bonfire cron (project #45) ingest report MD files, or is
  that a separate ingest path?

---

## Pre-July checklist

- [ ] Confirm the knowledge-game asset = existing llms.txt (+ this report surface) or a new file.
- [ ] Lock the scoring mechanic (citation counting from the daily-summary agent).
- [ ] Confirm project #45's cron ingests reports, not just code.
- [ ] Decide the reward coupling.
- [ ] Prune + expand the per-brand report surface above with the team.
- [ ] Ship the asset + announce the game on July 1.

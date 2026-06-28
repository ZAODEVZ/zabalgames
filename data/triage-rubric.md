# ZABAL Gamez submission triage rubric

The scoring anchors for July submission review. Pairs with `/api/triage` (tier 1) and the
three-tier model in `docs/july-readiness-playbook.md` (Move 4). Keep it concrete so two
reviewers - or two LLM jurors - land in the same place.

## The three tiers

1. **Tier 1 - deterministic (`/api/triage`, automatic).** Repo valid + reachable + public,
   track is artist/builder/creator, an ownership hint (wallet / handle / ZABAL.md) exists,
   pushed recently. Output: `pass` / `review` / `reject`. Catches obvious spam for free.
2. **Tier 2 - LLM jury (optional, env-gated).** Two independent model passes score against the
   criteria below, evidence -> rationale -> score, order-swapped to reduce bias. Disagreement
   beyond 1 point routes to tier 3.
3. **Tier 3 - human (`/review`).** A person approves or rejects, especially on low-confidence
   tier-2 results or where the AI score and community signal diverge. Approval triggers the
   Unlock airdrop (see `docs/unlock-airdrop-runbook.md`).

## Criteria (score each 1-5)

### 1. Innovation / difficulty
- **5** - genuinely novel or technically hard; a real leap, not a template reskin.
- **4** - a solid, non-trivial build with a clear original angle.
- **3** - competent and useful; mostly known patterns, applied well.
- **2** - thin; a tutorial-level clone with little added.
- **1** - trivial or templated, no real work shown.

### 2. Milestone delivery (did they ship what they said?)
- **5** - shipped the stated goal and then some; it works end to end.
- **4** - shipped the core; minor gaps.
- **3** - a working slice of the goal.
- **2** - started but largely incomplete.
- **1** - little evidence of delivery against any stated goal.

### 3. Track fit
- **5** - squarely in its track (artist / builder / creator) and exemplary for it.
- **3** - in the right track but generic.
- **1** - mislabeled track or no clear fit.

### 4. ZAO-rails wiring (the season's success metric)
- **5** - wired to real ZAO rails (Bonfire, Empire Builder, Respect, WaveWarZ, POIDH, Farcaster) in a meaningful way.
- **3** - touches one rail lightly.
- **1** - standalone, no ecosystem integration.

### 5. Building-in-public + maintenance signal
- **5** - consistent public build (casts / streams / commits) and live, maintained repo.
- **3** - some public trail; repo runs.
- **1** - dropped at the deadline, no public trail, stale or broken.

## Routing

- Tier-1 `reject` -> auto-reject (with a reason the submitter can fix and resubmit).
- Tier-1 `pass` + average tier-2 >= 3.5 -> fast-track to approve in `/review`.
- Anything in between, or tier-2 disagreement > 1 point -> human review.
- Never approve a private/archived repo, a mislabeled track, or a submission with no ownership proof.

## Anti-gaming notes

- One collectible per verified identity (dedup) regardless of submission count.
- Building-in-public requirement is itself an anti-cheat: real public work is hard to fake.
- Watch for tier-2 score inflation week over week; recalibrate the anchors if averages drift up.

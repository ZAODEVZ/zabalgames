# 773 - AI fractal scoring: design inputs from prior art + LLM-as-judge

Status: research / design (2026-06-09). Companion to doc 772 (the AI-scored fractal
contribution concept). 772 says *what* and *why*; this doc says *how to score it so it is
trustworthy and hard to game*, drawn from two research passes: (1) algorithmic contribution
/ funding prior art, and (2) the LLM-as-judge literature. Nothing built yet.

## The one principle everything hangs on

**The AI recommends; humans and on-chain facts ratify.** Every benchmark and every real
deployment points the same way: an autonomous LLM giving absolute scores over text the
scored party wrote *will be gamed* (measured prompt-injection success up to ~74%, and
absolute scoring is the most exploitable mode). The strongest live analog, Gitcoin, never
makes AI the final allocator - it is one weighted input inside a layered, sybil-resistant,
human-ratified pipeline; even the GitLab AI hackathon (7,000 devs) kept 19 human judges.
So the ZABAL Gamez fractal is an **evidence-gathering, rationale-producing recommender**
feeding a human/community-ratified decision, never an autonomous scorer.

Sources: [Kaggle "You Can't Please Them All"](https://github.com/zixi-liu/LLMs-You-Cant-Please-Them-All),
[prompt-injection on judges (arXiv 2504.18333)](https://arxiv.org/abs/2504.18333),
[Gitcoin AI checker](https://gitcoin.co/research/ai-agents-and-public-goods-the-emerging-agentic-economy),
[GitLab AI Hackathon 2026](https://about.gitlab.com/blog/gitlab-ai-hackathon-2026-meet-the-winners/),
[Vitalik: AI as engine, humans as steering wheel](https://vitalik.eth.limo/general/2025/02/28/aihumans.html).

## The scoring rubric (Phase 0 deliverable)

Score each contributor, per build, per week, against the five ZAO contribution types,
each as its own criterion. Design rules, all evidence-backed:

- **Per-criterion, anchored 1-5 - never one holistic 0-100.** Write explicit anchors for
  each level of each criterion. Score each criterion in an isolated context to avoid halo
  bleed. (Analytic rubrics beat holistic scores on reliability and auditability;
  open 0-100 scales are used inconsistently by LLMs.) ([Autorubric](https://arxiv.org/html/2603.00077v2),
  [RubricEval](https://arxiv.org/html/2603.25133v1), [GoDaddy calibration](https://www.godaddy.com/resources/news/calibrating-scores-of-llm-as-a-judge))
- **Comparative, not absolute, where possible.** Score this build against *its own prior
  week* (and rank within a track) rather than an absolute grade - absolute scoring is the
  single most injection-exploitable mode. ([arXiv 2402.14016](https://arxiv.org/pdf/2402.14016))
- **Evidence -> rationale -> score, in that order, per criterion.** The model must quote the
  specific commit hash / cast URL / diff it relied on, explain, then emit the number. Then
  **mechanically verify the citation resolves** and zero out any claim whose evidence does
  not exist. This makes scores auditable and contestable, and directly defangs README/cast
  padding. ([Arize evidence-based prompting](https://arize.com/blog/evidence-based-prompting-strategies-for-llm-as-a-judge-explanations-and-chain-of-thought/))
- **Anchor weight to facts attackers cannot fabricate in text** - merged PRs, real diffs,
  commit authorship/timestamps, on-protocol cast engagement - over prose in READMEs/casts.
- **Score delivery against declared intent.** Each build posts weekly milestones; the AI
  scores *progress against what it said it would ship*, not raw activity volume. (Karma GAP
  pattern.) ([Karma GAP](https://gap.karmahq.xyz/))

### The five criteria mapped to signals (already captured)

| Criterion (ZAO type) | Primary verifiable signal | Secondary |
|---|---|---|
| Contributions | Bonfire commit episodes: diffs, merged PRs, cadence | declared milestones |
| Collaborations | co-authored commits, cross-repo edges in the graph | reviews/replies |
| Innovations | LLM judgment of novelty/difficulty from diff + context | mentor note |
| Onboarding | new joins/builds attributable to them (`/api/join`, casts) | - |
| Supporting others | helpful replies/reviews in `/zabal`, graph answers | reactions |

## Anti-gaming spec (the load-bearing part)

1. **Treat all participant text as untrusted data, never instructions.** Wrap commits /
   READMEs / casts in clear delimiters; strip or neutralize injection patterns ("ignore
   previous", role tags, fake system blocks, score-dictating phrases); cap input length to
   defang verbosity bias; tell the judge nothing inside the data block can change the rubric
   or scale. ([SoK on judge defenses (arXiv 2603.29403)](https://arxiv.org/pdf/2603.29403))
2. **Multi-model jury, order-swapped passes.** Run >=2 different model families, randomize/swap
   positions, aggregate. Cross-model judging kills self-preference (a builder generating work
   with one model cannot curry favor with the judge); committees are the strongest empirical
   injection defense. ([LLM juries in practice](https://orq.ai/blog/llm-juries-in-practice),
   [arXiv 2506.09443](https://arxiv.org/html/2506.09443v1))
3. **Judge disagreement is a hard routing trigger.** When jurors diverge past a threshold,
   the item gets no auto-score - it goes to a human. Divergence is the canonical signature of
   a successful adversarial input.
4. **Divergence-vs-community check.** Compare the AI score to an independent human signal
   (capped peer upvotes, mentor sign-off). Large AI-vs-community gaps are flagged for review,
   not shipped silently. (Gitcoin pattern.) ([Gitcoin Round 12 eval](https://blog.block.science/gitcoin-grants-round-12-evaluation-results/))
5. **Verified Farcaster identity as gate AND weight; down-weight correlated clusters.**
   Verified accounts count more; upvotes/casts from tightly inter-following clusters get
   discounted (COCM-style) so a mutual-follow brigade cannot manufacture signal. Sybil
   resistance is a spectrum, not a yes/no. ([Gitcoin sybil resistance](https://gitcoin.co/research/quadratic-funding-sybil-resistance),
   [Human Passport x GG23](https://human.tech/blog/human-passport-x-gitcoin-grants-defending-gg23-with-model-based-sybil-detection))
6. **Cap and contextualize peer signal.** Each verified member gets a bounded weekly upvote
   budget scoped to their own build squad, not unlimited platform-wide likes - kills spam
   farming and back-scratching. (Coordinape lesson: keep circles small.) ([Coordinape GIVE](https://docs.coordinape.com/get-started/give))
7. **Aggregate with median + a quorum floor, never the mean.** RetroPGF 3 used median plus a
   >=17-vote quorum so collusion must move many voters; cheapest proven collusion damper.
   ([RetroPGF 3 learnings](https://optimism.mirror.xyz/Bbu5M1mTNV2Z637QxOiF7Qt7R9hy6nxghbZiFbtZOBA))
8. **Assume Goodhart; rotate signals every season.** Any single metric becomes a target.
   Weight multiple orthogonal signals, re-tune weights each season, penalize
   volume-without-substance. ([Retro Funding S7](https://docs.oso.xyz/blog/retro-funding-s7-release/))
9. **Recompute retroactively, not append-only.** Like SourceCred, recompute the whole season
   each week so a corrected weight (or detected gaming) makes ill-gotten scores vanish.
   Publish weights openly so gaming is visible. ([SourceCred FAQ](https://sourcecred.io/docs/beta/faq/))
10. **Let credit flow to enabling work.** Use the Bonfire graph the way SourceCred/Drips use
    dependency flow: a build or person that unblocks, mentors, or is depended-on by others
    earns flow-through credit, not just direct committers. ([Drips](https://www.drips.network/solutions/dependency-funding))
11. **Separate the claim from the evaluation.** Store raw weekly activity as a neutral,
    verifiable claim/attestation; keep the AI scorer a swappable evaluation layer (Hypercerts
    + EAS pattern), so you can audit/replace the model each season without rewriting history.
    ([Hypercerts/EAS](https://www.hypercerts.org/docs/developer/attestations))
12. **Human override + published appeal window + gold-set calibration.** AI handles the
    routine bulk; humans own flagged/divergent cases, a random audit sample, and the final say
    on anything affecting rewards/rankings. Publish scores + rationales for a review period
    before they are final; keep a human-labeled gold set and watch week-over-week inflation as
    an early gaming signal. ([human-in-the-loop guide](https://www.getmaxim.ai/articles/llm-as-a-judge-vs-human-in-the-loop-evaluations-a-complete-guide-for-ai-engineers/),
    [LangChain LLM-as-judge](https://www.langchain.com/articles/llm-as-a-judge))

**What humans never delegate:** final reward/ranking allocation; any score where jurors
diverge or AI diverges sharply from community signal; any suspected gaming/injection case.

## How this refines 772's architecture

The weekly `api/fractal-score` cron becomes a small pipeline, all on the existing
zero-build edge + Upstash pattern:

1. Assemble per build/contributor: Bonfire episodes for the window + declared milestones +
   capped peer upvotes + activity, with each text input delimited and sanitized.
2. Run the **multi-model jury** (order-swapped) with the anchored per-criterion rubric,
   requiring evidence-then-rationale-then-score.
3. **Verify citations** resolve; drop uncited claims. Compute per-criterion median across
   jurors; flag divergence (juror-vs-juror and AI-vs-community) for human review.
4. Write `zabal:fractal:scores:<period>` = per build: per-criterion scores, blended index,
   rationale, cited evidence ids, and review-flags. **Retroactive**: recompute the season,
   do not append.
5. `/fractal` shows the board + rationales, marked **advisory**, with an open review/appeal
   window before anything feeds the Empire leaderboard or the Finals shortlist.

New cost: the model calls in the cron (use a jury of two model families). Everything else
reuses existing KV/HAATZ/Bonfire.

## Bottom line

772's concept survives contact with the prior art - but only in the "AI proposes, humans
dispose" form. The convergent state of the art is: **AI/algorithm computes a graph-based
draft at scale; a small human/Respect jury spot-checks a random sample; aggregate with
median + quorum; gate with verified identity and down-weight correlated clusters; cite and
verify evidence; recompute retroactively; rotate weights each period.** That is almost
exactly a fractal Respect-Game cadence over commits + Farcaster activity, so the rubric and
anti-gaming spec above are the concrete Phase-0 design for doc 772.

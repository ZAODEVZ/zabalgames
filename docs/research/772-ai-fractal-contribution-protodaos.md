# 772 - ZABAL Gamez proto-DAOs: AI-scored fractal contribution

Status: research / proposal (2026-06-09). Not built. Sketches a way to take the ZAO
Respect Game / fractal pattern and run an AI-and-algorithm version of it over the
ZABAL Gamez builds, so contribution to each "proto-DAO" can be measured continuously
and at scale, not only by weekly human peer-vote.

## The idea in one line

Each ZABAL Gamez build (and the small team forming around it) is a **proto-DAO**. Keep
the fractal shape - a regular, public contribution evaluation - but let an **AI plus a
few hard algorithmic signals** score contribution to each proto-DAO, instead of relying
only on human peer consensus, which does not scale to dozens of builds.

## Background: the two things we are fusing

1. **The ZAO Respect Game / fractal** (see `/recordings/zao/1`, doc 701, and Optimism
   Fractal's Respect Game + ORDAO). Weekly, people split into groups of up to six, share
   four-minute contribution updates, and reach a consensus ranking (level 6 down to 1)
   that is submitted on chain as soulbound Respect. It is peer-judged, capture-resistant,
   and legitimate - but it is human-bandwidth-bound (small groups, one weekly window) and
   it measures the *person's pitch*, not the *build's actual output*.

2. **ZABAL Gamez already streams the build's actual output** into structured stores:
   - `api/commit-watcher` (cron) reads each registered public repo and pushes new commits
     into the **Bonfire knowledge graph** as episodes (doc 784). Ownership is proven by a
     wallet in `ZABAL.md`/README, so a repo cannot be claimed by a non-owner.
   - `api/register` + `api/builds` hold the builds (repos per wallet/FID, per track) -
     the proto-DAO registry.
   - `api/build-vote` holds the community demand signal per repo.
   - `api/leaderboard` + `api/activity` + `api/present` hold "showing up" signals (casts,
     shares, signups) per FID, already fed into the $ZABAL Empire leaderboard.
   - HAATZ gives us Farcaster identity + verified addresses for any FID, keylessly.

The gap: nothing today turns that raw build output into a *contribution score*. The Respect
Game scores people in a room; the Finals are decided by `build-vote` (demand) plus
`finals-picks` (mentor taste). Neither reads what was actually built. That is the gap an
AI fractal fills.

## What "AI determines contribution" means here

A weekly job assembles, per proto-DAO (build) and per contributor, everything the season
already captured for that window, and asks an LLM (Claude) to score it against a fixed,
public rubric - the same five contribution types the ZAO Respect Game already uses:

| ZAO contribution type | Signal the AI reads (already in our stores) |
|---|---|
| Contributions | Bonfire commit episodes: what shipped, diffs summarized, cadence |
| Collaborations | co-authored commits, cross-repo edges in the graph, replies/reviews |
| Innovations | LLM judgment of novelty/difficulty from the commit + repo context |
| Onboarding | new builders/joins attributable to them (`/api/join`, casts) |
| Supporting others | helpful casts/replies in `/zabal`, reviews, answering in the graph |

The LLM returns a **structured result per contributor**: a 0-100 score per type, a blended
Contribution Index, and a one-paragraph rationale citing the specific commits/casts it used.
The rationale is the point - it makes an otherwise black-box score auditable, the way a
fractal group's ranking is legible to the room.

Hard algorithmic guardrails wrap the LLM so it cannot be talked into a number:
- commit ownership already verified by `commit-watcher` (no proof, no score);
- `build-vote` demand and `leaderboard` activity are quantitative inputs the LLM cannot
  override beyond a bounded weight;
- raw line-count is deliberately *not* a driver (the LLM judges substance, and a cap stops
  commit-spam farming);
- one identity per FID (HAATZ), so sockpuppets do not multiply a person's footprint.

## Why AI + algo rather than pure peer vote

- **Scale.** Twenty to fifty builds cannot be peer-ranked in four-minute rounds. The AI
  reads all of them every week.
- **Continuous, not a single window.** Commits and casts arrive all week; the AI scores the
  whole stream, not just who showed up to the call.
- **Reads the build, not the pitch.** Counteracts the popularity/charisma bias of pure
  `build-vote`.
- **It complements, it does not replace.** Human Respect and mentor `finals-picks` stay the
  legitimacy layer; the AI fractal is a fast, broad first pass and a tiebreak/justification
  signal.

## How it feeds the season

The weekly Contribution Index becomes one more input, never the sole authority:
- a public **fractal board** per track (like the builds board), showing each build's index
  and the AI's rationale;
- a bounded contribution to the **$ZABAL Empire leaderboard** (alongside the existing
  social-action points), so building, not just posting, earns standing;
- an advisory **shortlist signal for the Finals**, shown next to `build-vote` (community)
  and `finals-picks` (mentors) - the three together are the hybrid judging.

## Architecture (on the rails we already have)

Nothing here needs a new stack; it is the same zero-build edge + Upstash + cron pattern.

1. **`api/fractal-score` (cron, weekly).** Reads `zabal:builds`, pulls each build's recent
   Bonfire episodes + `build-vote`/activity signals, calls Claude with the rubric, writes
   `zabal:fractal:scores:<period>` (per build: index, per-type scores, rationale, the
   commit/cast ids cited). KV-sentinel idempotent like `daily-cast`. No-ops if the AI key
   or KV is absent.
2. **`GET /api/fractal` (read).** Open read of the latest period's scores for the board.
3. **A `/fractal` page** rendering the board + rationales, plus a feed into the Empire
   leaderboard format we already expose.
4. **Env:** an LLM key (Anthropic) for the cron; everything else reuses existing KV/HAATZ.

The only genuinely new dependency is the model call in the cron. Claude (e.g. an Opus/Sonnet
tier) is the natural fit and matches "the build is the application."

## Risks / open questions (decide before building)

- **Legitimacy.** People trust peer-earned Respect; a score from an algorithm has to earn
  trust. Mitigation: fully public rubric + per-score rationale + human override, and frame
  it as *advisory* until it has a track record. It should never silently overrule the
  Respect Game or mentors.
- **Gaming the judge.** Builders will try to write commits/casts "for the AI." Mitigation:
  ownership proof, bounded weights, substance-over-volume rubric, and divergence checks
  (flag when AI score and community `build-vote` strongly disagree for a human look).
- **Model bias / hallucination.** The rationale must cite real episode ids; a score with no
  citable evidence is dropped.
- **Cost + cadence.** Weekly batch keeps token cost trivial; do not score on every commit.
- **Privacy.** Only public signals (public repos, public casts, on-chain) - same posture as
  the rest of the activity model.
- **Relationship to on-chain Respect.** Open question whether the AI index ever mints
  anything, or stays an off-chain advisory index. Recommend off-chain to start.

## Phasing

- **Phase 0** - lock the public rubric (the five types + guardrails); confirm we can read
  per-build Bonfire episodes for a window. No scoring yet.
- **Phase 1** - weekly `fractal-score` cron writing scores + rationales; a read-only
  `/fractal` board marked "advisory." Nothing downstream depends on it.
- **Phase 2** - feed a bounded amount into the Empire leaderboard and show the index beside
  `build-vote`/`finals-picks` on `/finals` as a third signal.
- **Phase 3** - explore a true hybrid with the human Respect Game (AI surfaces candidates
  and evidence; humans confirm), and decide the on-chain question.

## Bottom line

We already capture the build's real output (commit-watcher -> Bonfire) and the community's
demand (build-vote) and the mentors' taste (finals-picks). An AI fractal is the missing
fourth signal: a continuous, legible, capture-bounded read of *contribution to each
proto-DAO*, modeled on the ZAO Respect Game but scaled by AI. Build it advisory-first,
keep humans as the legitimacy layer, and let the rationale carry the trust.

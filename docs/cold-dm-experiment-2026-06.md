# Cold-DM validation experiment - ZABAL Gamez (June 2026)

The 72h cold-outreach test that moves the FounderCheck gate from VALIDATE to GO. This is the
operational scorecard: the decision rules are pre-committed (per FounderCheck Session 2,
`docs/foundercheck-session2-2026-06-02.md`), so the result reads itself. Fill the tracker as
DMs go out and signups land.

## Hypothesis
Cold Farcaster builders (FarHack / Agentic Bootcamp alumni, not in ZAO orbit) will convert on
the differentiator (real community + mentor + ongoing stake) with a tiny first ask (one free
30-min workshop).

## The ask + attribution
- Ask: one free 30-min workshop (RSVP), recorded. Never "commit 3 months."
- DM lands on `zabalgamez.com/?src=cold-dm` so site joins are tagged `source: cold-dm`
  (stored by `/api/join`); workshop RSVPs come via the per-session Luma links. Tally both here.

## Decision matrix (pre-committed - do not move the goalposts)
| Outcome | Verdict | Meaning |
|---|---|---|
| RSVP 10+ AND attendance 50%+ AND 1+ ships | **GO** | Cold channel works - scale it |
| RSVP 10+ AND attendance 50%+ AND 0 ships | **Iterate activation** | Pull exists, output is broken - do NOT scale outreach yet; run the first-ship sprint |
| RSVP 10+ AND attendance <50% | **Iterate messaging/commitment** | Interest without follow-through - wrong hook or wrong ask |
| RSVP <7 (any) | **Warm-only for now** | Cold pull unproven - double down on existing community, find a colder wedge |

## Confidence rules (N=30 is directional, not conclusive)
- **Decisive:** >=10 RSVP = signal (act on it); <=5 RSVP = signal (warm-only).
- **Middle zone (5-9 RSVP):** inconclusive - run a second batch of 30 before concluding.
- **Kill criteria:** <5 RSVP across two batches (60 DMs) = stop cold outreach; the
  effort-to-pull ratio is not there.

## Activation prescription (only if the verdict is "iterate activation")
The failure mode is "inspired but paralyzed." Fix with a **first-ship sprint**:
- 48h window from workshop end.
- A scoped starter project (not open-ended).
- Async check-in at 24h.
- Ship-or-blockers call at 48h.

## July-dropout predictor (the other open gap)
Track **second engagement**: did they do anything after the first workshop - attend a second
session, post in `/zabal`, or ask a question? One-and-done in June predicts a ghost in July.

## Tracker
Tag **builder type** (empire / snap / agent / music / other) - even at N=30, a skew (e.g.
8/10 RSVPs are agent builders, 0 music) is a targeting signal worth having.

| # | Handle | Builder type | Alumni of | DM sent | RSVP | Attended | 2nd engagement | Shipped | Notes |
|---|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | | |
| 2 | | | | | | | | | |
| 3 | | | | | | | | | |
| 4 | | | | | | | | | |
| 5 | | | | | | | | | |
| 6 | | | | | | | | | |
| 7 | | | | | | | | | |
| 8 | | | | | | | | | |
| 9 | | | | | | | | | |
| 10 | | | | | | | | | |

_(Extend to 30 rows - same columns. Builder type: empire | snap | agent | music | other.
Alumni of: FarHack | Bootcamp | other.)_

## Results rollup (fill after 72h)
- DMs sent: __ / 30
- RSVPs: __ / 30 (rate __%)
- Attended: __ / __ RSVPs (rate __%)
- 2nd engagement: __ / __ attendees
- Shipped in week 1: __
- By builder type (RSVP): empire __ / snap __ / agent __ / music __ / other __
- **Verdict (from the matrix): ____**
- Next action: ____

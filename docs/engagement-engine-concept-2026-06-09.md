# Concept: The ZABAL Gamez Engagement Engine

Status: brainstorm / for review. Not built. Dated 2026-06-09.
Purpose: a shareable writeup so folks can react before we commit to building it.

If you only read one line: turn the build-a-thon into a visible game where
doing things earns things, scored by AI, live this June and July, so we drive
more participation now instead of waiting for the August Finals to be the only
moment that counts.

---

## The idea in one paragraph

A live, AI-scored engagement engine for the season. An AI/algo watches what
people already do (build in public, help each other, bring new folks in, make
and share content) and rewards that participation as it happens. The reward is
a stack, not one thing: collectibles people earn, $ZABAL leaderboard standing,
Respect, a bounded weight toward the Finals prize, and on-chain attestations
that prove what you did. The home base is a single /play page: what to do,
your progress, your collectibles, the live board.

## Why now

The Finals are in August. Between now and then the risk is a quiet middle: a
few people build, most watch. An engagement layer gives everyone something to
do and something to earn every week of June and July, not just at the end. It
also rewards the work that usually goes unrewarded (helping others, onboarding
people) which is exactly the work that grows a community.

## What we already have to build on

Most of the plumbing exists. The new piece is the AI scoring layer.

- Leaderboard / $ZABAL empire board (XP can feed it) - wired.
- activity / track / join endpoints (the raw engagement signals) - live.
- commit-watcher cron (GitHub commits as build proof) - live.
- Magnetiq magnet (the collectible / registration surface) - live.
- HAATZ / Farcaster identity (who did what) - live.
- The genuinely new work: an AI layer that reads activity and casts and
  assigns XP, badges, and rationale.

---

## Decisions made so far

These came out of an initial brainstorm. Flagging them so reviewers know what
is settled vs open.

1. Priority: drive more participation NOW (June / July), not just polish the
   August Finals.
2. AI autonomy: split by stakes. AI runs fully autonomous on the fun,
   reversible layer (XP, collectibles, leaderboard). A human or Respect check
   stays on the high-stakes layer (Finals prize weight, permanent
   attestations). This keeps AI maximal where gaming it does not matter and
   keeps a human in the loop where it does.
3. Reward all four engagement types equally as first-class:
   - Building in public (commits + casts about your build)
   - Helping others (replies, reviews, answering questions)
   - Onboarding people (bringing new builders in)
   - Creating and sharing (clips, art, ads, remixes)
4. Home base: a /play quests page.
5. Horizon: a working prototype live this season.

---

## The reward stack

Being explicit about what is a collectible vs an entitlement, since all of
these are in play.

- Collectibles - the evolving season piece plus badges plus event drops
  (fun, AI auto-mints the low-stakes ones).
- $ZABAL leaderboard - XP feeds the empire board we already have.
- Respect - top contributors get Respect (human / fractal confirmed, high
  stakes).
- Finals prize weight - cumulative XP converts to a bounded weight toward the
  Finals (human ratified).
- On-chain attestation - milestone badges are EAS attestations under the
  hood, so they are portable, verifiable proof, not just art.

The neat unification: a single badge can be all three at once. The collectible
people see, the attestation that is verifiable, and the thing that carries
prize weight. The split-by-stakes rule then just decides which badges the AI
can mint alone (event drops, streaks, first ship) versus which need a human
nod (anything carrying prize weight or Respect).

---

## Collectible menu (ideas, not yet chosen)

Mix and match rather than pick one.

### 1. The evolving season collectible (the spine)
One per participant, mints free on first action, and visibly levels up as XP
accrues. This is the Magnetiq magnet, made dynamic: same art language, gains
rings / glow / rank as you climb. Bronze, Silver, Gold, Finalist tiers. One
thing to chase all season, and it doubles as your season ID. Low stakes, so AI
upgrades it freely.

### 2. Milestone badges (the achievements)
Distinct, claimable proofs for crossing a line, mapped onto the four reward
axes so the set itself teaches people what to do:
- First Ship - first commit picked up by commit-watcher
- Open Builder - built in public 5 days (commit plus cast)
- Glue - helped / reviewed / answered 10 times (the help axis most systems
  forget to reward)
- Recruiter - onboarded a new builder who then ships
- Signal - a clip / ad / remix that traveled
- Streak - 3 / 7 / 14 days present

### 3. Per-event drops (the "I was there")
A small claimable for each workshop attended, each camp shipped, Day 0,
Finals. Cheap, frequent, and they double as attendance proof. yerbearserker
Jun 1 could be drop number 001.

### 4. Track-flavored variants
Same badge, three art skins by track (artist / builder / creator), so a Glue
badge looks different for an artist vs a builder. Cheap way to make the set
feel personal and on-brand.

---

## The /play page (rough shape)

One destination that answers three questions at a glance:
- What can I do right now to earn? (the quest list, per track)
- Where do I stand? (my XP, my rank, my collectibles)
- What is everyone else doing? (the live board, recent drops)

Quests are just named, scored versions of the four engagement types. Some are
one-time (First Ship), some are repeatable (help someone), some are timed
(this week's workshop).

---

## Open questions for reviewers

These are the calls we want input on before building.

1. Chain and who pays gas. Base is the obvious home. Free-to-claim (we sponsor)
   drives participation hardest but costs us. Gasless claim via a relayer is a
   middle path. What is the appetite for spend here?
2. Mint-on-earn vs claim-on-visit. Auto-mint is effortless but we pay for
   inactive wallets. Claim-on-visit is cheaper and gives people a reason to
   come back to /play. Lean?
3. Does the spine collectible replace or sit beside the Magnetiq magnet?
   Current lean: it IS the magnet, evolved.
4. How aggressively should AI score quality vs count? Counting actions is
   gameable; judging quality (was this cast / help actually useful) is the
   point of using AI, but it is harder and needs guardrails.
5. Anti-gaming. Even on the low-stakes layer, what stops farming (spam casts,
   fake help, sock-puppet onboards)? Rate limits, identity (HAATZ), and AI
   quality scoring all help, but we should name the threat model.
6. Which collectible options from the menu do we actually ship for the
   prototype, given the season-live horizon? Smallest version that still feels
   like a game.

---

## Suggested smallest first prototype

Not a decision, just a starting point to react to. The leanest thing that is
still a game:
- /play page with the quest list and a live XP board (reuses the existing
  leaderboard).
- AI cron that reads activity plus commits plus /zabal casts and awards XP
  with a one-line rationale.
- Three milestone badges to start (First Ship, Glue, one event drop), claimed
  on /play, gasless on Base.
- Everything high-stakes (prize weight, Respect) deferred to a human review at
  Finals time.

Everything else (the evolving spine, track variants, full badge set) layers on
once the loop is proven.

# July goal: 200 builders, multiple submissions each

Set 2026-07-04 by Zaal. This doc is the honest math and the machine behind it.
Live tracker: the goal bar on /submissions (counts distinct builders across the
season intake feed, approved submissions, and public WIP drafts).

## The goal, precisely

- 200 distinct people submit at least once in July.
- The real bar: MULTIPLE submissions each - the target behavior is repeat
  shipping, not one-and-done. A WIP draft counts as being in the game; the
  draft-then-publish flow is deliberately two submissions worth of touches.
- Measured from real activity only (intake feed + /api/submissions). No
  manual counts, no vanity numbers.

## Where we start (2026-07-04, honest)

- Season feed: 1 builder (ghostmintops, via POIDH).
- Site traffic: 951 visitors / last 30 days (+260%), top referrer farcaster.xyz.
- Community: 100+ members, 17 June workshops recorded, 8 arcade games with
  fresh empty July boards, Season Run live.
- So the gap is roughly 200x on builders. That is not a tweak - it needs a
  repeatable acquisition loop, not a better landing page.

## The funnel math

At a strong 5% visitor-to-submitter conversion, 200 builders needs ~4,000
July visitors - about 4x the current monthly rate. Two ways to close it,
run BOTH:

1. **Seed drops (doc 957 decision 5):** one Farcaster drop per ~3-4 days in
   July - a new playable thing with a wallet-connect moment. Each drop has
   pulled ~100 wallet-connected users elsewhere in this ecosystem. 6-8 drops
   = the reach side of the math. Drop inventory already built: Season Run,
   /wins wall, each arcade game with its beat-my-spot casts, WIP drafts
   themselves ("come comment on my build").
2. **Conversion floor-lowering (shipped 2026-07-04):** WIP drafts remove the
   "it is not finished" excuse - the single biggest reason people do not
   submit. Post a half-baked thing, get comments, publish when ready. Every
   draft is public with a comment thread and an ask-for-feedback cast baked in.

## Repeat-submission mechanics (the "multiple each" part)

- Draft -> comments -> publish = two events per builder minimum, by design.
- One small merged PR = one submission (the standing rule) - PRs are naturally
  serial.
- Monthly game boards + Season Run XP give a reason to come back that is not
  another form.
- POIDH bounties + clip-to-earn pay per piece, not per person.

## Weekly ladder (check every Friday on the /submissions bar)

| Week | Builders (cumulative) | What carries it |
|------|----------------------|-----------------|
| Jul 1-6 | 10 | First drops (Season Run cast, arcade boards), WIP launch |
| Jul 7-13 | 50 | Drop cadence + workshop-lead network activation |
| Jul 14-20 | 110 | Build-days daily casts (needs #496 data + #504 env vars) |
| Jul 21-31 | 200 | Compounding: every builder's shares recruit the next |

If a Friday check is >30% behind the ladder, the fix is another drop plus a
direct ask to the 100+ member community, not more site features.

## What blocks the ladder today (owner queue)

- #504 judging env vars - daily-cast cron cannot fire without them.
- #496 build-days July data - the daily drumbeat surface is empty after Jul 5.
- The 100+ member direct ask - one group-chat message from Zaal is worth more
  than any feature: "post one WIP draft this week."

## Shipped for this goal (2026-07-04)

- WIP drafts end-to-end: draft:true submissions are public, render with a WIP
  badge at their permalink, carry the existing Farcaster-verified comment
  thread, and publish into review via owner token or verified FID.
- /submissions goal bar: live count of distinct builders vs 200 + total
  submissions + repeat-builder count, from real feeds only.
- Works-in-progress rail on /submissions + "Save as WIP draft" on /submit.

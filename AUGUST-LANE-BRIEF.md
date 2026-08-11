# ZABAL Games August Lane - Brief

Focus: **mentor pods, finals, and formatting.**

## Ground first (read before doing anything)
- `~/Documents/ZAO OS V1/research/business/2137-zabal-gamez-august-concept-options/README.md`
- that folder's `MENTOR-PAIRING-CORE.md`, `MENTOR-CRITERIA-TEMPLATE.md`, `MENTOR-OUTREACH-DRAFTS.md`, `FINAL-SATURDAY-COPY.md`

## Locked decisions (do NOT relitigate)
- **August = the July submitters** - everyone who submitted anything in July IS the finals pool. No new gate.
- **Mentor pairing is the CORE** - every July submitter gets a ZAO mentor.
- **Pods YES, live-draft NO.**
- `FINAL-SATURDAY-COPY.md` is the definitive announcement.

## This repo (~/Documents/zabalgames) is the LIVE site
board.html, builder.html, submissions, data/builder-submissions.json + the live intake.

## The work
1. **Mentor pods**: a page/section where each July submitter sees their mentor + pod. Pull the pool from the submissions data.
2. **Finals**: the finals format + how the pool is presented.
3. **Formatting**: tighten the relevant pages for the August finals + mentor-pods structure.

## Rules
PR-only. Verify before shipping (live site). Anything PUBLIC (announcements, going live) = Zaal approves + posts, never auto-publish. Commit as Zaal (`git config user.email zaalp99@gmail.com`).

---

## STATE UPDATE 2026-07-31 (the finals model CHANGED - read this)

The August Finals model is now (Zaal's canonical copy, SUPERSEDES the mentor-pods framing above):
- August = the July open-build submitters (everyone who submitted is in). No new application.
- TWO WEEKS of weekly tasks per track (Wk1 task, Wk2 task - build it, share it).
- FINALE: top 2 per track go into 3-5 WaveWarZ battles -> one winner per track. Decided by the market, not a panel.
- Tracks: Artist (musical/visual), Builder (developer/technical), Creator (media/distribution).
- Prizes: $500 USDC pool from The ZAO festivals team, tiered so every finalist who ships gets paid + finisher collectible.
- Partners: The ZAO festivals team (prize pool), Empire Builder, WaveWarZ (battle finale), loops.house (host & platform).
- NO mentor pods in the public model anymore.

DONE today:
- /content page updated to this canonical copy (PR #586, merged). Matches finals.html.
- Loops House event (loops.house/zabal-gamez-finals) SET UP: dates in (Build Start Aug 1, Reg Aug 8, Submission Close Aug 15, Results Aug 29), The ZAO added as sponsor/judge (zaalp99@gmail.com), About/description already good. NEEDS: Zaal clicks Publish + optional banner upload.
- Strategy: doc 2164 (ZAOOS) - use Loops House as the finals BACKEND (enroll/submit/judge/winners), keep the site as front door + story + season. Site links into the event for stateful actions. Push RK for host bulk-import + Farcaster-handle enroll.

OPEN for this lane:
- Reconcile any other site pages still saying mentor-pods.
- Wire the site -> Loops House links (register/submit/winners point to the event).
- Whatever Zaal's recording adds.

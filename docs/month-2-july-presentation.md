# ZABAL Gamez - Month 2: July Open Build (presentation + readiness)

Present-ready talking points for launching Month 2, plus the reconciled "what's missing"
list. Brand rules apply: no emojis, no em dashes, "digital creators" / "builders", "100+".

---

## PART 1 - THE PRESENTATION (Month 2 kickoff)

### 1. Where we are
ZABAL Gamez is The ZAO's 3-month Build-A-Thon. June was Month 1 - the workshops.
- More than two dozen sessions delivered, from Empire Builder and Bonfire to Farcaster
  protocol, music ownership, POIDH bounties, and live AMAs.
- Every session is recorded, transcribed, and on the site at /recordings - a standing
  library you can build from at your own pace.
- Three tracks took shape: artist, builder, creator.

June got everyone up to speed. July is where you ship.

### 2. What July is
**Month 2 is OPEN BUILD.** The whole month, anyone ships a build for the ZAO / ZABAL /
WaveWarZ ecosystem. Free. Any harness - vibe-coding, no-code, design, writing, community
work all count. You do not need to be a developer.

One line: **June taught it, July builds it, August judges it.**

### 3. The path (four steps, friction removed)
1. **Register** your build at /enter - wallet + repo (or project link) + track. Two minutes.
2. **Build in public** all month - pick a visibility mode (below). This is the rule, not a
   nice-to-have.
3. **Earn as you go** - every build earns Respect in ZAO governance, win or lose.
4. **Finals in August** - the strongest builds go to the WaveWarZ Finals.

### 4. The three tracks - what you ship
- **Artist** (music / visual): a release, a mint, a visual drop, a tool for creators.
- **Builder** (developer / aspiring): an app, a Frame, a bot, an integration on ZAO rails.
- **Creator** (media / distribution): clips, threads, recaps, the story of the season.

Not sure which? The 30-second quiz at /game/build-quiz points you at a lane and a real
project to ship.

### 5. How to start today
- **Pick a project**: /projects has started ZAO projects up for grabs - adopt one and ship
  it forward, or bring your own. One tap claims it and starts you building in public.
- **Or start fresh**: the context file (/llms.txt) loads the whole ecosystem into any AI
  harness so you can build from zero.
- **Register**: /enter. That is what makes it count.

### 6. Build Days - the daily ritual
Every weekday at 4pm EST, a featured project + guest, live. Show up, build alongside, RSVP
on the day's Luma. It is the season's heartbeat - on the homepage, /live, and /today.

### 7. Building in public is the rule
Pick ONE visibility mode at registration:
1. Live stream (Twitch / Farcaster Space), or
2. Recorded screen sessions posted as you go, or
3. Public AI prompt logs, or
4. Build casts to /zabal every couple of hours.

Default is build casts - lowest barrier. Why: visibility beats procrastination, builds peer
accountability, and gives judges real evidence. It is also the anti-cheat - real public work
is hard to fake.

### 8. What you walk away with
- **Respect** in ZAO governance - everyone who ships earns it, not just winners. Recapped
  every week so it is visible, not abstract.
- **The collectible** - the ZABAL Gamez magnet, yours for taking part.
- **A real project** you own (open-source, your repo, your credit).
- **The Finals path** - prizes + the WaveWarZ market on the best builds in August.

### 9. How it gets judged (transparent up front)
Three tiers, published before you start:
1. Deterministic - is the repo real, reachable, on a valid track, with proof of ownership.
2. AI jury - scored against a public rubric (innovation, milestone delivery, track fit,
   ecosystem wiring, building-in-public).
3. Human review - a person makes the call on close ones.
The full rubric is on the site. No black box.

### 10. The support is already there
- Workshops library: /recordings + /recaps
- Builder playbook: /playbook
- Bounties: /bounties | Grants: /grants | Build ideas: /build-ideas
- Daily quests: /daily | The arcade: /game
- Mentors paired to builders for weekly check-ins.

### 11. August preview
The Finals run as a WaveWarZ prediction market on the builds - the community puts weight
behind who they think ships best, settled on Base. The spec is at /finals.

### 12. Close
- Register today: https://zabalgamez.com/enter
- See what is on now: https://zabalgamez.com/live
- The whole season, one page: https://zabalgamez.com
June taught it. July, you build it.

---

## PART 2 - WHAT'S MISSING FOR JULY (reconciled)

Reconciled against the web-standalone pivot (competitive on-site leaderboards are OUT) and
what has shipped since the playbook (`docs/july-readiness-playbook.md`).

### Already done (no action)
- /enter registration + visibility-mode field - live
- /api/triage tier-1 + data/triage-rubric.md (the quality gate) - shipped
- /projects claim flow (build-in-public cast) - shipped
- /info July submission content, /playbook, /bounties, /grants, /build-ideas - live
- Phase-aware season clock (counts June -> July -> August) - live
- Submission + profile + collectible system + /review triage - built

### Code gaps (small, buildable)
1. **build-days.json is only 5 entries** - needs the full July weekday schedule (date, 4pm,
   featured project, guest, Luma). The daily-ritual surface is wired; it just needs the data.
2. **Mentor roster display on /finals** - confirm the pairings render.
3. **Weekly Respect recap cast** - a Monday template + a way to post it (manual is fine v1).
4. **Daily commit digest to /zao** - "today's builders" one-liner (commit-watcher already runs).

Note: the playbook's streak-badge / creator-analytics / vote-count leaderboard items are
intentionally DROPPED per the no-competitive-leaderboards direction.

### Owner actions (not code - these are the real blockers)
1. **Env setup for the live submission system**: ADMIN_KEY, SUBMIT_NOTIFY_URL, GITHUB_TOKEN;
   deploy the Unlock lock on Base for the collectible airdrop.
2. **Mentor assignments**: pair each mentor to 2-3 builders + lock weekly check-in times
   (appointment-based, not first-come).
3. **Build Days schedule**: confirm the July featured-project + guest + Luma per weekday so
   build-days.json can be filled.
4. **Empire Builder EB-24** (Adrian) - tokenless empire self-serve, by July 1, else fall back
   to a hand-curated empire list.
5. **WaveWarZ-Base smoke test** (Arthur / Sam) - one fake finalist end to end before Aug 1.
6. **July 1 announcement** - the kickoff cast (draft from Part 1, section 12).

### Critical path for July 1
Triage gate (done) -> build-days.json filled -> env vars + Unlock lock set -> mentors paired
-> kickoff cast. Everything else is upgrade-in-flight.

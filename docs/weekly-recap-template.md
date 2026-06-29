# Weekly recap template - ZABAL Gamez (fill, do not rewrite)

> The reusable skeleton for the Year of the ZABAL weekly recap newsletter, modeled on
> `docs/newsletter-week1-2026-06-08-FINAL.md` and `docs/newsletter-week2-2026-06-15.md`.
> Each week: copy this file to `docs/newsletter-weekN-YYYY-MM-DD.md`, fill the `<...>`
> slots from live data (read-only), and send. The goal is a fast fill, not a rewrite.
> Brand: no emojis, no em dashes (hyphens only), no crypto/web3 jargon in framing copy,
> "100+" for member count. Sunday-night send, so the greeting is "GM ZM ... happy Sunday."

---

## Where each slot comes from (read-only data sources)

- **Per-session takeaway + recording link + YouTube** -> `data/recaps.json`. For each session
  that week, pull `title`, `presenter`, `page` (the /recordings/N link), `youtube` (if present),
  and the strongest line from `summary` / `takeaways[]`. Apply `data/transcript-corrections.json`
  vocab to any quoted text.
- **Upcoming RSVP links** -> `data/workshop-leads.json`. Every lead with a `date` in the coming
  week + a `luma_url`. Sort by date. Confirm none are already past at send time.
- **Payout numbers, July links, get-involved links** -> static (see the blocks below), confirm
  against `finals.html` if anything changed.
- **Never edit** `data/recaps.json`, `recordings/*.html`, `recordings.html`,
  `data/streams/**/transcripts/*`, `recordings/index.json` - read them to cite only.

## Fill rules (the discipline that makes each week beat the last)

1. One day header per day that had a session (group same-day doubleheaders under one header).
2. One real takeaway per session, in plain language - not the session's title restated.
3. An `[EMBED: ...]` line under each session for the announce cast/clip, plus any YouTube URL on
   its own line (Paragraph auto-embeds a bare URL on its own line).
4. Lead with a "Only have a few minutes" shortlist (the 2-3 must-see sessions: anything with
   video first, then the deepest and the most actionable).
5. Count up vs last week in the "week at a glance" close (sessions, transcripts, video, upcoming).
6. No fabrication: if a link/handle/stat is not in the data, leave the slot or flag it.

---

## Subject (pick one)

- ZABAL Gamez Week <N>: <one concrete hook from the week>
- Year of the ZABAL - Week <N>: <theme word>
- <N> weeks down. The build is the application.

## STATUS - ready vs pending before sending

Week <N> lineup (<date range>): <bold list of sessions with dates>. <Any new site features.>

### Ready now (live on the site)
- [x] **<Session - Presenter>** - transcript + recap: https://zabalgamez.com/recordings/<N>
  (repeat per delivered session; add "video + transcript + chapters" + the YouTube link when a cut exists)

### Before you send
- [ ] **Embeds:** fill each `[EMBED: ...]` line with a cast/clip URL on its own line, or delete it.
- [ ] **Subject line + send** - pick the subject and publish.
- [ ] <Any pending video cuts or transcripts still processing.>

## Body - paste this

```
GM ZM, and happy Sunday in the Year of the ZABAL.

<2-3 sentence opener: the week's arc in one breath. Reuse the "every one recorded, transcribed, and kept - miss something live and you have missed nothing" promise.>

<Theme this week (1-2 lines): the thread that connects the sessions, so the week reads as one story, not a list. e.g. "Three takes on owning your own tools." Delete if the week has no clean through-line.>

[EMBED: paste the Week <N> recap launch cast URL here, on its own line]

New here? ZABAL Gamez is The ZAO's three-month build event:

- June is workshop month, July is the open build, August is the Finals.
- Free, open to anyone, and you can bring any harness.
- Three tracks, pick your lane: artist (musical or visual), builder (developer or aspiring), creator (media and distribution).

The build is the application. Start here: https://zabalgamez.com/info

Only have a few minutes? Start here:
- Watch: <the session with video this week> - <one line>: https://zabalgamez.com/recordings/<N>
- Read, if you build: <deepest builder session> - <one line>: https://zabalgamez.com/recordings/<N>
- Read, if you create: <best creator/artist session> - <one line>: https://zabalgamez.com/recordings/<N>

<Quote of the week (optional, 1 line): one standout sentence pulled from a session transcript, attributed to the speaker. The human hook that earns the open. e.g. "The output is also the source." - Dylan Yarter>

## Day <D> - <session, short framing>

<Recap paragraph with the real takeaway from recaps.json. Open the paragraph with a track tag in plain text so a reader scans to their lane: lead with "Artist track:" / "Builder track:" / "Creator track:".> Read it: https://zabalgamez.com/recordings/<N>

<Build from this (1 line): what a reader could ship in July off the back of this session, tying the recap to the open build. e.g. "Build from this: a Frame that queries Snapchain directly." Keep it concrete.>

[EMBED: paste the announce cast or clip URL for this session, on its own line]

<repeat a "## Day <D>" block per session; group a same-day doubleheader under one header with both paragraphs + both embed lines; put any YouTube URL on its own line under its session. Link the speaker's project + handle inline in the recap paragraph, not only the recordings page.>

## <New site features this week, if any>

<One short paragraph per shipped feature, with its link inline.>

## Tap in live - this week

The week ahead, free and recorded:

- <Session with Presenter> - <Day, time> EST: <luma_url>
  (one line per upcoming dated session from workshop-leads.json, in date order)

The whole calendar is on Lu.ma: https://luma.com/zao

## What is next - July is the open build

June is the warm-up. July is the open build: anyone ships something real for the ZAO ecosystem, in public, and the build is the application. Three tracks, no waitlist, any harness. How it pays out: the top 8 finalists share a $500 USDC pool, the top 16 get $ZABAL token rewards, the top 3 take a Champion commemorative collectible, and every finalist who ships keeps a Finisher collectible. The strongest builds get curated into the August Finals, each paired with a ZAO mentor.

Get ready now:

- The Playbook - the full guide to building and shipping your project: https://zabalgamez.com/playbook
- How to enter, then register your build and watch the live builds board fill: https://zabalgamez.com/enter
- Projects to adopt - more than 40 real, started repos that just need a builder: https://zabalgamez.com/projects
- The Finals and how the prize pool settles: https://zabalgamez.com/finals
- The June schedule, with more workshops landing all month: https://zabalgamez.com/#schedule

## Get involved this week

- Built something worth teaching? Lead a workshop: https://zabalgamez.com/lead
- Want to back a builder? We are recruiting mentors for the August Finals: https://zabalgamez.com/mentor
- Know someone who should teach? Nominate them: https://zabalgamez.com/dream-leads
- Looking for something to build? Adopt a started project: https://zabalgamez.com/projects
- Come hang in the /zabal channel: https://farcaster.xyz/~/channel/zabal
- Insert Coin and grab the season collectible: https://collect.zabalgamez.com

The week at a glance: <N sessions> from <range of topics>, <X full transcripts and any video>, <any new features>, <count> more sessions on the calendar, and a $500 pool plus collectibles on the line for July.

To everyone who taught, asked, watched, or shared this week - thank you. The build is the application. <N> weeks down. <closing beat>.

BetterCallZaal from the ZAO Team
```

## Send checklist

1. New post in Paragraph (paragraph.com/@thezao).
2. Title = the subject you picked above.
3. Paste the body. Paragraph renders the `##` headers and the markdown links.
4. Fill each `[EMBED: ...]` line: replace with a cast/clip URL on its own line, or delete it. Confirm each embed and any YouTube line render as embedded media (own line, blank line above and below).
5. Quick preview - headers styled, links live, embeds loaded, no stray characters or leftover bracket text.
6. Publish + send to subscribers.

## Reference: the agent feeds (keep at the bottom)

For agents and crawlers: plain text https://zabalgamez.com/recordings.txt - structured JSON https://zabalgamez.com/recordings/index.json - the human hubs are https://zabalgamez.com/recordings and https://zabalgamez.com/speakers.

---

## Quick-start each week (the 6-minute fill)

1. Copy this file to `docs/newsletter-week<N>-<send-date>.md`.
2. List the week's sessions from `data/recaps.json`; write one day header + one takeaway + one embed line each.
3. Pull the upcoming dated sessions + Luma links from `data/workshop-leads.json` into "Tap in live"; drop any already past at send.
4. Pick the "Only have a few minutes" three (video first).
5. Update the "week at a glance" counts so the week beats the last.
6. Branch `ws/newsletter-week<N>`, `node scripts/validate.mjs`, push, PR. Owner fills embeds + sends.

## Sources

- `docs/newsletter-week1-2026-06-08-FINAL.md` + `docs/newsletter-week2-2026-06-15.md` - the two worked examples this template generalizes - [FULL]
- `data/recaps.json`, `data/workshop-leads.json`, `data/transcript-corrections.json` - the live fill sources (read-only) - [FULL]
- `finals.html` - the payout block source of truth if numbers change - [FULL]

# Workshop roster + guest tracker - ZABAL Gamez Season 1 (June)

The pipeline of workshop guests. **Confirmed + scheduled** leads are mirrored into
`data/workshop-leads.json` (which drives the live homepage schedule + the `/live` banner).
Topic ideas per track: `docs/workshop-topics-by-track.md`.

**Where a guest tells us their date (the website intake):** `/lead` - the "Pick your slot"
Cal.com booking (`cal.com/zabal-gamez/workshop-session`) or the date form ("Preferred June
date / window"). Or DM Zaal and he locks it.

**Status funnel:** delivered -> scheduled (date locked) -> confirmed (yes, no date) ->
lined up (mentioned, details TBD) -> invited (asked, awaiting yes) -> prospect (want to ask).

**Outreach cadence (fill as you send):** the actionable tables below carry `Asked on` /
`Reply` / `Next nudge` columns. Log every DM so warm leads do not fall through. Paste-ready
copy is in `docs/warm-dm-kit-2026-06-02.md`. Rule of thumb: nudge once after ~3 days of
silence, once more after ~4, then let it rest.

---

## Delivered (sessions that ran)

| Lead | Track | When | Topic |
|---|---|---|---|
| yerbearserker (Jordan Oram, Empire Builder) | builder | Mon Jun 1, 6-7am EST | Empire Builder V3 - leaderboards, Empires, token mechanics (transcript in repo) |
| Joshua.eth + Plat0x (Bonfire) | builder | Mon Jun 1, 5-6pm EST | Bonfire + the ZABAL Bonfire bot (transcript in repo) |

## Scheduled (date locked - on the live schedule)

| Lead | Track | When | Topic |
|---|---|---|---|
| Ohnahji | creator | Tue Jun 2, 5-6pm EST | His journey in live streaming - how to start and grow your own stream |

## Confirmed - needs a date (in workshop-leads.json)

DM copy for this batch: `docs/warm-dm-kit-2026-06-02.md` section A.

| Lead | Track | Topic | Note | Asked on | Reply | Next nudge |
|---|---|---|---|---|---|---|
| Tyler Stambaugh (Magnetiq) | builder | Magnetiq - the workshop library platform | "any day in June" - send the Cal link to lock |  |  |  |
| Thy Revolution (The ZAO) | TBD | 2 sessions, topics TBD | Needs topics + dates + track |  |  |  |
| Adrian (@diviflyy, Empire Builder) | builder | Empire Builder API workshop - V3 endpoints | Lock a date |  |  |  |
| Duo Do (@duodomusica) | artist | Musician on Farcaster, road to Farcon | First week of June - lock date |  |  |  |
| Jonathan Colton (@jonathancolton, FounderCheck) | creator | FounderCheck (founder validation) + propagating work on Farcaster | 2 talks - lock dates |  |  |  |
| kmac.eth | builder | Farcaster Snaps - building + shipping interactive Snaps | Lock a date |  |  |  |
| Cassie (@cassie) | TBD | Topic TBD (recruited by kmac) | Confirm topic + date |  |  |  |
| Plat0x (@plat0x) | builder | His own Bonfire builder session - building on the graph | "later this week" - lock date + Luma |  |  |  |

## Lined up - confirm details (mentioned, not yet in workshop-leads.json)

DM copy for this batch: `docs/warm-dm-kit-2026-06-02.md` section B.

| Lead | Track | Note | Asked on | Reply | Next nudge |
|---|---|---|---|---|---|
| candytoybox | TBD | Confirm topic, track, date |  |  |  |
| hurric4n3ike (Ikechi) | creator? | WaveWarZ / distribution - confirm topic + track |  |  |  |
| The Dude | TBD | Confirm handle, topic, track |  |  |  |
| saltoriuous | TBD | Confirm handle (Sagittarius?), topic, track |  |  |  |
| Kenny | TBD | Confirm handle, topic, track |  |  |  |
| nickysap | TBD | Confirm handle, topic, track |  |  |  |

## Invited - awaiting yes

_(Zaal to fill - people already asked. Add: name, track, the topic you pitched, date sent.)_

| Lead | Track | Pitched topic | Asked on | Reply | Next nudge |
|---|---|---|---|---|---|
| | | | | | |

## Prospects - want to invite (by track)

Drawn from the ZAO ecosystem / mentor-outreach list. Tracks are a first guess - adjust.
Send each the single most specific topic they would own (see topics-by-track).

**Builder**
- Arthur (Neynar) - Base / EVM patterns, smart contracts
- Sam - WaveWarZ-Base, agentic builds

**Artist**
- DCoopOfficial (Coop Records) - music release + label angle
- Riley Beans - (confirm specialty)

_(Zaal: add the rest, with a track + a one-line topic.)_

---

## Workflow when someone confirms a date

1. They book via Cal (`cal.com/zabal-gamez/workshop-session`) on `/lead`, or you lock it manually.
2. Add them to `data/workshop-leads.json` (name, org, handle, topic, format, `when`,
   `status: confirmed`, `color`, `track`, `date` + `luma_url` once locked) -> they appear on
   the homepage schedule + the `/live` banner.
3. Publish the matching Luma event (see `docs/cal-luma-workflow.md`).
4. Move them up to **Scheduled** here, then **Delivered** after the session runs.

## Progress vs target

8 sessions is the comfortable June slate. Currently: **2 delivered + 1 scheduled** (Day 1-2),
**8 confirmed** needing dates, **6 lined up**, plus prospects. Supply comfortably clears the
target - the bottleneck is locking dates, not finding guests.

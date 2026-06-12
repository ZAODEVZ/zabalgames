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

> Live production status (the dot grid) is `docs/workshop-media-tracker.md` and the internal
> `/status` page. This roster is the outreach funnel. As of 2026-06-11.

## Delivered (sessions that ran)

All have a recap page + transcript. Production state (thumbnail/YouTube/OK'd) is on `/status`.

| Lead | Track | When | Topic | Page |
|---|---|---|---|---|
| yerbearserker (Empire Builder) | builder | Mon Jun 1 | Empire Builder V3 + live build (Pt 1 & 2) | /recordings/1, /2 |
| Joshua.eth + Plat0x (Bonfire) | builder | Mon Jun 1 | Bonfire + the ZABAL Bonfire bot | /recordings/3 |
| Zaal (The ZAO) | builder | Mon Jun 1 | ZAO Fractal weekly intro | /recordings/zao/1 |
| Ohnahji | creator | Tue Jun 2 | Starting + growing your own livestream | /recordings/4 |
| Carlos / Plat0x (Bonfires) | builder | Fri Jun 6 | Bonfires + a vibe-coding masterclass (fireside) | /recordings/fireside/1 |
| Chris (Sopha) | builder | Mon Jun 8 | Building Sopha, and why curation is needed | /recordings/5 |
| Joseph Goats | artist | Tue Jun 9 | Owning your music as an independent artist | /recordings/6 |
| Will T of Web3 | creator | Wed Jun 10 | Building KFMEDIA | /recordings/7 |

## Scheduled (date locked - on the live schedule, all have a Luma)

| Lead | Track | When | Topic |
|---|---|---|---|
| Zaal | builder | Thu Jun 11, 3pm EST | WIP Meetup - ecosystem tour, ZAO Fractals |
| Cassie (Quilibrium) | builder | Fri Jun 12, 7:30pm EST | The Farcaster protocol, ins and outs - build-along |
| Adam Miller (MiDAO) | builder | Fri Jun 12, 5:45pm EST | Talking miDAO |
| Kenny (POIDH) | builder | Mon Jun 15, 4pm EST | POIDH + finalizing the ZABAL ad bounty |
| Chris Dolinsky (Vini App) | builder | Mon Jun 15, 4:45pm EST | Vini App - what he is building, for the community to try |
| Adrian / diviflyy (Empire Builder) | builder | Tue Jun 16, 12pm EST | Empire Builder V3 convo |
| Dr. Jake | creator | Tue Jun 23, 6pm EST | Growth through foundations |
| Jub Jub | builder | Sat Jun 20, 8am EST | Farcaster Batches fireside (Space) |
| Ali Tiknazoglu (@alitiknazoglu) | builder | Sat Jun 20, 11am EST | Previbecoding - learning to code with AI tooling |
| Dan Singjoy (Eden Fractal) | builder | Sat Jun 20, 12pm EST | Eden Fractal + the fractal ecosystem |
| Adrienne (GM Farcaster) | builder | Tue Jun 30, 11:30am EST | Building Warpee.eth |

## Confirmed - needs a date (in workshop-leads.json)

DM copy for this batch: `docs/warm-dm-kit-2026-06-02.md` section A.

| Lead | Track | Topic | Note | Asked on | Reply | Next nudge |
|---|---|---|---|---|---|---|
| Tyler Stambaugh (Magnetiq) | builder | Magnetiq - the workshop library platform | "any day in June" - send the Cal link to lock |  |  |  |
| Thy Revolution (The ZAO) | TBD | 2 sessions, topics TBD | Needs topics + dates + track |  |  |  |
| Duo Do (@duodomusica) | artist | Musician on Farcaster, road to Farcon | Lock a date (was first week of June) |  |  |  |
| Jonathan Colton (@jonathancolton, FounderCheck) | creator | FounderCheck (founder validation) + propagating work on Farcaster | 2 talks - lock dates |  |  |  |
| kmac.eth | builder | Farcaster Snaps - building + shipping interactive Snaps | Lock a date |  |  |  |
| Plat0x (@at0x_eth) | builder | His own Bonfire builder session - building on the graph | Lock date + Luma |  |  |  |

## Lined up - confirm details (mentioned, not yet in workshop-leads.json)

DM copy for this batch: `docs/warm-dm-kit-2026-06-02.md` section B.

| Lead | Track | Note | Asked on | Reply | Next nudge |
|---|---|---|---|---|---|
| candytoybox | TBD | Confirm topic, track, date |  |  |  |
| hurric4n3ike (Ikechi) | creator? | WaveWarZ / distribution - confirm topic + track |  |  |  |
| The Dude | TBD | Confirm handle, topic, track |  |  |  |
| saltoriuous | TBD | Confirm handle (Sagittarius?), topic, track |  |  |  |
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

8 sessions was the comfortable June slate; we have blown past it. Currently: **8 delivered**
(9 recap pages incl. yerbearserker Pt 1 & 2), **9 scheduled** and dated (all with a Luma),
**6 confirmed** needing dates, **5 lined up**, plus prospects. The slate is full - the
remaining work is production (transcripts/thumbnails/YouTube on `/status`), not recruiting.

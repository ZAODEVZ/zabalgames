# Workshop roster - ZABAL Gamez Season 1 (June)

The pipeline of June workshop leads. This is the planning doc; **confirmed + scheduled**
leads get mirrored into `data/workshop-leads.json` (which drives the live homepage
schedule). Topic ideas per track: `docs/workshop-topics-by-track.md`.

Status: **scheduled** (date locked) -> **confirmed** (yes, no date yet) -> **invited**
(asked, awaiting yes) -> **prospect** (want to ask).

---

## Scheduled (date locked - on the live schedule)

| Lead | Track | When | Topic |
|---|---|---|---|
| yerbearzerker (Jordan Oram, Empire Builder) | builder | Mon Jun 1, 6-7am EST | Empire Builder V3 - leaderboards, Empires, token mechanics |

## Confirmed - needs a date

| Lead | Track | Topic | Note |
|---|---|---|---|
| Tyler Stambaugh (Magnetiq) | builder | Magnetiq - the workshop library platform | "any day in June" - send the Cal link to lock it |
| Thy Revolution (The ZAO) | TBD | 2 sessions, topics TBD | Confirmed 2 slots; needs topics + dates + track |

## Invited - awaiting yes

_(Zaal to fill - people already asked. Add: name, track, the topic you pitched, date sent.)_

| Lead | Track | Pitched topic | Asked on |
|---|---|---|---|
| | | | |

## Prospects - want to invite (by track)

Drawn from the ZAO ecosystem / mentor-outreach list. Tracks are a first guess - adjust.
Send each the single most specific topic they'd own (see topics-by-track).

**Builder**
- Adrian (diviflyy) - Empire Builder SDK / smart contracts
- Arthur (Neynar) - Base / EVM patterns, smart contracts
- Sam - WaveWarZ-Base, agentic builds
- kmac.eth - zlank.online templates, one-click cast surfaces
- Joshua.eth (NERDDAO) - building / community tooling

**Artist**
- DCoopOfficial (Coop Records) - music release + label angle
- Riley Beans - (confirm specialty)

**Creator**
- Hurric4n3Ike (Ikechi) - WaveWarZ + distribution / amplification

_(Zaal: add the rest of the people you have in mind here, with a track + a one-line topic.)_

---

## Workflow when someone confirms a date

1. They book via Cal (`cal.com/zabal-games/workshop-session`) or you lock it manually.
2. Add them to `data/workshop-leads.json` (name, org, handle, topic, format, `when`,
   `status: confirmed`, `color`, `track`) -> they appear on the homepage schedule.
3. Publish the matching Luma event (see `docs/cal-luma-workflow.md`).
4. Move them up to **Scheduled** here.

## Target

8 sessions is the comfortable June slate. Currently: 1 scheduled, 2 confirmed (Tyler +
Thy Rev's 2) = effectively 3-4 sessions accounted for, 4-5 slots open.

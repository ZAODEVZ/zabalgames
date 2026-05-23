---
topic: events
type: meeting-recap
status: research-complete
last-validated: 2026-05-22
related-docs: "473, 701, 712, 713"
tier: STANDARD
---

# 714 - Tyler x Zaal: ZABAL Games + Road to ZAOstock

> **Goal:** Lock in decisions + action items from the 2026-05-22 Google Meet call between Zaal and Tyler Stambaugh (Magnetic founder) covering the cowork action-item tracker, ZABAL Games, the road-to-ZAOstock content campaign, and the Magnetic retention methodology.

Direct follow-on to [doc 473](../473-road-to-zaostock-magnetic-portal/) - the April Magnetic-portal spec. This call moves it from spec to a dated plan and folds in ZABAL Games as the on-ramp.

## Key Decisions

| # | Decision | Owner | Status |
|---|----------|-------|--------|
| 1 | **Tyler pitches Magnetic at ZABAL Games** - a 30-min workshop, live-streamed then clipped | Tyler | TODO |
| 2 | **ZABAL Games workshop month is June** - any day works for the live pitch | Zaal | TODO |
| 3 | **Road to ZAOstock = 12 weekly content drops** - to land before Oct 3 it launches in July | Zaal | TODO |
| 4 | **ZABAL Games runs on Magnetic** - the vendor/workshop library plus entry + onboarding all hosted in one Magnetic portal | Both | TODO |
| 5 | **A "Zabal connector" NFT is the anchor magnet** - collecting it auto-drops the road-to-ZAOstock entry; it behaves like a Discord "general" channel, other magnets are the side channels | Zaal | TODO |
| 6 | **ZABAL Games + ZAOstock announce together** - one public post this weekend covers both | Zaal | TODO |

## Thread 1 - The cowork action-item tracker

### The Idea

Zaal is building an action-item tracker with Iman: meetings happen, a note-taker pulls the to-dos, they land in a work-order system (to-do / in progress / blocked / done) that both people see asynchronously. Started for ZAOstock, now for all projects, sorted into categories. Tyler immediately recognised the pattern - he runs the same thing as a "run book" for a PTA Sports Night event he is launching (tracks: volunteers, merchandise, stations, food and beverage). His push: tie dependencies to the items so the system can compute a critical path, and let the AI fill parameters (owner, date) you forget to mention instead of you typing each field.

### Why It Matters

This is the live cowork tracker - the same system this meeting's actions were just written into. Tyler becomes an external collaborator with read access.

### Next Step

Zaal finishes the tracker today and gives Tyler a password. Tyler sends 5-10 initial road-to-ZAOstock items to seed it.

## Thread 2 - ZABAL Games

### The Idea

ZABAL Games is framed as "streamer games crossed with a hackathon." Month one (June) is workshops and collaboration - Zaal invites everyone in his network who builds something to give a ~30-minute pitch positioning their tool as usable for the hackathon. Month two is open submission: anyone can submit anything, against an LLM-readable prompt on the website describing every ZAO project and its state. The goal is one content library, in one place, that any AI harness can be pointed at.

Tyler said yes to a 30-minute Magnetic pitch, live-streamed (then clipped). It doubles as the marketing-hackathon pitch Magnetic already had on its own to-do list.

### Decisions Pending

Whether participants get the paid Claude Code community / WAP tier free for 3-4 months (Zaal floated it, explicitly "not worried about that yet").

### Next Step

Zaal builds the ZABAL Games entry on Magnetic - intro video, a poll, and an open UGC submission field (link-only, low friction).

## Thread 3 - Road to ZAOstock

### The Idea

A 12-week weekly content campaign in the run-up to ZAOstock on Oct 3. Twelve weekly posts means a July launch. Week one is the ZAOstock explainer, week two is highlights from past concerts, then a rolling cadence of sponsor / partner / artist / volunteer reveals. Key build: a submission format a volunteer fills out so reveals post semi-automatically, plus a "fidelity distribution" list - the specific Discord / Telegram / X chats worth posting each drop into (e.g. Hurric4n3ike's WaveWarZ chats), so distribution is targeted, not spray-and-pray.

ZAOstock has not been announced publicly yet - that happens this weekend, bundled with the ZABAL Games announcement, alongside a Farcaster spaces live stream where Zaal DJs old ZAO music for lore.

### Next Step

Zaal decides the exact week count, then builds the connector + the road-to-ZAOstock portal.

## Thread 4 - Magnetic methodology (SNAPS) + opt-in data

### The Idea

Magnetic's frame: social platforms are "rented land and the rent keeps going up" - more work, less reach. Magnetic siphons that audience into a space you own. The retention mechanic is **SNAPS** - Status, Novelty, Access, Power, Stuff - hit some combination and members feel ownership ("emotional loyalty"). Tyler's sharpest point: "anyone can hit a viral post in 2026 - but what does that actually do for your bottom line?" The hard part is not making content, it is getting people in and keeping them.

Tied to a live Farcaster conversation about data: every click and swipe in a mini app is visible to the client. Opt-in is "the new currency of the internet" - and the ZAO/Magnetic angle is to lead by example on opt-in data. Concretely, Magnetic offered to build YouTube watch-analytics (viewer drop-off) for ZAO.

## Action Items

All 9 written to the unified Supabase cowork tracker (`project=zaodevz`, `legacy_source=meeting:tyler-zabal-may22`, brand in `metadata`).

| # | Action | Owner | Category | Due |
|---|--------|-------|----------|-----|
| 1 | Send Zaal 5-10 initial road-to-ZAOstock items to seed the tracker | Tyler | Ops | TBD |
| 2 | Finish the cowork action-item tracker, give Tyler a password | Zaal | Site / Tech | 2026-05-22 |
| 3 | Build the Zabal connector for ZABAL Games + Farcaster spaces | Zaal | Site / Tech | TBD |
| 4 | Create 3 ZABAL Games launch assets on Magnetic: intro video, poll wording, UGC wording | Zaal | Content | TBD |
| 5 | Post the combined ZABAL Games + ZAOstock public announcement | Zaal | Social | 2026-05-24 |
| 6 | Go live on Farcaster spaces, DJ old ZAO music for lore | Zaal | Social | 2026-05-24 |
| 7 | Write a 1-min recap short per ZABAL Games workshop video, linking to YouTube | Unconfirmed | Content | TBD |
| 8 | Build YouTube watch-analytics (viewer drop-off) for ZAO | Tyler | Site / Tech | TBD |
| 9 | Decide the road-to-ZAOstock week count (12 weeks = July start) | Zaal | Ops | TBD |

## Verify / Low-confidence

- **Action 7 (recap shorts)** - owner unclear. Transcript: "what I can do is I can make a short ... I'll write a short video recapping." Could be Zaal or Tyler/Magnetic. Written to the tracker `owner_id=null`, `confidence:low`. Confirm before treating as assigned.
- **ZABAL Games launch date** - transcript says it is "coming up in eight days" (~2026-05-30). Loose; not set as a hard due date. Confirm.

## Key Quotes

> "You're building on a rented land and the rent keeps going up." - Tyler

> "Anyone can hit a viral post in 2026. Anyone with no money, no nothing. But what does that actually do for your bottom line?" - Tyler

> "Watching the thing is super easy, it takes us three minutes ... the real work is how do you get people into it." - Tyler

> "Opt-in is the new currency of the internet." - Tyler

## Research Seeds

- ZABAL Games educational vendor library hosted on Magnetic - opt-in emails, per-vendor watch analytics.
- The "Zabal connector" anchor-magnet NFT pattern - one connector unlocks downstream magnets, modelled on Discord channel structure.
- Opt-in data norms as an emerging Farcaster conversation (every mini-app click visible to the client) - ZAO leading by example.
- Magnetic SNAPS methodology (Status / Novelty / Access / Power / Stuff) as a retention framework worth its own doc.
- **Tracker feature request (Zaal, this session):** ping the owner when a to-do is assigned to them. Belongs to the cowork bot build (proactive DMs), not this meeting - flagged for the tracker roadmap.

## Memory Updates

Files written to `~/.claude/projects/.../memory/`:

- `project_tyler_stambaugh.md` - new. Tyler Stambaugh: Magnetic founder, recurring ZABAL Games / ZAOstock collaborator, SNAPS methodology, doc 473 + 714.

## Also See

- [Doc 473](../473-road-to-zaostock-magnetic-portal/) - the original Magnetic portal spec this call advances
- [Doc 701](../701-zabal-games-canonical-state/) - ZABAL Games canonical state
- [Doc 712](../../business/712-zao-crm-coworking-app/) - ZAO CRM (Tyler is a contact this should hold)
- [Doc 713](../../dev-workflows/713-zao-ops-meeting-tracker-crm-bonfire/) - the combined meeting/tracker/CRM/Bonfire system

## Distribution Log

- Supabase cowork tracker: 9 actions inserted (`legacy_source=meeting:tyler-zabal-may22`)
- Bonfire episodes: built (summary + 6 decisions + 9 actions); posted if `BONFIRE_API_KEY` is set, else skipped
- Telegram: recap block printed in session
- Memory writes: 1 entry (`project_tyler_stambaugh`)
- Calendar: skipped (not selected)

## Transcript

Full transcript: [transcript.md](transcript.md)

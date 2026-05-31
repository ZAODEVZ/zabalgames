# Workshop host onboarding - ZABAL Gamez Season 1

Everything for getting a workshop lead from "yes" to a confirmed, recorded session.
Send the relevant parts when someone signs up. Pipeline lives in `docs/workshop-roster.md`;
topic ideas in `docs/workshop-topics-by-track.md`.

---

## 1. Host guide (send to a lead when they sign up)

**The ask:** one ~30-minute session on something you know - the tool you built, the
thing you do best. Livestreamed and recorded. That is the whole ask.

**Pick your slot:** book any open June day at `cal.com/zabal-gamez/workshop-session` -
pick a time, drop your topic. Slots stay open and overlaps are blocked automatically.

**What to prepare:**
- A topic (see the track idea bank if you want a prompt).
- A screen share / demo if it helps - show the thing, do not just talk about it.
- One sentence: what does someone watching walk away able to do?
- Live or pre-recorded - your call. Pre-recording is great if live is stressful; you
  still join for questions after.

**How it runs (we handle the production):** we set up the stream and recording, do a
quick tech check with you beforehand, then clip and cross-promote the session across
the ZAO accounts (Farcaster, X, Telegram). You focus on the content. (Stream tooling is
being finalized - we will send your exact stream link + tech-check time once your date
is locked.)

**What you get:**
- Public cast credit on launch + on the day.
- A standing spot on the ZAO mentor/lead team + the private channel.
- Your polished recording + a transcript + auto-clips for your own channels.
- A commemorative collectible on Magnetiq for leads.

**Timeline:** book a slot -> we confirm + send stream details -> 10-min tech check ->
record/stream your 30 min -> we clip + promote.

**Quick brand notes for your talk:** keep it practical and warm. It is a build event,
not a video-game contest. Any harness welcome. No need to oversell - show real work.

---

## 2. Cal.com booking intake questions (add these to the event)

Cal -> Event Types -> ZABAL Gamez Workshop Session -> Advanced -> Booking questions:

| Question | Type | Required |
|---|---|---|
| Your name | short text (default) | yes |
| Farcaster handle | short text | yes |
| X / other handle | short text | no |
| Your track | select: Artist / Builder / Creator | yes |
| What will you teach? | long text | yes |
| In one line, what will people walk away able to do? | short text | yes |
| Format | select: Livestream / Pre-recorded | yes |
| Anything you need from us to make it great? | long text | no |
| Links to your work (optional) | short text | no |

This captures everything to fill `data/workshop-leads.json` (name, handle, topic, track,
format) without a follow-up - which is the gap that left yerbearzerker's topic blank.

---

## 3. Confirm DM for the "maybe" leads (send JUST BEFORE announce, not now)

Short, warm, gets them to self-book. Per-person tweak the track + topic.

```
Hey [name] - ZABAL Gamez Season 1 kicks off and you're on the workshop roster.

Grab your June slot here: cal.com/zabal-gamez/workshop-session - pick a time, drop your
topic. 30 minutes, livestreamed + recorded, we clip it and cross-promote across the ZAO
accounts. Cast credit + a spot on the team.

Thinking you'd be a great fit for the [artist/builder/creator] track on [topic idea].
Any day in June that works - lock whatever's easy. Questions, just shout.
```

Leads to confirm (from the roster): Dúo Dø, Ohnahji, candytoybox, hurric4n3ike, Cassie,
The Dude, saltoriuous, kmac.eth, Kenny, nickysap (plus Tyler + Thy Revolution to lock dates).

---

## 4. Magnetiq UGC: add a "best way to reach you" prompt

Second UGC on the magnet (alongside the advice/suggestions one). Lets people pick their
own update channel instead of being forced to email - we then reach each person where
they actually are.

- **Prompt:** "Where's the best place to reach you for ZABAL Gamez updates?"
- **Options:** Farcaster DM | Farcaster group chat | Telegram | Discord DM | Discord
  group | X DM | Email | LinkedIn | Other (type it)
- **Why:** the collectible claim defaults to email; this lets a claimer redirect updates
  to their preferred channel. Pairs with the existing "advice / suggestions" UGC.

# Workshop host onboarding - ZABAL Gamez Season 1

Everything for getting a workshop lead from "yes" to a confirmed, recorded session.
Send the relevant parts when someone signs up. Pipeline lives in `docs/workshop-roster.md`;
topic ideas in `docs/workshop-topics-by-track.md`.

---

## 1. Standard speaker kit (the canonical version - use this every time)

This is the standardized message + expectations for every guest, built from the sessions
we have already run. Send the invite as-is (swap the bracketed bits); keep the wording
consistent so every speaker gets the same clear picture. Voice: no emojis, no em dashes,
tight and warm.

### 1a. The invite (copy-paste)

```
Hey [name] - we would love to have you do a ZABAL Gamez workshop.

The ask: one session on something you know best - [the tool you built / your topic].
About 30 minutes is the sweet spot, but it is flexible: we can do 15, a full hour, or
split an hour into two parts. Live or pre-recorded, your call.

What you get: we handle all the production. You get a polished recording, a clean
transcript and a dedicated page on zabalgamez.com, a YouTube upload (we share it with you
before it goes public so you can OK it), short clips for your own channels, and a cast +
cross-promotion across the ZAO accounts. Leads also get a spot on the mentor team and a
commemorative collectible.

To lock it I just need: a day/time that works, your topic, and your Farcaster/X handle.
Reply with a slot or grab one here: cal.com/zabal-gamez/workshop-session - I publish the
Luma and send you the details.
```

### 1b. What we need from you (so we can list + promote it)

- A **day and time** (or book at `cal.com/zabal-gamez/workshop-session`).
- Your **topic**, and one line: **what does someone walk away able to do?**
- **Format**: live or pre-recorded, and the length (15 / 30 / 60, or a split hour).
- Your **Farcaster handle** (and X / others), plus your **org/project** and any links.

### 1c. What you get (the real deliverables)

- A **dedicated recording page** on zabalgamez.com (`/recordings/N`) - the video with
  chapters, a recap with takeaways, and your transcript.
- A **YouTube upload**, shared with you unlisted first so you can **OK it** before it goes
  public.
- **Short clips** cut for your own channels.
- A **Luma event** for RSVPs + a **cast** on launch and on the day, cross-promoted across
  the ZAO accounts (Farcaster, X, Telegram).
- A spot on the **ZAO mentor/lead team** + the private channel, and a **Magnetiq
  collectible** for leads.

### 1d. How it runs (the standard flow)

1. **Lock the date** - book via Cal or reply a slot; we publish the Luma.
2. **Quick tech check** before the session (we send the stream link + time once the date
   is locked).
3. **Record / stream** your session (live or pre-recorded; you still join for Q and A
   after a pre-record).
4. **We produce it** - correct the captions, cut clips, build the `/recordings/N` page +
   transcript + recap.
5. **You OK it** - we share the YouTube cut with you to approve, then publish public.
6. **We promote it** - cast + cross-promote, and the recording lives on the site for good.

**Brand notes for your talk:** keep it practical and warm. It is a build event, not a
video-game contest. Any harness welcome. Show real work - do not oversell.

### 1e. Confirmation DM (REUSABLE - send once their slot is locked)

The moment a guest has a date + a published Luma, send this so they have the details in
hand. Fill the `[brackets]`; drop the demo line if it does not fit. Direct, no fluff.

```
Hey [name] - you're locked: [day, date, time] EST for [session/topic]. Event: [luma]

[length], livestreamed and recorded. [one line - e.g. just demo X and walk through what
you're building]. We run the stream and clip it after. Anything you need from us, let me know.
```

**Worked example (Chris Dolinsky, Vini App):** name = Chris, slot = Mon Jun 15, 4:45pm,
session = your Vini App workshop, luma = https://luma.com/tip89eq3, length = 30 min,
demo line = just demo Vini App and walk through what you're building.

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

# Lu.ma + AMA prep - ZABAL Gamez Farcaster Fireside (Mon Jun 22, 2026)

> Paste-ready copy for the new session: a live Farcaster audio-space AMA fireside on the
> Farcaster protocol. Run Reddit-style - questions collected ahead of time, open with the
> most-liked. Brand: no emojis, no em dashes (hyphens only), "100+" for member count.
>
> FILL BEFORE PUBLISHING (only you have these):
> - [GUEST] - the guest's name + @handle and how to describe them (Zaal's working line was
>   "Farcaster intern"; "on the Farcaster team" / "Farcaster contributor" reads better in public - your call).
> - CONFIRM the slot: Monday Jun 22, 2026, 5pm EST (the thread had some back-and-forth - lock it).
> - After you create the Lu.ma, paste its URL into the newsletter, the questions cast, and the schedule row below.

## How to set it up
1. luma.com/zao -> New Event
2. Title + description below
3. Date: Mon Jun 22, 2026  -  Time: 5pm EST  -  Duration: 60 min
4. Location: Link Meeting -> paste the Farcaster audio-space link (you are rocking an audio space)
5. Tag: `zabal-games` (so it shows in the filtered embed on zabalgamez.com)
6. Cover: `https://zabalgamez.com/assets/og-card.png` (or icon.png)
7. Host: BetterCallZaal (The ZAO), co-invite [GUEST]
8. Add a registration question (optional, see below) so RSVPs can carry a question
9. Publish, then post the questions cast in /zabal

## Title (recommended)
```
ZABAL Gamez Fireside: Farcaster AMA
```
Alt (Zaal's working line): `ZABAL Gamez Fireside - Talking Farcaster, with a Farcaster insider`

## Subtitle / short description
```
A live audio-space fireside on Farcaster with [GUEST]. Ask Me Anything - drop your questions ahead of time, we open with the most-liked.
```

## Full description
```
ZABAL Gamez Season 1 - Fireside AMA

A live audio-space fireside on Farcaster - how the protocol actually works, what it is like building on and around it, and where it is going - with [GUEST].

Run like a Reddit AMA: drop your questions ahead of time, we open with the most-liked ones, then let the conversation flow.

How to get your question in:
- Reply to the questions cast in the /zabal channel (link below). The most-liked replies are the ones we start with.
- Or add your question when you RSVP here.

What we will get into:
- Farcaster in plain terms - how it works and why it is built the way it is
- What building on and around the protocol actually looks like
- Where it is headed
- Your questions, straight from the room

Format: live audio space on Farcaster, about 60 minutes, recorded and kept - missing it live never means missing it.

When: Monday Jun 22, 2026, 5pm EST
Hosted by: BetterCallZaal (The ZAO) with [GUEST]
Part of: ZABAL Gamez Season 1
More: zabalgamez.com
```

**Optional Lu.ma registration question:** `What is your question for the Farcaster AMA? (we open with the most-liked, but we read them all)`

## Questions-collection cast (post in /zabal once the Lu.ma is live)
This is the AMA mechanic - replies are the questions, likes are the upvotes.
```
We are running a ZABAL Gamez Farcaster AMA - a live audio-space fireside Monday at 5pm EST with [GUEST], talking Farcaster: how it works, building on it, and where it is headed.

Reddit-style: drop your questions below. The most-liked replies are the ones we open with.

Bring your sharpest Farcaster question. RSVP: [luma link]
```

## Schedule row (add to data/workshop-leads.json after the Lu.ma URL exists)
Surfaces it on the homepage schedule. Match the `color` to the other builder-track rows before committing.
```json
{
  "id": "0XX",
  "name": "[GUEST] (Farcaster)",
  "org": "Farcaster",
  "topic": "A live audio-space fireside AMA on Farcaster - how the protocol works, building on it, and where it is going. Reddit-style: questions ahead of time, opening with the most-liked.",
  "format": "Audio space fireside / AMA, recorded",
  "when": "Mon Jun 22 2026, 5pm EST",
  "status": "confirmed",
  "confirmed_date": "2026-06-17",
  "color": "<match builder rows>",
  "date": "2026-06-22",
  "track": "builder",
  "luma_url": "<paste after creating the Lu.ma>"
}
```

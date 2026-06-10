# Luma event draft - Adam Miller, Fri Jun 12 2026

Paste-ready copy for the one upcoming dated session still missing a Luma event.
Once the event is live, add its `luma_url` to the Adam Miller entry (id 014) in
`data/workshop-leads.json` so the homepage schedule and the top CTA pick it up.

## Known details (from `data/workshop-leads.json`)
- Lead: Adam Miller
- Date / time: Fri Jun 12 2026, 6pm EST
- Format: 30 min, livestreamed and recorded
- Status: confirmed
- Topic: TO BE ANNOUNCED - confirm with Adam before publishing the description below.

## Event title (pick one once topic is locked)
- `ZABAL Gamez: Adam Miller - [topic]`
- Placeholder until confirmed: `ZABAL Gamez: A session with Adam Miller`

## When
Friday, June 12, 2026 - 6:00pm EST (30 minutes)

## Location
Online - livestreamed and recorded. (Add the stream link Luma should show.)

## Description (placeholder - swap in the real topic before publishing)
Adam Miller joins ZABAL Gamez for a live 30-minute session. ZABAL Gamez is The
ZAO's 3-month Build-A-Thon - June workshops, July open build, August Finals.
Free, open to anyone, any harness.

Topic to be announced. RSVP to get the reminder and the recording link.

Part of the June workshop series. Browse the full schedule and past recordings at
zabalgamez.com.

## After the event
- Add `luma_url` to the Adam Miller lead in `data/workshop-leads.json`.
- When the recording is processed, add a recap entry to `data/recaps.json` and a
  `/recordings/N` page, then run `node scripts/build-recordings-index.mjs`.

## Open question for the owner
Adam Miller's topic is still "To be announced." Lock the topic (and the track) so
the title, description, and the homepage schedule chip read correctly.

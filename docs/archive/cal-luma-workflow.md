# Cal.com -> Luma workshop scheduling (no API)

How workshop leads book a June session and how each booking becomes a public
Luma event, without writing any integration code.

## The flow

1. A lead opens `/lead`, hits the Cal.com slot picker, chooses an open June time,
   and fills in their workshop info (topic, handle, format).
2. Cal.com books it. It keeps availability open 24/7 and blocks overlaps
   automatically - two leads can never grab the same slot.
3. You take the confirmed booking and publish it as a public Luma event for
   attendees to RSVP. Luma stays the public-facing calendar.
4. Optionally, add the locked date to `data/workshop-leads.json` so the homepage
   schedule shows the real time instead of "Date to be announced".

## One-time Cal.com setup

1. Create a Cal.com account (or use the team account).
2. New event type: **ZABAL Gamez Workshop Session**.
   - Slug: `zabal-games-workshop` (so the link is `USERNAME/zabal-games-workshop`).
   - Duration: 30 min (matches the workshop format).
   - Availability: June only, open 24/7 within that window. Cal.com handles the
     overlap-blocking - nothing extra needed.
3. Add booking questions so Cal captures the same info the Formspree form does:
   - Name (default)
   - Farcaster / X handle (short text, required)
   - What will you teach? (long text, required)
   - Format preference: livestream vs recorded (short text)
   - Anything you need from us (long text, optional)
4. Copy the event path - the part after `cal.com/`, e.g. `bettercallzaal/zabal-games-workshop`.

## Switch the embed on

In `lead.html`, set `CAL_LINK` to that path:

```js
var CAL_LINK = "bettercallzaal/zabal-games-workshop";
```

Empty string keeps the form-only fallback. Once set, the slot picker renders
inline and the fallback text hides. Commit, push, deploy.

## Connecting to Luma (no API)

Pick whichever is least friction:

- **Manual mirror (simplest).** Each Cal.com booking emails you a confirmation
  with the date, time, and the lead's answers. Create the matching Luma event
  from it. Done in under a minute per booking, and you control exactly what goes
  public.
- **Shared Google Calendar bridge.** Connect Cal.com to a dedicated Google
  Calendar (Cal.com writes every booking there natively - no code). Keep that
  calendar as your single source of truth for "what's scheduled", and create the
  Luma events from it. This also gives you one calendar to embed anywhere.

Either way: Cal.com owns scheduling + overlap prevention, Luma owns public RSVP,
and the only manual step is publishing the Luma event from a confirmed booking.

## Why not auto-sync both ways

Luma's event creation isn't exposed without their API, and we're deliberately
staying API-free here. The manual publish step is the trade-off, and at this
volume (a handful of June sessions) it's a minute of work per booking, not a
system to maintain.

# Warm-DM kit - ZABAL Gamez (June 2026)

> Paste-ready warm outreach for the people who are already in. The bottleneck is **locking
> dates, not finding guests** (per `workshop-roster.md`): 8 leads have said yes but have no
> date. These DMs convert a yes into a booked slot. Track every send in the roster's cadence
> columns (Asked on / Reply / Next nudge) so nobody falls through.
>
> Booking: `cal.com/zabal-gamez/workshop-session` (the `/lead` "Pick your slot" Cal), or reply
> a date and Zaal locks it. Voice: no emojis, no em dashes, tight and warm.

## How to use this

1. **Assumptive scheduling beats an open calendar.** Every DM below proposes ONE concrete
   slot in `[brackets]`. Replace the bracket with a real open day before sending - a yes/no on
   a specific time converts far better than "pick a slot." The Cal link is the fallback, not
   the lead.
2. Send, then log it in `workshop-roster.md`: fill **Asked on** (date sent), **Reply**
   (yes/no/maybe/silent), **Next nudge** (when to follow up, usually +3 days if silent).
3. On a yes: book it, add to `data/workshop-leads.json` (with `date` + `luma_url`), publish the
   Luma (`docs/cal-luma-workflow.md`), and move the lead up the roster funnel.
4. One nudge after 3 days of silence, one more after another 4. Then let it rest - do not chase
   a warm contact into annoyance.

---

## A. Confirmed, no date (8) - the date-lock batch

These already said yes. One ask: confirm the proposed slot.

**Tyler Stambaugh (Magnetiq)**
```
Tyler - locking your Magnetiq session. You said any day works, so I penciled you for
[Wed Jun 11, 1pm EST]. Does that work? If not, grab any slot:
cal.com/zabal-gamez/workshop-session and I publish the Luma.
```

**Thy Revolution** (2 sessions)
```
Thy Rev - locking your two sessions. I have you down for [Tue Jun 10] and [Thu Jun 12] -
do those work? And what is the topic for each? Reply and I set the Luma + listing, or grab
slots: cal.com/zabal-gamez/workshop-session.
```

**Adrian (@diviflyy)**
```
Adrian - want to lock your Empire Builder API session (the V3 endpoints walkthrough).
Penciled you for [Thu Jun 5, 11am EST] - good? It pairs with yerbearserker's V3 talk. If the
day is off, pick another: cal.com/zabal-gamez/workshop-session.
```

**Duo Do (@duodomusica)**
```
Duo - locking your "musician on Farcaster, road to Farcon" session. You said first week of
June, so I have [Fri Jun 6, 2pm EST] for you. Work? If not, grab a slot:
cal.com/zabal-gamez/workshop-session and I publish the Luma.
```

**Jonathan Colton (@jonathancolton)** (2 talks)
```
Jonathan - locking your two talks (Founder Check + propagating your work on Farcaster).
Penciled [Mon Jun 9] and [Wed Jun 11] - do those work? Side note: ran ZABAL Gamez through
Founder Check, 3.35 to 7.8 - a clean live example for the FounderCheck talk if you want it.
Adjust slots here: cal.com/zabal-gamez/workshop-session.
```

**kmac.eth**
```
kmac - locking your Farcaster Snaps session (building + shipping interactive Snaps). Got you
down for [Tue Jun 10, 4pm EST] - work? Also Cassie is in thanks to your rec - want me to slot
you two back to back? Other days: cal.com/zabal-gamez/workshop-session.
```

**Cassie (@cassie)**
```
Cassie - kmac put you forward for a ZABAL Gamez session and I would love to have you. Two
things: what would you want to teach, and does [Tue Jun 10] work (right after kmac)? Reply and
I lock it: cal.com/zabal-gamez/workshop-session.
```

**Plat0x (@plat0x)**
```
Plat0x - you mentioned your own builder session on the graph this week. Let's lock it - I have
[Thu Jun 5, 3pm EST] for you. Work? If not, grab a slot:
cal.com/zabal-gamez/workshop-session and I set the Luma.
```

---

## B. Lined up (6) - confirm topic + track + date

These were mentioned but are not pinned. Shorter, exploratory - get a topic and a day, then
move them to the date-lock batch above. Confirm handles/spelling before sending (some are
best-effort from the Farcaster Batches transcript).

**candytoybox**
```
candytoybox - want to grab you for a ZABAL Gamez workshop in June. What would you want to
teach (your pick), and a day that works? I handle the Luma + listing.
```

**hurric4n3ike (Ikechi)** - WaveWarZ / distribution
```
Ike - a ZABAL Gamez session on WaveWarZ + distribution would be gold for this crew. Up for one
in June? Tell me a day and I lock it.
```

**The Dude** - confirm handle + topic
```
[Dude] - keen to have you do a ZABAL Gamez workshop. What topic, and what June day works? I
take care of the rest.
```

**saltoriuous** - confirm handle + topic
```
salt - want to teach a ZABAL Gamez session in June? Your pick of topic. Reply a day and I set
it up.
```

**Kenny (POIDH)** - confirm handle
```
Kenny - a ZABAL Gamez session on POIDH and building bounties would land well here. Up for one
in June? Name a day and I lock it.
```

**nickysap (Juke)** - confirm handle (Nikki Sapp)
```
Nicky - would you do a ZABAL Gamez workshop on Juke / audio on Farcaster? June, your pick of
day. I handle the rest.
```

---

## C. Attendee cast (reusable) - fire once sessions are locked

Warm DMs fill the lead side. Seats fill from a public nudge. Post in `/zabal` whenever there
are upcoming locked sessions on the schedule (do not send before there is a dated session to
point at).

```
This week at ZABAL Gamez: [Lead - topic, day] and [Lead - topic, day]. Free, recorded, any
harness. RSVP on the Lu.ma: luma.com/zao. The build is the application.
```

- Tag the 1-2 leads featured (warm reach), embed the Lu.ma, one CTA.
- Refresh weekly as the schedule advances. Keep the count honest - name real, dated sessions.

---

## Where this is tracked

- **Lead status + send cadence:** `docs/workshop-roster.md` (the single source of truth - fill
  Asked on / Reply / Next nudge as you send).
- **Live schedule data:** `data/workshop-leads.json` (only dated/confirmed leads render on the
  site - the homepage `#schedule` + `/live`).
- This kit is the copy; the roster is the tracker. Keep them in sync.

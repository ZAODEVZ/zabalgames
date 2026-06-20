# Media playbook - ZABAL Gamez

> The single source of truth for how we run media: one process, one format per artifact, one
> place to capture each session's facts. If you are about to make a Lu.ma, a post, a newsletter,
> or a YouTube package, start here. Brand rules are hard: no emojis, no em dashes (hyphens
> only), no crypto/web3 jargon in public copy, "100+" for member count.

## Why this exists
We kept making each Lu.ma and post from scratch, so the same mistakes recurred: a wrong RSVP
link reused from another event, asking for the same handle twice, slightly different copy each
time. This doc ends that. Capture the facts once, then every artifact comes from a fixed format.

## 1. Capture the facts ONCE per session (the intake)
The moment a session is confirmed, record these in `data/workshop-leads.json` - it is the source
of truth that the homepage schedule, the top CTA, and our posts all read from:

| Field | Notes |
|----|----|
| `name` | How they want to be credited |
| `handle` | @ handle (Farcaster). Get it at confirmation - do not ship a post without it or with a `[tag @handle]` placeholder still in. |
| `track` | artist / builder / creator (drives color: artist=pink, builder=zabal, creator=cyan) |
| `when` | `Day Mon DD 2026, h:mmam/pm EST` |
| `date` | `YYYY-MM-DD` |
| `topic` | one clear sentence |
| `format` | e.g. "Talk + Q&A, recorded" |
| `luma_url` | the event's own Lu.ma. **Until it exists, use `https://luma.com/zao` and nothing else.** |

**Hard rule: never put another session's Lu.ma link on a new session.** If the real event is not
made yet, the link is `https://luma.com/zao` (the calendar) - never a different event's code.
This is exactly what went wrong when AZKAL's `r1148jip` landed on Theresa.

## 2. The process, end to end
1. Session confirmed -> fill the intake row in `data/workshop-leads.json` (it goes live on the schedule).
2. Make the Lu.ma from the **Lu.ma format** below -> publish -> paste the real URL back into the row.
3. Generate the **posts** (promo + Firefly) from the format below. Schedule them ~1h before, or batch.
4. Day-of: the **live-now post**.
5. After it airs: correct the transcript (Descript), build the **YouTube package**
   (`docs/recordings/youtube-package-template.md`), publish via
   `docs/youtube-production-workflow.md`, set the `youtube` URL on the recaps entry, rebuild the index.
6. The session also feeds the **daily newsletter** (`docs/newsletter-template.md`).

## 3. Format: Lu.ma event
```
Title:        [Clear topic title - what they will learn / the hook]
Subtitle:     A [track]-track session with [Name] - [one line].
Date / time:  [Day Mon DD, 2026, h:mm am/pm EST]
Duration:     45 min talk + Q&A (90 min if it is a demo/AMA)
Location:     Link Meeting -> the stream / audio-space link
Tag:          zabal-games
Cover:        https://zabalgamez.com/assets/og-card.png
Host:         BetterCallZaal (The ZAO), co-invite [handle]

Full description:
ZABAL Gamez Season 1 - [Track] track

[Hook - the most interesting thing about the session, 1-2 sentences.]

What you will take away:
- [bullet]
- [bullet]
- [bullet]

Format: live session, recorded and kept - missing it live never means missing it.

When: [Day Mon DD, 2026, h:mm am/pm EST]
Hosted by: BetterCallZaal (The ZAO) with [Name]
Part of: ZABAL Gamez Season 1
More: zabalgamez.com
```
Per-session Lu.ma copy lives in `docs/luma-zabal-gamez-<slug>.md` using exactly this shape.

## 4. Format: posts
All posts stay under 280 characters so they cross-post cleanly (X / Farcaster / Lens / Bluesky).
Plain-text names so they read everywhere; add the @handle after pasting for the Farcaster ping.

**Promo (Firefly cross-platform):**
```
[Day] [time] EST for a ZABAL Gamez Workshop: [Name] on [topic] - [one line].

Free, live, recorded. RSVP: [luma_url]
```

**Live-now (fire it when the session starts):**
```
We're live now in ZABAL Gamez: [Name] on [topic].

Hop in: [luma_url]
```

**AMA question post (people reply with questions, likes rank them):**
```
[Event] - [Day] at [time] EST. [One line on the guest + topic.]

Reply with your questions below - the most-liked ones are the ones we open with.

RSVP: [luma_url]
```

**Combined day (when there are 2-3 in one day):**
```
[Day] is a triple-header in ZABAL Gamez, all EST: [time] [Name] on [topic], ... Free, live, recorded. RSVP: https://luma.com/zao
```

## 5. Format pointers (already documented)
- Newsletter: `docs/newsletter-template.md`
- YouTube package: `docs/recordings/youtube-package-template.md`
- YouTube strategy + production: `docs/youtube-playbook.md`, `docs/youtube-production-workflow.md`

## 6. Stale / superseded - do not use
- `docs/luma-events-templates-2026-05-26.md` and the dated `luma-events-*` / `socials-*` /
  `distribution-casts-*` files are point-in-time records. Use the formats in THIS doc instead.

## 7. What still needs improving (open)
- **Generate posts from `workshop-leads.json`** with a small script, so the promo/Firefly copy is
  produced from the source of truth and never hand-retyped (kills format drift entirely).
- **One media kit per session** (`docs/sessions/<slug>.md`) bundling Lu.ma + posts + YouTube,
  instead of separate files per artifact.
- **Thumbnail template + Shorts pipeline** per the YouTube playbook.
- **Archive** the stale dated docs so search does not surface them.

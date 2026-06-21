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
Title:        ZABAL GAMEZ Workshop - [Topic] - w/ [PRESENTER]
              (same shape as the YouTube title. Special formats keep their own name,
              e.g. "ZABAL GAMEZ AMA w/ [Guest]" for an AMA/fireside.)
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
zm

We're live now in ZABAL Gamez: [Name] on [topic].

Watch live: https://zabalgamez.com/live
```
Opens with `zm` and points at the always-on watch page (`zabalgamez.com/live`), not the
event's Lu.ma - when we are already live, the live page is the one-tap destination.

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

## 5. The media output catalog
Everything we produce, what triggers it, the format that governs it, and where it goes.

| Output | Trigger | Format / governed by | Goes to |
|----|----|----|----|
| Lu.ma event | session confirmed | section 3 (Lu.ma format) | luma.com/zao |
| Schedule row | session confirmed | `data/workshop-leads.json` | homepage schedule |
| Promo post | event live on Lu.ma | section 4 (posts) | Firefly + channels (media-distribution) |
| Live-now post | session starts | section 4 + media-distribution runbook | Firefly + GCs |
| AMA thread | AMA / fireside events | section 4 (AMA post) | /zabal |
| Recording page + on-site transcript | after it airs | `scripts/ingest-recording.mjs` | site /recordings/N |
| YouTube video + metadata | after it airs | `docs/recordings/youtube-package-template.md` | YouTube |
| Shorts (2-3) | after it airs | `docs/youtube-playbook.md` | YouTube + feeds |
| Daily newsletter | each build day | `docs/newsletter-template.md` | paragraph.com/@thezao |
| Weekly recap | weekly | `docs/weekly-recap-template.md` | newsletter + feeds |

## 6. Format pointers (canonical docs)
- Go-live runbook + channel registry: `docs/media-distribution.md`
- Newsletter: `docs/newsletter-template.md`  -  Weekly recap: `docs/weekly-recap-template.md`
- YouTube package: `docs/recordings/youtube-package-template.md`
- YouTube strategy + production: `docs/youtube-playbook.md`, `docs/youtube-production-workflow.md`

## 7. Stale / superseded - do not use (use the canonical formats above)
These are point-in-time records, kept only for history. Do NOT copy from them. Most now
live under `docs/archive/`; a few are kept in place because timeline records
(`data/changelog.json`, `vercel.json`, `spaces.html`) still link to their path.
- Archived (`docs/archive/`): `luma-events-2026-06-11.md`, `luma-events-2026-week2.md`,
  `luma-adam-miller-2026-06-12.md`, `cal-luma-workflow.md`, `distribution-casts-2026-06-11.md`,
  all `socials-*.md`, `announce-posts-2026-05-26.md`, `announce-thread-final.md`,
  `social-share-images.md`, `media-kit-2026-05-26.md`, `warm-dm-kit-2026-06-02.md`
- Kept in `docs/` (still link-referenced, but stale - do not copy): `launch-kit.md`,
  `luma-events-templates-2026-05-26.md`, `validation-launch-kit-2026-05-29.md`,
  `announce-day-kit-2026-05-27.md`
- Newsletters: the dated `newsletter-*.md` editions are published records, not templates -
  only `newsletter-template.md` is the format.

## 8. What still needs improving (open)
- **Generate posts from `workshop-leads.json`** with a small script, so the promo/Firefly copy is
  produced from the source of truth and never hand-retyped (kills format drift entirely).
- **One media kit per session** (`docs/sessions/<slug>.md`) bundling Lu.ma + posts + YouTube,
  instead of separate files per artifact.
- **Thumbnail template + Shorts pipeline** per the YouTube playbook.
- **Archive** the stale dated docs so search does not surface them.

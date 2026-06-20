# YouTube package format - the standard

> The canonical format for every ZABAL Gamez recording's YouTube metadata. Copy this skeleton
> per session. One file per recording: `docs/recordings/youtube-<slug>.md`. Brand rules apply:
> no emojis, no em dashes (hyphens only), no crypto/web3 jargon in the public copy.

## Title (one line, this exact shape)
```
ZABAL GAMEZ Workshop - [TOPIC OR SUBTITLE] - w/ [PRESENTER]
```
- It is a **ZABAL GAMEZ Workshop**, never a "ZAO Workshop".
- Keep the presenter as they want to be credited (handle or name), in CAPS for the w/ tag.
- Example: `ZABAL GAMEZ Workshop - Owning Your Music as an Independent Artist - w/ JOSEPH GOATS`

## Description (in this order)
```
[Hook - one or two sentences with the single most striking thing from the talk.]

[1-2 paragraphs: who the presenter is and what the session covers, plain and concrete.]

[Optional closing paragraph - the throughline or the human note.]

What you'll take away:
- [bullet]
- [bullet]
- [bullet]

Chapters
00:00 [section]
... real timestamps from the transcript, first one at 00:00 ...

Links
[Presenter] on Farcaster: https://farcaster.xyz/[handle]
[Project / site]: [url]
ZABAL Gamez: https://zabalgamez.com

ZABAL Gamez is The ZAO's 3-month Build-A-Thon. June workshops, July open build, August Finals. Free, open to anyone, any harness.

#[Hashtag] #[Hashtag] #ZABALGamez #Farcaster
```

## Tags (always include - comma-separated, YouTube tag field)
```
[presenter], [project], [3-6 topic tags], ZABAL Gamez, The ZAO, Farcaster
```

## To confirm before publishing
- Presenter's exact handle / profile URL.
- Chapters need real transcript timestamps. If the transcript has none, add chapters on
  upload or let YouTube auto-generate them - do not invent timestamps.
- Once live, set the `youtube` URL on the recording's entry in `data/recaps.json` and run
  `node scripts/build-recordings-index.mjs` so the Video button appears on the page.

## Notes
- Chapters come straight from the transcript timestamps; never fabricate them.
- Keep the description scannable - hook, context, takeaways, chapters, links.

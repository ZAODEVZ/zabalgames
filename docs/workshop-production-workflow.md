# ZABAL Gamez - Workshop Media Production Workflow

The end-to-end process for every ZABAL Gamez workshop, from first outreach to a
published YouTube video. This is the canonical pipeline - the `docs/workshop-media-tracker.md`
grid tracks where each guest sits in it, and `data/recaps.json` holds the published output.

## The pipeline (9 stages)

### 1. Reach out / schedule
Find a guest worth teaching and reach out (DM, warm intro, or they apply via
`/lead`). Pitch the format: free, recorded, any harness, pick a track.

### 2. Confirm time, date, and topic
Lock the three together. Get a one-line topic, the track (artist / builder / creator),
and a date + time (EST). Add them to `data/workshop-leads.json` with status `confirmed`.

### 3. Make the Luma
Create the public Luma event. Title format:
`ZABAL GAMEZ Workshop: <topic>, with <name> [from <org>]`.
Use the ZABAL Gamez voice in the description (no emojis, no em dashes). Add the
`luma_url` to the guest's entry in `workshop-leads.json` so it shows on the homepage
schedule + top CTA.

### 4. Send to the guest to confirm
Send the Luma link to the guest so they can confirm the event looks right (time,
topic, framing) before it goes public-facing.

### 5. After confirmation, make a post
Once confirmed, post about it on Farcaster (the announce cast). Save that cast as
the `cast_hash` on the recap later so the page's live "Thoughts" thread pulls its replies.

### 6. Run + record the session
Host it live (Luma / Restream / Twitch / Space). Hold the master recording.

### 7. Download + upload to Descript, add intro/outro + captions
Pull the raw recording, upload to Descript. Add the ZABAL Gamez intro and outro,
run captions (use `docs/recordings/recording-vocabulary.md` as custom vocab, apply
`data/transcript-corrections.json` brand rules).

### 8. Iman edits
Hand off to Iman for the edit pass - cuts, polish, clips.

### 9. Download + upload to YouTube
Export the final cut, upload to YouTube. Share the unlisted link with the guest for
sign-off (`okd`), then publish. Ingest into the site:
`node scripts/ingest-recording.mjs <manifest.json> --write` (writes transcript +
`/recordings/N` page + recap + rebuilds the index).

## Status tracking - the three buckets

Iman's working sheet groups recordings by where the video sits:

- **In Luma Only** = the event exists, but the video is NOT yet in Descript (not started, or recorded but not uploaded).
- **In Descript Only** = raw file is in Descript but no public Luma event (internal sessions, raw captures).
- **In Both** = event ran AND the video is in Descript (in the edit pipeline or done).

"In Luma Only" is the work queue: those need the video pulled and uploaded to Descript next.

## Source of truth

- **Schedule + Luma + handles:** `data/workshop-leads.json`
- **Published recordings (YouTube, transcript, page, takeaways, chapters):** `data/recaps.json`
- **Production status grid:** `docs/workshop-media-tracker.md`
- **The media tracker CSV** (for the Google Sheet) is generated from the two JSON files
  plus the Descript status from Iman's sheet.

## Season 1 snapshot (end of June 2026)

28 dated speaker sessions across June. The recordings system carried sessions from
raw capture all the way to per-session `/recordings/N` pages with verified comment
threads and transcripts. The bottleneck is consistently stages 7-9 (Descript upload ->
edit -> YouTube), not recruiting or scheduling - June filled well past the ~8-session target.

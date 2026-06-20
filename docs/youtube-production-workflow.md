# Video production workflow - Twitch to YouTube (via Descript)

> The pipeline for turning a livestreamed ZABAL Gamez session into a published, captioned,
> chaptered YouTube video - with the redundant steps removed. Pairs with the per-video
> metadata format (`docs/recordings/youtube-package-template.md`) and the strategy
> (`docs/youtube-playbook.md`).

## Current flow (and where it wastes time)
1. Download the Twitch VOD
2. Upload to Descript
3. Cut the intro / dead air
4. Auto-transcribe for captions
5. Add intro + outro
6. Download the rendered video, then upload it to YouTube  <- round-trip #1
7. Download the SRT, then upload it to YouTube separately   <- round-trip #2
8. Add the rest of the metadata

Steps 6 and 7 are the two loops to kill. You are exporting a file and re-uploading it, and
exporting captions and re-uploading them - both of which Descript can do for you directly.

## Improved flow
1. **Master file, not the Twitch VOD.** The Twitch download is a re-encode (quality loss) and
   an extra step. Pull the higher-quality master from Restream's cloud recording or a local OBS
   recording instead. If Twitch is the only source, fine - just know it is the lossy path.
2. **Import to Descript.**
3. **Use a saved template for intro/outro.** Build your standard intro and outro once as a
   Descript template (Composition), then drop it on the head and tail every time - do not
   rebuild it per video. Trim the intro/dead air on the timeline.
4. **Auto-transcribe + correct.** Descript transcribes; fix names and brand terms (Neynar,
   Quilibrium, ZABAL Gamez, etc.). This corrected transcript is the single source that also
   feeds our chapters and the package metadata.
5. **Publish straight to YouTube from Descript.** Connect your YouTube account once
   (Publish -> Publish to YouTube). This replaces download-then-reupload entirely. Set the
   title, description, tags, and visibility there, pasting from the session's package doc.
6. **Captions - one upload, not a round-trip.** Either let the direct publish carry the
   transcript, or export the SRT once (Publish -> Export -> Subtitles -> .srt) and upload it to
   YouTube. Do not rely on YouTube auto-captions alone - your corrected Descript SRT is more
   accurate and is better for SEO and accessibility.
7. **Paste the metadata from the package doc** - title, description, real chapters (from the
   Descript timestamps), tags, pinned comment, end screen, cards, playlists. (See the playbook.)
8. **Cut 2-3 Shorts in Descript.** Use auto-reframe to vertical and **burned-in** captions
   (Shorts do not show soft SRT reliably). Publish them and point each back to the full video.

## The one big change
Connect Descript to YouTube and **publish directly**. That single change removes both
round-trips (the video re-upload and the separate caption upload). Everything else is polish.

## Where the repo plugs in
- The corrected **Descript transcript** is what we turn into the YouTube package (title,
  description, and real **chapters** from its timestamps) - exactly how the Joseph Goats
  package was built. Drop a new transcript in and we generate the package.
- After publishing, set the `youtube` URL on the recording's entry in `data/recaps.json` and
  run `node scripts/build-recordings-index.mjs` so the Video button appears on the page.

## Optional automation to consider later
- A Descript template per track (artist / builder / creator) with the right lower-thirds.
- Batching: edit several at once, queue the YouTube publishes.
- A clips pass: mark Short-worthy moments while correcting the transcript, so cutting Shorts
  is a 10-minute job, not a rewatch.

## Sources
- Descript - Add captions to YouTube videos: https://www.descript.com/blog/article/how-to-add-captions-to-youtube-videos
- How to export SRT from Descript for toggleable captions: https://cotovan.com/post/how-to-export-srt-subtitles-from-descript-for-toggleable-captions/
- GoTranscript - Upload accurate YouTube captions with Descript SRT: https://gotranscript.com/public/upload-accurate-youtube-captions-with-descript-srt

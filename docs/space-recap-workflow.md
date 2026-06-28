# Space recap workflow - Farcaster Space -> recap video -> recording page

How to turn a ZABAL Gamez **audio Space** (a Farcaster Space, captured on Juke) into a published
`/recordings` page - first as audio + transcript, then upgraded to a captioned recap video.

Built around **[99darwin/juke-space-recap](https://github.com/99darwin/juke-space-recap)** (the
tool nickysap pointed us at): it transcribes a roving-host space and renders a 1920x1080 MP4 with
per-guest PFP cards, rolling captions, and a waveform.

## The pieces

- **Juke** (`juke.audio/r/<id>`) - where the Space is recorded. Each page has a short-lived (~15
  min) signed link to the native OGG.
- **`scripts/juke-fetch.mjs`** (this repo) - pulls that OGG down by URL/id.
- **juke-space-recap** (separate checkout) - OGG -> transcript (Deepgram) -> guest intros -> PFPs
  (Neynar) -> rendered MP4.
- **`scripts/ingest-recording.mjs`** (this repo) - a publish manifest -> `/recordings/<N>` page +
  `data/recaps.json` entry. Now supports `audio_url` / `listen_url` so a Space page can go live from
  audio before the video exists, then swap to the YouTube embed when the recap is up.

## One-time setup (per machine)

```bash
git clone https://github.com/99darwin/juke-space-recap
cd juke-space-recap
npm install                 # needs ffmpeg on PATH
cp .env.example .env
#   DEEPGRAM_API_KEY  -> https://console.deepgram.com   (transcription)
#   NEYNAR_API_KEY    -> https://neynar.com              (guest PFPs/metadata)
#   HOST_USERNAME     -> bettercallzaal                  (space host, no @)
```

Both API keys are **required** to render and are NOT in this repo - they live only in the tool's
`.env`. Deepgram has a metered free tier; Neynar has a free tier.

## Make a recap video

```bash
# 1. Pull the audio (run right before - the link expires fast)
node scripts/juke-fetch.mjs https://juke.audio/r/<id> ~/Downloads/<slug>.ogg
cp ~/Downloads/<slug>.ogg <juke-space-recap>/public/audio.ogg

# 2. Run the pipeline (in the juke-space-recap checkout)
npm run transcribe     # ~5-10 min for 2 hr audio -> data/transcript.json
npm run intros         # -> data/intros.json + sample clips per intro
#    listen to the clips, edit data/intros.json, fill in each guest's @username
npm run pfps           # downloads guest PFPs via Neynar
npm run waveform       # precompute FFT (required for audio > ~15 min)

# 3. Render
npm run render SpaceRecap out/test.mp4 -- --frames=0-5400   # 3-min smoke test first
npm run render SpaceRecap out/space-recap.mp4               # full render
#    a 1 hr 1080p/30fps render is ~1.5-3 hr on an M-series Mac; --fps=24 / --scale=0.667 speed it up
```

## Publish to a recording page

The rendered MP4 goes to YouTube, then through the normal ingest. Build a manifest:

```json
{
  "slug": "farcaster-intern-ama",
  "date": "2026-06-22",
  "title": "ZABAL GAMEZ AMA w/The Farcaster Intern from Farcaster",
  "presenter": "The Farcaster Intern", "handle": "@farcaster", "org": "Farcaster",
  "track": "builder", "technical": 4,
  "format": "Audio space AMA, recorded",
  "youtube": "https://youtu.be/<id>",          // the recap video, once uploaded
  "listen_url": "https://juke.audio/r/<id>",   // OR while there's no video yet
  "listen_label": "Listen on Juke",
  "transcript_markdown": "...",
  "topics": ["Farcaster", "AMA"]
}
```

```bash
node scripts/ingest-recording.mjs <manifest.json>          # dry run
node scripts/ingest-recording.mjs <manifest.json> --write  # apply
```

Publish order that loses nothing:

1. **Audio-first** - ingest with `listen_url` (Juke) + the transcript. The page goes live as an
   audio recording. (`audio_url` instead renders an inline `<audio>` player, if we self-host the OGG.)
2. **Video upgrade** - render the recap, upload to YouTube, set `youtube` on the same manifest, and
   re-ingest. It reuses the page number and swaps the audio note for the video embed.

## Notes / limits (from the tool)

- Single roving host, one mic, asks each guest "who are you?" - that intro pattern is what it keys
  on. Guests never introduced, off-mic, or with hard-to-hear names get missed; the manual
  `data/intros.json` step is where you fix that.
- The render is the slow part - smoke-test 3 minutes before committing to a full pass.
- Keep the Juke OGG backup (e.g. `~/Downloads/<slug>.ogg`); the signed link does not persist.

## Backlog this unblocks

Any Space recorded on Juke can now become a page. Current audio-space pages still on a stub:
`/recordings/20` (Farcaster Intern AMA - OGG already downloaded), plus the Spaces among Snapchain
(p24), Harness/Bankr (p22), Farcaster Batches (p15) if Juke-captured.

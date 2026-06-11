# Fireside recap video - spec (a module for ZAOVideoEditor)

Turn a recorded audio space (an X Space or any audio-only fireside) into a short,
on-brand, captioned recap video. Built as a mode inside ZAOVideoEditor, using
99darwin/juke-space-recap as the reference implementation.

First target: the Carlos (Plat0x) fireside from 2026-06-06 (`/recordings/fireside/1`),
which has a corrected transcript but no video yet.

## Why
Firesides are audio-only X Spaces. They leave us with a transcript but nothing to
watch or share in-feed. This produces a 1920x1080 (or 720p) MP4 with rolling
captions, an animated waveform, and the two speakers' profile pictures - something
we can put on the recording page, YouTube, and Farcaster.

## Reference: what juke-space-recap does
An offline Remotion pipeline that converts a Farcaster audio space (.ogg) into a
1080p recap video with per-guest PFPs, sentence-rolling captions, and an FFT
waveform. Stack: Remotion (React video) + Deepgram Nova-3 (transcription with
diarization) + Neynar (Farcaster PFP lookup) + FFmpeg. Pipeline: transcribe ->
detect intros -> manual username fill -> resolve PFPs -> fixup transcript ->
precompute waveform -> render. A 2-hour 1080p/30fps render is 3-6 hours on an
M-series Mac.

## What we keep vs. drop (firesides are 2 people, not a big space)
juke is built for the many-guest "roving host asks everyone who they are" format.
Half its pipeline exists to handle dozens of speakers. For a fireside:

KEEP:
- Remotion rendering (captions + waveform + speaker cards).
- Word-level timestamps + speaker diarization from the transcriber.
- The FFT waveform precompute.

DROP / SIMPLIFY:
- Intro detection, username suggestion, per-guest intro clips - not needed for 2 fixed speakers.
- Hardcode the two participants (host = Zaal, plus the guest) instead of discovering them.

## Architecture - two adapters (types-first, swappable)
This follows the protocol/adapter pattern from Carlos's own masterclass: define the
contract, swap the backend without a rewrite.

### Transcriber interface
```
interface Transcriber {
  transcribe(audioPath): Promise<{
    words: Array<{ text: string; start: number; end: number; speaker: number }>;
  }>;
}
```
Adapters:
- DeepgramTranscriber - v1. Best programmatic diarization + word timestamps.
- DescriptTranscriber - import an existing Descript export (we use Descript today).
- WhisperTranscriber - local/offline option later.

Word-level start/end is required so captions sync to the audio. After transcription,
run the words through our existing `scripts/fix-transcript.mjs` + glossary so captions
follow brand rules (no em dashes, correct names like WaveWarZ, Plat0x, miDAO).

### Farcaster profile interface
```
interface FarcasterProfiles {
  lookup(handleOrFid): Promise<{ pfpUrl: string; displayName: string }>;
}
```
Adapters:
- HaatzHypersnapProfiles - read from the public Hypersnap node at haatz.quilibrium.com (open, ecosystem-aligned; Quilibrium = Cassie's org, the Sopha stack).
- NeynarProfiles - fallback.
- ManualProfiles - just pass two image URLs. For a 2-person fireside this is enough for v1; no API key needed.

## Pipeline (fireside mode)
1. Drop in the audio file (Carlos space audio - owner is sourcing it).
2. Transcribe via the chosen adapter -> words with timing + speaker (0/1).
3. Clean captions through fix-transcript + glossary.
4. Map speaker 0/1 to host (Zaal) and guest; supply two PFPs (manual URLs for v1, Haatz later).
5. Precompute the waveform.
6. Render the MP4 in Remotion.
7. Publish: upload to YouTube, backfill the `youtube` field on the recap
   (`data/recaps.json`) and the recording page, then `node scripts/build-recordings-index.mjs`.

## Render
- Iterate on an M-series Mac (fast per-core, no setup) while tuning the look.
- VPS works only if it has enough cores (8+ vCPU) plus Chromium deps + ffmpeg.
- Remotion Lambda for repeatable, minutes-not-hours renders once the design is locked.
- Practical defaults for a ~1hr fireside: 720p / 24fps to start.

## Brand
1920x1080 (or 720p), ZAO palette, Syne / Outfit / JetBrains Mono. No emojis, no em
dashes, no decorative Unicode. Use the arcade ZABAL Gamez mark.

## Keys / env
- DEEPGRAM_API_KEY (owner is getting one).
- Haatz/Hypersnap node URL (haatz.quilibrium.com) for profiles; no Neynar required if we go Haatz or manual.

## Open questions
- VPS specs (vCPU / RAM) to decide VPS vs Mac vs Lambda.
- Exact Hypersnap user-lookup endpoint + response shape (docs gated; confirm in terminal).
- Caption style: word-by-word karaoke vs sentence blocks; speaker color coding.

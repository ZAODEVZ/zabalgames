# ZAO Video Editor - spec + brand reference

Goal: replace Descript in the ZAO recordings pipeline with our own automated tool, so a
raw workshop/show recording becomes (1) a clean corrected video, (2) distribution clips,
(3) a clean Markdown transcript, and (4) a live `/recordings/N` page - with as few manual
steps as possible. This doc is the single reference for that build: why, the brand rules it
must obey, every preference we have agreed, what already exists, and the proposed
architecture.

The build repo is **github.com/bettercallzaal/ZAOVideoEditor**. This spec lives in
`zabalgames` because the pipeline it documents (and the outputs it targets) live here; pull
it into ZAOVideoEditor as the founding SPEC. Sources it draws from: `llms.txt`,
`docs/recordings-workflow.md`, `scripts/fix-transcript.mjs`, `data/transcript-corrections.json`,
and the WaveWarZ transcript-cleaning session.

---

## 0. Brand casing - RESOLVED

Canonical spelling is **WaveWarZ** (capital Z), per the `llms.txt` naming glossary. The
lowercase `WaveWarz` that had crept into `data/transcript-corrections.json` and
`docs/recordings-workflow.md` is a bug and has been corrected to match. Domains stay
lowercase (`wavewarz.com`) - case-insensitive, only the brand word in prose takes the
capital Z. All auto-correct rules in this tool use **WaveWarZ**.

---

## 1. Why build this (Descript pain points to beat)

From the Descript research + the hands-on session, the specific gaps our tool should close:

1. **No Google Drive / Gmail import.** Descript can only import by upload; it cannot pull
   from Drive or Gmail. Today the editor downloads from the shared inbox and re-uploads -
   a round trip per video. Our tool should ingest straight from the shared Drive folder.
2. **Filler removal is not context-aware.** Descript's list-based removal cuts cadence words
   ("so", "you know") you want to keep, and Underlord (AI) over-cuts false starts. We want a
   conservative default (um/uh only) plus an opt-in aggressive pass, always human-reviewable.
3. **No batch "accept all" for cuts.** Accepting/restoring strikethrough is per-word and
   confusing (this tripped us up live). Our review UI should make accept/reject obvious and
   batchable.
4. **Glossary is not retroactive** and is locked inside Descript. Ours is a versioned JSON
   file in the repo (`transcript-corrections.json`), reusable across every tool and recording.
5. **Per-seat collaboration cost.** Two people (uploader + editor) shouldn't need paid seats
   to hand work back and forth.
6. **AI makes off-brand voice decisions.** Cadence, em dashes, number formatting - Descript
   doesn't know our brand rules. Ours bakes the rules in (section 3).

---

## 2. Current state - what already exists (do NOT rebuild)

The pipeline is already half-automated in this repo. The new tool slots into it, replacing
only the Descript stages.

| Asset | What it does | Keep / extend |
|-------|--------------|---------------|
| `scripts/fix-transcript.mjs` | Whole-word, case-insensitive brand-term find/replace over any caption/transcript file. `safe` rules auto-apply; `review` rules are flagged for a human only. Zero deps. | Reuse as the brand-correction stage. |
| `data/transcript-corrections.json` | The glossary: `safe` (always-wrong mishears) + `review` (context-dependent). | The single source of truth for auto-correct AND for transcription custom-vocab. |
| `docs/recordings-workflow.md` | The 7-stage manual pipeline (captions -> cuts -> clips -> publish -> page -> recap -> validate). | The process our tool automates. |
| `docs/recordings/recording-vocabulary.md` | Brand vocab fed to the transcriber *before* it runs so proper nouns come out right. | Feed as custom vocabulary / word-boost. |
| `docs/recordings/caption-style-prompt.md` | The on-screen animated-caption look. | Caption renderer style input. |
| `docs/recordings/_template.md` | The per-recording edit sheet (corrections + cuts + clips). | The machine-readable job spec our tool reads/writes. |
| `recordings/N.html` + `scripts/build-recordings-index.mjs` + `recordings/index.json` + `data/recaps.json` | The published page, the machine-readable recordings index, the recap entries. | The tool's final output targets. |
| Transcripts at `data/streams/zabal-games-workshops/raw/transcripts/YYYY-MM-DD-presenter-topic.md` | The clean curated transcript per recording. | The Markdown export target. |
| **AttaBotty** (agent) | Twitch + streaming ops, post-stream review (Sonnet, Opus for review). | Natural home to trigger the pipeline post-stream. |
| **Hermes pattern** | All ZAO agents spawn the Claude Code CLI as a subprocess (OAuth via Max plan), never direct API calls - zero marginal cost. | Use this for every LLM step in the tool. |

Related adoptable projects this overlaps with: **#07 COC Concertz content-pipeline
automation** (record -> Descript -> newsletter -> cross-post) and **#08 streaming auto-clip
flywheel** (24h stream -> 150+ shorts). This tool is effectively the engine under both.

---

## 3. Brand rules (NON-NEGOTIABLE - the tool must enforce these)

### Naming glossary - exact spellings (from `llms.txt`)

| Correct | Wrong |
|---------|-------|
| WaveWarZ | Wave Wars, Wavewarz |
| COC Concertz | COC Concerts, CocConcertz |
| The ZAO | the Zao, Zao |
| BetterCallZaal | Bettercallzaal, Better Call Zaal |
| Joseph Goats | Jose Goats, Jose |
| SongJam | Songjam |
| ZABAL | Zabal, zabal |
| SANG | Sang |
| ZOE | Zoe |
| ZOLs | Zols, ZOL |
| FISHBOWLZ | Fishbowlz |
| Stilo World | StiloWorld, Steelo, Steelo World |
| ZAOstock | Zaostock, ZAO Stock |
| ZAO Music | ZAO music, ZaoMusic |
| ZAO DEVZ | ZAO Devs, ZAOdevz |
| ZABAL Gamez | ZABAL Games, Zabalgames |
| zabalgamez.com | zabalgames.com |
| Stilo / Stilo World | Steelo (CONFIRMED this session) |
| Hurricane Mike | (verify - speaker handle in WaveWarZ talk) |

### Writing rules (apply to every transcript, caption, page, cast, commit)

- **No emojis.** Anywhere.
- **No em dashes.** Hyphens only.
- **No decorative Unicode** (checkmarks, warning triangles, play buttons). Use labels:
  `[MUSIC]`, `OVERDUE`, `DONE`, `IN PROGRESS`.
- **No crypto/web3/onchain jargon in public copy** ("digital creators" / "builders").
- **"100+"** for ZAO member count, never a specific number.
- Tight, factual, warm. No marketing fluff ("revolutionary", "game-changing").
- WaveWarZ voice is the loud arena exception (competitive, stats-forward) - still no
  emojis/em dashes.

### Visual (if the tool renders captions / pages)

- Fonts: Syne (headings), Outfit (body), JetBrains Mono (numbers).
- ZAO palette (`--bg #070709`, `--orange #ff6b35`, `--cyan #00e5ff`, etc. - full list in `llms.txt`).
- Mobile-first, 424px Farcaster viewport, dark default, 8px radius.

---

## 4. Transcript-cleaning preferences (everything agreed this session)

The hand pass we did on the WaveWarZ talk, codified so the tool reproduces it.

### 4a. Brand spelling corrections (auto, find/replace)

- `Wave Wars` / `WaveWars` -> `WaveWarZ`
- `wavewars.com` and any "with a C" qualifier -> `wavewarz.com` (and drop the "with a C/Z" phrase once spelled right)
- `zabalgames.com` / "ZABAL games.com" -> `zabalgamez.com`
- `base` (the chain) -> `Base`
- `Sol` -> `SOL`
- `Steelo` -> `Stilo`; `Steelo World` -> `Stilo World`
- `X/Twitter` and "Twitter handle" -> `X` / "X handle"

### 4b. Number formatting

- Spelled amounts -> digits: `point five SOL` -> `0.5 SOL`; `five hundred SOL` -> `500 SOL`;
  `point zero five` -> `0.05`; `point zero three` -> `0.03`.
- Times -> digits: `eight thirty PM EST` -> `8:30pm EST`.
- `forty plus` -> `40-plus`.

### 4c. Filler removal (the key preference)

- **Conservative by default: remove um / uh only.** Do NOT auto-remove "you know", "like",
  "so", "boom", "I mean" - those are cadence and get cut by hand only where wanted.
- Keep the speaker's rhythm; the tool should never decide cadence.
- Provide an opt-in "aggressive" pass (LLM) for false starts, but it is review-only, never
  silent.

### 4d. False-start / stutter repairs (review-flagged or conservative auto)

- Collapse repeats: `we're all, we're all` -> `we're all`; `one of, one of` -> `one of`;
  `right there, right there` -> `right there`.
- Cut broken openings: `we have a--`, `you wanna or you wanna`, `And then And boom`.
- Word repairs: `i-is` -> `is`; `settl-settlement` -> `settlement`;
  `texts... I mean, tech` -> `tech`.

### 4e. Bleed removal

- Drop segment bleed that isn't part of the talk: e.g. the WaveWarZ intro fragment
  ("Decentralized energy, let's talk about ways") and the rap outro
  ("Zaal keep it a Zaali..."). Flag these for human confirm, don't assume.

### 4f. Always flag-for-review (NEVER auto-change)

- Proper names: Hurricane Mike, It's Wonderful, Godcloud, Geekmyth, Juan, Tuck Nuisance.
- Ambiguous terms: "Ride the WaveWarZ" (song title vs brand?), "Zap Fan" (mishear?).
- Uncertain facts the speaker hedged: "June 21 or May 21" date.
- This mirrors the existing `review` rules in `transcript-corrections.json` (e.g. `Zaal`
  the person vs `ZAO` the org; `Games` the brand vs "video games").

### 4g. Two separate outputs

The cut **video transcript** (timestamped, drives the cuts) and the clean **readable
transcript** (for the page, brand-voice polished, no em dashes) are two passes. Descript
conflates them; we keep them distinct.

---

## 5. Collaboration + ingest reality

- Raw videos land in the shared **info@thezao** Gmail, which the uploader and editor both
  access. Gmail's ~25MB attachment cap means real recordings already route as **Google Drive
  links**, so the team is effectively on Drive already.
- Two roles: **uploader** (drops the raw file) and **editor** (Iman - does the cut).
- Output goes back into this repo (transcript md + `/recordings/N` page + recap).
- The tool should **ingest from a shared Drive folder directly** (the thing Descript can't
  do), so the editor stops downloading + re-uploading.

---

## 6. Proposed architecture (the replacement pipeline)

Stages mirror `docs/recordings-workflow.md`; the tool automates the Descript-bound ones.

```
A. INGEST      Watch a shared Google Drive folder (Drive API). New video -> pull -> queue.
                  Optional: Gmail API to grab Drive links/attachments from info@thezao.
B. TRANSCRIBE  Speech-to-text with WORD-LEVEL timestamps + custom vocabulary.
                  Feed the glossary (4a + recording-vocabulary.md) as word-boost so brand
                  nouns come out right the first time (the Descript-glossary equivalent).
C. CORRECT     Run scripts/fix-transcript.mjs logic: safe rules auto-apply, review rules
                  flagged. Reuses data/transcript-corrections.json verbatim.
D. CUT PLAN    Build cut ranges from word timestamps:
                  - filler (um/uh only, conservative) -> cut ranges
                  - dead air / long gaps -> cut ranges
                  - optional LLM false-start pass (Hermes/Claude subprocess) -> SUGGESTED
                    cut ranges with confidence, review-only
                  - bleed/intro/outro -> flagged
E. REVIEW UI   Web app: transcript synced to playback, click word to seek, toggle any cut
                  on/off, presets ("um/uh only"), batch accept/reject (fix the Descript
                  pain). Decisions saved to Supabase. This is the human gate.
F. RENDER      ffmpeg: keep-segments -> trimmed master. Burn animated captions
                  (caption-style-prompt.md style, e.g. ASS subtitles or Remotion).
                  Export clips (4e ranges) as shorts with the naming convention
                  (w<N>-clip-<NN>-<mmss>.mp4).
G. READABLE    Second Claude pass: brand-voice clean transcript (section 3 + 4), em-dash
                  free, numbers formatted -> Markdown.
H. PUBLISH     Write transcript md to data/streams/.../transcripts/, build /recordings/N
                  page from the template, add data/recaps.json entry, rebuild
                  recordings/index.json, run scripts/validate.mjs. Upload cut to YouTube,
                  record the video ID.
```

### Stage-by-stage tech choices

- **A. Ingest:** Google Drive API (watch/changes), service account on info@thezao. Solves
  the no-Drive-import gap directly.
- **B. Transcribe (pick one):**
  - **WhisperX** (open, self-host, word-level timestamps + diarization, free) - cheapest,
    matches the "self-host / no per-use" ZAO preference. Custom vocab via initial-prompt.
  - **Deepgram** (hosted, word timestamps, keyterm prompting, speaker labels, cheap) -
    best custom-vocab support.
  - **AssemblyAI** (hosted, `word_boost` custom vocab, auto-chapters, speaker labels).
  - Recommend WhisperX for cost/control; Deepgram if hosted reliability matters more.
- **C. Correct:** reuse `scripts/fix-transcript.mjs` (already built, zero-dep).
- **D. Cut plan:** plain JS over the word array for filler/gaps; Claude via the Hermes
  subprocess pattern for the optional false-start pass (zero marginal cost on the Max plan).
- **E. Review UI:** Next.js 16 + Tailwind v4 (ZAO default stack), Supabase for state.
- **F. Render:** ffmpeg for cut + concat + clip export; captions via ASS subtitle burn-in or
  Remotion if we want the animated look.
- **G. Readable pass:** Claude (Opus for quality) via subprocess, brand rules in the
  system prompt.
- **H. Publish:** existing repo scripts + `validate.mjs`; YouTube Data API for upload.

### Tech stack (aligned to ZAO defaults - do not invent new deps)

```
Frontend:  Next.js 16 (App Router) + Tailwind v4
Backend:   Next.js API routes + Supabase (Postgres + Storage)
Media:     ffmpeg; WhisperX (or Deepgram) for STT; Remotion/ASS for captions
LLM:       Claude via Claude Code CLI subprocess (Hermes pattern, Max-plan OAuth, no API key)
Ingest:    Google Drive API (+ optional Gmail API), service account on info@thezao
Publish:   YouTube Data API; existing repo scripts (build-recordings-index, validate)
Reuse:     MiniMax AI already does YouTube descriptions in the COC pipeline - keep it
Host:      Vercel (UI) + a worker for ffmpeg/STT (Vercel cron/Node, or a small VPS)
License:   MIT (matches every ZAO repo)
```

---

## 7. Descript feature -> our replacement (mapping)

| Descript feature we used | Our replacement |
|--------------------------|-----------------|
| Transcription | WhisperX / Deepgram with word-level timestamps |
| Transcription glossary (custom vocab) | `transcript-corrections.json` fed as word-boost (stage B) + `fix-transcript.mjs` (stage C) |
| Correct All (find/replace everywhere) | `fix-transcript.mjs` safe rules |
| Remove filler words | Stage D, um/uh-only default, review-gated |
| Underlord AI edits (false starts, pacing) | Stage D optional Claude pass, review-only |
| Edit-by-text / strikethrough accept-reject | Stage E review UI with batch accept/reject |
| Export transcript (md/srt/txt) | Stages C + G outputs |
| Collaboration (drives/seats) | Shared Drive ingest + Supabase project state, no per-seat cost |
| Export to Google Drive | Drive API round-trip (we also ingest from it) |
| Caption look | `caption-style-prompt.md` -> ASS/Remotion renderer |

---

## 8. Build order (phased - velocity over polish)

1. **Phase 1 - headless transcript pipeline.** Drive ingest -> WhisperX -> `fix-transcript.mjs`
   -> Claude readable pass -> Markdown into the repo. No video cutting yet. Immediately
   removes Descript from the *transcript* path.
2. **Phase 2 - cut planning + render.** Filler (um/uh) + gap detection -> cut ranges ->
   ffmpeg render. Output a clean video without a UI (cuts from a JSON edit sheet).
3. **Phase 3 - review UI.** The web app for toggling/accepting cuts and clips - the part that
   fully replaces the Descript editor and fixes the accept-reject confusion.
4. **Phase 4 - captions + clips + auto-publish.** Animated captions, shorts export, and the
   `/recordings/N` page + recap + index auto-generation.

Phase 1 alone retires most of the Descript dependency for the recordings workflow.

---

## 9. Open decisions (need a human call)

1. **Self-host (WhisperX) vs hosted (Deepgram/AssemblyAI)** for transcription.
2. **Caption renderer** - ASS subtitle burn-in (simple) vs Remotion (richer animated look).
3. **Where the ffmpeg/STT worker runs** - Vercel functions have time/size limits; a small VPS
   (same box as Ollama) may be cleaner for long recordings.
4. **How outputs land back in `zabalgames`** - ZAOVideoEditor writes via PR, or via a shared
   data path / API.

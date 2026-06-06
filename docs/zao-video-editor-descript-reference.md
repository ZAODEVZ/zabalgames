# Descript + Underlord capabilities (reference for the ZAO video editor)

Captured hands-on while producing the ZABAL Gamez workshop recordings. The point of this
doc: we want to build the **ZAO video editor**, and Descript (specifically its built-in LLM,
**Underlord**) is the closest thing to what we want. This is a running list of what it can
actually do, the exact controls it exposes, and what that implies for our own tool. Brand
rules apply here too: no emojis, hyphens not em dashes.

Related, already in the repo:
- [recordings-workflow.md](../recordings-workflow.md) - the end-to-end recording pipeline.
- [recordings/caption-style-prompt.md](recordings/caption-style-prompt.md) - our exact caption look.
- [recordings/recording-vocabulary.md](recordings/recording-vocabulary.md) - the preemptive brand vocabulary.

---

## The headline: prompt-driven editing (Underlord)
Underlord is an in-app LLM you instruct in natural language, and it performs the edit on the
timeline. We drove real production edits entirely through prompts: caption styling, brand
spelling correction, and adding visual layers. This is the core interaction model the ZAO
video editor should aim for - **describe the edit, the tool does it** - on top of a normal
manual timeline.

## Captions
- **Auto-generated** from the audio, word-timed.
- **Style presets** as a base (e.g. "Modern yellow" - karaoke style with a stroke on words),
  then fully overridable.
- **Karaoke / word-by-word highlighting**: the active (spoken) word is styled differently
  from the future (unspoken) words.
- **Exact controls we set by prompt:** font (Sora), size (60), weight (600), alignment
  (center), position (near bottom), future-word color (`rgb(228,226,221)`), active-word color
  (`rgb(229,57,53)`), per-state stroke color + width (black, 16), and highlight-background
  on/off. Applied **across all scenes** in one instruction.
- Captions **burn in at export**, so spelling has to be right before export (see vocabulary).

## Transcription + vocabulary correction
- **Transcript-based editing:** the transcript is the edit surface - editing text edits the
  video.
- **Vocabulary / proper-noun correction by prompt:** give Underlord a glossary of correct
  spellings + known mishearings and it finds and fixes every instance across the script
  (it reported back counts, e.g. "Zabal Games -> ZABAL Gamez, 10 fixes"). This is exactly our
  `recording-vocabulary.md` + `scripts/fix-transcript.mjs` glossary, but applied live, in-tool,
  before captions burn in.
- It can also **export an SRT** subtitle file for upload to YouTube (separate from burned-in
  captions).

## Visual layers
- **Audio waveform visualizer** as a decorative layer: audio-reactive bars with controllable
  **color, opacity, height/size, width, and position** (we ran full-width thin bands top and
  bottom). Added by prompt.
- **Composition dimensions** are explicit (our project: 1280x720). Layer size can be reasoned
  about as a percent of frame (our bars: ~50px = ~7% of 720p height).
- **Layer order via zOrder** (higher zOrder = further back), so decorative layers can be kept
  behind captions and watermarks so nothing important gets covered.
- **Intro / outro clips** (`zabalgamezintro.mov`, `zabalgamezoutro.mov`) dropped on the
  timeline; **persistent watermark** overlay (`ZABAL GAMEZ @ zabalgamez.com`) across the video.
- **Scenes:** edits can target one scene or all scenes.

## Export
- Video export; **SRT subtitles** export; the burned-in captions are baked into the rendered
  video.

---

## What this implies for the ZAO video editor
A feature checklist, ranked by how much leverage each gave us in practice:

1. **Prompt-driven edits over a real timeline.** Natural-language instructions that perform
   concrete timeline operations (style captions, add a layer, find-and-replace terms). This is
   the differentiator.
2. **Text-as-timeline editing.** Edit the transcript to edit the video; word-level timing.
3. **A brand vocabulary system.** A reusable per-brand glossary (correct spellings + known
   mishearings) applied at transcription time so proper nouns are never wrong. We already have
   ZABAL Gamez's: `data/transcript-corrections.json`.
4. **Reusable brand templates.** Caption style, intro/outro, watermark, and visualizer saved
   as a one-click "brand kit" so every video in a series matches. We are currently re-applying
   these by hand each time - a template/preset object is the obvious win.
5. **Karaoke captions with per-state styling** (active vs future word: color, stroke,
   highlight) and full typography control.
6. **Audio-reactive visual layers** (waveform/visualizer) with color, opacity, size, position,
   and explicit z-ordering relative to captions/watermark.
7. **Scene-scoped vs whole-project edits.**
8. **Export to both rendered video and SRT.**

### Gaps we hit (opportunities for the ZAO editor to do better)
- Vocabulary correction is **not preemptive by default** - Underlord transcribes first, then we
  re-run a vocabulary pass. A brand glossary loaded **before** transcription would remove a
  whole step (the burned-in captions would never be wrong).
- Caption styling and the visualizer had to be **re-described each video** - no persistent
  per-brand preset, so consistency depends on pasting the same prompt. A saved brand kit fixes
  this.
- Chapter/timestamp generation was manual on our side; an editor that emits chapter markers from
  the transcript would close the loop into a `/recordings/N` page automatically.

---

*Source: produced ZABAL Gamez Workshop recordings 1-3 (yerbearserker Empire Builder Parts 1
and 2; Bonfire with Joshua.eth and Plat0x), June 2026. Settings and behaviors above are what
Descript/Underlord actually did during those edits.*
</content>

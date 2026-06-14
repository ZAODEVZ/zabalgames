# ZAOVideoEditor -> ZABAL Gamez integration

How the [ZAOVideoEditor](https://github.com/bettercallzaal/ZAOVideoEditor) tool publishes a
finished workshop into this site. This is the contract between the two repos: ZAOVideoEditor
produces, `zaodevz/zabalgames` consumes. Hand this doc to whoever builds the tool's export side.

The goal: a session goes from "ran" to "live on zabalgamez.com" with no hand-built HTML and
no re-typing brand fixes. It closes the manual chain in `docs/recordings-workflow.md` that
currently leaves sessions stuck as placeholders (e.g. Joseph Goats `/recordings/6`, Will T `/7`).

---

## Recommended connection: a publish bundle, delivered by PR

ZAOVideoEditor emits a **publish bundle** (one JSON manifest + a transcript file + optional
thumbnail) and opens a **pull request** to `zaodevz/zabalgames` with it. This fits the site's
model exactly - it is a static site + edge functions on Vercel, every merge auto-deploys, and
the repo already treats GitHub as the submission surface (the doc-784 register/commit-watcher
pair). No new runtime coupling, no API to keep alive.

Two ways to deliver the bundle, pick per how autonomous the tool is:
1. **PR (recommended).** The tool (or its operator) commits the bundle to a branch and opens a
   PR. CI = `node scripts/validate.mjs` (already the repo's check). A human merges; Vercel ships.
2. **Local ingest.** Run `node scripts/ingest-recording.mjs <manifest.json>` in a `zabalgames`
   checkout (built in this PR). It writes the transcript, upserts the recap, and rebuilds the
   index - then you commit/PR the result. Good for running the tool on the same machine as a clone.

Either way the **unit of exchange is the manifest below.**

---

## The publish manifest (what ZAOVideoEditor emits)

One JSON object per recording. `scripts/ingest-recording.mjs` consumes exactly this shape.

```json
{
  "slug": "wavewarz-hurricane",
  "date": "2026-06-13",
  "type": "workshop",
  "title": "Earn from music battles, not streams: WaveWarz",
  "presenter": "Hurricane Ike",
  "handle": "@hurric4n3ike",
  "org": "WaveWarz",
  "track": "artist",
  "format": "Recorded workshop",
  "youtube": "https://youtu.be/2GLRrILYoo4",
  "link": "https://wavewarz.com",
  "link_label": "WaveWarz",
  "summary": "1-2 paragraph recap...",
  "topics": ["WaveWarz", "music battles", "Solana"],
  "takeaways": ["...", "..."],
  "share_topics": ["...", "..."],
  "chapters": [
    { "t": 0, "label": "An artist earned 0.5 SOL in minutes" },
    { "t": 35, "label": "What WaveWarz is, and the 1% trade cut" }
  ],
  "transcript_markdown": "---\ntitle: ...\n---\n\n[00:00] full cleaned transcript body...",
  "casts": {
    "farcaster": "drafted /zabal cast...",
    "x": "drafted X post..."
  }
}
```

Field rules:
- `slug` - lowercase, hyphenated. Transcript filename becomes `<date>-<slug>.md`.
- `type` - `workshop | fireside | bczworkshop` (drives `/recordings` hub grouping). Default `workshop`.
- `track` - `artist | builder | creator`.
- `t` in chapters is **seconds** (the page uses it for the clickable jump; first chapter must be 0).
- `transcript_markdown` - the full cleaned transcript, ideally already with the frontmatter block
  below. If frontmatter is absent, the ingest script generates it from the manifest fields.
- `youtube`, `thumbnail`, `casts` are optional - include only what exists.

## Output contracts (the formats this repo already uses)

### 1. Transcript file
Path: `data/streams/zabal-games-workshops/raw/transcripts/<date>-<slug>.md`. Frontmatter:
```yaml
---
title: <title>
show: ZABAL Gamez Workshops
presenter: <presenter> (<handle>)
org: <org>
date: <date>T00:00:00.000Z
format: <format>
language: en
track: <track>
youtube: <youtube>
topics: [...]
---
```
Body: cleaned transcript with `[mm:ss]` or `[hh:mm:ss]` markers at paragraph starts. Brand-clean
(no emojis, hyphens not em dashes). See `2026-06-13-wavewarz-hurricane.md` for the reference.

### 2. Recap entry (`data/recaps.json`)
Prepend a new object (newest first) using the manifest fields. The site's `_note` in that file
is the field list; the integration **adds one field, `chapters`** (array of `{t, label}`), so the
recording page can be generated instead of hand-built. `transcript` is the GitHub blob URL of the
file above; `page` is `/recordings/<N>` (the next free number). After writing, run
`node scripts/build-recordings-index.mjs` (regenerates `recordings/index.json`, `recordings.txt`,
and the hub JSON-LD). The recap is what surfaces the session on `/speakers`, `/recaps`, and `/status`.

### 3. Glossary (read AND write `data/transcript-corrections.json`)
This is the shared, self-teaching brand-term fix list - **the tool's correction source, not a new
one.** Schema: `safe[]` (auto-applied, whole-word, case-insensitive) and `review[]` (flagged for a
human, context-dependent). When a new recurring mishearing is confirmed, the tool appends a
`{from, to, note}` entry (safe if always wrong; review if context-dependent) - that is the
"fix a word once, it learns" behavior, version-controlled. SongJam and Stilo World should be added.

### 4. Drafted casts
Follow `docs/distribution-casts-2026-06-11.md`: post into the `/zabal` channel, brand-clean,
`@zaal` credit on Farcaster / `via @bettercallzaal` on X. The day-of two-beat and share copy
already have reusable templates there.

### 5. Bonfire (optional, recommended)
Push the recap into the ZAO knowledge graph using the existing path: the dispatch format read by
`scripts/aggregate-dispatches.mjs` -> `data/bonfire-graph.json` -> `scripts/push-to-bonfire.mjs`.
This is what makes the library AI-queryable later.

---

## What each side builds

**ZAOVideoEditor (Claude Code on that repo):**
- Emit the publish manifest above from a finished session.
- Generate the transcript with our frontmatter + import/append `data/transcript-corrections.json`.
- Derive `chapters` (t in seconds) from the timestamped transcript.
- Draft the casts per our templates.
- Deliver the bundle: open a PR to `zaodevz/zabalgames` (preferred) or write files for local ingest.

**zabalgames (this repo - SHIPPED):**
- `scripts/ingest-recording.mjs` - consumes a manifest: writes the transcript (generating
  frontmatter + applying the `data/transcript-corrections.json` safe fixes and em-dash ->
  hyphen), upserts the recap (with `chapters`), generates `recordings/N.html`, and rebuilds
  the index. `--write` to apply; default is a dry-run report. Re-run on the same `date+slug`
  to UPDATE in place (e.g. when the video lands after a transcript-only first pass) - it
  reuses the page number. CREATE picks the next free `/recordings/N`.
- `chapters` field is in the `recaps.json` schema and the generated page renders the clickable
  chapter jumps - the tool never has to emit HTML (retires the hand-built `/recordings/N.html`
  step, the #1 pain point). No-video manifests generate the "processing" placeholder page.
- `node scripts/validate.mjs` stays the PR gate.

  Usage: `node scripts/ingest-recording.mjs <manifest.json> [--write]`. Optional page-only
  fields the generator honors beyond the manifest spec above: `headline` + `accent` (the H1
  and the word to color), `eyebrow` (the breadcrumb tail), `button_title` (the Mini App embed
  button), `description` / `og_description` (meta overrides).

## Open questions to settle with the tool's author
- PR-based delivery vs local ingest as the default (recommend PR).
- Does the tool commit thumbnails to `assets/workshops/<date>-<slug>.png`, or do those stay manual?
- Bonfire push from the tool, or leave it to this repo's existing cron/scripts.

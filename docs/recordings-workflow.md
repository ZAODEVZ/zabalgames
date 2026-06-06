# Recordings workflow

How a raw workshop recording becomes a corrected video, distribution clips, and a live
`/recordings/N` page. The repeatable pipeline so each recording is handled the same way
and the ZAO intern stops re-typing the same brand-term fixes every time.

The proven reference is Workshop #1: `recordings/1.html` (page), the
`data/recaps.json` entry, and `docs/recordings/workshop-1-empire-builder.md`
(the filled edit sheet).

**Anyone can help** (corrections, clip suggestions, recording submissions) without
touching this pipeline - see the public contributor guide,
[docs/recordings/CONTRIBUTING.md](recordings/CONTRIBUTING.md), and the GitHub issue
forms under `.github/ISSUE_TEMPLATE/`. This doc is the internal side of those inputs.

---

## Inputs (from the ZAO intern, per recording)

For each recording the intern produces three things, all keyed by timestamp:

1. **Caption corrections** - `Original -> Edit` at a time, fixing what the auto-captions
   misheard (mostly ZAO brand vocabulary).
2. **Cuts** - time ranges to remove from the master (off-topic, dead air, mistakes).
3. **Clip suggestions** - short time ranges (~10-30s) to export as standalone clips for
   distribution (the "clipped to ~15s pieces" play).

Capture all three in one **edit sheet**: copy `docs/recordings/_template.md` to
`docs/recordings/<slug>.md` and paste the intern's notes into the three sections.
That is the single coordination doc for the recording.

---

## Stage 1 - Captions (auto-fix, then review)

The auto-captions mis-hear the same brand words every single time (Gamez, $Zabal,
Bonfire, Plat0x, Farcaster, Neynar, WaveWarz...). That list lives once in
`data/transcript-corrections.json` and is applied by a script - the intern no longer
needs to list those, only genuine one-offs.

```sh
# download the auto-captions (.srt/.vtt) from YouTube Studio, then:
node scripts/fix-transcript.mjs path/to/captions.srt           # dry run - shows what it would do
node scripts/fix-transcript.mjs path/to/captions.srt --write   # apply the safe fixes in place
```

- **safe** rules are auto-applied (whole-word, case-insensitive; the longer correct
  spellings are left intact by word boundaries).
- **review** rules are **flagged, never auto-applied** - they are context-dependent and
  the same misheard word maps to different fixes by meaning:
  - `Zaal` -> `ZAO` only when the speaker means the org/community, not the person.
  - `Zibal`/`Xibal` -> `$Zabal` for the token, but `Zabal` for the project/brand.
  - `Games` -> `Gamez` for the brand, but leave generic uses ("video games").
- Resolve the flagged lines plus the intern's one-off corrections by hand, then upload
  the corrected captions back to YouTube.

**Extending the glossary:** when a new recurring mishearing shows up, add it to
`data/transcript-corrections.json` (`safe` if it is always wrong, `review` with a `note`
if it depends on context). Every future recording then gets it for free.

The repo's curated transcript (`data/streams/zabal-games-workshops/raw/transcripts/`)
is separate and already clean - the corrections target the raw captions, not that file.

## Stage 2 - Cuts

Hand the editor the **Cuts** ranges from the edit sheet; they remove those segments from
the master before export. Note any cut that shifts the timeline (chapter/clip timestamps
after a cut move earlier by the cut's length).

**Caption look:** keep the on-screen animated captions consistent with the reusable
prompt in [docs/recordings/caption-style-prompt.md](recordings/caption-style-prompt.md)
(paste it into Descript Underlord). The caption *look* and the caption *spelling* (the
glossary fixes above) are two separate passes.

## Stage 3 - Clips

Hand the editor the **Clip suggestions** ranges; each becomes a standalone short for
/zabal + X. Keep a clip naming convention so they map back to the recording
(e.g. `w1-clip-01-1m28.mp4`).

## Stage 4 - Publish the video

Upload the final cut to YouTube. Record the **video ID** and whether it is public or
unlisted (unlisted = share with the guest first). Put the ID in the edit sheet.

## Stage 5 - Build the `/recordings/N` page

Copy the reference page and swap the recording-specific values:

```sh
cp recordings/1.html recordings/N.html
```

Fields to change (all in `recordings/1.html`; line numbers are a guide):
- `<title>`, `<meta name="description">`, canonical, all `og:`/`twitter:` title+desc+url,
  the `fc:miniapp` button title + url, `og:image`/`twitter:image` (the thumbnail).
- Hero: the eyebrow `Workshop #N`, the `<h1>`, the `.rec-by` presenter line.
- The `iframe` `src` (embed URL) and `title`.
- The `.rec-links`: "Watch on YouTube" href, transcript href, any context link.
- The `.recap-summary` paragraph.
- `.rec-chapters`: one `<li>` per chapter - `data-start` is the start in **seconds**
  (e.g. 1:18 = 78), the `<span class="t">` is the display `m:ss`.
- `.rec-topics` and `.rec-takeaways`.
- The inline `<script>`: `YT_ID`, `PAGE_URL`, the `TOPICS[]` share lines, and the share
  text (guest handle + topic).

The page already opts out of native gestures (`fc:disable-native-gestures`) for the
embed, and the chapter buttons reload the player at `&start=<seconds>&autoplay=1`.

## Stage 6 - Recaps entry

Add an object to `data/recaps.json` (newest first). Set `page` to `/recordings/N` so the
recap's primary button points at the landing page; include `youtube`, `transcript`,
`topics[]`, `takeaways[]`, and `share_topics[]`. See the file's `_note` for the full
field list.

## Stage 7 - Discoverability + validate

- The recordings **hub** (`recordings.html`) and the Season **footer** already exist;
  add a hub line for the new recording if it is a headline session.
- Run `node scripts/validate.mjs` before pushing (every JSON parses, every inline script
  compiles, the manifest decodes).

---

## Quick reference

| Step | Command / file |
|------|----------------|
| Edit sheet | `cp docs/recordings/_template.md docs/recordings/<slug>.md` |
| Fix captions | `node scripts/fix-transcript.mjs <captions> --write` |
| Glossary | `data/transcript-corrections.json` (safe = auto, review = flag) |
| New page | `cp recordings/1.html recordings/N.html` then swap fields |
| Recap | add entry to `data/recaps.json` |
| Validate | `node scripts/validate.mjs` |
</content>

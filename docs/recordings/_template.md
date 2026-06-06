# Recording edit sheet - <TITLE>

> Copy this to `docs/recordings/<slug>.md` and fill it in. The single coordination doc
> for one recording: the intern's notes go in the three sections below, and it tracks the
> recording from raw upload to live `/recordings/N` page. See `docs/recordings-workflow.md`.

- **Recording:** Workshop #N - <topic>
- **Guest:** <name> (<handle>) - <org>
- **Date:** <YYYY-MM-DD>
- **Master runtime:** <m:ss>
- **Final video ID:** <youtube id> (<public | unlisted>)
- **Page:** /recordings/N  (status: <not started | scaffolded | live>)
- **Recap entry:** <added to data/recaps.json? y/n>

---

## Corrections

Brand-term mishearings in `data/transcript-corrections.json` are auto-applied by
`scripts/fix-transcript.mjs` - do NOT list those here. List only one-offs and any
context calls the script flags. Format: `time  Original -> Edit`.

```
<time>  <Original> -> <Edit>
```

## Cuts

Time ranges to remove from the master. Note if a cut shifts later timestamps.

```
<start> - <end>   <reason>
```

## Clip suggestions

Short ranges to export as standalone distribution clips (~10-30s each).

```
<start> - <end>
```
</content>

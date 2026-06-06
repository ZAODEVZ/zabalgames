# ZABAL Gamez caption style - reusable prompt

Paste this into Descript Underlord (or any caption/subtitle tool) to reproduce the
ZABAL Gamez animated caption look on a new recording. Keep it consistent across every
workshop video. Part of the [recordings workflow](../recordings-workflow.md).

---

## The prompt

```
Add animated captions in the ZABAL Gamez style:

- Word-by-word "karaoke" captions: show 1 to 3 words at a time, tightly synced to the
  audio, with the word currently being spoken emphasized.
- Active word: a solid rounded highlight block behind the current word in ZABAL red
  (#ff3d6e), with white text on top. The other visible words are plain white.
- Font: bold, heavy sans-serif. White text with a subtle dark outline or drop shadow so
  it stays legible on any background.
- Sentence case, not all caps.
- Position: lower third, centered horizontally, sitting just above the footer watermark.
- Keep the persistent footer watermark across the bottom reading
  "ZABAL GAMEZ @ zabalgamez.com".
- Punchy and clean, sized to read easily on a phone. No emojis.
```

---

## Notes
- **Brand palette** (if you want to vary the highlight): ZABAL red `#ff3d6e`,
  orange `#ff6b35`, cyan `#00e5ff`, gold `#f5c842`, purple `#a78bfa`. Default the active
  word to ZABAL red.
- **Brand rules** still apply to any on-screen text: no emojis, hyphens not em dashes.
- After captions are generated, run the brand-term fixes before exporting -
  `node scripts/fix-transcript.mjs <captions> --write` (see the workflow doc). The
  caption look and the caption spelling are two separate passes.
</content>

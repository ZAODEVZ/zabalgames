# ZABAL Gamez - brand audit (overnight, 2026-07-26)

Deep audit of the site's brand consistency against the brand rules (no emojis, no em
dashes, the naming glossary, "100+" not specific counts, no crypto/web3 jargon in public
copy, tight/factual/warm voice). Scanned 108 HTML files. Fixes applied where clearly safe;
everything else documented.

## Verdict: brand hygiene is excellent

| Rule | Result across 108 files |
|------|--------------------------|
| No emojis | **0 violations** |
| No em/en dashes (-, not em/en) | **0 violations** |
| No decorative unicode (checkmarks, warning triangles, stars) | **0 violations** |
| No crypto/web3/onchain/NFT jargon in public copy | **0 violations** |
| "100+" for ZAO member count (never a specific number) | **0 violations** |
| Naming glossary (WaveWarZ, SongJam, COC Concertz, Magnetiq, The ZAO, BetterCallZaal) | **0 wrong-form uses in prose** (lowercase handles/URLs are correct) |
| Positioning (build-a-thon, NOT a video-game contest) | **0 stale "video game / contest" framings** |
| OG image = the arcade card | 105/108 pages (the 3 others are legit per-recording images) |
| `<title>` carries "ZABAL Gamez" | All pages |

This is a strong result - the discipline (and `scripts/validate.mjs`) held. The copy layer
needs essentially no cleanup.

## Fixes applied (this PR)
- `farcaster-batches.html` - "three-month buildathon" -> "three-month Build-A-Thon" (the
  canonical phrase, used 99x elsewhere). The only clear prose inconsistency found.

## Noted, not changed (deliberate / different context)
- `farcaster-batches.html` "Vini App buildathon" - a DIFFERENT event, not ZABAL Gamez. Leave.
- `quest.html` meta "the buildathon is the game" - the quest page's intentional playful
  voice. Leave unless the brand owner wants it normalized.
- Casing spread: "Build-A-Thon" (99), "build-a-thon" (18 lowercase mid-sentence, fine),
  "Build-A-Thon"/"buildathon" edge cases. Not worth a mass rewrite - the dominant form is right.

## The one real brand inconsistency (separate PR)
- `/finals` still publicly described the RETIRED prediction-market Finals model - a
  positioning inconsistency with the current loops.house format. Addressed in PR #580
  (superseded-notice). The full rewrite is a human call pending the loops page + dates.

## Beyond copy (for a future pass)
- **Voice spot-check:** hero copy across /submit, /vote, /submissions, /info reads tight
  and warm - consistent. No audit fix needed.
- **Visual brand** (logo, palette, Syne/Outfit/Press Start 2P fonts) is centralized in
  `assets/style.css` + the shared nav/footer - consistent by construction.
- **Deeper brand angles not covered here:** cross-brand representation (how the ZAO
  ecosystem brands are described on /about, /links), and the recordings/thumbnail brand
  consistency. Flag for a follow-up if wanted.

## Next actions
| Action | Owner | By when |
|--------|-------|---------|
| Merge this (buildathon fix + this report) | Zaal | at review |
| Merge #580 (finals positioning notice) | Zaal | at review |
| Decide: normalize the quest.html playful "buildathon" or keep the voice | Zaal | at review |

# ZABAL Gamez caption style - reusable prompt

The exact animated-caption settings used on the workshop videos, confirmed by Descript
Underlord on the yerb 2 edit. Paste the prompt below into Underlord (or set these by hand)
to reproduce the look on any future recording. Part of the
[recordings workflow](../recordings-workflow.md).

---

## The prompt

```
Add captions with these exact settings: Sora font, size 60, weight 600,
center-aligned, positioned near the bottom of the frame. Future (unspoken)
words in off-white rgb(228, 226, 221) with a black stroke (width 16). Active
(current) word in red rgb(229, 57, 53) with a black stroke (width 16). No
highlight background behind the active word.
```

## The exact settings (reference)
| Property | Value |
|----------|-------|
| Font | Sora |
| Size | 60 |
| Weight | 600 |
| Alignment | Center |
| Position | Near the bottom of the frame |
| Future (unspoken) words | off-white `rgb(228, 226, 221)` = `#e4e2dd` |
| Active (current) word | red `rgb(229, 57, 53)` = `#e53935` |
| Stroke (both) | black, width 16 |
| Highlight background | none |

Plus the persistent footer watermark across the bottom: **`ZABAL GAMEZ @ zabalgamez.com`**
(a separate overlay, not a caption setting).

---

## Before you export - fix the brand words IN the captions
Burned-in captions bake at export, so `scripts/fix-transcript.mjs` can NOT fix them
afterward. Apply the ZAO vocabulary find-replace to the caption track in Descript first
(ask Underlord to do it, or use find-and-replace). The full list lives in
[data/transcript-corrections.json](../../data/transcript-corrections.json); the common
ones:

```
Zibal / Xibal -> $Zabal      Saval / Zebal -> Zabal      Games -> Gamez (brand only)
Forecaster -> Farcaster      Naynar -> Neynar            Bone First -> Bonfire
PlatoX -> Plat0x             Wave Wars -> WaveWarz        Doda / Dota -> DotA
POID -> POIDH                Zao -> ZAO                   Berserker -> Bearserker
```

Context-dependent (confirm meaning, do not blanket-replace): `Games -> Gamez` (skip
generic "video games"), `Zaal -> ZAO` (only when the speaker means the org, not the
person).

The caption *look* (the prompt above) and the caption *spelling* (this list) are two
separate passes - do both before exporting.
</content>

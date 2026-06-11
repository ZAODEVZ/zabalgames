# Thumbnail worklist - ZABAL Gamez recordings

The 6 delivered sessions missing a Canva thumbnail. Make each in Canva, export PNG, save to
the path below, then add `"thumbnail": "<path>"` to that session's entry in
`data/recaps.json` (and the matching `workshop-leads.json` lead if it has one) and run
`node scripts/build-recordings-index.mjs`.

**Naming convention:** `assets/workshops/YYYY-MM-DD-<slug>.png` (matches the existing three).
**Style reference (already made):** `2026-06-01-yerbearserker-empire-builder.png`,
`2026-06-01-bonfire-josh-plat0x.png`. Match their layout: arcade ZABAL Gamez frame, the
presenter name big, the topic under it, track color accent. No emojis, no em dashes.

| Save as (`assets/workshops/`) | Presenter | Date | Track / color | On-card title | Recap |
|---|---|---|---|---|---|
| `2026-06-02-ohnahji-livestreaming.png` | Ohnahji | Jun 2 | creator / pink | Starting and growing your own livestream | /recordings/4 |
| `2026-06-06-bonfire-fireside-carlos.png` | Carlos (Plat0x) | Jun 6 | builder / gold | Bonfires + a vibe-coding masterclass (FIRESIDE) | /recordings/fireside/1 |
| `2026-06-08-sopha-chris-building-curation.png` | Chris (chriscocreated) | Jun 8 | builder / zabal | Building Sopha, and why curation is needed | /recordings/5 |
| `2026-06-01-zao-fractal-zaal.png` | Zaal | Jun 1 | builder / orange | ZAO Fractal weekly introduction | /recordings/zao/1 |
| `2026-06-09-joseph-goats-music.png` | Joseph Goats | Jun 9 | artist / pink | Owning your music as an independent artist | /recordings/6 |
| `2026-06-10-will-t-kfmedia.png` | Will T of Web3 | Jun 10 | creator / cyan | Building KFMEDIA | /recordings/7 |

## After exporting each
1. Drop the PNG at the path above.
2. In `data/recaps.json`, add `"thumbnail": "/assets/workshops/<file>.png"` to that recap.
3. Run `node scripts/build-recordings-index.mjs` then `node scripts/validate.mjs`.
4. The page's `og:image` + the hub card pick it up automatically (no per-page edit needed
   beyond the recap entry; the `/recordings/N.html` `og:image` can also be pointed at it).

## Track color key (ZAO palette)
artist = pink - builder = cyan/gold/zabal (per session) - creator = pink/cyan. Use the
`color` already set on the session in `workshop-leads.json` where one exists.
</content>

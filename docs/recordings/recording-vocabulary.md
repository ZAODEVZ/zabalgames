# ZABAL Gamez recording vocabulary - preemptive list for Underlord

Give this to Descript Underlord (or any transcription/caption tool) **before** it
transcribes, so the ZAO proper nouns come out spelled right the first time and the editor
does not have to re-fix the same brand words every video. This is the front-loaded version
of the cleanup list in
[data/transcript-corrections.json](../../data/transcript-corrections.json) /
`scripts/fix-transcript.mjs`. Part of the [recordings workflow](../recordings-workflow.md).

---

## The prompt (paste this)

```
Use this vocabulary when transcribing and captioning. Spell these names and brands
EXACTLY as written:

ZABAL Gamez, $Zabal, Zabal, ZAO, Zaal, BetterCallZaal, yerbearserker, zabalgamez.com,
Farcaster, Neynar, Base, Arbitrum, ERC-20, x402, Privy, Rabby, Warplet, Clanker,
Empire Builder, empirebuilder.world, Bonfire, Plat0x, WaveWarZ, POIDH, Magnetiq,
Hats Protocol, EAS, DotA, Defense of the Agents, Yerba Bearserker Mate, Bizarre Beasts,
SCUM, FARCON, Farcaster Batches, AZ Flynn, COC Concertz, Sopha, Hypersnap, miDAO,
Kingfishers Media.

Common mishearings to avoid:
- "games" -> "Gamez" when it refers to the brand ZABAL Gamez (keep generic "video games")
- Forecaster -> Farcaster
- Naynar -> Neynar
- Zibal / Xibal -> $Zabal
- Saval / Zebal -> Zabal
- Saul / Sal / ZALD -> Zaal (the host)
- ZOC concerts -> COC Concertz
- Zabo -> ZABAL (or ZAO, by context)
- Bone First -> Bonfire
- PlatoX -> Plat0x
- Wave Wars -> WaveWarZ
- Berserker -> Bearserker
- Doda / Dota -> DotA
- POID -> POIDH
```

---

## Reference (grouped)

**ZABAL / ZAO core:** ZABAL Gamez (event), $Zabal (token), Zabal (project), ZAO (org),
Zaal (host, aka BetterCallZaal), yerbearserker / yerb (guest presenter), zabalgamez.com.

**Farcaster / chain / infra:** Farcaster, Neynar, Base, Arbitrum, ERC-20, x402, Privy,
Rabby, Warplet, Clanker, mini app.

**ZAO ecosystem tools/brands:** Empire Builder (empirebuilder.world), Bonfire, Plat0x,
WaveWarZ, POIDH, Magnetiq, Hats Protocol, EAS, COC Concertz (ZAO music brand), Sopha,
Hypersnap, miDAO.

**Workshop-specific proper nouns (yerb / Empire Builder talk):** DotA (Defense of the
Agents), AZ Flynn, Yerba Bearserker Mate, Bizarre Beasts, SCUM, FARCON / FARCON Rome,
Farcaster Batches, Waifu NFTs.

**Workshop-specific proper nouns (Joseph Goats / artist talk):** Joseph Goats (stage name),
Jose Cabrera (real name), joseacabrerav (handle), digital street music, COC Concertz,
Impact Concerts, EZ, Azos Finance, Steemit, Hive, Humberto Maturana, autopoiesis,
Gregory Bateson, Steps to an Ecology of Mind, Portunol, Venezuela. Note: "George Bateson"
is a mishearing of Gregory Bateson; "The Ecology of the Mind" is the book Steps to an
Ecology of Mind.

---

## How this fits the two-pass model
1. **Preemptive (this list)** - feed Underlord the vocabulary so captions/transcript start
   correct. Saves the editor from re-typing the same fixes.
2. **Cleanup (`scripts/fix-transcript.mjs`)** - run the find-replace glossary on the
   exported transcript to catch anything that still slipped through.

Even a human-corrected pass misses brand casing (the yerb iman copy still had "Zabal games"
for "ZABAL Gamez" and "zabalgames.com" for "zabalgamez.com") - the preemptive list is what
stops those recurring.

**Add new terms** to this list and to `data/transcript-corrections.json` whenever a new
recurring name shows up, so every future recording benefits.
</content>

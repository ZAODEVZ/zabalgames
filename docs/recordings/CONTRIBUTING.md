# Contributing to ZABAL Gamez recordings

Every ZABAL Gamez workshop is recorded, corrected, clipped, and published so missing it
live never means missing it. That takes a few small jobs anyone can help with - you do
not need to be a developer. This is the public, low-friction way to pitch in.

There are three things we always need help with:

1. **Caption corrections** - the auto-captions mishear words; help us fix them.
2. **Clip suggestions** - flag the great 10-30 second moments worth cutting as shorts.
3. **Recording submissions** - point us at a session that should be processed and published.

The full behind-the-scenes pipeline lives in
[docs/recordings-workflow.md](../recordings-workflow.md). You do not need to read it to
contribute - this page is all you need.

---

## The easiest way: just send it

Not on GitHub? You do not need to be. Post it in the
**[/zabal channel](https://farcaster.xyz/~/channel/zabal)** on Farcaster, or send it to
the team. Use the simple formats below and we will take it from there.

## On GitHub: open an issue (guided)

Go to the repo's **Issues -> New issue** and pick a template:

- **Caption correction**
- **Clip suggestion**
- **Recording submission / processing request**

Each one walks you through exactly what to paste. That is the most trackable way to
contribute, and the templates use the same formats described here.

---

## 1. Caption corrections

The auto-captions reliably mishear the ZAO vocabulary. **You do not need to list the
common brand fixes** (Gamez, $Zabal, Bonfire, Plat0x, Farcaster, Neynar, WaveWarz,
DotA...) - those are auto-applied from a shared glossary
([data/transcript-corrections.json](../../data/transcript-corrections.json)). List only
the ones that glossary would miss: names, one-off mishearings, and anything ambiguous.

Format - one per line, `time  Original -> Edit`:

```
12:03  Forecaster -> Farcaster
14:30  Saval games -> Zabal Gamez
25:49  at Playducks_ -> at0x_eth
```

If a fix depends on meaning, add a quick note (for example, "Zaal here means the org,
ZAO, not the person").

## 2. Clip suggestions

Short, standalone moments that work as a 10-30 second clip for /zabal or X. Just give the
start and end times, one range per line:

```
01:28 - 01:48
06:30 - 06:36
21:45 - 22:08
```

A one-line "why" is welcome but optional ("great one-liner on sequencing").

## 3. Recording submissions

Think a session should be processed and published? Tell us:

- **Title / topic**
- **Presenter** and their handle(s)
- **Date**
- **Link** to the raw video or stream
- Whether a **transcript** exists yet
- Anything else we should know

---

## What happens to your contribution

- Caption corrections feed the corrected captions (and the shared glossary grows when a
  new recurring mishearing shows up, so every future recording benefits).
- Clip suggestions go to the editor as cut points for shorts.
- Recording submissions become a `/recordings/N` page plus a recap entry, so the session
  is watchable, searchable, and kept.

Thank you for helping keep the whole season on the record.
</content>

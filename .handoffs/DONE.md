# DONE - creator battle lane (PARKED 2026-08-27)

Branch: `ws/creator-battle-0827`, 4 commits, **local only, never pushed**. Zaal pushes.
Parked mid-lane on Zaal's direction change to the 99darwin research job.

State: tree clean, `node scripts/validate.mjs` green, branch is 4 ahead of
`origin/main` (`d1a3f51`) and has no PR. Nothing was posted anywhere.

## Commits, oldest first

- `6603f65` - uniquebeing404's `demo` -> `https://colorzao.signalify.xyz`
- `645d4ad` - builder finalists linked: ghostmintops -> Proof Drop live page +
  repo `BrandonDucar/proof-drop-zabal`; jdwalka -> `github.com/Chroma-Poker`
- `bb226df` - seven unposted social drafts in
  `drafts/creator-battle-2026-08-27-socials.md`
- `a98ef63` - headless render verification of all five `finals.json` consumers,
  `docs/finals-render-verification-2026-08-27.md`

## Verified, not assumed

Rendered every page that reads `finals.json` against the real file. With `poll`
null there is no dead Vote control anywhere: the string "Vote in the poll"
appears zero times, there are zero empty-href anchors, and zero JS errors. Same
guard covers `space`. `/live` correctly makes the creator final the NEXT UP card
and steps past the finished artist battle. `/winners` correctly holds its
placeholders because `settled` is still false.

## STILL ZAAL'S - nothing below is code-blocked

- **creator row:** `space` URL, `poll` URL, the three judges, presdency's HOOD link
- **builder row:** `space` URL, `poll` URL, the three judges
- **also:** confirm the artist winner (row still reads `status: scheduled`, all
  ranks null), and decide the `/finals` prize copy

Each of the first two is one data edit on `data/finals.json`. No code.

## OPEN DEFECT - two prize schemes are live at once

`/august` and `finals.json` say 100 champion / 50 runner-up / 50 volume bonus.
`/finals` still says 300 split 70/30 per track plus 200 volume capped at 80.
Both render publicly. **`/august` is the current one** - PR #639 superseded #624
by about ten hours on 2026-08-23 and `finals.html` was never updated. The lane
handoff `~/zao-vault/handoffs/zabalgames.md` is stale the same way, still
recording the older flat 83.33 split.

Left alone deliberately: money-facing public copy, wording is Zaal's call. One
paragraph in `finals.html` plus a correction line in the vault note.

## Note for whoever merges

This file did not exist on this branch before today. It carries creator-battle
content only - the bonfire lane's own `DONE.md` lives on `ws/bonfire-lane` and
was deliberately kept off this branch. This one will ride to main on merge; drop
it in the merge if that is not wanted.

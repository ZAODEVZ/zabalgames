# Finals render verification - 2026-08-27, creator battle day

Every page that reads `data/finals.json` was rendered headlessly against the real
file and inspected, rather than read as source. Local static server on :8899,
headless Chromium. Run before the 5:00 PM EDT creator battle.

The question being answered: with `poll` null on the creator row, does anything
break or render a dead control?

**Answer: no. All five consumers degrade gracefully. Nothing to fix before 5 PM.**

## What renders

| Page | Result |
|---|---|
| `/august` | Creator row correct: "@presdency vs @uniquebeing404", "Thursday, August 27 - 5:00 PM EDT", the 5:15-5:45 window sentence. Buttons shown: Watch, Trade the battle. No Vote button, no Set a reminder. |
| `/live` | Creator final is the "NEXT UP" card with a live countdown. Same two buttons, same two absent. Correctly picks creator over the past artist battle. |
| `/finals/live` | Roster renders. Five of six finalists are now links. |
| `/winners` | Holds its "Awaiting Finals" placeholders. Correct by design - it waits for `settled: true`, which is still false. |
| `/finals` | Does not render battles from `finals.json`. Static copy only. See the defect below. |

## Checks that passed

- `Vote in the poll` appears **zero** times across every page. The renderers all
  guard it as `b.poll ? ... : ''`, so a null poll produces no element at all
  rather than an anchor with an empty href.
- Zero anchors with a null or empty `href` on any page.
- Zero JavaScript errors. The only console errors are `/api/*` 404s and 501s plus
  `/_vercel/insights/script.js` - none of those exist on a plain static server,
  and none are page defects. `data/finals.json` itself loaded 200 everywhere.

The same guard covers `space`, which is also null on the creator row: the artist
row shows "Set a reminder" because it has a Space URL, the creator and builder
rows simply omit the button. When Zaal pastes either URL in, the button appears
with no code change.

## Finalist links after this morning's fill

    dee-13          -> drive.google.com/drive/folders/1Zn9...
    LadyrynNemesis  -> songchainn.xyz/n3m3sis/the-call-out
    JohnDaWalka     -> github.com/Chroma-Poker
    Brandon         -> zabalgamez.com/builds/proof-drop
    uniquebeing404  -> colorzao.signalify.xyz
    Presdency.eth   -> plain text, no link

Presdency is the only one unlinked, because no URL for HOOD exists anywhere in
the repo or the vault. That is the one finalist link still outstanding.

## DEFECT FOUND - two different prize schemes are live right now

Not caused by this morning's work, and not fixed here because it is money-facing
public copy and the wording is Zaal's call. Worth knowing on battle day.

`/august` and `data/finals.json` say:

> Each track champion takes 100, each runner-up takes 50, and a further 50 goes
> to whichever of the six draws the highest trading volume across the whole season.

`/finals` says:

> 300 USDC on the battles: 70 to whoever wins their track, 30 to the other finalist.
> 200 USDC on trade volume, shared across all six by the volume their battle entry
> attracts, capped at 80 each so one large trade cannot take the pool.

Both render publicly today. They are different schemes, not different wordings.

**The `/august` version is the current one.** It came from PR #639 on 2026-08-23
at 20:10, where Zaal set the structure explicitly and the commit message says the
earlier scheme was the opposite of what he wanted. `/finals` still carries the
copy from PR #624, merged earlier the same day and superseded about ten hours
later. `finals.html` has not been touched since.

Note also that the lane handoff `~/zao-vault/handoffs/zabalgames.md` still
records the pool as "resolved to the flat split, 500 / 6 = 83.33 each, everyone
paid win or lose". That is stale for the same reason - #639 replaced it. Anyone
reading the vault for the prize numbers today will get the wrong answer.

Fix is one paragraph in `finals.html` plus a correction line in the vault note.
Not done here.

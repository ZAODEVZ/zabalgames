# Daily update workflow

How the on-site daily surfaces stay current through the season. These mirror the
Year of the ZABAL newsletter (paragraph.com/@thezao) but live on zabalgamez.com so
the day's pulse is one tap from anywhere.

## The surfaces

| Page | Source | Cadence |
|------|--------|---------|
| `/today` | `data/daily-updates.json` | every build day |
| `/recaps` | `data/recaps.json` | after each workshop |
| `/mindful` | `mindful.html` (static, for now) | every build day |

## Each morning

Add one daily entry. The helper prepends it, keeps newest-first, and validates:

```
node scripts/add-daily.mjs daily \
  --day 4 --date 2026-06-04 \
  --title "Adrian on the Empire Builder API" \
  --body "Day 4 - Adrian walks the V3 endpoints for an existing empire plus the leaderboard." \
  --mindful "Be Impeccable With Your Word." \
  --link "Watch live|/live" --link "RSVP|https://luma.com/zao"
```

Then add the day's card to `/mindful` (mindful.html) by hand - copy the most
recent `.mm` block, bump the date and Day number, and drop in the card text and a
one-line takeaway for the build.

## After a session runs

Add a recap. Only pass `--recording` / `--transcript` if they actually exist -
the page shows just the links you give it:

```
node scripts/add-daily.mjs recap \
  --date 2026-06-03 --title "Snapchain on Farcaster" \
  --presenter "Cassie" --track builder \
  --recording "https://luma.com/<event>" \
  --take "What Snapchain is." --take "How to build on it."
```

Transcripts live under `data/streams/zabal-games-workshops/raw/transcripts/`. Link
one only once it is committed.

## Notes

- `--link "Label|url"` repeats for multiple links. Internal links start with `/`
  and open in place; `http...` links open in a new tab automatically.
- Both files sort newest-first on every write, so order of entry does not matter.
- The helper creates either file with the right shape if it is missing, so a fresh
  clone works too.
- `DATA_DIR=/tmp/x node scripts/add-daily.mjs ...` runs against a throwaway dir -
  handy for trying it without touching the real files.
- Brand rules still apply: no emojis, no em dashes (hyphens only), no crypto jargon
  in public copy.

## Backfill

The daily log and recaps are append-friendly. To add a missed day or an older
session, just run the helper with that date - it slots into the right place.

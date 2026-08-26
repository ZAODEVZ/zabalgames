# DONE - bonfire lane

Date: 2026-08-26
Branch: `ws/bonfire-lane` (local, unpushed, no PR)
Report: `docs/bonfire-lane/README.md`
Script: `scripts/telegram-export-to-bonfire.mjs`

Nothing outbound was sent. No Telegram message, no reply, no Bonfire write.
Zero episodes posted.

## Zaal's two verdicts, both applied

**1. Telegram read path = Desktop export.** Fractgram is abandoned. The ingest side
is written, tested and committed: `scripts/telegram-export-to-bonfire.mjs` takes a
Telegram Desktop JSON export directory and produces Bonfire episodes. Dry run is the
default - nothing posts without `--post`. Exact export steps for Zaal are in section 1b
of the report (three-dot menu > Export chat history > Format JSON, per chat, media off,
all three into one parent folder).

**2. Blind draft discarded.** The drafted reply to `2087125632` has been deleted from
the report. Section 2 is now a one-line note that a reply awaits Zaal's read of the
live DM. Nothing was ever sent.

## Status of the three original jobs

| # | Job | Status |
|---|-----|--------|
| 1 | Index `-1002812275482` | INGEST READY - blocked on Zaal's export, script waiting |
| 2 | Index `2087125632` + reply | NOT DONE - same block; blind draft discarded per Zaal |
| 3 | dvl mojo search | DONE - via the Bonfire recall path, not via fractgram |

dvl mojo = DvlsMojo / Gustavo de Lima Cavalcanti (`@GCvlcnti`, `Neuralink0666`).
Distinct from "Mojo The Ghost", an unrelated wallet-only fractal member - do not merge
them in the graph. Findings in section 3 of the report.

## What Zaal does next

1. Export the three chats (`-1002812275482`, `2087125632`, `-1002625006975`) from
   Telegram Desktop as JSON into one folder. Telegram may enforce a wait of about
   24 hours before the first export is allowed.
2. Say where the folder is. Then: dry run, review the output, and only then `--post`.
3. Read the live DM and decide the reply himself.
4. Confirm `TnN` in one sentence - it is staged unconfirmed in the graph and nothing
   downstream of it can settle.

## Two things outside this lane that are broken

- **VPS `187.77.3.104:22` is unreachable.** Breaks the `/bonfire` skill transport and
  anything else on that box, including `@ZAOcoworkingBot`. The ingest script does not
  depend on it - it posts directly with the local key.
- **`~/.claude/skills/bonfire/SKILL.md` is stale.** It says recall returns `[]` pending
  admin labeling. Measured today, `POST /delve` returns 38-48 real results per query.
  The skill should try the local path first and fall back to SSH.

## Caveat worth carrying forward

The ingest script has not been run against a real Telegram export - there is none on
disk. Fixtures follow the documented format, so re-check the first real dry run before
using `--post`.

## Commits on this branch

- `0f03589` - bonfire lane report (fractgram NOT DONE, dvl mojo found via Bonfire)
- this commit - ingest script, export steps, blind draft removed, this file

Related, on `ws/lane-audit-2026-08-25` and also unpushed: `30e1034` records the earlier
routing mismatch that sent this lane's brief to the wrong session.

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

---

# CREATOR BATTLE - Thu 2026-08-27, 5:00 PM EDT

Separate unit, same branch. Only `data/finals.json` changed (one line).

## What the page needs vs what it has

`/august` is canonical; `/live` renders the next-battle card; `/finals/live` and
`/winners` render the roster. All four read `data/finals.json` and nothing else.
No HTML edit is needed for any item below - they are all data.

| Field | State | Renders as |
|---|---|---|
| finalists | DONE `["@presdency","@uniquebeing404"]` | the pair line |
| date | DONE `2026-08-27` | "Thursday, August 27" |
| time | DONE `5:00 PM EDT` | the /live countdown parses this label |
| window | DONE (5:15-5:45, winner called before the Space ends) | the timing sentence |
| watch | DONE `https://zabalgamez.com/live` | "Watch ->" |
| battleUrl | DONE `https://wavewarz.com` | "Trade the battle ->" |
| status | DONE `scheduled` | required for /live to pick it up |
| **poll** | **MISSING - null** | **no Vote button anywhere** |
| **space** | **MISSING - null** | **no "Set a reminder" button anywhere** |
| judges | **NO FIELD EXISTS** | judges are never rendered per battle |
| demo (presdency) | MISSING - null | name is plain text, not a link, on /finals/live |
| demo (uniquebeing404) | FILLED this pass | now links to ColorZAO |

Date and time are corroborated outside the repo: in the 08-24 artist Space Zaal
says "we're gonna be having our creator battle on Thursday, 5 p.m. Eastern".

## ONLY ZAAL CAN SUPPLY (the short list)

1. **The X Space URL.** Schedule the creator Space on the WaveWarZ account and
   paste the URL into the `space` field of the creator row. This is the biggest
   one. The Space is hosted on WaveWarZ, an account most of this audience does
   not follow, so a scheduled-Space reminder link is the only thing that reaches
   them in advance. The artist battle had one (`1dKrPrnYaDqJX`); creator has none,
   and it is less than 24 hours out.
2. **The poll URL.** Paste into `poll` on the creator row when the poll goes up.
   Note the artist precedent: the poll was opened inside the Space at battle time
   (Candy started it, ran ~30 min, 10 votes), so no URL ever existed beforehand -
   and `poll` is STILL null on the artist row today, meaning the Vote button never
   rendered for that battle at all. Every finals surface and every post names the
   open poll as one of three signals and the only one a viewer can act on without
   a wallet. To avoid a repeat, post a standalone X poll before 5:00 PM EDT and
   paste that URL, rather than relying on the in-Space poll.
3. **The three judges.** Unknown for creator. Artist ran with three: Thy Revolution,
   Jose (Joseph Goats), and AttaBotty. There is NO judges field in `finals.json`
   and no per-battle judge rendering on any page - `/august` only carries the
   static "Judging is open" seat-request copy. So even once the three are
   confirmed, there is nowhere to put them without a small code change. Decide
   whether judges should be shown per battle at all.
4. **presdency.eth's HOOD link.** No URL for HOOD exists anywhere in the repo or
   the vault. `/finals/live` and `/winners` link a finalist's name via `demo`, so
   presdency renders as plain text next to linked finalists.
5. **Confirm the artist result.** The artist row still reads `status: scheduled`
   with every `rank: null` two days after it ran. The 08-24 transcript closes with
   "Congratulations again, Nemesis... since you're the winner" (the poll went to
   dee-13 by a margin, the judges decided it) - but that is an unreviewed machine
   transcript, so nothing was written. Confirm the winner and it can be recorded.
   Not a blocker for Thursday: `/august` ignores `status` entirely and `/live`
   auto-expires a battle 3 hours past its start, so the stale artist row does not
   stop the creator battle from showing as next.

## Done this pass

- `data/finals.json` - uniquebeing404's `demo` set to `https://colorzao.signalify.xyz`
  (from `docs/newsletter-2026-08-10-finals.md`; verified HTTP 200 before writing).
  `node scripts/validate.mjs` green.

## To actually ship it

This branch is held from push under review, so the one-line fix will not reach
production from here. Cherry-pick the finals.json commit onto a fresh branch off
updated main, push, and merge. Items 1 and 2 above are then one more data edit
each on that same file - no code.

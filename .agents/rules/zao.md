<!-- OWNERSHIP: hand-written, identical text across zao-vault, ZAOOS, zaostock, zabalgamez. Changed by reviewed PR (vault: direct commit). Points at ~/zao-vault; does not duplicate it. Antigravity workspace rules per Antigravity 2.3.1 (.agents/rules/, not the legacy .agent/rules/). -->
# zao.md - Antigravity workspace rules for this repo

Read, in order, before any work: `~/zao-vault/GENESIS.md` (the constitution -
authority, gates, delegation, proof, memory, naming, the federation
boundary), then `~/zao-vault/BLACKBOARD.md` (what is happening right now),
then `~/zao-vault/AGENTS.md` (who does what and the one-screen checklist).
`~/zao-vault/SYSTEM_MAP.md` says what exists; `~/zao-vault/DECISIONS.md` says
what is already decided. This file does not restate any of them; if they
disagree with what is written here, they win.

## The sequence

GRILL -> SPEC -> PLAN -> BUILD -> TEST -> VERIFY -> HANDOFF. Never IDEA ->
BUILD. Run `/grill-me` before implementation on anything not already spec'd.

## Gates

Two-way doors (a PR, a draft, a vault note, a safe refactor) act, then say so.
One-way doors always stop for Zaal: money or on-chain; publishing or sending
anything to a human outside ZAO; deploys, migrations, deletes, env or
permission changes; editing SOUL.md or GENESIS.md; adding a new bot or
autonomous loop. A denied tool call is a result: report it as BLOCKED with
the exact message. Never edit settings, permissions, trust flags or hooks to
get around it. Never replace an implementation you have not read.

## Naming

ZABAL is the agentic presence as a whole. Hermes Agent is the Nous Research
program and the persistent executive; its model is replaceable, its identity
is not. ZOE and ZOL are native ZABAL organs, not Hermes Agent replacements.
Brand spellings that get miscorrected: WaveWarZ (one word, capital W and Z),
COC Concertz (space between COC and Concertz, z not s), ZABAL Gamez (always
Gamez, with a z).

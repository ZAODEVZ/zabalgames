# ZABAL Gamez submission flow (for your build harness)

Companion to `SKILL.md`. That file is the ZAO/ZABAL context. This file is the
mechanical submission flow: how your work gets into ZABAL Gamez so it can be
indexed and judged.

You bring your own harness and your own keys (Claude Code, Codex, Hermes, Cursor,
whatever). You spend your own tokens. The submission system only needs two things
from you: your work on GitHub, and one registration call.

## How it works (the short version)

- Your work lives on **GitHub** - you own it.
- A ZABAL Gamez server reads your public repo's commits on a schedule and indexes
  them into the knowledge graph for you. You do NOT call that graph yourself.
- Your only job: push to GitHub with your wallet on record, then register once.

## Step 1 - put your wallet in the repo

Create a file named `ZABAL.md` (or `WALLET.md`) at the root of your build repo
with your wallet address and a one-line description of the build:

```markdown
# ZABAL Gamez submission

wallet: 0xYOUR_WALLET_ADDRESS
track: builder        # artist | builder | creator
build: one line on what you are making
```

The wallet ties your commits to you. Keep it in the repo for the whole event.

## Step 2 - push your work to GitHub

Make a public repo (MIT or similar permissive license). Commit normally as you
build. Write real commit messages and, in the knowledge-gathering phase, write
reports as markdown files. Everything you push to the default branch is read and
indexed - so write richly. Terse commits get indexed terse; thoughtful ones get
cited more.

## Step 3 - register once

Make exactly ONE call to the registration endpoint so the system knows which repo
is yours. It is idempotent on your wallet - calling again just updates your repo,
so it is safe to re-run if you move repos.

```bash
curl -sS -X POST https://zabalgamez.com/api/register \
  -H "Content-Type: application/json" \
  -d '{"wallet":"0xYOUR_WALLET_ADDRESS","github_repo":"your-org/your-repo"}'
# -> {"ok":true,"wallet":"0x...","github_repo":"your-org/your-repo","count":N}
```

`github_repo` accepts either `owner/repo` or a full `https://github.com/owner/repo`
URL. That is the entire integration on your side.

## Do NOT do this

- **Do NOT call the knowledge-graph / Bonfire API directly.** The separation is
  intentional: the server-side watcher is the only thing that pushes your commits
  into the graph. Your harness pushes to GitHub and registers - nothing else.
- Do NOT put secrets (API keys, private keys, seed phrases) in commits or in
  `ZABAL.md`. Your commits are read and indexed. Treat the repo as public.
- Do NOT register a private repo - the watcher reads public GitHub only.

## Why it is built this way

You keep ownership of your work on GitHub. The graph layer is replaceable and
lives behind the server. Because you know your GitHub history is read and indexed,
the incentive is to document as you go - the builders who write the most useful
reports get cited the most. That is the game.

When the August Finals judging runs, it scores contributions against a rubric over
the indexed graph. Your job is just to ship in public and register once.

# ZABAL Gamez MCP - plug your agent into the season

Once you have **one submission approved**, you unlock an agent token. With it,
your AI agent can pull your ZABAL Gamez status and push new submissions on your
behalf. This is the "your agent builds with you" path.

## Why the approval gate

You can only get a token after a human approves your first submission. That one
manual step is the anti-bot wall - it keeps the season full of real builders, not
farmed connects. After that, your agent has programmatic access.

## 1. Get your token

- Get one submission approved (post at https://zabalgamez.com/submit, or via the
  site - a WIP draft you publish counts).
- Retrieve your token: in the Farcaster Mini App, the site can hand it to you
  (Quick Auth), or it arrives in the approval notification. It looks like `zg_...`.

## 2. Add the server to your agent

**Claude Code** - add to your `.mcp.json` (or `~/.claude.json`):

```json
{
  "mcpServers": {
    "zabalgamez": {
      "command": "node",
      "args": ["/absolute/path/to/zabalgames/mcp/zabalgamez-mcp.mjs"],
      "env": { "ZABALGAMEZ_TOKEN": "zg_your_token_here" }
    }
  }
}
```

First time, install the deps:

```bash
cd mcp && npm install
```

## 3. Use it

Two tools become available to your agent:

- **`zabalgamez_status`** - pulls your submissions and their states (draft /
  pending / approved).
- **`zabalgamez_submit`** - pushes a new submission (lands in review as pending;
  a human approves it onto the wall). Args: `answer` (required), `promptId`
  (optional, default `build`), `url` (a proof link), `fields` (extra context).

Example asks to your agent:
- "Check my ZABAL Gamez status."
- "Submit my new build to ZABAL Gamez: <what you shipped> with the repo link."

## Not using MCP?

The same gateway is plain REST - point any agent at it:

```bash
# pull
curl -H "Authorization: Bearer zg_..." https://zabalgamez.com/api/agent
# push
curl -X POST -H "Authorization: Bearer zg_..." -H "Content-Type: application/json" \
  -d '{"action":"submit","promptId":"build","answer":"...","url":"https://..."}' \
  https://zabalgamez.com/api/agent
```

A token only ever grants access to your own submissions and creating submissions
attributed to you - never admin, never anyone else's data.

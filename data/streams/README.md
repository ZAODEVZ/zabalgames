# Zabal Data Streams - raw store

This directory holds the raw + chronological layer of Zabal Data Streams.

```
data/streams/
  timeline.json          merged chronological feed across all streams (newest first)
  <stream-id>/raw/       full raw captures for one stream (transcripts, cast dumps, ingest files)
```

The stream registry (what each stream is, its `pull` config, ideas) lives one level up at
`data/data-streams.json`. The page that renders all of this is `/streams.html`.

## How it flows

1. `scripts/pull-data-streams.mjs` reads `data/data-streams.json`.
2. For each stream with a live `pull` config it fetches the source, writes raw files under
   `<stream-id>/raw/`, and appends normalized entries to `timeline.json` (deduped, re-sorted).
3. It emits `/tmp/zabal-dispatch-streams-<date>.md` with `BONFIRE_ENTITIES` + `BONFIRE_EDGES`.
4. `scripts/aggregate-dispatches.mjs` merges that dispatch into `data/bonfire-graph.json`.
5. `scripts/push-to-bonfire.mjs` pushes the graph to the ZABAL Bonfire.

Bonfire then holds the whole picture and any bot reads the registry, the timeline, or the
graph and builds on top.

## Run

```bash
node scripts/pull-data-streams.mjs            # pull live + write + emit dispatch
node scripts/pull-data-streams.mjs --dry      # show what would change, write nothing
node scripts/pull-data-streams.mjs --no-bonfire   # pull + write timeline, skip the dispatch

# optional env
GITHUB_TOKEN=...   # raises the GitHub content API rate limit for github-content streams
HAATZ_BASE=https://haatz.quilibrium.com   # override the Farcaster read base for haatz streams
```

Network note: github-content and haatz pulls need outbound access to api.github.com /
raw.githubusercontent.com / haatz.quilibrium.com. In a sandboxed environment those hosts may
be blocked - the script logs the miss and continues, still emitting the registry-derived
Bonfire entities so the graph stays current.

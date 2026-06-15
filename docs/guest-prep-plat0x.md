# Plat0x session prep - building on the ZABAL Bonfire (the graph)

**When:** Date TBD - confirmed for "later this week" as of the lead (send the Cal link to lock).
**Guest:** Plat0x (Carlos), developer at Bonfire, based in Ecuador. Builder track.
**Format:** Livestreamed and recorded.
**Ask:** His own Bonfire builder session - going deeper on the ZABAL Bonfire and building on the
graph.

This is Plat0x's **solo, hands-on builder** session, distinct from his two earlier appearances:
the Day 1 Bonfire intro (with Joshua, `/recordings/3`) and the Day 6 fireside on planning +
vibe-coding (`/recordings/fireside/1`). This one is for builders who want to build on top of the
graph. Facts sourced below; flag anything Plat0x wants to correct on the call.

> Handle note: `data/people.json` lists @plat0x, but **`plat0x` is not a registered Farcaster
> fname.** His likely real handle is **@at0x** (fid 196316, display "At0x.Eth", whose X matches the
> `at0x_eth` already in people.json). Confirm with him before casting - and if confirmed, that is a
> CRM fix (people.json handle @plat0x -> @at0x, then regen the CRM). Not changed here on the weaker
> match.

---

## What Bonfire is (context for the room)

Bonfire is the ecosystem's shared memory - the knowledge-graph layer that bots and builds sit on
top of. A group grows a graph just by using its agents, and the curators own it ("curation is the
last scarce asset"). The **ZABAL Bonfire bot** is live and queryable, so anyone joining mid-season
can catch up in minutes. In this repo, the graph is `data/bonfire-graph.json`, the public ask
surface is `/graph` ("Ask the ZABAL Bonfire"), and the commit-watcher cron pushes builder repo
activity into Bonfire as episodes (the doc-784 GitHub-as-submission / Bonfire-as-backend pair).

## The session focus: building on the graph

Where the Day 1 session explained Bonfire and the fireside taught how to build, this one is the
"now build on it" session. Good ground to cover:
- How to point an agent at the ZABAL Bonfire and read it (the queryable depth).
- The graph model: entities + edges, how episodes become structured memory.
- Building on top: what a builder can make that uses the graph (catch-up bots, search, agent
  memory, judging/curation tooling).
- How the season already uses it (the commit-watcher -> Bonfire episode pipeline) as a worked
  example of writing into the graph.

## Suggested running order (~45-60 min)

1. **Recap: what Bonfire is, fast** (~5 min) - for anyone who missed Day 1; the graph as shared memory.
2. **The graph up close** (~12 min) - entities/edges/episodes, how data lands and stays queryable.
3. **Reading the ZABAL Bonfire** (~12 min) - point an agent at it live; show `/graph` and a query.
4. **Building on top** (~12 min) - what to build on the graph; the commit-watcher episode push as
   a real write-path example.
5. **Q and A** (~10 min+) - builders scope a July build that uses Bonfire.

## ZABAL Gamez tie-in (have these ready)

- **Live surfaces:** `/graph` (Ask the ZABAL Bonfire), `data/bonfire-graph.json` (the committed
  graph), and the commit-watcher cron (`api/commit-watcher.mjs`) that pushes builds in as episodes.
- **The boundary to respect:** the commit-watcher is the ONLY component that talks to Bonfire, and
  it does so server-side; the builder skill never calls Bonfire directly. Worth saying so builders
  understand the architecture.
- **A natural July build path:** "build something that uses the ZABAL Bonfire" is a strong,
  on-rails July project - this session is the on-ramp to it.

## Open items / to confirm with Plat0x

- **Lock the date** (send the Cal link).
- **Confirm the handle** (@plat0x in people.json vs the likely real @at0x - see note).
- How much is ZABAL-Bonfire-specific vs general Bonfire building.
- Whether he wants to demo a live query against the ZABAL Bonfire.

---

## Sources

- `data/workshop-leads.json` (id 011 - topic, format, status) + `data/people.json` (Plat0x, Bonfire dev, x.com/at0x_eth, bonfires.ai) - [FULL]
- `CLAUDE.md` + `api/commit-watcher.mjs` + `docs/snap-design.md` - the ZABAL Bonfire surfaces (`/graph`, `data/bonfire-graph.json`, the doc-784 episode push) - [FULL]
- `docs/newsletter-week1-2026-06-08-FINAL.md` - the Day 1 Bonfire session + the fireside, "curation is the last scarce asset" - [FULL]
- Farcaster fnames + hub: `plat0x` is not a registered fname; @at0x = fid 196316 ("At0x.Eth"), X = at0x_eth matches people.json - [FULL for the fname facts; PARTIAL - identity tie to the Bonfire Plat0x inferred from the matching X, confirm with him]

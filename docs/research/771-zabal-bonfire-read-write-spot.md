# 771 - ZABAL Bonfire read/write spot (the website's part)

Companion to the ZAO OS architecture doc **781** (ZAOOS repo,
`research/agents/781-zabal-bonfire-contribution-architecture`). That doc designs the whole
contribution system; this one pins how it lands in **this repo** (zabalgames - the static
site + Vercel edge functions), so the two repos do not drift.

## The architecture (from doc 781), in one line
The **graph is the hub** (not the Bonfire bot). Contribution is **always-open but
visibility/promotion-gated**: anyone can submit, submissions land author-tagged and
low-trust ("pending"), and a curator (or trust tier) promotes them to canonical. Queries
default to canonical only, so pending never pollutes answers.

## The one reconciliation for this repo
Doc 781's v1 stores pending items in **Supabase** (it reuses the ZAO OS CRM pattern +
ZOE's approval machine). **This repo does not use Supabase** - per `CLAUDE.md`, the live
backend is **Upstash Redis**, and `/api` already verifies **Farcaster Quick Auth (FID)**
server-side. So the website's part uses Upstash, and the promotion half stays in the
ZAO/ZOE stack.

Mapping to doc 781's diagram: this website is the **"person (web)" spoke** - a query UI and
a submit form. It is not the gateway and not the promoter.

## Phase 1 - read spot (shipped here)
- `graph.html` reframed to "Ask the ZABAL Bonfire about ZABAL Gamez" - searches
  `data/bonfire-graph.json` (the canonical snapshot), with starter-query chips.
- `api/bonfire-ask.mjs` logs each query to Upstash `zg:bonfire:queries:v1` (anonymous,
  debounced, best-effort, no-ops without KV env). This is the "querying people's searches"
  ask - we can see what the community wants to know.

## Phase 2 - contribution loop (pending the ZOE contract)
- Add `action:'submit'` to `api/bonfire-ask.mjs`: an author-tagged item -> Upstash
  `zg:bonfire:pending`. Attribution via the Quick Auth FID we already verify (kills
  drive-by spam; non-anonymous).
- Promotion: **ZOE** (ZAO stack) reads the pending queue and promotes approved items into
  the canonical Bonfire graph via its existing approve machine + `episode/create`.
- Trust tiers (doc 781): v1 binary (steward FID list approves); later Respect-weighted
  auto-promote and in-graph confidence stubs.

### The submit contract (to confirm with ZOE before building Phase 2)
- Pending key: `zg:bonfire:pending` (Upstash list), newest-first.
- Item shape: `{ id, fid, username, type: 'fact'|'project'|'doc', body, status: 'pending', ts }`.
- ZOE reads via the Upstash REST `LRANGE`, promotes, and marks/removes the item.

## Deferred (per doc 781)
Agent-to-agent / x402 metered queries, read subscriptions/pub-sub notifications, and moving
the pending store in-graph (once FCG confidence-filtering is confirmed) are all v2+.

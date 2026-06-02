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

## Phase 2 - contribution loop (DECIDED: Option A; both halves built)
Going with **Option A** - the website owns the Upstash queue, ZOE drains it. ZOE could not
independently verify a Quick Auth token, so the website is the authenticated producer and
ZOE owns the promotion gate (the chokepoint that actually protects canonical truth). ZOE
reading Upstash REST is outbound HTTPS only - no new public ingress.

- **Website (built):** `action:'submit'` in `api/bonfire-ask.mjs` verifies the Quick Auth
  JWT, builds the item, and `LPUSH`es to `zg:bonfire:pending` with the **verified** FID
  (never a client-sent one). The `graph.html` read spot has the submit form; `miniapp.js`
  exposes `window.ZABAL.submitBonfire`. Pending queue can be a dedicated Upstash DB via
  `BONFIRE_QUEUE_KV_REST_API_URL/TOKEN`, else the site KV.
- **ZOE (built, ZAOOS PR #768):** `/bonfire` pulls the oldest pending item, arms it for y/n
  gated by `BONFIRE_STEWARD_FIDS` (v1 = Zaal 19640); `y` -> `episode/create` (with the
  secret-scan) + provenance line + `sourceTag: zabalgames-web` -> `LREM` the exact item;
  `n` -> `LREM` + log. Contract mirrored in ZAOOS doc 781.
- Trust tiers (doc 781): v1 binary (steward list approves); later Respect-weighted
  auto-promote and in-graph confidence stubs.

### The submit contract (LOCKED with ZOE)
- Pending key: `zg:bonfire:pending` (Upstash list). Website `LPUSH`es; ZOE `LRANGE`s to
  review and `LREM`s by exact value on decision (append-only producer, so value-removal is
  safe).
- Item shape: `{ id, fid, username, type: 'fact'|'project'|'doc', title, body, url,
  source: 'zabalgames-web', status: 'pending', ts }`.

### To go live
1. Create a dedicated Upstash DB for the queue. Set `BONFIRE_QUEUE_KV_REST_API_URL/TOKEN`
   on the website (Vercel) AND `ZG_UPSTASH_REST_URL/TOKEN` (read-write) on ZOE - same DB.
2. Set `BONFIRE_STEWARD_FIDS=19640` on ZOE; restart ZOE.
3. End-to-end: submit from `/graph` -> DM ZOE `/bonfire` -> `y` -> query it back in the
   read spot.

## Deferred (per doc 781)
Agent-to-agent / x402 metered queries, read subscriptions/pub-sub notifications, and moving
the pending store in-graph (once FCG confidence-filtering is confirmed) are all v2+.

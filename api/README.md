# ZABAL Gamez API

Zero-dependency Vercel **edge** functions (no `package.json`, no build step - same
model as `api/snap/signup.mjs`).

## Endpoints

### `POST /api/track`
Records a deliberate social action against a verified Farcaster FID.

- Auth: `Authorization: Bearer <quick-auth-jwt>`. The frontend sends this via
  `sdk.quickAuth.fetch('/api/track', ...)` (see `window.ZABAL.track` in
  `assets/miniapp.js`). The JWT is verified server-side with Web Crypto against
  the Farcaster Quick Auth JWKS - nothing is stored unless it verifies, so
  activity cannot be spoofed.
- Body: `{ "action": "cast" | "share" | "signup", "target"?: string }`
- Stores to KV: pushes onto a capped recent-activity list and adds the FID to a
  per-day "present" set (2-day TTL) for the live count.

### `POST /api/join`
One-tap workshop join against a verified Farcaster FID (Quick Auth JWT, same
verification model as `/api/track`).

- Auth: `Authorization: Bearer <quick-auth-jwt>` (`sdk.quickAuth.fetch`, see
  `window.ZABAL.join`).
- Body: `{ door?, note?, track?: 'artist'|'builder'|'creator', source? }`
- Dedupes per FID via a KV hash so the count is distinct builders, and drops a
  `signup` into the activity feed + score so the presence widget and leaderboard
  reflect it. The `signup` activity and the +5 score fire only on a FID's FIRST
  join (a re-tap updates the record but does not re-award or re-spam the feed);
  daily presence re-asserts every tap. Returns `{ ok: true, count, firstJoin }`.

### `GET /api/activity`
Public read for the presence widget (`assets/presence.js`).

- Returns `{ configured, count, recent: [{ fid, username, pfpUrl, action, target, ts }] }`.
- `configured: false` when KV env vars are absent - the widget hides itself.

### `GET /api/leaderboard`
Ranks builders by social-action points (cast 3 / signup 5 / share 2), stored in a
KV sorted set by `track`.

- Default: Empire Builder `apiLeaderboard` format `[{ address, score }]` (FIDs
  resolved to Base verified addresses via HAATZ). Register this URL in Empire
  Builder so activity feeds the $ZABAL empire.
- `?format=full`: `[{ fid, username, pfpUrl, address, score }]` for the
  `/leaderboard` page.

### `GET /api/empire-leaderboard`
Read-only proxy that pulls our tokenless empire's live leaderboard from the Empire
Builder API (`empirebuilder.world`) and normalizes any upstream shape to one stable
contract: `{ ok, configured, source, empireId, board, count, entries:[{ rank,
address, fid, username, displayName, pfpUrl, score }] }`.

- Reads are open GETs upstream; works without a key. Sends `x-api-key: EMPIRE_API_KEY`
  if that env is set (future-proofing for partner-gated reads).
- Query: `tokenAddress` (Empire ID; defaults to `EMPIRE_ID` env), `id` (one board by
  id, else the empire's `consolidated` board), `limit` (1..250, default 50),
  `debug=1` (include the raw upstream payload to confirm field shapes post-deploy).
- Graceful no-op: no empire id configured -> `{ ok:true, configured:false }`.
- READ direction (Empire Builder -> us). Inverse of `/api/leaderboard`, which exposes
  OUR data FOR Empire Builder. Note: an `apiLeaderboard` requires an ERC-20 empire;
  a TOKENLESS empire's board is a `farcasterChannel`/`cast`/`interaction` type.

### `POST /api/webhook`
Manifest `webhookUrl`. Farcaster POSTs a JSON Farcaster Signature envelope when a
user adds the app or toggles notifications. Stores `{ url, token }` per FID in KV
(`zabal:notif:tokens`). The JFS Ed25519 signature is verified (app-key header,
fail-closed) before storing. When `FARCASTER_HUB_URL` is set, the app key is also
bound to the claimed FID via the hub's `onChainSignersByFid` (active-signer set,
ADD/REMOVE folded); this binding fails OPEN on hub errors and is skipped entirely
when the env var is unset. Set it to a hub exposing `/v1/*` and verify on a
Preview before relying on it.

### `POST /api/notify`
Admin-only sender. `Authorization: Bearer <NOTIFY_SECRET>`. Body
`{ title (<=32), body (<=128), targetUrl? }`. Groups stored tokens by their
Farcaster notification URL and sends in batches of 100.

### `POST/GET /api/present`
Live "here now" heartbeat for `/live`. Each tab POSTs `{ id }` (an anonymous
per-tab token); a timestamp-scored ZSET counts ids seen in the last ~75s.
Ephemeral, no identity. `{ configured, count }`. No-ops when KV is absent.

### `GET /api/daily-cast` (cron)
On a day with a workshop dated today in `data/workshop-leads.json`, casts
"what's on today" into `/zabal` via Neynar. KV-sentinel idempotency
(`zabal:cron:daily-cast:<date>`) so a retry never double-posts; a failed post
releases the claim for the next run. No-ops cleanly if KV/Neynar are unset or
there is no session today. Runs daily via `vercel.json` crons.

### `POST /api/register`
The thin builder-registration layer from the GitHub-as-submission /
Bonfire-as-backend architecture (research doc 784). A builder's harness makes one
call after pushing work to GitHub.

- Wallet is the auth-free baseline so any harness can submit. An OPTIONAL
  `Authorization: Bearer <quick-auth-jwt>` links the wallet to a verified FID (the
  anchor when present); an absent/invalid token never blocks. Inputs are
  shape-validated and length-capped.
- Body: `{ wallet: "0x...", github_repo: "owner/repo" | full URL }`
- Keeps `zabal:builds` { wallet -> JSON array of repos } (many repos per builder,
  de-duped; legacy single-string values still read) and `zabal:builds:fid`
  { wallet -> fid } for the optional link. Returns
  `{ ok: true, wallet, github_repo, repos, fid, count }`. Never touches Bonfire.

### `GET /api/commit-watcher` (cron)
The scheduled push side of doc 784. Reads `zabal:builds`, checks each public repo
for new commits, and pushes them to the Bonfire knowledge graph as episodes. This
is the ONLY component that talks to Bonfire (server-side). Ownership proof at this
boundary: before pushing, the repo must contain the registrant's wallet in a known
file (`ZABAL.md`, then the README, case-insensitive) - this is what stops someone
registering a repo they do not control; unverified repos are skipped, not pushed.
Graceful no-op when KV or the Bonfire env is absent; a single repo erroring does
not stop the rest. Does no judging/ranking - that stays in Bonfire's existing pipeline.

### `POST /api/bonfire-ask`
Backs the Bonfire read spot on `graph.html`. Two actions:

- `action: 'query'` (default, anonymous, no auth): logs what people search to
  `zg:bonfire:queries:v1` so we can see what the community looks for.
- `action: 'submit'` (Quick Auth required): contribution intake. Pushes an
  author-tagged item to `zg:bonfire:pending` with the FID verified server-side
  (never a client-sent FID). ZOE drains that queue and promotes approved items
  into the canonical graph (docs/research/771). The pending queue can live in a
  dedicated Upstash DB (`BONFIRE_QUEUE_KV_REST_API_URL/TOKEN`) so the ZOE token
  cannot reach the query logs; falls back to the site KV if unset.
- Returns `{ ok: true, stored, id? }`. No-ops gracefully if the relevant KV is
  absent.

### `POST/GET /api/snap/signup`
Hybrid signup endpoint with content negotiation per the `@farcaster/snap` spec.
`Accept: application/vnd.farcaster.snap+json` returns interactive Snap JSON (the
in-cast 4-role-button signup + confirmation Snap on POST); any other `Accept`
returns HTML with `fc:miniapp` meta as the fallback. Submissions forward to the
Formspree team form as the stub backend. v1 reads FID + cast hash as untrusted
(JFS signature verification skipped until a Node runtime adds `@farcaster/snap`).

## Required env vars (Vercel project settings)

| Var | What | Where |
|-----|------|-------|
| `KV_REST_API_URL` | Vercel KV / Upstash REST base URL | auto-set when you add a Vercel KV store, or copy from Upstash |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash REST token | same |
| `NOTIFY_SECRET` | Bearer secret guarding `POST /api/notify` | set to any long random string; pass it as `Authorization: Bearer <value>` when sending |
| `NEYNAR_API_KEY` | Neynar key for `POST /api/daily-cast` to publish the cast | Neynar dev dashboard (free tier) |
| `NEYNAR_SIGNER_UUID` | Approved Neynar signer that posts the daily cast | Neynar managed signer (approve once) |
| `CRON_SECRET` | Optional bearer enforced on cron endpoints when set | any long random string; Vercel injects it on cron calls |
| `EMPIRE_ID` | Optional override for `GET /api/empire-leaderboard`. Defaults to `zabalgamez01e9af` (our tokenless empire), so no config is needed | Empire Builder |
| `EMPIRE_API_KEY` | Optional; sent as `x-api-key` to Empire Builder. Reads work without it | Empire Builder |

Without these the endpoints still respond (verify + no-op store / empty feed),
so the site never breaks - the activity feed just stays empty until KV exists.

## Setup

1. In the Vercel dashboard: Storage -> create a KV store -> connect it to this
   project. Vercel injects `KV_REST_API_URL` + `KV_REST_API_TOKEN` automatically.
2. Redeploy. The presence widget on `/` and `/streams` populates as people cast,
   share, or sign up from inside the Mini App.

## Notes / first-run check

- Quick Auth verification supports `RS256`, `ES256`, and `EdDSA`. If the live
  Quick Auth issuer uses a different alg or JWKS path, adjust `JWKS_URL` /
  `algParams` in `api/track.mjs`. If the feed stays empty while KV is configured,
  check the function logs for a `track` 401 (token verification) - that is the
  one piece that could not be exercised in the sandbox.
- Privacy model: only deliberate social actions are recorded (cast / share /
  signup), never passive page views, matching the chosen "social actions + live
  count" design.

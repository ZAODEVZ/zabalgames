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

### `GET/POST /api/dream-vote`
Demand signal for the `/dream-leads` board (the board itself is curated in
`data/dream-leads.json`; this endpoint only holds the vote counts).

- `GET`: open read, returns `{ configured, counts: { <id>: n } }` (`configured:false`
  when KV is absent so the board still renders, just without counts).
- `POST { id }`: `Authorization: Bearer <quick-auth-jwt>` (`window.ZABAL.dreamVote`).
  One `+1` per verified FID per lead (SADD voter set, then increment only on the first
  vote - same read-then-write model as `/api/join`), so demand cannot be spoofed or
  spammed. Returns `{ ok, id, count, firstVote }`.

### `GET/POST /api/build-vote`
Community-vote half of the hybrid July judging. Holds the per-build demand signal for
the public builds board (`/enter`); the builds themselves are the repos from
`/api/register`.

- `GET`: open read, returns `{ configured, counts: { <repo>: n } }`.
- `POST { repo }`: `Authorization: Bearer <quick-auth-jwt>` (`window.ZABAL.buildVote`).
  One `+1` per verified FID per repo (same SADD-then-increment model as `/api/dream-vote`).
  Returns `{ ok, repo, count, firstVote }`. Keys: `zabal:buildvotes:v1` (counts),
  `zabal:buildvote:voters:v1:<repo>` (voter sets).

### `GET/POST /api/build-ideas`
Community "what should the ZAO build" board, surfaced at `/build-ideas`. Fully
user-submitted (unlike `/dream-leads`, which is curated): a verified FID posts an idea and
the community upvotes it. The author's own `+1` is seeded on submit, so an idea starts at
one vote and the author cannot double-vote it.

- `GET`: open read, returns `{ configured, count, ideas: [{ id, fid, username, pfp, title, text, track, ts, votes }] }` (ranked by votes, newest first as tiebreak).
- `POST`: `Authorization: Bearer <quick-auth-jwt>`.
  - `{ action: 'idea', title, text?, track?, username?, pfp? }` (`window.ZABAL.submitBuildIdea`) -> `{ ok, idea }`. `title` is required (capped 80 chars), `text` capped 500; `track` is `artist|builder|creator` or omitted; `username`/`pfp` are display-only (the verified FID is the identity anchor). Guarded: max 8 ideas per FID (`reason:'limit'`) and 1000 total (`reason:'full'`).
  - `{ action: 'vote', id }` (`window.ZABAL.buildIdeaVote`) -> `{ ok, id, count, firstVote }`. One `+1` per FID per idea (same SADD-then-increment model as `/api/dream-vote`).
  - Keys: `zabal:buildideas:v1` (iid -> idea JSON), `zabal:buildideavotes:v1` (iid -> count), `zabal:buildideavote:voters:v1:<iid>` (voter sets), `zabal:buildideas:byfid:v1` (fid -> count).

### `GET/POST /api/comments`
Per-recording comments + likes, surfaced by the `/assets/recording-comments.js` widget on
every `/recordings/*` page. `id` is the recording path (e.g. `recordings/1`).

- `GET ?id=<recId>`: open read, returns `{ configured, count, comments: [{ cid, fid, username, pfp, text, ts, likes }] }` (newest first).
- `POST`: `Authorization: Bearer <quick-auth-jwt>`.
  - `{ action: 'comment', id, text, username?, pfp? }` (`window.ZABAL.postComment`) -> `{ ok, comment }`. Text is trimmed/capped at 500 chars; `username`/`pfp` are display-only (the verified FID is the identity anchor and the profile link uses it).
  - `{ action: 'like', id, cid }` (`window.ZABAL.likeComment`) -> `{ ok, likes, firstLike }`. One like per FID per comment (same SADD-then-increment model as `/api/dream-vote`).
  - Keys: `zabal:comments:v1:<recId>` (cid -> comment JSON), `zabal:commentlikes:v1:<recId>` (cid -> count), `zabal:commentlike:voters:v1:<cid>` (voter sets).

### `GET /api/cast-comments`
The native-Farcaster path for a recording's "Thoughts". Given a recording's root cast
(its announce cast, stored as `cast_hash` in `data/recaps.json`), returns the real replies
via Neynar - public, no login, no spam infra. The `/assets/recording-comments.js` widget
uses this when a recording has a `cast_hash`, and people reply on the cast itself.

- `GET ?hash=<castHashOrWarpcastUrl>` -> `{ configured, count, root: { hash, url }, comments: [{ hash, fid, username, pfp, display, text, ts, likes, recasts, url }] }`.
- Needs `NEYNAR_API_KEY` (read-only). No-ops (`configured:false`) when absent. 30s edge cache.

### `GET/POST /api/finals-picks`
Mentor half of the hybrid July judging: mentors pick the Finals shortlist from the
voted builds. Picks live in KV (`zabal:finals:picks` { repo -> JSON `{track, by, ts}` });
`data/finals.json` stays the locked, human-committed source once the Finals settle.
`/finals` reads these picks to show the shortlist as it forms.

- `GET`: open read, returns `{ configured, picks: [{ repo, track, by }] }`.
- `POST { repo, track?, action? }`: `Authorization: Bearer <quick-auth-jwt>`. Gated to
  judge FIDs via the `ZABAL_JUDGE_FIDS` env var (comma-separated). Closed by default
  (no judges configured -> 403). `action`: `pick` (default) | `unpick`. Returns
  `{ ok, repo, picks }`.

### `GET /api/activity`
Public read for the presence widget (`assets/presence.js`).

- Returns `{ configured, count, recent: [{ fid, username, pfpUrl, action, target, ts }] }`.
- `configured: false` when KV env vars are absent - the widget hides itself.

### `GET /api/live-status`
Real Twitch + YouTube live state for `/live`, so the page never claims "Live now"
when the stream is off, catches surprise streams, and auto-selects whichever platform
is actually on.

- Keyless on both: Twitch via decapi.me (a free public status proxy); YouTube by
  fetching the channel `/live` page and checking for the live HLS manifest (only
  present during a real broadcast - not premieres/uploads). When YouTube is live the
  live video id is returned so the page can embed the actual stream + its chat.
- Override channels with `?channel=` (Twitch) and `?youtube=` (handle).
- Returns `{ ok, configured, live, platform, channel, title, viewers, uptime,
  twitch:{ live, channel, title, viewers, uptime }, youtube:{ live, handle, videoId, title } }`.
  Top-level `live` = either platform; `platform` prefers Twitch when both are on.
- Best-effort: any upstream failure returns `live: false` so the page falls back
  to its schedule-driven view.

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

### `POST /api/live-notify`
"We are live" push. Any `/live` visitor pings this on load; the server decides whether to
actually send, so there is no cron and no plan limit.

- Verifies the stream is really live (decapi.me, keyless) server-side before sending, so a
  client cannot trigger a false alert.
- A 60s poll lock (`zabal:live:poll-lock`) caps the decapi check to once a minute regardless
  of traffic; a per-session sentinel (`zabal:live:notified`, re-armed when the stream goes
  offline) makes the push fire ONCE per live session.
- Sends to the same token store as the crons (`zabal:notif:tokens`, filled by `/api/webhook`).
- No-ops (`skipped`) when KV is absent, throttled, or already notified. Returns
  `{ ok, live, sent?, recipients? }`.

### `GET /api/monthly-winner` (cron)
On the 1st of each month, reads LAST month's ZAO 2048 board
(`zabal:game:zao2048:<YYYY-MM>`, written by `/api/game`) and casts the champion +
runners-up into `/zabal` with a `/play` embed - then the board is fresh for the new
month. KV-sentinel idempotency (`zabal:cron:monthly-winner:<month>`); releases on a
failed cast so the next run retries. Same Neynar env + graceful no-op contract as
`/api/daily-cast`. Cron: `0 14 1 * *`.

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

### `GET /api/workshop-reminders` (cron)
The private-push counterpart to `/api/daily-cast`. On a day with a workshop dated
today in `data/workshop-leads.json`, sends a Farcaster notification to everyone who
added the app (the `zabal:notif:tokens` store `/api/webhook` fills) - the day-of
"tune in" nudge, the documented #1 retention lever. Day-of by design (leads carry a
date + free-text `when`, not a machine start time). KV-sentinel idempotency; graceful
no-op contract (`kv-unconfigured` / `no-session-today` / `already-sent` /
`recipients:0`). No `NOTIFY_SECRET` (server-side cron, not the admin sender). Cron in
`vercel.json`.

### `POST /api/register`
The thin builder-registration layer from the GitHub-as-submission /
Bonfire-as-backend architecture (research doc 784). A builder's harness makes one
call after pushing work to GitHub.

- Wallet is the auth-free baseline so any harness can submit. An OPTIONAL
  `Authorization: Bearer <quick-auth-jwt>` links the wallet to a verified FID (the
  anchor when present); an absent/invalid token never blocks. Inputs are
  shape-validated and length-capped.
- Body: `{ wallet: "0x...", github_repo: "owner/repo" | full URL, track?: 'artist'|'builder'|'creator' }`
- Keeps `zabal:builds` { wallet -> JSON array of repos } (many repos per builder,
  de-duped; legacy single-string values still read) and `zabal:builds:fid`
  { wallet -> fid } for the optional link. An optional `track` is stored per repo in
  `zabal:builds:track` { repo -> track } for per-track judging. Returns
  `{ ok: true, wallet, github_repo, repos, fid, count }`. Never touches Bonfire.

### `GET /api/builds`
Public read side of the registry - the "building in public" board (`/enter`). Reads
`zabal:builds` (+ the optional `zabal:builds:fid` link, `zabal:builds:track`, and the
`zabal:buildvotes:v1` counts) and flattens it to a list, ranked by community votes.
Never writes, never touches Bonfire; the repos are public GitHub anyway.

- Returns `{ configured, builders, count, builds: [{ repo, owner, wallet, fid, track, votes }] }`
  (`builders` = distinct wallets, `count` = total repos; `wallet` shortened; sorted by
  `votes` desc). No-ops to `{ configured:false, builds:[] }` when KV is absent.

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

### `GET /api/pfps`
Farcaster PFP resolver for the arcade tiles (and any page wanting ZAO faces).
`?handles=a,b,c` -> `{ ok, users: { handle: { pfpUrl, fid, displayName } } }`. 100%
free, no key: the official fname registry (username -> FID) then the Haatz bulk
endpoint; Haatz by_username / search are fallbacks and Neynar an optional last resort
only if `NEYNAR_API_KEY` is set. Best-effort - an unresolved handle is simply omitted
so the caller falls back to a text label.

### `GET/POST /api/pops`
POAP-like, Web2 participation claim plus optional UGC capture, tagged by `event` so a
single endpoint serves the season pop and event-specific ones.
- `POST { event?, videoUrl?, note?, handle? }` -> `{ ok, count, claimed:true }`
- `GET ?event=<id>` -> `{ ok, configured, event, count, items[] }`

Verified in-app (Quick Auth -> FID -> handle); a typed handle is accepted on web.
Distinct claimers in a SET, submissions in a capped list. Graceful no-op without KV.

### `GET/POST /api/raffle`
"Collect to enter, then draw a winner" raffle for live events, tagged by `event`.
- `POST { event?, handle? }` -> `{ ok, count, entered:true }` (idempotent SET of handles)
- `POST { event?, action:'draw' }` -> `{ ok, winner, count }`
- `GET ?event=<id>` -> `{ ok, configured, event, count, entries[] }`

Verified in-app / typed handle on web. The draw is host-gated by `?key=` when
`ADMIN_KEY` is set, otherwise open (fine for a single live event). No-op without KV.

### `GET/POST /api/ref`
Referral attribution for the share-to-grow loop. Share links carry `?ref=<handle>`;
when a referred player authenticates in the Mini App the referrer is credited once
(idempotent, no self-referral).
- `POST { ref }` with `Authorization: Bearer <quick-auth-jwt>` -> `{ ok, credited }`
- `GET ?ref=<handle>` -> `{ ok, ref, count }`

Storage: `ref:by` (first referrer wins per FID) + `ref:made:<ref>` (the referrer's
distinct credited set). Graceful no-op without KV.

## Required env vars (Vercel project settings)

| Var | What | Where |
|-----|------|-------|
| `KV_REST_API_URL` | Vercel KV / Upstash REST base URL | auto-set when you add a Vercel KV store, or copy from Upstash |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash REST token | same |
| `NOTIFY_SECRET` | Bearer secret guarding `POST /api/notify` | set to any long random string; pass it as `Authorization: Bearer <value>` when sending |
| `NEYNAR_API_KEY` | Neynar key - publishes the cast in `POST /api/daily-cast` and reads recording reply threads in `GET /api/cast-comments` | Neynar dev dashboard (free tier) |
| `NEYNAR_SIGNER_UUID` | Approved Neynar signer that posts the daily cast | Neynar managed signer (approve once) |
| `CRON_SECRET` | Optional bearer enforced on cron endpoints when set | any long random string; Vercel injects it on cron calls |
| `ADMIN_KEY` | Optional; when set, gates the `POST /api/raffle` draw via `?key=` | any long random string; pass it only from the host's draw call |
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

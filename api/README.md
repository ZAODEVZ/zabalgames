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
Gateway for the registered ZAO 2048 board and the public Season 1 standings.

- Default: Empire Builder `apiLeaderboard` format `[{ address, score }]` (FIDs
  with a verified Base address only). This preserves the existing ZAO 2048
  integration.
- `?format=full`: all-time ZAO 2048 rows for arcade clients.
- `?format=standings&limit=50`: the public season contract
  `{ ok, configured, source, sourceLabel, scoreLabel, status, count, entries, qv }`.
  It uses aggregate builder QV results once real ballots exist; before then it reads
  the live Empire Builder `/zabal` board. No scores are synthesized or hardcoded.

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

### `GET/POST /api/submission-intake`
The unified July season-submission store - the single place every submission lands,
whatever surface it came from (POIDH claims, Magnetiq UGC, manual adds, tags). Any
piece of IP counts: app, video, image, track, art, or repo.

- `POST` (Bearer `ADMIN_KEY` or `INTAKE_KEY`) upserts a normalized record:
  `{ id, source, builder:{ fid, wallet, handle }, track, type, forBrand, project, url, repo, note, ts }`.
  `track` is `artist|builder|creator`; `type` (`video|image|app|repo|music|link|other`) is
  inferred from the url when omitted; `forBrand` is `zabalgamez` (default), `zabal`, or `zao`.
  The record is keyed by builder + project, so re-posting the same project UPDATES it (no
  dupes) - that is also how a builder updates their own entry.
- `GET ?builder=<handle>` returns that builder's items (backs `/builder?handle=`);
  `GET ?feed=recent&limit=N` returns the season feed newest-first (backs `/submissions`).
- Keys: `zabal:intake:items` (HASH id -> record), `zabal:intake:feed` (ZSET by ts),
  `zabal:intake:builder:<key>` (SET of ids per builder). Returns `{ ok, configured, count, items }`;
  no-ops to `{ ok:true, configured:false }` without KV.

### `GET /api/poidh-watcher` (cron + on-demand)
Auto-ingest for the POIDH "ZABAL Gamez Open Pot" (#1249). POIDH has no API, but claims
are Farcaster casts - this polls Neynar cast search for the pot's casts, dedupes on cast
hash, and writes each to the submission-intake store (`source: 'poidh'`). Builders never
register; they just claim on POIDH and it appears on the site.

- Needs KV + `NEYNAR_API_KEY`; returns `{ ok:true, configured:false, added:0, has:{ kv, neynar } }`
  when either is missing (the diagnostic that names the missing var).
- Dedup set `zabal:intake:poidh:seen` (cast hashes). Runs on a daily Vercel cron and can be
  triggered on-demand by hitting the URL. Auth: allowed unauthenticated when no `CRON_SECRET`/
  `INTAKE_KEY` is set. Returns `{ ok, configured, scanned, added }`.

### `POST /api/magnetiq-ugc`
Receiver for Magnetiq UGC submissions - wire Magnetiq (webhook / Zapier / forward) to POST
here and the UGC lands in the same store (`source: 'magnetiq'`).

- `POST` (Bearer `MAGNETIQ_SECRET` or `ADMIN_KEY`). Flexible field mapping onto the
  submission-intake record; falls back to an email-derived builder key when no
  handle/fid/wallet is present. Returns the stored record; no-op without KV.

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
- `POST { event?, handle? }` -> `{ ok, count, entered:true, verified }` (idempotent SET)
- `POST { event?, action:'draw' }` + `Authorization: Bearer <ADMIN_KEY>` -> `{ ok, winner, count }`
- `GET ?event=<id>` -> `{ ok, configured, event, count, entries[] }`

Verified (Quick Auth) entries go in the draw pool; web (typed-handle) entries are recorded
in a separate `:unverified` SET and excluded from the draw. The draw requires `ADMIN_KEY`
via the Authorization header (constant-time compare) and **fails closed** - if `ADMIN_KEY`
is unset the draw is disabled, not open. CORS is restricted to the ZABAL origin allowlist.
No-op without KV.

### `GET/POST /api/ref`
Referral attribution for the share-to-grow loop. Share links carry `?ref=<handle>`;
when a referred player authenticates in the Mini App the referrer is credited once
(idempotent, no self-referral).
- `POST { ref }` with `Authorization: Bearer <quick-auth-jwt>` -> `{ ok, credited }`
- `GET ?ref=<handle>` -> `{ ok, ref, count }`
- `GET ?board=top&limit=50` -> `{ ok, entries: [{ rank, handle, count }] }` (top-referrers
  board, surfaced at `/referrers`).

Capture: `assets/miniapp.js` reads `?ref=<handle>` on landing and calls `ZABAL.refer()`
once per visit - that is what makes the loop fire. Storage: `ref:by` (first referrer wins
per FID) + `ref:made:<ref>` (distinct credited set) + `ref:board` (ZSET for the
leaderboard, counts forward). Graceful no-op without KV.

### `GET/POST /api/clips`
On-site clip registry + engagement for the clip flywheel. When a viewer submits a
45-60s clip as a POIDH bounty claim (`assets/clip-claim.js`), it is also recorded here
so the clip is discoverable: a per-recording gallery (`assets/clip-gallery.js`), the
`/clips` feed, likes (one per FID), and a top-clippers leaderboard. Writing needs a
Quick Auth JWT (clip tied to a verified FID; like is one per FID per clip).
- `POST { action:'submit', recId, clipUrl, title, bountyId?, txHash?, address? }` + Bearer JWT -> `{ ok, clip }`
- `POST { action:'like', recId, cid }` + Bearer JWT -> `{ ok, likes, firstLike }`
- `GET ?rec=<recId>` -> `{ ok, configured, clips:[...] }` (gallery)
- `GET ?feed=recent&limit=30` -> `{ ok, configured, clips:[...] }` (global feed)
- `GET ?board=clippers` -> `{ ok, entries:[{rank,handle,clips,address?}] }`
- `GET ?format=apiLeaderboard` -> `[{ address, score }]` (Empire Builder, clips submitted)

Storage: `clips:v1:<recId>` (cid -> clip JSON), `clips:recent` (global ZSET),
`cliplikes:v1:<recId>` + `cliplike:voters:v1:<cid>` (like-once), `clips:clippers`
(leaderboard ZSET), `clips:addr` (handle -> wallet for Empire). Graceful no-op without KV.

### `GET /api/clip-meta`
Stateless metadata for a POIDH clip claim, so a submitted clip renders on poidh.xyz
without any IPFS/Pinata hosting (used by `assets/clip-claim.js` as the claim `uri`).
- `GET ?v=<ytId>&c=<clipUrl>&t=<title>&d=<description>` -> `{ name, description, image, external_url, animation_url }`. `image` is the YouTube thumbnail (stable, hotlinkable).
- No auth, no KV - pure function of the query string.

### `GET/POST /api/clip-bounties`
Per-recording clip-bounty registry, so a recording's existing POIDH bounty can be looked
up instead of pasted by hand (front door for `assets/clip-claim.js` + `assets/clip-gallery.js`).
- `GET ?rec=<recId>` -> `{ ok, configured, recId, bounties:[{ bountyId, amountEth, txHash, from, handle, ts }] }`. Public read.
- `POST { recId, bountyId, amountEth, txHash, from }` + Quick Auth -> `{ ok, bounty }`.
- Upstash Redis; no-ops cleanly without KV env.

### `GET /api/unlock-bounty-count`
Server-side counter of how many "Unlock Protocol Clipping Bounty" casts already exist on
POIDH, so `assets/unlock-bounty.js` can auto-number the next as v1/v2/v3 (POIDH's tRPC API
sends no CORS header, so the browser cannot count them directly).
- `GET` -> the current count. Public, read-only, no auth (counts a public on-chain title).

### `POST /api/win-notify`
Win webhook receiver (built by ZOL, PR #518). Set `SUBMIT_NOTIFY_URL=https://zabalgamez.com/api/win-notify`
so submission notifies flow here. Texts containing `community-win` are queued to the
`zabal:winqueue` Redis list for ZOL to cast; everything else is a logged no-op.
- Optional auth: if `WIN_HOOK_SECRET` is set, requires `?token=` or Bearer. Unset = open (harden by setting it).

### `GET /api/win-drain`
Token-gated queue drain for ZOL's caster cron. Fails closed without `WIN_HOOK_SECRET`.
- `GET ?token=<WIN_HOOK_SECRET>&n=1` -> `{ items: [{ text, ts }] }` (LPOP oldest-first, n max 10).

### `GET/POST /api/profile`
Open builder profiles (docs/submission-system-spec.md). Handle is the anchor; Farcaster
(Quick Auth), GitHub (nonce proof), and a wallet attach as optional proofs. Renders at
`/profiles/<handle>`; a submission hangs off this identity.
- `GET ?handle=<h>` -> `{ ok, profile }` (public)
- `POST { action:'upsert', handle, displayName?, bio?, links?, github?, editToken? }`
Used by profile.html, builder.html.

### `GET/POST /api/agent` (agent gateway)
Token-authed programmatic access for builders. A per-builder token is MINTED when
a human approves their FIRST submission (see the submissions approve action) - that
manual gate is the anti-bot wall. See `mcp/` for the MCP server + REST docs.
- `GET` + `Authorization: Bearer zg_...` -> `{ ok, builder:{handle}, submissions:[...], counts }` (pull)
- `POST { action:'submit', promptId?, answer, fields?, url? }` + Bearer -> `{ ok, id, status:'pending' }` (push, attributed to the token's builder)
- `POST { action:'claim' }` + Quick Auth JWT -> `{ ok, token }` (a verified builder retrieves their own token)
- A token only grants the holder's own data + creating submissions as themselves. Never admin, never others.

### `GET/POST /api/submissions`
Canonical project and legacy prompt submission endpoint. Anyone can create a project without an
account. Web and email intake write the same record. Projects stay pending until approved; public
work-in-progress records use `draft:true`.
- `POST { kind:'project', project, answer?, fields?, handle?, email?, draft?, consent? }` returns
  `{ ok, id, status, editToken }`.
- `POST { action:'update', id, editToken, answer?, fields?, ready? }` lets the creator update through
  the private `/submission-status` link. Editing approved content returns it to review.
- `GET ?feed=projects` returns the canonical public gallery from approved dynamic records, public
  work in progress, and `data/builder-submissions.json`.
- `GET ?id=<id>&token=<editToken>` returns the private owner view.
- `GET ?status=pending` and review actions require `ADMIN_KEY`.
- Admin actions are `approve`, `request_changes`, and `reject`; review notes are emailed when
  `RESEND_API_KEY` and a submitter email are available.

### `POST /api/submission-email`
Resend inbound adapter for email forwarded from `info@thezao.com`. Verifies the Svix signature,
retrieves the full message and attachment metadata, normalizes it, and creates a pending project via
`/api/submissions`. Requires `RESEND_API_KEY`, `RESEND_WEBHOOK_SECRET`, and
`SUBMISSION_INGEST_SECRET`. See `docs/email-submission-setup.md`.

### `GET/POST /api/qv-vote`
Quadratic vote for "who is best" this season, per track (artist/builder/creator). Each voter
gets 100 voice credits per track; N votes on one candidate cost N^2 (max 10). Score = sum of votes.
- `GET ?track=<t>&results` -> `{ ok, configured, status, track, voters, results:[{ handle, votes }] }`. `GET ?status` -> per-track ballot counts. Aggregate only; individual ballots never returned.
- `POST { track, allocations:{ <handle>: <0..10> } }` + Quick Auth -> `{ ok, counted, track, creditsUsed, yourVotes }`. Re-voting overwrites. Only accepts POSTs while `data/vote-candidates.json` `status` is `"open"`. Sybil: one ballot per FID, optional Neynar quality gate (`NEYNAR_API_KEY`, `QV_SCORE_MIN`).
- Upstash Redis (`qv:ballots:<track>` HASH, `qv:tally:<track>` ZSET); no-ops without KV.

### `GET /api/qv-slate-draft`
Admin-gated, read-only draft of vote candidates built from `data/builder-submissions.json`
(builders flagged `qv_ballot:true`, grouped by `track`). Feeds `/slate-admin.html`; a human
commits `data/vote-candidates.json` via a PR. Never opens voting.
- `GET` + `Authorization: Bearer <ADMIN_KEY>` -> `{ ok, configured, status:'draft', submission_count, candidate_count, tracks:{ artist, builder, creator, _needs_track } }`. No Supabase, no PII.

### `GET/POST /api/game`
Mini-game leaderboards powering `/play`. Monthly high-score board per game in a KV
sorted set (top 10 this month win $ZABAL), best-score-per-player.
- `POST { game, score, address? }` + Quick Auth -> `{ ok, counted, rank, best }`
- `GET ?game=zao2048` -> `{ ok, configured, game, month, board }`

### `POST /api/profile-track`
The "skip the questions" path on `/game/build-quiz`. Reads the signed-in player's
Farcaster bio + display name (server-side, by verified FID) and keyword-scores the three
lanes (artist / builder / creator), returning the best fit.
- `POST {}` with `Authorization: Bearer <quick-auth-jwt>` -> `{ ok, track, label, why, matched, confident, handle }`

Quick Auth required, so it only ever analyzes the caller's own verified profile. Falls
back to a friendly default lane (`confident:false`) when the bio gives no signal. No KV.

### `GET /api/triage`
Tier-1 deterministic submission pre-screen (July playbook Move 4). Checks a build repo before it hits the human /review queue.
- `GET ?repo=<github url or owner/repo>&track=<artist|builder|creator>` -> `{ ok, repo, tier1:{ repoValid, reachable, public, meta, trackValid, ownershipHint }, recommendation: pass|review|reject, reasons:[...] }`.
- Stateless, no KV; uses GITHUB_TOKEN for rate limit. The tier-2/3 scoring rubric lives in data/triage-rubric.md.

## Required env vars (Vercel project settings)

| Var | What | Where |
|-----|------|-------|
| `KV_REST_API_URL` | Vercel KV / Upstash REST base URL | auto-set when you add a Vercel KV store, or copy from Upstash |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash REST token | same |
| `NOTIFY_SECRET` | Bearer secret guarding `POST /api/notify` | set to any long random string; pass it as `Authorization: Bearer <value>` when sending |
| `NEYNAR_API_KEY` | Neynar key - publishes the cast in `POST /api/daily-cast`, reads recording reply threads in `GET /api/cast-comments`, and powers the POIDH claim search in `GET /api/poidh-watcher` (feed stays empty until this is set) | Neynar dev dashboard (free tier) |
| `NEYNAR_SIGNER_UUID` | Approved Neynar signer that posts the daily cast | Neynar managed signer (approve once) |
| `CRON_SECRET` | **Required** for the cron endpoints (`daily-cast`, `monthly-winner`, `commit-watcher`, `workshop-reminders`) - they fail closed (503) without it. Vercel injects the matching `Authorization: Bearer` header on scheduled runs | any long random string; set in Vercel and it auto-injects on cron calls |
| `ADMIN_KEY` | Gates the `POST /api/raffle` draw and manual `POST /api/submission-intake` / `POST /api/magnetiq-ugc` writes via `Authorization: Bearer <key>` (constant-time, fail closed) | any long random string; send only from the host's calls |
| `MAGNETIQ_SECRET` | Bearer secret for `POST /api/magnetiq-ugc` (accepts `ADMIN_KEY` too). Wire Magnetiq to send it so UGC lands in the submission store | any long random string; set in Vercel + in the Magnetiq webhook |
| `SUBMISSION_INGEST_SECRET` | Bearer secret used only by trusted submission adapters such as inbound email | independent long random string |
| `RESEND_API_KEY` | Retrieves inbound email and sends project receipts or review notes | Resend API key |
| `RESEND_WEBHOOK_SECRET` | Verifies `email.received` webhook signatures | Resend webhook settings (`whsec_...`) |
| `SUBMISSION_INBOUND_TO` | Optional comma-separated exact recipients accepted by inbound email | private Resend receiving address or aliases |
| `SUBMISSION_FROM_EMAIL` | Verified sender used for project mail; replies go to `info@thezao.com` | for example `The ZAO <info@updates.thezao.com>` |
| `PUBLIC_SITE_URL` | Absolute site origin used in private status links | defaults to `https://zabalgamez.com` |
| `GAME_SECRET` | Enables score-nonce enforcement on `POST /api/game` (HMAC-signed one-time nonces). Without it the nonce layer is bypassed gracefully; set it before any payout | any long random string |
| `EMPIRE_ID` | Optional override for `GET /api/empire-leaderboard`. Defaults to `zabalgamez01e9af` (our tokenless empire), so no config is needed | Empire Builder |
| `EMPIRE_API_KEY` | Optional; sent as `x-api-key` to Empire Builder. Reads work without it | Empire Builder |
| `ZABAL_JUDGE_FIDS` | Comma-separated FIDs allowed to pick the Finals shortlist via `POST /api/finals-picks`. Closed (403) until set | the mentor/judge FIDs |
| `BONFIRE_ID` | Bonfire group id - target for `POST /api/bonfire-ask` submissions and `commit-watcher` build events | Bonfire |
| `BONFIRE_API_URL` / `BONFIRE_API_KEY` | Bonfire REST base + key used by `bonfire-ask` and `commit-watcher` to push into the Bonfire backend | Bonfire |
| `GITHUB_TOKEN` | Read-only GitHub token `commit-watcher` uses to poll registered build repos for commits | GitHub (fine-grained, public-repo read) |

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

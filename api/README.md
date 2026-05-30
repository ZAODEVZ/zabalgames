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

### `POST /api/webhook`
Manifest `webhookUrl`. Farcaster POSTs a JSON Farcaster Signature envelope when a
user adds the app or toggles notifications. Stores `{ url, token }` per FID in KV
(`zabal:notif:tokens`). v1 does not verify the JFS signature - a clear next step.

### `POST /api/notify`
Admin-only sender. `Authorization: Bearer <NOTIFY_SECRET>`. Body
`{ title (<=32), body (<=128), targetUrl? }`. Groups stored tokens by their
Farcaster notification URL and sends in batches of 100.

## Required env vars (Vercel project settings)

| Var | What | Where |
|-----|------|-------|
| `KV_REST_API_URL` | Vercel KV / Upstash REST base URL | auto-set when you add a Vercel KV store, or copy from Upstash |
| `KV_REST_API_TOKEN` | Vercel KV / Upstash REST token | same |
| `NOTIFY_SECRET` | Bearer secret guarding `POST /api/notify` | set to any long random string; pass it as `Authorization: Bearer <value>` when sending |

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

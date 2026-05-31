# ZABAL Gamez API

Zero-dependency Vercel **edge** functions (no `package.json`, no build step - same
model as `api/snap/signup.mjs`).

Storage is **Supabase Postgres** over the PostgREST REST API (no npm client, so
these stay zero-build edge functions). All five tables + the RPCs live in
`db/supabase-activity.sql` - run it once in the Supabase SQL editor. Access is
server-side only via the `service_role` key, which bypasses RLS; RLS is enabled
with no public policies so browsers cannot touch these tables.

## Endpoints

### `POST /api/track`
Records a deliberate social action against a verified Farcaster FID.

- Auth: `Authorization: Bearer <quick-auth-jwt>`. The frontend sends this via
  `sdk.quickAuth.fetch('/api/track', ...)` (see `window.ZABAL.track` in
  `assets/miniapp.js`). The JWT is verified server-side with Web Crypto against
  the Farcaster Quick Auth JWKS - nothing is stored unless it verifies, so
  activity cannot be spoofed.
- Body: `{ "action": "cast" | "share" | "signup", "target"?: string }`
- Storage: the `zg_track` RPC appends a row to `zg_activity` and bumps the FID's
  score in `zg_scores`. The live "active today" count is derived as the distinct
  FIDs in `zg_activity` since UTC midnight (no separate presence set needed).

### `GET /api/activity`
Public read for the presence widget (`assets/presence.js`).

- Returns `{ configured, count, joinsTotal, recent: [{ fid, username, pfpUrl, action, target, ts }] }`.
- `configured: false` when the Supabase env vars are absent - the widget hides itself.

### `GET /api/leaderboard`
Ranks builders by social-action points (cast 3 / signup 5 / share 2), stored in the
`zg_scores` table by `track`.

- Default: Empire Builder `apiLeaderboard` format `[{ address, score }]` (FIDs
  resolved to Base verified addresses via HAATZ). Register this URL in Empire
  Builder so activity feeds the $ZABAL empire.
- `?format=full`: `[{ fid, username, pfpUrl, address, score }]` for the
  `/leaderboard` page.

### `POST /api/webhook`
Manifest `webhookUrl`. Farcaster POSTs a JSON Farcaster Signature envelope when a
user adds the app or toggles notifications. Stores `{ url, token }` per FID in
`zg_notif_tokens`. v1 does not verify the JFS signature - a clear next step.

### `POST /api/notify`
Admin-only sender. `Authorization: Bearer <NOTIFY_SECRET>`. Body
`{ title (<=32), body (<=128), targetUrl? }`. Groups stored tokens by their
Farcaster notification URL and sends in batches of 100.

## Required env vars (Vercel project settings)

| Var | What | Where |
|-----|------|-------|
| `SUPABASE_URL` | Supabase project URL (`https://xxxx.supabase.co`) | Supabase dashboard -> Project Settings -> Data API |
| `SUPABASE_SERVICE_ROLE_KEY` | service-role key (server-only secret; bypasses RLS) | Supabase dashboard -> Project Settings -> API keys. Never expose to the browser. |
| `NOTIFY_SECRET` | Bearer secret guarding `POST /api/notify` | set to any long random string; pass it as `Authorization: Bearer <value>` when sending |

Without the Supabase vars the endpoints still respond (verify + no-op store /
empty feed), so the site never breaks - the activity feed just stays empty until
Supabase is wired.

## Setup

1. In the Supabase SQL editor, run `db/supabase-activity.sql` (creates the five
   `zg_*` tables, the RPCs, RLS lockdown, and service-role grants).
2. In the Vercel dashboard: Settings -> Environment Variables -> add
   `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (Production, and Preview if you
   want). Redeploy.
3. The presence widget on `/` and `/streams` populates as people cast, share, or
   sign up from inside the Mini App.

The browser-side July submission gallery (`info.html`, `ZG_SUPABASE_ANON`) uses a
separate table with its own RLS and the public anon key - it is unrelated to
these server-only `zg_*` tables and is not affected.

## Notes / first-run check

- Quick Auth verification supports `RS256`, `ES256`, and `EdDSA`. If the live
  Quick Auth issuer uses a different alg or JWKS path, adjust `JWKS_URL` /
  `algParams` in `api/track.mjs`. If the feed stays empty while Supabase is
  configured, check the function logs for a `track` 401 (token verification) or a
  `sb 4xx` (RPC grant / table missing - re-run `db/supabase-activity.sql`).
- Privacy model: only deliberate social actions are recorded (cast / share /
  signup), never passive page views, matching the chosen "social actions + live
  count" design.

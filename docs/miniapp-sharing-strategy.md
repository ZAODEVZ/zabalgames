# Mini App sharing + growth strategy

Research into Farcaster Mini App sharing primitives, mapped to ZABAL Gamez. The goal:
every screen becomes a share surface that pulls outsiders into The ZAO.

Sources: [Sharing your app](https://miniapps.farcaster.xyz/docs/guides/sharing),
[Share Extensions](https://miniapps.farcaster.xyz/docs/guides/share-extension),
[composeCast](https://miniapps.farcaster.xyz/docs/sdk/actions/compose-cast),
[Manifest vs Embed](https://miniapps.farcaster.xyz/docs/guides/manifest-vs-embed),
[Base: dynamic embed images](https://docs.base.org/mini-apps/technical-guides/dynamic-embeds).

## The five sharing primitives

1. **Mini App Embeds (`fc:miniapp` meta tag).** When a page URL is cast, Farcaster renders
   an interactive card: an image plus a launch button. We already set this on every page.
   The lever we are NOT using: the **image can be per-content and dynamic** (a score card,
   a workshop thumbnail) instead of one generic card.
2. **composeCast (`sdk.actions.composeCast`).** Open the Farcaster composer from inside the
   app with prefilled text + up to 2 embeds. We wrap this as `window.ZABAL.composeCast` /
   `share`. Lever not used: the embed should be a **personalized deep link** (e.g.
   `/play?ref=<fid>`) so the recipient lands tailored and the sharer gets credit.
3. **Share Extension (`castShareUrl` in the manifest).** Makes our Mini App a TARGET in the
   Farcaster system share sheet - any user can share any cast "to ZABAL Gamez." Our manifest
   already declares `castShareUrl: https://zabalgamez.com/share`. The shared cast arrives as
   query params on `/share` (available even at SSR). Lever not used: `/share` does not yet
   consume the cast and offer a ZABAL action.
4. **Add Mini App + Notifications.** `addApp` adds us to the user's app list; the
   `webhookUrl` + `/api/notify` then let us push notifications. We have all of it. Lever not
   used: addApp is only prompted on `/play`, and we send no re-engagement notifications.
5. **Deep links / openMiniApp.** Link into sub-paths and between Mini Apps. Lever not used:
   referral/deep-link attribution.

## What we already have
- Signed manifest (`accountAssociation`, FID 19640 - do NOT hand-edit that block).
- `fc:miniapp` embed on every page; `castShareUrl: /share`; `webhookUrl: /api/webhook`.
- SDK helpers: `composeCast`, `share`, `addApp`, `haptic`, `viewProfile`, `submitScore`,
  `enterRaffle`, `claimPop`, plus the new `assets/share.js` (`.zg-share/.zg-add/.zg-profile`).
- Static embed card `assets/embed-card-gamez.png` reused everywhere.

## The gaps (and how we close them)

### 1. Per-content embed images - the biggest lever
Right now every shared link shows the same card. A bespoke image per share is the single
highest-impact change for click-through. Constraint: this repo is zero-build edge functions.
Three options:
- **A. Section-specific static cards (no build, ship now).** Make a handful of nice cards -
  a `/play` arcade card, a recordings card, a leaderboard card - and point each section's
  `og:image` + `fc:miniapp` imageUrl at the right one. Immediate upgrade, no infra change.
- **B. Per-score/per-user dynamic cards via `@vercel/og`.** A scoped `/api/og` edge route
  that renders "@user hit THE ZAO - 2048 pts" with satori. Best quality, but it introduces
  one npm dependency - a deliberate, scoped exception to "zero-build," only for image gen.
  Set `Cache-Control: max-age` so feeds do not show a gray placeholder.
- **C. Pure-SVG cards as `image/svg+xml`.** Zero-build, but feeds/og often will not render
  SVG - unreliable. Not recommended.
- **Recommendation:** ship A now (fast, safe), then adopt B for the truly personal cards
  (score, daily winner, "I'm on the board"), accepting the scoped dependency.

### 2. Make the share extension do something (`/share` consumes the cast)
We already advertise the target. Have `/share` read the shared-cast params and offer a ZABAL
action: "add this to the ZABAL Bonfire," "submit as your July build," or "clip it to /zabal."
That puts ZABAL Gamez in everyone's share sheet as a useful destination - passive,
compounding growth.

### 3. Personalized share links + referral loop
Carry `?ref=<fid>` in every composeCast embed. Track referrals in KV; reward the referrer
with a leaderboard boost or a pop when someone they brought plays/joins. Share-to-climb is
the viral loop.

### 4. Re-engagement notifications
We have the webhook + notify rails. Wire events: "you got passed on the daily board," "a new
recording is up," "the raffle was drawn," "your workshop starts in 1h." Feed the audience by
prompting `addApp` after every high-intent action (a win, a claim, an RSVP), not just on
`/play`.

### 5. viewProfile + addApp everywhere
Wire `.zg-profile` on the leaderboard rows, CRM, and recap presenters (tap a face -> their
Farcaster profile). Prompt `addApp` after the first meaningful action on each page.

## Suggested build order
1. Section-specific embed cards (option A) - fast visual win on every share.
2. `/share` share-extension handler - turns the share sheet into a growth surface.
3. `@vercel/og` `/api/og` for per-score / per-rank cards (option B) - the personal loop.
4. Referral attribution (`?ref=`) + a reward.
5. Re-engagement notifications + addApp prompts site-wide.
6. viewProfile wiring on all people lists.

## One decision needed
Dynamic embed images: ship **section-specific static cards now** (zero-build), and separately
decide whether to adopt **`@vercel/og`** (one scoped dependency) for true per-user score
cards. Everything else here is pure edge + static and fits the existing constraints.

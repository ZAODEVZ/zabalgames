# ZABAL Gamez - Terminal Handoff (2026-05-30)

Paste-and-go context for continuing this project in a terminal Claude Code session.
This repo was being worked on from the web/mobile app; moving to terminal so local
file operations (esp. dropping in an image asset) are possible.

## What this is
ZABAL Gamez = The ZAO's 3-month Build-A-Thon (a build event for the Farcaster/ZAO
ecosystem, NOT a video-game contest). June workshops, July open build, August Finals.
It's a static site + Vercel edge functions, also published as a Farcaster Mini App.

- **Repo:** zaodevz/zabalgames
- **Working branch:** `claude/optimistic-darwin-KLYYL` (PRs merge to `main`; Vercel auto-deploys `main`)
- **Production domain:** `zabalgamez.com` (with a Z). Old `zabalgames.com` 307-redirects to it.
- **Brand name:** "ZABAL Gamez" (Gamez with a Z). Arcade "INSERT COIN" logo is the chosen brand mark.

## Brand rules (hard)
- NO emojis. NO em dashes (use hyphens). No crypto/web3/onchain jargon in public copy ("digital creators"/"builders" instead). "100+" for ZAO member count, never a specific number. Tight, factual, warm.

## Current state (what's live / done)
- Rebrand swept: ZABAL Games -> ZABAL Gamez, zabalgames.com -> zabalgamez.com everywhere (merged).
- Mini App manifest `.well-known/farcaster.json` is SELF-HOSTED and signed for zabalgamez.com
  (accountAssociation type:auth, FID 19640). Valid. Do NOT hand-edit the accountAssociation.
- Homepage: reframed hero (FounderCheck-validated positioning), "What you walk away with"
  outcomes block, FAQ accordion (+FAQPage JSON-LD), live June workshop schedule (reads
  data/workshop-leads.json), top "tell Farcaster" share CTA, one-tap join button.
- Signups: ALL forms point to the team Formspree `https://formspree.io/f/mlgvvoyd`
  (lead.html, info.html mentor form, api/snap/signup.mjs), each tagged by `form_source`.
- Cal.com booking LIVE at `cal.com/zabal-games/workshop-session`, embedded on /lead
  (CAL_LINK in lead.html inline script) and /info (iframe).
- First workshop booked: Yerbearzeker, Mon Jun 1, 6-7am (in data/workshop-leads.json, id 003).

## OPEN PR (merge first)
- **PR #14** - "3:2 GAMEZ embed card (cache-busted in-feed image)". On branch, NOT merged.
  Adds assets/embed-card.{svg,png} (1200x800 arcade GAMEZ card) and repoints og:image /
  twitter:image / telegram:image / fc:miniapp+fc:frame imageUrl + manifest hero/og to it.

## OUTSTANDING TASKS (prioritized)
1. **[TERMINAL UNLOCKS THIS] Swap the on-page arcade logo to the GAMEZ version.**
   - `assets/logo.png` currently spells "GAMES" (old). User has a GAMEZ arcade logo image
     (pixel-art, "ZABAL / Z / GAMEZ / INSERT COIN"). The web agent could NOT ingest a
     chat-pasted image; a terminal CAN copy a local file.
   - Action: save the user's GAMEZ image to the repo as a NEW filename (e.g.
     `assets/logo-gamez.png`) - new filename is required because Farcaster caches embed
     images per URL. Then repoint the on-page hero <img src> in index.html (and any other
     page hero), and the splashImageUrl fields, to the new file. Keep icon.png (red Z mark,
     already brand-neutral/fine).
2. **Provision Vercel KV** (dashboard action, user-only). Project Storage -> Create -> KV ->
   Connect -> sets KV_REST_API_URL + KV_REST_API_TOKEN. Unlocks: one-tap join (/api/join),
   live "builders joined" counter (/api/activity returns configured:true), presence,
   leaderboard, and notifications (/api/webhook + /api/notify). All code already built & KV-gated.
3. **Add Cal.com booking questions** (Cal dashboard, user-only): on the
   "ZABAL Gamez Workshop Session" event add questions for Farcaster/X handle, "What will you
   teach?", format (livestream/recorded), notes. Prevents chasing topics after booking.
4. **Finalize Yerbearzeker session card**: waiting on his topic + timezone. Update
   data/workshop-leads.json id 003 (`topic`, `when`) when known; publish matching Luma event.
5. (Optional) A `/zabal` in-feed agent (Emerge-style growth loop) is a future play.

## Key files
- `index.html` - homepage (big inline <style> + inline scripts: join button, join counter,
  workshop schedule render, top-CTA cast).
- `lead.html` - workshop-lead page: Cal embed (CAL_LINK var) + Formspree form fallback.
- `info.html` - all-the-details; mentor Formspree form + Cal iframe; Supabase submission
  gallery is placeholder-keyed (NOT live), only used for July project submissions.
- `streams.html` - data streams + chronological timeline (reads data/data-streams.json +
  data/streams/timeline.json); per-entry "Cast" share buttons.
- `assets/miniapp.js` - Mini App SDK bootstrap + window.ZABAL helpers (composeCast, share,
  track, join, getUser, addApp, viewProfile...). ES module from esm.sh.
- `assets/style.css` - shared styles.
- `.well-known/farcaster.json` - Mini App manifest (self-hosted; signed accountAssociation).
- `api/*.mjs` - Vercel EDGE functions: track, activity, join, leaderboard, notify, webhook,
  snap/signup. KV via REST (KV_REST_API_URL/TOKEN). Quick Auth JWT verified server-side
  (DOMAIN = 'zabalgamez.com', JWKS from auth.farcaster.xyz). All no-op gracefully w/o KV.
- `data/workshop-leads.json` - schedule source of truth (NOT a database; curated file).
- `data/data-streams.json`, `data/streams/timeline.json`, `data/changelog.json` - content.
- `vercel.json` - redirects + headers. cleanUrls:true. (No rewrite touches /.well-known/.)
- `docs/cal-luma-workflow.md` - Cal -> Luma (no-API) process.

## How to validate before pushing (no test suite)
- JSON: `for f in $(git ls-files '*.json'); do node -e "JSON.parse(require('fs').readFileSync('$f','utf8'))" || echo BAD $f; done`
- Edge fns: `for f in $(git ls-files 'api/*.mjs'); do node --check --input-type=module < "$f" || echo BAD $f; done`
- Inline HTML JS: extract `<script>...</script>` blocks and `new Function(body)` each.
- Manifest: `node -e "const m=JSON.parse(require('fs').readFileSync('.well-known/farcaster.json','utf8'));console.log(Buffer.from(m.accountAssociation.payload,'base64').toString())"` -> must be `{"domain":"zabalgamez.com"}`.
- Image rasterize (SVG->PNG): `@resvg/resvg-js` works (no rsvg/imagemagick/sharp/puppeteer available). npm reaches registry; outbound HTTP to arbitrary hosts is otherwise 403-blocked in the web sandbox (a normal terminal likely won't have that limit).

## Critical gotchas / facts (from research + experience this session)
- **Embed images are cached by Farcaster per URL.** A shared cast keeps the embed it had at
  share time. To change an image, use a NEW URL (new filename or ?v=). This is why the logo
  swap MUST use a new filename, not overwrite logo.png.
- **Domain change = new Mini App identity.** Manifest binds to the domain permanently; moving
  to zabalgamez.com means adds/opens/notification tokens from the old domain do NOT carry over.
  Share only zabalgamez.com links so ranking signals accrue to the right app.
- **Mini App directory ranks by opens + adds + transactions + recent trending momentum**;
  needs recent opens to stay indexed. Notifications are the #1 retention+ranking lever.
- **"Snaps" = Remix (formerly Farcade), not a Farcaster protocol feature.** "Batches" most
  likely = EIP-5792 batched wallet txns (real, underused) - NOT a mini-app feature.
- **Don't launch a token early** (~85% of 2025 tokens trade below launch; hurts fundraising).
  Keep the $500 USDC pool + WaveWarZ trade cut + Hats NFT. Monetization later: x402/USDC
  pay-per-action or Hypersub, not a speculative token.
- PRs were repeatedly getting created before later commits landed; ALWAYS push all commits,
  THEN open/update the PR, and confirm the branch is even with what you intend to merge.

## Git/PR conventions
- Develop on `claude/optimistic-darwin-KLYYL`. Commit + push; open PRs to `main` only when asked.
- The user merges PRs themselves via GitHub. After a merge, `git fetch origin main` +
  fast-forward/merge the branch before new work (commits have been stranded otherwise).

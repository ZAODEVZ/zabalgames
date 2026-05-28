# Risk Register - 2026-05-28

> Comprehensive sweep of what could go wrong across every moving piece for ZABAL Games Season 1. Per Zaal 2026-05-28: 'tell me what other issues may arise.'

Risks ranked by **severity x likelihood**. Severity scale: launch-blocker / functional / cosmetic. Likelihood: high / medium / low. Mitigation strategies inline.

## Group 1: HAATZ avatar wiring (just shipped 11aaa0e)

### R1.1 - HAATZ community-run, no SLA - severity: functional, likelihood: medium

Cassie / Quilibrium runs HAATZ as a public service. No uptime guarantees. If `haatz.quilibrium.com` goes down for hours, avatars fall back to icon.png across /p (acceptable degraded state). But if /zabal bot also uses HAATZ for reads, the bot stops responding.

**Mitigation:**
- p.html already caches successes 24h + misses 1h - reduces hammer rate
- Bot will implement 2-tier failover to Neynar (per Doc 770 + Doc 2027)
- Add a public status page: thezao.com/status that pings HAATZ + Neynar + Vercel + Magnetiq every 5 min

### R1.2 - imagedelivery.net pfp URLs may expire or rate-limit - severity: cosmetic, likelihood: medium

Farcaster pfp_url often points to Cloudflare Images at imagedelivery.net. CF rate-limits hot URLs after thresholds. If our site gets a traffic spike + every visitor pulls the same pfp URLs, CF may throttle.

**Mitigation:**
- localStorage cache already hits within session - one fetch per visitor
- Future: proxy pfps through our own CDN with longer cache headers
- For now: degrade to icon.png on 429 (already does)

### R1.3 - Wrong handle bound to wrong FID - severity: launch-blocker, likelihood: low

Critical case caught during testing: "bettercallzaal" -> doesn't exist on Farcaster (handle is "zaal"). If we hardcode handles wrong in people.json, profiles render with the wrong person's avatar.

**Mitigation:**
- FID-first lookup (already implemented) - FID is stable + numeric
- Manual verification before adding each person to people.json
- The current 5 entries without FIDs (Tyler, Thy Rev, Arthur, Hurric4n3Ike, Sam) need verification before HAATZ tries to lookup

### R1.4 - localStorage corruption / private mode - severity: cosmetic, likelihood: low

Browser private mode disables localStorage. Some users intentionally disable it. Cache miss every time = more HAATZ calls.

**Mitigation:**
- Code wraps every localStorage call in try/catch (already implemented)
- Worst case: bot/site hits HAATZ on every render but degrades to icon.png anyway

## Group 2: ElizaOS bot (Doc 770 spec - mid-June build)

### R2.1 - Bot hallucination on ecosystem facts - severity: functional, likelihood: high

Claude Sonnet, even with system prompt + knowledge base, can confidently state false facts. "ZABAL Games has $5000 prize pool" or "Workshop #1 is on June 15" when neither is locked.

**Mitigation:**
- System prompt explicitly says "if you don't know, say 'I don't have that locked - dm @bettercallzaal'"
- Knowledge base loaded with llms.txt + people.json (ground truth)
- Sample 10 random replies daily for first 2 weeks, log fabrications publicly
- Add "audited 2026-05-28" stamps to llms.txt sections so bot can cite freshness

### R2.2 - Bot spam abuse - severity: functional, likelihood: high

Anyone can @-mention @zabalbot 100 times in a day. Each costs ~$0.023 in Anthropic API.

**Mitigation:**
- `PER_FID_DAILY_LIMIT=5` (already in env spec)
- Global rate limit: `GLOBAL_RATE_LIMIT_PER_HOUR=120`
- Hard budget cap: bot pauses + posts status cast at $10/day
- Block known-spammer FIDs after 3 violations

### R2.3 - Daily Anthropic cost overrun - severity: functional, likelihood: medium

If usage spikes (50 -> 500 mentions/day), $34/month estimate becomes $340/month.

**Mitigation:**
- Soft alert at $20/month
- Hard cap at $50/month - bot stops + posts "back online tomorrow" cast
- Use prompt caching for the loaded knowledge base (Anthropic supports this - saves 90% on cached input tokens)
- Monitor token-per-reply trend daily for first 2 weeks

### R2.4 - Signer key compromise - severity: launch-blocker, likelihood: low (Phase 1) / medium (Phase 2 with $ZABAL)

If `BOT_FARCASTER_SIGNER_PRIVATE_KEY` leaks (env var exposure, VPS compromise), attacker can post as @zabalbot.

**Mitigation Phase 1:**
- Bot has no funds, just identity. Worst case: embarrassing casts. Recover by rotating signer + zaal posts public disclosure.
- VPS uses non-root user, SSH key auth only (no password), fail2ban
- Sentry alerts on unexpected cast patterns

**Mitigation Phase 2 (when $ZABAL flows):**
- Privy key quorum 2-of-3 per Doc 343
- Hourly sweep of tip wallet to treasury
- Auto-pause on suspicious patterns

### R2.5 - Bot impersonation - severity: functional, likelihood: high

Someone creates `@zaba1bot` (with a 1 instead of l) or `@zabal_bot` (underscore) and posts misinformation.

**Mitigation:**
- Cast a "verified" thread from your handle: "the only ZABAL Bot is @zabalbot - FID NNNN. Anyone else is fake."
- Pin that cast to /zabal channel
- Bot can check requester's FID + reply only if request comes through legitimate channels
- Educate audience: "verify by FID, not just handle"

### R2.6 - Knowledge base drift - severity: functional, likelihood: medium

Bot loads llms.txt etc every 4 hours. If we update people.json (someone signs up), there's a 4-hour delay before bot knows. New person tries to ping bot in that window -> bot says "I don't have that locked."

**Mitigation:**
- 4h refresh interval is the floor (Anthropic prompt cache TTL alignment)
- For urgent updates: SSH into VPS + `kill -SIGHUP $(pgrep node)` forces a reload
- Future: add webhook from Vercel deploy hook to bot's `/refresh` endpoint for instant updates

### R2.7 - ElizaOS framework breaking changes - severity: functional, likelihood: medium

Pinning to v2.0.0 (or whatever's latest in early June) doesn't protect against the upstream framework breaking the Farcaster plugin in a Cassie+Neynar protocol split scenario.

**Mitigation:**
- Pin to specific commit hash, not version tag
- Test framework upgrade in staging before deploying
- Maintain a fork if upstream becomes hostile to HyperSnap

## Group 3: Notion CMS (Doc 760 spec - post-launch build)

### R3.1 - Notion API rate limit - severity: functional, likelihood: low

3 req/sec uniform across all tiers. Our sync makes 4 parallel queries + pagination = up to ~10 req at build time. Plenty of headroom UNLESS Zaal makes burst edits (e.g. updates 20 properties in a minute, each fires a webhook, each kicks a build).

**Mitigation:**
- Vercel auto-debounces simultaneous deploys (latest wins)
- Add 30-second debounce in the webhook trigger script
- Per Doc 760 risk register

### R3.2 - Schema drift - severity: launch-blocker, likelihood: medium

Zaal renames a Notion property "Date" to "When". Sync script throws TypeError. Build fails. Site shows last-good static JSON (acceptable) OR build hangs entirely (not acceptable).

**Mitigation:**
- `build:safe` script falls back to last-good JSON when sync fails
- Sync script uses defensive `p.Date?.date?.start` lookups - returns null instead of throwing
- Slack alert when build's notion-sync step fails > 1x in 24h

### R3.3 - Integration token leak - severity: launch-blocker, likelihood: low

If `NOTION_TOKEN` is committed to git or exposed via env-var leak (Vercel build logs), attacker can read every DB shared with the integration.

**Mitigation:**
- Token only stored in Vercel env vars (never in git)
- Per Doc 760: Tyler connects ONLY the 4 specific DBs (not whole workspace) so blast radius is limited
- Rotate token quarterly

### R3.4 - Accidental private data exposure - severity: launch-blocker, likelihood: medium

Notion workspace has a "Mentor Outreach Tracker" with people's DMs + private info. If Tyler accidentally connects that DB to the integration, sync pulls it into /data/*.json which goes to git + Vercel publicly.

**Mitigation:**
- Sync script only reads from explicitly-named DB IDs in env vars
- Audit script: refuse to write JSON for any DB not in approved allowlist
- Per Doc 760: "connect ONLY the 4 specific DBs" - documented + enforced

### R3.5 - Notion outage during deploy - severity: cosmetic, likelihood: low

Notion API is down at build time. Build fails OR uses last-good JSON.

**Mitigation:**
- `build:safe` keeps last-good (already specced)
- Vercel deploy retries on transient failures

## Group 4: UI polish v1 (just shipped 055b848)

### R4.1 - Press Start 2P font load fails - severity: cosmetic, likelihood: medium

Google Fonts rate limits or blocks in certain geographies (China, etc). Pixel font fails to load, browser falls back to JetBrains Mono.

**Mitigation:**
- CSS already specifies fallback: `'Press Start 2P', 'JetBrains Mono', monospace`
- Result: Mono looks slightly off-brand but readable

### R4.2 - Scan-line texture causes browser lag on older devices - severity: cosmetic, likelihood: low

CSS `mix-blend-mode: overlay` is GPU-accelerated on modern browsers but falls back to software on older ones. Could cause hero scroll jank on Android 8 / iOS 12.

**Mitigation:**
- `prefers-reduced-motion` disables it (already in CSS)
- If reports come in: add a feature query `@supports (mix-blend-mode: overlay)` so old browsers skip it entirely
- Body class `.ui-polish-v1` removable client-side via console

### R4.3 - "PLAYER 1 READY" toast misfires - severity: cosmetic, likelihood: low

Bug: dismissal localStorage key only saved on click, not on auto-dismiss. Returning visitor sees the toast again after 12s.

**Mitigation:**
- Already cached in localStorage on dismiss click - but auto-dismiss path doesn't save (bug)
- Fix: also save dismissal flag on auto-dismiss timeout. Easy follow-up commit.

### R4.4 - Blinking colon causes visual fatigue / accessibility issues - severity: functional, likelihood: low

WCAG 2.1 says no content should blink more than 3x/second (we're at ~0.9 Hz - well under). But for some users with vestibular sensitivity even slow blinks are uncomfortable.

**Mitigation:**
- `prefers-reduced-motion` already disables (CSS)
- If complaints come in: add a "polish off" toggle in UI

## Group 5: Logo + assets

### R5.1 - 1.17MB logo on mobile 3G - severity: functional, likelihood: high

Hero logo is 1024x1024 PNG at 1.17MB. On 3G (3-5 Mbps real), ~2.5s load time. Page works without it but feels slow above-the-fold.

**Mitigation:**
- Per UI redesign plan: generate WebP variants at 480px + 840px (~120-150KB each)
- Use `<picture>` element with `srcset` for responsive serving
- Estimated drop: 1.17MB -> 130KB on mobile (89% reduction)
- Status: deferred. Add to TODO N16.

### R5.2 - OG card PNG still 404 (W11) - severity: functional, likelihood: high

`/assets/og-card.png` returns 404 in production. Some platforms (Telegram some configs, certain Twitter cases) prefer PNG over SVG OG cards for unfurls.

**Mitigation:**
- Currently `og:image` points at `/assets/logo.png` (1.17MB - works but heavy)
- Plan: generate 1200x630 PNG specifically for OG card and serve at `/assets/og-card.png`
- Zaal task W11 in TODO.md

### R5.3 - Image delivery (imagedelivery.net for Farcaster pfps) banned in some regions - severity: cosmetic, likelihood: low

Cloudflare image delivery blocked in some corporate networks + China.

**Mitigation:**
- Fall back to icon.png on load error (already implemented)
- Future: proxy pfps through our CDN for stable access

## Group 6: Cross-cutting / strategic

### R6.1 - Magnetiq portal launch slips, no connector NFT mint by Workshop #001 - severity: launch-blocker, likelihood: medium

Tyler's portal goes live with Workshop #001 in the original plan. If Magnetiq isn't ready, the "get the collectible" CTA on / points at vapor.

**Mitigation:**
- Already-deployed copy says "The portal goes live with workshop lead #001 Tyler Stambaugh" - implies it's tied to launch but doesn't promise a date
- Fallback CTA: "Email me when it's live" already on the page (Formspree)
- If portal slips by 2+ weeks past Jun 1, soften CTA to just "Follow @zabalgames + @tylerstambaugh for the connector mint drop"
- ACTION: Tyler consult brief includes this Q

### R6.2 - Workshop dates not locked by Jun 1 - severity: functional, likelihood: high

We have 3 confirmed sessions (Tyler + Thy Rev x2) but dates are TBD. By Jun 1 we need at least one locked + Lu.ma event published.

**Mitigation:**
- Templates ready: `docs/luma-events-templates-2026-05-26.md`
- ACTION: Zaal DMs Tyler this week for a date
- ACTION: Zaal DMs Thy Rev for first session date
- If neither locks: announce "Workshop schedule coming this week" + soft launch

### R6.3 - Sponsor pool depends on one entity (ZAO Festivals team) - severity: functional, likelihood: medium

$500 USDC is funded - good. But the public framing implies more sponsors will come. If none materialize, the messaging "looking for more sponsors to grow the v1 prize pool" becomes stale.

**Mitigation:**
- Sponsor outreach template ready (docs/sponsor-outreach-2026-05-26.md)
- Public CTA `info@thezao.com` exists
- ACTION: Zaal sends 5-10 outreach DMs in first week post-launch
- Soft pivot: re-frame as "v0 is funded, v1 + Season 2 sponsor inquiries open" if no new sponsors land in first month

### R6.4 - Builder OAuth flow not built by July - severity: functional, likelihood: medium

Per Doc 750: mid-June build for July go-live. If it slips, builders fall back to Formspree form (current path). Functional but loses the "register once, agents read your GitHub" elegance.

**Mitigation:**
- Formspree already works for fallback
- Soft timeline OK - Doc 750 is Phase 2 polish, not blocker
- If slips to August: only affects Season 1 retrospective + Season 2 readiness

### R6.5 - Vercel free tier limits (100 GB-hr/month) - severity: functional, likelihood: low

If site goes viral, Vercel free tier exhausts. Hobby plan is hard-capped.

**Mitigation:**
- Upgrade to Pro plan ($20/month) if monitoring shows we're over 80% of free tier
- ACTION: enable Vercel analytics to track bandwidth + execution time

### R6.6 - GitHub repo public + sensitive ops content - severity: functional, likelihood: low

Our docs/ has operational stuff: sponsor outreach, mentor handles, internal financials in some places. Repo is public.

**Mitigation:**
- Audit pass on docs/ before next major content drop
- Specifically: docs/sponsor-outreach + docs/tyler-notion-brief + docs/announce-day-kit - confirm no PII/secrets
- Status: passed earlier audit per Tier 1+2+3 fabrication review

### R6.7 - Formspree limits (50 submissions/month free) - severity: functional, likelihood: medium

Free tier is 50 submissions/month per form. We use mjgajyqe for lead + mqeywpvw for testimonials. If 200 builders sign up in July: form blocks at 50.

**Mitigation:**
- Upgrade to Formspree Gold ($10/month) for unlimited - have ready as Phase 2 trigger
- Alternative: switch to Supabase write path per Doc 750 (mid-June build)
- Monitor: check Formspree dashboard weekly post-launch

### R6.8 - Brand glossary drift - severity: cosmetic, likelihood: high

New brands appear (e.g. someone announces Cassie's project name, new ZAO sub-brand). docs/brand-kit-2026-05-28.md + docs/brand-context.md not updated. Inconsistent spelling spreads through new copy + bot replies.

**Mitigation:**
- Auto-add new brand mentions detection on commits (linter check vs glossary)
- Quarterly brand-kit refresh cadence
- ACTION: weekly glossary check during first month post-launch

### R6.9 - Cassie / Quilibrium financial sustainability - severity: launch-blocker (long-term), likelihood: medium

HAATZ is hosted free. If Quilibrium runs out of runway, the endpoint goes dark. Our bot + avatar lookups break.

**Mitigation:**
- Always-keep Neynar as the two-tier failover (per Doc 2027)
- Monitor Cassie's casts + Quilibrium funding announcements
- If Quilibrium signals end-of-life: have a 30-day migration plan ready (point all reads to Neynar paid tier, eat the cost)

### R6.10 - Farcaster protocol split (Neynar + Hypersnap divergence) - severity: launch-blocker (12-month risk), likelihood: medium

Per ZAO OS Doc 489: 12-month coexistence window expected. If protocols diverge enough that pfp/user data differs by hub, our site shows different states to different visitors.

**Mitigation:**
- HAATZ is on Hypersnap (Cassie's fork). Neynar is on the Neynar-owned protocol fork.
- For Phase 1: both should be data-compatible (Snapchain protocol is the same).
- Monitor protocol-level changes monthly via Doc 489's standing watch

### R6.11 - Vercel deployment protection blocking external test - severity: functional, likelihood: caught + addressed

Preview URLs return 401 (Vercel SSO) - happened during PR #2 review.

**Mitigation:**
- Now: merged to main, prod is public (zabalgames.com)
- Future: when testing PR previews, share via Vercel "view deployment" button or generate bypass tokens for external testers

### R6.12 - Single point of failure: zaal - severity: functional, likelihood: high

Everything from sponsor outreach to Tyler comms to bot deployment requires Zaal action. If Zaal is sick / on vacation / overloaded, Season 1 ops stall.

**Mitigation:**
- Document all ops procedures (this is good for handoff continuity)
- Add a co-organizer if possible (target someone from the ZAO core team)
- For specific tasks: build delegation procedures into the workflows (e.g. Tyler can publish workshops without zaal-approval needed)

## Risk dashboard - top 10 by severity x likelihood

| Rank | Risk | Sev | Like | Score |
|---|---|---|---|---|
| 1 | R6.2 Workshop dates not locked by Jun 1 | functional | high | 9 |
| 2 | R2.1 Bot hallucination | functional | high | 9 |
| 3 | R2.2 Bot spam abuse | functional | high | 9 |
| 4 | R6.8 Brand glossary drift | cosmetic | high | 6 |
| 5 | R5.1 1.17MB logo on mobile 3G | functional | high | 9 |
| 6 | R5.2 OG card PNG missing | functional | high | 9 |
| 7 | R6.12 Single point of failure (zaal) | functional | high | 9 |
| 8 | R3.2 Notion schema drift | launch-blocker | medium | 9 |
| 9 | R3.4 Accidental private data exposure | launch-blocker | medium | 9 |
| 10 | R6.1 Magnetiq portal launch slips | launch-blocker | medium | 9 |

## Action items extracted

**This week (pre-launch):**

- [ ] Verify FIDs for Tyler / Thy Rev / Arthur / Hurric4n3Ike / Sam (R1.3)
- [ ] Generate WebP variants of logo (R5.1)
- [ ] Generate og-card.png 1200x630 (R5.2)
- [ ] Send Tyler the Notion brief + lock his workshop date (R6.1, R6.2)
- [ ] DM Thy Rev for first session date (R6.2)
- [ ] Run sponsor outreach to 5 targets (R6.3)
- [ ] Audit docs/ for sensitive content (R6.6)
- [ ] Fix R4.3 PLAYER 1 READY auto-dismiss localStorage bug

**Pre-bot launch (June):**

- [ ] Confirm Hypersnap signup flow with Cassie (R2.4 Path A)
- [ ] Set up Anthropic API budget caps (R2.3)
- [ ] Implement HAATZ + Neynar 2-tier failover in bot lib (R6.9)
- [ ] Implement per-FID rate limiting (R2.2)
- [ ] Set up Sentry + Better Uptime monitoring (R2.7)

**Phase 2 (July):**

- [ ] Privy key quorum for $ZABAL tip wallet (R2.4)
- [ ] Notion webhook + sync script (R3.1, R3.2, R3.4)
- [ ] Doc 750 Builder OAuth flow (R6.4)

**Ongoing:**

- [ ] Weekly brand glossary check (R6.8)
- [ ] Quarterly token rotation (R3.3)
- [ ] Monthly Farcaster protocol watch (R6.10)

## Document maintenance

Update this risk register:
- Every PR that introduces new infrastructure
- Weekly during launch month
- Monthly thereafter

Add `<!--- AUDITED: YYYY-MM-DD --->` markers to top after each refresh.

<!--- AUDITED: 2026-05-28 --->

# 730 - African Network Access Fix: Cloudflare in Front of Vercel

> **Status:** Research-complete. Decision pending. Estimated 30-min execution time.
> **Last validated:** 2026-05-24
> **Recommended action window:** Sun May 25 - Tue May 27 (5+ days before May 31 launch)
> **Affects:** `zabalgamez.com`, `bettercallzaal.com`, any other Vercel-hosted ZAO domain

## TL;DR

Zaal's domains are unreachable from many African networks without a VPN because Vercel has **one** African compute region (Cape Town) and **zero peering at NAPAfrica** (the main African IXP). Cloudflare has **18-32 African PoPs** and aggressive peering. The fix is to put Cloudflare in front of Vercel as the DNS + CDN layer. Free tier is sufficient. 30 min of work. Near-zero downtime if TTL is pre-lowered. Do it before May 31 launch cast.

## The actual problem

Per multi-agent diagnose (rounds dispatched 2026-05-24, dispatch reports at `/tmp/zabal-dispatch-africa-cdn-routing-*.md`):

1. **Vercel African edge gap.** Vercel ships one African compute region (Cape Town) vs Cloudflare's 31+ African data center cities (Lagos, Cape Town, Nairobi, Johannesburg, Cairo, Casablanca, Dakar, Mombasa, Algiers, Mogadishu, Maputo, Accra, Kigali, Luanda, Lome, Khartoum, Tunis, Dar es Salaam, and growing). 100-150ms latency disadvantage on basic geography.

2. **BGP peering failure.** Major African ISPs (Safaricom, MTN, Airtel, Vodacom, Maroc Telecom) do not peer with Vercel at local IXPs like NAPAfrica. Traffic to Vercel goes off-continent through slow intercontinental backbone routes (Atlantic submarine cables to AWS US-East or EU-West, then back). Cloudflare peers at all major African IXPs.

3. **Carrier transparent HTTPS proxy interception.** African mobile carriers (Safaricom, MTN) intercept and re-encrypt HTTPS at the gateway. If the carrier CA is not in the OS trust store, or the SNI hostname mismatches the cert, connection is rejected. Vercel uses Let's Encrypt SNI-based certs - vulnerable to this. Cloudflare's edge handles SNI more robustly.

4. **HTTP/3 QUIC blocking.** Some East African carriers (Uganda confirmed) block UDP port 443. Browsers wait 20-30s before falling back to HTTP/2 TCP. Vercel attempts HTTP/3 by default; Cloudflare can be configured to skip it for these ranges.

5. **IPv6-only with broken AAAA.** Some carriers force IPv6-only (464XLAT NAT64) with broken external routes, causing "Happy Eyeballs" timeouts. Cloudflare anycast resolves better in these conditions.

6. **DNS asymmetry.** Vercel's nameservers (or Porkbun's, per live test) are not in Africa. DNS lookups add 500ms-2s. Cloudflare's 1.1.1.1 has African PoP coverage and is the default resolver if you migrate DNS to Cloudflare.

## The disagreement among research agents (resolved)

Two of the five agents disagreed:

- **Agent (cloudflare-setup):** Claimed orange-cloud Cloudflare proxy "breaks Vercel SSL, bot protection, IP visibility" - therefore requires DNS-only (grey-cloud) mode which negates the CDN benefit, therefore needs paid Argo on Business tier ($200/mo).

- **Agent (fix-plan):** Said Cloudflare Free with orange-cloud proxy works fine. Just migrate nameservers + lower TTL first.

**Verdict (resolved against the first agent):**

Orange-cloud Cloudflare-in-front-of-Vercel works for static sites + Edge Functions provided:
- TLS mode on Cloudflare is set to **Full (strict)** - Cloudflare validates the Vercel-issued origin cert (Let's Encrypt is recognized)
- Vercel's "deployment protection" is OFF (it is - we disabled it earlier this session, W6)
- Real client IP is read from `CF-Connecting-IP` header (Vercel handles this automatically; Vercel analytics get the right IP)

The bot-protection concern only matters if you use Vercel's Pro plan bot management which we don't. SSL works fine on Full (strict).

## The fix - exact steps

### Pre-flight (do 24h before cutover)

1. **Log in to Porkbun.** Both domains (`zabalgamez.com`, `bettercallzaal.com`) are registered there (confirmed via live-test dispatch).
2. **Lower all DNS TTLs to 300s.** Edit each A/CNAME/MX record and set TTL = 300 (5 minutes). This means when you flip nameservers, DNS caches expire in 5 min instead of hours/days.
3. **Wait 24h** for the lowered TTL to propagate through global resolver caches.

### Cutover (30 min total)

4. **Create a Cloudflare account** if you don't have one - https://dash.cloudflare.com/sign-up. Free tier.
5. **Add `zabalgamez.com`** as the first test domain. Cloudflare scans existing DNS records at Porkbun, imports them. **Review** the imported list - make sure A records point at Vercel's IPs (currently `216.198.79.1` per live test) and the `_vercel` TXT record is there for ownership verification.
6. **Set TLS mode to Full (strict)** in Cloudflare SSL/TLS settings. NOT Flexible (insecure). NOT Full (allows self-signed). Strict mode requires valid origin cert which Vercel provides.
7. **Enable orange-cloud proxy** on the apex `@` record and `www` CNAME. Leave the `_vercel` TXT as DNS-only (grey).
8. **Copy Cloudflare's nameservers** (something like `lara.ns.cloudflare.com` and `dan.ns.cloudflare.com`).
9. **At Porkbun:** Domain Management -> Authoritative Nameservers -> replace Porkbun defaults with the two Cloudflare nameservers. Save.
10. **Wait 5-10 min** for DNS propagation (the pre-lowered TTL means it propagates fast).

### Verify (5 min)

11. `dig +short NS zabalgamez.com` should return the Cloudflare nameservers.
12. `curl -v https://zabalgamez.com 2>&1 | grep -i "server:"` should show `cloudflare`. (Was `vercel` before.)
13. Open https://zabalgamez.com in browser. Site should load. Headers in DevTools show `cf-ray` (Cloudflare) AND `x-vercel-id` (Vercel origin). Both visible = working.
14. Vercel dashboard should still show the domain as "valid configuration" (it sees the `_vercel` TXT and confirms ownership).
15. Test from a free African vantage:
    - https://www.webpagetest.org/ - free account, pick Lagos / Cape Town / Nairobi vantage
    - https://gtmetrix.com - free account, pick Hong Kong (closest free Asian vantage, similar long-haul characteristics)
    - Or DM a friend in Africa to load the site on their phone (best signal)

### Rollback (if anything breaks)

16. **At Porkbun:** revert to Porkbun's default nameservers. Save.
17. **Wait 5 min** for TTL expiry.
18. Site back to Vercel-direct.

Risk window: <5 min. The lowered TTL ensures fast rollback.

### Repeat for `bettercallzaal.com`

Once `zabalgamez.com` is verified working, repeat steps 5-15 for `bettercallzaal.com`. Independent operations, can do same day.

## What you do NOT need

- Cloudflare Argo Smart Routing ($5/domain + $0.10/GB on Business tier $200/mo) - not needed at ZAO scale. Cloudflare Free's anycast routing through African PoPs is sufficient for static + Edge Function workloads. Revisit if you measure problem patterns that Argo specifically solves.
- Cloudflare Pro ($20/mo) - adds image optimization + mobile redirect + 20 page rules. Not needed for this fix.
- Workers / R2 / D1 - not needed.
- Vercel plan upgrade - Vercel stays as the origin on its current plan.

## Cost

**Free.** Cloudflare Free tier. Porkbun nameserver change is free. Vercel origin stays on current plan.

## Timing recommendation

**Do it Sun May 25 or Mon May 26.** That's 5-6 days before the May 31 launch cast. Reasons:
- Buffer to catch DNS glitches before launch traffic
- African launch-cast viewers (Lagos/Nairobi/Cape Town are real Farcaster pockets) will get fast loads
- TTL pre-lowering takes 24h so plan: Sat lower TTL -> Sun migrate -> Mon-Fri verify -> Sun launch

DO NOT do it Fri May 29 or Sat May 30. Too close to launch if something goes sideways.

## Alternatives considered (not recommended)

| Option | Verdict | Why |
|---|---|---|
| BunnyCDN | Skip for now | Cheaper ($0.50-2/mo) but 3 African PoPs vs Cloudflare's 31+. Worth revisiting if Cloudflare doesn't solve the issue. |
| AWS CloudFront | Skip | More setup complexity. 4 African PoPs (Lagos, Cape Town, Johannesburg, Nairobi). Comparable to Cloudflare but harder. |
| Fastly | Skip | Premium pricing with explicit Africa egress surcharge. Overkill. |
| Netlify migration | Skip | Means leaving Vercel entirely. Bigger change, not justified by this issue alone. |
| Self-hosted on Hetzner with African VPS | Skip | Ops burden too high. Defeats the static-site purpose. |
| Wait for Vercel to improve Africa coverage | Skip | Vercel has said little publicly about Africa expansion. Months-to-years timeline. |

## After the fix - what to measure

Tools Zaal can use to validate the fix improved African access:

1. **WebPageTest** (free) - https://www.webpagetest.org - test from Lagos, Cape Town, Nairobi before + after. Should see TTFB drop from 1-3s to <500ms.
2. **Cloudflare Analytics** (free) - shows requests by country. Watch for traffic from African countries that wasn't there before.
3. **Real-user reports** - DM 2-3 friends in different African countries the link. Pre-fix some couldn't load; post-fix they can.
4. **Mobile carrier check** - try https://zabalgamez.com on a phone using mobile data from a known-broken carrier (Safaricom, MTN). Should load.

## Bonfire kEngram

This research is in the Bonfire graph as `africa-cdn-routing` (33 entities + 62 edges added 2026-05-24 from 5 parallel research dispatches). Query the graph for traversal.

## Sources

Dispatch reports at `/tmp/zabal-dispatch-africa-cdn-routing-*.md`:
- `root-cause-20260524.md` - infrastructure gap + peering + carrier proxy diagnosis
- `cloudflare-setup-20260524.md` - the paradox-flagging report (overstated, addressed above)
- `alternative-cdns-20260524.md` - BunnyCDN vs CloudFront vs Fastly comparison
- `live-test-20260524.md` - empirical state of zabalgamez.com + bettercallzaal.com (both on Montreal yul1 edge, no IPv6, no HTTP/3, Porkbun NS in Brazil)
- `fix-plan-20260524.md` - the 4-step migration plan, validated and adopted as Section "The fix" above

External:
- https://blog.cloudflare.com/lagos/ (Cloudflare Lagos PoP launch)
- https://www.cloudflare.com/network/ (PoP list)
- https://vercel.com/kb/guide/cloudflare-with-vercel (Vercel's own guide for Cloudflare in front)
- https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/ (TLS Full Strict docs)
- https://dev.to/getcraftly/custom-domains-for-nextjs-the-cloudflare-vercel-setup-that-works-in-2026-2a3i

## Next actions

| # | Action | Owner | When |
|---|---|---|---|
| 1 | Log into Porkbun, lower TTL on both domains to 300s | Zaal | Sat May 24 evening |
| 2 | Create Cloudflare account, add zabalgamez.com, set TLS Full Strict, enable orange-cloud | Zaal | Sun May 25 |
| 3 | At Porkbun: replace nameservers with Cloudflare's, save | Zaal | Sun May 25 |
| 4 | Verify with dig + curl + WebPageTest from Lagos vantage | Zaal | Sun May 25 + Mon May 26 |
| 5 | Repeat for bettercallzaal.com once zabalgames is confirmed working | Zaal | Mon May 26 |
| 6 | DM 2-3 friends in Africa to confirm site loads | Zaal | Tue May 27 |
| 7 | If something breaks: revert nameservers at Porkbun, wait 5 min, debug | Zaal | If needed |

If Zaal blocks on any step, ping me. I can walk through screenshots, sanity-check the TXT records, or write the verification curl commands.

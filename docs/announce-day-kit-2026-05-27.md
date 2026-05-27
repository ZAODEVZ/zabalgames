# Announce-Day Kit - 2026-05-27 (or whenever you push it)

> The single file you open tomorrow morning. Top to bottom checklist + posts + DM templates. Print, or pin in a tab.

## Pre-Flight (10 min, do FIRST)

Run these checks before the first cast. If any fail, fix before posting.

| # | Check | URL | Expected | What if broken |
|---|---|---|---|---|
| 1 | Site loads | https://zabalgames.com | Hero with live ticker + countdown to Jun 1 | Vercel deploy might have stalled. Run `vercel --prod` from `/Users/zaalpanthaki/Documents/zabalgames` |
| 2 | Lead form returns OK | Submit a test from `/lead.html` with name = TEST | `{"ok":true,"next":"/thanks"}` | Formspree quota hit -> swap to backup form. Last test: PASS |
| 3 | Cal.com book widget loads | https://zabalgames.com/#workshops (scroll to right card) | iframe shows time slots for Jun + beyond | If blank: re-check the embed URL `cal.com/bettercallzaal/zabal-games-workshop-slot` |
| 4 | Lu.ma calendar embeds load | https://zabalgames.com/#workshops (left card) | iframe shows upcoming ZAO events | If blank: re-check `luma.com/embed/calendar/cal-jPH4al7AMlXzdNN/events` |
| 5 | Zlank Snap unfurls in Warpcast | Cast `https://zlank.online/s/OAmekQ` to a draft (don't send) | Should show the signup Snap preview | If broken: the Snap URL changed. Pull latest from zlank.online dashboard |
| 6 | Farcaster manifest live | https://zabalgames.com/.well-known/farcaster.json | Returns JSON with FID 19640 accountAssociation | Should pass - validator passed yesterday |
| 7 | OG card unfurls | Paste https://zabalgames.com into a fresh tweet (don't send) | Big card with ZABAL Games | If only text: OG PNG might still be SVG-only - either upload the PNG or just push the SVG-meta version |
| 8 | Mini App SDK ready() called | Open in Warpcast on phone, scan QR for https://zabalgames.com | Splash dismisses + main UI appears | If splash stuck: `assets/miniapp.js` not loading. Check Network tab on phone |

## Cast Schedule (spread across the day - don't fire-and-forget all at once)

| Time | Platform | Account | Post | Why this order |
|---|---|---|---|---|
| Morning (9am-noon local) | Farcaster /zabal channel | @bettercallzaal | Post 4 (from announce-posts doc) | Native community, lowest stakes, builder-direct. Test the messaging here first |
| +2-3 hr | Farcaster | @thezao | Post 2 | Umbrella account amplifies after community engages |
| +24 hr (next morning) | Farcaster | @ZAOFestivals | Post 3 | Sponsor narrative gets its own day |
| +24-48 hr | X | @bettercallzaal | Post 1 | Personal voice last - can quote-cast best reaction from /zabal |

### The 4 posts (paste-ready, no edits needed)

**Post 1 - @bettercallzaal (X):**

```
ZABAL Games Season 1 is funded. $500 prize pool landed via The ZAO festivals team.

3 months: June workshops, July build, August Finals. 8 finalists, all win.

Looking for workshop presenters + mentors. ZAO network + digital creators welcome.

zabalgames.com
```

**Post 2 - @thezao (Farcaster):**

```
ZABAL Games Season 1 - The ZAO's 3-month Build-A-Thon.

June: open workshops
July: open Build-A-Thon submissions
August: 8 ZAO finalists pick champions from submissions, build together

$500 prize pool funded. All 8 Finalists win.

Workshop + mentor signups open at zabalgames.com
```

**Post 3 - @ZAOFestivals (Farcaster):**

```
The ZAO Festivals sponsors ZABAL Games Season 1.

$500 prize pool secured. 3 months, 8 Finalists, all win.

June workshop slots opening. August mentor roster filling.

Builders from ZAOstock, COC Concertz, ZAO-PALOOZA, ZAOville welcome.

zabalgames.com
```

**Post 4 - /zabal Farcaster channel:**

```
ZABAL Games Season 1 is funded.

$500 prize pool from The ZAO festivals team. 8 Finalists. All win.

3 months:
- June workshops (presenters wanted)
- July open Build-A-Thon
- August Finals with mentor pairs

Pitch a workshop or volunteer as mentor at zabalgames.com
```

### Bonus: Embed/Cover for each cast

When posting on Farcaster, attach the link `https://zabalgames.com` so Warpcast unfurls the OG card. Twitter/X auto-unfurls.

## Response Templates (for incoming DMs / replies)

Drop these in your DMs / replies. Adjust names + specifics.

### Someone asks "what is ZABAL Games?"

```
3 months of building with The ZAO. June = workshops, July = build, August = 8 finalists pick projects + ship.

Anyone can join.

zabalgames.com walks through it.
```

### Someone wants to lead a workshop

```
Awesome - lead.html on the site has the form. 30-min session, livestreamed (Restream multistreams YT + Twitch + Farcaster), recorded for the Magnetiq library.

What topic + when? I'll set up the Lu.ma event.
```

### Someone wants to mentor

```
Mentor for the August Finals - paired with 1 finalist to help them ship in 5 days.

Form on /lead - pick "Mentor" or "Both."

Real ask: 5 days in August, mostly async, plus a paired build window.
```

### Someone wants to sponsor more prize money

```
Yes - sponsor inquiries to info@thezao.com (ZAO Festivals team handles it).

Current pool: $500 USDC for Top 8 + $ZABAL for Top 16. Sponsor adds expand the USDC pool.
```

### Someone asks "but I'm not in The ZAO yet, can I still join?"

```
Yes. ZABAL Games is open. The ZAO membership matters for the August Finals voting (you need 1000+ Respect to vote on champions), but ANYONE can build in July + present in June.

If you want into The ZAO: thezao.com.
```

### Someone asks about $ZABAL tokens

```
$ZABAL is the ecosystem token. Top 16 builders get a $ZABAL allocation.

Token contract: 0xbB48f19B0494Ff7C1fE5Dc2032aeEE14312f0b07 on Base.
Empire Builder leaderboard tracks holders.
```

### Someone asks "what about crypto / web3 / blockchain"

```
ZABAL Games is for digital creators - musicians, builders, designers, organizers. 

The platform happens to run on Base + Farcaster, but you don't need to know any of it to participate. We've got people teaching workshops on how it all works in June.
```

### Someone declines mentorship/workshop

```
No worries, appreciate the heads up. If anyone in your circle would be a fit, please send them our way.

(If they change their mind, the form stays open.)
```

## Live Signup Tracking

Where to check who came in:

| Source | Where to check |
|---|---|
| /lead form submissions | Formspree dashboard: https://formspree.io/forms/mjgajyqe |
| Cal.com bookings | Cal dashboard: https://cal.com/bookings |
| Lu.ma RSVPs (Tyler + Thy Rev events once created) | luma.com/zao -> per-event |
| Farcaster /zabal channel new follows | Warpcast > Channel > Members tab |
| @bettercallzaal mentions on X | Manual scroll or x.com/search?q=zabalgames.com |

### After each signup

1. Add new workshop presenter to `data/workshop-leads.json` (push to GitHub, site auto-renders)
2. Add new mentor to `data/mentors.json` if a mentor came in
3. DM them back same day - confirmation builds trust + traction

## What's actually live on the site as of push time

Reference for if anyone asks "is X real":

| Live | What |
|---|---|
| YES | Hero ticker, countdown to Jun 1, workshop list (currently 1: Tyler), mentor list (currently 1: Arthur) |
| YES | /lead form (Formspree, tested PASS) |
| YES | /projects page with 16 adoptable projects |
| YES | Cal.com booking + Lu.ma calendar embeds |
| YES | Farcaster manifest signed, Mini App SDK loading on all 12 pages |
| YES | Zlank Snap at https://zlank.online/s/OAmekQ |
| YES | About page with real team list (just audited - no fabrications) |
| YES | Doc 750 builder OAuth registration flow spec (build target: mid-June) |
| PLACEHOLDER | OG card PNG (using SVG fallback for now - you can ship the PNG anytime) |
| PLACEHOLDER | Builder dashboard at /builder/[fid] (build target: mid-June per Doc 750) |
| PLACEHOLDER | Supabase write path (still using Formspree until Doc 750 build) |

## Quick Troubleshooting

### Site is down

```bash
cd /Users/zaalpanthaki/Documents/zabalgames
vercel ls 2>&1 | head -5    # check latest deploy status
vercel --prod                # re-deploy if needed
```

### Form not submitting

- Open Formspree dashboard: https://formspree.io
- Check form `mjgajyqe` status + quota
- Backup: redirect form action to `/api/snap/signup` (custom serverless endpoint at api/snap/signup.mjs)

### Mini App splash stuck on Warpcast

- Open `assets/miniapp.js`
- Verify `sdk.actions.ready()` is in the file
- Verify each HTML page has `<script type="module" src="/assets/miniapp.js"></script>` near `</body>`

### Lu.ma or Cal.com iframe not rendering

- Open `index.html`, find `#workshops` section
- Verify iframe `src` attributes match:
  - Lu.ma: `https://luma.com/embed/calendar/cal-jPH4al7AMlXzdNN/events?...`
  - Cal.com: `https://cal.com/bettercallzaal/zabal-games-workshop-slot/embed`

## End-of-day checklist (before bed)

- [ ] All 4 announce posts queued or sent
- [ ] Any DM responses sent (target: <4 hour reply time)
- [ ] New workshop presenters added to data/workshop-leads.json
- [ ] New mentors added to data/mentors.json
- [ ] Site still loads
- [ ] Zlank Snap still works
- [ ] Tomorrow's plan written (any new outreach DMs?)

## What I'm doing while you cast

If you ping me while announces are going out:
- I can speed-edit any post that's not landing
- I can build new Lu.ma events as you confirm dates
- I can add signups to JSON faster than the form notification arrives
- I can draft follow-ups for any conversation that needs more nuance
- I can fix anything broken on the site within minutes

Just paste reactions / DMs / screenshots and I'll triage.

## What's NEXT after launch

(Don't worry about this tomorrow - this is the post-launch backlog)

- Build Doc 750 OAuth registration flow (mid-June - frictionless GitHub connect, replaces form for builders)
- Lock the mentor roster (target: 8 mentors before Aug Finals)
- COC Concertz #6 cross-promo (Sat Jun 13)
- Cloudflare migration for Africa CDN
- N5 hero banner using SVG OG card

## Files this kit references

- `docs/announce-posts-2026-05-26.md` - the 4 posts (also pasted above)
- `docs/luma-events-templates-2026-05-26.md` - Lu.ma event templates for Tyler + Thy Rev
- `docs/research/750-builder-registration-oauth-flow.md` - the OAuth flow spec
- `data/workshop-leads.json` - confirmed leads (Tyler, Thy Rev)
- `data/mentors.json` - confirmed mentors (Arthur)
- `.well-known/farcaster.json` - signed manifest
- `assets/miniapp.js` - SDK bootstrap

You've got this. Push when ready.

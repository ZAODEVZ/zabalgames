# Tyler Brief - ZABAL Gamez Notion Sync + Magnetiq Scope

> Updated 2026-05-28 after Tyler's Telegram reaction ("I'm a bit lost lol"). Original brief was too dense + miscast Magnetiq's role. This version: tight, agreed framing first, only the Qs that still need answers.

## TL;DR

1. **zabalgamez.com is the center** for games ops (schedule, signup, roster, prizes, finals)
2. **Magnetiq is the collectible + brand-learning hub** (Zabal connector NFT + ZAO project deep-dives + workshop recordings)
3. **Notion (your workspace) syncs to zabalgamez.com** - Magnetiq is independent

You don't have to run the games infra. We don't expect to. Magnetiq is the "stay longer + learn the ecosystem" surface that pairs with the site.

## Mental map

```
zabalgamez.com (center, source of truth for ops)
  - games schedule + signup + prizes + roster + finals
  - calendar of workshop sessions (Lu.ma RSVPs)
  - reads from your Notion DBs at build time

Notion (your workspace, you own + curate)
  - Workshop Sessions, People, Announcements, FAQ
  - any property you change -> auto-rebuilds the site in ~5 min

Magnetiq (collectible + brand-learning hub, independent)
  - "Get the Zabal connector" CTA on the site links here
  - ZAO project deep-dives (ZAO / WaveWarZ / COC Concertz / ZAOstock / ZAO Music)
  - workshop session recordings after live sessions wrap
  - retention + SNAPS signal for connector-holders
```

## The Notion side (what you'd manage)

4 databases in your workspace. Site auto-pulls these.

| DB | Purpose | Lowest-touch use |
|---|---|---|
| Workshop Sessions | Drives the workshop calendar on the site | You add a session in Notion -> appears on /info#workshops + main page |
| People | Drives the roster on /p + individual /p?handle=X profile pages | You add a confirmed mentor -> they show up site-wide |
| Announcements | Drives /changelog page | You post when something ships -> public log updates |
| FAQ | Drives a new /faq page (Phase 2) | Optional - we can defer this |

Full schema in `docs/research/760-notion-cms-integration.md` (skim if you want; mostly straightforward Title/Date/Select properties).

## The Magnetiq side (what you'd own)

Independent of the site sync. Magnetiq does:

1. **The Zabal connector NFT mint** - your existing flow + UX, the site just points at it
2. **ZAO project deep-dive media library** - one place per brand (ZAO, WaveWarZ, COC Concertz, ZAOstock, ZAO Music, Magnetiq itself, BetterCallZaal) where curious folks can go deeper
3. **Workshop session recordings** - the post-live archive of every workshop, with SNAPS framework signal tracking per-watcher

The site links to Magnetiq for these. No data sync needed in either direction.

## What we'd update on our side (this week)

- Main page "Stay up to date - get the collectible" section: reframe to "Magnetiq = brand education + connector," not "the workshop library that drives the site"
- Doc 760 Notion CMS spec: explicit that sync is one-way Notion -> zabalgamez.com static JSON, Magnetiq independent
- Tyler brief: this doc (already cleaner)

## Open question for you (just one for now)

**The brand-education content for Magnetiq.** Two paths:

| Path | What |
|---|---|
| **A** - I write briefs, you slot them in | We write one ZAO project deep-dive per brand (~500 words each, 7 brands = ~3500 words total). You decide how they live in Magnetiq's UX. |
| **B** - You give me the Magnetiq content template | If Magnetiq has a structured content type for this kind of brand-page, I'll fill it directly so it's already Magnetiq-native. |
| **C** - Mix - you sketch the structure, I fill in the content | We jam on one brand together, then I do the rest in that structure. |

## Phase rollout (your call on pace)

| Phase | Site side | Magnetiq side | Timing |
|---|---|---|---|
| 1 | Workshop Sessions DB + People DB live in Notion + syncing | Zabal connector NFT mint flow live | This week, post-launch |
| 2 | Announcements DB syncs to /changelog | First ZAO project deep-dive in Magnetiq | June |
| 3 | FAQ DB + new /faq page | All 7 brand deep-dives + workshop recording library | July |

## Setup (when you're ready)

When you've shaped the Notion workspace:

1. Create Notion Internal Integration: "zabalgames-sync." Read-only.
2. Connect the 4 DBs (only those 4) to the integration.
3. Send Zaal the integration token + the 4 DB IDs.
4. Zaal drops them in Vercel env vars + ships the sync script.

We can do this on a 15-min call if easier than async.

## Reference (skim if curious, ignore otherwise)

- Full sync spec: `docs/research/760-notion-cms-integration.md`
- Brand kit + voice: `docs/brand-kit-2026-05-28.md`
- Risk register (what could go wrong): `docs/risk-register-2026-05-28.md`
- Workshop session seed data (ready to paste once schema locked): in the original brief but I can re-extract if useful

## Quick FAQ in case it helps

**Q: Will the site try to read from Magnetiq?**
A: No. Site reads from your Notion only. Magnetiq is a separate sibling surface that the site links to.

**Q: Do you need to manage the games schedule in Magnetiq?**
A: No. Games schedule lives on the site (which pulls from Notion). Magnetiq just holds workshop recordings + brand deep-dives.

**Q: What if I rename a Notion property?**
A: Site falls back to last-good static JSON. Tell me + we update the sync mapper. ~5 min fix.

**Q: What if Magnetiq isn't ready by June 1?**
A: Site launches without it. The "get the collectible" CTA on the main page softens to "follow @zabalgames + @tylerstambaugh for the connector drop" until Magnetiq is live.

Reply async or grab 15 min - whatever works.

---
topic: business
type: guide
status: research-complete
last-validated: 2026-07-24
related-docs: 754, 784
original-query: "the whole Magnetiq flow and capabilities for ZABAL Gamez - the memento types (Content Tool, Survey, Merch, Claim Codes, Social Share, QR Memento, Co-Lab, Incentive), the magnet/collectible model, member analytics, gating (magnet-owner-only), and how it integrates with the ZABAL Gamez season (submissions, vote, collectibles). Include how we should use each surface."
tier: STANDARD
---

# 778 - Magnetiq flow + capabilities for ZABAL Gamez

> **Goal:** Map every Magnetiq surface (magnet model, 8 memento types, gating, analytics, Co-Lab) from a hands-on walkthrough of the ZABAL GAMEZ brand dashboard, and give a concrete plan for how to use each one this season.

## Key decisions (do these)

| Decision | Why | Owner | By when |
|----------|-----|-------|---------|
| USE **Social Share** memento to distribute the vote + submit CTAs to the 66 holders | It pre-populates the exact posts we already wrote; turns holders into distributors with one tap. 66 holders, 0 mementos sent today = pure untapped reach. | @Zaal | 2026-07-28 |
| USE **Content Tool** mementos to deliver workshop recordings + the finalist reveal as collectibles | Content Tool ships image/video/audio/PDF with Exclusive + Downloadable toggles - the memento IS the deliverable. Anchors "early belief" per Magnetiq's own thesis. | @Zaal | 2026-08-15 |
| USE **Survey** (Magnet-Owner-Only gating) for the knowledge-game scoring + community feedback | Survey has native "Who can view: Everyone / Magnet Owner Only" gating - solves issue #505 (knowledge-game scoring) without new code. | @Zaal | 2026-08-01 |
| KEEP the site (`/vote`, `/submit`) as the system of record; use Magnetiq as the reach + collectible layer, not a second submission funnel | Magnetiq Co-Lab already collected UGC that was mostly low-signal; the curated site pipeline is the real intake. Avoid splitting the funnel. | @Zaal | ongoing |
| DO NOT rely on `Export Data` in Member Analytics - it does not work | Confirmed broken in the walkthrough; get member emails another way (Magnetiq support / API) before planning an email campaign. | @Zaal | 2026-07-31 |

## What Magnetiq is

MAGNETIQ (magnetiq.xyz, app.magnetiq.xyz) is a brand-community platform: brands mint a
**Magnet** - a free or paid digital collectible that signifies belonging - and then drop
**Mementos** (engagement actions / content) to holders. Founded ~2023 (alpha March 2023);
co-founder **Tyler Stambaugh**. The pitch is "participation over impressions" and
"owned first-party data over rented reach": vote, poll, submit, reward, and blend
digital + IRL via QR-gated actions, with the brand keeping the zero-party data. It began
NFT/blockchain-based; the current product foregrounds the engagement + analytics layer.

For ZABAL Gamez, Magnetiq is the **season registration + collectible + reach surface**:
`app.magnetiq.xyz/brand/zabal/magnet/zabal-gamez`, fronted by the `collect.zabalgamez.com`
shortlink (the site-wide "Insert Coin" button).

## The ZABAL GAMEZ magnet today (walkthrough, 2026-07-24)

- Status **On Sale**, start 05/29/26, **No End Date**, **Total Sold 66**, **Price $0**, supply **Unlimited**.
- **0 mementos created.** 65-66 holders sitting with zero engagement actions sent - the single biggest untapped lever.
- Second magnet exists: **Zabal Connector**.
- Sidebar surfaces: All Magnets, Analytics, Members, Magnets, Brand Overview, **Co-Lab**, Shopify Storefront, Brand Settings.

## The 8 memento types (create-memento flow)

Every memento shares: thumbnail (4:5, min 512x640, 5KB-10MB), name, description (rich
text, 0/1000), **scheduled Publish Date/Time**, a live Card Preview, and a hard rule:
**"once the Memento is created, these details can't be edited."** What differs is the mechanic.

| # | Type | Mechanic (from the config forms) | ZABAL Gamez use |
|---|------|----------------------------------|-----------------|
| 1 | **Content Tool** | Delivers media: Image (JPG/PNG/GIF/WEBP/BMP, 5KB-10MB), **Video MP4 (1MB-500MB)**, **Audio MP3 (50KB-100MB)**, **Document PDF/ZIP (1KB-50MB)**. Toggles: **Exclusive Content**, **Downloadable Memento Content**. | Ship workshop recordings, the 8-brand memento pack, the finalist reveal, the collectible video as gated/downloadable drops |
| 2 | **Survey** | Up to 50 questions x 5 choices. **"Who can view: Everyone / Magnet Owner Only"** (native gating). Response deadline ("Accept Responses Until"). | Gated community feedback, the knowledge-game scoring (#505), "who was your favorite talk" |
| 3 | **Social Share** | Pre-populates tweets/casts for one-click organic sharing by holders | The vote + submit CTAs we already wrote - turn 66 holders into distributors |
| 4 | **QR Memento** | QR-gated, scan-to-collect, one-to-one delivery, for in-person events; rolls into post-event portals | IRL ZAO events, live-stream drops, Finals watch party |
| 5 | **Co-Lab** | Gather UGC worldwide (or per-event) with consent/rights embedded; prompt -> submissions -> approve/reject | Already used for UGC prompts; keep for lightweight UGC, not primary submission intake |
| 6 | **Claim Codes** | Unique, trackable codes (discounts / access) | Prize/access codes, collectible unlocks |
| 7 | **Incentive** | Unique, trackable codes (discounts / access) - same primitive as Claim Codes | Rewards for participation / referrals |
| 8 | **Merch Tool** | Product variants + collects mailing addresses | Physical ZABAL Gamez merch, Finals prize fulfillment |

## Member analytics + Co-Lab (already-collected data)

- **Members / Analytics:** 65 total users, **0 mementos sent, 0% engagement rate, no Top Fan** - the dashboard is telling us the audience is warm and completely un-worked. Each member has an email captured at collect time.
- **`Export Data` is broken** (confirmed) - can't pull the member list as a CSV from the UI.
- **Co-Lab** ran several UGC prompts (submissions for the gamez, wallet address for collectible, favorite talk, best place to reach you, suggestions). Signal was mixed: real contact info (e.g. liquidkoa: Farcaster @thatdudehawaii, X crypto_chimpz, TG @HiGD74) alongside low-effort entries ("Gm", "work place"). The "Where's the best place to reach you" prompt is the useful one for outreach.

## How Magnetiq fits the ZABAL Gamez season

- **Registration / collectible:** the magnet is the season's free collectible (66 holders). Content Tool mementos are how "early belief" gets anchored (Magnetiq's core thesis - a proof-of-support artifact).
- **Reach:** Social Share is the multiplier for the site's own surfaces (`/vote`, `/submit`) - holders share our pre-written posts.
- **Gating:** Survey's Magnet-Owner-Only view is holder-gated engagement without building auth ourselves.
- **System of record stays on the site:** `/submit` -> auto-accept -> `/submissions` -> `/vote` (quadratic) is the real pipeline. Magnetiq is the collectible + reach + gated-feedback layer around it, NOT a competing submission funnel (Co-Lab UGC was mostly low-signal).

## Also see

- `docs/magnetiq-zabal-gamez-collectible-page.md` - paste-ready collectible copy
- `docs/magnetiq-mementos-zao-brands-2026-05-28.md` - the 8 brand mementos to upload
- Research 754 (Bonfire key migration), 784 (GitHub-as-submission / Bonfire-as-backend)

## Next Actions

| Action | Owner | Type | By When |
|--------|-------|------|---------|
| Create a **Social Share** memento carrying the /vote + /submit posts and send to all 66 holders (page live in Magnetiq) | @Zaal | Magnetiq | 2026-07-28 |
| Create a **Survey** memento (Magnet-Owner-Only) for the knowledge-game scoring + a "favorite session" poll (published in Magnetiq) | @Zaal | Magnetiq | 2026-08-01 |
| Upload the 8 brand mementos + collectible video as **Content Tool** mementos (Exclusive + Downloadable), one published | @Zaal | Magnetiq | 2026-08-15 |
| Get the member email list out of Magnetiq (support or API) since Export Data is broken; confirmed working export or list obtained | @Zaal | Owner | 2026-07-31 |
| Decide QR Memento for the August Finals watch party / live reveal (memento created or explicit skip) | @Zaal | Magnetiq | 2026-08-10 |

## Sources

- [About MAGNETIQ](https://www.magnetiq.xyz/about) - `[FULL]` - mission, participation-over-impressions, Tyler Stambaugh co-founder
- [For Brands - MAGNETIQ](https://www.magnetiq.xyz/for-brands) - `[FULL]` - feature list: drops with feedback loops, polls/sentiment, own data, community rewards, digital+IRL
- [MAGNETIQ x Nolcha Shows activation](https://www.magnetiq.xyz/blog/magnetiq-nolcha-shows-activation) - `[FULL]` - magnet = collectible proof-of-attendance + "digital swag bag", claim-gated, zero-party data
- [Event ROI / Event Intelligence - MAGNETIQ Blog](https://www.magnetiq.xyz/blog/event-roi-intelligence-measurable) - `[FULL]` - QR-gated content+rewards, one-to-one delivery, post-event portals, export-ready data
- [Tyler Stambaugh on the first "memento" (LinkedIn)](https://www.linkedin.com/posts/tyler-c-stambaugh-18020060_when-we-launched-our-alpha-release-back-in-activity-7407069452711718913-R9Nj) - `[PARTIAL - LinkedIn post body via search highlights, comment tree not fetched]` - the memento-as-proof-of-early-belief thesis
- [The Future CMO interview with Tyler Stambaugh](https://webdrie.net/a-peek-into-blockchain-nfts-and-next-gen-marketing-with-tyler-stambaugh/) - `[FULL]` - magnets = digital identity/affiliation; tools = merch drops, discounts, exclusive content, polling; engagement scoring
- Hands-on walkthrough of `app.magnetiq.xyz/brand-dashboard` ZABAL GAMEZ magnet, 2026-07-24 - `[FULL]` - all 8 memento config forms, member analytics, Co-Lab

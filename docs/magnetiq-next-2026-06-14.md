# Magnetiq - meeting notes + next steps (Tyler <> Zaal, Jun 12 2026)

A working session with Tyler Stambaugh (Magnetiq founder), walking through how ZABAL Gamez
is being run and how Magnetiq fits. Public-safe summary - the raw transcript is kept out of
the repo.

## Overview
- **The system today:** Luma is the central info hub (a bot auto-creates a Luma per signup,
  sends it, gets it confirmed; everyone who signs up then sees all future Fractal + ZABAL
  Gamez events). The website is built for AIs to crawl as much as people: `/speakers`,
  `/recordings` + full transcripts, `/live`, a 2048 mini-game with a leaderboard, and a
  tokenless Empire Builder empire. Cal-to-Luma flow + Cloud Code producing standardized
  Luma copy from pasted inputs.
- **Content strategy:** push as much content/transcript out this month as possible, value
  compounding after; weekly newsletter + a ~10-min recap video as the high-signal layer.
  Get transcripts up fast (do not wait on YouTube/polish). Behind on video editing (the
  bottleneck), building an in-house video editor to fix it.
- **POIDH ad bounty:** ad spend goes straight to the creator. Third bounty, with a full
  asset kit this time; 5 submissions in; co-funded via a Clanker Ecosystem Fund grant.
- **Magnetiq:** reviewed UGC submissions (approve/reject), discussed new UGC questions,
  claim-code incentives tied to UGC approval, custom fields, and possibly a separate
  "ZABAL Games" test magnet.

## What to do next on Magnetiq
- [ ] **Upload the content** - the recap video + the 8 ZAO brand mementos + the collectible
      video to the magnet (paste-ready copy already in `docs/magnetiq-*` docs).
- [ ] **Add the new UGC questions** (the data list below).
- [ ] **Set up claim-code incentives tied to UGC approval** - Tyler showed the flow:
      create Momento -> Incentive -> drop a code/collectible that the user gets by email when
      their UGC is approved (approval is the trigger; they do not have to return to Magnetiq).
- [ ] **Decide:** one shared magnet vs a separate "ZABAL Games" test magnet for trying
      claim codes without touching the main audience (new magnet = users must opt in).
- [ ] **Reach out to submitters** - e.g. the "note interactive" person (explain the
      collectibles already are on-chain), and collect the good "best way to reach you" answers.
- [ ] **Newsletter emails** - decide Substack vs Paragraph; the plan is to merge Luma +
      Magnetiq + Paragraph emails into one list. (Keep videos hosted on the site regardless.)
- [ ] **Run "favorite session" / "wallet for transferable collectible" as today-only**
      questions to create urgency ("only on the magnet today").

## UGC questions - the data we want
Add these as UGC prompts on the magnet. Where possible use a **structured field** (Tyler is
adding custom fields), not a blank box, so answers come back clean.
1. What wallet address do you want your transferable collectible sent to? (enables a Base NFT send)
2. What has been your favorite ZABAL Gamez session so far? (run through end of June)
3. Where is the best place to reach you for ZABAL Gamez updates? (Farcaster DM / group chat / Telegram / Discord / X / email)
4. Your Farcaster handle? (structured field)
5. Your X / Instagram handle? (structured field)
6. Which track are you - artist, builder, or creator?
7. What do you want to build in July? / Which adoptable project would you pick?
8. Would you lead a workshop? If so, on what?
9. Any advice or suggestions for ZABAL Gamez? (the existing advice prompt - keep)

## Magnetiq product asks (to Tyler, for the platform)
- **Custom fields on UGC requests** (e.g. an "Instagram handle" field instead of a blank
  description) - Tyler logged it; two customers now want it.
- Claim-code incentive that fires on UGC approval (confirmed possible - the approval is the link).
- The approve-bucket + filter workflow is the simple path for the first month.

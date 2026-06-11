# WIP Meetup x ZABAL Gamez - live event run of show (Thu Jun 11, 2026)

Zaal co-hosting ~1 hour inside The WIP Meetup with rizzle (WIP host). Audience is
web3-native and highly educated - lean into depth, do not dumb it down. ZABAL Gamez is
the outsider-facing builder-engagement surface of **The ZAO**; everything here points
people INTO the ZAO ecosystem. The ZAO is the parent brand and stays the headline.

Brand: no emojis, no em dashes (hyphens only), "builders / digital creators," "100+".

## Placeholders to confirm (see questions at end)
- [START TIME] - schedule says 3pm EST; confirm.
- [LUMA] - e4g2kbxp on our schedule; confirm whether the event runs on that or a WIP-hosted Luma.
- [GAME URL] - assumed zabalgamez.com/play; confirm if a separate domain.
- [PHOTOCASTER URL] - the collect link once you create the post.
- [WIP ASSETS] - rizzle's brand JPEGs (banner, logo) for the Luma + promo.

---

## 1. Minute-by-minute run of show (60 min)

**Format decision: one integrated arc, not two rigid halves.** A workshop that
transitions into a fireside, with the live game running underneath the whole time.
Why: two hard 30-min blocks fragment the energy and force a cold restart; the game
mechanic needs to run continuously (the 15-min raffle window has to breathe while you
talk), and a co-host fireside flows better as a single conversation than as two siloed
segments. WIP is woven throughout, with a dedicated WIP-forward stretch near the end.

| Time | Segment | Who | Cue |
|------|---------|-----|-----|
| 0:00-0:08 | **WIP open.** rizzle welcomes, frames The WIP Meetup, why this crew, why ZABAL Gamez today. | rizzle | rizzle hands to Zaal: "...so I'll let Zaal take it." |
| 0:08-0:10 | **Set the frame.** Zaal: The ZAO is the house; ZABAL Gamez is the front door for builders. One hour, one through-line: see the work, then play it live. | Zaal | "Before I go deep, collect the photo above - that is your entry. I will explain in two minutes." |
| 0:10-0:13 | **Drop the photocaster + start the clock.** Announce the collectible and open the 15-min raffle window. (Copy in section 3.) | Zaal | Start visible timer. "Window is open - first 15 minutes." |
| 0:13-0:23 | **Three prongs overview.** Traditional workshop / fireside / ZAO project workshop - what each is and why all three are recorded and kept for people and agents. (Talking points in section 4.) | Zaal | "...and here is the part you can touch." |
| 0:23-0:33 | **GAME PORTION.** Send everyone to [GAME URL]. They play in-browser while you narrate how it works, the Empire Builder booster, and your plans. Live leaderboard on screen. | Zaal + audience | "Pull it up now - tap to Insert Coin. Photocaster holders are boosted." |
| 0:33-0:36 | **Raffle close + draw.** Window closes at ~0:28 mark; announce, draw a winner from first-15 collectors, shout the name. | Zaal | "Window closed. Drawing now from everyone who collected." |
| 0:36-0:39 | **The ZABAL Gamez pitch.** One URL, documented, with completion status; July 1 point your harness at it and build. Tie back to The ZAO. (Section 4.) | Zaal | "That is the whole thesis - now let's talk about why it matters here." |
| 0:39-0:50 | **Fireside / WIP-forward.** Zaal + rizzle: why an educated web3 community is exactly who should be adopting started ZAO projects; what WIP and The ZAO unlock for each other. | Zaal + rizzle | rizzle steers into audience questions. |
| 0:50-0:58 | **Open AMA.** Take questions; shout askers by name. If none, rizzle lobs from the seed list (section 6). | both | - |
| 0:58-1:00 | **Close.** Recap the two doors (lead a workshop / build in July), the pops collectible + UGC ask, links. "One week down. Insert Coin." | Zaal | Drop links in chat. |

Transition cues are the bolded lines; keep the game and raffle timer on screen from 0:10 onward.

---

## 2. Live game / demo spec - buildable in a few hours, plays in-browser

**Concept: "Insert Coin" - a 15-second arcade tap competition with a live leaderboard.**
On [GAME URL], the audience taps a coin slot as fast as they can for 15 seconds; the
score posts to a live board everyone sees update in real time. It is on-brand (the
arcade ZABAL Gamez mark), instantly understandable, fun for a live crowd, and it doubles
as a demo of the ZAO rails: presence, a leaderboard, and a collectible booster.

Mechanics:
- Enter a Farcaster handle (or Quick Auth if signed in) before playing - that is the board identity.
- 15-second round, tap count = score. Re-playable; keep best score.
- **Photocaster-holder booster:** holders get a 2x multiplier (mirrors the Empire Builder booster narrative). v1 can check a manual allowlist of first-15 collectors; v2 reads holdership.
- Live board: top 10, auto-refresh every 2-3s, "here now" count from `/api/present`.

Minimal build (reuse existing edge + Upstash patterns):
1. **`/play.html`** - one page: coin-tap button + 15s timer + handle field + live top-10 list. Reuse the arcade styles from the site.
2. **`/api/game.mjs`** (new edge function, model it on `api/leaderboard.mjs`): `POST {handle, score, boosted}` -> write to a Redis ZSET `zabal:game:wip`; `GET` -> top N. Same KV env, no-op if absent.
3. **Booster:** a small server-side set `zabal:game:boosted` (the first-15 collectors); `boosted` doubles the stored score. Manual add is fine for tonight.
4. **Live count:** reuse `/api/present` (already powers `/live`).
5. Optional: a "winner" reveal mode you can trigger from the page for the raffle draw.

Fallback if the build runs late: run the round on the existing `/live` page + `/api/present` and read the `/zabal` board via `/api/empire-leaderboard` - still a live, real competition with zero new code.

---

## 3. The photocaster post

**Thumbnail concept:** Zaal + rizzle side by side in the arcade ZABAL Gamez frame
(INSERT COIN pixel mark), co-branded with the WIP mark [WIP ASSETS]. Caption bar reads
"ZABAL Gamez x The WIP Meetup - Live." Keep it 3:2 to match our embed card.

**Caption:**
```
ZABAL Gamez x The WIP Meetup, live now. Collect this to enter the raffle and boost your spot on the board. The ZAO's build event comes to the WIP. Insert Coin.
```

**Collect-to-enter CTA (pin in chat):**
```
Collect the photo to enter. Everyone who collects in the first 15 minutes is in the raffle and gets an Empire Builder leaderboard boost. Starts at 5 cents, +5 cents per collect - earlier is cheaper.
```

**Exact words to kick the 15-minute window (say live):**
```
Here is how you get in. See the photo of me and rizzle pinned up top - collect it. That is your raffle entry, and it boosts your spot on the board we are about to play on. It starts at five cents and goes up five cents every time someone collects, so the earlier you move the cheaper it is. The window is open right now - the first fifteen minutes count. Go.
```

---

## 4. Talking points - three prongs + the ZABAL Gamez pitch

Frame for a web3-native room: skip the 101, talk mechanism and composability.

**The three prongs of the work:**
1. **Traditional workshop** - a builder teaches something they have actually shipped (yerbearserker on Empire Builder, kmac on Snaps). Recorded, transcribed, kept - a curriculum, not a one-off.
2. **Fireside chat** - the why behind the build, founder to founder (the Bonfires vibe-coding fireside, the Sopha curation talk). Depth over demo.
3. **ZAO project workshop** - we walk a live ZAO rail people can build ON - Empire Builder, Bonfire, Farcaster - so the session ends with a thing you can adopt, not just notes.

**The ZABAL Gamez pitch (the punchline):**
> Every project we touch lives on one URL, documented, with its completion status visible. On July 1, you point your harness - any harness - at that URL and say "tell me a project worth building," and it hands you a real, half-built ZAO project with the context to finish it. The build is the application. You are not making a throwaway demo; you are shipping something a 100+ member community actually needs, on rails that already work.

**Reinforce The ZAO (do not eclipse it):**
> ZABAL Gamez is the front door. The ZAO is the house. The point of tonight is not the game - it is that an educated web3 community like the WIP is exactly who should be walking through that door and adopting these started projects. ZABAL Gamez brings outsiders in; what they build belongs to the ZAO ecosystem and to them.

---

## 5. Luma copy + 12-hour promo

**Luma event copy:**
```
Title: ZABAL Gamez x The WIP Meetup - Live

The ZAO's build event comes to The WIP Meetup. Zaal co-hosts with rizzle for a live hour: a tour of the work (workshops, firesides, and ZAO project builds), a live in-browser competition you play during the talk, a collectible raffle with an Empire Builder leaderboard boost, and an open AMA.

This is the "outsiders come in and build" use case - an educated web3 community meeting a stack of real, half-built ZAO projects you can adopt and finish in July. No fluff, all depth.

Collect the event photo to enter the raffle. RSVP for the link and the recording.
```

**12-hour promo post (X / Farcaster):**
```
Tonight: ZABAL Gamez x The WIP Meetup. [START TIME]

Zaal + rizzle, live for an hour. A tour of the work, a live game you play in your browser, a collectible raffle with an Empire Builder boost, and an open AMA.

The ZAO's build event, meeting the WIP. Insert Coin: [LUMA]
```
[Attach: WIP banner + ZABAL Gamez arcade card - WIP ASSETS]

---

## 6. Seed AMA questions (with crisp answers)

1. **"How is this different from a hackathon?"**
   A hackathon ends with a demo nobody runs. ZABAL Gamez ends with a shipped project a 100+ member community uses, on live rails, with a ZAO mentor as your teammate and the upside kept by you. The build is the application.

2. **"What does 'point your harness at a URL' actually mean on July 1?"**
   Every started project is documented on one URL with its completion status. Your agent reads that context and can pick up a real, half-finished build instead of starting cold. Any harness - Claude, Cursor, whatever you run.

3. **"Why tokenless? Where is the incentive?"**
   The incentive is a working product, a public track record, the prize pool, and ownership of what you ship. We run Empire Builder as a tokenless empire - reputation and leaderboard, not a coin to pump. The ZAO designs tokens carefully and only when they serve the work.

4. **"What are these 'rails' - Empire Builder, Bonfire?"**
   Empire Builder is the reputation/leaderboard layer (live tonight - it is what boosts your game score). Bonfire is the shared memory the whole event runs on - every session is pushed into it so people and agents can query what happened. Farcaster is the social and identity layer.

5. **"I am not in the ZAO. Can I still build / win?"**
   Yes - that is the entire point of tonight. ZABAL Gamez is the front door for outsiders. Adopt a started project, ship it in July, and you are in. Free, open, any harness.

6. **"What happens to what I build - who owns it?"**
   You keep the repo and the upside. It also becomes part of the ZAO ecosystem the community can build on. Composability is the point - you are not reinventing identity or leaderboards, you are extending rails that already work.

7. **"Where do I start right now?"**
   zabalgamez.com. Two doors: if you have shipped something worth teaching, lead a June workshop; if you want to build, July is open with 60+ started projects waiting. And collect the photo to get in the raffle.

---

## Pre-event checklist
- [ ] Confirm start time + Luma.
- [ ] Build [GAME URL] (or set the fallback to /live + /api/empire-leaderboard).
- [ ] Create the photocaster post; grab the collect URL; pin it.
- [ ] Seed the booster allowlist plan (manual first-15).
- [ ] Set up the pops collectible (Web2 flow) + the WIP-specific UGC submission (video + Farcaster handle) on the site.
- [ ] Drop WIP assets into the Luma + promo.
- [ ] Post the 12-hour promo.

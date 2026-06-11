# Workshop media pipeline tracker - ZABAL Gamez Season 1

Single grid for every guest across the full media pipeline, from "booked" to
"video live and shared with the creator." This is the production-status companion to
`docs/workshop-roster.md` (which tracks the outreach/scheduling funnel) and
`data/recaps.json` (the live recap library). When a guest moves a stage, tick it here
and update the matching source file.

## The 8 stages

1. **Scheduled** - date locked, on the live homepage schedule (`data/workshop-leads.json` has a `date`).
2. **Booked** - slot confirmed (Cal booking or a manual lock), guest knows the date/time.
3. **Luma** - a public Luma event exists (`luma_url` in `workshop-leads.json` / `recording` in `recaps.json`).
4. **OK'd** - guest reviewed the cut/page and confirmed it looks good (share unlisted first, then publish).
5. **Thumbnail** - Canva thumbnail produced (`/assets/workshops/<slug>.png`, referenced as `thumbnail`).
6. **Recorded** - the session ran and we hold the master recording.
7. **Transcript** - clean transcript published on zabalgamez (in `data/streams/.../raw/transcripts/` + linked from the recap/page).
8. **YouTube** - final cut uploaded to YouTube AND the link shared with the creator.

Legend: `x` done - `~` in progress / partial - blank = not yet - `n/a` not applicable.

---

## Master chart - every guest

One row per session, every stage. Detail + open work is in the sections below.

| Guest / session | Date | Status | 1 Sched | 2 Book | 3 Luma | 4 OK'd | 5 Thumb | 6 Rec | 7 Tx | 8 YT | Missing |
|---|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|---|
| yerbearserker - Empire Builder V3 (Pt 1) | Jun 1 | delivered | x | x | x |  | x | x | x | x | OK'd log |
| yerbearserker - Empire Builder Pt 2 | Jun 1 | delivered | x | x | x |  | x | x | x | x | OK'd log |
| Joshua.eth + Plat0x - Bonfire | Jun 1 | delivered | x | x | x |  | x | x | x | x | OK'd log |
| Ohnahji - Livestreaming | Jun 2 | delivered | x | x | x |  |  | x | x | x | thumbnail, OK'd |
| Chris (Sopha) - Building Sopha | Jun 8 | delivered | x | x | x |  |  | x | x |  | thumbnail, YouTube, OK'd |
| Carlos (Plat0x) - Bonfire fireside | Jun 6 | delivered | x | x | n/a |  |  | x | x |  | thumbnail, YouTube, OK'd |
| Zaal - ZAO Fractal intro | Jun 1 | delivered | x | x | n/a |  |  | x | x |  | thumbnail, YouTube |
| Joseph Goats - Owning your music | Jun 9 | delivered | x | x | x |  |  | x |  |  | transcript, thumbnail, YouTube, OK'd |
| Will T of Web3 - KFMEDIA | Jun 10 | delivered | x | x | x |  |  | x |  |  | transcript, thumbnail, YouTube, OK'd |
| Zaal - WIP Meetup | Jun 11 | scheduled | x | x | x |  |  |  |  |  | recording (today) |
| Cassie - Farcaster protocol | Jun 12 | scheduled | x | x | x |  |  |  |  |  | recording |
| Adam Miller - miDAO | Jun 12 5:45pm | scheduled | x | x | x |  |  |  |  |  | recording |
| Kenny - POIDH + ZABAL ad bounty | Jun 15 4pm | scheduled | x | x | x |  |  |  |  |  | recording |
| diviflyy - Empire Builder V3 convo | Jun 16 12pm | scheduled | x | x |  |  |  |  |  |  | **Luma #3**, recording |
| Dr. Jake - Growth through foundations | Jun 16 6pm | scheduled | x | x |  |  |  |  |  |  | **Luma #4**, recording |
| Jub Jub - Farcaster Batches fireside | Jun 20 8am | scheduled | x | x |  |  |  |  |  |  | **Luma #5**, recording |
| Dan Singjoy - Eden Fractal + ecosystem | Jun 20 12pm | scheduled | x | x |  |  |  |  |  |  | **Luma #6**, recording (prep doc ready) |
| Adrienne - Warpee.eth | Jun 30 11:30am | scheduled | x | x |  |  |  |  |  |  | **Luma #7**, recording |
| Tyler Stambaugh - Magnetiq | TBD | confirmed |  |  |  |  |  |  |  |  | date, then all downstream |
| Thy Revolution - 2 sessions | TBD | confirmed |  |  |  |  |  |  |  |  | topics, dates, track |
| Duo Do - Musician on Farcaster | TBD | confirmed |  |  |  |  |  |  |  |  | date |
| Jonathan Colton - FounderCheck (2 talks) | TBD | confirmed |  |  |  |  |  |  |  |  | dates |
| kmac.eth - Farcaster Snaps | TBD | confirmed |  |  |  |  |  |  |  |  | date |
| Plat0x - Bonfire builder session | TBD | confirmed |  |  |  |  |  |  |  |  | date, Luma |
| candytoybox | TBD | lined up |  |  |  |  |  |  |  |  | confirm topic/track/date |
| hurric4n3ike (Ikechi) | TBD | lined up |  |  |  |  |  |  |  |  | confirm topic/track/date |
| The Dude | TBD | lined up |  |  |  |  |  |  |  |  | confirm handle/topic/track |
| saltoriuous | TBD | lined up |  |  |  |  |  |  |  |  | confirm handle/topic/track |
| nickysap | TBD | lined up |  |  |  |  |  |  |  |  | confirm handle/topic/track |

**Luma copy for the 7 marked above:** `docs/luma-events-2026-06-11.md` (copy-paste ready).

---

## A. Delivered - in the media pipeline

These ran; the work now is finishing edits, transcripts, thumbnails, and YouTube.

| # | Guest / session | Page | 1 Sched | 2 Book | 3 Luma | 4 OK'd | 5 Thumb | 6 Rec | 7 Transcript | 8 YouTube |
|---|---|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 01 | yerbearserker - Empire Builder V3 (Pt 1) | /recordings/1 | x | x | x |  | x | x | x | x |
| 02 | yerbearserker - Empire Builder Pt 2 (live build) | /recordings/2 | x | x | x |  | x | x | x | x |
| 03 | Joshua.eth + Plat0x - Bonfire | /recordings/3 | x | x | x |  | x | x | x | x |
| 04 | Ohnahji - Starting/growing your livestream | /recordings/4 | x | x | x |  |  | x | x | x |
| 05 | Chris (Sopha) - Building Sopha + curation | /recordings/5 | x | x | x |  |  | x | x |  |
| F1 | Carlos (Plat0x) - Bonfire fireside + vibe-coding | /recordings/fireside/1 | x | x |  |  |  | x | x |  |
| Z1 | Zaal - ZAO Fractal weekly intro | /recordings/zao/1 | x | x | n/a |  |  | x | x |  |
| 06 | Joseph Goats - Owning your music | /recordings/6 | x | x | x |  |  | x |  |  |
| 07 | Will T of Web3 - Building KFMEDIA | /recordings/7 | x | x | x |  |  | x |  |  |

**Where each one stands (the open work):**
- **01 / 02 / 03** - fully shipped (thumbnail, transcript, page, YouTube all live). Only gap: log the guest **OK'd** sign-off (stage 4) so we have it on record.
- **04 Ohnahji** - live with YouTube + transcript; **no Canva thumbnail** (page uses the default). Make one for parity.
- **05 Chris / Sopha** - transcript + page live; **no YouTube cut yet** and no thumbnail. Cut the video, share unlisted with Chris, then publish.
- **F1 Carlos fireside** - transcript + page live; **no Luma, no thumbnail, no YouTube**. X Space recording; decide if it gets a YouTube cut.
- **Z1 Zaal / ZAO Fractal** - transcript + page live; internal ZAO intro, no Luma. Thumbnail + YouTube optional.
- **06 Joseph Goats** - recap page is a **placeholder** ("added once the recording is processed"). Pull the recording -> transcript -> thumbnail -> YouTube.
- **07 Will T** - same placeholder state as 06. Same pipeline to run.

---

## B. Scheduled upcoming - dated, awaiting delivery

On the live schedule; nothing to record yet. After each runs, move it to section A.

| Guest / session | Date | 1 Sched | 2 Book | 3 Luma | 6 Rec | Next |
|---|---|:--:|:--:|:--:|:--:|---|
| Zaal - WIP Meetup (ecosystem tour, ZAO Fractals) | Jun 11 | x | x | x |  | runs today - capture the recording |
| Cassie (Quilibrium) - Farcaster protocol build-along | Jun 12 | x | x | x |  | confirm + capture |
| Adam Miller (MiDAO) - talking miDAO | Jun 12, 5:45pm | x | x | x |  | Luma live (l1c6sgzc); capture recording |
| Kenny (POIDH) - POIDH + ZABAL ad bounty | Jun 15, 4pm | x | x | x |  | Luma live (9ylnwvyx); capture recording |
| Adrian / diviflyy (Empire Builder) - Empire Builder V3 convo | Jun 16, 12pm | x | x |  |  | **Luma copy ready** (#3) |
| Dr. Jake - Growth through foundations | Jun 16, 6pm | x | x |  |  | **Luma copy ready** (#4) |
| Jub Jub - Farcaster Batches fireside (Space) | Jun 20, 8am | x | x |  |  | **Luma copy ready** (#5) |
| Dan Singjoy (Eden Fractal) - fractal ecosystem + history | Jun 20, 12pm | x | x |  |  | **Luma copy ready** (#6); prep: dan-singjoy-fractal-prep |
| Adrienne (GM Farcaster) - Warpee.eth AI agent | Jun 30, 11:30am | x | x |  |  | **Luma copy ready** (#7) |

---

## C. Confirmed - needs a date

In `workshop-leads.json` as confirmed, no date locked. Send the Cal link to lock, then
publish a Luma and they move to section B. DM copy: `docs/warm-dm-kit-2026-06-02.md` (A).

| Guest | Track | Topic | Action |
|---|---|---|---|
| Tyler Stambaugh (Magnetiq) | builder | Magnetiq, the workshop library platform | "any day in June" - send Cal link to lock |
| Thy Revolution (The ZAO) | TBD | 2 sessions, topics TBD | needs topics + dates + track |
| Duo Do (@duodomusica) | artist | Musician on Farcaster, road to Farcon | lock a date (was first week of June) |
| Jonathan Colton (FounderCheck) | creator | FounderCheck + propagating work on Farcaster (2 talks) | lock dates |
| kmac.eth | builder | Farcaster Snaps, building + shipping | lock a date |
| Plat0x (@at0x_eth) | builder | His own Bonfire builder session, building on the graph | lock date + Luma |

---

## D. Lined up / invited / prospects

Not yet in `workshop-leads.json`. Confirm topic, track, and date before they move up.
DM copy: `docs/warm-dm-kit-2026-06-02.md` (B).

**Lined up (mentioned, details TBD):** candytoybox - hurric4n3ike (Ikechi, WaveWarZ/distribution) -
The Dude - saltoriuous (Sagittarius?) - nickysap _(Kenny now dated, see section B)_

**Prospects (want to invite):** Arthur (Neynar, Base/EVM) - Sam (WaveWarZ-Base, agentic) -
DCoopOfficial (Coop Records, music/label) - Riley Beans

---

## E. BCZ YapZ archive (separate show, already a data stream)

Zaal's long-form interview show. A distinct production from ZABAL Gamez workshops, but a
guest pool overlap is a recruiting signal (yerbearserker, diviflyy, saltoriuous, Kenny all
appear in both). These are **delivered with YouTube + transcript already** - they pull into
the timeline + Bonfire automatically (`data/streams/bcz-yapz/`). No media-pipeline work owed.

Recent episodes (newest first): Erik + Jonathan (Fotocaster) - Kenny (POIDH) -
Andy Minton (Hangry Animals) - Dish (Clanker) - Hannah (Farm Drop) - Nikoline (Hubs Network) -
Jordan (Ryft) - Ali (Inflynce) - Roaring Sensei - Saltorious (Among Traitors) -
GIU (Pinetree) - SNAX (Pizza DAO) - Diviflyy - Yerbearserker - Sven (Incented) -
Daya (Flix.Fun) - Rock Opera - Yoni Dubz - Rich Bartuc - Deepa. (Full list + links in
`data/streams/timeline.json`.)

**Farcaster Batches** (GM Farcaster-hosted, Jun 1-5): we only add summaries + transcripts;
Days 1, 2, 3, 5 transcripts are captured. GM Farcaster owns the videos.

---

## Cross-cutting gaps / next actions

1. **Stage 4 (OK'd) is not tracked anywhere** - we have no record of guests signing off on
   their cut/page. Start logging it (a date + "guest confirmed" note) when you share the
   unlisted YouTube link, per the recordings workflow.
2. **Two recaps are placeholders** - Joseph Goats (06) and Will T (07): process the
   recordings (transcript -> thumbnail -> YouTube), then fill the real recap.
3. **Thumbnails missing** for Ohnahji (04), Sopha (05), fireside (F1), ZAO Fractal (Z1) -
   make Canva thumbnails for the ones that warrant one (04, 05 first).
4. **Four upcoming sessions need a Luma event** - Adam Miller, Dr. Jake, Jub Jub, Adrienne.
5. **YouTube cuts owed** - Sopha (05), and decide on the fireside (F1) and ZAO Fractal (Z1).
6. **Lock dates** for the seven confirmed-but-undated guests in section C so the June slate
   keeps filling past the current 8-plus delivered.
</content>
</invoke>

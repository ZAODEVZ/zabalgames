# ZABAL Gamez Season 1 - 3-Month Prep Roadmap

> Date: 2026-06-01. The master plan for June (workshops) -> July (open build) -> August
> (Finals). Sequences every prep task, splits OWNER actions from BUILDABLE (repo) work, and
> points at the real artifacts. Living doc - update as items land. Trust CLAUDE.md + llms.txt
> over this where they differ.

Legend: `[OWNER]` = Zaal/team does it (DMs, dates, assets, dashboards). `[BUILD]` = a repo
change Claude can make. `[x]` done, `[ ]` open.

---

## Phase shape (locked)

- **Month 1 - June: WORKSHOPS.** Low-friction learning. First half = one-off workshop talks;
  second half = panels/AMAs. Pre-record-then-live-Q&A default; clipped to ~15s pieces.
- **Month 2 - July: OPEN BUILD.** Anyone ships a build for ZABAL/ZAO/WaveWarZ. GitHub-auth
  judging, rolling admission, built in public. Plus the knowledge game (reports -> graph,
  scored by citation).
- **Month 3 - August: FINALS.** Top-curated builds become WaveWarZ-Base battle entries;
  wallets trade on outcomes; settles on-chain at T+72h. Streamer stream-a-thon for distribution.

---

## NOW (launch week - June 1)

- [x] [BUILD] Launch thread final, brand-clean, in docs/announce-thread-final.md.
- [x] [BUILD] Day 0 session nudges (yerbearserker + Plat0x) in docs/day0-session-nudges-2026-06-01.md.
- [x] [BUILD] Site accuracy: Hats -> Magnetiq collectible, $500 secured, projects at 46.
- [ ] [OWNER] Post the launch thread via Firefly; pin post 1 on both profiles.
- [ ] [OWNER] Cal.com booking questions on cal.com/zabal-gamez/workshop-session.
- [ ] [OWNER] Fix the Magnetiq magnet logo (png says "ZABAL" not "ZABAL Gamez"); send Tyler
  the real logo (Samantha, 3 ratios).
- [ ] [OWNER] Enable Vercel Web Analytics (tag already on every page).

---

## MONTH 1 - JUNE (workshops)

### Lock the roster (highest ROI - attention is live now)
- [ ] [OWNER] Lock dates + make Luma events for the 7 undated confirmed leads: Tyler, Thy
  Revolution (x2), Adrian (@diviflyy), Duo Do (@duodomusica), Jonathan Colton (@jonathancolton),
  kmac.eth, Cassie (@cassie). Target ~8 sessions in the first half.
- [ ] [BUILD] As each date/Luma lands, move the lead to a dated card in data/workshop-leads.json
  (minutes each - send Claude the date + link).
- [ ] [OWNER] Send Duo Do the Rose/Thorn/Bud concept (WhatsApp) - they are "first week of June".
- [ ] [OWNER] Official DM invite to Ven (The Open Machine) for a June slot; if yes, add as lead #011.

### Second-half panels
- [ ] [OWNER] Confirm 2-3 panel/AMA topics + participants for the back half of June.
- [ ] [BUILD] Panel entries render in the schedule once dated (same workshop-leads.json flow).

### Recording + library
- [ ] [OWNER] Confirm where recorded talks live (Magnetiq portal is the library; interim YouTube?).
- [x] [BUILD] Public talk library - shipped as `/recordings` (typed hub: workshops,
  firesides, BCZ workshops) + per-session pages + a machine-readable `/recordings/index.json`.
  No separate `/library` surface needed.

### Promo flywheel
- [ ] [OWNER] Per-session nudge casts (pattern in day0-session-nudges); Claude drafts each on request.
- [ ] [OWNER] Post the POIDH best-ad bounty (ends Jun 14); winner becomes pinned promo.

---

## MONTH 2 - JULY (open build)

### The judging rail (project #45)
- [ ] [OWNER/handoff] Build the register server (wallet -> repo map + one endpoint the skill
  file calls) and the commit-to-Bonfire cron. Send to Plat0x.
- [ ] [DECISION] Bonfires dependency fallback - judging + graph are Bonfires-owned. Decide a
  fallback before the whole submission flow depends on it.
- [x] [BUILD] A builder-facing "how to enter July" page or llms.txt section: signup = wallet/
  Farcaster + GitHub auth, push via the skill file, rolling admission. DONE - `enter.html`
  (form wired to `/api/register`, "how to enter" + "what happens after") now discoverable
  site-wide: linked from the homepage Builder card and the Season footer column on all 27 pages.

### The knowledge game (project #46)
- [ ] [BUILD] llms.txt of all ZAO brand assets shipped by July 1 (the existing llms.txt is most
  of it - confirm scope per docs/july-knowledge-game-2026-07-01.md).
- [ ] [DECISION] Lock the knowledge-game [TBD]s: scoring mechanic, cron-ingests-reports,
  reward coupling, anti-gaming (see the scaffold doc).
- [ ] [BUILD] The citation-counter / standings JSON once the scoring mechanic is locked.
- [ ] [OWNER] July 1 "knowledge game is live" announcement cast (Claude drafts on request).

### Submission surface
- [ ] [BUILD] Confirm the July submission flow on /info (Supabase gallery is client-side,
  placeholder keys, NOT live per CLAUDE.md) - decide DB and wire when the team has a slot.
- [x] [BUILD] A live "July builds" board - `/enter` now shows a "Building in public" board
  reading the register store via `GET /api/builds` (no DB decision needed). A richer
  DB-backed gallery (with the submission profile fields) is still a separate decision.

### Empire Builder surface (project, Rail C)
- [ ] [OWNER] Build the tokenless-empire-deployer button on the small-games site (Adrian's rail).

---

## MONTH 3 - AUGUST (Finals)

### Finals mechanic (spec: docs/research/720-wavewarz-finals-mechanic.md)
- [ ] [DECISION] Lock the Respect-weight in settlement (Sam + Arthur with the WaveWarZ-Base
  contracts) before Finals.
- [ ] [BUILD] finals.html - currently a real page; flesh out the bracket/entry view once the
  finalist set + WaveWarZ-Base contract addresses exist.
- [~] [BUILD] finals/live.html - now data-driven: the finalist roster renders from
  `data/finals.json` (placeholders stand until finalists are locked). Still TODO: the live
  WaveWarZ-Base market/trade view + settlement readout, blocked on the contract addresses.
- [x] [BUILD] winners.html - now data-driven off `data/finals.json` (champions, finishers
  4-8, ranks 9-16). The "Awaiting Finals" placeholders are the no-JS fallback; the finalist
  set is a data drop (`status:settled` + ranks) once the Finals settle.

### Distribution
- [ ] [OWNER] Line up the streamer stream-a-thon for the Finals (Month 3 distribution play).
- [ ] [BUILD] Commemorative collectible surface (Magnetiq) reference - confirm the finisher
  collectible flow is reflected on /finals.

---

## CROSS-CUTTING (any time)

- [ ] [OWNER] JFS-signer ask: kmac -> Neynar, could soften signer-on-all-snap-actions friction.
- [ ] [OWNER] Magnetiq API/widgets ("magnetiq bridge") - Tyler's roadmap; research Flow/EVM.
- [ ] [BUILD] Keep data/adoptable-projects.json current as repos ship/get claimed (claimed_by).
- [ ] [BUILD] Keep the brand-by-brand report surface (knowledge-game doc) pruned with the team.
- [ ] [OWNER] Workshop roster doc (docs/workshop-roster.md) kept in sync with workshop-leads.json.

---

## What "ready" means per phase

- **June ready:** ~8 dated sessions live on the schedule, each with a Luma + a nudge cast; the
  POIDH bounty posted; recordings have a home.
- **July ready:** the judge + register server live; llms.txt asset shipped Jul 1; knowledge-game
  scoring locked; a submission surface that accepts builds; the knowledge-game announce posted.
- **August ready:** finalist set chosen; WaveWarZ-Base contracts wired into finals.html +
  finals/live.html; winners.html built; Respect-weight locked; stream-a-thon lined up.

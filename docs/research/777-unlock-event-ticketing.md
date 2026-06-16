---
topic: builds
type: build-brief
status: ready-to-build
last-validated: 2026-06-16
related-docs: 701, 776, 750
original-query: "can we run an unlock for each of the future events"
tier: STANDARD
---

# 777 - Unlock per-event ticketing for ZABAL Gamez

> **Goal:** Run an Unlock Protocol event for each ZABAL Gamez session. Each attendee gets
> a free NFT ticket (a Key on a per-event Lock, on Base) that serves three purposes:
> proof of attendance, a July build-eligibility signal, and supporting proof you can point
> to for your own build (you showed up, you learned, you shipped).
> Two paths in this doc: Path A is a no-code runbook to do now; Path B is a build brief
> for the ZAO OS to automate it.

> **Status:** ready-to-build. Path A is actionable today. Path B's one open dependency is
> confirming the Unlock deployer + unlock-js details on Base (see Open questions).

## Why

ZABAL Gamez sessions already RSVP through Luma. Adding an Unlock event per session gives
attendees an on-chain credential that outlives the call: a free NFT ticket that proves
attendance, signals July build eligibility, and can be pointed to as supporting evidence
for a builder's own work. It complements, not replaces:
- **Luma** stays the calendar + reminders.
- **Magnetiq** (`collect.zabalgamez.com`) stays the SEASON collectible / registration.
- **Unlock** is the new PER-SESSION attendance layer, on Base, composable with the ZAO stack.

## What the ticket does (locked)

1. **Proof of attendance** - a keepsake credential that you were in the room.
2. **July eligibility signal** - attendance counts toward July build standing.
3. **Build support** - holders can cite their tickets as proof of participation/learning
   behind their build.

## Decisions (locked)

- **Free** events (key price 0).
- **Base** (chainId 8453) - matches the ZAO stack.
- **RSVP on**; attendee screening optional per event.
- **Non-expiring keys** (proof of attendance should not lapse).
- **One Lock per event** (per-session granularity). A single season membership stays
  Magnetiq's job.
- Brand the event page with ZAO/ZABAL (arcade logo, palette).

## How Unlock works (accurate, verify specifics in the docs)

- A **Lock** is a membership-NFT (ERC-721) contract; a **Key** is the NFT a member holds.
- **Unlock Events** ([app.unlock-protocol.com/event](https://app.unlock-protocol.com/event))
  deploys a Lock for you, runs a free RSVP flow (name/email + optional wallet), optional
  approve/deny screening, issues a QR-code ticket, and supports check-in and airdrops.
- Free events support RSVP; organizers can airdrop keys to approved attendees.
- Gating elsewhere (e.g. a recording on our site) = checking Key ownership of that Lock
  for the connected Farcaster verified wallet.
- Docs: https://docs.unlock-protocol.com . Guide: https://unlock-protocol.com/guides/how-to-sell-nft-tickets-for-an-event/ . Org repos: https://github.com/orgs/unlock-protocol/repositories .

---

## Path A - no-code runbook (do now)

For each upcoming session, create an Unlock event:

1. Go to [app.unlock-protocol.com/event](https://app.unlock-protocol.com/event), connect the
   ZAO/BCZ wallet, choose **Create Event**.
2. **Network: Base.** **Price: Free.** Capacity: leave open or set a cap.
3. Name it with the convention `ZABAL Gamez - <Presenter> - <short topic>`; add the date/time
   (EST), the description (reuse the Luma copy), and the ZABAL Gamez brand image.
4. Turn on **RSVP**; toggle **attendee screening** only if you want to approve manually.
5. Keys **non-expiring**. Publish.
6. Run **check-in** with the QR scanner during/after the session; airdrop keys to anyone who
   attended but did not RSVP on-chain.
7. **Paste the event URL + Lock address back here** (or to me) so we wire `unlock_url` into
   the schedule next to `luma_url`.

### Per-event checklist (upcoming)

| Session | Date / time | Luma | Unlock event URL | Lock address |
| --- | --- | --- | --- | --- |
| AZKAL - FlowStage | Thu Jun 18, 8pm EST | https://luma.com/r1148jip | (add) | (add) |
| Jub Jub - Farcaster Batches | Sat Jun 20, 8am EST | https://luma.com/c621slze | (add) | (add) |
| Ali Tiknazoglu - Previbecoding | Sat Jun 20, 11am EST | https://luma.com/nlgib8tl | (add) | (add) |
| Dan Singjoy - Eden Fractal | Sat Jun 20, 12pm EST | https://luma.com/tmcmw3o9 | (add) | (add) |
| Meta Mu - community value | Sun Jun 21, 6pm EST | https://luma.com/pwd2ta47 | (add) | (add) |

### Site wiring (once URLs exist)
- Add an optional `unlock_url` field to `data/workshop-leads.json` entries (next to
  `luma_url`); surface a "Get the ticket" button on the schedule + recording pages.
- Gate a recording or perk by checking Lock ownership for the viewer's Farcaster wallet.

---

## Path B - programmatic build brief (ZAO OS)

Build a small repo that deploys and manages the per-event Locks automatically and wires
attendance into the ZAO stack.

### Mission
For each ZABAL Gamez session, deploy a free non-expiring Lock on Base via
`@unlock-protocol/unlock-js`, mint/airdrop Keys to attendees (resolved from RSVP +
check-in), store lock addresses against each event, and expose:
- a ticket / "Get the ticket" surface,
- attendance verification (does wallet hold the Key),
- an aggregate "July eligibility" view (which builders hold N session tickets).

### Tech stack (defaults)
- Next.js 16 (App Router, Turbopack) + Tailwind v4 + Farcaster mini-app SDK
- Onchain: Base (8453), viem + wagmi, `@unlock-protocol/unlock-js`
- Identity: Neynar (Farcaster verified addresses). No custom auth.
- Backend: Supabase (events, locks, attendance) + Next.js API routes

### MVP
1. Deploy a free, non-expiring Lock on Base from an event config (name, date, capacity).
2. Airdrop / grant Keys to a list of attendee wallets (from RSVP + check-in).
3. Verify endpoint: given a wallet, return which session Locks it holds.
4. Read source events from `data/workshop-leads.json` and write back the lock address.

### Stretch
- Auto-create the Unlock event from a new confirmed lead.
- July eligibility board: rank builders by sessions attended; feed standing to Empire Builder.
- Gate the recordings on zabalgamez.com by Key ownership.

### Brand rules (hard)
- No emojis, no em dashes (hyphens), no decorative Unicode. No crypto/web3 jargon in
  user-facing copy. Exact ZAO naming. ZAO palette + Syne/Outfit/JetBrains Mono.

### Deliverables (ZABAL Gamez submission bar, T+24h)
Live Vercel URL; public MIT repo with README + .env.example (deployer key flow, Base RPC,
unlock-js usage); 60-second demo; ship cast on /zabal tagging @bettercallzaal; show-your-work
mode running.

### Open questions
1. Confirm Unlock's deployer + `unlock-js` Lock-creation flow on Base, and the wallet/key
   used to deploy + airdrop (a deployer EOA).
2. RSVP/attendee data source - pull from Unlock Events, or run RSVP ourselves?
3. Gating UX - mini app checkout vs. simple ownership check.

### Ready-to-run kickoff prompt (terminal)

```
Build a new repo: Unlock per-event ticketing for ZABAL Gamez and the ZAO.

STEP 0 - load context first:
- Install the ZABAL Gamez skill and read it:
  mkdir -p .claude/skills/zabal-games && curl -o .claude/skills/zabal-games/SKILL.md https://raw.githubusercontent.com/ZAODEVZ/zabalgames/main/.claude/skills/zabal-games/SKILL.md
  Then read https://zabalgamez.com/llms.txt
- Read the full brief and follow it:
  https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/777-unlock-event-ticketing.md
- Read the Unlock docs https://docs.unlock-protocol.com and the org repos
  https://github.com/orgs/unlock-protocol/repositories (use @unlock-protocol/unlock-js).

MISSION
For each ZABAL Gamez session, deploy a FREE, non-expiring Lock on Base via unlock-js, grant
Keys (NFT tickets) to attendees, store the lock address against each event, and expose a
ticket surface, an attendance-verification endpoint, and a July-eligibility view. The ticket
is proof of attendance, a July eligibility signal, and supporting proof for a builder's work.

MVP
1. Deploy a free non-expiring Lock on Base from an event config (name, date, capacity).
2. Grant / airdrop Keys to a list of attendee wallets.
3. Verify endpoint: given a wallet, return which session Locks it holds.
4. Read events from zabalgamez.com workshop schedule; write back the lock address.

TECH: Next.js 16 + Tailwind v4 + Farcaster mini-app SDK; Base (8453) + viem/wagmi +
@unlock-protocol/unlock-js; Neynar for identity (no custom auth); Supabase + API routes.

BRAND (hard): no emojis, no em dashes (hyphens), no decorative Unicode; no crypto/web3 jargon
in user-facing copy; exact ZAO naming; ZAO palette + Syne/Outfit/JetBrains Mono.

DELIVERABLES by T+24h: live Vercel URL; public MIT repo with README + .env.example; 60-second
demo; ship cast on /zabal tagging @bettercallzaal; show-your-work mode running.

FIRST STEPS
1. Confirm Unlock deployer + unlock-js Lock-creation on Base, and the deployer wallet, with me.
2. Scaffold Next.js + Supabase schema (events, locks, attendance).
3. Deploy ONE Lock end to end and grant a Key before adding breadth.
Ask any blocking questions (deployer wallet, RSVP data source) before building past scaffold.
```

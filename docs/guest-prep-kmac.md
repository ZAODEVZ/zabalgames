# kmac.eth session prep - Farcaster Snaps

**When:** June, date TBD (confirmed; send the Cal link to lock).
**Guest:** kmac.eth (handle to confirm - see note). Builder track.
**Format:** 30-minute session, livestreamed and recorded.
**Ask:** building and shipping interactive Snaps - what a Snap is, how to make one, and how to
ship it so people actually tap it.

This doc is the background + a suggested running order, grounded in the repo's own Snap work
(`docs/snap-design.md` - the ZABAL Gamez Snap that already shipped). kmac.eth is already in the
Snap orbit: per the snap-design doc, kmac.eth and Zaal have a collab on an "Empire daily stats"
Snap template via zlank, so this session is a natural fit. Facts sourced below; flag anything
kmac wants to correct on the call.

> Handle note: `workshop-leads.json` lists `@kmac.eth`; `people.json` lists `@kmaceth`. Confirm
> the exact Farcaster handle before putting it on air or in a cast. No public web profile was
> indexed (Farcaster-native), so do not invent links.

---

## What a Snap is (the one-paragraph version)

A Snap is Farcaster's in-cast interactive primitive: a small app that renders inside a cast, so
a viewer can act (vote, sign up, mint, page through content) in one tap without leaving the feed.
Technically it is a GET-then-POST loop - the initial GET returns an image plus buttons, and each
tap is a POST that returns the next state with new buttons or images. Auth is JFS (JSON Farcaster
Signature), verified server-side. The ZAO/zlank ecosystem calls these "Snaps"; the broader
Farcaster term is Frames / Mini Apps. (SDK seen in the repo: `@farcaster/snap`, with `parseRequest`
for JFS verification.)

## The two build paths (the spine of the session)

This is the most useful frame for the room - one path per skill level, both ours.

| | zlank no-code | Custom SDK |
|---|---|---|
| Time to ship | ~10 minutes | ~2-3 hours |
| Skill | Drag-drop in the browser | TypeScript + the Snap SDK |
| Hosted at | `zlank.online/s/[uuid]` (7-day free expiry) | your own domain / edge function (permanent) |
| Branding | zlank footer auto-appended | fully your own |
| Best for | ship today | a sustained, polished version |

- **zlank** (zlank.online) is the ZAO no-code Snap builder: 14 block types, polls, multi-page,
  Linktree-style drag-drop. Sign in with Farcaster, build the blocks, publish, paste the URL into
  a cast and it renders inline. (This is what ZABAL Gamez used for its launch signup Snap.)
- **The custom path** is a small edge function that returns the Snap spec on GET and handles
  JFS-signed POSTs (about 80 lines). Reuses `@farcaster/snap`. This is the route when you need
  your own backend, your own branding, and permanence.

## A worked example the room already has (the ZABAL Gamez signup Snap)

kmac can point at a real, shipped Snap as the live reference. The ZABAL Gamez "are you in?" Snap:
- Initial GET: a share-card image + 4 role buttons (Builder, Workshop Lead, Audience, Mentor).
- Each tap POSTs, writes `{fid, role, source}` to the backend (one row per person+role; re-taps
  update the timestamp via upsert), and returns a confirmation state with "Open full site" and
  "Join /zabal" buttons.
- Spam defense, simplest layer: JFS verification (built into `parseRequest`) + per-FID upsert.
(Full design: `docs/snap-design.md`. The live endpoint shipped as `api/snap/signup.mjs`.)

## Suggested running order (30 min, clip-friendly)

1. **What a Snap is + why it converts** (~5 min) - in-cast action beats a link out; the GET/POST
   loop in one diagram.
2. **Path 1: build a Snap live in zlank** (~10 min) - drag-drop a poll/multi-page Snap, publish,
   drop it in a cast, watch it render. The "anyone can ship one today" beat.
3. **Path 2: the custom SDK version** (~8 min) - the GET spec + the JFS-verified POST handler,
   using the ZABAL Gamez signup Snap as the reference. When you graduate from no-code to code.
4. **Shipping it so it gets tapped** (~5 min) - embedding in a cast on a channel, the image as
   the hook, one clear first action, attribution via the cast hash.
5. **Q and A** (~2 min+) - ideas for the room's own July builds (e.g. an "Empire daily stats"
   Snap template, the kmac x Zaal collab already in flight).

## Ideas to seed for the room's July builds

- An "Empire daily stats" Snap (the kmac x Zaal collab) - one-tap "today's stats" cast.
- A "RSVP to today's workshop" Snap driven by the Lu.ma calendar.
- A POIDH bounty leaderboard Snap.
(All three are noted as in-flight or planned in `docs/snap-design.md`.)

## Open items / to confirm with kmac

- **Lock the date** (send the Cal link).
- **Confirm the handle** (`@kmac.eth` vs `@kmaceth` - see note above).
- **Which Snap does he build live?** zlank only, or zlank + a peek at custom code.
- **SDK version** - the repo references `@farcaster/snap` v2.0.3; confirm the current version he
  recommends, in case the API moved.

---

## Sources

- Primary (this repo): `docs/snap-design.md` - what a Snap is, the @farcaster/snap SDK + JFS, the two build paths, zlank, the kmac x Zaal "Empire daily stats" collab, the shipped ZABAL Gamez signup Snap - [FULL]
- `data/workshop-leads.json` (id 009 - topic, format, status) and `data/people.json` (handle) - [FULL, handle discrepancy flagged]
- General Farcaster Frames/Snaps background (for terminology): [awesome-frames](https://github.com/davidfurlong/awesome-frames), [QuickNode Frames guide](https://www.quicknode.com/guides/social/how-to-build-a-farcaster-frame) - [PARTIAL - ecosystem context, not kmac-specific]
- kmac.eth - no public web profile indexed (Farcaster-native); confirm handle + any Snap tool link directly with him - [FAILED - WebSearch returned no kmac-specific result]

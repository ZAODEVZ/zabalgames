# ZABAL Gamez Snap - Design + Build Plan

> A Farcaster Snap that lives inside a cast: a viewer signs up to ZABAL Gamez in one tap, never leaving the feed. Higher conversion than the website form. Goes in the launch cast on `/zabal`.

> **SUPERSEDED (storage + filename).** This is a point-in-time design doc. What
> actually shipped is `api/snap/signup.mjs` (an `.mjs` edge function, not the
> `api/snap/signup.ts` named below), and the signup backend is the **Formspree**
> team form, not Supabase. The repo's activity backend is Upstash Redis (see
> `CLAUDE.md` + `api/README.md`); it is NOT on Supabase. Ignore the Supabase
> wiring steps and `createClient` snippets below - they describe a path that was
> not taken. Kept for the Snap protocol / UX design notes only.

## Research synthesis (what we know)

- **What a Snap is:** Farcaster's in-cast interactive primitive. SDK: `@farcaster/snap v2.0.3`. JFS auth via `parseRequest`. Snaps are GET-then-POST-loops; each tap is a POST that returns the next state with new buttons / images.
- **The no-code builder exists:** `zlank.online` (ZAO ecosystem, ours - Zaal owns the repo at `bettercallzaal/zlank`, Doc 505 + 527). 14 block types, polls, multi-page, Linktree-style drag-drop. Snaps live at `/s/[uuid]` with 7-day free expiry on the free tier.
- **The custom path:** A small Vercel serverless function in this repo (`api/snap/signup.ts`) that returns the GET meta + handles POST buttons. ~80 lines of TypeScript. Reuses the `@farcaster/snap` SDK.
- **Other ZAO Snaps in flight:** Doc 654 - kmac.eth + Zaal collab on an "Empire daily stats" Snap template via zlank. POIDH bounty leaderboard Snap.

## The two paths

| | Zlank no-code | Custom in-repo |
|---|---|---|
| Time to ship | 10 minutes | 2-3 hours |
| Skill required | Drag-drop in browser | TypeScript + Snap SDK |
| Hosted at | `zlank.online/s/[uuid]` (7-day free expiry) | `zabalgamez.com/api/snap/signup` (forever, ours) |
| Branding | Zlank footer auto-appended | Fully branded ZABAL Gamez |
| Backend | Zlank's Redis (KV votes) | Our Supabase or Formspree |
| Best for | Launch THIS WEEK | Sustained polished version |

**Recommendation:** Ship the zlank no-code Snap **today** for the launch. Build the custom version **next week** once Supabase + Lu.ma are wired (so the custom Snap can write to the real backend + show real workshop slots).

## The Snap: "Are you in?"

One Snap, four-question flow. Anyone who sees the launch cast can self-sort in one tap.

### Initial state (GET)

```
[Image: ZABAL GAMEZ share card]
Headline:   ZABAL Gamez Season 1 - are you in?
Subhead:    Pick your role. Takes 5 seconds.

Buttons (4):
  [Builder - July ship]
  [Workshop Lead - June teach]
  [Audience - RSVP to sessions]
  [Mentor - August embed]
```

### After each button tap (POST)

```
[Image: confirmation card with their role highlighted]
Headline:   You're in - role: <ROLE>.
Subhead:    Next: <role-specific CTA>

Buttons (2):
  [Open full site]   -> open_url zabalgamez.com
  [Join /zabal]      -> open_url farcaster.xyz/~/channel/zabal
```

Role-specific CTA copy:

- **Builder:** "July open build-a-thon. We will DM you the context file + the adoptable-project list before July 1."
- **Workshop Lead:** "Pick your June slot. We will DM you to lock the date + record the session."
- **Audience:** "We will DM you the workshop calendar as it fills. RSVP per session via Lu.ma."
- **Mentor:** "August Finals. We will DM you about embedded-teammate pairing once the cohort lands."

### Backend write

Each POST writes: `{fid, role, timestamp, source: "snap-signup"}` to a backend table. Used to:
1. Send the role-specific follow-up DM (manual at first, automated later via ZOE).
2. Show real "live signup count" on zabalgamez.com (`fetch('/api/snap/signups/count')`).
3. Build the cohort lists for each phase.

For zlank version: writes go to zlank's Redis (HINCRBY pattern per Doc 527). Export weekly to our Supabase.

For custom version: writes go straight to our Supabase `zabalgames_snap_signups` table (schema below).

---

## Path A - Zlank no-code (ship today)

**Steps Zaal takes** (you, in browser, 10 min):

1. Go to **zlank.online**, sign in with Farcaster.
2. Click "Create Snap." Pick the **Poll** template (closest to our 4-button flow).
3. Build the blocks in order:
   - **Image block:** upload the ZABAL Gamez share card (assets/og-card.svg in this repo, or convert to PNG first).
   - **Headline block:** `ZABAL Gamez Season 1 - are you in?`
   - **Text block:** `Pick your role. Takes 5 seconds.`
   - **Poll block** with 4 options:
     - Builder - July ship
     - Workshop Lead - June teach
     - Audience - RSVP to sessions
     - Mentor - August embed
   - **Confirmation page block:** "You're in. Check your DMs for next steps."
   - **Link button:** `Open the full site -> https://zabalgamez.com`
   - **Link button:** `Join /zabal -> https://farcaster.xyz/~/channel/zabal`
4. Publish. Copy the `zlank.online/s/[uuid]` URL.
5. Paste it into the launch cast on `/zabal` (the Snap auto-renders inline).
6. The 7-day free expiry resets when the Snap gets traffic; or upgrade to keep it permanent.

**Expected outcome:** the launch cast carries an interactive Snap. Viewers tap a role, the count is captured in zlank's Redis, Zaal sees the tally in zlank's dashboard.

## Path B - Custom in-repo (build next week, polished)

Add a Vercel serverless function to this repo. The function returns the snap-spec JSON on GET and handles JFS-signed POSTs.

### Files to add

```
api/
  snap/
    signup/
      route.ts           # GET + POST handler, ~80 lines
    image.ts             # dynamic OG image generator for the confirmation page
db/
  snap-signups.sql       # Supabase table
package.json             # add @farcaster/snap, @neynar/nodejs-sdk
vercel.json              # node runtime + function config
```

### Snap signup table

```sql
create table zabalgames_snap_signups (
  id              bigserial primary key,
  fid             bigint        not null,
  role            text          not null check (role in ('builder','workshop_lead','audience','mentor')),
  source          text          not null default 'snap-signup',
  custody_address text,
  primary_address text,
  cast_hash       text,         -- the cast the Snap was tapped in (for attribution)
  metadata        jsonb         default '{}',
  created_at      timestamptz   not null default now(),
  unique (fid, role)            -- one row per (person, role); re-taps update timestamp
);

create index on zabalgames_snap_signups (role);
create index on zabalgames_snap_signups (created_at desc);
```

### Handler sketch

```ts
// api/snap/signup/route.ts
import { parseRequest } from '@farcaster/snap';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);

export async function GET() {
  return new Response(JSON.stringify(snapInitial()), {
    headers: { 'content-type': 'application/json' }
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = await parseRequest(body); // JFS verify
  const { fid } = parsed.message;
  const role = mapButtonIndexToRole(body.untrustedData.buttonIndex);

  await supabase.from('zabalgames_snap_signups').upsert(
    { fid, role, cast_hash: body.untrustedData.castId?.hash },
    { onConflict: 'fid,role' }
  );

  return new Response(JSON.stringify(snapConfirmation(role)), {
    headers: { 'content-type': 'application/json' }
  });
}

function snapInitial() {
  return {
    image: 'https://zabalgamez.com/assets/og-card.png',
    buttons: [
      { label: 'Builder - July ship' },
      { label: 'Workshop Lead - June teach' },
      { label: 'Audience - RSVP' },
      { label: 'Mentor - August embed' },
    ],
    post_url: 'https://zabalgamez.com/api/snap/signup',
  };
}

function snapConfirmation(role: string) {
  const cta = {
    builder: 'July open build-a-thon. DM you the context + adoptable projects before July 1.',
    workshop_lead: 'Pick your June slot. DM you to lock the date + record the session.',
    audience: 'RSVP per session via Lu.ma once the calendar fills.',
    mentor: 'August Finals. DM you about embedded-teammate pairing once the cohort lands.',
  }[role];

  return {
    image: `https://zabalgamez.com/api/snap/image?role=${role}`,
    buttons: [
      { label: 'Open full site', action: 'open_url', target: 'https://zabalgamez.com' },
      { label: 'Join /zabal',    action: 'open_url', target: 'https://farcaster.xyz/~/channel/zabal' },
    ],
  };
}
```

### Dependencies + ops

- `@farcaster/snap` v2.0.3 - the Snap SDK with `parseRequest` for JFS verification.
- `@supabase/supabase-js` - backend writes.
- Vercel env vars: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`.
- Add `package.json` + minimal Node build (Vercel auto-detects).

### Spam defense (6-layer pattern from Doc 505)

For v1, the simplest layer is enough:
1. JFS signature verification (built into `parseRequest`).
2. Per-FID upsert (one tap counts; spam taps update timestamp, not duplicate rows).
3. (Future) hCaptcha challenge if rate-limit triggers.

## Launch integration

The Snap is embedded in the **launch cast on `/zabal` this weekend**. Update the launch kit:

- In `docs/launch-kit.md`, the Farcaster main cast becomes: `[short text] + [Snap URL]`. Snap renders inline; the text frames it.
- In the X / Telegram / newsletter versions, link to the Snap explicitly (Snaps do not render outside Farcaster - link drops users to a fallback web view).

Once the Snap is live (either path), I update the launch kit + the site so the Snap is the primary CTA.

## Recommendation

| When | What | Owner |
|------|------|-------|
| **Today (launch)** | Build the zlank Snap (Path A, 10 min). Use it in this weekend's launch cast. | Zaal (drag-drop in zlank) |
| **Next week** | Build the custom Snap (Path B) once Supabase is up. Migrate the launch cast to point at the custom Snap. Keep the zlank version as a backup. | Me (code + push to this repo) |
| **June ongoing** | Add a second Snap - "RSVP to today's workshop" - driven by the Lu.ma calendar. | Me, once Lu.ma URL is set |

## Open questions

- **Should the Snap mint the Zabal connector NFT directly?** Per Doc 714 the connector is the entry mechanic. A Snap with a "Mint connector + sign up" button is the slickest entry flow - but requires the Magnetiq mint URL + a `tx` action in the Snap (more complex than `open_url`). Probably v2 of the Snap, after Magnetiq + connector are live.
- **Backend choice for v1:** zlank's Redis (free, ours, exists) vs Supabase (cleaner schema, ours, needs setup). zlank works now; Supabase wins long-term.
- **Should the Snap show live signup counts to viewers?** Adds social proof but needs the count rendered into the image - means dynamic OG image generation. Nice-to-have, not v1.

---

*Mirrored at github.com/ZAODEVZ/zabalgames/blob/main/docs/snap-design.md. Source docs: 505 (zlank spec), 527 (zlank next builds), 498 (unified SDK), 654 (Tyler call - Empire Builder + zlank templates).*

# Tyler (Magnetiq) - Notion Structure Consult Message

> Draft message to Tyler Stambaugh, workshop lead #001, founder of Magnetiq. Ask for input on Notion DB structure proposed in Doc 760 before we wire it up.

## Send via

Pick: Farcaster DM > Email. Farcaster is faster + matches the in-public build vibe. Email if Tyler prefers async + long-form.

## Version A: Farcaster DM (tight)

```
Hey Tyler -

Standing up a Notion command center for ZABAL Games so we can update the
site automatically from Notion. Workshops + people + announcements all
flow from Notion -> Vercel rebuild -> live in ~5 min.

Before I wire the DBs, want your input since Magnetiq is the workshop
library and you've thought about content structure more than anyone in
the ZAO orbit.

3 quick Qs:

1. Does my proposed 4-DB structure (Workshops / People / Announcements /
   FAQ) match how Magnetiq portal organizes workshop content? Or is
   there a different model I should mirror so the handoff is clean
   when your portal goes live?

2. Any SNAPS-framework signals (Status / Novelty / Access / Power /
   Stuff) we should track per workshop session in the DB so they
   carry over to Magnetiq automatically?

3. What does Magnetiq need from our side (fields, hooks, image specs)
   before the connector NFT mint flow ships with Workshop #001?

Full spec at zabalgames.com/docs/research/760-notion-cms-integration.md
- skim if you want, otherwise just react with thoughts.

No rush - we don't ship Notion integration until after launch
(post Jun 1). Plenty of time to align.

Zaal
```

## Version B: Email (more context)

Use if Tyler prefers email or wants the full picture before reacting.

**Subject:** ZABAL Games + Magnetiq - quick consult on Notion structure

```
Hey Tyler,

Quick consult ask - want your input before I wire up the Notion
command center for ZABAL Games.

CONTEXT

We're standing up Notion as the CMS for zabalgames.com - so any update
in Notion (new workshop, new mentor, new announcement) auto-flows to
the live site via Vercel rebuild webhook. 5-min latency from Notion
edit to site update. No more manual JSON edits.

Proposed structure (4 Notion databases):

1. WORKSHOP SESSIONS - per session: lead, status (confirmed / tentative
   / open), date, time, format (30-min / 45-min + Q&A / hands-on),
   topic, Lu.ma URL, Restream URL
2. PEOPLE - per person: handle, name, roles (organizer / mentor /
   workshop_lead / core_builder / sponsor / partner / builder), bio,
   headline, avatar URL, Farcaster URL, expertise label, what they
   offer (mentors), best fit for (mentors), audited date
3. ANNOUNCEMENTS / CHANGELOG - per entry: date, title, type (decision
   / feat / content / infra / fix), description, commit, links
4. FAQ - per Q: question, answer, category, order

Full spec at:
https://github.com/ZAODEVZ/zabalgames/blob/main/docs/research/760-notion-cms-integration.md

WHY I'M PINGING YOU

Magnetiq is the workshop library + the host platform for every Season 1
session. Your portal is going to consume some of this data when the
connector NFT mint ships with Workshop #001. Better to align the schema
NOW than refactor after launch.

You've thought more about content structure + retention signals than
anyone in the ZAO orbit. I want to mirror your model, not force you
into mine.

THREE QUESTIONS

1. Does the 4-DB structure match how Magnetiq organizes workshop
   content internally? If you have a different model that's worked
   for you, I'd rather mirror it than impose a new schema.

2. Any SNAPS-framework signals we should track per session (Status /
   Novelty / Access / Power / Stuff)? Those could become DB properties
   in the Workshop Sessions table so they carry over to Magnetiq
   automatically when content flows.

3. What does Magnetiq need from our side before the connector NFT mint
   ships with Workshop #001? Specific fields you'll consume? Image
   specs (aspect ratio, dimensions, alt text format)? Webhooks we
   should fire on session-published events?

NO RUSH

We don't ship Notion integration until after launch (after Jun 1 doors
open). Plenty of time to align. If you want to do a 15-min call to walk
through your Magnetiq model + see what mine looks like, that works.
Otherwise async reply works too.

If you'd rather just send me a screenshot of how Magnetiq organizes
its workshop content + the SNAPS signal tracking, that gets us 80% of
the way there.

Thanks,
Zaal

PS - workshop #001 (Magnetiq pitch) is locked. June date pending your
call on a weekday slot. Once you pick we'll spin the Lu.ma event +
publish.
```

## Version C: Bullet-only "kicker" (if Tyler is busy)

```
Tyler -

Standing up Notion as CMS for zabalgames.com. 4 DBs proposed
(Workshops / People / Announcements / FAQ).

Spec: zabalgames.com/docs/research/760-notion-cms-integration.md

Q: does this match how Magnetiq organizes its workshop content? If
   not, what's your model + can I mirror it?

Q: SNAPS signals to track per session in the DB?

Q: what fields does Magnetiq need from us before Workshop #001 mint?

No rush - integration ships post-launch. Reply async or grab 15 min.

Zaal
```

## After he replies

1. Update Doc 760 schema based on his input - mirror Magnetiq fields where they exist
2. If he shares his Notion template, fork/copy it
3. Add a "Coordinated with Tyler 2026-XX-XX" note in Doc 760 changelog
4. If alignment is tight, his approval = green light to wire up Notion integration
5. If misalignment is big, do a 15-min call before coding

## Why this matters (internal note)

The workshop content schema is the most strategic data structure in ZABAL Games:
- Magnetiq will host the actual videos + library
- Our site shows the calendar + RSVP
- Tyler's portal handles connector NFT mint + retention tracking
- Notion is the source of truth that feeds all three

Misalignment here = duplicate work, broken handoffs, builder confusion. Better to spend 30 min aligning now than 3 days reconciling after launch.

## Tyler's existing surface area in ZABAL Games

For reference if he asks "what's already locked":
- Workshop lead #001 confirmed 2026-05-22 (per data/workshop-leads.json)
- Topic locked: "Magnetiq - The Workshop Library Behind ZABAL Games" + SNAPS framework + Zabal connector NFT
- Format: 30-min pitch + 15-min Q&A
- When: any weekday in June, time TBD
- Magnetiq referenced on:
  - / main page: "Stay up to date - get the collectible" section ("The portal goes live with workshop lead #001 Tyler Stambaugh")
  - /info page: detailed workshop content
  - /about: Partner Platforms section
  - /p?handle=tylerstambaugh: full profile
  - docs/brand-context.md: "PORTAL + WORKSHOP LIBRARY - Magnetiq - Tyler Stambaugh"
  - docs/luma-events-templates-2026-05-26.md: Event 1 template ready to copy into Lu.ma
- Recommended: pick Version B (email) if he hasn't responded to recent Farcaster DMs; Version A if active on Farcaster

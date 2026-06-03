# Year of the ZABAL - content playbook

> The house rules for the daily content engine, distilled from running it live. The newsletter
> is the daily backbone; the on-site daily update mirrors it; socials are downstream and opt-in.
> Read this before writing a day. Companions: `daily-update-workflow.md` (the add-daily helper)
> and `socials-prompt-year-of-the-zabal.md` (the socials prompt).

## Locked decisions (do not relitigate)

- **Series name:** Year of the ZABAL. Not "Year of the ZAO" (that is the parent community). The
  sign-off stays "BetterCallZaal from the ZAO Team".
- **Day number:** the day-of-year, 1 to 365. Compute it from the date, do not guess. Jun 3 2026
  is Day 154 (2026 is not a leap year).
- **Mindful card:** the source of truth is the physical card pulled that morning (the photo). On
  the card, the large script line is the card title; the grey banner is the agreement. Day 154:
  card "Let your life be transformed", agreement "Don't Make Assumptions". Update
  `data/mindful.json` and the `mindful` field in `data/daily-updates.json` the same morning,
  before writing the newsletter, so the site and the email match.
- **Links:** recap links point to the recaps page (`/recaps`), never individual luma recordings.
  RSVP links use the session's luma. Always https, never http - check that links resolve.
- **Brand rules:** no emojis, no em dashes (hyphens only), no crypto/web3/onchain jargon in
  public copy ("digital creators" / "builders"), "100+" for member count.

## Voice (the newsletter)

BetterCallZaal: grounded, warm, builder-energy, first person where it counts. Short parallel
lines with rhythm ("Two days, three live builds"). The refrain "the build is the application".
Arcade close "Insert Coin." Gratitude. You in the room, not a press release. Pull from the day,
do not invent.

## Newsletter structure

1. gm opener: "Good morning, and happy [weekday] in the Year of the ZABAL."
2. Yesterday in the books - one tight paragraph.
3. Today's session - what, who, when EST, live and recorded - plus the natural link.
4. Catch up - one line to the recaps page.
5. Mindful moment - card title, the agreement, the card quote, a short personal reflection.
6. Close - "See you at [time]. Insert Coin." then "BetterCallZaal from the ZAO Team".

### Pre-send checklist
- [ ] Day number is the day-of-year, computed from today's date.
- [ ] Mindful card matches the morning photo (card vs agreement correct); `mindful.json` updated.
- [ ] Recap link points to `/recaps`; RSVP is the session luma; all links https and resolve.
- [ ] If a session moved, the day leads with what actually happened (see Postponements).
- [ ] No emojis, no em dashes, no jargon. Sign-off intact.

## Socials (downstream, opt-in)

Socials are not automatic. The newsletter and the on-site daily update are the backbone; only
generate posts when you actually want to post that day. When you do, use the prompt in
`socials-prompt-year-of-the-zabal.md`.

- **Pick the platforms you need** - you rarely want all of them. Each post stays distinct.
- **Builder shout-outs:** say what a project does for a person in plain language. Minimize token,
  NFT, or onchain wording even when the project is crypto-native - lead with the use, not the
  mechanism. Same for tags.
- **Confirm @-handles before posting.** Never guess a handle - leave it for the human to tag, or
  confirm it first. A wrong tag is worse than no tag.
- ZM opens every post (the ZAO take on "gm").

## Postponements and quiet days

- **A session moves:** update its date in `data/workshop-leads.json` (or mark it postponed so it
  drops off "today"), update the Day N entry in `data/daily-updates.json`, and lead the day with
  what actually happened. (Day 154: Cassie moved a week, so the day led with ZABAL Gamez on
  Farcaster Batches.)
- **No session that day:** the newsletter still runs - lead with the mindful moment and the
  build, and point to the recaps and the next scheduled session.

## What we learned running it (audit, 2026-06-03)

Three passes that day surfaced every rule above:
- Newsletter: the day number, the series name, and the mindful card (stale placeholder vs the
  real morning draw, plus card-vs-agreement) each needed a correction. All now locked.
- Newsletter links: individual luma recap links were swapped for the recaps page.
- Socials: jargon crept into tags ("web3" became "decentralized culture"); builder shout-outs
  needed plain-language descriptions; handles were left for manual tagging to avoid mis-tags.
  Posting is opt-in, not automatic.

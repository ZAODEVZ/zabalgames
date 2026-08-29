# Battle 1 - Artist Final, 24 August 2026

> Season 1's first head-to-head. **n3m def. dee-13.** Decided by the judges after
> the poll and the judges split. Full recording: 1h46m X Space hosted on the
> WaveWarZ account.

## Result

**Champion: n3m (LadyrynNemesis)** - artist track, Season 1.

| Signal | Winner | Evidence |
|---|---|---|
| The open poll | **dee-13** | "by a margin", 10 votes, called live on air |
| The judges | **n3m** | AttaBotty's call on air; Jose and Thy Revolution sent theirs by DM |
| The charts | **not recorded** | see the gap below |

The format is two of three. The poll and the judges split, which made the charts
the deciding signal - and **no chart result is stated anywhere in the recording**.
The announced result therefore rests on the judges alone. Candy explained the
mechanic on air ("whoever has the most amount of SOL at the end of the battle
timer is the winner of the charts"), so a number existed; it was never read out.

Resolve this before describing the outcome as two-of-three anywhere public.

## The panel

All three judges asked on the morning of the battle showed up.

| Judge | Handle |
|---|---|
| Jose | @joseacabrerav |
| Thy Revolution | @thyrevolution |
| AttaBotty | @AttaBotty |

AttaBotty made the deciding call on air and named his reasoning: the hybrid
approach, using both old and new production, and using the art form to build a
label and pull people into a community.

## Prize

Per the settled split: **100 USDC** to the track champion, **50 USDC** to the
runner-up, **50 USDC** to whichever of the six draws the highest trading volume
across the season. Zaal confirmed on air that dee-13 receives the 50 and that
payment goes out via Farcaster wallets, with WaveWarZ winnings to Farcaster
Solana wallets.

## What each finalist brought

**n3m** entered all three tracks and finished all three - the only person in the
season to do so.

- Artist: N3M3SIS - THE CALL OUT. Lyrics written and vocals recorded by her,
  produced in Ableton.
- Creator: the ZABAL Gamez song and video. **The submitted link
  (streamable.com/srlele) has since expired** and returns HTTP 200 with the page
  title "Video Unavailable". It worked when she submitted it.
- Builder: SURFBOARD, a five-step guided web3 on-ramp for musicians, with a real
  section on risks. surfboard.diyama.online

Her route in, in her own words on air: she figured out crypto while travelling in
Botswana, someone minted one of her songs before she knew what minting was, it
sold for 0.3 ETH about two years later, and she decided she was not waiting
another three years.

**dee-13** built **Ledger**, the first manga to come out of ZAO, and published it
at online.fliphtml5.com/pjwlo/ledger.

She had never drawn a manga page before July 2026. Two days after Zaal suggested
she enter, she posted her lead character. By mid-August it was a running series
with weekly episodes. On air she walked through the character sheets and how each
character has its own skill.

## Operational lessons

**Creating the battle live costs three wallet confirmations.** It happened about
33 minutes into the Space and is dead air on stream unless planned for.

**Reach is not evenly matched, and two of three signals are reach-weighted.**
At the time of the battle dee-13 had 1,036 Farcaster followers and n3m had 9. The
poll went to dee-13. The judges, the only merit-weighted signal, went the other
way. Worth stating out loud at the top of a battle that the poll is not a
follower contest.

**The rubric was never published.** Zaal named this himself in the closing round
as the thing he most wanted to fix. A split between poll and judges is exactly
what an unstated rubric produces.

## Recording and tooling

The full Space is archived locally and transcribed. `/meeting` gained an
X Spaces mode and a voiceprint library while processing this battle:

- `yt-dlp --dump-json` carries the participant roster in the description field -
  keyless, no auth, and it returned 18 names where the X web UI truncated the
  list.
- Diarization auto-detect found **233 speakers** on a 9-speaker Space, because
  the battle played music and the model reads each track as new voices.
- Forcing the **roster** count (18) rather than the true speaker count (9) is
  what resolved both finalists: at 9 they merged into one cluster and their
  voiceprints tied at 0.852/0.825; at 18 they scored 0.963 and 0.941.
- Six voiceprints are now enrolled, so later battles label these speakers
  automatically.

## Not for publication

n3m disclosed personal health information on air while explaining her artist
name. She volunteered it publicly and unprompted, but a live Space is not a
written record that outlives the room. **Do not publish it** - in a recap, in the
knowledge graph, or in a post - unless she explicitly agrees. Her Botswana and
0.3 ETH story above is the publishable version and needs none of it.

## Open items

| Item | Owner | By |
|---|---|---|
| Confirm and publish the charts winner | Zaal | 2026-08-25 |
| Fresh link from n3m for the music video | Zaal | 2026-08-26 |
| Ask n3m about the health disclosure before any publication | Zaal | 2026-08-26 |
| Record n3m as artist champion in `data/season-1-results.json` | Zaal | 2026-08-26 |
| Publish a scoring rubric | Zaal | 2026-08-27 |

## Next

Creator final, Thursday 27 August, 5:00 PM EDT - presdency.eth vs uniquebeing404.
Builder final, Saturday 29 August noon EDT through Sunday 30 August noon EDT -
jdwalka vs ghostmintops, 24 hours.

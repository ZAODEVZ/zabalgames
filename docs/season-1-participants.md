# ZABAL Gamez Season 1 - participant list + finish-line data (compiling, do not ship)

Source for the **Unlock drop to every participant** (workshop host, guest speaker, submitter, or winner). Compiled from the repo; the submitter handles + winners still need a live/admin pull.

## Workshop hosts / guest speakers (34, from data/workshop-leads.json)

| Name | Org | Track | Handle (if in data) |
|------|-----|-------|---------------------|
| Tyler Stambaugh | Magnetiq | builder | - |
| Thy Revolution | The ZAO | - | - |
| yerbearserker | Empire Builder | builder | @yerbearserker |
| Joshua.eth | Bonfire | builder | @joshua.eth |
| Ohnahji | - | creator | @ohnahji |
| Adrian | Empire Builder | builder | @diviflyy |
| Duo Do | Clementine + Santiago | artist | @duodomusica |
| Jonathan Colton | FounderCheck | creator | @jonathancolton |
| kmac.eth | - | builder | @kmac.eth |
| Cassie | Quilibrium | builder | @cassie |
| Plat0x | - | builder | - |
| Joseph Goats | - | artist | @joseacabrerav |
| Will T of Web3 | KFMEDIA℠ | creator | @willtofweb3 |
| Adam Miller | MiDAO | builder | @thethriller |
| Zaal | WIP Meetup | builder | @zaal |
| Fireside chat with Sopha | Sopha | artist | @zaal |
| Jub Jub | - | builder | @jubjub |
| Adrienne | GM Farcaster | builder | @adrienne |
| Kenny | POIDH | builder | @kenny |
| Dan Singjoy | Eden Fractal | builder | @dansingjoy |
| Chris Dolinsky | Vini App | builder | @1dolinski |
| Ali Tiknazoglu | - | builder | @alitiknazoglu |
| Aziz (MotoMoto) | BAD DAO | builder | @azizke |
| AZKAL | FlowStage | artist | - |
| Meta Mu | Rose City Web3 | creator | @metamu |
| The Farcaster Intern | Farcaster | builder | @farcaster |
| Teresa Marrin Nakra | Stevens Institute of Technology | artist | - |
| Minted Merch | - | creator | @mintedmerch |
| Saltorious | - | builder | @saltorious.eth |
| Dylan Yarter | BizarreBeasts | creator | @bizarrebeast |
| topocount | Neynar | builder | @topocount.eth |
| James | Mental Wealth Academy | creator | @jamesdesign.eth |
| Matt Lee | Tortoise | builder | @mattlee |
| Pauline and Tako | Los Fomos | creator | @pauline-unik |

## Recap presenters (32, from data/recaps.json) - cross-check for any not in leads

AZKAL, Adam Miller, Adrian (diviflyy), Adrienne Shulman, Ali Tiknazoglu, Aziz (MotoMoto), Carlos (Plat0x), Cassie, Ceci Sakura, Chris (chriscocreated), Chris Dolinsky, Dan Singjoy, Duo Do, Dylan Yarter, Hurricane Ike, James, Joseph Goats, Joshua.eth and Plat0x, Jub Jub, Kenny, Matt Lee, Meta Mu, Minted Merch, Ohnahji, Saltorious, Teresa Marrin Nakra, The Farcaster Intern, Will T of Web3, Zaal, topocount, yerbearserker

## Seed builders (data/builder-submissions.json)

- @ghostmintops (Brandon (ghostmintops))
- @branth (Branth (KORRO / Korrocorp))
- @jdwalka (jdwalka (JohnDaWalka))

## Submitters (July open build) - INCOMPLETE, needs admin export

The public board hides most submitter handles. Named projects seen live: TayDex (creator), ZABAL Artwork (creator), surfboard by n3m3sis (builder). Full submitter->handle list must be pulled from KV (admin) - flag for Zaal/ZOE to export `zabal:subs:recent` with handles.

## Winners (per track) - TBD after Aug 31

- Artist winner: TBD
- Builder winner: TBD
- Creator winner: TBD

## Season 1 results frozen state (page plan - do not ship until Aug 31)

A `/results` (or repurposed `/winners`) frozen state that tells the season story after close:
- The 3 track winners (from the WaveWarZ finale).
- A short recap (numbers: workshops delivered, submissions, voters).
- Links to the recordings archive + the final /submissions board.
- The participant Unlock drop acknowledgement.
Build it once winners are decided; keep it static/frozen (no live vote widget) so it reads as a record.

## Unlock drop - dedupe rule
One collectible per unique person across all four roles (host / speaker / submitter / winner). Anchor on Farcaster handle where present, else name. Needs: (1) the submitter export above, (2) the winners, (3) wallet/handle for each to airdrop to.

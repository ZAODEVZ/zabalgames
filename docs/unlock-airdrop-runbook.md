# Unlock airdrop runbook - the ZABAL Gamez collectible

How an approved submission turns into a collectible in someone's hands. Pairs with the
review queue at `/review` and the design in `docs/submission-system-spec.md`.

## The loop

1. Someone submits (on-site form -> `/api/submissions`, or the Magnetiq casual lane).
2. ZOE triages + a notify ping fires (set `SUBMIT_NOTIFY_URL` to your Telegram/webhook).
3. You open `/review`, enter the `ADMIN_KEY`, and **Approve** (or Reject).
4. Approval flags the submission and pings the airdrop target (wallet or email).
5. You airdrop the Unlock key to that target.

Approval is the gate; the airdrop is the payoff. Never airdrop before approval.

## One-time setup (do once)

1. Deploy the collectible as an **Unlock lock** on **Base** (a "membership"). Free price,
   unlimited supply, **expiration: Never** for a keepsake collectible.
2. Note the lock address. Fund the lock's manager wallet with a little ETH on Base for
   airdrop gas (each key costs a few cents).

## Airdropping (after approval)

From the Unlock dashboard -> your lock -> **Airdrop Keys** (the panel in the screenshot):

- **Wallet address** - paste the submitter's wallet (or an ENS). Use this when they gave one.
- **No wallet address?** toggle + **Email Address** - use this for wallet-less submitters
  (Magnetiq email crowd). Unlock spins up a custodial wallet and emails them a confirmation /
  claim. This is the fallback that means everyone can receive the collectible.
- **Number of keys:** 1.
- **Expiration:** Never.
- **Key Manager: CLEAR IT.** By default Unlock sets *your* address as Key Manager, which lets
  you transfer or cancel their membership - so it is not truly theirs. Set the Key Manager to
  the **recipient's own address** (or zero address) so they fully own a transferable collectible.
  This is the single most important setting on this screen.
- **Add recipient**, then send.

### Batching

Use the **Bulk** tab to airdrop a whole approved batch at once (paste wallets/emails). Clear
the Key Manager the same way. Batching is the practical path for a busy day - approve live in
`/review`, then bulk-airdrop the approved list in one pass.

## Dedup (one per person)

The collectible is **one per verified identity** (per the spec). Before airdropping, skip
anyone already in `zabal:collectible:granted`. The reward gate also wants at least one verified
auth (Farcaster or GitHub) on the profile - email-only profiles get the collectible only after
they verify, to stop farming.

## Automation (later, optional)

Phase-6+ can fire the airdrop automatically on approval via an Unlock `grantKeys` call from a
funded signer, removing the manual step. Until then, manual/bulk airdrop from this runbook is
the path. Keep the manual flow even after automation as the fallback.

## Quick checklist per approval

- [ ] Approved in `/review`
- [ ] Has a wallet OR email target
- [ ] Not already granted (dedup)
- [ ] Airdrop: 1 key, Never expiry, **Key Manager cleared to the recipient**
- [ ] Sent

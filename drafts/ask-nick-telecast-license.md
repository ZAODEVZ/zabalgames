# Draft: ask Nick to add a LICENSE file to telecast

**DRAFT ONLY - NOT SENT.** Contacting a collaborator is Zaal's. Nothing in this
file has been sent to Nick or anyone else.

**To:** Nick Saponaro (@nickysap, FID 269091, github.com/99darwin)
**Re:** github.com/99darwin/telecast
**Why now:** we already have PR #1 open on his `juke-space-recap`, so this is a
live thread, not a cold ask.

## The ask in one line

His `package.json` already declares `"license": "ISC"`. The repo has no `LICENSE`
file. So this is "add the file to match what you already said", not "please
license your work" - a favor, not a negotiation.

## Draft message

> Hey Nick - small one. I've been reading `telecast` because it's the exact shape
> of a Telegram/Farcaster bridge we're building, and the signer lifecycle in
> `utils/fc/signer.ts` is the clearest version of that flow I've seen.
>
> Only thing stopping us using any of it is that the repo has no LICENSE file.
> Your `package.json` already says ISC, so I think it's just never been added -
> without the file it reads as all rights reserved, and we won't copy from it on
> that basis.
>
> Any chance you'd drop in an ISC LICENSE to match the package.json? Happy to
> open the PR myself if that's easier.
>
> Either way, thanks for putting it out there - and PR #1 on `juke-space-recap`
> is still open whenever you get a minute.

## Why it is worded that way

- **Names the specific file** (`utils/fc/signer.ts`), so it reads as someone who
  actually read the code, not someone farming licenses.
- **Says we will not copy without the license.** That is our real position under
  `.claude/rules/credit-attribution.md` and it costs nothing to state plainly.
- **Offers to open the PR.** Turns the ask into roughly zero work for him.
- **Does not oversell what we would build.** No roadmap, no partnership pitch.
- **Mentions PR #1 last and lightly.** It is a real open thread, but leading with
  it would make the license ask feel like leverage.

## Send checklist for Zaal

- [ ] Confirm PR #1 on `99darwin/juke-space-recap` is still open before sending -
      the last line dates fast if it merged
- [ ] Pick the channel (Farcaster DM vs a GitHub issue on telecast). A GitHub
      issue is more likely to survive his inbox and is easy to point a PR at
- [ ] If he says yes, the PR is a single 21-line ISC file plus the copyright line

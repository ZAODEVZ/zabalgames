# ZABAL.md - the builder ownership file (copy-paste template)

> What to put in a `ZABAL.md` file at the root of your build's repo so ZABAL Gamez trusts it as
> yours. This is the ownership-proof step referenced in `docs/july-open-build-readiness.md` and
> `docs/audit-decisions-2026-06-04.md`. The exact check is in `api/commit-watcher.mjs` - this doc
> matches it. Brand: no emojis, no em dashes.

---

## Why this file exists

Registering a build at `/enter` is a thin, auth-free claim (so any harness works). The trust
boundary is the **commit-watcher** cron: before it trusts or pushes your repo's activity, it
verifies the repo actually contains **your wallet address** in a known file. Only the repo's owner
can commit their wallet into the repo, so this is what stops someone from registering a public repo
they do not control. Repos without the proof are skipped, never pushed.

## The one hard requirement

`api/commit-watcher.mjs` (`verifyOwnership`) does exactly this:

1. Reads `ZABAL.md` at the repo root (raw). If that is missing, it reads your `README`.
2. Returns trusted if the file text **contains your registered wallet address** - a
   case-insensitive substring match.

That is the whole gate. So the only thing that strictly must be true: **the wallet you registered
with appears as text in `ZABAL.md` (or, failing that, your README).** Everything else below is
recommended polish, not required by the check.

> Tip: `ZABAL.md` is checked first, so add it even if your README already has the wallet - it
> keeps the proof in one obvious place and survives README rewrites.

## Copy-paste template

Create a file named `ZABAL.md` in your repo root. Replace the bracketed parts; keep the wallet
line exactly (the address is what gets matched).

```markdown
# ZABAL Gamez build

Builder wallet: 0xYOUR_WALLET_ADDRESS_HERE

- Build name: [your project]
- What it does: [one line]
- Track: [artist | builder | creator]
- Live URL: [https://...]
- Demo (60s): [https://...]
- Builder: [@your-farcaster-handle]
- Registered at: https://zabalgamez.com/enter
```

Only `Builder wallet: 0x...` is load-bearing for the trust check. The rest makes your repo
self-documenting and lines up with the submission bar.

## How it connects to the rest of July

- **Register:** `/enter` (wired to `api/register.mjs`) - wallet-keyed, auth-free. You can register
  many repos under one wallet. An optional Farcaster Quick Auth link ties your wallet to a verified
  FID, but it never blocks submission.
- **Trust + activity:** the commit-watcher reads the `zabal:builds` wallet -> repos map, verifies
  `ZABAL.md`, and pushes new commits to the knowledge graph as build updates.
- **The submission bar (hit all four by T+24h):** a live deployed URL, a public MIT repo, a
  60-second demo video, and a cast on `/zabal` tagging @bettercallzaal. Plus a show-your-work
  visibility mode during the build. (Full detail: `docs/july-open-build-readiness.md`.)

## Notes / gotchas

- **Do not paste secrets.** The commit-watcher has a secret guard and will refuse to push a body
  that looks like it carries a credential (API keys, private keys, raw 0x...64-hex private keys,
  bot tokens). A normal wallet address is fine; a private key is not - never put one in any repo.
- **Use the same wallet you registered with.** The match is against your registered wallet; a
  different address will not verify.
- **Public repo only.** The check reads the repo over the public GitHub API; a private repo cannot
  be verified or pushed.
- **Case does not matter** for the match, but copy your real checksummed address to be safe.

---

## Sources

- `api/commit-watcher.mjs` - `verifyOwnership` (ZABAL.md then README, case-insensitive substring of the wallet) + the secret guard - [FULL]
- `docs/audit-decisions-2026-06-04.md` (#4 register spoofing -> ownership proof; the builder convention) - [FULL]
- `docs/july-open-build-readiness.md` (the submission bar + how registration works) - [FULL]
- `CLAUDE.md` + `api/README.md` - the live source of truth for register / commit-watcher - [FULL]

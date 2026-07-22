# ZABAL Gamez submission + profile system - spec

Locked from a 13-question design grill (Zaal, 2026-06-27). This is the north star for the
`/loop` build. The site is the source of truth; Magnetiq keeps a casual UGC lane.

## The decisions (answer key)

1. **Source of truth = zabalgamez.com.** People submit on the site; our backend owns it; we
   push out everywhere (Magnetiq, Farcaster, the list). Magnetiq still takes some casual UGC
   (selfies, feedback); the site owns the builder/functionality lane.
2. **Open profiles for anyone.** Anchor is an internal profile id. Farcaster (Quick Auth),
   GitHub, and a wallet **attach** to it as optional proofs - none is required to exist.
   - Profile URL: `/profiles/<handle>`. Submission URL: `/submissions/<id>`.
3. **GitHub proof = nonce.** We give the profile a random string; they put it in their GitHub
   profile bio (or a gist); the backend checks it via the GitHub API (`GITHUB_TOKEN`, already
   used by commit-watcher) and flips the profile to `github_verified`. Point-in-time - once
   seen, stored; they can remove it.
4. **Farcaster proof = Quick Auth** (existing `lib/auth.mjs`). **Wallet** = connect + sign, or
   pulled from the Farcaster verified address.
5. **Collectible gate.** To *receive* the collectible a profile needs (a) at least one verified
   auth, (b) one-per-verified-identity dedup, (c) human approval. The profile itself is open;
   only the reward is gated.
6. **Approval.** ZOE triages each submission and recommends; an email/Telegram alert fires on
   submit; Zaal approves live. Submissions are `pending` until approved.
7. **Reward = Unlock collectible, airdropped AFTER approval.** Unlock Airdrop Keys (manual or
   bulk) by wallet OR email - so wallet-less people still get it. **Clear the Key Manager** on
   airdrop so the recipient truly owns it (default sets ZAO as manager = can cancel/transfer).
8. **Claim timing: airdrop after approval** (not on submit) - keeps the gate real.

## Data model (Upstash Redis, REST - same stack as api/game.mjs)

- `data/builder-submissions.json` -> audited, repository-backed builder and project roster.
  This durable source powers the public gallery and can be promoted into the live intake.
- `zabal:sub:v1:<id>` -> submission JSON `{ id, promptId, answer, fields{}, profile?, fid?, handle?,
  wallet?, email?, status:'pending'|'approved'|'rejected', ts, reviewedBy?, reviewedTs? }`
- `zabal:subs:recent` -> ZSET (score ts) of submission ids (feed + queue)
- `zabal:subs:bystatus:<status>` -> SET of ids (review queue)
- `zabal:profile:v1:<handle>` -> profile JSON `{ handle, displayName, bio, links[], fid?,
  github?, github_verified, wallet?, wallet_verified, created, updated }`
- `zabal:profile:nonce:<handle>` -> the GitHub challenge string (TTL)
- `zabal:profile:byfid:<fid>` / `zabal:profile:bygithub:<gh>` -> handle (dedup + lookup)
- `zabal:collectible:granted` -> SET of verified-identity keys already airdropped (one-each dedup)

## Endpoints (api/*.mjs, edge, graceful no-op without KV)

- `POST /api/submissions` - create a submission (optional Quick Auth to attach a profile/fid);
  stores pending, fires the notify hook. `GET ?id=` returns an approved submission (public) or
  pending-to-its-owner. `GET ?status=pending` + admin gate = the review queue. `POST
  {action:'approve'|'reject', id}` + admin gate sets status (and marks ready-to-airdrop).
- `GET /api/submissions?feed=builders` - flatten the audited builder/project roster into a
  public gallery feed with project, builder, track, status, demo, repository, and thumbnail
  fields. Missing media remains null so clients can render a pending state.
- `POST /api/profile` - create/update a profile (Quick Auth or open with handle claim);
  `{action:'github-challenge'}` issues the nonce, `{action:'github-verify'}` checks the bio,
  wallet attach via signature. `GET ?handle=` returns the public profile.
- Notify hook: if `SUBMIT_NOTIFY_URL` (a Telegram/webhook) is set, POST a one-line alert on each
  new submission; ZOE can also read `GET ?status=pending` to triage + recommend.

## Build phases (the /loop ships these as PRs)

1. **Backend MVP** - `api/submissions.mjs`: submit + store + notify + admin queue/approve. (this PR)
2. **/submit becomes on-site capture** - the form writes to `/api/submissions` (supersedes the
   inbound-hub version); keeps the Magnetiq link as the casual lane.
3. **Profiles** - `api/profile.mjs` + `/profiles/<handle>` page (create/edit, GitHub nonce
   verify, Farcaster, wallet).
4. **Permalinks** - `/submissions/<id>` page (approved submissions public, with profile link).
5. **Triage + reward** - admin review surface for Zaal/ZOE; Unlock airdrop helper + the
   approve->airdrop runbook.
6. **Push-out** - on approval, compose a credit cast + feed the list.

## Open items for Zaal (not code)

- Deploy the Unlock lock (the collectible) on Base; note the lock address + manager policy.
- Set the notify target (Telegram bot or webhook) -> `SUBMIT_NOTIFY_URL`.
- Decide which prompts stay on Magnetiq vs move to the on-site form.
- Moderation: the site now hosts public UGC (selfies, links) - a takedown/report path.

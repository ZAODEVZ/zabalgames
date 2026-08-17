# Season 1 - final two weeks audit (2026-08-17)

Where the site actually stands with 13 days left, what was fixed in this pass, and
what is still open. Three workstreams: the announce, the security report, the site.

Season clock: board closed Aug 16, battles Aug 24 to 30, season ends Aug 31.

---

## 1. The announce - built, not sent

Paste blocks are in `docs/finals-six-announce-2026-08-17.md`: newsletter, five
casts, dates-ask DM, verified handles and FIDs.

**Blocking before it goes out** (full detail in that doc):

1. Publish `HOOD` (presdency.eth) and `Ledger` (dee-13) at `/review`. Both were
   still `status: "draft"` on 2026-08-10, which makes them invisible on
   `/submissions` - the board the post links to while naming both as finalists.
2. Re-verify the project count. The copy says 30; the raw feed said 32 including
   two QA-test rows, and the thread published Aug 11 said thirty.
3. Confirm and name the three mentors. The dates-ask tells them they ARE the
   judges' panel, and the champion formula depends on that panel, but `/august`
   still shows all three slots as "confirming".
4. Lock the third scoring factor before Thursday.

**Decisions only Zaal can make:** the prize split (see below), whether to explain
uniquebeing404 moving builder to creator, and the four builder/creator why-lines.

---

## 2. Security - all six audit findings fixed

Against the Aug 3 report from Luis Felipe (felirami) and the thread agreeing the
order. Three commits: `a75764d`, `09e4389`.

| # | Finding | Status |
|---|---|---|
| 2 | poidh-watcher open when both secrets unset | **Fixed.** Fallback removed, 503 unconfigured / 401 bad key |
| 4 | webhook FID binding fails open | **Fixed.** Tri-state became four-state; outage is 503, not open |
| 1 | win-notify open when WIN_HOOK_SECRET unset | **Fixed.** 503 unconfigured, queue capped at 500, payload at 2000 |
| 3 | Non-constant-time compares | **Fixed.** Single `timingEq` export; all 5 copies and 2 inline variants removed |
| 5 | CDN script without SRI | **Fixed differently.** marked self-hosted, no third-party request left |
| 6 | No CSP | **Staged.** `object-src`/`base-uri` enforced, full policy report-only |
| - | mcp/package.json unpinned (found in the reply thread) | **Fixed.** Lockfile added, 0 vulnerabilities |

Two deviations from the report worth knowing:

- **Finding 5 was self-hosted, not SRI'd.** jsdelivr is unreachable from this
  environment, so an SRI hash could not be verified against what the CDN actually
  serves, and a wrong hash breaks `/context` completely. Vendoring removes the
  request instead of verifying it, follows the convention already used for the
  Mini App SDK, and means no jsdelivr allowance is needed when the CSP tightens.
- **Finding 4 keeps working when unconfigured.** Failing closed on a missing
  `FARCASTER_HUB_URL` would break notification registration everywhere today.
  The code now separates "no hub configured" (proceeds on the verified signature)
  from "hub configured but did not answer" (503). Setting the env var is what
  activates the strict path.

### Still to do on security

1. **Set `FARCASTER_HUB_URL` in Vercel.** Finding 4 is only half-closed without
   it. This is the single highest-value remaining action and it is a dashboard
   change, not code.
2. **Confirm `INTAKE_KEY` / `ADMIN_KEY` are set in Vercel.** poidh-watcher now
   returns 503 rather than running when neither exists, so if that endpoint is
   still wanted, it needs a key. If it is not wanted, delete the file - the cron
   is already retired and the HTTP route stays deployed either way.
3. **Watch the report-only CSP, then tighten.** Reports go nowhere without a
   collector, so today they are console-only. Options, in order of effort: read
   the console on a few pages, add a `/api/csp-report` collector, or move
   straight to hashes. No page uses an inline `on*` handler, so a hash policy is
   reachable; 57 of 66 pages use inline `<script>`, so `script-src` cannot be
   tightened before that work.
4. **Do not add `frame-ancestors`.** It would break Mini App embedding in
   Farcaster clients. Deliberately absent.
5. **Offer Luis the retest.** He offered an authorized non-destructive
   post-deployment retest against specific SHAs. The four commits on this branch
   are the unit to send.

Not done, and deliberately: the regression tests Luis suggested. This repo has no
test suite, only `scripts/validate.mjs`. Adding a test harness during finals week
is the wrong week for it. Worth doing in the Season 2 gap.

---

## 3. The site - what was stale, what is fixed

Commit `59d5cee`.

The site read as though entry was open and the vote decided the finals. The
announce would have contradicted it on publish.

- `/submissions` and `/board` carried "this week is the last chance to climb it".
- `/leaderboard` counted down to a close that had already passed and still
  advertised "tonight at 5pm EST".
- `/` had no season-clock phase after Aug 1 and dead-ended on "top 6 present at
  month's end". Now counts to Aug 24, then to battle week, then to complete.
- `/submit` told submitters in four places that the community would vote on their
  work. The vote was retired Aug 11.
- `/finals` claimed artist and creator slots were unclaimed and that the builder
  field was Brandon, Branth and jdwalka. Branth is not a finalist.
- `/results` linked to `/vote` and counted a "voters" stat that no longer exists.
- **82 links across 66 files pointed at `/enter`**, which has redirected to
  `/leaderboard` since entry closed - every footer on the site invited people to
  register for a closed season, at the cost of a redirect hop. All retargeted.

Verified after: no broken internal links, `scripts/validate.mjs` passes.

### Orphan pages found

20 top-level pages have no inbound link. Most are intentional (admin `/review`,
`/status`, `/award`, `/submission-status`; utility `/profile`, `/invite`). Three
matter:

- **`/wavewarz`** explains what WaveWarZ is and how it distributes - directly
  relevant now that the finals run on it. Now linked from `/august` and `/finals`.
- **`/results`** is the prepped season-close page and nothing pointed at it. Now
  linked from `/august`. It needs populating after Aug 30.
- **`/vote` and `/enter`** are unreachable (both redirect away) but still in the
  repo. Candidates for archiving once the season closes; harmless until then.

---

## What is left, in the order it should happen

**This week, before the post**
1. Publish the two draft submissions at `/review`.
2. Verify the project count with one curl.
3. Confirm the three mentors and name them on `/august`.
4. Decide the prize split (below).
5. Set `FARCASTER_HUB_URL`, confirm `INTAKE_KEY`.
6. Send: newsletter, then casts, then the dates-ask.

**By Thursday**
7. Lock the third scoring factor and the three battle dates, then put the
   schedule on `/august` - there is no per-battle date surface yet, and six
   people plus three mentors will be asking where it is.

**Battle week, Aug 24 to 30**
8. `/finals/live` renders the six but its Trade button is disabled and its copy
   still describes a WaveWarZ-Base scaffold. Either wire it to the real WaveWarZ
   battles or point people at WaveWarZ directly and stop maintaining the page.
9. Decide what the homepage hero does during battle week. The clock handles it;
   the hero copy has not been rewritten for it.

**After Aug 30**
10. Populate `data/season-1-results.json` (winners, recap numbers) and flip
    `status` to `final`. Set ranks in `data/finals.json` and `settled: true`,
    which is what makes `/winners` render.
11. Distribute the 500 USDC and both collectibles.
12. Archive `/vote`, `/enter`, and the superseded write-ups on `/finals`.

---

## The one contradiction nobody has resolved

`finals.html:120` is live right now and says: **"Every finalist receives an equal
share of the 500 USDC pool. The same for all six, not a slice by rank."**

`docs/finale-standings-2026-08-10.md` proposes $300 head-to-head ($70 win / $30
lose) plus $200 volume-weighted capped at $80 each. That is not equal shares.

The announce copy says "a share of the 500 USDC pool", which is compatible with
either, so the post can go out before this is settled. But both cannot stay true,
and the published one is the equal-shares promise. I did not touch that line -
changing a live prize commitment is a decision, not a copy edit.

---

## Note on the relayed correction

A message arrived mid-session from the zaoos-infra lane saying the announce draft
was superseded and "names the wrong finalists in two tracks". Its own list of the
confirmed six is identical to the draft's, name for name, track for track, and so
is its list of the eight. Nothing was changed on the strength of it. Its additive
details were used and are reflected above: the judges' panel is the three track
mentors, the third factor locks Thursday, imanafrikah is roster but not competing,
and the builder play-in week is cancelled. Worth a reply to that lane clarifying
which draft it was actually comparing against.

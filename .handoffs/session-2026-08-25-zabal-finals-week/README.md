# Session handoff - 2026-08-25 13:00
> from mac, zabalgames repo, branch ws/artist-battle-record -> to a cloud / different-machine session
> doc: .handoffs/session-2026-08-25-zabal-finals-week/README.md
> chain: none

## Receiver instructions (read me FIRST, then do exactly this)

You just received a handoff bundle. Do NOT start work yet. Do this:

1. Read ALL sections below before responding to anything.
2. Create TaskList entries from section A. Those are your to-do items.
3. Use section B as your "why" - do NOT re-litigate decisions captured there unless new information surfaces.
4. Use section D to know what is still running.
5. Use section E as your cold-start map.
6. Once integrated, message back: "Ingested handoff zabal-finals-week. 8 tasks queued. Ready."
7. If you /handoff later, point your bundle's `chain:` field back at this path.

## Repos to use (START HERE)

**Primary: `ZAODEVZ/zabalgames`** - `https://github.com/ZAODEVZ/zabalgames.git`

Everything in section A lives here unless stated otherwise. If unsure which repo, it is this one.

Conventions, all load-bearing:
- `git fetch origin --prune && git pull --ff-only origin main` at the start of every session. Work has been stranded by skipping this.
- Branch as `ws/<short-name>` off main. One PR = one finished unit.
- **Before every commit, confirm the branch's PR is still OPEN** (`gh pr view <branch> --json state`). Pushing to an already-merged branch silently strands commits - they build as Vercel previews and look shipped but never reach production. This is the single most common way work is lost here.
- **`node scripts/validate.mjs` before every push.** No test suite; this is it. It checks every tracked JSON parses, every `api/*.mjs` passes `node --check`, every inline `<script>` compiles, and the Mini App manifest payload.
- Do NOT open the PR until all commits for the unit are pushed. Zaal merges.

Secondary, reference only: ZAOOS (`bettercallzaal/ZAOOS`) holds the research library and the cowork tracker helper. You do not need it for section A.

## Capability boundary (cloud vs terminal)

Boot self-check:
```bash
ls ~/.zao/zao.env 2>/dev/null        # secrets - absent in cloud
ls ~/.claude/skills 2>/dev/null      # the skill brain - absent in cloud
gh auth status                       # GitHub - usually present
echo "$DISPLAY"                      # GUI - absent in cloud
```

**STOP and ask Zaal to run it in a mac terminal** when a task needs any of:
local secrets (`~/.zao/zao.env`), a browser or GUI, the `/clipboard` skill, a
locally-authenticated MCP (Paragraph, Chrome), Zaal's real accounts (posting,
DMs, Farcaster, X), onchain writes, or a file outside the repo.

Do not fake it and do not fail silently. Continue with everything you CAN do,
and list what you handed back.

In section A specifically: tasks 1, 4 and 6 need Zaal or a mac terminal. Tasks
2, 3, 5, 7 and 8 are repo work a cloud session can do end to end.

## A. Tasks to absorb

- [ ] **Confirm and publish the charts winner for the artist battle** - blocks any "two of three" claim. Needs Zaal, the number is not in the recording.
- [ ] **Publish a scoring rubric before Thursday's creator battle** - Zaal named this himself as the thing to fix. Repo work; `/august` is the natural home.
- [ ] **Merge PR #651** - the artist battle record, `docs/battle-1-artist-final-2026-08-24.md`.
- [ ] **Get a live link from n3m for the ZABAL Gamez music video** - her creator submission points at `streamable.com/srlele`, which now returns HTTP 200 with the title "Video Unavailable". Needs Zaal to ask her; then update `data/finals.json` and submission id 9.
- [ ] **Record n3m as artist champion in `data/season-1-results.json`** - `/results` still serves an empty winners object. Pure repo work.
- [ ] **Builder battle prep** - Saturday 29 Aug noon EDT to Sunday 30 Aug noon EDT, 24 hours, a Space at each end. Budget three wallet confirmations for creating the battle on stage; it took that long and is dead air unless planned.
- [ ] **Season recap and the season 2 funnel** - recap post plus newsletter. The season 2 door is already live on `/august`: email `info@thezao.com` as contestant, presenter, judge or supporter. No form, deliberately.
- [ ] **Enroll presdency and uniquebeing404 voiceprints at Thursday's battle** - both were already in the artist Space so they will speak. Needs a mac terminal (`~/.claude/skills/meeting/scripts/voiceprints.sh`). Six people are already enrolled.

## B. Why - decisions, pivots, ruled-out paths

- **The 500 USDC splits by result, not evenly.** 100 to each track champion, 50 to each runner-up, 50 to the highest season trading volume. An earlier flat "500 split by 6 = 83.33 each" was told to a finalist before the structure was settled and briefly shipped to production; it is wrong and was corrected. The framing "the battles decide champions, not who gets paid" is also now FALSE - winning pays double. Do not reuse it.
- **The battle is created live in the Space and does not exist beforehand.** That is why "be in the room at 5" is a real reason and not marketing. It costs three wallet confirmations on stage.
- **The charts signal was never recorded for battle 1.** Poll went to dee-13, judges went to n3m, so the charts were the tiebreak and no number was read out. The announced result rests on the judges alone. Ruled out claiming two-of-three publicly until the number exists.
- **Diarization must be forced to the ROSTER count, never the true speaker count.** Measured: at 9 (the real number) the two finalists merged into one cluster and their voiceprints tied at 0.852/0.825, unresolvable. At 18 (the roster over-count) they scored 0.963 and 0.941. Over-forcing is recoverable because voiceprint matching re-merges by name; under-forcing is not.
- **`yt-dlp --dump-json` beats the browser for the Space roster.** It carries participants in the description field, keyless and no auth, and returned 18 names where the X web UI truncated the list. Ruled out Chrome as the default path.
- **Music in a recording is what breaks diarization.** Auto-detect found 233 speakers on a 9-speaker Space because it reads each battle track as new voices.
- **n3m's on-air health disclosure is do-not-publish** unless she explicitly agrees. She volunteered it live and unprompted, but a Space is not a written record that outlives the room. Her Botswana / 0.3 ETH story is the publishable version and needs none of it.
- **Two of the three signals are reach-weighted** and reach was 1,036 followers against 9. The poll followed reach; the judges did not. Worth saying out loud at the top of a battle that the poll is not a follower contest.
- **Site copy is data-driven on purpose.** Battle timing, watch link, poll link, Space link and trade link all live in `data/finals.json` and render everywhere. Ruled out hardcoding into templates - the timing had already been copied into three places and one was wrong within a day.
- **Link checks must read content, not status codes.** Streamable returns HTTP 200 while serving "Video Unavailable". A status check called a dead link healthy and it reached posts and pin cards before being caught.

## C. Git state

- Branch: `ws/artist-battle-record` (clean tree, pushed, PR #651 open)
- Uncommitted diff: none
- Untracked files: none

## D. In-flight

- Background bash jobs: none running.
- Subagents pending: none.
- Scheduled wakeups: none.
- Open AskUserQuestion: none.
- Open PR: **#651** - the artist battle record. Everything else this session is merged.

## E. Cold-start map

**Repo files this session**
- `data/finals.json` - the spine. Per battle: date, time, `window` sentence, `watch`, `poll`, `battleUrl`, `space`, status. Also the six finalists and their demo links.
- `august.html` - schedule rows, the 100/50/50 split section, the judges call, the season 2 door.
- `live.html` - next-battle card, the live-now card that keeps the battle on screen once streaming, and the standings block that hides itself when scores are flat.
- `index.html` - front door now points at the finals.
- `docs/battle-1-artist-final-2026-08-24.md` - the battle record (PR #651).

**Skill work (mac only)**
- `~/.claude/skills/meeting/` gained `fetch-space.sh`, `space-pipeline.sh`, `voiceprints.{sh,py}` and an `x_space` input mode. Voiceprint library at `~/.zao/voiceprints/` with six people enrolled.

**Mental model.** Season 1's finals week is live. Battle 1 (artist) is done and n3m won; the site, the posts and the newsletter all shipped and agree with each other. Battle 2 (creator) is Thursday and battle 3 (builder) is the weekend in a different 24-hour format. The open risk is that battle 1's result was announced as two-of-three when only two signals were actually recorded.

**Open questions for the receiver**
- What was the chart result for battle 1? Without it the result is judge-decided, not two-of-three.
- Does the rubric go on `/august`, or its own page?
- Has n3m been asked about the health disclosure?

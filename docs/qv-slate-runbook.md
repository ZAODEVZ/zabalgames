# Quadratic Vote Slate Review Runbook

Review and approve submissions to become voteable candidates. This is a manual process - no auto-publish.

## Overview

The slate (vote candidates) is curated. Submissions must be explicitly reviewed and approved before they become voteable. The bridge has two parts:

1. **Draft generator** (`/api/qv-slate-draft`) - reads `data/builder-submissions.json`, keeps the builders flagged `qv_ballot: true`, groups them by their `track`, returns a draft.
2. **Admin tool** (`/slate-admin.html`) - web UI to review the draft, assign ambiguous tracks, select which to approve, and generate the merged JSON.

## Process

### 1. Generate the draft

Navigate to `/slate-admin.html` and authenticate with your `ADMIN_KEY`.

The page fetches the latest draft from `/api/qv-slate-draft` (requires admin auth).

### 2. Review candidates

The draft shows three sections:
- **artist** - visual/musical builds
- **builder** - developer/technical builds  
- **creator** - media/distribution builds
- **Needs Track Assignment** - builders whose `track` value is missing or not one of artist/builder/creator

### 3. Assign ambiguous tracks

For any entry in "Needs Track Assignment", click one of the three track buttons to assign it. The button highlights when selected.

### 4. Select approved candidates

Uncheck any candidate you want to exclude. Approved candidates remain checked.

### 5. Generate merged JSON

Click "Generate Merged JSON". The tool fetches the live `/data/vote-candidates.json`
first and outputs a UNION of:
- every existing curated candidate in the live slate (preserved, existing wins on a
  handle conflict so hand-written notes/urls survive), plus
- the approved submission candidates you selected.

The output header shows `preserved N existing + added M new` and the current `status`.
If the live slate cannot be loaded the tool refuses to generate rather than risk
dropping curated candidates - fix the fetch and retry.

The generated JSON keeps the live `status` unchanged. Generating a slate never opens
voting; that is a separate, explicit step (7).

### 6. Commit the slate (PR only - never push main)

Copy the JSON and open a PR that replaces `data/vote-candidates.json` with it:
```bash
git fetch origin --prune
git checkout -b ws/qv-slate-update origin/main
# paste the copied JSON as the full new contents of data/vote-candidates.json
node scripts/validate.mjs        # confirm it parses
git add data/vote-candidates.json
git commit -m "feat(qv): approve <N> new candidates for vote"
git push origin ws/qv-slate-update
gh pr create --base main --head ws/qv-slate-update \
  --title "qv: approve <N> new candidates" --body "New slate from /slate-admin."
```
Zaal reviews and merges. Do not push to `main` directly.

### 7. Open voting (Zaal's call, its own PR)

Adding candidates does NOT open voting. The vote (`/api/qv-vote`) only accepts ballots
while `data/vote-candidates.json` has `"status": "open"`. Opening voting is a public
launch and a separate PR:
- `"status": "preview"` - vote page visible, ballots refused (default / testing).
- `"status": "open"` - ballots accepted.
- `"status": "closed"` - results only, ballots refused.

To open: a one-line PR flipping `status` to `"open"`, merged by Zaal. The edge fetches
the slate per request (short cache), so the change takes effect within seconds of deploy.

## Revert and clearing test votes

**Close voting fast.** Open (or merge) a PR flipping `status` back to `"preview"` or
`"closed"`. Once deployed, `/api/qv-vote` refuses new POSTs within seconds - no ballot
data is touched.

**Clear test ballots.** Votes live in Upstash Redis, not in the repo. There is no
endpoint that wipes them (by design); do it from the Upstash console or REST. Two keys
per track:
- `qv:ballots:<track>` - HASH, one entry per voter FID (private ballots)
- `qv:tally:<track>` - ZSET, aggregate votes per candidate handle

Delete all six (artist/builder/creator) with the injected KV env vars (never paste the
token into code or chat):
```bash
curl -s "$KV_REST_API_URL/pipeline" \
  -H "Authorization: Bearer $KV_REST_API_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '[["DEL","qv:ballots:artist"],["DEL","qv:ballots:builder"],["DEL","qv:ballots:creator"],["DEL","qv:tally:artist"],["DEL","qv:tally:builder"],["DEL","qv:tally:creator"]]'
```
Run this before a real open if any test ballots were cast, so the tally starts clean.
This is destructive and irreversible - confirm you are clearing TEST data first.

## Notes

- **No auto-publish.** Submissions are never automatically voteable. A human must always review and open a PR.
- **Existing entries are preserved.** The admin tool loads the live slate and unions it with your selections (existing wins on a handle conflict), so hand-curated candidates are never dropped. If the live slate cannot be loaded, the tool refuses to generate.
- **Curation gate.** Only builders with `qv_ballot: true` in `data/builder-submissions.json` enter the draft. Promote a builder onto the ballot by setting that flag in the file (its own edit / PR). Track comes straight off the record's `track` field - no mapping. A missing or invalid track lands the builder in _needs_track for manual assignment.
- **Source file.** Candidates are read from `data/builder-submissions.json` (public curated file, `submissions[]`). This is the same durable source `/api/submissions` promotes to the public board.
- **URL fallback.** If a builder record has no `farcaster` url, the candidate URL defaults to `https://farcaster.xyz/<handle>` (from the `builder` field).

## Environment

The endpoint requires:
- `ADMIN_KEY` env var - constant-time checked against the Authorization header.

No Supabase or service-role key is needed - the source is a public repo file. If the
file cannot be read, the endpoint returns `{ configured: false }`.

## Troubleshooting

- **"Admin key required"** - Enter your ADMIN_KEY in the prompt. It's stored in localStorage for this tab.
- **"builder-submissions.json unavailable"** - The endpoint could not fetch `/data/builder-submissions.json`. Confirm the file is deployed and valid JSON (`node scripts/validate.mjs`).
- **Candidates missing** - Check the builder has `qv_ballot: true` and a `builder` handle in `data/builder-submissions.json`. Records without the flag or a handle are skipped.
- **Track assignment stuck** - Refresh the page and try again.

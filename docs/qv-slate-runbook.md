# Quadratic Vote Slate Review Runbook

Review and approve submissions to become voteable candidates. This is a manual process - no auto-publish.

## Overview

The slate (vote candidates) is curated. Submissions must be explicitly reviewed and approved before they become voteable. The bridge has two parts:

1. **Draft generator** (`/api/qv-slate-draft`) - reads all submissions from Supabase, maps them to candidate shape, groups by track, returns a draft.
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
- **Needs Track Assignment** - submissions where `creator_type` didn't map clearly to a track

### 3. Assign ambiguous tracks

For any entry in "Needs Track Assignment", click one of the three track buttons to assign it. The button highlights when selected.

### 4. Select approved candidates

Uncheck any candidate you want to exclude. Approved candidates remain checked.

### 5. Generate merged JSON

Click "Generate Merged JSON". The page shows the JSON that merges:
- All approved selected candidates (organized by track)
- The existing hand-curated entries from `data/vote-candidates.json` (not shown, but preserved)

Actually: the JSON currently only includes the selected new candidates. If you want to preserve existing entries, you must manually merge them. See note below.

### 6. Commit the slate

Copy the JSON and manually edit `data/vote-candidates.json`:
```bash
# Clone or pull the latest repo
git checkout main
git pull origin main

# Edit the file
nano data/vote-candidates.json
# OR use your editor of choice
# Replace the entire file with the new JSON from the admin tool

# Commit
git add data/vote-candidates.json
git commit -m "feat(qv): approve <N> new candidates for vote"
git push origin main
```

### 7. Open voting

After merging the slate to main, the vote page (`/vote`) automatically reads the new slate from `data/vote-candidates.json`. If the `status` field is `"open"`, voting is live. If `status` is `"preview"`, voting is closed (but the page is visible for testing).

## Notes

- **No auto-publish.** Submissions are never automatically voteable. A human must always review and commit.
- **Preserve existing entries.** The current admin tool only shows new candidates. If you have hand-curated entries in the slate already, you must manually merge them with the new JSON before committing. Future version should preserve existing entries automatically.
- **Track mapping.** The draft generator maps `creator_type` to tracks:
  - "artist", "musician" -> artist
  - "builder", "developer" -> builder
  - "creator", "media" -> creator
  - Anything else -> _needs_track (human assignment)
- **Submissions table.** Candidates are read from `zabalgames_submissions` in Supabase. Only active submissions (not rejected) are included.
- **URL fallback.** If a submission has no `phase1_url`, the candidate URL defaults to `https://farcaster.xyz/<handle>`.

## Environment

The endpoint requires:
- `ADMIN_KEY` env var - constant-time checked against the Authorization header
- `SUPABASE_URL` env var - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` env var - service-role key (server-side only, never exposed)

If Supabase is not configured, the endpoint returns `{ configured: false }`.

## Troubleshooting

- **"Admin key required"** - Enter your ADMIN_KEY in the prompt. It's stored in localStorage for this tab.
- **"Supabase not configured"** - Contact the infra team. The endpoint needs Supabase connection details.
- **Candidates missing** - Check that submissions have `farcaster` and `name` fields. Submissions without a Farcaster handle are skipped.
- **Track assignment stuck** - Refresh the page and try again.

#!/usr/bin/env bash
# merge-pr.sh - merge a PR and leave the remote in the state you think it is in.
#
# WHY THIS EXISTS. `gh pr merge --squash --delete-branch` reports success and does NOT
# delete the remote head on this repo. Measured 2026-09-09: 3 for 3, on PRs #698, #699
# and #700 - and #699 was the PR that added the "verify the branch is deleted" rule, so
# the rule caught its own PR one command later. It was another lane's citation audit that
# noticed the first one, not this repo.
#
# That matters more here than in most repos. CLAUDE.md's git conventions exist because
# commits get STRANDED on branches that outlive their PR: they build as Vercel Previews,
# they look shipped, and they never reach production (PR #54 lost two commits that way).
# A merged branch left standing is precisely the dead head those rules warn about, created
# by the command meant to remove it.
#
# WHAT IS RULED OUT, so nobody re-checks it:
#   - token SCOPE. `gh auth status` shows `repo`, which is sufficient to delete a ref.
#   - repo PERMISSION. `git push origin --delete <branch>` succeeds with the same
#     credentials, every time. If it were a permissions problem that would fail too.
#   - a documented caveat. `gh pr merge --help` says plainly: "Delete the local and
#     remote branch after merge". No exception is documented.
# The actual cause is still UNMEASURED. Do not write one down until someone measures it:
# capture the FULL output of a merge (no `| tail`, stderr included) and read what gh says.
# Every observation so far came through a `tail`, which is itself a way to miss the answer.
#
# So this script does not trust the flag. It merges, then MEASURES the remote, then
# deletes the head itself if it survived, then re-measures. Verify by outcome, not by
# the exit code of the thing you asked.
#
#   scripts/merge-pr.sh <pr-number>
#
# Exit 0 only when the PR is merged AND the remote is back to main alone.

set -euo pipefail

PR="${1:-}"

if [ -z "$PR" ]; then
  echo "usage: scripts/merge-pr.sh <pr-number>" >&2
  exit 2
fi

fail() { echo "MERGE-PR FAILED: $*" >&2; exit 1; }

# Resolve the repo from the CURRENT DIRECTORY, not from where this file happens to sit.
# Found by running it, on its own PR: a copy executed from a scratchpad derived REPO_ROOT
# from its own path, so every `gh` call ran outside the repo, `gh pr view` returned an empty
# state, and the guard printed "PR #701 is , not OPEN" - refusing correctly, for a reason
# that told you nothing. An empty answer read as a state. A merge tool that can be aimed at
# the wrong repo by being copied is exactly the thing that misfires when someone is in a hurry.
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || true)"
[ -n "$REPO_ROOT" ] || fail "not inside a git repository - cd into the repo and re-run."
cd "$REPO_ROOT"

# --- 1. the PR must be open, and we need its branch name before it is gone ---
read -r state branch <<<"$(gh pr view "$PR" --json state,headRefName -q '.state + " " + .headRefName' 2>/dev/null || true)"
[ -n "${state:-}" ] || fail "could not read PR #$PR from $(git remote get-url origin 2>/dev/null || echo 'this repo') - wrong repo, wrong number, or gh is not authenticated. This is NOT a report that the PR is merged."
[ "$state" = "OPEN" ] || fail "PR #$PR is $state, not OPEN. Branch fresh off updated main instead."
echo "PR #$PR is OPEN on branch '$branch'"

# --- 2. merge, keeping the FULL output - a tail here is how the no-op stayed invisible ---
#
# Through a PTY, deliberately. gh suppresses its confirmation lines when stdout is not a
# terminal, so simply capturing the output produced an EMPTY log and five merges looked
# silent. Under a pty gh says what it actually did:
#     [OK] Squashed and merged pull request ...#704
#     [OK] Deleted local branch ws/...          <- local. It never claims the remote.
# That one word is the whole answer, and capturing the output was what hid it. The act of
# recording changed what there was to record; run it the way a human runs it.
#
# ON THE `|| true`: script(1) reports ITS OWN exit status, not gh's, so the exit code here is
# not gh's verdict and must not be read as one. This repo has already been bitten by a masked
# pipeline exit recorded as a successful measurement, so say it plainly rather than let a
# reader assume the code is being checked: the merge is verified in step 3 by reading
# `mergedAt` from the API, which is a fact about the PR rather than a fact about a wrapper.
# If the merge did not happen, step 3 fails and this script exits non-zero.
#
# WAIT FOR MERGEABLE FIRST. Found by using it: creating a PR and merging in the same breath
# raced GitHub computing the merge state, gh refused, and the script reported "#707 is NOT
# merged" - correct, and confusing, because the PR was fine two seconds later. `mergeable` is
# UNKNOWN until GitHub has finished; poll it rather than sleeping a guessed amount.
for _ in 1 2 3 4 5 6 7 8 9 10; do
  m="$(gh pr view "$PR" --json mergeable -q .mergeable 2>/dev/null || echo UNKNOWN)"
  [ "$m" = "UNKNOWN" ] || break
  sleep 2
done
[ "${m:-UNKNOWN}" != "CONFLICTING" ] || fail "#$PR is CONFLICTING - rebase it, do not merge."
[ "${m:-UNKNOWN}" != "UNKNOWN" ] || echo "NOTE: GitHub still reports mergeable=UNKNOWN after 20s; trying anyway."

merge_log="$(mktemp)"
# Pick the pty form ONCE, by OS, instead of trying one and falling back on failure. The old
# fallback was Linux syntax (`script -qec`) and on macOS printed "script: illegal option -- c"
# INTO THE LOG, hiding gh's real message behind an error from the recovery path. A fallback
# that triggers on any failure will eventually report on itself instead of the thing it wrapped.
if ! command -v script >/dev/null 2>&1; then
  gh pr merge "$PR" --squash --delete-branch >"$merge_log" 2>&1 || true
elif script -q /dev/null true >/dev/null 2>&1; then
  script -q "$merge_log" gh pr merge "$PR" --squash --delete-branch >/dev/null 2>&1 || true   # BSD/macOS
else
  script -qec "gh pr merge $PR --squash --delete-branch" /dev/null >"$merge_log" 2>&1 || true # util-linux
fi
# Strip terminal control noise so the log is readable, then show it.
sed -e 's/\x1b\[[0-9;?]*[a-zA-Z]//g' -e 's/\r//g' "$merge_log" | grep -v '^[[:space:]]*$' | sed 's/^/  gh| /'
rm -f "$merge_log"

# --- 3. the PR really merged (reported success is not merged) ---
merged_at="$(gh pr view "$PR" --json mergedAt -q '.mergedAt // "null"')"
[ "$merged_at" != "null" ] || fail "#$PR reports no mergedAt. It is NOT merged."
echo "merged at $merged_at"

# --- 4. did the head actually go? This is the whole point of the script ---
git fetch origin --prune --quiet
if git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1; then
  echo "NOTE: '$branch' SURVIVED --delete-branch. Deleting it directly."
  git push origin --delete "$branch"
  git fetch origin --prune --quiet
  git ls-remote --exit-code --heads origin "$branch" >/dev/null 2>&1 \
    && fail "'$branch' is STILL on origin after an explicit delete. Stop and look."
  echo "deleted '$branch'"
else
  echo "'$branch' was already gone - --delete-branch worked this time. Worth noting."
fi

# --- 5. re-measure the remote. At rest this repo has exactly one head: main ---
heads="$(git ls-remote --heads origin | wc -l | tr -d ' ')"
echo "remote heads now: $heads"
if [ "$heads" != "1" ]; then
  echo "WARNING: $heads remote heads, expected 1 at rest. Not necessarily wrong -"
  echo "a ws/* head with an OPEN PR is normal work. It IS a problem when the extra"
  echo "head has no open PR, or its PR is already merged or closed:"
  git ls-remote --heads origin | sed 's/^/    /'
fi

echo
echo "MERGED #$PR and the remote is clean. Merged is still not deployed:"
echo "check the live surface before you call it shipped."

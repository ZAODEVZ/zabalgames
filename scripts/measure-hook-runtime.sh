#!/usr/bin/env bash
# measure-hook-runtime.sh - how many seconds the SessionStart hook costs.
#
# WHY THIS EXISTS. validate.mjs went from 4 check groups to 15 in one evening. Every one of them
# was added because a real defect got through, and every one of them is worthless if the hook
# gets commented out for being slow. A permanently-red guard gets ignored; a slow one gets
# DELETED, which is the same failure arriving by a quieter door.
#
# The count is the number people quote. The runtime is the number that decides whether the
# count still exists next month. So it is recorded as its own measured label, next to the count,
# and a drift upward is the signal:
#
#   zao-measure "zabalgamez hook runtime s" -- bash /Users/zaalpanthaki/Documents/zabalgamez/scripts/measure-hook-runtime.sh
#   zao-measure --verify "zabalgamez hook runtime s"
#
# ROUNDED TO WHOLE SECONDS, ON PURPOSE. Three consecutive runs measured 3.65 / 4.06 / 4.13s, so a
# raw figure would DRIFT on noise every single time and the label would be trained to be ignored -
# the same disease this file exists to prevent, in the instrument that measures it. Whole seconds
# from the MEDIAN of three runs moves when something real changes and holds when nothing does.
#
# The threshold to act on is ~10s: past that, split the hook - keep the fast structural checks at
# session start and move the slow ones to pre-push. Do not just accept it; the point of the guards
# is that somebody still runs them.

set -euo pipefail
cd /Users/zaalpanthaki/Documents/zabalgamez

runs=()
for _ in 1 2 3; do
  start=$(python3 -c 'import time; print(time.time())')
  node scripts/validate.mjs --quiet >/dev/null 2>&1 || true
  node scripts/test-all.mjs --quiet >/dev/null 2>&1 || true
  end=$(python3 -c 'import time; print(time.time())')
  runs+=("$(python3 -c "print($end - $start)")")
done

# Median of three, rounded to whole seconds. Median rather than mean so one slow run - a cold
# filesystem cache, another process - does not record as a regression.
python3 -c "
import sys
xs = sorted(float(x) for x in sys.argv[1:])
print(round(xs[1]))
" "${runs[@]}"

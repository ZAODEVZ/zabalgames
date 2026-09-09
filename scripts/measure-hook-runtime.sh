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
# IT REPORTS A VERDICT, NOT A NUMBER, and the first version got this wrong. Rounding the median
# to whole seconds was supposed to absorb noise. It does not: five consecutive medians measured
# 4 4 4 6 4, so the recorded label DRIFTED on process-startup jitter within minutes of being
# created. A number that cries wolf trains its reader to ignore it - the exact disease this file
# was written to prevent, reproduced inside the instrument that measures it.
#
# So the recorded value answers the question that actually matters - IS THE HOOK STILL FAST
# ENOUGH - and DRIFT then means the threshold was crossed, which is worth a message. The raw
# seconds still print to stderr for a human reading the run; only the verdict is the value.
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

# Median of three (not mean, so one cold-cache run is not a regression), then a verdict against
# the threshold. SLOW is the actionable state: split the hook, keeping fast structural checks at
# session start and moving slow ones to pre-push.
python3 -c "
import sys
xs = sorted(float(x) for x in sys.argv[1:])
med = xs[1]
sys.stderr.write(f'runs: {\", \".join(f\"{x:.2f}s\" for x in xs)}  median {med:.2f}s  threshold 10s\\n')
print('OK' if med < 10 else 'SLOW')
" "${runs[@]}"

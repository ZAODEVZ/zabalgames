#!/usr/bin/env python3
"""Redact a KV export before it is committed to a PUBLIC repository.

WHY THIS EXISTS
---------------
The nightly backup solved the right problem - Season 1 lived only inside Upstash -
but it committed the whole keyspace to `ZAODEVZ/zabalgames`, which is public. The
first two runs (2026-08-12 01:07:57Z and 01:11:30Z) published 11 entrants' personal
email addresses and 50 per-voter ballots. Neither is public anywhere else, and none
of the addresses are on the `pii-hygiene.md` allowlist.

The export endpoint itself is admin-gated and stays COMPLETE - a restore needs
everything. This script sits between that endpoint and the public commit, so the
artifact in git is the part that is safe to publish.

WHAT IT REMOVES, AND WHY EACH ONE
---------------------------------
  qv:ballots:*            Per-voter ballots. Private by design; the aggregate
                          `qv:tally:*` is kept, so results stay reconstructable.
  zabal:agent:tok:*       The agent auth TOKEN is the key NAME (written at
                          api/submissions.mjs:417, authenticated at api/agent.mjs:71).
                          Currently empty, so this is a latent leak rather than a
                          live one - which is exactly why it must be handled before
                          the first agent registers, not after.
  zabal:profile:nonce:*   Short-lived auth nonces.
  zabal:notif:tokens      Push notification tokens.

  ...plus every email-shaped string in any remaining value, replaced in place.
  Submission documents carry entrant contact details, so dropping whole keys is
  not enough - the addresses have to come out of the values too.

WHAT THIS COSTS - SAY IT PLAINLY
--------------------------------
The committed backup can no longer restore entrant contact details or individual
ballots. It CAN restore every submission, the tallies, the points board, profiles,
clips, comments and the rest of the keyspace. That is the trade: the public copy
reconstructs the season, not the people.

If a complete restore is ever needed, take it from `GET /api/export` directly with
the admin key. That path is unchanged and still returns everything.

HONEST FAILURE
--------------
A redactor that silently passes data through is worse than none, because the commit
looks reviewed. This exits non-zero on any error, and it writes a `redacted` block
into the output recording exactly what it dropped, so the file states its own limits.
"""

import json
import re
import sys

# Whole keys dropped by prefix. Exact-match keys are listed without a trailing colon.
DROP_PREFIXES = (
    "qv:ballots:",
    "zabal:agent:tok:",
    "zabal:profile:nonce:",
)
DROP_EXACT = ("zabal:notif:tokens",)

EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")
EMAIL_PLACEHOLDER = "[redacted-email]"

# Public ZAO role addresses may stay - they are already published everywhere.
# Mirrors the allowlist in .claude/rules/pii-hygiene.md in the ZAOOS repo.
ALLOWED_EMAILS = {
    "zaal@thezao.com",
    "zaalp99@gmail.com",
    "zaal@bettercallzaal.com",
    "zoe-zao@agentmail.to",
    "hello@thezao.com",
    "support@thezao.com",
    "info@thezao.com",
}


def scrub_emails(value, counter):
    """Replace non-allowlisted email addresses anywhere inside a value."""
    if isinstance(value, str):
        def sub(m):
            if m.group(0).lower() in ALLOWED_EMAILS:
                return m.group(0)
            counter[0] += 1
            return EMAIL_PLACEHOLDER
        return EMAIL_RE.sub(sub, value)
    if isinstance(value, list):
        return [scrub_emails(v, counter) for v in value]
    if isinstance(value, dict):
        return {k: scrub_emails(v, counter) for k, v in value.items()}
    return value


def redact(doc):
    data = doc.get("data")
    if not isinstance(data, dict):
        raise SystemExit("export has no data object - refusing to write a backup")

    dropped = {}
    kept = {}
    for key, value in data.items():
        if key in DROP_EXACT:
            dropped[key] = dropped.get(key, 0) + 1
            continue
        prefix = next((p for p in DROP_PREFIXES if key.startswith(p)), None)
        if prefix:
            dropped[prefix] = dropped.get(prefix, 0) + 1
            continue
        kept[key] = value

    counter = [0]
    kept = {k: scrub_emails(v, counter) for k, v in kept.items()}

    out = dict(doc)
    out["data"] = kept
    out["count"] = len(kept)
    out["redacted"] = {
        "note": (
            "This repository is public. Per-voter ballots, auth tokens/nonces and "
            "entrant email addresses are removed before commit. For a complete "
            "restore use GET /api/export with the admin key."
        ),
        "keys_dropped": dropped,
        "keys_kept": len(kept),
        "emails_redacted": counter[0],
    }
    return out


def main():
    if len(sys.argv) != 3:
        raise SystemExit("usage: redact-export.py <in.json> <out.json>")

    with open(sys.argv[1]) as fh:
        doc = json.load(fh)

    out = redact(doc)

    # Prove the redaction actually worked rather than trusting that it did. A
    # scrubber that quietly no-ops is the failure this whole change is about.
    blob = json.dumps(out["data"])
    leaked = {a for a in EMAIL_RE.findall(blob) if a.lower() not in ALLOWED_EMAILS}
    if leaked:
        raise SystemExit(
            "redaction failed: %d non-allowlisted address(es) survived" % len(leaked)
        )
    for key in out["data"]:
        if key in DROP_EXACT or any(key.startswith(p) for p in DROP_PREFIXES):
            raise SystemExit("redaction failed: %s survived" % key)

    with open(sys.argv[2], "w") as fh:
        json.dump(out, fh, indent=1, sort_keys=True)

    print(
        "redacted: %d keys kept, %s dropped, %d email(s) scrubbed"
        % (out["redacted"]["keys_kept"], dropped_summary(out), counter_summary(out))
    )


def dropped_summary(out):
    d = out["redacted"]["keys_dropped"]
    return ", ".join("%s x%d" % (k, v) for k, v in sorted(d.items())) or "nothing"


def counter_summary(out):
    return out["redacted"]["emails_redacted"]


if __name__ == "__main__":
    main()

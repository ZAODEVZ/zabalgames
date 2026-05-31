# Terminal handoff -> see /CLAUDE.md

This file is superseded. The canonical working context (current state, storage,
conventions, what's left) now lives in **[/CLAUDE.md](../CLAUDE.md)** so there is a
single source of truth across web + terminal sessions.

Start any session with:

```
git fetch origin --prune && git pull --ff-only origin main
```

then read `/CLAUDE.md`.

Note: the storage backend is **Upstash Redis** (live). Any older instruction to
"wire Supabase / run db/supabase-activity.sql" is obsolete - that file was deleted.

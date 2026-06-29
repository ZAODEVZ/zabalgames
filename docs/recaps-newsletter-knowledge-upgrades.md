# Recaps + newsletter - knowledge-density upgrades

Ways to share more info, embed more knowledge, and make every recap a gateway, not a dead end.
Grounded in the current coverage (28 recaps): video 22, transcript 25, takeaways 25, topics 25,
**chapters only 8**, thumbnails 3, no cross-links, no pull-quotes, no resources-mentioned.

Brand rules apply (no emojis, no em dashes, "100+", "digital creators"/"builders").

## RECAP PAGES - embed more knowledge per session

Ranked by leverage.

1. **Chapters / timestamped best moments (20 of 28 missing).** The single biggest navigation +
   knowledge win. AI-generate 5-8 timestamped chapters from each transcript and add them to the
   recap (`chapters: [{t, label}]`). The page already renders them as a deep-linkable "Best
   moments" list that seeks the video. Turns a 45-min watch into a scannable index.
2. **Related sessions.** A cross-link block (3 recaps sharing the most topics / same track) at the
   bottom of every page. One ingest-template change; makes each recap a gateway to more. Zero new
   data needed - computed from `topics` + `track`.
3. **Resources mentioned.** Pull the tools, projects, repos, and links named in the talk
   (FlowStage app, Snapchain repo, Magenta, POIDH, etc.) into a "Mentioned in this session" list.
   Extract from the transcript at ingest; huge for builders who want to go do the thing.
4. **Pull-quotes.** Surface 2-3 standout lines from the transcript near the top - the human hook
   that makes someone press play or read on.
5. **Build from this.** A one-line "what you could ship from this" per recap that ties the session
   to the July open build (the recap becomes a build prompt, not just a watch).
6. **Speaker card.** Who they are in one line + their project link + handle, so a recap introduces
   the person, not just the talk. (`link`/`link_label` already exist on 16 of 28 - extend to all.)
7. **Thumbnails (25 of 28 missing).** A card per session for the page + social shares. FlowStage or
   a templated Canva can batch these.
8. **Feed recaps into Bonfire.** Every ingested session posts a natural-language episode to the
   ZABAL Bonfire knowledge graph (summary + takeaways + topics + speaker), so the whole season
   becomes queryable knowledge, and `/graph` surfaces it. One cron at ingest time.

## NEWSLETTER - share more, connect more

1. **"Build from this" per session.** One line tying each recap to a July build - the recap stops
   being a link and becomes a prompt. Reuses the recap's "build from this" field.
2. **Theme of the week.** A 2-3 line synthesis up top connecting the sessions ("three takes on
   owning your own tools"), so the week reads as one story, not a list.
3. **Track tags.** Label each session [artist] / [builder] / [creator] so a reader scans straight
   to their lane.
4. **Quote of the week.** One pulled line from a standout session - the hook that earns the open.
5. **By the numbers.** Sessions to date, hours of content kept, 100+ community - quiet social
   proof, refreshed each week.
6. **Inline speaker/project links.** Link the guest's project + handle in the recap paragraph, not
   only the recordings page.
7. **A clip per session.** Embed a 30-60s highlight (the FlowStage/Opus clipping flywheel) so the
   email itself carries the moment, not just a link to it.

## Sequencing (what to do first)

1. **Chapters for the back catalog** - re-ingest each session with AI-generated chapters. Biggest
   per-page knowledge jump, no template change. (One session per pass.)
2. **Related-sessions block** - one ingest-template change + a regen, benefits all pages at once.
3. **Newsletter template** - bake in build-from-this, theme, track tags, quote of the week (this
   PR does the template; the data lands as chapters/quotes get generated).
4. **Resources-mentioned + speaker card + Bonfire feed** - richer ingest, do after the above.
5. **Thumbnails** - owner/Canva or FlowStage, parallel track.

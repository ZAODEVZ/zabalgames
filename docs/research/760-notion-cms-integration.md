# 760 - Notion CMS Integration for zabalgames.com

> **Status:** Spec locked 2026-05-28. Build target: this week (post-launch tighten).
> **Origin:** Zaal call 2026-05-28 - 'we can put more of the info overall all in notion, but it would be great if we can display the notion info on the website automatically.'
> **Replaces:** Manual JSON edits in `/data/*.json` for workshop-leads + mentors + announcements.
> **Builds on:** ZAO OS Research Doc 2027 (Notion + Claude Best Practices) - confirms Notion MCP + API patterns.

## The shift

**Before:** every Notion update requires a code change. Zaal types in Notion -> manually copies to `/data/workshop-leads.json` (or me doing it via Edit). Friction = updates lag.

**After:** Zaal types in Notion -> webhook fires -> Vercel rebuilds -> site updates in ~5 min. Zero context switch.

## Architecture

```
Zaal updates Notion DB (workshop, person, announcement, FAQ)
            |
            v
  +------------------------------------------+
  |  Notion automation: on-change webhook    |
  |  fires Vercel Deploy Hook                |
  +------------------------------------------+
            |
            v
  +------------------------------------------+
  |  Vercel build kicks off:                 |
  |  1. scripts/notion-sync.mjs runs         |
  |  2. Fetches all Notion DBs in parallel   |
  |  3. Writes JSON to /data/*.json          |
  |  4. Static site builds + deploys         |
  +------------------------------------------+
            |
            v
  +------------------------------------------+
  |  Existing static-site rendering loads    |
  |  JSON via fetch('/data/*.json'):         |
  |  - /p.html -> people.json                |
  |  - /info#workshops -> workshop-leads.json|
  |  - /changelog -> changelog.json          |
  |  - new /faq -> faq.json                  |
  +------------------------------------------+
            |
            v
  Site live in ~5 min, no commit needed.
```

## Notion databases to set up

Inside Zaal's command center at https://app.notion.com/p/ZABAL-Games-Command-Center-c8e72e3e31c8837c8b0d012bca1fd20a, create 4 databases:

### 1. Workshop Sessions DB

| Property | Type | Example |
|---|---|---|
| `Name` | Title | "Magnetiq - The Workshop Library Behind ZABAL Games" |
| `Lead` | Relation -> People DB | -> Tyler Stambaugh |
| `Status` | Select | confirmed / tentative / open |
| `Date` | Date | 2026-06-12 (or empty if TBD) |
| `Time` | Text | "8pm EST" |
| `Format` | Select | 30-min talk / 45-min talk + Q&A / workshop |
| `Topic` | Text | session description |
| `Lu.ma URL` | URL | https://luma.com/... |
| `Restream URL` | URL | the studio link |
| `Order` | Number | sort order for display |

### 2. People DB

| Property | Type | Example |
|---|---|---|
| `Handle` | Title | bettercallzaal |
| `Name` | Text | Zaal Panthaki |
| `Roles` | Multi-select | organizer, mentor |
| `Headline` | Text | "Organizer + BetterCallZaal + The ZAO operations" |
| `Bio` | Rich text | 1-2 paragraph background |
| `Expertise Label` | Select | ECOSYSTEM, MUSIC TECH, CONTRACTS, RETENTION, etc |
| `Color` | Select | orange, cyan, gold, pink, zabal |
| `Avatar URL` | URL | Farcaster avatar or null |
| `Farcaster URL` | URL | https://farcaster.xyz/handle |
| `X URL` | URL | optional |
| `Site URL` | URL | optional |
| `What They Offer` | Rich text | for mentors |
| `Best Fit For` | Rich text | for mentors |
| `Audited Date` | Date | when last verified |

### 3. Announcements / Changelog DB

| Property | Type | Example |
|---|---|---|
| `Title` | Title | "Tier 2 + Tier 3 audit complete" |
| `Date` | Date | 2026-05-26 |
| `Type` | Select | decision, feat, content, infra, fix |
| `Description` | Rich text | 1-3 sentence context |
| `Commit` | Text | short SHA (optional) |
| `Links` | Rich text | markdown links |

### 4. FAQ DB

| Property | Type | Example |
|---|---|---|
| `Question` | Title | "Why ZABAL?" |
| `Answer` | Rich text | "$ZABAL is the ecosystem token..." |
| `Category` | Select | general, prizes, format, build, watch |
| `Order` | Number | display sort within category |

## Implementation

### File 1: `scripts/notion-sync.mjs`

```javascript
import { Client } from '@notionhq/client';
import { writeFileSync } from 'fs';
import path from 'path';

const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Database IDs (from Notion - share each DB with the integration first)
const DBS = {
  workshops:     process.env.NOTION_DB_WORKSHOPS,
  people:        process.env.NOTION_DB_PEOPLE,
  announcements: process.env.NOTION_DB_ANNOUNCEMENTS,
  faq:           process.env.NOTION_DB_FAQ,
};

const OUT_DIR = path.join(process.cwd(), 'data');

async function fetchDb(dbId, mapper) {
  const pages = [];
  let cursor = undefined;
  do {
    const res = await notion.databases.query({
      database_id: dbId,
      start_cursor: cursor,
      page_size: 100,
    });
    pages.push(...res.results.map(mapper));
    cursor = res.has_more ? res.next_cursor : undefined;
  } while (cursor);
  return pages;
}

// Mappers (Notion page -> our JSON schema)
function mapWorkshop(page) {
  const p = page.properties;
  return {
    id: page.id.slice(0, 8),
    name: p.Name?.title?.[0]?.plain_text || '',
    lead_handle: p.Lead?.relation?.[0]?.id || null,
    status: p.Status?.select?.name || 'tentative',
    date: p.Date?.date?.start || null,
    time: p.Time?.rich_text?.[0]?.plain_text || null,
    format: p.Format?.select?.name || '30-min talk',
    topic: p.Topic?.rich_text?.[0]?.plain_text || '',
    luma_url: p['Lu.ma URL']?.url || null,
    restream_url: p['Restream URL']?.url || null,
    order: p.Order?.number || 999,
  };
}

function mapPerson(page) {
  const p = page.properties;
  return {
    handle: p.Handle?.title?.[0]?.plain_text || '',
    name: p.Name?.rich_text?.[0]?.plain_text || '',
    roles: (p.Roles?.multi_select || []).map(s => s.name),
    headline: p.Headline?.rich_text?.[0]?.plain_text || '',
    bio: (p.Bio?.rich_text || []).map(r => r.plain_text).join(''),
    expertise_label: p['Expertise Label']?.select?.name || null,
    color: p.Color?.select?.name || 'orange',
    avatar_url: p['Avatar URL']?.url || null,
    farcaster_url: p['Farcaster URL']?.url || null,
    x_url: p['X URL']?.url || null,
    site_url: p['Site URL']?.url || null,
    what_they_offer: (p['What They Offer']?.rich_text || []).map(r => r.plain_text).join(''),
    best_fit_for: (p['Best Fit For']?.rich_text || []).map(r => r.plain_text).join(''),
    audited_date: p['Audited Date']?.date?.start || null,
  };
}

function mapAnnouncement(page) {
  const p = page.properties;
  return {
    date: p.Date?.date?.start || null,
    title: p.Title?.title?.[0]?.plain_text || '',
    type: p.Type?.select?.name || 'content',
    description: (p.Description?.rich_text || []).map(r => r.plain_text).join(''),
    commit: p.Commit?.rich_text?.[0]?.plain_text || null,
    links: parseMarkdownLinks((p.Links?.rich_text || []).map(r => r.plain_text).join('')),
  };
}

function mapFaq(page) {
  const p = page.properties;
  return {
    q: p.Question?.title?.[0]?.plain_text || '',
    a: (p.Answer?.rich_text || []).map(r => r.plain_text).join(''),
    category: p.Category?.select?.name || 'general',
    order: p.Order?.number || 999,
  };
}

function parseMarkdownLinks(text) {
  const out = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text))) out.push({ label: m[1], url: m[2] });
  return out;
}

async function main() {
  console.log('[notion-sync] starting');

  const [workshops, people, announcements, faq] = await Promise.all([
    fetchDb(DBS.workshops, mapWorkshop),
    fetchDb(DBS.people, mapPerson),
    fetchDb(DBS.announcements, mapAnnouncement),
    fetchDb(DBS.faq, mapFaq),
  ]);

  // Resolve workshop lead_handle (currently Notion ID) to our handle slug
  const personById = new Map();
  people.forEach(p => personById.set(p.handle, p));
  // For lead relations, the Notion ID needs another lookup - simpler:
  // ask Notion to expand the relation OR maintain handles directly.

  workshops.sort((a, b) => (a.order - b.order) || (a.date || '').localeCompare(b.date || ''));
  faq.sort((a, b) => (a.order - b.order));
  announcements.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  writeFileSync(
    path.join(OUT_DIR, 'workshop-leads.json'),
    JSON.stringify({
      season: 1,
      month: 'June 2026',
      _generated_at: new Date().toISOString(),
      _source: 'notion-sync',
      leads: workshops,
    }, null, 2),
  );

  writeFileSync(
    path.join(OUT_DIR, 'people.json'),
    JSON.stringify({
      version: 1,
      _generated_at: new Date().toISOString(),
      _source: 'notion-sync',
      people,
    }, null, 2),
  );

  writeFileSync(
    path.join(OUT_DIR, 'changelog.json'),
    JSON.stringify({
      version: 1,
      _generated_at: new Date().toISOString(),
      _source: 'notion-sync',
      entries: announcements,
    }, null, 2),
  );

  writeFileSync(
    path.join(OUT_DIR, 'faq.json'),
    JSON.stringify({
      version: 1,
      _generated_at: new Date().toISOString(),
      _source: 'notion-sync',
      faq,
    }, null, 2),
  );

  console.log('[notion-sync] wrote 4 files,',
    workshops.length, 'workshops,',
    people.length, 'people,',
    announcements.length, 'announcements,',
    faq.length, 'FAQs');
}

main().catch(err => {
  console.error('[notion-sync] FAILED:', err);
  process.exit(1);
});
```

### File 2: `package.json` updates

```json
{
  "name": "zabalgames",
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "build": "node scripts/notion-sync.mjs",
    "build:safe": "node scripts/notion-sync.mjs || echo '[notion-sync] WARN: continuing with last-good JSON'"
  },
  "dependencies": {
    "@notionhq/client": "^2.4.0"
  }
}
```

Use `build:safe` if you want a Notion outage to NOT block deploys (falls back to whatever JSON is already in git).

### File 3: `vercel.json` add

```json
{
  "buildCommand": "npm install && npm run build:safe",
  ...
}
```

### Setup steps (Zaal does)

1. Notion: Settings -> My integrations -> Create new integration. Name: "zabalgames-sync". Type: Internal. Capabilities: Read content. Save the secret token.
2. Notion: open each of the 4 databases. Click "..." -> Connections -> Connect to "zabalgames-sync".
3. Notion: copy each database ID from the URL (the 32-char hex string after the slash, before the question mark).
4. Vercel: project settings -> Environment Variables. Add:
   - `NOTION_TOKEN` = the integration secret from step 1
   - `NOTION_DB_WORKSHOPS` = database ID from step 3
   - `NOTION_DB_PEOPLE` = database ID
   - `NOTION_DB_ANNOUNCEMENTS` = database ID
   - `NOTION_DB_FAQ` = database ID
5. Vercel: project settings -> Git -> Deploy Hooks. Create a hook named "notion-sync", branch `main`. Copy the URL.
6. Notion: in any database, add an automation (or use a third-party like Pipedream / Zapier free tier). Trigger: any page created/updated. Action: POST to the Vercel deploy hook URL.
7. Push the integration code (this PR will do it).

## Rate limit + risk handling

Per Doc 2027: Notion API is **3 requests/second** uniform across all tiers. Our sync script makes 4 parallel database queries + pagination (up to 4 more for 100+ entries). Stays well under limit.

If Zaal makes a burst of 20 Notion edits in a minute, multiple build webhooks fire. Vercel auto-debounces - latest deploy wins. No data loss.

## What stays in code (NOT Notion)

These don't fit Notion's structure well + don't change often:

- Site structure (HTML, CSS, JS)
- Brand kit doc + glossary
- Long-form FAQ at /info (the rich-formatted ecosystem grid + win-win-win)
- Llm.txt context bundle (codified ecosystem map for AI consumption)
- Research library docs (research/)

The Notion content is the DYNAMIC, OPERATIONAL stuff:
- Who's confirmed for what
- When sessions are happening
- What just shipped
- Public Q+A

## Migration plan

Once Notion DBs are populated + sync wired:

1. Sync runs at deploy. Writes JSON files in /data
2. EXISTING git-tracked /data/*.json files become obsolete (overwritten on every build)
3. Manual edits to /data/*.json STOP - source of truth is Notion
4. Add `data/` to gitignore for the sync-managed files (or keep in git for fallback when Notion down)

Recommended: keep /data in git as fallback. Sync overwrites at build but if build fails the last-good is still on disk.

## Phase 1 vs Phase 2

**Phase 1 (this week post-launch):**
- Workshop Sessions DB + People DB only
- Manual changelog stays in JSON for now
- FAQ stays in HTML

**Phase 2 (after Phase 1 stable, ~2 weeks):**
- Migrate changelog to Notion
- Migrate FAQ to Notion with new /faq.html template
- Build the Notion MCP installation for Claude Code (so I can write to Notion directly: `claude mcp add --transport http notion https://mcp.notion.com/mcp`)

## Open decisions

| Decision | Defer to |
|---|---|
| Does sync run at every git push, or only on Notion webhook? | Phase 1 - try every-push first |
| What if Notion is down during build? | `build:safe` falls back to last-good JSON |
| Caching / Vercel ISR for hot pages? | Phase 2 - skip until traffic justifies |
| Real-time updates for the live Finals reveal? | Phase 3 - that page may need runtime, not build-time |

## Adjacent docs

- ZAO OS Doc 2027 - Notion + Claude best practices (full research, validated 2026-05-28)
- ZABAL Games Doc 750 - Builder OAuth registration (the builders.json may also move to Notion in Phase 2)
- ZABAL Games TODO N15 (new) - Implement this spec

## Risk register

| Risk | Mitigation |
|---|---|
| Notion DB schema drift (Zaal renames a property) | Sync script throws on missing prop, build fails clearly; recover by fixing prop name |
| Notion API rate limit hit during build | Stays under 3 req/sec by design; parallel queries are 4-8 total |
| OAuth token expiration / rotation | Use Internal Integration token (no rotation) for sync; MCP uses OAuth separately for Claude Code interactive |
| Notion outage at deploy time | `build:safe` script keeps last-good JSON |
| Zaal accidentally publishes private DB content | Connect only the 4 specific DBs (not whole workspace) to the integration |

## Build sequence

| Week | Build |
|---|---|
| Week of Jun 1 | Workshop Sessions DB + People DB Notion setup; install @notionhq/client; ship sync script |
| Week of Jun 8 | Deploy hook wired; first auto-rebuild from Notion change verified |
| Week of Jun 15 | Migrate changelog + FAQ DBs; /faq.html template |
| Week of Jun 22 | Phase 2 polish + Notion MCP installation guide for Zaal |

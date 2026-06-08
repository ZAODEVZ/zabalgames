// Integration test for /crm: run the page's inline script in a mocked DOM with mocked
// fetch + location, then assert on the actually-rendered HTML. Plus consistency checks
// across crm.json, crm.txt, and the injected JSON-LD.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(ROOT, 'crm.html'), 'utf8');
const crmJson = JSON.parse(readFileSync(join(ROOT, 'data/crm.json'), 'utf8'));
const crmTxt = readFileSync(join(ROOT, 'crm.txt'), 'utf8');

let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  FAIL:', m); } };

// --- 1. consistency across the three artifacts ---
const n = crmJson.people.length;
ok(crmJson.count === n, `crm.json count field (${crmJson.count}) == people length (${n})`);
const ld = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
ok(ld.numberOfItems === n, `JSON-LD numberOfItems (${ld.numberOfItems}) == ${n}`);
ok(ld.itemListElement.length === n, `JSON-LD has ${n} list items`);
const txtPeople = (crmTxt.match(/^={70}$/gm) || []).length;
ok(txtPeople === n, `crm.txt has ${n} person blocks (got ${txtPeople})`);

// --- 2. data quality (the bugs we fixed stay fixed) ---
ok(!crmJson.people.some(p => /chat with|^fireside/i.test(p.name)), 'no event-title entries leaked in');
const zaals = crmJson.people.filter(p => (p.farcaster || '').toLowerCase() === 'bettercallzaal');
ok(zaals.length === 1, `Zaal is one merged record (got ${zaals.length})`);
ok(zaals[0] && ['Organizer', 'Mentor', 'Workshop lead'].every(r => zaals[0].roles.includes(r)), 'merged Zaal carries all three roles');

// --- 3. baked tier/xp present + tier matches roles (no drift) ---
const TIERS = ['Headliner', 'Builder', 'Mentor', 'Challenger'];
function deriveTier(roles = []) {
  if (roles.includes('Organizer') || roles.includes('Workshop lead')) return 'Headliner';
  if (roles.includes('Core builder') || roles.includes('Batches builder') || roles.includes('Partner')) return 'Builder';
  if (roles.includes('Mentor')) return 'Mentor';
  return 'Challenger';
}
ok(crmJson.people.every(p => TIERS.includes(p.tier)), 'every person has a valid tier');
ok(crmJson.people.every(p => typeof p.xp === 'number'), 'every person has numeric xp');
ok(crmJson.people.every(p => p.tier === deriveTier(p.roles)), 'baked tier matches role-derived tier');

// --- 4. render the page in a mocked DOM ---
function runPage(search) {
  const els = {};
  function el(id) {
    if (!els[id]) els[id] = {
      id, innerHTML: '', textContent: '', hidden: false, value: '',
      _handlers: {},
      addEventListener(t, fn) { this._handlers[t] = fn; },
      click() { this._handlers.click && this._handlers.click({ target: this }); },
      getAttribute(a) { return this['_attr_' + a] || (a === 'data-view' ? this._view : null); },
      setAttribute(a, v) { this['_attr_' + a] = v; },
      querySelectorAll() { return Object.assign([], { forEach: Array.prototype.forEach }); },
      classList: { toggle() {}, add() {}, remove() {} },
      closest() { return null },
    };
    return els[id];
  }
  const tabs = [
    Object.assign(el('tab-roster'), { _view: 'roster' }),
    Object.assign(el('tab-players'), { _view: 'players' }),
  ];
  const document = {
    getElementById: el,
    querySelectorAll: (s) => s === '.crm-tab' ? Object.assign(tabs.slice(), { forEach: Array.prototype.forEach }) : [],
    querySelector: (s) => s.includes('players') ? tabs[1] : tabs[0],
    createElement: () => el('tmp'),
  };
  const players = [
    { fid: 1, username: 'yerbearserker', pfpUrl: 'x', score: 120, address: '0x1' },
    { fid: 2, username: 'someone', pfpUrl: 'y', score: 40, address: '0x2' },
    { fid: 3, username: 'third', pfpUrl: 'z', score: 30 },
    { fid: 4, username: 'fourth', score: 10 },
    ...Array.from({ length: 9 }, (_, i) => ({ fid: 10 + i, username: 'p' + i, score: 5 - (i % 3) })),
  ];
  const activity = { configured: true, count: 7, recent: [
    { fid: 1, username: 'yerbearserker', action: 'cast', target: 't', ts: 1 },
    { fid: 2, username: 'someone', action: 'signup', target: 't', ts: 2 },
  ] };
  const fetchMock = (u) => {
    let body = [];
    if (u.startsWith('/data/crm.json')) body = crmJson;
    else if (u.startsWith('/api/leaderboard')) body = players;
    else if (u.startsWith('/api/activity')) body = activity;
    return Promise.resolve({ json: () => Promise.resolve(body) });
  };
  const sandbox = {
    document, fetch: fetchMock, URLSearchParams,
    location: { search, pathname: '/crm' },
    history: { replaceState() {} },
    window: {}, console,
  };
  const script = html.match(/<script>\s*\(function \(\) \{[\s\S]*?\}\)\(\);\s*<\/script>/)[0]
    .replace(/^<script>/, '').replace(/<\/script>$/, '');
  vm.createContext(sandbox);
  vm.runInContext(script, sandbox);
  return { els, sandbox, tabs };
}

// flush microtasks so the fetch .then chains settle
const { els, sandbox } = runPage('');
await new Promise(r => setTimeout(r, 50));

const grid = els['crm-grid'].innerHTML;
ok(/class="crm-card/.test(grid), 'roster grid rendered cards');
ok((grid.match(/crm-card/g) || []).length >= n, `roster rendered all ${n} cards`);
ok(/LVL \d/.test(grid), 'cards show a LVL chip');
ok(/crm-tier tier-Headliner/.test(grid), 'a Headliner tier label rendered');
ok(/Zaal Panthaki/.test(grid), 'Zaal Panthaki present in grid');
ok(/On the board #1/.test(grid), 'cross-link badge appears for a roster person on the board (yerbearserker)');

const stats = els['crm-stats'].innerHTML;
ok(/On the board/.test(stats) && /Active today/.test(stats), 'stats strip shows live cells');

const pg = els['players-grid'].innerHTML;
ok(/player-tier-head s-high">High Score/.test(pg), 'players board has a High Score tier header');
ok(/player-tier-head s-pro">Pro/.test(pg), 'players board has a Pro tier header');
ok(/#1/.test(pg) && /120 pts/.test(pg), 'top player rendered with score');

const tick = els['crm-ticker'].innerHTML;
ok(/@yerbearserker/.test(tick) && /shared|cast|joined/.test(tick), 'activity ticker rendered');

const tiersFilter = els['crm-tiers'].innerHTML;
ok(/Headliner \(\d+\)/.test(tiersFilter), 'tier filter chips show counts');

// --- 5. deep-link: ?tier=Headliner&view=players applies filter + opens players tab ---
const r2 = runPage('?tier=Headliner&view=players');
await new Promise(r => setTimeout(r, 50));
const grid2 = r2.els['crm-grid'].innerHTML;
const headlinerCount = crmJson.people.filter(p => p.tier === 'Headliner').length;
ok((grid2.match(/crm-card/g) || []).length === headlinerCount, `?tier=Headliner shows only ${headlinerCount} cards`);
ok(!r2.els['view-players'].hidden, '?view=players opened the Players tab');

// --- 6. per-person deep card: ?handle=bettercallzaal spotlights Zaal ---
const r3 = runPage('?handle=bettercallzaal');
await new Promise(r => setTimeout(r, 50));
const spot = r3.els['crm-spotlight'].innerHTML;
ok(!r3.els['crm-spotlight'].hidden, '?handle= reveals the spotlight panel');
ok(/class="spotlight"/.test(spot) && /Zaal Panthaki/.test(spot), 'spotlight renders the matched person (Zaal)');
ok(/LVL \d/.test(spot) && /crm-tier tier-/.test(spot), 'spotlight shows the level + tier');
ok(/View everyone/.test(spot), 'spotlight has a back-to-everyone link');

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);

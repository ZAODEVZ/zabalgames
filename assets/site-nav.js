// Shared site-wide directory menu for ZABAL Gamez.
//
// Adds a "Menu" button to the existing top nav (.arcade-nav-menu) on every page and,
// on click, opens a grouped panel linking to every subpage - so the whole site is
// reachable from the top of any page. One source of truth for the directory; add a
// page here once and it appears in the nav everywhere.
//
// The panel is appended to <body> (not inside the nav) so it does not inherit the
// nav's link styles, and it is positioned just under the header. Progressive
// enhancement: the static footer directory still works if this never runs.
(function () {
  var menu = document.querySelector('.arcade-nav-menu');
  var nav = document.querySelector('.arcade-nav');
  if (!menu || !nav || document.querySelector('.site-menu-btn')) return;

  var GROUPS = [
    ['The season', [
      ['Home', '/'],
      ['All the details', '/info.html'],
      ['Schedule', '/#schedule'],
      ['About', '/about.html'],
      ['Changelog', '/changelog.html']
    ]],
    ['Build', [
      ['Enter the July build', '/enter.html'],
      ["This season's builds", '/submissions'],
      ['Adoptable projects', '/projects.html'],
      ['Build ideas', '/build-ideas.html'],
      ['Builder playbook', '/playbook.html'],
      ['Lead a workshop', '/lead.html'],
      ['Mentor', '/mentor.html'],
      ['Dream leads', '/dream-leads.html'],
      ['The Finals', '/finals.html']
    ]],
    ['Watch + read', [
      ['Speakers', '/speakers.html'],
      ['Recordings', '/recordings'],
      ['Session recaps', '/recaps.html'],
      ['Data streams', '/streams.html'],
      ['Farcaster Batches', '/farcaster-batches.html'],
      ['Live now', '/live.html'],
      ['The arcade', '/game'],
      ['Season Run (play the buildathon)', '/quest'],
      ['ZAO 2048', '/play'],
      ['What should you build?', '/game/build-quiz'],
      ['Claim a pop', '/pops'],
      ['Daily update', '/today.html'],
      ['Mindful moments', '/mindful.html']
    ]],
    ['Explore', [
      ['ZAO graph', '/graph.html'],
      ['Leaderboard', '/leaderboard.html'],
      ['Winners', '/winners.html'],
      ['Research library', '/research.html'],
      ['Context file', '/context.html'],
      ['Install context', '/install.html'],
      ['People', '/crm.html'],
      ['Spaces', '/spaces.html']
    ]],
    ['Connect', [
      ['/zabal channel', 'https://farcaster.xyz/~/channel/zabal'],
      ['Newsletter', 'https://paragraph.com/@thezao'],
      ['All links', '/links.html'],
      ['Share', '/share.html'],
      ['Insert Coin', 'https://collect.zabalgamez.com']
    ]]
  ];

  function norm(p) { return (p || '').replace(/\/+$/, '').replace(/\.html$/, '') || '/'; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  var here = norm(location.pathname);

  // Season Run visit beacon: record which pages this device has explored, so the
  // /quest achievement board can auto-clear "visit" quests Minecraft-style.
  try {
    var zgv = JSON.parse(localStorage.getItem('zg-visited') || '[]');
    if (zgv.indexOf(here) === -1) { zgv.push(here); localStorage.setItem('zg-visited', JSON.stringify(zgv)); }
  } catch (e) { /* private mode etc - the quest page degrades gracefully */ }

  var grid = GROUPS.map(function (g) {
    var links = g[1].map(function (it) {
      var label = it[0], href = it[1];
      var ext = /^https?:/.test(href);
      var hash = href.indexOf('#') > -1;
      var active = (!ext && !hash && norm(href) === here) ? ' class="active" aria-current="page"' : '';
      var attrs = ext ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + href + '"' + active + attrs + '>' + esc(label) + '</a>';
    }).join('');
    return '<div class="smg"><h4>' + esc(g[0]) + '</h4>' + links + '</div>';
  }).join('');

  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'site-menu-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'site-menu-panel');
  btn.textContent = 'Menu';
  menu.insertBefore(btn, menu.firstChild);

  var panel = document.createElement('div');
  panel.className = 'site-menu-panel';
  panel.id = 'site-menu-panel';
  panel.hidden = true;
  panel.innerHTML = '<div class="site-menu-grid">' + grid + '</div>';
  document.body.appendChild(panel);

  function place() {
    var r = nav.getBoundingClientRect();
    panel.style.top = Math.max(0, r.bottom) + 'px';
  }
  function open() { panel.hidden = false; btn.setAttribute('aria-expanded', 'true'); place(); }
  function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }

  btn.addEventListener('click', function (e) { e.stopPropagation(); panel.hidden ? open() : close(); });
  document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  window.addEventListener('resize', function () { if (!panel.hidden) place(); });
  window.addEventListener('scroll', function () { if (!panel.hidden) place(); }, { passive: true });
})();

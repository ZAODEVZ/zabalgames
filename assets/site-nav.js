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

  // Keep --nav-h honest: the nav wraps to two rows on narrow screens, and sticky
  // elements (e.g. the /quest HUD) offset by this variable. Measure the real height.
  if (nav) {
    var setNavH = function () { document.documentElement.style.setProperty('--nav-h', nav.offsetHeight + 'px'); };
    setNavH();
    window.addEventListener('resize', setNavH);
  }

  // Standard footer on every page: pages that ship without a static .arcade-foot
  // get the shared directory injected, so no surface is a dead end.
  if (!document.querySelector('.arcade-foot')) {
    var foot = document.createElement('footer');
    foot.className = 'arcade-foot';
    foot.setAttribute('aria-label', 'Site directory');
    foot.innerHTML = '<div class="arcade-foot-inner">'
      + '<div class="arcade-foot-brand">'
      + '<span class="arcade-foot-logo pixel">ZABAL GAMEZ</span>'
      + "<p class=\"arcade-foot-tag\">The ZAO's 3-month Build-A-Thon. June workshops, July open build, August Finals. Free, open to anyone.</p>"
      + '<a href="https://collect.zabalgamez.com" class="arcade-coin" target="_blank" rel="noopener">Insert Coin</a>'
      + '</div>'
      + '<nav class="arcade-foot-col" aria-label="Play"><h4>Play</h4>'
      + '<a href="/">Home</a><a href="/info.html">All the Details</a><a href="/#schedule">Schedule</a><a href="/game">Arcade</a><a href="/quest">Season Run</a><a href="/live.html">Live - What\'s On Now</a></nav>'
      + '<nav class="arcade-foot-col" aria-label="Season"><h4>Season</h4>'
      + '<a href="/content">This Month</a><a href="/submissions">This Season\'s Builds</a><a href="/vote">Final Results</a><a href="/winners.html">Winners</a><a href="https://www.loops.house" target="_blank" rel="noopener">loops.house</a></nav>'
      + '<nav class="arcade-foot-col" aria-label="Data"><h4>Data</h4>'
      + '<a href="/recordings.html">Recordings</a><a href="/streams.html">Streams</a><a href="/recaps.html">Session Recaps</a><a href="/changelog.html">Changelog</a></nav>'
      + '<nav class="arcade-foot-col" aria-label="Connect"><h4>Connect</h4>'
      + '<a href="https://farcaster.xyz/~/channel/zabal" target="_blank" rel="noopener">/zabal channel</a><a href="https://paragraph.com/@thezao" target="_blank" rel="noopener">Newsletter</a><a href="/press.html">Press + Media Kit</a><a href="/links.html">All Links</a><a href="/share.html">Share</a></nav>'
      + '</div>'
      + '<div class="arcade-foot-bottom"><span class="pixel">INSERT COIN</span><span>zabalgamez.com - built with The ZAO</span></div>';
    document.body.appendChild(foot);
  }

  if (!menu || !nav || document.querySelector('.site-menu-btn')) return;

  // Lean season directory: the core loop up top, everything else reachable via /links
  // (the full page index) and contextual buttons on the related pages.
  var GROUPS = [
    ['The season', [
      ['Home', '/'],
      ['All the details', '/info.html'],
      ['Schedule', '/#schedule'],
      ['About', '/about.html'],
      ['Changelog', '/changelog.html']
    ]],
    ['Builds + Finals', [
      ['This Month - the Finals', '/content'],
      ["This season's projects", '/submissions'],
      ['Final vote results', '/vote'],
      ['Winners', '/winners.html'],
      ['The season on loops.house', 'https://www.loops.house']
    ]],
    ['Watch + read', [
      ['Recordings', '/recordings'],
      ['Session recaps', '/recaps.html'],
      ['Speakers', '/speakers.html'],
      ['Live now', '/live.html'],
      ['The arcade', '/game']
    ]],
    ['Connect', [
      ['/zabal channel', 'https://farcaster.xyz/~/channel/zabal'],
      ['Newsletter', 'https://paragraph.com/@thezao'],
      ['All links (full index)', '/links.html'],
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

  // Mobile keeps one compact row: brand, the primary conversion action, and Menu.
  // The page-specific links remain available in the directory panel.
  var quickSubmit = document.createElement('a');
  quickSubmit.className = 'site-submit-link';
  quickSubmit.href = '/content';
  quickSubmit.textContent = 'Finals';
  if (here === '/content') quickSubmit.setAttribute('aria-current', 'page');
  menu.insertBefore(quickSubmit, btn);

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

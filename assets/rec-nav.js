// Shared top navigation for ZABAL Gamez recording pages.
//
// Reads /recordings/index.json (the generated library index) and renders, into the
// #rec-nav element: a Back button, an "All recordings" link, a jump-to row with every
// recording, and Previous/Next links for the current page. New recordings appear
// automatically once the index is rebuilt - no per-page edits needed.
//
// Progressive enhancement: if the fetch fails the page is still fully usable.
(function () {
  var mount = document.getElementById('rec-nav');
  if (!mount) return;

  function norm(p) { return (p || '').replace(/\/+$/, '').replace(/\.html$/, '') || '/'; }
  function pathOf(u) { try { return norm(new URL(u, location.origin).pathname); } catch (e) { return norm(u); } }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }

  var here = norm(location.pathname);

  fetch('/recordings/index.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      var recs = (data && data.recordings) ? data.recordings.slice().reverse() : []; // oldest-first
      if (!recs.length) return;

      var items = recs.map(function (item) {
        var path = pathOf(item.page || item.url);
        // A path is /recordings/<n> (flat workshop) or /recordings/<ns>/<n> (e.g. fireside, zao).
        var parts = path.split('/').filter(Boolean); // ['recordings','zao','1'] or ['recordings','4']
        var num = parts[parts.length - 1] || '';
        var ns = parts.length >= 3 ? parts[parts.length - 2] : '';
        var label, jump;
        if (ns) {
          var pretty = ns === 'fireside' ? 'Fireside' : ns.toUpperCase();
          label = pretty + ' ' + num;
          jump = label;
        } else {
          label = 'Workshop ' + num;
          jump = num;
        }
        var track = (item.track || '').toLowerCase();
        var date = item.date || '';
        var presenter = item.presenter || '';
        var search = [label, item.title, presenter, item.org, track, (item.topics || []).join(' ')]
          .filter(Boolean).join(' ').toLowerCase();
        return {
          path: path,
          jump: jump,    // compact label for the jump row
          label: label,  // full label for prev/next
          title: item.title || '',
          presenter: presenter,
          track: track,
          date: date,
          search: search,
          tip: (item.title || '') + (presenter ? ' - ' + presenter : '')
        };
      });

      var cur = -1;
      for (var i = 0; i < items.length; i++) { if (items[i].path === here) { cur = i; break; } }

      // A searchable picker of every session - shows presenter + track + date, filters as
      // you type, and is keyboard navigable. Scales as the library grows (the old native
      // <select> could only show one line of text and offered no search).
      var rows = items.map(function (it, i) {
        var sub = [it.presenter, it.date].filter(Boolean).map(esc).join(' · ');
        var trk = it.track ? '<span class="rn-opt-track t-' + esc(it.track) + '">' + esc(it.track) + '</span>' : '';
        return '<li role="option" id="rn-opt-' + i + '" class="rn-opt' + (i === cur ? ' is-current' : '') +
            '" data-path="' + esc(it.path) + '" data-search="' + esc(it.search) + '"' +
            (i === cur ? ' aria-selected="true"' : '') + '>' +
            '<span class="rn-opt-num">' + esc(it.label) + '</span>' +
            '<span class="rn-opt-body"><span class="rn-opt-title">' + esc(it.title) + '</span>' +
            (sub ? '<span class="rn-opt-sub">' + sub + '</span>' : '') + '</span>' +
            trk +
          '</li>';
      }).join('');

      var curText = cur > -1 ? (items[cur].label + (items[cur].title ? ' - ' + items[cur].title : '')) : 'Jump to a recording';

      var prevnext = '';
      if (cur > 0) {
        var p = items[cur - 1];
        prevnext += '<a class="rn-prev" href="' + p.path + '" title="' + esc(p.tip) + '">&larr; ' + esc(p.label) + '</a>';
      }
      if (cur > -1 && cur < items.length - 1) {
        var n = items[cur + 1];
        prevnext += '<a class="rn-next" href="' + n.path + '" title="' + esc(n.tip) + '">' + esc(n.label) + ' &rarr;</a>';
      }

      mount.innerHTML =
        '<div class="rn-bar">' +
          '<button type="button" class="rn-back">&larr; Back</button>' +
          (cur === -1 ? '' : '<a class="rn-all" href="/recordings">All recordings</a>') +
          '<span class="rn-spacer"></span>' +
          (prevnext ? '<span class="rn-prevnext">' + prevnext + '</span>' : '') +
        '</div>' +
        '<div class="rn-jump">' +
          '<span class="rn-jump-label" id="rn-jump-label">Jump to</span>' +
          '<button type="button" class="rn-jump-trigger" aria-haspopup="listbox" aria-expanded="false" aria-labelledby="rn-jump-label">' +
            '<span class="rn-jump-cur">' + esc(curText) + '</span><span class="rn-jump-caret" aria-hidden="true">&#9662;</span>' +
          '</button>' +
          '<div class="rn-jump-panel" hidden>' +
            '<input type="text" class="rn-jump-search" placeholder="Search by title, speaker, topic, track" aria-label="Search recordings" autocomplete="off">' +
            '<ul class="rn-jump-list" role="listbox" aria-label="Recordings">' + rows + '</ul>' +
            '<p class="rn-jump-empty" hidden>No recordings match.</p>' +
          '</div>' +
        '</div>';

      var back = mount.querySelector('.rn-back');
      if (back) back.addEventListener('click', function () {
        if (history.length > 1) history.back(); else location.href = '/recordings';
      });

      var trigger = mount.querySelector('.rn-jump-trigger');
      var panel = mount.querySelector('.rn-jump-panel');
      var search = mount.querySelector('.rn-jump-search');
      var list = mount.querySelector('.rn-jump-list');
      var empty = mount.querySelector('.rn-jump-empty');
      var allOpts = list ? [].slice.call(list.querySelectorAll('.rn-opt')) : [];
      var activeIdx = -1; // index into the currently-visible options

      function visibleOpts() { return allOpts.filter(function (o) { return !o.hidden; }); }

      function setActive(idx) {
        var vis = visibleOpts();
        vis.forEach(function (o) { o.classList.remove('is-active'); });
        activeIdx = idx;
        if (idx >= 0 && idx < vis.length) {
          var el = vis[idx];
          el.classList.add('is-active');
          el.scrollIntoView({ block: 'nearest' });
          if (list) list.setAttribute('aria-activedescendant', el.id);
        } else if (list) {
          list.removeAttribute('aria-activedescendant');
        }
      }

      function filter() {
        var q = (search.value || '').trim().toLowerCase();
        var shown = 0;
        allOpts.forEach(function (o) {
          var match = !q || o.getAttribute('data-search').indexOf(q) !== -1;
          o.hidden = !match;
          if (match) shown++;
        });
        if (empty) empty.hidden = shown > 0;
        setActive(shown ? 0 : -1);
      }

      function open() {
        if (!panel.hidden) return;
        panel.hidden = false;
        trigger.setAttribute('aria-expanded', 'true');
        search.value = '';
        filter();
        // start on the current recording if it is in view
        var vis = visibleOpts();
        var ci = vis.findIndex ? vis.findIndex(function (o) { return o.classList.contains('is-current'); }) : -1;
        if (ci > 0) setActive(ci);
        search.focus();
      }
      function close() {
        if (panel.hidden) return;
        panel.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
      function go(el) {
        var path = el && el.getAttribute('data-path');
        if (path && path !== here) location.href = path; else close();
      }

      if (trigger) trigger.addEventListener('click', function () { panel.hidden ? open() : close(); });
      if (search) search.addEventListener('input', filter);

      if (panel) panel.addEventListener('keydown', function (e) {
        var vis = visibleOpts();
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(Math.min(activeIdx + 1, vis.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(Math.max(activeIdx - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); if (vis[activeIdx]) go(vis[activeIdx]); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); trigger.focus(); }
      });

      if (list) {
        list.addEventListener('click', function (e) {
          var li = e.target.closest ? e.target.closest('.rn-opt') : null;
          if (li) go(li);
        });
        list.addEventListener('mousemove', function (e) {
          var li = e.target.closest ? e.target.closest('.rn-opt') : null;
          if (!li) return;
          var vis = visibleOpts();
          var idx = vis.indexOf(li);
          if (idx !== -1 && idx !== activeIdx) setActive(idx);
        });
      }

      document.addEventListener('click', function (e) {
        if (!panel.hidden && !mount.contains(e.target)) close();
      });
    })
    .catch(function () { /* nav is a progressive enhancement; ignore failures */ });
})();

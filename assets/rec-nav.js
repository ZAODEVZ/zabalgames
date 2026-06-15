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
        return {
          path: path,
          jump: jump,    // compact label for the jump row
          label: label,  // full label for prev/next
          title: item.title || '',
          tip: (item.title || '') + (item.presenter ? ' - ' + item.presenter : '')
        };
      });

      var cur = -1;
      for (var i = 0; i < items.length; i++) { if (items[i].path === here) { cur = i; break; } }

      // A single dropdown of every session (full title) - scales as the library grows,
      // instead of a row of numbered chips that overflows.
      var options = items.map(function (it, i) {
        var text = it.label + (it.title ? ' - ' + it.title : '');
        return '<option value="' + esc(it.path) + '"' + (i === cur ? ' selected' : '') + '>' + esc(text) + '</option>';
      }).join('');

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
          '<label class="rn-jump-label" for="rn-jump-select">Jump to</label>' +
          '<select id="rn-jump-select" class="rn-select" aria-label="Jump to a recording">' + options + '</select>' +
        '</div>';

      var back = mount.querySelector('.rn-back');
      if (back) back.addEventListener('click', function () {
        if (history.length > 1) history.back(); else location.href = '/recordings';
      });

      var sel = mount.querySelector('.rn-select');
      if (sel) sel.addEventListener('change', function () {
        if (this.value && this.value !== here) location.href = this.value;
      });
    })
    .catch(function () { /* nav is a progressive enhancement; ignore failures */ });
})();

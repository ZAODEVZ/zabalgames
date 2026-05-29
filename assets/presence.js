// ZABAL Games - presence widget.
//
// Fills an element with id="zabal-presence" with a live count of builders
// active today plus the most recent social actions (cast / share / signup),
// read from GET /api/activity. Tapping a row opens that builder's Farcaster
// profile via window.ZABAL.viewProfile when running inside a Mini App.
//
// Built with DOM nodes (not innerHTML) so server-resolved usernames + pfp URLs
// can never inject markup. Hides itself when the backend is not configured.

(function () {
  var host = document.getElementById('zabal-presence');
  if (!host) return;

  var VERB = { cast: 'cast on /zabal', share: 'shared ZABAL Games', signup: 'signed up' };

  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); }

  function render(d) {
    clear(host);
    if (!d || !d.configured) { host.style.display = 'none'; return; }
    host.style.display = '';

    var head = document.createElement('div');
    head.className = 'presence-head';
    head.textContent = d.count > 0
      ? d.count + ' builder' + (d.count === 1 ? '' : 's') + ' here today'
      : 'Be the first in today';
    host.appendChild(head);

    var recent = (d.recent || []).slice(0, 8);
    if (!recent.length) return;

    var ul = document.createElement('ul');
    ul.className = 'presence-list';
    recent.forEach(function (e) {
      var li = document.createElement('li');
      if (e.fid && window.ZABAL && window.ZABAL.viewProfile) {
        li.classList.add('clickable');
        li.addEventListener('click', function () { window.ZABAL.viewProfile(Number(e.fid)); });
      }
      if (e.pfpUrl) {
        var img = document.createElement('img');
        img.src = e.pfpUrl;
        img.alt = '';
        img.width = 20; img.height = 20;
        li.appendChild(img);
      }
      var span = document.createElement('span');
      span.textContent = '@' + (e.username || e.fid) + ' ' + (VERB[e.action] || e.action);
      li.appendChild(span);
      ul.appendChild(li);
    });
    host.appendChild(ul);
  }

  function load() {
    fetch('/api/activity', { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(render)
      .catch(function () { host.style.display = 'none'; });
  }

  load();
  setInterval(load, 30000);
})();

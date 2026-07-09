// ZABAL Gamez - clip gallery widget.
//
// Drop-in: a recording page with a <section id="zg-clips"></section> mount gets a
// gallery of the clips people have submitted for this recording (from api/clips.mjs).
// Each clip shows its title, who clipped it, a Watch link, the bounty it claimed, and a
// like button (one like per FID, verified). Sits above the "Submit a clip" form so a
// viewer sees what already exists, then adds their own. Self-configures from the URL
// path - same recording id the comment widget uses. No-ops cleanly when empty.

(function () {
  var mount = document.getElementById('zg-clips');
  if (!mount) return;

  var Z = window.ZABAL || {};
  var REC_ID = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9/_-]/g, '') || 'recordings';

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return 'link'; } }

  var css = '' +
    '.zgg{margin:1.6rem 0 0.4rem;}' +
    '.zgg-head{display:flex;align-items:baseline;justify-content:space-between;gap:0.6rem;margin:0 0 0.7rem;}' +
    '.zgg-head h2{font-family:Syne,sans-serif;font-size:1.2rem;margin:0;}' +
    '.zgg-count{color:var(--text-dim,#8a8a94);font-size:0.82rem;}' +
    '.zgg-all{color:var(--cyan,#39d4ff);font-size:0.82rem;text-decoration:none;}' +
    '.zgg-list{display:grid;gap:0.6rem;}' +
    '.zgg-card{display:flex;align-items:flex-start;gap:0.75rem;background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-left:3px solid var(--cyan,#39d4ff);border-radius:12px;padding:0.7rem 0.85rem;}' +
    '.zgg-main{flex:1 1 auto;min-width:0;}' +
    '.zgg-title{font-family:Syne,sans-serif;font-weight:700;font-size:0.96rem;color:var(--text,#e9e7e2);text-decoration:none;line-height:1.3;}' +
    '.zgg-title:hover{color:var(--cyan,#39d4ff);}' +
    '.zgg-meta{display:block;color:var(--text-dim,#8a8a94);font-size:0.78rem;margin-top:0.2rem;}' +
    '.zgg-links{margin-top:0.4rem;}' +
    '.zgg-links a{color:var(--cyan,#39d4ff);font-size:0.8rem;text-decoration:none;margin-right:0.8rem;}' +
    '.zgg-links a:hover{text-decoration:underline;}' +
    '.zgg-like{flex:0 0 auto;display:inline-flex;align-items:center;gap:0.3rem;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:999px;color:var(--text,#e9e7e2);font:inherit;font-size:0.82rem;padding:0.3rem 0.7rem;cursor:pointer;}' +
    '.zgg-like:hover{border-color:var(--cyan,#39d4ff);}' +
    '.zgg-like.liked{border-color:var(--zabal,#7c5cff);color:var(--zabal,#7c5cff);}' +
    '.zgg-like:disabled{opacity:0.6;cursor:default;}' +
    '.zgg-empty{color:var(--text-dim,#8a8a94);font-size:0.86rem;line-height:1.5;background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.8rem 0.95rem;}' +
    '.zgg-bounty{color:var(--text-dim,#8a8a94);font-size:0.84rem;margin:0 0 0.7rem;line-height:1.5;}' +
    '.zgg-bounty a{color:var(--cyan,#39d4ff);text-decoration:none;}' +
    '.zgg-bounty a:hover{text-decoration:underline;}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function likeBtn(clip) {
    var b = document.createElement('button');
    b.className = 'zgg-like';
    b.type = 'button';
    b.innerHTML = '<span>+</span> <span class="zgg-n">' + (clip.likes || 0) + '</span>';
    b.setAttribute('aria-label', 'Like this clip');
    b.addEventListener('click', function () {
      if (!Z.likeClip) { b.disabled = true; b.title = 'Open in the Farcaster app to like.'; return; }
      b.disabled = true;
      Z.likeClip(REC_ID, clip.cid).then(function (r) {
        if (r && r.ok) {
          b.querySelector('.zgg-n').textContent = r.likes;
          if (r.firstLike) b.classList.add('liked');
          b.disabled = false;
        } else {
          b.disabled = false;
          if (r && r.reason === 'not-in-miniapp') b.title = 'Open in the Farcaster app to like.';
        }
      }).catch(function () { b.disabled = false; });
    });
    return b;
  }

  function renderCard(clip) {
    var card = document.createElement('div');
    card.className = 'zgg-card';
    var main = document.createElement('div');
    main.className = 'zgg-main';
    var who = clip.handle ? '@' + esc(clip.handle) : 'someone';
    var links = '<a href="' + esc(clip.clipUrl) + '" target="_blank" rel="noopener">Watch (' + esc(host(clip.clipUrl)) + ')</a>';
    if (clip.bountyId) links += '<a href="https://poidh.xyz/base/bounty/' + esc(clip.bountyId) + '" target="_blank" rel="noopener">Bounty #' + esc(clip.bountyId) + '</a>';
    main.innerHTML =
      '<a class="zgg-title" href="' + esc(clip.clipUrl) + '" target="_blank" rel="noopener">' + esc(clip.title || 'Clip') + '</a>' +
      '<span class="zgg-meta">Clipped by ' + who + '</span>' +
      '<div class="zgg-links">' + links + '</div>';
    card.appendChild(main);
    card.appendChild(likeBtn(clip));
    return card;
  }

  function bountyLine(bounty) {
    if (!bounty) return '';
    var amt = bounty.amountEth ? (bounty.amountEth + ' ETH pot open') : 'open bounty';
    return '<p class="zgg-bounty">This recording has an ' + amt + ' - <a href="https://poidh.xyz/base/bounty/' +
      esc(bounty.bountyId) + '" target="_blank" rel="noopener">bounty #' + esc(bounty.bountyId) + '</a></p>';
  }

  function render(clips, bounty) {
    mount.className = 'zgg';
    mount.innerHTML = '';
    if (!clips.length) {
      mount.innerHTML =
        '<div class="zgg-head"><h2>Clips</h2></div>' +
        bountyLine(bounty) +
        '<div class="zgg-empty">No clips yet. Cut a 45-60s moment below and you could be the first - best clip wins the bounty.</div>';
      return;
    }
    var head = document.createElement('div');
    head.className = 'zgg-head';
    head.innerHTML = '<h2>Clips <span class="zgg-count">' + clips.length + '</span></h2>' +
      '<a class="zgg-all" href="/clips">All clips -&gt;</a>';
    mount.appendChild(head);
    if (bounty) {
      var bl = document.createElement('div');
      bl.innerHTML = bountyLine(bounty);
      mount.appendChild(bl.firstChild);
    }
    var list = document.createElement('div');
    list.className = 'zgg-list';
    clips.forEach(function (c) { list.appendChild(renderCard(c)); });
    mount.appendChild(list);
  }

  Promise.all([
    fetch('/api/clips?rec=' + encodeURIComponent(REC_ID), { cache: 'no-store' }).then(function (r) { return r.json(); }).catch(function () { return null; }),
    fetch('/api/clip-bounties?rec=' + encodeURIComponent(REC_ID), { cache: 'no-store' }).then(function (r) { return r.json(); }).catch(function () { return null; }),
  ]).then(function (results) {
    var d = results[0];
    var bd = results[1];
    if (!d || d.configured === false) { mount.style.display = 'none'; return; }
    var bounty = (bd && bd.bounties && bd.bounties[0]) || null;
    render((d && d.clips) || [], bounty);
  }).catch(function () { mount.style.display = 'none'; });
})();

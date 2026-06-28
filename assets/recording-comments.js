// ZABAL Gamez - recording comments widget.
//
// Drop-in: any page with <section id="zg-comments"></section> plus this script gets a
// Farcaster-verified comments thread under the recording. It self-configures from the
// page - the recording id is the URL path, the title/url come from the meta tags - so
// no per-page wiring beyond the mount point.
//
// Reading is public (GET /api/comments). Posting + liking go through window.ZABAL
// (Quick Auth in the Mini App); outside a Mini App the actions prompt to open in
// Farcaster. Every user value is escaped before it hits the DOM.

(function () {
  var mount = document.getElementById('zg-comments');
  if (!mount) return;

  var APP_URL = 'https://farcaster.xyz/miniapps/zabal-gamez';
  var Z = window.ZABAL || {};

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // Recording id = the path, e.g. "/recordings/1" -> "recordings/1".
  var REC_ID = location.pathname.replace(/^\/+|\/+$/g, '').replace(/\.html$/i, '').toLowerCase().replace(/[^a-z0-9/_-]/g, '') || 'recordings';
  function meta(p) { var m = document.querySelector('meta[property="' + p + '"]'); return m ? m.getAttribute('content') : ''; }
  var REC_TITLE = meta('og:title') || document.title || 'this session';
  var canon = document.querySelector('link[rel="canonical"]');
  var REC_URL = (canon && canon.href) || location.href.split('#')[0];

  function timeAgo(ts) {
    var s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return 'just now';
    var m = Math.floor(s / 60); if (m < 60) return m + 'm';
    var h = Math.floor(m / 60); if (h < 24) return h + 'h';
    var d = Math.floor(h / 24); if (d < 7) return d + 'd';
    return new Date(ts).toLocaleDateString();
  }

  // ---- styles (injected once) ----
  var css = '' +
    '.zgc{margin:2rem 0 0.5rem;}' +
    '.zgc-head{display:flex;align-items:center;justify-content:space-between;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.7rem;}' +
    '.zgc-head h2{font-family:Syne,sans-serif;font-size:1.2rem;margin:0;}' +
    '.zgc-share{background:none;border:1px solid var(--border-hover,#2a2a33);color:var(--cyan,#39d4ff);border-radius:999px;padding:0.35rem 0.8rem;font:inherit;font-size:0.82rem;cursor:pointer;}' +
    '.zgc-share:hover{border-color:var(--cyan,#39d4ff);}' +
    '.zgc-box{background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.8rem;margin-bottom:1rem;}' +
    '.zgc-box textarea{width:100%;box-sizing:border-box;background:var(--surface-2,#16161c);border:1px solid var(--border,#1f1e26);border-radius:8px;color:var(--text,#e9e7e2);font:inherit;font-size:0.92rem;padding:0.6rem 0.7rem;resize:vertical;min-height:64px;}' +
    '.zgc-box-row{display:flex;align-items:center;justify-content:space-between;gap:0.6rem;margin-top:0.55rem;flex-wrap:wrap;}' +
    '.zgc-also{display:flex;align-items:center;gap:0.4rem;color:var(--text-dim,#8a8a94);font-size:0.8rem;}' +
    '.zgc-post{background:var(--zabal,#7c5cff);border:0;color:#fff;border-radius:999px;padding:0.45rem 1.1rem;font:inherit;font-weight:600;font-size:0.88rem;cursor:pointer;}' +
    '.zgc-post:disabled{opacity:0.5;cursor:default;}' +
    '.zgc-note{color:var(--text-dim,#8a8a94);font-size:0.82rem;margin:0.4rem 0 0;}' +
    '.zgc-note a{color:var(--cyan,#39d4ff);}' +
    '.zgc-list{display:flex;flex-direction:column;gap:0.7rem;}' +
    '.zgc-item{display:flex;gap:0.65rem;background:var(--surface,#121217);border:1px solid var(--border,#1f1e26);border-radius:12px;padding:0.75rem 0.85rem;}' +
    '.zgc-pfp{width:34px;height:34px;border-radius:50%;object-fit:cover;background:var(--surface-2,#16161c);flex:none;}' +
    '.zgc-body{min-width:0;flex:1;}' +
    '.zgc-by{display:flex;align-items:baseline;gap:0.45rem;flex-wrap:wrap;}' +
    '.zgc-by a{color:var(--text,#e9e7e2);font-weight:600;font-size:0.9rem;text-decoration:none;}' +
    '.zgc-by a:hover{color:var(--zabal,#7c5cff);}' +
    '.zgc-time{color:var(--text-dim,#8a8a94);font-size:0.74rem;}' +
    '.zgc-text{color:var(--text-muted,#c8c6c0);font-size:0.92rem;line-height:1.5;margin:0.25rem 0 0.4rem;white-space:pre-wrap;word-wrap:break-word;}' +
    '.zgc-acts{display:flex;align-items:center;gap:1rem;}' +
    '.zgc-act{background:none;border:0;color:var(--text-dim,#8a8a94);font:inherit;font-size:0.8rem;cursor:pointer;padding:0;}' +
    '.zgc-act:hover{color:var(--text,#e9e7e2);}' +
    '.zgc-act.liked{color:var(--pink,#ff4d8d);}' +
    '.zgc-empty{color:var(--text-dim,#8a8a94);font-size:0.9rem;}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // ---- skeleton ----
  mount.className = 'zgc';
  mount.innerHTML =
    '<div class="zgc-head"><h2>Thoughts <span id="zgc-count" style="color:var(--text-dim,#8a8a94);font-weight:400;"></span></h2>' +
      '<button type="button" class="zgc-share" id="zgc-share">Share to Farcaster</button></div>' +
    '<div class="zgc-box">' +
      '<textarea id="zgc-text" maxlength="500" placeholder="Share your thoughts on this session..." aria-label="Your comment"></textarea>' +
      '<div class="zgc-box-row">' +
        '<label class="zgc-also"><input type="checkbox" id="zgc-also"> Also cast to Farcaster</label>' +
        '<button type="button" class="zgc-post" id="zgc-post">Post</button>' +
      '</div>' +
      '<p class="zgc-note" id="zgc-note"></p>' +
    '</div>' +
    '<div class="zgc-list" id="zgc-list"><p class="zgc-empty">Loading thoughts...</p></div>';

  var listEl = document.getElementById('zgc-list');
  var countEl = document.getElementById('zgc-count');
  var textEl = document.getElementById('zgc-text');
  var alsoEl = document.getElementById('zgc-also');
  var postBtn = document.getElementById('zgc-post');
  var noteEl = document.getElementById('zgc-note');

  // Web vs Mini App. On the open web there is no verified Farcaster session, so a saved
  // comment cannot be posted - make the box a clean "Share to Farcaster" (the compose
  // intent works in a plain browser) instead of a "Post" that fails.
  var inApp = false;
  Promise.resolve(Z.getContext ? Z.getContext() : null).then(function (ctx) {
    inApp = !!(ctx && ctx.client);
    if (inApp) return;
    postBtn.textContent = 'Share to Farcaster';
    var lbl = alsoEl && alsoEl.parentNode; if (lbl) lbl.style.display = 'none';
    textEl.placeholder = 'Share a thought on this session, then post it to Farcaster...';
  }).catch(function () {});

  function profileHref(c) {
    return c.username ? 'https://farcaster.xyz/' + esc(c.username) : 'https://farcaster.xyz/~/profiles/' + esc(c.fid);
  }
  function commentHTML(c) {
    var name = c.username ? '@' + esc(c.username) : 'fid ' + esc(c.fid);
    var pfp = c.pfp ? '<img class="zgc-pfp" src="' + esc(c.pfp) + '" alt="" loading="lazy">' : '<div class="zgc-pfp"></div>';
    return '<div class="zgc-item" data-cid="' + esc(c.cid) + '">' + pfp +
      '<div class="zgc-body">' +
        '<div class="zgc-by"><a href="' + profileHref(c) + '" target="_blank" rel="noopener">' + name + '</a>' +
          '<span class="zgc-time">' + esc(timeAgo(c.ts)) + '</span></div>' +
        '<p class="zgc-text">' + esc(c.text) + '</p>' +
        '<div class="zgc-acts">' +
          '<button type="button" class="zgc-act zgc-like" data-cid="' + esc(c.cid) + '">Like <span class="n">' + (c.likes || 0) + '</span></button>' +
          '<button type="button" class="zgc-act zgc-cast" data-cid="' + esc(c.cid) + '">Cast</button>' +
        '</div>' +
      '</div></div>';
  }

  var COMMENTS = [];
  function renderList() {
    countEl.textContent = COMMENTS.length ? '(' + COMMENTS.length + ')' : '';
    listEl.innerHTML = COMMENTS.length
      ? COMMENTS.map(commentHTML).join('')
      : '<p class="zgc-empty">No thoughts yet. Be the first.</p>';
  }

  function load() {
    fetch('/api/comments?id=' + encodeURIComponent(REC_ID), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) { COMMENTS = (d && d.comments) || []; renderList(); })
      .catch(function () { listEl.innerHTML = '<p class="zgc-empty">Comments are unavailable right now.</p>'; });
  }

  function promptOpenApp(msg) {
    noteEl.innerHTML = esc(msg) + ' <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a>';
    if (Z.toast) Z.toast('Open in the Farcaster app');
  }
  // Open the Farcaster composer with a thought (works in-app and in a plain browser).
  function castThought(text) {
    if (Z.composeCast) { Z.composeCast({ text: text, embeds: [REC_URL], channelKey: 'zabal' }); }
    else { window.open('https://farcaster.xyz/~/compose?text=' + encodeURIComponent(text) + '&embeds[]=' + encodeURIComponent(REC_URL) + '&channelKey=zabal', '_blank', 'noopener'); }
  }
  // Outside the Mini App we can't save a verified comment, so we cast the thought instead
  // and tell the user where saved comments come from.
  function browserFallback(text) {
    castThought(text);
    noteEl.innerHTML = 'Saved comments need the Farcaster app (verified) - we opened a cast with your thought for now. <a href="' + APP_URL + '" target="_blank" rel="noopener">Open in Farcaster</a> to comment here.';
  }

  // Post a comment.
  postBtn.addEventListener('click', function () {
    var text = (textEl.value || '').trim();
    if (!text) { textEl.focus(); return; }
    // On the open web (or any non-Mini-App), a saved comment is not possible - share the
    // thought to Farcaster instead. Clean, never a dead Post.
    if (!inApp || !Z.postComment) {
      castThought(text);
      textEl.value = '';
      noteEl.className = 'zgc-note'; noteEl.textContent = 'Shared to Farcaster.';
      return;
    }
    postBtn.disabled = true; noteEl.textContent = 'Posting...';
    Z.postComment(REC_ID, text).then(function (res) {
      postBtn.disabled = false;
      if (res && res.ok && res.comment) {
        COMMENTS.unshift(res.comment);
        renderList();
        textEl.value = '';
        noteEl.textContent = 'Posted.';
        if (alsoEl.checked) castThought(text);
      } else if (res && res.reason === 'not-in-miniapp') {
        browserFallback(text);
      } else {
        noteEl.textContent = 'Could not post that - try again.';
      }
    });
  });

  // Like / cast on a comment (event-delegated).
  listEl.addEventListener('click', function (ev) {
    var likeBtn = ev.target.closest('.zgc-like');
    var castBtn = ev.target.closest('.zgc-cast');
    if (likeBtn) {
      var cid = likeBtn.getAttribute('data-cid');
      if (!Z.likeComment) { promptOpenApp('Open in the Farcaster app to like.'); return; }
      likeBtn.disabled = true;
      Z.likeComment(REC_ID, cid).then(function (res) {
        likeBtn.disabled = false;
        if (res && res.ok) {
          var n = likeBtn.querySelector('.n'); if (n && res.likes != null) n.textContent = res.likes;
          likeBtn.classList.add('liked');
        } else if (res && res.reason === 'not-in-miniapp') {
          promptOpenApp('Open in the Farcaster app to like.');
        }
      });
      return;
    }
    if (castBtn) {
      var c = COMMENTS.filter(function (x) { return x.cid === castBtn.getAttribute('data-cid'); })[0];
      if (!c) return;
      var text = c.text + '\n\n(on ' + REC_TITLE.replace(/ - ZABAL Gamez.*$/, '') + ')';
      if (Z.composeCast) Z.composeCast({ text: text, embeds: [REC_URL], channelKey: 'zabal' });
      else window.open('https://farcaster.xyz/~/compose?text=' + encodeURIComponent(text) + '&embeds[]=' + encodeURIComponent(REC_URL) + '&channelKey=zabal', '_blank', 'noopener');
    }
  });

  // Top-level share to Farcaster.
  document.getElementById('zgc-share').addEventListener('click', function () {
    var clean = REC_TITLE.replace(/ - ZABAL Gamez.*$/, '');
    var text = 'Watching ' + clean + ' at ZABAL Gamez. My thoughts:';
    if (Z.share) Z.share({ platform: 'farcaster', text: text, url: REC_URL, target: 'recording-comments' });
    else window.open('https://farcaster.xyz/~/compose?text=' + encodeURIComponent(text) + '&embeds[]=' + encodeURIComponent(REC_URL) + '&channelKey=zabal', '_blank', 'noopener');
  });

  // ---- Farcaster cast mode: if this recording has a root cast, the "Thoughts" are its
  // real replies (public, native). People reply on the cast and it shows here. ----
  function castItemHTML(c) {
    var name = c.username ? '@' + esc(c.username) : 'fid ' + esc(c.fid);
    var pfp = c.pfp ? '<img class="zgc-pfp" src="' + esc(c.pfp) + '" alt="" loading="lazy">' : '<div class="zgc-pfp"></div>';
    var stats = 'Like ' + (c.likes || 0) + (c.recasts ? '  Recast ' + c.recasts : '');
    return '<div class="zgc-item">' + pfp +
      '<div class="zgc-body">' +
        '<div class="zgc-by"><a href="' + esc(c.url) + '" target="_blank" rel="noopener">' + name + '</a>' +
          '<span class="zgc-time">' + esc(timeAgo(c.ts)) + '</span></div>' +
        '<p class="zgc-text">' + esc(c.text) + '</p>' +
        '<div class="zgc-acts"><a class="zgc-act" href="' + esc(c.url) + '" target="_blank" rel="noopener">' + esc(stats) + '</a></div>' +
      '</div></div>';
  }
  function enterCastMode(castHash) {
    var isUrl = /^https?:/.test(castHash);
    var rootUrl = isUrl ? castHash : 'https://farcaster.xyz/~/conversations/' + castHash;
    var box = mount.querySelector('.zgc-box');
    if (box) {
      box.innerHTML =
        '<p class="zgc-note" style="margin:0 0 0.6rem;">The conversation lives on Farcaster - reply on the cast and it shows up here.</p>' +
        '<button type="button" class="zgc-post" id="zgc-reply">Reply on Farcaster</button>';
      document.getElementById('zgc-reply').addEventListener('click', function () {
        if (Z.viewCast && !isUrl) { Z.viewCast(castHash); }
        else if (Z.openUrl) { Z.openUrl(rootUrl); }
        else { window.open(rootUrl, '_blank', 'noopener'); }
      });
    }
    fetch('/api/cast-comments?hash=' + encodeURIComponent(castHash), { cache: 'no-store' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        var rows = (d && d.comments) || [];
        countEl.textContent = rows.length ? '(' + rows.length + ')' : '';
        listEl.innerHTML = rows.length
          ? rows.map(castItemHTML).join('')
          : '<p class="zgc-empty">No replies yet. Be the first on Farcaster.</p>';
      })
      .catch(function () { listEl.innerHTML = '<p class="zgc-empty">Conversation unavailable right now.</p>'; });
  }

  // Decide the mode: a recording with a root cast (cast_hash in the index) uses native
  // Farcaster replies; otherwise it falls back to the verified in-app comment store.
  fetch('/recordings/index.json', { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (d) {
      var recs = (d && d.recordings) || [];
      var path = location.pathname.replace(/\.html$/i, '').replace(/\/+$/, '');
      var me = recs.filter(function (x) {
        var u = (x.url || '').replace(/^https?:\/\/[^/]+/, '').replace(/\/+$/, '');
        return u === path || (x.page && x.page.replace(/\/+$/, '') === path);
      })[0];
      if (me && me.cast_hash) { enterCastMode(me.cast_hash); }
      else { load(); }
    })
    .catch(function () { load(); });
})();

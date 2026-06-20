// transcript.js - on-site transcript reader for ZABAL Gamez recording pages.
// Self-contained, zero-dependency, classic <script defer>. Looks for
//   <div id="rec-transcript" data-src="/data/.../x.md" data-yt="VIDEOID"></div>
// fetches the raw markdown (served from /data/ with CORS), strips the YAML
// frontmatter + the intro blockquote, and renders each paragraph as a
// deep-linkable block:
//   - every paragraph gets a stable id (#p-1, #p-2, ...) and a hover "link"
//     affordance that copies a click-right-to-this-line URL to the clipboard
//   - any [mm:ss] / [h:mm:ss] timestamp becomes a button that seeks the
//     embedded YouTube player (when data-yt + #rec-player are present) and
//     also gives that paragraph a #t-<seconds> anchor
//   - on load (and on hashchange) the targeted paragraph scrolls into view,
//     highlights, and - if it is a time anchor - seeks the video
(function () {
  var mount = document.getElementById('rec-transcript');
  if (!mount || !mount.getAttribute('data-src')) return;

  var SRC = mount.getAttribute('data-src');
  var YT = (mount.getAttribute('data-yt') || '').trim();
  var TS_RE = /\[(\d{1,2}):(\d{2})(?::(\d{2}))?\]/g;

  injectStyles();

  function injectStyles() {
    if (document.getElementById('rec-transcript-styles')) return;
    var css =
      '.rec-transcript-section{margin-top:1.6rem}' +
      '#rec-transcript{display:grid;gap:0.15rem}' +
      '#rec-transcript .tx-intro{color:var(--text-dim);font-size:0.85rem;border-left:3px solid var(--border);padding:0.2rem 0 0.2rem 0.8rem;margin:0 0 0.6rem}' +
      '#rec-transcript h3{font-size:0.95rem;color:var(--text);margin:1rem 0 0.2rem}' +
      '#rec-transcript .tx-p{position:relative;display:block;color:var(--text-muted);font-size:0.95rem;line-height:1.65;padding:0.3rem 2rem 0.3rem 0.6rem;border-radius:8px;scroll-margin-top:80px}' +
      '#rec-transcript .tx-p:hover{background:var(--surface-2)}' +
      '#rec-transcript .tx-p.is-target{background:var(--surface-2);box-shadow:inset 3px 0 0 var(--zabal)}' +
      '#rec-transcript .tx-anchor{position:absolute;top:0.3rem;right:0.4rem;opacity:0;border:0;background:none;color:var(--cyan);cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:0.85rem;padding:0.1rem 0.3rem;border-radius:5px;line-height:1.4}' +
      '#rec-transcript .tx-p:hover .tx-anchor,#rec-transcript .tx-p:focus-within .tx-anchor{opacity:0.75}' +
      '#rec-transcript .tx-anchor:hover{opacity:1;background:var(--bg)}' +
      '#rec-transcript .tx-anchor.copied{color:var(--gold);opacity:1}' +
      '#rec-transcript .tx-time{font-family:"JetBrains Mono",monospace;font-size:0.8rem;color:var(--cyan);background:none;border:0;padding:0 0.15rem;cursor:pointer;border-radius:4px}' +
      '#rec-transcript .tx-time:hover{background:var(--bg);text-decoration:underline}' +
      '#rec-transcript[data-yt=""] .tx-time{cursor:default;text-decoration:none}' +
      '.tx-toolbar{display:flex;align-items:center;gap:0.6rem;margin:0 0 0.7rem;flex-wrap:wrap}' +
      '.tx-search{flex:1 1 240px;max-width:360px;font:inherit;font-size:0.9rem;color:var(--text);background:var(--surface-2);border:1px solid var(--border-hover);border-radius:8px;padding:0.45rem 0.7rem}' +
      '.tx-search:focus{outline:none;border-color:var(--cyan)}' +
      '.tx-count{font-family:"JetBrains Mono",monospace;font-size:0.78rem;color:var(--text-dim);white-space:nowrap}' +
      '.tx-jump{display:flex;flex-wrap:wrap;align-items:center;gap:5px;margin:0 0 0.9rem}' +
      '.tx-jump .tx-jump-label{font-family:"JetBrains Mono",monospace;font-size:0.72rem;color:var(--text-dim);margin-right:0.2rem}' +
      '.tx-jumpchip{font-family:"JetBrains Mono",monospace;font-size:0.72rem;color:var(--cyan);background:var(--surface-2);border:1px solid var(--border);border-radius:999px;padding:0.2rem 0.6rem;cursor:pointer}' +
      '.tx-jumpchip:hover{border-color:var(--cyan);background:var(--bg)}' +
      '#rec-transcript .tx-p.tx-hidden,#rec-transcript h3.tx-hidden{display:none}' +
      '#rec-transcript .tx-p mark{background:rgba(245,200,66,0.28);color:var(--text);border-radius:3px;padding:0 1px}' +
      '.tx-loading{color:var(--text-dim);font-size:0.9rem}';
    var el = document.createElement('style');
    el.id = 'rec-transcript-styles';
    el.textContent = css;
    document.head.appendChild(el);
  }

  function toSeconds(h, m, s) {
    if (s === undefined) return (parseInt(h, 10) || 0) * 60 + (parseInt(m, 10) || 0);
    return (parseInt(h, 10) || 0) * 3600 + (parseInt(m, 10) || 0) * 60 + (parseInt(s, 10) || 0);
  }

  function seek(seconds) {
    var player = document.getElementById('rec-player');
    if (!player || !YT) return false;
    player.src = 'https://www.youtube.com/embed/' + YT + '?rel=0&autoplay=1&start=' + (seconds || 0);
    player.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return true;
  }

  // build a paragraph node, turning [mm:ss] tokens into seek buttons
  function buildParagraph(text, pIndex) {
    var p = document.createElement('p');
    p.className = 'tx-p';
    p.id = 'p-' + pIndex;

    var firstTime = null;
    var last = 0, mm;
    TS_RE.lastIndex = 0;
    while ((mm = TS_RE.exec(text))) {
      if (mm.index > last) p.appendChild(document.createTextNode(text.slice(last, mm.index)));
      var secs = toSeconds(mm[1], mm[2], mm[3]);
      if (firstTime === null) { firstTime = secs; p.setAttribute('data-t', String(secs)); }
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'tx-time';
      b.textContent = mm[0];
      b.setAttribute('data-start', String(secs));
      p.appendChild(b);
      last = mm.index + mm[0].length;
    }
    if (last < text.length) p.appendChild(document.createTextNode(text.slice(last)));

    var anchor = document.createElement('button');
    anchor.type = 'button';
    anchor.className = 'tx-anchor';
    anchor.textContent = '#';
    anchor.title = 'Copy a link to this line';
    anchor.setAttribute('data-anchor', firstTime !== null ? ('t-' + firstTime) : ('p-' + pIndex));
    p.appendChild(anchor);
    return p;
  }

  function render(md) {
    var raw = md.replace(/^﻿/, '');
    var lines = raw.split(/\r?\n/);
    // strip YAML frontmatter
    if (lines.length && lines[0].trim() === '---') {
      var i = 1;
      while (i < lines.length && lines[i].trim() !== '---') i++;
      lines = lines.slice(i + 1);
    }
    var body = lines.join('\n').trim();
    var blocks = body.split(/\n\s*\n+/);

    var frag = document.createDocumentFragment();
    var pIndex = 0;
    blocks.forEach(function (block) {
      var b = block.trim();
      if (!b || /^-{3,}$/.test(b)) return;
      if (/^>/.test(b)) {
        var note = document.createElement('p');
        note.className = 'tx-intro';
        note.textContent = b.replace(/^>\s?/gm, '').trim();
        frag.appendChild(note);
        return;
      }
      if (/^#{1,6}\s/.test(b)) {
        var h = document.createElement('h3');
        h.textContent = b.replace(/^#{1,6}\s+/, '').trim();
        frag.appendChild(h);
        return;
      }
      pIndex++;
      frag.appendChild(buildParagraph(b.replace(/\s*\n\s*/g, ' '), pIndex));
    });

    mount.innerHTML = '';
    mount.appendChild(frag);
    wire();
    buildJumpIndex();
    buildToolbar();
    if (location.hash) focusHash();
  }

  function fmtTime(sec) {
    sec = Math.max(0, sec | 0);
    var h = (sec / 3600) | 0, m = ((sec % 3600) / 60) | 0, s = sec % 60;
    var p = function (n) { return n < 10 ? '0' + n : '' + n; };
    return h > 0 ? h + ':' + p(m) + ':' + p(s) : m + ':' + p(s);
  }

  // A compact "Jump to a moment" rail built from the transcript timestamps. Each chip seeks
  // the video (when present) and scrolls the transcript to that line. Sampled so a long talk
  // stays a clean row of chips, not a wall of times. Skipped when there are no timestamps.
  function buildJumpIndex() {
    if (document.getElementById('tx-jump')) return;
    var timed = [].slice.call(mount.querySelectorAll('.tx-p[data-t]'));
    if (timed.length < 3) return;
    var MAX = 16, pick = timed;
    if (timed.length > MAX) {
      var step = Math.ceil(timed.length / MAX);
      pick = timed.filter(function (_, i) { return i % step === 0; });
    }
    var row = document.createElement('div');
    row.className = 'tx-jump';
    row.id = 'tx-jump';
    var label = document.createElement('span');
    label.className = 'tx-jump-label';
    label.textContent = 'Jump to:';
    row.appendChild(label);
    pick.forEach(function (p) {
      var sec = parseInt(p.getAttribute('data-t'), 10) || 0;
      var c = document.createElement('button');
      c.type = 'button';
      c.className = 'tx-jumpchip';
      c.textContent = fmtTime(sec);
      c.title = (p.textContent || '').replace(/#$/, '').trim().slice(0, 90);
      c.addEventListener('click', function () {
        seek(sec);
        mount.querySelectorAll('.tx-p.is-target').forEach(function (n) { n.classList.remove('is-target'); });
        p.classList.add('is-target');
        p.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
      row.appendChild(c);
    });
    mount.parentNode.insertBefore(row, mount);
  }

  // A search box above the transcript: filter to matching lines, count them, highlight hits.
  // Pure progressive enhancement - if anything is off, the full transcript still renders.
  function buildToolbar() {
    if (document.getElementById('tx-search')) return;
    var paras = [].slice.call(mount.querySelectorAll('.tx-p'));
    var heads = [].slice.call(mount.querySelectorAll('h3'));
    if (paras.length < 4) return; // not worth a search box on a tiny transcript

    var bar = document.createElement('div');
    bar.className = 'tx-toolbar';
    var input = document.createElement('input');
    input.type = 'search';
    input.id = 'tx-search';
    input.className = 'tx-search';
    input.placeholder = 'Search this transcript';
    input.setAttribute('aria-label', 'Search this transcript');
    input.setAttribute('autocomplete', 'off');
    var count = document.createElement('span');
    count.className = 'tx-count';
    bar.appendChild(input);
    bar.appendChild(count);
    mount.parentNode.insertBefore(bar, mount);

    // cache each paragraph's plain text once (without the # anchor glyph)
    paras.forEach(function (p) { p.setAttribute('data-tx', (p.textContent || '').replace(/#$/, '').toLowerCase()); });

    function clearMarks(p) {
      var marks = p.querySelectorAll('mark');
      for (var i = 0; i < marks.length; i++) {
        var mk = marks[i];
        mk.replaceWith(document.createTextNode(mk.textContent));
      }
      p.normalize();
    }
    function mark(p, q) {
      // highlight matches inside plain text nodes only (leaves buttons/anchors intact)
      var walk = [].slice.call(p.childNodes);
      walk.forEach(function (node) {
        if (node.nodeType !== 3) return;
        var txt = node.nodeValue, low = txt.toLowerCase(), idx = low.indexOf(q);
        if (idx === -1) return;
        var frag = document.createDocumentFragment(), pos = 0;
        while (idx !== -1) {
          if (idx > pos) frag.appendChild(document.createTextNode(txt.slice(pos, idx)));
          var mk = document.createElement('mark');
          mk.textContent = txt.slice(idx, idx + q.length);
          frag.appendChild(mk);
          pos = idx + q.length;
          idx = low.indexOf(q, pos);
        }
        if (pos < txt.length) frag.appendChild(document.createTextNode(txt.slice(pos)));
        node.replaceWith(frag);
      });
    }

    function apply() {
      var q = (input.value || '').trim().toLowerCase();
      var shown = 0;
      paras.forEach(function (p) {
        clearMarks(p);
        var hit = !q || p.getAttribute('data-tx').indexOf(q) !== -1;
        p.classList.toggle('tx-hidden', !hit);
        if (hit) { shown++; if (q) mark(p, q); }
      });
      heads.forEach(function (h) { h.classList.toggle('tx-hidden', !!q); });
      count.textContent = q ? (shown + ' of ' + paras.length + ' lines') : (paras.length + ' lines');
    }
    input.addEventListener('input', apply);
    apply();
  }

  function copyLink(anchorId, btn) {
    var url = location.origin + location.pathname + '#' + anchorId;
    var done = function () {
      btn.classList.add('copied');
      var prev = btn.textContent;
      btn.textContent = 'copied';
      setTimeout(function () { btn.classList.remove('copied'); btn.textContent = prev; }, 1200);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else { done(); }
    if (history.replaceState) history.replaceState(null, '', '#' + anchorId);
    else location.hash = anchorId;
  }

  function wire() {
    mount.addEventListener('click', function (ev) {
      var time = ev.target.closest('.tx-time');
      if (time) { seek(parseInt(time.getAttribute('data-start') || '0', 10) || 0); return; }
      var anchor = ev.target.closest('.tx-anchor');
      if (anchor) { copyLink(anchor.getAttribute('data-anchor'), anchor); }
    });
  }

  function focusHash() {
    var id = location.hash.slice(1);
    if (!id) return;
    var el = null;
    if (id.indexOf('t-') === 0) {
      var t = parseInt(id.slice(2), 10);
      el = mount.querySelector('[data-t="' + t + '"]');
      if (el) seek(t);
    } else {
      el = document.getElementById(id);
    }
    if (!el || el.parentNode !== mount && el.id.indexOf('p-') !== 0 && !el.classList.contains('tx-p')) {
      el = document.getElementById(id);
    }
    if (el && el.classList.contains('tx-p')) {
      mount.querySelectorAll('.tx-p.is-target').forEach(function (n) { n.classList.remove('is-target'); });
      el.classList.add('is-target');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  window.addEventListener('hashchange', focusHash);

  mount.innerHTML = '<p class="tx-loading">Loading transcript...</p>';
  fetch(SRC, { cache: 'no-store' })
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(render)
    .catch(function () {
      mount.innerHTML = '<p class="tx-loading">Could not load the transcript here. ' +
        '<a href="https://github.com/ZAODEVZ/zabalgames/blob/main' + SRC + '" target="_blank" rel="noopener" style="color:var(--cyan)">Read it on GitHub</a>.</p>';
    });
})();

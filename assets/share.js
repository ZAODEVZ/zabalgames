// ZABAL Gamez - universal share + Mini App action layer.
//
// Drop a button anywhere with class "zg-share" and it shares this page (or custom text)
// to Farcaster (/zabal) or X via window.ZABAL.share, with a graceful web fallback.
//
//   <button class="zg-share" data-platform="farcaster"
//           data-text="..." data-url="..." data-target="...">Share</button>
//
// Also wires class "zg-add" buttons to window.ZABAL.addApp (add the Mini App), and
// class "zg-profile" links to window.ZABAL.viewProfile via data-fid (falls back to a
// normal Farcaster profile link).
//
// Defer-load on any page: <script defer src="/assets/share.js"></script>

(function () {
  function pageUrl(btn) {
    return btn.getAttribute('data-url') || (location.origin + location.pathname);
  }

  function doShare(btn) {
    var platform = btn.getAttribute('data-platform') === 'x' ? 'x' : 'farcaster';
    var text = btn.getAttribute('data-text') || document.title;
    var url = pageUrl(btn);
    var target = btn.getAttribute('data-target') || ('share-' + location.pathname);
    if (window.ZABAL && window.ZABAL.share) {
      window.ZABAL.share({ platform: platform, text: text, url: url, target: target });
      return;
    }
    var u = platform === 'x'
      ? 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url)
      : 'https://farcaster.xyz/~/compose?text=' + encodeURIComponent(text) + '&embeds[]=' + encodeURIComponent(url);
    window.open(u, '_blank', 'noopener');
  }

  function doAdd() {
    try { if (window.ZABAL && window.ZABAL.addApp) window.ZABAL.addApp(); } catch (e) {}
  }

  function doProfile(btn) {
    var fid = parseInt(btn.getAttribute('data-fid'), 10);
    if (fid && window.ZABAL && window.ZABAL.viewProfile) { window.ZABAL.viewProfile(fid); return; }
    var handle = btn.getAttribute('data-handle');
    if (handle) window.open('https://farcaster.xyz/' + encodeURIComponent(handle), '_blank', 'noopener');
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    var share = t.closest ? t.closest('.zg-share') : null;
    if (share) { e.preventDefault(); doShare(share); return; }
    var add = t.closest ? t.closest('.zg-add') : null;
    if (add) { e.preventDefault(); doAdd(); return; }
    var prof = t.closest ? t.closest('.zg-profile') : null;
    if (prof) { e.preventDefault(); doProfile(prof); return; }
  });
})();

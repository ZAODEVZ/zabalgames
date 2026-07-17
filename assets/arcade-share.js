// arcade-share.js - shared ZABAL Gamez arcade share helpers.
//
// Include on any /game/* page:
//   <script defer src="/assets/arcade-share.js"></script>
// and set data attributes on <body> to auto-inject the optional "I am starting" button:
//   <body data-zg-game="ZABALDLE" data-zg-url="https://zabalgamez.com/game/word">
//
// Exposes window.ZG:
//   ZG.announceStart(label, url)      -> casts "Starting <label> ... come beat my score"
//   ZG.shareScore(label, line, url)   -> casts a finished-score result
//   ZG.cast(text, url)                -> low-level composer (uses ZABAL.composeCast, falls back to a web compose window)
// Brand: no emojis, no em dashes. Casts post to the /zabal channel.
(function () {
  var ZG = (window.ZG = window.ZG || {});
  var CHANNEL = 'zabal';

  function cast(text, url) {
    try {
      if (window.ZABAL && window.ZABAL.composeCast) {
        return window.ZABAL.composeCast({ text: text, embeds: url ? [url] : [], channelKey: CHANNEL });
      }
    } catch (e) {}
    var href = 'https://farcaster.xyz/~/compose?text=' + encodeURIComponent(text) + (url ? '&embeds[]=' + encodeURIComponent(url) : '');
    try { window.open(href, '_blank', 'noopener'); } catch (e2) {}
    return Promise.resolve(null);
  }
  ZG.cast = cast;

  ZG.announceStart = function (label, url) {
    return cast('Starting ' + (label || 'a game') + ' on ZABAL Gamez. Come beat my score.', url || location.href);
  };

  ZG.shareScore = function (label, line, url) {
    var text = (label || 'ZABAL Gamez') + (line ? '\n' + line : '') + '\n\nPlay the ZABAL Gamez arcade.';
    return cast(text, url || location.href);
  };

  // Optional "I am starting" button, auto-injected when <body data-zg-game> is set.
  function inject() {
    var body = document.body;
    if (!body) return;
    var label = body.getAttribute('data-zg-game');
    if (!label || document.getElementById('zg-start-btn')) return;
    var url = body.getAttribute('data-zg-url') || location.href;
    var host = document.querySelector('header.hero') || document.querySelector('#main .container') || body;
    var wrap = document.createElement('div');
    wrap.style.margin = '0.3rem 0 0.2rem';
    var b = document.createElement('button');
    b.id = 'zg-start-btn';
    b.type = 'button';
    b.className = 'btn btn-secondary';
    b.style.fontSize = '0.82rem';
    b.textContent = 'I am starting - tell Farcaster';
    b.addEventListener('click', function () { ZG.announceStart(label, url); });
    wrap.appendChild(b);
    host.appendChild(wrap);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();

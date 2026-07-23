(function () {
  'use strict';
  var footers = document.querySelectorAll('.arcade-foot');
  if (!footers.length || document.querySelector('.mentor-strip')) return;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); }
  function initials(name) {
    return String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (part) { return part.charAt(0).toUpperCase(); }).join('') || 'ZAO';
  }
  Promise.all([
    fetch('/data/mentors.json', { cache: 'no-store' }).then(function (response) { return response.json(); }),
    fetch('/data/sponsors.json', { cache: 'no-store' }).then(function (response) { return response.json(); })
  ]).then(function (docs) {
    var mentors = (docs[0].mentors || []).filter(function (mentor) { return mentor.locked === true; });
    var sponsors = docs[1].sponsors || [];
    var items = sponsors.map(function (sponsor) {
      return '<a class="mentor-mark sponsor" href="' + esc(sponsor.url || 'mailto:info@thezao.com') + '"><span>The ZAO</span><strong>' + esc(sponsor.shortName || sponsor.name) + '</strong><small>' + esc(sponsor.role || 'Sponsor') + '</small></a>';
    }).concat(mentors.map(function (mentor) {
      var url = mentor.farcaster_url || mentor.site_url || '#';
      return '<a class="mentor-mark" href="' + esc(url) + '"' + (url === '#' ? '' : ' target="_blank" rel="noopener"') + '>' +
        '<span class="mentor-initials">' + esc(initials(mentor.name)) + '</span><strong>' + esc(mentor.name) + '</strong><small>' + esc(mentor.expertise_label || 'Mentor') + '</small></a>';
    }));
    var section = document.createElement('section');
    section.className = 'mentor-strip'; section.setAttribute('aria-labelledby', 'mentor-strip-title');
    section.innerHTML = '<div class="mentor-strip-inner"><p class="mentor-strip-kicker">Season 1 support</p><h2 id="mentor-strip-title">Mentors and sponsor</h2><div class="mentor-strip-row">' + items.join('') + '</div><a class="mentor-strip-link" href="/mentor">Meet the mentor roster</a></div>';
    footers[0].parentNode.insertBefore(section, footers[0]);
  }).catch(function () { /* The footer remains complete if the roster cannot load. */ });
})();

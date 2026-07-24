// zg-profile.js - the per-user "Your ZABAL Gamez" header.
// Mount point: an empty <div id="zg-profile"></div> near the top of a page.
// In a Farcaster Mini App it greets the signed-in user with their pfp + handle
// (tappable into their native profile), a Share button, and an Add-app prompt, and
// enriches with their track from the activity backend when available. On the open web
// (no Farcaster context) it degrades to a small "start the build" CTA - never empty,
// never a dead control. Self-contained: injects its own styles, waits for window.ZABAL.
(function () {
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function injectStyles() {
    if (document.getElementById("zgp-styles")) return;
    var css = ""
      + "#zg-profile{display:none}"
      + "#zg-profile.zgp-shown{display:block;margin:0 0 1rem}"
      + ".zgp-card{display:flex;align-items:center;gap:0.8rem;border:1px solid var(--border,#2a2a4a);"
      + "background:var(--surface-2,#15151b);border-radius:14px;padding:0.7rem 0.9rem}"
      + ".zgp-pfp{width:46px;height:46px;border-radius:50%;flex:0 0 auto;object-fit:cover;"
      + "border:2px solid var(--cyan,#00e5ff);background:var(--surface,#1a1a2e)}"
      + ".zgp-id{flex:1 1 auto;min-width:0}"
      + ".zgp-gm{font-family:'Syne',sans-serif;font-weight:800;font-size:1.02rem;color:var(--text,#e8e8f0);line-height:1.15}"
      + ".zgp-handle{background:none;border:0;padding:0;font:inherit;font-size:0.84rem;color:var(--cyan,#00e5ff);cursor:pointer}"
      + ".zgp-sub{font-family:'JetBrains Mono',monospace;font-size:0.72rem;color:var(--text-dim,#7a7a9a);margin-top:0.1rem}"
      + ".zgp-actions{display:flex;gap:0.4rem;flex:0 0 auto}"
      + ".zgp-btn{font:inherit;font-size:0.78rem;font-weight:600;padding:0.4rem 0.8rem;border-radius:999px;"
      + "border:1px solid var(--cyan,#00e5ff);background:transparent;color:var(--cyan,#00e5ff);cursor:pointer;text-decoration:none;min-height:36px;display:inline-flex;align-items:center}"
      + ".zgp-btn.primary{background:var(--zabal,#7c5cff);border-color:var(--zabal,#7c5cff);color:#fff}"
      + "@media(max-width:480px){.zgp-sub{display:none}.zgp-btn{padding:0.4rem 0.7rem}}";
    var st = document.createElement("style");
    st.id = "zgp-styles";
    st.textContent = css;
    document.head.appendChild(st);
  }

  function shareMyZabal() {
    var text = "I am building with ZABAL Gamez - The ZAO's three-month build event. June workshops, July open build, August Finals. Free, open to anyone. Come build.";
    var url = "https://zabalgamez.com";
    if (window.ZABAL && window.ZABAL.composeCast) window.ZABAL.composeCast({ text: text, embeds: [url], channelKey: "zabal" });
    else window.open("https://farcaster.xyz/~/compose?text=" + encodeURIComponent(text) + "&embeds[]=" + encodeURIComponent(url), "_blank", "noopener");
  }

  function renderUser(el, u) {
    var name = u.displayName || u.username || "builder";
    var handle = u.username ? "@" + u.username : "";
    el.innerHTML = ""
      + '<div class="zgp-card">'
      +   (u.pfpUrl ? '<img class="zgp-pfp" src="' + esc(u.pfpUrl) + '" alt="" referrerpolicy="no-referrer">' : '<div class="zgp-pfp"></div>')
      +   '<div class="zgp-id">'
      +     '<div class="zgp-gm">GM, ' + esc(name) + '</div>'
      +     (handle ? '<button class="zgp-handle" type="button">' + esc(handle) + '</button>' : '')
      +     '<div class="zgp-sub">Your ZABAL Gamez</div>'
      +   '</div>'
      +   '<div class="zgp-actions">'
      +     '<button class="zgp-btn primary" id="zgp-share" type="button">Share</button>'
      +     '<button class="zgp-btn" id="zgp-add" type="button">Add</button>'
      +   '</div>'
      + '</div>';
    el.classList.add("zgp-shown");
    var h = el.querySelector(".zgp-handle");
    if (h && u.fid) h.addEventListener("click", function () { if (window.ZABAL.viewProfile) window.ZABAL.viewProfile(u.fid); });
    el.querySelector("#zgp-share").addEventListener("click", shareMyZabal);
    el.querySelector("#zgp-add").addEventListener("click", function () { if (window.ZABAL.addApp) window.ZABAL.addApp(); });
    // best-effort enrich: their track from the activity backend
    if (u.fid) {
      try {
        fetch("/api/activity?fid=" + encodeURIComponent(u.fid), { cache: "no-store" })
          .then(function (r) { return r.ok ? r.json() : null; })
          .then(function (d) {
            if (!d) return;
            var sub = el.querySelector(".zgp-sub");
            if (sub && d.track) sub.textContent = "Track: " + d.track;
            else if (sub && (d.joined || d.member)) sub.textContent = "You are in - keep building";
          })
          .catch(function () {});
      } catch (e) {}
    }
  }

  function renderGuest(el) {
    el.innerHTML = ""
      + '<div class="zgp-card">'
      +   '<div class="zgp-id">'
      +     '<div class="zgp-gm">New here?</div>'
      +     '<div class="zgp-sub" style="display:block">No account is required. Start with any project or work in progress.</div>'
      +   '</div>'
      +   '<div class="zgp-actions"><a class="zgp-btn primary" href="/submit">Submit</a></div>'
      + '</div>';
    el.classList.add("zgp-shown");
  }

  function mount(el, tries) {
    tries = tries || 0;
    if (!window.ZABAL) {
      if (tries > 20) { renderGuest(el); return; }
      setTimeout(function () { mount(el, tries + 1); }, 250);
      return;
    }
    Promise.resolve(window.ZABAL.getUser ? window.ZABAL.getUser() : null)
      .then(function (user) { if (user && user.fid) renderUser(el, user); else renderGuest(el); })
      .catch(function () { renderGuest(el); });
  }

  function init() {
    var el = document.getElementById("zg-profile");
    if (!el) return;
    injectStyles();
    mount(el);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

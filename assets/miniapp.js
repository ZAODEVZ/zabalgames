// ZABAL Gamez - Farcaster Mini App SDK bootstrap.
// Loads the SDK, dismisses the splash screen on every page that includes this script,
// and exposes a small composeCast helper for in-mini-app sharing.
//
// Usage in HTML head:
//   <script type="module" src="/assets/miniapp.js"></script>
//
// All zabalgamez.com pages should include this. Without sdk.actions.ready(),
// Warpcast hangs on the splash image forever.

// Expose the namespace early so helpers can attach to it.
window.ZABAL = window.ZABAL || {};

// Load the SDK self-host-first, with the esm.sh CDN as the fallback. The splash
// only dismisses when sdk.actions.ready() runs, so the SDK load is the load-bearing
// step: a single hard dependency on a third-party CDN is what strands the splash
// when that CDN is slow, down, or network-blocked. Trying a vendored same-origin
// copy first removes that single point of failure; esm.sh stays as the safety net.
//
//   1. /assets/vendor/miniapp-sdk-0.1.10.js  - vendored, same-origin (see that
//      folder's README to (re)generate; pinned exact version, cached hard).
//   2. https://esm.sh/@farcaster/miniapp-sdk@0.1.10  - exact pin (no range = no
//      resolve-redirect), warmed by <link rel="preconnect" href="https://esm.sh">.
//
// Dynamic import per source so a missing/broken vendored file or a hung CDN can
// never halt the module: each is tried in turn and `sdk` simply stays null if all
// fail, in which case every helper below degrades to "not in a Mini App". Until the
// vendored file is added, source 1 404s and we transparently use esm.sh (identical
// to before) - so this can only improve reliability, never regress it.
const SDK_SOURCES = [
  '/assets/vendor/miniapp-sdk-0.1.10.js',
  'https://esm.sh/@farcaster/miniapp-sdk@0.1.10',
];
let sdk = null;
for (const src of SDK_SOURCES) {
  try {
    const mod = await import(src);
    if (mod && mod.sdk) { sdk = mod.sdk; break; }
  } catch (e) { /* try the next source */ }
}

// Race any SDK promise against a timeout so a slow or hanging client never blocks the
// page. Resolves null on timeout, which callers treat as "not in a Mini App".
function withTimeout(promise, ms) {
  return Promise.race([
    Promise.resolve(promise).catch(function () { return null; }),
    new Promise(function (res) { setTimeout(function () { res(null); }, ms); }),
  ]);
}
// Shared, timeout-guarded context read. Every helper below uses this instead of
// awaiting sdk.context directly, so none of them can hang on a slow client.
async function getContext() {
  if (!sdk) return null; // SDK failed to load from every source - treat as not-in-app.
  return withTimeout(sdk.context, 2000);
}
window.ZABAL.getContext = getContext;

// Capability detection. Newer hosts expose sdk.getCapabilities() -> an array of
// supported method paths (e.g. 'actions.composeCast', 'actions.addMiniApp'); we use
// it to avoid invoking an action a host does not implement. Read once, then cached.
// When the host predates getCapabilities (or the call times out) we cannot enumerate,
// so hasCapability returns true and we lean on the existing try/catch around each
// call - never blocking an action just because support could not be confirmed.
let capsCache;
async function getCaps() {
  if (capsCache !== undefined) return capsCache;
  try {
    if (sdk && typeof sdk.getCapabilities === 'function') {
      const caps = await withTimeout(sdk.getCapabilities(), 2000);
      capsCache = Array.isArray(caps) ? caps : null;
    } else {
      capsCache = null;
    }
  } catch (e) {
    capsCache = null;
  }
  return capsCache;
}
window.ZABAL.hasCapability = async function hasCapability(path) {
  const caps = await getCaps();
  if (!caps) return true; // can't enumerate -> attempt anyway (call is try/catch-guarded)
  return caps.includes(path);
};

// Dismiss splash + signal page is ready as soon as DOM is parsed. Timeout-guarded so a
// hung ready() never leaves the splash up; try/catch covers regular browser loads.
// A page with swipe-conflicting UI (a video embed, a horizontal carousel) can opt out
// of native gestures - which otherwise close the app on a stray swipe - by adding
// <meta name="fc:disable-native-gestures" content="1"> to its head. Off by default so
// normal pages keep the native back/close gestures.
try {
  const noGestures = !!document.querySelector('meta[name="fc:disable-native-gestures"]');
  await withTimeout(sdk.actions.ready(noGestures ? { disableNativeGestures: true } : {}), 2500);
} catch (e) {
  // Not running inside a Farcaster Mini App context (regular browser load).
  // Silent fail is correct - the page works as a normal website.
}
// Enable the client back button for in-app navigation. Guarded so it no-ops on older
// SDKs (our pin is 0.1.10) or outside a Mini App.
try {
  if (sdk.back && typeof sdk.back.enableWebNavigation === 'function') {
    await sdk.back.enableWebNavigation();
  }
} catch (e) { /* older SDK or not in a Mini App */ }

// Expose helpers for share buttons + role-pick CTAs.
// Inside a mini app, sdk.actions.composeCast() opens the native Warpcast composer.
// Outside, fall back to the Warpcast intent URL.

// Every Farcaster cast from the app credits @zaal so the team can see who is
// sharing. Idempotent - never doubles up if a caller already tagged the text.
window.ZABAL.withZaal = function withZaal(text) {
  const t = (text || '').trim();
  if (!t) return '@zaal';
  return /(^|\s)@zaal\b/.test(t) ? t : t + ' @zaal';
};

window.ZABAL.composeCast = async function composeCast(textOrOpts, maybeEmbeds) {
  // Accept either composeCast({ text, embeds, channelKey }) or composeCast(text, embeds).
  const opts = typeof textOrOpts === 'string'
    ? { text: textOrOpts, embeds: maybeEmbeds }
    : (textOrOpts || {});
  const text = window.ZABAL.withZaal(opts.text);
  const { embeds, channelKey } = opts;
  try {
    const ctx = await getContext();
    if (ctx && ctx.client && await window.ZABAL.hasCapability('actions.composeCast')) {
      // Returns { cast } - cast is null if the user cancels the composer. Callers
      // read this to count only real casts and capture the cast hash.
      return await sdk.actions.composeCast({ text, embeds, channelKey });
    }
  } catch (e) {
    // Fall through to browser fallback.
  }
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (Array.isArray(embeds)) embeds.forEach(e => params.append('embeds[]', e));
  if (channelKey) params.set('channelKey', channelKey);
  window.open('https://farcaster.xyz/~/compose?' + params.toString(), '_blank', 'noopener');
};

window.ZABAL.openUrl = async function openUrl(url) {
  try {
    const ctx = await getContext();
    if (ctx && ctx.client) {
      await sdk.actions.openUrl(url);
      return;
    }
  } catch (e) {
    // Fall through to browser fallback.
  }
  window.open(url, '_blank', 'noopener');
};

// Optional: expose context for pages that want to render differently
// when running inside a Mini App vs a regular browser tab.
window.ZABAL.context = sdk ? sdk.context.catch(() => null) : Promise.resolve(null);

// -------------------------------------------------------------------
// Profile + sharing helpers (used by the nav chip + per-page share buttons)
// -------------------------------------------------------------------

// Resolve the current Farcaster user, or null outside a Mini App context.
// Shape: { fid, username, displayName, pfpUrl }.
window.ZABAL.getUser = async function getUser() {
  try {
    const ctx = await getContext();
    return ctx && ctx.user ? ctx.user : null;
  } catch (e) {
    return null;
  }
};

// Open a Farcaster profile - native sheet inside a Mini App, web profile otherwise.
window.ZABAL.viewProfile = async function viewProfile(fid) {
  if (!fid) return;
  try {
    const ctx = await getContext();
    if (ctx && ctx.client) {
      await sdk.actions.viewProfile({ fid });
      return;
    }
  } catch (e) {
    // Fall through to web profile.
  }
  window.open('https://farcaster.xyz/~/profiles/' + fid, '_blank', 'noopener');
};

// Prompt the user to add ZABAL Gamez (enables notifications via /api/webhook).
// Returns true if the prompt ran, false outside a Mini App. Safe to call anywhere.
window.ZABAL.addApp = async function addApp() {
  try {
    const ctx = await getContext();
    if (ctx && ctx.client && await window.ZABAL.hasCapability('actions.addMiniApp')) {
      await sdk.actions.addMiniApp();
      return true;
    }
  } catch (e) {
    // Not in a Mini App, or the user dismissed the prompt.
  }
  return false;
};

// Open a cast - native viewer inside a Mini App, web conversation otherwise.
window.ZABAL.viewCast = async function viewCast(hash) {
  if (!hash) return;
  try {
    const ctx = await getContext();
    if (ctx && ctx.client) {
      await sdk.actions.viewCast({ hash });
      return;
    }
  } catch (e) {
    // Fall through to web.
  }
  window.open('https://farcaster.xyz/~/conversations/' + hash, '_blank', 'noopener');
};

// Open a URL in a new tab WITHOUT navigating the current page.
// window.open(..., 'noopener') returns null even on success, so never branch on
// its return value for a same-tab fallback - that double-opens.
window.ZABAL.openNewTab = function openNewTab(url) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

// Record a deliberate social action against the user's verified FID.
// Uses sdk.quickAuth.fetch so the request carries a Quick Auth JWT the server
// verifies - only works inside a Mini App, no-ops everywhere else.
window.ZABAL.track = async function track(action, target, castHash) {
  try {
    const ctx = await getContext();
    if (!ctx || !ctx.client || !sdk.quickAuth) return;
    await sdk.quickAuth.fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: action, target: target || '', castHash: castHash || '' }),
    });
  } catch (e) {
    // Tracking is best-effort; never block the share on it.
  }
};

// One-tap join (verified). Inside a Mini App, POSTs the join to /api/join with a
// Quick Auth JWT. Returns { ok, reason } so the UI can react or fall back to the
// full sign-up form outside a Mini App.
window.ZABAL.join = async function join(payload) {
  try {
    const ctx = await getContext();
    if (!ctx || !ctx.client || !sdk.quickAuth) return { ok: false, reason: 'not-in-miniapp' };
    const res = await sdk.quickAuth.fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload || {}),
    });
    if (res.ok) window.ZABAL.haptic('medium');
    return res.ok ? { ok: true } : { ok: false, reason: 'server' };
  } catch (e) {
    return { ok: false, reason: 'error' };
  }
};

// Submit a contribution to the ZABAL Bonfire pending queue (verified). Inside a Mini
// App, POSTs to /api/bonfire-ask with a Quick Auth JWT; ZOE reviews + promotes it into
// the canonical graph. Returns { ok, reason } so the form can react or ask the user to
// open in Farcaster.
window.ZABAL.submitBonfire = async function submitBonfire(payload) {
  try {
    const ctx = await getContext();
    if (!ctx || !ctx.client || !sdk.quickAuth) return { ok: false, reason: 'not-in-miniapp' };
    const res = await sdk.quickAuth.fetch('/api/bonfire-ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({ action: 'submit' }, payload || {})),
    });
    return res.ok ? { ok: true } : { ok: false, reason: 'server' };
  } catch (e) {
    return { ok: false, reason: 'error' };
  }
};

// Credit the team's X account on tweets, mirroring @zaal on casts. This is the
// twitter:site / twitter:creator handle. Idempotent. Not used on casts, where an
// X handle would not map to the same account.
window.ZABAL.withXHandle = function withXHandle(text) {
  const t = (text || '').trim();
  const tag = 'via @bettercallzaal';
  if (!t) return tag;
  return /@bettercallzaal\b/.test(t) ? t : t + ' ' + tag;
};

// Light tactile feedback on deliberate actions (share, join). No-ops outside a Mini
// App or on SDKs without haptics (our pin is 0.1.10), so it is always safe to call.
window.ZABAL.haptic = async function haptic(type) {
  try {
    if (sdk.haptics && typeof sdk.haptics.impactOccurred === 'function') {
      await sdk.haptics.impactOccurred(type || 'medium');
    }
  } catch (e) { /* unsupported on this client / SDK */ }
};

// One share entry point for every page. platform: 'farcaster' | 'x'.
// Farcaster casts post into the /zabal channel with the page as an embed.
window.ZABAL.share = async function share({ platform, text, url, target }) {
  window.ZABAL.haptic('light');
  if (platform === 'x') {
    const t = window.ZABAL.withXHandle(text) + (url ? ' ' + url : '');
    window.ZABAL.openNewTab('https://twitter.com/intent/tweet?text=' + encodeURIComponent(t));
    window.ZABAL.track('share', target || url || '');
    return;
  }
  // composeCast resolves to { cast } - cast is null if the user cancelled. Inside a
  // Mini App we count only real casts and pass the hash for attribution. The web
  // fallback resolves to undefined (outcome unknown), so count it best-effort.
  const res = await window.ZABAL.composeCast({ text: text, embeds: url ? [url] : [], channelKey: 'zabal' });
  if (!res || res.cast) window.ZABAL.track('cast', target || url || '', res && res.cast && res.cast.hash);
};

// Inject a small "you" chip into the nav when running inside a Mini App.
// Tapping it opens the user's own Farcaster profile. Built with DOM nodes
// (not innerHTML) so profile fields can never inject markup.
async function injectProfileChip() {
  const user = await window.ZABAL.getUser();
  if (!user || !user.fid) return;
  const navRow = document.querySelector('.nav-row');
  if (!navRow || document.getElementById('zabal-me')) return;

  const chip = document.createElement('button');
  chip.id = 'zabal-me';
  chip.type = 'button';
  chip.title = 'View your Farcaster profile';
  chip.style.cssText = [
    'display:inline-flex', 'align-items:center', 'gap:0.4rem',
    'margin-left:auto', 'background:var(--surface-2,#16161c)',
    'border:1px solid var(--border,#1f1e26)', 'color:var(--text,#e4e2dd)',
    'border-radius:999px', 'padding:0.2rem 0.7rem 0.2rem 0.25rem',
    'font-family:inherit', 'font-size:0.8rem', 'line-height:1', 'cursor:pointer'
  ].join(';');

  if (user.pfpUrl) {
    const img = document.createElement('img');
    img.src = user.pfpUrl;
    img.alt = '';
    img.width = 22;
    img.height = 22;
    img.style.cssText = 'border-radius:50%;object-fit:cover;flex:none';
    chip.appendChild(img);
  }
  const label = document.createElement('span');
  label.textContent = '@' + (user.username || user.fid);
  chip.appendChild(label);

  chip.addEventListener('click', function () { window.ZABAL.viewProfile(user.fid); });
  navRow.appendChild(chip);
}

injectProfileChip();


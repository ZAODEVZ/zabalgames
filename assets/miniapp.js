// ZABAL Games - Farcaster Mini App SDK bootstrap.
// Loads the SDK, dismisses the splash screen on every page that includes this script,
// and exposes a small composeCast helper for in-mini-app sharing.
//
// Usage in HTML head:
//   <script type="module" src="/assets/miniapp.js"></script>
//
// All zabalgames.com pages should include this. Without sdk.actions.ready(),
// Warpcast hangs on the splash image forever.

import { sdk } from 'https://esm.sh/@farcaster/miniapp-sdk@0.1.x';

// Dismiss splash + signal page is ready as soon as DOM is parsed.
// Wrap in try/catch so a non-mini-app context (regular browser tab) does not throw.
try {
  await sdk.actions.ready();
} catch (e) {
  // Not running inside a Farcaster Mini App context (regular browser load).
  // Silent fail is correct - the page works as a normal website.
}

// Expose helpers for share buttons + role-pick CTAs.
// Inside a mini app, sdk.actions.composeCast() opens the native Warpcast composer.
// Outside, fall back to the Warpcast intent URL.
window.ZABAL = window.ZABAL || {};

window.ZABAL.composeCast = async function composeCast(textOrOpts, maybeEmbeds) {
  // Accept either composeCast({ text, embeds, channelKey }) or composeCast(text, embeds).
  const { text, embeds, channelKey } = typeof textOrOpts === 'string'
    ? { text: textOrOpts, embeds: maybeEmbeds }
    : (textOrOpts || {});
  try {
    const ctx = await sdk.context;
    if (ctx && ctx.client) {
      await sdk.actions.composeCast({ text, embeds, channelKey });
      return;
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
    const ctx = await sdk.context;
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
window.ZABAL.context = sdk.context.catch(() => null);

// -------------------------------------------------------------------
// Profile + sharing helpers (used by the nav chip + per-page share buttons)
// -------------------------------------------------------------------

// Resolve the current Farcaster user, or null outside a Mini App context.
// Shape: { fid, username, displayName, pfpUrl }.
window.ZABAL.getUser = async function getUser() {
  try {
    const ctx = await sdk.context;
    return ctx && ctx.user ? ctx.user : null;
  } catch (e) {
    return null;
  }
};

// Open a Farcaster profile - native sheet inside a Mini App, web profile otherwise.
window.ZABAL.viewProfile = async function viewProfile(fid) {
  if (!fid) return;
  try {
    const ctx = await sdk.context;
    if (ctx && ctx.client) {
      await sdk.actions.viewProfile({ fid });
      return;
    }
  } catch (e) {
    // Fall through to web profile.
  }
  window.open('https://farcaster.xyz/~/profiles/' + fid, '_blank', 'noopener');
};

// Open a cast - native viewer inside a Mini App, web conversation otherwise.
window.ZABAL.viewCast = async function viewCast(hash) {
  if (!hash) return;
  try {
    const ctx = await sdk.context;
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

// One share entry point for every page. platform: 'farcaster' | 'x'.
// Farcaster casts post into the /zabal channel with the page as an embed.
window.ZABAL.share = function share({ platform, text, url }) {
  if (platform === 'x') {
    const t = text + (url ? ' ' + url : '');
    window.ZABAL.openNewTab('https://twitter.com/intent/tweet?text=' + encodeURIComponent(t));
    return;
  }
  window.ZABAL.composeCast({ text: text, embeds: url ? [url] : [], channelKey: 'zabal' });
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


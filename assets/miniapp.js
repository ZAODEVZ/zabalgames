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

window.ZABAL.composeCast = async function composeCast({ text, embeds }) {
  try {
    const ctx = await sdk.context;
    if (ctx && ctx.client) {
      await sdk.actions.composeCast({ text, embeds });
      return;
    }
  } catch (e) {
    // Fall through to browser fallback.
  }
  const params = new URLSearchParams();
  if (text) params.set('text', text);
  if (Array.isArray(embeds)) embeds.forEach(e => params.append('embeds[]', e));
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

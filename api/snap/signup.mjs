// ZABAL Games signup - Farcaster Mini App embed wrapper.
//
// Returns HTML with the current fc:miniapp meta (per Farcaster spec May 2026
// + zlank's working pattern - see /Users/zaalpanthaki/Documents/zlank/app/layout.tsx).
// When cast on Farcaster, the unfurl shows a "Sign up" button that launches
// the /lead page as a Farcaster Mini App webview.
//
// The OLD Frame v2 protocol (fc:frame:button:1, fc:frame:button:2, etc) used
// in the previous version of this file is deprecated - the current spec is a
// SINGLE fc:miniapp meta with the entire launch config as JSON. In-cast multi-
// button polls now require the @farcaster/snap SDK with json-render schema -
// queued as a follow-up build.
//
// For now: this endpoint serves the same Mini App embed as the homepage,
// targeting /lead for the signup form. Tap the button, opens the form in a
// Farcaster webview, submit to Formspree.

export const config = { runtime: 'edge' };

const SITE = 'https://zabalgames.com';
const TARGET = `${SITE}/lead`;
const IMG = `${SITE}/assets/icon.png`;

const MINIAPP_CONFIG = JSON.stringify({
  version: '1',
  imageUrl: IMG,
  button: {
    title: 'Are you in? Sign up',
    action: {
      type: 'launch_miniapp',
      name: 'ZABAL Games',
      url: TARGET,
      splashImageUrl: IMG,
      splashBackgroundColor: '#070709',
    },
  },
});

function html() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ZABAL Games Season 1 - Are You In?</title>
<meta name="description" content="Pick your role. Builder, workshop lead, audience, or mentor. ZABAL Games Season 1 - a Farcaster vibe-coding challenge for the ZAO ecosystem.">
<link rel="canonical" href="${TARGET}">
<meta property="og:title" content="ZABAL Games Season 1 - Are You In?">
<meta property="og:description" content="Pick your role. Builder, workshop lead, audience, or mentor.">
<meta property="og:image" content="${IMG}">
<meta property="og:url" content="${TARGET}">
<meta name="twitter:card" content="summary_large_image">
<meta name="fc:miniapp" content='${MINIAPP_CONFIG.replace(/'/g, "&#39;")}'>
<meta name="fc:frame" content='${MINIAPP_CONFIG.replace(/'/g, "&#39;")}'>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#070709;color:#e4e2dd;padding:3rem 1.5rem;text-align:center;line-height:1.6;margin:0}
.card{max-width:520px;margin:0 auto}
h1{font-size:1.6rem;color:#ff6b35;margin-bottom:1rem}
a{color:#00e5ff;text-decoration:none}
a:hover{text-decoration:underline}
p{margin-bottom:0.75rem}
.btn{display:inline-block;background:#ff6b35;color:#fff;padding:0.8rem 1.6rem;border-radius:8px;font-weight:700;margin:0.8rem 0;text-decoration:none}
</style>
</head>
<body>
<div class="card">
<h1>ZABAL Games Season 1</h1>
<p>Cast this URL on Farcaster and the unfurl shows a sign-up button.</p>
<p>On the web? Go straight to the form:</p>
<a class="btn" href="${TARGET}">Sign up to lead a workshop</a>
<p style="margin-top:1.5rem;font-size:0.85rem;color:#8a8895">Or open the home page: <a href="${SITE}">${SITE}</a></p>
</div>
</body>
</html>`;
}

export default async function handler(req) {
  const headers = {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  };
  if (req.method === 'GET' || req.method === 'HEAD') {
    return new Response(html(), { headers });
  }
  // POST kept for potential future Snap-spec handling; for now just return HTML.
  return new Response(html(), { headers });
}

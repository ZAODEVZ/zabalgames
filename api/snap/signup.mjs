// ZABAL Games signup Snap - hybrid endpoint.
//
// Content negotiation per @farcaster/snap spec:
// - Accept: application/vnd.farcaster.snap+json -> return Snap JSON (in-cast
//   interactive 4-role-button signup, confirmation Snap on POST).
// - Other Accept (browsers, link unfurl) -> return HTML with fc:miniapp meta
//   (launch-mini-app button as fallback).
//
// Snap protocol: spec v2.0, hand-built JSON per the @farcaster/snap llms.txt
// schemas (validated against zlank's working implementation in
// /Users/zaalpanthaki/Documents/zlank/app/api/snap/[encoded]/route.ts).
//
// Submit pattern: each role button targets ?role=<role> on this endpoint. The
// POST handler reads the role from the query string + the FID from the body's
// trustedData/user, forwards to Formspree as the stub backend, and returns a
// role-specific confirmation Snap with an open_url button to the full site.
//
// JFS signature verification is INTENTIONALLY SKIPPED in v1 (no SDK dep).
// FID + cast hash are read as untrusted. v2 adds parseRequest verification
// once we move to a Node runtime with @farcaster/snap installed.

export const config = { runtime: 'edge' };

const SITE = 'https://zabalgames.com';
const ENDPOINT = `${SITE}/api/snap/signup`;
const IMG = `${SITE}/assets/icon.png`;
const FORMSPREE_URL = 'https://formspree.io/f/mjgajyqe';
const SNAP_MEDIA_TYPE = 'application/vnd.farcaster.snap+json';
const CHANNEL_URL = 'https://farcaster.xyz/~/channel/zabal';

const ROLE_LABELS = {
  'builder':       'Builder - July ship',
  'workshop-lead': 'Workshop Lead - June teach',
  'audience':      'Audience - RSVP',
  'mentor':        'Mentor - August embed',
};
const ROLE_CTA = {
  'builder':       'July open build-a-thon. DM you the context + adoptable projects before July 1.',
  'workshop-lead': 'Pick your June slot. DM you to lock the date + record the session.',
  'audience':      'RSVP per workshop via Lu.ma once the calendar fills.',
  'mentor':        'August Finals. DM you about embedded-teammate pairing once the cohort lands.',
};

// ---- Snap JSON responses ----

function initialSnap() {
  return {
    version: '2.0',
    theme: { accent: 'purple' },
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack',
          props: { gap: 'md' },
          children: ['title', 'subtitle', 'btn1', 'btn2', 'btn3', 'btn4'],
        },
        title: {
          type: 'text',
          props: { content: 'ZABAL Games Season 1', weight: 'bold' },
        },
        subtitle: {
          type: 'text',
          props: { content: 'Are you in? Pick your role.', size: 'sm' },
        },
        btn1: {
          type: 'button',
          props: { label: ROLE_LABELS['builder'], variant: 'primary' },
          on: { press: { action: 'submit', params: { target: `${ENDPOINT}?role=builder` } } },
        },
        btn2: {
          type: 'button',
          props: { label: ROLE_LABELS['workshop-lead'], variant: 'secondary' },
          on: { press: { action: 'submit', params: { target: `${ENDPOINT}?role=workshop-lead` } } },
        },
        btn3: {
          type: 'button',
          props: { label: ROLE_LABELS['audience'], variant: 'secondary' },
          on: { press: { action: 'submit', params: { target: `${ENDPOINT}?role=audience` } } },
        },
        btn4: {
          type: 'button',
          props: { label: ROLE_LABELS['mentor'], variant: 'secondary' },
          on: { press: { action: 'submit', params: { target: `${ENDPOINT}?role=mentor` } } },
        },
      },
    },
  };
}

function confirmationSnap(role) {
  const cta = ROLE_CTA[role] || 'Check DMs for next steps.';
  const label = ROLE_LABELS[role] || role;
  return {
    version: '2.0',
    theme: { accent: 'purple' },
    effects: ['confetti'],
    ui: {
      root: 'page',
      elements: {
        page: {
          type: 'stack',
          props: { gap: 'md' },
          children: ['title', 'role_text', 'cta_text', 'btn_site', 'btn_channel'],
        },
        title: { type: 'text', props: { content: "You're in.", weight: 'bold' } },
        role_text: { type: 'text', props: { content: `Role: ${label}`, size: 'sm' } },
        cta_text: { type: 'text', props: { content: cta, size: 'sm' } },
        btn_site: {
          type: 'button',
          props: { label: 'Open full site', variant: 'primary', icon: 'external-link' },
          on: { press: { action: 'open_url', params: { target: SITE } } },
        },
        btn_channel: {
          type: 'button',
          props: { label: 'Follow /zabal', variant: 'secondary', icon: 'arrow-right' },
          on: { press: { action: 'open_url', params: { target: CHANNEL_URL } } },
        },
      },
    },
  };
}

// ---- HTML fallback (browsers + Mini App embed) ----

const MINIAPP_CONFIG = JSON.stringify({
  version: '1',
  imageUrl: IMG,
  button: {
    title: 'Are you in? Sign up',
    action: {
      type: 'launch_miniapp',
      name: 'ZABAL Games',
      url: `${SITE}/lead`,
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
<meta name="description" content="Pick your role. Builder, workshop lead, audience, or mentor.">
<link rel="canonical" href="${SITE}/lead">
<meta property="og:title" content="ZABAL Games Season 1 - Are You In?">
<meta property="og:description" content="Pick your role. Builder, workshop lead, audience, or mentor.">
<meta property="og:image" content="${IMG}">
<meta property="og:url" content="${SITE}/lead">
<meta name="twitter:card" content="summary_large_image">
<meta name="fc:miniapp" content='${MINIAPP_CONFIG.replace(/'/g, '&#39;')}'>
<meta name="fc:frame" content='${MINIAPP_CONFIG.replace(/'/g, '&#39;')}'>
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
<p>This URL is a Farcaster Snap - cast it on /zabal and the in-feed unfurl shows 4 role buttons.</p>
<p>On the web?</p>
<a class="btn" href="${SITE}/lead">Sign up to lead a workshop</a>
<p style="margin-top:1.5rem;font-size:0.85rem;color:#8a8895">Or open the home page: <a href="${SITE}">${SITE}</a></p>
</div>
</body>
</html>`;
}

// ---- Backend stub ----

function forwardToBackend(payload) {
  return fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

// ---- Handler ----

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

export default async function handler(req) {
  const accept = req.headers.get('accept') || '';
  const wantsSnap = accept.includes(SNAP_MEDIA_TYPE);
  const url = new URL(req.url);
  const role = url.searchParams.get('role');

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method === 'GET') {
    if (wantsSnap) {
      return new Response(JSON.stringify(initialSnap()), {
        headers: {
          ...CORS_HEADERS,
          'Content-Type': SNAP_MEDIA_TYPE + '; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=60',
        },
      });
    }
    return new Response(html(), {
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }

  if (req.method === 'POST') {
    let body = {};
    try { body = await req.json(); } catch {}

    // Untrusted - JFS verification deferred to v2.
    const fid = body?.user?.fid ?? body?.untrustedData?.fid ?? null;
    const castHash = body?.surface?.cast?.hash ?? body?.untrustedData?.castId?.hash ?? null;
    const resolvedRole = role || body?.inputs?.role || 'unknown';

    forwardToBackend({
      form_source: 'snap-signup',
      fid,
      role: resolvedRole,
      castHash,
      ts: new Date().toISOString(),
      surface: body?.surface?.type ?? null,
    });

    const snapBody = wantsSnap
      ? JSON.stringify(confirmationSnap(resolvedRole))
      : html();
    const contentType = wantsSnap
      ? SNAP_MEDIA_TYPE + '; charset=utf-8'
      : 'text/html; charset=utf-8';

    return new Response(snapBody, {
      headers: { ...CORS_HEADERS, 'Content-Type': contentType, 'Cache-Control': 'no-store' },
    });
  }

  return new Response('Method not allowed', { status: 405, headers: CORS_HEADERS });
}

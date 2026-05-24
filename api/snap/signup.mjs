// ZABAL Games signup Snap - custom Vercel serverless function.
//
// GET  /api/snap/signup -> initial HTML with Farcaster Frame metas (4 role buttons)
// POST /api/snap/signup -> handles button press, forwards to Formspree as stub
//                          backend, returns confirmation Frame
//
// Backend is Formspree (Zaal's existing form ID, dashboard captures the signups).
// Migrate to Supabase by swapping the `forwardToBackend` body - schema lives at
// db/schema.sql.
//
// NOTE: JFS signature verification is intentionally skipped in v1 (no
// @farcaster/snap dep). Untrusted FID is recorded as-is. v2 adds parseRequest.

export const config = { runtime: 'edge' };

const SITE = 'https://zabalgames.com';
const POST_URL = `${SITE}/api/snap/signup`;
const SNAP_IMG = `${SITE}/assets/icon.png`; // PNG for cross-client compat. Swap to og-card.png once it exists.
const FORMSPREE_URL = 'https://formspree.io/f/mjgajyqe';

const ROLES = ['builder', 'workshop-lead', 'audience', 'mentor'];
const ROLE_LABELS = [
  'Builder - July ship',
  'Workshop Lead - June teach',
  'Audience - RSVP',
  'Mentor - August embed',
];
const ROLE_CTA = {
  'builder':       'July open build-a-thon. DM you the context + adoptable projects before July 1.',
  'workshop-lead': 'Pick your June slot. DM you to lock the date + record the session.',
  'audience':      'RSVP per workshop via Lu.ma once the calendar fills.',
  'mentor':        'August Finals. DM you about embedded-teammate pairing once the cohort lands.',
};

function html(headExtras, bodyText) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ZABAL Games - Are You In?</title>
${headExtras}
<meta property="og:title" content="ZABAL Games Season 1 - Are You In?">
<meta property="og:description" content="Pick your role. Takes 5 seconds.">
<meta property="og:image" content="${SNAP_IMG}">
<style>body{font-family:-apple-system,sans-serif;background:#070709;color:#e4e2dd;padding:2rem;text-align:center;line-height:1.6}a{color:#ff6b35}</style>
</head>
<body>
<p>${bodyText}</p>
<p>Open this in <a href="https://farcaster.xyz/~/channel/zabal">Farcaster /zabal</a> for the interactive Snap.</p>
<p><a href="${SITE}">${SITE}</a></p>
</body>
</html>`;
}

function initialFrame() {
  const metas = [
    `<meta property="fc:frame" content="vNext">`,
    `<meta property="fc:frame:image" content="${SNAP_IMG}">`,
    `<meta property="fc:frame:image:aspect_ratio" content="1.91:1">`,
    `<meta property="fc:frame:post_url" content="${POST_URL}">`,
    ROLE_LABELS.map((label, i) => `<meta property="fc:frame:button:${i + 1}" content="${label}">`).join('\n'),
  ].join('\n');
  return html(metas, 'ZABAL Games Season 1 - pick your role.');
}

function confirmationFrame(role) {
  const cta = ROLE_CTA[role] || 'Check DMs for next steps.';
  const metas = [
    `<meta property="fc:frame" content="vNext">`,
    `<meta property="fc:frame:image" content="${SNAP_IMG}">`,
    `<meta property="fc:frame:image:aspect_ratio" content="1.91:1">`,
    `<meta property="fc:frame:button:1" content="Open full site">`,
    `<meta property="fc:frame:button:1:action" content="link">`,
    `<meta property="fc:frame:button:1:target" content="${SITE}">`,
    `<meta property="fc:frame:button:2" content="Join /zabal">`,
    `<meta property="fc:frame:button:2:action" content="link">`,
    `<meta property="fc:frame:button:2:target" content="https://farcaster.xyz/~/channel/zabal">`,
  ].join('\n');
  return html(metas, `You're in - role: ${role}. ${cta}`);
}

function forwardToBackend(payload) {
  // Fire-and-forget POST to Formspree (the stub backend until Supabase is wired).
  return fetch(FORMSPREE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(payload),
  }).catch(() => {/* swallow - Snap UX must not block on backend */});
}

export default async function handler(req) {
  const baseHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' };

  if (req.method === 'GET') {
    return new Response(initialFrame(), { headers: baseHeaders });
  }

  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(initialFrame(), { headers: baseHeaders });
    }

    const buttonIndex = body?.untrustedData?.buttonIndex ?? 1;
    const fid = body?.untrustedData?.fid ?? null;
    const castHash = body?.untrustedData?.castId?.hash ?? null;
    const role = ROLES[buttonIndex - 1] || 'unknown';

    // Stub backend - non-blocking. Replace with Supabase when wired.
    forwardToBackend({
      form_source: 'snap-signup',
      fid,
      role,
      buttonIndex,
      castHash,
      ts: new Date().toISOString(),
    });

    return new Response(confirmationFrame(role), { headers: baseHeaders });
  }

  return new Response('Method not allowed', { status: 405 });
}

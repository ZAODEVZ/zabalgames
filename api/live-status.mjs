// ZABAL Gamez - real live-stream status (GET /api/live-status).
//
// /live used to guess "Live now" from the workshop schedule, so it could claim a session was
// on when the stream was actually off (and miss surprise streams). This returns the REAL
// state of the Twitch channel so the page can be honest.
//
// Keyless: reads decapi.me, a free public Twitch status proxy - no Twitch app, no client id
// or secret. Workshops multicast to Twitch + YouTube together via Restream, so the Twitch
// signal stands in for "we are streaming". Override the channel with ?channel=.
//
//   GET /api/live-status  ->  { ok, configured, live, platform, channel, title, viewers, uptime }
//
// Best-effort: any upstream failure returns live:false rather than erroring, so the page
// quietly falls back to its schedule-driven view.

export const config = { runtime: 'edge' };

const DECAPI = 'https://decapi.me/twitch';
const DEFAULT_CHANNEL = 'bettercallzaal';

function json(body, maxAge = 30) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // Short cache: live state changes minute-to-minute, but we never want to hammer decapi.
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

function cleanChannel(c) {
  return String(c || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 25);
}

async function text(path) {
  try {
    const r = await fetch(`${DECAPI}${path}`, { signal: AbortSignal.timeout(2500) });
    if (!r.ok) return '';
    return (await r.text()).trim();
  } catch {
    return '';
  }
}

// decapi returns "<channel> is offline" (and similar) when not live; a real uptime/title/count
// otherwise. Treat any offline/error sentinel as not-live.
function offlineish(s) {
  if (!s) return true;
  return /offline|is not (live|streaming)|no (stream|user)|error|unable/i.test(s);
}

export default async function handler(req) {
  const url = new URL(req.url);
  const channel = cleanChannel(url.searchParams.get('channel')) || DEFAULT_CHANNEL;

  const uptime = await text(`/uptime/${channel}`);
  const live = !offlineish(uptime);

  if (!live) {
    return json({ ok: true, configured: true, live: false, platform: 'twitch', channel });
  }

  // Live: enrich with title + viewer count (best-effort, in parallel).
  const [title, viewersRaw] = await Promise.all([
    text(`/status/${channel}`),
    text(`/viewercount/${channel}`),
  ]);
  const viewers = /^\d+$/.test(viewersRaw) ? Number(viewersRaw) : null;

  return json({
    ok: true,
    configured: true,
    live: true,
    platform: 'twitch',
    channel,
    title: offlineish(title) ? null : title,
    viewers,
    uptime,
  });
}

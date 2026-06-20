// ZABAL Gamez - real live-stream status (GET /api/live-status).
//
// /live used to guess "Live now" from the workshop schedule, so it could claim a session was
// on when the stream was actually off (and miss surprise streams). This returns the REAL
// state of BOTH the Twitch and YouTube channels so the page can be honest and auto-select
// whichever platform is actually streaming.
//
// Keyless on both sides:
//  - Twitch: reads decapi.me, a free public Twitch status proxy (no app, client id, or secret).
//  - YouTube: fetches the channel's /live page and looks for the live HLS manifest, which is
//    only present while an actual broadcast is running (premieres/uploads do not have it). When
//    live, the live video id is pulled out so the page can embed the real stream + its chat.
//
// Workshops multicast to Twitch + YouTube together via Restream, so either signal means
// "we are streaming". Override channels with ?channel= (twitch) and ?youtube= (handle).
//
//   GET /api/live-status  ->  { ok, configured, live, platform, channel, title, viewers, uptime,
//                              twitch:{ live, channel, title, viewers, uptime },
//                              youtube:{ live, handle, videoId, title } }
//
// Best-effort: any upstream failure returns live:false rather than erroring, so the page
// quietly falls back to its schedule-driven view.

export const config = { runtime: 'edge' };

const DECAPI = 'https://decapi.me/twitch';
const DEFAULT_CHANNEL = 'bettercallzaal';
const DEFAULT_YT_HANDLE = 'bettercallzaal';

function json(body, maxAge = 30) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      // Short cache: live state changes minute-to-minute, but we never want to hammer upstream.
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

function cleanChannel(c) {
  return String(c || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 25);
}

function cleanHandle(h) {
  return String(h || '').trim().replace(/^@/, '').toLowerCase().replace(/[^a-z0-9_.-]/g, '').slice(0, 40);
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

async function twitchLive(channel) {
  const uptime = await text(`/uptime/${channel}`);
  if (offlineish(uptime)) return { live: false, channel };

  // Live: enrich with title + viewer count (best-effort, in parallel).
  const [title, viewersRaw] = await Promise.all([
    text(`/status/${channel}`),
    text(`/viewercount/${channel}`),
  ]);
  const viewers = /^\d+$/.test(viewersRaw) ? Number(viewersRaw) : null;
  return {
    live: true,
    channel,
    title: offlineish(title) ? null : title,
    viewers,
    uptime,
  };
}

// Keyless YouTube live check: the channel /live page only carries an HLS manifest while an
// actual broadcast is on air. Pull the live video id so the page can embed the real stream.
async function youtubeLive(handle) {
  try {
    const r = await fetch(`https://www.youtube.com/@${handle}/live`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ZabalGamezBot/1.0; +https://zabalgamez.com)',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(3500),
    });
    if (!r.ok) return { live: false, handle };
    const html = await r.text();
    const isLive = html.indexOf('"hlsManifestUrl"') >= 0 || html.indexOf('"isLiveNow":true') >= 0;
    if (!isLive) return { live: false, handle };

    let videoId = null;
    const canon = html.match(/<link rel="canonical" href="https:\/\/www\.youtube\.com\/watch\?v=([\w-]{11})">/);
    if (canon) videoId = canon[1];
    if (!videoId) { const m = html.match(/"videoId":"([\w-]{11})"/); if (m) videoId = m[1]; }

    let title = null;
    const t = html.match(/<meta name="title" content="([^"]+)">/) || html.match(/<title>([^<]+)<\/title>/);
    if (t) title = (t[1] || '').replace(/ - YouTube$/, '').trim() || null;

    return { live: true, handle, videoId, title };
  } catch {
    return { live: false, handle };
  }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const channel = cleanChannel(url.searchParams.get('channel')) || DEFAULT_CHANNEL;
  const ytHandle = cleanHandle(url.searchParams.get('youtube')) || DEFAULT_YT_HANDLE;

  // Check both platforms in parallel; either being live means "we are streaming".
  const [twitch, youtube] = await Promise.all([twitchLive(channel), youtubeLive(ytHandle)]);

  const live = twitch.live || youtube.live;
  // Prefer Twitch when both are live (it carries viewer count + uptime); else the live one.
  const platform = twitch.live ? 'twitch' : (youtube.live ? 'youtube' : 'twitch');
  const chosen = twitch.live ? twitch : (youtube.live ? youtube : twitch);

  return json({
    ok: true,
    configured: true,
    live,
    platform,
    channel,
    title: chosen.title || null,
    viewers: twitch.live ? (twitch.viewers != null ? twitch.viewers : null) : null,
    uptime: twitch.live ? (twitch.uptime || null) : null,
    twitch,
    youtube,
  });
}

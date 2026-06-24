// ZABAL Gamez - clip claim metadata (GET /api/clip-meta).
//
// POIDH stores a claim's `uri` on-chain and its UI renders a claim by doing
// fetch(uri) and reading the `image` field of the returned JSON (see poidh-app
// ClaimImageEmbed). It does NOT require IPFS - any CORS-enabled JSON endpoint with
// {name, description, image} works. So a clip claim submitted from a recording page
// points its uri here: we echo a poster image (the recording's YouTube thumbnail)
// plus the clip link, so the claim card renders cleanly and judges can watch the clip.
//
// Stateless by design - everything needed is in the query string, because the uri is
// immutable once it is written on-chain:
//   GET /api/clip-meta?v=<ytId>&c=<clipUrl>&t=<title>&d=<description>
//   -> { name, description, image, external_url, animation_url }
//
// v  - YouTube video id of the source recording (builds the poster image)
// c  - URL of the submitted clip (YouTube Clip, Farcaster cast, etc.)
// t  - claim title
// d  - claim description

export const config = { runtime: 'edge' };

function json(body) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}

// Only allow a YouTube id shape so we never echo an arbitrary image host.
function ytId(s) {
  return /^[A-Za-z0-9_-]{6,20}$/.test(String(s || '')) ? String(s) : '';
}
// Accept only http(s) links for the clip, else drop it.
function safeUrl(s) {
  try {
    const u = new URL(String(s || ''));
    return (u.protocol === 'http:' || u.protocol === 'https:') ? u.href : '';
  } catch (e) { return ''; }
}

export default async function handler(req) {
  const url = new URL(req.url);
  const v = ytId(url.searchParams.get('v'));
  const clip = safeUrl(url.searchParams.get('c'));
  const title = (url.searchParams.get('t') || 'ZABAL Gamez clip').slice(0, 140);
  let desc = (url.searchParams.get('d') || '').slice(0, 1000);

  // Poster: the recording's YouTube thumbnail (hotlinkable, stable). Fallback to the
  // ZABAL Gamez arcade card so the claim never renders imageless.
  const image = v
    ? `https://i.ytimg.com/vi/${v}/hqdefault.jpg`
    : 'https://zabalgamez.com/assets/embed-card-gamez.png';

  if (clip && !desc.includes(clip)) desc = (desc ? desc + '\n\n' : '') + 'Watch the clip: ' + clip;

  return json({
    name: title,
    description: desc,
    image: image,
    external_url: clip || 'https://zabalgamez.com',
    animation_url: clip || undefined,
  });
}

// ZABAL Gamez - activity feed endpoint (GET /api/activity).
//
// Public read for the presence widget. Returns the recent social actions and a
// count of distinct builders active today. Reads Supabase via the
// public.zg_activity_summary RPC. If Supabase is not configured it returns an
// empty, unconfigured payload so the widget can hide itself.
//
// Response: { configured: boolean, count: number, joinsTotal: number, recent:
//   Array<{ fid, username, pfpUrl, action, target, ts }> }

export const config = { runtime: 'edge' };

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(body, maxAge = 10) {
  return new Response(JSON.stringify(body), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

async function sbRpc(fn, args) {
  const r = await fetch(`${SB_URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args || {}),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('sb ' + r.status);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

export default async function handler() {
  if (!SB_URL || !SB_KEY) return json({ configured: false, count: 0, recent: [], joinsTotal: 0 });

  let summary;
  try {
    summary = await sbRpc('zg_activity_summary', {});
  } catch {
    return json({ configured: true, count: 0, recent: [], joinsTotal: 0 });
  }

  return json({
    configured: true,
    count: Number(summary?.count || 0),
    joinsTotal: Number(summary?.joinsTotal || 0),
    recent: Array.isArray(summary?.recent) ? summary.recent : [],
  });
}

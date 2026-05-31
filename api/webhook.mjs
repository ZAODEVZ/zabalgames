// ZABAL Gamez - Farcaster Mini App webhook (POST /api/webhook).
//
// Farcaster POSTs a JSON Farcaster Signature envelope here when a user adds the
// app or toggles notifications (referenced by `webhookUrl` in the manifest).
// We store the notification token + url per FID (zg_notif_tokens) so
// api/notify.mjs can reach them.
//
// v1 stores tokens without verifying the JFS signature (low abuse surface - the
// worst case is a junk token that simply fails on send). Signature verification
// is a clear next step; see api/README.md.

export const config = { runtime: 'edge' };

const SB_URL = process.env.SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

function b64urlToJson(b64url) {
  const b64 = String(b64url).replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
  let s = '';
  for (let i = 0; i < bin.length; i++) s += String.fromCharCode(bin.charCodeAt(i));
  return JSON.parse(decodeURIComponent(escape(s)));
}

// Upsert a row (Prefer: merge-duplicates resolves the primary-key conflict).
async function sbUpsert(table, row) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(row),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('sb ' + r.status);
}

async function sbDelete(table, query) {
  const r = await fetch(`${SB_URL}/rest/v1/${table}?${query}`, {
    method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('sb ' + r.status);
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ error: 'method' }, 405);

  let envelope;
  try { envelope = await req.json(); } catch { return json({ error: 'bad json' }, 400); }

  let header, payload;
  try {
    header = b64urlToJson(envelope.header);
    payload = b64urlToJson(envelope.payload);
  } catch {
    return json({ error: 'bad envelope' }, 400);
  }

  const fid = Number(header && header.fid);
  const event = payload && payload.event;
  if (!Number.isInteger(fid) || fid < 1 || !event) return json({ error: 'missing fid/event' }, 400);
  if (!SB_URL || !SB_KEY) return json({ ok: true, stored: false });

  try {
    if (event === 'frame_added' || event === 'notifications_enabled') {
      const nd = payload.notificationDetails;
      if (nd && nd.token && nd.url) {
        await sbUpsert('zg_notif_tokens', {
          fid, url: nd.url, token: nd.token, updated_at: new Date().toISOString(),
        });
      }
    } else if (event === 'frame_removed' || event === 'notifications_disabled') {
      await sbDelete('zg_notif_tokens', `fid=eq.${fid}`);
    }
  } catch (e) {
    return json({ ok: false, detail: e.message }, 502);
  }

  return json({ ok: true });
}

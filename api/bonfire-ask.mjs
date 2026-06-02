// ZABAL Gamez - Bonfire read-spot query log (POST /api/bonfire-ask).
//
// Phase 1: logs what people ask the ZABAL Bonfire read spot (graph.html), so we
// can see what the community searches for. Anonymous - searching needs no auth.
//
// Phase 2 (after the ZOE contribution contract lands) extends this with
// action:'submit' to push community contributions to an Upstash pending queue
// (zg:bonfire:pending) that ZOE promotes into the canonical Bonfire graph. The
// pending store lives in Upstash here (NOT Supabase - see CLAUDE.md storage note
// and docs/research/771-zabal-bonfire-read-write-spot.md).
//
// Storage: Upstash Redis over the REST API - zero-build edge function like
// api/track.mjs. No-ops (verifies + returns ok) if the KV env vars are absent.
//
// Env:
//   KV_REST_API_URL / UPSTASH_REDIS_REST_URL
//   KV_REST_API_TOKEN / UPSTASH_REDIS_REST_TOKEN
//
// Request:  POST { q: string }
// Response: { ok: true, stored: boolean }

export const config = { runtime: 'edge' };

const KV_URL = (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL);
const KV_TOKEN = (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN);
const QUERIES_KEY = 'zg:bonfire:queries:v1';
const QUERIES_MAX = 500;

function json(body, status = 200, origin = '*') {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Cache-Control': 'no-store',
    },
  });
}

async function kvPipeline(cmds) {
  const r = await fetch(`${KV_URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KV_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    signal: AbortSignal.timeout(4000),
  });
  if (!r.ok) throw new Error('kv ' + r.status);
  return r.json();
}

export default async function handler(req) {
  const origin = req.headers.get('origin') || '*';
  if (req.method === 'OPTIONS') return json({}, 204, origin);
  if (req.method !== 'POST') return json({ error: 'method not allowed' }, 405, origin);

  let body = {};
  try { body = await req.json(); } catch {}
  const q = String(body.q || '').trim().slice(0, 120);
  if (!q) return json({ error: 'empty query' }, 400, origin);

  if (!KV_URL || !KV_TOKEN) return json({ ok: true, stored: false, note: 'KV not configured' }, 200, origin);

  const entry = JSON.stringify({ q, ts: Date.now() });
  try {
    await kvPipeline([
      ['LPUSH', QUERIES_KEY, entry],
      ['LTRIM', QUERIES_KEY, '0', String(QUERIES_MAX - 1)],
    ]);
  } catch (e) {
    return json({ ok: false, stored: false, detail: e.message }, 502, origin);
  }
  return json({ ok: true, stored: true }, 200, origin);
}

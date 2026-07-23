// Resend inbound-email adapter for the canonical ZABAL Gamez submission queue.
//
// Public address: info@thezao.com. Keep the existing mailbox and forward messages
// labeled as ZABAL submissions to a Resend receiving address or receiving subdomain.
// Resend sends `email.received` here; this route verifies the Svix signature, retrieves
// the full message, normalizes it, and creates the same private project record as /submit.

export const config = { runtime: 'edge' };

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET || '';
const INGEST_KEY = process.env.SUBMISSION_INGEST_SECRET || '';
const INBOUND_TO = String(process.env.SUBMISSION_INBOUND_TO || '').split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const MAX_CLOCK_SKEW_SECONDS = 300;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}

function timingEq(a, b) {
  a = String(a || ''); b = String(b || '');
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

function bytesToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function secretBytes(secret) {
  const raw = String(secret || '').replace(/^whsec_/, '');
  try {
    const binary = atob(raw);
    return Uint8Array.from(binary, (c) => c.charCodeAt(0));
  } catch { return new TextEncoder().encode(raw); }
}

async function verifyWebhook(payload, req) {
  if (!WEBHOOK_SECRET) return false;
  const id = req.headers.get('svix-id') || '';
  const timestamp = req.headers.get('svix-timestamp') || '';
  const supplied = req.headers.get('svix-signature') || '';
  const ts = Number(timestamp);
  if (!id || !Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > MAX_CLOCK_SKEW_SECONDS) return false;
  const key = await crypto.subtle.importKey('raw', secretBytes(WEBHOOK_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const signed = new TextEncoder().encode(`${id}.${timestamp}.${payload}`);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, signed));
  const expected = bytesToBase64(digest);
  return supplied.split(/\s+/).some((part) => {
    const bits = part.split(',');
    return bits[0] === 'v1' && timingEq(bits.slice(1).join(','), expected);
  });
}

async function resendGet(path) {
  const r = await fetch(`https://api.resend.com${path}`, {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, Accept: 'application/json', 'User-Agent': 'zabalgamez-submissions/1.0' },
    signal: AbortSignal.timeout(6000),
  });
  if (!r.ok) throw new Error(`resend ${r.status}`);
  return r.json();
}

function cleanText(s, n = 2000) {
  return String(s == null ? '' : s).replace(/[<>]/g, '').replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, '').trim().slice(0, n);
}

function htmlToText(html) {
  return String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
}

function stripThread(text) {
  const lines = String(text || '').replace(/\r/g, '').split('\n');
  const out = [];
  let skipForwardHeaders = false;
  for (const line of lines) {
    if (/^-{2,}\s*Forwarded message\s*-{2,}$/i.test(line.trim())) {
      out.length = 0;
      skipForwardHeaders = true;
      continue;
    }
    if (skipForwardHeaders) {
      if (!line.trim()) { skipForwardHeaders = false; continue; }
      if (/^(from|date|subject|to|cc):\s/i.test(line.trim())) continue;
      skipForwardHeaders = false;
    }
    if (/^On .+wrote:$/i.test(line.trim())) break;
    if (/^>/.test(line.trim())) continue;
    out.push(line);
  }
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

function projectTitle(subject, body) {
  let title = String(subject || '').replace(/^(re|fw|fwd):\s*/ig, '').replace(/^zabal\s*gamez\s*submission\s*:\s*/i, '').trim();
  if (!title || /^\[?project name\]?$/i.test(title)) {
    const match = String(body || '').match(/(?:^|\n)\s*project\s*name\s*:\s*([^\n]+)/i);
    title = match ? match[1].trim() : '';
  }
  return cleanText(title || 'Email submission', 160);
}

function inferTrack(text) {
  const s = String(text || '').toLowerCase();
  const explicit = s.match(/(?:^|\n)\s*track(?:,\s*if\s*known)?\s*:\s*(artist|builder|creator)\b/i);
  return explicit ? explicit[1].toLowerCase() : '';
}

function links(text) {
  const found = String(text || '').match(/https?:\/\/[^\s<>()\[\]"']+/g) || [];
  return Array.from(new Set(found.map((url) => url.replace(/[.,;!?]+$/, '')))).slice(0, 12);
}

function address(value) {
  const match = String(value || '').match(/<([^>]+)>/);
  return cleanText(match ? match[1] : value, 320).toLowerCase();
}

function displayName(value) {
  const match = String(value || '').match(/^\s*([^<]+)\s*</);
  const name = match ? match[1].replace(/^"|"$/g, '').trim() : '';
  return cleanText(name, 80);
}

export default async function handler(req) {
  if (req.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
  if (!RESEND_API_KEY || !WEBHOOK_SECRET || !INGEST_KEY) return json({ ok: false, error: 'email intake not configured' }, 503);

  const payload = await req.text();
  if (!(await verifyWebhook(payload, req))) return json({ ok: false, error: 'invalid signature' }, 401);

  let event;
  try { event = JSON.parse(payload); } catch { return json({ ok: false, error: 'bad json' }, 400); }
  if (event.type !== 'email.received') return json({ ok: true, ignored: true });
  const data = event.data || {};
  const emailId = cleanText(data.email_id, 120);
  if (!emailId) return json({ ok: false, error: 'email id required' }, 400);

  const recipients = Array.isArray(data.to) ? data.to.map((s) => address(s)) : [];
  if (INBOUND_TO.length && !recipients.some((recipient) => INBOUND_TO.includes(recipient))) return json({ ok: true, ignored: true, reason: 'recipient' });

  let email, attachmentDoc;
  try {
    [email, attachmentDoc] = await Promise.all([
      resendGet(`/emails/receiving/${encodeURIComponent(emailId)}`),
      resendGet(`/emails/receiving/${encodeURIComponent(emailId)}/attachments`).catch(() => ({ data: data.attachments || [] })),
    ]);
  } catch (error) { return json({ ok: false, error: error.message }, 502); }

  const rawBody = email.text || htmlToText(email.html || '');
  const body = cleanText(stripThread(rawBody), 2000);
  const allLinks = links(rawBody);
  const repoUrl = allLinks.find((url) => /github\.com\//i.test(url)) || '';
  const demoUrl = allLinks.find((url) => !/github\.com\//i.test(url)) || '';
  const sender = address(email.from || data.from);
  if (!sender) return json({ ok: false, error: 'sender required' }, 400);
  const attachments = Array.isArray(attachmentDoc) ? attachmentDoc : Array.isArray(attachmentDoc && attachmentDoc.data) ? attachmentDoc.data : [];

  const normalized = {
    kind: 'project',
    promptId: 'project',
    project: projectTitle(email.subject || data.subject, body),
    answer: body,
    email: sender,
    consent: true,
    source: 'email',
    sourceMessageId: cleanText(email.message_id || data.message_id, 500),
    sourceEventId: req.headers.get('svix-id') || '',
    attachments: attachments.map((item) => ({ id: item.id, filename: item.filename, contentType: item.content_type, size: item.size })),
    fields: {
      project: projectTitle(email.subject || data.subject, body),
      description: body,
      builderName: displayName(email.from || data.from),
      track: inferTrack(rawBody),
      stage: 'ready',
      demoUrl,
      repoUrl,
      mediaUrl: '',
      emailSourceId: emailId,
    },
  };

  let created;
  try {
    const r = await fetch(new URL('/api/submissions', req.url), {
      method: 'POST',
      headers: { Authorization: `Bearer ${INGEST_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(normalized),
      signal: AbortSignal.timeout(7000),
    });
    created = await r.json();
    if (!r.ok || !created.ok) return json({ ok: false, error: created.error || 'submission create failed' }, 502);
  } catch { return json({ ok: false, error: 'submission create failed' }, 502); }

  return json({ ok: true, id: created.id, duplicate: !!created.duplicate, status: created.status });
}

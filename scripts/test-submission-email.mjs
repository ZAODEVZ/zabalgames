#!/usr/bin/env node

// Zero-dependency contract smoke test for the Resend inbound adapter.
// Network calls are stubbed, including the internal canonical submission call.

import assert from 'node:assert/strict';
import { createHmac } from 'node:crypto';

const signingKey = Buffer.from('zabal-email-test-key');
process.env.RESEND_API_KEY = 'test-resend-key';
process.env.RESEND_WEBHOOK_SECRET = `whsec_${signingKey.toString('base64')}`;
process.env.SUBMISSION_INGEST_SECRET = 'test-ingest-key';
process.env.SUBMISSION_INBOUND_TO = 'projects@inbound.example.com';

const { default: handler } = await import('../api/submission-email.mjs');
let normalized = null;

globalThis.fetch = async function (input, init = {}) {
  const url = String(input);
  if (url.endsWith('/attachments')) {
    return new Response(JSON.stringify({ data: [{ id: 'att_1', filename: 'demo.pdf', content_type: 'application/pdf', size: 1200 }] }), { status: 200 });
  }
  if (url.includes('/emails/receiving/email_1')) {
    return new Response(JSON.stringify({
      message_id: 'message_1',
      from: 'Test Builder <builder@example.com>',
      subject: 'Fwd: ZABAL Gamez submission: Forwarded Build',
      text: [
        'Forwarded for the project queue.',
        '',
        '---------- Forwarded message ---------',
        'From: Test Builder <builder@example.com>',
        'Date: Wed, 22 Jul 2026',
        'Subject: ZABAL Gamez submission: Forwarded Build',
        'To: info@thezao.com',
        '',
        'Project name: Forwarded Build',
        'What did you make? A useful project.',
        'Track: creator',
        'https://example.com/demo',
        'https://github.com/example/repo'
      ].join('\n')
    }), { status: 200 });
  }
  if (url === 'https://zabalgamez.com/api/submissions') {
    assert.equal(init.headers.Authorization, 'Bearer test-ingest-key');
    normalized = JSON.parse(init.body);
    return new Response(JSON.stringify({ ok: true, id: '77', status: 'pending', editToken: 'private' }), { status: 200 });
  }
  throw new Error(`Unexpected fetch: ${url}`);
};

const event = JSON.stringify({
  type: 'email.received',
  data: {
    email_id: 'email_1',
    message_id: 'message_1',
    from: 'Test Builder <builder@example.com>',
    to: ['projects@inbound.example.com'],
    subject: 'Fwd: ZABAL Gamez submission: Forwarded Build'
  }
});
const webhookId = 'msg_webhook_1';
const timestamp = String(Math.floor(Date.now() / 1000));
const signature = createHmac('sha256', signingKey).update(`${webhookId}.${timestamp}.${event}`).digest('base64');

function request(sig) {
  return new Request('https://zabalgamez.com/api/submission-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'svix-id': webhookId, 'svix-timestamp': timestamp, 'svix-signature': sig },
    body: event
  });
}

const denied = await handler(request('v1,bad-signature'));
assert.equal(denied.status, 401);

const accepted = await handler(request(`v1,${signature}`));
assert.equal(accepted.status, 200);
assert.deepEqual(await accepted.json(), { ok: true, id: '77', duplicate: false, status: 'pending' });
assert.equal(normalized.kind, 'project');
assert.equal(normalized.project, 'Forwarded Build');
assert.equal(normalized.email, 'builder@example.com');
assert.equal(normalized.source, 'email');
assert.equal(normalized.fields.track, 'creator');
assert.equal(normalized.fields.demoUrl, 'https://example.com/demo');
assert.equal(normalized.fields.repoUrl, 'https://github.com/example/repo');
assert.match(normalized.answer, /A useful project/);
assert.doesNotMatch(normalized.answer, /Forwarded for the project queue/);
assert.equal(normalized.attachments[0].filename, 'demo.pdf');

console.log('submission email adapter: all checks passed');

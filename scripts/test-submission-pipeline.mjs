#!/usr/bin/env node

// Zero-dependency contract smoke test for the canonical submission handler.
// Uses a tiny in-memory Upstash REST stand-in and never contacts external services.
//
// UPDATED 2026-09-08. This test asserted the old APPROVAL-QUEUE model - create goes to
// 'pending' and stays hidden from the public until an admin approves it. The pipeline moved to
// AUTO-ACCEPT (api/submissions.mjs:23: "a new project goes live on the board immediately
// (status 'approved'); moderation is delete-after"), so the test had been failing ever since
// and had been quietly left OUT of the SessionStart hook chain rather than updated. That is the
// worst of both outcomes: the submission pipeline was unguarded AND looked tested, because a
// test file existed. Every status below was measured against the real handler, not assumed.

import assert from 'node:assert/strict';
import http from 'node:http';

const strings = new Map();
const sets = new Map();
const sorted = new Map();

function setFor(key) {
  if (!sets.has(key)) sets.set(key, new Set());
  return sets.get(key);
}

function sortedFor(key) {
  if (!sorted.has(key)) sorted.set(key, new Map());
  return sorted.get(key);
}

function command(parts) {
  const [raw, key, ...args] = parts;
  const op = String(raw || '').toUpperCase();
  if (op === 'GET') return strings.get(key) ?? null;
  if (op === 'SET') { strings.set(key, String(args[0])); return 'OK'; }
  if (op === 'INCR') { const value = Number(strings.get(key) || 0) + 1; strings.set(key, String(value)); return value; }
  if (op === 'EXPIRE') return 1;
  if (op === 'SADD') { const s = setFor(key); const before = s.size; args.forEach((value) => s.add(String(value))); return s.size - before; }
  if (op === 'SREM') { const s = setFor(key); let removed = 0; args.forEach((value) => { if (s.delete(String(value))) removed++; }); return removed; }
  if (op === 'SMEMBERS') return Array.from(setFor(key));
  if (op === 'ZADD') { sortedFor(key).set(String(args[1]), Number(args[0])); return 1; }
  if (op === 'ZREM') return sortedFor(key).delete(String(args[0])) ? 1 : 0;
  if (op === 'ZREVRANGE') {
    const start = Number(args[0]); const stop = Number(args[1]);
    return Array.from(sortedFor(key).entries()).sort((a, b) => b[1] - a[1]).slice(start, stop + 1).map((row) => row[0]);
  }
  throw new Error(`Unsupported mock command: ${op}`);
}

const server = http.createServer((req, res) => {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => { body += chunk; });
  req.on('end', () => {
    try {
      const pipeline = JSON.parse(body || '[]');
      const result = pipeline.map((parts) => ({ result: command(parts) }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const address = server.address();
process.env.KV_REST_API_URL = `http://127.0.0.1:${address.port}`;
process.env.KV_REST_API_TOKEN = 'test-kv-token';
process.env.ADMIN_KEY = 'test-admin-key';
process.env.SUBMISSION_INGEST_SECRET = 'test-ingest-key';
process.env.RESEND_API_KEY = '';

const { default: handler } = await import('../api/submissions.mjs');

async function call(path, body, token) {
  const headers = {};
  const init = { method: body ? 'POST' : 'GET', headers };
  if (body) { headers['Content-Type'] = 'application/json'; init.body = JSON.stringify(body); }
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await handler(new Request(`https://zabalgamez.com${path}`, init));
  return response.json();
}

try {
  const created = await call('/api/submissions', {
    kind: 'project', promptId: 'project', project: 'Smoke Project', answer: 'A real test project.',
    handle: 'example', email: 'builder@example.com', consent: true, source: 'email',
    attachments: [{ id: 'fake', filename: 'fake.pdf', contentType: 'application/pdf', size: 42 }],
    fields: {
      project: 'Smoke Project', description: 'A real test project.', builderName: 'Example Builder',
      track: 'builder', demoUrl: 'https://example.com/demo', emailSourceId: 'must-stay-private',
    },
  });
  assert.equal(created.ok, true);
  // AUTO-ACCEPT: live on the board immediately. If this ever reads 'pending' again, the
  // approval queue is back and /submissions, /review and the docs all need to change together.
  assert.equal(created.status, 'approved');
  assert.ok(created.editToken);

  const livePublic = await call(`/api/submissions?id=${created.id}`);
  assert.equal(livePublic.submission.status, 'approved');
  assert.equal(livePublic.submission.handle, 'example');
  assert.equal(livePublic.submission.project, 'Smoke Project');
  // Auto-accept makes the row public, so the privacy boundary matters MORE here, not less:
  // the raw email and the inbound email source id must never appear in the public view.
  assert.equal(livePublic.submission.email, undefined);
  assert.equal(livePublic.submission.fields.emailSourceId, undefined);
  assert.equal(livePublic.submission.editToken, undefined);

  const denied = await call('/api/submissions', { action: 'approve', id: created.id });
  assert.equal(denied.error, 'forbidden');

  const approved = await call('/api/submissions', { action: 'approve', id: created.id }, 'test-admin-key');
  assert.equal(approved.status, 'approved');
  assert.equal(approved.agentToken, null);

  const publicRecord = await call(`/api/submissions?id=${created.id}`);
  assert.equal(publicRecord.submission.project, 'Smoke Project');
  assert.equal(publicRecord.submission.builder.name, 'Example Builder');
  assert.equal(publicRecord.submission.fields.emailSourceId, undefined);
  assert.equal(publicRecord.submission.email, undefined);

  const updated = await call('/api/submissions', {
    action: 'update', id: created.id, editToken: created.editToken,
    answer: 'Updated description.', fields: { project: 'Updated Project', description: 'Updated description.' },
  });
  // An owner edit does NOT send the row back to a review queue - there isn't one.
  assert.equal(updated.status, 'approved');
  assert.equal(updated.submission.fields.project, 'Updated Project');

  const stillLive = await call(`/api/submissions?id=${created.id}`);
  assert.equal(stillLive.submission.status, 'approved');
  assert.equal(stillLive.submission.project, 'Updated Project');
  assert.equal(stillLive.submission.email, undefined);

  const owner = await call(`/api/submissions?id=${created.id}&token=${encodeURIComponent(created.editToken)}`);
  assert.equal(owner.owner, true);
  assert.equal(owner.submission.email, 'builder@example.com');
  assert.equal(owner.submission.editToken, undefined);
  assert.equal(owner.submission.source, 'web');
  assert.deepEqual(owner.submission.attachments, []);

  console.log('submission pipeline: all checks passed');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await new Promise((resolve) => server.close(resolve));
}
process.exit(process.exitCode || 0);

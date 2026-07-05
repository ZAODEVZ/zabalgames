#!/usr/bin/env node
// ZABAL Gamez MCP server - plug your agent into the season.
//
// Wraps the ZABAL Gamez agent gateway (https://zabalgamez.com/api/agent) as MCP
// tools so any MCP-capable agent (Claude Code, etc.) can pull your status and
// push new submissions. You unlock a token when your FIRST submission is
// approved - see mcp/README.md.
//
// Config (env):
//   ZABALGAMEZ_TOKEN   your agent token (zg_...), required
//   ZABALGAMEZ_BASE    base URL, default https://zabalgamez.com
//
// Run: ZABALGAMEZ_TOKEN=zg_... node mcp/zabalgamez-mcp.mjs
// Needs: npm i @modelcontextprotocol/sdk zod   (see mcp/package.json)

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const BASE = (process.env.ZABALGAMEZ_BASE || 'https://zabalgamez.com').replace(/\/$/, '');
const TOKEN = process.env.ZABALGAMEZ_TOKEN || '';

if (!TOKEN) {
  console.error('[zabalgamez-mcp] Set ZABALGAMEZ_TOKEN (zg_...). Unlock one by getting your first submission approved.');
  process.exit(1);
}

async function api(method, body) {
  const res = await fetch(`${BASE}/api/agent`, {
    method,
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok !== false, data };
}

const server = new McpServer({ name: 'zabalgamez', version: '1.0.0' });

server.tool(
  'zabalgamez_status',
  'Pull your ZABAL Gamez builder status: your submissions and their states (draft/pending/approved).',
  {},
  async () => {
    const { ok, data } = await api('GET');
    if (!ok) return { content: [{ type: 'text', text: `Could not read status: ${data.error || 'unknown'}` }], isError: true };
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  }
);

server.tool(
  'zabalgamez_submit',
  'Push a new ZABAL Gamez submission attributed to you. Lands in review (pending) for a human to approve. One small shippable thing = one submission.',
  {
    promptId: z.string().optional().describe("Category, e.g. 'build', 'community-win'. Defaults to 'build'."),
    answer: z.string().describe('What you built/shipped, in plain language.'),
    url: z.string().optional().describe('A link that proves it: the repo, the live app, the cast, the video.'),
    fields: z.record(z.string()).optional().describe('Optional extra key/value context (repo, track, live).'),
  },
  async ({ promptId, answer, url, fields }) => {
    const { ok, data } = await api('POST', { action: 'submit', promptId, answer, url, fields });
    if (!ok) return { content: [{ type: 'text', text: `Submit failed: ${data.error || data.reason || 'unknown'}` }], isError: true };
    return { content: [{ type: 'text', text: `Submitted #${data.id} (status: ${data.status}). It shows on the wall once a human approves it.` }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('[zabalgamez-mcp] ready - base ' + BASE);

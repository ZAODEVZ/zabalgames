#!/usr/bin/env node
// ZABAL Gamez - promote builder submissions to the live intake API.
//
// Reads data/builder-submissions.json and POSTs each project with intake_ready:true to
// /api/submission-intake. Uses ADMIN_KEY env var for auth. Safe to re-run - the intake
// API upserts by builder+project (stable id), so re-posting updates rather than duplicates.
//
// Usage:
//   ADMIN_KEY=<key> node scripts/promote-submissions.mjs [--dry-run]
//
// Options:
//   --dry-run   Print what would be POSTed without sending (default when ADMIN_KEY not set).
//   --builder=<handle>  Only promote one builder (e.g. --builder=ghostmintops).
//   --all       Include partial projects (intake_ready:false) as well - useful for bulk import.
//
// The intake endpoint is at /api/submission-intake (see api/submission-intake.mjs for schema).

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const args = process.argv.slice(2);
const dryRun = !process.env.ADMIN_KEY || args.includes('--dry-run');
const includeAll = args.includes('--all');
const onlyBuilder = (args.find((a) => a.startsWith('--builder=')) || '').slice('--builder='.length) || null;

const BASE_URL = process.env.ZABAL_BASE_URL || 'https://zabalgamez.com';
const ADMIN_KEY = process.env.ADMIN_KEY || '';

const DATA_PATH = resolve(import.meta.dirname || '.', '../data/builder-submissions.json');
const data = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
const submissions = data.submissions || [];

let posted = 0, skipped = 0, failed = 0;

for (const builder of submissions) {
  if (onlyBuilder && builder.builder !== onlyBuilder) continue;

  for (const project of builder.projects || []) {
    if (!includeAll && !project.intake_ready) {
      skipped++;
      continue;
    }
    if (project.status === 'planned') {
      skipped++;
      continue;
    }

    const payload = {
      source: 'builder-submissions-json',
      builder: {
        handle: builder.farcaster ? builder.farcaster.split('/').pop() : builder.builder,
        ...(builder.github ? {} : {}),
      },
      project: project.name,
      url: project.live || project.repo || null,
      repo: project.repo && /github\.com/.test(project.repo) ? project.repo.replace('https://github.com/', '') : null,
      track: project.track || builder.track || null,
      note: project.desc || null,
      forBrand: 'zabalgamez',
    };

    if (dryRun) {
      console.log('[DRY RUN] Would POST:', JSON.stringify(payload, null, 2));
      posted++;
      continue;
    }

    try {
      const res = await fetch(`${BASE_URL}/api/submission-intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${ADMIN_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (body.ok) {
        console.log(`[OK] ${builder.builder} / ${project.name} -> id: ${body.id}`);
        posted++;
      } else {
        console.error(`[FAIL] ${builder.builder} / ${project.name}:`, body);
        failed++;
      }
    } catch (err) {
      console.error(`[ERROR] ${builder.builder} / ${project.name}:`, err.message);
      failed++;
    }
  }
}

console.log(`\n${dryRun ? 'DRY RUN complete' : 'Done'}: ${posted} ${dryRun ? 'to post' : 'posted'}, ${skipped} skipped (not ready), ${failed} failed.`);
if (dryRun && !process.env.ADMIN_KEY) {
  console.log('\nSet ADMIN_KEY env var to run live: ADMIN_KEY=<key> node scripts/promote-submissions.mjs');
}

-- ZABAL Games - Phase 1 submissions schema
-- Run this once in your Supabase project's SQL editor.
--
-- SETUP STEPS FOR ZAAL:
-- 1. Create a Supabase project (or reuse an existing one) at https://supabase.com
-- 2. Open the SQL Editor, paste this whole file, run it
-- 3. Go to Project Settings -> API. Copy the Project URL + the anon/public key
-- 4. In zabalgames.html, find the SUPABASE CONFIG block and paste both values
-- 5. Done - the form writes here, the public gallery reads from here

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists zabalgames_submissions (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- identity
  name            text not null,
  farcaster       text not null,
  twitch          text,
  github          text not null,
  wallet          text not null,

  -- phase 1 build (the application IS the build)
  phase1_url      text not null,
  phase1_repo     text not null,
  phase1_demo     text not null,
  phase1_cast     text not null,

  -- profile
  harness         text,
  visibility_mode text,
  creator_type    text,
  streaming_comfort text,
  creator_links   text,
  why             text,
  zao_relationship text,
  availability_pref text,

  -- entry kind
  kind            text not null default 'submission',  -- 'submission' (applicant) | 'starter' (Zaal-seeded starting point)
  built_on        text,                                -- optional: which starter this build extends (free text / starter name)

  -- lifecycle - mentors update this as they claim champions
  status          text not null default 'submitted',  -- submitted | claimed | finalist
  claimed_by      text                                 -- mentor handle who claimed, null until claimed
);

-- ---------------------------------------------------------------------------
-- SEEDING STARTER PROJECTS (Zaal)
-- ---------------------------------------------------------------------------
-- Starter projects are GitHub starting points applicants can fork + build on
-- top of. To seed one:
--   Option A (form): submit via the page form like a normal entry, then in the
--     Supabase Table Editor flip its `kind` from 'submission' to 'starter'.
--   Option B (SQL): insert directly, e.g.
--     insert into zabalgames_submissions
--       (name, farcaster, github, wallet, phase1_url, phase1_repo,
--        phase1_demo, phase1_cast, why, kind)
--     values
--       ('ZAO Empire Leaderboard starter', '@bettercallzaal', '@bettercallzaal',
--        'zaal.eth', 'https://...', 'https://github.com/...', 'https://...',
--        'https://farcaster.xyz/...', 'A starting point for building on the
--        ZABAL Empire leaderboard API.', 'starter');
-- The page renders kind='starter' rows in their own "Starter Projects" section,
-- and kind='submission' rows in the "Build-a-Thon Board".

-- Index for the gallery's default sort (newest first)
create index if not exists zabalgames_submissions_created_idx
  on zabalgames_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table zabalgames_submissions enable row level security;

-- Anyone can submit a Phase 1 build (anon insert)
drop policy if exists "anon can submit" on zabalgames_submissions;
create policy "anon can submit"
  on zabalgames_submissions
  for insert
  to anon
  with check (true);

-- Anyone can read submissions (applications are public by default - locked decision)
-- NOTE: this exposes all columns including the wallet. Email is intentionally
-- NOT collected so there is no PII beyond public handles + a public wallet.
drop policy if exists "anon can read" on zabalgames_submissions;
create policy "anon can read"
  on zabalgames_submissions
  for select
  to anon
  using (true);

-- Updates (status / claimed_by) are NOT granted to anon.
-- Mentors claiming champions happens via an authenticated path or the
-- Supabase dashboard for v0. Lock this down before opening the call so a
-- random anon cannot mark themselves "finalist".

-- ---------------------------------------------------------------------------
-- Optional: a public view that hides the wallet from the gallery read path.
-- If you want the gallery to never even fetch wallets, point the front-end
-- at this view instead of the table. (Wallet still needed for prize payout,
-- so it stays in the base table.)
-- ---------------------------------------------------------------------------
create or replace view zabalgames_submissions_public as
  select
    id, created_at, name, farcaster, twitch, github,
    phase1_url, phase1_repo, phase1_demo, phase1_cast,
    harness, visibility_mode, creator_type, streaming_comfort,
    creator_links, why, zao_relationship, availability_pref,
    status, claimed_by
  from zabalgames_submissions;

-- grant read on the view to anon
grant select on zabalgames_submissions_public to anon;

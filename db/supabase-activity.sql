-- ZABAL Gamez - activity backend on Supabase (replaces Upstash KV).
--
-- Run this once in the Supabase SQL editor for the zabalgamez project.
-- It creates the five tables that back the edge functions in api/ plus the
-- RPCs they call. All access is server-side via the service_role key (which
-- bypasses RLS); RLS is enabled with NO public policies, so anon/browser
-- clients cannot read or write these tables. The July project-submission
-- gallery (info.html, ZG_SUPABASE_ANON) is a separate table and is untouched.
--
-- Redis -> Postgres mapping:
--   LIST  zabal:activity:v1     -> table zg_activity (select newest 50)
--   ZSET  zabal:scores:v1       -> table zg_scores  (score per fid)
--   SET   zabal:present:<day>   -> derived: distinct fid in zg_activity today
--   HASH  zabal:joins           -> table zg_joins   (one row per fid)
--   HASH  zabal:notif:tokens    -> table zg_notif_tokens

-- ---------- tables ----------

create table if not exists public.zg_activity (
  id         bigint generated always as identity primary key,
  fid        integer not null,
  username   text,
  pfp_url    text,
  action     text not null,
  target     text,
  created_at timestamptz not null default now()
);
create index if not exists zg_activity_id_desc_idx  on public.zg_activity (id desc);
create index if not exists zg_activity_fid_day_idx   on public.zg_activity (created_at, fid);

create table if not exists public.zg_scores (
  fid        integer primary key,
  score      integer not null default 0,
  updated_at timestamptz not null default now()
);
create index if not exists zg_scores_score_desc_idx on public.zg_scores (score desc);

create table if not exists public.zg_joins (
  fid        integer primary key,
  door       text,
  note       text,
  username   text,
  created_at timestamptz not null default now()
);

create table if not exists public.zg_notif_tokens (
  fid        integer primary key,
  url        text not null,
  token      text not null,
  updated_at timestamptz not null default now()
);

-- ---------- lock down: server-only ----------

alter table public.zg_activity     enable row level security;
alter table public.zg_scores       enable row level security;
alter table public.zg_joins        enable row level security;
alter table public.zg_notif_tokens enable row level security;
-- No policies on purpose: anon/authenticated get nothing; service_role bypasses RLS.

-- The leaderboard/notify/webhook endpoints hit these tables directly (not via an
-- RPC), so service_role needs table privileges explicitly. Supabase usually
-- grants this by default; doing it here keeps the migration self-contained.
-- anon/authenticated are deliberately given nothing.
grant usage on schema public to service_role;
grant select, insert, update, delete
  on public.zg_activity, public.zg_scores, public.zg_joins, public.zg_notif_tokens
  to service_role;
revoke all
  on public.zg_activity, public.zg_scores, public.zg_joins, public.zg_notif_tokens
  from anon, authenticated;

-- ---------- RPCs (atomic writes) ----------

-- track a social action: append to the feed + bump the score in one statement.
create or replace function public.zg_track(
  p_fid integer, p_username text, p_pfp text,
  p_action text, p_target text, p_points integer
) returns void
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.zg_activity (fid, username, pfp_url, action, target)
  values (p_fid, p_username, p_pfp, p_action, p_target);

  insert into public.zg_scores (fid, score, updated_at)
  values (p_fid, greatest(p_points, 0), now())
  on conflict (fid) do update
    set score = zg_scores.score + excluded.score, updated_at = now();
end; $$;

-- one-tap join: upsert the join (deduped per fid), drop a signup into the feed,
-- bump the score, and return the distinct-builder count. Mirrors the old
-- HSET + LPUSH + ZINCRBY + HLEN pipeline (score increments on every call).
create or replace function public.zg_join(
  p_fid integer, p_door text, p_note text,
  p_username text, p_pfp text, p_points integer
) returns integer
language plpgsql security definer set search_path = '' as $$
declare v_count integer;
begin
  insert into public.zg_joins (fid, door, note, username)
  values (p_fid, p_door, p_note, p_username)
  on conflict (fid) do update
    set door = excluded.door, note = excluded.note, username = excluded.username;

  insert into public.zg_activity (fid, username, pfp_url, action, target)
  values (p_fid, p_username, p_pfp, 'signup', p_door);

  insert into public.zg_scores (fid, score, updated_at)
  values (p_fid, greatest(p_points, 0), now())
  on conflict (fid) do update
    set score = zg_scores.score + excluded.score, updated_at = now();

  select count(*) into v_count from public.zg_joins;
  return v_count;
end; $$;

-- activity widget payload: newest 50 actions + distinct builders active today
-- (UTC day, matching the old present:<day> set) + total joins. One round trip.
create or replace function public.zg_activity_summary()
returns json
language sql security definer set search_path = '' as $$
  select json_build_object(
    'recent', coalesce((
      select json_agg(row_to_json(r)) from (
        select fid, username, pfp_url as "pfpUrl", action, target,
               (extract(epoch from created_at) * 1000)::bigint as ts
        from public.zg_activity
        order by id desc
        limit 50
      ) r
    ), '[]'::json),
    'count', (
      select count(distinct fid) from public.zg_activity
      where created_at >= date_trunc('day', now() at time zone 'utc') at time zone 'utc'
    ),
    'joinsTotal', (select count(*) from public.zg_joins)
  );
$$;

-- ---------- grants: service_role only, never anon ----------

revoke all on function public.zg_track(integer, text, text, text, text, integer)        from public, anon, authenticated;
revoke all on function public.zg_join(integer, text, text, text, text, integer)          from public, anon, authenticated;
revoke all on function public.zg_activity_summary()                                      from public, anon, authenticated;
grant execute on function public.zg_track(integer, text, text, text, text, integer)      to service_role;
grant execute on function public.zg_join(integer, text, text, text, text, integer)       to service_role;
grant execute on function public.zg_activity_summary()                                   to service_role;

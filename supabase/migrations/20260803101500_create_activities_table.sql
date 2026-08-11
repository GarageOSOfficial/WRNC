-- WRNC-003: Activities schema alignment
-- This migration intentionally upgrades the WRNC-002 activities schema in-place
-- to match the application contract used by services/api/activities.ts.

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id) on delete cascade,
  user_id uuid,
  activity_type text,
  title text,
  description text,
  activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz,
  photos text[] not null default '{}',
  attachments text[] not null default '{}',
  metadata jsonb,
  archived_at timestamptz
);

alter table public.activities
  add column if not exists user_id uuid,
  add column if not exists activity_type text,
  add column if not exists description text,
  add column if not exists activity_date date,
  add column if not exists photos text[] default '{}',
  add column if not exists attachments text[] default '{}';

-- Backfill from WRNC-002 shape where needed.
update public.activities
set activity_type = case type::text
  when 'purchased_part' then 'Purchased Part'
  when 'installed_part' then 'Installed Part'
  when 'maintenance' then 'Maintenance'
  when 'progress_update' then 'Progress Update'
  when 'journal_entry' then 'Journal Entry'
  when 'record_upload' then 'Record Upload'
  else 'Progress Update'
end
where activity_type is null;

update public.activities
set description = notes
where description is null and notes is not null;

update public.activities
set activity_date = coalesce(occurred_at::date, created_at::date)
where activity_date is null;

update public.activities a
set user_id = w.owner_id
from public.vehicles v
join public.workspaces w on w.id = v.workspace_id
where a.vehicle_id = v.id
  and a.user_id is null;

update public.activities
set title = 'Untitled Activity'
where title is null or btrim(title) = '';

update public.activities
set photos = '{}'::text[]
where photos is null;

update public.activities
set attachments = '{}'::text[]
where attachments is null;

alter table public.activities
  alter column activity_type set not null,
  alter column user_id set not null,
  alter column activity_date set not null,
  alter column title set not null,
  alter column photos set default '{}'::text[],
  alter column photos set not null,
  alter column attachments set default '{}'::text[],
  alter column attachments set not null,
  alter column metadata drop not null,
  alter column updated_at drop not null;

do
$$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'activities_activity_type_check'
  ) then
    alter table public.activities
      add constraint activities_activity_type_check
      check (
        activity_type in (
          'Purchased Part',
          'Installed Part',
          'Maintenance',
          'Progress Update',
          'Journal Entry',
          'Record Upload'
        )
      );
  end if;
end
$$;

create index if not exists activities_vehicle_id_activity_date_idx
  on public.activities (vehicle_id, activity_date desc, created_at desc);

create index if not exists activities_user_id_idx
  on public.activities (user_id);

create index if not exists activities_vehicle_id_archived_at_idx
  on public.activities (vehicle_id, archived_at);
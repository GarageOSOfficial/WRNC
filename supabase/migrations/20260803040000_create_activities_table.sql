-- WRNC-002: Activity Engine
-- Introduces the activities table — the central event log for every vehicle workspace.
-- Supports six activity types: purchased_part, installed_part, maintenance,
-- progress_update, journal_entry, record_upload.
-- Follows Decision #2 (Archive. Never Delete.) — activities are soft-deleted
-- via `archived_at` and are never physically removed.

-- ---------------------------------------------------------------------------
-- activity_type enum
-- ---------------------------------------------------------------------------
do $$ begin
  create type public.activity_type as enum (
    'purchased_part',
    'installed_part',
    'maintenance',
    'progress_update',
    'journal_entry',
    'record_upload'
  );
exception
  when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- activities
-- ---------------------------------------------------------------------------
create table if not exists public.activities (
  id           uuid primary key default gen_random_uuid(),
  vehicle_id   uuid not null references public.vehicles(id) on delete cascade,
  type         public.activity_type not null,
  title        text,
  notes        text,
  metadata     jsonb not null default '{}'::jsonb,
  occurred_at  timestamptz not null default now(),
  archived_at  timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists activities_vehicle_id_idx  on public.activities(vehicle_id);
create index if not exists activities_type_idx        on public.activities(type);
create index if not exists activities_archived_at_idx on public.activities(archived_at);
create index if not exists activities_occurred_at_idx on public.activities(occurred_at desc);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
drop trigger if exists set_activities_updated_at on public.activities;
create trigger set_activities_updated_at
  before update on public.activities
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.activities enable row level security;

create policy "Activities are visible to their vehicle's workspace owner"
  on public.activities for select
  using (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can insert activities"
  on public.activities for insert
  with check (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can update activities"
  on public.activities for update
  using (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = auth.uid()
    )
  );

-- No delete policy is defined intentionally — activities are archived, never deleted.

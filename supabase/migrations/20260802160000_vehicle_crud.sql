-- WRNC-001: Vehicle CRUD
-- Introduces the workspaces (Garage) and vehicles tables, along with the
-- row level security policies needed to scope data per builder.
-- Follows Decision #2 (Archive. Never Delete.) — vehicles are soft-deleted
-- via `archived_at` and are never physically removed.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- workspaces (a builder's Garage — container that owns a collection of vehicles)
-- ---------------------------------------------------------------------------
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My Garage',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workspaces_owner_id_idx on public.workspaces(owner_id);

-- ---------------------------------------------------------------------------
-- vehicles
-- ---------------------------------------------------------------------------
create table if not exists public.vehicles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  vin text,
  year integer not null,
  make text not null,
  model text not null,
  trim text,
  nickname text,
  engine text,
  transmission text,
  mileage integer,
  cover_photo_url text,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicles_year_check check (year between 1900 and 2100),
  constraint vehicles_mileage_check check (mileage is null or mileage >= 0),
  constraint vehicles_vin_length_check check (vin is null or char_length(vin) = 17)
);

create index if not exists vehicles_workspace_id_idx on public.vehicles(workspace_id);
create index if not exists vehicles_archived_at_idx on public.vehicles(archived_at);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

drop trigger if exists set_vehicles_updated_at on public.vehicles;
create trigger set_vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Auto-create a personal workspace for every new user
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.workspaces (owner_id, name)
  values (new.id, 'My Garage');
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.workspaces enable row level security;
alter table public.vehicles enable row level security;

create policy "Workspace owners can view their workspace"
  on public.workspaces for select
  using (auth.uid() = owner_id);

create policy "Workspace owners can update their workspace"
  on public.workspaces for update
  using (auth.uid() = owner_id);

create policy "Vehicles are visible to their workspace owner"
  on public.vehicles for select
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can insert vehicles"
  on public.vehicles for insert
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can update vehicles"
  on public.vehicles for update
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id and w.owner_id = auth.uid()
    )
  );

-- No delete policy is defined intentionally — vehicles are archived, never deleted.

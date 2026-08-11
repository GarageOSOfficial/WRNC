-- WRNC-005: RLS policy hardening and API grant alignment
-- Forward-only corrective migration. No destructive operations.

-- Keep RLS enabled on all exposed public tables.
alter table public.workspaces enable row level security;
alter table public.vehicles enable row level security;
alter table public.activities enable row level security;
alter table public.documents enable row level security;

-- Idempotent activities reconciliation for environments where older migration
-- variants may already be marked as applied.
alter table public.activities
  add column if not exists user_id uuid,
  add column if not exists activity_type text,
  add column if not exists description text,
  add column if not exists activity_date date,
  add column if not exists photos text[] default '{}'::text[],
  add column if not exists attachments text[] default '{}'::text[];

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'activities'
      and column_name = 'type'
  ) then
    execute $sql$
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
      where activity_type is null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'activities'
      and column_name = 'notes'
  ) then
    execute $sql$
      update public.activities
      set description = notes
      where description is null and notes is not null
    $sql$;
  end if;

  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'activities'
      and column_name = 'occurred_at'
  ) then
    execute $sql$
      update public.activities
      set activity_date = coalesce(occurred_at::date, created_at::date)
      where activity_date is null
    $sql$;
  end if;
end;
$$;

update public.activities a
set user_id = w.owner_id
from public.vehicles v
join public.workspaces w on w.id = v.workspace_id
where a.vehicle_id = v.id
  and a.user_id is null;

update public.activities
set activity_type = 'Progress Update'
where activity_type is null;

update public.activities
set activity_date = created_at::date
where activity_date is null;

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

do $$
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
end;
$$;

create index if not exists activities_vehicle_id_activity_date_idx
  on public.activities (vehicle_id, activity_date desc, created_at desc);

create index if not exists activities_user_id_idx
  on public.activities (user_id);

create index if not exists activities_vehicle_id_archived_at_idx
  on public.activities (vehicle_id, archived_at);

-- Recreate UPDATE policies with explicit WITH CHECK to prevent ownership reassignment.
drop policy if exists "Workspace owners can update their workspace" on public.workspaces;
create policy "Workspace owners can update their workspace"
  on public.workspaces for update
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Workspace owners can update vehicles" on public.vehicles;
create policy "Workspace owners can update vehicles"
  on public.vehicles for update
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id and w.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Workspace owners can update activities" on public.activities;
create policy "Workspace owners can update activities"
  on public.activities for update
  using (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Workspace owners can update documents" on public.documents;
create policy "Workspace owners can update documents"
  on public.documents for update
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = (select auth.uid())
    )
  );

-- Keep trigger behavior, but harden SECURITY DEFINER function context.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.workspaces (owner_id, name)
  values (new.id, 'My Garage');
  return new;
end;
$$;

-- Trigger should continue to fire on auth user creation.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- SECURITY DEFINER function should not be callable by client roles.
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon;
revoke execute on function public.handle_new_user() from authenticated;

-- Explicit Data API grants while relying on RLS for row filtering.
grant usage on schema public to authenticated;
grant select, insert, update on table public.workspaces, public.vehicles, public.activities, public.documents to authenticated;

revoke all on table public.workspaces, public.vehicles, public.activities, public.documents from anon;

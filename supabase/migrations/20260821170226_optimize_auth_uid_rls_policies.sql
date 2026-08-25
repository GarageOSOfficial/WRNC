-- WRNC launch hardening: optimize auth.uid() evaluation in existing RLS policies.
-- Forward-only. Preserves policy names, commands, ownership semantics, and RLS coverage.

-- workspaces SELECT
drop policy if exists "Workspace owners can view their workspace" on public.workspaces;
create policy "Workspace owners can view their workspace"
  on public.workspaces for select
  using ((select auth.uid()) = owner_id);

-- vehicles SELECT / INSERT
drop policy if exists "Vehicles are visible to their workspace owner" on public.vehicles;
create policy "Vehicles are visible to their workspace owner"
  on public.vehicles for select
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Workspace owners can insert vehicles" on public.vehicles;
create policy "Workspace owners can insert vehicles"
  on public.vehicles for insert
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = vehicles.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

-- activities SELECT / INSERT
drop policy if exists "Activities are visible to their vehicle's workspace owner" on public.activities;
create policy "Activities are visible to their vehicle's workspace owner"
  on public.activities for select
  using (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Workspace owners can insert activities" on public.activities;
create policy "Workspace owners can insert activities"
  on public.activities for insert
  with check (
    exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id = activities.vehicle_id
        and w.owner_id = (select auth.uid())
    )
  );

-- documents SELECT / INSERT
drop policy if exists "Documents are visible to their workspace owner" on public.documents;
create policy "Documents are visible to their workspace owner"
  on public.documents for select
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Workspace owners can insert documents" on public.documents;
create policy "Workspace owners can insert documents"
  on public.documents for insert
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id
        and w.owner_id = (select auth.uid())
    )
  );

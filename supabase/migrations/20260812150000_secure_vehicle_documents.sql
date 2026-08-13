-- Private vehicle document storage. Forward-only; apply only after review.
alter table public.documents add column if not exists file_path text;
update public.documents set file_path = file_url where file_path is null and file_url is not null;
alter table public.documents alter column file_path set not null;
alter table public.documents alter column file_url drop not null;

drop policy if exists "Documents are visible to their workspace owner" on public.documents;
create policy "Documents are visible to their workspace owner" on public.documents
  for select to authenticated using (
    exists (select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = (select auth.uid())));

drop policy if exists "Workspace owners can insert documents" on public.documents;
create policy "Workspace owners can insert documents" on public.documents
  for insert to authenticated with check (
    uploaded_by = (select auth.uid())
    and (storage.foldername(file_path))[1] = (select auth.uid())::text
    and vehicle_id is not null
    and (storage.foldername(file_path))[2] = vehicle_id::text
    and exists (select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
      where v.id = documents.vehicle_id and v.workspace_id = documents.workspace_id
        and w.owner_id = (select auth.uid())));

drop policy if exists "Workspace owners can update documents" on public.documents;
create policy "Workspace owners can update documents" on public.documents
  for update to authenticated using (
    exists (select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = (select auth.uid())))
  with check (
    uploaded_by = (select auth.uid())
    and (storage.foldername(file_path))[1] = (select auth.uid())::text
    and vehicle_id is not null
    and (storage.foldername(file_path))[2] = vehicle_id::text
    and exists (select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
      where v.id = documents.vehicle_id and v.workspace_id = documents.workspace_id
        and w.owner_id = (select auth.uid())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehicle-documents', 'vehicle-documents', false, 26214400,
  array['application/pdf','image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "vehicle documents select" on storage.objects;
create policy "vehicle documents select" on storage.objects for select to authenticated using (
  bucket_id = 'vehicle-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
    where v.id::text = (storage.foldername(name))[2] and w.owner_id = (select auth.uid())));
drop policy if exists "vehicle documents insert" on storage.objects;
create policy "vehicle documents insert" on storage.objects for insert to authenticated with check (
  bucket_id = 'vehicle-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
    where v.id::text = (storage.foldername(name))[2] and w.owner_id = (select auth.uid())));
drop policy if exists "vehicle documents delete" on storage.objects;
create policy "vehicle documents delete" on storage.objects for delete to authenticated using (
  bucket_id = 'vehicle-documents' and (storage.foldername(name))[1] = (select auth.uid())::text
  and exists (select 1 from public.vehicles v join public.workspaces w on w.id = v.workspace_id
    where v.id::text = (storage.foldername(name))[2] and w.owner_id = (select auth.uid())));

drop policy if exists "Workspace owners can delete documents" on public.documents;
create policy "Workspace owners can delete documents" on public.documents for delete to authenticated using (
  exists (select 1 from public.workspaces w where w.id = documents.workspace_id and w.owner_id = (select auth.uid())));

revoke all on public.documents from anon;
revoke all on public.documents from authenticated;
grant select, insert, update, delete on public.documents to authenticated;

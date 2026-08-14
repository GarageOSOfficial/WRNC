-- WRNC-008: Secure vehicle attachment storage
-- Forward-only migration. Introduces the private vehicle-documents Storage
-- bucket, owner-scoped storage.objects RLS policies, and the supporting
-- metadata columns needed to persist private object paths instead of
-- public URLs. The vehicle-photos bucket, vehicles.cover_photo_path column,
-- and vehicle-photos storage policies are already established by
-- 20260811060727_secure_vehicle_photo_storage.sql and are not repeated here.
-- No destructive operations; existing documents.file_url values are
-- preserved and remain readable.

-- ---------------------------------------------------------------------------
-- Private bucket (idempotent)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'vehicle-documents',
  'vehicle-documents',
  false,
  20971520, -- 20 MB
  array['image/jpeg', 'image/png', 'image/webp', 'application/pdf']::text[]
)
on conflict (id)
do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- documents metadata additions — private object path plus the descriptive
-- fields needed for the upload UI. file_url remains for existing rows and is
-- relaxed to nullable so new storage-backed rows do not require a public URL.
-- ---------------------------------------------------------------------------
alter table public.documents
  add column if not exists storage_path text,
  add column if not exists original_file_name text;

alter table public.documents
  alter column file_url drop not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'documents_file_reference_check'
  ) then
    alter table public.documents
      add constraint documents_file_reference_check
      check (storage_path is not null or file_url is not null);
  end if;
end;
$$;

create index if not exists documents_storage_path_idx on public.documents(storage_path);

-- ---------------------------------------------------------------------------
-- storage.objects RLS — owner-scoped via path convention
-- {userId}/{vehicleId}/{category}/{uuid}-{sanitizedFileName}
--
-- Ownership is verified two ways for defense in depth:
--   1. Path segment 1 must equal the caller's auth.uid().
--   2. Path segment 2 (vehicleId) must resolve to a vehicle whose workspace
--      is owned by the caller.
-- This does not rely on user_metadata and does not use the service role.
-- ---------------------------------------------------------------------------

-- vehicle-documents -------------------------------------------------------
drop policy if exists "vehicle documents select" on storage.objects;
create policy "vehicle documents select"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'vehicle-documents'
    and (storage.foldername(name))[1] = ((select auth.uid())::text)
    and exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id::text = (storage.foldername(name))[2]
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "vehicle documents insert" on storage.objects;
create policy "vehicle documents insert"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'vehicle-documents'
    and (storage.foldername(name))[1] = ((select auth.uid())::text)
    and exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id::text = (storage.foldername(name))[2]
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "vehicle documents update" on storage.objects;
create policy "vehicle documents update"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'vehicle-documents'
    and (storage.foldername(name))[1] = ((select auth.uid())::text)
    and exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id::text = (storage.foldername(name))[2]
        and w.owner_id = (select auth.uid())
    )
  )
  with check (
    bucket_id = 'vehicle-documents'
    and (storage.foldername(name))[1] = ((select auth.uid())::text)
    and exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id::text = (storage.foldername(name))[2]
        and w.owner_id = (select auth.uid())
    )
  );

drop policy if exists "vehicle documents delete" on storage.objects;
create policy "vehicle documents delete"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'vehicle-documents'
    and (storage.foldername(name))[1] = ((select auth.uid())::text)
    and exists (
      select 1
      from public.vehicles v
      join public.workspaces w on w.id = v.workspace_id
      where v.id::text = (storage.foldername(name))[2]
        and w.owner_id = (select auth.uid())
    )
  );

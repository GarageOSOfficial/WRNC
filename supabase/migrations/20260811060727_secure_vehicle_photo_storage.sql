-- WRNC-007: Secure vehicle cover photo storage
-- Adds private Storage bucket + ownership-scoped object policies and
-- introduces vehicles.cover_photo_path for persisted object keys.

alter table public.vehicles
	add column if not exists cover_photo_path text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
	'vehicle-photos',
	'vehicle-photos',
	false,
	10485760,
	array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id)
do update
set
	public = excluded.public,
	file_size_limit = excluded.file_size_limit,
	allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "vehicle photos select" on storage.objects;
create policy "vehicle photos select"
	on storage.objects
	for select
	to authenticated
	using (
		bucket_id = 'vehicle-photos'
		and (storage.foldername(name))[1] = ((select auth.uid())::text)
		and exists (
			select 1
			from public.vehicles v
			join public.workspaces w on w.id = v.workspace_id
			where v.id::text = (storage.foldername(name))[2]
				and w.owner_id = (select auth.uid())
		)
	);

drop policy if exists "vehicle photos insert" on storage.objects;
create policy "vehicle photos insert"
	on storage.objects
	for insert
	to authenticated
	with check (
		bucket_id = 'vehicle-photos'
		and (storage.foldername(name))[1] = ((select auth.uid())::text)
		and exists (
			select 1
			from public.vehicles v
			join public.workspaces w on w.id = v.workspace_id
			where v.id::text = (storage.foldername(name))[2]
				and w.owner_id = (select auth.uid())
		)
	);

drop policy if exists "vehicle photos update" on storage.objects;
create policy "vehicle photos update"
	on storage.objects
	for update
	to authenticated
	using (
		bucket_id = 'vehicle-photos'
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
		bucket_id = 'vehicle-photos'
		and (storage.foldername(name))[1] = ((select auth.uid())::text)
		and exists (
			select 1
			from public.vehicles v
			join public.workspaces w on w.id = v.workspace_id
			where v.id::text = (storage.foldername(name))[2]
				and w.owner_id = (select auth.uid())
		)
	);

drop policy if exists "vehicle photos delete" on storage.objects;
create policy "vehicle photos delete"
	on storage.objects
	for delete
	to authenticated
	using (
		bucket_id = 'vehicle-photos'
		and (storage.foldername(name))[1] = ((select auth.uid())::text)
		and exists (
			select 1
			from public.vehicles v
			join public.workspaces w on w.id = v.workspace_id
			where v.id::text = (storage.foldername(name))[2]
				and w.owner_id = (select auth.uid())
		)
	);

-- WRNC-009: Correct vehicle attachment Storage policy column capture.
--
-- Inside the nested vehicle lookup, qualify the Storage object path as
-- objects.name. An unqualified name can bind to a column from a nested table
-- instead of storage.objects, making the vehicle path check unreliable.

do $migration$
declare
  bucket text;
  operation text;
  policy_name text;
begin
  foreach bucket in array array['vehicle-photos', 'vehicle-documents'] loop
    foreach operation in array array['select', 'insert', 'update', 'delete'] loop
      policy_name := replace(bucket, '-', ' ') || ' ' || operation;
      execute format('drop policy if exists %I on storage.objects', policy_name);

      if operation = 'insert' then
        execute format(
          'create policy %I on storage.objects for insert to authenticated with check (
             bucket_id = %L
             and (storage.foldername(objects.name))[1] = ((select auth.uid())::text)
             and exists (
               select 1 from public.vehicles v
               join public.workspaces w on w.id = v.workspace_id
               where v.id::text = (storage.foldername(objects.name))[2]
                 and w.owner_id = (select auth.uid())
             )
           )', policy_name, bucket
        );
      elsif operation = 'update' then
        execute format(
          'create policy %I on storage.objects for update to authenticated using (
             bucket_id = %L
             and (storage.foldername(objects.name))[1] = ((select auth.uid())::text)
             and exists (
               select 1 from public.vehicles v
               join public.workspaces w on w.id = v.workspace_id
               where v.id::text = (storage.foldername(objects.name))[2]
                 and w.owner_id = (select auth.uid())
             )
           ) with check (
             bucket_id = %L
             and (storage.foldername(objects.name))[1] = ((select auth.uid())::text)
             and exists (
               select 1 from public.vehicles v
               join public.workspaces w on w.id = v.workspace_id
               where v.id::text = (storage.foldername(objects.name))[2]
                 and w.owner_id = (select auth.uid())
             )
           )', policy_name, bucket, bucket
        );
      else
        execute format(
          'create policy %I on storage.objects for %s to authenticated using (
             bucket_id = %L
             and (storage.foldername(objects.name))[1] = ((select auth.uid())::text)
             and exists (
               select 1 from public.vehicles v
               join public.workspaces w on w.id = v.workspace_id
               where v.id::text = (storage.foldername(objects.name))[2]
                 and w.owner_id = (select auth.uid())
             )
           )', policy_name, operation, bucket
        );
      end if;
    end loop;
  end loop;
end
$migration$;

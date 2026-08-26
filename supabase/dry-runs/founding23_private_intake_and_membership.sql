-- TRANSACTIONAL DRY RUN. DO NOT RUN AGAINST PRODUCTION WITHOUT FOUNDER APPROVAL.
-- Run as a privileged migration role against an approved disposable database.
-- The final ROLLBACK leaves the target unchanged.

begin;

\ir ../migrations/20260826020000_founding23_private_intake_and_membership.sql

do $$
declare
  number_count integer;
  reserved_numbers smallint[];
  anon_application_privileges integer;
  authenticated_membership_write_privileges integer;
  application_rls_enabled boolean;
  membership_rls_enabled boolean;
begin
  select count(*) into number_count
  from public.founding_builder_numbers;

  if number_count <> 23 then
    raise exception 'Expected 23 Founding Builder numbers, found %', number_count;
  end if;

  select array_agg(founding_number order by founding_number)
    into reserved_numbers
  from public.founding_builder_numbers
  where is_reserved;

  if reserved_numbers is distinct from array[1, 2, 7]::smallint[] then
    raise exception 'Reserved number set is incorrect: %', reserved_numbers;
  end if;

  select count(*) into anon_application_privileges
  from information_schema.role_table_grants
  where table_schema = 'public'
    and table_name = 'founding23_applications'
    and grantee = 'anon';

  if anon_application_privileges <> 0 then
    raise exception 'anon must have no application table privileges';
  end if;

  select count(*) into authenticated_membership_write_privileges
  from information_schema.role_table_grants
  where table_schema = 'public'
    and table_name = 'founding_builder_numbers'
    and grantee = 'authenticated'
    and privilege_type in ('INSERT', 'UPDATE', 'DELETE');

  if authenticated_membership_write_privileges <> 0 then
    raise exception 'authenticated must have no membership write privileges';
  end if;

  select relrowsecurity into application_rls_enabled
  from pg_class
  where oid = 'public.founding23_applications'::regclass;

  select relrowsecurity into membership_rls_enabled
  from pg_class
  where oid = 'public.founding_builder_numbers'::regclass;

  if not application_rls_enabled or not membership_rls_enabled then
    raise exception 'RLS must be enabled on both Founding 23 tables';
  end if;
end;
$$;

-- Prove permanent-number enforcement under privileged writes.
do $$
declare
  first_user uuid := gen_random_uuid();
  second_user uuid := gen_random_uuid();
begin
  -- Temporary auth rows are scoped to this transaction and rolled back.
  insert into auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at
  ) values
    ('00000000-0000-0000-0000-000000000000', first_user, 'authenticated', 'authenticated',
      'founding-dry-run-1@example.invalid', '', now(), now(), now()),
    ('00000000-0000-0000-0000-000000000000', second_user, 'authenticated', 'authenticated',
      'founding-dry-run-2@example.invalid', '', now(), now(), now());

  update public.founding_builder_numbers
  set user_id = first_user
  where founding_number = 3;

  begin
    update public.founding_builder_numbers
    set user_id = second_user
    where founding_number = 3;
    raise exception 'Reassignment unexpectedly succeeded';
  exception
    when raise_exception then
      if sqlerrm = 'Reassignment unexpectedly succeeded' then
        raise;
      end if;
  end;
end;
$$;

rollback;

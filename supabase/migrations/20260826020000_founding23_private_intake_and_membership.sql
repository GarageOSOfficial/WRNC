-- PREPARED ONLY. DO NOT APPLY WITHOUT FOUNDER APPROVAL.
-- WRNC Founding 23 private intake and durable membership association.
--
-- Security model:
--   * Anonymous clients receive no table privileges.
--   * Authenticated applicants can insert, read, and delete only their own
--     application. Applicants cannot update review state after submission.
--   * Founding Builder numbers are readable only by their assigned user.
--   * Assignment is reserved for trusted administrative SQL/service-role work.
--   * A previously assigned number cannot be assigned to another user.

create extension if not exists "pgcrypto";

create table public.founding23_applications (
  id uuid primary key default gen_random_uuid(),
  applicant_user_id uuid not null references auth.users(id) on delete cascade,
  applicant_name text not null,
  applicant_email text not null,
  general_location text not null,
  vehicle text not null,
  year_make_model text not null,
  build_description text not null,
  build_stage text not null,
  builder_work text not null,
  documentation_method text not null,
  wrnc_goal text not null,
  social_handle text,
  active_use_confirmed boolean not null,
  consent_version text not null,
  consented_at timestamptz not null,
  status text not null default 'submitted',
  submitted_at timestamptz not null default now(),
  decided_at timestamptz,
  retention_expires_at timestamptz not null default (now() + interval '180 days'),
  created_at timestamptz not null default now(),
  constraint founding23_applications_one_per_user unique (applicant_user_id),
  constraint founding23_applications_name_length check (
    char_length(btrim(applicant_name)) between 1 and 120
  ),
  constraint founding23_applications_email_length check (
    char_length(btrim(applicant_email)) between 3 and 254
  ),
  constraint founding23_applications_email_shape check (
    applicant_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  constraint founding23_applications_location_length check (
    char_length(btrim(general_location)) between 1 and 160
  ),
  constraint founding23_applications_vehicle_length check (
    char_length(btrim(vehicle)) between 1 and 200
  ),
  constraint founding23_applications_year_make_model_length check (
    char_length(btrim(year_make_model)) between 1 and 200
  ),
  constraint founding23_applications_build_description_length check (
    char_length(btrim(build_description)) between 1 and 5000
  ),
  constraint founding23_applications_build_stage_length check (
    char_length(btrim(build_stage)) between 1 and 2000
  ),
  constraint founding23_applications_builder_work_length check (
    char_length(btrim(builder_work)) between 1 and 5000
  ),
  constraint founding23_applications_documentation_method_length check (
    char_length(btrim(documentation_method)) between 1 and 3000
  ),
  constraint founding23_applications_wrnc_goal_length check (
    char_length(btrim(wrnc_goal)) between 1 and 5000
  ),
  constraint founding23_applications_social_handle_length check (
    social_handle is null or char_length(btrim(social_handle)) between 1 and 120
  ),
  constraint founding23_applications_active_use_required check (active_use_confirmed),
  constraint founding23_applications_consent_version_length check (
    char_length(btrim(consent_version)) between 1 and 80
  ),
  constraint founding23_applications_status_check check (
    status in ('submitted', 'under_review', 'selected', 'not_selected', 'withdrawn')
  ),
  constraint founding23_applications_decision_check check (
    (status in ('selected', 'not_selected') and decided_at is not null)
    or (status not in ('selected', 'not_selected') and decided_at is null)
  ),
  constraint founding23_applications_retention_check check (
    retention_expires_at > submitted_at
  )
);

create index founding23_applications_status_idx
  on public.founding23_applications (status, submitted_at);

create index founding23_applications_retention_idx
  on public.founding23_applications (retention_expires_at);

alter table public.founding23_applications enable row level security;

revoke all on table public.founding23_applications from public;
revoke all on table public.founding23_applications from anon;
revoke all on table public.founding23_applications from authenticated;

grant select, delete on table public.founding23_applications to authenticated;
grant insert (
  applicant_user_id,
  applicant_name,
  applicant_email,
  general_location,
  vehicle,
  year_make_model,
  build_description,
  build_stage,
  builder_work,
  documentation_method,
  wrnc_goal,
  social_handle,
  active_use_confirmed,
  consent_version,
  consented_at
) on table public.founding23_applications to authenticated;

grant select, update, delete on table public.founding23_applications to service_role;

create policy "Applicants can submit their own application"
  on public.founding23_applications
  for insert
  to authenticated
  with check (
    (select auth.uid()) = applicant_user_id
    and status = 'submitted'
    and decided_at is null
    and active_use_confirmed
  );

create policy "Applicants can view their own application"
  on public.founding23_applications
  for select
  to authenticated
  using ((select auth.uid()) = applicant_user_id);

create policy "Applicants can withdraw their own application"
  on public.founding23_applications
  for delete
  to authenticated
  using ((select auth.uid()) = applicant_user_id);

create table public.founding_builder_numbers (
  founding_number smallint primary key,
  is_reserved boolean not null default false,
  user_id uuid unique references auth.users(id) on delete set null,
  assigned_at timestamptz,
  retired_at timestamptz,
  created_at timestamptz not null default now(),
  constraint founding_builder_numbers_range check (founding_number between 1 and 23),
  constraint founding_builder_numbers_assignment_state check (
    (assigned_at is null and user_id is null and retired_at is null)
    or (assigned_at is not null and user_id is not null and retired_at is null)
    or (assigned_at is not null and user_id is null and retired_at is not null)
  )
);

insert into public.founding_builder_numbers (founding_number, is_reserved)
select n, n in (1, 2, 7)
from generate_series(1, 23) as n;

create or replace function public.protect_founding_builder_assignment()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if old.assigned_at is null and new.user_id is not null then
    new.assigned_at = coalesce(new.assigned_at, now());
    new.retired_at = null;
    return new;
  end if;

  if old.assigned_at is not null and new.user_id is distinct from old.user_id then
    if new.user_id is null then
      new.retired_at = coalesce(new.retired_at, now());
      return new;
    end if;

    raise exception 'Founding Builder number % cannot be reassigned', old.founding_number;
  end if;

  if old.assigned_at is not null then
    new.assigned_at = old.assigned_at;
  end if;

  return new;
end;
$$;

create trigger protect_founding_builder_assignment_before_update
  before update on public.founding_builder_numbers
  for each row execute function public.protect_founding_builder_assignment();

create or replace function public.prevent_founding_builder_number_delete()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  raise exception 'Founding Builder numbers are permanent and cannot be deleted';
end;
$$;

create trigger prevent_founding_builder_number_delete_before_delete
  before delete on public.founding_builder_numbers
  for each row execute function public.prevent_founding_builder_number_delete();

revoke execute on function public.protect_founding_builder_assignment() from public;
revoke execute on function public.protect_founding_builder_assignment() from anon;
revoke execute on function public.protect_founding_builder_assignment() from authenticated;
revoke execute on function public.prevent_founding_builder_number_delete() from public;
revoke execute on function public.prevent_founding_builder_number_delete() from anon;
revoke execute on function public.prevent_founding_builder_number_delete() from authenticated;

alter table public.founding_builder_numbers enable row level security;

revoke all on table public.founding_builder_numbers from public;
revoke all on table public.founding_builder_numbers from anon;
revoke all on table public.founding_builder_numbers from authenticated;

grant select on table public.founding_builder_numbers to authenticated;
grant select, update on table public.founding_builder_numbers to service_role;

create policy "Founding Builders can view their own number"
  on public.founding_builder_numbers
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

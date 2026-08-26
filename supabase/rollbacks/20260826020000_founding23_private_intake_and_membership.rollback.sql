-- DESTRUCTIVE ROLLBACK. REVIEW AND BACK UP BEFORE USE.
-- This rollback is appropriate only before real applications or assignments exist.

begin;

drop trigger if exists prevent_founding_builder_number_delete_before_delete
  on public.founding_builder_numbers;
drop trigger if exists protect_founding_builder_assignment_before_update
  on public.founding_builder_numbers;

drop table if exists public.founding_builder_numbers;
drop table if exists public.founding23_applications;

drop function if exists public.prevent_founding_builder_number_delete();
drop function if exists public.protect_founding_builder_assignment();

commit;

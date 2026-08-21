-- Harden public.set_updated_at against mutable search_path resolution.
-- No behavioral change: preserve the existing trigger function body and callers.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public, pg_catalog
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

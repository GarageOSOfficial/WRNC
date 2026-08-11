-- Reconcile legacy WRNC-002 activity columns with current application inserts.
-- Keep historical columns/data in place, but stop requiring legacy `type`.
-- `occurred_at` remains non-null with a default and is not required by app inserts.

alter table public.activities
	alter column type drop not null;

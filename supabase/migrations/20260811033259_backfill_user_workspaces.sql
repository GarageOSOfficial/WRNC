-- WRNC-006: Backfill one workspace for users created before the auth trigger.

create unique index if not exists workspaces_owner_id_unique_idx
	on public.workspaces (owner_id);

insert into public.workspaces (owner_id, name)
select u.id, 'My Garage'
from auth.users u
where not exists (
	select 1
	from public.workspaces w
	where w.owner_id = u.id
);

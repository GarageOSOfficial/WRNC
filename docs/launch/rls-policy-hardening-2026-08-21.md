# RLS policy hardening verification

Scope: optimize seven existing `auth.uid()` policy predicates to `(select auth.uid())` without changing policy names, commands, ownership semantics, table grants, or RLS enablement.

Affected policies:
- Workspace owners can view their workspace
- Vehicles are visible to their workspace owner
- Workspace owners can insert vehicles
- Activities are visible to their vehicle's workspace owner
- Workspace owners can insert activities
- Documents are visible to their workspace owner
- Workspace owners can insert documents

Verification gate before production apply:
1. Confirm Supabase project ref `tfxufjdbiszpnlgeflop`.
2. Confirm migration history includes `20260821164444_harden_set_updated_at_search_path` and no later unknown migration.
3. Execute the migration statements inside an explicit transaction and roll back.
4. Confirm policy names/commands remain identical and predicates use `(select auth.uid())`.
5. Apply only the intended migration.
6. Re-run policy inspection and attachment/auth regression checks.

No storage policies, bucket visibility, grants, indexes, or application code are changed by this migration.

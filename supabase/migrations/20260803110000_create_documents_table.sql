-- WRNC-004: Document Engine
-- Introduces the documents table as the centralized document domain.
-- Documents are soft-deleted with archived_at and remain available for restore.

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete set null,
  activity_id uuid references public.activities(id) on delete set null,
  document_type text not null,
  title text not null,
  description text,
  file_url text not null,
  thumbnail_url text,
  mime_type text not null,
  file_size integer not null,
  uploaded_by uuid not null,
  uploaded_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz,
  constraint documents_file_size_check check (file_size > 0),
  constraint documents_mime_type_check check (mime_type <> '')
);

create index if not exists documents_workspace_id_idx on public.documents(workspace_id);
create index if not exists documents_vehicle_id_idx on public.documents(vehicle_id);
create index if not exists documents_activity_id_idx on public.documents(activity_id);
create index if not exists documents_document_type_idx on public.documents(document_type);
create index if not exists documents_uploaded_at_idx on public.documents(uploaded_at desc);
create index if not exists documents_archived_at_idx on public.documents(archived_at);

drop trigger if exists set_documents_updated_at on public.documents;
create trigger set_documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

alter table public.documents enable row level security;

create policy "Documents are visible to their workspace owner"
  on public.documents for select
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can insert documents"
  on public.documents for insert
  with check (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = auth.uid()
    )
  );

create policy "Workspace owners can update documents"
  on public.documents for update
  using (
    exists (
      select 1 from public.workspaces w
      where w.id = documents.workspace_id and w.owner_id = auth.uid()
    )
  );

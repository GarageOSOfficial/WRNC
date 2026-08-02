import type { Database } from './database';

export type WorkspaceRow = Database['public']['Tables']['workspaces']['Row'];

/** A builder's Garage — the tenant/container that owns a collection of vehicles. */
export interface Workspace {
  id: string;
  ownerId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function toWorkspace(row: WorkspaceRow): Workspace {
  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

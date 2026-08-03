import type { Database, ActivityType } from './database';

export type { ActivityType };

export type ActivityRow = Database['public']['Tables']['activities']['Row'];

// ─── Per-type metadata ────────────────────────────────────────────────────────

export interface PurchasedPartMetadata {
  partName: string;
  vendor?: string | null;
  partNumber?: string | null;
  cost?: number | null;
}

export interface InstalledPartMetadata {
  partName: string;
  mileageAtInstall?: number | null;
}

export interface MaintenanceMetadata {
  serviceType: string;
  mileageAtService?: number | null;
}

export interface ProgressUpdateMetadata {
  [key: string]: unknown;
}

export interface JournalEntryMetadata {
  [key: string]: unknown;
}

export interface RecordUploadMetadata {
  fileUrl: string;
  fileName: string;
  category?: string | null;
}

export type ActivityMetadata =
  | PurchasedPartMetadata
  | InstalledPartMetadata
  | MaintenanceMetadata
  | ProgressUpdateMetadata
  | JournalEntryMetadata
  | RecordUploadMetadata;

// ─── Domain model ─────────────────────────────────────────────────────────────

/** Domain-level Activity used throughout the app (camelCase). */
export interface Activity {
  id: string;
  vehicleId: string;
  type: ActivityType;
  title: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  occurredAt: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Inputs ───────────────────────────────────────────────────────────────────

/** Fields required/optional when creating an activity (WRNC-002). */
export interface CreateActivityInput {
  vehicleId: string;
  type: ActivityType;
  title?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
  occurredAt?: string | null;
}

/** Any activity field may be edited. */
export type UpdateActivityInput = Partial<
  Omit<CreateActivityInput, 'vehicleId' | 'type'>
>;

// ─── Mapper ───────────────────────────────────────────────────────────────────

export function toActivity(row: ActivityRow): Activity {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type,
    title: row.title,
    notes: row.notes,
    metadata: row.metadata,
    occurredAt: row.occurred_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

import type { Database, Json } from './database';

export const ACTIVITY_TYPES = [
  'Purchased Part',
  'Installed Part',
  'Maintenance',
  'Progress Update',
  'Journal Entry',
  'Record Upload',
] as const;

export type ActivityType = (typeof ACTIVITY_TYPES)[number];
export type ActivityRow = Database['public']['Tables']['activities']['Row'];

export type ActivityMetadataValue = Json;
export type ActivityMetadata = Record<string, ActivityMetadataValue>;

export interface Activity {
  id: string;
  vehicleId: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  description: string | null;
  activityDate: string;
  createdAt: string;
  updatedAt: string | null;
  photos: string[];
  attachments: string[];
  metadata: ActivityMetadata | null;
  archivedAt: string | null;
}

export interface CreateActivityInput {
  vehicleId: string;
  userId: string;
  activityType: ActivityType;
  title: string;
  description?: string | null;
  activityDate: string;
  photos?: string[];
  attachments?: string[];
  metadata?: ActivityMetadata | null;
}

export interface ListActivitiesOptions {
  includeArchived?: boolean;
  sortDirection?: 'asc' | 'desc';
}

export function isActivityType(value: string): value is ActivityType {
  return ACTIVITY_TYPES.includes(value as ActivityType);
}
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
    userId: row.user_id,
    activityType: isActivityType(row.activity_type) ? row.activity_type : 'Progress Update',
    title: row.title,
    description: row.description,
    activityDate: row.activity_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    photos: row.photos ?? [],
    attachments: row.attachments ?? [],
    metadata: (row.metadata as ActivityMetadata | null) ?? null,
    archivedAt: row.archived_at,
  };
}
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

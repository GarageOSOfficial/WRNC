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

import type { Database } from './database';

export type VehicleRow = Database['public']['Tables']['vehicles']['Row'];

/** Domain-level Vehicle used throughout the app (camelCase). */
export interface Vehicle {
  id: string;
  workspaceId: string;
  vin: string | null;
  year: number;
  make: string;
  model: string;
  trim: string | null;
  nickname: string | null;
  engine: string | null;
  transmission: string | null;
  mileage: number | null;
  coverPhotoUrl: string | null;
  coverPhotoPath?: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Fields required/optional when creating a vehicle (WRNC-001 acceptance criteria). */
export interface CreateVehicleInput {
  workspaceId: string;
  year: number;
  make: string;
  model: string;
  vin?: string | null;
  trim?: string | null;
  nickname?: string | null;
  mileage?: number | null;
  engine?: string | null;
  transmission?: string | null;
  coverPhotoUrl?: string | null;
  coverPhotoPath?: string | null;
}

/** Any vehicle field may be edited (Update Vehicle acceptance criteria). */
export type UpdateVehicleInput = Partial<
  Omit<CreateVehicleInput, 'workspaceId'>
>;

export function toVehicle(row: VehicleRow): Vehicle {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    vin: row.vin,
    year: row.year,
    make: row.make,
    model: row.model,
    trim: row.trim,
    nickname: row.nickname,
    engine: row.engine,
    transmission: row.transmission,
    mileage: row.mileage,
    coverPhotoUrl: row.cover_photo_url,
    coverPhotoPath: row.cover_photo_path,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

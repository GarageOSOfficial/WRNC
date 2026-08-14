import { supabase } from '../../lib/supabase';
import {
  toVehicle,
  type CreateVehicleInput,
  type UpdateVehicleInput,
  type Vehicle,
} from '../../types/vehicle';
import { validateVehicleInput, MIN_YEAR, VIN_LENGTH } from '../../utils/validators';

export interface ListVehiclesOptions {
  includeArchived?: boolean;
}

/** Read: list vehicles for a workspace. Archived vehicles are excluded by default. */
export async function listVehicles(
  workspaceId: string,
  options: ListVehiclesOptions = {}
): Promise<Vehicle[]> {
  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false });

  if (!options.includeArchived) {
    query = query.is('archived_at', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(toVehicle);
}

/** Read: fetch a single vehicle by id. */
export async function getVehicle(id: string): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return toVehicle(data);
}

/** Create: insert a new vehicle. Year, Make, and Model are required. */
export async function createVehicle(input: CreateVehicleInput): Promise<Vehicle> {
  const normalizedVin = input.vin?.trim().toUpperCase() || null;
  const { valid, errors } = validateVehicleInput({
    ...input,
    vin: normalizedVin,
  });
  if (!valid) {
    throw new Error(Object.values(errors).join(' '));
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert({
      workspace_id: input.workspaceId,
      year: input.year,
      make: input.make.trim(),
      model: input.model.trim(),
      vin: normalizedVin,
      trim: input.trim ?? null,
      nickname: input.nickname ?? null,
      mileage: input.mileage ?? null,
      engine: input.engine ?? null,
      transmission: input.transmission ?? null,
      cover_photo_url: input.coverPhotoUrl ?? null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return toVehicle(data);
}

/** Update: any vehicle field may be edited. */
export async function updateVehicle(
  id: string,
  input: UpdateVehicleInput
): Promise<Vehicle> {
  const payload: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  if (input.year !== undefined) {
    if (input.year === null || input.year === undefined) {
      errors.year = 'Year is required.';
    } else if (!Number.isInteger(input.year) || input.year < MIN_YEAR || input.year > new Date().getFullYear() + 1) {
      errors.year = `Year must be a whole number between ${MIN_YEAR} and ${new Date().getFullYear() + 1}.`;
    } else {
      payload.year = input.year;
    }
  }

  if (input.make !== undefined) {
    if (!input.make || !input.make.trim()) {
      errors.make = 'Make is required.';
    } else {
      payload.make = input.make.trim();
    }
  }

  if (input.model !== undefined) {
    if (!input.model || !input.model.trim()) {
      errors.model = 'Model is required.';
    } else {
      payload.model = input.model.trim();
    }
  }

  if (input.vin !== undefined && input.vin !== null) {
    const normalizedVin = input.vin.trim().toUpperCase();
    if (normalizedVin.length !== VIN_LENGTH) {
      errors.vin = `VIN must be ${VIN_LENGTH} characters.`;
    } else if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(normalizedVin)) {
      errors.vin = 'VIN contains invalid characters.';
    } else {
      payload.vin = normalizedVin;
    }
  } else if (input.vin !== undefined) {
    payload.vin = input.vin;
  }

  if (input.mileage !== undefined && input.mileage !== null && input.mileage < 0) {
    errors.mileage = 'Mileage cannot be negative.';
  } else if (input.mileage !== undefined) {
    payload.mileage = input.mileage;
  }

  if (input.trim !== undefined) payload.trim = input.trim;
  if (input.nickname !== undefined) payload.nickname = input.nickname;
  if (input.engine !== undefined) payload.engine = input.engine;
  if (input.transmission !== undefined) payload.transmission = input.transmission;
  if (input.coverPhotoUrl !== undefined) payload.cover_photo_url = input.coverPhotoUrl;
  if (input.coverPhotoPath !== undefined) payload.cover_photo_path = input.coverPhotoPath;

  if (Object.keys(errors).length > 0) {
    throw new Error(Object.values(errors).join(' '));
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toVehicle(data);
}

/** Archive: soft delete. Vehicle is hidden from default lists, never removed. */
export async function archiveVehicle(id: string): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toVehicle(data);
}

/** Restore: un-archive a previously archived vehicle. */
export async function restoreVehicle(id: string): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .update({ archived_at: null })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toVehicle(data);
}

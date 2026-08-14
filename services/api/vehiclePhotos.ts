import { supabase } from '../../lib/supabase';
import {
  buildAttachmentPath,
  getAttachmentSignedUrl,
  removeAttachmentObjects,
  uploadAttachmentObject,
  validateAttachmentFile,
  type AttachmentFileInput,
} from './attachmentStorage';
import { getVehicle } from './vehicles';

export const VEHICLE_PHOTOS_BUCKET = 'vehicle-photos' as const;
export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
export const ALLOWED_PHOTO_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

export interface VehiclePhotoUploadResult {
  path: string;
  vehicle: { id: string; workspaceId: string; coverPhotoPath: string | null };
}

export function validateVehiclePhotoFile(file: AttachmentFileInput) {
  return validateAttachmentFile(file, {
    allowedMimeTypes: ALLOWED_PHOTO_MIME_TYPES,
    maxSizeBytes: MAX_PHOTO_SIZE_BYTES,
  });
}

export function buildVehiclePhotoPath(userId: string, vehicleId: string, fileName: string) {
  return buildAttachmentPath(userId, vehicleId, 'cover', fileName);
}

export async function getVehiclePhotoSignedUrl(path: string): Promise<string> {
  return getAttachmentSignedUrl(VEHICLE_PHOTOS_BUCKET, path, 60);
}

/** Uploads a new cover photo and persists only its private object path. */
export async function uploadVehiclePhoto(
  vehicleId: string,
  file: AttachmentFileInput,
  userId: string
): Promise<VehiclePhotoUploadResult> {
  const validation = validateVehiclePhotoFile(file);
  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  const objectPath = buildVehiclePhotoPath(userId, vehicleId, file.name);
  await uploadAttachmentObject(VEHICLE_PHOTOS_BUCKET, objectPath, file);

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ cover_photo_path: objectPath })
      .eq('id', vehicleId)
      .select('*')
      .single();

    if (error || !data) {
      throw new Error('Unable to save the vehicle photo. Please try again.');
    }

    return {
      path: objectPath,
      vehicle: {
        id: data.id,
        workspaceId: data.workspace_id,
        coverPhotoPath: data.cover_photo_path,
      },
    };
  } catch (error) {
    await removeAttachmentObjects(VEHICLE_PHOTOS_BUCKET, [objectPath]);
    throw error;
  }
}

/**
 * Uploads a replacement cover photo. The previous object is only removed
 * after the database update succeeds, so the old photo remains available
 * if anything fails partway through.
 */
export async function replaceVehiclePhoto(
  vehicleId: string,
  file: AttachmentFileInput,
  userId: string
): Promise<VehiclePhotoUploadResult> {
  const validation = validateVehiclePhotoFile(file);
  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  const currentVehicle = await getVehicle(vehicleId);
  const previousPath = currentVehicle.coverPhotoPath || null;
  const nextPath = buildVehiclePhotoPath(userId, vehicleId, file.name);

  await uploadAttachmentObject(VEHICLE_PHOTOS_BUCKET, nextPath, file);

  try {
    const { data, error } = await supabase
      .from('vehicles')
      .update({ cover_photo_path: nextPath })
      .eq('id', vehicleId)
      .select('*')
      .single();

    if (error || !data) {
      throw new Error('Unable to save the replacement vehicle photo. Please try again.');
    }

    if (previousPath && previousPath !== nextPath) {
      await removeAttachmentObjects(VEHICLE_PHOTOS_BUCKET, [previousPath]);
    }

    return {
      path: nextPath,
      vehicle: {
        id: data.id,
        workspaceId: data.workspace_id,
        coverPhotoPath: data.cover_photo_path,
      },
    };
  } catch (error) {
    await removeAttachmentObjects(VEHICLE_PHOTOS_BUCKET, [nextPath]);
    throw error;
  }
}

export async function removeVehiclePhoto(
  vehicleId: string,
  path?: string
): Promise<{ path: string; vehicle: { id: string; workspaceId: string; coverPhotoPath: string | null } }> {
  const currentVehicle = await getVehicle(vehicleId);
  const objectPath = path || currentVehicle.coverPhotoPath || '';

  if (!objectPath) {
    return {
      path: '',
      vehicle: {
        id: currentVehicle.id,
        workspaceId: currentVehicle.workspaceId,
        coverPhotoPath: null,
      },
    };
  }

  const { data, error } = await supabase
    .from('vehicles')
    .update({ cover_photo_path: null })
    .eq('id', vehicleId)
    .select('*')
    .single();

  if (error || !data) {
    throw new Error('Unable to remove the vehicle photo. Please try again.');
  }

  await removeAttachmentObjects(VEHICLE_PHOTOS_BUCKET, [objectPath]);

  return {
    path: objectPath,
    vehicle: {
      id: data.id,
      workspaceId: data.workspace_id,
      coverPhotoPath: data.cover_photo_path,
    },
  };
}

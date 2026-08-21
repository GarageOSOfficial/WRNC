import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getVehiclePhotoSignedUrl,
  removeVehiclePhoto,
  replaceVehiclePhoto,
  uploadVehiclePhoto,
} from '../services/api/vehiclePhotos';
import type { AttachmentFileInput } from '../services/api/attachmentStorage';
import { vehicleKeys } from './useVehicle';

export const vehiclePhotoKeys = {
  all: ['vehicle-photos'] as const,
  signedUrl: (path: string) => [...vehiclePhotoKeys.all, 'signed-url', path] as const,
};

export function useUploadVehiclePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, file, userId }: { vehicleId: string; file: AttachmentFileInput; userId: string }) =>
      uploadVehiclePhoto(vehicleId, file, userId),
    onSuccess: (result) => {
      queryClient.setQueryData(vehicleKeys.detail(result.vehicle.id), (current: unknown) =>
        current && typeof current === 'object'
          ? { ...current, coverPhotoPath: result.vehicle.coverPhotoPath }
          : current
      );
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(result.vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(result.vehicle.workspaceId) });
    },
  });
}

export function useReplaceVehiclePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, file, userId }: { vehicleId: string; file: AttachmentFileInput; userId: string }) =>
      replaceVehiclePhoto(vehicleId, file, userId),
    onSuccess: (result) => {
      queryClient.setQueryData(vehicleKeys.detail(result.vehicle.id), (current: unknown) =>
        current && typeof current === 'object'
          ? { ...current, coverPhotoPath: result.vehicle.coverPhotoPath }
          : current
      );
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(result.vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(result.vehicle.workspaceId) });
    },
  });
}

export function useRemoveVehiclePhoto() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ vehicleId, path }: { vehicleId: string; path?: string }) => removeVehiclePhoto(vehicleId, path),
    onSuccess: (result) => {
      queryClient.setQueryData(vehicleKeys.detail(result.vehicle.id), (current: unknown) =>
        current && typeof current === 'object'
          ? { ...current, coverPhotoPath: result.vehicle.coverPhotoPath }
          : current
      );
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(result.vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(result.vehicle.workspaceId) });
    },
  });
}

export function useVehiclePhotoUrl(path: string | null | undefined) {
  return useQuery({
    queryKey: path ? vehiclePhotoKeys.signedUrl(path) : ['vehicle-photos', 'signed-url', 'none'],
    queryFn: () => (path ? getVehiclePhotoSignedUrl(path) : Promise.resolve(null)),
    enabled: Boolean(path),
    staleTime: 45 * 1000,
  });
}

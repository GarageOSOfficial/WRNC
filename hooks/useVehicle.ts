import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveVehicle,
  createVehicle,
  getVehicle,
  listVehicles,
  restoreVehicle,
  updateVehicle,
  type ListVehiclesOptions,
} from '../services/api/vehicles';
import type { CreateVehicleInput, UpdateVehicleInput } from '../types/vehicle';

export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (workspaceId: string, options: ListVehiclesOptions = {}) =>
    [...vehicleKeys.lists(), workspaceId, options] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

/** Read: list vehicles for a workspace (Mission Control). */
export function useVehicles(workspaceId: string | undefined, options: ListVehiclesOptions = {}) {
  return useQuery({
    queryKey: vehicleKeys.list(workspaceId ?? '', options),
    queryFn: () => listVehicles(workspaceId as string, options),
    enabled: Boolean(workspaceId),
    staleTime: 60 * 1000,
  });
}

/** Read: a single vehicle (About tab / Workspace header). */
export function useVehicle(vehicleId: string | undefined) {
  return useQuery({
    queryKey: vehicleKeys.detail(vehicleId ?? ''),
    queryFn: () => getVehicle(vehicleId as string),
    enabled: Boolean(vehicleId),
    staleTime: 5 * 60 * 1000,
  });
}

/** Create: adds a new vehicle to the workspace. */
export function useCreateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateVehicleInput) => createVehicle(input),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(vehicle.workspaceId) });
    },
  });
}

/** Update: edits any vehicle field (inline edit mode, About tab). */
export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateVehicleInput }) =>
      updateVehicle(id, input),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(vehicle.workspaceId) });
    },
  });
}

/** Archive: soft-deletes a vehicle (never permanently removed). */
export function useArchiveVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveVehicle(id),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(vehicle.workspaceId) });
    },
  });
}

/** Restore: brings an archived vehicle back into default lists. */
export function useRestoreVehicle() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreVehicle(id),
    onSuccess: (vehicle) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.detail(vehicle.id) });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.list(vehicle.workspaceId) });
    },
  });
}

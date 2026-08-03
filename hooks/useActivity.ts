import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveActivity,
  createActivity,
  getActivity,
  listActivities,
  restoreActivity,
} from '../services/api/activities';
import type { CreateActivityInput, ListActivitiesOptions } from '../types/activity';

export const activityKeys = {
  all: ['activities'] as const,
  lists: () => [...activityKeys.all, 'list'] as const,
  list: (vehicleId: string, options: ListActivitiesOptions = {}) =>
    [...activityKeys.lists(), vehicleId, options] as const,
  details: () => [...activityKeys.all, 'detail'] as const,
  detail: (id: string) => [...activityKeys.details(), id] as const,
};

export function useActivities(
  vehicleId: string | undefined,
  options: ListActivitiesOptions = {}
) {
  return useQuery({
    queryKey: activityKeys.list(vehicleId ?? '', options),
    queryFn: () => listActivities(vehicleId as string, options),
    enabled: Boolean(vehicleId),
    staleTime: 60 * 1000,
  });
}

export function useActivity(activityId: string | undefined) {
  return useQuery({
    queryKey: activityKeys.detail(activityId ?? ''),
    queryFn: () => getActivity(activityId as string),
    enabled: Boolean(activityId),
    staleTime: 60 * 1000,
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateActivityInput) => createActivity(input),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.list(activity.vehicleId) });
    },
  });
}

export function useArchiveActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) => archiveActivity(activityId),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(activity.id) });
      queryClient.invalidateQueries({ queryKey: activityKeys.list(activity.vehicleId) });
    },
  });
}

export function useRestoreActivity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (activityId: string) => restoreActivity(activityId),
    onSuccess: (activity) => {
      queryClient.invalidateQueries({ queryKey: activityKeys.detail(activity.id) });
      queryClient.invalidateQueries({ queryKey: activityKeys.list(activity.vehicleId) });
    },
  });
}
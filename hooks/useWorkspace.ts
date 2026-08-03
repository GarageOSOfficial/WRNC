import { useQuery } from '@tanstack/react-query';
import { getCurrentWorkspace } from '../services/api/workspaces';

export const workspaceKeys = {
  current: ['workspace', 'current'] as const,
};

/** Resolves the current builder's workspace (Garage). */
export function useCurrentWorkspace() {
  return useQuery({
    queryKey: workspaceKeys.current,
    queryFn: getCurrentWorkspace,
    staleTime: 5 * 60 * 1000,
  });
}

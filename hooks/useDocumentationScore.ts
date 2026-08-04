import { useQuery, useQueryClient } from '@tanstack/react-query';
import { calculateDocumentationScore } from '../services/documentationScore';
import { useDocuments } from './useDocument';
import { useActivities } from './useActivity';
import { useVehicle } from './useVehicle';
import type { DocumentationScoreInput } from '../types/documentationScore';

export const documentationScoreKeys = {
  all: ['documentation-score'] as const,
  vehicle: (vehicleId: string) => [...documentationScoreKeys.all, vehicleId] as const,
};

export function useDocumentationScore(vehicleId: string | undefined) {
  const queryClient = useQueryClient();
  const vehicleQuery = useVehicle(vehicleId);
  const activitiesQuery = useActivities(vehicleId);
  const documentsQuery = useDocuments(vehicleQuery.data?.workspaceId);

  return useQuery({
    queryKey: documentationScoreKeys.vehicle(vehicleId ?? ''),
    queryFn: () => {
      const input: DocumentationScoreInput = {
        vehicle: vehicleQuery.data,
        activities: activitiesQuery.data ?? [],
        documents: documentsQuery.data ?? [],
      };
      return calculateDocumentationScore(input);
    },
    enabled: Boolean(vehicleId) && vehicleQuery.isSuccess && activitiesQuery.isSuccess && documentsQuery.isSuccess,
    staleTime: 60 * 1000,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentationScoreKeys.all });
    },
  });
}

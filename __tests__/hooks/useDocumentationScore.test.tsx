import React from 'react';
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDocumentationScore } from '../../hooks/useDocumentationScore';
import { useVehicle } from '../../hooks/useVehicle';
import { useActivities } from '../../hooks/useActivity';
import { useDocuments } from '../../hooks/useDocument';

const queryClients: QueryClient[] = [];

jest.mock('../../hooks/useVehicle', () => ({ useVehicle: jest.fn() }));
jest.mock('../../hooks/useActivity', () => ({ useActivities: jest.fn() }));
jest.mock('../../hooks/useDocument', () => ({ useDocuments: jest.fn() }));

afterEach(() => {
  queryClients.forEach((client) => client.clear());
  queryClients.length = 0;
});

describe('useDocumentationScore', () => {
  it('returns a calculated score when the required data is available', async () => {
    (useVehicle as jest.Mock).mockReturnValue({ data: { id: 'veh-1', workspaceId: 'ws-1' }, isSuccess: true });
    (useActivities as jest.Mock).mockReturnValue({ data: [], isSuccess: true });
    (useDocuments as jest.Mock).mockReturnValue({ data: [], isSuccess: true });

    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
    queryClients.push(queryClient);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useDocumentationScore('veh-1'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.overallScore).toBeDefined();
  });
});

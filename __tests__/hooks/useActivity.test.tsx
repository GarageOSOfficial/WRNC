import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { useActivities } from '../../hooks/useActivity';
import type { Activity } from '../../types/activity';

jest.mock('../../services/api/activities', () => ({
  __esModule: true,
  listActivities: jest.fn(),
  getActivity: jest.fn(),
  createActivity: jest.fn(),
  archiveActivity: jest.fn(),
  restoreActivity: jest.fn(),
}));

import { listActivities } from '../../services/api/activities';

const listActivitiesMock = listActivities as jest.MockedFunction<typeof listActivities>;

const activities: Activity[] = [
  {
    id: 'act-1',
    vehicleId: 'veh-1',
    userId: 'user-1',
    activityType: 'Maintenance',
    title: 'Brake Service',
    description: 'Replaced pads and flushed fluid.',
    activityDate: '2026-08-01',
    createdAt: '2026-08-01T18:00:00.000Z',
    updatedAt: null,
    photos: [],
    attachments: [],
    metadata: { cost: 249.99 },
    archivedAt: null,
  },
];

describe('useActivities', () => {
  it('loads activities through React Query', async () => {
    listActivitiesMock.mockResolvedValue(activities);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => useActivities('veh-1', { includeArchived: true }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(listActivitiesMock).toHaveBeenCalledWith('veh-1', { includeArchived: true });
    expect(result.current.data).toEqual(activities);
  });
});
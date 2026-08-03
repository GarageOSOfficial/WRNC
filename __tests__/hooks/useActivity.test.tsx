import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  activityKeys,
  useCreateActivity,
  useUpdateActivity,
  useArchiveActivity,
  useRestoreActivity,
} from '../../hooks/useActivity';
import {
  createActivity,
  updateActivity,
  archiveActivity,
  restoreActivity,
} from '../../services/api/activities';

jest.mock('../../services/api/activities', () => ({
  createActivity: jest.fn(),
  updateActivity: jest.fn(),
  archiveActivity: jest.fn(),
  restoreActivity: jest.fn(),
  listActivities: jest.fn(),
  getActivity: jest.fn(),
}));

const mockActivity = {
  id: 'act-1',
  vehicleId: 'veh-1',
  type: 'journal_entry' as const,
  title: null,
  notes: 'Test note',
  metadata: {},
  occurredAt: '2024-01-01T00:00:00.000Z',
  archivedAt: null,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
};

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

// ─── activityKeys factory ─────────────────────────────────────────────────────

describe('activityKeys', () => {
  it('all returns the root key', () => {
    expect(activityKeys.all).toEqual(['activities']);
  });

  it('lists() returns the list namespace', () => {
    expect(activityKeys.lists()).toEqual(['activities', 'list']);
  });

  it('list() includes vehicleId and options', () => {
    expect(activityKeys.list('veh-1')).toEqual(['activities', 'list', 'veh-1', {}]);
    expect(activityKeys.list('veh-1', { includeArchived: true })).toEqual([
      'activities', 'list', 'veh-1', { includeArchived: true },
    ]);
  });

  it('details() returns the detail namespace', () => {
    expect(activityKeys.details()).toEqual(['activities', 'detail']);
  });

  it('detail() includes activityId', () => {
    expect(activityKeys.detail('act-1')).toEqual(['activities', 'detail', 'act-1']);
  });
});

// ─── useCreateActivity ────────────────────────────────────────────────────────

describe('useCreateActivity', () => {
  it('invalidates the activity list for the vehicle on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (createActivity as jest.Mock).mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useCreateActivity(), { wrapper });

    act(() => {
      result.current.mutate({ vehicleId: 'veh-1', type: 'journal_entry' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.list('veh-1') })
    );
  });
});

// ─── useUpdateActivity ────────────────────────────────────────────────────────

describe('useUpdateActivity', () => {
  it('invalidates the activity detail and list on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (updateActivity as jest.Mock).mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useUpdateActivity(), { wrapper });

    act(() => {
      result.current.mutate({ id: 'act-1', input: { notes: 'Updated' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.detail('act-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.list('veh-1') })
    );
  });
});

// ─── useArchiveActivity ───────────────────────────────────────────────────────

describe('useArchiveActivity', () => {
  it('invalidates the activity detail and list on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const archivedActivity = { ...mockActivity, archivedAt: '2026-08-03T00:00:00.000Z' };
    (archiveActivity as jest.Mock).mockResolvedValue(archivedActivity);

    const { result } = renderHook(() => useArchiveActivity(), { wrapper });

    act(() => {
      result.current.mutate('act-1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.detail('act-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.list('veh-1') })
    );
  });
});

// ─── useRestoreActivity ───────────────────────────────────────────────────────

describe('useRestoreActivity', () => {
  it('invalidates the activity detail and list on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (restoreActivity as jest.Mock).mockResolvedValue(mockActivity);

    const { result } = renderHook(() => useRestoreActivity(), { wrapper });

    act(() => {
      result.current.mutate('act-1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.detail('act-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: activityKeys.list('veh-1') })
    );
  });
});

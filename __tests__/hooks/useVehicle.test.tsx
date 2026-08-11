import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  vehicleKeys,
  useCreateVehicle,
  useUpdateVehicle,
  useArchiveVehicle,
  useRestoreVehicle,
} from '../../hooks/useVehicle';
import {
  createVehicle,
  updateVehicle,
  archiveVehicle,
  restoreVehicle,
} from '../../services/api/vehicles';

const queryClients: QueryClient[] = [];

jest.mock('../../services/api/vehicles', () => ({
  createVehicle: jest.fn(),
  updateVehicle: jest.fn(),
  archiveVehicle: jest.fn(),
  restoreVehicle: jest.fn(),
  listVehicles: jest.fn(),
  getVehicle: jest.fn(),
}));

const mockVehicle = {
  id: 'veh-1',
  workspaceId: 'ws-1',
  vin: null,
  year: 1998,
  make: 'Honda',
  model: 'Civic',
  trim: null,
  nickname: null,
  engine: null,
  transmission: null,
  mileage: null,
  coverPhotoUrl: null,
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
  queryClient.setDefaultOptions({
    queries: { retry: false, gcTime: 0 },
    mutations: { retry: false },
  });
  queryClients.push(queryClient);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

afterEach(() => {
  queryClients.forEach((client) => client.clear());
  queryClients.length = 0;
});

// ─── vehicleKeys factory ──────────────────────────────────────────────────────

describe('vehicleKeys', () => {
  it('all returns the root key', () => {
    expect(vehicleKeys.all).toEqual(['vehicles']);
  });

  it('lists() returns the list namespace', () => {
    expect(vehicleKeys.lists()).toEqual(['vehicles', 'list']);
  });

  it('list() includes workspaceId and options', () => {
    expect(vehicleKeys.list('ws-1')).toEqual(['vehicles', 'list', 'ws-1', {}]);
    expect(vehicleKeys.list('ws-1', { includeArchived: true })).toEqual([
      'vehicles', 'list', 'ws-1', { includeArchived: true },
    ]);
  });

  it('details() returns the detail namespace', () => {
    expect(vehicleKeys.details()).toEqual(['vehicles', 'detail']);
  });

  it('detail() includes vehicleId', () => {
    expect(vehicleKeys.detail('veh-1')).toEqual(['vehicles', 'detail', 'veh-1']);
  });
});

// ─── useCreateVehicle ─────────────────────────────────────────────────────────

describe('useCreateVehicle', () => {
  it('invalidates the vehicle list for the workspace on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (createVehicle as jest.Mock).mockResolvedValue(mockVehicle);

    const { result } = renderHook(() => useCreateVehicle(), { wrapper });

    act(() => {
      result.current.mutate({ workspaceId: 'ws-1', year: 1998, make: 'Honda', model: 'Civic' });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.list('ws-1') })
    );
  });
});

// ─── useUpdateVehicle ─────────────────────────────────────────────────────────

describe('useUpdateVehicle', () => {
  it('updates detail/list caches and invalidates them on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const setQueryDataSpy = jest.spyOn(queryClient, 'setQueryData');
    const setQueriesDataSpy = jest.spyOn(queryClient, 'setQueriesData');
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (updateVehicle as jest.Mock).mockResolvedValue(mockVehicle);

    const { result } = renderHook(() => useUpdateVehicle(), { wrapper });

    act(() => {
      result.current.mutate({ id: 'veh-1', input: { make: 'Toyota' } });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(setQueryDataSpy).toHaveBeenCalledWith(vehicleKeys.detail('veh-1'), mockVehicle);
    expect(setQueriesDataSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.lists() }),
      expect.any(Function)
    );

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.detail('veh-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.list('ws-1') })
    );
  });
});

// ─── useArchiveVehicle ────────────────────────────────────────────────────────

describe('useArchiveVehicle', () => {
  it('invalidates the vehicle detail and list on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    const archivedVehicle = { ...mockVehicle, archivedAt: '2026-08-03T00:00:00.000Z' };
    (archiveVehicle as jest.Mock).mockResolvedValue(archivedVehicle);

    const { result } = renderHook(() => useArchiveVehicle(), { wrapper });

    act(() => {
      result.current.mutate('veh-1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.detail('veh-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.list('ws-1') })
    );
  });
});

// ─── useRestoreVehicle ────────────────────────────────────────────────────────

describe('useRestoreVehicle', () => {
  it('invalidates the vehicle detail and list on success', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (restoreVehicle as jest.Mock).mockResolvedValue(mockVehicle);

    const { result } = renderHook(() => useRestoreVehicle(), { wrapper });

    act(() => {
      result.current.mutate('veh-1');
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.detail('veh-1') })
    );
    expect(invalidateSpy).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: vehicleKeys.list('ws-1') })
    );
  });
});

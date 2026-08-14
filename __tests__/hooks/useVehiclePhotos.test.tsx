import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  vehiclePhotoKeys,
  useUploadVehiclePhoto,
  useReplaceVehiclePhoto,
  useRemoveVehiclePhoto,
  useVehiclePhotoUrl,
} from '../../hooks/useVehiclePhotos';
import {
  getVehiclePhotoSignedUrl,
  removeVehiclePhoto,
  replaceVehiclePhoto,
  uploadVehiclePhoto,
} from '../../services/api/vehiclePhotos';

const queryClients: QueryClient[] = [];

jest.mock('../../services/api/vehiclePhotos', () => ({
  uploadVehiclePhoto: jest.fn(),
  replaceVehiclePhoto: jest.fn(),
  removeVehiclePhoto: jest.fn(),
  getVehiclePhotoSignedUrl: jest.fn(),
}));

const mockResult = {
  path: 'user-1/veh-1/cover/x.jpg',
  vehicle: { id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: 'user-1/veh-1/cover/x.jpg' },
};

function makeWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  queryClient.setDefaultOptions({ queries: { retry: false, gcTime: 0 }, mutations: { retry: false } });
  queryClients.push(queryClient);
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return { queryClient, wrapper };
}

afterEach(() => {
  queryClients.forEach((client) => client.clear());
  queryClients.length = 0;
  jest.clearAllMocks();
});

describe('vehiclePhotoKeys', () => {
  it('exposes stable query keys', () => {
    expect(vehiclePhotoKeys.all).toEqual(['vehicle-photos']);
    expect(vehiclePhotoKeys.signedUrl('a/b/c')).toEqual(['vehicle-photos', 'signed-url', 'a/b/c']);
  });
});

describe('useUploadVehiclePhoto', () => {
  it('invalidates vehicle detail and list queries on success', async () => {
    (uploadVehiclePhoto as jest.Mock).mockResolvedValue(mockResult);
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const hook = renderHook(() => useUploadVehiclePhoto(), { wrapper });
    act(() => {
      hook.result.current.mutate({
        vehicleId: 'veh-1',
        file: { name: 'cover.jpg', mimeType: 'image/jpeg', size: 100 },
        userId: 'user-1',
      });
    });

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalled();
  });
});

describe('useReplaceVehiclePhoto', () => {
  it('invalidates queries on success', async () => {
    (replaceVehiclePhoto as jest.Mock).mockResolvedValue(mockResult);
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const hook = renderHook(() => useReplaceVehiclePhoto(), { wrapper });
    act(() => {
      hook.result.current.mutate({
        vehicleId: 'veh-1',
        file: { name: 'new.jpg', mimeType: 'image/jpeg', size: 100 },
        userId: 'user-1',
      });
    });

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalled();
  });
});

describe('useRemoveVehiclePhoto', () => {
  it('invalidates queries on success', async () => {
    (removeVehiclePhoto as jest.Mock).mockResolvedValue({
      path: 'user-1/veh-1/cover/x.jpg',
      vehicle: { id: 'veh-1', workspaceId: 'ws-1', coverPhotoPath: null },
    });
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');

    const hook = renderHook(() => useRemoveVehiclePhoto(), { wrapper });
    act(() => {
      hook.result.current.mutate({ vehicleId: 'veh-1' });
    });

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(invalidateSpy).toHaveBeenCalled();
  });
});

describe('useVehiclePhotoUrl', () => {
  it('fetches a signed url when a path is present', async () => {
    (getVehiclePhotoSignedUrl as jest.Mock).mockResolvedValue('https://cdn.example.com/signed.jpg');
    const { wrapper } = makeWrapper();

    const hook = renderHook(() => useVehiclePhotoUrl('user-1/veh-1/cover/x.jpg'), { wrapper });

    await waitFor(() => expect(hook.result.current.isSuccess).toBe(true));
    expect(hook.result.current.data).toBe('https://cdn.example.com/signed.jpg');
  });

  it('stays idle when there is no path', () => {
    const { wrapper } = makeWrapper();
    const hook = renderHook(() => useVehiclePhotoUrl(null), { wrapper });
    expect(hook.result.current.fetchStatus).toBe('idle');
  });
});

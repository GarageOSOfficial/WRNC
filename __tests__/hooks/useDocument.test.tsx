import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  documentKeys,
  useCreateDocument,
  useUpdateDocument,
  useArchiveDocument,
  useRestoreDocument,
} from '../../hooks/useDocument';
import {
  createDocument,
  updateDocument,
  archiveDocument,
  restoreDocument,
} from '../../services/api/documents';

const queryClients: QueryClient[] = [];

jest.mock('../../services/api/documents', () => ({
  createDocument: jest.fn(),
  updateDocument: jest.fn(),
  archiveDocument: jest.fn(),
  restoreDocument: jest.fn(),
  listDocuments: jest.fn(),
  getDocument: jest.fn(),
}));

const mockDocument = {
  id: 'doc-1',
  workspaceId: 'ws-1',
  vehicleId: null,
  activityId: null,
  documentType: 'manual',
  title: 'Service Manual',
  description: null,
  fileUrl: 'https://cdn.example.com/manual.pdf',
  thumbnailUrl: null,
  mimeType: 'application/pdf',
  fileSize: 1024,
  uploadedBy: 'user-1',
  uploadedAt: '2024-01-01T00:00:00.000Z',
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

describe('document hooks', () => {
  it('exposes stable document query keys', () => {
    expect(documentKeys.all).toEqual(['documents']);
    expect(documentKeys.lists()).toEqual(['documents', 'list']);
    expect(documentKeys.list('ws-1')).toEqual(['documents', 'list', 'ws-1', {}]);
    expect(documentKeys.detail('doc-1')).toEqual(['documents', 'detail', 'doc-1']);
  });

  it('invalidates document list and detail on create/update/archive/restore', async () => {
    const { queryClient, wrapper } = makeWrapper();
    const invalidateSpy = jest.spyOn(queryClient, 'invalidateQueries');
    (createDocument as jest.Mock).mockResolvedValue(mockDocument);
    (updateDocument as jest.Mock).mockResolvedValue(mockDocument);
    (archiveDocument as jest.Mock).mockResolvedValue({ ...mockDocument, archivedAt: '2024-01-02T00:00:00.000Z' });
    (restoreDocument as jest.Mock).mockResolvedValue(mockDocument);

    const createHook = renderHook(() => useCreateDocument(), { wrapper });
    act(() => {
      createHook.result.current.mutate({
        workspaceId: 'ws-1',
        title: 'Service Manual',
        documentType: 'manual',
        fileUrl: 'https://cdn.example.com/manual.pdf',
        mimeType: 'application/pdf',
        fileSize: 950,
        uploadedBy: 'user-1',
      });
    });
    await waitFor(() => expect(createHook.result.current.isSuccess).toBe(true));

    const updateHook = renderHook(() => useUpdateDocument(), { wrapper });
    act(() => {
      updateHook.result.current.mutate({ id: 'doc-1', input: { title: 'Updated' } });
    });
    await waitFor(() => expect(updateHook.result.current.isSuccess).toBe(true));

    const archiveHook = renderHook(() => useArchiveDocument(), { wrapper });
    act(() => {
      archiveHook.result.current.mutate('doc-1');
    });
    await waitFor(() => expect(archiveHook.result.current.isSuccess).toBe(true));

    const restoreHook = renderHook(() => useRestoreDocument(), { wrapper });
    act(() => {
      restoreHook.result.current.mutate('doc-1');
    });
    await waitFor(() => expect(restoreHook.result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalled();
  });
});

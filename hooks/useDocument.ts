import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  archiveDocument,
  createDocument,
  getDocument,
  listDocuments,
  restoreDocument,
  updateDocument,
  type ListDocumentsOptions,
} from '../services/api/documents';
import type { CreateDocumentInput, UpdateDocumentInput } from '../types/document';

export const documentKeys = {
  all: ['documents'] as const,
  lists: () => [...documentKeys.all, 'list'] as const,
  list: (workspaceId: string, options: ListDocumentsOptions = {}) =>
    [...documentKeys.lists(), workspaceId, options] as const,
  details: () => [...documentKeys.all, 'detail'] as const,
  detail: (id: string) => [...documentKeys.details(), id] as const,
};

export function useDocuments(workspaceId: string | undefined, options: ListDocumentsOptions = {}) {
  return useQuery({
    queryKey: documentKeys.list(workspaceId ?? '', options),
    queryFn: () => listDocuments(workspaceId as string, options),
    enabled: Boolean(workspaceId),
    staleTime: 60 * 1000,
  });
}

export function useDocument(documentId: string | undefined) {
  return useQuery({
    queryKey: documentKeys.detail(documentId ?? ''),
    queryFn: () => getDocument(documentId as string),
    enabled: Boolean(documentId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDocumentInput) => createDocument(input),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.list(document.workspaceId) });
    },
  });
}

export function useUpdateDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDocumentInput }) =>
      updateDocument(id, input),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(document.id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.list(document.workspaceId) });
    },
  });
}

export function useArchiveDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => archiveDocument(id),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(document.id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.list(document.workspaceId) });
    },
  });
}

export function useRestoreDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => restoreDocument(id),
    onSuccess: (document) => {
      queryClient.invalidateQueries({ queryKey: documentKeys.detail(document.id) });
      queryClient.invalidateQueries({ queryKey: documentKeys.list(document.workspaceId) });
    },
  });
}

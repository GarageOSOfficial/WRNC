import { supabase } from '../../lib/supabase';
import {
  toDocument,
  type CreateDocumentInput,
  type Document,
  type ListDocumentsOptions,
  type UpdateDocumentInput,
} from '../../types/document';
import { validateDocumentInput } from '../../utils/validators';
import {
  createDocumentObjectPath,
  createDocumentSignedUrl,
  removeDocumentObject,
  uploadDocumentObject,
  type PickedDocumentFile,
} from '../documentStorage';

export async function listDocuments(
  workspaceId: string,
  options: ListDocumentsOptions = {}
): Promise<Document[]> {
  let query = supabase
    .from('documents')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('uploaded_at', { ascending: false });

  if (!options.includeArchived) {
    query = query.is('archived_at', null);
  }

  const { data, error } = await query;
  if (error) throw error;
  return Promise.all((data ?? []).map(async (row) => {
    const document = toDocument(row);
    try { document.signedUrl = await createDocumentSignedUrl(document.filePath); } catch { document.signedUrl = null; }
    return document;
  }));
}

async function getDocumentRecord(id: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return toDocument(data);
}

export async function getDocument(id: string): Promise<Document> {
  const document = await getDocumentRecord(id);
  document.signedUrl = await createDocumentSignedUrl(document.filePath);
  return document;
}

export async function createDocument(input: CreateDocumentInput): Promise<Document> {
  const { valid, errors } = validateDocumentInput(input);
  if (!valid) {
    throw new Error(Object.values(errors).join(' '));
  }

  const { data, error } = await supabase
    .from('documents')
    .insert({
      workspace_id: input.workspaceId,
      vehicle_id: input.vehicleId ?? null,
      activity_id: input.activityId ?? null,
      document_type: input.documentType.trim(),
      title: input.title.trim(),
      description: input.description?.trim() || null,
      file_path: input.filePath.trim(),
      file_url: null,
      thumbnail_url: input.thumbnailUrl?.trim() || null,
      mime_type: input.mimeType.trim(),
      file_size: input.fileSize,
      uploaded_by: input.uploadedBy,
    })
    .select('*')
    .single();

  if (error) throw error;
  return toDocument(data);
}

export async function updateDocument(
  id: string,
  input: UpdateDocumentInput
): Promise<Document> {
  const payload: Record<string, unknown> = {};

  if (input.documentType !== undefined) payload.document_type = input.documentType.trim();
  if (input.title !== undefined) payload.title = input.title.trim();
  if (input.description !== undefined) payload.description = input.description?.trim() || null;
  if (input.filePath !== undefined) payload.file_path = input.filePath.trim();
  if (input.thumbnailUrl !== undefined) payload.thumbnail_url = input.thumbnailUrl?.trim() || null;
  if (input.mimeType !== undefined) payload.mime_type = input.mimeType.trim();
  if (input.fileSize !== undefined) payload.file_size = input.fileSize;
  if (input.vehicleId !== undefined) payload.vehicle_id = input.vehicleId ?? null;
  if (input.activityId !== undefined) payload.activity_id = input.activityId ?? null;

  const { data, error } = await supabase
    .from('documents')
    .update(payload)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toDocument(data);
}

export async function archiveDocument(id: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .update({ archived_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toDocument(data);
}

export async function restoreDocument(id: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .update({ archived_at: null })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return toDocument(data);
}

export interface UploadVehicleDocumentInput {
  workspaceId: string;
  vehicleId: string;
  userId: string;
  title: string;
  documentType: string;
  description?: string | null;
  file: PickedDocumentFile;
}

export async function uploadVehicleDocument(input: UploadVehicleDocumentInput): Promise<Document> {
  const filePath = createDocumentObjectPath(input.userId, input.vehicleId, input.file);
  await uploadDocumentObject(filePath, input.file);
  try {
    return await createDocument({
      workspaceId: input.workspaceId, vehicleId: input.vehicleId, uploadedBy: input.userId,
      title: input.title, documentType: input.documentType, description: input.description,
      filePath, mimeType: input.file.mimeType, fileSize: input.file.size,
    });
  } catch (error) {
    try { await removeDocumentObject(filePath); } catch { /* preserve original metadata error */ }
    throw error;
  }
}

export async function replaceDocumentFile(id: string, file: PickedDocumentFile, userId: string): Promise<Document> {
  const current = await getDocumentRecord(id);
  if (!current.vehicleId) throw new Error('This document is not attached to a vehicle.');
  const nextPath = createDocumentObjectPath(userId, current.vehicleId, file);
  await uploadDocumentObject(nextPath, file);
  try {
    const updated = await updateDocument(id, { filePath: nextPath, mimeType: file.mimeType, fileSize: file.size });
    try { await removeDocumentObject(current.filePath); } catch { /* new record remains valid; retry cleanup later */ }
    return updated;
  } catch (error) {
    try { await removeDocumentObject(nextPath); } catch { /* preserve original update error */ }
    throw error;
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const current = await getDocumentRecord(id);
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) throw error;
  try { await removeDocumentObject(current.filePath); } catch { /* DB deletion prevents access; cleanup can be retried */ }
}

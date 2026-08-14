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
  buildAttachmentPath,
  getAttachmentSignedUrl,
  removeAttachmentObjects,
  uploadAttachmentObject,
  validateAttachmentFile,
  type AttachmentCategory,
  type AttachmentFileInput,
} from './attachmentStorage';

export const VEHICLE_DOCUMENTS_BUCKET = 'vehicle-documents' as const;
export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024;
export const ALLOWED_DOCUMENT_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;

export const DOCUMENT_CATEGORIES = [
  'receipt',
  'registration',
  'insurance',
  'warranty',
  'manual',
  'diagram',
  'other',
] as const;

export type DocumentCategory = (typeof DOCUMENT_CATEGORIES)[number];

export interface UploadDocumentInput {
  workspaceId: string;
  vehicleId: string;
  userId: string;
  title: string;
  category: DocumentCategory;
  file: AttachmentFileInput;
}

export function validateDocumentFile(file: AttachmentFileInput) {
  return validateAttachmentFile(file, {
    allowedMimeTypes: ALLOWED_DOCUMENT_MIME_TYPES,
    maxSizeBytes: MAX_DOCUMENT_SIZE_BYTES,
  });
}

export async function getDocumentSignedUrl(path: string): Promise<string> {
  return getAttachmentSignedUrl(VEHICLE_DOCUMENTS_BUCKET, path, 60);
}

/**
 * Uploads a document/receipt to private storage, then inserts its metadata
 * row. If the database insert fails, the just-uploaded object is removed so
 * no orphaned file is left behind.
 */
export async function uploadDocument(input: UploadDocumentInput): Promise<Document> {
  const validation = validateDocumentFile(input.file);
  if (!validation.valid) {
    throw new Error(validation.errors.join(' '));
  }

  const category: AttachmentCategory = input.category;
  const objectPath = buildAttachmentPath(input.userId, input.vehicleId, category, input.file.name);
  await uploadAttachmentObject(VEHICLE_DOCUMENTS_BUCKET, objectPath, input.file);

  try {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        workspace_id: input.workspaceId,
        vehicle_id: input.vehicleId,
        document_type: input.category,
        title: input.title.trim(),
        storage_path: objectPath,
        original_file_name: input.file.name,
        mime_type: input.file.mimeType,
        file_size: input.file.size,
        uploaded_by: input.userId,
      })
      .select('*')
      .single();

    if (error || !data) {
      throw new Error('Unable to save this document. Please try again.');
    }

    return toDocument(data);
  } catch (error) {
    await removeAttachmentObjects(VEHICLE_DOCUMENTS_BUCKET, [objectPath]);
    throw error;
  }
}

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
  return (data ?? []).map(toDocument);
}

export async function getDocument(id: string): Promise<Document> {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return toDocument(data);
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
      file_url: input.fileUrl?.trim() || null,
      storage_path: input.storagePath?.trim() || null,
      original_file_name: input.originalFileName?.trim() || null,
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
  if (input.fileUrl !== undefined) payload.file_url = input.fileUrl?.trim() || null;
  if (input.storagePath !== undefined) payload.storage_path = input.storagePath?.trim() || null;
  if (input.originalFileName !== undefined) payload.original_file_name = input.originalFileName?.trim() || null;
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

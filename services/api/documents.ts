import { supabase } from '../../lib/supabase';
import {
  toDocument,
  type CreateDocumentInput,
  type Document,
  type ListDocumentsOptions,
  type UpdateDocumentInput,
} from '../../types/document';
import { validateDocumentInput } from '../../utils/validators';

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
      file_url: input.fileUrl.trim(),
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
  if (input.fileUrl !== undefined) payload.file_url = input.fileUrl.trim();
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

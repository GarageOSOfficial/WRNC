import type { Database } from './database';

export type DocumentRow = Database['public']['Tables']['documents']['Row'];

export interface Document {
  id: string;
  workspaceId: string;
  vehicleId: string | null;
  activityId: string | null;
  documentType: string;
  title: string;
  description: string | null;
  fileUrl: string;
  thumbnailUrl: string | null;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: string;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentInput {
  workspaceId: string;
  vehicleId?: string | null;
  activityId?: string | null;
  documentType: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  thumbnailUrl?: string | null;
  mimeType: string;
  fileSize: number;
  uploadedBy: string;
}

export type UpdateDocumentInput = Partial<
  Omit<CreateDocumentInput, 'workspaceId' | 'uploadedBy'>
>;

export interface ListDocumentsOptions {
  includeArchived?: boolean;
}

export function toDocument(row: DocumentRow): Document {
  return {
    id: row.id,
    workspaceId: row.workspace_id,
    vehicleId: row.vehicle_id,
    activityId: row.activity_id,
    documentType: row.document_type,
    title: row.title,
    description: row.description,
    fileUrl: row.file_url,
    thumbnailUrl: row.thumbnail_url,
    mimeType: row.mime_type,
    fileSize: row.file_size,
    uploadedBy: row.uploaded_by,
    uploadedAt: row.uploaded_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

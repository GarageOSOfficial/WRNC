import { supabase } from '../lib/supabase';

export const DOCUMENT_BUCKET = 'vehicle-documents';
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024;
export const DOCUMENT_SIGNED_URL_TTL_SECONDS = 15 * 60;
export const ALLOWED_DOCUMENT_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;

export interface PickedDocumentFile {
  uri: string;
  name: string;
  mimeType: string;
  size: number;
}

export function validatePickedDocument(file: PickedDocumentFile): void {
  if (!ALLOWED_DOCUMENT_MIME_TYPES.includes(file.mimeType as typeof ALLOWED_DOCUMENT_MIME_TYPES[number])) {
    throw new Error('Choose a PDF, JPEG, PNG, or WebP file.');
  }
  if (!Number.isFinite(file.size) || file.size <= 0) throw new Error('The selected file is empty.');
  if (file.size > MAX_DOCUMENT_BYTES) throw new Error('The selected file must be 25 MB or smaller.');
}

function safeExtension(file: PickedDocumentFile): string {
  const extension = file.name.toLowerCase().match(/\.([a-z0-9]{1,8})$/)?.[1];
  if (extension) return extension;
  return file.mimeType === 'application/pdf' ? 'pdf' : file.mimeType.split('/')[1] || 'bin';
}

export function createDocumentObjectPath(userId: string, vehicleId: string, file: PickedDocumentFile): string {
  const nonce = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
  return `${userId}/${vehicleId}/${nonce}.${safeExtension(file)}`;
}

export async function uploadDocumentObject(path: string, file: PickedDocumentFile): Promise<void> {
  validatePickedDocument(file);
  const response = await fetch(file.uri);
  if (!response.ok) throw new Error('The selected file could not be read.');
  const body = await response.arrayBuffer();
  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).upload(path, body, {
    contentType: file.mimeType,
    upsert: false,
  });
  if (error) throw error;
}

export async function removeDocumentObject(path: string): Promise<void> {
  const { error } = await supabase.storage.from(DOCUMENT_BUCKET).remove([path]);
  if (error) throw error;
}

export async function createDocumentSignedUrl(path: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from(DOCUMENT_BUCKET)
    .createSignedUrl(path, DOCUMENT_SIGNED_URL_TTL_SECONDS);
  if (error) throw error;
  return data.signedUrl;
}

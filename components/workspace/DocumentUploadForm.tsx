import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { Platform, Pressable, Text, View } from 'react-native';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import { DOCUMENT_CATEGORIES, type DocumentCategory } from '../../services/api/documents';
import type { AttachmentFileInput } from '../../services/api/attachmentStorage';

const CATEGORY_LABELS: Record<DocumentCategory, string> = {
  receipt: 'Receipt',
  registration: 'Registration',
  insurance: 'Insurance',
  warranty: 'Warranty',
  manual: 'Manual',
  diagram: 'Diagram',
  other: 'Other',
};

export interface DocumentUploadFormProps {
  onSubmit: (values: { title: string; category: DocumentCategory; file: AttachmentFileInput }) => Promise<void>;
  isSubmitting?: boolean;
}

function inferDocumentMimeType(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.pdf')) return 'application/pdf';
  return '';
}

async function pickWebDocument(): Promise<AttachmentFileInput | null> {
  if (typeof document === 'undefined') {
    throw new Error('File selection is unavailable in this browser.');
  }

  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp,application/pdf';
    input.style.position = 'fixed';
    input.style.left = '-9999px';
    input.style.opacity = '0';

    const cleanup = () => input.remove();

    input.addEventListener(
      'change',
      () => {
        const webFile = input.files?.[0];
        cleanup();

        if (!webFile) {
          resolve(null);
          return;
        }

        resolve({
          name: webFile.name || `vehicle-document-${Date.now()}`,
          mimeType: webFile.type || inferDocumentMimeType(webFile.name),
          size: webFile.size,
          webFile,
        });
      },
      { once: true }
    );

    document.body.appendChild(input);
    input.click();
  });
}

async function pickDocument(): Promise<AttachmentFileInput | null> {
  if (Platform.OS === 'web') {
    return pickWebDocument();
  }

  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    copyToCacheDirectory: true,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  return {
    name: asset.name,
    mimeType: asset.mimeType || inferDocumentMimeType(asset.name) || 'application/octet-stream',
    size: asset.size ?? 0,
    uri: asset.uri,
  };
}

/** Upload control for vehicle documents/receipts: title, category, and file selection. */
export function DocumentUploadForm({ onSubmit, isSubmitting = false }: DocumentUploadFormProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('receipt');
  const [file, setFile] = useState<AttachmentFileInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePickFile = async () => {
    setError(null);
    try {
      const picked = await pickDocument();
      if (picked) setFile(picked);
    } catch (pickError) {
      setError(pickError instanceof Error ? pickError.message : 'Unable to select a file.');
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!file) {
      setError('Select a file to upload.');
      return;
    }

    try {
      await onSubmit({ title: title.trim(), category, file });
      setTitle('');
      setFile(null);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to upload this document.');
    }
  };

  return (
    <View className="mb-6 rounded-2xl border border-wrnc-border bg-wrnc-surface p-4">
      <Text className="mb-3 text-lg font-semibold text-wrnc-text-primary">Add Document</Text>

      <Input label="Title" value={title} onChangeText={setTitle} placeholder="e.g. Front brake receipt" />

      <Text className="mb-1 text-sm font-medium text-wrnc-text-secondary">Category</Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {DOCUMENT_CATEGORIES.map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: category === value }}
            onPress={() => setCategory(value)}
            className={`rounded-full border px-3 py-1.5 ${
              category === value
                ? 'border-wrnc-action-primary bg-wrnc-action-primary'
                : 'border-wrnc-border bg-wrnc-surface-elevated'
            }`}
          >
            <Text className={category === value ? 'text-wrnc-text-primary' : 'text-wrnc-text-secondary'}>
              {CATEGORY_LABELS[value]}
            </Text>
          </Pressable>
        ))}
      </View>

      <Button
        label={file ? `Selected: ${file.name}` : 'Choose File'}
        variant="secondary"
        onPress={handlePickFile}
        disabled={isSubmitting}
      />

      <View className="mt-3">
        <Button label="Upload Document" onPress={handleSubmit} loading={isSubmitting} disabled={isSubmitting} />
      </View>

      {error ? <Text className="mt-2 text-sm text-semantic-error">{error}</Text> : null}
    </View>
  );
}

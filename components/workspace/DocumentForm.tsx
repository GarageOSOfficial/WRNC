import React, { useState } from 'react';
import { View } from 'react-native';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

interface DocumentFormProps {
  initialValues?: {
    title?: string;
    documentType?: string;
    fileUrl?: string;
    description?: string;
    mimeType?: string;
    fileSize?: number;
  };
  onSubmit?: (values: Record<string, string | number | null | undefined>) => void;
}

export function DocumentForm({ initialValues = {}, onSubmit }: DocumentFormProps) {
  const [title, setTitle] = useState(initialValues.title ?? '');
  const [documentType, setDocumentType] = useState(initialValues.documentType ?? '');
  const [fileUrl, setFileUrl] = useState(initialValues.fileUrl ?? '');
  const [description, setDescription] = useState(initialValues.description ?? '');
  const [mimeType, setMimeType] = useState(initialValues.mimeType ?? 'application/pdf');
  const [fileSize, setFileSize] = useState(initialValues.fileSize ?? 0);

  return (
    <View>
      <Input label="Title" value={title} onChangeText={setTitle} />
      <Input label="Document Type" value={documentType} onChangeText={setDocumentType} />
      <Input label="File URL" value={fileUrl} onChangeText={setFileUrl} />
      <Input label="Description" value={description} onChangeText={setDescription} />
      <Input label="MIME Type" value={mimeType} onChangeText={setMimeType} />
      <Input label="File Size" value={String(fileSize)} onChangeText={(value) => setFileSize(Number(value || 0))} keyboardType="numeric" />
      <Button
        label="Save Document"
        onPress={() =>
          onSubmit?.({
            title,
            documentType,
            fileUrl,
            description,
            mimeType,
            fileSize,
          })
        }
      />
    </View>
  );
}

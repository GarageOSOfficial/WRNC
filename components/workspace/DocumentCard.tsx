import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentCardProps {
  title: string;
  documentType: string;
  mimeType: string;
  fileSize: number;
  onPress?: () => void;
}

export function DocumentCard({ title, documentType, mimeType, fileSize, onPress }: DocumentCardProps) {
  return (
    <View className="mb-3 rounded-lg border border-gray-200 bg-white p-4">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm text-gray-600">{documentType}</Text>
      <Text className="mt-1 text-xs text-gray-500">{mimeType} • {fileSize} bytes</Text>
      <View className="mt-3">
        <Button label="Open" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
}

import React from 'react';
import { Text, View } from 'react-native';

interface DocumentPreviewProps {
  title: string;
  fileUrl: string;
  mimeType: string;
}

export function DocumentPreview({ title, fileUrl, mimeType }: DocumentPreviewProps) {
  return (
    <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <Text className="text-base font-semibold text-gray-900">{title}</Text>
      <Text className="mt-1 text-sm text-gray-600">{mimeType}</Text>
      <Text className="mt-1 text-xs text-gray-500">{fileUrl}</Text>
    </View>
  );
}

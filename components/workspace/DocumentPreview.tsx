import React from 'react';
import { Text, View } from 'react-native';

interface DocumentPreviewProps {
  title: string;
  fileUrl: string;
  mimeType: string;
}

export function DocumentPreview({ title, fileUrl, mimeType }: DocumentPreviewProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-background p-4">
      <Text className="text-base font-semibold text-wrnc-text-primary">{title}</Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">{mimeType}</Text>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">{fileUrl}</Text>
    </View>
  );
}

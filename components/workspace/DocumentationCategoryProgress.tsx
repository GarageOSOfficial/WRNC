import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationCategoryProgressProps {
  category: DocumentationCategoryScore;
}

export function DocumentationCategoryProgress({ category }: DocumentationCategoryProgressProps) {
  return (
    <View className="rounded-lg border border-gray-200 bg-gray-50 p-3">
      <Text className="text-sm font-semibold text-gray-900">{category.label}</Text>
      <Text className="mt-1 text-xs text-gray-500">{category.score}% complete</Text>
    </View>
  );
}

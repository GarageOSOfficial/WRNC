import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationScoreBreakdownProps {
  categories: DocumentationCategoryScore[];
}

export function DocumentationScoreBreakdown({ categories }: DocumentationScoreBreakdownProps) {
  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4">
      {categories.map((category) => (
        <View key={category.key} className="mb-3 last:mb-0">
          <View className="flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-900">{category.label}</Text>
            <Text className="text-sm text-gray-600">{category.score}/100</Text>
          </View>
          <Text className="mt-1 text-xs text-gray-500">{category.evidence.join(', ')}</Text>
        </View>
      ))}
    </View>
  );
}

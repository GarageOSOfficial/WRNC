import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationCategoryProgressProps {
  category: DocumentationCategoryScore;
}

export function DocumentationCategoryProgress({ category }: DocumentationCategoryProgressProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-background p-3">
      <Text className="text-sm font-semibold text-wrnc-text-primary">{category.label}</Text>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">{category.score}% complete</Text>
    </View>
  );
}

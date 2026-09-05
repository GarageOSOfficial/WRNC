import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationCategoryProgressProps {
  category: DocumentationCategoryScore;
}

export function DocumentationCategoryProgress({ category }: DocumentationCategoryProgressProps) {
  const factualLabel = category.key === 'activityHistory' || category.key === 'photos';

  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-background p-3">
      <Text className="text-sm font-semibold text-wrnc-text-primary">{category.label}</Text>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">
        {factualLabel ? category.evidence[0] : `${category.score}% complete`}
      </Text>
    </View>
  );
}

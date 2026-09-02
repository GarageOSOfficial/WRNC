import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationCategoryScore } from '../../types/documentationScore';

interface DocumentationCategoryProgressProps {
  category: DocumentationCategoryScore;
}

const FACTUAL_COUNT_CATEGORIES = new Set<DocumentationCategoryScore['key']>(['activityHistory', 'photos']);

export function DocumentationCategoryProgress({ category }: DocumentationCategoryProgressProps) {
  const factualCount = FACTUAL_COUNT_CATEGORIES.has(category.key);

  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-background p-3">
      <Text className="text-sm font-semibold text-wrnc-text-primary">{category.label}</Text>
      <Text className="mt-1 text-xs text-wrnc-text-secondary">
        {factualCount ? category.evidence.join(' · ') : `${category.score}% complete`}
      </Text>
    </View>
  );
}

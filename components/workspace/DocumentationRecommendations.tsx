import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationRecommendation } from '../../types/documentationScore';

interface DocumentationRecommendationsProps {
  recommendations: DocumentationRecommendation[];
}

export function DocumentationRecommendations({ recommendations }: DocumentationRecommendationsProps) {
  return (
    <View className="rounded-lg border border-wrnc-border bg-wrnc-surface p-4">
      {recommendations.map((item) => (
        <View key={`${item.category}-${item.title}`} className="mb-3 last:mb-0">
          <Text className="text-sm font-semibold text-wrnc-text-primary">{item.title}</Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">{item.message}</Text>
          <Text className="mt-1 text-xs uppercase tracking-wide text-wrnc-text-secondary">{item.impact}</Text>
        </View>
      ))}
    </View>
  );
}

import React from 'react';
import { Text, View } from 'react-native';
import type { DocumentationRecommendation } from '../../types/documentationScore';

interface DocumentationRecommendationsProps {
  recommendations: DocumentationRecommendation[];
}

export function DocumentationRecommendations({ recommendations }: DocumentationRecommendationsProps) {
  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4">
      {recommendations.map((item) => (
        <View key={`${item.category}-${item.title}`} className="mb-3 last:mb-0">
          <Text className="text-sm font-semibold text-gray-900">{item.title}</Text>
          <Text className="mt-1 text-sm text-gray-600">{item.message}</Text>
          <Text className="mt-1 text-xs uppercase tracking-wide text-gray-500">{item.impact}</Text>
        </View>
      ))}
    </View>
  );
}

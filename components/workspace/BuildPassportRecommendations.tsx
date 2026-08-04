import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import type { BuildPassportRecommendation } from '../../types/buildPassport';

interface BuildPassportRecommendationsProps {
  recommendations: BuildPassportRecommendation[];
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderRecommendationLink(
  recommendation: BuildPassportRecommendation,
  onNavigate: (route: string) => void,
  onBack: () => void
) {
  if (recommendation.action === 'back') {
    return <Button label={recommendation.sourceLabel} variant="secondary" onPress={onBack} />;
  }

  if (!recommendation.route) {
    return null;
  }

  return <Button label={recommendation.sourceLabel} variant="secondary" onPress={() => onNavigate(recommendation.route as string)} />;
}

export function BuildPassportRecommendations({ recommendations, onNavigate, onBack }: BuildPassportRecommendationsProps) {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-5">
      <Text className="text-lg font-semibold text-gray-900">Missing Documentation Recommendations</Text>
      <Text className="mt-1 text-sm text-gray-500">Actionable gaps linked back to source records.</Text>

      <View className="mt-4 gap-3">
        {recommendations.length === 0 ? (
          <Text className="text-sm text-gray-600">No recommendations. The current record set is complete for the configured categories.</Text>
        ) : (
          recommendations.map((item) => (
            <View key={`${item.category}-${item.title}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <View className="flex-row flex-wrap items-center justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900">{item.title}</Text>
                  <Text className="mt-1 text-sm text-gray-600">{item.message}</Text>
                </View>
                <Text className="text-xs uppercase tracking-wide text-gray-500">{item.impact}</Text>
              </View>

              <View className="mt-3 max-w-48">
                {renderRecommendationLink(item, onNavigate, onBack)}
              </View>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
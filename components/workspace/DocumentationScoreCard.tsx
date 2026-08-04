import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface DocumentationScoreCardProps {
  score: number;
  onPress?: () => void;
}

export function DocumentationScoreCard({ score, onPress }: DocumentationScoreCardProps) {
  return (
    <View className="rounded-lg border border-gray-200 bg-white p-4">
      <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">Documentation Score™</Text>
      <Text className="mt-2 text-4xl font-bold text-gray-900">{score}/100</Text>
      <View className="mt-3">
        <Button label="View Details" variant="secondary" onPress={onPress} />
      </View>
    </View>
  );
}

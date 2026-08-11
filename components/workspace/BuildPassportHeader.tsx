import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';

interface BuildPassportHeaderProps {
  vehicleTitle: string;
  vehicleSubtitle: string;
  overallScore: number;
  onBack: () => void;
}

export function BuildPassportHeader({ vehicleTitle, vehicleSubtitle, overallScore, onBack }: BuildPassportHeaderProps) {
  return (
    <View className="rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">Build Passport™</Text>
          <Text className="mt-1 text-3xl font-bold text-wrnc-text-primary">{vehicleTitle}</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">{vehicleSubtitle}</Text>
          <Text className="mt-3 text-xs uppercase tracking-wide text-wrnc-text-secondary">
            Read-only aggregation from vehicle, activity, timeline, document, and documentation score records.
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">Score</Text>
          <Text className="text-4xl font-bold text-wrnc-text-primary">{overallScore}</Text>
          <Text className="text-sm text-wrnc-text-secondary">/100</Text>
        </View>
      </View>

      <View className="mt-4 max-w-40">
        <Button label="Back" variant="secondary" onPress={onBack} />
      </View>
    </View>
  );
}
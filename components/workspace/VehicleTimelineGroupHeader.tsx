import React from 'react';
import { Text, View } from 'react-native';

export interface VehicleTimelineGroupHeaderProps {
  title: string;
}

export function VehicleTimelineGroupHeader({ title }: VehicleTimelineGroupHeaderProps) {
  return (
    <View className="bg-gray-50 px-1 py-3">
      <Text className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</Text>
    </View>
  );
}
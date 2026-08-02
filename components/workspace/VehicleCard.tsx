import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { Vehicle } from '../../types/vehicle';

export interface VehicleCardProps {
  vehicle: Vehicle;
  onPress?: () => void;
}

/** Mission Control vehicle list item. */
export function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 rounded-xl border border-gray-200 bg-white p-4"
      onPress={onPress}
    >
      <Text className="text-lg font-semibold text-gray-900">
        {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      </Text>
      <Text className="mt-1 text-sm text-gray-600">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </Text>
      <View className="mt-2 flex-row items-center">
        <Text className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
          {vehicle.archivedAt ? 'Archived' : 'Active'}
        </Text>
      </View>
    </Pressable>
  );
}

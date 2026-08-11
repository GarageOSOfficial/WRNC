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
      className="mb-3 rounded-xl border border-wrnc-border bg-wrnc-surface p-4"
      onPress={onPress}
    >
      <Text className="text-lg font-semibold text-wrnc-text-primary">
        {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
      </Text>
      <Text className="mt-1 text-sm text-wrnc-text-secondary">
        {vehicle.year} {vehicle.make} {vehicle.model}
      </Text>
      <View className="mt-2 flex-row items-center">
        <Text className="rounded-full bg-wrnc-data-accent/20 px-2 py-1 text-xs font-medium text-wrnc-data-accent">
          {vehicle.archivedAt ? 'Archived' : 'Active'}
        </Text>
      </View>
    </Pressable>
  );
}

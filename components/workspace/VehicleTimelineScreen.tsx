import React, { useMemo, useState } from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { Button } from '../common/Button';
import type { Activity } from '../../types/activity';
import type { Vehicle } from '../../types/vehicle';
import {
  filterTimelineActivities,
  selectTimelineSections,
  type TimelineFilters,
} from '../../utils/activityTimeline';
import { VehicleTimelineEmptyState } from './VehicleTimelineEmptyState';
import { VehicleTimelineFilters } from './VehicleTimelineFilters';
import { VehicleTimelineList } from './VehicleTimelineList';

const DEFAULT_FILTERS: TimelineFilters = {
  sortDirection: 'desc',
  activityType: 'all',
  status: 'all',
  startDate: '',
  endDate: '',
};

export interface VehicleTimelineScreenProps {
  vehicle: Vehicle;
  activities: Activity[];
  isLoading?: boolean;
  onBack: () => void;
  onActivityPress: (activityId: string) => void;
  onCreateActivity: () => void;
}

export function VehicleTimelineScreen({
  vehicle,
  activities,
  isLoading,
  onBack,
  onActivityPress,
  onCreateActivity,
}: VehicleTimelineScreenProps) {
  const [filters, setFilters] = useState<TimelineFilters>(DEFAULT_FILTERS);

  const filteredActivities = useMemo(
    () => filterTimelineActivities(activities, filters),
    [activities, filters]
  );
  const sections = useMemo(
    () => selectTimelineSections(activities, filters),
    [activities, filters]
  );
  const vehicleLabel = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const listHeader = (
    <View>
      <Button label="Back" variant="secondary" onPress={onBack} />
      <View className="mt-4">
        <Text className="text-3xl font-bold text-gray-900">Timeline</Text>
        <Text className="mt-2 text-sm text-gray-500">{vehicle.nickname || vehicleLabel}</Text>
      </View>
      <VehicleTimelineFilters filters={filters} onFiltersChange={setFilters} />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {isLoading ? (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {listHeader}
          <View className="items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-12">
            <Text className="text-sm text-gray-600">Loading activities…</Text>
          </View>
        </ScrollView>
      ) : filteredActivities.length === 0 ? (
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
          {listHeader}
          <VehicleTimelineEmptyState onCreateActivity={onCreateActivity} />
        </ScrollView>
      ) : (
        <View className="flex-1 px-4">
          <VehicleTimelineList
            sections={sections}
            totalCount={filteredActivities.length}
            vehicleLabel={vehicleLabel}
            header={listHeader}
            onActivityPress={onActivityPress}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
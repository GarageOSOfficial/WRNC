import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useActivities } from '../../../../hooks/useActivity';
import { useVehicle } from '../../../../hooks/useVehicle';
import { VehicleTimelineScreen } from '../../../../components/workspace/VehicleTimelineScreen';

export default function VehicleTimelineRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const { data: activities = [], isLoading: activitiesLoading } = useActivities(vehicleId, {
    includeArchived: true,
  });

  if (!vehicleId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-sm text-gray-600">Vehicle not found.</Text>
      </SafeAreaView>
    );
  }

  if (vehicleLoading || !vehicle) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-sm text-gray-600">Loading timeline…</Text>
      </SafeAreaView>
    );
  }

  return (
    <VehicleTimelineScreen
      vehicle={vehicle}
      activities={activities}
      isLoading={activitiesLoading}
      onBack={() => router.back()}
      onActivityPress={(activityId) => router.push(`/vehicle/${vehicle.id}/activity/${activityId}`)}
      onCreateActivity={() => router.push(`/vehicle/${vehicle.id}/activity/new`)}
    />
  );
}
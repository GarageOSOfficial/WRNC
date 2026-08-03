import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../../components/common/Button';
import { useActivity } from '../../../../../hooks/useActivity';
import { useVehicle } from '../../../../../hooks/useVehicle';
import {
  formatTimelineDate,
  getActivityCost,
  getActivityOdometer,
} from '../../../../../utils/activityTimeline';

export default function ActivityDetailsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; activityId?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const activityId = Array.isArray(params.activityId) ? params.activityId[0] : params.activityId;
  const { data: vehicle } = useVehicle(vehicleId);
  const { data: activity, isLoading } = useActivity(activityId);

  if (isLoading || !activity) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-6">
        <Text className="text-sm text-gray-600">Loading activity…</Text>
      </SafeAreaView>
    );
  }

  const cost = getActivityCost(activity);
  const odometer = getActivityOdometer(activity);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <Button label="Back to Timeline" variant="secondary" onPress={() => router.back()} />
        <View className="mt-4 rounded-2xl border border-gray-200 bg-white p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-blue-700">
            {activity.activityType}
          </Text>
          <Text className="mt-2 text-2xl font-bold text-gray-900">{activity.title}</Text>
          <Text className="mt-2 text-sm text-gray-500">
            {formatTimelineDate(activity.activityDate)}
          </Text>
          <Text className="mt-1 text-sm text-gray-500">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle details unavailable'}
          </Text>

          {activity.description ? (
            <Text className="mt-4 text-base leading-6 text-gray-700">{activity.description}</Text>
          ) : null}

          <View className="mt-5 gap-3">
            {odometer !== null ? (
              <View className="rounded-xl bg-gray-100 px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Odometer
                </Text>
                <Text className="mt-1 text-base font-semibold text-gray-900">
                  {odometer.toLocaleString()} miles
                </Text>
              </View>
            ) : null}
            {cost !== null ? (
              <View className="rounded-xl bg-gray-100 px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Cost
                </Text>
                <Text className="mt-1 text-base font-semibold text-gray-900">
                  ${cost.toFixed(2)}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
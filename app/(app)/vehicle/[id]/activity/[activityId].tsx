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
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading activity…</Text>
      </SafeAreaView>
    );
  }

  const cost = getActivityCost(activity);
  const odometer = getActivityOdometer(activity);

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Button label="Back to Timeline" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/timeline`)} />
        <View className="mt-3">
          <Button label="Build Passport" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/passport`)} />
        </View>
        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-data-accent">
            {activity.activityType}
          </Text>
          <Text className="mt-2 text-2xl font-bold text-wrnc-text-primary">{activity.title}</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {formatTimelineDate(activity.activityDate)}
          </Text>
          <Text className="mt-1 text-sm text-wrnc-text-secondary">
            {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle details unavailable'}
          </Text>

          {activity.description ? (
            <Text className="mt-4 text-base leading-6 text-wrnc-text-secondary">{activity.description}</Text>
          ) : null}

          <View className="mt-5 gap-3">
            {odometer !== null ? (
              <View className="rounded-xl bg-wrnc-surface-elevated px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
                  Odometer
                </Text>
                <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">
                  {odometer.toLocaleString()} miles
                </Text>
              </View>
            ) : null}
            {cost !== null ? (
              <View className="rounded-xl bg-wrnc-surface-elevated px-4 py-3">
                <Text className="text-xs font-semibold uppercase tracking-wide text-wrnc-text-secondary">
                  Cost
                </Text>
                <Text className="mt-1 text-base font-semibold text-wrnc-text-primary">
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

import React, { memo } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import type { Activity } from '../../types/activity';
import {
  formatTimelineDate,
  getActivityCost,
  getActivityOdometer,
  getActivityPreviewPhotoUrl,
} from '../../utils/activityTimeline';

export interface VehicleTimelineItemProps {
  activity: Activity;
  vehicleLabel: string;
  onPress: (activityId: string) => void;
}

function VehicleTimelineItemComponent({
  activity,
  vehicleLabel,
  onPress,
}: VehicleTimelineItemProps) {
  const previewPhotoUrl = getActivityPreviewPhotoUrl(activity);
  const cost = getActivityCost(activity);
  const odometer = getActivityOdometer(activity);

  return (
    <Pressable
      accessibilityRole="button"
      className="mb-3 rounded-2xl border border-gray-200 bg-white p-4"
      onPress={() => onPress(activity.id)}
    >
      <View className="flex-row items-start gap-4">
        {previewPhotoUrl ? (
          <Image
            source={{ uri: previewPhotoUrl }}
            className="h-20 w-20 rounded-xl bg-gray-200"
            accessibilityLabel={`${activity.title} preview image`}
          />
        ) : (
          <View className="h-20 w-20 items-center justify-center rounded-xl bg-gray-100">
            <Text className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              No Photo
            </Text>
          </View>
        )}

        <View className="flex-1">
          <View className="flex-row flex-wrap items-center gap-2">
            <Text className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
              {activity.activityType}
            </Text>
            {activity.archivedAt ? (
              <Text className="rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700">
                Archived
              </Text>
            ) : null}
          </View>

          <Text className="mt-3 text-lg font-semibold text-gray-900">{activity.title}</Text>
          <Text className="mt-1 text-sm text-gray-500">{formatTimelineDate(activity.activityDate)}</Text>
          <Text className="mt-1 text-sm text-gray-500">{vehicleLabel}</Text>

          {activity.description ? (
            <Text className="mt-3 text-sm leading-5 text-gray-700">{activity.description}</Text>
          ) : null}

          {cost !== null || odometer !== null ? (
            <View className="mt-3 flex-row flex-wrap gap-2">
              {odometer !== null ? (
                <Text className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {odometer.toLocaleString()} miles
                </Text>
              ) : null}
              {cost !== null ? (
                <Text className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  ${cost.toFixed(2)}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export const VehicleTimelineItem = memo(VehicleTimelineItemComponent);
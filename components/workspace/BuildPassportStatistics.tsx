import React from 'react';
import { Text, View } from 'react-native';
import type { BuildPassportStatistics as BuildPassportStatisticsType } from '../../types/buildPassport';

interface BuildPassportStatisticsProps {
  statistics: BuildPassportStatisticsType;
}

export function BuildPassportStatistics({ statistics }: BuildPassportStatisticsProps) {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-5">
      <Text className="text-lg font-semibold text-gray-900">Build Statistics</Text>
      <Text className="mt-1 text-sm text-gray-500">High-level counts derived from the vehicle history.</Text>

      <View className="mt-4 flex-row flex-wrap gap-3">
        <Stat label="Documentation Score" value={`${statistics.documentationScore}/100`} />
        <Stat label="Activities" value={statistics.totalActivities} />
        <Stat label="Documents" value={statistics.totalDocuments} />
        <Stat label="Photos" value={statistics.totalPhotos} />
        <Stat label="Maintenance" value={statistics.maintenanceActivities} />
        <Stat label="Archived Records" value={statistics.archivedActivities + statistics.archivedDocuments} />
      </View>

      <View className="mt-4 gap-3">
        <Breakdown title="Activity Types" items={statistics.activityTypeBreakdown} />
        <Breakdown title="Document Types" items={statistics.documentTypeBreakdown} />
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <View className="min-w-28 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
      <Text className="text-xs uppercase tracking-wide text-gray-500">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-gray-900">{value}</Text>
    </View>
  );
}

function Breakdown({
  title,
  items,
}: {
  title: string;
  items: BuildPassportStatisticsType['activityTypeBreakdown'];
}) {
  return (
    <View className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <Text className="text-sm font-semibold text-gray-900">{title}</Text>
      <View className="mt-2 flex-row flex-wrap gap-2">
        {items.length === 0 ? (
          <Text className="text-sm text-gray-500">No records.</Text>
        ) : (
          items.map((item) => (
            <View key={`${title}-${item.label}`} className="rounded-full bg-white px-3 py-1">
              <Text className="text-xs font-medium text-gray-700">
                {item.label} {item.count}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
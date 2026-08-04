import React from 'react';
import { Text, View } from 'react-native';
import { Button } from '../common/Button';
import type { BuildPassportTimelineSummary as BuildPassportTimelineSummaryType } from '../../types/buildPassport';

interface BuildPassportTimelineSummaryProps {
  summary: BuildPassportTimelineSummaryType;
  onNavigate: (route: string) => void;
  onBack: () => void;
}

function renderLink(
  link: BuildPassportTimelineSummaryType['sourceLinks'][number],
  onNavigate: (route: string) => void,
  onBack: () => void
) {
  if (link.action === 'back') {
    return <Button label={link.label} variant="secondary" onPress={onBack} />;
  }

  if (!link.route) {
    return null;
  }

  return <Button label={link.label} variant="secondary" onPress={() => onNavigate(link.route as string)} />;
}

export function BuildPassportTimelineSummary({ summary, onNavigate, onBack }: BuildPassportTimelineSummaryProps) {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-5">
      <Text className="text-lg font-semibold text-gray-900">Timeline Summary</Text>
      <Text className="mt-1 text-sm text-gray-500">Recent activity history and timeline depth.</Text>

      <View className="mt-4 flex-row flex-wrap gap-3">
        <Stat label="Activities" value={summary.totalActivities} />
        <Stat label="Active" value={summary.activeActivities} />
        <Stat label="Archived" value={summary.archivedActivities} />
      </View>

      {summary.latestActivity ? (
        <View className="mt-4 rounded-xl bg-gray-50 px-4 py-3">
          <Text className="text-xs font-semibold uppercase tracking-wide text-gray-500">Latest Activity</Text>
          <Text className="mt-1 text-base font-semibold text-gray-900">{summary.latestActivity.title}</Text>
          <Text className="mt-1 text-sm text-gray-600">{summary.latestActivity.activityDate}</Text>
        </View>
      ) : null}

      <View className="mt-4 flex-row flex-wrap gap-3">
        {summary.sourceLinks.map((link) => (
          <View key={link.label} className="min-w-36 flex-1">
            {renderLink(link, onNavigate, onBack)}
          </View>
        ))}
      </View>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View className="min-w-24 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
      <Text className="text-xs uppercase tracking-wide text-gray-500">{label}</Text>
      <Text className="mt-1 text-lg font-semibold text-gray-900">{value}</Text>
    </View>
  );
}
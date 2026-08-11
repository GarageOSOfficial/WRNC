import React from 'react';
import { SafeAreaView, ScrollView, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BuildPassportHeader } from '../../../../components/workspace/BuildPassportHeader';
import { BuildPassportVehicleSummary } from '../../../../components/workspace/BuildPassportVehicleSummary';
import { BuildPassportTimelineSummary } from '../../../../components/workspace/BuildPassportTimelineSummary';
import { BuildPassportDocumentationSummary } from '../../../../components/workspace/BuildPassportDocumentationSummary';
import { BuildPassportRecommendations } from '../../../../components/workspace/BuildPassportRecommendations';
import { BuildPassportStatistics } from '../../../../components/workspace/BuildPassportStatistics';
import { useBuildPassport } from '../../../../hooks/useBuildPassport';

export default function VehiclePassportRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: passport, isLoading } = useBuildPassport(vehicleId);

  if (!vehicleId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Vehicle not found.</Text>
      </SafeAreaView>
    );
  }

  if (isLoading || !passport) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading passport…</Text>
      </SafeAreaView>
    );
  }

  const { vehicleSummary, timelineSummary, documentationSummary, statistics, recommendations } = passport;

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <BuildPassportHeader
          vehicleTitle={vehicleSummary.title}
          vehicleSubtitle={vehicleSummary.subtitle}
          overallScore={documentationSummary.overallScore}
          onBack={() => router.back()}
        />

        <BuildPassportVehicleSummary
          summary={vehicleSummary}
          onNavigate={(route) => router.push(route)}
          onBack={() => router.back()}
        />

        <BuildPassportTimelineSummary
          summary={timelineSummary}
          onNavigate={(route) => router.push(route)}
          onBack={() => router.back()}
        />

        <BuildPassportDocumentationSummary
          summary={documentationSummary}
          onNavigate={(route) => router.push(route)}
          onBack={() => router.back()}
        />

        <BuildPassportStatistics statistics={statistics} />

        <BuildPassportRecommendations
          recommendations={recommendations}
          onNavigate={(route) => router.push(route)}
          onBack={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
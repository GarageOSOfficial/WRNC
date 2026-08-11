import React from 'react';
import { Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../components/common/Button';
import { DocumentCard } from '../../../../components/workspace/DocumentCard';
import { DocumentEmptyState } from '../../../../components/workspace/DocumentEmptyState';
import { useDocuments } from '../../../../hooks/useDocument';
import { useVehicle } from '../../../../hooks/useVehicle';

export default function VehicleDocumentsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(vehicle?.workspaceId, {
    includeArchived: true,
  });

  if (!vehicleId) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Vehicle not found.</Text>
      </SafeAreaView>
    );
  }

  if (vehicleLoading || !vehicle) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-wrnc-background px-6">
        <Text className="text-sm text-wrnc-text-secondary">Loading documents…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-wrnc-background">
      <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Button label="Back to Passport" variant="secondary" onPress={() => router.back()} />

        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-2xl font-bold text-wrnc-text-primary">Documents</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          </Text>

          <View className="mt-4">
            {documentsLoading ? (
              <Text className="text-sm text-wrnc-text-secondary">Loading document records…</Text>
            ) : documents.length === 0 ? (
              <DocumentEmptyState />
            ) : (
              documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  title={document.title}
                  documentType={document.documentType}
                  mimeType={document.mimeType}
                  fileSize={document.fileSize}
                  onPress={() => {
                    void Linking.openURL(document.fileUrl);
                  }}
                />
              ))
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
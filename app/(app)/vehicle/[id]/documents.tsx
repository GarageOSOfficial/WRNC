import React, { useState } from 'react';
import { Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../components/common/Button';
import { DocumentCard } from '../../../../components/workspace/DocumentCard';
import { DocumentEmptyState } from '../../../../components/workspace/DocumentEmptyState';
import { DocumentUploadForm } from '../../../../components/workspace/DocumentUploadForm';
import { useDocuments, useUploadDocument } from '../../../../hooks/useDocument';
import { useVehicle } from '../../../../hooks/useVehicle';
import { getDocumentSignedUrl } from '../../../../services/api/documents';
import { supabase } from '../../../../lib/supabase';

export default function VehicleDocumentsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(vehicle?.workspaceId, {
    includeArchived: true,
    vehicleId,
  });
  const uploadDocument = useUploadDocument();
  const [openError, setOpenError] = useState<string | null>(null);

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
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} keyboardShouldPersistTaps="handled">
        <Button label="Back to Passport" variant="secondary" onPress={() => router.replace(`/vehicle/${vehicleId}/passport`)} />

        <View className="mt-4 rounded-2xl border border-wrnc-border bg-wrnc-surface p-5">
          <Text className="text-2xl font-bold text-wrnc-text-primary">Documents</Text>
          <Text className="mt-2 text-sm text-wrnc-text-secondary">
            {vehicle.nickname || `${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          </Text>

          <View className="mt-4">
            <DocumentUploadForm
              isSubmitting={uploadDocument.isPending}
              onSubmit={async ({ title, category, file }) => {
                const { data: userData } = await supabase.auth.getUser();
                const userId = userData.user?.id;
                if (!userId) throw new Error('You must be signed in to upload a document.');

                await uploadDocument.mutateAsync({
                  workspaceId: vehicle.workspaceId,
                  vehicleId,
                  userId,
                  title,
                  category,
                  file,
                });
              }}
            />

            {openError ? <Text className="mb-3 text-sm text-semantic-error">{openError}</Text> : null}

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
                  onPress={async () => {
                    setOpenError(null);
                    try {
                      const url = document.storagePath
                        ? await getDocumentSignedUrl(document.storagePath)
                        : document.fileUrl;
                      if (!url) throw new Error('This document has no file to open.');
                      await Linking.openURL(url);
                    } catch (error) {
                      setOpenError(error instanceof Error ? error.message : 'Unable to open this document.');
                    }
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

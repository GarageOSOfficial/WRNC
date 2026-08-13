import React, { useState } from 'react';
import { Alert, Linking, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '../../../../components/common/Button';
import { DocumentCard } from '../../../../components/workspace/DocumentCard';
import { DocumentEmptyState } from '../../../../components/workspace/DocumentEmptyState';
import { useDocuments, useUploadVehicleDocument } from '../../../../hooks/useDocument';
import { useVehicle } from '../../../../hooks/useVehicle';
import { pickVehicleDocument } from '../../../../services/documentPicker';
import { supabase } from '../../../../lib/supabase';

export default function VehicleDocumentsRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const vehicleId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: vehicle, isLoading: vehicleLoading } = useVehicle(vehicleId);
  const { data: documents = [], isLoading: documentsLoading } = useDocuments(vehicle?.workspaceId, {
    includeArchived: false,
  });
  const upload = useUploadVehicleDocument();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const chooseAndUpload = async () => {
    setUploadError(null);
    try {
      const file = await pickVehicleDocument();
      if (!file || !vehicleId || !vehicle) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Sign in again before uploading.');
      await upload.mutateAsync({
        workspaceId: vehicle.workspaceId, vehicleId, userId: user.id, file,
        title: file.name.replace(/\.[^.]+$/, ''), documentType: file.mimeType === 'application/pdf' ? 'Document' : 'Photo',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setUploadError(message);
      Alert.alert('Upload failed', message);
    }
  };

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
            <Button label={upload.isPending ? 'Uploading…' : 'Upload document or photo'} onPress={() => void chooseAndUpload()} disabled={upload.isPending} />
            {uploadError ? <Text accessibilityRole="alert" className="mt-2 text-sm text-red-400">{uploadError}</Text> : null}
          </View>

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
                    if (document.signedUrl) void Linking.openURL(document.signedUrl);
                    else setUploadError('Secure preview expired. Refresh the page and try again.');
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

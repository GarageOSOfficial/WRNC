import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { Button } from '../common/Button';
import type { AttachmentFileInput } from '../../services/api/attachmentStorage';

export interface VehicleCoverPhotoProps {
  signedUrl?: string | null;
  hasPhoto: boolean;
  onUpload: (file: AttachmentFileInput) => Promise<void>;
  onRemove: () => Promise<void>;
  isUploading?: boolean;
  isRemoving?: boolean;
  isLoadingUrl?: boolean;
  errorMessage?: string | null;
}

async function pickImage(): Promise<AttachmentFileInput | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) {
    throw new Error('Photo library access is required to add a vehicle photo.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.9,
  });

  if (result.canceled || !result.assets?.[0]) {
    return null;
  }

  const asset = result.assets[0];
  const webFile = Platform.OS === 'web' ? asset.file : undefined;
  const size = webFile?.size ?? asset.fileSize ?? 0;
  const mimeType = webFile?.type || asset.mimeType || 'image/jpeg';
  const name = webFile?.name || asset.fileName || `vehicle-cover-${Date.now()}.jpg`;

  return Platform.OS === 'web'
    ? {
        name,
        mimeType,
        size,
        webFile,
      }
    : {
        name,
        mimeType,
        size,
        uri: asset.uri,
      };
}

/** Reusable cover-photo card supporting Add, Change, and Remove, with private signed-URL display. */
export function VehicleCoverPhoto({
  signedUrl,
  hasPhoto,
  onUpload,
  onRemove,
  isUploading = false,
  isRemoving = false,
  isLoadingUrl = false,
  errorMessage,
}: VehicleCoverPhotoProps) {
  const [localError, setLocalError] = useState<string | null>(null);
  const busy = isUploading || isRemoving;

  const handlePick = async () => {
    setLocalError(null);
    try {
      const file = await pickImage();
      if (!file) return;
      await onUpload(file);
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Unable to select a photo.');
    }
  };

  const handleRemove = async () => {
    setLocalError(null);
    try {
      await onRemove();
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Unable to remove the photo.');
    }
  };

  const combinedError = localError || errorMessage;

  return (
    <View className="mb-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={hasPhoto ? 'Vehicle cover photo' : 'Add vehicle cover photo'}
        onPress={handlePick}
        disabled={busy}
        className="h-52 w-full overflow-hidden rounded-xl border border-wrnc-border bg-[#111827]"
      >
        {hasPhoto && signedUrl ? (
          <Image
            source={{ uri: signedUrl }}
            accessible={false}
            resizeMode="cover"
            className="h-full w-full"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-[#111827]">
            <Text className="text-sm text-wrnc-text-secondary">
              {hasPhoto && isLoadingUrl ? 'Loading photo…' : 'No photo'}
            </Text>
          </View>
        )}
      </Pressable>

      <View className="mt-3 flex-row gap-3">
        <Button
          label={hasPhoto ? 'Change Photo' : 'Add Photo'}
          variant="secondary"
          onPress={handlePick}
          loading={isUploading}
          disabled={busy}
        />
        {hasPhoto ? (
          <Button label="Remove Photo" variant="danger" onPress={handleRemove} loading={isRemoving} disabled={busy} />
        ) : null}
      </View>

      {combinedError ? <Text className="mt-2 text-sm text-semantic-error">{combinedError}</Text> : null}
    </View>
  );
}

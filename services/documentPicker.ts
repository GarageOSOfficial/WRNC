import * as DocumentPicker from 'expo-document-picker';
import type { PickedDocumentFile } from './documentStorage';

export async function pickVehicleDocument(): Promise<PickedDocumentFile | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'],
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name,
    mimeType: asset.mimeType || 'application/octet-stream',
    size: asset.size || 0,
  };
}

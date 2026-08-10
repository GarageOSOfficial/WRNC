import React from 'react';
import { Text, View } from 'react-native';

export function DocumentEmptyState() {
  return (
    <View className="items-center justify-center rounded-lg border border-dashed border-wrnc-border bg-wrnc-background p-8">
      <Text className="text-center text-base font-semibold text-wrnc-text-secondary">No documents yet</Text>
      <Text className="mt-2 text-center text-sm text-wrnc-text-secondary">Upload documentation to keep vehicle records organized.</Text>
    </View>
  );
}

import React from 'react';
import { Text, View } from 'react-native';

export function DocumentEmptyState() {
  return (
    <View className="items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 p-8">
      <Text className="text-center text-base font-semibold text-gray-700">No documents yet</Text>
      <Text className="mt-2 text-center text-sm text-gray-500">Upload documentation to keep vehicle records organized.</Text>
    </View>
  );
}

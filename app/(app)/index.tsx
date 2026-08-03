import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';

const queryClient = new QueryClient();

export default function MissionControlScreen() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
        <View className="flex-1">
          <VehicleWorkspaceShell />
        </View>
      </SafeAreaView>
    </QueryClientProvider>
  );
}

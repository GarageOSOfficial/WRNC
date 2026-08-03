import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';

export default function MissionControlScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" />
      <View className="flex-1">
        <VehicleWorkspaceShell />
      </View>
    </SafeAreaView>
  );
}

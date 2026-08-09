import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { VehicleWorkspaceShell } from '../components/workspace/VehicleWorkspaceShell';

/** Native fallback for the root route; web resolves to index.web.tsx. */
export default function MissionControlScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <VehicleWorkspaceShell />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F9FAFB',
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

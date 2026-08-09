import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from 'react-native';
import { VehicleWorkspaceShell } from '../../components/workspace/VehicleWorkspaceShell';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

/** Protected WRNC product workspace for authenticated members. */
export default function WorkspaceScreen() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      router.replace('/login');
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;

      if (!data.session) {
        router.replace('/login');
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isCheckingSession) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.loading}>
          <ActivityIndicator color="#FF6400" />
        </View>
      </SafeAreaView>
    );
  }

  return <VehicleWorkspaceShell />;
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F9FAFB', flex: 1 },
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
});

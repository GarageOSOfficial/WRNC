import React, { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';

const queryClient = new QueryClient();

export default function AppLayout() {
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      router.replace('/login');
      return;
    }

    let isMounted = true;

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) return;

      if (error || !data.session) {
        router.replace('/login');
        return;
      }

      setIsCheckingSession(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;

      if (!session) {
        setIsCheckingSession(true);
        router.replace('/login');
        return;
      }

      setIsCheckingSession(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      {isCheckingSession ? (
        <SafeAreaView style={styles.screen}>
          <View style={styles.loading}>
            <ActivityIndicator color="#FF6400" />
            <Text style={styles.loadingLabel}>Loading your workspace…</Text>
          </View>
        </SafeAreaView>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#080808', flex: 1 },
  loading: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  loadingLabel: { color: '#C0C0C0', marginTop: 12 },
});

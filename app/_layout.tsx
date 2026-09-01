import { useEffect, useState } from 'react';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';

export const MINIMUM_SPLASH_DURATION_MS = 2000;

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [minimumHoldComplete, setMinimumHoldComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMinimumHoldComplete(true), MINIMUM_SPLASH_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!minimumHoldComplete) return;
    void SplashScreen.hideAsync();
  }, [minimumHoldComplete]);

  if (!minimumHoldComplete) return null;
  return <Slot />;
}

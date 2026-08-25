import React from 'react';
import { Redirect } from 'expo-router';

/** Native fallback required by Expo Router for the web-only campaign route. */
export default function ComingSoonNativeFallback() {
  return <Redirect href="/" />;
}

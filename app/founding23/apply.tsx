import React from 'react';
import { Redirect } from 'expo-router';

/** Native fallback required by Expo Router for the web-only application route. */
export default function Founding23ApplyNativeFallback() {
  return <Redirect href="/" />;
}

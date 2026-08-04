import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Indicates whether Supabase has been configured.
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey;

/**
 * Always create a client so the application shell can start.
 * If configuration is missing, use harmless placeholder values.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);

if (__DEV__ && !isSupabaseConfigured) {
  console.warn(`
=========================================================
WRNC DEVELOPMENT WARNING

Supabase has not been configured.

Create a ".env" file from ".env.example" and provide:

  EXPO_PUBLIC_SUPABASE_URL
  EXPO_PUBLIC_SUPABASE_ANON_KEY

The application will continue running with a placeholder
Supabase client until valid credentials are provided.

=========================================================
`);
}

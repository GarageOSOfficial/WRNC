import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Indicates whether Supabase has been configured.
 */
export const isSupabaseConfigured =
  !!supabaseUrl &&
  !!supabaseAnonKey;

const usesPublishableKey = supabaseAnonKey?.startsWith('sb_publishable_') ?? false;

/**
 * Supabase publishable keys belong in the `apikey` header only. The SDK also
 * initializes an Authorization header for legacy JWT anon keys, so remove that
 * duplicate bearer value for the newer key format.
 */
const fetchWithPublishableKey = async (...args: Parameters<typeof fetch>) => {
  const [url, options] = args;

  if (!usesPublishableKey || !options?.headers) {
    return fetch(...args);
  }

  const headers = new Headers(options.headers);

  if (headers.get('Authorization') === `Bearer ${supabaseAnonKey}`) {
    headers.delete('Authorization');
  }

  return fetch(url, { ...options, headers });
};

/**
 * Always create a client so the application shell can start.
 * If configuration is missing, use harmless placeholder values.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder-anon-key',
  {
    auth: {
      ...(Platform.OS === 'web' ? {} : { storage: AsyncStorage }),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
    global: {
      fetch: fetchWithPublishableKey,
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

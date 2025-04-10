import { createBrowserClient } from '@supabase/ssr';

// Create a single instance of the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Use createBrowserClient for client-side operations
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
);

export function isSupabaseConfigured() {
  return !!supabaseUrl && !!supabaseAnonKey;
}
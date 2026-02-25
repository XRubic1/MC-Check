import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const hasConfig = !!(supabaseUrl && supabaseAnonKey);
if (!hasConfig) {
  console.warn(
    'MC-Check: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in .env for database features.'
  );
} else {
  console.debug('[MC-Check] Supabase config present (URL length:', supabaseUrl.length, ')');
}

/**
 * Supabase client for MC-Check. Use env vars for URL and anon key.
 * Typed at the app layer via MCVerification / MCVerificationInsert.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

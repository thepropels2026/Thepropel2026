// Import the Supabase client creation utility
import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase configuration (URL and Anonymous Key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Initialize and export the Supabase client for use in the admin portal
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

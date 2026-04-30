// Import the Supabase client creation utility
import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase configuration
// Falls back to placeholder values if variables are not defined in .env
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Initialize and export the Supabase client for use throughout the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

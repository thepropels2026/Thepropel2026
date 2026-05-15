// Import the Supabase client creation utility
import { createClient } from '@supabase/supabase-js';

// Retrieve environment variables for Supabase configuration
// Falls back to placeholder values if variables are not defined in .env
// Initialize Supabase URL and Anon Key from environment variables
// These must be prefixed with NEXT_PUBLIC_ to be available in the browser
// Initialize Supabase URL and Anon Key from environment variables
// These must be prefixed with NEXT_PUBLIC_ to be available in the browser
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjwadwxwnwkbcfndvnfy.supabase.co';
const supabaseUrl = rawUrl.trim().replace(/\/$/, ''); 
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qd2Fkd3h3bndrYmNmbmR2bmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDg3MzYsImV4cCI6MjA5Mjg4NDczNn0.p4gTvhvl2KEhN6fcUXL64VCa1oCcJ6eV-e0s2n8HLt0').trim();

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("[WARN] Supabase credentials missing. Check .env.local");
}

console.log("[DEBUG] Supabase Client Initialized with URL:", supabaseUrl);

// Initialize and export the Supabase client for use throughout the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

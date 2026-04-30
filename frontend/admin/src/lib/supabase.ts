import { createClient } from '@supabase/supabase-js';

// Clean the URL to ensure no trailing slashes or extra paths
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjwadwxwnwkbcfndvnfy.supabase.co';
const supabaseUrl = rawUrl.replace(/\/$/, '').replace(/\/rest\/v1$/, '');
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qd2Fkd3h3bndrYmNmbmR2bmY5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDg3MzYsImV4cCI6MjA5Mjg4NDczNn0.p4gTvhvl2KEhN6fcUXL64VCa1oCcJ6eV-e0s2n8HLt0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

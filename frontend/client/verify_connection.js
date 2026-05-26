const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local to avoid dependency issues
let envUrl = '';
let envAnon = '';
let envService = '';

try {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const parts = line.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') envUrl = val;
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') envAnon = val;
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') envService = val;
      }
    });
  }
} catch (e) {
  console.log("Could not parse .env.local file:", e.message);
}

const supabaseUrl = envUrl || 'https://mjwadwxwnwkbcfndvnfy.supabase.co';
const anonKey = envAnon || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qd2Fkd3h3bndrYmNmbmR2bmZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczMDg3MzYsImV4cCI6MjA5Mjg4NDczNn0.p4gTvhvl2KEhN6fcUXL64VCa1oCcJ6eV-e0s2n8HLt0';
const serviceKey = envService;

async function checkConnection() {
  console.log("=== SUPABASE DATABASE CONNECTION DIAGNOSTICS ===");
  console.log("Supabase URL:", supabaseUrl);
  console.log("Anon Key present:", anonKey ? "Yes" : "No");
  console.log("Service Role Key present:", serviceKey ? "Yes" : "No");
  
  if (serviceKey) {
    console.log("\n--- Testing write using Service Role Key (Admin Proxy mode) ---");
    const supabaseAdmin = createClient(supabaseUrl, serviceKey);
    const { data, error } = await supabaseAdmin
      .from('tools_cards')
      .insert([{
        title: 'Test Tool (Admin Connection Verification)',
        description: 'Verifying admin connection',
        image_url: 'https://example.com/test.png',
        redirect_link: 'https://example.com',
        category: 'Productivity',
        price: 0
      }])
      .select();

    if (error) {
      console.error("❌ Service Role Key Write Failed:", error.message);
    } else {
      console.log("✅ Service Role Key Write Succeeded! Created row ID:", data[0].id);
      
      // Clean up the test row
      const { error: delError } = await supabaseAdmin
        .from('tools_cards')
        .delete()
        .eq('id', data[0].id);
      if (delError) console.error("Could not clean up test row:", delError.message);
      else console.log("🧹 Cleaned up the test row successfully.");
    }
  } else {
    console.log("\n⚠️ Service Role Key is NOT configured in .env.local.");
    console.log("--- Testing write using public Anon Key (Checking if RLS is disabled) ---");
    if (!anonKey) {
      console.error("❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing from .env.local.");
      return;
    }
    
    const supabasePublic = createClient(supabaseUrl, anonKey);
    const { data, error } = await supabasePublic
      .from('tools_cards')
      .insert([{
        title: 'Test Tool (Anon Connection Verification)',
        description: 'Checking if RLS is disabled',
        image_url: 'https://example.com/test.png',
        redirect_link: 'https://example.com',
        category: 'Productivity',
        price: 0
      }])
      .select();

    if (error) {
      console.log("❌ Anon Key Write Blocked (RLS is active):", error.message);
      console.log("\n👉 RECOMMENDATION:");
      console.log("To resolve this, please choose one of the following options:");
      console.log("1. Add SUPABASE_SERVICE_ROLE_KEY to your frontend/client/.env.local and production hosting variables.");
      console.log("2. OR, open your Supabase SQL Editor and run the SQL queries to DISABLE ROW LEVEL SECURITY (RLS) on your tables.");
    } else {
      console.log("✅ Anon Key Write Succeeded! Row Level Security (RLS) is disabled or open. Created row ID:", data[0].id);
      
      // Clean up
      const { error: delError } = await supabasePublic
        .from('tools_cards')
        .delete()
        .eq('id', data[0].id);
      if (delError) console.error("Could not clean up test row:", delError.message);
      else console.log("🧹 Cleaned up the test row successfully.");
    }
  }
}

checkConnection().catch(console.error);

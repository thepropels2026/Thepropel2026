import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the SERVICE ROLE KEY for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjwadwxwnwkbcfndvnfy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { table, action, data, match } = body;
    
    // Basic security check - in production, verify an admin session token here
    const adminSession = request.headers.get('x-admin-session');
    if (adminSession !== 'sushantsharma2805@gmail.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let result;

    if (action === 'insert') {
      result = await adminSupabase.from(table).insert(data).select();
    } else if (action === 'update') {
      let query = adminSupabase.from(table).update(data);
      if (match) {
        Object.keys(match).forEach(key => {
          query = query.eq(key, match[key]);
        });
      }
      result = await query.select();
    } else if (action === 'delete') {
      let query = adminSupabase.from(table).delete();
      if (match) {
        Object.keys(match).forEach(key => {
          query = query.eq(key, match[key]);
        });
      }
      result = await query.select();
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (result.error) {
      throw result.error;
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Admin DB Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

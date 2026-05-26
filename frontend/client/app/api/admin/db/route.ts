import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Url
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjwadwxwnwkbcfndvnfy.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase admin client
const adminSupabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function POST(request: Request) {
  try {
    // Check if key is available
    if (!supabaseServiceKey) {
      return NextResponse.json({ 
        error: 'Database Configuration Error: No Supabase API key configured.' 
      }, { status: 500 });
    }

    const body = await request.json();
    const { table, action, data, match } = body;
    
    // Basic security check - verify the admin session email
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

    // Validate that the operation affected/returned at least one row
    if (!result.data || result.data.length === 0) {
      return NextResponse.json({ 
        error: `Database mutation verification failed: The ${action} operation completed successfully but affected 0 rows. This can happen if the record is missing or if database policies prevent this change.` 
      }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error: any) {
    console.error("Admin DB Proxy Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



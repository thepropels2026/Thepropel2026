-- ==========================================================
-- NETWORKING & PROFILE SYSTEM
-- Run this in Supabase SQL Editor
-- ==========================================================

-- Enhanced Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  designation TEXT,
  company TEXT,
  location TEXT,
  education TEXT,
  skills TEXT, -- Comma separated or JSONB
  interests TEXT,
  bio TEXT,
  picture TEXT, -- URL to storage or avatar
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connections Table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_email TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sender_email, receiver_email)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.jwt() ->> 'email' = email);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.jwt() ->> 'email' = email);

-- Policies for Connections
CREATE POLICY "Users can see their own connections" ON connections FOR SELECT USING (
  auth.jwt() ->> 'email' = sender_email OR auth.jwt() ->> 'email' = receiver_email
);
CREATE POLICY "Users can send connection requests" ON connections FOR INSERT WITH CHECK (
  auth.jwt() ->> 'email' = sender_email
);
CREATE POLICY "Users can respond to connection requests" ON connections FOR UPDATE USING (
  auth.jwt() ->> 'email' = receiver_email
);

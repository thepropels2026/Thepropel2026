-- ==========================================================
-- USER EXTENDED DATA
-- Run this in Supabase SQL Editor
-- ==========================================================

-- Table to link users to their purchased tools
CREATE TABLE IF NOT EXISTS user_tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  tool_id UUID REFERENCES tools_cards(id),
  purchased_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table to track user subscription progress
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL UNIQUE,
  plan_id UUID REFERENCES pricing_plans(id),
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'canceled'
  progress_percent INT DEFAULT 0,
  current_module TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE user_tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Allow users to see only their own data
CREATE POLICY "Users can view own tools" ON user_tools FOR SELECT USING (user_email = auth.jwt() ->> 'email');
CREATE POLICY "Users can view own subscription" ON user_subscriptions FOR SELECT USING (user_email = auth.jwt() ->> 'email');

-- For simplicity in this demo (since we are using local storage for mock auth)
-- we will allow public read for now or just handle it via the client
-- In production, proper auth.uid() checks should be used.

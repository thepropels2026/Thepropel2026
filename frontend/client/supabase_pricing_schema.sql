-- ==========================================================
-- PRICING PLANS TABLE
-- Run this in Supabase SQL Editor to create the table
-- ==========================================================

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_key TEXT NOT NULL UNIQUE,        -- 'individual' | 'teams' | 'campus'
  title TEXT NOT NULL,                  -- "The Propels for Individual"
  subtitle TEXT NOT NULL,               -- Short one-liner
  price TEXT NOT NULL,                  -- "₹4,999" or "Custom"
  price_period TEXT DEFAULT '/year',    -- "/year", "/month", "contact us"
  badge TEXT,                           -- "Most Popular", "Best Value", null
  badge_color TEXT DEFAULT 'orange',    -- 'orange' | 'white' | 'slate'
  features JSONB NOT NULL DEFAULT '[]', -- ["Feature 1", "Feature 2", ...]
  cta_label TEXT NOT NULL DEFAULT 'Get Started',
  cta_link TEXT DEFAULT '/register',
  is_highlighted BOOLEAN DEFAULT FALSE, -- true = accent card (center)
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;

-- Allow public read
CREATE POLICY "public read pricing_plans"
  ON pricing_plans FOR SELECT USING (TRUE);

-- Allow admin write (service role / authenticated)
CREATE POLICY "admin write pricing_plans"
  ON pricing_plans FOR ALL USING (auth.role() = 'authenticated');

-- Seed default data
INSERT INTO pricing_plans (plan_key, title, subtitle, price, price_period, badge, badge_color, features, cta_label, cta_link, is_highlighted, sort_order)
VALUES
  (
    'individual',
    'The Propels for Individual',
    'For solo founders & students ready to build',
    '₹4,999',
    '/year',
    NULL,
    'slate',
    '["1-on-1 Mentor Sessions (4/month)", "AI Idea Evaluator Access", "Market Research Toolkit", "Startup Modules Library (250+)", "Investor Network Directory", "Community Forum Access", "Email Support"]'::jsonb,
    'Start Building',
    '/register',
    FALSE,
    1
  ),
  (
    'teams',
    'The Propels for Teams',
    'For early-stage startups & founding teams',
    '₹14,999',
    '/year',
    'Most Popular',
    'orange',
    '["Everything in Individual", "Up to 5 Team Members", "Group Mentor Sessions (8/month)", "Priority Investor Introductions", "Demo Day Access", "Legal & HR Network Access", "Dedicated Success Manager", "Slack Community Access"]'::jsonb,
    'Scale Your Team',
    '/register',
    TRUE,
    2
  ),
  (
    'campus',
    'The Propels for Campus',
    'For colleges & institutional partnerships',
    'Custom',
    'contact us',
    'For Institutions',
    'slate',
    '["Everything in Teams", "Unlimited Student Licenses", "Campus Entrepreneurship Cell Setup", "Curriculum Integration Support", "Annual Hackathon Sponsorship", "Guest Lecture Series", "Placement & Funding Pipeline", "White-label Portal"]'::jsonb,
    'Contact Us',
    'mailto:support@thepropels.com',
    FALSE,
    3
  );

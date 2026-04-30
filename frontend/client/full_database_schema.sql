-- ==========================================
-- THE PROPELS - COMPREHENSIVE SUPABASE SCHEMA
-- ==========================================
-- Run this in your Supabase SQL Editor to set up all required tables.

-- 1. PROFILES (Network Page)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL, -- email or phone number
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    picture TEXT,
    designation TEXT NOT NULL,
    company TEXT NOT NULL,
    education TEXT NOT NULL,
    skills TEXT NOT NULL,
    interests TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. JOB POSTINGS (Careers Page)
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. APPLICATIONS (Careers Page submissions)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    resume_url TEXT,
    photo_url TEXT,
    linkedin_url TEXT,
    cover_letter TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 4. SUCCESS STORIES (Stories Page)
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    founder_name TEXT NOT NULL,
    startup_name TEXT NOT NULL,
    niche TEXT NOT NULL,
    metric TEXT NOT NULL,
    metric_label TEXT NOT NULL,
    summary TEXT NOT NULL,
    avatar_url TEXT NOT NULL,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL, -- 'image' or 'video'
    roadmap JSONB DEFAULT '[]', -- JSON array of milestones
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 5. TOOLS CARDS (Startup Tools Page)
CREATE TABLE IF NOT EXISTS public.tools_cards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    redirect_link TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ==========================================
-- STORAGE BUCKETS
-- ==========================================
-- Run these one by one or ensure storage schema exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications', 'applications', true)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- RLS POLICIES (BASIC PUBLIC ACCESS)
-- ==========================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.profiles FOR INSERT WITH CHECK (true);

-- Job Postings
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.job_postings FOR SELECT USING (true);

-- Applications
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read" ON public.applications FOR SELECT USING (true);

-- Success Stories
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.success_stories FOR SELECT USING (true);
CREATE POLICY "Allow admin insert" ON public.success_stories FOR INSERT WITH CHECK (true);

-- Tools
ALTER TABLE public.tools_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.tools_cards FOR SELECT USING (true);

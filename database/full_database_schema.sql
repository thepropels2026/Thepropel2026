-- FULL DATABASE SCHEMA FOR THE PROPELS
-- Run this in your Supabase SQL Editor

-- 1. Profiles (for Network page)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    identifier TEXT NOT NULL UNIQUE,
    designation TEXT,
    company TEXT,
    education TEXT,
    skills TEXT,
    interests TEXT,
    picture TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Job Postings (for Careers page)
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Applications (for Job Submissions)
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.job_postings(id),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT,
    linkedin_url TEXT,
    cover_letter TEXT,
    resume_url TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Success Stories
CREATE TABLE IF NOT EXISTS public.success_stories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    industry TEXT NOT NULL,
    summary TEXT NOT NULL,
    main_image TEXT,
    content_json JSONB, -- For the detailed roadmap and sections
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Policies for Profiles
CREATE POLICY "Public Read Profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Public Insert Profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Policies for Job Postings
CREATE POLICY "Public Read Jobs" ON public.job_postings FOR SELECT USING (is_active = true);

-- Policies for Applications
CREATE POLICY "Public Insert Applications" ON public.applications FOR INSERT WITH CHECK (true);

-- Policies for Success Stories
CREATE POLICY "Public Read Stories" ON public.success_stories FOR SELECT USING (true);

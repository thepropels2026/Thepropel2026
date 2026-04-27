-- UPDATED SCHEMA FOR APPLICATIONS TABLE
-- This includes fields for resume and photo uploads

-- 1. Create the applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    linkedin_url TEXT,
    cover_letter TEXT,
    resume_url TEXT, -- URL to the file in Supabase Storage
    photo_url TEXT,  -- URL to the file in Supabase Storage
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone to insert (public submissions)
CREATE POLICY "Enable insert for everyone" ON public.applications FOR INSERT WITH CHECK (true);

-- 4. Policy: Allow authenticated users (admin) to read
CREATE POLICY "Enable read for authenticated users" ON public.applications FOR SELECT USING (auth.role() = 'authenticated');

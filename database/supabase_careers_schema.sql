-- Supabase Schema for Careers Page
-- Run this in your Supabase SQL Editor

-- 1. Table for Job Postings
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

-- 2. Table for Job Applications
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Policies for Job Postings
-- Allow public to read active jobs
CREATE POLICY "Allow public read access to active jobs" 
ON public.job_postings 
FOR SELECT 
USING (is_active = true);

-- Policies for Applications
-- Allow public to insert applications
CREATE POLICY "Allow public insert access to applications" 
ON public.applications 
FOR INSERT 
WITH CHECK (true);

-- Optional: Allow authenticated users (admin) to read applications
CREATE POLICY "Allow authenticated read access to applications" 
ON public.applications 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Insert some dummy jobs to get started
INSERT INTO public.job_postings (title, department, location, description, requirements)
VALUES 
('Senior Frontend Engineer', 'Engineering', 'Remote (India)', 'We are looking for a Senior Frontend Engineer to lead the development of our core web platform using React and Next.js.', '5+ years of React experience. Strong understanding of Next.js, Tailwind CSS, and performance optimization.'),
('Venture Associate', 'Investments', 'Gurugram, HR', 'Join our investment team to source, evaluate, and support early-stage startups.', 'MBA or equivalent experience. 2+ years in VC, private equity, or a high-growth startup.'),
('Growth Marketing Manager', 'Marketing', 'Remote', 'Lead our user acquisition strategy and scale our founder ecosystem.', '3+ years in growth marketing for a tech startup or agency. Data-driven mindset with strong copywriting skills.');

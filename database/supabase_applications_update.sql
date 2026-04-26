-- Run this in your Supabase SQL Editor

-- 1. Add new columns to the applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS linkedin_url TEXT,
ADD COLUMN IF NOT EXISTS cover_letter TEXT;

-- 2. Create the Storage Bucket for applications
-- Note: Make sure the 'storage' schema exists in your Supabase project (it usually does by default)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('applications', 'applications', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Set up Storage Policies
-- Allow anyone to upload to the applications bucket
CREATE POLICY "Allow public uploads"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'applications' );

-- Allow public read access (Required if you want admins to easily view files via URLs without signed tokens)
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT
USING ( bucket_id = 'applications' );

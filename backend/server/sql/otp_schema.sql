-- Run this in your Supabase SQL Editor

CREATE TABLE public.otps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    identifier TEXT NOT NULL, -- Email or mobile
    otp_hash TEXT NOT NULL,
    otp_expiry TIMESTAMP WITH TIME ZONE NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Index for faster lookups
CREATE INDEX idx_otps_identifier ON public.otps(identifier);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;

-- Allow public read/insert access for the otps table during backend verification
CREATE POLICY "Allow public read access" ON public.otps FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.otps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.otps FOR UPDATE USING (true);

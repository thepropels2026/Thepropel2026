-- Run this in your Supabase SQL Editor

CREATE TABLE public.profiles (
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

-- Enable RLS (Row Level Security) if you plan on restricting access
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to profiles (since we want them visible on network page)
CREATE POLICY "Allow public read access" ON public.profiles FOR SELECT USING (true);

-- Allow public insert access for registration (Note: In production you'd want to link this to auth.users)
CREATE POLICY "Allow public insert access" ON public.profiles FOR INSERT WITH CHECK (true);

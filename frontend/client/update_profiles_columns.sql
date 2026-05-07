-- Update profiles table to include all registration fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dob DATE,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS mobile TEXT;

-- Update RLS policies to be more secure while allowing initial registration
DROP POLICY IF EXISTS "Allow public read" ON public.profiles;
DROP POLICY IF EXISTS "Allow public insert" ON public.profiles;

CREATE POLICY "Allow public read all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow authenticated users to insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Allow initial registration" ON public.profiles FOR INSERT WITH CHECK (true);

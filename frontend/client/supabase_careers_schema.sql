-- Run this in your Supabase SQL Editor to setup the Career Portal

-- 1. Create Job Postings Table
CREATE TABLE public.job_postings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Allow public read access to job postings
CREATE POLICY "Allow public read access on job_postings" ON public.job_postings FOR SELECT USING (true);


-- 2. Create Applications Table
CREATE TABLE public.applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES public.job_postings(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    experience TEXT NOT NULL,
    resume_url TEXT,
    photo_url TEXT,
    status TEXT DEFAULT 'pending', -- pending, reviewed, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Allow public insert access for submitting applications
CREATE POLICY "Allow public insert access on applications" ON public.applications FOR INSERT WITH CHECK (true);
-- (Optional) If you want applicants to see their own applications, you would link this to auth.users.
-- For an admin dashboard, the admin role will bypass RLS or you create a policy for admins.


-- 3. Insert Dummy Data (So the job board isn't empty)
INSERT INTO public.job_postings (title, department, location, description, requirements) VALUES 
('Senior Frontend Engineer', 'Engineering', 'Remote (India)', 'We are looking for a Senior Frontend Engineer to lead the development of our core web platform using React and Next.js. You will work closely with design and product teams to deliver a world-class user experience.', '5+ years of React experience. Strong understanding of Next.js, Tailwind CSS, and performance optimization. Experience with Framer Motion is a plus.'),
('Venture Associate', 'Investments', 'Gurugram, HR', 'Join our investment team to source, evaluate, and support early-stage startups. You will conduct market research, due diligence, and help portfolio companies scale.', 'MBA or equivalent experience. 2+ years in VC, private equity, or a high-growth startup. Strong analytical and networking skills.'),
('Growth Marketing Manager', 'Marketing', 'Remote', 'Lead our user acquisition strategy and scale our founder ecosystem. You will run multi-channel campaigns across social media, email, and paid ads.', '3+ years in growth marketing for a tech startup or agency. Proven track record of scaling user bases and optimizing CAC.');

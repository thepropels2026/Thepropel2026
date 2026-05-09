-- THE PROPELS: LMS & KNOWLEDGE BASE SCHEMA
-- Run this in your Supabase SQL Editor

-- 1. COURSE MODULES (Individual lessons within a course)
CREATE TABLE IF NOT EXISTS public.course_modules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    content_url TEXT, -- URL to video or document
    content_type TEXT DEFAULT 'video', -- video, pdf, doc
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. USER COURSE PROGRESS (Track completion of modules)
CREATE TABLE IF NOT EXISTS public.user_course_progress (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    module_id UUID REFERENCES public.course_modules(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, module_id) -- A user can complete a module only once
);

-- 3. ENRICH KNOWLEDGE BASE
-- Ensure download_link is present and add metadata
ALTER TABLE public.knowledge_base ADD COLUMN IF NOT EXISTS file_type TEXT DEFAULT 'pdf';
ALTER TABLE public.knowledge_base ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Template';

-- 4. RLS POLICIES
-- Modules: Public read (or authenticated if you prefer)
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read modules" ON public.course_modules FOR SELECT USING (true);

-- Progress: Users can only see/update their own progress
ALTER TABLE public.user_course_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own progress" ON public.user_course_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own progress" ON public.user_course_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Knowledge Base: Public read
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read kb" ON public.knowledge_base FOR SELECT USING (true);

-- 5. STORAGE BUCKETS
-- Run these to ensure buckets exist (Note: Storage might need manual setup in dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('course-content', 'course-content', true) ON CONFLICT (id) DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('kb-documents', 'kb-documents', true) ON CONFLICT (id) DO NOTHING;

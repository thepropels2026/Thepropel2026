-- 1. USER ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.user_enrollments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    UNIQUE(user_id, course_id)
);

-- 2. RLS POLICIES FOR USER ENROLLMENTS
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own enrollments" 
ON public.user_enrollments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own enrollments" 
ON public.user_enrollments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

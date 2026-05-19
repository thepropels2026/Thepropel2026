-- Run this in your Supabase SQL Editor to enable P2P real-time messaging

CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Enable Row Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create Policies for RLS
CREATE POLICY "Allow users to read their own messages (sent or received)"
    ON public.messages
    FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Allow users to send messages"
    ON public.messages
    FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

-- Enable real-time for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

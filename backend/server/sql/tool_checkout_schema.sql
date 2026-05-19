-- ==========================================================
-- TOOL CHECKOUT SCHEMA
-- Run this in Supabase SQL Editor to create the necessary tables
-- ==========================================================

-- 1. Orders Table (Tracks the Cashfree Payment Session)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    cashfree_order_id TEXT NOT NULL UNIQUE,
    user_email TEXT NOT NULL,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_orders_cashfree_order_id ON public.orders(cashfree_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);

-- 2. Order Items Table (Tracks individual tools purchased in an order)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tool_id UUID NOT NULL, -- References tools_cards table id
    amount NUMERIC NOT NULL,
    assigned_link TEXT, -- Link given to the user
    status TEXT DEFAULT 'pending', -- 'pending' (before dispatch), 'submitted' (credentials emailed successfully)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for testing (Usually these should be locked down to authenticated/service roles)
CREATE POLICY "Allow public select on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on orders" ON public.orders FOR UPDATE USING (true);

CREATE POLICY "Allow public select on order_items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert on order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on order_items" ON public.order_items FOR UPDATE USING (true);

-- CART & ORDERS SCHEMA
-- This schema supports multiple tools in a single checkout session.

-- 1. ORDERS TABLE
-- Tracks the overall status of a purchase.
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_email TEXT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'INR',
    status TEXT DEFAULT 'pending', -- pending, paid, failed, expired
    payment_method TEXT, -- UPI, card, netbanking, etc.
    cashfree_order_id TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. ORDER ITEMS TABLE
-- Links individual tools to an order.
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    tool_id UUID REFERENCES public.tools_cards(id),
    amount DECIMAL(10, 2) NOT NULL,
    assigned_link TEXT, -- The voucher/access link assigned after payment
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS POLICIES

-- Enable RLS on new tables
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders Policies
CREATE POLICY "Allow public insert for orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to view their own orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow service role to update orders" ON public.orders FOR ALL USING (true);

-- Order Items Policies
CREATE POLICY "Allow public insert for order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow users to view their own order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Allow service role to update order items" ON public.order_items FOR ALL USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON public.orders(user_email);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_orders_cashfree_id ON public.orders(cashfree_order_id);

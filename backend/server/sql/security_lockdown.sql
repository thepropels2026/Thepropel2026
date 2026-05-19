-- ==========================================================
-- SECURITY LOCKDOWN SCRIPT
-- Run this in Supabase SQL Editor to secure all tables
-- ==========================================================

-- 1. Orders Table Hardening
-- Remove insecure public write policies
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
DROP POLICY IF EXISTS "Allow public update on orders" ON public.orders;

-- Add secure service_role only policies for write operations
CREATE POLICY "Allow service_role insert on orders" ON public.orders FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service_role update on orders" ON public.orders FOR UPDATE TO service_role USING (true);


-- 2. Order Items Table Hardening
-- Remove insecure public write policies
DROP POLICY IF EXISTS "Allow public insert on order_items" ON public.order_items;
DROP POLICY IF EXISTS "Allow public update on order_items" ON public.order_items;

-- Add secure service_role only policies for write operations
CREATE POLICY "Allow service_role insert on order_items" ON public.order_items FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service_role update on order_items" ON public.order_items FOR UPDATE TO service_role USING (true);


-- 3. OTPs Table Hardening
-- Assuming similar public policies exist on the OTPs table, lock them down
DROP POLICY IF EXISTS "Allow public insert access" ON public.otps;
DROP POLICY IF EXISTS "Allow public update access" ON public.otps;

CREATE POLICY "Allow service_role insert on otps" ON public.otps FOR INSERT TO service_role WITH CHECK (true);
CREATE POLICY "Allow service_role update on otps" ON public.otps FOR UPDATE TO service_role USING (true);


-- 4. Profiles Table Hardening
-- Only allow the user to update their own profile, or service_role to update any profile.
-- (Assumes `id` matches `auth.uid()`)
DROP POLICY IF EXISTS "Allow public update on profiles" ON public.profiles;

CREATE POLICY "Allow user update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow service_role update on profiles" ON public.profiles FOR UPDATE TO service_role USING (true);
CREATE POLICY "Allow service_role insert on profiles" ON public.profiles FOR INSERT TO service_role WITH CHECK (true);

-- Ensure RLS is active on all
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Note: SELECT policies can remain public if needed by the frontend, 
-- but ideally should be restricted to authenticated users or row owners where applicable.

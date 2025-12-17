-- ============================================
-- META CONVERSIONS API - DATABASE MIGRATION
-- ============================================
-- Run this in your Supabase SQL Editor
-- This adds tracking columns needed for Meta matching
-- ============================================

-- 1. Add tracking columns to your LEADS table
-- Replace 'leads' with your actual table name if different
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fbclid TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fbc TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS fbp TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS client_ip INET;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS event_source_url TEXT;

-- 2. Add tracking columns to your USERS table (if separate from leads)
-- Uncomment and modify if needed
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS fbclid TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS fbc TEXT;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS fbp TEXT;

-- 3. Add tracking columns to your ORDERS/PURCHASES table
-- Replace 'orders' with your actual table name
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fbclid TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fbc TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS fbp TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_ip INET;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- 4. Create a meta_events log table (optional but recommended)
-- This helps debug and track all events sent to Meta
CREATE TABLE IF NOT EXISTS meta_events_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    event_name TEXT NOT NULL,
    event_id TEXT,
    user_email TEXT,
    pixel_id TEXT,
    payload JSONB,
    response JSONB,
    status TEXT DEFAULT 'pending'
);

-- Add RLS policy for meta_events_log (admin only)
ALTER TABLE meta_events_log ENABLE ROW LEVEL SECURITY;

-- 5. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_fbclid ON leads(fbclid);
CREATE INDEX IF NOT EXISTS idx_meta_events_log_event_name ON meta_events_log(event_name);
CREATE INDEX IF NOT EXISTS idx_meta_events_log_created_at ON meta_events_log(created_at);

-- ============================================
-- NOTES:
-- - fbclid: Facebook Click ID from URL (?fbclid=xxx)
-- - fbc: Facebook Browser Cookie (_fbc)
-- - fbp: Facebook Pixel Cookie (_fbp)
-- - client_ip: User's IP address for matching
-- - user_agent: Browser info for matching
-- ============================================

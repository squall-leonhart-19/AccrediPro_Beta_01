-- SQL to add LEAD user support fields for Women's Health Mini Diploma
-- Run this in Supabase SQL Editor

-- Create UserType enum if it doesn't exist
DO $$ BEGIN
    CREATE TYPE "UserType" AS ENUM ('LEAD', 'STUDENT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add userType column to User table
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "userType" "UserType" DEFAULT 'STUDENT';

-- Add accessExpiresAt column to User table
ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "accessExpiresAt" TIMESTAMP;

-- Add index for userType lookups
CREATE INDEX IF NOT EXISTS "User_userType_idx" ON "User"("userType");

-- Verify the changes
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'User'
AND column_name IN ('userType', 'accessExpiresAt');

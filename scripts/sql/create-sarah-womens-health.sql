-- Create Sarah Women's Health coach account
-- Run this in Supabase SQL Editor

-- First, hash the password "Admin123!" using bcrypt
-- The hash below is for "Admin123!" (you may need to regenerate if your bcrypt salt differs)
-- Using bcrypt cost factor 10

INSERT INTO "User" (
    id,
    email,
    "firstName",
    "lastName",
    "passwordHash",
    role,
    "userType",
    "isActive",
    bio,
    avatar,
    title,
    "createdAt",
    "updatedAt"
) VALUES (
    gen_random_uuid(),
    'sarah_womenhealth@accredipro-certificate.com',
    'Sarah',
    'Women''s Health',
    '$2b$10$pSGta5wPjh2R29fpvsE3h.Wtt4JkfuQuIkkRM2zOigq83pGfzjVL6', -- Password: Admin123!
    'ADMIN',
    'STUDENT',
    true,
    'I''m Sarah, your personal guide through the Women''s Health & Hormones Mini Diploma! I''ve helped hundreds of women understand their bodies better. Let''s learn together!',
    '/coaches/sarah-coach.webp',
    'Women''s Health Coach',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    "firstName" = EXCLUDED."firstName",
    "lastName" = EXCLUDED."lastName",
    role = EXCLUDED.role,
    bio = EXCLUDED.bio,
    avatar = EXCLUDED.avatar,
    title = EXCLUDED.title,
    "updatedAt" = NOW();

-- Note: You'll need to update the password hash manually or via the app
-- The bcrypt hash above is a placeholder

-- To get the correct hash, you can:
-- 1. Use the app's registration flow
-- 2. Or run: npx ts-node -e "const bcrypt = require('bcrypt'); bcrypt.hash('Admin123!', 10).then(console.log)"

-- Verify the user was created
SELECT id, email, "firstName", "lastName", role, title
FROM "User"
WHERE email = 'sarah_womenhealth@accredipro-certificate.com';

// Run with: NODE_OPTIONS="--import tsx" npx prisma db execute --stdin
// OR: Use the production webhook to trigger enrollment

/**
 * Manual SQL to fix Dec 23 CF users
 * Run this in Supabase SQL editor or via prisma db execute
 */

const USERS = [
    "micfene@hotmail.com",
    "crystalbtlr75@gmail.com",
    "jillcarothers3@gmail.com",
    "cortneygrow@gmail.com",
    "luvwellnesswithin@gmail.com",
    "mistyglandon@gmail.com",
    "natausha21@gmail.com",
    "keapl@yahoo.com",
    "viewenterprises@aol.com",
    "marijalainrobinson@gmail.com",
    "rightpryce@gmail.com",
    "vlgann76@gmail.com",
    "nelsontara05@gmail.com",
    "nickette.surgeon@gmail.com",
    "sarajane777@gmail.com",
    "rosieklee1@hotmail.com",
    "senoruel9@gmail.com",
    "mollylsmith430@gmail.com",
    "cherylkehl@gmail.com",
    "cheryl.kehl@coe22.com",
];

// Generate SQL for enrollments
console.log("-- 1. ENROLLMENTS (run in Supabase SQL editor)");
console.log(`
INSERT INTO "Enrollment" ("id", "userId", "courseId", "status", "progress", "enrolledAt", "createdAt", "updatedAt")
SELECT 
    gen_random_uuid(),
    u.id,
    c.id,
    'ACTIVE',
    0,
    NOW(),
    NOW(),
    NOW()
FROM "User" u
CROSS JOIN "Course" c
WHERE c.slug = 'functional-medicine-complete-certification'
AND u.email IN (${USERS.map(e => `'${e}'`).join(", ")})
AND NOT EXISTS (
    SELECT 1 FROM "Enrollment" e WHERE e."userId" = u.id AND e."courseId" = c.id
);
`);

console.log("\n-- 2. TAGS (run in Supabase SQL editor)");
console.log(`
INSERT INTO "UserTag" ("id", "userId", "tag", "createdAt")
SELECT gen_random_uuid(), u.id, 'clickfunnels_purchase', NOW()
FROM "User" u
WHERE u.email IN (${USERS.map(e => `'${e}'`).join(", ")})
AND NOT EXISTS (SELECT 1 FROM "UserTag" t WHERE t."userId" = u.id AND t.tag = 'clickfunnels_purchase');

INSERT INTO "UserTag" ("id", "userId", "tag", "createdAt")  
SELECT gen_random_uuid(), u.id, 'functional_medicine_complete_certification_purchased', NOW()
FROM "User" u
WHERE u.email IN (${USERS.map(e => `'${e}'`).join(", ")})
AND NOT EXISTS (SELECT 1 FROM "UserTag" t WHERE t."userId" = u.id AND t.tag = 'functional_medicine_complete_certification_purchased');
`);

console.log("\n-- Done! After running SQL, trigger welcome emails via production webhook");

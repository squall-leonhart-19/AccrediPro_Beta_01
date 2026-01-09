require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Coaches - use firstName/lastName (User schema)
const coaches = {
    sarah: { firstName: 'Sarah', lastName: 'Mitchell', avatar: '/coaches/sarah-mitchell.webp', email: 'sarah@accredipro.academy' },
    olivia: { firstName: 'Olivia', lastName: 'Reyes', avatar: '/coaches/olivia-reyes.webp', email: 'olivia@accredipro.academy' },
    luna: { firstName: 'Luna', lastName: 'Sinclair', avatar: '/coaches/luna-sinclair.webp', email: 'luna@accredipro.academy' },
    maya: { firstName: 'Maya', lastName: 'Chen', avatar: '/coaches/maya-chen.webp', email: 'maya@accredipro.academy' },
    emma: { firstName: 'Emma', lastName: 'Thompson', avatar: '/coaches/emma-thompson.webp', email: 'emma@accredipro.academy' },
    bella: { firstName: 'Bella', lastName: 'Martinez', avatar: '/coaches/bella-martinez.webp', email: 'bella@accredipro.academy' },
    sage: { firstName: 'Sage', lastName: 'Hawkins', avatar: '/coaches/sage-hawkins.webp', email: 'sage@accredipro.academy' },
    grace: { firstName: 'Grace', lastName: 'Williams', avatar: '/coaches/grace-williams.webp', email: 'grace@accredipro.academy' },
    rachel: { firstName: 'Rachel', lastName: 'Kim-Davis', avatar: '/coaches/rachel-kim-davis.webp', email: 'rachel@accredipro.academy' }
};

function getCoachForSlug(slug) {
    const s = slug.toLowerCase();

    // Specific matches first
    if (s.includes('pet') || s.includes('animal')) return 'bella';
    if (s.includes('herb')) return 'sage';
    if (s.includes('christian') || s.includes('faith')) return 'grace';
    if (s.includes('lgbtq') || s.includes('affirming')) return 'rachel';
    if (s.includes('grief') || s.includes('trauma') || s.includes('narc') || s.includes('neuro') || s.includes('adhd') || s.includes('autism')) return 'olivia';
    if (s.includes('energy') || s.includes('reiki') || s.includes('spiritual') || s.includes('intimacy') || s.includes('sex')) return 'luna';
    if (s.includes('mindful') || s.includes('eft') || s.includes('tapping') || s.includes('meditation') || s.includes('anxiety')) return 'maya';
    if (s.includes('parent') || s.includes('doula') || s.includes('birth') || s.includes('fertility') || s.includes('postpartum') || s.includes('prenatal')) return 'emma';

    // Default to Sarah for functional medicine, nutrition, hormones, gut health, etc.
    return 'sarah';
}

async function main() {
    console.log('\n=== FIXING COACH ASSIGNMENTS ===\n');

    const coachIds = {};

    // 1. Ensure all coaches exist
    for (const [key, coach] of Object.entries(coaches)) {
        try {
            const existing = await prisma.$queryRaw`SELECT id FROM "User" WHERE email = ${coach.email}`;

            if (existing.length > 0) {
                coachIds[key] = existing[0].id;
                await prisma.$executeRaw`UPDATE "User" SET "firstName" = ${coach.firstName}, "lastName" = ${coach.lastName}, avatar = ${coach.avatar}, role = 'MENTOR' WHERE id = ${existing[0].id}`;
                console.log(`Coach ${key}: ${coachIds[key]} (updated)`);
            } else {
                const newId = require('crypto').randomUUID().replace(/-/g, '').slice(0, 25);
                await prisma.$executeRaw`INSERT INTO "User" (id, email, "firstName", "lastName", avatar, role, "createdAt", "updatedAt") VALUES (${newId}, ${coach.email}, ${coach.firstName}, ${coach.lastName}, ${coach.avatar}, 'MENTOR', NOW(), NOW())`;
                coachIds[key] = newId;
                console.log(`Coach ${key}: ${newId} (created)`);
            }
        } catch (err) {
            console.error(`Error with coach ${key}:`, err.message);
        }
    }

    // 2. Get all courses
    const courses = await prisma.$queryRaw`SELECT id, slug, title FROM "Course"`;
    console.log(`\nTotal courses: ${courses.length}`);

    // 3. Assign coaches based on slug
    let updated = 0;
    const coachCounts = {};

    for (const course of courses) {
        const coachKey = getCoachForSlug(course.slug);
        const coachId = coachIds[coachKey];

        if (coachId) {
            await prisma.$executeRaw`UPDATE "Course" SET "coachId" = ${coachId} WHERE id = ${course.id}`;
            coachCounts[coachKey] = (coachCounts[coachKey] || 0) + 1;
            updated++;
        }
    }

    console.log('\n=== COACH ASSIGNMENTS ===');
    for (const [coach, count] of Object.entries(coachCounts).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${coaches[coach].firstName} ${coaches[coach].lastName}: ${count} courses`);
    }
    console.log(`\nTotal updated: ${updated}`);

    // 4. Sample output
    const sample = await prisma.$queryRaw`
        SELECT c.title, u."firstName", u."lastName"
        FROM "Course" c 
        LEFT JOIN "User" u ON c."coachId" = u.id 
        ORDER BY RANDOM()
        LIMIT 8
    `;
    console.log('\nSample courses with coaches:');
    sample.forEach(c => console.log(`  - ${c.title.substring(0, 45)}... → ${c.firstName} ${c.lastName}`));

    await prisma.$disconnect();
    console.log('\n✅ Done!');
}

main().catch(console.error);

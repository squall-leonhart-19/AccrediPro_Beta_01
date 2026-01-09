require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function fixAvatars() {
    console.log('\n=== FIXING COACH AVATARS ===\n');

    const avatars = {
        'sarah@accredipro.academy': '/coaches/sarah-mitchell.webp',
        'olivia@accredipro.academy': '/coaches/olivia-reyes.png',
        'luna@accredipro.academy': '/coaches/luna-sinclair.png',
        'maya@accredipro.academy': '/coaches/maya-chen.png',
        'emma@accredipro.academy': '/coaches/emma-thompson.png',
        'bella@accredipro.academy': '/coaches/bella-martinez.png',
        'sage@accredipro.academy': '/coaches/sage-hawkins.png',
        'grace@accredipro.academy': '/coaches/grace-williams.png',
        'rachel@accredipro.academy': '/coaches/rachel-kim-davis.png'
    };

    for (const [email, avatar] of Object.entries(avatars)) {
        await prisma.$executeRaw`UPDATE "User" SET avatar = ${avatar} WHERE email = ${email}`;
        console.log(`Updated ${email} → ${avatar}`);
    }

    // Verify
    const coaches = await prisma.$queryRaw`
        SELECT "firstName", "lastName", avatar 
        FROM "User" 
        WHERE email LIKE '%@accredipro.academy'
    `;
    console.log('\nVerification:');
    coaches.forEach(c => console.log(`  ${c.firstName} ${c.lastName}: ${c.avatar}`));

    await prisma.$disconnect();
    console.log('\n✅ Done!');
}

fixAvatars().catch(console.error);

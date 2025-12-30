import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
import path from 'path';

// Load env vars
config({ path: path.join(process.cwd(), '.env') });

// Setup Prisma with Adapter similar to src/lib/prisma.ts
// Note: src/lib/prisma.ts uses `new PrismaPg({ connectionString })` which implies it might be a wrapper or specific version. 
// Standard adapter-pg takes a pool. I will try standard way first, if fail, try the other.
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const EXPECTED_TAGS = [
    'fm_pro_practice_path_purchased',
    'fm_pro_master_depth_purchased',
    'fm_pro_advanced_clinical_purchased',
    'clickfunnels_purchase',
    'functional_medicine_complete_certification_purchased'
];

async function main() {
    const email = process.argv[2];
    if (!email) {
        console.error('Please provide an email');
        process.exit(1);
    }

    // Check if tags exist in DB
    console.log('Checking Marketing Tags existence:');
    for (const slug of EXPECTED_TAGS) {
        const tag = await prisma.marketingTag.findUnique({ where: { slug } });
        console.log(`- ${slug}: ${tag ? '✅ Exists' : '❌ MISSING (Create this!)'}`);
    }

    const user = await prisma.user.findFirst({
        where: { email: { equals: email, mode: 'insensitive' } },
        include: {
            marketingTags: { include: { tag: true } },
            progress: true,
            enrollments: true,
        }
    });

    if (!user) {
        console.log(`\nUser ${email} not found`);
        return;
    }

    console.log(`\nUser: ${user.email} (${user.id})`);
    console.log(`Avatar: ${user.avatar ? (user.avatar.length > 100 ? user.avatar.substring(0, 50) + '...' + user.avatar.length + ' chars' : user.avatar) : 'null'}`);
    console.log(`\nUser Tags (${user.marketingTags.length}):`);
    user.marketingTags.forEach(t => console.log(`- ${t.tag.slug}`));

    console.log(`\nEnrollments (${user.enrollments.length}):`);
    user.enrollments.forEach(e => console.log(`- ${e.courseId} (Status: ${e.status})`));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

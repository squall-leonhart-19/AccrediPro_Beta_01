import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
import path from 'path';

// Load env vars
config({ path: path.join(process.cwd(), '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TAGS_TO_CREATE = [
    'fm_pro_practice_path_purchased',
    'fm_pro_master_depth_purchased',
    'fm_pro_advanced_clinical_purchased',
    'clickfunnels_purchase', // Exists but good to ensure
    'functional_medicine_complete_certification_purchased',
    'bounced',
    'suppressed'
];

async function main() {
    console.log('Seeding Marketing Tags...');

    for (const slug of TAGS_TO_CREATE) {
        const name = slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

        // Check if exists
        const existing = await prisma.marketingTag.findUnique({ where: { slug } });

        const isSuppression = slug === 'bounced' || slug === 'suppressed';

        if (existing) {
            console.log(`- ${slug}: ✅ Already exists`);
        } else {
            await prisma.marketingTag.create({
                data: {
                    slug,
                    name: name,
                    category: isSuppression ? 'SUPPRESS' : 'CUSTOM',
                    color: isSuppression ? '#ef4444' : '#3b82f6', // Red for suppress, Blue for others
                    description: isSuppression ? 'Email suppression tag' : 'Imported from ClickFunnels/Previous System'
                }
            });
            console.log(`- ${slug}: ✨ Created`);
        }
    }
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());

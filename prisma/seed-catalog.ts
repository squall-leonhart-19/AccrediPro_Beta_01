import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting Catalog Restructure Seed...');

    // 1. CREATE CATEGORIES (LEVELS)
    console.log('Creating Level Categories...');

    const categories = [
        {
            name: 'Level 1: Core Certifications',
            slug: 'level-1-core',
            description: 'The essential foundations for your functional medicine career.',
            order: 1,
            icon: '🌱',
            color: '#10B981', // Emerald
        },
        {
            name: 'Level 2: Advanced Specializations',
            slug: 'level-2-advanced',
            description: 'Master specific clinical areas like Hormones, Gut Health, and Autoimmune.',
            order: 2,
            icon: '⚡',
            color: '#F59E0B', // Amber
        },
        {
            name: 'Level 3: Business Mastery',
            slug: 'level-3-business',
            description: 'Build your practice, get clients, and scale your income.',
            order: 3,
            icon: '🚀',
            color: '#722F37', // Burgundy
        },
    ];

    for (const cat of categories) {
        await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {
                name: cat.name,
                description: cat.description,
                order: cat.order,
                color: cat.color,
                icon: cat.icon
            },
            create: cat,
        });
    }

    // 2. CREATE TOPIC TAGS (For Filtering)
    console.log('Creating Topic Tags...');

    const topics = [
        { name: "Women's Health", slug: "topic-womens-health" },
        { name: "Gut Health", slug: "topic-gut-health" },
        { name: "Hormones", slug: "topic-hormones" },
        { name: "Autoimmune", slug: "topic-autoimmune" },
        { name: "Herbalism", slug: "topic-herbalism" },
        { name: "Business", slug: "topic-business" },
        { name: "Nutrition", slug: "topic-nutrition" },
    ];

    for (const topic of topics) {
        await prisma.tag.upsert({
            where: { slug: topic.slug },
            update: { name: topic.name },
            create: { name: topic.name, slug: topic.slug },
        });
    }

    // 3. ASSIGN COURSES TO CATEGORIES
    console.log('Assigning Courses to Levels...');

    const level1 = await prisma.category.findUnique({ where: { slug: 'level-1-core' } });
    const level2 = await prisma.category.findUnique({ where: { slug: 'level-2-advanced' } });
    const level3 = await prisma.category.findUnique({ where: { slug: 'level-3-business' } });

    // Assign "Functional Medicine Certification" -> Level 1
    await prisma.course.updateMany({
        where: { slug: 'functional-medicine-certification' },
        data: { categoryId: level1?.id }
    });

    // Assign "Mini Diploma" -> Level 1 (or 2 depending on preference, sticking to 1 as it's a "Certification")
    await prisma.course.updateMany({
        where: { slug: 'functional-medicine-mini-diploma' },
        data: { categoryId: level1?.id }
    });

    console.log('✅ Courses Assigned!');
    console.log('✅ Catalog Restructure Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

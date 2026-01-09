require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function checkAndFixCategories() {
    console.log('\n=== CHECKING CATEGORIES ===\n');

    // Check Gut Health courses
    const gutCourses = await prisma.$queryRaw`
        SELECT c.title, c.slug, cat.name as category 
        FROM "Course" c 
        LEFT JOIN "Category" cat ON c."categoryId" = cat.id 
        WHERE c.slug LIKE '%gut%'
    `;
    console.log('Gut Health courses:');
    gutCourses.forEach(c => console.log(`  - ${c.title} → ${c.category}`));

    // Check all categories
    const categories = await prisma.$queryRaw`SELECT id, name FROM "Category" ORDER BY name`;
    console.log('\nAll categories:');
    categories.forEach(c => console.log(`  - ${c.name}`));

    // Count courses per category
    const categoryCounts = await prisma.$queryRaw`
        SELECT cat.name, COUNT(c.id) as count 
        FROM "Category" cat 
        LEFT JOIN "Course" c ON c."categoryId" = cat.id 
        GROUP BY cat.id, cat.name 
        ORDER BY count DESC
    `;
    console.log('\nCourses per category:');
    categoryCounts.forEach(c => console.log(`  - ${c.name}: ${c.count} courses`));

    await prisma.$disconnect();
}

checkAndFixCategories().catch(console.error);

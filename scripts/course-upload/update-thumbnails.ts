/**
 * Update Course Thumbnails in Database
 * Reads thumbnail mapping and updates Course.thumbnail field
 * 
 * Usage: npx tsx scripts/course-upload/update-thumbnails.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL!;
const IMAGES_DIR = '/Users/pochitino/Desktop/accredipro-lms/Courses_Updated_New_Version/courses_imgs';

interface UpdateResult {
    courseSlug: string;
    success: boolean;
    url?: string;
    error?: string;
}

// Map image filename to course slug
function getCourseSlugsFromImage(filename: string): string[] {
    // Pattern: certified-adaptogen-specialist_l1.webp
    const match = filename.match(/^(.+)_l(\d)\.webp$/);
    if (!match) return [];

    const [, baseName, tierNum] = match;

    // For L1, the course slug has no suffix
    // For L2-L4, the course slug has -l{tier} suffix
    const courseSlug = tierNum === '1'
        ? baseName
        : `${baseName}-l${tierNum}`;

    return [courseSlug];
}

async function main() {
    console.log('🖼️  Starting Thumbnail Database Update');
    console.log('📁 Images:', IMAGES_DIR);
    console.log('');

    // Get all webp files
    const files = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.webp'))
        .sort();

    console.log(`📚 Found ${files.length} thumbnail images`);

    const results: UpdateResult[] = [];
    let updated = 0;
    let notFound = 0;
    let errors = 0;

    for (const file of files) {
        const slugs = getCourseSlugsFromImage(file);

        for (const courseSlug of slugs) {
            const thumbnailUrl = `${R2_PUBLIC_URL}/courses/thumbnails/${courseSlug}.webp`;

            try {
                // Check if course exists
                const course = await prisma.course.findUnique({
                    where: { slug: courseSlug },
                    select: { id: true, title: true },
                });

                if (!course) {
                    console.log(`   ⏭️  ${courseSlug}: Not found in DB`);
                    results.push({
                        courseSlug,
                        success: false,
                        error: 'Course not found',
                    });
                    notFound++;
                    continue;
                }

                // Update thumbnail
                await prisma.course.update({
                    where: { slug: courseSlug },
                    data: { thumbnail: thumbnailUrl },
                });

                console.log(`   ✅ ${courseSlug}`);
                results.push({
                    courseSlug,
                    success: true,
                    url: thumbnailUrl,
                });
                updated++;

            } catch (error) {
                console.log(`   ❌ ${courseSlug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                results.push({
                    courseSlug,
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
                errors++;
            }
        }
    }

    // Summary
    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Thumbnail Update Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  Not Found: ${notFound}`);
    console.log(`❌ Errors: ${errors}`);

    // Save results
    const resultsPath = path.join(__dirname, 'thumbnail-update-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved: ${resultsPath}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

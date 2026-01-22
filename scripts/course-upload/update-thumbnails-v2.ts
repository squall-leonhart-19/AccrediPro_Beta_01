/**
 * Update Course Thumbnails in Database - Fixed Version
 * Uses seed-results.json to get correct course slugs and maps to uploaded images
 * 
 * Usage: npx tsx scripts/course-upload/update-thumbnails-v2.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || 'https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev';
const IMAGES_DIR = '/Users/pochitino/Desktop/accredipro-lms/Courses_Updated_New_Version/courses_imgs';

interface SeedResult {
    courseSlug: string;
    tier: string;
    success: boolean;
}

interface UpdateResult {
    courseSlug: string;
    tier: string;
    success: boolean;
    url?: string;
    error?: string;
}

// Map tier to image filename suffix
const tierToImageSuffix: Record<string, string> = {
    'L1': '_l1',
    'L2': '_l2',
    'L3': '_l3',
    'L4': '_l4',
};

// Find matching image file for a course directory and tier
function findMatchingImage(courseDir: string, tier: string): string | null {
    const suffix = tierToImageSuffix[tier];
    if (!suffix) return null;

    // Try exact match first
    const exactFile = `${courseDir}${suffix}.webp`;
    if (fs.existsSync(path.join(IMAGES_DIR, exactFile))) {
        return exactFile;
    }

    // Try with common name variations (replace hyphens with/without 'and', etc.)
    const files = fs.readdirSync(IMAGES_DIR);
    const normalizedDir = courseDir.toLowerCase()
        .replace(/-and-/g, '-')
        .replace(/-s-/g, '-');

    for (const file of files) {
        if (!file.endsWith(suffix + '.webp')) continue;

        const normalizedFile = file.toLowerCase()
            .replace(suffix + '.webp', '')
            .replace(/-and-/g, '-')
            .replace(/_/g, '-');

        // Match if normalized versions are similar
        if (normalizedFile === normalizedDir ||
            normalizedFile.replace(/-/g, '') === normalizedDir.replace(/-/g, '')) {
            return file;
        }
    }

    return null;
}

// Get image slug from filename (for constructing R2 URL)
function getImageSlugFromFilename(filename: string): string {
    // certified-adaptogen-specialist_l1.webp -> certified-adaptogen-specialist (for L1)
    // certified-adaptogen-specialist_l2.webp -> certified-adaptogen-specialist-l2
    const match = filename.match(/^(.+)_l(\d)\.webp$/);
    if (!match) return '';

    const [, baseName, tierNum] = match;
    return tierNum === '1' ? baseName : `${baseName}-l${tierNum}`;
}

async function main() {
    console.log('🖼️  Starting Thumbnail Database Update (v2)');
    console.log('📁 Images:', IMAGES_DIR);
    console.log('');

    // Read seed results to get course slugs and their directories
    const seedResultsPath = path.join(__dirname, 'seed-results.json');
    const seedResults: SeedResult[] = JSON.parse(fs.readFileSync(seedResultsPath, 'utf-8'));

    // Group by course directory
    const successfulSeeds = seedResults.filter(r => r.success);
    console.log(`📚 Found ${successfulSeeds.length} seeded courses`);

    const results: UpdateResult[] = [];
    let updated = 0;
    let notFound = 0;
    let noImage = 0;

    for (const seed of successfulSeeds) {
        // Extract course directory from slug
        // certified-burnout-recovery-specialist-advanced -> certified-burnout-recovery-specialist
        let courseDir = seed.courseSlug;
        if (seed.tier === 'L2') courseDir = courseDir.replace(/-advanced$/, '');
        if (seed.tier === 'L3') courseDir = courseDir.replace(/-master$/, '');
        if (seed.tier === 'L4') courseDir = courseDir.replace(/-practice$/, '');

        // Find matching image
        const imageFile = findMatchingImage(courseDir, seed.tier);

        if (!imageFile) {
            console.log(`   ⏭️  ${seed.courseSlug}: No matching image`);
            results.push({
                courseSlug: seed.courseSlug,
                tier: seed.tier,
                success: false,
                error: 'No matching image found',
            });
            noImage++;
            continue;
        }

        const imageSlug = getImageSlugFromFilename(imageFile);
        const thumbnailUrl = `${R2_PUBLIC_URL}/courses/thumbnails/${imageSlug}.webp`;

        try {
            // Update thumbnail
            await prisma.course.update({
                where: { slug: seed.courseSlug },
                data: { thumbnail: thumbnailUrl },
            });

            console.log(`   ✅ ${seed.courseSlug}`);
            results.push({
                courseSlug: seed.courseSlug,
                tier: seed.tier,
                success: true,
                url: thumbnailUrl,
            });
            updated++;

        } catch (error) {
            console.log(`   ❌ ${seed.courseSlug}: ${error instanceof Error ? error.message : 'Unknown error'}`);
            results.push({
                courseSlug: seed.courseSlug,
                tier: seed.tier,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            });
            notFound++;
        }
    }

    // Summary
    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Thumbnail Update Summary (v2)');
    console.log('═'.repeat(50));
    console.log(`✅ Updated: ${updated}`);
    console.log(`⏭️  No Image: ${noImage}`);
    console.log(`❌ DB Errors: ${notFound}`);

    // Save results
    const resultsPath = path.join(__dirname, 'thumbnail-update-v2-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved: ${resultsPath}`);

    await prisma.$disconnect();
}

main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});

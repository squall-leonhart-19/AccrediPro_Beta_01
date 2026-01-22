/**
 * Upload Course Thumbnails to R2 (PARALLEL VERSION)
 * Uploads course thumbnail images from courses_imgs/ to R2
 * 
 * Usage: npx tsx scripts/course-upload/upload-thumbnails.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import pLimit from 'p-limit';
import { uploadFileToR2, R2_CONFIG } from './utils/r2-client';

const IMAGES_DIR = '/Users/pochitino/Desktop/accredipro-lms/Courses_Updated_New_Version/courses_imgs';
const CONCURRENCY = 10; // Upload 10 images at once

interface UploadResult {
    filename: string;
    courseSlug: string;
    tier: string;
    success: boolean;
    url?: string;
    error?: string;
}

// Map image filename to course slug and tier
function parseImageFilename(filename: string): { courseSlug: string; tier: string } | null {
    // Pattern: certified-adaptogen-specialist_l1.webp
    const match = filename.match(/^(.+)_l(\d)\.webp$/);
    if (!match) return null;

    const [, baseName, tierNum] = match;
    const tier = `L${tierNum}`;

    // For L1, the course slug has no suffix
    // For L2-L4, the course slug has -l{tier} suffix
    const courseSlug = tierNum === '1'
        ? baseName
        : `${baseName}-l${tierNum}`;

    return { courseSlug, tier };
}

async function uploadImage(filename: string): Promise<UploadResult> {
    const parsed = parseImageFilename(filename);

    if (!parsed) {
        return {
            filename,
            courseSlug: '',
            tier: '',
            success: false,
            error: 'Could not parse filename',
        };
    }

    const { courseSlug, tier } = parsed;
    const filePath = path.join(IMAGES_DIR, filename);
    const key = `courses/thumbnails/${courseSlug}.webp`;

    try {
        const url = await uploadFileToR2(filePath, key);

        return {
            filename,
            courseSlug,
            tier,
            success: true,
            url,
        };
    } catch (error) {
        return {
            filename,
            courseSlug,
            tier,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

async function main() {
    console.log('🖼️  Starting Thumbnail Upload to R2');
    console.log('📁 Source:', IMAGES_DIR);
    console.log(`⚡ Concurrency: ${CONCURRENCY} images at once`);
    console.log('🪣 Bucket:', R2_CONFIG.bucketName);
    console.log('');

    // Get all webp files
    const files = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.webp'))
        .sort();

    console.log(`📚 Found ${files.length} thumbnail images`);

    const startTime = Date.now();
    const limit = pLimit(CONCURRENCY);

    // Upload in parallel
    const results = await Promise.all(
        files.map(file => limit(() => {
            const parsed = parseImageFilename(file);
            if (parsed) {
                console.log(`📤 Uploading: ${parsed.courseSlug}`);
            }
            return uploadImage(file);
        }))
    );

    const success = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    // Summary
    console.log('\n');
    console.log('═'.repeat(50));
    console.log('📊 Thumbnail Upload Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Uploaded: ${success.length}`);
    console.log(`❌ Failed: ${failed.length}`);
    console.log(`⏱️  Duration: ${duration} seconds`);

    if (failed.length > 0) {
        console.log('\n❌ Failed uploads:');
        failed.forEach(f => console.log(`   - ${f.filename}: ${f.error}`));
    }

    // Save results for DB update script
    const resultsPath = path.join(__dirname, 'thumbnail-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Results saved: ${resultsPath}`);

    // Generate mapping for DB update
    const mapping = success.map(r => ({
        courseSlug: r.courseSlug,
        thumbnailUrl: r.url,
    }));

    const mappingPath = path.join(__dirname, 'thumbnail-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
    console.log(`📄 Mapping saved: ${mappingPath}`);
}

main().catch(console.error);

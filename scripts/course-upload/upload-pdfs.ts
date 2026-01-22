/**
 * Upload PDFs to R2
 * Uploads all course PDFs (L1-complete.pdf, L2-complete.pdf, etc.) to R2 storage
 * 
 * Usage: npx tsx scripts/course-upload/upload-pdfs.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { uploadFileToR2, getCourseR2Key, R2_CONFIG } from './utils/r2-client';
import { getAllCourseDirs, hasPdf, getPdfPath } from './utils/parser';
import { SOURCE_DIR, TIERS } from './config';

interface UploadResult {
    courseSlug: string;
    tier: string;
    success: boolean;
    url?: string;
    error?: string;
}

async function main() {
    console.log('🚀 Starting PDF Upload to R2');
    console.log('📁 Source:', SOURCE_DIR);
    console.log('🪣 Bucket:', R2_CONFIG.bucketName);
    console.log('🌐 Public URL:', R2_CONFIG.publicUrl);
    console.log('');

    // Get all course directories
    const courseDirs = getAllCourseDirs(SOURCE_DIR);
    console.log(`📚 Found ${courseDirs.length} courses`);

    const results: UploadResult[] = [];
    let uploaded = 0;
    let skipped = 0;
    let failed = 0;

    for (const courseDir of courseDirs) {
        const coursePath = path.join(SOURCE_DIR, courseDir);

        for (const tier of TIERS) {
            // Check if PDF exists
            if (!hasPdf(coursePath, tier)) {
                skipped++;
                continue;
            }

            const pdfPath = getPdfPath(coursePath, tier);
            const r2Key = getCourseR2Key(courseDir, tier);

            try {
                console.log(`📤 Uploading: ${courseDir}/${tier}-complete.pdf`);
                const url = await uploadFileToR2(pdfPath, r2Key);

                results.push({
                    courseSlug: courseDir,
                    tier,
                    success: true,
                    url,
                });
                uploaded++;
                console.log(`   ✅ ${url}`);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                results.push({
                    courseSlug: courseDir,
                    tier,
                    success: false,
                    error: errorMessage,
                });
                failed++;
                console.error(`   ❌ Failed: ${errorMessage}`);
            }
        }
    }

    // Summary
    console.log('');
    console.log('═'.repeat(50));
    console.log('📊 Upload Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Uploaded: ${uploaded}`);
    console.log(`⏭️  Skipped:  ${skipped} (no PDF)`);
    console.log(`❌ Failed:   ${failed}`);
    console.log('');

    // Save manifest of uploaded files
    const manifestPath = path.join(__dirname, 'upload-manifest.json');
    const manifest = {
        timestamp: new Date().toISOString(),
        bucketName: R2_CONFIG.bucketName,
        publicUrl: R2_CONFIG.publicUrl,
        stats: { uploaded, skipped, failed },
        files: results.filter(r => r.success).map(r => ({
            courseSlug: r.courseSlug,
            tier: r.tier,
            url: r.url,
        })),
    };

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Manifest saved: ${manifestPath}`);

    // Exit with error code if any failed
    if (failed > 0) {
        process.exit(1);
    }
}

main().catch(console.error);

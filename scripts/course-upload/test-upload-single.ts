/**
 * Test: Upload PDFs for a single course
 * Usage: npx tsx scripts/course-upload/test-upload-single.ts
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

const client = new S3Client({
    region: 'auto',
    endpoint: 'https://5329609816d063edb11f40003176f19d.r2.cloudflarestorage.com',
    credentials: {
        accessKeyId: '5b51a27a34062b14f7f25b2d16d0f4f5',
        secretAccessKey: '4fd5133a6a8dd01f3c4b016d98bd1ef0b21117800599e7f0bc0e6ee3f6eef125',
    },
});

const tiers = ['L1', 'L2', 'L3', 'L4'];
const courseSlug = 'certified-adaptogen-specialist';
const courseDir = path.join(__dirname, '../../Courses_Updated_New_Version', courseSlug);

async function upload() {
    console.log('📦 Testing PDF Upload for:', courseSlug);
    console.log('📁 Source:', courseDir);
    console.log('');

    for (const tier of tiers) {
        const pdfPath = path.join(courseDir, `${tier}-complete.pdf`);

        if (!fs.existsSync(pdfPath)) {
            console.log(`⏭️  Skipped: ${tier} (no PDF)`);
            continue;
        }

        const content = fs.readFileSync(pdfPath);
        const sizeMB = (content.length / 1024 / 1024).toFixed(1);
        const key = `courses/${courseSlug}/${tier}-complete.pdf`;

        console.log(`📤 Uploading: ${tier} (${sizeMB}MB)`);

        await client.send(new PutObjectCommand({
            Bucket: 'accredipro-assets',
            Key: key,
            Body: content,
            ContentType: 'application/pdf',
        }));

        console.log(`   ✅ https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/${key}`);
    }

    console.log('');
    console.log('✅ All PDFs uploaded for', courseSlug);
}

upload().catch(e => {
    console.error('❌ Error:', e.message);
    process.exit(1);
});

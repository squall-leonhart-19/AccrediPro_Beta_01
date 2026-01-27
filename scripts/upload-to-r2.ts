
/**
 * Script to upload migrated assets to Cloudflare R2
 * Run with: npx tsx scripts/upload-to-r2.ts
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import mime from 'mime'; // You might need to install 'mime' or just use a simple lookup

// Manual mime lookup since we might not have 'mime' installed
function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    switch (ext) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.webp': return 'image/webp';
        case '.svg': return 'image/svg+xml';
        case '.gif': return 'image/gif';
        default: return 'application/octet-stream';
    }
}

const R2_ACCOUNT_ID = "5329609816d063edb11f40003176f19d";
const ACCESS_KEY_ID = "5b51a27a34062b14f7f25b2d16d0f4f5";
const SECRET_ACCESS_KEY = "4fd5133a6a8dd01f3c4b016d98bd1ef0b21117800599e7f0bc0e6ee3f6eef125";
const BUCKET_NAME = "accredipro-assets";
const TARGET_FOLDER = "fm-certification";
const SOURCE_DIR = path.resolve(process.cwd(), "public/assets/migrated");

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    },
});

async function uploadFile(filePath: string, fileName: string) {
    const fileContent = fs.readFileSync(filePath);
    const key = `${TARGET_FOLDER}/${fileName}`;
    const contentType = getContentType(fileName);

    console.log(`Uploading ${fileName} to ${key} (${contentType})...`);

    try {
        await S3.send(new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
            Body: fileContent,
            ContentType: contentType,
            ACL: 'public-read', // R2 buckets are usually private by default, but public access is handled at bucket level
        }));
        console.log(`✅ Uploaded: ${fileName}`);
    } catch (error) {
        console.error(`❌ Failed to upload ${fileName}:`, error);
    }
}

async function main() {
    console.log("🚀 Starting R2 Upload...");
    console.log(`Source: ${SOURCE_DIR}`);
    console.log(`Target: ${BUCKET_NAME}/${TARGET_FOLDER}/`);

    if (!fs.existsSync(SOURCE_DIR)) {
        console.error("❌ Source directory not found!");
        return;
    }

    const files = fs.readdirSync(SOURCE_DIR);

    for (const file of files) {
        if (file === '.DS_Store') continue;

        const filePath = path.join(SOURCE_DIR, file);
        const stat = fs.statSync(filePath);

        if (stat.isFile()) {
            await uploadFile(filePath, file);
        }
    }

    console.log("\n🎉 All uploads complete!");
}

main().catch(console.error);

/**
 * R2 Client Configuration
 * S3-compatible client for Cloudflare R2 storage
 */

import { S3Client, PutObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';

// R2 Configuration
export const R2_CONFIG = {
    endpoint: process.env.R2_ENDPOINT || 'https://5329609816d063edb11f40003176f19d.r2.cloudflarestorage.com',
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '5b51a27a34062b14f7f25b2d16d0f4f5',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '4fd5133a6a8dd01f3c4b016d98bd1ef0b21117800599e7f0bc0e6ee3f6eef125',
    bucketName: process.env.R2_BUCKET_NAME || 'accredipro-assets',
    publicUrl: process.env.R2_PUBLIC_URL || 'https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev',
};

// Create S3 client configured for R2
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: R2_CONFIG.endpoint,
    credentials: {
        accessKeyId: R2_CONFIG.accessKeyId,
        secretAccessKey: R2_CONFIG.secretAccessKey,
    },
});

/**
 * Upload a file to R2
 * @param filePath - Local file path
 * @param key - R2 object key (path in bucket)
 * @returns Public URL of uploaded file
 */
export async function uploadFileToR2(filePath: string, key: string): Promise<string> {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const command = new PutObjectCommand({
        Bucket: R2_CONFIG.bucketName,
        Key: key,
        Body: fileContent,
        ContentType: contentType,
    });

    await r2Client.send(command);

    // Return public URL
    return `${R2_CONFIG.publicUrl}/${key}`;
}

/**
 * List objects in R2 bucket
 * @param prefix - Optional prefix to filter objects
 */
export async function listR2Objects(prefix?: string) {
    const command = new ListObjectsV2Command({
        Bucket: R2_CONFIG.bucketName,
        Prefix: prefix,
    });

    const response = await r2Client.send(command);
    return response.Contents || [];
}

/**
 * Get content type based on file extension
 */
function getContentType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const types: Record<string, string> = {
        '.pdf': 'application/pdf',
        '.html': 'text/html',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.webp': 'image/webp',
        '.mp3': 'audio/mpeg',
        '.mp4': 'video/mp4',
    };
    return types[ext] || 'application/octet-stream';
}

/**
 * Generate R2 key for course PDF
 * @param courseSlug - Course slug
 * @param tier - L1, L2, L3, L4
 */
export function getCourseR2Key(courseSlug: string, tier: string): string {
    return `courses/${courseSlug}/${tier}-complete.pdf`;
}

/**
 * Get public URL for course PDF
 */
export function getCoursePdfUrl(courseSlug: string, tier: string): string {
    return `${R2_CONFIG.publicUrl}/courses/${courseSlug}/${tier}-complete.pdf`;
}

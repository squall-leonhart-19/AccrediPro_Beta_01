/**
 * Script to download external assets from coach.accredipro.academy
 * Run with: npx tsx scripts/download-assets.ts
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { promisify } from 'util';
import stream from 'stream';

const pipeline = promisify(stream.pipeline);

const ASSETS_TO_MIGRATE = [
    "https://assets.accredipro.academy/fm-certification/Amber-L.webp",
    "https://assets.accredipro.academy/fm-certification/CERTIFICATIONS_ACC-1.webp",
    "https://assets.accredipro.academy/fm-certification/Cheryl-W.webp",
    "https://assets.accredipro.academy/fm-certification/Denise-P.webp",
    "https://assets.accredipro.academy/fm-certification/Gina-T.webp",
    "https://assets.accredipro.academy/fm-certification/Lisa-K.webp",
    "https://assets.accredipro.academy/fm-certification/Sarah-M.webp",
    "https://assets.accredipro.academy/fm-certification/Senza-titolo-Logo-1.png",
    "https://assets.accredipro.academy/fm-certification/Senza-titolo-Logo.png",
    "https://assets.accredipro.academy/fm-certification/T1.webp",
    "https://assets.accredipro.academy/fm-certification/T2.webp",
    "https://assets.accredipro.academy/fm-certification/T3.webp",
    "https://assets.accredipro.academy/fm-certification/T4.webp",
    "https://assets.accredipro.academy/fm-certification/T5.webp",
    "https://assets.accredipro.academy/fm-certification/T6.webp",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_01.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_02.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_03.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_04.jpg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg",
    "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_06.jpeg",
    "https://assets.accredipro.academy/fm-certification/All_Logos.png",
    "https://assets.accredipro.academy/fm-certification/CMA-Accredited-course.jpeg",
    "https://assets.accredipro.academy/fm-certification/FM-BUNDLE-IMG.png",
    "https://assets.accredipro.academy/fm-certification/Screenshot-2025-12-21-at-13.23.48.png",
    "https://assets.accredipro.academy/fm-certification/Screenshot-2025-12-21-at-13.24.10.png"
];

const DOWNLOAD_DIR = path.resolve(process.cwd(), "public/assets/migrated");

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadFile(url: string) {
    const filename = path.basename(url);
    const destPath = path.join(DOWNLOAD_DIR, filename);

    console.log(`Downloading ${filename}...`);

    return new Promise<void>((resolve, reject) => {
        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.error(`❌ Failed to download ${url}: Status ${response.statusCode}`);
                // Don't reject, just skip
                resolve();
                return;
            }

            const fileStream = fs.createWriteStream(destPath);
            pipeline(response, fileStream)
                .then(() => {
                    console.log(`✅ Saved to ${destPath}`);
                    resolve();
                })
                .catch((err) => {
                    console.error(`❌ Error saving ${filename}:`, err);
                    resolve();
                });
        }).on('error', (err) => {
            console.error(`❌ Request error for ${url}:`, err);
            resolve();
        });
    });
}

async function main() {
    console.log(`🚀 Starting download of ${ASSETS_TO_MIGRATE.length} assets...`);

    for (const url of ASSETS_TO_MIGRATE) {
        await downloadFile(url);
        // Small delay to be nice
        await new Promise(r => setTimeout(r, 200));
    }

    console.log("\n📦 Download complete!");
    console.log(`📂 Files are in: ${DOWNLOAD_DIR}`);
    console.log("👉 Next step: Upload these files to your R2 bucket 'assets.accredipro.academy/migrated/' or similar.");
}

main().catch(console.error);

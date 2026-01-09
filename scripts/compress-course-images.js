#!/usr/bin/env node
/**
 * Compress Course Images Script
 * Converts all PNG images in /corsi 3/ to optimized WebP format
 * Target: ~150KB per image (from ~6MB)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '..', 'corsi 3');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'courses', 'images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function findAllPngImages(dir) {
    const images = [];

    function walkDir(currentDir) {
        const files = fs.readdirSync(currentDir);
        for (const file of files) {
            const filePath = path.join(currentDir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                walkDir(filePath);
            } else if (file.endsWith('.png')) {
                images.push(filePath);
            }
        }
    }

    walkDir(dir);
    return images;
}

async function compressImage(inputPath) {
    const filename = path.basename(inputPath, '.png');
    const outputPath = path.join(OUTPUT_DIR, `${filename}.webp`);

    try {
        const inputStats = fs.statSync(inputPath);
        const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

        await sharp(inputPath)
            .resize(1200, 800, { // Resize to reasonable dimensions
                fit: 'cover',
                withoutEnlargement: true
            })
            .webp({
                quality: 80,
                effort: 6
            })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        const outputSizeKB = (outputStats.size / 1024).toFixed(0);
        const reduction = ((1 - outputStats.size / inputStats.size) * 100).toFixed(1);

        console.log(`✅ ${filename}: ${inputSizeMB}MB → ${outputSizeKB}KB (${reduction}% reduction)`);

        return {
            input: inputPath,
            output: outputPath,
            inputSize: inputStats.size,
            outputSize: outputStats.size
        };
    } catch (error) {
        console.error(`❌ Error processing ${filename}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('🔍 Finding PNG images in /corsi 3/...\n');

    const images = await findAllPngImages(SOURCE_DIR);
    console.log(`📦 Found ${images.length} PNG images\n`);

    let totalInputSize = 0;
    let totalOutputSize = 0;
    let processed = 0;

    for (const imagePath of images) {
        const result = await compressImage(imagePath);
        if (result) {
            totalInputSize += result.inputSize;
            totalOutputSize += result.outputSize;
            processed++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 COMPRESSION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Images processed: ${processed}/${images.length}`);
    console.log(`Total input size: ${(totalInputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total output size: ${(totalOutputSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total reduction: ${((1 - totalOutputSize / totalInputSize) * 100).toFixed(1)}%`);
    console.log(`Output directory: ${OUTPUT_DIR}`);
    console.log('='.repeat(60));
}

main().catch(console.error);

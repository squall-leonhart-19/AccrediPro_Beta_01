/**
 * Generate Static PDFs for Mini Diploma Resources
 * 
 * Uses PDFBolt API to pre-generate PDFs for all ASI resources
 * Run with: npx tsx scripts/generate-resource-pdfs.ts
 */

import { promises as fs } from 'fs';
import path from 'path';

const PDFBOLT_API_KEY = process.env.PDFBOLT_API_KEY || '';
const PDFBOLT_API_URL = 'https://api.pdfbolt.com/v1/direct';
const BASE_URL = 'https://learn.accredipro.academy';

// All ASI resource HTML files that need PDFs
const RESOURCES = [
    // Core documents
    'documents/asi/core/scope-and-boundaries-level-0.html',
    'documents/asi/core/practice-toolkit-level-0.html',
    'documents/asi/core/pathways-progression-guide.html',
    // Client resources
    'documents/asi/client-resources/client-intake-snapshot.html',
    'documents/asi/client-resources/client-clarity-map.html',
    'documents/asi/client-resources/support-circle-builder.html',
    'documents/asi/client-resources/goals-translation-sheet.html',
    'documents/asi/client-resources/readiness-for-support-check.html',
    'documents/asi/client-resources/between-sessions-reflection.html',
];

async function generatePdf(htmlPath: string): Promise<void> {
    const publicDir = path.join(process.cwd(), 'public');
    const fullHtmlPath = path.join(publicDir, htmlPath);
    const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
    const fullPdfPath = path.join(publicDir, pdfPath);

    // Check if PDF already exists
    try {
        await fs.access(fullPdfPath);
        console.log(`⏭️  Skipping ${pdfPath} (already exists)`);
        return;
    } catch {
        // PDF doesn't exist, continue
    }

    // Read HTML content
    let htmlContent: string;
    try {
        htmlContent = await fs.readFile(fullHtmlPath, 'utf-8');
    } catch (error) {
        console.error(`❌ Failed to read ${htmlPath}:`, error);
        return;
    }

    // Fix relative image paths to absolute URLs
    htmlContent = htmlContent.replace(
        /src=["']\/(?!\/)/g,
        `src="${BASE_URL}/`
    );

    if (!PDFBOLT_API_KEY) {
        console.error('❌ PDFBOLT_API_KEY not set');
        return;
    }

    // Convert HTML to base64
    const htmlBase64 = Buffer.from(htmlContent).toString('base64');

    console.log(`📄 Converting ${htmlPath}...`);

    try {
        const response = await fetch(PDFBOLT_API_URL, {
            method: 'POST',
            headers: {
                'API-KEY': PDFBOLT_API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                html: htmlBase64,
                printBackground: true,
                waitUntil: 'networkidle',
                format: 'A4',
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ PDFBolt error for ${htmlPath}:`, response.status, errorText);
            return;
        }

        const pdfBuffer = await response.arrayBuffer();
        await fs.writeFile(fullPdfPath, Buffer.from(pdfBuffer));
        console.log(`✅ Generated ${pdfPath} (${pdfBuffer.byteLength} bytes)`);
    } catch (error) {
        console.error(`❌ Failed to generate ${pdfPath}:`, error);
    }
}

async function main() {
    console.log('🚀 Generating static PDFs for all ASI resources...\n');

    if (!PDFBOLT_API_KEY) {
        console.error('❌ Error: PDFBOLT_API_KEY environment variable not set');
        console.log('Run with: PDFBOLT_API_KEY=your_key npx tsx scripts/generate-resource-pdfs.ts');
        process.exit(1);
    }

    for (const resource of RESOURCES) {
        await generatePdf(resource);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n✅ Done!');
}

main().catch(console.error);

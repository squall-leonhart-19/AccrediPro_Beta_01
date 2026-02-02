#!/usr/bin/env node
/**
 * Convert ASI HTML documents to PDF using PDF Bolt API
 * Usage: node scripts/convert-asi-html-to-pdf.cjs <html-file-path>
 */

const fs = require('fs');
const path = require('path');

const PDFBOLT_API_KEY = process.env.PDFBOLT_API_KEY;
const PDFBOLT_API_URL = "https://api.pdfbolt.com/v1/direct";

async function convertHtmlToPdf(htmlFilePath) {
    if (!PDFBOLT_API_KEY) {
        console.error("ERROR: PDFBOLT_API_KEY environment variable not set");
        process.exit(1);
    }

    // Read the HTML file
    let htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    // Get the public directory path
    const publicDir = path.resolve(__dirname, '../public');

    // Replace relative image paths with base64 encoded images
    const imgMatches = htmlContent.match(/src="\/([^"]+\.(png|jpg|jpeg|webp|gif))"/gi);
    if (imgMatches) {
        for (const match of imgMatches) {
            const srcPath = match.match(/src="\/([^"]+)"/);
            if (srcPath && srcPath[1]) {
                const imagePath = path.join(publicDir, srcPath[1]);
                if (fs.existsSync(imagePath)) {
                    const imageBuffer = fs.readFileSync(imagePath);
                    const base64Image = imageBuffer.toString('base64');
                    const ext = path.extname(imagePath).slice(1);
                    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
                    const dataUri = `data:image/${mimeType};base64,${base64Image}`;
                    htmlContent = htmlContent.replace(match, `src="${dataUri}"`);
                    console.log(`✓ Embedded: ${srcPath[1]}`);
                }
            }
        }
    }

    // Convert to base64 for PDF Bolt
    const htmlBase64 = Buffer.from(htmlContent).toString('base64');

    console.log(`\nCalling PDF Bolt API...`);

    // Call PDF Bolt with settings from PDF_CONVERSION_GUIDE.md
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
            landscape: false,
            format: 'A4',
            preferCssPageSize: true,
            emulateMediaType: 'print',
            viewportSize: { width: 794, height: 1123 },
            scale: 1,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error(`PDF Bolt API error: ${response.status}`, errorText);
        process.exit(1);
    }

    // Save the PDF
    const pdfBuffer = await response.arrayBuffer();
    const outputPath = htmlFilePath.replace('.html', '.pdf');
    fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));

    console.log(`\n✅ PDF saved to: ${outputPath}`);
    return outputPath;
}

// Get the HTML file path from command line
const htmlFilePath = process.argv[2];

if (!htmlFilePath) {
    console.log("Usage: node scripts/convert-asi-html-to-pdf.cjs <html-file-path>");
    console.log("\nExample:");
    console.log("  node scripts/convert-asi-html-to-pdf.cjs public/documents/asi/core/scope-and-boundaries-level-0.html");
    process.exit(1);
}

const fullPath = path.resolve(htmlFilePath);
if (!fs.existsSync(fullPath)) {
    console.error(`File not found: ${fullPath}`);
    process.exit(1);
}

convertHtmlToPdf(fullPath).catch(err => {
    console.error("Error:", err);
    process.exit(1);
});

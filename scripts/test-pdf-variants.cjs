#!/usr/bin/env node
/**
 * Test 10 different PDF Bolt configurations to find the best one for page margins
 */

const fs = require('fs');
const path = require('path');

const PDFBOLT_API_KEY = process.env.PDFBOLT_API_KEY;
const PDFBOLT_API_URL = "https://api.pdfbolt.com/v1/direct";

// 10 different configurations to test
const VARIANTS = [
    {
        name: "v01_api_margins_15mm",
        config: {
            format: 'A4',
            printBackground: true,
            margin: { top: '15mm', right: '10mm', bottom: '15mm', left: '10mm' }
        }
    },
    {
        name: "v02_css_page_size",
        config: {
            format: 'A4',
            printBackground: true,
            preferCssPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
    },
    {
        name: "v03_print_media_viewport",
        config: {
            format: 'A4',
            printBackground: true,
            preferCssPageSize: true,
            emulateMediaType: 'print',
            viewportSize: { width: 794, height: 1123 },
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
    },
    {
        name: "v04_screen_media_api_margins",
        config: {
            format: 'A4',
            printBackground: true,
            emulateMediaType: 'screen',
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
        }
    },
    {
        name: "v05_large_viewport_no_css",
        config: {
            format: 'A4',
            printBackground: true,
            preferCssPageSize: false,
            viewportSize: { width: 850, height: 1200 },
            margin: { top: '15mm', right: 0, bottom: '15mm', left: 0 }
        }
    },
    {
        name: "v06_scale_0.9_margins",
        config: {
            format: 'A4',
            printBackground: true,
            scale: 0.9,
            margin: { top: '10mm', right: '8mm', bottom: '10mm', left: '8mm' }
        }
    },
    {
        name: "v07_px_margins",
        config: {
            format: 'A4',
            printBackground: true,
            margin: { top: '50px', right: '30px', bottom: '50px', left: '30px' }
        }
    },
    {
        name: "v08_inch_margins",
        config: {
            format: 'A4',
            printBackground: true,
            margin: { top: '0.6in', right: '0.4in', bottom: '0.6in', left: '0.4in' }
        }
    },
    {
        name: "v09_networkidle0_css",
        config: {
            format: 'A4',
            printBackground: true,
            preferCssPageSize: true,
            waitUntil: 'networkidle0',
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        }
    },
    {
        name: "v10_domcontentloaded_margins",
        config: {
            format: 'A4',
            printBackground: true,
            waitUntil: 'domcontentloaded',
            margin: { top: '18mm', right: '12mm', bottom: '18mm', left: '12mm' }
        }
    }
];

async function convertWithConfig(htmlContent, config, outputPath) {
    const htmlBase64 = Buffer.from(htmlContent).toString('base64');

    const response = await fetch(PDFBOLT_API_URL, {
        method: 'POST',
        headers: {
            'API-KEY': PDFBOLT_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            html: htmlBase64,
            ...config
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
    }

    const pdfBuffer = await response.arrayBuffer();
    fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
    return outputPath;
}

async function main() {
    if (!PDFBOLT_API_KEY) {
        console.error("ERROR: PDFBOLT_API_KEY not set");
        process.exit(1);
    }

    const htmlFilePath = process.argv[2];
    if (!htmlFilePath) {
        console.log("Usage: node test-pdf-variants.cjs <html-file>");
        process.exit(1);
    }

    const fullPath = path.resolve(htmlFilePath);
    let htmlContent = fs.readFileSync(fullPath, 'utf8');

    // Embed images as base64
    const publicDir = path.resolve(__dirname, '../public');
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
                }
            }
        }
    }

    // Create output directory
    const outputDir = path.join(path.dirname(fullPath), 'pdf-variants');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log(`\n🧪 Testing 10 PDF Bolt configurations...\n`);

    for (let i = 0; i < VARIANTS.length; i++) {
        const variant = VARIANTS[i];
        const outputPath = path.join(outputDir, `${variant.name}.pdf`);

        try {
            process.stdout.write(`[${i + 1}/10] ${variant.name}... `);
            await convertWithConfig(htmlContent, variant.config, outputPath);
            console.log('✅');
        } catch (err) {
            console.log(`❌ ${err.message}`);
        }
    }

    console.log(`\n📁 All variants saved to: ${outputDir}`);
    console.log("\nOpen each PDF to compare margins and pick the best one!");
}

main().catch(console.error);

const fs = require('fs');
const path = require('path');

const PDFBOLT_API_KEY = 'd83d7165-f7ab-48ec-9828-98fdd4ff4f42';
const PDFBOLT_API_URL = 'https://api.pdfbolt.com/v1/direct';

async function testPdfBolt() {
    // Read HTML file
    const htmlPath = path.join(process.cwd(), 'public/documents/asi/core/scope-and-boundaries-level-0.html');
    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    // Fix image paths
    const baseUrl = 'https://learn.accredipro.academy';
    htmlContent = htmlContent.replace(/src=["']\/(?!\/)/g, `src="${baseUrl}/`);

    console.log('HTML length:', htmlContent.length);
    console.log('Calling PDFBolt API...');

    const htmlBase64 = Buffer.from(htmlContent).toString('base64');

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

    console.log('Response status:', response.status);
    console.log('Content-Type:', response.headers.get('content-type'));

    if (response.ok) {
        const buffer = await response.arrayBuffer();
        console.log('PDF size:', buffer.byteLength, 'bytes');

        // Save to test file
        fs.writeFileSync('/tmp/test-pdfbolt.pdf', Buffer.from(buffer));
        console.log('Saved to /tmp/test-pdfbolt.pdf');
        console.log('SUCCESS! PDF generated correctly.');
    } else {
        const text = await response.text();
        console.log('Error:', text);
    }
}

testPdfBolt().catch(console.error);

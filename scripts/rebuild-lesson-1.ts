
import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const filePath = path.join(process.cwd(), 'FM/FM-Update/Module_01/Lesson_1.1_Introduction_To_Functional_Medicine.html');

// THE NEW CLEAN TEMPLATE
const getTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lesson 1.1: Introduction to Functional Medicine</title>
    <style>
        /* 
           ACCREDIPRO CLEAN SCHOOL STANDARD v1.0
           "Zen Mode" Compatible
        */
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #1f2937;
            max-width: 800px; /* READABILITY CONSTRAINT */
            margin: 0 auto;
            padding: 40px 20px;
        }

        /* TYPOGRAPHY */
        h1 {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
            line-height: 1.2;
        }
        
        h2 {
            font-size: 24px;
            font-weight: 700;
            color: #722F37; /* AccrediPro Burgundy */
            margin-top: 48px;
            margin-bottom: 24px;
            padding-bottom: 12px;
            border-bottom: 2px solid #f3f4f6;
        }

        h3 {
            font-size: 20px;
            font-weight: 600;
            color: #374151;
            margin-top: 32px;
            margin-bottom: 16px;
        }

        p {
            margin-bottom: 24px;
            font-size: 18px; /* High legibility */
            line-height: 1.75;
        }

        ul, ol {
            margin-bottom: 24px;
            padding-left: 24px;
        }

        li {
            margin-bottom: 12px;
            font-size: 18px;
            padding-left: 8px;
        }

        strong {
            color: #111827;
            font-weight: 600;
        }

        /* COMPONENTS */
        
        /* 1. ASI Header Strip */
        .asi-strip {
            background: linear-gradient(to right, #fdfbf7, #fff);
            border: 1px solid #e5e7eb;
            border-left: 4px solid #B8860B; /* Gold */
            border-radius: 8px;
            padding: 16px 20px;
            margin-bottom: 40px;
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 14px;
            color: #6b7280;
        }
        .asi-icon { font-size: 20px; }
        
        /* 2. Highlight Box (Coach Tip/Info) */
        .highlight-box {
            background-color: #fefce8; /* Yellow-50 */
            border: 1px solid #fde047;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
        }
        .highlight-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 700;
            color: #854d0e;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        /* 3. Success/Takeaways Box */
        .success-box {
            background-color: #f0fdf4; /* Green-50 */
            border: 1px solid #86efac;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
        }
        .success-title {
            color: #166534;
            font-weight: 700;
            font-size: 18px;
            margin-bottom: 16px;
        }

        /* 4. Case Study Card */
        .case-card {
            background-color: #f9fafb; /* Gray-50 */
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 32px; /* Inner padding */
            margin: 40px -20px; /* Breakout slightly on mobile */
        }
        @media (min-width: 640px) {
            .case-card { margin: 40px 0; }
        }
        .case-header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 24px;
            padding-bottom: 24px;
            border-bottom: 1px solid #e5e7eb;
        }
        .case-avatar {
            width: 48px;
            height: 48px;
            background: #e5e7eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
        }

        /* 5. Simple Grid (2 cols) */
        .simple-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 24px;
            margin: 32px 0;
        }
        @media (min-width: 640px) {
            .simple-grid { grid-template-columns: 1fr 1fr; }
        }
        .grid-item {
            background: #fff;
            border: 1px solid #e5e7eb;
            padding: 24px;
            border-radius: 12px;
        }
    </style>
</head>
<body>
    <!-- ASI HEADER -->
    <div class="asi-strip">
        <span class="asi-icon">🏛️</span>
        <div>
            <strong>AccrediPro Standards Institute</strong> • Module 1 Foundation
        </div>
    </div>

    <!-- MAIN CONTENT INJECTION POINT -->
    ${content}

</body>
</html>
`;

async function main() {
    console.log("Reading file...");
    const html = fs.readFileSync(filePath, 'utf-8');
    const dom = new JSDOM(html);
    const doc = dom.window.document;

    let contentBuffer = "";

    // 1. EXTRACT TITLE
    const title = doc.querySelector('.lesson-title')?.textContent?.trim() || "Introduction to Functional Medicine";
    contentBuffer += `<h1>${title}</h1>`;

    // 2. EXTRACT INTRO (Before first H2)
    // We will look for welcome box and objectives
    const welcomeBox = doc.querySelector('.welcome-box');
    if (welcomeBox) {
        const title = welcomeBox.querySelector('h3')?.textContent || "";
        const text = welcomeBox.querySelector('p')?.textContent || "";
        contentBuffer += `
        <div class="highlight-box">
            <div class="highlight-title">👋 ${title}</div>
            <p>${text}</p>
        </div>`;
    }

    const objectivesBox = doc.querySelector('.objectives-box');
    if (objectivesBox) {
        const lis = Array.from(objectivesBox.querySelectorAll('li')).map(li => `<li>${li.innerHTML}</li>`).join('');
        contentBuffer += `
        <div class="success-box">
            <div class="success-title">In this Lesson:</div>
            <ul>${lis}</ul>
        </div>`;
    }

    // 3. EXTRACT CASE STUDY
    const caseStudy = doc.querySelector('.case-study');
    if (caseStudy) {
        // Build a nice clean HTML case study
        const patientName = caseStudy.querySelector('.patient-info h4')?.textContent || "Case Study";
        const patientDesc = caseStudy.querySelector('.patient-info p')?.textContent || "";
        const bullets = Array.from(caseStudy.querySelectorAll('li')).map(li => `<li>${li.textContent}</li>`).join('');
        const conclusion = caseStudy.querySelectorAll('p')[1]?.innerHTML || ""; // Usually the paragraph after list

        contentBuffer += `
        <div class="case-card">
            <div class="case-header">
                <div class="case-avatar">👩</div>
                <div>
                    <strong>${patientName}</strong><br>
                    <span style="color:#6b7280; font-size:14px">${patientDesc}</span>
                </div>
            </div>
            <p><strong>Clinical Presentation:</strong></p>
            <ul>${bullets}</ul>
            <p>${conclusion}</p>
        </div>`;
    }

    // 4. GENERAL CONTENT EXTRACTION (Iterate sections)
    // We'll perform a query for common content selectors in order
    // This is a "best effort" scraping of the body content

    // Find "A Different Way of Thinking" H2
    const allH2s = Array.from(doc.querySelectorAll('h2'));

    for (const h2 of allH2s) {
        contentBuffer += `<h2>${h2.textContent}</h2>`;

        let sibling = h2.nextElementSibling;
        while (sibling && sibling.tagName !== 'H2' && !sibling.classList.contains('case-study') && !sibling.classList.contains('module-header-card')) {

            // Text Paragraphs
            if (sibling.tagName === 'P') {
                contentBuffer += `<p>${sibling.innerHTML}</p>`;
            }

            // Lists
            if (sibling.tagName === 'UL' || sibling.tagName === 'OL') {
                contentBuffer += `<ul>${sibling.innerHTML}</ul>`;
            }

            // Comparison Grid (Convert to simple stacked/grid)
            if (sibling.classList.contains('comparison-grid')) {
                const cards = Array.from(sibling.querySelectorAll('.comparison-card'));
                let gridHtml = '<div class="simple-grid">';
                cards.forEach(c => {
                    const label = c.querySelector('.card-label')?.textContent;
                    const text = c.querySelector('.card-text')?.textContent;
                    gridHtml += `<div class="grid-item"><strong>${label}</strong><br><br>${text}</div>`;
                });
                gridHtml += '</div>';
                contentBuffer += gridHtml;
            }

            // Coach Tips
            if (sibling.classList.contains('coach-tip')) {
                const text = sibling.querySelector('p')?.innerHTML;
                contentBuffer += `
                 <div class="highlight-box">
                    <div class="highlight-title">💡 Coach Tip</div>
                    <p>${text}</p>
                 </div>`;
            }

            // Takeaways
            if (sibling.classList.contains('takeaways-box')) {
                contentBuffer += `
                  <div class="success-box">
                    ${sibling.innerHTML}
                  </div>`;
            }

            sibling = sibling.nextElementSibling;
        }
    }

    // 5. WRITE NEW FILE
    const newHtml = getTemplate(contentBuffer);
    console.log("Writing new file...");
    fs.writeFileSync(filePath, newHtml);
    console.log("Done!");
}

main();

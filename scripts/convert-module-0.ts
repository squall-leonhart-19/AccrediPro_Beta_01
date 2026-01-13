/**
 * Convert Module 0 Lessons to Card Layout (Test Batch)
 * ====================================================
 * Just Module 0 for user confirmation before full batch
 */

import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const MODULE_PATH = path.join(process.cwd(), "FM/FM-Update/Module_00");
const COURSE_SLUG = "functional-medicine-complete-certification";

// Card Layout CSS
const CARD_LAYOUT_CSS = `
        /* ACCREDIPRO SCHOOL-QUALITY STYLES (CARD LAYOUT) */
        * { box-sizing: border-box; }
        
        body {
            font-family: 'Inter', Georgia, serif;
            line-height: 1.8;
            color: #2d2d2d;
            background: #ffffff;
            margin: 0;
            padding: 40px 20px;
            width: 100%;
            overflow-x: hidden;
        }

        .lesson-wrapper {
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
        }

        .module-header-card {
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            padding: 40px;
            margin-bottom: 32px;
            border-radius: 16px;
            box-shadow: 0 10px 40px -10px rgba(114, 47, 55, 0.3);
            border: 1px solid rgba(255,255,255,0.1);
            text-align: center;
        }

        .module-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 12px;
            font-weight: 600;
            display: block;
        }

        .lesson-title {
            font-size: 32px;
            color: #ffffff;
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.2;
        }

        .lesson-meta {
            display: flex;
            justify-content: center;
            gap: 16px;
        }

        .meta-tag {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
        }

        .connection-box {
            background: #f8f5f0;
            padding: 24px;
            margin-bottom: 32px;
            border-radius: 12px;
            border-left: 4px solid #B8860B;
        }
        .connection-box p { margin: 0; font-size: 17px; color: #2d2d2d; line-height: 1.7; }

        h2 {
            color: #722F37;
            font-size: 28px;
            margin: 48px 0 24px 0;
            font-weight: 700;
            position: relative;
            padding-bottom: 12px;
            display: inline-block;
        }
        h2::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 60px;
            height: 4px;
            background: #B8860B;
            border-radius: 2px;
        }

        h3 { color: #722F37; font-size: 20px; margin: 32px 0 16px 0; font-weight: 600; }
        p { font-size: 18px; line-height: 1.8; color: #374151; margin-bottom: 24px; }
        ul, ol { margin: 24px 0; padding-left: 28px; }
        li { font-size: 17px; line-height: 1.7; color: #374151; margin-bottom: 12px; }
        li strong { color: #722F37; }

        .phase-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
        }
        .phase-box h3 { margin: 0 0 12px 0; color: #722F37; }
        .phase-box p { margin: 0 0 16px 0; font-size: 16px; }
        .phase-box ul { margin: 0; padding-left: 24px; }
        .phase-box li { margin-bottom: 8px; font-size: 15px; }
        .phase-box li:last-child { margin-bottom: 0; }

        .alert-box {
            padding: 24px;
            border-radius: 12px;
            margin: 32px 0;
            border-left: 4px solid;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }
        .alert-box .alert-label {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 1px;
            margin-bottom: 8px;
            display: block;
        }
        .alert-box p { margin: 0; font-size: 16px; }
        .alert-box.success { background: #f0fdf4; border-color: #22c55e; }
        .alert-box.success .alert-label { color: #166534; }
        .alert-box.warning { background: #fffbeb; border-color: #f59e0b; }
        .alert-box.warning .alert-label { color: #92400e; }
        .alert-box.info { background: #faf5ff; border-color: #a855f7; }
        .alert-box.info .alert-label { color: #7e22ce; }

        .takeaways-box {
            background: #f8fafc;
            border-radius: 16px;
            padding: 32px;
            margin-top: 48px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .takeaways-box .box-label {
            color: #722F37;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 20px;
            display: block;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .takeaways-box ul { margin: 0; padding-left: 24px; }
        .takeaways-box li { margin-bottom: 12px; font-size: 16px; }
        .takeaways-box li:last-child { margin-bottom: 0; }

        .content-list { list-style: disc; }
        .content-list li { margin-bottom: 14px; }

        .brand-header, .lesson-footer { display: none !important; }

        @media (max-width: 768px) {
            body { padding: 20px 16px; }
            .module-header-card { padding: 30px 20px; }
            .lesson-title { font-size: 24px; }
        }
`;

function transformToCardLayout(htmlContent: string): string {
    // Extract title
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Lesson';

    // Extract module label
    const moduleLabelMatch = htmlContent.match(/<p class="module-label">([^<]+)<\/p>/i);
    const moduleLabel = moduleLabelMatch ? moduleLabelMatch[1].trim() : 'Module 0: Orientation';

    // Extract lesson title
    const lessonTitleMatch = htmlContent.match(/<h1 class="lesson-title">([^<]+)<\/h1>/i);
    const lessonTitle = lessonTitleMatch ? lessonTitleMatch[1].trim() : title;

    // Extract meta items
    const metaItems: string[] = [];
    const metaMatches = htmlContent.matchAll(/<span class="meta-item">([^<]+)<\/span>/gi);
    for (const match of metaMatches) {
        metaItems.push(match[1].trim());
    }

    // Extract body content between </header> and <footer
    let bodyContent = '';
    const headerEndIdx = htmlContent.indexOf('</header>');
    const footerStartIdx = htmlContent.indexOf('<footer class="lesson-footer">');

    if (headerEndIdx !== -1 && footerStartIdx !== -1) {
        bodyContent = htmlContent.slice(headerEndIdx + '</header>'.length, footerStartIdx).trim();
    } else {
        // Fallback
        const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
        bodyContent = bodyMatch ? bodyMatch[1] : '';
    }

    // Clean body content
    bodyContent = bodyContent
        .replace(/<div class="brand-header">[\s\S]*?<\/div>/gi, '')
        .replace(/<div class="lesson-container">/gi, '')
        .replace(/^\s*<\/div>/, '')
        .replace(/<\/div>\s*$/, '')
        .trim();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>${CARD_LAYOUT_CSS}
    </style>
</head>
<body>
    <div class="brand-header"></div>
    <div class="lesson-wrapper">
        <div class="module-header-card">
            <span class="module-label">${moduleLabel}</span>
            <h1 class="lesson-title">${lessonTitle}</h1>
            <div class="lesson-meta">
                ${metaItems.map(item => `<span class="meta-tag">${item}</span>`).join('\n                ')}
            </div>
        </div>
        ${bodyContent}
    </div>
    <div class="lesson-footer"></div>
</body>
</html>`;
}

async function main() {
    console.log("🚀 Converting Module 0 Lessons to Card Layout\n");

    // Get course and Module 0
    const course = await prisma.course.findFirst({
        where: { slug: COURSE_SLUG },
        include: {
            modules: {
                where: { order: 0 },
                include: { lessons: { orderBy: { order: 'asc' } } }
            }
        }
    });

    if (!course || course.modules.length === 0) {
        console.error("❌ Course or Module 0 not found!");
        return;
    }

    const module0 = course.modules[0];
    console.log(`Found: ${module0.title} with ${module0.lessons.length} lessons\n`);

    // Get HTML files (skip 0.1 which is already done)
    const htmlFiles = fs.readdirSync(MODULE_PATH)
        .filter(f => f.endsWith('.html') && !f.includes('Lesson_0.1_'))
        .sort();

    console.log(`Processing ${htmlFiles.length} files (skipping 0.1)\n`);

    for (const file of htmlFiles) {
        const filePath = path.join(MODULE_PATH, file);
        const match = file.match(/Lesson_0\.(\d+)_/);
        const lessonOrder = match ? parseInt(match[1], 10) : null;

        console.log(`📄 ${file}`);

        try {
            // Read and transform
            const original = fs.readFileSync(filePath, 'utf-8');
            const converted = transformToCardLayout(original);

            // Save to disk
            fs.writeFileSync(filePath, converted, 'utf-8');
            console.log(`   ✅ Converted on disk`);

            // Find matching DB lesson
            const dbLesson = module0.lessons.find(l => l.order === lessonOrder);
            if (dbLesson) {
                await prisma.lesson.update({
                    where: { id: dbLesson.id },
                    data: { content: converted }
                });
                console.log(`   📤 Synced to DB (${dbLesson.id})`);
            } else {
                console.log(`   ⚠️ No DB lesson for order ${lessonOrder}`);
            }
        } catch (err) {
            console.log(`   ❌ Error: ${err}`);
        }
    }

    console.log("\n🎉 Module 0 complete! Hard refresh the page to test.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

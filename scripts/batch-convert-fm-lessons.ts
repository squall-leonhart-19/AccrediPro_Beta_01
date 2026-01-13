/**
 * Batch Convert FM Lessons to Card Layout
 * ========================================
 * This script:
 * 1. Reads all HTML lesson files from FM/FM-Update
 * 2. Transforms them to the new "Card Layout" structure
 * 3. Overwrites the HTML files on disk
 * 4. Syncs the content to the database
 */

import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

const FM_UPDATE_PATH = path.join(process.cwd(), "FM/FM-Update");
const COURSE_SLUG = "functional-medicine-complete-certification";

// New Card Layout CSS (matches Lesson 0.1 - 1200px approved)
const CARD_LAYOUT_CSS = `
/* =========================================
           ACCREDIPRO SCHOOL-QUALITY STYLES (CARD LAYOUT)
           ========================================= */
        
        /* Reset & Base */
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

        /* MAIN WRAPPER - Centered Card Layout */
        .lesson-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
            padding: 0 20px;
        }

        /* Utility: Text Colors */
        .text-white { color: #ffffff !important; }
        .text-burgundy { color: #722F37 !important; }
        .text-gold { color: #B8860B !important; }
        .highlight { background-color: #FFF59D; padding: 0 3px; border-radius: 2px; }

        /* HEADER CARD */
        .module-header-card {
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            padding: 48px 40px;
            margin-bottom: 32px;
            border-radius: 20px;
            box-shadow: 0 12px 48px -12px rgba(114, 47, 55, 0.35);
            border: 1px solid rgba(255,255,255,0.15);
            text-align: center;
        }

        .module-label {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 2px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 12px;
            font-weight: 600;
            display: block;
        }

        .lesson-title {
            font-size: 36px;
            color: #ffffff;
            font-weight: 700;
            margin: 0 0 24px 0;
            line-height: 1.2;
        }

        .lesson-subtitle {
            font-size: 20px;
            color: rgba(255,255,255,0.9);
            font-weight: 400;
            margin-top: -10px;
            margin-bottom: 24px;
        }

        .lesson-meta { display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; }
        
        .meta-tag, .reading-badge {
            background: rgba(255, 255, 255, 0.15);
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            backdrop-filter: blur(4px);
        }

        /* CONTENT CONTAINERS */
        .connection-box, .welcome-box {
            background: #f8f5f0;
            padding: 24px;
            margin-bottom: 32px;
            border-radius: 12px;
            border-left: 4px solid #B8860B;
        }
        .connection-box p, .welcome-box p { margin: 0; font-size: 17px; color: #2d2d2d; line-height: 1.7; }
        .welcome-box h3 { margin-top: 0; color: #722F37; }

        /* TYPOGRAPHY */
        h2 {
            color: #722F37;
            font-size: 30px;
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
            width: 80px;
            height: 4px;
            background: #B8860B;
            border-radius: 2px;
        }

        h3 { color: #722F37; font-size: 22px; margin: 32px 0 16px 0; font-weight: 600; }
        p { font-size: 18px; line-height: 1.8; color: #374151; margin-bottom: 24px; }
        ul, ol { margin: 24px 0; padding-left: 28px; }
        li { font-size: 17px; line-height: 1.7; color: #374151; margin-bottom: 12px; }
        li strong { color: #722F37; }

        /* STORY & CASE STUDY BOXES */
        .story-box, .case-study {
            background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
            padding: 32px;
            border-radius: 16px;
            margin: 32px 0;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .case-study { border-top: 4px solid #722F37; }
        .story-box h3, .case-study h3, .case-study-header .box-label {
            color: #722F37;
            margin-top: 0;
            text-transform: uppercase;
            font-size: 14px;
            letter-spacing: 1px;
            font-weight: 700;
        }
        .subtitle { font-size: 20px; font-weight: 600; color: #1f2937; margin: 8px 0 16px 0; }
        .patient-info h4 { margin: 0; color: #722F37; font-size: 18px; }

        /* PHASE & OBJECTIVES BOXES */
        .phase-box, .objectives-box, .info-box, .autoimmune-box {
            background: #f0f9ff;
            border-radius: 12px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #b9e6fe;
        }
        .phase-box { background: #f8fafc; border-color: #e2e8f0; }
        .autoimmune-box { background: #f0fdf4; border-color: #bbf7d0; }
        .objectives-box { background: #faf5ff; border-color: #e9d5ff; }
        
        .phase-box h3, .objectives-box h3, .info-box h4, .autoimmune-box h4 { margin: 0 0 16px 0; color: #722F37; }

        /* GRIDS & CARDS (Comparison, Features, Disease, Principles) */
        .comparison-grid, .feature-grid, .disease-grid, .stats-grid, .terms-grid, .toolkit-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 24px;
            margin: 32px 0;
        }
        
        .comparison-card, .feature-card, .disease-card, .principle-card, .toolkit-item, .stat-item, .term-item, .diagram-box {
            background: white;
            padding: 24px;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .comparison-card.conventional { border-top: 4px solid #ef4444; }
        .comparison-card.functional { border-top: 4px solid #22c55e; }
        
        .card-label, .principle-title, .box-label { 
            font-weight: 700; color: #722F37; text-transform: uppercase; letter-spacing: 0.5px; font-size: 13px; margin-bottom: 8px; display: block;
        }
        
        .stat-number { font-size: 48px; font-weight: 800; color: #B8860B; margin: 0; line-height: 1; }
        .stat-label { margin-top: 8px; font-size: 15px; font-weight: 600; }

        /* TIMELINE VISUAL */
        .timeline-visual {
            display: flex;
            gap: 24px;
            margin: 40px 0;
        }
        .timeline-item { flex: 1; background: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #cbd5e1; }
        .timeline-badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-weight: 700; font-size: 12px; margin-bottom: 8px; }
        .timeline-badge.then { background: #94a3b8; color: white; }
        .timeline-badge.now { background: #B8860B; color: white; }

        /* ALERT BOXES */
        .alert-box {
            padding: 24px;
            border-radius: 12px;
            margin: 32px 0;
            border-left: 4px solid;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
        }
        .alert-box .alert-label {
            font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; margin-bottom: 8px; display: block;
        }
        .alert-box p { margin: 0; font-size: 16px; }
        .alert-box.success, .coaching-box { background: #f0fdf4; border-color: #22c55e; border-left: 4px solid #22c55e; }
        .alert-box.success .alert-label, .coaching-box h3 { color: #166534; }
        
        .alert-box.warning { background: #fffbeb; border-color: #f59e0b; }
        .alert-box.warning .alert-label { color: #92400e; }
        
        .alert-box.info, .alert-box.reflect, .check-understanding { background: #faf5ff; border-color: #a855f7; border-left: 4px solid #a855f7; }
        .alert-box.info .alert-label, .check-understanding .box-label { color: #7e22ce; }

        /* CASE STUDY DETAILS */
        .case-study-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 16px; }
        .case-study-icon { width: 48px; height: 48px; background: #fdf2f8; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #722F37; }
        .patient-profile { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; background: #fff; padding: 16px; border-radius: 12px; border: 1px solid #e5e7eb; }
        .patient-avatar { font-size: 32px; background: #f3f4f6; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 50%; }
        .patient-info h4 { margin: 0; color: #722F37; font-size: 16px; font-weight: 700; }
        .patient-info p { margin: 0; font-size: 14px; color: #6b7280; }

        /* DIAGRAMS */
        .diagram-box { text-align: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 32px; border-radius: 16px; margin: 32px 0; }
        .diagram-title { font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 24px; font-size: 14px; }
        .diagram-content { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .diagram-arrow { font-size: 24px; color: #94a3b8; margin: 0; line-height: 1; }
        .diagram-emphasis { color: #b91c1c; font-weight: 700; background: #fef2f2; padding: 4px 12px; border-radius: 4px; border: 1px solid #fecaca; }
        .diagram-final { font-weight: 700; color: #1e293b; background: white; padding: 12px 24px; border-radius: 8px; border: 1px solid #cbd5e1; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }

        /* KEY TERMS SPECIFIC */
        .key-terms-box { margin-top: 48px; }
        .term { font-weight: 700; color: #722F37; margin-bottom: 8px; font-size: 16px; }
        .definition { font-size: 14px; color: #4b5563; line-height: 1.6; margin: 0; }
        
        /* STATS BOX WRAPPER */
        .stats-box { background: #fffcee; padding: 32px; border-radius: 16px; border: 1px solid #fef3c7; margin: 32px 0; }

        /* ANALOGY BOXES */
        .analogy-box { display: flex; flex-direction: column; gap: 16px; margin: 32px 0; }
        .analogy-item { display: flex; align-items: flex-start; gap: 16px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
        .analogy-icon { font-size: 28px; flex-shrink: 0; }
        .analogy-item p { margin: 0; font-size: 16px; }

        /* ICEBERG DIAGRAM */
        .iceberg-box { margin: 32px 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; }
        .iceberg-above { background: #e0f2fe; padding: 24px; text-align: center; }
        .iceberg-above h4 { margin: 0 0 8px 0; color: #0369a1; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        .iceberg-above p { margin: 0; font-size: 18px; font-weight: 600; color: #0c4a6e; }
        .iceberg-above .small { font-size: 13px; color: #64748b; font-weight: 400; margin-top: 4px; }
        .iceberg-divider { height: 4px; background: linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9); }
        .iceberg-below { background: linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%); padding: 32px; text-align: center; }
        .iceberg-below h4 { margin: 0 0 8px 0; color: #7dd3fc; font-size: 12px; letter-spacing: 1px; text-transform: uppercase; }
        .iceberg-below p { margin: 0; font-size: 18px; font-weight: 600; color: #ffffff; }
        .iceberg-below .small { font-size: 13px; color: #94a3b8; font-weight: 400; margin-top: 4px; }

        /* TAGS BOX (Grid) */
        .tags-box { margin: 32px 0; }
        .tags-title { font-weight: 700; color: #722F37; margin-bottom: 16px; font-size: 16px; text-transform: uppercase; letter-spacing: 0.5px; }
        .tags-grid { display: flex; flex-wrap: wrap; gap: 12px; }
        .tags-grid .tag { padding: 8px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; border: 1px solid; }

        /* PRINCIPLES BOX */
        .principles-box { margin: 32px 0; display: flex; flex-direction: column; gap: 16px; }
        .principle-item { background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
        .principle-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #9ca3af; margin-bottom: 4px; }
        .principle-item .principle-title { font-size: 18px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0; }
        .principle-desc { font-size: 14px; color: #6b7280; margin: 0; }
        .hl { background: linear-gradient(120deg, #fef3c7 0%, #fef3c7 100%); padding: 0 4px; border-radius: 2px; }

        /* STEPS BOX */
        .steps-box { margin: 32px 0; display: flex; flex-direction: column; gap: 16px; }
        .step-item { display: flex; align-items: flex-start; gap: 16px; background: #f8fafc; padding: 16px 20px; border-radius: 10px; border: 1px solid #e2e8f0; }
        .step-num { width: 32px; height: 32px; background: #722F37; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; flex-shrink: 0; }
        .step-num.success { background: #22c55e; }
        .step-item p { margin: 0; font-size: 15px; }

        /* DIAGRAM RESULTS GRID */
        .diagram-source { font-weight: 800; font-size: 18px; color: #b91c1c; text-transform: uppercase; letter-spacing: 1px; }
        .diagram-results { display: flex; flex-wrap: wrap; gap: 12px; justify-content: center; margin-top: 16px; }
        .diagram-result { background: white; padding: 12px 20px; border-radius: 8px; border: 1px solid #e5e7eb; font-weight: 600; color: #374151; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }

        /* CHECK YOUR UNDERSTANDING - INTERACTIVE */
        .check-understanding { background: #faf5ff; border: 1px solid #e9d5ff; border-left: 4px solid #a855f7; padding: 24px; border-radius: 12px; margin: 32px 0; }
        .check-understanding .box-label { color: #7e22ce; }
        .question-item { background: white; padding: 20px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #f3e8ff; }
        .question-number { display: inline-block; background: #a855f7; color: white; width: 24px; height: 24px; border-radius: 50%; text-align: center; line-height: 24px; font-size: 14px; margin-right: 8px; font-weight: 700; }
        .question-text { font-weight: 600; color: #4b5563; margin: 0 0 12px 0; display: inline; }
        
        .reveal-btn {
            background: white; border: 1px solid #d8b4fe; color: #7e22ce; padding: 8px 16px; border-radius: 20px;
            font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; display: block;
        }
        .reveal-btn:hover { background: #f3e8ff; }
        
        .answer-text { 
            display: none; /* Hidden by default */
            margin-top: 12px; padding-top: 12px; border-top: 1px solid #f3e8ff; color: #4b5563; font-size: 15px;
        }
        .answer-text.show { display: block !important; animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }

        /* TABLES */
        table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 30px 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
        thead tr { background: #722F37; color: white; }
        th { padding: 16px 20px; text-align: left; font-weight: 600; font-size: 15px; }
        td { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; font-size: 15px; }
        tr:last-child td { border-bottom: none; }
        tbody tr:nth-child(even) { background: #f9fafb; }

        /* KEY TAKEAWAYS & REFS */
        .takeaways-box, .key-takeaways {
            background: #f8fafc;
            border-radius: 16px;
            padding: 32px;
            margin-top: 48px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            border: 1px solid #e2e8f0;
        }
        .takeaways-box .box-label, .key-takeaways h3 {
            color: #722F37; font-size: 18px; font-weight: 700; margin: 0 0 20px 0; display: block; text-transform: uppercase; letter-spacing: 1px;
        }
        
        .tags-container .tags-wrapper { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag { background: #e5e7eb; padding: 4px 12px; border-radius: 16px; font-size: 14px; font-weight: 500; color: #374151; }

        /* REFERENCES */
        .references-box, .references {
            border-top: 1px solid #e5e7eb; margin-top: 60px; padding-top: 40px; color: #6b7280; font-size: 14px;
        }
        .references-box ol, .references ol { padding-left: 20px; margin: 0; }
        .references-box h3, .references h3 { font-size: 16px; color: #9ca3af; text-transform: uppercase; margin-bottom: 16px; }

        /* HIDE LEGACY ELEMENTS */
        .brand-header, .lesson-footer, .toc-box { display: none !important; }

        /* Responsive */
        @media (max-width: 768px) {
            body { padding: 20px 16px; }
            .module-header-card { padding: 30px 20px; }
            .lesson-title { font-size: 28px; }
            .timeline-visual { flex-direction: column; }
        }
`;

function transformToCardLayout(htmlContent: string, filename: string): string {
    // Extract title
    const titleMatch = htmlContent.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : 'Lesson';

    // Extract module label
    const moduleLabelMatch = htmlContent.match(/<p class="module-label">([^<]+)<\/p>/i);
    const moduleLabel = moduleLabelMatch ? moduleLabelMatch[1].trim() : 'Module';

    // Extract lesson title
    let lessonTitle = title;
    // Try h1 with class first
    const h1ClassMatch = htmlContent.match(/<h1 class="lesson-title">([^<]+)<\/h1>/i);
    if (h1ClassMatch) {
        lessonTitle = h1ClassMatch[1].trim();
    } else {
        // Fallback to any h1
        const h1Match = htmlContent.match(/<h1[^>]*>([^<]+)<\/h1>/i);
        if (h1Match) lessonTitle = h1Match[1].trim();
    }

    // Extract meta items
    const metaItems: string[] = [];
    const metaMatches = htmlContent.matchAll(/<span class="meta-item">([^<]+)<\/span>/gi);
    for (const match of metaMatches) {
        metaItems.push(match[1].trim());
    }

    // Extract body content
    let bodyContent = '';
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        bodyContent = bodyMatch[1];

        // Remove brand-header (always empty placeholder)
        bodyContent = bodyContent.replace(/<div class="brand-header">[\s\S]*?<\/div>/gi, '');

        // Remove module/lesson headers (Legacy & Module 1 variants)
        bodyContent = bodyContent.replace(/<header class="module-header">[\s\S]*?<\/header>/gi, '');
        bodyContent = bodyContent.replace(/<div class="lesson-header">[\s\S]*?<\/div>/gi, '');

        // Remove footer
        bodyContent = bodyContent.replace(/<footer class="lesson-footer">[\s\S]*?<\/footer>/gi, '');
        bodyContent = bodyContent.replace(/<div class="lesson-footer">[\s\S]*?<\/div>/gi, '');

        // IDEMPOTENCY: Remove existing card-layout wrappers (from previous runs)
        bodyContent = bodyContent.replace(/<div class="lesson-wrapper">/gi, '');
        bodyContent = bodyContent.replace(/<div class="module-header-card">[\s\S]*?<\/div>\s*<\/div>/gi, ''); // Remove entire header card block

        // Remove wrapper div (lesson-container)
        bodyContent = bodyContent.replace(/<div class="lesson-container">/gi, '');

        // Clean leading/trailing whitespace & lingering div tags
        bodyContent = bodyContent.trim();
        // Safe trailing div removal: only if it ends with /div and we suspect it's the wrapper
        // Since we removed 'lesson-container', we probably have an extra </div> at the end.
        // We will remove exactly ONE trailing </div> if present.
        if (bodyContent.endsWith('</div>')) {
            bodyContent = bodyContent.substring(0, bodyContent.length - 6).trim();
        }
    }

    // SAFETY CHECK: If content is too short, we likely failed to extract.
    // Throw error to NOT overwrite the file.
    if (bodyContent.length < 50) {
        throw new Error(`Extraction failed for ${filename}: Content too short (${bodyContent.length} chars). Aborting to prevent data loss.`);
    }

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

// Parse lesson filename to get module and lesson order
function parseFilename(filename: string): { moduleOrder: number; lessonOrder: number; title: string } | null {
    // Pattern: Lesson_X.Y_Title.html
    const match = filename.match(/Lesson_(\d+)\.(\d+)_(.+)\.html$/);
    if (!match) return null;

    const [, moduleNum, lessonNum, titleRaw] = match;
    return {
        moduleOrder: parseInt(moduleNum, 10),
        lessonOrder: parseInt(lessonNum, 10),
        title: titleRaw.replace(/_/g, ' ')
    };
}

async function main() {
    console.log("🚀 Batch Converting FM Lessons to Card Layout\n");
    console.log("=".repeat(50) + "\n");

    // Get the FM course
    const course = await prisma.course.findFirst({
        where: { slug: COURSE_SLUG },
        include: {
            modules: {
                orderBy: { order: 'asc' },
                include: {
                    lessons: { orderBy: { order: 'asc' } }
                }
            }
        }
    });

    if (!course) {
        console.error("❌ Course not found!");
        return;
    }

    console.log(`Found course: ${course.title}\n`);

    // Get all module folders
    const moduleFolders = fs.readdirSync(FM_UPDATE_PATH)
        .filter(f => f.startsWith("Module_") && fs.statSync(path.join(FM_UPDATE_PATH, f)).isDirectory())
        .sort((a, b) => {
            const numA = parseInt(a.replace("Module_", ""), 10);
            const numB = parseInt(b.replace("Module_", ""), 10);
            return numA - numB;
        });

    console.log(`Found ${moduleFolders.length} module folders\n`);

    let totalConverted = 0;
    let totalSynced = 0;
    let errors: string[] = [];

    for (const moduleFolder of moduleFolders) {
        const modulePath = path.join(FM_UPDATE_PATH, moduleFolder);
        const moduleNum = parseInt(moduleFolder.replace("Module_", ""), 10);

        console.log(`\n📁 Processing ${moduleFolder}...`);

        // Find matching db module
        const dbModule = course.modules.find(m => m.order === moduleNum);
        if (!dbModule) {
            console.log(`   ⚠️ No matching DB module for order ${moduleNum}`);
            continue;
        }

        // Get all HTML files in the module
        const htmlFiles = fs.readdirSync(modulePath)
            .filter(f => f.endsWith('.html'))
            .sort();

        for (const htmlFile of htmlFiles) {
            const filePath = path.join(modulePath, htmlFile);
            const parsed = parseFilename(htmlFile);

            if (!parsed) {
                console.log(`   ⚠️ Could not parse: ${htmlFile}`);
                continue;
            }

            try {
                // Read original file
                const originalContent = fs.readFileSync(filePath, 'utf-8');

                // Transform to card layout
                const cardContent = transformToCardLayout(originalContent, htmlFile);

                // Overwrite file on disk
                fs.writeFileSync(filePath, cardContent, 'utf-8');
                totalConverted++;
                console.log(`   ✅ Converted: ${htmlFile}`);

                // Find matching lesson in DB
                const dbLesson = dbModule.lessons.find(l => l.order === parsed.lessonOrder);

                if (dbLesson) {
                    // Update database
                    await prisma.lesson.update({
                        where: { id: dbLesson.id },
                        data: { content: cardContent }
                    });
                    totalSynced++;
                    console.log(`      📤 Synced to DB: ${dbLesson.id}`);
                } else {
                    console.log(`      ⚠️ No matching lesson in DB for order ${parsed.lessonOrder}`);
                }

            } catch (err) {
                const error = `Error processing ${htmlFile}: ${err}`;
                errors.push(error);
                console.log(`   ❌ ${error}`);
            }
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log("\n📊 SUMMARY:");
    console.log(`   Files converted: ${totalConverted}`);
    console.log(`   Lessons synced to DB: ${totalSynced}`);
    console.log(`   Errors: ${errors.length}`);

    if (errors.length > 0) {
        console.log("\n❌ ERRORS:");
        errors.forEach(e => console.log(`   ${e}`));
    }

    console.log("\n🎉 Done! Restart the dev server and refresh the page.");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

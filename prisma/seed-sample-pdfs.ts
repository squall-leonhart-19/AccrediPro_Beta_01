/**
 * Seed Sample PDF Resources
 *
 * Run with: npx tsx prisma/seed-sample-pdfs.ts
 */

import prisma from "../src/lib/prisma";

async function main() {
    console.log("Seeding sample PDF resources...\n");

    // Find a published lesson to attach resources to
    const lesson = await prisma.lesson.findFirst({
        where: {
            isPublished: true,
            module: {
                isPublished: true,
                course: {
                    isPublished: true,
                },
            },
        },
        include: {
            module: {
                include: {
                    course: true,
                },
            },
        },
    });

    if (!lesson) {
        console.log("No published lesson found. Creating resources requires at least one published lesson.");
        return;
    }

    console.log(`Found lesson: "${lesson.title}"`);
    console.log(`Module: "${lesson.module.title}"`);
    console.log(`Course: "${lesson.module.course.title}"\n`);

    // Sample PDF resources (using real publicly accessible sample PDFs)
    const samplePDFs = [
        {
            title: "Client Assessment Worksheet",
            type: "PDF" as const,
            url: "https://www.w3.org/WAI/WCAG21/Techniques/pdf/img/table-word.pdf",
            size: 245000, // ~245KB
            lessonId: lesson.id,
        },
        {
            title: "Gut Health Protocol Template",
            type: "PDF" as const,
            url: "https://www.africau.edu/images/default/sample.pdf",
            size: 512000, // ~512KB
            lessonId: lesson.id,
        },
        {
            title: "Elimination Diet Food List",
            type: "PDF" as const,
            url: "https://www.orimi.com/pdf-test.pdf",
            size: 180000, // ~180KB
            lessonId: lesson.id,
        },
    ];

    // Check if resources already exist
    const existingResources = await prisma.lessonResource.findMany({
        where: {
            lessonId: lesson.id,
            title: {
                in: samplePDFs.map(p => p.title),
            },
        },
    });

    if (existingResources.length > 0) {
        console.log(`Found ${existingResources.length} existing resources. Skipping duplicates.`);
    }

    // Filter out existing resources
    const existingTitles = existingResources.map(r => r.title);
    const newPDFs = samplePDFs.filter(p => !existingTitles.includes(p.title));

    if (newPDFs.length === 0) {
        console.log("All sample PDFs already exist. Nothing to add.");
        return;
    }

    // Create new resources
    const created = await prisma.lessonResource.createMany({
        data: newPDFs,
    });

    console.log(`Created ${created.count} new PDF resources!\n`);

    // List all resources for this lesson
    const allResources = await prisma.lessonResource.findMany({
        where: { lessonId: lesson.id },
        orderBy: { createdAt: "desc" },
    });

    console.log("Current resources for this lesson:");
    allResources.forEach((r, i) => {
        console.log(`  ${i + 1}. ${r.title} (${r.type})`);
    });

    console.log("\nDone!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

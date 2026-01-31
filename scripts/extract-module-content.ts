import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import * as fs from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function extractModule1Content() {
    console.log("🔍 Finding Functional Medicine Complete Certification...\n");

    const course = await prisma.course.findUnique({
        where: { slug: "functional-medicine-complete-certification" },
        select: { id: true, title: true, slug: true },
    });

    if (!course) {
        console.log("❌ Course not found");
        return;
    }

    console.log(`✅ Found course: ${course.title}\n`);

    // Find Module 1: Functional Medicine Foundations (usually order 2, after Welcome Module 0)
    const modules = await prisma.module.findMany({
        where: { courseId: course.id },
        orderBy: { order: "asc" },
        include: {
            lessons: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                select: {
                    order: true,
                    title: true,
                    description: true,
                    content: true,
                    lessonType: true,
                    videoDuration: true,
                },
            },
        },
    });

    console.log(`Found ${modules.length} modules:\n`);
    for (const m of modules) {
        console.log(`  - Order ${m.order}: ${m.title} (${m.lessons.length} lessons)`);
    }

    // Find Module 1 (Functional Medicine Foundations)
    const module1 = modules.find(m =>
        m.title.toLowerCase().includes("functional medicine foundations") ||
        m.order === 2 // Module 1 is typically order 2 (after Module 0: Welcome)
    );

    if (!module1) {
        console.log("\n❌ Module 1 not found");
        return;
    }

    console.log(`\n✅ Extracting: ${module1.title}`);
    console.log(`   Lessons: ${module1.lessons.length}\n`);

    // Build the content
    let output = `# ${module1.title}\n\n`;
    output += `${module1.description || ""}\n\n`;
    output += `${"=".repeat(80)}\n\n`;

    for (const lesson of module1.lessons) {
        output += `## Lesson ${lesson.order}: ${lesson.title}\n\n`;

        if (lesson.description) {
            output += `**Description:** ${lesson.description}\n\n`;
        }

        if (lesson.videoDuration) {
            const mins = Math.round(lesson.videoDuration / 60);
            output += `**Duration:** ${mins} minutes | **Type:** ${lesson.lessonType}\n\n`;
        }

        if (lesson.content) {
            output += `### Full Content:\n\n`;
            output += `${lesson.content}\n\n`;
        } else {
            output += `(No text content available - may be video-only lesson)\n\n`;
        }

        output += `${"=".repeat(80)}\n\n`;
    }

    // Write to file
    const filePath = "/Users/pochitino/Desktop/accredipro-lms/module-1-full-content.txt";
    fs.writeFileSync(filePath, output, "utf-8");
    console.log(`✅ Content written to: ${filePath}`);
    console.log(`   Total characters: ${output.length}`);
}

extractModule1Content()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

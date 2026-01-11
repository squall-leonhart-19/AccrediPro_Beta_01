import prisma from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

/**
 * FORCE UPDATE script - updates ALL lessons with HTML content (even if they already have content)
 */

const COURSE_SLUG = "functional-medicine-complete-certification";
const FM_UPDATE_PATH = path.join(process.cwd(), "FM", "FM-Update");

function normalizeTitle(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");
}

function findHtmlFile(moduleFolder: string, lessonOrder: number, lessonTitle: string): string | null {
    if (!fs.existsSync(moduleFolder)) {
        return null;
    }

    const files = fs.readdirSync(moduleFolder).filter((f) => f.endsWith(".html"));
    const moduleNum = path.basename(moduleFolder).replace("Module_", "");
    const lessonPattern = `Lesson_${moduleNum}.${lessonOrder}`;

    let matchedFile = files.find((f) => f.startsWith(lessonPattern));

    if (!matchedFile) {
        const normalizedLessonTitle = normalizeTitle(lessonTitle);
        matchedFile = files.find((f) => {
            const normalizedFileName = normalizeTitle(f.replace(".html", ""));
            return normalizedFileName.includes(normalizedLessonTitle) || normalizedLessonTitle.includes(normalizedFileName.split("_").slice(2).join("_"));
        });
    }

    if (!matchedFile) {
        const titleWords = lessonTitle.toLowerCase().split(" ").filter((w) => w.length > 3);
        matchedFile = files.find((f) => {
            const fileName = f.toLowerCase();
            return titleWords.filter((w) => fileName.includes(w)).length >= Math.min(2, titleWords.length);
        });
    }

    return matchedFile ? path.join(moduleFolder, matchedFile) : null;
}

async function forceUpdateFMLessonContent() {
    console.log("🔄 FORCE UPDATING FM Certification Lesson Content...\n");

    const course = await prisma.course.findFirst({
        where: { slug: COURSE_SLUG },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    lessons: {
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });

    if (!course) {
        console.error(`❌ Course not found: ${COURSE_SLUG}`);
        process.exit(1);
    }

    console.log(`📚 Found course: ${course.title}`);
    console.log(`   ${course.modules.length} modules, ${course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons\n`);

    let totalUpdated = 0;
    let totalMissing = 0;

    for (const module of course.modules) {
        if (module.order === 21) {
            console.log(`\n📝 Module ${module.order}: ${module.title} (Final Exam - skipping)`);
            continue;
        }

        const moduleFolder = path.join(FM_UPDATE_PATH, `Module_${String(module.order).padStart(2, "0")}`);
        console.log(`\n📝 Module ${module.order}: ${module.title}`);

        for (const lesson of module.lessons) {
            const htmlFile = findHtmlFile(moduleFolder, lesson.order, lesson.title);

            if (htmlFile && fs.existsSync(htmlFile)) {
                const content = fs.readFileSync(htmlFile, "utf-8");

                await prisma.lesson.update({
                    where: { id: lesson.id },
                    data: { content },
                });

                console.log(`   ✅ Lesson ${lesson.order}: ${lesson.title.substring(0, 40)}... (${content.length} chars)`);
                totalUpdated++;
            } else {
                console.log(`   ❌ Lesson ${lesson.order}: ${lesson.title} (no HTML file found)`);
                totalMissing++;
            }
        }
    }

    console.log("\n✨ FORCE UPDATE complete!");
    console.log(`   Updated: ${totalUpdated} lessons`);
    console.log(`   Missing: ${totalMissing} lessons`);
}

forceUpdateFMLessonContent()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());

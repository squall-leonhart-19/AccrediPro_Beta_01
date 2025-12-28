import { PrismaClient, Difficulty } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs/promises";
import path from "path";
import "dotenv/config";

// Initialize Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Configuration
const CONFIG = {
    COURSES_ROOT: "/Users/pochitino/Desktop/accredipro-lms/courses",
    METADATA_FILE: "/Users/pochitino/Desktop/accredipro-lms/docs/launch_steps/certifications.json",
    DEFAULT_COACH_EMAIL: "sarah@accredipro-certificate.com",
};

async function slugify(text: string): Promise<string> {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function main() {
    console.log("🚀 Starting Bulk Import of Certifications...");

    // 1. Read Metadata
    const metadataContent = await fs.readFile(CONFIG.METADATA_FILE, "utf-8");
    const metadata = JSON.parse(metadataContent);
    const certifications = metadata.certifications;

    console.log(`📋 Found ${Object.keys(certifications).length} certifications in metadata.`);

    // 2. Get/Create Coach
    const coach = await prisma.user.findUnique({
        where: { email: CONFIG.DEFAULT_COACH_EMAIL },
    });

    if (!coach) {
        console.warn(`⚠️ Warning: Default coach '${CONFIG.DEFAULT_COACH_EMAIL}' not found. Courses will have no coach.`);
    }

    // 3. Iterate and Import
    for (const key of Object.keys(certifications)) {
        const cert = certifications[key];
        const folderName = cert.folder.replace("/courses/", "").replace("/", ""); // clean up folder path
        const fullFolderPath = path.join(CONFIG.COURSES_ROOT, folderName);

        console.log(`\n---------------------------------------------------`);
        console.log(`📦 Processing: ${cert.name}`);
        console.log(`📂 Folder: ${fullFolderPath}`);

        // Check if folder exists
        try {
            await fs.access(fullFolderPath);
        } catch {
            console.log(`❌ Skipped: Folder not found at ${fullFolderPath}. (Maybe not generated yet?)`);
            continue;
        }

        // 3a. Get/Create Category
        let category = await prisma.category.findFirst({
            where: { name: { equals: cert.category, mode: "insensitive" } },
        });

        if (!category) {
            category = await prisma.category.create({
                data: {
                    name: cert.category,
                    slug: await slugify(cert.category),
                    description: `Courses in ${cert.category}`,
                    isActive: true,
                },
            });
            console.log(`✨ Created Category: ${cert.category}`);
        }

        // 3b. Upsert Course
        const courseSlug = cert.products.certification.slug;
        const price = cert.products.certification.price;

        // Default description if none defined in local JSON
        const description = `Become a Certified ${cert.short_name}. Master the ${cert.methodology.full_name} to transform lives.`;

        const courseData = {
            title: cert.name,
            description: description,
            shortDescription: description.substring(0, 200) + "...",
            price: price,
            isFree: false,
            isPublished: true,
            difficulty: Difficulty.INTERMEDIATE,
            // Default to 15 hours (30 modules * 30 min)
            duration: 15 * 60,
            certificateType: "CERTIFICATION" as const,
            categoryId: category.id,
            coachId: coach?.id || null,
            publishedAt: new Date(),
        };

        const course = await prisma.course.upsert({
            where: { slug: courseSlug },
            update: courseData,
            create: {
                slug: courseSlug,
                ...courseData,
            },
        });

        console.log(`✅ Course Upserted: ${course.title} (ID: ${course.id})`);

        // 3c. Scan Modules
        const entries = await fs.readdir(fullFolderPath);
        const moduleFolders = entries
            .filter((f) => f.startsWith("Module_"))
            .sort((a, b) => {
                // Sort by number: Module_1, Module_2, Module_10
                const numA = parseInt(a.replace("Module_", ""));
                const numB = parseInt(b.replace("Module_", ""));
                return numA - numB;
            });

        console.log(`   Found ${moduleFolders.length} modules.`);

        // 3d. Import Modules & Lessons
        for (const modFolder of moduleFolders) {
            const modNum = parseInt(modFolder.replace("Module_", ""));
            const modPath = path.join(fullFolderPath, modFolder);
            const modTitle = `Module ${modNum}`;

            // FIND FIRST (No unique constraint on courseId_order)
            const existingModule = await prisma.module.findFirst({
                where: { courseId: course.id, order: modNum },
            });

            let module;
            const moduleData = {
                title: modTitle,
                description: `Module ${modNum} of ${cert.short_name}`,
                order: modNum,
                isPublished: true,
                courseId: course.id,
            };

            if (existingModule) {
                module = await prisma.module.update({
                    where: { id: existingModule.id },
                    data: moduleData,
                });
            } else {
                module = await prisma.module.create({
                    data: moduleData,
                });
            }

            // 3e. Scan Lessons
            const modEntries = await fs.readdir(modPath);
            const lessonFiles = modEntries
                .filter((f) => f.endsWith(".html"))
                .sort((a, b) => {
                    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
                });

            for (let i = 0; i < lessonFiles.length; i++) {
                const filename = lessonFiles[i];
                const filePath = path.join(modPath, filename);
                const content = await fs.readFile(filePath, "utf-8");

                let cleanTitle = filename.replace(/\.html$/, "");
                cleanTitle = cleanTitle.replace(/^Lesson_\d+\.?\d*_/, "").replace(/_/g, " ");

                // FIND FIRST LESSON
                const existingLesson = await prisma.lesson.findFirst({
                    where: { moduleId: module.id, order: i },
                });

                const lessonData = {
                    title: cleanTitle,
                    description: `Lesson ${i + 1}`,
                    content: content,
                    order: i,
                    isPublished: true,
                    isFreePreview: (modNum === 1 && i === 0),
                    lessonType: "TEXT" as const, // Fix enum type
                    moduleId: module.id
                };

                if (existingLesson) {
                    await prisma.lesson.update({
                        where: { id: existingLesson.id },
                        data: lessonData
                    });
                } else {
                    await prisma.lesson.create({
                        data: lessonData
                    });
                }
            }
            process.stdout.write("."); // Progress dot per module
        }
        console.log(`\n   ✅ Imported ${moduleFolders.length} modules.`);
    }

    console.log("\n🚀 All Imports Completed Successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

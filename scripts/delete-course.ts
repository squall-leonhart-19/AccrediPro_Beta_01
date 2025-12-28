import 'dotenv/config';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function deleteCourse(slug: string) {
    if (!slug) {
        console.error("Please provide a slug as an argument.");
        process.exit(1);
    }

    console.log(`🗑️  Attempting to delete course with slug: ${slug}`);

    const course = await prisma.course.findUnique({
        where: { slug },
    });

    if (!course) {
        console.error(`❌ Course not found: ${slug}`);
        process.exit(1);
    }

    console.log(`✅ Found course: ${course.title} (ID: ${course.id})`);
    console.log("⚠️  Deleting course and all cascading relations (modules, lessons)...");

    // Prisma cascade delete should handle relations if configured, 
    // but we'll delete the course which triggers cascade.
    await prisma.course.delete({
        where: { id: course.id },
    });

    console.log(`🚀 Successfully deleted course: ${course.title}`);
}

const slug = process.argv[2];
deleteCourse(slug)
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

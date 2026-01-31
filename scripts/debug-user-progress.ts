import prisma from "../src/lib/prisma";

async function main() {
    // Find the user
    const user = await prisma.user.findUnique({
        where: { email: "blablarog1234@gmail.com" },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            createdAt: true,
        },
    });

    if (!user) {
        console.log("❌ User not found: blablarog1234@gmail.com");
        return;
    }

    console.log("\n📧 USER:", user.email);
    console.log("   ID:", user.id);
    console.log("   Name:", user.firstName, user.lastName);
    console.log("   Created:", user.createdAt);

    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
            course: {
                select: { id: true, title: true, slug: true },
            },
        },
    });

    console.log("\n📚 ENROLLMENTS:", enrollments.length);
    for (const e of enrollments) {
        console.log(`   - ${e.course.title} (${e.progress}%)`);
    }

    // Get lesson progress
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: { userId: user.id },
        include: {
            lesson: {
                select: {
                    id: true,
                    title: true,
                    order: true,
                    module: {
                        select: { id: true, title: true, order: true },
                    },
                },
            },
        },
        orderBy: { completedAt: "asc" },
    });

    console.log("\n✅ COMPLETED LESSONS:", lessonProgress.filter(lp => lp.completed).length);

    // Group by module
    const byModule: Record<string, typeof lessonProgress> = {};
    for (const lp of lessonProgress) {
        const moduleTitle = lp.lesson.module?.title || "Unknown";
        if (!byModule[moduleTitle]) byModule[moduleTitle] = [];
        byModule[moduleTitle].push(lp);
    }

    for (const [moduleTitle, lessons] of Object.entries(byModule)) {
        const completed = lessons.filter(l => l.completed).length;
        console.log(`\n   📦 ${moduleTitle}: ${completed}/${lessons.length} completed`);
        for (const lp of lessons.sort((a, b) => (a.lesson.order || 0) - (b.lesson.order || 0))) {
            console.log(`      ${lp.completed ? "✅" : "⬜"} ${lp.lesson.title}`);
        }
    }

    // Get certificates
    const certificates = await prisma.certificate.findMany({
        where: { userId: user.id },
        include: {
            course: { select: { title: true } },
        },
    });

    console.log("\n🎓 CERTIFICATES:", certificates.length);
    for (const cert of certificates) {
        console.log(`   - ${cert.course?.title || cert.type} (${cert.type}) - ${cert.createdAt}`);
    }

    // Check module certificates specifically
    const moduleCerts = await prisma.certificate.findMany({
        where: {
            userId: user.id,
            type: "MODULE",
        },
    });
    console.log("\n📜 MODULE CERTIFICATES:", moduleCerts.length);

    // Check if all lessons in Module 1 are complete
    const module1 = await prisma.module.findFirst({
        where: {
            order: 1,
            course: {
                enrollments: {
                    some: { userId: user.id },
                },
            },
        },
        include: {
            lessons: {
                select: { id: true, title: true, order: true },
                orderBy: { order: "asc" },
            },
            course: { select: { id: true, title: true } },
        },
    });

    if (module1) {
        console.log("\n🔍 MODULE 1 ANALYSIS:");
        console.log(`   Course: ${module1.course.title}`);
        console.log(`   Module: ${module1.title}`);
        console.log(`   Total Lessons: ${module1.lessons.length}`);

        for (const lesson of module1.lessons) {
            const progress = lessonProgress.find(lp => lp.lessonId === lesson.id);
            console.log(`   ${progress?.completed ? "✅" : "⬜"} Lesson ${lesson.order}: ${lesson.title}`);
        }

        const completedInModule1 = module1.lessons.filter(l =>
            lessonProgress.some(lp => lp.lessonId === l.id && lp.completed)
        ).length;

        console.log(`\n   Result: ${completedInModule1}/${module1.lessons.length} lessons complete`);

        if (completedInModule1 === module1.lessons.length) {
            console.log("   ✅ Module 1 IS COMPLETE - Certificate should exist!");
        } else {
            console.log("   ❌ Module 1 NOT COMPLETE - Need to finish all lessons");
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

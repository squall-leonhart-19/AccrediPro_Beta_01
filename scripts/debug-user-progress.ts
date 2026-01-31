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

    console.log("\n✅ COMPLETED LESSONS:", lessonProgress.filter(lp => lp.isCompleted).length);
    console.log("📝 TOTAL LESSON PROGRESS RECORDS:", lessonProgress.length);

    // Group by module
    const byModule: Record<string, typeof lessonProgress> = {};
    for (const lp of lessonProgress) {
        const moduleTitle = lp.lesson.module?.title || "Unknown";
        if (!byModule[moduleTitle]) byModule[moduleTitle] = [];
        byModule[moduleTitle].push(lp);
    }

    for (const [moduleTitle, lessons] of Object.entries(byModule)) {
        const completed = lessons.filter(l => l.isCompleted).length;
        console.log(`\n   📦 ${moduleTitle}: ${completed}/${lessons.length} completed`);
        for (const lp of lessons.sort((a, b) => (a.lesson.order || 0) - (b.lesson.order || 0))) {
            console.log(`      ${lp.isCompleted ? "✅" : "⬜"} ${lp.lesson.title}`);
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
        console.log(`   - ${cert.course?.title || cert.type} (${cert.type}) - ${cert.issuedAt}`);
    }

    // Check module certificates specifically
    const moduleCerts = await prisma.certificate.findMany({
        where: {
            userId: user.id,
            type: "MODULE_COMPLETION",
        },
    });
    console.log("\n📜 MODULE CERTIFICATES:", moduleCerts.length);

    // Check all modules in enrolled courses
    for (const enrollment of enrollments) {
        const modules = await prisma.module.findMany({
            where: { courseId: enrollment.courseId },
            include: {
                lessons: {
                    where: { isPublished: true },
                    select: { id: true, title: true, order: true },
                    orderBy: { order: "asc" },
                },
            },
            orderBy: { order: "asc" },
        });

        console.log(`\n\n🔍 COURSE: ${enrollment.course.title}`);
        console.log("=".repeat(50));

        for (const mod of modules) {
            const completedInModule = mod.lessons.filter(l =>
                lessonProgress.some(lp => lp.lessonId === l.id && lp.isCompleted)
            ).length;

            const isComplete = completedInModule === mod.lessons.length && mod.lessons.length > 0;
            const icon = isComplete ? "✅" : "⏳";

            console.log(`\n   ${icon} Module ${mod.order}: ${mod.title}`);
            console.log(`      Progress: ${completedInModule}/${mod.lessons.length} lessons`);

            for (const lesson of mod.lessons) {
                const progress = lessonProgress.find(lp => lp.lessonId === lesson.id);
                console.log(`         ${progress?.isCompleted ? "✅" : "⬜"} Lesson ${lesson.order}: ${lesson.title}`);
            }

            if (isComplete) {
                // Check if module certificate exists
                const modCert = await prisma.certificate.findFirst({
                    where: {
                        userId: user.id,
                        courseId: enrollment.courseId,
                        moduleId: mod.id,
                        type: "MODULE_COMPLETION",
                    },
                });

                if (modCert) {
                    console.log(`      🎓 Certificate: ${modCert.certificateNumber}`);
                } else {
                    console.log(`      ❌ NO CERTIFICATE FOUND - SHOULD EXIST!`);
                }
            }
        }
    }

    // Check learning time
    const streak = await prisma.userStreak.findUnique({
        where: { userId: user.id },
    });
    console.log("\n⏱️ STREAK DATA:");
    if (streak) {
        console.log(`   Current Streak: ${streak.currentStreak} days`);
        console.log(`   Longest Streak: ${streak.longestStreak} days`);
        console.log(`   Total Points: ${streak.totalPoints}`);
        console.log(`   Last Active: ${streak.lastActiveAt}`);
    } else {
        console.log("   No streak data found");
    }

    // Check module progress table
    const moduleProgress = await prisma.moduleProgress.findMany({
        where: { userId: user.id },
        include: {
            module: { select: { title: true, order: true } },
        },
    });
    console.log("\n📊 MODULE PROGRESS RECORDS:");
    for (const mp of moduleProgress) {
        console.log(`   - Module ${mp.module.order}: ${mp.module.title} - isCompleted: ${mp.isCompleted} - completedAt: ${mp.completedAt}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

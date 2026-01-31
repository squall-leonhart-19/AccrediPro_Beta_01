import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    // Find the user
    const user = await prisma.user.findUnique({
        where: { email: 'blablarog1234@gmail.com' },
        select: { id: true, firstName: true, email: true }
    });

    if (!user) {
        console.log('User not found');
        return;
    }

    console.log('=== USER ===');
    console.log(user);

    // Get enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: { course: { select: { id: true, title: true, slug: true } } }
    });
    console.log('\n=== ENROLLMENTS ===');
    console.log(JSON.stringify(enrollments, null, 2));

    // Get module progress
    const moduleProgress = await prisma.moduleProgress.findMany({
        where: { userId: user.id },
        include: { module: { select: { id: true, title: true, order: true, courseId: true } } }
    });
    console.log('\n=== MODULE PROGRESS ===');
    console.log(JSON.stringify(moduleProgress, null, 2));

    // Get certificates
    const certs = await prisma.certificate.findMany({
        where: { userId: user.id }
    });
    console.log('\n=== CERTIFICATES ===');
    console.log(JSON.stringify(certs, null, 2));

    // Get lesson progress for Module 1
    const fmCourse = enrollments.find(e => e.course.slug.includes('functional-medicine'));
    if (fmCourse) {
        const modules = await prisma.module.findMany({
            where: { courseId: fmCourse.courseId },
            include: { lessons: { select: { id: true, title: true } } },
            orderBy: { order: 'asc' }
        });

        console.log('\n=== FM COURSE MODULES ===');
        for (const mod of modules) {
            const completed = await prisma.lessonProgress.count({
                where: {
                    userId: user.id,
                    isCompleted: true,
                    lessonId: { in: mod.lessons.map(l => l.id) }
                }
            });
            console.log(`Module ${mod.order}: ${mod.title} - ${completed}/${mod.lessons.length} lessons completed`);
        }
    }

    // Total completed lessons
    const lessonCount = await prisma.lessonProgress.count({
        where: { userId: user.id, isCompleted: true }
    });
    console.log('\n=== TOTAL COMPLETED LESSONS ===');
    console.log(lessonCount);
}

main().catch(console.error).finally(() => prisma.$disconnect());

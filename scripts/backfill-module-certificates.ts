import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function backfillModuleCertificates() {
    console.log("🔍 Finding users with completed modules but missing certificates...\n");

    // Get all enrollments
    const enrollments = await prisma.enrollment.findMany({
        where: { status: "ACTIVE" },
        include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true } },
            course: {
                include: {
                    modules: {
                        where: { isPublished: true },
                        include: {
                            lessons: {
                                where: { isPublished: true },
                                select: { id: true },
                            },
                        },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });

    console.log(`Found ${enrollments.length} active enrollments\n`);

    let totalCreated = 0;
    let totalSkipped = 0;

    for (const enrollment of enrollments) {
        const userId = enrollment.userId;
        const courseId = enrollment.courseId;

        // Get lesson progress for this user
        const lessonProgress = await prisma.lessonProgress.findMany({
            where: {
                userId,
                isCompleted: true,
            },
            select: { lessonId: true },
        });

        const completedLessonIds = new Set(lessonProgress.map(lp => lp.lessonId));

        for (const module of enrollment.course.modules) {
            const lessonIds = module.lessons.map(l => l.id);
            const completedInModule = lessonIds.filter(id => completedLessonIds.has(id)).length;

            if (completedInModule === lessonIds.length && lessonIds.length > 0) {
                // Check if certificate already exists
                const existingCert = await prisma.certificate.findFirst({
                    where: {
                        userId,
                        courseId,
                        moduleId: module.id,
                    },
                });

                if (existingCert) {
                    totalSkipped++;
                    continue;
                }

                // Generate certificate number
                const moduleCode = module.title
                    .split(" ")
                    .map((word) => word[0]?.toUpperCase() || "")
                    .join("")
                    .substring(0, 2)
                    .padEnd(2, "X");
                const order = enrollment.course.modules.findIndex(m => m.id === module.id) + 1;
                const certificateNumber = `AP-${moduleCode}M${order}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

                console.log(`🎓 Creating certificate for ${enrollment.user.email} - Module: ${module.title}`);

                try {
                    const certificate = await prisma.certificate.create({
                        data: {
                            userId,
                            courseId,
                            moduleId: module.id,
                            certificateNumber,
                            type: "MODULE_COMPLETION",
                            issuedAt: new Date(),
                        },
                    });
                    console.log(`   ✅ Created: ${certificate.certificateNumber}`);
                    totalCreated++;
                } catch (error) {
                    console.error(`   ❌ Error: ${error}`);
                }
            }
        }
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log(`🎉 BACKFILL COMPLETE`);
    console.log(`   Created: ${totalCreated} certificates`);
    console.log(`   Skipped: ${totalSkipped} (already exist)`);
}

backfillModuleCertificates()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

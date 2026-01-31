import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function debugCredentialsPage() {
    console.log("🔍 Checking for certificates with null courses...\n");

    // Check for certificates with null course
    const certificatesWithNullCourse = await prisma.certificate.findMany({
        where: {
            courseId: { not: undefined },
        },
        select: {
            id: true,
            certificateNumber: true,
            type: true,
            userId: true,
            courseId: true,
            moduleId: true,
            issuedAt: true,
        },
        take: 50,
    });

    console.log(`Found ${certificatesWithNullCourse.length} certificates`);

    // Now check if courses exist for each
    let missingCourses = 0;
    for (const cert of certificatesWithNullCourse) {
        if (cert.courseId) {
            const course = await prisma.course.findUnique({
                where: { id: cert.courseId },
                select: { id: true, title: true },
            });
            if (!course) {
                console.log(`❌ Missing course for certificate ${cert.id}: courseId=${cert.courseId}`);
                missingCourses++;
            }
        }
    }

    console.log(`\nCertificates with missing courses: ${missingCourses}`);

    // Also check MODULE_COMPLETION type specifically
    const moduleCompletionCerts = await prisma.certificate.findMany({
        where: { type: "MODULE_COMPLETION" },
        include: {
            course: { select: { id: true, title: true } },
            module: { select: { id: true, title: true } },
        },
        take: 20,
    });

    console.log(`\n📋 MODULE_COMPLETION certificates: ${moduleCompletionCerts.length}`);
    for (const cert of moduleCompletionCerts) {
        console.log(`  - ${cert.id}`);
        console.log(`    Course: ${cert.course?.title || "NULL"}`);
        console.log(`    Module: ${cert.module?.title || "NULL"}`);
    }
}

debugCredentialsPage()
    .catch(console.error)
    .finally(() => prisma.$disconnect());

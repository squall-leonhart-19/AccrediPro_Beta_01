import prisma from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate professional certificate ID
// Format: AP-FMCC-2024-A7B2C3
// AP = AccrediPro, FMCC = course code, year, unique ID
export function generateCertificateId(courseSlug: string): string {
    const year = new Date().getFullYear();
    const courseCode = courseSlug
        .split("-")
        .map((word) => word[0]?.toUpperCase() || "")
        .join("")
        .substring(0, 4)
        .padEnd(4, "X");
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `AP-${courseCode}-${year}-${uniqueId}`;
}

// Check if user has completed all lessons in a course
export async function checkCourseCompletion(
    userId: string,
    courseId: string
): Promise<boolean> {
    const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: {
            modules: {
                include: {
                    lessons: true,
                },
            },
        },
    });

    if (!course) return false;

    const totalLessons = course.modules.reduce(
        (acc, module) => acc + module.lessons.length,
        0
    );

    if (totalLessons === 0) return false;

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            lessonId: {
                in: course.modules.flatMap((m) => m.lessons.map((l) => l.id)),
            },
            userId,
            isCompleted: true,
        },
    });

    return completedLessons >= totalLessons;
}

// Create certificate when course is completed
export async function createCertificateOnCompletion(
    userId: string,
    courseId: string
): Promise<{ created: boolean; certificateId?: string }> {
    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
        where: { userId, courseId },
    });

    if (existingCert) {
        return { created: false, certificateId: existingCert.certificateNumber };
    }

    // Check if course is completed
    const isCompleted = await checkCourseCompletion(userId, courseId);
    if (!isCompleted) {
        return { created: false };
    }

    // Get course and user info
    const [course, user] = await Promise.all([
        prisma.course.findUnique({
            where: { id: courseId },
            select: { slug: true, title: true, certificateType: true },
        }),
        prisma.user.findUnique({
            where: { id: userId },
            select: { firstName: true, lastName: true, email: true },
        }),
    ]);

    if (!course || !user) {
        return { created: false };
    }

    // Generate certificate ID
    const certificateNumber = generateCertificateId(course.slug);

    // Create certificate
    const certificate = await prisma.certificate.create({
        data: {
            userId,
            courseId,
            certificateNumber,
            type: course.certificateType || "CERTIFICATION",
            issuedAt: new Date(),
        },
    });

    // Send congratulations email
    const studentName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";

    try {
        await resend.emails.send({
            from: "AccrediPro <info@accredipro-certificate.com>",
            to: user.email,
            subject: `🎓 Congratulations! You've earned your ${course.title} Certificate!`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">🎓 Congratulations!</h1>
          </div>
          <div style="background: #fff; padding: 40px; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 18px; color: #333;">Dear ${studentName},</p>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              We are thrilled to inform you that you have successfully completed the 
              <strong style="color: #722F37;">${course.title}</strong> program!
            </p>
            <div style="background: #f8f4f0; padding: 20px; border-radius: 8px; margin: 24px 0; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">Your Certificate ID:</p>
              <p style="margin: 0; font-family: monospace; font-size: 20px; color: #722F37; font-weight: bold;">
                ${certificateNumber}
              </p>
            </div>
            <p style="font-size: 16px; color: #555; line-height: 1.6;">
              You can view and download your official certificate anytime from your dashboard.
            </p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.NEXTAUTH_URL}/certificates/${certificateNumber}" 
                 style="background: #722F37; color: #fff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                View My Certificate
              </a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 32px;">
              Keep learning, keep growing! 🌟<br>
              <strong>The AccrediPro Team</strong>
            </p>
          </div>
        </div>
      `,
        });
    } catch (error) {
        console.error("Failed to send certificate email:", error);
        // Don't fail the certificate creation if email fails
    }

    return { created: true, certificateId: certificate.certificateNumber };
}

// Create certificate when a module is completed
export async function createModuleCertificate(
    userId: string,
    courseId: string,
    moduleId: string
): Promise<{ created: boolean; certificateId?: string }> {
    // Check if module certificate already exists (unique constraint: userId + courseId + moduleId)
    const existingCert = await prisma.certificate.findFirst({
        where: { userId, courseId, moduleId },
    });

    if (existingCert) {
        return { created: false, certificateId: existingCert.certificateNumber };
    }

    // Get module and course info
    const module = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
            course: {
                select: { slug: true, title: true },
            },
            lessons: {
                where: { isPublished: true },
                select: { id: true },
            },
        },
    });

    if (!module) {
        console.error(`[createModuleCertificate] Module not found: ${moduleId}`);
        return { created: false };
    }

    // Verify all lessons in the module are completed
    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId,
            lessonId: { in: module.lessons.map((l) => l.id) },
            isCompleted: true,
        },
    });

    if (completedLessons < module.lessons.length) {
        console.log(`[createModuleCertificate] Module not complete: ${completedLessons}/${module.lessons.length} lessons`);
        return { created: false };
    }

    // Generate certificate ID with module indicator
    const moduleCode = module.title
        .split(" ")
        .map((word) => word[0]?.toUpperCase() || "")
        .join("")
        .substring(0, 2)
        .padEnd(2, "X");
    const certificateNumber = `AP-${moduleCode}M${module.order}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Create module certificate
    try {
        const certificate = await prisma.certificate.create({
            data: {
                userId,
                courseId,
                moduleId,
                certificateNumber,
                type: "MODULE_COMPLETION",
                issuedAt: new Date(),
            },
        });

        console.log(`[createModuleCertificate] Created certificate ${certificate.certificateNumber} for module ${module.title}`);
        return { created: true, certificateId: certificate.certificateNumber };
    } catch (error) {
        // Handle unique constraint violation (race condition)
        console.error(`[createModuleCertificate] Error creating certificate:`, error);
        return { created: false };
    }
}

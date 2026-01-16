import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Generate unique certificate number
function generateCertificateNumber(prefix: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check admin role
        const adminUser = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (adminUser?.role !== "ADMIN") {
            return NextResponse.json({ error: "Admin access required" }, { status: 403 });
        }

        const { userId, courseId } = await request.json();

        if (!userId || !courseId) {
            return NextResponse.json({ error: "userId and courseId are required" }, { status: 400 });
        }

        // Get the course with all its modules
        const course = await prisma.course.findUnique({
            where: { id: courseId },
            include: {
                modules: {
                    orderBy: { order: "asc" },
                    select: {
                        id: true,
                        title: true,
                        order: true,
                        lessons: {
                            select: { id: true },
                        },
                    },
                },
            },
        });

        if (!course) {
            return NextResponse.json({ error: "Course not found" }, { status: 404 });
        }

        // Check if user is enrolled
        const enrollment = await prisma.enrollment.findUnique({
            where: {
                userId_courseId: { userId, courseId },
            },
        });

        if (!enrollment) {
            return NextResponse.json({ error: "User is not enrolled in this course" }, { status: 400 });
        }

        // Get existing certificates for this user+course
        const existingCerts = await prisma.certificate.findMany({
            where: { userId, courseId },
            select: { moduleId: true },
        });

        const existingModuleIds = new Set(existingCerts.map(c => c.moduleId));
        const hasCourseCert = existingCerts.some(c => c.moduleId === null);

        const createdCerts: { type: string; title: string; certificateNumber: string }[] = [];
        const skippedCerts: string[] = [];

        // Create module certificates (for modules with order > 0)
        for (const module of course.modules) {
            if (module.order === 0) continue; // Skip intro/overview modules

            if (existingModuleIds.has(module.id)) {
                skippedCerts.push(`Module: ${module.title} (already exists)`);
                continue;
            }

            const certNumber = generateCertificateNumber("MD");

            try {
                await prisma.certificate.create({
                    data: {
                        certificateNumber: certNumber,
                        userId,
                        courseId,
                        moduleId: module.id,
                        type: "MINI_DIPLOMA",
                        score: 100,
                        issuedAt: new Date(),
                    },
                });

                createdCerts.push({
                    type: "MINI_DIPLOMA",
                    title: module.title,
                    certificateNumber: certNumber,
                });

                // Also mark module as completed
                await prisma.moduleProgress.upsert({
                    where: {
                        userId_moduleId: { userId, moduleId: module.id },
                    },
                    update: {
                        isCompleted: true,
                        completedAt: new Date(),
                        progress: 100,
                    },
                    create: {
                        userId,
                        moduleId: module.id,
                        isCompleted: true,
                        completedAt: new Date(),
                        progress: 100,
                    },
                });

                // Mark all lessons in module as completed
                for (const lesson of module.lessons) {
                    await prisma.lessonProgress.upsert({
                        where: {
                            lessonId_visitorId: { lessonId: lesson.id, visitorId: userId },
                        },
                        update: {
                            isCompleted: true,
                            completedAt: new Date(),
                            progress: 100,
                        },
                        create: {
                            lessonId: lesson.id,
                            visitorId: userId,
                            userId,
                            isCompleted: true,
                            completedAt: new Date(),
                            progress: 100,
                        },
                    });
                }
            } catch (err: any) {
                if (err.code === "P2002") {
                    skippedCerts.push(`Module: ${module.title} (duplicate key)`);
                } else {
                    console.error(`Error creating cert for module ${module.title}:`, err);
                    skippedCerts.push(`Module: ${module.title} (error: ${err.message})`);
                }
            }
        }

        // Create course certificate if doesn't exist
        if (!hasCourseCert) {
            const courseCertNumber = generateCertificateNumber(course.slug.toUpperCase().slice(0, 4));

            try {
                await prisma.certificate.create({
                    data: {
                        certificateNumber: courseCertNumber,
                        userId,
                        courseId,
                        moduleId: null,
                        type: course.certificateType || "CERTIFICATION",
                        score: 100,
                        issuedAt: new Date(),
                    },
                });

                createdCerts.push({
                    type: "CERTIFICATION",
                    title: course.title,
                    certificateNumber: courseCertNumber,
                });
            } catch (err: any) {
                if (err.code === "P2002") {
                    skippedCerts.push(`Course: ${course.title} (duplicate key)`);
                } else {
                    console.error(`Error creating course cert:`, err);
                    skippedCerts.push(`Course: ${course.title} (error: ${err.message})`);
                }
            }
        } else {
            skippedCerts.push(`Course: ${course.title} (already exists)`);
        }

        // Update enrollment status to completed
        await prisma.enrollment.update({
            where: { id: enrollment.id },
            data: { status: "COMPLETED" },
        });

        return NextResponse.json({
            success: true,
            message: `Created ${createdCerts.length} certificates`,
            created: createdCerts,
            skipped: skippedCerts,
        });
    } catch (error: any) {
        console.error("Unlock certificates error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to unlock certificates" },
            { status: 500 }
        );
    }
}

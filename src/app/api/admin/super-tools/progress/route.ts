import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from 'crypto';

function generateCertificateNumber() {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `AP-${year}${month}-${random}`;
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify Admin
    const adminUser = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    // Super Tools are ADMIN/SUPERUSER only - no SUPPORT access
    if (!adminUser || !["ADMIN", "SUPERUSER"].includes(adminUser.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, courseId, action, moduleId } = await req.json();

    if (!userId || !courseId || !action) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        if (action === "reset_course") {
            // 1. Get Course Structure to identify lessons (needed for granular deletes if relation not direct)
            // Actually, we can delete UserLessonProgress where lesson is in the course.
            // But UserLessonProgress -> Lesson -> Module -> Course
            const lessons = await prisma.lesson.findMany({
                where: {
                    module: {
                        courseId: courseId
                    }
                },
                select: { id: true }
            });

            const lessonIds = lessons.map(l => l.id);

            // Delete Progress
            await prisma.lessonProgress.deleteMany({
                where: {
                    userId: userId,
                    lessonId: { in: lessonIds }
                }
            });

            // Reset Enrollment
            await prisma.enrollment.updateMany({
                where: {
                    userId: userId,
                    courseId: courseId
                },
                data: {
                    progress: 0,
                    status: "ACTIVE",
                    completedAt: null,
                    lastAccessedAt: new Date(),
                }
            });

            // Delete Certificate
            await prisma.certificate.deleteMany({
                where: {
                    userId: userId,
                    courseId: courseId,
                    type: "CERTIFICATION" // Only delete full certs, maybe keep mini diplomas if they are separate?
                    // Actually safer to just delete all certs for this course
                }
            });

            return NextResponse.json({ success: true, message: "Course progress reset" });

        } else if (action === "complete_course") {
            // 1. Get All Lessons
            const lessons = await prisma.lesson.findMany({
                where: {
                    module: { courseId: courseId, isPublished: true },
                    isPublished: true
                },
                select: { id: true }
            });

            const totalLessons = lessons.length;
            const lessonIds = lessons.map(l => l.id);

            // 2. Mark all lessons as complete
            // Upsert is hard in bulk. Delete first or iterate?
            // Iterate is slow but safe. Or createMany with skipDuplicates?
            // UserLessonProgress has @@unique([userId, lessonId])

            // Let's use a transaction
            await prisma.$transaction(async (tx) => {
                // Option 1: Delete existing headers to avoid conflicts
                await tx.lessonProgress.deleteMany({
                    where: {
                        userId: userId,
                        lessonId: { in: lessonIds }
                    }
                });

                // Option 2: Create all fresh
                await tx.lessonProgress.createMany({
                    data: lessonIds.map(id => ({
                        userId,
                        lessonId: id,
                        isCompleted: true,
                        completedAt: new Date()
                    }))
                });

                // 3. Update Enrollment
                await tx.enrollment.updateMany({
                    where: { userId, courseId },
                    data: {
                        progress: 100,
                        status: "COMPLETED",
                        completedAt: new Date(),
                    }
                });

                // 4. Check/Create Certificate
                const existingCert = await tx.certificate.findFirst({
                    where: { userId, courseId, type: "CERTIFICATION" }
                });

                if (!existingCert) {
                    const certNumber = generateCertificateNumber();
                    await tx.certificate.create({
                        data: {
                            userId,
                            courseId,
                            certificateNumber: certNumber,
                            type: "CERTIFICATION",
                            issuedAt: new Date(),
                        }
                    });
                }
            });

            return NextResponse.json({ success: true, message: "Course completed and certificate generated" });

        } else if (action === "complete_to_module") {
            // Complete all lessons up to and including a specific module
            if (!moduleId) {
                return NextResponse.json({ error: "moduleId required for complete_to_module" }, { status: 400 });
            }

            // Get target module order
            const targetModule = await prisma.module.findUnique({
                where: { id: moduleId },
                select: { order: true }
            });

            if (!targetModule) {
                return NextResponse.json({ error: "Module not found" }, { status: 404 });
            }

            // Get ALL modules in course for total count
            const allModules = await prisma.module.findMany({
                where: { courseId, isPublished: true },
                include: {
                    lessons: {
                        where: { isPublished: true },
                        select: { id: true }
                    }
                },
                orderBy: { order: "asc" }
            });

            // Separate into "complete" and "not complete" based on order
            const lessonsToComplete: string[] = [];
            let totalLessons = 0;

            for (const mod of allModules) {
                totalLessons += mod.lessons.length;
                if (mod.order <= targetModule.order) {
                    lessonsToComplete.push(...mod.lessons.map(l => l.id));
                }
            }

            const progress = totalLessons > 0
                ? Math.round((lessonsToComplete.length / totalLessons) * 100)
                : 0;

            await prisma.$transaction(async (tx) => {
                // Delete existing progress for lessons to complete
                await tx.lessonProgress.deleteMany({
                    where: {
                        userId,
                        lessonId: { in: lessonsToComplete }
                    }
                });

                // Create progress records for completed lessons
                if (lessonsToComplete.length > 0) {
                    await tx.lessonProgress.createMany({
                        data: lessonsToComplete.map(id => ({
                            userId,
                            lessonId: id,
                            isCompleted: true,
                            completedAt: new Date()
                        }))
                    });
                }

                // Update enrollment progress
                await tx.enrollment.updateMany({
                    where: { userId, courseId },
                    data: {
                        progress,
                        status: progress === 100 ? "COMPLETED" : "ACTIVE",
                        completedAt: progress === 100 ? new Date() : null,
                    }
                });
            });

            return NextResponse.json({
                success: true,
                message: `Progress set to ${progress}% (${lessonsToComplete.length}/${totalLessons} lessons)`
            });
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 });

    } catch (error) {
        console.error("Super Tools Progress Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

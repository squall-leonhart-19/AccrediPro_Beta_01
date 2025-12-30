import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/users/clone
 * Clone a user account (create new account with same progress)
 * 
 * Body: { 
 *   sourceEmail: "old@email.com",
 *   newEmail: "new@email.com", 
 *   newPassword: "password" 
 * }
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { sourceEmail, newEmail, newPassword } = body;

        if (!sourceEmail || !newEmail || !newPassword) {
            return NextResponse.json({
                error: "sourceEmail, newEmail, and newPassword are required"
            }, { status: 400 });
        }

        // Find source user
        const sourceUser = await prisma.user.findUnique({
            where: { email: sourceEmail.toLowerCase() },
            include: {
                enrollments: true,
                progress: true,
                certificates: true,
                lessonNotes: true,
                quizAttempts: true,
            }
        });

        if (!sourceUser) {
            return NextResponse.json({ error: "Source user not found" }, { status: 404 });
        }

        // Check if new email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: newEmail.toLowerCase() }
        });
        if (existingUser) {
            return NextResponse.json({ error: "New email already exists" }, { status: 400 });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email: newEmail.toLowerCase(),
                passwordHash,
                firstName: sourceUser.firstName,
                lastName: sourceUser.lastName,
                avatar: sourceUser.avatar,
                role: sourceUser.role,
                isActive: true,
            }
        });

        // Clone enrollments
        for (const enrollment of sourceUser.enrollments) {
            await prisma.enrollment.create({
                data: {
                    userId: newUser.id,
                    courseId: enrollment.courseId,
                    status: enrollment.status,
                    enrolledAt: enrollment.enrolledAt,
                    completedAt: enrollment.completedAt,
                    earnedCertificate: enrollment.earnedCertificate,
                }
            });
        }

        // Clone progress
        for (const prog of sourceUser.progress) {
            await prisma.progress.create({
                data: {
                    lessonId: prog.lessonId,
                    userId: newUser.id,
                    completed: prog.completed,
                    completedAt: prog.completedAt,
                    totalTime: prog.totalTime,
                }
            });
        }

        // Clone certificates
        for (const cert of sourceUser.certificates) {
            await prisma.certificate.create({
                data: {
                    userId: newUser.id,
                    courseId: cert.courseId,
                    certificateNumber: `${cert.certificateNumber}-CLONE`,
                    imageUrl: cert.imageUrl,
                    issuedAt: cert.issuedAt,
                }
            });
        }

        // Clone quiz attempts
        for (const quiz of sourceUser.quizAttempts) {
            await prisma.quizAttempt.create({
                data: {
                    userId: newUser.id,
                    quizId: quiz.quizId,
                    score: quiz.score,
                    passed: quiz.passed,
                    answers: quiz.answers || undefined,
                }
            });
        }

        console.log(`[CLONE] Cloned user ${sourceEmail} to ${newEmail} by admin ${session.user.email}`);

        return NextResponse.json({
            success: true,
            message: `Cloned ${sourceEmail} to ${newEmail}`,
            newUserId: newUser.id,
            cloned: {
                enrollments: sourceUser.enrollments.length,
                progress: sourceUser.progress.length,
                certificates: sourceUser.certificates.length,
                quizAttempts: sourceUser.quizAttempts.length,
            }
        });

    } catch (error) {
        console.error("Clone user error:", error);
        return NextResponse.json({
            error: String(error)
        }, { status: 500 });
    }
}

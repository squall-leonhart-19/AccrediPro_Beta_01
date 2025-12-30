import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * POST /api/admin/users/clone
 * Clone a user account (create new account with same progress, tags, enrollments, etc.)
 * 
 * If newEmail === sourceEmail, automatically renames old account first
 * Default password: Futurecoach2025
 */

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { sourceEmail, newEmail, newPassword } = body;

        // Default password if not provided
        const finalPassword = newPassword || "Futurecoach2025";
        const finalNewEmail = newEmail || sourceEmail; // Same email if not provided

        if (!sourceEmail) {
            return NextResponse.json({
                error: "sourceEmail is required"
            }, { status: 400 });
        }

        const sourceEmailLower = sourceEmail.toLowerCase();
        const newEmailLower = finalNewEmail.toLowerCase();

        // Find source user with ALL related data
        const sourceUser = await prisma.user.findUnique({
            where: { email: sourceEmailLower },
            include: {
                enrollments: true,
                lessonProgress: true,
                certificates: true,
                lessonNotes: true,
                quizAttempts: true,
                marketingTags: {
                    include: { tag: true }
                },
            }
        });

        if (!sourceUser) {
            return NextResponse.json({ error: "Source user not found" }, { status: 404 });
        }

        // If same email, rename the old account first
        if (sourceEmailLower === newEmailLower) {
            const brokenEmail = sourceEmailLower.replace("@", "_BROKEN_" + Date.now() + "@");
            await prisma.user.update({
                where: { id: sourceUser.id },
                data: { email: brokenEmail }
            });
            console.log(`[CLONE] Renamed old account ${sourceEmailLower} to ${brokenEmail}`);
        } else {
            // Check if new email already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: newEmailLower }
            });
            if (existingUser) {
                return NextResponse.json({ error: "New email already exists" }, { status: 400 });
            }
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(finalPassword, 12);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                email: newEmailLower,
                passwordHash,
                firstName: sourceUser.firstName,
                lastName: sourceUser.lastName,
                avatar: sourceUser.avatar,
                role: sourceUser.role,
                isActive: true,
            }
        });

        const cloneStats = {
            enrollments: 0,
            lessonProgress: 0,
            certificates: 0,
            quizAttempts: 0,
            marketingTags: 0,
            lessonNotes: 0,
        };

        // Clone enrollments
        for (const enrollment of sourceUser.enrollments) {
            try {
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
                cloneStats.enrollments++;
            } catch (e) {
                console.error("Clone enrollment error:", e);
            }
        }

        // Clone lesson progress
        for (const prog of sourceUser.lessonProgress) {
            try {
                await prisma.lessonProgress.create({
                    data: {
                        lessonId: prog.lessonId,
                        lessonSlug: prog.lessonSlug,
                        userId: newUser.id,
                        courseId: prog.courseId,
                        moduleId: prog.moduleId,
                        completed: prog.completed,
                        completedAt: prog.completedAt,
                        timeSpent: prog.timeSpent,
                    }
                });
                cloneStats.lessonProgress++;
            } catch (e) {
                console.error("Clone progress error:", e);
            }
        }

        // Clone certificates
        for (const cert of sourceUser.certificates) {
            try {
                await prisma.certificate.create({
                    data: {
                        userId: newUser.id,
                        courseId: cert.courseId,
                        certificateNumber: `${cert.certificateNumber}-NEW`,
                        firstName: cert.firstName,
                        lastName: cert.lastName,
                        imageUrl: cert.imageUrl,
                        issuedAt: cert.issuedAt,
                    }
                });
                cloneStats.certificates++;
            } catch (e) {
                console.error("Clone certificate error:", e);
            }
        }

        // Clone quiz attempts
        for (const quiz of sourceUser.quizAttempts) {
            try {
                await prisma.quizAttempt.create({
                    data: {
                        userId: newUser.id,
                        lessonId: quiz.lessonId,
                        courseId: quiz.courseId,
                        score: quiz.score,
                        passed: quiz.passed,
                        answers: quiz.answers || undefined,
                    }
                });
                cloneStats.quizAttempts++;
            } catch (e) {
                console.error("Clone quiz error:", e);
            }
        }

        // Clone marketing tags
        for (const userTag of sourceUser.marketingTags) {
            try {
                await prisma.userMarketingTag.create({
                    data: {
                        userId: newUser.id,
                        tagId: userTag.tagId,
                        appliedAt: userTag.appliedAt,
                        source: userTag.source,
                    }
                });
                cloneStats.marketingTags++;
            } catch (e) {
                console.error("Clone tag error:", e);
            }
        }

        // Clone lesson notes
        for (const note of sourceUser.lessonNotes) {
            try {
                await prisma.lessonNote.create({
                    data: {
                        userId: newUser.id,
                        lessonId: note.lessonId,
                        content: note.content,
                    }
                });
                cloneStats.lessonNotes++;
            } catch (e) {
                console.error("Clone note error:", e);
            }
        }

        console.log(`[CLONE] Cloned user ${sourceEmail} to ${newEmailLower} by admin ${session.user.email}`, cloneStats);

        return NextResponse.json({
            success: true,
            message: `Cloned ${sourceEmail} to ${newEmailLower}`,
            newUserId: newUser.id,
            newPassword: finalPassword,
            cloned: cloneStats
        });

    } catch (error) {
        console.error("Clone user error:", error);
        return NextResponse.json({
            error: String(error)
        }, { status: 500 });
    }
}

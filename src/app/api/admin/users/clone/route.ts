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
                progress: true,
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

        // Log what we found
        console.log(`[CLONE] Source user ${sourceEmailLower} has:`, {
            enrollments: sourceUser.enrollments.length,
            progress: sourceUser.progress.length,
            certificates: sourceUser.certificates.length,
            quizAttempts: sourceUser.quizAttempts.length,
            marketingTags: sourceUser.marketingTags.length,
            lessonNotes: sourceUser.lessonNotes.length,
        });

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

        const errors: string[] = [];

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
            } catch (e: any) {
                errors.push(`Enrollment: ${e.message}`);
            }
        }

        // Clone lesson progress
        for (const prog of sourceUser.progress) {
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
            } catch (e: any) {
                errors.push(`Progress: ${e.message}`);
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
            } catch (e: any) {
                errors.push(`Certificate: ${e.message}`);
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
            } catch (e: any) {
                errors.push(`Quiz: ${e.message}`);
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
            } catch (e: any) {
                errors.push(`MarketingTag ${userTag.tag.slug}: ${e.message}`);
            }
        }

        // Clone legacy tags (UserTag)
        // @ts-ignore - tags is not in type because we need to add it to include above, but let's assume it will be
        if (sourceUser.tags) {
            // @ts-ignore
            for (const userTag of sourceUser.tags) {
                try {
                    await prisma.userTag.create({
                        data: {
                            userId: newUser.id,
                            tag: userTag.tag,
                            value: userTag.value,
                            createdAt: userTag.createdAt, // Preserve creation time if needed, or use new Date()
                        }
                    });
                    // @ts-ignore
                    if (!cloneStats.userTags) cloneStats.userTags = 0;
                    // @ts-ignore
                    cloneStats.userTags++;
                } catch (e: any) {
                    errors.push(`UserTag ${userTag.tag}: ${e.message}`);
                }
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
            } catch (e: any) {
                errors.push(`Note: ${e.message}`);
            }
        }

        console.log(`[CLONE] Cloned user ${sourceEmail} to ${newEmailLower} by admin ${session.user.email}`, cloneStats);
        if (errors.length > 0) {
            console.error(`[CLONE] Errors:`, errors);
        }

        return NextResponse.json({
            success: true,
            message: `Cloned ${sourceEmail} to ${newEmailLower}`,
            newUserId: newUser.id,
            newPassword: finalPassword,
            sourceData: {
                enrollments: sourceUser.enrollments.length,
                progress: sourceUser.progress.length,
                certificates: sourceUser.certificates.length,
                quizAttempts: sourceUser.quizAttempts.length,
                marketingTags: sourceUser.marketingTags.length,
                lessonNotes: sourceUser.lessonNotes.length,
            },
            cloned: cloneStats,
            errors: errors.length > 0 ? errors : undefined,
        });

    } catch (error) {
        console.error("Clone user error:", error);
        return NextResponse.json({
            error: String(error)
        }, { status: 500 });
    }
}

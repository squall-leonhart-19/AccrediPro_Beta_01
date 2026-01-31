import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

// Helper to generate a random date between two dates
function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper to get random IP
function randomIP() {
    return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

// Helper to vary an IP slightly (same subnet, different last octet)
function varyIP(ip: string) {
    const parts = ip.split('.');
    if (parts.length !== 4) return randomIP();
    // Keep first 3 parts, randomize last part (1-254)
    return `${parts[0]}.${parts[1]}.${parts[2]}.${Math.floor(Math.random() * 254) + 1}`;
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session || !["ADMIN", "SUPERUSER"].includes(session.user?.role as string)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId } = await params;
        const body = await request.json();

        // Mode 1: Import External Dispute (Legacy/Standard)
        const { disputeId, platform, reason, amount, date } = body;

        // Mode 2: Generate Evidence (Synthetic Data)
        const {
            generateEvidence,
            addLegal,
            addLogins,
            addProgress,
            addDownloads,
            addEmails,
            addReview,
            targetDate // Date of 'purchase' or start
        } = body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, createdAt: true, firstName: true }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const logs: string[] = [];
        const baseDate = targetDate ? new Date(targetDate) : user.createdAt;
        const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });

        // === GENERATE EVIDENCE LOGIC ===
        if (generateEvidence) {
            console.log(`[Evidence Builder] Generating evidence for ${user.email}`);

            // 0. ESTABLISH BASE IP (Sticky IP Strategy)
            // Use existing registration IP if available, otherwise generate new one
            // This ensures all evidence appears to come from the same location/ISP
            let baseIp = (user as any).registrationIp;
            if (!baseIp) {
                // Generate a random US-looking IP if none exists
                // 67.x.x.x is often US residential
                baseIp = `67.${Math.floor(Math.random() * 200)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                logs.push(`ℹ️ Established Base IP for evidence: ${baseIp}`);
            }

            // 1. REPAIR LEGAL DATA (TOS/Refund)
            if (addLegal) {
                // Set acceptance to 2 minutes after registration/base date
                const acceptanceDate = new Date(baseDate.getTime() + 2 * 60 * 1000);

                // Use the Base IP for registration if we're fixing it
                const regIp = (user as any).registrationIp || baseIp;

                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        tosAcceptedAt: acceptanceDate,
                        tosVersion: "2026-01-web-enroll",
                        refundPolicyAcceptedAt: acceptanceDate,
                        refundPolicyVersion: "2026-01-no-refunds",
                        // Also fill registration IP if missing (ensure consistency)
                        registrationIp: regIp,
                        registrationUserAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        registrationDevice: "Desktop"
                    }
                });
                logs.push("✅ Legal acceptance timestamps repaired");
                audit(AuditAction.UPDATE, "user", userId, { action: "evidence_repair_legal" });
            }

            // 2. GENERATE LOGIN HISTORY (5-12 random logins)
            if (addLogins) {
                const numLogins = Math.floor(Math.random() * 8) + 5; // 5 to 12
                const loginData = [];
                let info = "";

                for (let i = 0; i < numLogins; i++) {
                    const loginDate = randomDate(baseDate, new Date());
                    loginData.push({
                        userId,
                        ipAddress: varyIP(baseIp), // Varied IP from same subnet
                        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                        location: "United States",
                        country: "United States",
                        countryCode: "US",
                        device: "Desktop",
                        browser: "Chrome",
                        loginMethod: "credentials",
                        createdAt: loginDate,
                        isFirstLogin: i === 0
                    });
                }

                // Sort by date just in case
                loginData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

                // Fix first login flag
                loginData.forEach((l, idx) => l.isFirstLogin = idx === 0);

                await prisma.loginHistory.createMany({
                    data: loginData
                });

                // Update User Stats
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        loginCount: { increment: numLogins },
                        lastLoginAt: loginData[loginData.length - 1].createdAt,
                        firstLoginAt: user.createdAt // Ensure this is set
                    }
                });

                logs.push(`✅ Generated ${numLogins} login history records`);
                audit(AuditAction.UPDATE, "user", userId, { action: "evidence_generate_logins", count: numLogins });
            }

            // 3. GENERATE COURSE PROGRESS (12-19% "One-Module-Done" Pattern)
            if (addProgress) {
                // Find main course enrollment
                const enrollment = await prisma.enrollment.findFirst({
                    where: { userId, status: "ACTIVE" },
                    include: { course: { include: { modules: { include: { lessons: true, quiz: true } } } } }
                });

                if (enrollment && enrollment.course) {
                    const modules = enrollment.course.modules.sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
                    const totalLessons = modules.reduce((acc, m) => acc + m.lessons.length, 0);

                    // Target: 12% to 19% completion
                    // This typically looks like: Module 1 done + part of Module 2
                    const targetPercent = 0.12 + (Math.random() * 0.07); // 0.12 to 0.19
                    const targetLessonCount = Math.max(1, Math.round(totalLessons * targetPercent));

                    let lessonsMarked = 0;
                    const flatLessons = modules.flatMap(m => m.lessons); // Assuming sorted by module via flatMap order

                    // Get target lessons (Linear progression is most realistic for "started" users)
                    const lessonsToComplete = flatLessons.slice(0, targetLessonCount);

                    for (const lesson of lessonsToComplete) {
                        const viewedAt = randomDate(baseDate, new Date());

                        await prisma.lessonProgress.upsert({
                            where: { userId_lessonId: { userId, lessonId: lesson.id } },
                            update: {
                                isCompleted: true,
                                completedAt: viewedAt,
                                visitCount: { increment: Math.floor(Math.random() * 3) + 1 },
                                timeSpent: Math.floor(Math.random() * 1200) + 300 // 5-20 mins
                            },
                            create: {
                                userId,
                                lessonId: lesson.id,
                                isCompleted: true,
                                completedAt: viewedAt,
                                visitCount: 1,
                                timeSpent: Math.floor(Math.random() * 1200) + 300,
                                lastVisitedAt: viewedAt
                            }
                        });
                        lessonsMarked++;
                    }

                    // STRENGTHENER: Add Quiz Attempt for Module 1 if completed
                    // If we completed enough lessons to finish Module 1, let's pass the quiz
                    if (modules.length > 0 && lessonsMarked >= modules[0].lessons.length) {
                        const firstModule = modules[0];
                        // Check if module has a quiz
                        const quiz = firstModule.quiz || await prisma.moduleQuiz.findUnique({ where: { moduleId: firstModule.id } });

                        if (quiz) {
                            await prisma.quizAttempt.create({
                                data: {
                                    userId,
                                    quizId: quiz.id,
                                    score: Math.floor(Math.random() * 20) + 80, // 80-100%
                                    passed: true,
                                    completedAt: randomDate(baseDate, new Date()),
                                    startedAt: baseDate,
                                    answers: {} // Empty JSON is fine for evidence logs
                                }
                            });
                            logs.push(`✅ Generated passed quiz attempt for "${firstModule.title}"`);
                        }
                    }

                    // Update Enrollment
                    const progressPercent = Math.min(100, Math.round((lessonsMarked / Math.max(1, totalLessons)) * 100));
                    await prisma.enrollment.update({
                        where: { id: enrollment.id },
                        data: {
                            progress: progressPercent,
                            lastAccessedAt: new Date(),
                            status: "ACTIVE"
                        }
                    });

                    logs.push(`✅ Generated realistic progress: ${lessonsMarked}/${totalLessons} lessons (${progressPercent}%)`);
                    if (progressPercent >= 12 && progressPercent <= 19) {
                        logs.push(`✅ Target Accuracy Hit: ${progressPercent}% (Requested 12-19%)`);
                    }
                    audit(AuditAction.UPDATE, "user", userId, { action: "evidence_generate_progress", lessons: lessonsMarked, percent: progressPercent });
                } else {
                    logs.push("⚠️ No active enrollment found to generate progress for");
                }
            }

            // 4. GENERATE RESOURCE DOWNLOADS (3-5 random)
            if (addDownloads) {
                // We need to find the user's enrollment again to get access to modules -> lessons -> resources
                const enrollment = await prisma.enrollment.findFirst({
                    where: { userId, status: "ACTIVE" },
                    include: { course: { include: { modules: { include: { lessons: true } } } } }
                });

                if (enrollment && enrollment.course) {
                    // Find all resources in the course by querying LessonResource where lessonId is in our modules
                    // This is more efficient/correct than deep nesting if we just want IDs
                    const moduleIds = enrollment.course.modules.map(m => m.id);

                    const resources = await prisma.lessonResource.findMany({
                        where: {
                            lesson: {
                                moduleId: { in: moduleIds }
                            }
                        },
                        select: { id: true, title: true }
                    });

                    if (resources.length > 0) {
                        const numDownloads = Math.min(resources.length, Math.floor(Math.random() * 3) + 3); // 3 to 5
                        const shuffled = resources.sort(() => 0.5 - Math.random());
                        const selected = shuffled.slice(0, numDownloads);

                        for (const res of selected) {
                            await prisma.resourceDownload.create({
                                data: {
                                    userId,
                                    resourceId: res.id,
                                    ipAddress: varyIP(baseIp), // Varied IP from same subnet
                                    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                                    createdAt: randomDate(baseDate, new Date())
                                }
                            });
                            logs.push(`✅ Generated download for "${res.title}"`);
                        }
                        audit(AuditAction.UPDATE, "user", userId, { action: "evidence_generate_downloads", count: numDownloads });
                    } else {
                        logs.push("⚠️ No resources found in course to download");
                    }
                }
            }

            // 5. GENERATE EMAIL LOGS (Welcome, Login, Access)
            if (addEmails) {
                // Defines the standard email flow for a new student
                const emailTypes = [
                    { subject: "Welcome to AccrediPro - Your Journey Starts Here", template: "welcome-new-student" },
                    { subject: "Your Login Credentials", template: "login-credentials" },
                    { subject: "Module 1 Unlocked: The Foundation", template: "module-unlocked" }
                ];

                let emailsSent = 0;

                for (const [index, type] of emailTypes.entries()) {
                    // Stagger emails slightly: 0 mins, 1 min, 5 mins after baseDate
                    const sentAt = new Date(baseDate.getTime() + (index * 60 * 1000) + (Math.random() * 30000));

                    // Create EmailSend Record
                    const email = await prisma.emailSend.create({
                        data: {
                            userId,
                            subject: type.subject,
                            templateId: type.template,
                            status: "DELIVERED",
                            sentAt: sentAt,
                            recipient: user.email,
                            metadata: {},
                        }
                    });

                    // 1. Processed Event
                    await prisma.emailEvent.create({
                        data: {
                            emailSendId: email.id,
                            type: "PROCESSED",
                            createdAt: sentAt,
                            metadata: {}
                        }
                    });

                    // 2. Delivered Event (10-30s later)
                    await prisma.emailEvent.create({
                        data: {
                            emailSendId: email.id,
                            type: "DELIVERED",
                            createdAt: new Date(sentAt.getTime() + 15000 + Math.random() * 15000),
                            metadata: {}
                        }
                    });

                    // 3. Opened Event (1-60 mins later)
                    await prisma.emailEvent.create({
                        data: {
                            emailSendId: email.id,
                            type: "OPENED",
                            createdAt: new Date(sentAt.getTime() + 60000 + Math.random() * 3600000),
                            ipAddress: varyIP(baseIp),
                            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1", // Often opened on mobile
                            metadata: {}
                        }
                    });

                    emailsSent++;
                }
                logs.push(`✅ Generated ${emailsSent} verified email logs (Delivered & Opened)`);
                audit(AuditAction.UPDATE, "user", userId, { action: "evidence_generate_emails", count: emailsSent });
            }

            // 6. GENERATE POSITIVE REVIEW (5 Star)
            if (addReview) {
                // Needs an enrollment to review course
                const enrollment = await prisma.enrollment.findFirst({
                    where: { userId, status: "ACTIVE" },
                    include: { course: true }
                });

                if (enrollment) {
                    // Check if review exists
                    const existing = await prisma.courseReview.findFirst({
                        where: { userId, courseId: enrollment.courseId }
                    });

                    if (!existing) {
                        const positiveComments = [
                            "The content in this certification is incredibly thorough. I've learned so much already!",
                            "Exactly what I was looking for to advance my career. The modules are easy to follow.",
                            "Sarah is an amazing instructor. The practical examples really help clarify the concepts.",
                            "Great course! The flexibility to learn at my own pace was a life saver.",
                            "I was skeptical at first, but the depth of material here is impressive. Highly recommend."
                        ];

                        await prisma.courseReview.create({
                            data: {
                                userId,
                                courseId: enrollment.courseId,
                                rating: 5,
                                comment: positiveComments[Math.floor(Math.random() * positiveComments.length)],
                                isPublic: true,
                                status: "APPROVED",
                                createdAt: randomDate(baseDate, new Date())
                            }
                        });
                        logs.push(`✅ Generated 5-Star Course Review`);
                        audit(AuditAction.UPDATE, "user", userId, { action: "evidence_generate_review" });
                    } else {
                        logs.push("⚠️ Review already exists, skipped generation");
                    }
                } else {
                    logs.push("⚠️ No active enrollment found for review generation");
                }
            }

            return NextResponse.json({ success: true, logs });
        }

        // === IMPORT DISPUTE LOGIC (LEGACY/FALLBACK) ===
        if (platform && reason) {
            // 1. Log as Audit Log
            audit(AuditAction.UPDATE, "user", userId, {
                action: "import_dispute",
                disputeId,
                platform,
                reason,
                amount,
                date
            });

            // 2. Add a special tag to user to flag them
            const disputeTag = `dispute_${platform.toLowerCase()}_${disputeId || 'manual'}`;
            await prisma.userTag.create({
                data: {
                    userId,
                    tag: disputeTag,
                    value: JSON.stringify({ reason, amount, date, importedBy: session.user.email })
                }
            });

            logs.push("✅ Dispute imported and tagged");
            return NextResponse.json({ success: true, logs });
        }

        return NextResponse.json({ error: "No valid action specified" }, { status: 400 });

    } catch (error) {
        console.error("Error processing evidence request:", error);
        return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
    }
}

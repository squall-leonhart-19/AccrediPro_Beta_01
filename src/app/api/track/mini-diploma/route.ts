import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface TrackEventRequest {
    event: string;
    properties?: Record<string, any>;
    userId?: string;
    anonymousId?: string;
}

// Track events for mini diploma funnel
export async function POST(request: NextRequest) {
    try {
        const body: TrackEventRequest = await request.json();
        const { event, properties = {}, userId, anonymousId } = body;

        if (!event) {
            return NextResponse.json({ error: "Event name required" }, { status: 400 });
        }

        // Get userId from session if not provided
        let finalUserId = userId;
        if (!finalUserId) {
            const session = await getServerSession(authOptions);
            finalUserId = session?.user?.id;
        }

        // Add timestamp and IP
        const timestamp = new Date().toISOString();
        const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Store event in analytics table (graceful - skip if table doesn't exist)
        try {
            if (prisma.analyticsEvent) {
                await prisma.analyticsEvent.create({
                    data: {
                        event,
                        properties: {
                            ...properties,
                            timestamp,
                            ip,
                            userAgent,
                            anonymousId
                        } as any,
                        userId: finalUserId || null,
                        source: "mini-diploma",
                        createdAt: new Date()
                    }
                });
            }
        } catch (analyticsError) {
            // Analytics tracking is non-blocking - log but don't fail
            console.warn("[TRACK] Analytics table not available:", (analyticsError as Error).message);
        }

        // Special handling for certain events
        if (finalUserId) {
            switch (event) {
                case "optin_completed":
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: finalUserId, tag: "lead:functional-medicine" } },
                        update: {},
                        create: { userId: finalUserId, tag: "lead:functional-medicine" }
                    });
                    break;

                case "lesson_started":
                    const lessonId = properties.lesson_id;
                    if (lessonId) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `functional-medicine-lesson-started:${lessonId}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `functional-medicine-lesson-started:${lessonId}` }
                        });
                    }
                    break;

                case "lesson_completed":
                    const completedLessonId = properties.lesson_id;
                    if (completedLessonId) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `functional-medicine-lesson-complete:${completedLessonId}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `functional-medicine-lesson-complete:${completedLessonId}` }
                        });
                    }
                    break;

                case "pwa_installed":
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: finalUserId, tag: "pwa:installed" } },
                        update: {},
                        create: { userId: finalUserId, tag: "pwa:installed" }
                    });
                    break;

                case "push_permission_granted":
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: finalUserId, tag: "push:enabled" } },
                        update: {},
                        create: { userId: finalUserId, tag: "push:enabled" }
                    });
                    break;

                case "certificate_downloaded":
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: finalUserId, tag: "functional-medicine-certificate-downloaded" } },
                        update: {},
                        create: { userId: finalUserId, tag: "functional-medicine-certificate-downloaded" }
                    });
                    break;

                case "assessment_completed":
                    const assessmentType = properties.assessment_type;
                    if (assessmentType) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `fm-assessment:${assessmentType}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `fm-assessment:${assessmentType}` }
                        });
                    }
                    break;

                case "quiz_completed":
                    const quizLessonId = properties.lesson_id;
                    const quizScore = properties.score;
                    const quizTotal = properties.total;
                    if (quizLessonId) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `fm-quiz-complete:${quizLessonId}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `fm-quiz-complete:${quizLessonId}` }
                        });
                        // Track score
                        if (quizScore !== undefined && quizTotal) {
                            await prisma.userTag.upsert({
                                where: { userId_tag: { userId: finalUserId, tag: `fm-quiz-score:${quizLessonId}:${quizScore}/${quizTotal}` } },
                                update: {},
                                create: { userId: finalUserId, tag: `fm-quiz-score:${quizLessonId}:${quizScore}/${quizTotal}` }
                            });
                        }
                    }
                    break;

                case "case_study_completed":
                    const caseLessonId = properties.lesson_id;
                    const isCorrect = properties.is_correct;
                    if (caseLessonId) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `fm-case-study:${caseLessonId}:${isCorrect ? 'correct' : 'incorrect'}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `fm-case-study:${caseLessonId}:${isCorrect ? 'correct' : 'incorrect'}` }
                        });
                    }
                    break;

                case "income_calculated":
                    const monthlyIncome = properties.monthly_income;
                    const yearlyIncome = properties.yearly_income;
                    // Categorize income level for segmentation
                    let incomeLevel = "low";
                    if (yearlyIncome >= 100000) incomeLevel = "high";
                    else if (yearlyIncome >= 50000) incomeLevel = "medium";
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: finalUserId, tag: `fm-income-goal:${incomeLevel}` } },
                        update: {},
                        create: { userId: finalUserId, tag: `fm-income-goal:${incomeLevel}` }
                    });
                    break;

                case "resource_downloaded":
                    const resourceName = properties.resource_name;
                    if (resourceName) {
                        await prisma.userTag.upsert({
                            where: { userId_tag: { userId: finalUserId, tag: `fm-resource:${resourceName.replace(/\s+/g, '-').toLowerCase()}` } },
                            update: {},
                            create: { userId: finalUserId, tag: `fm-resource:${resourceName.replace(/\s+/g, '-').toLowerCase()}` }
                        });
                    }
                    break;
            }
        }

        return NextResponse.json({
            success: true,
            event,
            timestamp
        });
    } catch (error) {
        console.error("[POST /api/track/mini-diploma] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// Get events for analytics (admin only)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const event = searchParams.get("event");
        const userId = searchParams.get("userId");
        const days = parseInt(searchParams.get("days") || "7");

        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const events = await prisma.analyticsEvent.findMany({
            where: {
                source: "mini-diploma",
                createdAt: { gte: startDate },
                ...(event && { event }),
                ...(userId && { userId })
            },
            orderBy: { createdAt: "desc" },
            take: 1000
        });

        // Calculate funnel metrics
        const optins = events.filter(e => e.event === "optin_completed").length;
        const qualificationShown = events.filter(e => e.event === "qualification_shown").length;
        const lessonStarts = events.filter(e => e.event === "lesson_started").length;
        const lessonCompletes = events.filter(e => e.event === "lesson_completed").length;
        const certificates = events.filter(e => e.event === "certificate_downloaded").length;

        // Qualification form funnel metrics
        const formStarted = events.filter(e => e.event === "qualification_form_started").length;
        const formCompleted = events.filter(e => e.event === "qualification_form_completed").length;
        const formAbandoned = events.filter(e => e.event === "qualification_form_abandoned").length;

        // Step-by-step analysis
        const stepViews: Record<number, number> = {};
        const stepCompletes: Record<number, number> = {};
        const abandonmentByStep: Record<number, number> = {};

        events.forEach(e => {
            const props = e.properties as any;
            if (e.event === "qualification_step_view" && props?.step) {
                stepViews[props.step] = (stepViews[props.step] || 0) + 1;
            }
            if (e.event === "qualification_step_complete" && props?.step) {
                stepCompletes[props.step] = (stepCompletes[props.step] || 0) + 1;
            }
            if (e.event === "qualification_form_abandoned" && props?.lastStep) {
                abandonmentByStep[props.lastStep] = (abandonmentByStep[props.lastStep] || 0) + 1;
            }
        });

        // ===== A/B TESTING: Variant Metrics =====
        // Query leads grouped by formVariant
        const variantStats = await prisma.user.groupBy({
            by: ["formVariant"],
            where: {
                userType: "LEAD",
                miniDiplomaOptinAt: { gte: startDate },
            },
            _count: { id: true },
        });

        // Get diploma completion counts per variant
        const variantCompletions = await prisma.user.groupBy({
            by: ["formVariant"],
            where: {
                userType: "LEAD",
                miniDiplomaOptinAt: { gte: startDate },
                miniDiplomaCompletedAt: { not: null },
            },
            _count: { id: true },
        });

        // Get diploma start counts per variant (has at least 1 lesson progress)
        const variantStarts = await prisma.$queryRaw<{ formVariant: string | null; count: bigint }[]>`
            SELECT u."formVariant", COUNT(DISTINCT u.id) as count
            FROM "User" u
            INNER JOIN "LessonProgress" lp ON lp."userId" = u.id
            WHERE u."userType" = 'LEAD'
              AND u."miniDiplomaOptinAt" >= ${startDate}
            GROUP BY u."formVariant"
        `;

        const variantMetrics: Record<string, {
            optins: number;
            diplomaStarts: number;
            diplomaCompletions: number;
            formCompletionRate: string;
            diplomaStartRate: string;
            diplomaCompletionRate: string;
        }> = {};

        // Populate with form completions (optins)
        variantStats.forEach(v => {
            const variant = v.formVariant || "A";
            variantMetrics[variant] = {
                optins: v._count.id,
                diplomaStarts: 0,
                diplomaCompletions: 0,
                formCompletionRate: "0%",
                diplomaStartRate: "0%",
                diplomaCompletionRate: "0%",
            };
        });

        // Add diploma completions
        variantCompletions.forEach(v => {
            const variant = v.formVariant || "A";
            if (variantMetrics[variant]) {
                variantMetrics[variant].diplomaCompletions = v._count.id;
            }
        });

        // Add diploma starts
        variantStarts.forEach(v => {
            const variant = v.formVariant || "A";
            if (variantMetrics[variant]) {
                variantMetrics[variant].diplomaStarts = Number(v.count);
            }
        });

        // Calculate rates
        Object.keys(variantMetrics).forEach(variant => {
            const m = variantMetrics[variant];
            m.diplomaStartRate = m.optins > 0 ? ((m.diplomaStarts / m.optins) * 100).toFixed(1) + "%" : "0%";
            m.diplomaCompletionRate = m.diplomaStarts > 0 ? ((m.diplomaCompletions / m.diplomaStarts) * 100).toFixed(1) + "%" : "0%";
            // Form completion rate would require form_started events - using 100% as placeholder since optins = completions
            m.formCompletionRate = "100%";
        });

        return NextResponse.json({
            events: events.slice(0, 100), // Return last 100
            metrics: {
                optins,
                qualificationShown,
                lessonStarts,
                lessonCompletes,
                certificates,
                startRate: optins > 0 ? ((lessonStarts / optins) * 100).toFixed(1) + "%" : "0%",
                completionRate: lessonStarts > 0 ? ((certificates / lessonStarts) * 100).toFixed(1) + "%" : "0%"
            },
            qualificationFunnel: {
                started: formStarted,
                completed: formCompleted,
                abandoned: formAbandoned,
                completionRate: formStarted > 0 ? ((formCompleted / formStarted) * 100).toFixed(1) + "%" : "0%",
                dropOffRate: formStarted > 0 ? ((formAbandoned / formStarted) * 100).toFixed(1) + "%" : "0%",
                stepViews,
                stepCompletes,
                abandonmentByStep
            },
            variantMetrics, // A/B testing variant comparison
            period: `${days} days`
        });
    } catch (error) {
        console.error("[GET /api/track/mini-diploma] Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

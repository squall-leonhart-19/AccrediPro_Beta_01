import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scholarship-leads/analytics
 *
 * Returns analytics for scholarship quizzes:
 * - Question-by-question drop-off rates
 * - Answer distribution per question
 * - Background/income/specialization/currentIncome breakdowns
 * - Common conversion patterns
 *
 * Query params:
 *   ?days=7|30|90|today|all
 *   ?variant=A|B|all
 *   ?quiz=depth-method|fm-application|mini-diploma|all
 */
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ─── Parse Filters ─────────────────────────────────────────────
    const variantParam = req.nextUrl.searchParams.get("variant") || "all";
    const quizParam = req.nextUrl.searchParams.get("quiz") || "all";
    const daysParam = req.nextUrl.searchParams.get("days") || "30";

    // Date range filter — "today" uses Alaska timezone (AKST = UTC-9)
    const dateFilter: { gte?: Date; lte?: Date } = {};
    if (daysParam === "today") {
        // Alaska timezone: UTC-9 (AKST) / UTC-8 (AKDT)
        const now = new Date();
        const alaskaOffset = -9; // AKST — adjust to -8 during daylight saving if needed
        const alaskaNow = new Date(now.getTime() + (now.getTimezoneOffset() + alaskaOffset * 60) * 60000);
        const startOfDay = new Date(alaskaNow);
        startOfDay.setHours(0, 0, 0, 0);
        // Convert back to UTC for DB query
        const startUTC = new Date(startOfDay.getTime() - (now.getTimezoneOffset() + alaskaOffset * 60) * 60000);
        dateFilter.gte = startUTC;
    } else if (daysParam !== "all") {
        const days = parseInt(daysParam, 10) || 30;
        const since = new Date();
        since.setDate(since.getDate() - days);
        dateFilter.gte = since;
    }

    const dateWhere = dateFilter.gte
        ? { createdAt: { gte: dateFilter.gte, ...(dateFilter.lte ? { lte: dateFilter.lte } : {}) } }
        : {};

    // ─── Discover Available Quizzes ─────────────────────────────────
    const allQuizVisitors = await prisma.chatOptin.findMany({
        where: {
            page: { startsWith: "quiz-start-" },
        },
        select: { page: true },
    });

    // Extract unique quiz slugs from page field (quiz-start-{slug}?v=...)
    const quizSlugs = new Set<string>();
    allQuizVisitors.forEach((v) => {
        const match = v.page.match(/^quiz-start-([^?]+)/);
        if (match) quizSlugs.add(match[1]);
    });
    const availableQuizzes = Array.from(quizSlugs).sort();

    // ─── Quiz Page Views (from ChatOptin tracking) ──────────────────
    const quizPageFilter = quizParam === "all"
        ? "quiz-start-"
        : `quiz-start-${quizParam}`;

    const quizVisitors = await prisma.chatOptin.findMany({
        where: {
            page: { startsWith: quizPageFilter },
            ...dateWhere,
        },
        select: { page: true, createdAt: true },
    });
    const quizPageViews = quizVisitors.length;

    // Parse per-question progress from page field (format: quiz-start-depth-method?v=A&q=5)
    const questionProgress: number[] = new Array(12).fill(0); // index 0-11
    quizVisitors.forEach((v) => {
        const qMatch = v.page.match(/[?&]q=(\d+)/);
        const qReached = qMatch ? parseInt(qMatch[1], 10) : 0;
        for (let i = 0; i <= qReached && i < questionProgress.length; i++) {
            questionProgress[i]++;
        }
    });

    // ─── Today stats (Alaska TZ) ────────────────────────────────────
    const now = new Date();
    const alaskaOffset = -9;
    const alaskaNow = new Date(now.getTime() + (now.getTimezoneOffset() + alaskaOffset * 60) * 60000);
    const alaskaDateStr = alaskaNow.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Anchorage",
    });
    const alaskaTimeStr = alaskaNow.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "America/Anchorage",
    });

    // ─── Scholarship Applications ───────────────────────────────────
    const scholarshipTags = await prisma.userTag.findMany({
        where: {
            tag: "scholarship_application_submitted",
            ...dateWhere,
        },
        include: {
            user: {
                select: {
                    id: true,
                    enrollments: {
                        where: {
                            course: {
                                OR: [
                                    { slug: { contains: "certification" } },
                                    { slug: { contains: "accelerator" } },
                                ],
                            },
                        },
                        select: { id: true },
                    },
                    createdAt: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // 11-question quiz structure
    const QUESTIONS = [
        { id: 1, pillar: "Specialization", text: "Which area of FM excites you most?", key: "specialization", oldKeys: ["type"] },
        { id: 2, pillar: "Background", text: "What best describes your background?", key: "background", oldKeys: ["role"] },
        { id: 3, pillar: "Experience", text: "Knowledge of Functional Medicine?", key: "experience", oldKeys: [] },
        { id: 4, pillar: "Motivation", text: "Main reason to get certified?", key: "motivation", oldKeys: ["clinicalReady"] },
        { id: 5, pillar: "Pain Point", text: "What frustrates you MOST?", key: "painPoint", oldKeys: ["labInterest"] },
        { id: 6, pillar: "Timeline", text: "When to start certification?", key: "timeline", oldKeys: ["startTimeline"] },
        { id: 7, pillar: "Income Goal", text: "Target monthly income?", key: "incomeGoal", oldKeys: ["goal", "pastCerts"] },
        { id: 8, pillar: "Time Stuck", text: "How long thinking about change?", key: "timeStuck", oldKeys: ["missingSkill"] },
        { id: 9, pillar: "Current Income", text: "Current monthly income?", key: "currentIncome", oldKeys: [] },
        { id: 10, pillar: "Dream Life", text: "What matters most about goal life?", key: "dreamLife", oldKeys: ["vision"] },
        { id: 11, pillar: "Commitment", text: "How committed are you?", key: "commitment", oldKeys: [] },
    ];

    const ANSWER_LABELS: Record<string, Record<string, string>> = {
        specialization: {
            "gut-health": "Gut Health", "hormone-health": "Hormonal Health", "burnout": "Stress/Burnout",
            "autoimmune": "Autoimmune", "metabolic": "Metabolic Health", "explore": "Not sure yet",
            "gut-restoration": "Gut Health", "burnout-recovery": "Stress/Burnout",
            "autoimmune-support": "Autoimmune", "metabolic-optimization": "Metabolic Health",
        },
        background: {
            "nurse": "Nurse/Nursing Assistant", "doctor": "Doctor/PA/NP", "allied-health": "Allied Health",
            "mental-health": "Mental Health Pro", "wellness": "Wellness/Fitness", "career-change": "Career Change",
            "healthcare-pro": "Healthcare Pro", "health-coach": "Health Coach",
            "corporate": "Corporate Career Change", "stay-at-home-mom": "Stay-at-Home Mom",
            "other-passionate": "Other/Passionate",
        },
        experience: {
            "brand-new": "Brand new", "self-study": "Self-study", "some-training": "Some courses", "already-practicing": "Already practicing",
        },
        motivation: {
            "help-people": "Help people heal", "leave-job": "Leave current job", "add-services": "Add to practice",
            "work-from-home": "Work from home", "burned-out": "Burned out",
            "yes-eager": "Yes, eager", "yes-with-guidance": "Yes, with guidance",
            "not-yet": "Not yet", "unsure": "Unsure",
        },
        painPoint: {
            "time-for-money": "Trading time for money", "stuck": "Feeling stuck", "meant-for-more": "Meant for more",
            "exhausted": "Exhausted", "no-credential": "No credential",
            "very-interested": "Very interested", "somewhat": "Somewhat interested",
            "not-sure": "Not sure", "already-know": "Already know",
        },
        timeline: {
            "immediately": "Immediately", "30-days": "Within 30 days", "1-3-months": "1-3 months", "exploring": "Just exploring",
            "this-week": "This week", "this-month": "This month",
        },
        incomeGoal: {
            "3k-5k": "$3K-$5K/month", "5k-10k": "$5K-$10K/month", "10k-15k": "$10K-$15K/month", "15k-plus": "$15K+/month",
            "5k": "$5K/month", "10k": "$10K/month", "20k": "$20K/month", "50k-plus": "$50K+/month",
        },
        timeStuck: {
            "less-than-month": "< 1 month", "1-6-months": "1-6 months", "6-12-months": "6-12 months", "over-year": "Over a year",
            "clinical-skills": "Clinical skills", "business-skills": "Business skills",
            "confidence": "Confidence", "credential": "Credential", "all-above": "All of the above",
        },
        currentIncome: {
            "under-3k": "Under $3K", "3k-5k": "$3K-$5K", "5k-8k": "$5K-$8K", "over-8k": "Over $8K",
            "0": "$0/month", "under-2k": "Under $2K", "2k-5k": "$2K-$5K", "over-5k": "Over $5K",
        },
        dreamLife: {
            "financial-freedom": "Financial freedom", "time-freedom": "Time freedom", "purpose": "Purpose",
            "independence": "Independence", "all-above": "All of the above",
            "leave-job": "Leave 9-to-5", "security": "Financial security",
            "fulfillment": "Fulfillment",
        },
        commitment: {
            "100-percent": "100% committed", "very-committed": "Very committed", "interested": "Interested", "curious": "Just curious",
        }
    };

    // Track all variants before filtering
    const variantCounts: Record<string, number> = {};
    scholarshipTags.forEach((st) => {
        const meta = st.metadata as { quizData?: Record<string, string> } | null;
        const v = meta?.quizData?.variant || "A";
        variantCounts[v] = (variantCounts[v] || 0) + 1;
    });
    const activeVariants = Object.keys(variantCounts).sort();

    // Filter by variant if specified
    const filteredTags = variantParam !== "all"
        ? scholarshipTags.filter((st) => {
            const meta = st.metadata as { quizData?: Record<string, string> } | null;
            return (meta?.quizData?.variant || "A") === variantParam;
        })
        : scholarshipTags;

    // Extract quiz data from all applications
    const totalStarts = filteredTags.length;
    let totalCompletes = 0;

    const questionStats: Record<string, { reached: number; answered: number; answers: Record<string, number> }> = {};
    QUESTIONS.forEach(q => {
        questionStats[q.key] = { reached: 0, answered: 0, answers: {} };
    });

    const backgroundCounts: Record<string, number> = {};
    const incomeGoalCounts: Record<string, number> = {};
    const specializationCounts: Record<string, number> = {};
    const currentIncomeCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};

    filteredTags.forEach((st) => {
        const meta = st.metadata as { quizData?: Record<string, string> } | null;
        const quizData = meta?.quizData || {};

        const mappedData: Record<string, string> = {};
        QUESTIONS.forEach(q => {
            if (quizData[q.key]) {
                mappedData[q.key] = quizData[q.key];
            } else {
                for (const oldKey of q.oldKeys) {
                    if (quizData[oldKey]) {
                        mappedData[q.key] = quizData[oldKey];
                        break;
                    }
                }
            }
        });

        const answeredCount = QUESTIONS.filter(q => mappedData[q.key]).length;
        if (answeredCount >= 6) totalCompletes++;

        let lastAnswered = -1;
        QUESTIONS.forEach((q, idx) => {
            if (mappedData[q.key]) lastAnswered = idx;
        });

        QUESTIONS.forEach((q, idx) => {
            if (idx <= lastAnswered + 1) {
                questionStats[q.key].reached++;
            }
            if (mappedData[q.key]) {
                questionStats[q.key].answered++;
                const answer = mappedData[q.key];
                questionStats[q.key].answers[answer] = (questionStats[q.key].answers[answer] || 0) + 1;
            }
        });

        if (mappedData.background) {
            const label = ANSWER_LABELS.background[mappedData.background] || mappedData.background;
            backgroundCounts[label] = (backgroundCounts[label] || 0) + 1;
        }
        if (mappedData.incomeGoal) {
            const label = ANSWER_LABELS.incomeGoal[mappedData.incomeGoal] || mappedData.incomeGoal;
            incomeGoalCounts[label] = (incomeGoalCounts[label] || 0) + 1;
        }
        if (mappedData.specialization) {
            const label = ANSWER_LABELS.specialization[mappedData.specialization] || mappedData.specialization;
            specializationCounts[label] = (specializationCounts[label] || 0) + 1;
        }
        if (mappedData.currentIncome) {
            const label = ANSWER_LABELS.currentIncome[mappedData.currentIncome] || mappedData.currentIncome;
            currentIncomeCounts[label] = (currentIncomeCounts[label] || 0) + 1;
        }

        if (mappedData.background && mappedData.incomeGoal && mappedData.timeline) {
            const bgLabel = ANSWER_LABELS.background[mappedData.background] || mappedData.background;
            const goalLabel = ANSWER_LABELS.incomeGoal[mappedData.incomeGoal] || mappedData.incomeGoal;
            const timeLabel = ANSWER_LABELS.timeline[mappedData.timeline] || mappedData.timeline;
            const pattern = `${bgLabel} → ${goalLabel} → ${timeLabel}`;
            patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
        }
    });

    // Build funnel
    const funnel = QUESTIONS.map((q) => {
        const stats = questionStats[q.key];
        const dropOffRate = stats.reached > 0 ? Math.round(((stats.reached - stats.answered) / stats.reached) * 100) : 0;
        const answers = Object.entries(stats.answers)
            .map(([value, count]) => ({
                value,
                label: ANSWER_LABELS[q.key]?.[value] || value,
                count,
                percentage: stats.answered > 0 ? Math.round((count / stats.answered) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);

        return {
            questionNumber: q.id,
            questionText: q.text,
            pillar: q.pillar,
            reached: stats.reached,
            answered: stats.answered,
            dropOffRate,
            answers,
        };
    });

    const toBreakdown = (counts: Record<string, number>) => {
        const total = Object.values(counts).reduce((a, b) => a + b, 0);
        return Object.entries(counts)
            .map(([label, count]) => ({
                label,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
            }))
            .sort((a, b) => b.count - a.count);
    };

    const topPatterns = Object.entries(patternCounts)
        .map(([pattern, count]) => ({
            pattern,
            count,
            percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    const totalEnrolled = filteredTags.filter(st => st.user.enrollments.length > 0).length;

    const variantBreakdown = Object.entries(variantCounts)
        .map(([variant, count]) => ({
            variant,
            count,
            percentage: scholarshipTags.length > 0 ? Math.round((count / scholarshipTags.length) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count);

    // ─── Per-quiz breakdown (views per quiz) ────────────────────────
    const perQuizStats: Record<string, number> = {};
    allQuizVisitors.forEach((v) => {
        const match = v.page.match(/^quiz-start-([^?]+)/);
        if (match) {
            perQuizStats[match[1]] = (perQuizStats[match[1]] || 0) + 1;
        }
    });

    return NextResponse.json({
        // Meta
        alaskaDate: alaskaDateStr,
        alaskaTime: alaskaTimeStr,
        daysFilter: daysParam,
        quizFilter: quizParam,
        variantFilter: variantParam,
        // Quizzes
        availableQuizzes,
        perQuizStats,
        // Funnel numbers
        quizPageViews,
        totalStarts,
        totalCompletes,
        totalEnrolled,
        quizToSubmissionRate: quizPageViews > 0 ? Math.round((totalStarts / quizPageViews) * 100 * 10) / 10 : 0,
        overallCompletionRate: totalStarts > 0 ? Math.round((totalCompletes / totalStarts) * 100 * 10) / 10 : 0,
        enrollmentRate: totalStarts > 0 ? Math.round((totalEnrolled / totalStarts) * 100 * 10) / 10 : 0,
        questionProgress,
        funnel,
        topPatterns,
        backgroundBreakdown: toBreakdown(backgroundCounts),
        incomeGoalBreakdown: toBreakdown(incomeGoalCounts),
        specializationBreakdown: toBreakdown(specializationCounts),
        currentIncomeBreakdown: toBreakdown(currentIncomeCounts),
        activeVariants,
        variantBreakdown,
    });
}

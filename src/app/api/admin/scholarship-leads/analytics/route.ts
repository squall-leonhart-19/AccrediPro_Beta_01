import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scholarship-leads/analytics
 *
 * Returns analytics for scholarship quiz:
 * - Question-by-question drop-off rates
 * - Answer distribution per question
 * - Background/income/specialization/currentIncome breakdowns
 * - Common conversion patterns
 * - Date range filtering via ?days=7|30|90|all
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

    // Variant filter
    const variantParam = req.nextUrl.searchParams.get("variant") || "all";

    // Date range filter
    const daysParam = req.nextUrl.searchParams.get("days") || "30";
    const dateFilter: { gte?: Date } = {};
    if (daysParam !== "all") {
        const days = parseInt(daysParam, 10) || 30;
        const since = new Date();
        since.setDate(since.getDate() - days);
        dateFilter.gte = since;
    }

    // Get quiz page views with progress data (from ChatOptin tracking)
    const quizVisitors = await prisma.chatOptin.findMany({
        where: {
            page: { startsWith: "quiz-start-" },
            ...(dateFilter.gte ? { createdAt: { gte: dateFilter.gte } } : {}),
        },
        select: { page: true },
    });
    const quizPageViews = quizVisitors.length;

    // Parse per-question progress from page field (format: quiz-start-depth-method?v=A&q=5)
    // q=0 means just landed, q=1 means answered Q1, etc.
    const questionProgress: number[] = new Array(12).fill(0); // index 0-11
    quizVisitors.forEach((v) => {
        const qMatch = v.page.match(/[?&]q=(\d+)/);
        const qReached = qMatch ? parseInt(qMatch[1], 10) : 0;
        // Count how many visitors reached at least each question level
        for (let i = 0; i <= qReached && i < questionProgress.length; i++) {
            questionProgress[i]++;
        }
    });

    // Get all scholarship applications with quiz data
    const scholarshipTags = await prisma.userTag.findMany({
        where: {
            tag: "scholarship_application_submitted",
            ...(dateFilter.gte ? { createdAt: { gte: dateFilter.gte } } : {}),
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

    // 11-question Hormozi quiz structure
    // NOTE: quizData uses OLD field names from URL params, mapped here
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

    // Answer labels for display (includes both old and new quiz values)
    const ANSWER_LABELS: Record<string, Record<string, string>> = {
        specialization: {
            "gut-health": "Gut Health", "hormone-health": "Hormonal Health", "burnout": "Stress/Burnout",
            "autoimmune": "Autoimmune", "metabolic": "Metabolic Health", "explore": "Not sure yet",
            // Old quiz values
            "gut-restoration": "Gut Health", "burnout-recovery": "Stress/Burnout",
            "autoimmune-support": "Autoimmune", "metabolic-optimization": "Metabolic Health",
        },
        background: {
            "nurse": "Nurse/Nursing Assistant", "doctor": "Doctor/PA/NP", "allied-health": "Allied Health",
            "mental-health": "Mental Health Pro", "wellness": "Wellness/Fitness", "career-change": "Career Change",
            // Persona values from old quiz
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
            // Old clinicalReady values
            "yes-eager": "Yes, eager", "yes-with-guidance": "Yes, with guidance",
            "not-yet": "Not yet", "unsure": "Unsure",
        },
        painPoint: {
            "time-for-money": "Trading time for money", "stuck": "Feeling stuck", "meant-for-more": "Meant for more",
            "exhausted": "Exhausted", "no-credential": "No credential",
            // Old labInterest values
            "very-interested": "Very interested", "somewhat": "Somewhat interested",
            "not-sure": "Not sure", "already-know": "Already know",
        },
        timeline: {
            "immediately": "Immediately", "30-days": "Within 30 days", "1-3-months": "1-3 months", "exploring": "Just exploring",
            // Old values
            "this-week": "This week", "this-month": "This month",
        },
        incomeGoal: {
            "3k-5k": "$3K-$5K/month", "5k-10k": "$5K-$10K/month", "10k-15k": "$10K-$15K/month", "15k-plus": "$15K+/month",
            // Old goal values
            "5k": "$5K/month", "10k": "$10K/month", "20k": "$20K/month", "50k-plus": "$50K+/month",
        },
        timeStuck: {
            "less-than-month": "< 1 month", "1-6-months": "1-6 months", "6-12-months": "6-12 months", "over-year": "Over a year",
            // Old missingSkill values
            "clinical-skills": "Clinical skills", "business-skills": "Business skills",
            "confidence": "Confidence", "credential": "Credential", "all-above": "All of the above",
        },
        currentIncome: {
            "under-3k": "Under $3K", "3k-5k": "$3K-$5K", "5k-8k": "$5K-$8K", "over-8k": "Over $8K",
            // Old values
            "0": "$0/month", "under-2k": "Under $2K", "2k-5k": "$2K-$5K", "over-5k": "Over $5K",
        },
        dreamLife: {
            "financial-freedom": "Financial freedom", "time-freedom": "Time freedom", "purpose": "Purpose",
            "independence": "Independence", "all-above": "All of the above",
            // Old vision values
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
    // Count completions = quiz submissions with all core fields present (not enrollments!)
    let totalCompletes = 0;

    // Count answers per question
    const questionStats: Record<string, { reached: number; answered: number; answers: Record<string, number> }> = {};
    QUESTIONS.forEach(q => {
        questionStats[q.key] = { reached: 0, answered: 0, answers: {} };
    });

    // Distribution counters
    const backgroundCounts: Record<string, number> = {};
    const incomeGoalCounts: Record<string, number> = {};
    const specializationCounts: Record<string, number> = {};
    const currentIncomeCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};

    filteredTags.forEach((st) => {
        const meta = st.metadata as {
            quizData?: Record<string, string>;
        } | null;

        const quizData = meta?.quizData || {};

        // Map old field names → new analytics keys
        const mappedData: Record<string, string> = {};

        // For each question, check new key first, then old keys
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

        // Count how many questions were answered to determine completion
        const answeredCount = QUESTIONS.filter(q => mappedData[q.key]).length;
        if (answeredCount >= 6) totalCompletes++; // Consider "complete" if ≥6 questions answered

        // Track funnel - assume they reached all questions up to their last answered one
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

        // Count distributions
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

        // Track pattern (background → incomeGoal → timeline)
        if (mappedData.background && mappedData.incomeGoal && mappedData.timeline) {
            const bgLabel = ANSWER_LABELS.background[mappedData.background] || mappedData.background;
            const goalLabel = ANSWER_LABELS.incomeGoal[mappedData.incomeGoal] || mappedData.incomeGoal;
            const timeLabel = ANSWER_LABELS.timeline[mappedData.timeline] || mappedData.timeline;
            const pattern = `${bgLabel} → ${goalLabel} → ${timeLabel}`;
            patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
        }
    });

    // Build funnel response
    const funnel = QUESTIONS.map((q) => {
        const stats = questionStats[q.key];
        const dropOffRate = stats.reached > 0 ? Math.round(((stats.reached - stats.answered) / stats.reached) * 100) : 0;

        // Get top answers with labels
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

    // Build breakdowns
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

    // Top patterns
    const topPatterns = Object.entries(patternCounts)
        .map(([pattern, count]) => ({
            pattern,
            count,
            percentage: totalStarts > 0 ? Math.round((count / totalStarts) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    // Enrolled count (actually paid)
    const totalEnrolled = filteredTags.filter(st => st.user.enrollments.length > 0).length;

    // Variant breakdown
    const variantBreakdown = Object.entries(variantCounts)
        .map(([variant, count]) => ({
            variant,
            count,
            percentage: scholarshipTags.length > 0 ? Math.round((count / scholarshipTags.length) * 100 * 10) / 10 : 0,
        }))
        .sort((a, b) => b.count - a.count);

    return NextResponse.json({
        quizPageViews,
        totalStarts,
        totalCompletes,
        totalEnrolled,
        quizToSubmissionRate: quizPageViews > 0 ? Math.round((totalStarts / quizPageViews) * 100 * 10) / 10 : 0,
        overallCompletionRate: totalStarts > 0 ? Math.round((totalCompletes / totalStarts) * 100 * 10) / 10 : 0,
        enrollmentRate: totalStarts > 0 ? Math.round((totalEnrolled / totalStarts) * 100 * 10) / 10 : 0,
        questionProgress, // [landed, answeredQ1, answeredQ2, ..., answeredQ11]
        funnel,
        topPatterns,
        backgroundBreakdown: toBreakdown(backgroundCounts),
        incomeGoalBreakdown: toBreakdown(incomeGoalCounts),
        specializationBreakdown: toBreakdown(specializationCounts),
        currentIncomeBreakdown: toBreakdown(currentIncomeCounts),
        daysFilter: daysParam,
        activeVariants,
        variantBreakdown,
        variantFilter: variantParam,
    });
}

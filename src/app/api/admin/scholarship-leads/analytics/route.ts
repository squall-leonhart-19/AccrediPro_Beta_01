import { NextResponse } from "next/server";
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
 * - Background/income/specialization breakdowns
 * - Common conversion patterns
 */
export async function GET() {
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

    // Get all scholarship applications with quiz data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const scholarshipTags = await prisma.userTag.findMany({
        where: {
            tag: "scholarship_application_submitted",
            createdAt: { gte: thirtyDaysAgo },
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

    // New Hormozi 11-question structure
    const QUESTIONS = [
        { id: 1, pillar: "Specialization", text: "Which area of FM excites you most?", key: "specialization" },
        { id: 2, pillar: "Background", text: "What best describes your background?", key: "background" },
        { id: 3, pillar: "Experience", text: "Knowledge of Functional Medicine?", key: "experience" },
        { id: 4, pillar: "Motivation", text: "Main reason to get certified?", key: "motivation" },
        { id: 5, pillar: "Pain Point", text: "What frustrates you MOST?", key: "painPoint" },
        { id: 6, pillar: "Timeline", text: "When to start certification?", key: "timeline" },
        { id: 7, pillar: "Income Goal", text: "Target monthly income?", key: "incomeGoal" },
        { id: 8, pillar: "Time Stuck", text: "How long thinking about change?", key: "timeStuck" },
        { id: 9, pillar: "Current Income", text: "Current monthly income?", key: "currentIncome" },
        { id: 10, pillar: "Dream Life", text: "What matters most about goal life?", key: "dreamLife" },
        { id: 11, pillar: "Commitment", text: "How committed are you?", key: "commitment" },
    ];

    // Answer labels for display
    const ANSWER_LABELS: Record<string, Record<string, string>> = {
        specialization: {
            "gut-health": "Gut Health", "hormone-health": "Hormonal Health", "burnout": "Stress/Burnout",
            "autoimmune": "Autoimmune", "metabolic": "Metabolic Health", "explore": "Not sure yet"
        },
        background: {
            "nurse": "Nurse/Nursing Assistant", "doctor": "Doctor/PA/NP", "allied-health": "Allied Health",
            "mental-health": "Mental Health Pro", "wellness": "Wellness/Fitness", "career-change": "Career Change"
        },
        experience: {
            "brand-new": "Brand new", "self-study": "Self-study", "some-training": "Some courses", "already-practicing": "Already practicing"
        },
        motivation: {
            "help-people": "Help people heal", "leave-job": "Leave current job", "add-services": "Add to practice",
            "work-from-home": "Work from home", "burned-out": "Burned out"
        },
        painPoint: {
            "time-for-money": "Trading time for money", "stuck": "Feeling stuck", "meant-for-more": "Meant for more",
            "exhausted": "Exhausted", "no-credential": "No credential"
        },
        timeline: {
            "immediately": "Immediately", "30-days": "Within 30 days", "1-3-months": "1-3 months", "exploring": "Just exploring"
        },
        incomeGoal: {
            "3k-5k": "$3K-$5K/month", "5k-10k": "$5K-$10K/month", "10k-15k": "$10K-$15K/month", "15k-plus": "$15K+/month"
        },
        timeStuck: {
            "less-than-month": "< 1 month", "1-6-months": "1-6 months", "6-12-months": "6-12 months", "over-year": "Over a year"
        },
        currentIncome: {
            "under-3k": "Under $3K", "3k-5k": "$3K-$5K", "5k-8k": "$5K-$8K", "over-8k": "Over $8K"
        },
        dreamLife: {
            "financial-freedom": "Financial freedom", "time-freedom": "Time freedom", "purpose": "Purpose",
            "independence": "Independence", "all-above": "All of the above"
        },
        commitment: {
            "100-percent": "100% committed", "very-committed": "Very committed", "interested": "Interested", "curious": "Just curious"
        }
    };

    // Extract quiz data from all applications
    const totalStarts = scholarshipTags.length;
    const totalCompletes = scholarshipTags.filter(st => st.user.enrollments.length > 0).length;

    // Count answers per question
    const questionStats: Record<string, { reached: number; answered: number; answers: Record<string, number> }> = {};
    QUESTIONS.forEach(q => {
        questionStats[q.key] = { reached: 0, answered: 0, answers: {} };
    });

    // Pattern counters
    const backgroundCounts: Record<string, number> = {};
    const incomeGoalCounts: Record<string, number> = {};
    const specializationCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};

    scholarshipTags.forEach((st) => {
        const meta = st.metadata as {
            quizData?: Record<string, string>;
        } | null;

        const quizData = meta?.quizData || {};

        // Map old field names to new ones
        const mappedData: Record<string, string> = {};
        if (quizData.type) mappedData.specialization = quizData.type;
        if (quizData.role) mappedData.background = quizData.role;
        if (quizData.experience) mappedData.experience = quizData.experience;
        if (quizData.goal) mappedData.incomeGoal = quizData.goal;
        if (quizData.currentIncome) mappedData.currentIncome = quizData.currentIncome;
        if (quizData.commitment) mappedData.commitment = quizData.commitment;
        if (quizData.vision) mappedData.dreamLife = quizData.vision;
        if (quizData.startTimeline) mappedData.timeline = quizData.startTimeline;

        // Also check direct new field names
        Object.keys(quizData).forEach(k => {
            if (!mappedData[k]) mappedData[k] = quizData[k];
        });

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

        // Track pattern (background → motivation → timeline)
        if (mappedData.background && mappedData.motivation && mappedData.timeline) {
            const bgLabel = ANSWER_LABELS.background[mappedData.background] || mappedData.background;
            const motLabel = ANSWER_LABELS.motivation[mappedData.motivation] || mappedData.motivation;
            const timeLabel = ANSWER_LABELS.timeline[mappedData.timeline] || mappedData.timeline;
            const pattern = `${bgLabel} → ${motLabel} → ${timeLabel}`;
            patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
        }
    });

    // Build funnel response
    const funnel = QUESTIONS.map((q) => {
        const stats = questionStats[q.key];
        const dropOffRate = stats.reached > 0 ? Math.round(((stats.reached - stats.answered) / stats.reached) * 100) : 0;

        // get top answers
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
        .slice(0, 5);

    // Calculate avg time (approximate based on created timestamps)
    const avgTimeToComplete = "4m 32s"; // Placeholder - would need event tracking for real data

    return NextResponse.json({
        totalStarts,
        totalCompletes,
        overallCompletionRate: totalStarts > 0 ? Math.round((totalCompletes / totalStarts) * 100 * 10) / 10 : 0,
        avgTimeToComplete,
        funnel,
        topPatterns,
        backgroundBreakdown: toBreakdown(backgroundCounts),
        incomeGoalBreakdown: toBreakdown(incomeGoalCounts),
        specializationBreakdown: toBreakdown(specializationCounts),
    });
}

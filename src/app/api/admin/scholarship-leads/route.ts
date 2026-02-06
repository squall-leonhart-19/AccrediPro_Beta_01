import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scholarship-leads
 *
 * Returns all scholarship leads with:
 * - Full quiz answers
 * - Chat messages
 * - Timeline events
 * - Drop-off analysis
 * - Qualification score
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin/instructor access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(user?.role || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get all scholarship applications based on tags
  const scholarshipTags = await prisma.userTag.findMany({
    where: {
      tag: "scholarship_application_submitted",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          createdAt: true,
          lastLoginAt: true,
          leadSource: true,
          leadSourceDetail: true,
          enrollments: {
            where: {
              course: {
                OR: [
                  { slug: { contains: "certification" } },
                  { slug: { contains: "accelerator" } },
                ],
              },
            },
            select: { id: true, courseId: true },
          },
          tags: {
            select: {
              tag: true,
              value: true,
              metadata: true,
              createdAt: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get all chat messages for these visitors
  const visitorIds = scholarshipTags
    .map((st) => {
      const meta = st.metadata as { visitorId?: string } | null;
      return meta?.visitorId;
    })
    .filter(Boolean) as string[];

  const allMessages = visitorIds.length > 0
    ? await prisma.chatMessage.findMany({
      where: { visitorId: { in: visitorIds } },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        visitorId: true,
        page: true,
        message: true,
        isFromVisitor: true,
        isRead: true,
        createdAt: true,
        repliedBy: true,
      },
    })
    : [];

  // Group messages by visitorId
  const messagesByVisitor: Record<string, typeof allMessages> = {};
  allMessages.forEach((msg) => {
    if (!messagesByVisitor[msg.visitorId]) {
      messagesByVisitor[msg.visitorId] = [];
    }
    messagesByVisitor[msg.visitorId].push(msg);
  });

  // Human-readable labels
  const TYPE_LABELS: Record<string, string> = {
    "hormone-health": "Hormone Health",
    "gut-restoration": "Gut Restoration",
    "metabolic-optimization": "Metabolic Optimization",
    "burnout-recovery": "Burnout Recovery",
    "autoimmune-support": "Autoimmune Support",
  };

  const GOAL_LABELS: Record<string, string> = {
    "5k": "$5,000/month",
    "10k": "$10,000/month",
    "20k": "$20,000/month",
    "50k-plus": "$50,000+/month",
  };

  const INCOME_LABELS: Record<string, string> = {
    "0": "$0/month",
    "under-2k": "under $2K/month",
    "2k-5k": "$2K-$5K/month",
    "over-5k": "over $5K/month",
  };

  // Transform data
  const leads = scholarshipTags.map((st) => {
    const userData = st.user;
    const allTags = Object.fromEntries(
      userData.tags.map((t) => [t.tag, { value: t.value, metadata: t.metadata, createdAt: t.createdAt }])
    );

    // Extract application metadata
    const applicationMeta = st.metadata as {
      quizData?: Record<string, string>;
      visitorId?: string;
      page?: string;
    } | null;

    const visitorId = applicationMeta?.visitorId || null;
    const quizData = applicationMeta?.quizData || {};

    // Also pull from quiz completion tag
    const quizCompletionMeta = (allTags["quiz_depth-method_completed"]?.metadata ||
      allTags["quiz_fm-application_completed"]?.metadata) as {
        answers?: Record<string, string>;
        practitionerType?: string;
        incomeGoal?: string;
        currentRole?: string;
      } | null;

    // Build comprehensive quiz answers
    const quizAnswers: Record<string, string> = {};

    // From quiz completion
    if (quizCompletionMeta?.answers) {
      const ans = quizCompletionMeta.answers;
      if (ans["0"]) quizAnswers.q1_background = ans["0"];
      if (ans["1"]) quizAnswers.q2_income = ans["1"];
      if (ans["2"]) quizAnswers.q3_goal = ans["2"];
      if (ans["3"]) quizAnswers.q4_experience = ans["3"];
      if (ans["4"]) quizAnswers.q5_clinical = ans["4"];
      if (ans["5"]) quizAnswers.q6_labs = ans["5"];
      if (ans["6"]) quizAnswers.q7_certs = ans["6"];
      if (ans["7"]) quizAnswers.q8_missing = ans["7"];
      if (ans["8"]) quizAnswers.q9_commitment = ans["8"];
      if (ans["9"]) quizAnswers.q10_vision = ans["9"];
      if (ans["10"]) quizAnswers.q11_niche = ans["10"];
      if (ans["11"]) quizAnswers.q12_careerPath = ans["11"];
      if (ans["12"]) quizAnswers.q13_clientAcquisition = ans["12"];
      if (ans["13"]) quizAnswers.q14_financialSituation = ans["13"];
      if (ans["14"]) quizAnswers.q15_investmentPriority = ans["14"];
      if (ans["15"]) quizAnswers.q16_startTimeline = ans["15"];
      if (ans["16"]) quizAnswers.q17_revealChoice = ans["16"];
    }

    // Calculate qualification score
    let qualScore = 0;
    const strongAnswers = [
      "healthcare-pro", "health-coach", "comfortable", "stable",
      "funds-ready", "savings-credit", "this-week", "2-weeks",
      "over-5k", "2k-5k", "active-clients", "5-10-years",
      "reveal-status"
    ];
    const goodAnswers = [
      "corporate", "stay-at-home-mom", "payment-plan", "1-month",
      "planning", "under-2k", "some-clients", "2-4-years"
    ];

    Object.values(quizAnswers).forEach((answer) => {
      if (strongAnswers.some((s) => answer?.includes(s))) qualScore += 10;
      else if (goodAnswers.some((g) => answer?.includes(g))) qualScore += 5;
    });
    qualScore = Math.min(qualScore, 100);

    // Extract key fields
    const specialization = allTags["scholarship_specialization"]?.value || quizData.type || "unknown";
    const incomeGoal = allTags["scholarship_income_goal"]?.value || quizData.goal || quizCompletionMeta?.incomeGoal || "unknown";
    const currentIncome = allTags["scholarship_current_income"]?.value || quizData.currentIncome || "unknown";
    const status = allTags["scholarship_status"]?.value || "pending";
    const offeredAmount = allTags["scholarship_offered_amount"]?.value || null;
    const approvedAt = allTags["scholarship_approved_at"]?.value || null;

    // Build timeline
    const timeline: { event: string; label: string; timestamp: string; icon: string }[] = [];

    // Quiz completed
    const quizCompletedTag = allTags["quiz_depth-method_completed"] || allTags["quiz_fm-application_completed"];
    if (quizCompletedTag) {
      timeline.push({
        event: "quiz_completed",
        label: "Completed qualification quiz",
        timestamp: quizCompletedTag.createdAt.toISOString(),
        icon: "✅",
      });
    }

    // Application submitted
    timeline.push({
      event: "application_submitted",
      label: "Scholarship application submitted",
      timestamp: st.createdAt.toISOString(),
      icon: "📋",
    });

    // Investment selected
    if (offeredAmount) {
      timeline.push({
        event: "investment_selected",
        label: `Selected investment: ${offeredAmount}`,
        timestamp: allTags["scholarship_offered_amount"]?.createdAt?.toISOString() || st.createdAt.toISOString(),
        icon: "💰",
      });
    }

    // Approved
    if (approvedAt) {
      timeline.push({
        event: "approved",
        label: "Scholarship approved",
        timestamp: approvedAt,
        icon: "🎉",
      });
    }

    // Converted
    if (userData.enrollments.length > 0) {
      timeline.push({
        event: "converted",
        label: "Enrolled in certification",
        timestamp: userData.createdAt.toISOString(),
        icon: "🏆",
      });
    }

    // Sort timeline by timestamp
    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Detect drop-off stage
    let dropOffStage: string | null = null;
    if (userData.enrollments.length === 0) {
      if (!approvedAt && offeredAmount) dropOffStage = "After investment selection";
      else if (!offeredAmount && allTags["scholarship_chat_started"]) dropOffStage = "During chat";
      else if (!allTags["scholarship_chat_started"]) dropOffStage = "Before chat engagement";
    }

    // Get messages for this visitor
    const messages = visitorId ? (messagesByVisitor[visitorId] || []).map((m) => ({
      ...m,
      createdAt: m.createdAt.toISOString(),
    })) : [];

    return {
      id: userData.id,
      email: userData.email,
      firstName: userData.firstName || "Unknown",
      lastName: userData.lastName,
      phone: userData.phone,
      createdAt: userData.createdAt.toISOString(),
      applicationDate: st.createdAt.toISOString(),
      lastLoginAt: userData.lastLoginAt?.toISOString() || null,
      specialization,
      specializationLabel: TYPE_LABELS[specialization] || specialization,
      incomeGoal,
      incomeGoalLabel: GOAL_LABELS[incomeGoal] || incomeGoal,
      currentIncome,
      currentIncomeLabel: INCOME_LABELS[currentIncome] || currentIncome,
      financialSituation: quizAnswers.q14_financialSituation || null,
      investmentPriority: quizAnswers.q15_investmentPriority || null,
      startTimeline: quizAnswers.q16_startTimeline || null,
      status,
      offeredAmount,
      approvedAt,
      hasConverted: userData.enrollments.length > 0,
      visitorId,
      page: applicationMeta?.page || null,
      qualificationScore: qualScore,
      quizAnswers,
      messages,
      timeline,
      dropOffStage,
    };
  });

  // Calculate stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = {
    total: leads.length,
    today: leads.filter((l) => new Date(l.applicationDate) >= todayStart).length,
    thisWeek: leads.filter((l) => new Date(l.applicationDate) >= weekStart).length,
    thisMonth: leads.filter((l) => new Date(l.applicationDate) >= monthStart).length,
    pending: leads.filter((l) => l.status === "pending").length,
    approved: leads.filter((l) => l.status === "approved").length,
    converted: leads.filter((l) => l.hasConverted).length,
    conversionRate:
      leads.length > 0
        ? Math.round((leads.filter((l) => l.hasConverted).length / leads.length) * 100)
        : 0,
    bySpecialization: getSpecializationStats(leads),
    byIncomeGoal: getIncomeGoalStats(leads),
    avgQualScore: leads.length > 0
      ? Math.round(leads.reduce((sum, l) => sum + l.qualificationScore, 0) / leads.length)
      : 0,
    byDropOff: getDropOffStats(leads),
  };

  return NextResponse.json({ leads, stats });
}

function getSpecializationStats(leads: Array<{ specialization: string; specializationLabel: string }>) {
  const counts: Record<string, { count: number; label: string }> = {};
  leads.forEach((lead) => {
    if (!counts[lead.specialization]) {
      counts[lead.specialization] = { count: 0, label: lead.specializationLabel };
    }
    counts[lead.specialization].count++;
  });

  return Object.entries(counts)
    .map(([key, { count, label }]) => ({ specialization: key, label, count }))
    .sort((a, b) => b.count - a.count);
}

function getIncomeGoalStats(leads: Array<{ incomeGoal: string; incomeGoalLabel: string }>) {
  const counts: Record<string, { count: number; label: string }> = {};
  leads.forEach((lead) => {
    if (!counts[lead.incomeGoal]) {
      counts[lead.incomeGoal] = { count: 0, label: lead.incomeGoalLabel };
    }
    counts[lead.incomeGoal].count++;
  });

  return Object.entries(counts)
    .map(([key, { count, label }]) => ({ goal: key, label, count }))
    .sort((a, b) => b.count - a.count);
}

function getDropOffStats(leads: Array<{ dropOffStage: string | null }>) {
  const counts: Record<string, number> = {};
  leads.forEach((lead) => {
    const stage = lead.dropOffStage || "converted";
    counts[stage] = (counts[stage] || 0) + 1;
  });

  return Object.entries(counts)
    .map(([stage, count]) => ({ stage, count }))
    .sort((a, b) => b.count - a.count);
}

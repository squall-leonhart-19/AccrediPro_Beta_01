import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scholarship-leads
 *
 * Returns all scholarship leads with:
 * - Full quiz answers from application metadata
 * - Chat messages (from SalesChat)
 * - Timeline events
 * - Drop-off analysis
 * - Qualification score
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

  // Date range filter
  const daysParam = req.nextUrl.searchParams.get("days") || "all";
  const dateFilter: { gte?: Date } = {};
  if (daysParam !== "all") {
    const days = parseInt(daysParam, 10) || 30;
    const since = new Date();
    since.setDate(since.getDate() - days);
    dateFilter.gte = since;
  }

  // Get all scholarship applications
  const scholarshipTags = await prisma.userTag.findMany({
    where: {
      tag: "scholarship_application_submitted",
      ...(dateFilter.gte ? { createdAt: { gte: dateFilter.gte } } : {}),
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
          tags: {
            select: { tag: true, value: true, metadata: true, createdAt: true },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get all chat messages for scholarship pages
  const allChatMessages = await prisma.salesChat.findMany({
    where: { page: { contains: "scholarship", mode: "insensitive" } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      visitorId: true,
      visitorEmail: true,
      visitorName: true,
      page: true,
      message: true,
      isFromVisitor: true,
      isRead: true,
      createdAt: true,
      repliedBy: true,
    },
  });

  // Get optins to map visitorIds to emails
  const visitorIds = [...new Set(allChatMessages.map((m) => m.visitorId))];
  const optins = visitorIds.length > 0
    ? await prisma.chatOptin.findMany({
      where: { visitorId: { in: visitorIds } },
      select: { visitorId: true, email: true, name: true },
    })
    : [];
  const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

  // Group messages by email
  const messagesByEmail: Record<string, typeof allChatMessages> = {};
  allChatMessages.forEach((msg) => {
    const optin = optinMap.get(msg.visitorId);
    const email = (optin?.email || msg.visitorEmail)?.toLowerCase();
    if (email) {
      if (!messagesByEmail[email]) messagesByEmail[email] = [];
      messagesByEmail[email].push(msg);
    }
  });

  // Also group by visitorId for fallback
  const messagesByVisitorId: Record<string, typeof allChatMessages> = {};
  allChatMessages.forEach((msg) => {
    if (!messagesByVisitorId[msg.visitorId]) messagesByVisitorId[msg.visitorId] = [];
    messagesByVisitorId[msg.visitorId].push(msg);
  });

  // Labels
  const TYPE_LABELS: Record<string, string> = {
    "hormone-health": "Hormone Health",
    "gut-restoration": "Gut Restoration",
    "metabolic-optimization": "Metabolic Optimization",
    "burnout-recovery": "Burnout Recovery",
    "autoimmune-support": "Autoimmune Support",
  };

  const GOAL_LABELS: Record<string, string> = {
    "5k": "$5K/month",
    "10k": "$10K/month",
    "20k": "$20K/month",
    "50k-plus": "$50K+/month",
  };

  const ROLE_LABELS: Record<string, string> = {
    "healthcare-pro": "Healthcare Professional",
    "health-coach": "Health Coach",
    "corporate": "Corporate Professional",
    "stay-at-home-mom": "Stay-at-Home Mom",
    "other-passionate": "Other/Passionate",
  };

  const ANSWER_LABELS: Record<string, Record<string, string>> = {
    clinicalReady: {
      "very-confident": "Very confident",
      "somewhat": "Somewhat ready",
      "need-training": "Need training",
      "intimidated": "Intimidated",
    },
    labInterest: {
      "already-doing": "Already doing labs",
      "want-to-learn": "Want to learn",
      "not-interested": "Not interested",
    },
    commitment: {
      "absolutely": "Absolutely (20+ min/day)",
      "probably": "Probably can manage",
      "worried": "Worried about time",
      "unsure": "Not sure",
    },
    vision: {
      "leave-job": "Leave current job",
      "security": "Financial security",
      "side-income": "Side income",
      "help-others": "Help others",
    },
    experience: {
      "active-clients": "Active paying clients",
      "past-clients": "Past clients",
      "informal": "Informal only",
      "none": "No experience",
    },
  };

  // Transform data
  const leads = scholarshipTags.map((st) => {
    const userData = st.user;
    const allTags = Object.fromEntries(
      userData.tags.map((t) => [t.tag, { value: t.value, metadata: t.metadata, createdAt: t.createdAt }])
    );

    // Extract quiz data from application metadata - THIS IS WHERE THE DATA IS!
    const applicationMeta = st.metadata as {
      quizData?: {
        type?: string;
        goal?: string;
        role?: string;
        currentIncome?: string;
        experience?: string;
        clinicalReady?: string;
        labInterest?: string;
        pastCerts?: string;
        missingSkill?: string;
        commitment?: string;
        vision?: string;
        startTimeline?: string;
        financialSituation?: string;
        investmentPriority?: string;
      };
      visitorId?: string;
      page?: string;
    } | null;

    const quizData = applicationMeta?.quizData || {};
    const visitorId = applicationMeta?.visitorId || null;

    // Build quiz answers from metadata
    const quizAnswers: Record<string, string> = {};
    let answeredCount = 0;

    if (quizData.role) { quizAnswers.background = ROLE_LABELS[quizData.role] || quizData.role; answeredCount++; }
    if (quizData.currentIncome) { quizAnswers.currentIncome = quizData.currentIncome; answeredCount++; }
    if (quizData.goal) { quizAnswers.incomeGoal = GOAL_LABELS[quizData.goal] || quizData.goal; answeredCount++; }
    if (quizData.experience) { quizAnswers.experience = ANSWER_LABELS.experience?.[quizData.experience] || quizData.experience; answeredCount++; }
    if (quizData.clinicalReady) { quizAnswers.clinicalReady = ANSWER_LABELS.clinicalReady?.[quizData.clinicalReady] || quizData.clinicalReady; answeredCount++; }
    if (quizData.labInterest) { quizAnswers.labInterest = ANSWER_LABELS.labInterest?.[quizData.labInterest] || quizData.labInterest; answeredCount++; }
    if (quizData.pastCerts) { quizAnswers.pastCerts = quizData.pastCerts; answeredCount++; }
    if (quizData.missingSkill) { quizAnswers.missingSkill = quizData.missingSkill; answeredCount++; }
    if (quizData.commitment) { quizAnswers.commitment = ANSWER_LABELS.commitment?.[quizData.commitment] || quizData.commitment; answeredCount++; }
    if (quizData.vision) { quizAnswers.vision = ANSWER_LABELS.vision?.[quizData.vision] || quizData.vision; answeredCount++; }
    if (quizData.type) { quizAnswers.specialization = TYPE_LABELS[quizData.type] || quizData.type; answeredCount++; }
    if (quizData.startTimeline) { quizAnswers.startTimeline = quizData.startTimeline; answeredCount++; }
    if (quizData.financialSituation) { quizAnswers.financialSituation = quizData.financialSituation; answeredCount++; }
    if (quizData.investmentPriority) { quizAnswers.investmentPriority = quizData.investmentPriority; answeredCount++; }

    // Calculate qualification score
    let qualScore = 0;
    const strongIndicators = ["healthcare-pro", "health-coach", "comfortable", "stable", "funds-ready", "savings-credit", "this-week", "2-weeks", "over-5k", "2k-5k", "active-clients", "absolutely", "very-confident", "already-doing"];
    const goodIndicators = ["corporate", "payment-plan", "1-month", "planning", "under-2k", "past-clients", "probably", "somewhat", "want-to-learn"];

    Object.values(quizData).forEach((answer) => {
      if (typeof answer === "string") {
        if (strongIndicators.some((s) => answer.includes(s))) qualScore += 8;
        else if (goodIndicators.some((g) => answer.includes(g))) qualScore += 4;
      }
    });
    qualScore = Math.min(qualScore, 100);

    // Extract key display fields
    const specialization = quizData.type || allTags["scholarship_specialization"]?.value || "not-specified";
    const incomeGoal = quizData.goal || allTags["scholarship_income_goal"]?.value || "unknown";
    const status = allTags["scholarship_status"]?.value || "pending";
    const offeredAmount = allTags["scholarship_offered_amount"]?.value || null;
    const approvedAt = allTags["scholarship_approved_at"]?.value || null;

    // Build timeline
    const timeline: { event: string; label: string; timestamp: string; icon: string }[] = [];

    timeline.push({
      event: "application_submitted",
      label: "Application submitted",
      timestamp: st.createdAt.toISOString(),
      icon: "📋",
    });

    if (offeredAmount) {
      timeline.push({
        event: "investment_selected",
        label: `Selected: ${offeredAmount}`,
        timestamp: allTags["scholarship_offered_amount"]?.createdAt?.toISOString() || st.createdAt.toISOString(),
        icon: "💰",
      });
    }

    if (approvedAt) {
      timeline.push({ event: "approved", label: "Approved", timestamp: approvedAt, icon: "🎉" });
    }

    if (userData.enrollments.length > 0) {
      timeline.push({ event: "converted", label: "Enrolled!", timestamp: userData.createdAt.toISOString(), icon: "🏆" });
    }

    timeline.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // Get messages - try by email first, then by visitorId
    const userEmail = userData.email?.toLowerCase();
    let messages = userEmail ? (messagesByEmail[userEmail] || []) : [];
    if (messages.length === 0 && visitorId) {
      messages = messagesByVisitorId[visitorId] || [];
    }

    const formattedMessages = messages.map((m) => ({
      id: m.id,
      visitorId: m.visitorId,
      page: m.page,
      message: m.message,
      isFromVisitor: m.isFromVisitor,
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
      repliedBy: m.repliedBy,
    }));

    // Determine drop-off stage
    let dropOffStage: string | null = null;
    if (userData.enrollments.length === 0) {
      if (approvedAt) dropOffStage = "After approval (checkout)";
      else if (offeredAmount) dropOffStage = "After investment selection";
      else if (formattedMessages.length > 0) dropOffStage = "In chat";
      else dropOffStage = "Before chat";
    }

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
      role: quizData.role || "unknown",
      roleLabel: ROLE_LABELS[quizData.role || ""] || quizData.role || "Unknown",
      status,
      offeredAmount,
      approvedAt,
      hasConverted: userData.enrollments.length > 0,
      visitorId,
      page: applicationMeta?.page || null,
      qualificationScore: qualScore,
      answeredCount,
      quizAnswers,
      messages: formattedMessages,
      timeline,
      dropOffStage,
      unreadCount: formattedMessages.filter((m) => m.isFromVisitor && !m.isRead).length,
    };
  });

  // Calculate stats
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  // Revenue = sum of offered amounts for converted leads
  const revenue = leads
    .filter((l) => l.hasConverted && l.offeredAmount)
    .reduce((sum, l) => sum + (parseInt(l.offeredAmount!.replace(/[^0-9]/g, ""), 10) || 0), 0);

  const stats = {
    total: leads.length,
    today: leads.filter((l) => new Date(l.applicationDate) >= todayStart).length,
    thisWeek: leads.filter((l) => new Date(l.applicationDate) >= weekStart).length,
    pending: leads.filter((l) => l.status === "pending").length,
    approved: leads.filter((l) => l.status === "approved").length,
    converted: leads.filter((l) => l.hasConverted).length,
    lost: leads.filter((l) => l.status === "lost").length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.hasConverted).length / leads.length) * 100) : 0,
    avgQualScore: leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.qualificationScore, 0) / leads.length) : 0,
    totalUnread: leads.reduce((sum, l) => sum + l.unreadCount, 0),
    revenue,
  };

  return NextResponse.json({ leads, stats });
}

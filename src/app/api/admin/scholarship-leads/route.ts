import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/scholarship-leads
 *
 * Returns all scholarship leads (users with scholarship_application_submitted tag)
 * COMPLETELY SEPARATE from mini diploma leads!
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
            where: {
              tag: {
                startsWith: "scholarship_",
              },
            },
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
    const user = st.user;
    const tags = Object.fromEntries(
      user.tags.map((t) => [t.tag, { value: t.value, metadata: t.metadata, createdAt: t.createdAt }])
    );

    // Extract quiz data from the application tag
    const applicationData = tags["scholarship_application_submitted"]?.metadata as {
      quizData?: {
        type?: string;
        goal?: string;
        currentIncome?: string;
        vision?: string;
        pastCerts?: string;
      };
      visitorId?: string;
      page?: string;
    } | undefined;

    const specialization = tags["scholarship_specialization"]?.value || applicationData?.quizData?.type || "unknown";
    const incomeGoal = tags["scholarship_income_goal"]?.value || applicationData?.quizData?.goal || "unknown";
    const currentIncome = tags["scholarship_current_income"]?.value || applicationData?.quizData?.currentIncome || "unknown";
    const status = tags["scholarship_status"]?.value || "pending";
    const offeredAmount = tags["scholarship_offered_amount"]?.value || null;
    const approvedAt = tags["scholarship_approved_at"]?.value || null;

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || "Unknown",
      lastName: user.lastName,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      applicationDate: st.createdAt.toISOString(),
      lastLoginAt: user.lastLoginAt?.toISOString() || null,
      specialization,
      specializationLabel: TYPE_LABELS[specialization] || specialization,
      incomeGoal,
      incomeGoalLabel: GOAL_LABELS[incomeGoal] || incomeGoal,
      currentIncome,
      currentIncomeLabel: INCOME_LABELS[currentIncome] || currentIncome,
      status,
      offeredAmount,
      approvedAt,
      hasConverted: user.enrollments.length > 0,
      visitorId: applicationData?.visitorId || null,
      page: applicationData?.page || null,
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

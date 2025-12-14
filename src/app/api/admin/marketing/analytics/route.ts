import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/analytics - Get email analytics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    // Get daily analytics
    const dailyStats = await prisma.emailAnalytics.findMany({
      where: {
        date: { gte: startDate },
      },
      orderBy: { date: "asc" },
    });

    // Get overall totals from sequence emails (actual sent emails)
    const sequenceEmailStats = await prisma.sequenceEmail.aggregate({
      _sum: {
        sentCount: true,
        openCount: true,
        clickCount: true,
      },
    });

    // Also get from email templates
    const templateStats = await prisma.emailTemplate.aggregate({
      _sum: {
        sentCount: true,
        openCount: true,
        clickCount: true,
      },
    });

    // Combine stats from both sources
    const totalSent = (sequenceEmailStats._sum.sentCount || 0) + (templateStats._sum.sentCount || 0);
    const opened = (sequenceEmailStats._sum.openCount || 0) + (templateStats._sum.openCount || 0);
    const clicked = (sequenceEmailStats._sum.clickCount || 0) + (templateStats._sum.clickCount || 0);

    // For now, assume all sent emails are delivered (we can add bounce tracking later)
    const delivered = totalSent;
    const bounced = 0;
    const unsubscribed = 0;

    // Calculate rates
    const deliveryRate = totalSent > 0 ? (delivered / totalSent) * 100 : 0;
    const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
    const clickRate = opened > 0 ? (clicked / opened) * 100 : 0;
    const bounceRate = totalSent > 0 ? (bounced / totalSent) * 100 : 0;
    const unsubscribeRate = delivered > 0 ? (unsubscribed / delivered) * 100 : 0;

    // Get top performing emails from templates
    const topTemplateEmails = await prisma.emailTemplate.findMany({
      where: {
        sentCount: { gt: 0 },
      },
      orderBy: { openCount: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        subject: true,
        sentCount: true,
        openCount: true,
        clickCount: true,
      },
    });

    // Get top performing sequence emails
    const topSequenceEmails = await prisma.sequenceEmail.findMany({
      where: {
        sentCount: { gt: 0 },
      },
      orderBy: { sentCount: "desc" },
      take: 5,
      select: {
        id: true,
        customSubject: true,
        sentCount: true,
        openCount: true,
        clickCount: true,
        sequence: {
          select: {
            name: true,
          },
        },
      },
    });

    // Combine and sort by sent count
    const topEmails = [
      ...topTemplateEmails.map(e => ({
        id: e.id,
        name: e.name,
        subject: e.subject,
        sentCount: e.sentCount,
        openCount: e.openCount,
        clickCount: e.clickCount,
      })),
      ...topSequenceEmails.map(e => ({
        id: e.id,
        name: `${e.sequence.name} - ${e.customSubject || 'Email'}`,
        subject: e.customSubject || 'Untitled',
        sentCount: e.sentCount,
        openCount: e.openCount,
        clickCount: e.clickCount,
      })),
    ].sort((a, b) => b.sentCount - a.sentCount).slice(0, 5);

    // Get tag distribution
    const tagStats = await prisma.marketingTag.findMany({
      where: {
        userCount: { gt: 0 },
      },
      orderBy: { userCount: "desc" },
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        category: true,
        color: true,
        userCount: true,
      },
    });

    // Get sequence stats
    const sequenceStats = await prisma.sequence.findMany({
      where: {
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        totalEnrolled: true,
        totalCompleted: true,
        totalExited: true,
      },
    });

    // Get subscriber growth (users with marketing tags, excluding fake profiles)
    const subscriberCount = await prisma.user.count({
      where: {
        isFakeProfile: false,
        marketingTags: {
          some: {},
        },
      },
    });

    return NextResponse.json({
      period: {
        days,
        startDate,
        endDate: new Date(),
      },
      overview: {
        totalSent,
        delivered,
        opened,
        clicked,
        bounced,
        unsubscribed,
        deliveryRate: deliveryRate.toFixed(1),
        openRate: openRate.toFixed(1),
        clickRate: clickRate.toFixed(1),
        bounceRate: bounceRate.toFixed(1),
        unsubscribeRate: unsubscribeRate.toFixed(1),
        subscriberCount,
      },
      dailyStats,
      topEmails: topEmails.map((email) => ({
        ...email,
        openRate: email.sentCount > 0 ? ((email.openCount / email.sentCount) * 100).toFixed(1) : "0",
        clickRate: email.openCount > 0 ? ((email.clickCount / email.openCount) * 100).toFixed(1) : "0",
      })),
      tagStats,
      sequenceStats,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

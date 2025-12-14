import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/sequences/[id]/enrollments - Get all enrollments
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";

    const whereClause: Record<string, unknown> = { sequenceId };
    if (status !== "all") {
      whereClause.status = status.toUpperCase();
    }

    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            marketingTags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    color: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        sequence: {
          select: {
            _count: { select: { emails: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
      take: 100,
    });

    // Transform enrollments to include tags directly
    const transformedEnrollments = enrollments.map((e) => ({
      ...e,
      user: {
        id: e.user.id,
        email: e.user.email,
        name: [e.user.firstName, e.user.lastName].filter(Boolean).join(' ') || null,
        image: e.user.avatar,
        tags: e.user.marketingTags.map((mt) => mt.tag),
      },
      totalEmails: e.sequence._count.emails,
    }));

    // Get counts by status
    const counts = await prisma.sequenceEnrollment.groupBy({
      by: ["status"],
      where: { sequenceId },
      _count: { status: true },
    });

    const statusCounts = {
      ACTIVE: 0,
      COMPLETED: 0,
      EXITED: 0,
      PAUSED: 0,
    };

    counts.forEach((c) => {
      statusCounts[c.status as keyof typeof statusCounts] = c._count.status;
    });

    return NextResponse.json({
      enrollments: transformedEnrollments,
      counts: statusCounts,
      total: Object.values(statusCounts).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}

// POST /api/admin/marketing/sequences/[id]/enrollments - Enroll users in sequence
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const body = await request.json();
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Verify sequence exists and get first email
    const sequence = await prisma.sequence.findUnique({
      where: { id: sequenceId },
      include: {
        emails: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    });

    if (!sequence) {
      return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
    }

    const firstEmail = sequence.emails[0];
    const now = new Date();

    // Calculate when to send first email
    let nextSendAt = now;
    if (firstEmail) {
      nextSendAt = new Date(
        now.getTime() +
          (firstEmail.delayDays * 24 * 60 * 60 * 1000) +
          (firstEmail.delayHours * 60 * 60 * 1000) +
          (firstEmail.delayMinutes * 60 * 1000)
      );
    }

    // Enroll users (skip if already enrolled and active)
    const results = await Promise.all(
      userIds.map(async (userId: string) => {
        try {
          // Check for existing active enrollment
          const existing = await prisma.sequenceEnrollment.findFirst({
            where: {
              sequenceId,
              userId,
              status: "ACTIVE",
            },
          });

          if (existing) {
            return { userId, success: false, reason: "Already enrolled" };
          }

          await prisma.sequenceEnrollment.create({
            data: {
              sequenceId,
              userId,
              currentEmailId: firstEmail?.id || null,
              status: "ACTIVE",
              enrolledAt: now,
              nextSendAt: firstEmail ? nextSendAt : null,
            },
          });

          // Update sequence stats
          await prisma.sequence.update({
            where: { id: sequenceId },
            data: { totalEnrolled: { increment: 1 } },
          });

          return { userId, success: true };
        } catch (error) {
          return { userId, success: false, reason: "Database error" };
        }
      })
    );

    const enrolled = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      enrolled,
      total: userIds.length,
      results,
    });
  } catch (error) {
    console.error("Error enrolling users:", error);
    return NextResponse.json(
      { error: "Failed to enroll users" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/marketing/sequences/[id]/enrollments - Remove/exit users from sequence
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sequenceId } = await params;
    const body = await request.json();
    const { userIds, reason = "Manual removal", permanent = false } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    if (permanent) {
      // Permanently delete enrollments
      const result = await prisma.sequenceEnrollment.deleteMany({
        where: {
          sequenceId,
          userId: { in: userIds },
        },
      });

      return NextResponse.json({
        success: true,
        deleted: result.count,
      });
    }

    // Update enrollments to EXITED status
    const result = await prisma.sequenceEnrollment.updateMany({
      where: {
        sequenceId,
        userId: { in: userIds },
        status: "ACTIVE",
      },
      data: {
        status: "EXITED",
        exitedAt: new Date(),
        exitReason: reason,
      },
    });

    // Update sequence stats
    await prisma.sequence.update({
      where: { id: sequenceId },
      data: { totalExited: { increment: result.count } },
    });

    return NextResponse.json({
      success: true,
      removed: result.count,
    });
  } catch (error) {
    console.error("Error removing enrollments:", error);
    return NextResponse.json(
      { error: "Failed to remove enrollments" },
      { status: 500 }
    );
  }
}

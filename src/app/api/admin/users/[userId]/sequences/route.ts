import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/users/[userId]/sequences — Get all sequence enrollments for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "SUPERUSER"].includes(session.user.role as string)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: { userId },
      include: {
        sequence: {
          select: {
            id: true,
            name: true,
            _count: { select: { emails: true } },
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    const transformed = enrollments.map((e) => ({
      id: e.id,
      sequenceId: e.sequenceId,
      sequenceName: e.sequence.name,
      status: e.status,
      currentEmailIndex: e.currentEmailIndex,
      totalEmails: e.sequence._count.emails,
      nextSendAt: e.nextSendAt?.toISOString() || null,
      enrolledAt: e.enrolledAt.toISOString(),
      completedAt: e.completedAt?.toISOString() || null,
      exitedAt: e.exitedAt?.toISOString() || null,
      exitReason: e.exitReason,
      emailsReceived: e.emailsReceived,
    }));

    return NextResponse.json({ enrollments: transformed });
  } catch (error) {
    console.error("Error fetching user sequences:", error);
    return NextResponse.json(
      { error: "Failed to fetch sequence enrollments" },
      { status: 500 }
    );
  }
}

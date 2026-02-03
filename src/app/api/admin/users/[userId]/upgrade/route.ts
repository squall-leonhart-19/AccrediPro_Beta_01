import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { upgradeLeadToStudent } from "@/lib/upgrade-lead-to-student";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/users/[userId]/upgrade
 *
 * Manually upgrade a LEAD user to a full STUDENT.
 * Optionally enroll them in a specific course.
 *
 * Body: { courseSlug?: string }
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "SUPERUSER"].includes(session.user.role || "")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
    const body = await request.json().catch(() => ({}));
    const { courseSlug } = body as { courseSlug?: string };

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        userType: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Perform upgrade
    const result = await upgradeLeadToStudent(userId, {
      courseSlug,
      source: "admin",
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

    return NextResponse.json({
      success: true,
      message: result.upgraded
        ? `${name} upgraded from LEAD to STUDENT${result.courseName ? ` + enrolled in ${result.courseName}` : ""}`
        : result.alreadyStudent
          ? `${name} is already a STUDENT${result.enrolled ? ` — enrolled in ${result.courseName}` : ""}`
          : `No changes made`,
      upgraded: result.upgraded,
      alreadyStudent: result.alreadyStudent,
      enrolled: result.enrolled,
      courseName: result.courseName,
    });
  } catch (error) {
    console.error("[Admin Upgrade] Error:", error);
    return NextResponse.json(
      { error: "Upgrade failed", details: String(error) },
      { status: 500 }
    );
  }
}

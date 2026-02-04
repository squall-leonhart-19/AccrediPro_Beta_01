import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/mini-diploma/reset-progress
 *
 * TEST ONLY: Resets all mini diploma progress for testing.
 * Only works for test user at.seed019@gmail.com
 *
 * Body: { course: "womens-health" | "fm" }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only allow for test users
    const allowedEmails = [
      "at.seed019@gmail.com",
      "tortolialessio1997@gmail.com"
    ];
    if (!allowedEmails.includes(session.user.email || "")) {
      return NextResponse.json({ error: "Not authorized for this action" }, { status: 403 });
    }

    const userId = session.user.id;
    const body = await request.json().catch(() => ({}));
    const course = body.course || "womens-health";

    // Handle Women's Health Mini Diploma reset
    if (course === "womens-health") {
      // Delete all lesson completion tags
      await prisma.userTag.deleteMany({
        where: {
          userId,
          tag: { startsWith: "wh-lesson-complete:" },
        },
      });

      // Delete quiz completion tag
      await prisma.userTag.deleteMany({
        where: {
          userId,
          tag: "quiz:completed",
        },
      });

      // Delete all quiz answer tags
      await prisma.userTag.deleteMany({
        where: {
          userId,
          OR: [
            { tag: { startsWith: "interest:" } },
            { tag: { startsWith: "goal:" } },
            { tag: { startsWith: "motivation:" } },
            { tag: { startsWith: "experience:" } },
          ],
        },
      });

      // Reset user completion data
      await prisma.user.update({
        where: { id: userId },
        data: {
          miniDiplomaCompletedAt: null,
          miniDiplomaCategory: null,
        },
      });

      console.log(`[TEST] Women's Health progress reset for test user`);

      return NextResponse.json({
        success: true,
        message: "Women's Health progress reset",
      });
    }

    // Handle FM Mini Diploma reset (tag-based system)
    // Delete all FM lesson completion tags
    await prisma.userTag.deleteMany({
      where: {
        userId,
        OR: [
          { tag: { startsWith: "fm-lesson-complete:" } },
          { tag: { startsWith: "functional-medicine-lesson:" } },
          { tag: "functional-medicine-exam-passed" },
          { tag: "fm-exam-passed" },
          { tag: "fm_mini_diploma_completed" },
          { tag: "quiz:completed" },
          { tag: { startsWith: "interest:" } },
          { tag: { startsWith: "goal:" } },
          { tag: { startsWith: "motivation:" } },
          { tag: { startsWith: "experience:" } },
        ],
      },
    });

    // Reset user completion data
    await prisma.user.update({
      where: { id: userId },
      data: {
        miniDiplomaCompletedAt: null,
        miniDiplomaCategory: null,
      },
    });

    console.log(`[TEST] FM Mini Diploma progress reset for user ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: "All FM Mini Diploma progress reset (lessons, quiz, exam)",
    });

  } catch (error) {
    console.error("Reset progress error:", error);
    return NextResponse.json(
      { error: "Failed to reset progress" },
      { status: 500 }
    );
  }
}

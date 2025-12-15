import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { quizId, responses, currentQuestion } = await request.json();

    // Save or update quiz progress - wrapped in try/catch in case table doesn't exist
    try {
      await prisma.quizProgress.upsert({
        where: {
          userId_quizId: {
            userId: session.user.id,
            quizId,
          },
        },
        update: {
          responses: responses,
          currentQuestion,
          updatedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          quizId,
          responses: responses,
          currentQuestion,
        },
      });
    } catch {
      // QuizProgress table may not exist yet - silently ignore
      console.log("QuizProgress table not available - run SQL migration");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save quiz progress error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save progress" },
      { status: 500 }
    );
  }
}

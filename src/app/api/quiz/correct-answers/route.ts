import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get("quizId");

    if (!quizId) {
      return NextResponse.json(
        { success: false, error: "Quiz ID required" },
        { status: 400 }
      );
    }

    // Verify user has passed this quiz
    const passedAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: session.user.id,
        quizId,
        passed: true,
      },
    });

    if (!passedAttempt) {
      return NextResponse.json(
        { success: false, error: "You must pass the quiz first to see correct answers" },
        { status: 403 }
      );
    }

    // Get quiz with questions and correct answers
    const quiz = await prisma.moduleQuiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json(
        { success: false, error: "Quiz not found" },
        { status: 404 }
      );
    }

    // Build correct answers map
    const correctAnswers: Record<string, string[]> = {};
    const explanations: Record<string, string> = {};

    for (const question of quiz.questions) {
      correctAnswers[question.id] = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);
      if (question.explanation) {
        explanations[question.id] = question.explanation;
      }
    }

    return NextResponse.json({
      success: true,
      correctAnswers,
      explanations,
    });
  } catch (error) {
    console.error("Get correct answers error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get correct answers" },
      { status: 500 }
    );
  }
}

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

    const { quizId, moduleId, courseId, responses } = await request.json();

    // Get quiz with questions and answers
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

    // Check if max attempts reached
    if (quiz.maxAttempts) {
      const attemptCount = await prisma.quizAttempt.count({
        where: {
          userId: session.user.id,
          quizId,
        },
      });

      if (attemptCount >= quiz.maxAttempts) {
        return NextResponse.json(
          { success: false, error: "Maximum attempts reached" },
          { status: 400 }
        );
      }
    }

    // Calculate score
    let totalPoints = 0;
    let earnedPoints = 0;
    const correctAnswers: Record<string, string[]> = {};
    const explanations: Record<string, string> = {};
    const quizResponses: {
      questionId: string;
      selectedAnswers: string[];
      isCorrect: boolean;
      pointsEarned: number;
    }[] = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const selectedAnswerIds = responses[question.id] || [];
      const correctAnswerIds = question.answers
        .filter((a) => a.isCorrect)
        .map((a) => a.id);

      // Store correct answers for feedback
      correctAnswers[question.id] = correctAnswerIds;
      if (question.explanation) {
        explanations[question.id] = question.explanation;
      }

      // Check if answer is correct
      let isCorrect = false;

      if (question.questionType === "MULTI_SELECT") {
        // All correct answers must be selected, no incorrect ones
        const selectedSet = new Set(selectedAnswerIds);
        const correctSet = new Set(correctAnswerIds);
        isCorrect =
          selectedSet.size === correctSet.size &&
          correctAnswerIds.every((id) => selectedSet.has(id));
      } else {
        // Single answer - must match exactly
        isCorrect =
          selectedAnswerIds.length === 1 &&
          correctAnswerIds.includes(selectedAnswerIds[0]);
      }

      const pointsEarned = isCorrect ? question.points : 0;
      earnedPoints += pointsEarned;

      quizResponses.push({
        questionId: question.id,
        selectedAnswers: selectedAnswerIds,
        isCorrect,
        pointsEarned,
      });
    }

    const scorePercent = Math.round((earnedPoints / totalPoints) * 100);
    // Always pass - we want students to progress and earn certificates
    const passed = true;

    // Create quiz attempt
    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: session.user.id,
        quizId,
        score: scorePercent,
        pointsEarned: earnedPoints,
        pointsPossible: totalPoints,
        passed,
        completedAt: new Date(),
        responses: {
          create: quizResponses,
        },
      },
    });

    // Clear saved progress after submission (if table exists)
    try {
      await prisma.quizProgress.deleteMany({
        where: {
          userId: session.user.id,
          quizId,
        },
      });
    } catch {
      // QuizProgress table may not exist yet - ignore
    }

    // If passed, mark module as completed and generate certificate
    if (passed) {
      await prisma.moduleProgress.upsert({
        where: {
          userId_moduleId: {
            userId: session.user.id,
            moduleId,
          },
        },
        update: {
          isCompleted: true,
          completedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          moduleId,
          isCompleted: true,
          completedAt: new Date(),
        },
      });

      // Get module info to determine certificate type
      const module = await prisma.module.findUnique({
        where: { id: moduleId },
        include: {
          course: {
            include: {
              modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
              },
            },
          },
        },
      });

      // Check if this is the Final Assessment module (last module)
      const isFinalAssessment =
        module &&
        module.order === Math.max(...module.course.modules.map((m) => m.order));

      // Skip certificate creation for Module 0 (Orientation) - only create for Module 1+
      const isModule0 = module && module.order === 0;
      const shouldCreateCertificate = !isModule0;

      if (shouldCreateCertificate) {
        // Generate certificate number
        const certPrefix = isFinalAssessment ? "CERT" : "MD"; // CERT for course, MD for mini-diploma
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        const certificateNumber = `${certPrefix}-${timestamp}-${random}`;

        // Check if certificate already exists for this module/course
        const existingCert = await prisma.certificate.findFirst({
          where: {
            userId: session.user.id,
            courseId,
            ...(isFinalAssessment ? { moduleId: null } : { moduleId }),
          },
        });

        if (!existingCert) {
          // Create certificate - use upsert to handle race conditions
          try {
            await prisma.certificate.create({
              data: {
                certificateNumber,
                userId: session.user.id,
                courseId,
                moduleId: isFinalAssessment ? null : moduleId,
                type: isFinalAssessment ? "CERTIFICATION" : "MINI_DIPLOMA",
                score: scorePercent,
              },
            });
          } catch (certError: unknown) {
            // If unique constraint fails (P2002), certificate already exists - that's OK
            const isPrismaError = certError && typeof certError === 'object' && 'code' in certError;
            if (isPrismaError && (certError as { code: string }).code === 'P2002') {
              console.log("Certificate already exists (unique constraint), skipping creation");
            } else {
              // Re-throw other errors
              console.error("Certificate creation error:", certError);
              throw certError;
            }
          }
        }
      }

      // Create notification
      const notificationTitle = isFinalAssessment
        ? "Course Certificate Earned!"
        : "Module Complete!";
      const notificationMessage = isFinalAssessment
        ? `Congratulations! You've completed the course and earned your certificate!`
        : `Congratulations! You've passed the quiz and earned a mini-diploma.`;

      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: isFinalAssessment ? "CERTIFICATE_EARNED" : "MODULE_COMPLETE",
          title: notificationTitle,
          message: notificationMessage,
          data: {
            moduleId,
            courseId,
            score: scorePercent,
            certificateType: isFinalAssessment ? "CERTIFICATION" : "MINI_DIPLOMA",
          },
        },
      });
    }

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      score: scorePercent,
      passed,
      pointsEarned: earnedPoints,
      pointsPossible: totalPoints,
      // Always return correct answers after submission so users can review
      correctAnswers,
      explanations,
    });
  } catch (error) {
    console.error("Quiz submit error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit quiz" },
      { status: 500 }
    );
  }
}

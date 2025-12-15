import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DEV ONLY: Auto-pass endpoint for testing certificate generation
export async function POST(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, moduleId, courseId } = await request.json();

    // Get quiz and module info
    const quiz = await prisma.moduleQuiz.findUnique({
      where: { id: quizId },
      include: {
        module: {
          include: {
            course: {
              include: {
                modules: { select: { id: true, order: true } },
              },
            },
          },
        },
      },
    });

    if (!quiz || !quiz.module) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const module = quiz.module;
    const score = 100; // Perfect score for auto-pass

    // Create quiz attempt record
    await prisma.quizAttempt.create({
      data: {
        quizId,
        userId: session.user.id,
        score,
        passed: true,
        responses: {},
        completedAt: new Date(),
      },
    });

    // Determine if this is the Final Assessment (highest order module)
    const isFinalAssessment =
      module.order === Math.max(...module.course.modules.map((m) => m.order));

    // Generate certificate
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const certPrefix = isFinalAssessment ? "CERT" : "MD";
    const certificateNumber = `${certPrefix}-${timestamp}-${random}`;

    // Check if certificate already exists
    const existingCert = await prisma.certificate.findFirst({
      where: {
        userId: session.user.id,
        courseId,
        moduleId: isFinalAssessment ? null : moduleId,
      },
    });

    if (!existingCert) {
      await prisma.certificate.create({
        data: {
          certificateNumber,
          userId: session.user.id,
          courseId,
          moduleId: isFinalAssessment ? null : moduleId,
          type: isFinalAssessment ? "CERTIFICATION" : "MINI_DIPLOMA",
          score,
        },
      });
    }

    // Mark module as completed
    await prisma.moduleProgress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId,
        },
      },
      update: { isCompleted: true },
      create: {
        userId: session.user.id,
        moduleId,
        isCompleted: true,
      },
    });

    return NextResponse.json({
      success: true,
      score,
      passed: true,
      isFinalAssessment,
      certificateNumber: existingCert ? existingCert.certificateNumber : certificateNumber,
    });
  } catch (error) {
    console.error("Auto-pass error:", error);
    return NextResponse.json(
      { error: "Failed to auto-pass", details: String(error) },
      { status: 500 }
    );
  }
}

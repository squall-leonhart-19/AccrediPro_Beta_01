import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { triggerAutoMessage } from "@/lib/auto-messages";
import { sendMiniDiplomaCompleteEvent } from "@/lib/meta-capi";
import { sendMilestoneToGHL, MilestoneType } from "@/lib/ghl-webhook";

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
      // Ensure selectedAnswerIds is always an array of strings
      let selectedAnswerIds = responses[question.id] || [];
      if (!Array.isArray(selectedAnswerIds)) {
        selectedAnswerIds = selectedAnswerIds ? [String(selectedAnswerIds)] : [];
      }
      selectedAnswerIds = selectedAnswerIds.map((id: unknown) => String(id));
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

    // Get module info to determine if this is a final exam
    const moduleInfo = await prisma.module.findUnique({
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

    // Check if this is the final exam (last module in course)
    const isFinalExamModule =
      moduleInfo &&
      moduleInfo.order === Math.max(...moduleInfo.course.modules.map((m) => m.order));

    // Pass threshold: 70% for final exam, 50% for module quizzes
    const passThreshold = isFinalExamModule ? 70 : 50;
    const passed = scorePercent >= passThreshold;

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

      // Also mark all lessons in this module as completed (for progress tracking on my-mini-diploma page)
      const moduleLessons = await prisma.lesson.findMany({
        where: { moduleId },
        select: { id: true },
      });

      for (const lesson of moduleLessons) {
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId: session.user.id,
              lessonId: lesson.id,
            },
          },
          update: {
            isCompleted: true,
            completedAt: new Date(),
          },
          create: {
            lessonId: lesson.id,
            userId: session.user.id,
            isCompleted: true,
            completedAt: new Date(),
          },
        });
      }

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

      // === TAG TRACKING FOR MODULE COMPLETION ===
      if (module) {
        const courseSlug = module.course.slug || module.course.id;
        const moduleTag = `module_${module.order}_completed_${courseSlug}`;

        await prisma.userTag.upsert({
          where: { userId_tag: { userId: session.user.id, tag: moduleTag } },
          update: {},
          create: { userId: session.user.id, tag: moduleTag },
        });
        console.log(`🏷️ Created tag: ${moduleTag} for user ${session.user.id}`);
      }

      // === UPDATE ENROLLMENT PROGRESS ===
      const enrollment = await prisma.enrollment.findFirst({
        where: { userId: session.user.id, courseId: module?.course.id },
      });

      if (enrollment && module) {
        const allCourseLessons = await prisma.lesson.count({
          where: {
            module: { courseId: module.course.id, isPublished: true },
            isPublished: true,
          },
        });

        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: session.user.id,
            isCompleted: true,
            lesson: {
              module: { courseId: module.course.id },
            },
          },
        });

        const progress = allCourseLessons > 0 ? Math.round((completedLessons / allCourseLessons) * 100) : 0;

        await prisma.enrollment.update({
          where: { id: enrollment.id },
          data: {
            progress,
            status: progress >= 100 ? "COMPLETED" : "ACTIVE",
            completedAt: progress >= 100 ? new Date() : null,
          },
        });

        console.log(`📊 Updated enrollment progress: ${progress}% (${completedLessons}/${allCourseLessons} lessons)`);
      }

      // Check if this is a mini diploma course
      const isMiniDiploma = module?.course.certificateType === "MINI_DIPLOMA";

      // === MINI DIPLOMA MODULE DM (with voice) ===
      // Send Sarah's congratulatory DM when user completes a mini diploma module (0-3)
      // Module 0 = Welcome, Modules 1-3 = Content, Final Exam = handled by /mini-diploma/complete
      if (isMiniDiploma && module) {
        const moduleOrder = module.order;
        // Send DM for modules 0, 1, 2, 3 (not Final Exam which is handled separately)
        if (moduleOrder >= 0 && moduleOrder <= 3) {
          // Schedule via ScheduledVoiceMessage table (processed by cron)
          // Random delay between 3-8 minutes for hyper-real feel
          const delayMinutes = 3 + Math.random() * 5;
          const scheduledFor = new Date(Date.now() + delayMinutes * 60 * 1000);

          // Get Sarah coach
          const sarahCoach = await prisma.user.findFirst({
            where: {
              email: { contains: "sarah", mode: "insensitive" },
              role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
            },
          });

          if (sarahCoach) {
            // Create scheduled message that will be processed by cron
            await prisma.scheduledVoiceMessage.create({
              data: {
                senderId: sarahCoach.id,
                receiverId: session.user.id,
                // Store trigger info for the cron to process
                voiceText: `mini_diploma_module_complete:${moduleOrder}`,
                textContent: `trigger:mini_diploma_module_complete:${moduleOrder}`,
                scheduledFor,
                status: "PENDING",
              },
            });

            console.log(`📨 Mini diploma module ${moduleOrder} DM scheduled for user ${session.user.id} in ${delayMinutes.toFixed(1)} minutes (via cron)`);
          }

          // === SEND TO GHL FOR SMS AUTOMATION ===
          // Map module order to day milestone (module 1 = day1, module 2 = day2, module 3 = day3)
          if (moduleOrder >= 1 && moduleOrder <= 3) {
            const milestoneMap: Record<number, MilestoneType> = {
              1: "day1_complete",
              2: "day2_complete",
              3: "day3_complete",
            };
            const milestone = milestoneMap[moduleOrder];

            // Get user email for GHL
            const userData = await prisma.user.findUnique({
              where: { id: session.user.id },
              select: { email: true, firstName: true },
            });

            if (userData?.email && milestone) {
              await sendMilestoneToGHL(userData.email, milestone, {
                first_name: userData.firstName || "",
              });
              console.log(`📱 GHL milestone sent: ${userData.email} - ${milestone}`);
            }
          }
        }
      }

      // Check if this is the Final Assessment module (last module)
      const isFinalAssessment =
        module &&
        module.order === Math.max(...module.course.modules.map((m) => m.order));

      // For Mini Diploma: Only mark completion when Final Exam is passed, NO certificate in database
      if (isMiniDiploma && isFinalAssessment) {
        // Mark the user's mini diploma as completed
        await prisma.user.update({
          where: { id: session.user.id },
          data: { miniDiplomaCompletedAt: new Date() },
        });

        // === SERVER-SIDE META TRACKING ===
        // Send CompleteMiniDiploma event to Meta CAPI
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { email: true, firstName: true, miniDiplomaCategory: true },
        });

        if (user?.email) {
          sendMiniDiplomaCompleteEvent({
            email: user.email,
            firstName: user.firstName || undefined,
            contentName: `Mini Diploma - ${user.miniDiplomaCategory || 'Functional Medicine'}`,
          }).catch((err) => {
            console.error(`[META] Failed to send CompleteMiniDiploma event:`, err);
          });
          console.log(`📊 [META] CompleteMiniDiploma event sent for ${user.email}`);
        }
      }

      // For MAIN CERTIFICATION ($997 course): Create certificates for modules and final
      // ONLY create certificates for non-mini-diploma courses
      if (!isMiniDiploma) {
        const isModule0 = module && module.order === 0;
        const shouldCreateCertificate = !isModule0;

        if (shouldCreateCertificate) {
          // Generate certificate number
          const certPrefix = isFinalAssessment ? "CERT" : "MOD";
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
            try {
              await prisma.certificate.create({
                data: {
                  certificateNumber,
                  userId: session.user.id,
                  courseId,
                  moduleId: isFinalAssessment ? null : moduleId,
                  type: isFinalAssessment ? "CERTIFICATION" : "COMPLETION",
                  score: scorePercent,
                },
              });
            } catch (certError: unknown) {
              const isPrismaError = certError && typeof certError === 'object' && 'code' in certError;
              if (isPrismaError && (certError as { code: string }).code === 'P2002') {
                console.log("Certificate already exists (unique constraint), skipping creation");
              } else {
                console.error("Certificate creation error:", certError);
                throw certError;
              }
            }
          }
        }
      }

      // Create notification
      const notificationTitle = isFinalAssessment
        ? (isMiniDiploma ? "Mini Diploma Complete!" : "Course Certificate Earned!")
        : "Module Complete!";
      const notificationMessage = isFinalAssessment
        ? (isMiniDiploma
          ? `Congratulations! You've completed the Functional Medicine Mini Diploma!`
          : `Congratulations! You've completed the course and earned your certificate!`)
        : `Congratulations! You've passed the quiz.`;

      // Only create MODULE_COMPLETE notification for main certification (not mini diploma)
      // Mini diploma module completions don't need notifications - they're progress milestones
      const shouldCreateNotification = isFinalAssessment || !isMiniDiploma;

      if (shouldCreateNotification) {
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            type: isFinalAssessment ? "CERTIFICATE_ISSUED" : "MODULE_COMPLETE",
            title: notificationTitle,
            message: notificationMessage,
            data: {
              moduleId,
              courseId,
              score: scorePercent,
              certificateType: isMiniDiploma ? "MINI_DIPLOMA" : (isFinalAssessment ? "CERTIFICATION" : "COMPLETION"),
              isMiniDiploma,
            },
          },
        });
      }
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

import prisma from "./prisma";
import crypto from "crypto";
import { createCertificateOnCompletion } from "./certificate-service";

export type WebhookEventType =
  | "lesson.completed"
  | "module.completed"
  | "course.completed"
  | "certificate.issued"
  | "enrollment.created"
  | "user.registered";

interface WebhookPayload {
  eventType: WebhookEventType;
  timestamp: string;
  data: Record<string, unknown>;
}

export async function triggerWebhook(eventType: WebhookEventType, data: Record<string, unknown>) {
  // Store the event
  const event = await prisma.webhookEvent.create({
    data: {
      eventType,
      payload: { eventType, timestamp: new Date().toISOString(), data } as object,
      status: "pending",
    },
  });

  // Get active endpoints subscribed to this event
  const endpoints = await prisma.webhookEndpoint.findMany({
    where: {
      isActive: true,
      events: { has: eventType },
    },
  });

  // Send to all endpoints
  const results = await Promise.allSettled(
    endpoints.map((endpoint) => sendToEndpoint(endpoint, event.id, { eventType, timestamp: new Date().toISOString(), data }))
  );

  // Update event status
  const allSucceeded = results.every((r) => r.status === "fulfilled" && r.value);
  await prisma.webhookEvent.update({
    where: { id: event.id },
    data: {
      status: allSucceeded ? "sent" : "failed",
      processedAt: new Date(),
      attempts: 1,
    },
  });

  return event;
}

async function sendToEndpoint(
  endpoint: { id: string; url: string; secret: string },
  eventId: string,
  payload: WebhookPayload
): Promise<boolean> {
  const signature = generateSignature(JSON.stringify(payload), endpoint.secret);

  try {
    const response = await fetch(endpoint.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-AccrediPro-Signature": signature,
        "X-AccrediPro-Event-Id": eventId,
      },
      body: JSON.stringify(payload),
    });

    return response.ok;
  } catch (error) {
    console.error(`Webhook delivery failed for ${endpoint.url}:`, error);
    return false;
  }
}

function generateSignature(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifySignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateSignature(payload, secret);
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Event handlers
export async function onLessonCompleted(
  userId: string,
  lessonId: string,
  courseId: string,
  moduleId: string
) {
  const [user, lesson, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.lesson.findUnique({ where: { id: lessonId } }),
    prisma.course.findUnique({ where: { id: courseId } }),
  ]);

  if (!user || !lesson || !course) return;

  // Trigger webhook
  await triggerWebhook("lesson.completed", {
    userId,
    userEmail: user.email,
    userName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    lessonId,
    lessonTitle: lesson.title,
    courseId,
    courseTitle: course.title,
    moduleId,
    completedAt: new Date().toISOString(),
  });

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: "LESSON_COMPLETE",
      title: "Lesson Completed!",
      message: `You completed "${lesson.title}"`,
      data: { lessonId, courseId },
    },
  });

  // Check if module is complete
  await checkModuleCompletion(userId, moduleId, courseId);
}

export async function checkModuleCompletion(
  userId: string,
  moduleId: string,
  courseId: string
) {
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: {
      lessons: { where: { isPublished: true } },
    },
  });

  if (!module) return;

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: module.lessons.map((l) => l.id) },
      isCompleted: true,
    },
  });

  if (completedLessons >= module.lessons.length) {
    // Module completed
    const user = await prisma.user.findUnique({ where: { id: userId } });

    await triggerWebhook("module.completed", {
      userId,
      userEmail: user?.email,
      moduleId,
      moduleTitle: module.title,
      courseId,
      completedAt: new Date().toISOString(),
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "MODULE_COMPLETE",
        title: "Module Completed!",
        message: `You completed the module "${module.title}"`,
        data: { moduleId, courseId },
      },
    });

    // Check if course is complete
    await checkCourseCompletion(userId, courseId);
  }
}

export async function checkCourseCompletion(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        where: { isPublished: true },
        include: {
          lessons: { where: { isPublished: true } },
        },
      },
    },
  });

  if (!course) return;

  const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  const completedLessons = await prisma.lessonProgress.count({
    where: {
      userId,
      lessonId: { in: allLessonIds },
      isCompleted: true,
    },
  });

  if (completedLessons >= allLessonIds.length) {
    // Course completed!
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // Update enrollment
    await prisma.enrollment.update({
      where: { userId_courseId: { userId, courseId } },
      data: {
        status: "COMPLETED",
        progress: 100,
        completedAt: new Date(),
      },
    });

    await triggerWebhook("course.completed", {
      userId,
      userEmail: user?.email,
      userName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
      courseId,
      courseTitle: course.title,
      certificateType: course.certificateType,
      completedAt: new Date().toISOString(),
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "COURSE_COMPLETE",
        title: "Course Completed!",
        message: `Congratulations! You completed "${course.title}"`,
        data: { courseId },
      },
    });

    // Auto-issue certificate (uses certificate-service which sends email)
    await createCertificateOnCompletion(userId, courseId);
  }
}

// Called when a course is completed (from API routes)
export async function onCourseCompleted(userId: string, courseId: string) {
  const [user, course] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.course.findUnique({ where: { id: courseId } }),
  ]);

  if (!user || !course) return;

  // Trigger webhook
  await triggerWebhook("course.completed", {
    userId,
    userEmail: user.email,
    userName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
    courseId,
    courseTitle: course.title,
    certificateType: course.certificateType,
    completedAt: new Date().toISOString(),
  });

  // Certificate is now issued by certificate-service (which also sends email)
  // It's called from the progress/complete API route
}


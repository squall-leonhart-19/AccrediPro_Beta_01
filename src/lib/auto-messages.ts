import prisma from "./prisma";

interface TriggerAutoMessageOptions {
  userId: string;
  trigger: "first_login" | "enrollment" | "course_complete" | "inactive_7d";
  triggerValue?: string; // e.g., course ID
}

/**
 * Triggers automatic messages based on user events
 */
export async function triggerAutoMessage({
  userId,
  trigger,
  triggerValue,
}: TriggerAutoMessageOptions) {
  try {
    // Get the user to determine their assigned coach
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        assignedCoachId: true,
      },
    });

    if (!user) return;

    // Get active auto-messages for this trigger
    const autoMessages = await prisma.autoMessage.findMany({
      where: {
        trigger,
        isActive: true,
        OR: [
          { triggerValue: null }, // Generic message for this trigger
          { triggerValue: triggerValue || null }, // Specific to this value (e.g., course)
        ],
      },
      orderBy: { priority: "desc" },
    });

    if (autoMessages.length === 0) return;

    // Get a coach to send from
    let coachId = user.assignedCoachId;

    // If user doesn't have an assigned coach, try to find Sarah or any admin
    if (!coachId) {
      const defaultCoach = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "coach@accredipro.com" },
            { role: "ADMIN" },
            { role: "MENTOR" },
          ],
          isActive: true,
        },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      coachId = defaultCoach?.id || null;
    }

    if (!coachId) {
      console.warn("No coach available to send auto-message");
      return;
    }

    // Process each auto-message
    for (const autoMessage of autoMessages) {
      const senderId = autoMessage.fromCoachId || coachId;

      // Replace template variables in content
      let content = autoMessage.content;
      content = content.replace(/\{\{firstName\}\}/g, user.firstName || "there");

      // Create the message based on type
      if (autoMessage.messageType === "dm") {
        // Check if we've already sent this auto-message to this user
        const existingMessage = await prisma.message.findFirst({
          where: {
            senderId,
            receiverId: userId,
            content: { contains: content.substring(0, 50) }, // Partial match
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within 24 hours
          },
        });

        if (existingMessage) {
          continue; // Don't send duplicate
        }

        // Create the DM
        await prisma.message.create({
          data: {
            senderId,
            receiverId: userId,
            content,
            messageType: "DIRECT",
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            type: "NEW_MESSAGE",
            title: "New message from your coach",
            message: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            data: { senderId },
          },
        });
      }
      // Could add email/notification types here
    }
  } catch (error) {
    console.error("Error triggering auto-message:", error);
  }
}

/**
 * Assigns a coach to a user based on their enrollments
 */
export async function assignCoachToUser(userId: string) {
  try {
    // Get user's enrollments to determine category
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            coach: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    if (enrollments.length === 0) return;

    // Find a coach from their most recent enrollment
    const recentEnrollment = enrollments[0];
    const coachId = recentEnrollment.course.coachId;

    if (coachId) {
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: coachId },
      });
    }
  } catch (error) {
    console.error("Error assigning coach:", error);
  }
}

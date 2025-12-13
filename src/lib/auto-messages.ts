import prisma from "./prisma";

interface TriggerAutoMessageOptions {
  userId: string;
  trigger: "first_login" | "enrollment" | "course_complete" | "inactive_7d";
  triggerValue?: string; // e.g., course ID
}

// Welcome voice message URL from Sarah
const SARAH_WELCOME_VOICE_URL = "/audio/sarah-welcome.mp3";

/**
 * Creates the personalized welcome message content for first login
 */
function getWelcomeMessage(firstName: string): string {
  return `Hey ${firstName}! 👋

Welcome to AccrediPro! I'm so excited you're here.

I'm Sarah, your personal coach, and I wanted to personally welcome you to our community.

Here's what you can expect:
• **Your Dashboard** - Track your progress and see your personalized roadmap
• **My Coach** - Chat with me anytime you need guidance or have questions
• **Courses** - Start your learning journey with our certifications
• **Community** - Connect with fellow students and practitioners

I'm here to support you every step of the way. Don't hesitate to message me if you have any questions!

Let's get started on your transformation journey! 🌟`;
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
        lastName: true,
        assignedCoachId: true,
      },
    });

    if (!user) return;

    // Get a coach to send from (prefer assigned coach, then Sarah, then any admin)
    let coachId = user.assignedCoachId;

    if (!coachId) {
      const defaultCoach = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "coach@accredipro-certificate.com" },
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

    // SPECIAL HANDLING: First login welcome message with voice
    if (trigger === "first_login") {
      await sendFirstLoginWelcome(userId, user.firstName || "there", coachId);
      return; // Don't process other auto-messages for first login
    }

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
 * Sends personalized first login welcome message with voice from Sarah
 */
async function sendFirstLoginWelcome(userId: string, firstName: string, coachId: string) {
  try {
    // Check if we've already sent a welcome message
    const existingWelcome = await prisma.message.findFirst({
      where: {
        receiverId: userId,
        content: { contains: "Welcome to AccrediPro" },
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    });

    if (existingWelcome) {
      return; // Already sent
    }

    // Create the welcome text message
    const welcomeContent = getWelcomeMessage(firstName);

    await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: welcomeContent,
        messageType: "DIRECT",
      },
    });

    // Create the voice message (using voiceUrl field)
    await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: `🎤 Voice message from your coach`,
        voiceUrl: SARAH_WELCOME_VOICE_URL,
        voiceDuration: 45, // Approximate duration
        messageType: "DIRECT",
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: "NEW_MESSAGE",
        title: "Welcome message from your coach! 🎉",
        message: "Sarah has sent you a personalized welcome message with a voice note",
        data: { senderId: coachId },
      },
    });

    console.log(`Sent first login welcome to user ${userId}`);
  } catch (error) {
    console.error("Error sending first login welcome:", error);
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

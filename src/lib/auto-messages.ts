import prisma from "./prisma";
import { generateSarahVoice } from "./elevenlabs";
import { createClient } from "@supabase/supabase-js";

interface TriggerAutoMessageOptions {
  userId: string;
  trigger:
    | "first_login"
    | "enrollment"
    | "course_complete"
    | "inactive_7d"
    | "mini_diploma_complete"
    | "graduate_training_watched"
    | "pricing_page_visit"
    | "sequence_day_5"
    | "sequence_day_10"
    | "sequence_day_20"
    | "sequence_day_27"
    | "sequence_day_30";
  triggerValue?: string; // e.g., course ID
}

/**
 * Generate Sarah's voice using ElevenLabs and upload to Supabase storage
 */
async function generateAndUploadVoice(
  text: string,
  filename: string
): Promise<{ url: string; duration: number } | null> {
  try {
    console.log(`[VOICE] Generating voice for: ${filename}`);

    // Generate voice using ElevenLabs
    const voiceResult = await generateSarahVoice(text);

    if (!voiceResult.success || !voiceResult.audioBase64) {
      console.error(`[VOICE] Failed to generate voice: ${voiceResult.error}`);
      return null;
    }

    // Upload to Supabase storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[VOICE] Supabase not configured");
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucket = "chat-attachments";
    const filePath = `system/voice/${filename}-${Date.now()}.mp3`;

    // Convert base64 to buffer
    const buffer = Buffer.from(voiceResult.audioBase64, "base64");

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      // Try creating bucket if it doesn't exist
      if (error.message?.includes("not found") || error.message?.includes("does not exist")) {
        await supabase.storage.createBucket(bucket, { public: true });
        const { error: retryError } = await supabase.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: "audio/mpeg",
            cacheControl: "3600",
            upsert: false,
          });
        if (retryError) {
          console.error(`[VOICE] Upload failed after retry: ${retryError.message}`);
          return null;
        }
      } else {
        console.error(`[VOICE] Upload failed: ${error.message}`);
        return null;
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log(`[VOICE] Voice uploaded successfully: ${urlData.publicUrl}`);

    return {
      url: urlData.publicUrl,
      duration: voiceResult.duration || 30,
    };
  } catch (error) {
    console.error("[VOICE] Error generating/uploading voice:", error);
    return null;
  }
}

// DM content for each trigger - with voice scripts for ElevenLabs generation
const DM_CONTENT = {
  sequence_day_5: {
    text: `Hey {{firstName}}!

Just checking in - how's your Mini Diploma going?

I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.

No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!

- Sarah`,
    voiceScript: `Hey {{firstName}}! Just checking in, how's your Mini Diploma going?
I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.
No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!`,
    hasVoice: true,
  },
  sequence_day_10: {
    text: `{{firstName}}!

I see you've been making progress - that's amazing!

I wanted to share something with you: The certification program is what really transformed my life. It's where everything clicked.

When you're ready to take the next step, I'm here. Just message me and we can talk about what that looks like for you.

Cheering you on!
- Sarah`,
    voiceScript: null,
    hasVoice: false,
  },
  sequence_day_20: {
    text: `{{firstName}}, can we have a real talk?

I know $997 is a real investment. And if you're wondering if it's worth it, or if you can make it work... I want you to know I've been there.

I left you a voice message explaining my own journey with this. Give it a listen when you have a moment.

And if cost is the barrier, we do have payment plans. Let's figure this out together.

- Sarah`,
    voiceScript: `{{firstName}}, can we have a real talk?
I know 997 dollars is a real investment. And if you're wondering if it's worth it, or if you can make it work, I want you to know I've been there.
When I started, I didn't have the money either. But I made it work because I believed in myself. And you know what? It was the best decision I ever made.
If cost is the barrier, we do have payment plans. Let's figure this out together.`,
    hasVoice: true,
  },
  sequence_day_27: {
    text: `{{firstName}}, heads up...

Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.

Is there anything holding you back? Any questions I can answer?

I left you a voice note too. I really believe this could change everything for you.

- Sarah`,
    voiceScript: `{{firstName}}, heads up! Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.
Is there anything holding you back? Any questions I can answer?
I really believe this could change everything for you. Message me back if you want to chat.`,
    hasVoice: true,
  },
  sequence_day_30: {
    text: `{{firstName}}, this is it. The door closes tonight.

I'm not going to pressure you. You already know if this is right for you.

I just wanted to say: I believe in you. Whatever you decide.

Listen to my final voice message when you get a chance.

- Sarah`,
    voiceScript: `{{firstName}}, this is it. The door closes tonight.
I'm not going to pressure you. You already know if this is right for you.
I just wanted to say: I believe in you. Whatever you decide.
If you're ready to take the leap, I'll be here waiting for you on the other side.`,
    hasVoice: true,
  },
  mini_diploma_complete: {
    text: `{{firstName}}!! You did it!

You finished your Mini Diploma and I am SO proud of you!

Seriously - do you know how many people download something and never even open it? But YOU showed up. You did the work.

I left you a voice message to celebrate. Give it a listen!

When you're ready to talk about the full certification, I'm here.

- Sarah`,
    voiceScript: `Oh my gosh, {{firstName}}! You did it! You finished your Mini Diploma!

I am SO proud of you right now. Seriously. Do you know how many people download a freebie and never even open it? But you, you showed up. You did the work. You completed it.

That tells me something about you. You're not just curious... you're committed.

So here's what I want you to think about:

What you just learned? That's just a tiny taste of what's possible. The full certification goes SO much deeper, into the protocols, the client work, the real transformation you can create for people.

I've seen students just like you go from where you are now... to helping real clients... to building income that gives them freedom.

And I really believe that could be you too.

Take some time to celebrate what you just accomplished. Then, when you're ready, come check out the full certification program. I'll be here waiting to welcome you in.

You've got this. Talk soon!`,
    hasVoice: true,
  },
  pricing_page_visit: {
    text: `Hey {{firstName}}!

I noticed you were checking out the certification program - exciting!

Any questions I can help answer? I'm here if you want to chat about pricing, what's included, or anything else.

No pressure at all. Just here to help!

- Sarah`,
    voiceScript: null,
    hasVoice: false,
  },
};

/**
 * Creates the initial admin welcome message (sent immediately on signup)
 * Now from "AccrediPro Founder"
 */
function getAdminWelcomeMessage(firstName: string): string {
  return `Welcome to AccrediPro Academy, ${firstName}!

Your account has been created successfully. Here's what you have access to:

✅ Free Mini Diploma in Functional Medicine
✅ Your Personal Dashboard
✅ Direct Messaging with Your Coach

Your coach Sarah will be reaching out to you shortly with a personal welcome message.

In the meantime, feel free to explore your dashboard and start your Mini Diploma whenever you're ready!

Best,
AccrediPro Founder`;
}

/**
 * Creates the personalized welcome message content from Sarah (sent 2-3 min after signup)
 */
function getWelcomeMessage(firstName: string): string {
  return `Hey ${firstName}....!

I'm Sarah, and I'll be your coach throughout this journey.

I just saw your name come through and wanted to personally say welcome. This is the start of something special..!

Inside your dashboard, you'll find your Mini Diploma ready to start, your Roadmap showing where you're headed, and you can message me anytime..!

I know you might have questions. Maybe you're wondering if this is really for you... I get it, I felt the same way when I started...

But here's what I know: you signed up for a reason. Let's find out what that is together.

Hit reply anytime. I'm here for you, every step of the way!!!

Talk soon,
Sarah`;
}

/**
 * Creates the voice script for welcome message (natural speech with pauses)
 * Uses punctuation for natural pacing: ... for pauses, ..! for emphasis
 */
function getWelcomeVoiceScript(firstName: string): string {
  return `Hey there! I'm Sarah, and I'll be your coach throughout this journey....!

I just saw your name come through, ${firstName}, and wanted to personally say welcome.

This is the start of something special.

Inside your dashboard, you'll find your Mini Diploma ready to start, your Roadmap showing where you're headed, and you can message me anytime..!

..I know you might have questions. Maybe you're wondering if this is really for you. I get it, I felt the same way when I started...

But here's what I know: you signed up for a reason. Let's find out what that is together.

Hit reply anytime. I'm here for you, every step of the way!!!`;
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
    console.log(`[AUTO-MESSAGE] Triggering ${trigger} for user ${userId}`);

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

    if (!user) {
      console.warn(`[AUTO-MESSAGE] User ${userId} not found`);
      return;
    }

    console.log(`[AUTO-MESSAGE] Found user: ${user.firstName || 'Unknown'}`);

    // Get a coach to send from (prefer assigned coach, then Sarah, then any admin)
    let coachId = user.assignedCoachId;

    if (!coachId) {
      // Try to find a coach - prioritize specific coach emails first
      const defaultCoach = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "coach@accredipro-certificate.com" },
            { email: "sarah@accredipro-certificate.com" },
            { role: "ADMIN" },
            { role: "MENTOR" },
          ],
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, email: true, firstName: true },
      });

      if (defaultCoach) {
        console.log(`[AUTO-MESSAGE] Using coach: ${defaultCoach.email || defaultCoach.firstName}`);
        coachId = defaultCoach.id;
      }
    }

    if (!coachId) {
      console.error("[AUTO-MESSAGE] No coach available to send auto-message - please create an ADMIN or MENTOR user");
      return;
    }

    // SPECIAL HANDLING: First login welcome message with voice
    if (trigger === "first_login") {
      await sendFirstLoginWelcome(userId, user.firstName || "there", coachId);
      return; // Don't process other auto-messages for first login
    }

    // Handle DM triggers with voice messages
    const dmContent = DM_CONTENT[trigger as keyof typeof DM_CONTENT];
    if (dmContent) {
      await sendAutoDM(userId, user.firstName || "there", coachId, trigger, dmContent);
      return;
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
 *
 * Flow:
 * 1. Immediately: Send admin welcome message
 * 2. After 2-3 min: Schedule Sarah's personal message with voice (via scheduled_messages table)
 */
async function sendFirstLoginWelcome(userId: string, firstName: string, coachId: string) {
  try {
    console.log(`[AUTO-MESSAGE] Sending first login welcome to ${firstName} (${userId}) from coach ${coachId}`);

    // Check if we've already sent a welcome message (check for admin welcome OR Sarah welcome)
    const existingWelcome = await prisma.message.findFirst({
      where: {
        receiverId: userId,
        OR: [
          { content: { contains: "I'll be your coach" } },
          { content: { contains: "Welcome to AccrediPro Academy" } },
        ],
      },
    });

    // Also check if there's already a scheduled voice message for this user
    const existingScheduled = await prisma.scheduledVoiceMessage.findFirst({
      where: {
        receiverId: userId,
        status: { in: ["PENDING", "PROCESSING"] },
      },
    });

    if (existingWelcome || existingScheduled) {
      console.log(`[AUTO-MESSAGE] Welcome already sent/scheduled to ${userId}, skipping`);
      return; // Already sent or scheduled
    }

    // Get admin user for the system message (AccrediPro Founder)
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: "admin@accredipro.com" },  // Main admin account (AccrediPro Founder)
          { email: "admin@accredipro-certificate.com" },
          { email: "admin@accredipro.academy" },
          { role: "ADMIN" },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    const adminId = adminUser?.id || coachId;

    // Get Sarah's coach account specifically for the personal message
    const sarahCoach = await prisma.user.findFirst({
      where: {
        email: "sarah@accredipro-certificate.com",
      },
    });

    // Use Sarah's ID if found, otherwise fall back to the provided coachId
    const sarahId = sarahCoach?.id || coachId;
    console.log(`[AUTO-MESSAGE] Using Sarah coach ID: ${sarahId}`);

    // STEP 1: Send immediate admin welcome message
    const adminContent = getAdminWelcomeMessage(firstName);
    const adminMessage = await prisma.message.create({
      data: {
        senderId: adminId,
        receiverId: userId,
        content: adminContent,
        messageType: "DIRECT",
      },
    });
    console.log(`[AUTO-MESSAGE] Created admin welcome message: ${adminMessage.id}`);

    // Create notification for admin message
    await prisma.notification.create({
      data: {
        userId,
        type: "NEW_MESSAGE",
        title: "Welcome to AccrediPro Academy!",
        message: "Your account has been created successfully.",
        data: { senderId: adminId },
      },
    });

    // STEP 2: Schedule Sarah's personal message for 2-3 minutes later
    // Random delay between 2-3 minutes (120-180 seconds)
    const delaySeconds = 120 + Math.floor(Math.random() * 60);
    const scheduledFor = new Date(Date.now() + delaySeconds * 1000);

    console.log(`[AUTO-MESSAGE] Scheduling Sarah's welcome for ${scheduledFor.toISOString()} (${delaySeconds}s delay)`);

    // Store the scheduled voice message in database using existing ScheduledVoiceMessage model
    const voiceScript = getWelcomeVoiceScript(firstName);
    const textContent = getWelcomeMessage(firstName);

    await prisma.scheduledVoiceMessage.create({
      data: {
        senderId: sarahId,
        receiverId: userId,
        voiceText: voiceScript,
        textContent: textContent,
        scheduledFor,
        status: "PENDING",
      },
    });

    // Assign Sarah as the user's coach
    if (sarahCoach) {
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: sarahId },
      });
      console.log(`[AUTO-MESSAGE] Assigned Sarah as coach for user ${userId}`);
    }

    console.log(`[AUTO-MESSAGE] SUCCESS: Sent admin welcome + scheduled Sarah's message for user ${userId}`);
  } catch (error) {
    console.error("[AUTO-MESSAGE] Error sending first login welcome:", error);
    throw error; // Re-throw to see in logs
  }
}

/**
 * Process scheduled voice messages - called by cron job every minute
 */
export async function processScheduledMessages() {
  try {
    const now = new Date();

    // Find all pending voice messages that should be sent now
    const pendingMessages = await prisma.scheduledVoiceMessage.findMany({
      where: {
        status: "PENDING",
        scheduledFor: { lte: now },
      },
      include: {
        receiver: {
          select: { firstName: true },
        },
      },
    });

    console.log(`[SCHEDULED] Found ${pendingMessages.length} voice messages to process`);

    for (const scheduled of pendingMessages) {
      try {
        // Mark as processing to prevent duplicate sends
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: { status: "PROCESSING" },
        });

        // Extract first name from receiver or parse from voiceText
        const firstName = scheduled.receiver?.firstName || "there";

        // Send Sarah's welcome with voice
        await sendSarahWelcomeWithVoiceFromScheduled(
          scheduled.receiverId,
          firstName,
          scheduled.senderId,
          scheduled.textContent,
          scheduled.voiceText
        );

        // Mark as sent
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: { status: "SENT", sentAt: new Date() },
        });

        console.log(`[SCHEDULED] Successfully processed voice message ${scheduled.id}`);
      } catch (error) {
        console.error(`[SCHEDULED] Error processing voice message ${scheduled.id}:`, error);

        // Mark as failed and increment attempts
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: {
            status: "FAILED",
            attempts: { increment: 1 },
            lastError: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }
  } catch (error) {
    console.error("[SCHEDULED] Error in processScheduledMessages:", error);
  }
}

/**
 * Sends Sarah's personal welcome message with voice (from scheduled job)
 * Uses pre-generated text and voice script from the scheduled message
 */
async function sendSarahWelcomeWithVoiceFromScheduled(
  userId: string,
  firstName: string,
  coachId: string,
  textContent: string,
  voiceScript: string
) {
  console.log(`[AUTO-MESSAGE] Sending Sarah's scheduled welcome with voice to ${firstName} (${userId})`);

  // Create the welcome text message
  const textMessage = await prisma.message.create({
    data: {
      senderId: coachId,
      receiverId: userId,
      content: textContent,
      messageType: "DIRECT",
    },
  });
  console.log(`[AUTO-MESSAGE] Created Sarah's text message: ${textMessage.id}`);

  // Generate voice message using ElevenLabs with Sarah's cloned voice
  const voiceResult = await generateAndUploadVoice(voiceScript, `welcome-${userId.slice(0, 8)}`);

  if (voiceResult) {
    // Create the voice message with uploaded audio URL
    const voiceMessage = await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: `🎤 Voice message from Sarah`,
        attachmentUrl: voiceResult.url,
        attachmentType: "voice",
        attachmentName: "Welcome from Sarah",
        voiceDuration: voiceResult.duration,
        messageType: "DIRECT",
      },
    });
    console.log(`[AUTO-MESSAGE] Created voice message: ${voiceMessage.id}`);
  } else {
    console.warn(`[AUTO-MESSAGE] Could not generate voice, skipping voice message`);
  }

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: "NEW_MESSAGE",
      title: "New message from Sarah! 🎤",
      message: "Sarah has sent you a personal welcome message with a voice note",
      data: { senderId: coachId },
    },
  });

  console.log(`[AUTO-MESSAGE] SUCCESS: Sent Sarah's welcome (text + voice) to user ${userId}`);
}

/**
 * Sends an automated DM with optional voice message
 */
async function sendAutoDM(
  userId: string,
  firstName: string,
  coachId: string,
  trigger: string,
  content: { text: string; voiceScript: string | null; hasVoice: boolean }
) {
  try {
    console.log(`[AUTO-MESSAGE] Sending ${trigger} DM to ${firstName} (${userId})`);

    // Check if we've already sent this specific DM trigger to this user
    const existingMessage = await prisma.message.findFirst({
      where: {
        receiverId: userId,
        senderId: coachId,
        content: { contains: content.text.substring(0, 30).replace(/\{\{firstName\}\}/g, firstName) },
      },
    });

    if (existingMessage) {
      console.log(`[AUTO-MESSAGE] ${trigger} DM already sent to ${userId}, skipping`);
      return;
    }

    // Replace template variables
    const textContent = content.text.replace(/\{\{firstName\}\}/g, firstName);

    // Create the text message
    const textMessage = await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: textContent,
        messageType: "DIRECT",
      },
    });
    console.log(`[AUTO-MESSAGE] Created text DM: ${textMessage.id}`);

    // Generate and send voice message if script is provided
    if (content.hasVoice && content.voiceScript) {
      const voiceScriptPersonalized = content.voiceScript.replace(/\{\{firstName\}\}/g, firstName);
      const voiceResult = await generateAndUploadVoice(
        voiceScriptPersonalized,
        `${trigger}-${userId.slice(0, 8)}`
      );

      if (voiceResult) {
        const voiceMessage = await prisma.message.create({
          data: {
            senderId: coachId,
            receiverId: userId,
            content: `🎤 Voice message from Sarah`,
            attachmentUrl: voiceResult.url,
            attachmentType: "voice",
            attachmentName: `Sarah - ${trigger.replace(/_/g, " ")}`,
            voiceDuration: voiceResult.duration,
            messageType: "DIRECT",
          },
        });
        console.log(`[AUTO-MESSAGE] Created voice DM: ${voiceMessage.id}`);
      } else {
        console.warn(`[AUTO-MESSAGE] Could not generate voice for ${trigger}`);
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: "NEW_MESSAGE",
        title: content.hasVoice ? "New voice message from Sarah!" : "New message from Sarah!",
        message: textContent.substring(0, 100) + "...",
        data: { senderId: coachId },
      },
    });

    console.log(`[AUTO-MESSAGE] SUCCESS: Sent ${trigger} DM to user ${userId}`);
  } catch (error) {
    console.error(`[AUTO-MESSAGE] Error sending ${trigger} DM:`, error);
    throw error;
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

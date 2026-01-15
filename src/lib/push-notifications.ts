import webpush from "web-push";
import { prisma } from "@/lib/prisma";

// Configure web-push with VAPID keys
// Generate keys with: npx web-push generate-vapid-keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || "";

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    "mailto:support@accredipro.academy",
    vapidPublicKey,
    vapidPrivateKey
  );
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: {
    url?: string;
    type?: "message" | "course" | "certificate" | "reminder";
    [key: string]: unknown;
  };
}

/**
 * Send push notification to a specific user
 */
export async function sendPushToUser(
  userId: string,
  payload: PushPayload,
  notificationType: "messages" | "courses" | "reminders" | "marketing" = "messages"
): Promise<{ success: number; failed: number }> {
  // Get all subscriptions for this user with the appropriate preference enabled
  const fieldMap = {
    messages: "messagesEnabled",
    courses: "coursesEnabled",
    reminders: "remindersEnabled",
    marketing: "marketingEnabled",
  } as const;

  const subscriptions = await prisma.pushSubscription.findMany({
    where: {
      userId,
      [fieldMap[notificationType]]: true,
    },
  });

  let success = 0;
  let failed = 0;

  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            p256dh: subscription.p256dh,
            auth: subscription.auth,
          },
        },
        JSON.stringify({
          ...payload,
          icon: payload.icon || "/icons/icon-192x192.png",
          badge: payload.badge || "/icons/icon-96x96.png",
        })
      );

      // Update last push time
      await prisma.pushSubscription.update({
        where: { id: subscription.id },
        data: { lastPushAt: new Date(), failureCount: 0 },
      });

      success++;
    } catch (error: unknown) {
      console.error(`Push failed for subscription ${subscription.id}:`, error);
      failed++;

      // Handle expired/invalid subscriptions
      const statusCode = (error as { statusCode?: number })?.statusCode;
      if (statusCode === 410 || statusCode === 404) {
        // Subscription is expired or invalid, delete it
        await prisma.pushSubscription.delete({
          where: { id: subscription.id },
        });
      } else {
        // Increment failure count
        const newFailureCount = subscription.failureCount + 1;
        if (newFailureCount >= 5) {
          // Too many failures, delete subscription
          await prisma.pushSubscription.delete({
            where: { id: subscription.id },
          });
        } else {
          await prisma.pushSubscription.update({
            where: { id: subscription.id },
            data: { failureCount: newFailureCount },
          });
        }
      }
    }
  }

  return { success, failed };
}

/**
 * Send push notification to multiple users
 */
export async function sendPushToUsers(
  userIds: string[],
  payload: PushPayload,
  notificationType: "messages" | "courses" | "reminders" | "marketing" = "messages"
): Promise<{ success: number; failed: number }> {
  let totalSuccess = 0;
  let totalFailed = 0;

  for (const userId of userIds) {
    const result = await sendPushToUser(userId, payload, notificationType);
    totalSuccess += result.success;
    totalFailed += result.failed;
  }

  return { success: totalSuccess, failed: totalFailed };
}

/**
 * Send notification when user receives a new message
 */
export async function notifyNewMessage(
  recipientId: string,
  senderName: string,
  messagePreview: string,
  conversationUrl: string
): Promise<void> {
  await sendPushToUser(
    recipientId,
    {
      title: `New message from ${senderName}`,
      body: messagePreview.length > 100 ? messagePreview.slice(0, 100) + "..." : messagePreview,
      tag: "new-message",
      data: {
        url: conversationUrl,
        type: "message",
      },
    },
    "messages"
  );
}

/**
 * Send notification when user earns a certificate
 */
export async function notifyCertificateEarned(
  userId: string,
  certificateTitle: string,
  certificateUrl: string
): Promise<void> {
  await sendPushToUser(
    userId,
    {
      title: "Congratulations! Certificate Earned",
      body: `You've earned your ${certificateTitle} certificate!`,
      tag: "certificate",
      data: {
        url: certificateUrl,
        type: "certificate",
      },
    },
    "courses"
  );
}

/**
 * Send lesson reminder notification
 */
export async function notifyLessonReminder(
  userId: string,
  lessonTitle: string,
  lessonUrl: string
): Promise<void> {
  await sendPushToUser(
    userId,
    {
      title: "Continue Your Learning",
      body: `Resume: ${lessonTitle}`,
      tag: "lesson-reminder",
      data: {
        url: lessonUrl,
        type: "reminder",
      },
    },
    "reminders"
  );
}

/**
 * Get VAPID public key for client-side subscription
 */
export function getVapidPublicKey(): string {
  return vapidPublicKey;
}

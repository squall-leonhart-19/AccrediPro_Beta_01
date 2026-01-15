import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getVapidPublicKey } from "@/lib/push-notifications";

/**
 * GET /api/push/subscribe
 * Returns VAPID public key for client-side subscription
 */
export async function GET() {
  const vapidPublicKey = getVapidPublicKey();

  if (!vapidPublicKey) {
    return NextResponse.json(
      { error: "Push notifications not configured" },
      { status: 503 }
    );
  }

  return NextResponse.json({ vapidPublicKey });
}

/**
 * POST /api/push/subscribe
 * Subscribe user to push notifications
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { subscription, deviceType } = body;

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    // Get user agent for device info
    const userAgent = request.headers.get("user-agent") || undefined;

    // Upsert the subscription (update if same endpoint exists)
    await prisma.pushSubscription.upsert({
      where: { endpoint: subscription.endpoint },
      update: {
        userId: session.user.id,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        deviceType: deviceType || detectDeviceType(userAgent),
        failureCount: 0,
      },
      create: {
        userId: session.user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent,
        deviceType: deviceType || detectDeviceType(userAgent),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push subscription error:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/push/subscribe
 * Unsubscribe from push notifications
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      // Delete all subscriptions for user
      await prisma.pushSubscription.deleteMany({
        where: { userId: session.user.id },
      });
    } else {
      // Delete specific subscription
      await prisma.pushSubscription.deleteMany({
        where: {
          userId: session.user.id,
          endpoint,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe" },
      { status: 500 }
    );
  }
}

function detectDeviceType(userAgent?: string): string {
  if (!userAgent) return "unknown";

  if (/Mobile|Android|iPhone|iPad|iPod/i.test(userAgent)) {
    if (/iPad|Tablet/i.test(userAgent)) return "tablet";
    return "mobile";
  }

  return "desktop";
}

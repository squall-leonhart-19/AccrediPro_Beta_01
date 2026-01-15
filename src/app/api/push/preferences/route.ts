import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/push/preferences
 * Get user's push notification preferences
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all subscriptions for the user
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        deviceType: true,
        messagesEnabled: true,
        coursesEnabled: true,
        remindersEnabled: true,
        marketingEnabled: true,
        createdAt: true,
        lastPushAt: true,
      },
    });

    // If user has subscriptions, return the preferences from the first one
    // (they should all have the same preferences)
    if (subscriptions.length > 0) {
      const prefs = subscriptions[0];
      return NextResponse.json({
        subscribed: true,
        deviceCount: subscriptions.length,
        preferences: {
          messagesEnabled: prefs.messagesEnabled,
          coursesEnabled: prefs.coursesEnabled,
          remindersEnabled: prefs.remindersEnabled,
          marketingEnabled: prefs.marketingEnabled,
        },
        devices: subscriptions.map((s) => ({
          id: s.id,
          deviceType: s.deviceType,
          subscribedAt: s.createdAt,
          lastPushAt: s.lastPushAt,
        })),
      });
    }

    return NextResponse.json({
      subscribed: false,
      deviceCount: 0,
      preferences: null,
      devices: [],
    });
  } catch (error) {
    console.error("Get push preferences error:", error);
    return NextResponse.json(
      { error: "Failed to get preferences" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/push/preferences
 * Update push notification preferences
 */
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { messagesEnabled, coursesEnabled, remindersEnabled, marketingEnabled } = body;

    // Build update data with only provided fields
    const updateData: Record<string, boolean> = {};
    if (typeof messagesEnabled === "boolean") updateData.messagesEnabled = messagesEnabled;
    if (typeof coursesEnabled === "boolean") updateData.coursesEnabled = coursesEnabled;
    if (typeof remindersEnabled === "boolean") updateData.remindersEnabled = remindersEnabled;
    if (typeof marketingEnabled === "boolean") updateData.marketingEnabled = marketingEnabled;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "No valid preferences provided" },
        { status: 400 }
      );
    }

    // Update all subscriptions for this user
    await prisma.pushSubscription.updateMany({
      where: { userId: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update push preferences error:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}

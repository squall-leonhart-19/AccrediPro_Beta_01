import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

interface RouteParams {
    params: Promise<{ podId: string }>;
}

// POST: Send a reply as Sarah in a pod
export async function POST(request: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check admin access
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true, firstName: true },
    });

    if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { podId } = await params;
    const body = await request.json();
    const { content } = body;

    if (!content?.trim()) {
        return NextResponse.json({ error: "Message content is required" }, { status: 400 });
    }

    // Get the pod
    const pod = await prisma.masterclassPod.findUnique({
        where: { id: podId },
        select: {
            id: true,
            masterclassDay: true,
            userId: true,
        },
    });

    if (!pod) {
        return NextResponse.json({ error: "Pod not found" }, { status: 404 });
    }

    // Create the Sarah message
    const message = await prisma.masterclassMessage.create({
        data: {
            podId: pod.id,
            dayNumber: pod.masterclassDay,
            senderType: "sarah",
            senderName: "Sarah",
            senderAvatar: "/images/sarah-thompson.jpg",
            content: content.trim(),
            sentAt: new Date(),
        },
    });

    // Update pod's updatedAt
    await prisma.masterclassPod.update({
        where: { id: podId },
        data: { updatedAt: new Date() },
    });

    // Also create a matching DM so the user sees it in their messages
    // Find Sarah's user account
    const sarahUser = await prisma.user.findFirst({
        where: { email: { contains: "sarah" }, role: "INSTRUCTOR" },
        select: { id: true },
    });

    if (sarahUser) {
        await prisma.message.create({
            data: {
                senderId: sarahUser.id,
                receiverId: pod.userId,
                content: content.trim(),
                messageType: "DIRECT",
            },
        });
    }

    console.log(`[PODS] Admin ${user.firstName} sent Sarah reply in pod ${podId}`);

    return NextResponse.json({
        success: true,
        message,
    });
}

// PUT: Mark messages as read
export async function PUT(request: NextRequest, { params }: RouteParams) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { podId } = await params;

    // Mark all user messages in this pod as read
    await prisma.masterclassMessage.updateMany({
        where: {
            podId,
            senderType: "user",
            readAt: null,
        },
        data: {
            readAt: new Date(),
        },
    });

    return NextResponse.json({ success: true });
}

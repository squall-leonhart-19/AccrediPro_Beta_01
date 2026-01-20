import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch recent chat messages for a course
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        let courseId = searchParams.get("courseId");
        const courseSlug = searchParams.get("courseSlug");
        const limit = parseInt(searchParams.get("limit") || "50");
        const since = searchParams.get("since"); // Delta polling: only fetch messages after this ID

        // Support courseSlug for mini diplomas
        if (!courseId && courseSlug) {
            const course = await prisma.course.findFirst({
                where: { slug: courseSlug },
                select: { id: true }
            });
            if (course) {
                courseId = course.id;
            }
        }

        if (!courseId) {
            return NextResponse.json({ success: false, error: "courseId or courseSlug required" }, { status: 400 });
        }

        // Build where clause for delta polling
        const whereClause: { courseId: string; createdAt?: { gt: Date } } = { courseId };

        // If "since" ID provided, get the timestamp of that message and fetch only newer ones
        if (since) {
            const sinceMessage = await prisma.lessonChatMessage.findUnique({
                where: { id: since },
                select: { createdAt: true }
            });
            if (sinceMessage) {
                whereClause.createdAt = { gt: sinceMessage.createdAt };
            }
        }

        const messages = await prisma.lessonChatMessage.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            take: since ? 100 : limit, // Allow more messages for delta to catch up
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                }
            }
        });

        // Reverse to show oldest first
        messages.reverse();

        // Transform messages to include display names
        const formattedMessages = messages.map(msg => ({
            id: msg.id,
            content: msg.content,
            createdAt: msg.createdAt,
            isZombie: msg.isZombie,
            isMe: msg.userId === session.user.id,
            user: msg.isZombie ? {
                name: msg.zombieName,
                avatar: msg.zombieAvatar,
            } : {
                name: msg.user ? `${msg.user.firstName || ""} ${msg.user.lastName || ""}`.trim() || "Student" : "Student",
                avatar: msg.user?.avatar || null,
            }
        }));

        // Generate simulated online count (time-based for realism)
        // Day (8AM-10PM): 300-500, Night: 150-250
        const hour = new Date().getHours();
        const isDaytime = hour >= 8 && hour <= 22;
        const baseOnline = isDaytime
            ? 300 + Math.floor(Math.random() * 200)  // 300-500 during day
            : 150 + Math.floor(Math.random() * 100); // 150-250 at night
        // Add slight variation based on message activity
        const onlineCount = baseOnline + (messages.length > 20 ? 15 : 0);

        return NextResponse.json({
            success: true,
            data: formattedMessages,
            onlineCount,
        });
    } catch (error) {
        console.error("Lesson chat messages error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch messages" }, { status: 500 });
    }
}

// POST - Send a new chat message
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { courseId: rawCourseId, courseSlug, content } = await request.json();

        let courseId = rawCourseId;

        // Support courseSlug for mini diplomas
        if (!courseId && courseSlug) {
            const course = await prisma.course.findFirst({
                where: { slug: courseSlug },
                select: { id: true }
            });
            if (course) {
                courseId = course.id;
            }
        }

        if (!courseId || !content?.trim()) {
            return NextResponse.json({ success: false, error: "courseId/courseSlug and content required" }, { status: 400 });
        }

        // Banned words filter - silently reject without error
        const BANNED_WORDS = [
            "scam", "refund", "chargeback", "fraud", "lawsuit",
            "sue", "report", "bbb", "ftc", "attorney", "lawyer",
            "money back", "fake", "pyramid", "mlm", "ripoff",
            "rip off", "rip-off", "stolen", "steal", "theft",
            "dispute", "complaint", "scammer", "con artist"
        ];

        const lowerContent = content.toLowerCase();
        const hasBannedWord = BANNED_WORDS.some(word => lowerContent.includes(word));

        if (hasBannedWord) {
            // Return fake success - message appears to user but isn't saved
            return NextResponse.json({
                success: true,
                data: {
                    id: `filtered-${Date.now()}`,
                    content: content.trim(),
                    createdAt: new Date(),
                    isZombie: false,
                    isMe: true,
                    user: { name: "You", avatar: null }
                }
            });
        }

        const message = await prisma.lessonChatMessage.create({
            data: {
                courseId,
                userId: session.user.id,
                content: content.trim(),
                isZombie: false,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                    }
                }
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                id: message.id,
                content: message.content,
                createdAt: message.createdAt,
                isZombie: false,
                isMe: true,
                user: {
                    name: `${message.user?.firstName || ""} ${message.user?.lastName || ""}`.trim() || "Student",
                    avatar: message.user?.avatar || null,
                }
            }
        });
    } catch (error) {
        console.error("Send lesson chat message error:", error);
        return NextResponse.json({ success: false, error: "Failed to send message" }, { status: 500 });
    }
}

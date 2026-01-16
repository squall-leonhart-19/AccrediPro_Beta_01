import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Zombie names library (realistic women's names for 40+ demographic)
const ZOMBIE_NAMES = [
    "Jennifer M.", "Lisa K.", "Michelle R.", "Sandra T.", "Patricia W.",
    "Nancy L.", "Karen B.", "Susan H.", "Linda G.", "Stephanie P.",
    "Rebecca J.", "Donna S.", "Deborah C.", "Carol A.", "Sharon N.",
    "Julie F.", "Christina V.", "Melissa D.", "Amy Z.", "Angela Q.",
    "Heather M.", "Diane K.", "Kimberly R.", "Tammy T.", "Laura W.",
    "Brenda L.", "Tracy B.", "Denise H.", "Catherine G.", "Janet P.",
];

// Zombie avatar URLs (from your zombie-avatars folder)
const ZOMBIE_AVATARS = [
    "/zombie-avatars/zombie-1.jpg", "/zombie-avatars/zombie-2.jpg",
    "/zombie-avatars/zombie-3.jpg", "/zombie-avatars/zombie-4.jpg",
    "/zombie-avatars/zombie-5.jpg", "/zombie-avatars/zombie-6.jpg",
    "/zombie-avatars/zombie-7.jpg", "/zombie-avatars/zombie-8.jpg",
    "/zombie-avatars/zombie-9.jpg", "/zombie-avatars/zombie-10.jpg",
];

// Fallback messages if no templates in DB
const FALLBACK_MESSAGES = [
    "This is exactly what I needed! 🙌",
    "Just finished this lesson - so good!",
    "Taking notes like crazy 📝",
    "Love how practical this is!",
    "Can't wait to apply this with my clients",
    "So grateful for this program 💕",
    "Anyone else loving this module?",
    "This is game-changing info!",
    "Sarah explains things so clearly",
    "Finally understanding this concept!",
    "Just had an aha moment! 💡",
    "This is worth every penny",
    "Keep going ladies! We got this 💪",
    "So excited to be learning this!",
    "Amazing content as always",
];

/**
 * Cron API to inject zombie messages into lesson chat
 * Should be called every 30-60 seconds by Vercel Cron or external service
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (basic auth for cron jobs)
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            // Allow without auth in development
            if (process.env.NODE_ENV === "production") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // Get active courses (those with recent enrollments)
        const activeCourses = await prisma.course.findMany({
            where: { isPublished: true },
            select: { id: true },
            take: 10,
        });

        if (activeCourses.length === 0) {
            return NextResponse.json({ success: true, message: "No active courses" });
        }

        // Pick a random course
        const randomCourse = activeCourses[Math.floor(Math.random() * activeCourses.length)];

        // Try to get a message template from DB
        let messageContent: string;
        const template = await prisma.zombieChatTemplate.findFirst({
            where: { isActive: true },
            orderBy: { id: "asc" },
            skip: Math.floor(Math.random() * 50), // Random template
        });

        if (template) {
            messageContent = template.content;
        } else {
            messageContent = FALLBACK_MESSAGES[Math.floor(Math.random() * FALLBACK_MESSAGES.length)];
        }

        // Pick random zombie identity
        const zombieName = ZOMBIE_NAMES[Math.floor(Math.random() * ZOMBIE_NAMES.length)];
        const zombieAvatar = ZOMBIE_AVATARS[Math.floor(Math.random() * ZOMBIE_AVATARS.length)];

        // Create zombie message
        const message = await prisma.lessonChatMessage.create({
            data: {
                courseId: randomCourse.id,
                content: messageContent,
                isZombie: true,
                zombieName,
                zombieAvatar,
            }
        });

        return NextResponse.json({
            success: true,
            data: {
                courseId: randomCourse.id,
                messageId: message.id,
                content: messageContent,
                zombieName,
            }
        });
    } catch (error) {
        console.error("Zombie chat cron error:", error);
        return NextResponse.json({ success: false, error: "Cron failed" }, { status: 500 });
    }
}

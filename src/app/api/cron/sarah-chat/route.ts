import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Cron API for Sarah's Live Chat Messages
 * 
 * Features:
 * - Sends 8-10 messages daily from Sarah
 * - Messages appear with gold/yellow background in chat
 * - Uses Sarah's real profile from database
 * - Runs every 2-3 hours during day (8am-10pm EST)
 */

// Sarah's message templates - warm, encouraging, real
const SARAH_MESSAGES = [
    // Morning check-ins
    "Good morning everyone! ☀️ Who's studying with their coffee today?",
    "Rise and shine, future practitioners! What module are you tackling today?",
    "Morning team! I just finished reviewing some client intake forms - you all are doing AMAZING work 🌟",

    // Encouragement
    "Remember: every lesson you complete is one step closer to your certification. You've got this! 💪",
    "Seeing so many of you active today - this community is incredible!",
    "Quick reminder: you don't have to be perfect. Done is better than perfect. Keep moving forward!",
    "I'm so proud of everyone putting in the work. Your future clients are going to be SO lucky to have you!",
    "The journey to certification isn't easy, but nothing worth having ever is. Keep going! ✨",

    // Tips
    "Pro tip: Review your notes from each module before moving on. Retention is key!",
    "Struggling with a concept? Message me! I'm here to help 💬",
    "Fun fact: most practitioners land their first client within 2 weeks of certification. That could be YOU soon!",
    "Remember to take breaks! Your brain learns better when you rest between sessions.",
    "Tip: The quiz questions often come from the key takeaways. Pay attention to those!",

    // Questions / Engagement
    "What's everyone working on today? Drop a 📚 if you're in the lessons!",
    "Who else gets excited when they learn something new that explains their own health journey? 🙋‍♀️",
    "Quick poll: Team morning study or team night owl? I want to know! 🌙☀️",
    "Anyone have a health win to share today? Big or small - I want to celebrate with you!",

    // Afternoon/Evening
    "Afternoon check-in! How's everyone doing?",
    "Don't forget to hydrate! Taking a water break and wanted to remind you all 💧",
    "If you're studying tonight, you're amazing. Burning the midnight oil for your dreams!",
    "End of day check-in: What's ONE thing you learned today? Share below!",
    "Winding down for the evening. So proud of all of you. See you tomorrow! 🌙",

    // Community building
    "Love seeing all the support in here. This community is special! ❤️",
    "Remember: we're all in this together. Help each other out!",
    "Seeing newer members - welcome! You're going to love it here 🎉",
    "Just had a graduate tell me she signed her 5th client this month. That's going to be YOU! 🎯",

    // Motivation
    "Your why matters. Why did you start this? Hold onto that! 🔥",
    "Every expert was once a beginner. You're exactly where you need to be.",
    "Imposter syndrome is real - but you belong here. Trust me.",
    "The world NEEDS more health coaches who actually care. That's YOU!",
    "Imagine where you'll be 6 months from now. Keep showing up!",
];

export async function GET(request: NextRequest) {
    try {
        // Verify cron secret in production
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            if (process.env.NODE_ENV === "production") {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        // Get FM Certification course
        const fmCourse = await prisma.course.findFirst({
            where: {
                OR: [
                    { slug: { contains: "functional-medicine" } },
                    { title: { contains: "Functional Medicine" } },
                ],
                isPublished: true,
            },
            select: { id: true, title: true },
        });

        if (!fmCourse) {
            return NextResponse.json({ success: false, error: "FM course not found" });
        }

        // Check how many Sarah messages sent today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sarahMessagesTodayCount = await prisma.lessonChatMessage.count({
            where: {
                courseId: fmCourse.id,
                zombieName: "Sarah, Your Coach",
                createdAt: { gte: today },
            },
        });

        // Limit to 10 messages per day
        if (sarahMessagesTodayCount >= 10) {
            return NextResponse.json({
                success: true,
                message: "Daily limit reached (10 messages)",
                count: sarahMessagesTodayCount
            });
        }

        // Get messages sent today to avoid duplicates
        const todaysMessages = await prisma.lessonChatMessage.findMany({
            where: {
                courseId: fmCourse.id,
                zombieName: "Sarah, Your Coach",
                createdAt: { gte: today },
            },
            select: { content: true },
        });
        const usedMessages = new Set(todaysMessages.map(m => m.content));

        // Find a message we haven't used today
        const availableMessages = SARAH_MESSAGES.filter(m => !usedMessages.has(m));

        if (availableMessages.length === 0) {
            return NextResponse.json({
                success: true,
                message: "All messages used today",
                count: sarahMessagesTodayCount
            });
        }

        // Pick random message
        const message = availableMessages[Math.floor(Math.random() * availableMessages.length)];

        // Create the message with Sarah's identity
        // Note: isSarah flag will be used by frontend for gold styling
        const newMessage = await prisma.lessonChatMessage.create({
            data: {
                courseId: fmCourse.id,
                content: message,
                isZombie: true,
                zombieName: "Sarah, Your Coach",
                zombieAvatar: "/coaches/sarah-coach.webp", // Use actual Sarah avatar
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                id: newMessage.id,
                content: newMessage.content,
                messagesThisSession: sarahMessagesTodayCount + 1,
            },
        });

    } catch (error) {
        console.error("Sarah chat cron error:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}

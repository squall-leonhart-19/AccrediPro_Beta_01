import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * Cron API to inject zombie messages into FM course chat
 * Uses templates from ZombieChatTemplate table and real zombie profiles
 * 
 * Features:
 * - Pulls random template from 500+ in database
 * - Uses real zombie profile from 328 in database  
 * - Avoids duplicates within 24 hours
 * - Only targets FM certification course
 */
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

        // Get FM Certification course (the one we're scaling)
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

        // Get random active template that hasn't been used in 24h
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Get messages sent in last 24h to avoid duplicates
        const recentMessages = await prisma.lessonChatMessage.findMany({
            where: {
                courseId: fmCourse.id,
                isZombie: true,
                createdAt: { gte: twentyFourHoursAgo },
            },
            select: { content: true },
        });
        const recentContents = new Set(recentMessages.map(m => m.content));

        // Get random template that's not in recent
        const templateCount = await prisma.zombieChatTemplate.count({
            where: { isActive: true },
        });

        if (templateCount === 0) {
            return NextResponse.json({ success: false, error: "No templates found" });
        }

        // Try up to 10 times to find a non-duplicate
        let template = null;
        for (let i = 0; i < 10; i++) {
            const randomSkip = Math.floor(Math.random() * templateCount);
            const candidate = await prisma.zombieChatTemplate.findFirst({
                where: { isActive: true },
                skip: randomSkip,
            });

            if (candidate && !recentContents.has(candidate.content)) {
                template = candidate;
                break;
            }
        }

        if (!template) {
            // Fallback: just use any template
            const randomSkip = Math.floor(Math.random() * templateCount);
            template = await prisma.zombieChatTemplate.findFirst({
                where: { isActive: true },
                skip: randomSkip,
            });
        }

        if (!template) {
            return NextResponse.json({ success: false, error: "No template available" });
        }

        // Get random zombie profile
        const zombieCount = await prisma.user.count({
            where: { isFakeProfile: true },
        });

        if (zombieCount === 0) {
            return NextResponse.json({ success: false, error: "No zombie profiles" });
        }

        const zombieSkip = Math.floor(Math.random() * zombieCount);
        const zombie = await prisma.user.findFirst({
            where: { isFakeProfile: true },
            skip: zombieSkip,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
            },
        });

        if (!zombie) {
            return NextResponse.json({ success: false, error: "Zombie not found" });
        }

        // Create zombie name (First + Last Initial)
        const zombieName = `${zombie.firstName || "Student"} ${(zombie.lastName || "S")[0]}.`;

        // Create the message
        const message = await prisma.lessonChatMessage.create({
            data: {
                courseId: fmCourse.id,
                userId: zombie.id,
                content: template.content,
                isZombie: true,
                zombieName,
                zombieAvatar: zombie.avatar,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                courseId: fmCourse.id,
                courseName: fmCourse.title,
                messageId: message.id,
                content: template.content,
                category: template.category,
                zombieName,
                templateId: template.id,
            },
        });
    } catch (error) {
        console.error("Zombie chat cron error:", error);
        return NextResponse.json(
            { success: false, error: "Cron failed" },
            { status: 500 }
        );
    }
}

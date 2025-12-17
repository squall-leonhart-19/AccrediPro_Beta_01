import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/seed-announcements
 * 
 * Creates SHORT pinned announcements for community categories.
 * These explain what to do in each category - NOT actual posts.
 * NOTE: "introductions" and "coaching-tips" posts are NOT announcements.
 */
export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Get Sarah's ID
        const sarah = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: "sarah@accredipro-certificate.com" },
                    { email: "coach@accredipro-certificate.com" },
                ],
            },
            select: { id: true },
        });

        if (!sarah) {
            return NextResponse.json({ error: "Sarah coach not found" }, { status: 404 });
        }

        /**
         * SHORT Category announcements
         * These are pinned explanations of what to do in each category
         * NOT: introductions (keep as post with comments)
         * NOT: coaching-tips individual tips (those are regular posts)
         */
        const announcements = [
            {
                id: "announcement-wins",
                categoryId: "wins",
                title: "🏆 Share Your Wins & Celebrate Together! 🎉",
                content: `<p>This is your space to celebrate every win—big or small. Whether it's a client success, a course milestone, a personal breakthrough, or simply showing up on a hard day, your progress matters. Share your wins here and let the community celebrate you 💚</p>`,
                reactions: { "❤️": 156, "🔥": 89, "👏": 124, "🎉": 203, "💯": 67 },
            },
            {
                id: "announcement-graduates",
                categoryId: "graduates",
                title: "🎓 Welcome New Graduates! 🎉",
                content: `<p>Congratulations on your achievement! This is your moment to celebrate and share your graduation story. Tell us about your journey, what this certification means to you, and what's next. We're so proud of every single one of you! 💪</p>`,
                reactions: { "❤️": 234, "🎉": 312, "👏": 187, "🔥": 95, "💯": 76 },
            },
            {
                id: "announcement-questions-everyone-has",
                categoryId: "questions-everyone-has",
                title: "❓ Questions Everyone Has",
                content: `<p>You're not alone! This is a safe space for the questions you might be afraid to ask. Whether it's about starting your practice, time management, investment, or imposter syndrome—if you're wondering about it, others are too. Browse existing threads or create a new post 🙋‍♀️</p>`,
                reactions: { "❤️": 189, "💡": 145, "👏": 78, "🙌": 92, "💯": 56 },
            },
            {
                id: "announcement-career-pathway",
                categoryId: "career-pathway",
                title: "🚀 Career Pathway & Next Steps",
                content: `<p>Your journey to a thriving practice starts here! Share your career transition stories, ask about income potential, discuss niche specializations, or get inspired by others scaling their practices. Dream big—you've got this! 💪</p>`,
                reactions: { "❤️": 167, "🔥": 134, "🚀": 189, "💯": 89, "👏": 112 },
            },
            {
                id: "announcement-coaching-tips",
                categoryId: "coaching-tips",
                title: "💡 Coaching Tips & Pro Insights",
                content: `<p>Learn from experienced practitioners! This is where Sarah and our community share real-world strategies, client session tips, communication scripts, and mindset shifts for success. Take notes! 📝</p>`,
                reactions: { "❤️": 245, "💡": 198, "🔥": 156, "💯": 123, "👏": 178 },
            },
        ];

        const results = {
            created: [] as string[],
            updated: [] as string[],
            errors: [] as string[],
        };

        for (const announcement of announcements) {
            try {
                await prisma.communityPost.upsert({
                    where: { id: announcement.id },
                    update: {
                        title: announcement.title,
                        content: announcement.content,
                        reactions: announcement.reactions,
                        isPinned: true,
                        likeCount: Object.values(announcement.reactions).reduce((a, b) => a + b, 0),
                    },
                    create: {
                        id: announcement.id,
                        title: announcement.title,
                        content: announcement.content,
                        authorId: sarah.id,
                        categoryId: announcement.categoryId,
                        isPinned: true,
                        reactions: announcement.reactions,
                        likeCount: Object.values(announcement.reactions).reduce((a, b) => a + b, 0),
                        viewCount: Math.floor(Math.random() * 500) + 200,
                    },
                });
                results.created.push(announcement.id);
            } catch (e) {
                results.errors.push(`${announcement.id}: ${e}`);
            }
        }

        // Unpin any old pinned posts that aren't our new announcements
        const announcementIds = announcements.map(a => a.id);
        const unpinnedOthers = await prisma.communityPost.updateMany({
            where: {
                isPinned: true,
                id: { notIn: announcementIds },
            },
            data: { isPinned: false },
        });

        return NextResponse.json({
            success: true,
            message: "Announcements seeded successfully",
            results,
            unpinnedOthers: unpinnedOthers.count,
        });

    } catch (error) {
        console.error("Error seeding announcements:", error);
        return NextResponse.json(
            { error: "Failed to seed announcements" },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/seed-announcements
 * Delete or unpin a specific post by ID
 */
export async function DELETE(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { postId, action = "unpin" } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "postId required" }, { status: 400 });
        }

        if (action === "delete") {
            await prisma.communityPost.delete({
                where: { id: postId },
            });
            return NextResponse.json({ success: true, message: `Post ${postId} deleted` });
        } else {
            await prisma.communityPost.update({
                where: { id: postId },
                data: { isPinned: false },
            });
            return NextResponse.json({ success: true, message: `Post ${postId} unpinned` });
        }

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to process request" },
            { status: 500 }
        );
    }
}

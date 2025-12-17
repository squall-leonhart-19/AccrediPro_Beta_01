import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/seed-announcements
 * 
 * Creates SHORT pinned announcements for community categories.
 * 2-3 lines MAXIMUM per announcement.
 * 
 * NOT announcements (these are regular posts):
 * - "Introduce Yourself" pinned post (already exists with comments)
 * - Coaching Tips actual tip posts (1,2,3 etc.)
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
         * SHORT Announcements - 2-3 lines MAX
         * These explain what to do in each category
         */
        const announcements = [
            {
                id: "announcement-wins",
                categoryId: "wins",
                title: "🏆 Share Your Wins & Celebrate Together! 🎉",
                content: `This is your space to celebrate every win—big or small. Whether it's a client success, a course milestone, a personal breakthrough, or simply showing up on a hard day, your progress matters. Share your wins here and let the community celebrate you 💚`,
                reactions: { "❤️": 156, "🔥": 89, "👏": 124, "🎉": 203, "💯": 67 },
            },
            {
                id: "announcement-graduates",
                categoryId: "graduates",
                title: "🎓 Welcome New Graduates! 🎉",
                content: `Congratulations on your achievement! Share your graduation story here—tell us about your journey, what this certification means to you, and what's next. We're so proud of you! 💪`,
                reactions: { "❤️": 234, "🎉": 312, "👏": 187, "🔥": 95, "💯": 76 },
            },
            {
                id: "announcement-questions-everyone-has",
                categoryId: "questions-everyone-has",
                title: "❓ Questions Everyone Has",
                content: `You're not alone! Ask the questions you might be afraid to ask—about starting your practice, investment, time management, or imposter syndrome. If you're wondering, others are too! 🙋‍♀️`,
                reactions: { "❤️": 189, "💡": 145, "👏": 78, "🙌": 92, "💯": 56 },
            },
            {
                id: "announcement-career-pathway",
                categoryId: "career-pathway",
                title: "🚀 Career Pathway & Next Steps",
                content: `Share your career transition stories, discuss income potential, explore niche specializations, or get inspired by others scaling their practices. Dream big—you've got this! 💪`,
                reactions: { "❤️": 167, "🔥": 134, "🚀": 189, "💯": 89, "👏": 112 },
            },
            {
                id: "announcement-coaching-tips",
                categoryId: "coaching-tips",
                title: "💡 Coaching Tips & Pro Insights",
                content: `Learn from experienced practitioners! Sarah and our community share real-world strategies, client tips, and mindset shifts for success. Browse the tips below and take notes! 📝`,
                reactions: { "❤️": 245, "💡": 198, "🔥": 156, "💯": 123, "👏": 178 },
            },
        ];

        const results = {
            created: [] as string[],
            updated: [] as string[],
            errors: [] as string[],
        };

        // Create/update announcements
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

        // DO NOT unpin existing posts like "Introduce Yourself" or coaching tips!
        // Only our announcement IDs should be managed here

        return NextResponse.json({
            success: true,
            message: "Announcements seeded successfully",
            note: "Existing pinned posts (Introduce Yourself, etc.) are NOT touched",
            results,
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

/**
 * PUT /api/seed-announcements
 * Re-pin a specific post by ID (to restore "Introduce Yourself")
 */
export async function PUT(request: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: "postId required" }, { status: 400 });
        }

        await prisma.communityPost.update({
            where: { id: postId },
            data: { isPinned: true },
        });

        return NextResponse.json({ success: true, message: `Post ${postId} re-pinned` });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: "Failed to re-pin post" },
            { status: 500 }
        );
    }
}

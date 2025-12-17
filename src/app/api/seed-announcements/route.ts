import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/seed-announcements
 * 
 * Creates pinned announcements for community categories.
 * Must be run by an admin.
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
         * Category announcements content
         * These are pinned announcements that appear at the top of each category
         * They have reactions but no comments (announcement style)
         */
        const announcements = [
            {
                id: "announcement-wins",
                categoryId: "wins",
                title: "🏆 Share Your Wins & Celebrate Together!",
                content: `<p>This is your celebration space! 🎉</p>
<p>Every win matters — big or small. Whether you just landed your first client, completed a challenging module, received amazing feedback from a patient, or simply showed up today when it was hard...</p>
<p><strong>WE WANT TO CELEBRATE WITH YOU!</strong></p>
<p>Create your own post to share:</p>
<ul>
<li>🌟 Client success stories</li>
<li>💪 Personal breakthroughs</li>
<li>📚 Course milestones</li>
<li>🎯 Goals achieved</li>
<li>✨ Anything that made you proud!</li>
</ul>
<p>Remember: Your wins inspire others. When you share your success, you give someone else permission to dream bigger.</p>
<p>Go ahead — create a post and let us celebrate YOU! 🥳</p>
<p><em>Sarah M. 💕</em></p>`,
                reactions: { "❤️": 156, "🔥": 89, "👏": 124, "🎉": 203, "💯": 67 },
            },
            {
                id: "announcement-graduates",
                categoryId: "graduates",
                title: "🎓 Welcome New Graduates!",
                content: `<p>Congratulations on your achievement! 🎉</p>
<p>You've worked hard, shown up consistently, and earned your place here. This is YOUR moment!</p>
<p>This space is dedicated to celebrating our newest certified practitioners. Share your graduation story with us:</p>
<ul>
<li>🎓 Your certification journey</li>
<li>🌟 What this means to you</li>
<li>💪 How you're feeling right now</li>
<li>🚀 Your next steps</li>
</ul>
<p>We're so proud of every single one of you. Your diploma represents not just knowledge, but dedication to helping others transform their health.</p>
<p>Welcome to the family of certified practitioners! 🏆</p>
<p><em>Sarah M. 💕</em></p>`,
                reactions: { "❤️": 234, "🎉": 312, "👏": 187, "🔥": 95, "💯": 76 },
            },
            {
                id: "announcement-questions-everyone-has",
                categoryId: "questions-everyone-has",
                title: "❓ Questions Everyone Has",
                content: `<p>You're not alone in your questions! 💡</p>
<p>This is a safe space for the questions you might be afraid to ask. Trust us — if you're wondering about it, dozens of others are too.</p>
<p>Common topics discussed here:</p>
<ul>
<li>🤔 Starting your practice journey</li>
<li>💰 Investment and payment considerations</li>
<li>⏰ Time management and balance</li>
<li>😰 Imposter syndrome and fears</li>
<li>📋 What to expect from the certification</li>
</ul>
<p>Browse existing threads — your answer might already be here! Or create a new post if you don't see your question addressed.</p>
<p>There are no silly questions here. Ask away! 🙋‍♀️</p>
<p><em>Sarah M. 💕</em></p>`,
                reactions: { "❤️": 189, "💡": 145, "👏": 78, "🙌": 92, "💯": 56 },
            },
            {
                id: "announcement-career-pathway",
                categoryId: "career-pathway",
                title: "🚀 Career Pathway & Next Steps",
                content: `<p>Your journey to a thriving practice starts here! 🌟</p>
<p>This category is all about your future — the vision you're building, the life you're creating, and how this certification gets you there.</p>
<p>Topics you'll find here:</p>
<ul>
<li>💼 Career transition stories</li>
<li>💵 Income and business growth</li>
<li>🎯 Niche specialization ideas</li>
<li>📈 Scaling your practice</li>
<li>🌍 Working with clients worldwide</li>
</ul>
<p>Whether you're dreaming about your first client or planning your 6-figure practice, you'll find inspiration and guidance here.</p>
<p>Dream big. You've got this! 💪</p>
<p><em>Sarah M. 💕</em></p>`,
                reactions: { "❤️": 167, "🔥": 134, "🚀": 189, "💯": 89, "👏": 112 },
            },
            {
                id: "announcement-coaching-tips",
                categoryId: "coaching-tips",
                title: "💡 Coaching Tips & Pro Insights",
                content: `<p>Learn from the best! 🌟</p>
<p>This is where Sarah and our community of experienced practitioners share wisdom, strategies, and insider tips that you won't find anywhere else.</p>
<p>What you'll discover here:</p>
<ul>
<li>📋 Client session strategies</li>
<li>💬 Communication scripts that work</li>
<li>🧠 Mindset shifts for success</li>
<li>⚡ Quick wins you can implement today</li>
<li>🎯 Advanced practitioner techniques</li>
</ul>
<p>These tips come from real experience working with thousands of clients. Take notes! 📝</p>
<p><em>Sarah M. 💕</em></p>`,
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
                // Upsert the announcement
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

        // Optionally: Unpin any old pinned posts that aren't our new announcements
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
 * 
 * Delete a specific post by ID (or unpin it)
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

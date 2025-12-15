
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // 1. Upsert the Pinned Post (Migrate from hardcoded to DB)
        const pinnedPost = await prisma.communityPost.upsert({
            where: { id: "pinned-introductions" },
            update: {}, // No update if exists
            create: {
                id: "pinned-introductions",
                title: "👋 Welcome! Tell Us About Your Journey",
                content: `<p>Hey there, and welcome to our incredible community! 🌟</p>
<p>I'm Sarah, one of your lead coaches here at AccrediPro. Before I became a mentor, I was exactly where you are now – nervous, excited, and wondering if I could really do this.</p>
<p><strong>Spoiler alert: You absolutely can. And we're here to help you every step of the way.</strong></p>
<p>This is YOUR space to connect with fellow practitioners who truly <em>get it</em>. Whether you're a nurse who's burned out on sick care, a career changer following your passion, or someone who discovered functional medicine through your own health journey – you belong here.</p>
<p><strong>I'd love to hear from you! Drop a comment below sharing:</strong></p>
<ul>
  <li>🏠 Where you're joining us from</li>
  <li>💼 A little about your background</li>
  <li>💡 Your "aha moment" – what made you say "this is what I need to do"</li>
  <li>🎯 What does success look like for you in 12 months?</li>
  <li>🎸 Something fun about you (favorite hobby, hidden talent, etc!)</li>
</ul>
<p>I personally read every introduction and will do my best to welcome each of you. This is the beginning of something amazing.</p>
<p>Let's do this together! 💪</p>
<p>With excitement,<br/><em>Sarah</em></p>`,
                isPinned: true,
                viewCount: 8988,
                likeCount: 2090,
                categoryId: "introductions",
                authorId: "coach-sarah", // Ensure this user exists or is handled
            }
        });

        // 2. Create the Test User (Leonora)
        const user = await prisma.user.create({
            data: {
                firstName: "Leonora",
                lastName: "McClelland Sandridge",
                email: "leonora.test@example.com", // Fake email for social proof
                avatar: "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg", // From CSV row 2
                role: "STUDENT",
                isFakeProfile: true, // Mark as social proof profile
                bio: "Health Coach helping people heal themselves.",
            }
        });

        // 3. Create the Comment
        const comment = await prisma.postComment.create({
            data: {
                content: "I want to help people learn how to heal themselves. As a health coach I can help people understand proper nutrition practices and health protocols to ensure a healthy lifestyle.",
                postId: "pinned-introductions",
                authorId: user.id,
                likeCount: 4, // Start with some likes for realism
            }
        });

        return NextResponse.json({
            message: "Seed execution complete",
            post: pinnedPost,
            user: user,
            comment: comment
        });

    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}

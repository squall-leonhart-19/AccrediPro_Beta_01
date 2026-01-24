import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST /api/community/share-win
// Share a module/course completion as a community post (triggered from celebration modal)
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { moduleName, courseName, isCoursComplete } = await request.json();

        if (!moduleName && !courseName) {
            return NextResponse.json({ error: "Module or course name required" }, { status: 400 });
        }

        // Get user info for the post
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true, lastName: true },
        });

        const firstName = user?.firstName || "Someone";
        const achievementName = courseName || moduleName;
        const achievementType = isCoursComplete ? "course" : "module";

        // Build the celebration post
        const title = `🎉 ${firstName} just completed ${achievementName}!`;
        const content = isCoursComplete
            ? `I just completed the **${achievementName}** course and earned my certificate! 🏆\n\nFeeling proud of this milestone. If you're still working through it, keep going - you've got this!`
            : `I just finished **${achievementName}**! 📚\n\nAnother step closer to my certification. Anyone else working through this right now?`;

        // Find or create a "Wins" community category
        let winsCommunity = await prisma.categoryCommunity.findFirst({
            where: {
                OR: [
                    { slug: "wins" },
                    { slug: "wins-and-graduates" },
                    { name: { contains: "Win", mode: "insensitive" } },
                ],
            },
        });

        // If no wins category, just post without communityId (general community)
        const communityId = winsCommunity?.id || null;

        // Create the community post
        const post = await prisma.communityPost.create({
            data: {
                title,
                content,
                authorId: session.user.id,
                communityId,
                categoryId: "wins", // Legacy category field
            },
        });

        return NextResponse.json({
            success: true,
            postId: post.id,
            message: "Your win has been shared with the community!",
        });
    } catch (error) {
        console.error("Failed to share win:", error);
        return NextResponse.json(
            { error: "Failed to share", details: error instanceof Error ? error.message : "Unknown" },
            { status: 500 }
        );
    }
}

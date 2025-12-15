
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch all ebook progress for the user
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find all tags starting with "progress:ebook:"
        const tags = await prisma.userTag.findMany({
            where: {
                userId: session.user.id,
                tag: {
                    startsWith: "progress:ebook:"
                }
            }
        });

        // Transform into ReadingProgress shape: { [ebookId]: { ... } }
        const progressMap: Record<string, any> = {};

        tags.forEach(t => {
            const ebookId = t.tag.replace("progress:ebook:", "");
            if (t.metadata) {
                progressMap[ebookId] = t.metadata;
            }
        });

        return NextResponse.json({
            success: true,
            progress: progressMap
        });

    } catch (error) {
        console.error("Error fetching library progress:", error);
        return NextResponse.json(
            { error: "Failed to fetch progress" },
            { status: 500 }
        );
    }
}

// POST - Save progress for a specific ebook
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { ebookId, progress } = await request.json();

        if (!ebookId || !progress || typeof progress !== 'object') {
            return NextResponse.json({ error: "Missing or invalid required fields" }, { status: 400 });
        }

        // Validate progress structure
        if (!Array.isArray(progress.completedChapters)) {
            return NextResponse.json({ error: "Invalid progress format: completedChapters must be an array" }, { status: 400 });
        }

        const tagName = `progress:ebook:${ebookId}`;

        // Upsert the tag with new metadata
        // Check if exists first because UserTag has unique constraint on userId+tag
        // Actually upsert is cleaner
        await prisma.userTag.upsert({
            where: {
                userId_tag: {
                    userId: session.user.id,
                    tag: tagName
                }
            },
            update: {
                metadata: progress as any, // Cast to any for Json type
                value: "in-progress"
            },
            create: {
                userId: session.user.id,
                tag: tagName,
                value: "in-progress",
                metadata: progress as any
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Error saving library progress:", error);
        return NextResponse.json(
            { error: "Failed to save progress" },
            { status: 500 }
        );
    }
}

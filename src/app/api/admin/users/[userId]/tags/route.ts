import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper for route params
type RouteParams = { params: Promise<{ userId: string }> };

// POST - Add a tag to a user
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await params;
        const body = await request.json();
        const { tag } = body; // Tag slug/name

        if (!tag) {
            return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
        }

        const slug = tag.toLowerCase().replace(/[^a-z0-9-_]/g, "_");

        // 1. Find or create the MarketingTag definition
        let marketingTag = await prisma.marketingTag.findUnique({
            where: { slug }
        });

        if (!marketingTag) {
            marketingTag = await prisma.marketingTag.create({
                data: {
                    name: tag,
                    slug: slug,
                    category: "CUSTOM",
                    description: "Created manually via Admin Support"
                }
            });
        }

        // 2. Check if user already has it assigned
        const existingAssignment = await prisma.userMarketingTag.findUnique({
            where: {
                userId_tagId: {
                    userId,
                    tagId: marketingTag.id
                }
            }
        });

        if (existingAssignment) {
            return NextResponse.json({ message: "Tag already assigned", assignment: existingAssignment });
        }

        // 3. Assign to user
        const assignment = await prisma.userMarketingTag.create({
            data: {
                userId,
                tagId: marketingTag.id,
                source: "admin_manual"
            },
            include: {
                tag: true
            }
        });

        return NextResponse.json({ assignment });
    } catch (error) {
        console.error("Failed to add tag:", error);
        return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
    }
}

// DELETE - Remove a tag
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await params;
        const body = await request.json();
        const { tag } = body; // Tag slug

        if (!tag) {
            return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
        }

        // Find the tag definition first
        const marketingTag = await prisma.marketingTag.findFirst({
            where: { OR: [{ slug: tag }, { name: tag }] }
        });

        if (!marketingTag) {
            return NextResponse.json({ error: "Tag definition not found" }, { status: 404 });
        }

        await prisma.userMarketingTag.deleteMany({
            where: {
                userId,
                tagId: marketingTag.id
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove tag:", error);
        return NextResponse.json({ error: "Failed to remove tag" }, { status: 500 });
    }
}

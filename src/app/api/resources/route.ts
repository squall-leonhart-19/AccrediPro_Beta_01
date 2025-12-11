import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List all resources
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const resources = await prisma.resource.findMany({
            where: {
                isActive: true,
                ...(category ? { category: category as any } : {}),
            },
            include: {
                files: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: resources,
        });
    } catch (error) {
        console.error("Get resources error:", error);
        return NextResponse.json({ error: "Failed to get resources" }, { status: 500 });
    }
}

// POST: Track download (increment download count)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { resourceId } = await req.json();

        if (!resourceId) {
            return NextResponse.json({ error: "Missing resourceId" }, { status: 400 });
        }

        await prisma.resource.update({
            where: { id: resourceId },
            data: {
                downloadCount: { increment: 1 },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Track download error:", error);
        return NextResponse.json({ error: "Failed to track download" }, { status: 500 });
    }
}

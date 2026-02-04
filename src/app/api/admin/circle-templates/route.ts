import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/circle-templates
 * Get all circle message templates
 */
export async function GET() {
    // Auth temporarily disabled for testing
    try {
        const templates = await prisma.masterclassTemplate.findMany({
            orderBy: [{ nicheCategory: "asc" }, { dayNumber: "asc" }],
        });

        return NextResponse.json({ templates });
    } catch (error) {
        console.error("[ADMIN] Templates error:", error);
        return NextResponse.json(
            { error: "Failed to fetch templates", details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * POST /api/admin/circle-templates
 * Create or update a template
 */
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { nicheCategory, dayNumber, sarahMessage, zombieMessages, gapTopic, sarahAudioUrl } = body;

        if (!nicheCategory || !dayNumber || !sarahMessage) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const template = await prisma.masterclassTemplate.upsert({
            where: {
                nicheCategory_dayNumber: { nicheCategory, dayNumber },
            },
            update: {
                sarahMessage,
                zombieMessages: zombieMessages || [],
                gapTopic,
                sarahAudioUrl,
            },
            create: {
                nicheCategory,
                dayNumber,
                sarahMessage,
                zombieMessages: zombieMessages || [],
                gapTopic,
                sarahAudioUrl,
                lessonTitle: `Day ${dayNumber}`,
            },
        });

        return NextResponse.json({ success: true, template });
    } catch (error) {
        console.error("[ADMIN] Template update error:", error);
        return NextResponse.json(
            { error: "Failed to update template", details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/admin/circle-templates
 * Delete a template
 */
export async function DELETE(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Missing template id" }, { status: 400 });
        }

        await prisma.masterclassTemplate.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("[ADMIN] Template delete error:", error);
        return NextResponse.json(
            { error: "Failed to delete template", details: String(error) },
            { status: 500 }
        );
    }
}

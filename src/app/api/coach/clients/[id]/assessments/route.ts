import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Add assessment score
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { type, score, notes } = await req.json();

        // Verify client belongs to coach
        const client = await prisma.client.findFirst({
            where: { id, coachId: session.user.id },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        // Get existing assessments
        const existingAssessments = (client.assessments as any[]) || [];

        // Add new assessment
        const newAssessment = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            type,
            score,
            notes,
        };

        const updated = await prisma.client.update({
            where: { id },
            data: {
                assessments: [...existingAssessments, newAssessment],
            },
        });

        return NextResponse.json({
            success: true,
            data: newAssessment,
        });
    } catch (error) {
        console.error("Add assessment error:", error);
        return NextResponse.json({ error: "Failed to add assessment" }, { status: 500 });
    }
}

// GET: Get assessment history
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const client = await prisma.client.findFirst({
            where: { id, coachId: session.user.id },
            select: { assessments: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: client.assessments || [],
        });
    } catch (error) {
        console.error("Get assessments error:", error);
        return NextResponse.json({ error: "Failed to get assessments" }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT: Update client notes
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const { notes } = await req.json();

        // Verify client belongs to coach
        const existing = await prisma.client.findFirst({
            where: { id, coachId: session.user.id },
        });

        if (!existing) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        await prisma.client.update({
            where: { id },
            data: { notes },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update notes error:", error);
        return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
    }
}

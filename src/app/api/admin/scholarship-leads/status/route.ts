import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/scholarship-leads/status
 *
 * Updates a lead's scholarship_status tag.
 * Body: { userId: string, status: "pending" | "approved" | "converted" | "lost" }
 */
export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, status } = await req.json();

    if (!userId || !status) {
        return NextResponse.json({ error: "userId and status required" }, { status: 400 });
    }

    const validStatuses = ["pending", "approved", "converted", "lost"];
    if (!validStatuses.includes(status)) {
        return NextResponse.json({ error: `Invalid status. Must be: ${validStatuses.join(", ")}` }, { status: 400 });
    }

    await prisma.userTag.upsert({
        where: { userId_tag: { userId, tag: "scholarship_status" } },
        update: { value: status },
        create: { userId, tag: "scholarship_status", value: status },
    });

    // If marking as approved, also set the approved timestamp
    if (status === "approved") {
        await prisma.userTag.upsert({
            where: { userId_tag: { userId, tag: "scholarship_approved_at" } },
            update: { value: new Date().toISOString() },
            create: { userId, tag: "scholarship_approved_at", value: new Date().toISOString() },
        });
    }

    return NextResponse.json({ success: true, status });
}

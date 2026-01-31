import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET email history for a specific user
export async function GET(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await params;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "50");

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get email history for this user
        const emails = await prisma.emailSend.findMany({
            where: {
                OR: [
                    { userId: userId },
                    { toEmail: user.email },
                ]
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        // Get stats for this user
        const stats = {
            sent: emails.filter(e => e.status === "SENT").length,
            delivered: emails.filter(e => e.status === "DELIVERED").length,
            failed: emails.filter(e => e.status === "FAILED").length,
            bounced: emails.filter(e => e.status === "BOUNCED").length,
            total: emails.length,
        };

        return NextResponse.json({
            user,
            emails,
            stats,
        });
    } catch (error) {
        console.error("[User Email History] Error:", error);
        return NextResponse.json({ error: "Failed to fetch email history" }, { status: 500 });
    }
}

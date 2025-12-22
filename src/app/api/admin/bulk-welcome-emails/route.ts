import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

// Admin-only endpoint to send welcome emails to users with a specific tag
export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { tag, dryRun = true } = body;

        if (!tag) {
            return NextResponse.json({ error: "Tag required" }, { status: 400 });
        }

        // Get all users with this tag
        const userTags = await prisma.userTag.findMany({
            where: { tag },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                    }
                }
            }
        });

        const results: { email: string; status: string }[] = [];

        for (const ut of userTags) {
            if (!ut.user.email) continue;

            if (dryRun) {
                results.push({ email: ut.user.email, status: "would_send" });
            } else {
                try {
                    const result = await sendWelcomeEmail(ut.user.email, ut.user.firstName || "Student");
                    results.push({
                        email: ut.user.email,
                        status: result.success ? "sent" : "failed"
                    });
                } catch (err) {
                    results.push({ email: ut.user.email, status: "error" });
                }
            }
        }

        return NextResponse.json({
            success: true,
            tag,
            dryRun,
            total: results.length,
            sent: results.filter(r => r.status === "sent").length,
            results
        });

    } catch (error) {
        console.error("Bulk email error:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

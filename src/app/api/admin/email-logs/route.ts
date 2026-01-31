import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET all email sends with filters
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const email = searchParams.get("email");
        const provider = searchParams.get("provider");
        const emailType = searchParams.get("emailType");
        const fromDate = searchParams.get("fromDate");
        const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 10000);
        const offset = parseInt(searchParams.get("offset") || "0");

        // Build where clause
        const where: any = {};
        if (status && status !== "all") {
            where.status = status;
        }
        if (email) {
            where.toEmail = { contains: email, mode: "insensitive" };
        }
        if (provider && provider !== "all") {
            where.provider = provider;
        }
        if (emailType && emailType !== "all") {
            where.emailType = emailType;
        }
        if (fromDate) {
            where.createdAt = { gte: new Date(fromDate) };
        }

        const [emails, total] = await Promise.all([
            prisma.emailSend.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                take: limit,
                skip: offset,
            }),
            prisma.emailSend.count({ where }),
        ]);

        // Calculate stats (for all time, ignoring current filters for overview)
        const allEmails = await prisma.emailSend.groupBy({
            by: ["status"],
            _count: true,
        });

        const stats = {
            sent: allEmails.find(e => e.status === "SENT")?._count || 0,
            delivered: allEmails.find(e => e.status === "DELIVERED")?._count || 0,
            opened: allEmails.find(e => e.status === "OPENED")?._count || 0,
            failed: allEmails.find(e => e.status === "FAILED")?._count || 0,
            bounced: allEmails.find(e => e.status === "BOUNCED")?._count || 0,
            queued: allEmails.find(e => e.status === "QUEUED")?._count || 0,
            total: allEmails.reduce((sum, e) => sum + e._count, 0),
        };

        return NextResponse.json({
            emails,
            total,
            stats,
            pagination: {
                limit,
                offset,
                hasMore: offset + limit < total,
            }
        });
    } catch (error) {
        console.error("[Email Logs] Error:", error);
        return NextResponse.json({ error: "Failed to fetch email logs" }, { status: 500 });
    }
}

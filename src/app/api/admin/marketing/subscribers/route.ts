import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/admin/marketing/subscribers - Get list of subscribers for enrollment
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const limit = parseInt(searchParams.get("limit") || "50");
        const filter = searchParams.get("filter") || "all";

        // Build where clause - only include active, valid users
        // Excludes: bounced, complained, unsubscribed, and zombie profiles
        const whereClause: any = {
            role: "USER",
            email: { not: null },
            // Must have verified email (not zombie)
            emailVerified: { not: null },
            // Exclude users with suppression tags (bounced, complained, unsubscribed)
            marketingTags: {
                none: {
                    tag: {
                        slug: {
                            in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed"]
                        }
                    }
                }
            },
        };

        // Search by email or name
        if (search) {
            whereClause.OR = [
                { email: { contains: search, mode: "insensitive" } },
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
            ];
        }

        // Apply filter
        if (filter === "not-purchased") {
            whereClause.courseEnrollments = {
                none: { isPaid: true },
            };
        } else if (filter === "purchased") {
            whereClause.courseEnrollments = {
                some: { isPaid: true },
            };
        }

        const users = await prisma.user.findMany({
            where: whereClause,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                createdAt: true,
                marketingTags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                color: true,
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: limit,
        });

        // Get total count for the current filter
        const totalCount = await prisma.user.count({
            where: whereClause,
        });

        // Format the response
        const subscribers = users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email,
            firstName: user.firstName,
            avatar: user.avatar,
            createdAt: user.createdAt,
            tags: user.marketingTags.map(t => t.tag),
        }));

        return NextResponse.json({
            subscribers,
            total: totalCount,
            showing: subscribers.length,
        });
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
    }
}

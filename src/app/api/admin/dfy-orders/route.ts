import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET all DFY orders with filters
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER", "CUSTOMER_CARE"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status"); // PENDING, INTAKE_RECEIVED, IN_PROGRESS, DELIVERED
        const search = searchParams.get("search");

        // Build where clause
        const where: any = {};
        if (status && status !== "all") {
            where.fulfillmentStatus = status;
        }
        if (search) {
            where.OR = [
                { user: { email: { contains: search, mode: "insensitive" } } },
                { user: { firstName: { contains: search, mode: "insensitive" } } },
                { user: { lastName: { contains: search, mode: "insensitive" } } },
            ];
        }

        const orders = await prisma.dFYPurchase.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        avatar: true,
                        createdAt: true,
                    },
                },
                product: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Calculate stats
        const stats = {
            pending: orders.filter(o => o.fulfillmentStatus === "PENDING").length,
            intakeReceived: orders.filter(o => o.fulfillmentStatus === "INTAKE_RECEIVED").length,
            inProgress: orders.filter(o => o.fulfillmentStatus === "IN_PROGRESS").length,
            delivered: orders.filter(o => o.fulfillmentStatus === "DELIVERED").length,
            total: orders.length,
        };

        return NextResponse.json({ orders, stats });
    } catch (error) {
        console.error("[DFY Orders] Error:", error);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

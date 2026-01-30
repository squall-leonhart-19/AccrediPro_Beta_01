import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET export all DFY orders as CSV
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role || "")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const orders = await prisma.dFYPurchase.findMany({
            include: {
                user: {
                    select: {
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                product: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Define intake form fields to export
        const intakeFields = [
            "firstName", "lastName", "phone", "email",
            "coachingTitle", "certifications", "story",
            "idealClient", "programName", "programDetails", "price",
            "successStories", "differentiation", "concerns", "websiteFeel",
            "colors", "socialMedia", "howToStart", "schedulingTool",
            "websiteGoal", "anythingElse", "photoUrls"
        ];

        // Build CSV header
        const headers = [
            "Order ID",
            "Purchase Date",
            "Customer Email",
            "Customer First Name",
            "Customer Last Name",
            "Product",
            "Status",
            "Purchase Price",
            "Delivered At",
            "Notes",
            ...intakeFields.map(f => `Intake: ${f}`)
        ];

        // Build CSV rows
        const rows = orders.map(order => {
            const intake = (order.intakeData as Record<string, any>) || {};

            return [
                order.id,
                order.createdAt.toISOString(),
                order.user.email || "",
                order.user.firstName || "",
                order.user.lastName || "",
                order.product.title,
                order.fulfillmentStatus,
                order.purchasePrice.toString(),
                order.deliveredAt?.toISOString() || "",
                order.notes || "",
                ...intakeFields.map(field => {
                    const value = intake[field];
                    if (Array.isArray(value)) {
                        return value.join("; ");
                    }
                    return String(value || "");
                })
            ];
        });

        // Escape CSV values
        const escapeCSV = (val: string) => {
            if (val.includes(",") || val.includes('"') || val.includes("\n")) {
                return `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        };

        // Build CSV string
        const csv = [
            headers.map(escapeCSV).join(","),
            ...rows.map(row => row.map(escapeCSV).join(","))
        ].join("\n");

        // Return as downloadable file
        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="dfy-orders-${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });
    } catch (error) {
        console.error("[DFY Export] Error:", error);
        return NextResponse.json({ error: "Failed to export orders" }, { status: 500 });
    }
}

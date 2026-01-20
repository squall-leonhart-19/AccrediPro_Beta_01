import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createAuditLogger, AuditAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

// GET /api/admin/export/purchases - Export purchases to CSV
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        // Only ADMIN/SUPERUSER can export data
        if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "csv";
        const statusFilter = searchParams.get("status");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const days = searchParams.get("days");
        const range = searchParams.get("range");

        // Build where clause
        const where: Record<string, unknown> = {};

        if (statusFilter && statusFilter !== "ALL") {
            where.status = statusFilter;
        }

        // Handle days parameter (e.g., days=30)
        if (days) {
            const daysNum = parseInt(days);
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - daysNum);
            where.createdAt = { gte: startDate };
        }
        // Handle range parameter (e.g., range=7days, range=today)
        else if (range && range !== "all") {
            const now = new Date();
            let startDate: Date;

            switch (range) {
                case "today":
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                    break;
                case "yesterday":
                    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
                    where.createdAt = {
                        gte: startDate,
                        lt: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    };
                    break;
                case "7days":
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 7);
                    where.createdAt = { gte: startDate };
                    break;
                case "30days":
                    startDate = new Date();
                    startDate.setDate(startDate.getDate() - 30);
                    where.createdAt = { gte: startDate };
                    break;
                case "month":
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    where.createdAt = { gte: startDate };
                    break;
                default:
                    // No filter for "all" or unknown ranges
                    break;
            }

            if (range !== "yesterday" && range !== "all" && !where.createdAt) {
                where.createdAt = { gte: startDate! };
            }
        }
        // Handle explicit date range
        else if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
            if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo);
        }

        // Fetch purchases with related data
        const purchases = await prisma.payment.findMany({
            where,
            select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                productName: true,
                billingEmail: true,
                billingName: true,
                stripePaymentId: true,
                paymentMethod: true,
                ipAddress: true,
                createdAt: true,
                updatedAt: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
                course: {
                    select: {
                        title: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Log the export
        const audit = createAuditLogger(session as { user: { id: string; email?: string | null; role: string } });
        audit(AuditAction.DATA_EXPORT, "purchases", undefined, {
            count: purchases.length,
            format,
            filters: { statusFilter, dateFrom, dateTo, days, range },
        });

        // Calculate totals
        const totals = {
            count: purchases.length,
            totalRevenue: purchases
                .filter((p) => p.status === "COMPLETED")
                .reduce((sum, p) => sum + Number(p.amount), 0),
            refunds: purchases.filter((p) => p.status === "REFUNDED").length,
            disputes: purchases.filter((p) => ["DISPUTED", "CHARGEBACK"].includes(p.status)).length,
        };

        if (format === "json") {
            return NextResponse.json({ purchases, totals });
        }

        // Generate CSV
        const headers = [
            "ID",
            "Date",
            "Customer Email",
            "Customer Name",
            "Billing Email",
            "Billing Name",
            "Product",
            "Course",
            "Amount",
            "Currency",
            "Status",
            "Payment Method",
            "Stripe ID",
            "IP Address",
        ];

        const rows = purchases.map((purchase) => [
            purchase.id,
            purchase.createdAt.toISOString(),
            purchase.user?.email || "",
            purchase.user ? `${purchase.user.firstName || ""} ${purchase.user.lastName || ""}`.trim() : "",
            purchase.billingEmail || "",
            purchase.billingName || "",
            purchase.productName || "",
            purchase.course?.title || "",
            Number(purchase.amount).toFixed(2),
            purchase.currency || "USD",
            purchase.status,
            purchase.paymentMethod || "",
            purchase.stripePaymentId || "",
            purchase.ipAddress || "",
        ]);

        // Escape CSV values
        const escapeCSV = (value: string) => {
            if (value.includes(",") || value.includes('"') || value.includes("\n")) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        };

        // Add summary row
        const summaryRows = [
            "",
            ["SUMMARY"],
            [`Total Transactions: ${totals.count}`],
            [`Total Revenue: $${totals.totalRevenue.toFixed(2)}`],
            [`Refunds: ${totals.refunds}`],
            [`Disputes/Chargebacks: ${totals.disputes}`],
        ];

        const csv = [
            headers.join(","),
            ...rows.map((row) => row.map((cell) => escapeCSV(cell)).join(",")),
            ...summaryRows.map((row) => (Array.isArray(row) ? row.join(",") : row)),
        ].join("\n");

        const filename = `purchases-export-${new Date().toISOString().split("T")[0]}.csv`;

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="${filename}"`,
            },
        });
    } catch (error) {
        console.error("Error exporting purchases:", error);
        return NextResponse.json({ error: "Failed to export purchases" }, { status: 500 });
    }
}

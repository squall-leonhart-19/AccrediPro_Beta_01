import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PurchasesClient from "@/components/admin/purchases-client";

interface SearchParams {
    range?: string;
    search?: string;
}

// Alaska timezone (AKST = UTC-9) to match ClickFunnels
const ALASKA_TIMEZONE_OFFSET_HOURS = -9;

function getAlaskaNow(): Date {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utcTime + (3600000 * ALASKA_TIMEZONE_OFFSET_HOURS));
}

function getAlaskaStartOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Helper to determine filter date range in Alaska time
function getFilterDateRange(range: string): { start: Date; end: Date; label: string } {
    const alaskaNow = getAlaskaNow();
    const startOfToday = getAlaskaStartOfDay(alaskaNow);

    switch (range) {
        case "today":
            return {
                start: startOfToday,
                end: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000),
                label: "Today"
            };
        case "yesterday": {
            const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
            return {
                start: startOfYesterday,
                end: startOfToday,
                label: "Yesterday"
            };
        }
        case "7days":
            return {
                start: new Date(alaskaNow.getTime() - 7 * 24 * 60 * 60 * 1000),
                end: alaskaNow,
                label: "Last 7 Days"
            };
        case "30days":
            return {
                start: new Date(alaskaNow.getTime() - 30 * 24 * 60 * 60 * 1000),
                end: alaskaNow,
                label: "Last 30 Days"
            };
        case "month": {
            const startOfMonth = new Date(alaskaNow.getFullYear(), alaskaNow.getMonth(), 1);
            return {
                start: startOfMonth,
                end: alaskaNow,
                label: "This Month"
            };
        }
        case "all":
            return {
                start: new Date(2020, 0, 1), // Far past
                end: alaskaNow,
                label: "All Time"
            };
        default:
            return {
                start: new Date(alaskaNow.getTime() - 30 * 24 * 60 * 60 * 1000),
                end: alaskaNow,
                label: "Last 30 Days"
            };
    }
}

async function getPurchasesData(searchParams: SearchParams) {
    const alaskaNow = getAlaskaNow();
    const startOfToday = getAlaskaStartOfDay(alaskaNow);
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(alaskaNow.getFullYear(), alaskaNow.getMonth(), 1);

    // Get filter range
    const range = searchParams.range || "30days";
    const filterRange = getFilterDateRange(range);

    // 1. Get Revenue Stats - Dynamic based on filter
    const [periodRevenue, todayRevenue, allTimeRevenue] = await Promise.all([
        // Current period (matches filter)
        prisma.payment.aggregate({
            where: { createdAt: { gte: filterRange.start, lte: filterRange.end }, status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
        // Today (always show for quick reference)
        prisma.payment.aggregate({
            where: { createdAt: { gte: startOfToday }, status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
        // All time
        prisma.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
    ]);

    // 2. Get Filtered Purchases (For Table)
    const searchFilter = searchParams.search ? {
        OR: [
            { user: { email: { contains: searchParams.search, mode: "insensitive" as const } } },
            { user: { firstName: { contains: searchParams.search, mode: "insensitive" as const } } },
            { user: { lastName: { contains: searchParams.search, mode: "insensitive" as const } } },
            { billingEmail: { contains: searchParams.search, mode: "insensitive" as const } },
            { productName: { contains: searchParams.search, mode: "insensitive" as const } },
        ]
    } : {};

    const whereClause: any = {
        ...searchFilter,
        createdAt: { gte: filterRange.start, lte: filterRange.end },
    };

    const recentPurchases = await prisma.payment.findMany({
        where: whereClause,
        take: 100,
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: { id: true, email: true, firstName: true, lastName: true },
            },
            course: {
                select: { id: true, title: true, slug: true },
            },
        },
    });

    // 3. Get disputes/chargebacks count
    const disputeCount = await prisma.payment.count({
        where: { status: { in: ["DISPUTED", "CHARGEBACK"] } },
    });

    return {
        stats: {
            period: {
                revenue: Number(periodRevenue._sum.amount || 0),
                orders: periodRevenue._count,
                label: filterRange.label,
            },
            today: {
                revenue: Number(todayRevenue._sum.amount || 0),
                orders: todayRevenue._count,
            },
            total: {
                revenue: Number(allTimeRevenue._sum.amount || 0),
                orders: allTimeRevenue._count,
            },
            disputes: disputeCount,
        },
        recentPurchases: recentPurchases.map(p => ({
            ...p,
            amount: Number(p.amount)
        })),
        currentRange: range,
        timezone: "Alaska (AKST)",
    };
}

export default async function AdminPurchasesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
        redirect("/login");
    }

    const params = await searchParams;
    const data = await getPurchasesData(params);

    return <PurchasesClient stats={data.stats} purchases={data.recentPurchases} timezone={data.timezone} currentRange={data.currentRange} />;
}

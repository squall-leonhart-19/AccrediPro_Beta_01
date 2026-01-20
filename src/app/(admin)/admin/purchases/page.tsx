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
// All timestamps stored in DB are UTC. We need to convert Alaska time ranges to UTC for queries.

/**
 * Get current time in Alaska (as UTC timestamp)
 * Alaska is UTC-9, so when it's 3:00 AM in Alaska, it's 12:00 PM UTC
 */
function getAlaskaToUTC(alaskaDate: Date): Date {
    // Add 9 hours to convert Alaska time to UTC
    return new Date(alaskaDate.getTime() + (9 * 60 * 60 * 1000));
}

/**
 * Get start of today in Alaska time (as UTC timestamp for DB query)
 * Example: If it's Jan 7, 3:00 AM Alaska (= Jan 7, 12:00 PM UTC)
 * Start of today in Alaska = Jan 7, 00:00 Alaska = Jan 7, 09:00 UTC
 */
function getAlaskaStartOfTodayUTC(): Date {
    const now = new Date(); // Current UTC time
    // Get current hour in Alaska: UTC hour - 9
    const alaskaOffsetMs = -9 * 60 * 60 * 1000;
    const alaskaTime = new Date(now.getTime() + alaskaOffsetMs);

    // Get start of day in Alaska (midnight Alaska time)
    const alaskaMidnight = new Date(
        Date.UTC(
            alaskaTime.getUTCFullYear(),
            alaskaTime.getUTCMonth(),
            alaskaTime.getUTCDate(),
            0, 0, 0, 0
        )
    );

    // Convert Alaska midnight to UTC: add 9 hours
    return new Date(alaskaMidnight.getTime() + (9 * 60 * 60 * 1000));
}

/**
 * Get end of today in Alaska time (as UTC timestamp for DB query)
 */
function getAlaskaEndOfTodayUTC(): Date {
    const startOfToday = getAlaskaStartOfTodayUTC();
    return new Date(startOfToday.getTime() + (24 * 60 * 60 * 1000));
}

// Helper to determine filter date range (returns UTC timestamps)
function getFilterDateRange(range: string): { start: Date; end: Date; label: string } {
    const now = new Date(); // UTC now
    const startOfTodayUTC = getAlaskaStartOfTodayUTC();
    const endOfTodayUTC = getAlaskaEndOfTodayUTC();

    switch (range) {
        case "today":
            return {
                start: startOfTodayUTC,
                end: endOfTodayUTC,
                label: "Today"
            };
        case "yesterday": {
            const startOfYesterdayUTC = new Date(startOfTodayUTC.getTime() - 24 * 60 * 60 * 1000);
            return {
                start: startOfYesterdayUTC,
                end: startOfTodayUTC,
                label: "Yesterday"
            };
        }
        case "7days":
            return {
                start: new Date(startOfTodayUTC.getTime() - 7 * 24 * 60 * 60 * 1000),
                end: now,
                label: "Last 7 Days"
            };
        case "30days":
            return {
                start: new Date(startOfTodayUTC.getTime() - 30 * 24 * 60 * 60 * 1000),
                end: now,
                label: "Last 30 Days"
            };
        case "month": {
            // Get start of month in Alaska time, converted to UTC
            const alaskaOffsetMs = -9 * 60 * 60 * 1000;
            const alaskaTime = new Date(now.getTime() + alaskaOffsetMs);
            const alaskaStartOfMonth = new Date(
                Date.UTC(alaskaTime.getUTCFullYear(), alaskaTime.getUTCMonth(), 1, 0, 0, 0, 0)
            );
            return {
                start: new Date(alaskaStartOfMonth.getTime() + (9 * 60 * 60 * 1000)),
                end: now,
                label: "This Month"
            };
        }
        case "all":
            return {
                start: new Date(2020, 0, 1),
                end: now,
                label: "All Time"
            };
        default:
            return {
                start: new Date(startOfTodayUTC.getTime() - 30 * 24 * 60 * 60 * 1000),
                end: now,
                label: "Last 30 Days"
            };
    }
}

async function getPurchasesData(searchParams: SearchParams) {
    const startOfTodayUTC = getAlaskaStartOfTodayUTC();

    // Get filter range
    const range = searchParams.range || "30days";
    const filterRange = getFilterDateRange(range);

    // Base where clause for completed payments
    const baseWhere = { status: "COMPLETED" as const };
    const periodWhere = { ...baseWhere, createdAt: { gte: filterRange.start, lte: filterRange.end } };
    const todayWhere = { ...baseWhere, createdAt: { gte: startOfTodayUTC } };

    // 1. Get Revenue Stats - Split by payment type for proper CPA calculation
    const [
        // Period stats
        periodFrontend,
        periodOto,
        periodBump,
        periodTotal,
        // Today stats
        todayFrontend,
        todayOto,
        todayBump,
        todayTotal,
        // All time
        allTimeTotal,
        // Disputes
        disputeCount
    ] = await Promise.all([
        // Period - Frontend only (for CPA)
        prisma.payment.aggregate({
            where: { ...periodWhere, paymentType: "FRONTEND" },
            _sum: { amount: true },
            _count: true,
        }),
        // Period - OTO
        prisma.payment.aggregate({
            where: { ...periodWhere, paymentType: "OTO" },
            _sum: { amount: true },
            _count: true,
        }),
        // Period - Bump
        prisma.payment.aggregate({
            where: { ...periodWhere, paymentType: "BUMP" },
            _sum: { amount: true },
            _count: true,
        }),
        // Period - Total
        prisma.payment.aggregate({
            where: periodWhere,
            _sum: { amount: true },
            _count: true,
        }),
        // Today - Frontend
        prisma.payment.aggregate({
            where: { ...todayWhere, paymentType: "FRONTEND" },
            _sum: { amount: true },
            _count: true,
        }),
        // Today - OTO
        prisma.payment.aggregate({
            where: { ...todayWhere, paymentType: "OTO" },
            _sum: { amount: true },
            _count: true,
        }),
        // Today - Bump
        prisma.payment.aggregate({
            where: { ...todayWhere, paymentType: "BUMP" },
            _sum: { amount: true },
            _count: true,
        }),
        // Today - Total
        prisma.payment.aggregate({
            where: todayWhere,
            _sum: { amount: true },
            _count: true,
        }),
        // All time
        prisma.payment.aggregate({
            where: baseWhere,
            _sum: { amount: true },
            _count: true,
        }),
        // Disputes
        prisma.payment.count({
            where: { status: { in: ["DISPUTED", "CHARGEBACK"] } },
        }),
    ]);

    // Calculate take rates
    const frontendOrders = periodFrontend._count || 0;
    const otoCount = periodOto._count || 0;
    const bumpCount = periodBump._count || 0;

    const otoTakeRate = frontendOrders > 0 ? Math.round((otoCount / frontendOrders) * 100) : 0;
    const bumpTakeRate = frontendOrders > 0 ? Math.round((bumpCount / frontendOrders) * 100) : 0;

    // Calculate AOV (total revenue / frontend orders)
    const totalRevenue = Number(periodTotal._sum.amount || 0);
    const aov = frontendOrders > 0 ? Math.round(totalRevenue / frontendOrders) : 0;

    // Calculate Today's AOV
    const todayFrontendOrders = todayFrontend._count || 0;
    const todayTotalRevenue = Number(todayTotal._sum.amount || 0);
    const todayAov = todayFrontendOrders > 0 ? Math.round(todayTotalRevenue / todayFrontendOrders) : 0;

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
        status: "COMPLETED", // Only show completed payments in table
        ...searchFilter,
        createdAt: { gte: filterRange.start, lte: filterRange.end },
    };

    const recentPurchases = await prisma.payment.findMany({
        where: whereClause,
        take: 100,
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            amount: true,
            status: true,
            paymentType: true,
            createdAt: true,
            productName: true,
            ipAddress: true,
            transactionId: true,
            paymentMethod: true,
            currency: true,
            billingName: true,
            billingEmail: true,
            user: {
                select: { id: true, email: true, firstName: true, lastName: true },
            },
            course: {
                select: { id: true, title: true, slug: true },
            },
        },
    });

    return {
        stats: {
            period: {
                revenue: totalRevenue,
                frontendOrders: frontendOrders,
                totalOrders: periodTotal._count,
                frontendRevenue: Number(periodFrontend._sum.amount || 0),
                otoRevenue: Number(periodOto._sum.amount || 0),
                bumpRevenue: Number(periodBump._sum.amount || 0),
                label: filterRange.label,
            },
            today: {
                revenue: Number(todayTotal._sum.amount || 0),
                frontendOrders: todayFrontend._count,
                totalOrders: todayTotal._count,
                aov: todayAov,
            },
            total: {
                revenue: Number(allTimeTotal._sum.amount || 0),
                orders: allTimeTotal._count,
            },
            // New metrics for CPA calculation
            takeRates: {
                oto: otoTakeRate,
                bump: bumpTakeRate,
            },
            aov: aov,
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
    // Read-only purchases view - allow SUPPORT for viewing
    if (!session || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "SUPPORT"].includes(session.user.role as string)) {
        redirect("/login");
    }

    const params = await searchParams;
    const data = await getPurchasesData(params);

    return <PurchasesClient stats={data.stats} purchases={data.recentPurchases} timezone={data.timezone} currentRange={data.currentRange} />;
}

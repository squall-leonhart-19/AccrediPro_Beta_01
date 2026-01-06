import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PurchasesClient from "@/components/admin/purchases-client";

interface SearchParams {
    range?: string;
    search?: string;
}

// Helper to determine filter date
function getFilterDate(range: string): Date | undefined {
    const now = new Date();
    switch (range) {
        case "today":
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        case "7days":
            return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case "30days":
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case "month":
            return new Date(now.getFullYear(), now.getMonth(), 1);
        case "all":
            return undefined;
        default:
            return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Default 30 days
    }
}

async function getPurchasesData(searchParams: SearchParams) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 1. Get Revenue Stats (Always Fixed ranges)
    const [todayRevenue, weekRevenue, monthRevenue, totalRevenue] = await Promise.all([
        prisma.payment.aggregate({
            where: { createdAt: { gte: startOfToday }, status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: { createdAt: { gte: startOfWeek }, status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: { createdAt: { gte: startOfMonth }, status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
        prisma.payment.aggregate({
            where: { status: "COMPLETED" },
            _sum: { amount: true },
            _count: true,
        }),
    ]);

    // 2. Get Filtered Purchases (For Table)
    const filterDate = getFilterDate(searchParams.range || "30days");

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
        ...(filterDate ? { createdAt: { gte: filterDate } } : {}),
    };

    const recentPurchases = await prisma.payment.findMany({
        where: whereClause,
        take: 100, // Limit table to 100 most recent matching
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
            today: {
                revenue: Number(todayRevenue._sum.amount || 0),
                orders: todayRevenue._count,
            },
            week: {
                revenue: Number(weekRevenue._sum.amount || 0),
                orders: weekRevenue._count,
            },
            month: {
                revenue: Number(monthRevenue._sum.amount || 0),
                orders: monthRevenue._count,
            },
            total: {
                revenue: Number(totalRevenue._sum.amount || 0),
                orders: totalRevenue._count,
            },
            disputes: disputeCount,
        },
        recentPurchases: recentPurchases.map(p => ({
            ...p,
            amount: Number(p.amount)
        })),
    };
}

export default async function AdminPurchasesPage({ searchParams }: { searchParams: SearchParams }) {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
        redirect("/login");
    }

    const data = await getPurchasesData(searchParams);

    return <PurchasesClient stats={data.stats} purchases={data.recentPurchases} />;
}

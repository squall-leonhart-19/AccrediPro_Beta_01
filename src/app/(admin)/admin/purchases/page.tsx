import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    DollarSign,
    TrendingUp,
    ShoppingCart,
    Users,
    Calendar,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Search,
    Filter,
    Download,
    Eye,
    Shield,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function getPurchasesData() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get revenue stats
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

    // Get recent purchases
    const recentPurchases = await prisma.payment.findMany({
        take: 50,
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

    // Get status breakdown
    const statusBreakdown = await prisma.payment.groupBy({
        by: ["status"],
        _count: true,
        _sum: { amount: true },
    });

    // Get disputes/chargebacks count
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
        recentPurchases,
        statusBreakdown,
    };
}

export default async function AdminPurchasesPage() {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
        redirect("/login");
    }

    const data = await getPurchasesData();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(new Date(date));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Completed</Badge>;
            case "PENDING":
                return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Pending</Badge>;
            case "REFUNDED":
                return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Refunded</Badge>;
            case "DISPUTED":
                return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Disputed</Badge>;
            case "CHARGEBACK":
                return <Badge className="bg-red-100 text-red-700 border-red-200">Chargeback</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Purchases</h1>
                    <p className="text-gray-500 mt-1">Revenue tracking and dispute evidence</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Revenue Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Today */}
                <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">Today</p>
                                <p className="text-2xl font-bold text-emerald-900 mt-1">
                                    {formatCurrency(data.stats.today.revenue)}
                                </p>
                                <p className="text-sm text-emerald-600 mt-1">
                                    {data.stats.today.orders} orders
                                </p>
                            </div>
                            <div className="p-3 bg-emerald-500 rounded-xl">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* This Week */}
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">This Week</p>
                                <p className="text-2xl font-bold text-blue-900 mt-1">
                                    {formatCurrency(data.stats.week.revenue)}
                                </p>
                                <p className="text-sm text-blue-600 mt-1">
                                    {data.stats.week.orders} orders
                                </p>
                            </div>
                            <div className="p-3 bg-blue-500 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* This Month */}
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">This Month</p>
                                <p className="text-2xl font-bold text-purple-900 mt-1">
                                    {formatCurrency(data.stats.month.revenue)}
                                </p>
                                <p className="text-sm text-purple-600 mt-1">
                                    {data.stats.month.orders} orders
                                </p>
                            </div>
                            <div className="p-3 bg-purple-500 rounded-xl">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Disputes Alert */}
                <Card className={`bg-gradient-to-br ${data.stats.disputes > 0 ? 'from-red-50 to-red-100/50 border-red-200' : 'from-gray-50 to-gray-100/50 border-gray-200'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${data.stats.disputes > 0 ? 'text-red-600' : 'text-gray-600'}`}>Disputes</p>
                                <p className={`text-2xl font-bold mt-1 ${data.stats.disputes > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                                    {data.stats.disputes}
                                </p>
                                <p className={`text-sm mt-1 ${data.stats.disputes > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                    {data.stats.disputes > 0 ? 'Needs attention' : 'All clear'}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${data.stats.disputes > 0 ? 'bg-red-500' : 'bg-gray-400'}`}>
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Lifetime Stats */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Lifetime Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-8">
                        <div>
                            <p className="text-4xl font-bold text-gray-900">{formatCurrency(data.stats.total.revenue)}</p>
                            <p className="text-gray-500 mt-1">{data.stats.total.orders} total orders</p>
                        </div>
                        {data.stats.month.orders > 0 && (
                            <div className="flex items-center gap-2 text-emerald-600">
                                <ArrowUpRight className="w-5 h-5" />
                                <span className="font-medium">
                                    {formatCurrency(data.stats.month.revenue / data.stats.month.orders)} avg order
                                </span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Recent Purchases Table */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Recent Purchases</CardTitle>
                            <CardDescription>Click to view dispute evidence</CardDescription>
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input placeholder="Search by email..." className="pl-9 w-64" />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left">
                                    <th className="pb-3 font-medium text-gray-500">Date</th>
                                    <th className="pb-3 font-medium text-gray-500">Customer</th>
                                    <th className="pb-3 font-medium text-gray-500">Product</th>
                                    <th className="pb-3 font-medium text-gray-500">Amount</th>
                                    <th className="pb-3 font-medium text-gray-500">Status</th>
                                    <th className="pb-3 font-medium text-gray-500">Evidence</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.recentPurchases.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            No purchases yet. They will appear here once webhooks create Payment records.
                                        </td>
                                    </tr>
                                ) : (
                                    data.recentPurchases.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 text-sm text-gray-600">
                                                {formatDate(purchase.createdAt)}
                                            </td>
                                            <td className="py-4">
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {purchase.user?.firstName || ""} {purchase.user?.lastName || ""}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{purchase.user?.email || purchase.billingEmail}</p>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="text-sm text-gray-900">{purchase.productName}</p>
                                                {purchase.course && (
                                                    <p className="text-xs text-gray-500">{purchase.course.slug}</p>
                                                )}
                                            </td>
                                            <td className="py-4 font-medium text-gray-900">
                                                {formatCurrency(Number(purchase.amount))}
                                            </td>
                                            <td className="py-4">
                                                {getStatusBadge(purchase.status)}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    {purchase.ipAddress ? (
                                                        <Badge variant="outline" className="text-xs">
                                                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-500" />
                                                            IP
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs text-gray-400">
                                                            <AlertTriangle className="w-3 h-3 mr-1" />
                                                            No IP
                                                        </Badge>
                                                    )}
                                                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                                                        <Eye className="w-3 h-3 mr-1" />
                                                        View
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    DollarSign, TrendingUp, ShoppingCart, Users, Calendar,
    ArrowUpRight, ArrowDownRight, CreditCard, AlertTriangle,
    CheckCircle2, Clock, Search, Filter, Download, Eye, Shield,
    MoreHorizontal
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface Purchase {
    id: string;
    amount: number;
    status: string;
    createdAt: Date;
    productName: string;
    ipAddress?: string;
    user: {
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
    } | null;
    billingEmail?: string;
    course?: {
        id: string;
        slug: string;
    } | null;
}

interface Stats {
    today: { revenue: number; orders: number };
    week: { revenue: number; orders: number };
    month: { revenue: number; orders: number };
    total: { revenue: number; orders: number };
    disputes: number;
}

interface PurchasesClientProps {
    stats: Stats;
    purchases: Purchase[];
}

export default function PurchasesClient({ stats, purchases }: PurchasesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [dateRange, setDateRange] = useState(searchParams.get("range") || "30days");

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
        const styles = {
            COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
            PENDING: "bg-amber-100 text-amber-700 border-amber-200",
            REFUNDED: "bg-blue-100 text-blue-700 border-blue-200",
            DISPUTED: "bg-orange-100 text-orange-700 border-orange-200",
            CHARGEBACK: "bg-red-100 text-red-700 border-red-200"
        };
        return (
            <Badge className={`${styles[status as keyof typeof styles] || "bg-gray-100"} border shadow-sm`}>
                {status.charAt(0) + status.slice(1).toLowerCase()}
            </Badge>
        );
    };

    const handleFilterChange = (range: string) => {
        setDateRange(range);
        const params = new URLSearchParams(searchParams.toString());
        params.set("range", range);
        if (searchTerm) params.set("search", searchTerm);
        router.push(`/admin/purchases?${params.toString()}`);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm) params.set("search", searchTerm);
            else params.delete("search");
            router.push(`/admin/purchases?${params.toString()}`);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                        Purchases Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">Real-time revenue tracking and dispute management</p>
                </div>
                <div className="flex gap-3">
                    <Select value={dateRange} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px] bg-white border-gray-200 shadow-sm">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <SelectValue placeholder="Date Range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" className="shadow-sm border-gray-200">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Cards - Hyper Brand Style */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-white/50 backdrop-blur-sm border-emerald-100 shadow-lg shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600">Today's Revenue</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.today.revenue)}
                                </p>
                                <div className="flex items-center mt-1 text-emerald-600/80 text-xs">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {stats.today.orders} orders processed
                                </div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl shadow-lg shadow-emerald-500/20">
                                <DollarSign className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-blue-100 shadow-lg shadow-blue-500/5 hover:shadow-blue-500/10 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600">Weekly Performance</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.week.revenue)}
                                </p>
                                <div className="flex items-center mt-1 text-blue-600/80 text-xs">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    {stats.week.orders} orders this week
                                </div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
                                <ShoppingCart className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/50 backdrop-blur-sm border-purple-100 shadow-lg shadow-purple-500/5 hover:shadow-purple-500/10 transition-all duration-300">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600">Monthly Growth</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(stats.month.revenue)}
                                </p>
                                <div className="flex items-center mt-1 text-purple-600/80 text-xs">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {stats.month.orders} orders this month
                                </div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl shadow-lg shadow-purple-500/20">
                                <CreditCard className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className={`backdrop-blur-sm transition-all duration-300 ${stats.disputes > 0 ? 'bg-red-50/50 border-red-100 shadow-lg shadow-red-500/5 hover:shadow-red-500/10' : 'bg-white/50 border-gray-100 shadow-sm'}`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className={`text-sm font-medium ${stats.disputes > 0 ? 'text-red-600' : 'text-gray-500'}`}>Dispute Risk</p>
                                <p className={`text-2xl font-bold mt-1 ${stats.disputes > 0 ? 'text-red-900' : 'text-gray-900'}`}>
                                    {stats.disputes}
                                </p>
                                <div className={`flex items-center mt-1 text-xs ${stats.disputes > 0 ? 'text-red-600' : 'text-gray-500'}`}>
                                    <Shield className="w-3 h-3 mr-1" />
                                    {stats.disputes > 0 ? 'Action Required' : 'No active disputes'}
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl shadow-lg ${stats.disputes > 0 ? 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/20' : 'bg-gray-100'}`}>
                                <AlertTriangle className={`w-6 h-6 ${stats.disputes > 0 ? 'text-white' : 'text-gray-400'}`} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Area */}
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/70 backdrop-blur-md">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Recent Transactions</CardTitle>
                            <CardDescription>Monitor payments and access dispute evidence references.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by email, name..."
                                className="pl-9 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50/50">
                                <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Transaction Details</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Evidence & Audit</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {purchases.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <div className="p-4 bg-gray-100 rounded-full mb-3">
                                                    <Search className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <p className="font-medium">No transactions found</p>
                                                <p className="text-sm mt-1">Try adjusting your filters or search terms</p>
                                                <Button
                                                    variant="link"
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        handleFilterChange("all");
                                                    }}
                                                    className="mt-2 text-blue-600"
                                                >
                                                    Clear filters
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    purchases.map((purchase) => (
                                        <tr key={purchase.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{purchase.productName}</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">{formatDate(purchase.createdAt)}</span>
                                                    {purchase.course && (
                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 w-fit">
                                                            {purchase.course.slug}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {purchase.user?.firstName} {purchase.user?.lastName}
                                                    </span>
                                                    <span className="text-xs text-gray-500 font-mono">
                                                        {purchase.user?.email || purchase.billingEmail}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-bold text-gray-900">{formatCurrency(Number(purchase.amount))}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(purchase.status)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {purchase.ipAddress ? (
                                                        <div className="flex items-center text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-100" title={`IP: ${purchase.ipAddress}`}>
                                                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                                            <span className="font-mono">IP Secured</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100" title="Legacy Transaction - Using Login Fallback">
                                                            <Clock className="w-3 h-3 mr-1.5" />
                                                            <span className="">Legacy</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {purchase.user?.id ? (
                                                    <Link href={`/admin/users/${purchase.user.id}`}>
                                                        <Button variant="ghost" size="sm" className="hover:bg-blue-100 hover:text-blue-700 transition-colors">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Evidence
                                                        </Button>
                                                    </Link>
                                                ) : (
                                                    <span className="text-xs text-gray-400">No User Linked</span>
                                                )}
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

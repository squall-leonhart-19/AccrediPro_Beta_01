"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    DollarSign, TrendingUp, ShoppingCart, Calendar,
    ArrowUpRight, CreditCard, AlertTriangle,
    CheckCircle2, Clock, Search, Download, Eye, Shield,
    MoreHorizontal, RefreshCw, Copy, ExternalLink, RotateCcw, FileText
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import Link from "next/link";

interface Purchase {
    id: string;
    amount: number;
    status: string;
    paymentType?: string;
    createdAt: Date;
    productName: string;
    ipAddress?: string;
    transactionId?: string;
    paymentMethod?: string;
    currency?: string;
    billingName?: string;
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
        title?: string;
    } | null;
}

interface Stats {
    period: {
        revenue: number;
        frontendOrders: number;
        totalOrders: number;
        frontendRevenue: number;
        otoRevenue: number;
        bumpRevenue: number;
        label: string;
    };
    today: {
        revenue: number;
        frontendOrders: number;
        totalOrders: number;
        aov?: number;
    };
    total: { revenue: number; orders: number };
    takeRates: {
        oto: number;
        bump: number;
    };
    aov: number;
    disputes: number;
}

interface PurchasesClientProps {
    stats: Stats;
    purchases: Purchase[];
    timezone: string;
    currentRange: string;
}

export default function PurchasesClient({ stats, purchases, timezone, currentRange }: PurchasesClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
    const [dateRange, setDateRange] = useState(searchParams.get("range") || "30days");
    const [statusFilter, setStatusFilter] = useState("all");

    // Dialog states
    const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Copy to clipboard
    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    // Filter purchases by status
    const filteredPurchases = statusFilter === "all"
        ? purchases
        : purchases.filter(p => p.status === statusFilter);

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
            {/* Back Button & Breadcrumb */}
            <div className="flex items-center gap-4 text-sm">
                <Link href="/admin" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 transition-colors">
                    <ArrowUpRight className="w-4 h-4 rotate-[225deg]" />
                    Back to Dashboard
                </Link>
                <span className="text-gray-300">|</span>
                <span className="text-gray-400">Admin &gt; Purchases</span>
                <span className="ml-auto text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full border border-blue-100">
                    🕐 {timezone}
                </span>
            </div>

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
                            <SelectItem value="yesterday">Yesterday</SelectItem>
                            <SelectItem value="7days">Last 7 Days</SelectItem>
                            <SelectItem value="30days">Last 30 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="all">All Time</SelectItem>
                        </SelectContent>
                    </Select>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="shadow-sm border-gray-200">
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Export Purchases</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => window.open(`/api/admin/export/purchases?format=csv&range=${dateRange}`, "_blank")}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export Current View (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => window.open("/api/admin/export/purchases?format=csv&days=30", "_blank")}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Last 30 Days (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => window.open("/api/admin/export/purchases?format=csv&days=90", "_blank")}
                            >
                                <Calendar className="w-4 h-4 mr-2" />
                                Last 90 Days (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => window.open("/api/admin/export/purchases?format=csv", "_blank")}
                            >
                                <CreditCard className="w-4 h-4 mr-2" />
                                All Purchases (CSV)
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs text-gray-400">Analytics Export</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => window.open("/api/admin/export/analytics?type=revenue&format=csv", "_blank")}
                            >
                                <TrendingUp className="w-4 h-4 mr-2" />
                                Daily Revenue Report
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Stats Cards - 6 Key Metrics for CPA & Funnel Optimization */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {/* Total Revenue */}
                <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-blue-600 uppercase tracking-wide">{stats.period.label}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(stats.period.revenue)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Frontend Orders (For CPA) */}
                <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-emerald-600 uppercase tracking-wide">Frontend</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.period.frontendOrders}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Orders (CPA Base)</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Today */}
                <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-purple-600 uppercase tracking-wide">Today</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(stats.today.revenue)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{stats.today.frontendOrders} orders</p>
                        </div>
                    </CardContent>
                </Card>

                {/* OTO Take Rate */}
                <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-amber-600 uppercase tracking-wide">OTO Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.takeRates.oto}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.period.otoRevenue)} rev</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Bump Take Rate */}
                <Card className="bg-gradient-to-br from-pink-50 to-white border-pink-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-pink-600 uppercase tracking-wide">Bump Rate</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {stats.takeRates.bump}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{formatCurrency(stats.period.bumpRevenue)} rev</p>
                        </div>
                    </CardContent>
                </Card>

                {/* AOV */}
                <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-100 shadow-lg">
                    <CardContent className="pt-4 pb-4">
                        <div className="text-center">
                            <p className="text-xs font-medium text-indigo-600 uppercase tracking-wide">AOV</p>
                            <p className="text-2xl font-bold text-gray-900 mt-1">
                                {formatCurrency(stats.aov)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Avg Order Value</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Disputes Alert (if any) */}
            {stats.disputes > 0 && (
                <Card className="bg-red-50 border-red-200 shadow-lg">
                    <CardContent className="py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <p className="font-semibold text-red-900">{stats.disputes} Active Disputes</p>
                                    <p className="text-sm text-red-600">Requires immediate attention</p>
                                </div>
                            </div>
                            <Button variant="destructive" size="sm">
                                View Disputes
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Main Content Area */}
            <Card className="border-none shadow-xl shadow-gray-200/40 bg-white/70 backdrop-blur-md">
                <CardHeader className="border-b border-gray-100 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Recent Transactions</CardTitle>
                            <CardDescription>Monitor payments and access dispute evidence references.</CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[140px] bg-white border-gray-200">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                                    <SelectItem value="DISPUTED">Disputed</SelectItem>
                                    <SelectItem value="CHARGEBACK">Chargeback</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="relative w-full md:w-64">
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
                                {filteredPurchases.length === 0 ? (
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
                                                        setStatusFilter("all");
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
                                    filteredPurchases.map((purchase) => (
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
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setSelectedPurchase(purchase);
                                                                setDetailDialogOpen(true);
                                                            }}
                                                        >
                                                            <FileText className="w-4 h-4 mr-2" />
                                                            View Details
                                                        </DropdownMenuItem>
                                                        {purchase.user?.id && (
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/users?userId=${purchase.user.id}`}>
                                                                    <Eye className="w-4 h-4 mr-2" />
                                                                    View User
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        )}
                                                        {purchase.transactionId && (
                                                            <DropdownMenuItem
                                                                onClick={() => copyToClipboard(purchase.transactionId!, "Stripe ID")}
                                                            >
                                                                <Copy className="w-4 h-4 mr-2" />
                                                                Copy Stripe ID
                                                            </DropdownMenuItem>
                                                        )}
                                                        {purchase.transactionId && (
                                                            <DropdownMenuItem
                                                                onClick={() => window.open(`https://dashboard.stripe.com/payments/${purchase.transactionId}`, "_blank")}
                                                            >
                                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                                Open in Stripe
                                                            </DropdownMenuItem>
                                                        )}
                                                        {purchase.status === "COMPLETED" && (
                                                            <>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem
                                                                    onClick={() => {
                                                                        setSelectedPurchase(purchase);
                                                                        setRefundDialogOpen(true);
                                                                    }}
                                                                    className="text-red-600 focus:text-red-600"
                                                                >
                                                                    <RotateCcw className="w-4 h-4 mr-2" />
                                                                    Issue Refund
                                                                </DropdownMenuItem>
                                                            </>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Transaction Detail Dialog */}
            <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-600" />
                            Transaction Details
                        </DialogTitle>
                        <DialogDescription>
                            Full payment information and audit trail
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPurchase && (
                        <div className="space-y-4 mt-4">
                            {/* Status Badge */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Status</span>
                                {getStatusBadge(selectedPurchase.status)}
                            </div>

                            {/* Amount */}
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-500">Amount</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(selectedPurchase.amount)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {selectedPurchase.currency || "USD"} • {formatDate(selectedPurchase.createdAt)}
                                </p>
                            </div>

                            {/* Customer Info */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Customer</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Name</p>
                                        <p className="font-medium">
                                            {selectedPurchase.user?.firstName} {selectedPurchase.user?.lastName}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Email</p>
                                        <p className="font-mono text-xs">
                                            {selectedPurchase.user?.email || selectedPurchase.billingEmail || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Product</p>
                                <p className="text-sm">{selectedPurchase.productName}</p>
                                {selectedPurchase.course && (
                                    <Badge variant="outline" className="text-xs">
                                        {selectedPurchase.course.slug}
                                    </Badge>
                                )}
                            </div>

                            {/* Payment Info */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Payment Details</p>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {selectedPurchase.paymentMethod && (
                                        <div>
                                            <p className="text-gray-500">Method</p>
                                            <p className="font-medium capitalize">{selectedPurchase.paymentMethod}</p>
                                        </div>
                                    )}
                                    {selectedPurchase.transactionId && (
                                        <div>
                                            <p className="text-gray-500">Stripe ID</p>
                                            <div className="flex items-center gap-1">
                                                <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                                                    {selectedPurchase.transactionId.slice(0, 14)}...
                                                </code>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-6 w-6 p-0"
                                                    onClick={() => copyToClipboard(selectedPurchase.transactionId!, "Stripe ID")}
                                                >
                                                    <Copy className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Evidence / Audit */}
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">Evidence & Audit</p>
                                <div className="flex items-center gap-2">
                                    {selectedPurchase.ipAddress ? (
                                        <div className="flex items-center text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                                            <CheckCircle2 className="w-3 h-3 mr-1.5" />
                                            IP: {selectedPurchase.ipAddress}
                                        </div>
                                    ) : (
                                        <div className="flex items-center text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded border border-amber-100">
                                            <Clock className="w-3 h-3 mr-1.5" />
                                            No IP recorded (legacy)
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t">
                                {selectedPurchase.transactionId && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => window.open(`https://dashboard.stripe.com/payments/${selectedPurchase.transactionId}`, "_blank")}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        Open in Stripe
                                    </Button>
                                )}
                                {selectedPurchase.user?.id && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                    >
                                        <Link href={`/admin/users?userId=${selectedPurchase.user.id}`}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View User
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Refund Confirmation Dialog */}
            <AlertDialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-red-600">
                            <RotateCcw className="w-5 h-5" />
                            Issue Refund
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-3">
                            <p>
                                Are you sure you want to issue a refund for this transaction?
                            </p>
                            {selectedPurchase && (
                                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Amount</span>
                                        <span className="font-bold">{formatCurrency(selectedPurchase.amount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Customer</span>
                                        <span>{selectedPurchase.user?.email || selectedPurchase.billingEmail}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Product</span>
                                        <span>{selectedPurchase.productName}</span>
                                    </div>
                                </div>
                            )}
                            <p className="text-amber-600 text-sm">
                                Note: This will mark the payment as refunded in the database. Please process the actual refund in Stripe.
                            </p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async (e) => {
                                e.preventDefault();
                                if (!selectedPurchase) return;

                                setIsProcessing(true);
                                try {
                                    const res = await fetch(`/api/admin/purchases/${selectedPurchase.id}/refund`, {
                                        method: "POST",
                                    });

                                    if (res.ok) {
                                        toast.success("Refund processed successfully");
                                        setRefundDialogOpen(false);
                                        router.refresh();
                                    } else {
                                        const data = await res.json();
                                        toast.error(data.error || "Failed to process refund");
                                    }
                                } catch {
                                    toast.error("Failed to process refund");
                                } finally {
                                    setIsProcessing(false);
                                }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isProcessing}
                        >
                            {isProcessing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Issue Refund
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

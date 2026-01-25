"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    UserCheck,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Search,
    RefreshCw,
    Download,
    ExternalLink,
    MessageCircle,
    Trophy,
    Award,
    BarChart3,
    AlertTriangle,
    ChevronRight,
    Filter,
    Calendar,
    Clock,
    Zap,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import Link from "next/link";

// Types
interface Lead {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    category: string;
    categoryLabel: string;
    optinDate: string | null;
    completedDate: string | null;
    lessonsCompleted: number;
    progress: number;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAID" | "REFUNDED";
    hasPaid: boolean;
    revenue: number;
    hasRefund: boolean;
    lastActivity: string | null;
    daysSinceOptin: number;
    daysSinceActivity: number;
    isStuck: boolean;
    enrolledCourses: string[];
}

interface NicheStat {
    slug: string;
    name: string;
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    overallConversion: number;
    paidConversion: number;
    revenuePerLead: number;
    biggestDropoffLesson: number;
    biggestDropoffRate: number;
    dropoffPoints: { lesson: number; count: number; dropRate: number }[];
}

interface WeeklyCohort {
    weekStart: string;
    weekEnd: string;
    label: string;
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    paidConversion: number;
}

interface WeekOverWeekMetric {
    current: number;
    previous: number;
    delta: number;
    deltaPercent?: number;
}

interface WeekOverWeek {
    signups: WeekOverWeekMetric;
    startRate: WeekOverWeekMetric;
    completionRate: WeekOverWeekMetric;
    paidConversion: WeekOverWeekMetric;
    revenue: WeekOverWeekMetric;
}

interface WeeklyTrends {
    labels: string[];
    signups: number[];
    startRate: number[];
    completionRate: number[];
    paidConversion: number[];
    revenue: number[];
}

interface DashboardData {
    summary: {
        total: number;
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    funnel: {
        signups: number;
        started: number;
        completed: number;
        paid: number;
        refunded: number;
        stuck: number;
    };
    rates: {
        startRate: number;
        completionRate: number;
        overallCompletion: number;
        paidConversion: number;
        refundRate: number;
    };
    revenue: {
        total: number;
        avgPerLead: number;
        avgPerPaid: number;
    };
    nicheStats: NicheStat[];
    bestPerformers: {
        byLeads: { name: string; value: number } | null;
        byConversion: { name: string; value: number } | null;
        byRevenue: { name: string; value: number } | null;
    };
    dailySignups: { date: string; label: string; count: number }[];
    overallDropoff: { lesson: number; label: string; count: number; dropRate: number }[];
    leads: Lead[];
    categories: { value: string; label: string }[];
    weeklyCohorts: WeeklyCohort[];
    weekOverWeek: WeekOverWeek;
    weeklyTrends: WeeklyTrends;
}

const STATUS_STYLES: Record<string, string> = {
    NOT_STARTED: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-amber-100 text-amber-700",
    PAID: "bg-green-100 text-green-700",
    REFUNDED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<string, string> = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    PAID: "Paid",
    REFUNDED: "Refunded",
};

// Delta indicator component
function DeltaIndicator({ delta, suffix = "", isPercent = false }: { delta: number; suffix?: string; isPercent?: boolean }) {
    if (delta === 0) return null;
    const isPositive = delta > 0;
    return (
        <span className={`inline-flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {isPositive ? "+" : ""}{delta}{isPercent ? "%" : ""}{suffix}
        </span>
    );
}

export default function LeadsDashboard() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [dateRange, setDateRange] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    useEffect(() => {
        fetchData();
    }, [categoryFilter, dateRange]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (categoryFilter !== "all") params.set("category", categoryFilter);
            if (dateRange !== "all") params.set("range", dateRange);

            const res = await fetch(`/api/admin/leads-dashboard?${params.toString()}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort leads for the table
    const filteredLeads = useMemo(() => {
        if (!data) return [];

        return data.leads
            .filter((lead) => {
                const matchesSearch =
                    searchQuery === "" ||
                    lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    lead.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

                const matchesStatus = statusFilter === "all" || lead.status === statusFilter;

                return matchesSearch && matchesStatus;
            })
            .sort((a, b) => {
                if (sortBy === "newest") {
                    return new Date(b.optinDate || b.optinDate || "").getTime() -
                        new Date(a.optinDate || a.optinDate || "").getTime();
                }
                if (sortBy === "oldest") {
                    return new Date(a.optinDate || "").getTime() - new Date(b.optinDate || "").getTime();
                }
                if (sortBy === "progress") {
                    return b.progress - a.progress;
                }
                if (sortBy === "revenue") {
                    return b.revenue - a.revenue;
                }
                return 0;
            });
    }, [data, searchQuery, statusFilter, sortBy]);

    const exportCSV = () => {
        if (!data) return;
        const csv = [
            ["Email", "First Name", "Last Name", "Phone", "Category", "Optin Date", "Lessons", "Progress", "Status", "Revenue", "Courses"].join(","),
            ...filteredLeads.map((lead) =>
                [
                    lead.email,
                    lead.firstName,
                    lead.lastName || "",
                    lead.phone || "",
                    lead.categoryLabel,
                    lead.optinDate || "",
                    lead.lessonsCompleted,
                    `${lead.progress}%`,
                    lead.status,
                    lead.revenue > 0 ? `$${lead.revenue}` : "",
                    lead.enrolledCourses.join("; "),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-dashboard-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getRateColor = (rate: number, type: "start" | "completion" | "conversion") => {
        if (type === "start") {
            if (rate >= 60) return "text-green-600";
            if (rate >= 40) return "text-amber-600";
            return "text-red-600";
        }
        if (type === "completion") {
            if (rate >= 50) return "text-green-600";
            if (rate >= 30) return "text-amber-600";
            return "text-red-600";
        }
        // conversion
        if (rate >= 8) return "text-green-600";
        if (rate >= 4) return "text-amber-600";
        return "text-red-600";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-burgundy-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading lead intelligence...</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Failed to load dashboard data</p>
                <Button onClick={fetchData}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 -mt-6 px-6 py-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <img src="/asi-logo.png" alt="ASI" className="w-12 h-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-white">Lead Intelligence Dashboard</h1>
                            <p className="text-[#C9A227] text-sm">Mini Diploma Funnel Analytics & Performance</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" onClick={exportCSV}>
                            <Download className="w-4 h-4 mr-2" />
                            Export
                        </Button>
                        <Button className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold" onClick={fetchData}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mt-4">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                        <SelectTrigger className="w-[200px] bg-white/10 border-white/20 text-white">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Niches" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Niches</SelectItem>
                            {data.categories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Hero Stats - Revenue & Conversion Focused */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Total Revenue</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-green-700">{formatCurrency(data.revenue.total)}</p>
                                    {data.weekOverWeek && (
                                        <DeltaIndicator delta={data.weekOverWeek.revenue.deltaPercent || 0} isPercent suffix=" vs LW" />
                                    )}
                                </div>
                                <p className="text-xs text-green-600 mt-1">{data.funnel.paid} paid conversions</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                                <DollarSign className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-purple-600 font-medium">Paid Conversion</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-3xl font-bold text-purple-700">{data.rates.paidConversion}%</p>
                                    {data.weekOverWeek && (
                                        <DeltaIndicator delta={data.weekOverWeek.paidConversion.delta} suffix="pp" />
                                    )}
                                </div>
                                <p className="text-xs text-purple-600 mt-1">of {data.funnel.signups} leads</p>
                            </div>
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                                <Target className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Completion Rate</p>
                                <div className="flex items-center gap-2">
                                    <p className={`text-3xl font-bold ${getRateColor(data.rates.completionRate, "completion")}`}>
                                        {data.rates.completionRate}%
                                    </p>
                                    {data.weekOverWeek && (
                                        <DeltaIndicator delta={data.weekOverWeek.completionRate.delta} suffix="pp" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{data.funnel.completed} of {data.funnel.started} starters</p>
                            </div>
                            <GraduationCap className="w-8 h-8 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Start Rate</p>
                                <div className="flex items-center gap-2">
                                    <p className={`text-3xl font-bold ${getRateColor(data.rates.startRate, "start")}`}>
                                        {data.rates.startRate}%
                                    </p>
                                    {data.weekOverWeek && (
                                        <DeltaIndicator delta={data.weekOverWeek.startRate.delta} suffix="pp" />
                                    )}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">{data.funnel.started} of {data.funnel.signups} signups</p>
                            </div>
                            <UserCheck className="w-8 h-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-5 gap-4">
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Total Leads</p>
                        <p className="text-2xl font-bold">{data.summary.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Today</p>
                        <p className="text-2xl font-bold text-green-600">+{data.summary.today}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">This Week</p>
                        <p className="text-2xl font-bold text-blue-600">{data.summary.thisWeek}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Stuck Users</p>
                        <p className="text-2xl font-bold text-amber-600">{data.funnel.stuck}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Refund Rate</p>
                        <p className="text-2xl font-bold text-red-600">{data.rates.refundRate}%</p>
                    </CardContent>
                </Card>
            </div>

            {/* Best Performers */}
            {(data.bestPerformers.byLeads || data.bestPerformers.byConversion || data.bestPerformers.byRevenue) && (
                <div className="grid grid-cols-3 gap-4">
                    {data.bestPerformers.byLeads && (
                        <Card className="border-2 border-amber-200 bg-amber-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <Trophy className="w-8 h-8 text-amber-500" />
                                    <div>
                                        <p className="text-xs text-amber-600 font-medium uppercase">Most Leads</p>
                                        <p className="text-lg font-bold">{data.bestPerformers.byLeads.name}</p>
                                        <p className="text-sm text-gray-500">{data.bestPerformers.byLeads.value} leads</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {data.bestPerformers.byConversion && (
                        <Card className="border-2 border-green-200 bg-green-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <Award className="w-8 h-8 text-green-500" />
                                    <div>
                                        <p className="text-xs text-green-600 font-medium uppercase">Best Conversion</p>
                                        <p className="text-lg font-bold">{data.bestPerformers.byConversion.name}</p>
                                        <p className="text-sm text-gray-500">{data.bestPerformers.byConversion.value}% to paid</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                    {data.bestPerformers.byRevenue && (
                        <Card className="border-2 border-purple-200 bg-purple-50/50">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-8 h-8 text-purple-500" />
                                    <div>
                                        <p className="text-xs text-purple-600 font-medium uppercase">Top Revenue</p>
                                        <p className="text-lg font-bold">{data.bestPerformers.byRevenue.name}</p>
                                        <p className="text-sm text-gray-500">{formatCurrency(data.bestPerformers.byRevenue.value)}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Main Tabs */}
            <Tabs defaultValue="funnel" className="space-y-4">
                <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="funnel" className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Funnel
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Weekly
                    </TabsTrigger>
                    <TabsTrigger value="trends" className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Trends
                    </TabsTrigger>
                    <TabsTrigger value="niches" className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4" />
                        By Niche
                    </TabsTrigger>
                    <TabsTrigger value="leads" className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        All Leads
                    </TabsTrigger>
                    <TabsTrigger value="revenue" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Revenue
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: Funnel Overview */}
                <TabsContent value="funnel" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-burgundy-600" />
                                Conversion Funnel
                            </CardTitle>
                            <CardDescription>Lead journey from signup to paid enrollment</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Visual Funnel */}
                            <div className="space-y-4">
                                {[
                                    { label: "Signups", value: data.funnel.signups, pct: 100, color: "bg-blue-500", icon: Users },
                                    { label: "Started Lessons", value: data.funnel.started, pct: data.rates.startRate, color: "bg-purple-500", icon: Zap },
                                    { label: "Completed Mini Diploma", value: data.funnel.completed, pct: data.rates.overallCompletion, color: "bg-amber-500", icon: GraduationCap },
                                    { label: "Paid for Certification", value: data.funnel.paid, pct: data.rates.paidConversion, color: "bg-green-500", icon: DollarSign },
                                ].map((stage, i, arr) => (
                                    <div key={i}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                                <stage.icon className="w-5 h-5 text-gray-600" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-medium">{stage.label}</span>
                                                    <span className="text-sm">
                                                        <span className="font-bold">{stage.value}</span>
                                                        <span className="text-gray-400 ml-2">({stage.pct}%)</span>
                                                    </span>
                                                </div>
                                                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full ${stage.color} transition-all duration-500`}
                                                        style={{ width: `${stage.pct}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className="flex items-center ml-5 my-2">
                                                <div className="w-px h-6 bg-gray-200" />
                                                <div className="ml-6 text-xs text-gray-500">
                                                    {i === 0 && `${data.rates.startRate}% start lessons`}
                                                    {i === 1 && `${data.rates.completionRate}% of starters complete`}
                                                    {i === 2 && `${data.funnel.paid > 0 ? Math.round((data.funnel.paid / data.funnel.completed) * 100) : 0}% of completers purchase`}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Drop-off Analysis */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Lesson Drop-off Analysis
                            </CardTitle>
                            <CardDescription>Where users are leaving the mini diploma</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-9 gap-2">
                                {data.overallDropoff.map((lesson) => (
                                    <div key={lesson.lesson} className="text-center">
                                        <div
                                            className={`h-24 rounded-lg flex items-end justify-center p-2 ${
                                                lesson.dropRate > 25 ? "bg-red-100" :
                                                lesson.dropRate > 15 ? "bg-amber-100" :
                                                "bg-green-100"
                                            }`}
                                        >
                                            <div
                                                className={`w-full rounded ${
                                                    lesson.dropRate > 25 ? "bg-red-500" :
                                                    lesson.dropRate > 15 ? "bg-amber-500" :
                                                    "bg-green-500"
                                                }`}
                                                style={{ height: `${Math.max(10, lesson.dropRate * 2)}%` }}
                                            />
                                        </div>
                                        <p className="text-xs font-medium mt-2">L{lesson.lesson}</p>
                                        <p className={`text-xs ${
                                            lesson.dropRate > 25 ? "text-red-600 font-bold" :
                                            lesson.dropRate > 15 ? "text-amber-600" :
                                            "text-green-600"
                                        }`}>
                                            {lesson.dropRate}%
                                        </p>
                                        <p className="text-xs text-gray-400">{lesson.count}</p>
                                    </div>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-4 text-center">
                                Drop rate shows % of users who left after completing the previous lesson
                            </p>
                        </CardContent>
                    </Card>

                    {/* Daily Trend */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Signups (Last 14 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end h-40 gap-1">
                                {data.dailySignups.map((day, i) => {
                                    const maxCount = Math.max(...data.dailySignups.map(d => d.count), 1);
                                    const height = (day.count / maxCount) * 100;
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div
                                                className="w-full bg-burgundy-500 rounded-t hover:bg-burgundy-600 transition-colors cursor-default"
                                                style={{ height: `${Math.max(4, height)}%` }}
                                                title={`${day.label}: ${day.count} signups`}
                                            />
                                            <p className="text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                                                {day.label.split(" ")[0]}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 2: Weekly Cohorts */}
                <TabsContent value="weekly" className="space-y-6">
                    {/* Week-over-Week Summary */}
                    {data.weekOverWeek && (
                        <div className="grid grid-cols-5 gap-4">
                            <Card className={data.weekOverWeek.signups.delta >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                                <CardContent className="py-4">
                                    <p className="text-sm text-gray-500">This Week Signups</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{data.weekOverWeek.signups.current}</p>
                                        <DeltaIndicator delta={data.weekOverWeek.signups.deltaPercent || 0} isPercent />
                                    </div>
                                    <p className="text-xs text-gray-400">vs {data.weekOverWeek.signups.previous} last week</p>
                                </CardContent>
                            </Card>
                            <Card className={data.weekOverWeek.startRate.delta >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                                <CardContent className="py-4">
                                    <p className="text-sm text-gray-500">This Week Start Rate</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{data.weekOverWeek.startRate.current}%</p>
                                        <DeltaIndicator delta={data.weekOverWeek.startRate.delta} suffix="pp" />
                                    </div>
                                    <p className="text-xs text-gray-400">vs {data.weekOverWeek.startRate.previous}% last week</p>
                                </CardContent>
                            </Card>
                            <Card className={data.weekOverWeek.completionRate.delta >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                                <CardContent className="py-4">
                                    <p className="text-sm text-gray-500">This Week Completion</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{data.weekOverWeek.completionRate.current}%</p>
                                        <DeltaIndicator delta={data.weekOverWeek.completionRate.delta} suffix="pp" />
                                    </div>
                                    <p className="text-xs text-gray-400">vs {data.weekOverWeek.completionRate.previous}% last week</p>
                                </CardContent>
                            </Card>
                            <Card className={data.weekOverWeek.paidConversion.delta >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                                <CardContent className="py-4">
                                    <p className="text-sm text-gray-500">This Week Paid %</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{data.weekOverWeek.paidConversion.current}%</p>
                                        <DeltaIndicator delta={data.weekOverWeek.paidConversion.delta} suffix="pp" />
                                    </div>
                                    <p className="text-xs text-gray-400">vs {data.weekOverWeek.paidConversion.previous}% last week</p>
                                </CardContent>
                            </Card>
                            <Card className={data.weekOverWeek.revenue.delta >= 0 ? "border-green-200 bg-green-50/50" : "border-red-200 bg-red-50/50"}>
                                <CardContent className="py-4">
                                    <p className="text-sm text-gray-500">This Week Revenue</p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl font-bold">{formatCurrency(data.weekOverWeek.revenue.current)}</p>
                                        <DeltaIndicator delta={data.weekOverWeek.revenue.deltaPercent || 0} isPercent />
                                    </div>
                                    <p className="text-xs text-gray-400">vs {formatCurrency(data.weekOverWeek.revenue.previous)} last week</p>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {/* Weekly Cohort Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-burgundy-600" />
                                Weekly Cohort Performance
                            </CardTitle>
                            <CardDescription>Track optimization results week-over-week (last 12 weeks)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.weeklyCohorts && data.weeklyCohorts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Week</TableHead>
                                                <TableHead className="text-center">Signups</TableHead>
                                                <TableHead className="text-center">Started</TableHead>
                                                <TableHead className="text-center">Completed</TableHead>
                                                <TableHead className="text-center">Paid</TableHead>
                                                <TableHead className="text-center">Start %</TableHead>
                                                <TableHead className="text-center">Complete %</TableHead>
                                                <TableHead className="text-center">Paid %</TableHead>
                                                <TableHead className="text-right">Revenue</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.weeklyCohorts.map((cohort, idx) => (
                                                <TableRow
                                                    key={cohort.weekStart}
                                                    className={idx === 0 ? "bg-blue-50 font-medium" : ""}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {idx === 0 && <Badge className="bg-blue-500 text-xs">Current</Badge>}
                                                            {idx === 1 && <Badge variant="outline" className="text-xs">Last Week</Badge>}
                                                            <span className={idx === 0 ? "font-semibold" : ""}>{cohort.label}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold">{cohort.signups}</TableCell>
                                                    <TableCell className="text-center">{cohort.started}</TableCell>
                                                    <TableCell className="text-center">{cohort.completed}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={cohort.paid > 0 ? "bg-green-500" : "bg-gray-300"}>
                                                            {cohort.paid}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={getRateColor(cohort.startRate, "start")}>
                                                            {cohort.startRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={getRateColor(cohort.completionRate, "completion")}>
                                                            {cohort.completionRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={
                                                            cohort.paidConversion >= 8 ? "bg-green-500" :
                                                            cohort.paidConversion >= 4 ? "bg-amber-500" :
                                                            cohort.paidConversion > 0 ? "bg-red-500" :
                                                            "bg-gray-300"
                                                        }>
                                                            {cohort.paidConversion}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-green-600">
                                                        {formatCurrency(cohort.revenue)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No weekly cohort data available</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: Trends */}
                <TabsContent value="trends" className="space-y-6">
                    {data.weeklyTrends && (
                        <>
                            {/* Signups Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-blue-600" />
                                        Weekly Signups Trend
                                    </CardTitle>
                                    <CardDescription>Lead acquisition over the last 12 weeks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end h-48 gap-2">
                                        {data.weeklyTrends.signups.map((count, i) => {
                                            const maxCount = Math.max(...data.weeklyTrends.signups, 1);
                                            const height = (count / maxCount) * 100;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center">
                                                    <span className="text-xs text-gray-500 mb-1">{count}</span>
                                                    <div
                                                        className="w-full bg-blue-500 rounded-t hover:bg-blue-600 transition-colors cursor-default"
                                                        style={{ height: `${Math.max(8, height)}%` }}
                                                        title={`${data.weeklyTrends.labels[i]}: ${count} signups`}
                                                    />
                                                    <p className="text-[9px] text-gray-400 mt-1 truncate w-full text-center">
                                                        {data.weeklyTrends.labels[i]?.split(" - ")[0]}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Conversion Rates Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                        Conversion Rates Trend
                                    </CardTitle>
                                    <CardDescription>Start, completion, and paid rates over 12 weeks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {/* Start Rate */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-blue-600">Start Rate</span>
                                                <span className="text-sm text-gray-500">Target: 60%+</span>
                                            </div>
                                            <div className="flex items-end h-16 gap-1">
                                                {data.weeklyTrends.startRate.map((rate, i) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center">
                                                        <div
                                                            className={`w-full rounded-t ${rate >= 60 ? "bg-green-400" : rate >= 40 ? "bg-amber-400" : "bg-red-400"}`}
                                                            style={{ height: `${Math.max(10, rate)}%` }}
                                                            title={`${data.weeklyTrends.labels[i]}: ${rate}%`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Completion Rate */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-amber-600">Completion Rate</span>
                                                <span className="text-sm text-gray-500">Target: 50%+</span>
                                            </div>
                                            <div className="flex items-end h-16 gap-1">
                                                {data.weeklyTrends.completionRate.map((rate, i) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center">
                                                        <div
                                                            className={`w-full rounded-t ${rate >= 50 ? "bg-green-400" : rate >= 30 ? "bg-amber-400" : "bg-red-400"}`}
                                                            style={{ height: `${Math.max(10, rate)}%` }}
                                                            title={`${data.weeklyTrends.labels[i]}: ${rate}%`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Paid Conversion */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-green-600">Paid Conversion</span>
                                                <span className="text-sm text-gray-500">Target: 8%+</span>
                                            </div>
                                            <div className="flex items-end h-16 gap-1">
                                                {data.weeklyTrends.paidConversion.map((rate, i) => (
                                                    <div key={i} className="flex-1 flex flex-col items-center">
                                                        <div
                                                            className={`w-full rounded-t ${rate >= 8 ? "bg-green-400" : rate >= 4 ? "bg-amber-400" : "bg-red-400"}`}
                                                            style={{ height: `${Math.max(10, rate * 5)}%` }}
                                                            title={`${data.weeklyTrends.labels[i]}: ${rate}%`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Legend */}
                                    <div className="flex justify-center gap-6 mt-6 pt-4 border-t">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-green-400 rounded" />
                                            <span className="text-xs text-gray-500">Above target</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-amber-400 rounded" />
                                            <span className="text-xs text-gray-500">Near target</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 bg-red-400 rounded" />
                                            <span className="text-xs text-gray-500">Below target</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Revenue Trend */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-green-600" />
                                        Weekly Revenue Trend
                                    </CardTitle>
                                    <CardDescription>Revenue from mini diploma leads over 12 weeks</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-end h-48 gap-2">
                                        {data.weeklyTrends.revenue.map((rev, i) => {
                                            const maxRev = Math.max(...data.weeklyTrends.revenue, 1);
                                            const height = (rev / maxRev) * 100;
                                            return (
                                                <div key={i} className="flex-1 flex flex-col items-center">
                                                    <span className="text-xs text-gray-500 mb-1">
                                                        {rev > 0 ? formatCurrency(rev) : "-"}
                                                    </span>
                                                    <div
                                                        className={`w-full rounded-t transition-colors cursor-default ${
                                                            rev > 0 ? "bg-green-500 hover:bg-green-600" : "bg-gray-200"
                                                        }`}
                                                        style={{ height: `${Math.max(8, height)}%` }}
                                                        title={`${data.weeklyTrends.labels[i]}: ${formatCurrency(rev)}`}
                                                    />
                                                    <p className="text-[9px] text-gray-400 mt-1 truncate w-full text-center">
                                                        {data.weeklyTrends.labels[i]?.split(" - ")[0]}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    )}
                </TabsContent>

                {/* Tab 4: Per-Niche Performance */}
                <TabsContent value="niches">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-burgundy-600" />
                                Performance by Mini Diploma Niche
                            </CardTitle>
                            <CardDescription>Compare funnel metrics across all niches</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {data.nicheStats.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Niche</TableHead>
                                                <TableHead className="text-center">Leads</TableHead>
                                                <TableHead className="text-center">Started</TableHead>
                                                <TableHead className="text-center">Completed</TableHead>
                                                <TableHead className="text-center">Paid</TableHead>
                                                <TableHead className="text-center">Start %</TableHead>
                                                <TableHead className="text-center">Complete %</TableHead>
                                                <TableHead className="text-center">Paid %</TableHead>
                                                <TableHead className="text-right">Revenue</TableHead>
                                                <TableHead className="text-center">$/Lead</TableHead>
                                                <TableHead className="text-center">Drop</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.nicheStats.map((niche, idx) => (
                                                <TableRow
                                                    key={niche.slug}
                                                    className={idx === 0 ? "bg-amber-50" : ""}
                                                >
                                                    <TableCell>
                                                        <div className="flex items-center gap-2">
                                                            {idx === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                                                            <span className="font-medium">{niche.name}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-center font-bold">{niche.signups}</TableCell>
                                                    <TableCell className="text-center">{niche.started}</TableCell>
                                                    <TableCell className="text-center">{niche.completed}</TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className="bg-green-500">{niche.paid}</Badge>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={getRateColor(niche.startRate, "start")}>
                                                            {niche.startRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span className={getRateColor(niche.completionRate, "completion")}>
                                                            {niche.completionRate}%
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Badge className={
                                                            niche.paidConversion >= 8 ? "bg-green-500" :
                                                            niche.paidConversion >= 4 ? "bg-amber-500" :
                                                            "bg-red-500"
                                                        }>
                                                            {niche.paidConversion}%
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-green-600">
                                                        {formatCurrency(niche.revenue)}
                                                    </TableCell>
                                                    <TableCell className="text-center text-gray-600">
                                                        ${niche.revenuePerLead}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {niche.biggestDropoffLesson > 0 ? (
                                                            <span className="text-red-600 text-xs">
                                                                L{niche.biggestDropoffLesson} ({niche.biggestDropoffRate}%)
                                                            </span>
                                                        ) : "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-8">No niche data available for the selected filters</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 3: All Leads */}
                <TabsContent value="leads">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>{filteredLeads.length} Leads</CardTitle>
                                    <CardDescription>Individual lead details and status</CardDescription>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex gap-4 mt-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by email or name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                        <SelectItem value="PAID">Paid</SelectItem>
                                        <SelectItem value="REFUNDED">Refunded</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="oldest">Oldest</SelectItem>
                                        <SelectItem value="progress">Progress</SelectItem>
                                        <SelectItem value="revenue">Revenue</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Lead</TableHead>
                                            <TableHead>Niche</TableHead>
                                            <TableHead>Optin</TableHead>
                                            <TableHead>Progress</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Revenue</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredLeads.slice(0, 50).map((lead) => (
                                            <TableRow key={lead.id} className={lead.isStuck ? "bg-amber-50" : ""}>
                                                <TableCell>
                                                    <div>
                                                        <p className="font-medium">
                                                            {lead.firstName} {lead.lastName}
                                                            {lead.isStuck && (
                                                                <Clock className="inline w-3 h-3 ml-1 text-amber-500" title="Stuck - no activity in 7+ days" />
                                                            )}
                                                        </p>
                                                        <p className="text-sm text-gray-500">{lead.email}</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">{lead.categoryLabel}</Badge>
                                                </TableCell>
                                                <TableCell className="text-sm">{formatDate(lead.optinDate)}</TableCell>
                                                <TableCell>
                                                    <div className="w-24">
                                                        <div className="flex items-center gap-2">
                                                            <Progress value={lead.progress} className="h-2" />
                                                            <span className="text-xs">{lead.progress}%</span>
                                                        </div>
                                                        <p className="text-xs text-gray-400">{lead.lessonsCompleted}/9</p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className={STATUS_STYLES[lead.status]}>
                                                        {STATUS_LABELS[lead.status]}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {lead.revenue > 0 ? (
                                                        <span className="font-medium text-green-600">
                                                            {formatCurrency(lead.revenue)}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1">
                                                        <Link href={`/admin/users/${lead.id}`}>
                                                            <Button variant="ghost" size="sm" title="View Profile">
                                                                <ExternalLink className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/admin/live-chat?user=${lead.id}`}>
                                                            <Button variant="ghost" size="sm" title="Chat">
                                                                <MessageCircle className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {filteredLeads.length > 50 && (
                                    <p className="text-center text-sm text-gray-500 mt-4">
                                        Showing 50 of {filteredLeads.length} leads. Use filters to narrow down.
                                    </p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Tab 4: Revenue Attribution */}
                <TabsContent value="revenue">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                            <CardContent className="pt-6">
                                <p className="text-sm text-green-600">Total Revenue</p>
                                <p className="text-4xl font-bold text-green-700">{formatCurrency(data.revenue.total)}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-500">Revenue per Lead</p>
                                <p className="text-4xl font-bold">{formatCurrency(data.revenue.avgPerLead)}</p>
                                <p className="text-xs text-gray-400">Across all {data.funnel.signups} leads</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-500">Avg Order Value</p>
                                <p className="text-4xl font-bold">{formatCurrency(data.revenue.avgPerPaid)}</p>
                                <p className="text-xs text-gray-400">From {data.funnel.paid} paying customers</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Revenue by Niche</CardTitle>
                            <CardDescription>Which mini diplomas generate the most revenue</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.nicheStats
                                    .sort((a, b) => b.revenue - a.revenue)
                                    .map((niche, idx) => {
                                        const maxRevenue = Math.max(...data.nicheStats.map(n => n.revenue), 1);
                                        const width = (niche.revenue / maxRevenue) * 100;
                                        return (
                                            <div key={niche.slug} className="flex items-center gap-4">
                                                <div className="w-32 flex items-center gap-2">
                                                    {idx === 0 && <Trophy className="w-4 h-4 text-amber-500" />}
                                                    <span className="text-sm font-medium truncate">{niche.name}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                                        <div
                                                            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-lg flex items-center justify-end pr-3"
                                                            style={{ width: `${Math.max(10, width)}%` }}
                                                        >
                                                            {width > 30 && (
                                                                <span className="text-white text-sm font-medium">
                                                                    {formatCurrency(niche.revenue)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {width <= 30 && (
                                                    <span className="text-sm font-medium w-20">
                                                        {formatCurrency(niche.revenue)}
                                                    </span>
                                                )}
                                                <div className="w-20 text-right">
                                                    <span className="text-xs text-gray-500">
                                                        {niche.paid} sales
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

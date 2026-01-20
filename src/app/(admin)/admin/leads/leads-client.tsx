"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    UserPlus,
    Search,
    RefreshCw,
    Calendar,
    TrendingUp,
    Filter,
    Download,
    ExternalLink,
    MessageCircle,
    Trophy,
} from "lucide-react";
import Link from "next/link";

interface Lead {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    miniDiplomaCategory: string | null;
    miniDiplomaOptinAt: string | null;
    createdAt: string;
    progress: number;
    lessonCompleted: number;
    lastActivity: string | null;
    hasConvertedToPurchase: boolean;
}

interface LeadStats {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
    byCategory: { category: string; count: number }[];
    conversionRate: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    "functional-medicine": "bg-purple-100 text-purple-800",
    "womens-health": "bg-pink-100 text-pink-800",
    "gut-health": "bg-green-100 text-green-800",
    "hormone-health": "bg-amber-100 text-amber-800",
    "holistic-nutrition": "bg-emerald-100 text-emerald-800",
    "nurse-coach": "bg-blue-100 text-blue-800",
    "health-coach": "bg-cyan-100 text-cyan-800",
};

const CATEGORY_LABELS: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "womens-health": "Women's Health",
    "gut-health": "Gut Health",
    "hormone-health": "Hormone Health",
    "holistic-nutrition": "Holistic Nutrition",
    "nurse-coach": "Nurse Coach",
    "health-coach": "Health Coach",
    "unknown": "Unknown",
};

export default function LeadsClient() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<LeadStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/leads");
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads);
                setStats(data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch leads:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeads = leads
        .filter((lead) => {
            const matchesSearch =
                searchQuery === "" ||
                lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.lastName?.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || lead.miniDiplomaCategory === categoryFilter;

            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.miniDiplomaOptinAt || b.createdAt).getTime() -
                    new Date(a.miniDiplomaOptinAt || a.createdAt).getTime();
            }
            if (sortBy === "oldest") {
                return new Date(a.miniDiplomaOptinAt || a.createdAt).getTime() -
                    new Date(b.miniDiplomaOptinAt || b.createdAt).getTime();
            }
            if (sortBy === "progress") {
                return b.progress - a.progress;
            }
            return 0;
        });

    const exportLeads = () => {
        const csv = [
            ["Email", "First Name", "Last Name", "Phone", "Category", "Optin Date", "Progress", "Converted"].join(","),
            ...filteredLeads.map((lead) =>
                [
                    lead.email,
                    lead.firstName,
                    lead.lastName || "",
                    lead.phone || "",
                    lead.miniDiplomaCategory || "",
                    lead.miniDiplomaOptinAt || "",
                    `${lead.progress}%`,
                    lead.hasConvertedToPurchase ? "Yes" : "No",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `mini-diploma-leads-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const formatDate = (date: string | null) => {
        if (!date) return "N/A";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getProgressColor = (progress: number) => {
        if (progress >= 100) return "bg-green-500";
        if (progress >= 50) return "bg-amber-500";
        if (progress > 0) return "bg-blue-500";
        return "bg-gray-300";
    };

    // Find best performer
    const bestPerformer = stats?.byCategory.length ? stats.byCategory[0] : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
                    <p className="text-gray-500">Mini Diploma optins - separate from purchases</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={exportLeads}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                    </Button>
                    <Button variant="outline" onClick={fetchLeads}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Leads</p>
                                    <p className="text-3xl font-bold">{stats.total}</p>
                                </div>
                                <UserPlus className="w-8 h-8 text-burgundy-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Today</p>
                                    <p className="text-3xl font-bold text-green-600">{stats.today}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-green-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">This Week</p>
                                    <p className="text-3xl font-bold text-blue-600">{stats.thisWeek}</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-blue-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">This Month</p>
                                    <p className="text-3xl font-bold text-purple-600">{stats.thisMonth}</p>
                                </div>
                                <Calendar className="w-8 h-8 text-purple-500" />
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Conversion</p>
                                    <p className="text-3xl font-bold text-gold-600">{stats.conversionRate}%</p>
                                </div>
                                <TrendingUp className="w-8 h-8 text-gold-500" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Best Performer + Per-Category Stats */}
            {stats && stats.byCategory.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Best Performer Card */}
                    {bestPerformer && (
                        <Card className="bg-gradient-to-br from-gold-50 to-amber-50 border-gold-200">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <Trophy className="w-5 h-5 text-gold-600" />
                                    Best Performer
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Badge className={CATEGORY_COLORS[bestPerformer.category] || "bg-gray-100"}>
                                            {CATEGORY_LABELS[bestPerformer.category] || bestPerformer.category}
                                        </Badge>
                                        <p className="text-3xl font-bold mt-2">{bestPerformer.count}</p>
                                        <p className="text-sm text-gray-500">leads</p>
                                    </div>
                                    <div className="text-5xl">🏆</div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Per-Category Stats */}
                    <Card className="md:col-span-2">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Leads by Mini Diploma</CardTitle>
                            <CardDescription>Which niches are performing best</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {stats.byCategory.map((cat, index) => (
                                    <div
                                        key={cat.category}
                                        className={`p-3 rounded-lg border ${index === 0 ? "bg-gold-50 border-gold-200" : "bg-gray-50"}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <Badge variant="outline" className="text-xs">
                                                {CATEGORY_LABELS[cat.category] || cat.category}
                                            </Badge>
                                            {index === 0 && <span className="text-sm">👑</span>}
                                        </div>
                                        <p className="text-2xl font-bold">{cat.count}</p>
                                        <div className="mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${index === 0 ? "bg-gold-500" : "bg-burgundy-500"}`}
                                                style={{ width: `${(cat.count / stats.total) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {Math.round((cat.count / stats.total) * 100)}% of total
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                placeholder="Search by email, name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                            <SelectTrigger className="w-[200px]">
                                <Filter className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="functional-medicine">Functional Medicine</SelectItem>
                                <SelectItem value="womens-health">Women&apos;s Health</SelectItem>
                                <SelectItem value="gut-health">Gut Health</SelectItem>
                                <SelectItem value="hormone-health">Hormone Health</SelectItem>
                                <SelectItem value="holistic-nutrition">Holistic Nutrition</SelectItem>
                                <SelectItem value="nurse-coach">Nurse Coach</SelectItem>
                                <SelectItem value="health-coach">Health Coach</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[150px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="progress">By Progress</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Leads Table */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {filteredLeads.length} Lead{filteredLeads.length !== 1 ? "s" : ""}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center h-48">
                            <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                    ) : filteredLeads.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            No leads found matching your criteria
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Lead</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Optin Date</TableHead>
                                        <TableHead>Progress</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLeads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">
                                                        {lead.firstName} {lead.lastName}
                                                    </p>
                                                    <p className="text-sm text-gray-500">{lead.email}</p>
                                                    {lead.phone && (
                                                        <p className="text-xs text-gray-400">{lead.phone}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {lead.miniDiplomaCategory ? (
                                                    <Badge
                                                        className={
                                                            CATEGORY_COLORS[lead.miniDiplomaCategory] ||
                                                            "bg-gray-100 text-gray-800"
                                                        }
                                                    >
                                                        {CATEGORY_LABELS[lead.miniDiplomaCategory] ||
                                                            lead.miniDiplomaCategory}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{formatDate(lead.miniDiplomaOptinAt)}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-24">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full ${getProgressColor(lead.progress)}`}
                                                                style={{ width: `${lead.progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-medium">{lead.progress}%</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {lead.lessonCompleted} lesson{lead.lessonCompleted !== 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {lead.hasConvertedToPurchase ? (
                                                    <Badge className="bg-green-500">Converted 💰</Badge>
                                                ) : lead.progress >= 100 ? (
                                                    <Badge className="bg-amber-500">Completed</Badge>
                                                ) : lead.progress > 0 ? (
                                                    <Badge className="bg-blue-500">In Progress</Badge>
                                                ) : (
                                                    <Badge variant="outline">Not Started</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/users/${lead.id}`}>
                                                        <Button variant="ghost" size="sm" title="View User">
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
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

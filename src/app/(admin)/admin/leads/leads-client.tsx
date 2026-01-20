"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
    Search,
    RefreshCw,
    Download,
    ExternalLink,
    MessageCircle,
    ArrowRight,
    Users,
    Play,
    CheckCircle,
    DollarSign,
    MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    started?: number;
    completed?: number;
    converted?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "womens-health": "Women's Health",
    "gut-health": "Gut Health",
    "hormone-health": "Hormone Health",
    "holistic-nutrition": "Holistic Nutrition",
    "nurse-coach": "Nurse Coach",
    "health-coach": "Health Coach",
};

export default function LeadsClient() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [stats, setStats] = useState<LeadStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");

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

    // Calculate funnel metrics from leads
    const funnelMetrics = {
        optedIn: leads.length,
        started: leads.filter(l => l.progress > 0).length,
        completed: leads.filter(l => l.progress >= 100).length,
        converted: leads.filter(l => l.hasConvertedToPurchase).length,
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

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "not-started" && lead.progress === 0) ||
                (statusFilter === "in-progress" && lead.progress > 0 && lead.progress < 100) ||
                (statusFilter === "completed" && lead.progress >= 100 && !lead.hasConvertedToPurchase) ||
                (statusFilter === "converted" && lead.hasConvertedToPurchase);

            return matchesSearch && matchesCategory && matchesStatus;
        })
        .sort((a, b) => new Date(b.miniDiplomaOptinAt || b.createdAt).getTime() - new Date(a.miniDiplomaOptinAt || a.createdAt).getTime());

    const exportLeads = () => {
        const csv = [
            ["Email", "First Name", "Last Name", "Phone", "Category", "Optin Date", "Progress", "Status"].join(","),
            ...filteredLeads.map((lead) =>
                [
                    lead.email,
                    lead.firstName,
                    lead.lastName || "",
                    lead.phone || "",
                    lead.miniDiplomaCategory || "",
                    lead.miniDiplomaOptinAt || "",
                    `${lead.progress}%`,
                    lead.hasConvertedToPurchase ? "Converted" : lead.progress >= 100 ? "Completed" : lead.progress > 0 ? "In Progress" : "Not Started",
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
    };

    const formatDate = (date: string | null) => {
        if (!date) return "-";
        const d = new Date(date);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays}d ago`;

        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };

    const getStatusBadge = (lead: Lead) => {
        if (lead.hasConvertedToPurchase) {
            return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Converted</Badge>;
        }
        if (lead.progress >= 100) {
            return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Completed</Badge>;
        }
        if (lead.progress > 0) {
            return <Badge className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
        }
        return <Badge variant="outline" className="text-gray-500">Not Started</Badge>;
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Leads</h1>
                    <p className="text-gray-500 text-sm mt-0.5">
                        {stats?.today || 0} today • {stats?.thisWeek || 0} this week
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportLeads}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="outline" size="sm" onClick={fetchLeads}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Funnel Card - The Key Metric */}
            <Card className="bg-gradient-to-r from-slate-50 to-gray-50 border-gray-200">
                <CardContent className="p-6">
                    <h3 className="font-medium text-gray-700 mb-4">Mini Diploma Funnel</h3>
                    <div className="grid grid-cols-4 gap-4">
                        {/* Opted In */}
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-white rounded-xl border shadow-sm flex items-center justify-center mb-2">
                                <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{funnelMetrics.optedIn}</p>
                            <p className="text-xs text-gray-500">Opted In</p>
                        </div>

                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-gray-300" />
                        </div>

                        {/* Started */}
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-white rounded-xl border shadow-sm flex items-center justify-center mb-2">
                                <Play className="w-5 h-5 text-blue-600" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{funnelMetrics.started}</p>
                            <p className="text-xs text-gray-500">Started</p>
                            <p className="text-xs text-blue-600 mt-0.5">
                                {funnelMetrics.optedIn > 0 ? Math.round((funnelMetrics.started / funnelMetrics.optedIn) * 100) : 0}%
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-gray-300" />
                        </div>

                        {/* Completed */}
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-white rounded-xl border shadow-sm flex items-center justify-center mb-2">
                                <CheckCircle className="w-5 h-5 text-amber-600" />
                            </div>
                            <p className="text-2xl font-semibold text-gray-900">{funnelMetrics.completed}</p>
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-xs text-amber-600 mt-0.5">
                                {funnelMetrics.started > 0 ? Math.round((funnelMetrics.completed / funnelMetrics.started) * 100) : 0}%
                            </p>
                        </div>

                        <div className="flex items-center justify-center">
                            <ArrowRight className="w-5 h-5 text-gray-300" />
                        </div>

                        {/* Converted */}
                        <div className="text-center">
                            <div className="w-12 h-12 mx-auto bg-emerald-50 rounded-xl border border-emerald-200 shadow-sm flex items-center justify-center mb-2">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                            </div>
                            <p className="text-2xl font-semibold text-emerald-600">{funnelMetrics.converted}</p>
                            <p className="text-xs text-gray-500">Converted</p>
                            <p className="text-xs text-emerald-600 mt-0.5">
                                {funnelMetrics.completed > 0 ? Math.round((funnelMetrics.converted / funnelMetrics.completed) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Filters */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        placeholder="Search leads..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-white"
                    />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px] bg-white">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Leads List */}
            <div className="space-y-2">
                <p className="text-sm text-gray-500 px-1">{filteredLeads.length} leads</p>

                {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-16 text-gray-500">
                        <Users className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                        <p>No leads found</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 transition-all"
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-medium text-sm flex-shrink-0">
                                    {lead.firstName?.charAt(0)}{lead.lastName?.charAt(0) || ""}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">
                                        {lead.firstName} {lead.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">{lead.email}</p>
                                </div>

                                {/* Category */}
                                <div className="hidden md:block">
                                    {lead.miniDiplomaCategory && (
                                        <Badge variant="outline" className="text-xs">
                                            {CATEGORY_LABELS[lead.miniDiplomaCategory] || lead.miniDiplomaCategory}
                                        </Badge>
                                    )}
                                </div>

                                {/* Progress */}
                                <div className="hidden md:flex items-center gap-2 w-24">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${lead.progress >= 100 ? "bg-emerald-500" :
                                                    lead.progress > 0 ? "bg-blue-500" : "bg-gray-200"
                                                }`}
                                            style={{ width: `${Math.min(lead.progress, 100)}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500 w-8">{lead.progress}%</span>
                                </div>

                                {/* Status */}
                                {getStatusBadge(lead)}

                                {/* Date */}
                                <span className="text-sm text-gray-400 w-20 text-right hidden lg:block">
                                    {formatDate(lead.miniDiplomaOptinAt)}
                                </span>

                                {/* Actions */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/users/${lead.id}`}>
                                                <ExternalLink className="w-4 h-4 mr-2" />
                                                View Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={`/admin/live-chat?user=${lead.id}`}>
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Send Message
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
